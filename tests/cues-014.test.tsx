/*
 * Wskazówki techniki, partie 1–2 (0.14.0, decyzja właściciela 12.10.2026 „backlog A”; research docs/research/31 i 33).
 * Rodzaje (docs/20): dane (20 nowych ćwiczeń, ≥ 2 organizacje na zdanie, lista „partial” uczciwa, otwarte zostają otwarte, bez źródeł o spornym
 * szczeblu), logika (cuesFor / cueBasis dla nowych), języki (pl i en komplet nowych zdań; pozostałe 33 języków — tests/cues.test.tsx, czeka na tłumacza),
 * ekran (sekcje, których nie ma, znikają; podpis źródeł), regresja (etap 1 bez zmian: komplet sekcji), figury (nowe ćwiczenia jawnie bez rysunku).
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { CUE_DATA, CUE_SECTIONS, cuesFor, cueBasis, cueDict, cueText } from '@/lib/cues';
import { figureFor } from '@/lib/figures';
import { ExerciseCues } from '@/components/ExerciseCues';
import { applyLang, t } from '@/lib/i18n';
import { fresh } from './helpers';

const lib = (key: string) => ({ lib: true as const, libKey: key });
afterEach(() => { applyLang('pl'); });

/** Partia 1 (docs/research/31): 14 ćwiczeń bazowych; partia 2 (docs/research/33): 6 ćwiczeń, których komplet nie zależy od spornego szczebla źródeł. */
const NEW_P1 = ['Straight Arm Pulldown', 'Wyciskanie na linkach (stojąc)', 'Machine Shoulder Press', 'Leg Curl', 'Nordic Curl', 'Wall Sit', 'Back Extension', 'Preacher Curl',
  'Diamond Push Up', 'Pallof Press', 'Reverse Crunch', "Farmer's Walk", 'Suitcase Carry', 'Burpees'];
const NEW_P2 = ['Medicine Ball Slam', 'Leg Extension', 'Seated Calf Raise', 'Incline Walk (bieżnia)', 'Bieg', 'Rower'];
const NEW = [...NEW_P1, ...NEW_P2];
/** Zostają otwarte: research zostawia je jako otwarte (szczebel materiałów uczelnianych/DAN/WebMD/przedruku, kąt ławki, wariant roweru, brak drugiego źródła). */
const STILL_OPEN = ['Decline Bench Press', 'Pec Deck', 'Chest Dip', 'Arnold Press', 'Upright Row (hantle)', 'Incline Curl (hantle)', 'Concentration Curl (hantle)', 'Spider Curl',
  'Skullcrusher (hantle)', 'Triceps Kickback', 'Box Squat', 'Sissy Squat', 'Cable Kickback', 'Hip Abduction', 'Hip Adduction', 'Ab Wheel', 'Hanging Leg Raise',
  'Hanging Knee Raise', 'Cable Crunch', 'Hollow Hold', 'Assault Bike', 'Skakanka'];

describe('0.14.0 wskazówki: dane', () => {
  test('20 nowych ćwiczeń ma wskazówki, nie jest już „otwartych”; łącznie 102', () => {
    expect(NEW.length).toBe(20);
    for (const k of NEW) { expect([k, !!CUE_DATA.exercises[k], CUE_DATA.open.includes(k)]).toEqual([k, true, false]); expect(cuesFor(lib(k), 'pl')).not.toBeNull(); }
    expect(Object.keys(CUE_DATA.exercises).length + CUE_DATA.hidden.length).toBe(102); /* hidden — karty ukryte po recenzji treści (M1-audytor-generalny-038, 28.10.2026) */
  });
  test('otwarte zostają otwarte (powód ≥ 20 znaków, bez wskazówek) — nic spornego nie wdrożono', () => {
    expect(STILL_OPEN.length).toBe(22);
    for (const k of STILL_OPEN) { expect([k, CUE_DATA.open.includes(k), CUE_DATA.exercises[k]]).toEqual([k, true, undefined]); expect(cuesFor(lib(k))).toBeNull(); }
  });
  test('lista „partial”: tylko nowe ćwiczenia, każde naprawdę niekompletne; reszta ma komplet sekcji (etap 1 bez zmian)', () => {
    const partial = CUE_DATA.partial;
    expect(partial.length).toBeGreaterThan(0);
    /* + trzy wykroki po usunięciu zdań o kolanie (decyzja właściciela 1a, 28.10.2026, M1-audytor-generalny-038) — karta niepełna świadomie */
    const PO_1A = ['Lunges (hantle)', 'Walking Lunges', 'Reverse Lunge'];
    for (const k of partial) { expect([...NEW, ...PO_1A]).toContain(k); const x = CUE_DATA.exercises[k]; expect([k, x.setup.length >= 1 && x.move.length >= 1 && x.tips.length >= 2]).toEqual([k, false]); expect(x.setup.length + x.move.length + x.tips.length).toBeGreaterThanOrEqual(2); }
    for (const [k, x] of Object.entries(CUE_DATA.exercises)) if (!partial.includes(k)) expect([k, x.setup.length >= 1, x.move.length >= 1, x.tips.length >= 2]).toEqual([k, true, true, true]);
    for (const k of ['Machine Shoulder Press', 'Nordic Curl', 'Pallof Press']) expect(partial).not.toContain(k);
  });
  test('wyłączone z komplet: wskazówki zależne od spornych źródeł nie mają zdań w słownikach', () => {
    const pl = cueDict('pl');
    for (const id of ['lext.setup', 'lext.hold', 'scalf.setup', 'urow.setup', 'pdeck.seat', 'ckick.move', 'hadd.move', 'ccrunch.move', 'hkr.move', 'wheel.setup', 'rope.wrists', 'cpress1.setup']) expect(pl[id]).toBeUndefined();
    expect(CUE_DATA.exercises['Leg Extension'].move.map(r => r.c)).toEqual(['lext.range']);
    expect(CUE_DATA.exercises['Seated Calf Raise'].setup).toEqual([]);
  });
  test('nowe zdania PL i EN: komplet, różne od siebie, bez nazw organizacji, bez obietnic zdrowotnych (granica medyczna z cues.test)', () => {
    const ids = new Set<string>(); for (const k of NEW) for (const sec of CUE_SECTIONS) for (const r of CUE_DATA.exercises[k][sec]) ids.add(r.c);
    const pl = cueDict('pl'), en = cueDict('en');
    for (const id of ids) { expect([id, typeof pl[id], typeof en[id]]).toEqual([id, 'string', 'string']); expect([id, pl[id] !== en[id]]).toEqual([id, true]); expect(pl[id] + en[id]).not.toMatch(/ACE|NASM|NSCA|NordicTrack/); }
  });
});

describe('0.14.0 wskazówki: logika i ekran', () => {
  test('cueBasis nowych ćwiczeń: rodzaje źródeł w stałej kolejności', () => {
    expect(cueBasis('Rower')).toEqual(['site', 'maker', 'study']);
    expect(cueBasis('Bieg')).toEqual(['org', 'study']);
    expect(cueBasis('Incline Walk (bieżnia)')).toEqual(['maker', 'study']);
    expect(cueBasis('Pallof Press')).toEqual(['org', 'maker', 'study']);
    expect(cueBasis('Nordic Curl')).toEqual(['study']);
  });
  test('cuesFor: ćwiczenie bez ustawienia i ruchu ma tylko sekcję „Wskazówki”; z kompletem — trzy sekcje; EN inny tekst niż PL', () => {
    expect(cuesFor(lib('Bieg'), 'pl')!.sections.map(s => s.id)).toEqual(['tips']);
    expect(cuesFor(lib('Rower'), 'pl')!.sections.map(s => s.id)).toEqual(['setup']);
    expect(cuesFor(lib('Nordic Curl'), 'pl')!.sections.map(s => s.id)).toEqual(['setup', 'move', 'tips']);
    expect(cuesFor(lib('Bieg'), 'en')!.sections[0].items[0]).toBe(cueText('run.stride', 'en'));
    expect(cuesFor(lib('Bieg'), 'en')!.sections[0].items[0]).not.toBe(cuesFor(lib('Bieg'), 'pl')!.sections[0].items[0]);
  });
  test('figury: nowe ćwiczenia jawnie bez rysunku (powód w lib/figures/data.json), ćwiczenie nie ma figury', () => {
    for (const k of NEW) expect([k, figureFor(lib(k))]).toEqual([k, null]);
  });
  describe('komponent', () => {
    beforeEach(async () => { await fresh(); });
    test('Bieg: po rozwinięciu tylko nagłówek „Wskazówki”, trzy punkty; bez „Ustawienie” i „Ruch”', () => {
      render(<ExerciseCues exercise={lib('Bieg')} />);
      fireEvent.press(screen.getByRole('button', { name: 'Technika' }));
      expect(screen.getByRole('header', { name: 'Wskazówki' })).toBeTruthy();
      expect(screen.queryByRole('header', { name: 'Ustawienie' })).toBeNull(); expect(screen.queryByRole('header', { name: 'Ruch' })).toBeNull();
      for (const id of ['run.stride', 'run.bounce', 'run.under']) expect(screen.getByText(`• ${cueText(id, 'pl')}`)).toBeTruthy();
      expect(screen.queryByText(/^Na podstawie/)).toBeNull(); /* 23.10.2026: źródła tylko w Ustawienia → Źródła wiedzy */
    });
    test('Nordic Curl po angielsku: trzy sekcje i zdania EN', () => {
      applyLang('en');
      render(<ExerciseCues exercise={lib('Nordic Curl')} />);
      fireEvent.press(screen.getByRole('button', { name: t('Technika') }));
      for (const h of ['Setup', 'Movement', 'Tips']) expect(screen.queryByRole('header', { name: h }) ?? screen.queryByRole('header', { name: new RegExp(h, 'i') })).toBeTruthy();
      expect(screen.getByText(`• ${cueDict('en')['nordic.catch']}`)).toBeTruthy();
    });
  });
});
