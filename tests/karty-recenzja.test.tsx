/*
 * Bramka 4 dla TREŚCI KART ćwiczeń (CLAUDE.md „Animacje i karty ćwiczeń”, 27.10.2026; decyzja DEC-10 a z 28.10.2026; zadanie M1-audytor-generalny-038,
 * znalezisko 03-zakres-601): karta ze wskazówkami ⇒ wpis recenzji z aktualnym skrótem wskazówek, inaczej wskazówki nie trafiają do pliku runtime.
 * Zapis: docs/research/figury-recenzja.json — sekcja „karty” (własne wskazówki ćwiczenia: id w sekcjach + polskie teksty) i „zestawy” (zestaw ogólny
 * przy figurze v2: wzorzec, id ok/err + polskie teksty). Karta własna bez wpisu w „karty” przechodzi tylko z wpisem v1 „wyswietlana” (figura i wskazówki
 * recenzowane razem, skrót figuraSkrot). Mechanizm: scripts/zrodla-runtime.mjs (buildCues) — karta bez aktualnej recenzji wypada z lib/cues/data.json
 * (lista „hidden”), zestaw ogólny bez aktualnej recenzji nie trafia na listę „general” i ekran go nie pokazuje (components/ExerciseCues.tsx, lib/figures/v2/ui.ts).
 * Rodzaje (docs/20): dane (wpisy, skróty, format L-047), niezmienniki (runtime = tylko recenzowane), regresja (mutacja tekstu i przypisania), ekran.
 */
import React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { render, screen } from '@testing-library/react-native';
import { CUE_DATA, generalCuesReviewed } from '@/lib/cues';
import { figureSpec } from '@/lib/figures/v2';
import { CUE_SETS } from '@/lib/figures/v2/cueSets';
import { ExerciseCues } from '@/components/ExerciseCues';

const root = path.join(__dirname, '..');
const SCRIPT = path.join(root, 'scripts/zrodla-runtime.mjs');
type Card = { werdykt: 'wyswietlana' | 'do poprawy'; data: string; stan: string; autor: string; recenzent: string; kto: string; sha: string; uwagi?: string; poprawka?: string };
type Rec = { v1: Record<string, { werdykt: string; sha: string }>; karty?: Record<string, Card>; zestawy?: Record<string, Card & { rodzina: string }> };
const REC: Rec = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/figury-recenzja.json'), 'utf8'));
const FULL: { exercises: Record<string, unknown> } = JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/cues.json'), 'utf8'));
let NOW: { v1: Record<string, string>; karty: Record<string, string>; zestawy: Record<string, string> } = { v1: {}, karty: {}, zestawy: {} };
try { NOW = JSON.parse(execFileSync('node', [SCRIPT, '--skroty'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })); } catch { /* brak skrótów = testy czerwone */ }
const RT = CUE_DATA as typeof CUE_DATA & { hidden?: string[]; general?: string[] };
const lib = (key: string) => ({ lib: true as const, libKey: key });
const OWN = Object.keys(FULL.exercises);
/** Zestawy ogólne wyświetlane w 1.0: ćwiczenie z figurą v2 (gotowa rodzina) i trybem „general”. */
const GENERAL_SHOWN = Object.keys(CUE_SETS.items).filter(k => CUE_SETS.items[k].b === 'general' && !!figureSpec(k));
const cardOk = (k: string) => { const c = REC.karty?.[k]; if (c) return c.werdykt === 'wyswietlana' && c.sha === NOW.karty[k]; const v = REC.v1[k]; return !!v && v.werdykt === 'wyswietlana' && v.sha === NOW.v1[k]; };
const setOk = (k: string) => { const z = REC.zestawy?.[k]; return !!z && z.werdykt === 'wyswietlana' && z.sha === NOW.zestawy[k]; };

describe('zapis recenzji treści kart (M1-audytor-generalny-038, DEC-10 a, 28.10.2026)', () => {
  test('każda karta ze wskazówkami (data/zrodla/cues.json) ma wpis recenzji: „karty” albo figura v1 „wyswietlana” (figura i wskazówki recenzowane razem)', () => {
    expect(OWN.length).toBeGreaterThanOrEqual(100);
    for (const k of OWN) expect([k, !!REC.karty?.[k] || REC.v1[k]?.werdykt === 'wyswietlana']).toEqual([k, true]);
  });
  test('każdy zestaw ogólny wyświetlany przy figurze v2 ma wpis w „zestawy” z wzorcem z cue-sets.json', () => {
    expect(GENERAL_SHOWN.length).toBeGreaterThanOrEqual(60);
    for (const k of GENERAL_SHOWN) expect([k, REC.zestawy?.[k]?.rodzina]).toEqual([k, CUE_SETS.items[k].f]);
  });
  test('format wpisu: werdykt, data, kto, skrót 12 znaków; „do poprawy” — opis wady i proponowana poprawka', () => {
    for (const [k, e] of [...Object.entries(REC.karty ?? {}), ...Object.entries(REC.zestawy ?? {})]) {
      expect([k, ['wyswietlana', 'do poprawy'].includes(e.werdykt), /^\d{4}-\d\d-\d\d$/.test(e.data), e.kto.length > 10, /^[0-9a-f]{12}$/.test(e.sha)]).toEqual([k, true, true, true, true]);
      if (e.werdykt === 'do poprawy') expect([k, (e.uwagi ?? '').length > 20, (e.poprawka ?? '').length > 20]).toEqual([k, true, true]);
    }
  });
  test('L-047 A (właściciel 28.10.2026): wpis „wyswietlana” z 28.10 — stan „zrecenzowana niezależnie…”, jawny autor i recenzent, autor ≠ recenzent', () => {
    for (const [k, e] of [...Object.entries(REC.karty ?? {}), ...Object.entries(REC.zestawy ?? {})]) if (e.werdykt === 'wyswietlana' && e.data >= '2026-10-28') {
      expect([k, /^zrecenzowana niezależnie/.test(e.stan), e.autor.length > 5, e.recenzent.length > 5, e.autor !== e.recenzent]).toEqual([k, true, true, true, true]);
    }
  });
  test('wpis „wyswietlana” ⇒ skrót = skrót bieżących wskazówek (zmiana tekstu bez nowej recenzji czerwieni test)', () => {
    for (const [k, e] of Object.entries(REC.karty ?? {})) if (e.werdykt === 'wyswietlana') expect([k, e.sha]).toEqual([k, NOW.karty[k]]);
    for (const [k, e] of Object.entries(REC.zestawy ?? {})) if (e.werdykt === 'wyswietlana') expect([k, e.sha]).toEqual([k, NOW.zestawy[k]]);
  });
});

describe('plik runtime lib/cues/data.json: tylko recenzowane karty i zestawy', () => {
  test('karty: w runtime tylko karty z aktualną recenzją; pozostałe na liście „hidden”', () => {
    expect(Object.keys(RT.exercises).sort()).toEqual(OWN.filter(cardOk).sort());
    expect([...(RT.hidden ?? [])].sort()).toEqual(OWN.filter(k => !cardOk(k)).sort());
  });
  test('zestawy ogólne: na liście „general” tylko zestawy z aktualną recenzją', () => {
    expect([...(RT.general ?? [])].sort()).toEqual(Object.keys(REC.zestawy ?? {}).filter(setOk).sort());
  });
  test('generalCuesReviewed: prawda tylko dla zestawu z aktualną recenzją (lista „general”)', () => {
    expect(generalCuesReviewed('Sumo Deadlift with Bands')).toBe(true);
    /* decyzja właściciela 28.10.2026 „1a” (M1-audytor-generalny-038): skull.upperArm usunięte z zestawu, nowa recenzja 06-tresci — „wyswietlana” */
    expect(generalCuesReviewed('Decline Close-Grip Bench To Skull Crusher')).toBe(REC.zestawy?.['Decline Close-Grip Bench To Skull Crusher']?.werdykt === 'wyswietlana');
    expect(generalCuesReviewed('Lateral Lunge')).toBe(false); /* rodzina lunge bez figury v2 — bez recenzji */
    expect(generalCuesReviewed('Back Squat')).toBe(false); /* karta własna, nie zestaw ogólny */
  });
  test('karta „do poprawy” (Hack Squat) nie ma sekcji „Technika”; zestaw bez aktualnej recenzji nie pokazuje wskazówek ogólnych', () => {
    expect(REC.karty?.['Hack Squat']?.werdykt).toBe('do poprawy');
    render(<ExerciseCues exercise={lib('Hack Squat')} initialOpen />);
    expect(screen.queryByTestId('exercise-cues')).toBeNull();
    /* od 28.10.2026 (decyzja właściciela „1a”, M1-audytor-generalny-038) żaden zestaw nie jest „do poprawy” — wtedy zestaw ogólny bez wpisu recenzji (Lateral Lunge) */
    const z = Object.entries(REC.zestawy ?? {}).find(([, e]) => e.werdykt === 'do poprawy')?.[0] ?? 'Lateral Lunge';
    expect(generalCuesReviewed(z)).toBe(false);
    render(<ExerciseCues exercise={lib(z as string)} initialOpen />);
    expect(screen.queryByTestId('exercise-cues-general-note')).toBeNull();
    expect(screen.queryByRole('header', { name: 'Wskazówki' })).toBeNull();
  });
  test('karta i zestaw z recenzją się pokazują (Sumo Deadlift — własne; Sumo Deadlift with Bands — ogólne z dopiskiem)', () => {
    render(<ExerciseCues exercise={lib('Sumo Deadlift')} initialOpen />);
    expect(screen.getByRole('header', { name: 'Ustawienie' })).toBeTruthy();
    render(<ExerciseCues exercise={lib('Sumo Deadlift with Bands')} initialOpen />);
    expect(screen.getByTestId('exercise-cues-general-note')).toBeTruthy();
  });
});

describe('regresja: zmiana treści po recenzji unieważnia wpis (generator)', () => {
  const run = (mutate: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import { buildCues, recenzja } from ${JSON.stringify(SCRIPT)};
    import { readFileSync } from 'node:fs';
    const full = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'data/zrodla/cues.json'))}, 'utf8'));
    const pl = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'lib/cues/text/pl.json'))}, 'utf8'));
    const sets = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'lib/figures/v2/cue-sets.json'))}, 'utf8'));
    ${mutate}
    const out = buildCues(full, { rec: recenzja(), pl, sets });
    console.log(JSON.stringify({ sumo: 'Sumo Deadlift' in out.exercises, hidden: out.hidden, general: out.general }));`], { encoding: 'utf8' }));
  test('bez zmian: Sumo Deadlift w runtime, 4 warianty sumo na liście „general”', () => {
    const r = run('');
    expect(r.sumo).toBe(true);
    for (const k of ['Reverse Band Sumo Deadlift', 'Sumo Deadlift (kettlebell)', 'Sumo Deadlift with Bands', 'Sumo Deadlift with Chains']) expect([k, r.general.includes(k)]).toEqual([k, true]);
  });
  test('zmiana polskiego tekstu sumo.kneesOut: karta Sumo Deadlift i 4 zestawy ogólne z tą wskazówką wypadają', () => {
    const r = run(`pl['sumo.kneesOut'] += ' (zmiana)';`);
    expect(r.sumo).toBe(false); expect(r.hidden).toContain('Sumo Deadlift');
    for (const k of ['Reverse Band Sumo Deadlift', 'Sumo Deadlift (kettlebell)', 'Sumo Deadlift with Bands', 'Sumo Deadlift with Chains']) expect([k, r.general.includes(k)]).toEqual([k, false]);
    expect(r.general).toContain('Bodyweight Squat'); /* zestaw bez tej wskazówki zostaje */
  });
  test('zmiana przypisania zestawu ogólnego (dodana wskazówka) unieważnia wpis tego ćwiczenia', () => {
    const r = run(`sets.items['Sumo Deadlift with Bands'].ok.push('rdl.knees');`);
    expect(r.general.includes('Sumo Deadlift with Bands')).toBe(false);
    expect(r.general.includes('Sumo Deadlift with Chains')).toBe(true);
  });
  test('zmiana zestawu wskazówek karty własnej (usunięty błąd) unieważnia wpis karty', () => {
    const r = run(`full.exercises['Wall Sit'].tips.pop();`);
    expect(r.hidden).toContain('Wall Sit');
  });
});
