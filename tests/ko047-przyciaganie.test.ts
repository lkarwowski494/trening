/*
 * KO-047 (decyzja 11.11.2026, docs/18, wariant A): faza animacji „Przyciąganie” dla wiosłowania na wyciągu (rodzina cable_row)
 * i przywodzenia nóg (Hip Adduction, Cable Hip Adduction); „Ściąganie” zostaje dla ruchów w dół i do środka (pulldown,
 * Middle Back Shrug, skłony na wyciągu górnym). EN bez zmian: „Pulling” dla obu. Przekłady nowej fazy w 33 językach — brzmienie
 * dotychczasowej „Ściąganie” (neutralne kierunkowo po poprawkach d14f8c58, recenzja w03-nazwy-33-recenzent-2026-11-11.json).
 */
import * as fs from 'fs';
import * as path from 'path';
import { DATA_UI } from '@/lib/figures/v2';
import { EN } from '@/lib/i18n.en';

const first = (family: string, key?: string): string | undefined => {
  const ui = DATA_UI[family];
  const ex = key && ui?.exceptions ? ui.exceptions[key] : undefined;
  return (ex?.names ?? ui?.names)?.first;
};

describe('KO-047 (11.11.2026): „Przyciąganie” dla wiosłowania na wyciągu i przywodzenia', () => {
  test('cable_row i przywodzenie mają pierwszą fazę „Przyciąganie”', () => {
    expect(first('cable_row')).toBe('Przyciąganie');
    expect(first('hip_abd_add', 'Hip Adduction')).toBe('Przyciąganie');
    expect(first('hip_abd_add', 'Cable Hip Adduction')).toBe('Przyciąganie');
  });
  test('ruchy w dół i do środka zostają przy „Ściąganie”', () => {
    expect(first('pulldown')).toBe('Ściąganie');
    expect(first('shrug', 'Middle Back Shrug')).toBe('Ściąganie');
    expect(first('core_standing', 'One-Arm High-Pulley Cable Side Bends')).toBe('Ściąganie');
  });
  test('EN „Pulling” dla obu faz; każdy z 33 słowników ma przekład „Przyciąganie”', () => {
    const en = EN as Record<string, string>;
    expect(en['Przyciąganie']).toBe('Pulling');
    expect(en['Ściąganie']).toBe('Pulling');
    const dir = path.join(__dirname, '../lib/locales');
    const brak = fs.readdirSync(dir).filter(f => /^[a-z]{2}(-[A-Za-z0-9]+)?\.json$/.test(f)).filter(f => {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as Record<string, string>;
      return d['Ściąganie'] !== undefined && !(typeof d['Przyciąganie'] === 'string' && d['Przyciąganie'].trim() !== '' && d['Przyciąganie'] !== 'Przyciąganie');
    });
    expect(brak).toEqual([]);
  });
});
