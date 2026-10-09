/*
 * Wskazówki techniki, etap 1 (decyzja właściciela 08.10.2026 ok. 23:50; dane lib/cues, dokument docs/research/27 z scripts/cues/gen.mjs).
 * Rodzaje (docs/20): dane (każde ćwiczenie bazowe ma wskazówki albo powód w „open”; każda wskazówka ≥ 2 źródła z różnych organizacji;
 * 2–4 wskazówki), logika (cuesFor po kluczu katalogu: przemianowane tak, własne nie), języki (komplet w 26 językach, tłumaczenie ≠ angielski,
 * te same zdania), granica medyczna (bez obietnic zdrowotnych w treści, stopka z odesłaniem), ekran (zwinięta sekcja, rozwijanie,
 * VoiceOver: przycisk z expanded, nagłówki sekcji, punkty bez „•” w etykiecie), ekran ćwiczenia, generator dokumentu (--check).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { CUE_DATA, CUE_SECTIONS, cuesFor, cueText, cueDict, cueOrgs } from '@/lib/cues';
import { ExerciseCues } from '@/components/ExerciseCues';
import { LIB_BASE_NAMES, LIB_KEYS } from '@/lib/seed';
import { LANGS, applyLang, t } from '@/lib/i18n';
import { light } from '@/lib/theme';
import * as store from '@/lib/store';
import { fresh } from './helpers';
import { renderApp, screen as appScreen, tap, flushAll } from './app';

const root = path.join(__dirname, '..');
const lib = (key: string) => ({ lib: true as const, libKey: key });
afterEach(() => { applyLang('pl'); });

describe('dane wskazówek', () => {
  test('każde ćwiczenie bazowe ma wskazówki albo jest na liście otwartych z powodem; poza bazą — nic', () => {
    const covered = new Set([...Object.keys(CUE_DATA.exercises), ...Object.keys(CUE_DATA.open)]);
    expect([...LIB_BASE_NAMES].filter(n => !covered.has(n))).toEqual([]);
    expect([...covered].filter(n => !LIB_BASE_NAMES.has(n))).toEqual([]);
    for (const k of Object.keys(CUE_DATA.open)) { expect(CUE_DATA.exercises[k]).toBeUndefined(); expect(CUE_DATA.open[k].length).toBeGreaterThan(20); }
    expect(Object.keys(CUE_DATA.exercises).length).toBeGreaterThanOrEqual(70);
  });
  test('każda wskazówka: ≥ 2 przeczytane źródła z różnych organizacji, z miejscem w źródle; źródło ma adres https', () => {
    for (const [ex, x] of Object.entries(CUE_DATA.exercises)) for (const sec of CUE_SECTIONS) for (const r of x[sec] ?? []) {
      const orgs = new Set<string | undefined>(r.s.map(([sid]) => CUE_DATA.sources[sid]?.org));
      expect([ex, r.c, orgs.has(undefined)]).toEqual([ex, r.c, false]);
      expect([ex, r.c, orgs.size >= 2]).toEqual([ex, r.c, true]);
      for (const [, at] of r.s) expect(at.trim().length).toBeGreaterThan(2);
    }
    for (const s of Object.values(CUE_DATA.sources)) { expect(s.url).toMatch(/^https:\/\//); expect(CUE_DATA.orgs[s.org]).toBeDefined(); if (s.archive) expect(s.archive).toMatch(/^https:\/\/web\.archive\.org\/web\/\d+\//); }
  });
  test('sekcje: ustawienie i ruch ≥ 1, wskazówki 2–4, błędy 0–4; bez powtórzeń w sekcji', () => {
    for (const [ex, x] of Object.entries(CUE_DATA.exercises)) {
      expect([ex, x.setup.length >= 1, x.move.length >= 1, x.tips.length >= 2 && x.tips.length <= 4, x.mistakes.length <= 4]).toEqual([ex, true, true, true, true]);
      for (const sec of CUE_SECTIONS) expect(new Set(x[sec].map(r => r.c)).size).toBe(x[sec].length);
    }
  });
  test('granica medyczna: treść nie obiecuje zdrowia ani nie leczy (bez „kontuzj”, „uraz”, „zapobieg”, „bezpieczn”, „ból”, „leczy”)', () => {
    const bad = Object.entries(cueDict('pl')).filter(([, v]) => /kontuzj|uraz|zapobieg|bezpieczn|ból|bol[ią]|lecz/i.test(v));
    expect(bad).toEqual([]);
    const badEn = Object.entries(cueDict('en')).filter(([, v]) => /injur|prevent|safe|pain|heal|cure/i.test(v));
    expect(badEn).toEqual([]);
  });
  test('liczby nie są wpisane w treść wskazówek (CLAUDE.md: liczby w jednym miejscu)', () => {
    expect(Object.entries(cueDict('pl')).filter(([, v]) => /\d/.test(v))).toEqual([]);
  });
});

describe('języki', () => {
  const ids = Object.keys(cueDict('pl'));
  test('każde zdanie ma tekst w każdym z 26 języków, bez nadmiarowych id', () => {
    for (const l of LANGS) {
      const d = cueDict(l);
      expect([l, ids.filter(k => typeof d[k] !== 'string' || !d[k].trim())]).toEqual([l, []]);
      expect([l, Object.keys(d).filter(k => !ids.includes(k))]).toEqual([l, []]);
    }
  });
  test('tłumaczenia są prawdziwe: w językach innych niż pl/en tekst różni się od angielskiego i polskiego', () => {
    for (const l of LANGS.filter(x => x !== 'pl' && x !== 'en')) {
      const d = cueDict(l);
      expect([l, ids.filter(k => d[k] === cueDict('en')[k] || d[k] === cueDict('pl')[k])]).toEqual([l, []]);
    }
  });
  test('serbski cyrylicą, grecki i ukraiński i bułgarski w swoim alfabecie (jak słowniki UI)', () => {
    for (const [l, re] of [['sr', /[Ѐ-ӿ]/], ['uk', /[Ѐ-ӿ]/], ['bg', /[Ѐ-ӿ]/], ['el', /[Ͱ-Ͽ]/]] as const) {
      expect([l, ids.filter(k => !re.test(cueDict(l)[k]))]).toEqual([l, []]);
    }
  });
  test('cueText: brak w języku → angielski → polski → id', () => {
    expect(cueText('hinge.back', 'pl')).toBe(cueDict('pl')['hinge.back']);
    expect(cueText('hinge.back', 'de')).toBe(cueDict('de')['hinge.back']);
    expect(cueText('nie-ma-takiego', 'de')).toBe('nie-ma-takiego');
  });
});

describe('logika', () => {
  test('cuesFor: ćwiczenie biblioteki po kluczu katalogu; przemianowane zachowuje; własne, nieznany klucz i brak — null', () => {
    const c = cuesFor(lib('Back Squat'), 'pl')!;
    expect(c.key).toBe('Back Squat');
    expect(c.sections.map(s => s.id)).toEqual(['setup', 'move', 'tips', 'mistakes']);
    expect(c.sections[0].items[0]).toBe(cueText(CUE_DATA.exercises['Back Squat'].setup[0].c, 'pl'));
    expect(cuesFor({ lib: true, libKey: 'Back Squat' }, 'en')!.sections[0].items[0]).toBe(cueDict('en')[CUE_DATA.exercises['Back Squat'].setup[0].c]);
    expect(cuesFor({ lib: false, libKey: 'Back Squat' })).toBeNull();
    expect(cuesFor({ lib: true, libKey: 'Nie ma takiego' })).toBeNull();
    expect(cuesFor({ lib: true })).toBeNull();
    expect(cuesFor(null)).toBeNull();
    const open = Object.keys(CUE_DATA.open)[0]; if (open) expect(cuesFor(lib(open))).toBeNull();
    expect(LIB_KEYS.has('Back Squat')).toBe(true);
  });
  test('sekcja bez pozycji (np. brak błędów z dwoma źródłami) znika z listy', () => {
    const noMis = Object.keys(CUE_DATA.exercises).find(k => CUE_DATA.exercises[k].mistakes.length === 0)!;
    expect(noMis).toBeDefined();
    expect(cuesFor(lib(noMis), 'pl')!.sections.map(s => s.id)).not.toContain('mistakes');
  });
  test('cueOrgs: organizacje w kolejności pierwszego użycia, bez powtórzeń; nieznane ćwiczenie → []', () => {
    const o = cueOrgs('Deadlift (sztanga)'); expect(o[0]).toBe('ACE'); expect(new Set(o).size).toBe(o.length); expect(o.length).toBeGreaterThanOrEqual(2);
    expect(cueOrgs('xyz')).toEqual([]);
  });
});

describe('komponent ExerciseCues', () => {
  beforeEach(async () => { await fresh(); });
  test('zwinięty: przycisk „Technika” z expanded=false; po stuknięciu sekcje, punkty i stopka; ponowne stuknięcie zwija', () => {
    render(<ExerciseCues exercise={lib('Deadlift (sztanga)')} />);
    const btn = screen.getByRole('button', { name: 'Technika' });
    expect(btn.props.accessibilityState).toEqual({ expanded: false });
    expect(btn.props.accessibilityHint).toBe('Ustawienie, ruch, wskazówki i częste błędy.');
    expect(screen.queryByText('Ustawienie')).toBeNull();
    fireEvent.press(btn);
    expect(screen.getByRole('button', { name: 'Technika' }).props.accessibilityState).toEqual({ expanded: true });
    for (const h of ['Ustawienie', 'Ruch', 'Wskazówki', 'Częste błędy']) expect(screen.getByRole('header', { name: h })).toBeTruthy();
    const first = cueText(CUE_DATA.exercises['Deadlift (sztanga)'].setup[0].c, 'pl');
    expect(screen.getByText(`• ${first}`).props.accessibilityLabel).toBe(first);
    /* audyt kontrolny 1 MER2-07 (decyzja właściciela 09.10.2026, wariant A): rodzaje źródeł zamiast nazw organizacji — tests/audit-k1-bl-mer */
    expect(screen.getByText('Na podstawie: biblioteki ćwiczeń organizacji szkoleniowych, specjalistyczne serwisy treningowe. Własne sformułowania.')).toBeTruthy();
    expect(screen.getByText('Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Technika' }));
    expect(screen.queryByText('Ustawienie')).toBeNull();
  });
  test('ćwiczenie własne i ćwiczenie bez wskazówek — nic się nie renderuje', () => {
    render(<ExerciseCues exercise={{ lib: false }} />);
    expect(screen.toJSON()).toBeNull();
    const open = Object.keys(CUE_DATA.open)[0];
    if (open) { render(<ExerciseCues exercise={lib(open)} />); expect(screen.toJSON()).toBeNull(); }
  });
  test('kolory z motywu (jasny): tekst wskazówek t.text, nagłówki t.muted, linie t.line', () => {
    render(<ExerciseCues exercise={lib('Plank')} />);
    fireEvent.press(screen.getByRole('button', { name: 'Technika' }));
    const item = screen.getByText(`• ${cueText(CUE_DATA.exercises['Plank'].setup[0].c, 'pl')}`);
    expect(item.props.style.color).toBe(light.text);
    expect(screen.getByRole('header', { name: 'Ruch' }).props.style.color).toBe(light.muted);
    expect(screen.getByTestId('exercise-cues').props.style.borderColor).toBe(light.line);
  });
  test('po angielsku: etykiety i treść w języku interfejsu', () => {
    applyLang('en');
    render(<ExerciseCues exercise={lib('Plank')} />);
    fireEvent.press(screen.getByRole('button', { name: t('Technika') }));
    expect(t('Technika')).toBe('Technique');
    expect(screen.getByRole('header', { name: 'Common mistakes' })).toBeTruthy();
    expect(screen.getByText(`• ${cueDict('en')[CUE_DATA.exercises['Plank'].setup[0].c]}`)).toBeTruthy();
    expect(screen.getByText(/^The app does not give medical advice\./)).toBeTruthy();
  });
});

describe('ekran ćwiczenia', () => {
  test('ćwiczenie z biblioteki pokazuje sekcję „Technika”, własne — nie', async () => {
    await renderApp();
    const ex = store.getState().exercises.find(e => e.lib && e.libKey === 'Back Squat')!;
    const { router } = require('expo-router');
    const { act } = require('./app');
    await act(async () => { router.push(`/exercise/${ex.id}`); });
    await flushAll();
    await tap(appScreen.getByRole('button', { name: 'Technika' }));
    expect(appScreen.getByText(`• ${cueText(CUE_DATA.exercises['Back Squat'].setup[0].c, 'pl')}`)).toBeTruthy();
  });
});

describe('dokument źródeł (generowany)', () => {
  test('docs/research/27-wskazowki-zrodla.md aktualny i dane poprawne (scripts/cues/gen.mjs --check)', () => {
    expect(() => execFileSync('node', [path.join(root, 'scripts/cues/gen.mjs'), '--check'], { stdio: 'pipe' })).not.toThrow();
    const doc = fs.readFileSync(path.join(root, 'docs/research/27-wskazowki-zrodla.md'), 'utf8');
    for (const k of Object.keys(CUE_DATA.exercises)) expect(doc).toContain(`### ${k}`);
    for (const k of Object.keys(CUE_DATA.open)) expect(doc).toContain(`| ${k} |`);
  });
  test('verify uruchamia sprawdzenie dokumentu wskazówek', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    expect(pkg.scripts['check:cues']).toBe('node scripts/cues/gen.mjs --check');
    expect(pkg.scripts.verify).toContain('npm run check:cues');
  });
});
