// skanuje: tests
/*
 * Pokrycie regresji MER2-07 „podpisy kart × języki” po podziale na grupy (06.11.2026, lekcja L-110; kod: tests/podpisy-jezyki-shared.tsx).
 * Sprawdza: (1) pliki grup audit-k1-bl-mer-podpisy1…N istnieją i wywołują własną grupę; (2) suma języków grup = wszystkie LANGS (z pl), każdy dokładnie raz,
 * grupy równe co do liczby języków (różnica ≤ 1); (3) test.each w starym pliku audit-k1-bl-mer.test.tsx nie wrócił (render kart w jednym procesie).
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { LANGS } from '@/lib/i18n';
import { PODPISY_GRUPY, langsOfGroup } from './podpisy-jezyki-shared';

describe('podpisy kart × języki: pokrycie po podziale na grupy', () => {
  test('pliki grup 1…N istnieją i wywołują własną grupę', () => {
    const files = readdirSync(__dirname).filter(f => /^audit-k1-bl-mer-podpisy\d+\.test\.tsx$/.test(f)).sort();
    expect(files).toEqual(Array.from({ length: PODPISY_GRUPY }, (_, i) => `audit-k1-bl-mer-podpisy${i + 1}.test.tsx`));
    files.forEach((f, i) => expect(readFileSync(join(__dirname, f), 'utf8')).toContain(`definePodpisyGroup(${i + 1});`));
  });
  test('suma języków grup = wszystkie LANGS, każdy dokładnie raz; grupy równe (różnica ≤ 1)', () => {
    const grupy = Array.from({ length: PODPISY_GRUPY }, (_, i) => langsOfGroup(i + 1));
    const all = grupy.flat();
    expect([...all].sort()).toEqual([...LANGS].sort());
    expect(new Set(all).size).toBe(LANGS.length);
    const rozmiary = grupy.map(g => g.length);
    expect(Math.min(...rozmiary)).toBeGreaterThan(0);
    expect(Math.max(...rozmiary) - Math.min(...rozmiary)).toBeLessThanOrEqual(1);
  });
  test('stary plik nie renderuje kart wszystkich ćwiczeń w jednym procesie (test.each(LANGS) nie wrócił)', () => {
    expect(readFileSync(join(__dirname, 'audit-k1-bl-mer.test.tsx'), 'utf8')).not.toMatch(/test\.each\(LANGS\)/);
  });
});
