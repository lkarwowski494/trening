/*
 * Wymiary sprzętu figur v2 (data/zrodla/figury-sprzet.json ↔ EQUIP w lib/figures/v2/draw.ts): jedno źródło wartości (stała w module), każdy klucz EQUIP ma wpis ze statusem
 * i zgodnością, wartość w pliku = wartość w kodzie, brak wpisów-sierot. Plik jest poza paczką aplikacji (data/zrodla) — test przenosi się razem z nim.
 * Naprawy po audycie 1.0 (26.10.2026): talerze, łańcuchy i szerokość ławki wg przepisów technicznych federacji trójboju (szczebel 4); gryf — jawna konwencja.
 */
import * as fs from 'fs';
import * as path from 'path';
import { EQUIP } from '@/lib/figures/v2';

type W = { cm: number | number[]; status: string; zgodnosc: string; uzycie: string; zrodlo?: string };
const F = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sprzet.json'), 'utf8')) as { statusy: string[]; wymiary: Record<string, W> };

describe('wymiary sprzętu figur v2: data/zrodla/figury-sprzet.json ↔ EQUIP', () => {
  test('kompletność: każdy klucz EQUIP ma wpis, każdy wpis ma klucz EQUIP (bez sierot)', () => {
    expect(Object.keys(F.wymiary).sort()).toEqual(Object.keys(EQUIP).sort());
  });
  test.each(Object.keys(EQUIP))('%s: wartość w pliku = wartość w kodzie; status z listy; zgodność i użycie opisane', key => {
    const w = F.wymiary[key]; expect(w.cm).toEqual((EQUIP as Record<string, unknown>)[key]); expect(F.statusy).toContain(w.status); expect(w.zgodnosc.length).toBeGreaterThan(5); expect(w.uzycie.length).toBeGreaterThan(3);
    if (w.status === 'zgodne ze źródłem') expect(w.zrodlo!.length).toBeGreaterThan(40);
  });
  test('wymiary z przepisów: gryf, tuleje, talerze, ławka (szerokość 29–32 cm), talerze za wewnętrznymi kołnierzami (±65,5–66 cm), łańcuchy za talerzami', () => {
    expect(EQUIP.barLen).toBeLessThanOrEqual(220);                         /* długość całkowita ≤ 2,2 m */
    expect(EQUIP.sleeveR * 20).toBeGreaterThanOrEqual(50); expect(EQUIP.sleeveR * 20).toBeLessThanOrEqual(52);   /* Ø tulei 50–52 mm */
    expect(EQUIP.plateR * 2).toBeLessThanOrEqual(45); expect(EQUIP.plateW).toBeLessThanOrEqual(3);              /* Ø ≤ 45 cm; grubość ≤ 3 cm (≤ 15 kg) / ≤ 6 cm (≥ 20 kg) */
    expect(EQUIP.benchW).toBeGreaterThanOrEqual(29); expect(EQUIP.benchW).toBeLessThanOrEqual(32);
    expect([...EQUIP.plateZ]).toEqual([66, 71]); expect(EQUIP.plateZ[0] - 66).toBeGreaterThanOrEqual(0);       /* talerze zaczynają się przy kołnierzu (±66 cm) */
    expect(EQUIP.plateZ[1] - EQUIP.plateZ[0]).toBeGreaterThanOrEqual(EQUIP.plateW);                           /* talerze nie nachodzą na siebie */
    expect(EQUIP.chainZ).toBe(73); expect(EQUIP.chainZ).toBeGreaterThan(EQUIP.plateZ[1] + EQUIP.plateW / 2); /* łańcuch poza zewnętrznym talerzem */
    expect(EQUIP.plateZ[1] + EQUIP.plateW / 2).toBeLessThan(EQUIP.barLen / 2);                               /* talerze mieszczą się na gryfie */
  });
  test('gryf: promień 1,6 cm to jawna konwencja „pogrubienie dla czytelności” (norma Ø 28–29 mm = 1,4–1,45 cm), z uzasadnieniem w danych', () => {
    expect(EQUIP.barR).toBe(1.6); expect(F.wymiary.barR.status).toBe('konwencja rysunku'); expect(F.wymiary.barR.zgodnosc).toMatch(/pogrubienie dla czytelności/);
  });
  test('runtime bez nazw: moduł nie cytuje federacji ani przepisów', () => {
    const src = fs.readFileSync(path.join(__dirname, '..', 'lib/figures/v2/draw.ts'), 'utf8');
    expect(src).not.toMatch(/przepis|federacj|powerlifting|IPF/i);
  });
});
