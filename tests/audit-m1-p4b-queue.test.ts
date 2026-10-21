/*
 * Partia 4 (programista B): decyzje z kolejki koordynatora przeniesione do docs/18 i lekcja L-009 do docs/40 — bez duplikatów, z numeracją lekcji malejącą (najnowsza na górze).
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const d18 = read('docs/18-przekazanie.md'); const d40 = read('docs/40-lekcje.md');

describe('docs/18 i docs/40 po przeniesieniu kolejki', () => {
  test('decyzje z 20.10.2026 są w docs/18 dokładnie raz', () => {
    for (const k of ['zgoda z góry na partie 2–4', 'nowy LOK-07', 'domyślny system miar nowej instalacji', 'etykiety presetów sprzętu', 'końcowy reaudyt po M2', 'M3 Redesigner przed 1.0', 'oszczędzanie limitu tygodniowego', 'zaplanowane zadania konta']) expect(d18.split(k).length - 1).toBe(1);
    expect(d18.split('cena roczna = 6,99 USD/rok').length - 1).toBe(1);
  });
  test('docs/18 nie zawiera zadań innych projektów ani nazw prywatnych zadań', () => { expect(d18).not.toMatch(/NaviStories: poranne|„Pogoda”/); });
  test('docs/40: L-009 raz, nad L-008; numeracja lekcji ciągła i malejąca', () => {
    expect(d40.split('## L-009').length - 1).toBe(1);
    const ids = [...d40.matchAll(/^## L-(\d{3}) /gm)].map((m) => Number(m[1]));
    expect(ids).toEqual([...ids].sort((a, b) => b - a)); expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe(ids.length); /* L-001…L-N bez luk */
  });
  /* L-016 (decyzja właściciela 21.10.2026): na gałęzi lekcja ma nagłówek „## L-NNN”, numer nadaje koordynator przy scalaniu
     (scripts/numeruj-lekcje.mjs). Nienumerowane lekcje stoją nad numerowanymi; na main (push do main w tests.yml) — zakazane. */
  test('docs/40: lekcje „## L-NNN” tylko na gałęziach, nad numerowanymi', () => {
    const naglowki = [...d40.matchAll(/^## L-(\d{3}|NNN) /gm)].map((m) => m[1]);
    const ostatniaRobocza = naglowki.lastIndexOf('NNN');
    expect(naglowki.slice(0, ostatniaRobocza + 1).every((n) => n === 'NNN')).toBe(true);
    if (process.env.GITHUB_REF_NAME === 'main') expect(ostatniaRobocza).toBe(-1);
  });
});
