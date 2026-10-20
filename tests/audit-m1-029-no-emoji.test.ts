/*
 * M1-audytor-generalny-029 (DEC-11): w etykietach interfejsu nie ma emoji systemowych (📍 ⏸ ⏱ 🎧 🔇 🔊 ✂ …) — zamiast nich własne ikony
 * w stylu ikon zakładek (components/Icon.tsx, kolor z motywu). Zostają znaki typograficzne (✓ ✕ ★ ✦ ▶ ▾ ▸ ⇅ ≡ ↑ ↓ …), które nie mają
 * wariantu emoji w czcionce systemowej albo są częścią składni (✓ w nagłówku kolumny).
 * Skan: kod w app/, components/, lib/ (bez komentarzy) i wszystkie słowniki (klucze i tłumaczenia).
 */
import fs from 'fs';
import path from 'path';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';

const ROOT = path.join(__dirname, '..');
const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : /\.tsx?$/.test(e.name) ? [path.join(d, e.name)] : []);
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');
/** Znaki typograficzne dozwolone (mają postać tekstową, nie emoji). */
const OK = new Set(['✓', '✕', '★', '✦', '▶', '▾', '▸', '⇅', '✔']);
const EMOJI = /[\p{Extended_Pictographic}\u{FE0F}]/gu;
const bad = (s: string) => [...s.matchAll(EMOJI)].map(m => m[0]).filter(c => !OK.has(c) && c !== '\u{FE0F}' && !/^[©®‼⁉™ℹ↔-↪]$/.test(c));
describe('brak emoji w kodzie interfejsu', () => {
  const files = ['app', 'components', 'lib'].flatMap(d => walk(path.join(ROOT, d))).filter(f => !/lib[\\/](locales|i18n\.en|licenses)/.test(f) && !/\.generated\./.test(f));
  test('żaden plik w app/, components/, lib/ nie ma emoji poza znakami typograficznymi z listy', () => {
    const found = files.flatMap(f => bad(strip(fs.readFileSync(f, 'utf8'))).map(c => `${path.relative(ROOT, f)} ${c}`));
    expect([...new Set(found)]).toEqual([]);
  });
});
describe('brak emoji w słownikach', () => {
  test('klucze i tłumaczenia EN i wszystkich języków bez emoji', () => {
    const found: string[] = [];
    for (const [k, v] of Object.entries(EN as Record<string, string>)) if (bad(k).length || bad(v).length) found.push(`en: ${k.slice(0, 40)}`);
    for (const [l, d] of Object.entries(LOCALES as Record<string, Record<string, string>>)) for (const [k, v] of Object.entries(d)) if (bad(k).length || bad(v).length) found.push(`${l}: ${k.slice(0, 40)}`);
    expect(found).toEqual([]);
  });
});
