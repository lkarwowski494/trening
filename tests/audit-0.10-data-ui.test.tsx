/*
 * Audyt 0.10 — fala 2, obszar DANE / WYDAJNOŚĆ / ZDROWIE / BEZPIECZEŃSTWO: ekrany i scenariusze (logika: tests/audit-0.10-data.test.ts).
 * Rodzaje (docs/20): ekran (nowe elementy i komunikaty na prawdziwym ekranie, skutek w danych), scenariusz z restartem, wydajność (liczba przeliczeń
 * i wierszy), dane (klucz „cfg”, pliki w Caches), języki (EN). ID z docs/25 i raportów docs/audyt-0.10 w nazwach testów.
 */
import * as store from '@/lib/store';
import * as health from '@/lib/health';
import * as backup from '@/lib/backup';
import { applyLang } from '@/lib/i18n';
import { applyUnit } from '@/lib/units';
import { LICENSES, LICENSE_TEXTS } from '@/lib/licenses.generated';
import { fresh, saved, addWorkout, ex, pressAlert } from './helpers';
import { renderApp, flushAll, screen, go, act, tap, swipeDelete, type as typeText } from './app';

jest.setTimeout(60000);
const NOW = new Date(2026, 9, 8, 18).getTime();
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
const S = () => store.getState();
const hk = () => require('@kingstinct/react-native-healthkit').default;
const boot = async (fn: () => void = () => {}, url?: string, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(undefined, locale); fn(); store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), url, locale }); await flushAll(10);
};
afterEach(() => { applyLang('pl'); applyUnit('kg'); jest.restoreAllMocks(); });

describe('J2: Apple Health — licznik w Ustawieniach, ponowienie, stan w szczegółach sesji', () => {
  test('trening czeka na zapis: Ustawienia pokazują liczbę i „Ponów teraz”; po udanym ponowieniu licznik znika; sesja — „Nie zapisano jeszcze…” do czasu zapisu', async () => {
    let w!: ReturnType<typeof addWorkout>;
    await boot(() => { S().settings.healthSync = true; w = addWorkout(at(9, 7), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.healthPending = true; });
    jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => false);
    await go('/more/settings'); await flushAll(10);
    expect(screen.getByText('Czeka na zapis w Apple Health: 1. Ponawiam przy uruchomieniu i powrocie do aplikacji.')).toBeTruthy();
    await tap(screen.getByText('Ponów teraz')); await flushAll(10);
    expect(global.__alerts.at(-1)).toMatchObject({ title: 'Nie udało się', msg: 'Treningi nadal czekają na zapis w Apple Health. Sprawdź zgodę w aplikacji Zdrowie: profil → Aplikacje → Trening.' }); /* odmowa — trening dalej czeka */
    await go(`/history/${w.id}`); await flushAll(10); expect(screen.getByText('Nie zapisano jeszcze w Apple Health — ponowię przy następnym uruchomieniu aplikacji.')).toBeTruthy();
    jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => 'uuid-1');
    await go('/more/settings'); await flushAll(10); await tap(screen.getByText('Ponów teraz')); await flushAll(10);
    expect(screen.queryByText(/^Czeka na zapis w Apple Health/)).toBeNull(); expect(S().workouts.find(x => x.id === w.id)!.healthUUID).toBe('uuid-1');
    await go(`/history/${w.id}`); await flushAll(10); expect(screen.queryByText(/^Nie zapisano jeszcze w Apple Health/)).toBeNull();
  });
  test('scenariusz: start aplikacji ponawia zapis (bez dotykania czegokolwiek); bez synchronizacji — bez licznika i bez prób', async () => {
    const sv = jest.spyOn(hk(), 'saveWorkoutSample').mockImplementation(async () => 'uuid-start');
    await boot(() => { S().settings.healthSync = true; const w = addWorkout(at(9, 7), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.healthPending = true; });
    await flushAll(50); expect(sv).toHaveBeenCalledTimes(1); expect(health.healthPending()).toEqual([]);
    sv.mockClear(); await boot(() => { const w = addWorkout(at(9, 7), [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.healthPending = true; }, '/more/settings');
    await flushAll(50); expect(sv).not.toHaveBeenCalled(); expect(screen.queryByText(/^Czeka na zapis w Apple Health/)).toBeNull();
  });
});

describe('Masa ciała z datą: ekran pomiarów, Ustawienia, Postępy', () => {
  test('dodanie z datą wstecz, lista od najnowszego, usunięcie z potwierdzeniem; data w przyszłości — komunikat i brak zmian', async () => {
    await boot(undefined, '/more/bodymass');
    expect(screen.getByText('Brak pomiarów.')).toBeTruthy(); expect(screen.getByText('Pomiary')).toBeTruthy(); expect(screen.getByText('Pomiar z tym samym dniem zastępuje poprzedni.')).toBeTruthy();
    await tap(screen.getByText('Zapisz pomiar')); expect(global.__alerts.at(-1)).toMatchObject({ title: 'Masa ciała', msg: 'Wpisz masę ciała.' });
    await typeText(screen.getByLabelText('Masa ciała (kg)'), '0'); await tap(screen.getByText('Zapisz pomiar')); expect(global.__alerts.at(-1)!.msg).toBe('Masa ciała musi być większa od zera i nie większa niż 500 kg.'); expect(S().bodyMassLog).toBeUndefined();
    await typeText(screen.getByLabelText('Masa ciała (kg)'), '80'); await typeText(screen.getByLabelText('Data pomiaru (RRRR-MM-DD)'), '2026-09-01'); await tap(screen.getByText('Zapisz pomiar')); await flushAll(5);
    await typeText(screen.getByLabelText('Masa ciała (kg)'), '82,5'); await tap(screen.getByText('Zapisz pomiar')); await flushAll(5);
    expect(S().bodyMassLog).toEqual([{ date: '2026-09-01', kg: 80 }, { date: '2026-10-08', kg: 82.5 }]);
    const titles = screen.getAllByText(/^\d+(,\d+)? kg$/).map(n => n.props.children); expect(titles).toEqual(['82,5 kg', '80 kg']);
    await typeText(screen.getByLabelText('Masa ciała (kg)'), '81'); await typeText(screen.getByLabelText('Data pomiaru (RRRR-MM-DD)'), '2026-10-09'); await tap(screen.getByText('Zapisz pomiar')); await flushAll(5);
    expect(global.__alerts.at(-1)!.msg).toBe('Data pomiaru nie może być w przyszłości.'); expect(S().bodyMassLog).toHaveLength(2);
    await tap(screen.getByLabelText(/^Usuń pomiar: 80 kg, /)); expect(global.__alerts.at(-1)).toMatchObject({ title: 'Usunąć pomiar?', msg: `80 kg z ${store.fmtDate(store.localDateTs('2026-09-01'))}. Treningi z tego okresu przeliczą e1RM z wcześniejszego pomiaru (albo bez e1RM, gdy go nie ma).` });
    await act(async () => { pressAlert('Usunąć pomiar?', 'Usuń'); }); await flushAll(5); expect(S().bodyMassLog).toEqual([{ date: '2026-10-08', kg: 82.5 }]);
  });
  test('Ustawienia: ostatni pomiar z datą; Postępy podciągania: notka o dniu treningu i o sesjach sprzed pierwszego pomiaru, przycisk do pomiarów', async () => {
    await boot(() => { addWorkout(at(7, 20), [['Pull Up', [{ addKg: 10, reps: 5 }]]]); addWorkout(at(9, 5), [['Pull Up', [{ addKg: 10, reps: 5 }]]]); store.addBodyMass(80, '2026-10-01'); }, '/more/settings');
    expect(screen.getByText(/^80 kg · pomiar z /)).toBeTruthy();
    await go(`/more/progress?ex=${ex('Pull Up').id}`); await flushAll(10);
    expect(screen.getByText(/^e1RM: wzór Epleya na 100% masy ciała z dnia treningu \(ostatni pomiar z tego dnia lub wcześniejszy\) plus dociążenie \(uproszczenie\)\. Treningi sprzed pierwszego pomiaru \(.+\) — bez e1RM\.$/)).toBeTruthy();
    expect(screen.getByText('105 kg (masa ciała + 25)')).toBeTruthy(); expect(screen.getByText(/Treningi sprzed pierwszego pomiaru \(.+\) — bez e1RM\.$/)).toBeTruthy(); expect(screen.getByText(new RegExp('Treningi sprzed pierwszego pomiaru')).props.children).toContain(`Treningi sprzed pierwszego pomiaru (${store.fmtDate(store.localDateTs('2026-10-01'))}) — bez e1RM.`); /* sesja z 5.10: 80 kg z pomiaru 1.10 + 10 kg × 5 */
    await tap(screen.getByText('Masa ciała — pomiary')); await flushAll(10); expect(screen.getByText('Zapisz pomiar')).toBeTruthy();
  });
  test('EN: ekran pomiarów i Ustawienia', async () => {
    await boot(() => { store.addBodyMass(80, '2026-10-01'); }, '/more/bodymass', 'en');
    expect(screen.getByText('Save measurement')).toBeTruthy(); expect(screen.getByLabelText('Measurement date (YYYY-MM-DD)')).toBeTruthy(); expect(screen.getByText('Measurements')).toBeTruthy();
    await go('/more/settings'); await flushAll(10); expect(screen.getByText('Body weight')).toBeTruthy(); expect(screen.getByText(/^80 kg · measured /)).toBeTruthy();
  });
});

describe('N3 / PERF-01: zakładka Ćwiczenia — wirtualizacja, przeliczanie tylko przy zmianie listy', () => {
  const rowsOnScreen = () => screen.UNSAFE_root.findAll((n: { props: Record<string, any> }) => typeof n.props.onAccessibilityAction === 'function' && Array.isArray(n.props.accessibilityActions) && n.props.accessibilityActions.some((a: { label?: string }) => /^Usuń z biblioteki: /.test(a.label ?? ''))).map((n: { props: Record<string, any> }) => n.props.onAccessibilityAction).filter((f: unknown, i: number, a: unknown[]) => a.indexOf(f) === i).length;
  test('854+ ćwiczeń: na ekranie najwyżej kilkadziesiąt wierszy; szukanie nadal znajduje każde ćwiczenie', async () => {
    await boot(); await go('/exercises'); await flushAll(10);
    expect(S().exercises.filter(e => !e.archived).length).toBeGreaterThan(800); expect(rowsOnScreen()).toBeLessThanOrEqual(80); expect(rowsOnScreen()).toBeGreaterThan(5);
    await typeText(screen.getByPlaceholderText('Szukaj…'), 'Back Squat'); await flushAll(5); expect(screen.getByText('Back Squat')).toBeTruthy();
  });
  test('znak w notatce ćwiczenia i nazwie szablonu nie przelicza listy (visibleExercises 0×); zmiana nazwy ćwiczenia — raz; komunikat usuwania liczony dopiero przy pytaniu', async () => {
    await boot(() => { addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); await go('/exercises'); await flushAll(10);
    const vis = jest.spyOn(store, 'visibleExercises'); const inHist = jest.spyOn(store, 'exerciseInHistory');
    const sq = ex('Back Squat'); for (const ch of ['a', 'ab', 'abc']) await act(async () => { sq.notes = ch; store.save(sq); });
    const tpl = store.newTemplate(); for (const ch of ['X', 'XY']) await act(async () => { tpl.name = ch; store.save(tpl); });
    await flushAll(5); expect(vis).not.toHaveBeenCalled();
    await act(async () => { sq.name = 'Przysiad'; store.save(sq); }); await flushAll(5); expect(vis).toHaveBeenCalledTimes(1);
    expect(inHist).not.toHaveBeenCalled();
    await typeText(screen.getByPlaceholderText('Szukaj…'), 'Przysiad'); await flushAll(5);
    await swipeDelete('Usuń z biblioteki: Przysiad');
    expect(inHist).toHaveBeenCalled(); expect(global.__alerts.at(-1)!.msg).toBe('Zniknie z list i szablonów; historia, wykresy i eksport zostaną.');
  });
});

describe('PERF-02 / PERF-03 (A): szablony bez przeliczania historii; zapis konfiguracji małym kluczem „cfg”', () => {
  test('save(szablon): histRev bez zmian (cache historii zostaje), zakładka Szablony pokazuje nową nazwę; zapis do „cfg”, nie do „state”; po restarcie nazwa jest; flush zapisuje pełny „state”', async () => {
    await boot(() => { addWorkout(at(9, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); }); const tpl = store.newTemplate(); tpl.name = 'Plan A'; store.save(tpl); await act(async () => { await store.flush(); });
    await go('/templates'); await flushAll(10);
    const h0 = store.getHistRev(); const fw = store.finishedWorkouts(); const state0 = global.__kv.get('state');
    await act(async () => { tpl.name = 'Plan B'; store.save(tpl); }); await flushAll(400);
    expect(store.getHistRev()).toBe(h0); expect(store.finishedWorkouts()).toBe(fw); expect(screen.getByText('Plan B')).toBeTruthy();
    expect(global.__kv.get('state')).toBe(state0); const cfg = JSON.parse(global.__kv.get('cfg')!); expect(cfg.data.templates.find((x: any) => x.id === tpl.id).name).toBe('Plan B');
    expect(cfg.seq).toBeGreaterThan(JSON.parse(state0!).saveSeq);
    /* restart bez flush (np. aplikacja zabita): nazwa z „cfg” */
    const kv = new Map(global.__kv); store.__resetForTests(); global.__kv.clear(); for (const [k, v] of kv) global.__kv.set(k, v); await store.init(); expect(S().templates.find(x => x.id === tpl.id)!.name).toBe('Plan B');
    /* flush (wyjście do tła): pełny „state” z konfiguracją — starsza wersja, która czyta tylko „state”, też widzi zmianę */
    const t2 = S().templates.find(x => x.id === tpl.id)!; await act(async () => { t2.name = 'Plan C'; store.save(t2); await store.flush(); }); expect(JSON.parse(global.__kv.get('state')!).templates.find((x: any) => x.id === tpl.id).name).toBe('Plan C');
  });
  test('„cfg” starszy niż „state” jest pomijany; Ustawienia (wygląd) — saveCfg bez przeliczania historii; kopia odzysku z „cfg” wczytuje nowszą konfigurację', async () => {
    await fresh(); const tpl = store.newTemplate(); tpl.name = 'Stary'; store.save(tpl); await store.flush();
    const raw = JSON.parse(global.__kv.get('state')!); const old = { seq: raw.saveSeq - 1, at: 0, data: { ...raw, templates: [] } };
    expect(store.applyCfg(JSON.parse(JSON.stringify(raw)), old)).toBe(false);
    const h0 = store.getHistRev(); S().settings.theme = 'dark'; store.saveCfg(); expect(store.getHistRev()).toBe(h0); jest.useFakeTimers(); jest.advanceTimersByTime(400); await Promise.resolve(); await Promise.resolve();
    const env = JSON.stringify({ format: 'trening-recovery', state: raw, cfg: { seq: raw.saveSeq + 5, data: { ...raw, templates: [{ ...raw.templates[0], name: 'Nowy' }] } } });
    expect(backup.parseBackup(env).templates[0].name).toBe('Nowy');
  });
  test('nieczytelny „state”: „cfg” nie nakłada się na czysty stan (odłożony obok kopii)', async () => {
    await fresh(); global.__kv.set('state', '{zepsute'); global.__kv.set('cfg', JSON.stringify({ seq: 999, at: 0, data: { templates: [{ id: 'x', name: 'Z kopii', items: [] }] } }));
    store.__resetForTests(); await store.init(); expect(S().templates.some(x => x.name === 'Z kopii')).toBe(false); expect(global.__kv.has('cfg')).toBe(false);
    expect([...global.__kv.keys()].some(k => /^state_corrupt_\d+_cfg$/.test(k))).toBe(true);
  });
});

describe('SEC-08: Więcej → O aplikacji → Licencje open source', () => {
  test('wersja, liczba pakietów, licencje z treścią po dotknięciu; lista pakietów z notką o prawach autorskich (react, IBM Plex)', async () => {
    await boot(undefined, '/more'); await tap(screen.getByText('O aplikacji')); await flushAll(10);
    expect(screen.getByLabelText(`Wersja, ${require('expo-constants').default.expoConfig?.version ?? '—'}`)).toBeTruthy(); expect(screen.getByText('Aplikacja nie zbiera danych: wszystko, co wpisujesz, zostaje w telefonie, bez konta, reklam i analityki.')).toBeTruthy(); expect(screen.getByText(`Pakiety open source: ${LICENSES.length}`)).toBeTruthy();
    await tap(screen.getByText('Licencje open source')); await flushAll(10);
    expect(screen.getByText(`Pakiety (${LICENSES.length})`)).toBeTruthy(); expect(screen.getByText('Aplikacja korzysta z bibliotek open source. Niżej licencje (dotknij, by zobaczyć treść) oraz wszystkie pakiety npm, od których zależy aplikacja — także narzędzia budowania — z licencją i notką o prawach autorskich.')).toBeTruthy();
    expect(screen.getByText(`pakiety: ${LICENSES.filter(r => r[2].includes('OFL-1.1')).length} · treść wg ${LICENSE_TEXTS['OFL-1.1'].from}`)).toBeTruthy(); expect(screen.queryByText(LICENSE_TEXTS['OFL-1.1'].text)).toBeNull();
    await tap(screen.getByText('OFL-1.1')); await flushAll(5); expect(screen.getByText(LICENSE_TEXTS['OFL-1.1'].text)).toBeTruthy();
    expect(screen.getAllByText(/^@babel\/|^@expo/).length).toBeGreaterThan(0);
  });
  test('dane listy: pakiety aplikacji z licencją, notki (React — Meta, IBM Plex — OFL z „Reserved Font Name”), treść MIT', () => {
    const by = (n: string) => LICENSES.find(r => r[0] === n)!;
    expect(by('react')[2]).toBe('MIT'); expect(by('react')[3].join(' ')).toMatch(/Meta Platforms/);
    expect(by('@expo-google-fonts/ibm-plex-sans')[2]).toMatch(/OFL-1\.1/); expect(by('@expo-google-fonts/ibm-plex-sans')[3].join(' ')).toMatch(/IBM Corp\. with Reserved Font Name "Plex"/);
    expect(LICENSE_TEXTS.MIT.text).toMatch(/Permission is hereby granted, free of charge/); expect(LICENSES.some(r => r[0] === 'jest')).toBe(false); /* bez devDependencies */
    expect(LICENSES.some(r => r[0] === 'query-string')).toBe(true); /* SEC-06: zostaje jako zależność expo-router — tylko bezpośrednia usunięta */
  });
});

describe('SEC-09: pliki udostępniania nie zostają w Caches', () => {
  const FS = () => require('expo-file-system/legacy');
  test('eksport kopii i CSV: plik usuwany po zamknięciu arkusza; także gdy arkusz rzuci błąd', async () => {
    await fresh(); const del = FS().deleteAsync as jest.Mock; del.mockClear();
    await backup.exportBackup(); await backup.exportCsv();
    expect(del.mock.calls.map(c => c[0])).toEqual([`file:///cache/trening-backup-${store.localISODate()}.json`, `file:///cache/trening-${store.localISODate()}.csv`]);
    const sh = require('expo-sharing').shareAsync as jest.Mock; sh.mockImplementationOnce(async () => { throw new Error('x'); }); del.mockClear();
    await expect(backup.exportCsv()).rejects.toThrow('x'); expect(del).toHaveBeenCalledWith(`file:///cache/trening-${store.localISODate()}.csv`, { idempotent: true });
  });
  test('import: kopia z wyboru pliku (Caches) usuwana po odczycie; start sprząta pozostałości tylko z nazwami eksportu', async () => {
    await fresh(); const del = FS().deleteAsync as jest.Mock; del.mockClear();
    const pick = require('expo-document-picker').getDocumentAsync as jest.Mock; pick.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///cache/DocumentPicker/x.json' }] }));
    (FS().readAsStringAsync as jest.Mock).mockImplementationOnce(async () => JSON.stringify(backup.buildBackup()));
    await backup.importBackup(); expect(del).toHaveBeenCalledWith('file:///cache/DocumentPicker/x.json', { idempotent: true });
    del.mockClear(); (FS().readDirectoryAsync as jest.Mock).mockImplementationOnce(async () => ['trening-backup-2026-10-01.json', 'trening-2026-10-01.csv', 'trening-odzysk-2026-10-02.json', 'trening-dane-2026-10-02.json', 'inny.json', 'trening-2026-10-01-120000.json']);
    expect(await backup.cleanShareLeftovers()).toBe(4); expect(del.mock.calls.map(c => c[0]).sort()).toEqual(['file:///cache/trening-2026-10-01.csv', 'file:///cache/trening-backup-2026-10-01.json', 'file:///cache/trening-dane-2026-10-02.json', 'file:///cache/trening-odzysk-2026-10-02.json']);
  });
});
