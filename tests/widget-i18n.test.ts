/* Widżet przerwy (Live Activity) we wszystkich językach (LANGS) — polecenie właściciela 06.10.2026. Pliki widżetu są GENEROWANE z jednego źródła
 * (APP_NAME + słowniki t('Przerwa') / t('Seria')); ten test porównuje je z wygenerowaną treścią. Po zmianie nazwy, języków albo tłumaczeń:
 *   UPDATE_WIDGET=1 npx jest tests/widget-i18n.test.ts
 * - targets/rest-widget/<język>.lproj/InfoPlist.strings — nazwa rozszerzenia (CFBundleDisplayName) „<nazwa aplikacji> — <przerwa>”,
 * - targets/rest-widget/RestLabels.swift — etykiety „Przerwa”/„Seria” w języku systemu, gdy aplikacja ich nie przekaże (zapas; zwykle
 *   aplikacja podaje etykietę w swoim języku w polu kind „rest|…”, lib/timer.ts). */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, APP_NAME, applyLang, t } from '@/lib/i18n';

const dir = path.join(__dirname, '..', 'targets', 'rest-widget');
const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
const labels = () => LANGS.map(l => { applyLang(l); const r = { l, rest: t('Przerwa'), set: t('Seria'), skip: t('Pomiń'), shorter: t('Skróć przerwę o 15 sekund'), longer: t('Wydłuż przerwę o 15 sekund') }; return r; }); /* 07.10.2026 wieczór: etykiety przycisków ekranu blokady */
function expected(): Record<string, string> {
  const ls = labels(); applyLang('pl'); const out: Record<string, string> = {};
  for (const x of ls) out[`${x.l}.lproj/InfoPlist.strings`] = `/* Generowane: tests/widget-i18n.test.ts (UPDATE_WIDGET=1) — nie edytuj ręcznie. */\n"CFBundleDisplayName" = "${esc(`${APP_NAME[x.l]} — ${x.rest}`)}";\n`;
  out['RestLabels.swift'] = `// Generowane: tests/widget-i18n.test.ts (UPDATE_WIDGET=1) — nie edytuj ręcznie.\n// Etykiety rodzaju odliczania w 16 językach aplikacji (zapas, gdy aplikacja nie przekaże etykiety w polu kind).\nlet restLabels: [String: (rest: String, set: String, skip: String, shorter: String, longer: String)] = [\n` +
    ls.map(x => `  "${x.l}": (rest: "${esc(x.rest)}", set: "${esc(x.set)}", skip: "${esc(x.skip)}", shorter: "${esc(x.shorter)}", longer: "${esc(x.longer)}"),`).join('\n') + `\n]\n`;
  return out;
}
test('pliki widżetu zgodne z APP_NAME i słownikami (wszystkie języki — LANGS)', () => {
  const exp = expected();
  if (process.env.UPDATE_WIDGET) for (const [f, c] of Object.entries(exp)) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.writeFileSync(path.join(dir, f), c); }
  for (const [f, c] of Object.entries(exp)) expect([f, fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8') : 'BRAK']).toEqual([f, c]);
  const lproj = fs.readdirSync(dir).filter(f => f.endsWith('.lproj')).sort(); expect(lproj).toEqual(LANGS.map(l => `${l}.lproj`).sort());
});
test('etykiety widżetu przetłumaczone (poza pl/hr/sl/sr itd. nie polskie) i nazwa = APP_NAME', () => {
  const ls = labels(); applyLang('pl');
  for (const x of ls) { if (x.l !== 'pl') expect([x.l, x.rest === 'Przerwa' || x.set === 'Seria']).toEqual([x.l, false]); expect(x.rest.length).toBeGreaterThan(0); }
  const swift = fs.readFileSync(path.join(dir, 'RestLiveActivity.swift'), 'utf8');
  expect(swift).toMatch(/restLabels\[/); expect(swift).not.toMatch(/pl \? "Przerwa" : "Rest"/);
});
