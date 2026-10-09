// Ikona aplikacji z jednego źródła: assets/brand/icon*.svg → assets/icon*.png (1024×1024). Styl „Tuleja” (07.10.2026).
//  - icon.png — domyślna, bez przezroczystości (wymóg App Store), także ekran startowy;
//  - icon-dark.png, icon-tinted.png — warianty iOS 18+/26 (app.json ios.icon), przezroczyste tło (tło daje system);
//  - splash.png, splash-dark.png — ekran startowy (09.10.2026): sam gryf, przezroczyste tło (tło daje app.json) = pierwsza klatka animacji
//    startowej (components/Intro.tsx).
// Uruchom: node scripts/brand/icon.mjs (Playwright z Chromium; w sesji chmurowej jest zainstalowany globalnie).
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const b = await pw.chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
for (const [src, out, transparent] of [['icon.svg', 'icon.png', false], ['icon-dark.svg', 'icon-dark.png', true], ['icon-tinted.svg', 'icon-tinted.png', true], ['splash.svg', 'splash.png', true], ['splash-dark.svg', 'splash-dark.png', true]]) {
  const svg = readFileSync(new URL(`../../assets/brand/${src}`, import.meta.url), 'utf8');
  const p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  await p.setContent(`<html><body style="margin:0;background:${transparent ? 'transparent' : '#F4F3EF'}">${svg}</body></html>`);
  await p.screenshot({ path: new URL(`../../assets/${out}`, import.meta.url).pathname, omitBackground: transparent });
  await p.close(); console.log(`assets/${out} OK`);
}
await b.close();
