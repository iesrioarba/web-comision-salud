// Pruebas en navegador (solo Chromium). Un proyecto «real» que sirve _site/ y
// uno por cada carpeta de tests/fixtures/ que sirve _site-fixtures/<nombre>/.
// Cada proyecto tiene su servidor estático (scripts/serve-static.js) en un
// puerto fijo propio, en 127.0.0.1. La carpeta va en `metadata.dir`.
import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const BASE_PORT = 4170;
const fixtures = fs
  .readdirSync('tests/fixtures', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

const sites = [
  { name: 'real', dir: '_site' },
  ...fixtures.map((name) => ({ name, dir: `_site-fixtures/${name}` })),
].map((site, index) => ({ ...site, port: BASE_PORT + index }));

export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: 'list',
  projects: sites.map((site) => ({
    name: site.name,
    use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${site.port}` },
    metadata: { dir: site.dir, port: site.port },
  })),
  webServer: sites.map((site) => ({
    command: `node scripts/serve-static.js ${site.dir} ${site.port}`,
    port: site.port,
    reuseExistingServer: false,
  })),
});
