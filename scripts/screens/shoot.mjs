import http from 'http'; import fs from 'fs'; import path from 'path';
// Zrzuty ekranów wersji przeglądarkowej (react-native-web) + wykrywanie tekstu poza ekranem / uciętego. Uruchom: npm run screens.
import { createRequire } from 'module'; import { execSync } from 'child_process';
const req = createRequire(import.meta.url); let pwPath; try { pwPath = req.resolve('playwright'); } catch { pwPath = path.join(execSync('npm root -g').toString().trim(), 'playwright', 'index.js'); }
const { chromium } = req(pwPath); 
const W = path.resolve('.expo/screens'); const root = path.join(W, 'dist'); const seed = JSON.parse(fs.readFileSync(path.join(W, 'seed.json'), 'utf8'));
const srv = http.createServer((q, r) => { let p = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(root, 'index.html'); r.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : p.endsWith('.html') ? 'text/html' : 'application/octet-stream' }); fs.createReadStream(p).pipe(r); }).listen(8765);
const sq = seed.exercises.find(e => e.name === 'Back Squat').id, pu = seed.exercises.find(e => e.name === 'Pull Up').id;
const routes = { home: '/', templates: '/templates', exercises: '/exercises', history: '/history', hist: '/history/' + seed.workouts[seed.workouts.length - 1].id, more: '/more', progress: '/more/progress', progEx: '/more/progress?ex=' + sq, progPU: '/more/progress?ex=' + pu, morning: '/more/morning', bands: '/more/bands', settings: '/more/settings', backup: '/more/backup', tpl: '/template/' + seed.templates[0].id, ex: '/exercise/' + pu, picker: '/picker?target=active', reorder: '/reorder?target=template:' + seed.templates[0].id, reorderActive: '/reorder?target=active' };
const sizes = { se: [320, 568], std: [375, 812], max: [430, 932] };
const out = path.join(W, 'shots'); fs.mkdirSync(out, { recursive: true }); const issues = [];
const browser = await chromium.launch({ executablePath: process.env.PW_EXE || undefined });
for (const lang of ['pl', 'en']) for (const scheme of ['dark', 'light']) for (const [sz, [w, h]] of Object.entries(sizes)) {
  if (scheme === 'light' && sz !== 'std') continue;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: scheme, deviceScaleFactor: 2, locale: lang === 'pl' ? 'pl-PL' : 'en-GB' });
  const st = JSON.parse(JSON.stringify(seed)); st.settings.language = lang;
  await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.clear(); localStorage.setItem('kv:state', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(st));
  const page = await ctx.newPage(); const errs = []; page.on('pageerror', e => errs.push(String(e))); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  for (const [name, url] of Object.entries(routes)) {
    await page.goto('http://localhost:8765' + url, { waitUntil: 'networkidle' }); await page.waitForTimeout(700);
    const found = await page.evaluate(() => {
      const W = window.innerWidth; const res = [];
      for (const el of document.querySelectorAll('div,span,input')) {
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        const txt = (el.innerText || el.value || '').trim().slice(0, 60);
        if (r.right > W + 1 && txt) res.push(['poza ekranem', Math.round(r.right - W) + 'px', txt]);
        const cs = getComputedStyle(el);
        if (el.children.length === 0 && txt && el.scrollWidth > el.clientWidth + 2 && cs.overflow !== 'visible') res.push(['ucięty tekst', el.scrollWidth + '>' + el.clientWidth, txt]);
        if (el.tagName === 'INPUT' && el.scrollWidth > el.clientWidth + 2) res.push(['ucięta wartość pola', el.scrollWidth + '>' + el.clientWidth, txt]);
      }
      const seen = new Set(); return res.filter(x => { const k = x[0] + x[2]; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 25);
    });
    await page.screenshot({ path: `${out}/${lang}-${scheme}-${sz}-${name}.png`, fullPage: true });
    for (const f of found) issues.push([lang, scheme, sz, name, ...f]);
  }
  for (const e of errs) issues.push([lang, scheme, sz, '*', 'błąd konsoli', '', e.slice(0, 160)]);
  await ctx.close();
}
await browser.close(); srv.close();
fs.writeFileSync(path.join(W, 'issues.json'), JSON.stringify(issues, null, 1));
// Poziome paski chipów przewijają się celowo — nie są błędem; reszta „poza ekranem” i „ucięte” to problemy.
const real = issues.filter(x => !(x[4] === 'poza ekranem' && /\n/.test(x[6])) && !(x[4] === 'poza ekranem' && ['picker', 'ex', 'progress', 'progEx', 'progPU'].includes(x[3]) && x[6].length < 25));
console.log(`zrzuty: ${out}; problemy: ${real.length}`); for (const r of real) console.log(' ', r.join(' | ')); process.exitCode = real.length ? 1 : 0;
