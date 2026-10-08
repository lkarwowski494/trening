/* Runda 83 — backlog po pierwszym teście na iPhonie (docs/09):
 *  - T-053: przypomnienie o podpisie dopasowane do drogi instalacji (ad hoc przez EAS → nowy build w GitHubie; darmowe Apple ID → Sideloadly);
 *  - T-055: martwy kod asysty kg gumy usunięty (nominalKg, pairAssist, applyBandAssist); stare kopie z nominalKg dalej się importują, pole odpada;
 *  - Q-018: po zmianie sprzętu ćwiczenia historia (ekran sesji, opisy serii) pokazuje ciężar tak jak CSV (T4b) — jedno źródło store.loadOf;
 *    od rundy 83b obliczenia (objętość, rekordy, progresja) biorą tylko pole obecnego sprzętu (tests/audit-r83b.test.tsx);
 *  - Q-019: kopia bezpieczeństwa w Backup/ tuż przed importem i przed „Wyczyść wszystkie dane” — zawsze (także przy wyłączonej kopii automatycznej),
 *    osobna pula 10 najnowszych (nie wypycha kopii po treningu); nieudany zapis kopii przerywa import/czyszczenie;
 *  - Q-021: lb — ponowny wpis liczby, którą pole już pokazuje (61,23 kg = 135,0 lb), nie zmienia zapisanych kg i nie przenosi się na dalsze serie. */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as signing from '@/lib/signing';
import * as stats from '@/lib/stats';
import * as backup from '@/lib/backup';
import { SCHEMA_VERSION } from '@/lib/seed';
import { fresh, ex, seedWithDemo, pressAlert, addWorkout } from './helpers';
import { renderApp, flushAll, screen, go, tap, act, fireEvent, openCard, swipeDelete, startEdit, saveEdit, tplDraft } from './app';
import * as units from '@/lib/units';

jest.setTimeout(60000);
afterEach(async () => { try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const DAY = 86400e3;
/** Treść embedded.mobileprovision (plist w kopercie CMS — tu tylko śmieci przed XML-em) zakodowana base64, jak czyta ją aplikacja. */
const profileB64 = (created: number, expires: number, extra = '') => Buffer.from(`0\u0082\u0003garbage<?xml version="1.0"?><plist version="1.0"><dict><key>AppIDName</key><string>trening</string><key>CreationDate</key><date>${new Date(created).toISOString().replace(/\.\d+Z$/, 'Z')}</date>${extra}<key>ExpirationDate</key><date>${new Date(expires).toISOString().replace(/\.\d+Z$/, 'Z')}</date></dict></plist>`, 'latin1').toString('base64');

describe('T-053 przypomnienie o podpisie wg drogi instalacji', () => {
  const FS = require('expo-file-system/legacy');
  const useProfile = (b64: string | null) => {
    signing.__resetSigningCache();
    (global as { __bundleDir?: string | null }).__bundleDir = b64 ? '/var/containers/Bundle/Application/X/Trening.app/' : null;
    FS.getInfoAsync.mockImplementation(async (uri: string) => ({ exists: !!b64 && uri.endsWith('embedded.mobileprovision') }));
    FS.readAsStringAsync.mockImplementation(async (uri: string) => (b64 && uri.endsWith('embedded.mobileprovision') ? b64 : ''));
  };
  afterEach(() => { useProfile(null); FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); FS.readAsStringAsync.mockImplementation(async () => ''); });

  test('rodzaj profilu z okresu ważności: 7 dni = darmowe Apple ID (Sideloadly), rok = ad hoc (nowy build); brak CreationDate → droga główna', () => {
    const dec = (b64: string) => signing.decodeB64(b64);
    const c = Date.UTC(2026, 9, 2, 18, 37);
    expect(signing.parseRenewKind(dec(profileB64(c, c + 7 * DAY)))).toBe('sideloadly');
    // profil ad hoc z EAS: 02.10.2026 → 02.10.2027 (pierwszy build na iPhonie)
    expect(signing.parseRenewKind(dec(profileB64(c, Date.UTC(2027, 9, 2, 18, 37), '<key>Entitlements</key><dict><key>get-task-allow</key><false/></dict><key>ProvisionedDevices</key><array><string>00008110-000A</string></array>')))).toBe('rebuild');
    expect(signing.parseRenewKind('<key>ExpirationDate</key><date>2027-10-02T18:37:00Z</date>')).toBe('rebuild');
    expect(signing.parseRenewKind('')).toBe('rebuild');
    // granica: FREE_PROFILE_MAX_DAYS włącznie
    expect(signing.parseRenewKind(dec(profileB64(c, c + signing.FREE_PROFILE_MAX_DAYS * DAY)))).toBe('sideloadly');
    expect(signing.parseRenewKind(dec(profileB64(c, c + signing.FREE_PROFILE_MAX_DAYS * DAY + 1000)))).toBe('rebuild');
  });

  test('powiadomienie dzień przed wygaśnięciem: ad hoc → GitHub (bez Sideloadly), darmowe Apple ID → Sideloadly', async () => {
    await fresh();
    useProfile(profileB64(Date.now() - 360 * DAY, Date.now() + 5 * DAY)); global.__notifications.length = 0;
    await signing.scheduleReminder();
    const body = (global.__notifications as { content: { body: string } }[]).map(n => n.content.body);
    expect(body).toEqual(['Zrób backup (Więcej → Backup) i zbuduj aplikację od nowa w GitHubie: iPhone (EAS) → build. Dane zostają.']);
    useProfile(profileB64(Date.now() - 2 * DAY, Date.now() + 5 * DAY)); global.__notifications.length = 0;
    await signing.scheduleReminder();
    expect((global.__notifications as { content: { body: string } }[]).map(n => n.content.body)).toEqual(['Zrób backup (Więcej → Backup) i odnów w Sideloadly. Dane zostają.']);
  });

  test('baner na ekranie głównym: ad hoc → build w GitHubie, bez słowa o Sideloadly (PL i EN)', async () => {
    useProfile(profileB64(Date.now() - 364 * DAY, Date.now() + 1.2 * DAY));
    await renderApp(); await flushAll(50);
    expect(screen.getByText(/^Podpis aplikacji wygasa (za|dziś)/)).toBeTruthy();
    expect(screen.getByText('Zrób backup, potem w GitHubie: Actions → iPhone (EAS) → build i zainstaluj z linku. Dane zostają w telefonie.')).toBeTruthy();
    expect(screen.queryByText(/Sideloadly/)).toBeNull();
    useProfile(profileB64(Date.now() - 364 * DAY, Date.now() + 1.2 * DAY));
    await renderApp({ locale: 'en' }); await flushAll(50);
    expect(screen.getByText('Make a backup, then on GitHub: Actions → iPhone (EAS) → build, and install from the link. Your data stays on the phone.')).toBeTruthy();
    expect(screen.queryByText(/Sideloadly/)).toBeNull();
  });

  test('baner: darmowe Apple ID (7 dni) → nadal Sideloadly; profil wygasły ad hoc → „zbuduj ją od nowa w GitHubie”', async () => {
    useProfile(profileB64(Date.now() - 6 * DAY, Date.now() + 1.2 * DAY));
    await renderApp(); await flushAll(50);
    expect(screen.getByText('Zrób backup i odnów w Sideloadly (ok. 2 min). Dane zostają w telefonie.')).toBeTruthy();
    useProfile(profileB64(Date.now() - 366 * DAY, Date.now() - DAY));
    await renderApp(); await flushAll(50);
    expect(screen.getByText('Podpis aplikacji wygasł — zbuduj ją od nowa w GitHubie.')).toBeTruthy();
    expect(screen.queryByText(/Sideloadly/)).toBeNull();
  });

  test('profil ad hoc z dużym zapasem (rok) → brak banera, jak dotąd (> 2 dni)', async () => {
    useProfile(profileB64(Date.now() - DAY, Date.now() + 364 * DAY));
    await renderApp(); await flushAll(50);
    expect(screen.queryByText(/^Podpis aplikacji/)).toBeNull();
  });
});

describe('T-055 gumy bez kg: dawne nominalKg tylko przyjmowane przy imporcie', () => {
  test('świeża instalacja, nowa guma z ekranu Gumy i zapis — bez pola nominalKg', async () => {
    await renderApp(); await flushAll(10);
    expect(store.getState().bands.length).toBeGreaterThan(0); for (const b of store.getState().bands) expect(b).not.toHaveProperty('nominalKg');
    await go('/more/bands'); await flushAll(10); await tap(screen.getByText('+ Guma')); await flushAll(400); await store.flush();
    expect(global.__kv.get('state')).not.toMatch(/nominalKg/); expect(JSON.stringify(backup.buildBackup())).not.toMatch(/nominalKg/);
  });
  test('stara kopia z asystą kg gum (różne postaci) importuje się; pole odpada, gumy (kolor, poziom) i serie bez zmian', async () => {
    await fresh(); const old = seedWithDemo() as any; old.bands[0].nominalKg = 20; old.bands[1].nominalKg = '12,5'; old.bands[2].nominalKg = { v: 1 };
    const pu = old.exercises.find((e: any) => e.name === 'Pull Up');
    old.workouts = [{ id: 'w1', startedAt: Date.now() - 86400e3, finishedAt: Date.now() - 86000e3, templateName: 'T', note: '', exercises: [{ id: 'e1', exerciseId: pu.id, restSec: 90, sets: [{ id: 's1', reps: 8, addKg: -20, bandId: old.bands[0].id, done: true, kind: 'normal' }] }] }];
    const st = backup.parseBackup(JSON.stringify({ format: 'trening-backup', schemaVersion: SCHEMA_VERSION, exportedAt: '2026-10-01T10:00:00Z', state: old }));
    expect(st.bands.map(b => [b.color, b.level])).toEqual(old.bands.map((b: any) => [b.color, b.level])); for (const b of st.bands) expect(b).not.toHaveProperty('nominalKg');
    const s0 = st.workouts[0].exercises[0].sets[0]; expect([s0.bandId, s0.addKg, s0.reps]).toEqual([old.bands[0].id, -20, 8]);
    store.replaceState(st); expect(store.migrate(JSON.parse(JSON.stringify(store.getState())))).toEqual(JSON.parse(JSON.stringify(store.getState()))); /* idempotentnie */
  });
  test('po imporcie starej kopii z kg gum: przycisk gumy w treningu nie wpisuje kg; ręczne ±kg zostaje przy zmianie, zdjęciu i usunięciu gumy', async () => {
    const old = seedWithDemo() as any; old.bands.forEach((b: any) => { b.nominalKg = 20; }); old.exercises.find((e: any) => e.name === 'Pull Up').bandAssistable = true;
    await renderApp({ saved: old }); await flushAll(10);
    await act(async () => { store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); }); await flushAll(10);
    const s0 = () => store.getState().active!.exercises[0].sets[0];
    await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); expect([s0().bandId !== '', s0().addKg]).toEqual([true, '']);
    await act(async () => { s0().addKg = -7.5; store.save(store.getState().active); });
    for (let i = 0; i < 3; i++) { await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); expect(s0().addKg).toBe(-7.5); }
    expect(s0().bandId).toBe(''); /* trzy gumy: cienka → średnia → gruba → brak */
    await tap(screen.getAllByLabelText(/^Guma: /)[0]); await flushAll(5); const id = s0().bandId;
    await go('/more/bands'); await flushAll(10);
    const order = [...store.getState().bands].sort((a, b) => a.level - b.level); const row = order.findIndex(b => b.id === id); expect(row).toBe(0);
    await swipeDelete(/^Usuń gumę: /); pressAlert('Usunąć gumę?', 'Usuń'); await flushAll(5);
    expect([s0().bandId, s0().addKg]).toEqual(['', -7.5]);
  });
  test('jeden cykl gum (store.nextBandId) dla treningu i edytora historii: brak → cienka → … → gruba → brak; usunięta guma → od początku', async () => {
    await fresh(); const [A, B, C] = [...store.getState().bands].sort((a, b) => a.level - b.level);
    expect([store.nextBandId(''), store.nextBandId(A.id), store.nextBandId(B.id), store.nextBandId(C.id), store.nextBandId('usunięta')]).toEqual([A.id, B.id, C.id, '', A.id]);
  });
});

describe('Q-018 zmiana sprzętu ćwiczenia: historia bez 0 kg (83b: obliczenia tylko z pola obecnego sprzętu)', () => {
  /** Własne ćwiczenie „inne” z dwiema sesjami 40 kg × 10 i 42,5 kg × 8, potem sprzęt → masa ciała (jak chip „Sprzęt” w edycji ćwiczenia). */
  async function otherToBodyweight() {
    const st = store.getState(); const x = { ...st.exercises.find(y => y.name === 'Back Squat')!, id: 'q18', name: 'Wiosło Q18', lib: undefined, equipment: 'inne' as const, loadMode: 'total' as const, metric: 'weight_reps' as const, bandAssistable: false };
    st.exercises.push(x); store.save(x);
    const d = Date.now() - 3 * 86400e3; addWorkout(d, [['Wiosło Q18', [{ weight: 40, reps: 10 }]]]); const w2 = addWorkout(d + 86400e3, [['Wiosło Q18', [{ weight: 42.5, reps: 8 }]]]);
    const before = { vol: store.volume(w2), rec: stats.recordsFor(ex('Wiosło Q18')), sum: store.setSummary(ex('Wiosło Q18'), w2.exercises[0].sets[0]) };
    store.setEquipment(ex('Wiosło Q18'), 'masa ciała'); return { w2, before };
  }
  test('opis serii po zmianie „inne” → masa ciała pokazuje 42,5 (nie 0); obliczenia — runda 83b: 42,5 kg maszyny to nie dociążenie', async () => {
    await fresh(); const { w2, before } = await otherToBodyweight(); const x = ex('Wiosło Q18');
    expect(before.vol).toBe(340); expect(before.sum).toBe('42,5×8'); expect(before.rec.maxLoad).toBe(42.5);
    expect(store.shownLoad(x, w2.exercises[0].sets[0])).toBe(42.5); expect(store.setSummary(x, w2.exercises[0].sets[0])).toBe('8@+42,5');
    /* 83b (MEDIUM 1): objętość, rekordy i progresja tylko z pola ±kg — dawne „42,5 / e1RM 53,8” zostawały rekordem ćwiczenia z masą ciała */
    expect(store.setLoad(x, w2.exercises[0].sets[0])).toBe(0); expect(store.volume(w2)).toBe(0);
    const rec = stats.recordsFor(x); expect(rec.maxLoad).toBe(0); expect(rec.bestE1rm).toBe(0);
  });
  test('ekran sesji w historii pokazuje 42,5, nie 0 — ta sama wartość co CSV', async () => {
    await renderApp(); const { w2 } = await otherToBodyweight(); await flushAll(10);
    await go(`/history/${w2.id}`); await flushAll(10);
    expect(screen.getAllByText('42,5').length).toBeGreaterThan(0); expect(screen.queryByText(/^0$/)).toBeNull();
    expect(backup.buildCsv()).toMatch(/Wiosło Q18,1,42\.5,8/);
  });
  test('odwrotnie: masa ciała (asysta −20 / dociążenie +10) → sztanga: widok ≥ 0 jak CSV (83b, LOW 1), obliczenia bez obcych ±kg', async () => {
    await fresh(); const d = Date.now() - 2 * 86400e3; const w = addWorkout(d, [['Pull Up', [{ addKg: -20, reps: 8 }, { addKg: 10, reps: 5 }]]]);
    store.setEquipment(ex('Pull Up'), 'sztanga'); const x = ex('Pull Up'); const [a, b] = w.exercises[0].sets;
    expect([store.shownLoad(x, a), store.shownLoad(x, b)]).toEqual([0, 10]); expect([store.setLoad(x, a), store.setLoad(x, b)]).toEqual([0, 0]);
    expect(store.volume(w)).toBe(0); expect(stats.recordsFor(x).maxLoad).toBe(0);
  });
  test('bez zmiany sprzętu nic się nie zmienia: wpisane 0 nie bierze wartości z drugiego pola', async () => {
    await fresh(); const x = ex('Pull Up'); const s = { weight: 50, addKg: 0 } as any; expect(store.shownLoad(x, s)).toBe(0);
    const bs = ex('Back Squat'); expect(store.shownLoad(bs, { weight: 0, addKg: 15 } as any)).toBe(0); expect(store.shownLoad(bs, { weight: '', addKg: '' } as any)).toBe(0);
  });
});

describe('Q-019 kopia bezpieczeństwa przed importem i „Wyczyść dane”', () => {
  const FS = require('expo-file-system/legacy'); const DP = require('expo-document-picker');
  const AUTO = Array.from({ length: 10 }, (_, i) => `trening-2026-09-${String(10 + i).padStart(2, '0')}-080000.json`);
  const SAFE = Array.from({ length: 10 }, (_, i) => `trening-przed-importem-2026-08-${String(10 + i).padStart(2, '0')}-070000.json`);
  const setupFs = (files: string[]) => {
    /* katalog jak prawdziwy: zawiera też pliki zapisane w tym teście */
    FS.readDirectoryAsync.mockImplementation(async () => [...files, ...(FS.writeAsStringAsync as jest.Mock).mock.calls.map((c: any) => String(c[0]).split('/').pop())]); FS.deleteAsync.mockClear(); FS.writeAsStringAsync.mockClear();
    FS.writeAsStringAsync.mockImplementation(async () => {});
  };
  afterEach(() => { FS.readDirectoryAsync.mockImplementation(async () => []); FS.writeAsStringAsync.mockImplementation(async () => {}); });
  const writes = (re: RegExp) => (FS.writeAsStringAsync as jest.Mock).mock.calls.filter((c: any) => re.test(c[0]));
  /** Trening w toku (Back Squat 100 × 5 odhaczone) przy wyłączonej kopii automatycznej. */
  async function inProgress() {
    await act(async () => { store.getState().settings.autoBackup = false; store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; Object.assign(a.exercises[0].sets[0], { weight: 100, reps: 5 }); store.save(a); store.toggleDone(0, 0); }); await flushAll(10);
  }
  async function importFile(txt: string) {
    FS.readAsStringAsync.mockImplementationOnce(async () => txt); DP.getDocumentAsync.mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///inny.json' }] }));
    await go('/more/backup'); await flushAll(10);
    await tap(screen.getByText('Importuj backup')); await act(async () => { pressAlert('Nadpisać dane?', 'Importuj'); }); await flushAll(50); await flushAll(50);
  }
  test('import: przed zastąpieniem danych kopia z treningiem w toku (mimo wyłączonej kopii automatycznej); kopie po treningu nietknięte, rotacja tylko w swojej puli', async () => {
    await fresh(); const other = JSON.stringify(backup.buildBackup()); /* poprawny plik: świeże dane bez treningu */
    await renderApp(); await inProgress(); setupFs([...AUTO, ...SAFE, 'moj-plik.json']);
    await importFile(other);
    expect(store.getState().active).toBeNull(); /* import się wykonał */
    const w = writes(/\/Backup\/trening-przed-importem-\d{4}-\d{2}-\d{2}-\d{6}\.json$/); expect(w).toHaveLength(1);
    const kopia = JSON.parse(w[0][1]); expect(kopia.format).toBe('trening-backup'); expect(kopia.state.active.exercises[0].sets[0]).toMatchObject({ weight: 100, reps: 5, done: true });
    expect(writes(/\/Backup\/trening-\d{4}/)).toHaveLength(0); /* kopia automatyczna wyłączona — tylko kopia bezpieczeństwa */
    const del = (FS.deleteAsync as jest.Mock).mock.calls.map((c: any) => c[0].split('/').pop()); expect(del).toEqual([SAFE[0]]); /* 10 + nowa → najstarsza z puli kopii bezpieczeństwa */
    expect(backup.parseBackup(w[0][1]).active!.exercises[0].sets[0].weight).toBe(100); /* kopię da się zaimportować */
  });
  test('kopia po treningu nie wypycha kopii bezpieczeństwa (osobne pule)', async () => {
    await fresh(); setupFs([...AUTO, 'trening-2026-09-25-080000.json', ...SAFE]);
    await backup.autoBackup(); const del = (FS.deleteAsync as jest.Mock).mock.calls.map((c: any) => c[0].split('/').pop());
    expect(del.length).toBeGreaterThan(0); expect(del.every((f: string) => /^trening-\d{4}/.test(f))).toBe(true);
  });
  test('zły plik: nic nie jest zastępowane i nie powstaje kopia; nieudany zapis kopii przerywa import — dane bez zmian', async () => {
    await renderApp(); await inProgress(); setupFs([]);
    await importFile('{"to": "nie backup"}');
    expect(writes(/przed-importem/)).toHaveLength(0); expect(store.getState().active).not.toBeNull();
    await fresh(); const other = JSON.stringify(backup.buildBackup());
    await renderApp(); await inProgress(); setupFs([]); FS.writeAsStringAsync.mockImplementation(async () => { throw new Error('dysk pełny'); });
    await importFile(other);
    expect(store.getState().active).not.toBeNull(); expect(store.getState().active!.exercises[0].sets[0].weight).toBe(100);
    expect(global.__alerts.some(a => a.title === 'Import przerwany' && /kopii bezpieczeństwa/.test(a.msg ?? ''))).toBe(true);
  });
  test('„Wyczyść wszystkie dane”: najpierw kopia (trening w toku, historia), potem czyszczenie; nieudana kopia → dane zostają', async () => {
    await renderApp(); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 90, reps: 5 }]]]); await inProgress(); setupFs([...AUTO]);
    await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Wyczyść wszystkie dane')); await act(async () => { pressAlert('Na pewno?', 'Wyczyść'); }); await flushAll(50);
    const w = writes(/\/Backup\/trening-przed-czyszczeniem-\d{4}-\d{2}-\d{2}-\d{6}\.json$/); expect(w).toHaveLength(1);
    const k = JSON.parse(w[0][1]).state; expect(k.workouts).toHaveLength(1); expect(k.active.exercises[0].sets[0].weight).toBe(100);
    expect(store.getState().workouts).toHaveLength(0); expect(store.getState().active).toBeNull(); expect(FS.deleteAsync).not.toHaveBeenCalled();
    await renderApp(); addWorkout(Date.now() - 86400e3, [['Back Squat', [{ weight: 90, reps: 5 }]]]); setupFs([]); FS.writeAsStringAsync.mockImplementation(async () => { throw new Error('dysk pełny'); });
    await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Wyczyść wszystkie dane')); await act(async () => { pressAlert('Na pewno?', 'Wyczyść'); }); await flushAll(50);
    expect(store.getState().workouts).toHaveLength(1); expect(global.__alerts.some(a => a.title === 'Dane nie zostały wyczyszczone')).toBe(true);
  });
});

describe('Q-021 lb: ponowny wpis tej samej liczby nie zmienia kg', () => {
  afterEach(() => units.applyUnit('kg'));
  /** Szablon: Back Squat 3 serie, start 61,23 kg (poza siatką funtów; = 135,0 lb na ekranie); jednostka lb; trening w toku. */
  async function start(unit: 'kg' | 'lb' = 'lb') {
    await renderApp(); const tpl = store.newTemplate();
    tpl.items.push({ id: 'q21', exerciseId: ex('Back Squat').id, sets: 3, repMin: 5, repMax: 5, restSec: 60, startWeight: 61.23, targetSec: '', groupId: null });
    await act(async () => { store.getState().settings.unit = unit; store.applyPrefs(); store.save(); store.startFromTemplate(tpl); }); await flushAll(10);
    const sets = () => store.getState().active!.exercises[0].sets; expect(sets().map(x => x.weight)).toEqual([61.23, 61.23, 61.23]);
    return { sets, field: () => screen.getAllByLabelText(unit)[0] };
  }
  test('wpis „135” (całość i znak po znaku) zostawia 61,23 kg; po ✓ dalsze serie bez zmian', async () => {
    const { sets, field } = await start(); expect(units.wOut(61.23)).toBe(135);
    await act(async () => { fireEvent.changeText(field(), '135'); }); await flushAll(5); expect(sets()[0].weight).toBe(61.23);
    for (const txt of ['1', '13', '135']) await act(async () => { fireEvent.changeText(field(), txt); }); await flushAll(5);
    expect(sets()[0].weight).toBe(61.23); /* przy pisaniu po znaku kg zmieniają się po drodze, ale końcowa liczba = ta sprzed edycji */
    await act(async () => { fireEvent(field(), 'endEditing'); sets()[0].reps = 5; store.toggleDone(0, 0); }); await flushAll(5);
    expect(sets().map(x => x.weight)).toEqual([61.23, 61.23, 61.23]);
  });
  test('inna liczba nadal zmienia kg (przyciąganie do „okrągłych” kg) i przenosi się na nieruszone serie', async () => {
    const { sets, field } = await start();
    await act(async () => { fireEvent.changeText(field(), '140'); }); await flushAll(5); expect(sets()[0].weight).toBe(units.wIn(140));
    await act(async () => { fireEvent(field(), 'endEditing'); sets()[0].reps = 5; store.toggleDone(0, 0); }); await flushAll(5);
    expect(sets().map(x => x.weight)).toEqual([units.wIn(140), units.wIn(140), units.wIn(140)]);
    /* nowa edycja zaczyna się od nowej wartości: powrót do „135” = zwykły wpis (61,25), bo pole pokazywało 140 */
    await act(async () => { fireEvent.changeText(screen.getAllByLabelText('lb')[1], '135'); }); await flushAll(5); expect(sets()[1].weight).toBe(units.wIn(135));
  });
  test('edytor szablonu i poranna waga: ta sama zasada (start 61,23 kg = 135 lb, waga 81,43 kg = 179,5 lb)', async () => {
    await renderApp(); const tpl = store.newTemplate();
    tpl.items.push({ id: 'q21', exerciseId: ex('Back Squat').id, sets: 3, repMin: 5, repMax: 5, restSec: 60, startWeight: 61.23, targetSec: '', groupId: null });
    await act(async () => { store.getState().settings.unit = 'lb'; store.applyPrefs(); store.save(tpl); }); await go('/template/' + tpl.id); await flushAll(10); await startEdit(); await openCard(0);
    await act(async () => { fireEvent.changeText(screen.getAllByDisplayValue('135')[0], '135'); }); await flushAll(5); expect(tplDraft(tpl.id).items[0].startWeight).toBe(61.23); await saveEdit(); expect(tpl.items[0].startWeight).toBe(61.23);
    /* poranna waga — ekran usunięty 05.10.2026 (decyzja właściciela) */
  });
  test('kg: wpis różniący się o 0,01 to nowa wartość (bez tolerancji)', async () => {
    const { sets, field } = await start('kg');
    await act(async () => { fireEvent.changeText(field(), '61,24'); }); await flushAll(5); expect(sets()[0].weight).toBe(61.24);
  });
});
