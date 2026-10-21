/*
 * M1-audytor-generalny-049: treść krytyczna (zdanie medyczne, asekuracja, wskazówki techniki) w 34 językach nie miała zapisanej kontroli ani zapisu, że drugiego
 * przeglądu wskazówek nie było. Test: (1) tabela „Treść krytyczna” w docs/16 jest generowana z danych (UPDATE_CRITICAL=1 przepisuje) — drift pada;
 * (2) kontrola automatyczna: każdy z 34 języków ma przetłumaczone zdanie medyczne i trzy klucze asekuracji oraz komplet zdań wskazówek;
 * (3) ryzyko R-010 w rejestrze docs/40 z warunkiem zamknięcia i blokadą wydania w App Store (nie TestFlight).
 * Drugiego przeglądu tłumaczeń ten test nie zastępuje — to osobne zadanie (tłumacz / native speaker).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const MEDICAL = 'Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.';
const SAFETY = [
  'Asekuracja',
  'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.',
  'bez asekuracji w stojakach',
];
/** Języki, w których w docs/16 zapisano niezależną recenzję drugim agentem po tłumaczeniu: 14 języków (proces 05.10.2026) i 10 języków wariantu B (proces 07.10.2026). */
const REVIEWED_0510: readonly Lang[] = ['cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'sr', 'lt', 'lv', 'et', 'uk', 'es', 'pt'];
const REVIEWED_0710: readonly Lang[] = ['de', 'fr', 'it', 'nl', 'sv', 'da', 'nb', 'fi', 'tr', 'el'];
const START = '<!-- gen:krytyczne -->'; const END = '<!-- /gen:krytyczne -->';
const TARGETS = LANGS.filter((l) => l !== 'pl');

const cueFile = (l: string): Record<string, string> => JSON.parse(read(`lib/cues/text/${l}.json`));
/** Warianty regionalne (es-419, pt-BR) to nakładki na es/pt — jak w lib/cues/index.ts. */
const cues = (l: string): Record<string, string> => (l === 'es-419' ? { ...cueFile('es'), ...cueFile(l) } : l === 'pt-BR' ? { ...cueFile('pt'), ...cueFile(l) } : cueFile(l));
const plCueIds = Object.keys(cues('pl'));
const dict = (l: Lang): Record<string, string> => (l === 'en' ? (EN as Record<string, string>) : (LOCALES[l] as Record<string, string>));
const present = (l: Lang, k: string) => { const v = dict(l)[k]; return typeof v === 'string' && v.trim() !== '' && v !== k && (l === 'en' || v !== (EN as Record<string, string>)[k] || /^[A-Za-z .,'-]+$/.test(k)); };

function row(l: Lang): string {
  const med = present(l, MEDICAL) ? 'tak' : 'BRAK';
  const saf = SAFETY.every((k) => present(l, k)) ? 'tak' : 'BRAK';
  const c = cues(l); const have = plCueIds.filter((id) => typeof c[id] === 'string' && c[id].trim() !== '').length;
  return `| ${l} | ${med} | ${saf} | ${have}/${plCueIds.length} | ${REVIEWED_0510.includes(l) ? 'tak (05.10.2026)' : REVIEWED_0710.includes(l) ? 'tak (07.10.2026)' : 'brak zapisu'} | niewykonany |`;
}
const table = () => ['| kod | zdanie medyczne | asekuracja (3 klucze) | wskazówki techniki (zdania) | recenzja drugim agentem po tłumaczeniu | drugi przegląd wskazówek (native speaker) |', '|---|---|---|---|---|---|', ...TARGETS.map(row)].join('\n');

describe('docs/16: kontrola treści krytycznej w 34 językach', () => {
  test('jest 34 języków docelowych (LANGS bez pl)', () => { expect(TARGETS).toHaveLength(34); });
  test('kontrola automatyczna: zdanie medyczne, asekuracja i komplet zdań wskazówek w każdym języku', () => {
    const r = TARGETS.map(row);
    expect(r.filter((x) => x.includes('BRAK'))).toEqual([]);
    for (const l of TARGETS) { const m = /\| (\d+)\/(\d+) \|/.exec(row(l))!; expect(m[1]).toBe(m[2]); }
  });
  test('tabela w docs/16 zgodna z danymi (UPDATE_CRITICAL=1 przepisuje)', () => {
    const f = path.join(ROOT, 'docs/16-jezyki-i-marka.md'); const d = fs.readFileSync(f, 'utf8');
    const a = d.indexOf(START); const b = d.indexOf(END);
    if (process.env.UPDATE_CRITICAL === '1' && a >= 0 && b > a) { fs.writeFileSync(f, d.slice(0, a + START.length) + '\n' + table() + '\n' + d.slice(b)); return; }
    expect(a).toBeGreaterThan(-1); expect(b).toBeGreaterThan(a);
    expect(d.slice(a + START.length, b).trim()).toBe(table());
  });
  test('docs/16 zapisuje stan formy zwracania się (fr, tr) jako otwarty i brak drugiego przeglądu', () => {
    const d = read('docs/16-jezyki-i-marka.md'); const a = d.indexOf('## Treść krytyczna');
    expect(a).toBeGreaterThan(-1); const s = d.slice(a);
    expect(s).toMatch(/fr[^\n]*tr[^\n]*OTWARTE|OTWARTE[^\n]*fr[^\n]*tr/); expect(s).toMatch(/drugi przegląd[^\n]*niewykonany|niewykonany[^\n]*drugi przegląd/i);
  });
});

describe('docs/40: ryzyko R-010 (treść krytyczna bez drugiego przeglądu)', () => {
  const d = read('docs/40-lekcje.md'); const line = d.split('\n').find((l) => l.startsWith('| R-010 |')) ?? '';
  test('wiersz R-010 w rejestrze ryzyk z warunkiem zamknięcia', () => {
    expect(line).not.toBe('');
    expect(line).toMatch(/M1-049/); expect(line).toMatch(/drugi przegląd/i); expect(line).toMatch(/fr/); expect(line).toMatch(/tr/);
    expect(line.split('|').length).toBeGreaterThanOrEqual(5);
  });
  test('blokuje wydanie w App Store, nie TestFlight', () => {
    expect(line).toMatch(/blokuje[^|]*App Store/i); expect(line).toMatch(/nie[^|]*TestFlight/i); expect(line).toMatch(/otwarte/i);
  });
});
