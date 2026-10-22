/*
 * „Zapowiedzi głosowe” (19.10.2026, decyzja właściciela; zastępuje przełącznik „Głos także przez głośnik telefonu” z 0.20, docs/36): w Ustawieniach wybór Wyłączone / W słuchawkach /
 * Także przez głośnik (domyślnie W słuchawkach, zapis tylko odstępstwa) z ⓘ, „Posłuchaj przykładu”, wskazówka przy braku głosu w telefonie; na ekranie treningu przycisk „Głos”
 * (arkusz z trzema opcjami, zmiana trwała — ta sama wartość co w Ustawieniach). Rodzaje (docs/20): ekran, scenariusz (trening → zmiana → Ustawienia), dane (restart), VoiceOver,
 * języki, wąski ekran. Mowa w trakcie treningu i migracja: tests/voice.test.ts; E2E Maestro: 51-glos-ustawienia, 54-glos-w-treningu.
 */
import * as store from '@/lib/store';
import { applyLang, LANGS } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { EN } from '@/lib/i18n.en';
import { __setScreenReaderForTests } from '@/lib/voice';
import { completeSet } from '@/lib/setFlow';
import { fresh, saved, ex } from './helpers';
import { renderApp, flushAll, screen, tap, act, openInfo } from './app';

jest.setTimeout(60000);
const S = () => store.getState();
const V = () => global.__voice;
const INFO = [
  'Na początku przerwy telefon zapowiada następne ćwiczenie, ciężar i powtórzenia. W słuchawkach — tylko przy podłączonych słuchawkach; Także przez głośnik — również bez słuchawek, przez głośnik telefonu (także w trybie cichym); Wyłączone — bez zapowiedzi.',
  'Zapowiedzi działają, gdy włączony jest „Dźwięk na koniec przerwy”. To samo ustawienie zmienisz w menu „⋯” na ekranie treningu.',
];
beforeEach(() => { V().spoken.length = 0; V().hasVoice = true; __setScreenReaderForTests(false); G.__sheets.length = 0; });
afterEach(() => { applyLang('pl'); });
const boot = async (locale: 'pl' | 'en' = 'pl', fn: () => void = () => {}, url = '/more/settings', width?: number) => { await fresh(undefined, locale); fn(); store.save(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url, width }); await flushAll(10); };
const sel = (k: string) => screen.getByTestId(`voice-mode-${k}`);
const selected = () => ['off', 'headphones', 'speaker'].filter(k => sel(k).props.accessibilityState?.selected);
/** ActionSheetIOS w testach (tests/setup.js): wywołania zapamiętane, wybór przez sh.cb(i) */
const G = global as unknown as { __sheets: { opts: { title?: string; options: string[]; cancelButtonIndex?: number }; cb: (i: number) => void }[]; __pickSheet: (i: number) => void };
/** Dane istniejącego użytkownika sprzed 20.10.2026 (DEC-05): brak pola `voice` = „W słuchawkach”. */
const legacy = () => { delete (S().settings as { voice?: string }).voice; };
const start = () => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addSet(0); store.addSet(0); const a = S().active!; a.exercises[0].sets.forEach(x => { x.weight = 100; x.reps = 5; }); store.save(a); };
const startH = () => { start(); S().settings.voice = 'headphones'; store.save(); };

describe('Ustawienia: wybór „Zapowiedzi głosowe”', () => {
  test('trzy opcje w kolejności Wyłączone / W słuchawkach / Także przez głośnik, nowa instalacja domyślnie „Wyłączone” (DEC-05, 20.10.2026); dawnego przełącznika nie ma; ⓘ z opisem', async () => {
    await boot(); expect(screen.getByText('Zapowiedzi głosowe')).toBeTruthy(); expect(screen.getByLabelText('Zapowiedzi głosowe').props.accessibilityRole).toBe('radiogroup');
    expect(['off', 'headphones', 'speaker'].map(k => sel(k).props.accessibilityLabel)).toEqual(['Wyłączone', 'W słuchawkach', 'Także przez głośnik']); expect(selected()).toEqual(['off']); expect(S().settings.voice).toBe('off');
    expect(screen.queryByText('Głos także przez głośnik telefonu')).toBeNull(); expect(screen.queryByText('Domyślnie głos tylko w słuchawkach.')).toBeNull();
    expect(screen.queryByText(INFO[0])).toBeNull(); await openInfo('voice-mode'); for (const x of INFO) expect(screen.getByText(x)).toBeTruthy();
    expect(screen.queryByText(/^Brak głosu dla języka aplikacji/)).toBeNull();
  });
  test('istniejący użytkownik (dane bez pola voice, sprzed 20.10.2026): nadal „W słuchawkach” — bez zmiany zachowania po aktualizacji', async () => {
    await boot('pl', legacy); expect(selected()).toEqual(['headphones']); expect('voice' in S().settings).toBe(false);
  });
  test('każda opcja zapisuje wybór jawnie i przeżywa restart', async () => {
    for (const [k, want] of [['off', 'off'], ['speaker', 'speaker'], ['headphones', 'headphones']] as const) {
      await boot(); await tap(sel(k === 'off' ? 'speaker' : 'off')); await flushAll(5); await tap(sel(k)); await flushAll(5); expect([k, S().settings.voice]).toEqual([k, want]);
      await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); await flushAll(10); expect(selected()).toEqual([k]);
    }
  });
  test('dane sprzed zmiany (voiceSpeaker true) pokazują „Także przez głośnik”', async () => {
    await boot('pl', () => { legacy(); (S().settings as unknown as Record<string, unknown>).voiceSpeaker = true; }); /* zapis jak w 0.20; start aplikacji migruje */
    expect(selected()).toEqual(['speaker']); expect(S().settings.voice).toBe('speaker'); expect('voiceSpeaker' in S().settings).toBe(false);
  });
});
describe('Ustawienia: przykład i brak głosu', () => {
test('„Posłuchaj przykładu” mówi przykładową zapowiedź w języku aplikacji', async () => {
  await boot(); await tap(screen.getByText('Posłuchaj przykładu')); await flushAll(10); expect(V().spoken).toEqual([['dalej: Bench Press, 80 kilogramów, 8 powtórzeń', 'pl-PL']]);
});
test('brak głosu dla języka w telefonie: wskazówka z instrukcją pobrania (przełącznik i przykład dalej dostępne)', async () => {
  V().hasVoice = false; await boot(); expect(screen.getByText('Brak głosu dla języka aplikacji w tym telefonie. Pobierz go w Ustawieniach iOS (Dostępność).')).toBeTruthy();
  expect(screen.getByText('Posłuchaj przykładu')).toBeTruthy();
});
test('EN: etykiety, wskazówka i przykład po angielsku', async () => {
  V().hasVoice = false; await boot('en'); expect(screen.getByText('Voice announcements')).toBeTruthy(); expect(['off', 'headphones', 'speaker'].map(k => sel(k).props.accessibilityLabel)).toEqual(['Off', 'In headphones', 'Also through the speaker']); expect(screen.getByText('Listen to an example')).toBeTruthy();
  expect(screen.getByText('This phone has no voice for the app language. Download one in iOS Settings (Accessibility).')).toBeTruthy();
  await tap(screen.getByText('Listen to an example')); await flushAll(10); expect(V().spoken[0][0]).toBe('next: Bench Press, 80 kilograms, 8 reps');
});

});

/* Decyzja właściciela 14.10.2026: wskazówka „brak głosu” bez dokładnej ścieżki podmenu iOS (nazwy różnią się między wersjami i językami) — we wszystkich językach,
 * stare klucze ze ścieżką usunięte. */
const NO_VOICE = 'Brak głosu dla języka aplikacji w tym telefonie. Pobierz go w Ustawieniach iOS (Dostępność).';
test.each(LANGS.filter(l => l !== 'pl'))('brak głosu, %s: tekst jest, w nawiasie jedna nazwa działu (bez strzałki ścieżki)', l => {
  const v = l === 'en' ? EN[NO_VOICE] : LOCALES[l]?.[NO_VOICE]; expect(typeof v).toBe('string');
  expect(v).not.toMatch(/→/); expect(v).toMatch(/[(（][^()（）]+[)）]/);
});
test('brak głosu: żaden klucz słownika ani język nie zawiera starej ścieżki podmenu', () => {
  const all = [...Object.keys(EN), ...Object.values(EN), ...LANGS.filter(l => l !== 'pl' && l !== 'en').flatMap(l => Object.entries(LOCALES[l] ?? {}).flat())];
  expect(all.filter(x => /Treści mówione|Spoken Content/.test(x))).toEqual([]);
});

/* M3 p2 (ZM-02, wzorzec 30; decyzja STOP 2 z 21.10.2026): przycisk „Głos” pod „Zakończ” (19.10.2026: „ludzie odkryją to w trakcie treningu”) przeszedł do menu „⋯” treningu — ta sama funkcja,
 * ten sam arkusz z trzema opcjami, ta sama trwała zmiana (to samo pole co w Ustawieniach). */
const openMenu = async () => { await tap(screen.getByTestId('more-button')); return G.__sheets.at(-1)!; };
const voiceItem = (sh: { opts: { options: string[] } }) => sh.opts.options.findIndex(x => /^(Zapowiedzi głosowe|Voice announcements): /.test(x));
const openVoice = async () => { const m = await openMenu(); await act(async () => { G.__pickSheet(voiceItem(m)); }); await flushAll(5); return G.__sheets.at(-1)!; };
describe('ekran treningu: „Zapowiedzi głosowe” w menu „⋯”', () => {
  test('menu „⋯” ma pozycję z bieżącym wyborem; arkusz „Zapowiedzi głosowe” z trzema opcjami, bieżąca zaznaczona ✓, i Anuluj; przycisku „Głos” w treści już nie ma', async () => {
    await boot('pl', startH, '/'); expect(screen.queryByTestId('voice-btn')).toBeNull(); expect(screen.queryByText('Głos')).toBeNull();
    const m = await openMenu(); expect(m.opts.options).toContain('Zapowiedzi głosowe: W słuchawkach'); expect(m.opts.options[m.opts.options.length - 1]).toBe('Anuluj');
    await act(async () => { G.__pickSheet(voiceItem(m)); }); const sh = G.__sheets.at(-1)!; expect(sh.opts.title).toBe('Zapowiedzi głosowe'); expect(sh.opts.options).toEqual(['Wyłączone', '✓ W słuchawkach', 'Także przez głośnik', 'Anuluj']); expect(sh.opts.cancelButtonIndex).toBe(3);
  });
  test('nowa instalacja: pozycja menu pokazuje „Wyłączone” (DEC-05)', async () => {
    await boot('pl', start, '/'); expect((await openMenu()).opts.options).toContain('Zapowiedzi głosowe: Wyłączone');
  });
  test('wybór w arkuszu zmienia ustawienie trwale (to samo co w Ustawieniach); pozycja menu za stanem; Anuluj nic nie zmienia', async () => {
    await boot('pl', startH, '/');
    await openVoice(); await act(async () => { G.__pickSheet(0); }); await flushAll(5);
    expect(S().settings.voice).toBe('off'); expect((await openMenu()).opts.options).toContain('Zapowiedzi głosowe: Wyłączone');
    expect((await openVoice()).opts.options[0]).toBe('✓ Wyłączone'); await act(async () => { G.__pickSheet(2); }); await flushAll(5);
    expect(S().settings.voice).toBe('speaker'); expect((await openMenu()).opts.options).toContain('Zapowiedzi głosowe: Także przez głośnik');
    await openVoice(); await act(async () => { G.__pickSheet(3); }); await flushAll(5); expect(S().settings.voice).toBe('speaker'); /* Anuluj */
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url: '/more/settings' }); await flushAll(10); expect(selected()).toEqual(['speaker']); /* trwałe: Ustawienia po restarcie */
    await tap(sel('headphones')); await flushAll(5); expect(S().settings.voice).toBe('headphones');
  });
  test('„Wyłączone” z ekranu treningu: kolejne odhaczenie serii (słuchawki) bez zapowiedzi; powrót do „W słuchawkach” — zapowiedź wraca', async () => {
    await boot('pl', startH, '/'); V().headphones = true;
    await openVoice(); await act(async () => { G.__pickSheet(0); }); await flushAll(5);
    await act(async () => { await completeSet(0, 0); }); await flushAll(5); expect(V().spoken).toEqual([]); expect(S().active!.exercises[0].sets[0].done).toBe(true);
    await openVoice(); await act(async () => { G.__pickSheet(1); }); await flushAll(5); expect(S().settings.voice).toBe('headphones');
    await act(async () => { await completeSet(0, 1); }); await flushAll(5); expect(V().spoken).toHaveLength(1); V().headphones = false;
  });
  test('EN i 320 pt z dużym tekstem: menu i arkusz po angielsku', async () => {
    await boot('en', startH, '/', 320); const m = await openMenu(); expect(m.opts.options).toContain('Voice announcements: In headphones');
    await act(async () => { G.__pickSheet(voiceItem(m)); }); expect(G.__sheets.at(-1)!.opts.options).toEqual(['Off', '✓ In headphones', 'Also through the speaker', 'Cancel']); expect(G.__sheets.at(-1)!.opts.title).toBe('Voice announcements');
  });
});
