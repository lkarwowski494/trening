/** Runda 83b — niezależny audyt commitów rundy 83:
 *  - MEDIUM 1 (Q-018): po zmianie sprzętu „inne” → masa ciała obca wartość (42,5 kg maszyny) szła do progresji („+45 kg” do ćwiczenia z masą
 *    ciała), rekordów (max 42,5 / e1RM 53,8 na zawsze) i podpowiedzi „Poprzednio” („8@+42,5”, a wpisanie nic nie wstawiało). Reguła 83b
 *    (store.loadOf): widok historii (ekran sesji, edytor, opisy serii, CSV) pokazuje obcą wartość, obliczenia i trening w toku — tylko pole
 *    właściwe dla obecnego sprzętu; LOW 2: edytor historii pokazuje to samo co ekran sesji; LOW 1: asysta −20 po zmianie na sztangę = 0;
 *  - MEDIUM 2 (T-053): droga instalacji z get-task-allow (deweloperski = true → Sideloadly, ad hoc = false → nowy build), okres ważności zapasowo;
 *  - LOW 3 (Q-019): kopia bezpieczeństwa niesie nieczytelny zapis (recovery), który import/czyszczenie kasuje z aplikacji;
 *  - LOW 4 (Q-019): writeKopia — błąd sprzątania puli po udanym zapisie nie przerywa, nieudany zapis nie zostawia pliku, ta sama sekunda → -2. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as signing from '@/lib/signing';
import * as stats from '@/lib/stats';
import * as backup from '@/lib/backup';
import * as edit from '@/lib/edit';
import { setBodyMass, fresh, ex, pressAlert, addWorkout } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act } from './app';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

/** Własne ćwiczenie „inne” z sesjami 40 kg × 10 i 2 × (42,5 kg × 8), potem sprzęt → masa ciała (chip „Sprzęt” w edycji ćwiczenia). */
function otherToBodyweight() {
  const st = store.getState(); const x = { ...st.exercises.find(y => y.name === 'Back Squat')!, id: 'q18b', name: 'Wiosło Q18', lib: undefined, equipment: 'inne' as const, loadMode: 'total' as const, metric: 'weight_reps' as const, bandAssistable: false };
  st.exercises.push(x); store.save(x);
  const d = Date.now() - 3 * 86400e3; addWorkout(d, [['Wiosło Q18', [{ weight: 40, reps: 10 }]]]);
  const w2 = addWorkout(d + 86400e3, [['Wiosło Q18', [{ weight: 42.5, reps: 8 }, { weight: 42.5, reps: 8 }]]]);
  store.setEquipment(ex('Wiosło Q18'), 'masa ciała'); return w2;
}

describe('MEDIUM 1 — obca wartość po zmianie sprzętu: widok tak, obliczenia nie', () => {
  test('(a) progresja: 2×(42,5 kg × 8) → masa ciała, zakres do 8 → „+1 powtórzenie”, nie „+45 kg”', async () => {
    await fresh(); const w2 = otherToBodyweight(); const x = ex('Wiosło Q18');
    expect(store.progressionFor(x, 8, w2.exercises[0].sets)).toEqual({ kind: 'reps', reps: 9 });
  });
  test('(c) rekordy bez 42,5 / e1RM 53,8; prawdziwe podciąganie +20 × 8 jest rekordem (max, e1RM, PR przy serii)', async () => {
    await fresh(); otherToBodyweight(); const x = ex('Wiosło Q18');
    const r0 = stats.recordsFor(x); expect(r0.maxLoad).toBe(0); expect(r0.bestE1rm).toBe(0);
    addWorkout(Date.now() - 2 * 3600e3, [['Wiosło Q18', [{ addKg: 10, reps: 8 }]]]); /* pierwszy e1RM w historii nie jest odznaką (runda 72) */
    const w3 = addWorkout(Date.now() - 3600e3, [['Wiosło Q18', [{ addKg: 20, reps: 8 }]]]);
    /* audyt 0.10 (E1): ćwiczenie własne z masą ciała nie ma e1RM (brak źródła udziału masy ciała — także z masą ciała w Ustawieniach); max dociążenie zostaje */
    const r1 = stats.recordsFor(x); expect(r1.maxLoad).toBe(20); expect(r1.bestE1rm).toBe(0);
    setBodyMass(80); expect(stats.recordsFor(x).bestE1rm).toBe(0);
    expect(stats.prMap(w3).get(w3.exercises[0].sets[0].id) ?? []).not.toContain('e1RM'); /* wcześniej poprzeczka 53,8 z 42,5 kg maszyny; od E1 — bez e1RM */
    /* objętość — ta sama reguła co rekordy (jedna definicja objętości, A4): 42,5 kg maszyny to nie dociążenie */
    expect(store.volume(store.getState().workouts.find(w => w.exercises[0].sets[0].weight === 42.5)!)).toBe(0);
  });
  test('(b) „Poprzednio” = to, co wpisze podpowiedź: „8” (nie „8@+42,5”), a po ✓ ±kg zostaje puste', async () => {
    await renderApp(); otherToBodyweight(); const x = ex('Wiosło Q18');
    await act(async () => { store.startEmpty(); store.addExerciseToActive(x); }); await go('/'); await flushAll(20);
    expect(screen.queryByText('8@+42,5')).toBeNull(); expect(screen.getAllByText('8').length).toBeGreaterThan(0);
    await act(async () => { store.toggleDone(0, 0); }); await flushAll(5);
    const s = store.getState().active!.exercises[0].sets[0]; expect([s.addKg, s.weight, s.reps]).toEqual(['', '', 8]);
  });
  test('LOW 2: ekran sesji, edytor historii i opis serii pokazują 42,5; wpis w edytorze przenosi ciężar do ±kg i od tej chwili się liczy', async () => {
    await renderApp(); const w2 = otherToBodyweight(); const x = ex('Wiosło Q18'); await flushAll(10);
    await go(`/history/${w2.id}`); await flushAll(10); expect(screen.getAllByText('42,5').length).toBe(2);
    expect(store.setSummary(x, w2.exercises[0].sets[0])).toBe('8@+42,5'); expect(backup.buildCsv()).toMatch(/Wiosło Q18,1,42\.5,8/);
    await tap(screen.getByText('Edytuj')); await flushAll(20);
    const f = screen.getAllByDisplayValue('42,5'); expect(f).toHaveLength(2); /* wcześniej pole ±kg puste przy 42,5 na ekranie sesji */
    await type(f[0], '10'); await flushAll(5);
    const d = edit.draftOf(w2.id)!; expect([d.w.exercises[0].sets[0].addKg, d.w.exercises[0].sets[0].weight]).toEqual([10, '']);
    await type(screen.getByDisplayValue('42,5'), ''); await flushAll(5); /* wyczyszczenie pola z obcą wartością działa (obce pole też znika) */
    expect([d.w.exercises[0].sets[1].addKg, d.w.exercises[0].sets[1].weight]).toEqual(['', '']);
  });
  test('LOW 1: Pull Up z asystą −20 → sztanga: opis i ekran sesji „0”, nie „-20” (jak objętość i rekordy)', async () => {
    await renderApp(); const w = addWorkout(Date.now() - 2 * 86400e3, [['Pull Up', [{ addKg: -20, reps: 8 }]]]);
    store.setEquipment(ex('Pull Up'), 'sztanga'); const x = ex('Pull Up'); const s = w.exercises[0].sets[0];
    expect(store.setSummary(x, s)).toBe('0×8'); expect(store.shownLoad(x, s)).toBe(0); expect(store.setLoad(x, s)).toBe(0);
    await go(`/history/${w.id}`); await flushAll(10); expect(screen.queryByText('-20')).toBeNull(); expect(screen.queryByText('−20')).toBeNull();
  });
  test('bez zmiany sprzętu bez zmian: własne pole liczy się i wyświetla jak dotąd', async () => {
    await fresh(); const pu = ex('Pull Up'), bs = ex('Back Squat');
    expect([store.setLoad(pu, { weight: '', addKg: -20 } as any), store.shownLoad(pu, { weight: '', addKg: -20 } as any)]).toEqual([-20, -20]);
    expect([store.setLoad(bs, { weight: 100, addKg: '' } as any), store.shownLoad(bs, { weight: 100, addKg: '' } as any)]).toEqual([100, 100]);
    expect(store.setLoad(pu, { weight: 50, addKg: 0 } as any)).toBe(0); /* wpisane 0 to wartość */
  });
});

const DAY = 86400e3;
const prof = (days: number, ent: string | null) => { const c = Date.UTC(2027, 8, 25, 10, 0); const iso = (t: number) => new Date(t).toISOString().replace(/\.\d+Z$/, 'Z');
  return `<?xml version="1.0"?><plist version="1.0"><dict><key>CreationDate</key><date>${iso(c)}</date>${ent == null ? '' : `<key>Entitlements</key><dict><key>application-identifier</key><string>T.x</string>${ent}</dict>`}<key>ExpirationDate</key><date>${iso(c + days * DAY)}</date></dict></plist>`; };
describe('MEDIUM 2 — droga instalacji z get-task-allow', () => {
  test('7 dni, get-task-allow true (darmowe Apple ID, Sideloadly) → Sideloadly', () => { expect(signing.parseRenewKind(prof(7, '<key>get-task-allow</key><true/>'))).toBe('sideloadly'); });
  test('5 dni, get-task-allow false (ad hoc odświeżony tuż przed wygaśnięciem certyfikatu) → nowy build', () => { expect(signing.parseRenewKind(prof(5, '<key>get-task-allow</key>\n\t\t<false/>'))).toBe('rebuild'); });
  test('rok, false (ad hoc z EAS) → nowy build; rok, true (deweloperski płatny) → ponowne podpisanie (Sideloadly)', () => {
    expect(signing.parseRenewKind(prof(365, '<key>get-task-allow</key><false/>'))).toBe('rebuild');
    expect(signing.parseRenewKind(prof(365, '<key>get-task-allow</key><true/>'))).toBe('sideloadly');
  });
  test('brak klucza → okres ważności (zapasowo): 7 dni Sideloadly, rok nowy build', () => {
    expect(signing.parseTaskAllow(prof(7, ''))).toBeNull(); expect(signing.parseTaskAllow(prof(7, null))).toBeNull();
    expect(signing.parseRenewKind(prof(7, ''))).toBe('sideloadly'); expect(signing.parseRenewKind(prof(365, null))).toBe('rebuild');
    /* klucz spoza Entitlements się nie liczy */
    expect(signing.parseTaskAllow('<key>get-task-allow</key><true/>')).toBeNull();
  });
});

describe('Q-019 kopia bezpieczeństwa — LOW 3 (nieczytelny zapis) i LOW 4 (writeKopia)', () => {
  const FS = require('expo-file-system/legacy'); const DP = require('expo-document-picker');
  const writes = (re: RegExp) => (FS.writeAsStringAsync as jest.Mock).mock.calls.filter((c: any) => re.test(c[0]));
  beforeEach(() => { FS.writeAsStringAsync.mockClear(); FS.deleteAsync.mockClear(); });
  afterEach(() => { FS.readDirectoryAsync.mockImplementation(async () => []); FS.writeAsStringAsync.mockImplementation(async () => {}); FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); FS.deleteAsync.mockImplementation(async () => {}); });
  async function importFile(txt: string) {
    FS.readAsStringAsync.mockImplementationOnce(async () => txt); DP.getDocumentAsync.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///inny.json' }] }));
    await go('/more/backup'); await flushAll(10);
    await tap(screen.getByText('Importuj backup')); await act(async () => { pressAlert('Nadpisać dane?', 'Importuj'); }); await flushAll(50); await flushAll(50);
  }
  test('LOW 3: start z nieczytelnym zapisem → import: kopia ma surowy tekst tamtego zapisu (recovery), potwierdzenie o tym mówi', async () => {
    await fresh(); const other = JSON.stringify(backup.buildBackup());
    await renderApp({ saved: '{nie json' }); await flushAll(10); expect(store.getRecovery()).not.toBeNull();
    await importFile(other);
    expect(global.__alerts.find(a => a.title === 'Nadpisać dane?')!.msg).toMatch(/Kopia obejmie też poprzednie, nieczytelne dane\.$/);
    expect(store.getRecovery()).toBeNull(); /* import wykonany */
    const w = writes(/trening-przed-importem-/); expect(w).toHaveLength(1); expect(JSON.parse(w[0][1]).recovery).toBe('{nie json');
    expect(backup.parseBackup(w[0][1]).exercises.length).toBeGreaterThan(0); /* kopia dalej się importuje (state) */
  });
  test('LOW 3: „Wyczyść wszystkie dane” z nieczytelnym zapisem — kopia też go niesie; bez nieczytelnego zapisu pola recovery brak', async () => {
    await renderApp({ saved: '{zepsute' }); await flushAll(10);
    await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Wyczyść wszystkie dane')); expect(global.__alerts[global.__alerts.length - 1].msg).toMatch(/nieczytelne dane/);
    await act(async () => { pressAlert('Wyczyścić wszystkie dane?', 'Wyczyść'); }); await flushAll(50);
    expect(JSON.parse(writes(/trening-przed-czyszczeniem-/)[0][1]).recovery).toBe('{zepsute');
    FS.writeAsStringAsync.mockClear(); await backup.safetyBackup('reset'); expect(JSON.parse(writes(/przed-czyszczeniem/)[0][1])).not.toHaveProperty('recovery');
  });
  test('LOW 4: błąd sprzątania puli po udanym zapisie nie przerywa importu', async () => {
    await fresh(); const other = JSON.stringify(backup.buildBackup()); await renderApp();
    await act(async () => { store.startEmpty(); }); await flushAll(5);
    FS.readDirectoryAsync.mockImplementation(async () => { throw new Error('EIO'); });
    await importFile(other);
    expect(writes(/trening-przed-importem-/)).toHaveLength(1); expect(store.getState().active).toBeNull(); /* import się wykonał */
    expect(global.__alerts.some(a => a.title === 'Import przerwany')).toBe(false);
  });
  test('LOW 4: nieudany zapis — plik docelowy usuwany (nie zostaje ucięty JSON w puli), operacja przerwana', async () => {
    await fresh(); FS.writeAsStringAsync.mockImplementation(async () => { throw new Error('dysk pełny'); });
    await expect(backup.safetyBackup('import')).rejects.toThrow(/kopii bezpieczeństwa/);
    const path = writes(/trening-przed-importem-/)[0][0]; expect((FS.deleteAsync as jest.Mock).mock.calls.map((c: any) => c[0])).toEqual([path]);
  });
  test('LOW 4: druga kopia w tej samej sekundzie dostaje -2 (nie nadpisuje); rotacja liczy pliki z przyrostkiem w swojej puli', async () => {
    await fresh(); jest.setSystemTime(new Date(2026, 9, 3, 12, 0, 5));
    const first = 'file:///doc/Backup/trening-przed-importem-2026-10-03-120005.json';
    FS.getInfoAsync.mockImplementation(async (u: string) => ({ exists: u === 'file:///doc/Backup/' || u === first }));
    const old = Array.from({ length: 10 }, (_, i) => `trening-przed-importem-2026-09-${String(10 + i).padStart(2, '0')}-070000.json`);
    FS.readDirectoryAsync.mockImplementation(async () => [...old, 'trening-przed-importem-2026-10-03-120005.json', 'trening-przed-importem-2026-10-03-120005-2.json']);
    expect(await backup.safetyBackup('import')).toBe('file:///doc/Backup/trening-przed-importem-2026-10-03-120005-2.json');
    expect(writes(/./).map((c: any) => c[0])).toEqual(['file:///doc/Backup/trening-przed-importem-2026-10-03-120005-2.json']);
    expect((FS.deleteAsync as jest.Mock).mock.calls.map((c: any) => c[0].split('/').pop())).toEqual([old[1], old[0]]); /* 12 w puli → 2 najstarsze */
    FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); FS.readDirectoryAsync.mockImplementation(async () => ['trening-2026-10-03-120005.json', 'trening-2026-10-03-120005-2.json']);
    await act(async () => { store.getState().settings.autoBackup = true; }); expect(await backup.autoBackup()).toMatch(/\/Backup\/trening-2026-10-03-120005\.json$/);
  });
});

describe('audyt 83b-2 (LOW 2): ostrzeżenie „Serie bez ciężaru” zgodne z polem w edytorze', () => {
  test('masa ciała +10 × 8 → sztanga: zmiana samych powtórzeń nie daje ostrzeżenia, bo pole kg pokazuje 10; puste pole dalej ostrzega', async () => {
    await fresh(); const st = store.getState();
    const x = { ...st.exercises.find(y => y.name === 'Back Squat')!, id: 'q18c', name: 'Dip Q18', lib: undefined, equipment: 'masa ciała' as const, loadMode: 'total' as const, metric: 'weight_reps' as const, bandAssistable: false };
    st.exercises.push(x); store.save(x);
    const w = addWorkout(Date.now() - 86400e3, [['Dip Q18', [{ addKg: 10, reps: 8 }, { addKg: '', reps: 8 }]]]);
    store.setEquipment(ex('Dip Q18'), 'sztanga');
    const d = edit.beginEdit(w.id)!; const sets = d.w.exercises[0].sets;
    expect(store.loadOf(ex('Dip Q18'), sets[0]).raw).toBe(10); /* to pokazuje pole kg w edytorze */
    sets[0].reps = 9; sets[1].reps = 9;
    expect(edit.checkDraft(d.key)).toMatchObject({ noWeight: 1 }); /* tylko seria z pustym polem */
  });
});
