/*
 * Audyt kontrolny 1 — backlog obszarów MER i A11 (0.10.1; raporty audytorów: scratchpad koordynatora, docs/25 sekcja „Audyt kontrolny 1”).
 * MER2-07 (= SEC2-02, decyzja właściciela 09.10 ok. 11:40, wariant A): podpis pod wskazówkami techniki bez nazw organizacji i marek
 * („Na podstawie: biblioteki ćwiczeń organizacji szkoleniowych, …”), pełna lista źródeł w docs/research/27.
 * Rodzaje (docs/20): dane (rodzaj każdej organizacji źródeł), logika (cueBasis), ekran (stopka), języki (25 słowników i wskazówki bez nazw),
 * regresja (nazwy nie wracają do tekstów aplikacji).
 */
import * as fs from 'fs';
import * as path from 'path';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { CUE_DATA, cueBasis, cueDict, CUE_BASIS_KINDS } from '@/lib/cues';
import { ExerciseCues } from '@/components/ExerciseCues';
import { LANGS, applyLang, t } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';
import { LOCALES } from '@/lib/locales';
import { fresh } from './helpers';

const root = path.join(__dirname, '..');
const lib = (key: string) => ({ lib: true as const, libKey: key });
afterEach(() => { applyLang('pl'); });

/** Nazwy organizacji i marek źródeł wskazówek — tylko w docs/research/27 (zasada właściciela 09.10.2026: nazwy innych firm nie w tekstach aplikacji). */
const SOURCE_NAMES = /\b(ACE|NASM|ExRx|Stronger by Science|Concept ?2|acefitness|nasm\.org)\b/i;

describe('MER2-07: podpis wskazówek bez nazw organizacji i marek', () => {
  beforeEach(async () => { await fresh(); });
  test('dane: każda organizacja źródeł ma rodzaj (organizacja szkoleniowa, serwis, producent, badanie); cueBasis — rodzaje w stałej kolejności, bez powtórzeń', () => {
    for (const [id, o] of Object.entries(CUE_DATA.orgs)) expect([id, (CUE_BASIS_KINDS as readonly string[]).includes(o.kind)]).toEqual([id, true]);
    expect(cueBasis('Rowing Machine')).toEqual(['org', 'maker']);
    expect(cueBasis('Back Squat')).toEqual(['org', 'site', 'study']);
    expect(cueBasis('Sumo Deadlift')).toEqual(['site']);
    expect(cueBasis('xyz')).toEqual([]);
    for (const k of Object.keys(CUE_DATA.exercises)) { const b = cueBasis(k); expect(b.length).toBeGreaterThan(0); expect([...b].sort((x, y) => CUE_BASIS_KINDS.indexOf(x) - CUE_BASIS_KINDS.indexOf(y))).toEqual(b); }
  });
  test('ekran: stopka opisuje rodzaje źródeł ogólnie (PL i EN), bez nazw; nadal „Własne sformułowania”', () => {
    render(<ExerciseCues exercise={lib('Rowing Machine')} />);
    fireEvent.press(screen.getByRole('button', { name: 'Technika' }));
    expect(screen.getByText('Na podstawie: biblioteki ćwiczeń organizacji szkoleniowych, materiały producenta sprzętu. Własne sformułowania.')).toBeTruthy();
    applyLang('en'); render(<ExerciseCues exercise={lib('Back Squat')} />);
    fireEvent.press(screen.getByRole('button', { name: 'Technique' }));
    expect(screen.getByText('Based on: exercise libraries of fitness education organisations, specialist training websites, scientific studies. Our own wording.')).toBeTruthy();
  });
  test('regresja: żaden tekst aplikacji (słownik EN, 24 słowniki, wskazówki 26 języków, podpis każdego ćwiczenia w każdym języku) nie zawiera nazw źródeł', () => {
    const bad: string[] = [];
    for (const [k, v] of Object.entries(EN)) if (SOURCE_NAMES.test(k) || SOURCE_NAMES.test(v)) bad.push(`en: ${k}`);
    for (const [l, d] of Object.entries(LOCALES)) for (const [k, v] of Object.entries(d ?? {})) if (SOURCE_NAMES.test(v)) bad.push(`${l}: ${k}`);
    for (const l of LANGS) for (const [id, v] of Object.entries(cueDict(l))) if (SOURCE_NAMES.test(v)) bad.push(`cue ${l}: ${id}`);
    for (const l of LANGS) { applyLang(l); for (const k of Object.keys(CUE_DATA.exercises)) { const { unmount } = render(<ExerciseCues exercise={lib(k)} />); fireEvent.press(screen.getByRole('button', { name: t('Technika') })); for (const x of screen.UNSAFE_root.findAll((n: { type: unknown }) => n.type === 'Text')) { const s = JSON.stringify(x.props.children); if (SOURCE_NAMES.test(s)) bad.push(`${l} ${k}: ${s.slice(0, 60)}`); } unmount(); } }
    expect(bad).toEqual([]);
    /* bramka działa: nazwy są w dokumencie źródeł (docs/research/27), tylko nie w aplikacji */
    expect(SOURCE_NAMES.test(fs.readFileSync(path.join(root, 'docs/research/27-wskazowki-zrodla.md'), 'utf8'))).toBe(true);
    expect(fs.readFileSync(path.join(root, 'components/ExerciseCues.tsx'), 'utf8')).not.toMatch(/c\.orgs|cueOrgs/);
  });
});
