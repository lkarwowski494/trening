// karta-nazwy-zrzuty.mjs — użycie: node karta-nazwy-zrzuty.mjs <karta-nazwy.html> <katalog-wyjścia>
// Każdy <main data-ekran> osobno, w pełnej rozdzielczości (3×, jak iPhone); szerokość i motyw z atrybutów ekranu (data-w, data-th).
// Dodatkowo skala szarości dla ekranów pl-390 i pl-320-dluga (czy hierarchia działa bez koloru).
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { resolve, join } from 'node:path';
import { mkdirSync } from 'node:fs';
const req = createRequire(import.meta.url);
let pw; try { pw = req.resolve('playwright'); } catch { pw = join(execSync('npm root -g').toString().trim(), 'playwright', 'index.js'); }
const { chromium } = req(pw);
const [file, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 3 });
await page.goto('file://' + resolve(file)); await page.evaluate(() => document.fonts.ready);
const loaded = await page.evaluate(() => [...document.fonts].filter((x) => x.status === 'loaded').map((x) => x.family.replace(/["']/g, '')));
for (const f of ['Barlow Condensed', 'Tresc']) if (!loaded.includes(f)) { console.error('BRAK KROJU: ' + f); process.exit(1); }
for (const el of await page.locator('[data-ekran]').all()) {
  const n = await el.getAttribute('data-ekran');
  await el.screenshot({ path: `${out}/${n}.png` }); console.log(`${out}/${n}.png`);
  if (/-(pl-390|pl-320-dluga)$/.test(n)) {
    await el.evaluate((e) => { e.style.filter = 'grayscale(1)'; }); await el.screenshot({ path: `${out}/${n}-szarosc.png` }); await el.evaluate((e) => { e.style.filter = ''; });
  }
}
await b.close();
