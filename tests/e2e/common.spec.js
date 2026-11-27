// Comprobaciones comunes a CADA página HTML de cada proyecto (real y fixtures).
// Playwright no conoce el proyecto al cargar el fichero: cada prueba recorre las
// páginas de la carpeta del proyecto (testInfo.project.metadata.dir) y cada
// regla es un test.step «<url> · <regla>», así un fallo dice qué página y qué regla.
// No se comprueba el noindex (lo quita la tarea T050).
import fs from 'node:fs';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TITLE_SUFFIX = ' · Comisión de Salud · IES Río Arba';
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

function listHtml(dir, base = dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...listHtml(full, base));
    else if (entry.name.endsWith('.html')) found.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return found.sort();
}

// index.html se pide por la URL de su carpeta, con «/» final.
function toUrl(file) {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  return `/${file}`;
}

function pagesOf(testInfo) {
  const { dir } = testInfo.project.metadata;
  const pages = fs.existsSync(dir) ? listHtml(dir).map(toUrl) : [];
  expect(pages.length, `${dir} no tiene páginas .html: ejecuta antes npm run build y npm run build:fixtures`).toBeGreaterThan(0);
  return pages;
}

async function eachPage(testInfo, page, rule, check) {
  for (const url of pagesOf(testInfo)) {
    await test.step(`${url} · ${rule}`, async () => {
      await page.goto(url);
      await check(url);
    });
  }
}

test('estructura: idioma, título, encabezados y regiones', async ({ page }, testInfo) => {
  const titles = new Map();
  await eachPage(testInfo, page, 'estructura', async (url) => {
    await expect(page.locator('html'), `${url} · lang="es"`).toHaveAttribute('lang', 'es');

    const title = await page.title();
    expect(title.endsWith(TITLE_SUFFIX), `${url} · el título «${title}» debe terminar en «${TITLE_SUFFIX}»`).toBe(true);
    expect(titles.has(title), `${url} · título repetido «${title}» (también en ${titles.get(title)})`).toBe(false);
    titles.set(title, url);

    expect(await page.locator('h1').count(), `${url} · debe haber un único h1`).toBe(1);
    const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', (els) => els.map((el) => Number(el.tagName[1])));
    levels.forEach((level, i) => {
      const previous = i === 0 ? 0 : levels[i - 1];
      expect(level <= previous + 1, `${url} · salto de encabezados de h${previous} a h${level}`).toBe(true);
    });

    expect(await page.locator('header').count(), `${url} · falta header`).toBeGreaterThan(0);
    expect(await page.locator('main').count(), `${url} · debe haber un único main`).toBe(1);
    expect(await page.locator('footer').count(), `${url} · falta footer`).toBeGreaterThan(0);
    const navs = await page.$$eval('nav', (els) =>
      els.map((el) => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '').trim()),
    );
    expect(navs.length, `${url} · falta nav`).toBeGreaterThan(0);
    navs.forEach((name) => expect(name, `${url} · nav sin nombre accesible`).not.toBe(''));
  });
});

test('teclado: el primer Tab lleva a «Saltar al contenido» y funciona', async ({ page }, testInfo) => {
  await eachPage(testInfo, page, 'enlace de salto', async (url) => {
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused, `${url} · el primer Tab debe llegar a «Saltar al contenido»`).toHaveText('Saltar al contenido');
    await expect(focused).toBeVisible();
    const target = await focused.getAttribute('href');
    expect(target, `${url} · el enlace de salto debe apuntar a un ancla`).toMatch(/^#.+/);
    await page.keyboard.press('Enter');
    expect(new URL(page.url()).hash, `${url} · el salto debe cambiar el ancla`).toBe(target);
    const activeId = await page.evaluate(() => document.activeElement?.id ?? '');
    expect(`#${activeId}`, `${url} · el foco debe pasar al contenido`).toBe(target);
  });
});

test('accesibilidad: axe sin infracciones (WCAG 2.1 AA)', async ({ page }, testInfo) => {
  await eachPage(testInfo, page, 'axe', async (url) => {
    const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    const summary = results.violations.map((v) => `${v.id} (${v.nodes.length}): ${v.help}`);
    expect(summary, `${url} · infracciones de axe`).toEqual([]);
  });
});

test('privacidad: sin cookies, sin peticiones externas, sin iframe, form ni script', async ({ page, context, baseURL }, testInfo) => {
  const origin = new URL(baseURL).origin;
  const external = [];
  page.on('request', (request) => {
    const url = request.url();
    if (url.startsWith('data:')) return;
    if (new URL(url).origin !== origin) external.push(url);
  });
  await eachPage(testInfo, page, 'privacidad', async (url) => {
    external.length = 0;
    await page.reload({ waitUntil: 'networkidle' });
    expect(external, `${url} · peticiones fuera de ${origin}`).toEqual([]);
    expect(await context.cookies(), `${url} · cookies`).toEqual([]);
    for (const tag of ['iframe', 'form', 'script']) {
      expect(await page.locator(tag).count(), `${url} · no debe haber <${tag}>`).toBe(0);
    }
  });
});
