/*
 * Średnie uwagi przeglądu API 31.10.2026 (przebieg 41220388812) dla kluczy UI: decyzje tłumacza (docs/lokalizacja/srednie-2026-10-31/decyzje-A.json, decyzje-B.json)
 * po recenzji lokalizacji (recenzja.md, wynik-recenzji.json). Rodzaje (docs/20): dane (każda przyjęta decyzja jest w słowniku UI), regresja
 * (odłożone i odrzucone przez recenzenta nie wróciły; wersja recenzenta zamiast tłumacza: nl „levenslang”, da „færdig”).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import type { Lang } from '@/lib/i18n';

type Poz = { jezyk: string; klucz: string; decyzja: 'nanies' | 'odrzuc'; nowe?: string; powod: string };
const D = path.join(__dirname, '../docs/lokalizacja/srednie-2026-10-31');
const czytaj = (f: string) => JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
const poz: Poz[] = [...czytaj('decyzje-A.json').pozycje, ...czytaj('decyzje-B.json').pozycje];
const wynik = czytaj('wynik-recenzji.json') as { odrzucone_lub_odlozone: { jezyk: string; klucz: string; powod: string }[]; wersja_recenzenta: { jezyk: string; klucz: string; wartosc?: string; zawiera?: string }[] };
const pominiete = new Set(wynik.odrzucone_lub_odlozone.map(o => `${o.jezyk}|${o.klucz}`));
const recenzent = new Set(wynik.wersja_recenzenta.map(o => `${o.jezyk}|${o.klucz}`));
const tekst = (kod: string, k: string) => (kod === 'en' ? (EN as Record<string, string>)[k] : (LOCALES[kod as Lang] as Record<string, string>)[k]);

describe('31.10.2026: średnie uwagi API dla kluczy UI — decyzje po recenzji', () => {
  test('zestaw decyzji: 88 pozycji, każda z powodem; odłożone mają powód', () => {
    expect(poz.length).toBe(88);
    for (const p of poz) expect([p.jezyk, p.klucz, p.powod.length > 3]).toEqual([p.jezyk, p.klucz, true]);
    for (const o of wynik.odrzucone_lub_odlozone) expect(o.powod.length).toBeGreaterThan(10);
  });
  test('każda przyjęta decyzja („nanies”, poza odłożonymi i wersją recenzenta) jest w słowniku UI', () => {
    const bad = poz.filter(p => p.decyzja === 'nanies' && !pominiete.has(`${p.jezyk}|${p.klucz}`) && !recenzent.has(`${p.jezyk}|${p.klucz}`))
      .filter(p => tekst(p.jezyk, p.klucz) !== p.nowe).map(p => `${p.jezyk}: ${p.klucz.slice(0, 50)}`);
    expect(bad).toEqual([]);
  });
  test('odłożone/odrzucone przez recenzenta: propozycja tłumacza nie została naniesiona', () => {
    const bad = poz.filter(p => p.decyzja === 'nanies' && pominiete.has(`${p.jezyk}|${p.klucz}`) && tekst(p.jezyk, p.klucz) === p.nowe).map(p => `${p.jezyk}: ${p.klucz}`);
    expect(bad).toEqual([]);
  });
  test('wersja recenzenta: nl bez „levenslang”, da „udkørt” zamiast „færdig”', () => {
    for (const w of wynik.wersja_recenzenta) {
      const v = tekst(w.jezyk, w.klucz);
      if (w.wartosc) expect(v).toBe(w.wartosc);
      if (w.zawiera) expect(v).toContain(w.zawiera);
    }
    expect(tekst('nl', 'Masz plan: dożywotni')).not.toMatch(/levenslang/i);
  });
});
