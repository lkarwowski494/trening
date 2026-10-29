/* Układ podpisów na ramkach zrzutów App Store (scripts/ci/store-caption-layout.mjs, store-frames.sh). Przegląd ramek przebiegu 40942847798 (29.10.2026): rozmiar czcionki
 * różny w obrębie języka, pojedyncze słowo w trzecim wierszu (np. de/01 „Uhr”, es/04 „semana”), japoński cięty w środku słowa („アカウン / ト”) i przed małą kaną („フ / ォルダ”),
 * chiński wiersz zaczynający się od „、”. Pomiar tekstu w teście zastępczy (szerokość ∝ liczbie znaków, CJK ×2) — ImageMagick tylko w CI. */
import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
const mod = path.join(root, 'scripts/ci/store-caption-layout.mjs');
const run = (code: string) => {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', `import * as L from ${JSON.stringify(mod)}; ${code}`], { encoding: 'utf8', cwd: root });
  if (r.status !== 0) throw new Error(r.stderr);
  return JSON.parse(r.stdout);
};
/* 100 pt: znak łaciński 55 px, CJK/hangul 100 px; wiersz 120 px. */
const FAKE = `const measure = t => { const ls = t.split('\\n'); const w = l => [...l].reduce((s, c) => s + (/[\\u3000-\\u9fff\\uac00-\\ud7af\\uff00-\\uffef]/.test(c) ? 100 : 55), 0); return { w: Math.max(...ls.map(w)), h: 120 * ls.length }; };`;
const caps = JSON.parse(fs.readFileSync(path.join(root, 'store/screenshot-captions.json'), 'utf8')).podpisy as Record<string, Record<string, string>>;
const NO_LINE_START = /^[、。，．,.!?！？:：;；)）\]」』…・ーァィゥェォッャュョヮ]/u;

describe('podpisy ramek: łamanie wierszy i rozmiar czcionki (29.10.2026)', () => {
  test('japoński: słowa całe, cząstki i interpunkcja przy poprzednim słowie; chiński: przecinek „、” nie zaczyna słowa', () => {
    const ja = run(`console.log(JSON.stringify(L.tokens('ja', '全履歴をアカウントも広告もなしで').map(t => t.w)))`);
    expect(ja).toContain('アカウントも');
    for (const w of ja) expect(w).not.toMatch(/^[をもで]/u);
    expect(run(`console.log(JSON.stringify(L.tokens('ja', 'テンプレートをフォルダで整理').map(t => t.w)))`)).toContain('フォルダで');
    for (const w of run(`console.log(JSON.stringify(L.tokens('zh-Hant', '完整紀錄，免帳號、無廣告').map(t => t.w)))`)) expect(w).not.toMatch(NO_LINE_START);
    expect(run(`console.log(JSON.stringify(L.tokens('de', 'Deine Vorlagen in Ordnern').map(t => t.w)))`)).toEqual(['Deine', 'Vorlagen', 'in', 'Ordnern']);
  });
  test('każdy język sklepu: jeden rozmiar dla wszystkich podpisów, najwyżej 2 wiersze, żaden wiersz nie zaczyna się od interpunkcji ani małej kany, tekst bez zmian', () => {
    for (const lang of Object.keys(caps)) {
      const p = run(`${FAKE} const c = ${JSON.stringify(caps[lang])}; console.log(JSON.stringify(L.plan(${JSON.stringify(lang)}, c, 1135, 430, measure)))`);
      expect({ lang, ok: Number.isInteger(p.pointsize) && p.pointsize > 0 }).toEqual({ lang, ok: true });
      for (const [k, t] of Object.entries(p.podpisy as Record<string, string>)) {
        const lines = t.split('\n');
        expect({ lang, k, lines: lines.length <= 2 }).toEqual({ lang, k, lines: true });
        for (const l of lines) expect({ lang, k, l, start: NO_LINE_START.test(l) }).toEqual({ lang, k, l, start: false });
        if (lines.length === 2) expect({ lang, k, l: lines[0], jednaLitera: / \p{L}$/u.test(lines[0]) }).toEqual({ lang, k, l: lines[0], jednaLitera: false }); /* cs/03 „a”, hr/02 „i” */
        expect(t.replace(/\s+/g, '')).toBe(caps[lang][k].replace(/\s+/g, '')); /* tekst bez zmian */
        for (const l of lines) expect({ lang, k, l, wTekscie: caps[lang][k].includes(l) }).toEqual({ lang, k, l, wTekscie: true }); /* spacje w wierszu zachowane */
      }
    }
  });
  test('dwa wiersze — najrówniejszy podział, a po przecinku, gdy się mieści (bez pojedynczego słowa w drugim wierszu)', () => {
    const p = run(`${FAKE} console.log(JSON.stringify(L.plan('de', { a: 'Sätze schnell eintragen, auch an der Uhr', b: 'Woche und Monat an einem Ort' }, 1135, 430, measure)))`);
    expect(p.podpisy.a).toBe('Sätze schnell eintragen,\nauch an der Uhr');
    expect(p.podpisy.b.split('\n').every((l: string) => l.split(' ').length >= 2)).toBe(true);
  });
  test('store-frames.sh rysuje podpis ze stałym rozmiarem języka (label + pointsize z planu), nie samodopasowującym się caption:', () => {
    const sh = fs.readFileSync(path.join(root, 'scripts/ci/store-frames.sh'), 'utf8');
    expect(sh).toContain('scripts/ci/store-caption-layout.mjs');
    expect(sh).toMatch(/-pointsize "\$PT" label:"\$text"/);
    expect(sh).not.toMatch(/caption:"\$text"/);
  });
});
