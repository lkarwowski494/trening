/*
 * Z-02 (przegląd treści po przekładzie, 27.10.2026): tekst UI, który podaje drogę do ekranu („Więcej → Miejsca i sprzęt”), w każdym języku
 * musi składać się z tych samych etykiet, które użytkownik widzi na zakładce i w menu. Błąd odtworzony: po zmianie źródła
 * „(Ustawienia → Miejsca i sprzęt)” → „(Więcej → Miejsca i sprzęt)” (26.10.2026) przekład w cs, hu, ro, sr, tr i pt-BR podał inne słowa niż etykiety
 * („Více” przy zakładce „Další”, „Diğer” przy „Daha Fazla”…). Dotąd strażnik cytowanych przycisków sprawdzał tylko etykiety w cudzysłowie.
 * Rodzaje (docs/20): języki, regresja.
 */
import * as fs from 'fs';
import * as path from 'path';
import { LOCALES } from '@/lib/locales';

const SOURCE: { pl: string; en: string }[] = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'lib', 'locales', '_source.json'), 'utf8'));
const KEYS = new Set(SOURCE.map((e) => e.pl));
const EN: Record<string, string> = Object.fromEntries(SOURCE.map((e) => [e.pl, e.en]));

/** Ścieżki „A → B (→ C)” w tekstach źródłowych, w których każdy człon jest osobną etykietą UI (kluczem słownika). */
const PATHS: { key: string; segs: string[] }[] = [];
for (const key of SOURCE.map((e) => e.pl)) {
  for (const m of key.matchAll(/([A-ZĄĆĘŁŃÓŚŹŻ][^()→„”:.;]*?(?: → [^()→„”:.;]+)+)/g)) {
    const segs = m[1].split('→').map((s) => s.trim());
    if (segs.length >= 2 && segs.every((s) => KEYS.has(s))) PATHS.push({ key, segs });
  }
}

const DICTS: [string, Record<string, string>][] = [['en', EN], ...(Object.entries(LOCALES) as [string, Record<string, string>][])];

describe('ścieżki do ekranów w tekstach UI = etykiety zakładek i menu w każdym języku', () => {
  test('strażnik widzi ścieżki (w tym tę z błędu Z-02)', () => {
    expect(PATHS.length).toBeGreaterThanOrEqual(5);
    expect(PATHS.some((p) => p.key === 'Miejsce trafi na listę miejsc (Więcej → Miejsca i sprzęt).')).toBe(true);
  });
  test.each(DICTS.map(([l]) => l))('%s', (l) => {
    const d = DICTS.find(([x]) => x === l)![1];
    const bad = PATHS.flatMap(({ key, segs }) => {
      const want = segs.map((s) => d[s]).join(' → ');
      return d[key].includes(want) ? [] : [`${key} — oczekiwane „${want}”, jest: ${d[key]}`];
    });
    expect(bad).toEqual([]);
  });
});
