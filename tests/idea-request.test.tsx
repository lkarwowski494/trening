/*
 * „Poproś o nową funkcję” (decyzja właściciela 14.10.2026, docs/18 i docs/34): (1) Więcej → O aplikacji — drugi przycisk obok „Napisz do nas”, ta sama droga otwarcia poczty
 * i ten sam adres (lib/support.ts: buildSupportMailto z rodzajem wiadomości, openSupportMail), temat „Pomysł: …”, szablon z dwoma pytaniami i stopką techniczną;
 * (2) dyskretny link „Czego Ci brakuje? Poproś o funkcję” na podsumowaniu świeżo zakończonego treningu co N-ty trening (lib/review.ts IDEA, liczba produktowa), z pierwszeństwem
 * prośby o ocenę (zaległość nie przepada); pole Settings.ideaShownAt (opcjonalne, bez zmiany SCHEMA_VERSION).
 * Rodzaje (docs/20): logika (reguła N, kolizja, normalizacja), ekran (O aplikacji, podsumowanie), scenariusz (stuknięcie → mailto, brak poczty, ×, 100 treningów), macierz (języki × motyw),
 * niezmienniki (treść maila, nigdy oba na jednym ekranie, jedna reguła nie wyłącza drugiej), dane (zapis → restart, kopia → import, migracja), języki (35).
 * E2E: .maestro/15-masa-licencje.yaml (widoczność wiersza; stuknięcie poza Maestro — otwarcie poczty) oraz wyjątek „jest” dla linku na podsumowaniu (10 ukończonych treningów) w tests/przeplywy.json.
 */
import * as fs from 'fs';
import fc from 'fast-check';
import Constants from 'expo-constants';
import * as RN from 'react-native';
import { Linking, Platform } from 'react-native';
import * as store from '@/lib/store';
import { applyLang, t, tIn, LANGS } from '@/lib/i18n';
import { SUPPORT_EMAIL, buildSupportMailto } from '@/lib/support';
import { IDEA, REVIEW, ideaDecision, normalizeIdeaShownAt, reviewDecision } from '@/lib/review';
import { SCHEMA_VERSION } from '@/lib/seed';
import { buildBackup, parseBackup } from '@/lib/backup';
import { markJustFinished, onSummaryShown, ideaLinkDue } from '@/lib/review-run';
import { STORE_TIMING } from '@/lib/products';
import { fresh, seedWithDemo, addWorkout, ex, pressAlert } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

jest.setTimeout(120000);
jest.mock('expo-constants', () => ({ __esModule: true, default: { expoConfig: { version: '0.20.0' } } }));
const DAY = 86400e3; const NOW = new Date(2026, 9, 14, 12, 0).getTime(); const S = () => store.getState(); const VERSION = String(Constants.expoConfig?.version ?? '');
/** openURL jest atrapą z setupu — wywołania z poprzednich testów trzeba zerować, a nie polegać na restoreAllMocks. */
const spyOpen = () => { const m = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined as never); m.mockClear(); return m; };
const parse = (u: string) => { const [head, q] = u.split('?'); const p = Object.fromEntries(q.split('&').map(kv => kv.split('=').map(decodeURIComponent) as [string, string])); return { to: head.replace('mailto:', ''), subject: p.subject, body: p.body }; };
const resetReview = () => { global.__review.available = true; global.__review.requested = 0; global.__review.fail = false; };
afterEach(() => { applyLang('pl'); jest.restoreAllMocks(); jest.useRealTimers(); resetReview(); });

describe('lib/review: ideaDecision i stała IDEA', () => {
  test('N = 10 w jednym miejscu (lib/review.ts), liczba produktowa; kod aplikacji nie ma własnej liczby', () => {
    expect(IDEA.EVERY_N_WORKOUTS).toBe(10);
    for (const f of ['lib/review-run.ts', 'components/IdeaLink.tsx', 'app/history/[id].tsx']) expect(fs.readFileSync(f, 'utf8')).not.toMatch(/\b(?:10|N)\b\s*(?:===|%|>=)/);
    expect(fs.readFileSync('lib/review.ts', 'utf8')).toMatch(/liczba PRODUKTOWA \(nie merytoryczna\)/);
  });
  test.each([
    [0, null, 'tooSoon'], [1, null, 'tooSoon'], [9, null, 'tooSoon'], [10, null, 'show'], [11, null, 'show'], [10, 0, 'show'],
    [19, 10, 'tooSoon'], [20, 10, 'show'], [25, 10, 'show'], [11, 11, 'tooSoon'],
    [5, 10, 'tooSoon'], /* usunięto treningi: zapisany licznik większy niż liczba treningów → czekamy kolejne N */ [14, 10, 'tooSoon'],
  ] as const)('treningów %i, ostatnio pokazano przy %s, ocena nie wypada → %s', (n, last, want) => { expect(ideaDecision({ finishedWorkouts: n, lastShownAt: last, review: 'tooFewWorkouts' })).toBe(want); });
  test('kolizja: gdy należy się link i wypada prośba o ocenę → reviewFirst; gdy link jeszcze nie należy → tooSoon (powód „za wcześnie” ma pierwszeństwo)', () => {
    expect(ideaDecision({ finishedWorkouts: 10, lastShownAt: null, review: 'ask' })).toBe('reviewFirst');
    expect(ideaDecision({ finishedWorkouts: 9, lastShownAt: null, review: 'ask' })).toBe('tooSoon');
    expect(ideaDecision({ finishedWorkouts: 11, lastShownAt: null, review: 'noRecord' })).toBe('show');
  });
  test.each([[NaN], [Infinity], [-1], [undefined as never]])('zły argument finishedWorkouts=%s → badInput; zły lastShownAt → badInput', n => {
    expect(ideaDecision({ finishedWorkouts: n as number, lastShownAt: null, review: 'tooFewWorkouts' })).toBe('badInput');
  });
  test('zły lastShownAt (NaN, ujemny, tekst) → badInput; brak argumentu → badInput', () => {
    for (const bad of [NaN, -3, 'x' as never, Infinity]) expect(ideaDecision({ finishedWorkouts: 30, lastShownAt: bad, review: 'tooFewWorkouts' })).toBe('badInput');
    expect(ideaDecision(undefined as never)).toBe('badInput');
  });
  test.each([[0, 0], [10, 10], [3, 3], [-1, undefined], [2.5, undefined], [NaN, undefined], [Infinity, undefined], ['5', undefined], [null, undefined], [undefined, undefined], [{}, undefined], [[], undefined]])('normalizeIdeaShownAt(%j) → %j', (raw, want) => {
    expect(normalizeIdeaShownAt(raw)).toBe(want);
  });
  test('własność: link nigdy w treningu, w którym wypada ocena, i nigdy częściej niż co N treningów od poprzedniego pokazania', () => {
    fc.assert(fc.property(fc.array(fc.constantFrom('ask' as const, 'noRecord' as const, 'sameVersion' as const, 'tooSoon' as const), { minLength: 1, maxLength: 150 }), reviews => {
      let last: number | null = null; const shown: number[] = [];
      reviews.forEach((r, i) => { const n = i + 1; const d = ideaDecision({ finishedWorkouts: n, lastShownAt: last, review: r }); if (d === 'show') { expect(r).not.toBe('ask'); shown.push(n); last = n; } });
      for (let k = 1; k < shown.length; k++) expect(shown[k] - shown[k - 1]).toBeGreaterThanOrEqual(IDEA.EVERY_N_WORKOUTS);
      /* nie przepada: jeśli minęło ≥ N od ostatniego pokazania i ostatni trening nie miał oceny, link pokazano */
      const lastN = reviews.length; const gap = lastN - (shown.length ? shown[shown.length - 1] : 0);
      if (gap >= IDEA.EVERY_N_WORKOUTS) expect(reviews[lastN - 1]).toBe('ask');
    }), { numRuns: 200 });
  });
  test('100 treningów z rekordem co trening: ocena pojawia się (raz na wersję), link też — i nigdy w tym samym treningu', () => {
    let lastAsked: { at: number; version: string } | null = null; let lastIdea: number | null = null; const asked: number[] = []; const ideas: number[] = [];
    for (let n = 1; n <= 100; n++) {
      const now = NOW + n * 2 * DAY; const d = reviewDecision({ now, finishedWorkouts: n, justFinishedHasRecord: true, version: VERSION, lastAsked });
      const i = ideaDecision({ finishedWorkouts: n, lastShownAt: lastIdea, review: d });
      expect([n, d === 'ask' && i === 'show']).toEqual([n, false]);
      if (d === 'ask') { lastAsked = { at: now, version: VERSION }; asked.push(n); }
      if (i === 'show') { lastIdea = n; ideas.push(n); }
    }
    expect(asked).toEqual([REVIEW.MIN_WORKOUTS]);
    expect(ideas).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });
  test('100 treningów, ocena wypada dokładnie na 10. (rekord dopiero tam): ocena na 10., link przesunięty na 11., potem co 10 od 11.', () => {
    let lastAsked: { at: number; version: string } | null = null; let lastIdea: number | null = null; const asked: number[] = []; const ideas: number[] = [];
    for (let n = 1; n <= 100; n++) {
      const now = NOW + n * 2 * DAY; const d = reviewDecision({ now, finishedWorkouts: n, justFinishedHasRecord: n >= 10, version: VERSION, lastAsked });
      const i = ideaDecision({ finishedWorkouts: n, lastShownAt: lastIdea, review: d });
      expect([n, d === 'ask' && i === 'show']).toEqual([n, false]);
      if (d === 'ask') { lastAsked = { at: now, version: VERSION }; asked.push(n); }
      if (i === 'show') { lastIdea = n; ideas.push(n); }
    }
    expect(asked).toEqual([10]); expect(ideas).toEqual([11, 21, 31, 41, 51, 61, 71, 81, 91]);
  });
  test('100 treningów, nowa wersja co 25 treningów (ocena znów wolno, odstęp 14 dni): obie reguły działają, nigdy razem', () => {
    let lastAsked: { at: number; version: string } | null = null; let lastIdea: number | null = null; let askedN = 0; let ideaN = 0;
    for (let n = 1; n <= 100; n++) {
      const now = NOW + n * 2 * DAY; const version = `0.${20 + Math.floor(n / 25)}.0`; const d = reviewDecision({ now, finishedWorkouts: n, justFinishedHasRecord: true, version, lastAsked });
      const i = ideaDecision({ finishedWorkouts: n, lastShownAt: lastIdea, review: d });
      expect([n, d === 'ask' && i === 'show']).toEqual([n, false]);
      if (d === 'ask') { lastAsked = { at: now, version }; askedN++; }
      if (i === 'show') { lastIdea = n; ideaN++; }
    }
    expect(askedN).toBeGreaterThanOrEqual(4); expect(ideaN).toBeGreaterThanOrEqual(8);
  });
});

describe('lib/support: wiadomość „Pomysł” i wspólna funkcja', () => {
  test('PL: ten sam adres co „Napisz do nas”, temat „Pomysł: ”, szablon: czego brakuje / w jakiej sytuacji na treningu / stopka techniczna; kodowanie bez surowych spacji i nowych linii', () => {
    const u = buildSupportMailto({ version: '0.20.0 (1120)', os: '18.1', language: 'pl', kind: 'idea' });
    expect(u).toMatch(/^mailto:support@apps4brew\.com\?subject=[^ \n]+&body=[^ \n]+$/);
    expect(parse(u)).toEqual({ to: SUPPORT_EMAIL, subject: 'Pomysł: ', body: '\n\nCzego brakuje:\n\nW jakiej sytuacji na treningu:\n\n\nWersja: 0.20.0 (1120) · iOS 18.1 · Język: pl' });
    expect(parse(buildSupportMailto({ version: '1', os: 1, language: 'pl' })).to).toBe(parse(u).to);
  });
  test('rodzaj domyślny to opinia: „Napisz do nas” bez zmian (temat „Trening — opinia”, sama stopka)', () => {
    expect(parse(buildSupportMailto({ version: '1', os: '17', language: 'pl' }))).toEqual({ to: SUPPORT_EMAIL, subject: 'Trening — opinia', body: '\n\nWersja: 1 · iOS 17 · Język: pl' });
    expect(buildSupportMailto({ version: '1', os: '17', language: 'pl', kind: 'feedback' })).toBe(buildSupportMailto({ version: '1', os: '17', language: 'pl' }));
  });
  test('EN: temat „Idea: ”, pytania i stopka po angielsku', () => {
    applyLang('en'); const p = parse(buildSupportMailto({ version: '1 & #2', os: 18, language: 'en', kind: 'idea' }));
    expect(p.subject).toBe('Idea: '); expect(p.body).toBe('\n\nWhat’s missing:\n\nIn what situation during a workout:\n\n\nVersion: 1 & #2 · iOS 18 · Language: en');
  });
  test.each(LANGS.map(l => [l]))('35 języków: %s — temat zaczyna się przetłumaczonym słowem „Pomysł”, pytania niepuste, adres ten sam', l => {
    applyLang(l); const p = parse(buildSupportMailto({ version: '1', os: '17', language: l, kind: 'idea' }));
    expect(p.to).toBe(SUPPORT_EMAIL); expect(p.subject).toBe(`${tIn(l, 'Pomysł')}: `); expect(p.subject.trim().length).toBeGreaterThanOrEqual(3);
    const lines = p.body.split('\n').filter(Boolean); expect(lines).toHaveLength(3); expect(lines[0]).toBe(tIn(l, 'Czego brakuje:')); expect(lines[1]).toBe(tIn(l, 'W jakiej sytuacji na treningu:'));
    if (l !== 'pl') { expect(tIn(l, 'Poproś o nową funkcję')).not.toBe('Poproś o nową funkcję'); expect(tIn(l, 'Czego Ci brakuje? Poproś o funkcję')).not.toBe('Czego Ci brakuje? Poproś o funkcję'); }
    expect(p.body).not.toMatch(/\{\w+\}/);
  });
  test('niezmiennik: treść pomysłu to tylko dwa pytania i stopka techniczna — bez historii, masy ciała, nazw szablonów, identyfikatorów, kopii, UDID, nazw innych aplikacji', async () => {
    await fresh(seedWithDemo(), 'pl'); const names = (S().templates ?? []).map((x: { name: string }) => x.name).filter(Boolean); expect(names.length).toBeGreaterThan(0);
    const u = buildSupportMailto({ version: '0.20.0', os: '18.1', language: 'pl', kind: 'idea' }); const p = parse(u);
    expect(p.body.split('\n').filter(Boolean)).toHaveLength(3); for (const n of names) expect(decodeURIComponent(u)).not.toContain(n);
    expect(decodeURIComponent(u)).not.toMatch(/ownerId|schemaVersion|workouts|bodyWeight|kg\b|[0-9a-f]{8}-[0-9a-f]{4}-|udid/i); expect(u).not.toMatch(/[?&](cc|bcc|attach)=/i);
  });
  test('jedna wspólna funkcja: ekran O aplikacji i link na podsumowaniu wołają openSupportMail; żadne nie składa adresu mailto samo ani nie wywołuje canOpenURL', () => {
    for (const f of ['app/more/about.tsx', 'components/IdeaLink.tsx']) { const src = fs.readFileSync(f, 'utf8'); expect(src).toContain('openSupportMail'); expect(src).not.toMatch(/mailto:|buildSupportMailto|openURL|canOpenURL/); }
  });
});

describe('dane: Settings.ideaShownAt bez zmiany schematu', () => {
  test('SCHEMA_VERSION bez zmian (19); stan bez linku nie ma pola; zapis → restart zachowuje; zła wartość znika przy wczytaniu', async () => {
    expect(SCHEMA_VERSION).toBe(19); await fresh(); expect('ideaShownAt' in S().settings).toBe(false);
    S().settings.ideaShownAt = 10; store.saveCfg(); await store.flush(); const raw = JSON.parse(global.__kv.get('state')!); expect(raw.settings.ideaShownAt).toBe(10);
    await fresh(raw); expect(S().settings.ideaShownAt).toBe(10);
    for (const bad of [-1, 2.5, 'x', null, {}, NaN]) { await fresh({ ...raw, settings: { ...raw.settings, ideaShownAt: bad } }); expect('ideaShownAt' in S().settings).toBe(false); }
  });
  test('kopia zapasowa → import: pole wraca (po przywróceniu nie pokazujemy linku od razu ponownie); kopia bez pola — bez pola; migracja idempotentna', async () => {
    await fresh(); S().settings.ideaShownAt = 20; const b = JSON.parse(JSON.stringify(buildBackup())); expect(b.state.settings.ideaShownAt).toBe(20);
    const p = parseBackup(JSON.stringify(b)); expect(p.settings.ideaShownAt).toBe(20); delete b.state.settings.ideaShownAt; expect('ideaShownAt' in parseBackup(JSON.stringify(b)).settings).toBe(false);
    const once = store.migrate(JSON.parse(JSON.stringify(p))); expect(store.migrate(JSON.parse(JSON.stringify(once)))).toEqual(once);
  });
  test('kopia z samym polem w złym typie nie psuje reszty ustawień (pole znika, inne ustawienia zostają)', async () => {
    await fresh(); S().settings.ideaShownAt = 10; S().settings.defaultRest = 77; const b = JSON.parse(JSON.stringify(buildBackup())); b.state.settings.ideaShownAt = 'abc';
    const p = parseBackup(JSON.stringify(b)); expect('ideaShownAt' in p.settings).toBe(false); expect(p.settings.defaultRest).toBe(77);
  });
});

describe('O aplikacji: przycisk „Poproś o nową funkcję”', () => {
  const boot = async (locale: 'pl' | 'en' = 'pl') => { await fresh(seedWithDemo(), locale); await renderApp({ locale, url: '/more/about' }); await flushAll(10); };
  test('ekran PL: przycisk zaraz pod „Napisz do nas”, przed licencjami; VoiceOver: rola przycisk, podpowiedź „Otwiera aplikację Mail”, język pl; dwa przyciski różne', async () => {
    await boot(); const row = screen.getByLabelText('Poproś o nową funkcję');
    expect(row.props.accessibilityRole).toBe('button'); expect(row.props.accessibilityHint).toBe('Otwiera aplikację Mail'); expect(row.props.accessibilityLanguage).toBe('pl');
    const order = screen.getAllByRole('button').map(b => b.props.accessibilityLabel).filter(Boolean);
    expect(order.indexOf('Poproś o nową funkcję')).toBe(order.indexOf('Napisz do nas') + 1); expect(order.indexOf('Poproś o nową funkcję')).toBeLessThan(order.findIndex((l: string) => /licencje|licences/i.test(l)));
  });
  test('ekran EN: etykieta „Request a new feature”, podpowiedź „Opens the Mail app”', async () => {
    await boot('en'); const row = screen.getByLabelText('Request a new feature'); expect(row.props.accessibilityHint).toBe('Opens the Mail app'); expect(row.props.accessibilityLanguage).toBe('en');
  });
  test('wciśnięcie woła Linking.openURL raz, z tym samym adresem co „Napisz do nas”, tematem „Pomysł: ” i szablonem; bez okna błędu', async () => {
    const open = spyOpen(); await boot();
    await tap(screen.getByLabelText('Napisz do nas')); await flushAll(10); await tap(screen.getByLabelText('Poproś o nową funkcję')); await flushAll(10);
    expect(open).toHaveBeenCalledTimes(2); const fb = parse(open.mock.calls[0][0]); const idea = parse(open.mock.calls[1][0]);
    expect(idea.to).toBe(fb.to); expect(idea.to).toBe(SUPPORT_EMAIL); expect(idea.subject).toBe('Pomysł: ');
    expect(idea.body).toMatch(new RegExp(`^\\n\\nCzego brakuje:\\n\\nW jakiej sytuacji na treningu:\\n\\n\\nWersja: .+ · iOS ${String(Platform.Version).replace('.', '\\.')} · Język: pl$`));
    expect(global.__alerts).toHaveLength(0); expect(screen.queryByTestId('support-mail-fallback')).toBeNull();
  });
  test('brak poczty (openURL odrzucone): to samo okno i adres do zaznaczenia co przy „Napisz do nas”; ekran działa dalej; EN i wyjątek synchroniczny też', async () => {
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('no mail')); await boot();
    await tap(screen.getByLabelText('Poproś o nową funkcję')); await flushAll(10);
    expect(global.__alerts).toHaveLength(1); expect(global.__alerts[0].title).toBe('Nie udało się otworzyć poczty'); expect(global.__alerts[0].msg).toBe(`Napisz na: ${SUPPORT_EMAIL}`);
    expect((global.__alerts[0].buttons as { text: string }[]).map(b => b.text)).toEqual(['OK']);
    const fb = screen.getByTestId('support-mail-fallback'); expect(fb.props.selectable).toBe(true); expect(fb.props.children).toBe(`Napisz na: ${SUPPORT_EMAIL}`); expect(screen.getByLabelText('Poproś o nową funkcję')).toBeTruthy();
  });
  test('brak poczty, EN, wyjątek synchroniczny', async () => {
    jest.spyOn(Linking, 'openURL').mockImplementation(() => { throw new Error('sync'); }); await boot('en');
    await tap(screen.getByLabelText('Request a new feature')); await flushAll(10);
    expect(global.__alerts[0].title).toBe('Couldn’t open Mail'); expect(global.__alerts[0].msg).toBe(`Write to: ${SUPPORT_EMAIL}`);
  });
  test.each([['pl', 'light'], ['pl', 'dark'], ['en', 'light'], ['en', 'dark']] as const)('macierz: %s × %s — przycisk renderuje się obok „Napisz do nas”', async (loc, mode) => {
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => mode) as never); await boot(loc);
    expect(screen.getByLabelText(loc === 'pl' ? 'Poproś o nową funkcję' : 'Request a new feature')).toBeTruthy(); expect(screen.getByLabelText(loc === 'pl' ? 'Napisz do nas' : 'Write to us')).toBeTruthy();
  });
});

describe('podsumowanie treningu: link „Czego Ci brakuje? Poproś o funkcję”', () => {
  const finishOnScreen = async () => { await tap(screen.getByText('Finish')); await act(async () => { pressAlert('Finish workout?', 'Finish'); }); await flushAll(600); global.__alerts.length = 0; /* potwierdzenie „Finish workout?” nie jest przedmiotem tych testów */ };
  /** `prior` treningów w historii (bez rekordu na ostatnim, o ile record=false), potem trening na żywo kończony w interfejsie. */
  async function session(prior: number, opts: { record?: boolean; reviewed?: boolean; locale?: 'pl' | 'en' } = {}) {
    const locale = opts.locale ?? 'en'; jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); resetReview();
    for (let i = 0; i < prior; i++) { const w = addWorkout(NOW - (prior - i) * 2 * DAY, [['Back Squat', [{ weight: 100 - i, reps: 5, done: true }]]], 'Upper A'); w.live = true; }
    if (opts.reviewed) S().settings.reviewAsked = { at: NOW - 30 * DAY, version: VERSION };
    store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); S().active!.exercises[0].sets = S().active!.exercises[0].sets.slice(0, 1);
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(require('./helpers').saved())), locale }); jest.setSystemTime(NOW); await flushAll(10);
    await act(async () => { const s = S().active!.exercises[0].sets[0]; s.weight = opts.record === false ? 40 : 200; s.reps = 5; store.toggleDone(0, 0); }); await flushAll(10);
  }
  const link = () => screen.queryByTestId('idea-link');

  test('10. trening (bez rekordu, więc bez oceny): po „Finish” na podsumowaniu jest link; etykieta i podpowiedź VoiceOver, ✕ ma etykietę „Close”; licznik zapisany; ocena nie jest proszona', async () => {
    await session(9, { record: false }); await finishOnScreen();
    expect(link()).toBeTruthy(); const open = screen.getByTestId('idea-link-open');
    expect(open.props.accessibilityLabel).toBe('Missing something? Request a feature'); expect(open.props.accessibilityHint).toBe('Opens the Mail app'); expect(open.props.accessibilityRole).toBe('button'); expect(open.props.accessibilityLanguage).toBe('en');
    expect(screen.getByTestId('idea-link-close').props.accessibilityLabel).toBe('Close'); expect(screen.getByTestId('idea-link-close').props.accessibilityRole).toBe('button');
    expect(S().settings.ideaShownAt).toBe(10);
    await act(async () => { jest.advanceTimersByTime(STORE_TIMING.REVIEW_DELAY_MS + 100); await Promise.resolve(); await Promise.resolve(); }); expect(global.__review.requested).toBe(0);
  });
  test('9. trening: bez linku, licznik nietknięty', async () => { await session(8, { record: false }); await finishOnScreen(); expect(link()).toBeNull(); expect('ideaShownAt' in S().settings).toBe(false); });
  test('stuknięcie linku otwiera pocztę (mailto na adres wsparcia, temat „Idea: ”) i nie zamyka linku; brak poczty → okno z adresem (jak „Napisz do nas”)', async () => {
    const open = spyOpen(); await session(9, { record: false }); await finishOnScreen();
    await tap(screen.getByTestId('idea-link-open')); await flushAll(10); expect(open).toHaveBeenCalledTimes(1); const p = parse(open.mock.calls[0][0]);
    expect(p.to).toBe(SUPPORT_EMAIL); expect(p.subject).toBe('Idea: '); expect(p.body).toContain('What’s missing:'); expect(global.__alerts).toHaveLength(0); expect(link()).toBeTruthy();
    open.mockRejectedValue(new Error('no mail')); await tap(screen.getByTestId('idea-link-open')); await flushAll(10);
    expect(global.__alerts).toHaveLength(1); expect(global.__alerts[0].title).toBe('Couldn’t open Mail'); expect(global.__alerts[0].msg).toBe(`Write to: ${SUPPORT_EMAIL}`);
  });
  test('✕ zamyka link bez skutków ubocznych: poczta się nie otwiera, brak okien, stan treningów i ustawień bez zmian (poza licznikiem zapisanym przy pokazaniu)', async () => {
    const open = spyOpen(); await session(9, { record: false }); await finishOnScreen();
    const before = JSON.stringify({ w: S().workouts, s: S().settings }); await tap(screen.getByTestId('idea-link-close')); await flushAll(10);
    expect(link()).toBeNull(); expect(open).not.toHaveBeenCalled(); expect(global.__alerts).toHaveLength(0); expect(JSON.stringify({ w: S().workouts, s: S().settings })).toBe(before);
    expect(S().settings.ideaShownAt).toBe(10);
  });
  test('kolizja z oceną: 10. trening z rekordem → system dostaje prośbę o ocenę, a linku NIE MA (licznik nietknięty); następny trening (ocena już niedostępna w tej wersji) → link', async () => {
    await session(9, { record: true }); await finishOnScreen();
    expect(link()).toBeNull(); expect('ideaShownAt' in S().settings).toBe(false);
    await act(async () => { jest.advanceTimersByTime(STORE_TIMING.REVIEW_DELAY_MS + 100); await Promise.resolve(); await Promise.resolve(); }); expect(global.__review.requested).toBe(1);
    expect(screen.queryByText(/rate|review/i)).toBeNull(); /* aplikacja nie ma własnego okna oceny */
    /* następny trening w tym samym stanie */
    const w = addWorkout(NOW + DAY, [['Back Squat', [{ weight: 300, reps: 5, done: true }]]], 'Upper A'); w.live = true; markJustFinished(w.id);
    const cb = jest.fn(); onSummaryShown(w, cb); await act(async () => { for (let i = 0; i < 6; i++) await Promise.resolve(); jest.advanceTimersByTime(STORE_TIMING.REVIEW_DELAY_MS + 100); await Promise.resolve(); });
    expect(cb).toHaveBeenCalledTimes(1); expect(S().settings.ideaShownAt).toBe(11); expect(global.__review.requested).toBe(1);
  });
  test('otwarcie starego treningu z historii nie pokazuje linku (tylko świeżo zakończony), nawet gdy należałby się', async () => {
    await session(9, { record: false }); await finishOnScreen(); S().settings.ideaShownAt = 0; delete S().settings.ideaShownAt;
    const id = S().workouts[S().workouts.length - 1].id; await act(async () => { require('expo-router').router.push('/history'); }); await flushAll(10);
    await act(async () => { require('expo-router').router.push(`/history/${encodeURIComponent(id)}`); }); await flushAll(30); expect(link()).toBeNull();
  });
  test('PL: etykiety po polsku, ✕ „Zamknij”, podpowiedź „Otwiera aplikację Mail”', async () => {
    await session(9, { record: false, locale: 'pl' }); await tap(screen.getByText('Zakończ')); await act(async () => { pressAlert('Zakończyć trening?', 'Zakończ'); }); await flushAll(600);
    const open = screen.getByTestId('idea-link-open'); expect(open.props.accessibilityLabel).toBe('Czego Ci brakuje? Poproś o funkcję'); expect(open.props.accessibilityHint).toBe('Otwiera aplikację Mail'); expect(screen.getByTestId('idea-link-close').props.accessibilityLabel).toBe('Zamknij');
  });
  test.each([['light'], ['dark']] as const)('macierz motywu: %s — link renderuje się', async mode => {
    jest.spyOn(RN, 'useColorScheme').mockImplementation((() => mode) as never); await session(9, { record: false }); await finishOnScreen(); expect(link()).toBeTruthy();
  });
  test('rozmiary dotyku: pole linku i ✕ mają co najmniej 44 pt', async () => {
    await session(9, { record: false }); await finishOnScreen();
    const sz = (id: string) => { const st = RN.StyleSheet.flatten(screen.getByTestId(id).props.style); return st; };
    expect(sz('idea-link-open').minHeight).toBeGreaterThanOrEqual(44); expect(sz('idea-link-close').minHeight).toBeGreaterThanOrEqual(44); expect(sz('idea-link-close').minWidth).toBeGreaterThanOrEqual(44);
  });
});

describe('scenariusz: 100 treningów przez ekran podsumowania (store + review-run)', () => {
  /** Kończy kolejny trening tak jak ekran: znacznik „świeżo zakończony”, onSummaryShown, upływ opóźnienia oceny. */
  async function finishNext(i: number, record: boolean, shown: number[]) {
    const kg = record ? 500 + i : 100 - Math.min(i, 90); const w = addWorkout(NOW + i * 2 * DAY, [['Back Squat', [{ weight: kg, reps: 5, done: true }]]], 'Upper A'); w.live = true; S().active = null;
    jest.setSystemTime(NOW + i * 2 * DAY); markJustFinished(w.id); const before = global.__review.requested;
    onSummaryShown(w, () => shown.push(i)); await act(async () => { for (let k = 0; k < 6; k++) await Promise.resolve(); jest.advanceTimersByTime(STORE_TIMING.REVIEW_DELAY_MS + 50); await Promise.resolve(); await Promise.resolve(); });
    return global.__review.requested - before;
  }
  test('rekord co trening: ocena raz (5.), link co 10 (10, 20, …, 100); nigdy w jednym treningu', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); resetReview(); const shown: number[] = []; const asked: number[] = [];
    for (let i = 1; i <= 100; i++) { if ((await finishNext(i, true, shown)) > 0) asked.push(i); }
    expect(asked).toEqual([5]); expect(shown).toEqual([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]); expect(S().settings.ideaShownAt).toBe(100);
  });
  test('rekord dopiero od 10.: ocena na 10., link przesunięty na 11. i dalej co 10 (11, 21, …, 91) — żadna reguła nie wyłącza drugiej', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); resetReview(); const shown: number[] = []; const asked: number[] = [];
    for (let i = 1; i <= 100; i++) { if ((await finishNext(i, i >= 10, shown)) > 0) asked.push(i); }
    expect(asked).toEqual([10]); expect(shown).toEqual([11, 21, 31, 41, 51, 61, 71, 81, 91]);
  });
  test('ideaLinkDue: ocena niedostępna w TestFlight (moduł nie pokazuje okna) — reguła i tak ustępuje bramce oceny (decyzja: pierwszeństwo oceny); bez rekordów link co 10', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); resetReview(); global.__review.available = false; const shown: number[] = [];
    for (let i = 1; i <= 30; i++) await finishNext(i, false, shown);
    expect(shown).toEqual([10, 20, 30]);
  });
  test('ideaLinkDue bez znacznika „świeżo zakończony” nie jest wołane przez onSummaryShown; wywołanie bezpośrednie zapisuje licznik tylko przy pokazaniu', async () => {
    jest.useFakeTimers({ now: NOW }); await fresh(); resetReview(); const cb = jest.fn();
    for (let i = 1; i <= 10; i++) { const w = addWorkout(NOW - (11 - i) * DAY, [['Back Squat', [{ weight: 100 - i, reps: 5, done: true }]]], 'T'); w.live = true; }
    const last = S().workouts[S().workouts.length - 1]; onSummaryShown(last, cb); await act(async () => { for (let k = 0; k < 6; k++) await Promise.resolve(); }); expect(cb).not.toHaveBeenCalled(); expect('ideaShownAt' in S().settings).toBe(false);
    expect(ideaLinkDue(last, NOW)).toBe(true); expect(S().settings.ideaShownAt).toBe(10); expect(ideaLinkDue(last, NOW)).toBe(false);
  });
});
