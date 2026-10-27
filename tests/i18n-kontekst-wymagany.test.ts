/*
 * Kontekst tłumaczeń wymagany (lekcja L-041, 26.10.2026): klucze krótkie (< 3 słowa) albo z placeholderem, których miejsce użycia jest dynamiczne (dane, listy),
 * dostają od tłumacza własne tłumaczenie bez wiedzy, CZYM są — 26 języków oddało fazę animacji „Podciąganie” nazwą ćwiczenia. Kontekst ręczny:
 * docs/lokalizacja/konteksty-reczne.json (dopisywany do docs/lokalizacja/konteksty.json przez scripts/i18n-context.mjs). Rodzaje (docs/20): dane, logika (zapadka), regresja (L-041).
 */
import * as fs from 'fs';
import * as path from 'path';
import { DATA_UI } from '@/lib/figures/v2/poseData';

const root = path.join(__dirname, '..');
const konteksty: Record<string, string> = JSON.parse(fs.readFileSync(path.join(root, 'docs/lokalizacja/konteksty.json'), 'utf8'));
const reczne: Record<string, string> = JSON.parse(fs.readFileSync(path.join(root, 'docs/lokalizacja/konteksty-reczne.json'), 'utf8'));
const source: { pl: string }[] = JSON.parse(fs.readFileSync(path.join(root, 'lib/locales/_source.json'), 'utf8'));
const klucze = new Set(source.map(s => s.pl));
/** Zapadka: liczba kluczy dynamicznych (< 3 słowa albo z placeholderem) bez kontekstu ręcznego — wariant B z L-041: 0 (27.10.2026; było 145) — każdy nowy krótki klucz dynamiczny wymaga kontekstu ręcznego. */
export const BEZ_KONTEKSTU_MAX = 0;
const wymaga = (k: string): boolean => k.split(/\s+/).length < 3 || /\{/.test(k);

describe('kontekst tłumaczeń: ręczny, wymagany dla kluczy bez wyjaśnienia w kodzie (L-041)', () => {
  test('każdy wpis ręczny dotyczy istniejącego klucza słownika i ma zdanie wyjaśniające (≥ 30 znaków); w konteksty.json stoi przed miejscem użycia', () => {
    for (const [k, v] of Object.entries(reczne)) { expect([k, klucze.has(k)]).toEqual([k, true]); expect(v.length).toBeGreaterThanOrEqual(30); expect(konteksty[k].startsWith(v)).toBe(true); }
  });
  test('nazwy faz ruchu (anim.ts PhaseName, poseData.ts DATA_UI) i linia „{faza} {n} s” mają kontekst ręczny: faza ruchu, nie nazwa ćwiczenia', () => {
    const anim = fs.readFileSync(path.join(root, 'lib/figures/v2/anim.ts'), 'utf8'); const faz = [...(/export type PhaseName = ([^;]+);/.exec(anim)![1].matchAll(/'([^']+)'/g))].map(m => m[1]).filter(f => f !== 'Pauza');
    const dane = Object.values(DATA_UI).flatMap(u => [u.names.first, u.names.second]);
    for (const f of [...faz, ...dane, '{faza} {n} s']) { expect([f, !!reczne[f]]).toEqual([f, true]); }
    expect(reczne['Podciąganie']).toMatch(/FAZY/); expect(reczne['Podciąganie']).toMatch(/NIE nazwa ćwiczenia/);
  });
  test('zapadka: klucze dynamiczne (< 3 słowa albo placeholder) bez kontekstu ręcznego nie przybywają; każdy klucz z placeholderem ma miejsce użycia albo kontekst ręczny', () => {
    const bez = Object.entries(konteksty).filter(([k, v]) => wymaga(k) && v.startsWith('dynamiczny') && !reczne[k]).map(([k]) => k);
    expect(bez.length).toBeLessThanOrEqual(BEZ_KONTEKSTU_MAX);
    for (const [k, v] of Object.entries(konteksty)) if (/\{/.test(k)) expect([k, v.startsWith('dynamiczny') && !reczne[k]]).toEqual([k, false]);
  });
});
