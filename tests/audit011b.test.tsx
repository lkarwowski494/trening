/* Audyt zmian 0.11, część 2 (09.10.2026):
 * A11B-1 (WYSOKA) — osierocony szkic edycji (pamięć lib/draft.ts i klucz bazy „drafts”) przeżywał import kopii i reset danych: „Edytuj” po imporcie
 *   pokazywało wartości ze starego szkicu, a „Zapisz” (albo „Wróć do edycji” po restarcie) nadpisywało nimi dane z kopii. Naprawa (wariant A):
 *   store.replaceState (import i „Wyczyść wszystkie dane”) czyści wszystkie szkice — ćwiczeń i szablonów (pamięć i baza) oraz edycji historii (lib/edit.ts).
 * A11B-2 / A11B-6 — teksty generatora (cel „Ogólny”) nie mówią więcej niż źródła (docs/research/30 G6, c8, c29).
 * A11B-8 — wersja 0.11.0 i wpis „Co nowego” 0.11. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as draft from '@/lib/draft';
import * as edit from '@/lib/edit';
import * as backup from '@/lib/backup';
import { fresh, saved, ex, addWorkout, pressAlert } from './helpers';
import { renderApp, flushAll, screen, act, go, startEdit, saveEdit, tap } from './app';
import type { Exercise, Template } from '@/lib/seed';
import { generate, previewWarnings, GENERAL_SETS, GENERAL_SETS_RANGE, ACSM_MIN_SETS, MIN_DAYS } from '@/lib/generator';
import { LANGS, tIn, applyLang } from '@/lib/i18n';
import { EN } from '@/lib/i18n.en';

jest.setTimeout(120000);
const S = () => store.getState();
afterEach(async () => { try { S(); } catch { return; } await timer.stop(); await timer.stopSet(); });
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const item = (e: { id: string }) => ({ id: Math.random().toString(36).slice(2), exerciseId: e.id, sets: 3, repMin: null, repMax: null, restSec: null, startWeight: '' as const, targetSec: '' as const, groupId: null });
/** Kopia obecnego stanu z inną notatką ćwiczenia (ta sama instalacja — te same id). */
const backupWith = (id: string, notes: string) => { const b = JSON.parse(JSON.stringify(backup.buildBackup())); b.state.exercises.find((x: Exercise) => x.id === id).notes = notes; return b; };
/** Import przez prawdziwą ścieżkę (wybór pliku → importBackup). */
async function importFile(b: unknown) {
  const pick = require('expo-document-picker').getDocumentAsync as jest.Mock; pick.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/k.json' }] }));
  (require('expo-file-system/legacy').readAsStringAsync as jest.Mock).mockImplementationOnce(async () => JSON.stringify(b));
  let ok = false; await act(async () => { ok = await backup.importBackup(); }); return ok;
}

describe('A11B-1: import kopii i reset czyszczą szkice edycji', () => {
  beforeEach(() => { draft.__resetObjDrafts(); edit.__resetDrafts(); });

  test('regresja (dowód audytu, test B): sierota po „Wróć do edycji” przy pierwszym szkicu nie nadpisuje ćwiczenia z kopii', async () => {
    jest.useFakeTimers({ now: new Date(2026, 9, 8, 9).getTime() });
    try {
      await fresh(); const id = S().exercises.find(x => x.lib)!.id;
      const tp = store.newTemplate(); tp.name = 'Mój'; store.save(tp); await store.flush();
      const dt = draft.beginObjDraft<Template>('template', tp.id)!; dt.name = 'Mój 2'; store.save(dt);
      const de = draft.beginObjDraft<Exercise>('exercise', id)!; de.notes = 'STARA notatka ze szkicu'; store.save(de);
      jest.advanceTimersByTime(400); await Promise.resolve(); await store.flush();
      const kv = new Map(global.__kv);
      draft.__resetObjDrafts(); global.__kv.clear(); kv.forEach((v, k) => global.__kv.set(k, v)); store.__resetForTests(); await store.init();
      expect(draft.restoreObjDrafts().map(x => x.kind)).toEqual(['template', 'exercise']);
      draft.commitObjDraft('template', tp.id); /* „Wróć do edycji” → „Zapisz” przy szablonie; szkic ćwiczenia zostaje bez ekranu */
      const b = JSON.parse(JSON.stringify(S())); b.exercises.find((x: Exercise) => x.id === id).notes = 'Notatka z KOPII';
      store.replaceState(b); await store.flush();
      expect(draft.objDraft('exercise', id)).toBeUndefined();
      expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
      const again = draft.beginObjDraft<Exercise>('exercise', id)!; expect(again.notes).toBe('Notatka z KOPII');
      draft.commitObjDraft('exercise', id); expect(store.exById(id)!.notes).toBe('Notatka z KOPII');
    } finally { jest.useRealTimers(); }
  });

  test('store.onStateReplaced: zarejestrowane czyszczenie działa przy każdym replaceState (import, reset), nie przy zwykłym zapisie', async () => {
    await fresh(); const cb = jest.fn(); store.onStateReplaced(cb);
    store.save(); expect(cb).not.toHaveBeenCalled();
    store.replaceState(JSON.parse(JSON.stringify(S()))); expect(cb).toHaveBeenCalledTimes(1);
    store.resetAll(); await store.flush(); expect(cb).toHaveBeenCalledTimes(2);
  });

  test('„Wyczyść wszystkie dane” (resetAll) czyści szkice w pamięci i w bazie', async () => {
    await fresh(); const id = ex('Back Squat').id; const d = draft.beginObjDraft<Exercise>('exercise', id)!; d.notes = 'x'; store.save(d); await store.flush();
    expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(true);
    store.resetAll(); await store.flush();
    expect(draft.objDraft('exercise', id)).toBeUndefined(); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
  });

  test('import czyści też szkic edycji treningu z historii (lib/edit.ts) — „Edytuj” sesji zaczyna od danych z kopii', async () => {
    await fresh(); const w = addWorkout(Date.now() - 86400000, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.save();
    const d = edit.beginEdit(w.id)!; d.w.exercises[0].sets[0].weight = 1; edit.touchDraft();
    store.replaceState(JSON.parse(JSON.stringify(S()))); await store.flush();
    expect(edit.draftOf(w.id)).toBeUndefined();
  });

  test('scenariusz: dwa szkice po zamknięciu → „Wróć do edycji” (szablon) → „Zapisz” → import kopii → ćwiczenie „Edytuj” → „Zapisz” zachowuje dane z kopii; restart bez pytania o stary szkic', async () => {
    await fresh(); const e = ex('Back Squat'); const tp = store.newTemplate(); tp.name = 'Push'; tp.items.push(item(e)); store.save(tp);
    const dt = draft.beginObjDraft<Template>('template', tp.id)!; dt.name = 'Push+'; store.save(dt);
    const de = draft.beginObjDraft<Exercise>('exercise', e.id)!; de.notes = 'STARA notatka ze szkicu'; store.save(de); await store.flush();
    const kv: Record<string, string> = {}; global.__kv.forEach((v, k) => { if (k !== 'state') kv[k] = v; }); const state = saved(); draft.__resetObjDrafts();
    await renderApp({ saved: state, kv }); await flushAll(700);
    expect(lastAlert()).toMatchObject({ title: 'Niezapisane zmiany', msg: 'Aplikacja zamknęła się w trakcie edycji szablonu „Push+”. Wrócić do edycji?' });
    await act(async () => { pressAlert('Niezapisane zmiany', 'Wróć do edycji'); }); await flushAll(20);
    await tap(screen.getByLabelText('Zapisz szablon')); await flushAll(20);
    expect(S().templates.find(x => x.id === tp.id)!.name).toBe('Push+');
    expect(draft.objDraft<Exercise>('exercise', e.id)?.notes).toBe('STARA notatka ze szkicu'); /* sierota — pytanie przy następnym starcie albo „Edytuj” */
    expect(await importFile(backupWith(e.id, 'Notatka z KOPII'))).toBe(true); await flushAll(400);
    expect(store.exById(e.id)!.notes).toBe('Notatka z KOPII'); expect(global.__kv.has(draft.DRAFTS_KEY)).toBe(false);
    await go(`/exercise/${e.id}`); await flushAll(10); await startEdit();
    expect(screen.queryByDisplayValue('STARA notatka ze szkicu')).toBeNull();
    await saveEdit(); expect(store.exById(e.id)!.notes).toBe('Notatka z KOPII');
    /* restart po imporcie: brak okna „Niezapisane zmiany” o szkicu sprzed importu */
    await act(async () => { await store.flush(); }); const n = global.__alerts.length;
    const kv2: Record<string, string> = {}; global.__kv.forEach((v, k) => { if (k !== 'state') kv2[k] = v; }); draft.__resetObjDrafts();
    await renderApp({ saved: saved(), kv: kv2 }); await flushAll(700);
    expect(global.__alerts.slice(n).filter(a => a.title === 'Niezapisane zmiany')).toHaveLength(0);
    expect(store.exById(e.id)!.notes).toBe('Notatka z KOPII');
  });
});

/* ---------- A11B-2 / A11B-6: teksty celu „Ogólny” nie mówią więcej niż źródła (docs/research/30) ---------- */
const NOW = new Date(2026, 9, 8, 9, 0);
const showGenerator = async (locale: 'pl' | 'en') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url: '/generator' }); jest.setSystemTime(NOW.getTime()); await flushAll(10);
  await tap(screen.getByText(locale === 'pl' ? 'Ogólny' : 'General fitness')); await flushAll(5);
};
/** Wszystkie 25 tłumaczeń klucza (bez PL): parametry zachowane, tekst przetłumaczony. */
const allLangs = (key: string, params: string[]) => {
  for (const l of LANGS) { if (l === 'pl') continue; const v = tIn(l, key); expect([l, params.filter(p => !v.includes(p)), v === key]).toEqual([l, [], false]); }
};

describe('A11B-2: punkt „Serie” celu „Ogólny” — „jedna seria działa” to wytyczne USA 2018 (c8) i ACSM 2011 (c4), ACSM 2026 zaleca co najmniej 2 (22/7g)', () => {
  const KEY = 'Serie: {s} na ćwiczenie — dla zdrowia zwykle {s}–{b}. ACSM 2026 zaleca co najmniej {m}. Wytyczne USA 2018: jedna seria działa, {s}–{b} mogą działać lepiej; ACSM 2011: jedna seria może wystarczyć, zwłaszcza u początkujących i starszych. {s} to dolna granica — uproszczenie.';
  const OLD = 'Serie: {s} na ćwiczenie — dla zdrowia zwykle {s}–{b} (wytyczne USA 2018, ACSM 2011, ACSM 2026: jedna seria działa, więcej zwykle trochę lepiej); {s} to dolna granica — uproszczenie.';
  afterEach(() => { applyLang('pl'); }); /* jak tests/gen-general-ui: zegar udawany zostaje do sprzątania ekranu (useRealTimers przed nim zawiesza sprzątanie) */
  test('PL: tekst na ekranie z liczbami ze stałych (GENERAL_SETS, GENERAL_SETS_RANGE, ACSM_MIN_SETS); dawnego zdania nie ma', async () => {
    await showGenerator('pl'); const s = GENERAL_SETS, b = GENERAL_SETS_RANGE[1];
    expect(screen.getByText(`• Serie: ${s} na ćwiczenie — dla zdrowia zwykle ${s}–${b}. ACSM 2026 zaleca co najmniej ${ACSM_MIN_SETS}. Wytyczne USA 2018: jedna seria działa, ${s}–${b} mogą działać lepiej; ACSM 2011: jedna seria może wystarczyć, zwłaszcza u początkujących i starszych. ${s} to dolna granica — uproszczenie.`)).toBeTruthy();
    expect(screen.queryByText(/ACSM 2026: jedna seria/)).toBeNull();
  });
  test('EN: „ACSM 2026 recommends at least 2”; „one set works” przy US guidelines 2018', async () => {
    await showGenerator('en');
    expect(screen.getByText('• Sets: 2 per exercise — for health usually 2–3. ACSM 2026 recommends at least 2. US guidelines 2018: one set works, 2–3 may work better; ACSM 2011: one set can be enough, especially for beginners and older adults. 2 is the lower end — a simplification.')).toBeTruthy();
    expect(screen.queryByText(/ACSM 2026: one set/)).toBeNull();
  });
  test('25 języków: nowy klucz ma {s} {b} {m}; w żadnym ACSM 2026 nie stoi przed dwukropkiem (przypisanie „jedna seria”); dawny klucz usunięty', () => {
    allLangs(KEY, ['{s}', '{b}', '{m}']);
    for (const l of LANGS) expect([l, /ACSM 2026\s*:/.test(tIn(l, KEY))]).toEqual([l, false]);
    expect(EN[OLD]).toBeUndefined();
  });
});

describe('A11B-6: uwaga przy 1 dniu (cel „Ogólny”) — wytyczne USA 2018 „można” zacząć od 1 dnia (c29: „can be done just 1 day a week”), nie „radzą”', () => {
  const KEY = '{k} dzień siłowy w tygodniu to mniej niż zalecenie WHO 2020 (co najmniej {n} dni). Na początek to dobry krok: według wytycznych USA 2018 na początku można ćwiczyć siłowo tylko {k} dzień w tygodniu, a z czasem dojść do {n} — trochę ruchu jest lepsze niż żaden.';
  const OLD = '{k} dzień siłowy w tygodniu to mniej niż zalecenie WHO 2020 (co najmniej {n} dni). Na początek to dobry krok: wytyczne USA 2018 radzą zacząć od {k} dnia i z czasem dojść do {n} — trochę ruchu jest lepsze niż żaden.';
  afterEach(() => { applyLang('pl'); });
  test('PL i EN: previewWarnings „oneday” z liczbami ze stałych (MIN_DAYS)', async () => {
    await fresh(); const inp = { goal: 'general' as const, locationId: null, sessions: 1, minutes: 60 };
    const w = previewWarnings(generate(inp), inp).find(x => x.kind === 'oneday')!;
    expect(w.text).toBe(`1 dzień siłowy w tygodniu to mniej niż zalecenie WHO 2020 (co najmniej ${MIN_DAYS} dni). Na początek to dobry krok: według wytycznych USA 2018 na początku można ćwiczyć siłowo tylko 1 dzień w tygodniu, a z czasem dojść do ${MIN_DAYS} — trochę ruchu jest lepsze niż żaden.`);
    applyLang('en');
    expect(previewWarnings(generate(inp), inp).find(x => x.kind === 'oneday')!.text).toBe('1 strength day a week is less than the WHO 2020 recommendation (at least 2 days). It is a good first step: according to the US guidelines 2018, strength training can be done just 1 day a week at first and built up to 2 over time — some activity is better than none.');
  });
  test('25 języków: {k} i {n} zachowane; bez czasowników „radzić/zalecać” przy wytycznych USA (de „raten”, es „aconsejan” i inne); dawny klucz usunięty', () => {
    allLangs(KEY, ['{k}', '{n}']);
    const STRONG = /radzą|suggest|raten|aconsejan|conseillent|consigliano|aconselham|recomandă|радять|съветват|radí|radia|råder|raden aan|savjetuju|svetujejo|саветују|soovitavad|neuvovat|tanácsolják|pataria|iesaka|προτείνουν|önerir/;
    for (const l of LANGS) expect([l, STRONG.exec(tIn(l, KEY))?.[0] ?? null]).toEqual([l, null]);
    expect(EN[OLD]).toBeUndefined();
  });
});

/* ---------- A11B-8: lista wydania — wersja 0.11.0 i wpis „Co nowego” 0.11 ---------- */
describe('A11B-8: wersja 0.11.0 i „Co nowego” 0.11', () => {
  const fs = require('fs') as typeof import('fs'); const path = require('path') as typeof import('path');
  const J = (f: string) => JSON.parse(fs.readFileSync(path.join(__dirname, '..', f), 'utf8'));
  afterEach(() => { applyLang('pl'); });
  test('app.json, package.json i package-lock.json (projekt) — 0.11.0', () => {
    const lock = J('package-lock.json');
    expect([J('app.json').expo.version, J('package.json').version, lock.version, lock.packages[''].version]).toEqual(['0.11.0', '0.11.0', '0.11.0', '0.11.0']);
  });
  test('najnowszy wpis = 0.11 (wydanie 2, build 1005), 0.10.0 z numerem 1004; zakres dni generatora z GEN_SESSIONS; zaległości UI2-04 i MER2-06', () => {
    const { WHATS_NEW } = require('@/lib/whatsnew'); const { GEN_SESSIONS } = require('@/lib/generator');
    expect([WHATS_NEW[0].id, WHATS_NEW[0].build, WHATS_NEW[1].id, WHATS_NEW[1].build]).toEqual(['2026-10-09', 1005, '2026-10-08', 1004]);
    const all = Object.values(GEN_SESSIONS as Record<string, number[]>).flat(); const it: string[] = WHATS_NEW[0].items();
    expect(it).toContain(`Generator: wybór dni tygodnia, od ${Math.min(...all)} do ${Math.max(...all)} dni, cel „Ogólny” i „Plan z moich szablonów”.`);
    expect(it.filter(x => /^Od 0\.10: /.test(x))).toHaveLength(2);
    expect(it.join(' ')).toMatch(/„Edytuj”.*„Zapisz”/); expect(it.join(' ')).toMatch(/„Podstawowe”/); expect(it.join(' ')).toMatch(/„Zapisz jako szablon”/);
    expect(it.every(x => !/[{}]/.test(x))).toBe(true);
  });
  test('wszystkie języki (LANGS): wszystkie punkty wpisu 0.11 przetłumaczone, bez „{”, nazwy przycisków z lokali („Edytuj”, „Zapisz”, „Podstawowe”, „Plan z moich szablonów”)', () => {
    const { WHATS_NEW } = require('@/lib/whatsnew'); const pl: string[] = WHATS_NEW[0].items();
    for (const l of LANGS) { if (l === 'pl') continue; applyLang(l); const it: string[] = WHATS_NEW[0].items(); const joined = it.join(' ');
      expect([l, it.filter((x, i) => x === pl[i] || /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]); /* „。” — kropka w ja/zh-Hant (fale 1–4, 10.10.2026) */
      expect([l, ['Edytuj', 'Zapisz', 'Podstawowe', 'Plan z moich szablonów', 'Zapisz jako szablon'].filter(k => !joined.includes(tIn(l, k)))]).toEqual([l, []]); }
  });
});
