/*
 * M3 — poprawki tekstów z weryfikacji 09 (21.10.2026): 09-lokalizacja-001 (etykieta VoiceOver przerwy bez rekcji przyimka — czas w mianowniku po dwukropku),
 * -002 (nl: „Wyczyść miejsce” ≠ usunięcie miejsca), -003 (hu: rodzajnik „az” przed „Edzés…”). Rodzaje (docs/20): języki (35), regresja.
 */
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { LANGS } from '@/lib/i18n';

const REST = 'Przerwa. Pozostały czas: {t}. Cała przerwa: {all}.';
const OLD = 'Przerwa, zostało {t} z {all}.';
const others = LANGS.filter(l => l !== 'pl' && l !== 'en');

describe('09-lokalizacja-001: etykieta przerwy', () => {
  test('stary klucz (przyimek + liczebnik w mianowniku) zniknął z kodu i słowników; nowy jest w EN i w pl bez „z {all}”', () => {
    expect(EN[OLD]).toBeUndefined(); expect(EN[REST]).toBe('Rest. Time left: {t}. Total rest: {all}.');
    for (const l of others) expect([l, (LOCALES[l] as Record<string, string>)[OLD]]).toEqual([l, undefined]);
  });
  test.each(others)('%s: klucz przetłumaczony, {t} i {all} każde na końcu własnego zdania (bez przyimka przed liczbą)', l => {
    const v = (LOCALES[l] as Record<string, string>)[REST]; expect(typeof v).toBe('string');
    expect(v).toMatch(/\{t\}\s*[.。]/); expect(v).toMatch(/\{all\}\s*[.。]\s*$/); expect(v.indexOf('{t}')).toBeLessThan(v.indexOf('{all}'));
    expect(v).not.toBe(REST); /* nie zostawiony po polsku */
  });
});

describe('09-lokalizacja-002: „Wyczyść miejsce” ≠ „Usuń miejsce”', () => {
  test.each(others)('%s: przycisk panelu dnia brzmi inaczej niż przycisk i pytanie usuwania miejsca', l => {
    const d = LOCALES[l] as Record<string, string>; expect(d['Wyczyść miejsce']).not.toBe(d['Usuń miejsce']); expect(d['Wyczyść miejsce']).not.toBe(d['Usunąć miejsce?'].replace(/\?$/, ''));
  });
  test('nl: „Locatie wissen” (także z zakresem dat)', () => {
    const d = LOCALES.nl as Record<string, string>; expect(d['Wyczyść miejsce']).toBe('Locatie wissen'); expect(d['Wyczyść miejsce: {a} – {b}']).toBe('Locatie wissen: {a} – {b}');
  });
});

describe('09-lokalizacja-003: hu — rodzajnik przed „Edzés”', () => {
  test('zdanie Przewodnika o pauzie ma „az „Edzés szüneteltetése”” (samogłoska), nie „a”', () => {
    const k = Object.keys(LOCALES.hu as Record<string, string>).find(x => x.startsWith('Menu ⋯ w nagłówku: „Pauza treningu”'))!; const v = (LOCALES.hu as Record<string, string>)[k];
    expect(v).toContain('az „Edzés szüneteltetése”'); expect(v).not.toContain('a „Edzés szüneteltetése”');
  });
});
