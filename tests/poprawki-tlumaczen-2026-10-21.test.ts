/*
 * Poprawki brzmień z przeglądu badacza (docs/research/przeglad-badacza-2026-10-21.md, 21.10.2026):
 * (1) zdanie o asekuracji: NSCA 2017 (Standard 3.2) mówi o sprzęcie ORAZ osobie asekurującej, nie „albo”;
 * (2) maszyna Smitha nie jest wolnym ciężarem — żadne ćwiczenie z zaleceniem `rack.safeties` nie jest wykonywane na maszynie Smitha;
 * (3) zdanie R1: ACSM 2026 mówi „za mało dowodów”, nie „brak dowodów”.
 * Czerwone przed zmianą słowników: stare klucze w EN i w 33 słownikach, brak nowych.
 */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG } from '@/lib/catalog.generated';
import { LANGS, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const OLD_NOTE = 'Ćwiczenie ze sztangą nad ciałem lub na barkach: ustaw w stojakach ramiona asekuracyjne tak, aby dało się bezpiecznie odłożyć sztangę, albo ćwicz z osobą asekurującą.';
const NOTE = 'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.';
const NOTE_EN = 'Barbell exercise with the bar on the trunk or over the head and face: safety equipment is recommended — a rack with safety arms, plus a spotter.';
const R1_START = 'Każda główna partia co najmniej {n} dni w tygodniu';
const R1_PHRASE = 'ale za mało dowodów, by stwierdzić zależność dawka–odpowiedź, a przy równej objętości różnica słabnie';
const R1_PHRASE_EN = 'but there is not enough evidence to establish a dose-response relationship, and with equal volume the difference shrinks';
const TARGETS = LANGS.filter((l): l is Lang => l !== 'pl' && l !== 'en');
const dict = (l: Lang) => LOCALES[l] as Record<string, string>;
const r1Key = Object.keys(EN).find((k) => k.startsWith(R1_START))!;
const src = JSON.parse(read('lib/locales/_source.json')) as { pl: string; en: string }[];

describe('asekuracja: brzmienie z przeglądu badacza (sprzęt oraz osoba asekurująca)', () => {
  test('EN: nowy klucz z brzmieniem z raportu; stary klucz usunięty', () => {
    expect(EN[NOTE]).toBe(NOTE_EN); expect(EN[OLD_NOTE]).toBeUndefined();
    expect(EN[NOTE]).toContain('plus a spotter'); expect(NOTE).not.toMatch(/\balbo\b/); expect(NOTE).toMatch(/oraz osoba asekurująca/);
  });
  test('_source.json: nowy klucz z tym samym EN, bez starego', () => {
    expect(src.filter((r) => r.pl === NOTE).map((r) => r.en)).toEqual([NOTE_EN]); expect(src.some((r) => r.pl === OLD_NOTE)).toBe(false);
  });
  test('ekran używa nowego klucza przez t()', () => {
    expect(read('components/ExerciseCues.tsx')).toContain(`t('${NOTE}')`); expect(read('components/ExerciseCues.tsx')).not.toContain(OLD_NOTE);
  });
  test.each(TARGETS)('%s: przetłumaczone (nie PL, nie EN), stary klucz usunięty ze słownika', (l) => {
    const d = dict(l);
    if (l === 'pt-BR' || l === 'es-419') { expect(d[OLD_NOTE]).toBeUndefined(); return; } /* nakładka na pt / es — dziedziczy */
    expect(typeof d[NOTE]).toBe('string'); expect(d[NOTE]).not.toBe(NOTE); expect(d[NOTE]).not.toBe(NOTE_EN); expect(d[NOTE].trim().length).toBeGreaterThan(30);
    expect(d[OLD_NOTE]).toBeUndefined();
  });
  test('wersje regionalne dziedziczą nowe brzmienie z pt i es', () => {
    expect(dict('pt-BR')[NOTE] ?? dict('pt')[NOTE]).toBe(dict('pt')[NOTE]); expect(dict('es-419')[NOTE] ?? dict('es')[NOTE]).toBe(dict('es')[NOTE]);
  });
});

describe('Smith: zalecenie asekuracji nie dotyczy ćwiczeń na maszynie Smitha (NSCA 3.2 — wolne ciężary)', () => {
  const NEED = Object.entries(CATALOG).filter(([, c]) => c.recommended.includes('rack.safeties'));
  test('jest 43 ćwiczenia z zaleceniem rack.safeties (M1-031: zakres NSCA 3.2)', () => { expect(NEED).toHaveLength(43); });
  test.each(NEED.map(([k]) => k))('%s: sztanga lub sztanga EZ, bez maszyny Smitha', (k) => {
    const c = CATALOG[k]; expect(['barbell', 'ez_bar']).toContain(c.loadSource); expect(c.requires.flat()).not.toContain('smith');
  });
  test('ćwiczenia z loadSource „smith” nie mają zalecenia rack.safeties', () => {
    for (const [k, c] of Object.entries(CATALOG)) if (c.loadSource === 'smith') expect([k, c.recommended.includes('rack.safeties')]).toEqual([k, false]);
  });
});

describe('zdanie R1: „za mało dowodów” (ACSM 2026, Currier i in., Discussion)', () => {
  test('polski klucz i EN', () => {
    expect(r1Key).toContain(R1_PHRASE); expect(r1Key).not.toContain('brak dowodów'); expect(EN[r1Key]).toContain(R1_PHRASE_EN); expect(EN[r1Key]).not.toMatch(/no evidence/);
  });
  test('ekrany generatora i własnego planu używają nowego klucza', () => {
    for (const f of ['app/generator.tsx', 'components/OwnPlan.tsx']) { expect(read(f)).toContain(R1_PHRASE); expect(read(f)).not.toContain('brak dowodów na zależność'); }
  });
  test('_source.json: jeden klucz R1, nowy', () => {
    const rows = src.filter((r) => r.pl.startsWith(R1_START)); expect(rows).toHaveLength(1); expect(rows[0].pl).toBe(r1Key); expect(rows[0].en).toBe(EN[r1Key]);
  });
  test.each(TARGETS)('%s: R1 przetłumaczone pod nowym kluczem, stare klucze usunięte', (l) => {
    const d = dict(l); const old = Object.keys(d).filter((k) => k.startsWith(R1_START) && k !== r1Key);
    expect(old).toEqual([]);
    if (l === 'es-419') return;
    expect(typeof d[r1Key]).toBe('string'); expect(d[r1Key]).not.toBe(EN[r1Key]);
    expect((d[r1Key].match(/\{\w+\}/g) ?? []).sort()).toEqual((r1Key.match(/\{\w+\}/g) ?? []).sort());
  });
});
