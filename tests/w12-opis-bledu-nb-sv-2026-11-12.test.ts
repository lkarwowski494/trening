/*
 * W-12 (przegląd treści krytycznej po przekładzie, 12.11.2026; recenzent-lokalizacji g3): opis błędu techniki (`*.mis.*`, sekcja „Czego unikać”)
 * nie może brzmieć jak polecenie wykonania błędu (lekcja z R-010: lv, opis błędu zapisany jako polecenie).
 * nb „Svai i korsryggen…” = tryb rozkazujący „svai!”; sv „Kör reps med fart…” — „kör” to ta sama forma w czasie teraźniejszym i w trybie rozkazującym.
 * Opis błędu w nb zaczyna się wtedy od „Å …”, w sv od „Att …” (jak 37/39 pozostałych opisów w tych plikach).
 */
import * as fs from 'fs';
import * as path from 'path';

const cues = (l: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib/cues/text', `${l}.json`), 'utf8'));

describe('W-12 12.11.2026: opis błędu (nb, sv) nie jest poleceniem', () => {
  test('nb rollout.mis.arch opisuje błąd bezokolicznikiem „Å …”', () => {
    expect(cues('nb')['rollout.mis.arch']).toMatch(/^Å svaie i korsryggen/);
  });
  test('sv core_floor.mis.momentum opisuje błąd bezokolicznikiem „Att …”', () => {
    expect(cues('sv')['core_floor.mis.momentum']).toMatch(/^Att köra reps/);
  });
  /* Czasowniki sv z tematem na -r mają jednakową formę teraźniejszą i rozkazującą — na początku opisu błędu są dwuznaczne. */
  test('sv: żaden opis błędu nie zaczyna się od dwuznacznego „Kör/Gör/Hör/Rör/Bär/Lär”', () => {
    const bad = Object.entries(cues('sv')).filter(([k, v]) => /\.mis\./.test(k) && /^(Kör|Gör|Hör|Rör|Bär|Lär) /.test(v)).map(([k]) => k);
    expect(bad).toEqual([]);
  });
});
