/*
 * Figury v2 — pokrycie rodzin mobility_stand, mobility_floor, foam_roll, neck (27.10.2026; docs/53 bramka 5 „kompletność”, decyzja właściciela 27.10.2026):
 * animacja tylko tam, gdzie reguły sensu mają przeczytane źródło; pozostałe ćwiczenia to jawne wyjątki bez animacji z powodem (data/zrodla/figury-wyjatki.json).
 * Rodzaje (docs/20): dane i macierz — każde z 74 ćwiczeń ma DOKŁADNIE jedno: pozę w poses/<rodzina>.json albo wyjątek z powodem; poza ma regułę sensu ze źródłem (nie samą „poza nieruchomą”);
 * niezmienniki — pozy statyczne to dwie identyczne klatki, ruchowa (Cat-Cow) ma klatki różne; regresja — wyjątki nie wracają po cichu do listy „do zrobienia”.
 */
import fs from 'node:fs';
import path from 'node:path';
import { CATALOG } from '@/lib/catalog.generated';
import { assignAll, familyOf } from '@/lib/figures/v2';

const ROOT = path.resolve(__dirname, '..');
const RODZINY = ['mobility_stand', 'mobility_floor', 'foam_roll', 'neck'] as const;
const ILE = { mobility_stand: 36, mobility_floor: 22, foam_roll: 10, neck: 5 } as const;
const ALL = assignAll();
const czytaj = <T,>(p: string): T => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8')) as T;
const W = czytaj<{ rodziny: Record<string, string>; cwiczenia: Record<string, string> }>('data/zrodla/figury-wyjatki.json');
const SENS = czytaj<{ rodziny: Record<string, { reguly: Record<string, { zrodlo: string; pewnosc: string }>; warianty: Record<string, string[]> }> }>('data/zrodla/figury-sens.json').rodziny;
const pozy = (r: string): Record<string, { klatki: { u: number }[] }> => {
  const p = path.join(ROOT, `lib/figures/v2/poses/${r}.json`);
  return fs.existsSync(p) ? czytaj<{ cwiczenia: Record<string, { klatki: { u: number }[] }> }>(`lib/figures/v2/poses/${r}.json`).cwiczenia : {};
};
const cwiczenia = (r: string): string[] => Object.keys(CATALOG).filter((k) => ALL[k] === r);
const wyjatek = (r: string, k: string): string | undefined => W.cwiczenia[k] ?? W.rodziny[r];

describe('pokrycie rodzin mobilności, rolowania i szyi: poza albo wyjątek z powodem', () => {
  test.each(RODZINY)('%s: liczność znana, a każde ćwiczenie ma pozę XOR wyjątek (z powodem ≥ 40 znaków)', (r) => {
    const lista = cwiczenia(r); expect(lista.length).toBe(ILE[r]);
    const p = pozy(r);
    for (const k of lista) { const maPoze = k in p; const maWyj = wyjatek(r, k) !== undefined; expect([k, maPoze !== maWyj]).toEqual([k, true]); if (maWyj) expect((wyjatek(r, k) ?? '').length).toBeGreaterThan(40); }
    for (const k of Object.keys(p)) expect(lista).toContain(k); /* poza bez ćwiczenia w rodzinie = pomyłka */
  });
  test('liczba póz i wyjątków na rodzinę (zmiana = świadoma decyzja)', () => {
    const wynik = Object.fromEntries(RODZINY.map((r) => [r, [Object.keys(pozy(r)).length, cwiczenia(r).length - Object.keys(pozy(r)).length]]));
    expect(wynik).toEqual({ mobility_stand: [8, 28], mobility_floor: [9, 13], foam_roll: [0, 10], neck: [0, 5] });
  });
  test('każda poza ma regułę sensu z przeczytanym źródłem inną niż sama „poza nieruchoma” (bez pozycji ze źródła nie rysujemy) i nie opiera się na samej analogii ani konwencji', () => {
    for (const r of ['mobility_stand', 'mobility_floor'] as const) for (const k of Object.keys(pozy(r))) {
      const reguly = (SENS[r].warianty[k] ?? []).filter((id) => id !== 'poza_nieruchoma');
      expect([k, reguly.length > 0]).toEqual([k, true]);
      expect([k, reguly.some((id) => /ustalone|jedno źródło/.test(SENS[r].reguly[id].pewnosc) && !/^analogia$|^konwencja$/.test(SENS[r].reguly[id].pewnosc))]).toEqual([k, true]);
    }
  });
  test('pozy statyczne: dwie identyczne klatki (u = 0 i 1); ruchowa (Cat-Cow) ma więcej klatek', () => {
    const ruchowe = ['Cat-Cow'];
    for (const r of ['mobility_stand', 'mobility_floor'] as const) for (const [k, poza] of Object.entries(pozy(r))) {
      expect([k, poza.klatki[0].u, poza.klatki[poza.klatki.length - 1].u]).toEqual([k, 0, 1]);
      if (ruchowe.includes(k)) expect(poza.klatki.length).toBeGreaterThan(2);
      else { expect([k, poza.klatki.length]).toEqual([k, 2]); expect(JSON.stringify({ ...poza.klatki[0], u: 0 })).toBe(JSON.stringify({ ...poza.klatki[1], u: 0 })); }
    }
  });
  test('rolowanie i szyja: całe rodziny to wyjątki (wpis rodzinny), mobilność: wyjątki imiennie istnieją w katalogu', () => {
    expect(Object.keys(W.rodziny)).toEqual(expect.arrayContaining(['foam_roll', 'neck']));
    for (const k of Object.keys(W.cwiczenia)) expect([k, k in CATALOG]).toEqual([k, true]);
  });
  test('Wrist Roller (ćwiczenie siłowe przedramion) nie wpada do rolowania: reguła nazwy foam_roll go nie łapie, trafia do forearm z wyjątkiem z powodem; rolowanie to tylko -SMR i „foam roll”', () => {
    expect(familyOf('Wrist Roller')).toBe('forearm'); expect(ALL['Wrist Roller']).toBe('forearm');
    expect(cwiczenia('foam_roll')).not.toContain('Wrist Roller');
    for (const k of cwiczenia('foam_roll')) expect([k, /-smr|foam roll/i.test(k)]).toEqual([k, true]);
    expect((W.cwiczenia['Wrist Roller'] ?? '').length).toBeGreaterThan(40);
  });
});
