/*
 * Wymiary sprzętu figur v2 (data/zrodla/figury-sprzet.json; docs/53 bramka 6 „spójność”, docs/54): każdy klucz EQUIP (lib/figures/v2/draw.ts) ma wpis ze statusem
 * i powodem, wartość w pliku = wartość w kodzie (jedno miejsce), brak wpisów-sierot. Plik jest poza paczką aplikacji (data/zrodla) — test przenosi się razem z nim.
 */
import * as fs from 'fs';
import * as path from 'path';
import { EQUIP, CABLE_Y } from '@/lib/figures/v2';

const F = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data/zrodla/figury-sprzet.json'), 'utf8')) as { statusy: string[]; wysokosci_bloczkow: { status: string; low: number[]; mid: number[]; high: number[] }; wymiary: Record<string, { cm: number | number[]; status: string; zgodnosc: string; uzycie: string }> };

describe('wymiary sprzętu figur v2: data/zrodla/figury-sprzet.json ↔ EQUIP', () => {
  test('kompletność: każdy klucz EQUIP ma wpis, każdy wpis ma klucz EQUIP (bez sierot)', () => {
    expect(Object.keys(F.wymiary).sort()).toEqual(Object.keys(EQUIP).sort());
  });
  test.each(Object.keys(EQUIP))('%s: wartość w pliku = wartość w kodzie; status z listy; zgodność i użycie opisane', key => {
    const w = F.wymiary[key]; expect(w.cm).toEqual((EQUIP as Record<string, unknown>)[key]); expect(F.statusy).toContain(w.status); expect(w.zgodnosc.length).toBeGreaterThan(5); expect(w.uzycie.length).toBeGreaterThan(3);
  });
  test('wszystkie wymiary to „konwencja rysunku” (źródła szczebla 4 otwarte — nie twierdzimy zgodności z normą)', () => {
    expect(F.statusy).toEqual(['konwencja rysunku']); for (const w of Object.values(F.wymiary)) expect(w.status).toBe('konwencja rysunku');
  });
  test('wysokości bloczków wyciągu (CABLE_Y w gear.ts) = wartości w pliku; status „konwencja rysunku”', () => {
    expect(F.wysokosci_bloczkow.status).toBe('konwencja rysunku'); expect({ low: [...CABLE_Y.low], mid: [...CABLE_Y.mid], high: [...CABLE_Y.high] }).toEqual({ low: F.wysokosci_bloczkow.low, mid: F.wysokosci_bloczkow.mid, high: F.wysokosci_bloczkow.high });
  });
});
