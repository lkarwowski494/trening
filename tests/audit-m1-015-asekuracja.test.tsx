/*
 * Audyt M1 z 19.10.2026, partia 2 — M1-audytor-generalny-015: 29 ćwiczeń katalogu ze sztangą nad ciałem lub na barkach ma zalecenie `rack.safeties`
 * (lib/catalog.generated.ts), a aplikacja nic o asekuracji nie mówiła. Teraz: (1) ekran ćwiczenia (sekcja „Technika” albo osobna ramka, gdy ćwiczenie nie ma
 * wskazówek) pokazuje zdanie o asekuracji dla każdego z 29, (2) w miejscu bez ramion asekuracyjnych wybór ćwiczenia i podgląd generatora dopisują
 * „bez asekuracji w stojakach”. Treść zdania: ostrożna, bez liczb — DO WERYFIKACJI BADACZA (docs/10, sekcja „Asekuracja”). Czerwone na 8273448.
 */
import * as store from '@/lib/store';
import { render, screen as rtlScreen } from '@testing-library/react-native';
import React from 'react';
import { CATALOG } from '@/lib/catalog.generated';
import { equipEntry, needsSafety, lacksSafety, SAFETY_CAP } from '@/lib/equipment';
import { generate } from '@/lib/generator';
import { applyLang, LANGS, t } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { ExerciseCues } from '@/components/ExerciseCues';
import { fresh, ex } from './helpers';
import { loc } from './locations-fixtures';
import { renderApp, flushAll, screen, go, type, tap, act } from './app';

jest.setTimeout(120000);
const NOTE = 'Ćwiczenie ze sztangą na tułowiu lub nad głową i twarzą: zalecana asekuracja — stojaki z ramionami asekuracyjnymi oraz osoba asekurująca.';
const TAG = 'bez asekuracji w stojakach'; const TITLE = 'Asekuracja';
const NEED = Object.entries(CATALOG).filter(([, c]) => c.recommended.includes('rack.safeties')).map(([k]) => k);
const noSafe = () => loc('Bez ramion', [equipEntry('barbell'), equipEntry('bench_flat'), equipEntry('squat_stands')], 'nosafe');
const withSafe = () => loc('Z klatką', [equipEntry('barbell'), equipEntry('bench_flat'), equipEntry('rack')], 'withsafe');
afterEach(() => { applyLang('pl'); });

describe('M1-015: logika', () => {
  test('katalog: dokładnie 43 ćwiczenia zalecają ramiona asekuracyjne (29 z M1-015 + 14 z M1-031); needsSafety zgodne z danymi dla całego katalogu', () => {
    expect(NEED).toHaveLength(43);
    for (const [k, c] of Object.entries(CATALOG)) expect([k, needsSafety(c)]).toEqual([k, c.recommended.includes('rack.safeties')]);
  });
  test('lacksSafety: miejsce bez ramion → tak; klatka (power rack) → nie; brak miejsca („bez ograniczeń”) → nie; ćwiczenie bez zalecenia → nie', () => {
    const c = CATALOG['Bench Press (sztanga)']; expect(lacksSafety(c, noSafe())).toBe(true); expect(lacksSafety(c, withSafe())).toBe(false); expect(lacksSafety(c, null)).toBe(false);
    expect(lacksSafety(CATALOG['Bench Press (hantle)'], noSafe())).toBe(false);
    const stands = loc('Stojaki z opcją', [equipEntry('barbell'), equipEntry('squat_stands', 'kg', true)]); expect(lacksSafety(c, stands)).toBe(false); /* opcja „z asekuracją” */
  });
  test('słowniki: trzy teksty w EN i w każdym z 33 innych języków (z {parametrami} bez zmian)', () => {
    for (const k of [NOTE, TAG, TITLE]) { expect(typeof EN[k]).toBe('string'); for (const l of LANGS.filter(x => x !== 'pl' && x !== 'en')) { const d = LOCALES[l] as Record<string, string>; expect([l, k, typeof d[k]]).toEqual([l, k, 'string']); } }
  });
});

describe('M1-015: sekcja „Technika” / ramka na ekranie ćwiczenia', () => {
  test.each(NEED)('%s: zdanie o asekuracji widoczne (PL)', async key => {
    await fresh(); const e = { lib: true, libKey: key, recommended: CATALOG[key].recommended } as any;
    render(<ExerciseCues exercise={e} />); expect(rtlScreen.getByText(NOTE)).toBeTruthy(); expect(rtlScreen.getByText(TITLE)).toBeTruthy();
  });
  test('ćwiczenie bez zalecenia asekuracji (hantle) i własne — bez ramki', async () => {
    await fresh(); render(<ExerciseCues exercise={{ lib: true, libKey: 'Bench Press (hantle)', recommended: [] } as any} />); expect(rtlScreen.queryByText(NOTE)).toBeNull();
  });
  test('ekran /exercise/<id> (Decline Bench Press — bez wskazówek techniki): zdanie widoczne', async () => {
    await fresh(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go(`/exercise/${ex('Decline Bench Press').id}`); await flushAll(10);
    expect(screen.getByText(NOTE)).toBeTruthy();
  });
});

describe('M1-015: wybór ćwiczenia i podgląd generatora w miejscu bez ramion asekuracyjnych', () => {
  const withPlace = async (l: ReturnType<typeof loc>) => { await fresh(); const s = store.getState().settings; s.locations.push(l); s.mainLocationId = l.id; await act(async () => { await store.flush(); }); return JSON.parse(JSON.stringify(store.getState())); };
  test('wybór ćwiczenia: „Bench Press (sztanga)” w miejscu bez ramion ma dopisek; w miejscu z klatką — nie; ćwiczenie z hantlami — nie', async () => {
    const saved = await withPlace(noSafe()); await renderApp({ saved }); await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Bench Press (sztanga)'); await flushAll(5);
    expect(screen.getAllByText(new RegExp(`${TAG}$`)).length).toBeGreaterThan(0); expect(screen.queryByText(/brak:/)).toBeNull();
  });
  test('wybór ćwiczenia w miejscu z klatką: bez dopisku', async () => {
    const saved = await withPlace(withSafe()); await renderApp({ saved }); await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Bench Press (sztanga)'); await flushAll(5);
    expect(screen.queryByText(new RegExp(TAG))).toBeNull(); expect(screen.getAllByText(/^sztanga/).length).toBeGreaterThan(0);
  });
  const preview = async (l: ReturnType<typeof loc>, bez = false) => {
    const saved = await withPlace(l); await renderApp({ saved }); await go('/generator'); await flushAll(10);
    if (bez) { await tap(screen.getByText('Bez ograniczeń sprzętu')); await flushAll(10); }
    const planned = generate({ goal: 'hypertrophy', locationId: bez ? null : l.id, sessions: 3, minutes: 60 });
    return { shown: screen.queryAllByText(new RegExp(TAG)).length, need: planned.templates.flatMap(tp => tp.items).filter(it => needsSafety(store.exById(it.exerciseId)!)).length };
  };
  test('podgląd generatora, miejsce bez ramion: dopisek przy każdym ćwiczeniu z zaleceniem asekuracji (jest co najmniej jedno)', async () => {
    const r = await preview(noSafe()); expect(r.need).toBeGreaterThan(0); expect(r.shown).toBe(r.need);
  });
  test('podgląd generatora, miejsce z klatką albo „Bez ograniczeń sprzętu”: bez dopisku', async () => {
    expect((await preview(withSafe())).shown).toBe(0);
    expect((await preview(noSafe(), true)).shown).toBe(0);
  });
});
