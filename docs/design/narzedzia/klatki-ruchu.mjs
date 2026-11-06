// klatki-ruchu.mjs — pasek klatek kluczowych i nagranie ruchu makiety (moduł render-i-krytyka; runda 2 ekranu startowego, 05.11.2026).
// Użycie: node klatki-ruchu.mjs <plik.html> <wyjście-bez-rozszerzenia> <ms,ms,...> [szerokość=390] [motyw=dark] [wideo-ms=0]
// Klatki: makieta czyta ?t=<ms> (R2.seek w start-1-1-r2.js) — każda klatka to ten sam zegar, więc zrzut jest powtarzalny.
// Wynik: <wyjście>.png (pasek klatek, podpis czasu pod każdą), przy wideo-ms > 0 także <wyjście>.webm (recordVideo, ekran „nowa”).
// eslint-disable-next-line import/no-unresolved -- Playwright spoza projektu (scratchpad), nie zależność aplikacji
import { chromium } from 'playwright';
import { resolve } from 'node:path';
import { renameSync, mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
const [file, out, times, w = '390', theme = 'dark', vid = '0'] = process.argv.slice(2);
const W = +w; const url = 'file://' + resolve(file);
const browser = await chromium.launch();
const shots = [];
const page = await browser.newPage({ viewport: { width: W + 40, height: 900 }, deviceScaleFactor: 1 });
for (const ms of times.split(',').map(Number)) {
  await page.goto(`${url}?t=${ms}`);
  await page.evaluate(([t, ww]) => { document.documentElement.dataset.theme = t; document.documentElement.style.setProperty('--w', ww + 'px'); document.body.style.padding = '0'; window.R2 && window.R2.render(); }, [theme, W]);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => window.R2 && window.R2.render());
  const el = page.locator('main[data-ekran="nowa"]');
  const box = await el.boundingBox();
  const buf = await page.screenshot({ clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, 844) } });
  shots.push({ ms, b64: buf.toString('base64') });
}
const strip = await browser.newPage({ viewport: { width: 200, height: 200 }, deviceScaleFactor: 1 });
await strip.setContent(`<body style="margin:0;background:#9ea4ab;font:600 15px sans-serif"><div style="display:flex;gap:12px;padding:12px">${shots.map((s) => `<figure style="margin:0"><img style="display:block;width:${W}px" src="data:image/png;base64,${s.b64}"><figcaption style="padding:6px 0">${s.ms} ms</figcaption></figure>`).join('')}</div></body>`);
await strip.screenshot({ path: out + '.png', fullPage: true });
console.log(out + '.png');
if (+vid > 0) {
  const dir = mkdtempSync(tmpdir() + '/vid-');
  const ctx = await browser.newContext({ viewport: { width: W, height: 844 }, recordVideo: { dir, size: { width: W, height: 844 } }, colorScheme: theme });
  const p = await ctx.newPage();
  await p.goto(url);
  await p.evaluate(([t]) => { document.documentElement.dataset.theme = t; document.body.style.padding = '0'; document.querySelector('.uklad').style.display = 'block';
    document.querySelectorAll('main:not([data-ekran="nowa"]), aside').forEach((e) => e.remove()); window.R2.play(); }, [theme]);
  await p.waitForTimeout(+vid);
  await ctx.close();
  const f = readdirSync(dir).find((n) => n.endsWith('.webm'));
  renameSync(dir + '/' + f, out + '.webm');
  console.log(out + '.webm');
}
await browser.close();
