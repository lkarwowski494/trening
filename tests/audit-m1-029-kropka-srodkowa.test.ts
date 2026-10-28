/*
 * M1-audytor-generalny-029 (04-studio-projektowe-011, audyt M1 27.10.2026; DEC-17 a, docs/32 wzorzec 28): przegląd ciągów „A · B · C” był otwarty
 * („[OTWARTE] przegląd przy redesignie wyglądu”), a w kodzie zostały listy o zmiennej liczbie elementów sklejane „·”.
 * Reguła (20.10.2026): „·” tylko dla metadanych o stałej kolejności, czytanych jak etykiety (np. licencja · źródło); powody i listy wartości o zmiennej
 * liczbie lub kolejności elementów — przecinek, zdanie albo osobna linia.
 * Przegląd zamknięty 27.10.2026: każde użycie „·” w kodzie interfejsu (app/, components/, lib/ bez słowników) ma wpis z powodem w tests/kropka-srodkowa.json
 * (liczba wystąpień w pliku); listy zmiennej długości (powody zamiany, serie ćwiczenia, dni planu, partie mięśni, szczegóły rekordu) zmienione na przecinek.
 * Strażnik: nowe „·” bez wpisu (albo z większą liczbą) — czerwony; wpis nieaktualny (mniej wystąpień) — czerwony, wykaz tylko maleje świadomie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { reasonText } from '@/lib/swap';
import { planSummary } from '@/app/plan';
import { fresh, withDemoTemplates } from './helpers';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
/** Kod bez komentarzy (komentarze opisują ciągi, ale ich nie renderują). */
const code = (f: string) => read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
function files(dir: string): string[] {
  const out: string[] = [];
  for (const f of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${f.name}`;
    if (f.isDirectory()) { if (rel !== 'lib/locales') out.push(...files(rel)); } else if (/\.(tsx?)$/.test(f.name) && rel !== 'lib/i18n.en.ts') out.push(rel);
  }
  return out;
}
type Wykaz = { _opis: string; pliki: Record<string, { n: number; powod: string }> };
const wykaz = JSON.parse(read('tests/kropka-srodkowa.json')) as Wykaz;
const count = (f: string) => code(f).split('·').length - 1;
const src = [...files('app'), ...files('components'), ...files('lib')];

describe('strażnik „·” (docs/32 wzorzec 28, przegląd zamknięty 27.10.2026)', () => {
  test('każdy plik z „·” w kodzie ma wpis z powodem i nie więcej wystąpień niż w wykazie', () => {
    const over = src.map(f => [f, count(f)] as const).filter(([f, n]) => n > (wykaz.pliki[f]?.n ?? 0)).map(([f, n]) => `${f}: ${n} > ${wykaz.pliki[f]?.n ?? 0}`);
    expect(over).toEqual([]);
  });
  test('wykaz aktualny: liczby równe stanowi kodu, pliki istnieją, każdy powód niepusty (≥ 20 znaków)', () => {
    const stale = Object.entries(wykaz.pliki).filter(([f, e]) => !fs.existsSync(path.join(ROOT, f)) || count(f) !== e.n || e.powod.trim().length < 20).map(([f, e]) => `${f}: wykaz ${e.n}, kod ${fs.existsSync(path.join(ROOT, f)) ? count(f) : 'brak pliku'}`);
    expect(stale).toEqual([]);
  });
  test('docs/32 wzorzec 28: przegląd nie jest już „[OTWARTE]”, wskazuje strażnika', () => {
    const doc = read('docs/32-wzorce-interakcji.md'); const sec = doc.slice(doc.indexOf('### 28.'), doc.indexOf('### 29.'));
    expect(sec).not.toMatch(/\[OTWARTE\] przegląd/); expect(sec).toMatch(/audit-m1-029-kropka-srodkowa/); expect(sec).toMatch(/27\.10\.2026/);
  });
});

describe('listy o zmiennej liczbie elementów — przecinek, nie „·”', () => {
  beforeAll(async () => { await fresh(); });
  test('powody propozycji zamiany (lib/swap reasonText): „ten sam ruch, sztanga, robione 3×”', () => {
    const t = withDemoTemplates(); const exId = t[0].items[0].exerciseId;
    const s = reasonText({ exId, reasons: ['pattern', 'swapped'], sessions: 3 } as never);
    expect(s).not.toMatch(/·/); expect(s.split(', ').length).toBeGreaterThanOrEqual(3);
  });
  test('podsumowanie planu (app/plan planSummary): dni oddzielone przecinkiem', () => {
    const t = withDemoTemplates(); const s = planSummary([t[0].id, null, t[1].id, null, t[0].id, null, null]);
    expect(s).not.toMatch(/·/); expect(s.split(', ')).toHaveLength(3);
  });
});
