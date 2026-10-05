// Ikona aplikacji z jednego źródła: assets/brand/icon.svg → assets/icon.png (1024×1024, bez przezroczystości — wymóg App Store).
// Uruchom: node scripts/brand/icon.mjs (Playwright z Chromium; w sesji chmurowej jest zainstalowany globalnie).
import { createRequire } from 'module';
import { readFileSync } from 'fs';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); }
const svg = readFileSync(new URL('../../assets/brand/icon.svg', import.meta.url), 'utf8');
const b = await pw.chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
const p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
await p.setContent(`<html><body style="margin:0;background:#1E1F22">${svg}</body></html>`);
await p.screenshot({ path: new URL('../../assets/icon.png', import.meta.url).pathname, omitBackground: false });
await b.close(); console.log('assets/icon.png OK');
