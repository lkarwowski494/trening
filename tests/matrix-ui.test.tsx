/* Macierz testów (polecenie właściciela 06.10.2026) — UI i TEKST bez testu (scripts/test-matrix.mjs --list).
 * Każda pozycja: prawdziwa aplikacja (renderApp/go/tap/type) doprowadzona do stanu, w którym element albo komunikat się pokazuje,
 * asercja, że jest widoczny (tekst / etykieta dostępności / tytuł i treść alertu), a dla elementów interaktywnych — naciśnięcie albo wpis
 * i sprawdzenie skutku w danych lub na ekranie. Pogrupowane według ekranu (trasy). Teksty zapisane dosłownie (część stała jest w pliku). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as edit from '@/lib/edit';
import * as signing from '@/lib/signing';
import { AUTO_KEEP } from '@/lib/backup';
import { SCHEMA_VERSION, muscleLoadOf } from '@/lib/seed';
import { equipEntry } from '@/lib/equipment';
import { LOAD_LIMITS } from '@/lib/loads';
import { addLocation } from '@/lib/locations';
import { t as tr, exName } from '@/lib/i18n';
import { fresh, ex, addWorkout, pressAlert, withDemoTemplates } from './helpers';
import { renderApp, flushAll, screen, go, tap, type, act, fireEvent, expandEquip, openCard } from './app';
import { loc } from './locations-fixtures';

/* Zgoda na powiadomienia sterowana z testu (global.__notifDenied) — reszta jak w tests/setup.js. */
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: async () => ({ granted: !(global as any).__notifDenied }),
  requestPermissionsAsync: async () => ({ granted: !(global as any).__notifDenied }),
  scheduleNotificationAsync: async (req: any) => { (global as any).__notifications.push(req); return 'n' + (global as any).__notifications.length; },
  cancelScheduledNotificationAsync: async (id: string) => { (global as any).__cancelled.push(id); },
  getAllScheduledNotificationsAsync: async () => [],
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval', DATE: 'date', WEEKLY: 'weekly' },
}));

jest.setTimeout(60000);
afterEach(async () => { (global as any).__notifDenied = false; try { store.getState(); } catch { return; } await timer.stop(); await timer.stopSet(); });

const H = 3600e3, DAY = 86400e3;
const FS = require('expo-file-system/legacy');
const Sharing = require('expo-sharing');
const Picker = require('expo-document-picker');
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const alertOf = (title: string) => [...global.__alerts].reverse().find(a => a.title === title);
/** Element o etykiecie `label` z podpowiedzią `hint` (chipy pól, pola edytora ciężarów z nazwą pozycji). */
const byHint = (label: string, hint: string) => { const el = screen.getAllByLabelText(label).find(x => x.props.accessibilityHint === hint); if (!el) throw new Error(`no ${label} with hint ${hint}`); return el; };
const flip = async (label: string, v: boolean) => { await act(async () => { fireEvent(screen.getAllByLabelText(label)[0], 'valueChange', v); }); await flushAll(10); };
const snap = () => JSON.parse(JSON.stringify(store.getState()));
/** Zapisany stan po przygotowaniu w store (fresh → fn → flush). */
async function prepared(fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') { await fresh(undefined, locale); fn(); await store.flush(); return snap(); }

/* ======================================================================= /more/settings */
describe('/more/settings', () => {
  test('Jednostka ciężaru (segment kg/lb) przełącza jednostkę; opisy przełączników RPE i podpowiedzi progresji; przełączniki działają', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    expect(screen.getAllByText('Jednostka ciężaru').length).toBeGreaterThan(0);
    await tap(byHint('lb', 'Jednostka ciężaru')); await flushAll(5);
    expect(store.getState().settings.unit).toBe('lb'); expect(byHint('lb', 'Jednostka ciężaru').props.accessibilityState.selected).toBe(true);
    await tap(byHint('kg', 'Jednostka ciężaru')); expect(store.getState().settings.unit).toBe('kg');
    expect(screen.getByText('opcjonalne pole, nie wpływa na objętość')).toBeTruthy();
    expect(screen.getByLabelText('RPE / RIR przy serii').props.accessibilityHint).toBe('opcjonalne pole, nie wpływa na objętość');
    const rpe0 = store.getState().settings.showRpe; await flip('RPE / RIR przy serii', !rpe0); expect(store.getState().settings.showRpe).toBe(!rpe0);
    expect(screen.getByText('↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń')).toBeTruthy();
    expect(screen.getByLabelText('Podpowiedź progresji').props.accessibilityHint).toBe('↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń');
    const ph0 = store.getState().settings.progressHint; await flip('Podpowiedź progresji', !ph0); expect(store.getState().settings.progressHint).toBe(!ph0);
    expect(screen.getByText('Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie.')).toBeTruthy();
  });

  test('Apple Health bez zgody/HealthKit: komunikat i przełącznik zostaje wyłączony', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    await flip('Zapisuj zakończone treningi do Apple Health', true); await flushAll(10);
    const a = alertOf('Apple Health niedostępne')!; expect(a.msg).toBe('Brak zgody na zapis treningów. Włącz ją w aplikacji Zdrowie: profil → Aplikacje → Trening.');
    expect(store.getState().settings.healthSync).toBe(false);
  });

  test('Sprawdź zgodę na powiadomienia: zgoda → „działają”, brak zgody → „Brak zgody” z drogą do Ustawień iOS', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Sprawdź zgodę na powiadomienia')); await flushAll(10);
    expect(lastAlert()).toMatchObject({ title: 'Powiadomienia działają', msg: 'Koniec przerwy da znać nawet na zablokowanym ekranie.' });
    (global as any).__notifDenied = true;
    await tap(screen.getByText('Sprawdź zgodę na powiadomienia')); await flushAll(10);
    expect(lastAlert()).toMatchObject({ title: 'Brak zgody', msg: 'Włącz powiadomienia dla Trening w Ustawieniach iOS.' });
  });

  test('Wyczyść wszystkie dane: ostrzeżenie (z dopiskiem o nieczytelnych danych) i reset po „Wyczyść”', async () => {
    await renderApp({ saved: '{zle' }); await flushAll(10);
    await act(async () => { store.getState().settings.defaultRest = 333; store.save(); });
    await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Wyczyść wszystkie dane'));
    expect(lastAlert()).toMatchObject({ title: 'Na pewno?', msg: 'Usunie ćwiczenia, szablony i całą historię oraz przywróci ustawienia domyślne (także miejsca, sprzęt i gumy). Przedtem obecne dane zapiszą się jako kopia w Plikach: Trening → Backup (można ją zaimportować). Kopia obejmie też poprzednie, nieczytelne dane.' });
    await act(async () => { pressAlert('Na pewno?', 'Wyczyść'); }); await flushAll(50);
    expect(store.getState().settings.defaultRest).not.toBe(333); expect(store.getRecovery()).toBeNull();
  });
});

/* ======================================================================= /more/language */
describe('/more/language', () => {
  test('dopisek o nazwach ćwiczeń; wybór języka zmienia ustawienie', async () => {
    await renderApp(); await go('/more/language'); await flushAll(10);
    expect(screen.getByText('Nazwy ćwiczeń z biblioteki są po angielsku we wszystkich językach poza polskim.')).toBeTruthy();
    await tap(screen.getByLabelText('English')); await flushAll(10);
    expect(store.getState().settings.language).toBe('en');
  });
});

/* ======================================================================= /more/backup */
describe('/more/backup', () => {
  test('opisy eksportu, CSV i kopii automatycznej (wł./wył.); eksport JSON i CSV otwiera udostępnianie z tytułem', async () => {
    await renderApp(); await go('/more/backup'); await flushAll(10);
    expect(screen.getByText('Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej.')).toBeTruthy();
    expect(screen.getByText('CSV: ciężar w jednostce z ustawień (kg), dystans w metrach.')).toBeTruthy();
    expect(AUTO_KEEP).toBe(10);
    expect(store.getState().settings.autoBackup).toBe(true);
    expect(screen.getByText('Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → Trening → Backup, ostatnie 10). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego Apple ID wyeksportuj backup na zewnątrz.')).toBeTruthy();
    Sharing.shareAsync.mockClear();
    await tap(screen.getByText('Eksportuj backup (plik JSON)')); await flushAll(20);
    expect(Sharing.shareAsync.mock.calls.pop()[1]).toMatchObject({ mimeType: 'application/json', dialogTitle: 'Backup treningów' });
    await tap(screen.getByText('Eksportuj historię do CSV')); await flushAll(20);
    expect(Sharing.shareAsync.mock.calls.pop()[1]).toMatchObject({ mimeType: 'text/csv', dialogTitle: 'Eksport CSV' });
    await renderApp({ saved: await prepared(() => { store.getState().settings.autoBackup = false; }) }); await go('/more/backup'); await flushAll(10); /* ekran odświeża się tylko po zmianie preferencji (usePrefsTick) */
    expect(screen.getByText('Kopia automatyczna po treningu jest wyłączona (Ustawienia).')).toBeTruthy();
  });

  test('Importuj: potwierdzenie; plik z nowszego schematu → komunikat; nieudana kopia bezpieczeństwa → import przerwany, dane bez zmian', async () => {
    await renderApp(); await go('/more/backup'); await flushAll(10);
    await tap(screen.getByText('Importuj backup'));
    expect(lastAlert()).toMatchObject({ title: 'Nadpisać dane?', msg: 'Import zastąpi wszystkie obecne dane zawartością pliku. Obecne dane (także trening w toku) zapiszą się najpierw jako kopia w Plikach: Trening → Backup.' });
    const file = (txt: string) => { Picker.getDocumentAsync.mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file:///cache/x.json' }] }); FS.readAsStringAsync.mockResolvedValueOnce(txt); };
    file(JSON.stringify({ format: 'trening-backup', schemaVersion: SCHEMA_VERSION + 5, state: { schemaVersion: SCHEMA_VERSION + 5 } }));
    await act(async () => { pressAlert('Nadpisać dane?', 'Importuj'); }); await flushAll(20);
    expect(lastAlert()).toMatchObject({ title: 'Backup z nowszej wersji aplikacji', msg: `Plik ma schemat ${SCHEMA_VERSION + 5}, a ta wersja obsługuje do ${SCHEMA_VERSION}. Zaktualizuj aplikację.` });
    const other = snap(); other.settings.defaultRest = 222;
    file(JSON.stringify(other)); FS.makeDirectoryAsync.mockRejectedValueOnce(new Error('brak miejsca'));
    await tap(screen.getByText('Importuj backup')); await act(async () => { pressAlert('Nadpisać dane?', 'Importuj'); }); await flushAll(20);
    expect(lastAlert()).toMatchObject({ title: 'Import przerwany', msg: 'Nie udało się zapisać kopii bezpieczeństwa w Plikach — dane nie zostały zmienione.' });
    expect(store.getState().settings.defaultRest).not.toBe(222);
  });
});

/* ======================================================================= /more/bands */
describe('/more/bands', () => {
  test('opis gum; pusta lista → „Brak gum…”, „+ Guma” dodaje gumę', async () => {
    const saved = await prepared(() => { store.getState().bands = []; });
    await renderApp({ saved }); await go('/more/bands'); await flushAll(10);
    expect(screen.getByText('Kolor i poziom trudności: 1 = cienka, 7 = bardzo gruba. Gumy nie mają kilogramów — przy serii zapisujesz, którą gumą pomagałeś. Rekordem są powtórzenia bez gumy, a postęp z gumą to zejście na niższy poziom.')).toBeTruthy();
    expect(screen.getByText('Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu.')).toBeTruthy();
    await tap(screen.getByText('+ Guma')); await flushAll(5);
    expect(store.getState().bands).toHaveLength(1); expect(screen.queryByText('Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu.')).toBeNull();
  });

  test('usunięcie gumy używanej w historii i w trwającym treningu: ostrzeżenie o „?” w historii i o nieodhaczonych seriach', async () => {
    let bandId = '';
    const saved = await prepared(() => { const b = store.getState().bands[0]; bandId = b.id;
      addWorkout(Date.now() - 2 * DAY, [['Pull Up', [{ reps: 8, bandId: b.id }]]]);
      store.startEmpty(); store.addExerciseToActive(ex('Pull Up')); store.getState().active!.exercises[0].sets[0].bandId = b.id; });
    await renderApp({ saved }); await go('/more/bands'); await flushAll(10);
    const b = store.getState().bands.find(x => x.id === bandId)!;
    await tap(byHint('Usuń gumę', store.bandColor(b)));
    expect(lastAlert()).toMatchObject({ title: 'Usunąć gumę?', msg: 'W historii serie z tą gumą pokażą „?”. W trwającym treningu guma zniknie z nieodhaczonych serii.' });
    await act(async () => { pressAlert('Usunąć gumę?', 'Usuń'); }); await flushAll(5);
    expect(store.getState().bands.some(x => x.id === bandId)).toBe(false); expect(store.getState().active!.exercises[0].sets[0].bandId).toBe('');
  });
});

/* ======================================================================= /more/locations i /more/location/[id] */
describe('/more/locations, /more/location/[id]', () => {
  test('lista miejsc: wyjaśnienie', async () => {
    await renderApp(); await go('/more/locations'); await flushAll(10);
    expect(screen.getByText('Gdzie trenujesz i jaki sprzęt tam masz. Wybór ćwiczenia pokazuje wtedy to, co da się zrobić w miejscu treningu, a podpowiedź „↑” proponuje ciężary, które naprawdę masz. Miejsce wybierasz na starcie treningu.')).toBeTruthy();
  });

  test('nieistniejące miejsce → „Nie ma takiego miejsca.”', async () => {
    await renderApp(); await go('/more/location/brak'); await flushAll(10);
    expect(screen.getByText('Nie ma takiego miejsca.')).toBeTruthy();
  });

  test('gumy w miejscu: opis poziomów i przełączenie poziomu', async () => {
    const saved = await prepared(() => { const s = store.getState().settings; s.locations.push(loc('Dom', [equipEntry('bands')], 'lb1')); s.mainLocationId = 'lb1'; });
    await renderApp({ saved }); await go('/more/location/lb1'); await flushAll(10); await expandEquip();
    expect(screen.getByText('Poziomy gum, które masz w tym miejscu (1 = cienka, 7 = bardzo gruba).')).toBeTruthy();
    const name = screen.getAllByLabelText(/: poziom 7$/)[0]; const was = name.props.accessibilityState.checked;
    await tap(name); await flushAll(5);
    expect(screen.getAllByLabelText(/: poziom 7$/)[0].props.accessibilityState.checked).toBe(!was);
  });

  test('usuwanie: główne (gdy jest inne) → „Najpierw ustaw inne…”; używane → ostrzeżenie o „(usunięte miejsce)” i usunięcie', async () => {
    const saved = await prepared(() => { const s = store.getState().settings; s.locations.push(loc('Dom', [], 'm1')); s.mainLocationId = 'm1'; const g = addLocation('gym', 'Siłownia');
      const w = addWorkout(Date.now() - DAY, [['Back Squat', [{ weight: 100, reps: 5 }]]]); w.locationId = g.id; });
    await renderApp({ saved }); await go('/more/location/m1'); await flushAll(10);
    await tap(screen.getByText('Usuń')); expect(lastAlert()).toMatchObject({ title: 'To miejsce główne', msg: 'Najpierw ustaw inne miejsce jako główne.' });
    const gym = store.getState().settings.locations[1];
    await go(`/more/location/${gym.id}`); await flushAll(10);
    await tap(screen.getByText('Usuń'));
    expect(lastAlert()).toMatchObject({ title: 'Usunąć miejsce?', msg: 'Treningi i szablony z tym miejscem pokażą „(usunięte miejsce)”.' });
    await act(async () => { pressAlert('Usunąć miejsce?', 'Usuń'); }); await flushAll(10);
    expect(store.getState().settings.locations.map(l => l.id)).toEqual(['m1']);
  });
});

/* ======================================================================= components/LoadEditor (ekran miejsca) */
describe('LoadEditor (/more/location/[id])', () => {
  const EL = 'Stacja z oporem elektrycznym / magnetycznym (np. ViShape, Speediance, Tonal…)';
  const BAR = 'Sztanga (gryf olimpijski / prosty) + talerze', KB = 'Kettlebell', DBF = 'Hantle (stała waga albo z szybką regulacją)';
  async function open(entries: string[], tweak: (l: ReturnType<typeof loc>) => void = () => {}) {
    const saved = await prepared(() => { const s = store.getState().settings; const l = loc('Test', entries.map(e => equipEntry(e)), 'lt'); tweak(l); s.locations.push(l); s.mainLocationId = 'lt'; });
    await renderApp({ saved }); await go('/more/location/lt'); await flushAll(10); await expandEquip();
    return () => store.getState().settings.locations[0].equipment;
  }

  test('puste opisy: stacja „wpisz zakres na stronę i krok”, hantle na talerze „wpisz uchwyt i talerze”, lista „brak ciężarów…”; teksty talerzy', async () => {
    await open(['electric', 'db_plate', 'barbell', 'kettlebell']);
    expect(screen.getByText('wpisz zakres na stronę i krok')).toBeTruthy();
    expect(screen.getByText('wpisz uchwyt i talerze')).toBeTruthy();
    expect(screen.getByText('brak ciężarów — podpowiedź „↑” jak bez miejsca')).toBeTruthy();
    expect(screen.getByText(`Talerze: ciężar i liczba sztuk (wszystkie, dla obu hantli razem). Najwyżej ${LOAD_LIMITS.plateRows} rodzajów.`)).toBeTruthy();
    expect(screen.getByText('Talerze: ciężar i liczba sztuk (wszystkie, na obie strony razem). Najwyżej 30 rodzajów.')).toBeTruthy();
    expect(screen.getByText('Gryf (kg)')).toBeTruthy();
    await type(byHint('Gryf (kg)', BAR), '15'); expect((store.getState().settings.locations[0].equipment.find(e => e.item === 'barbell')!.load as any).base).toBe(15);
  });

  test('stacja: „min na stronę” zapisuje min; max < min → „Zakres jest niepoprawny…”; zbyt mały krok → „Za dużo ustawień…”', async () => {
    const eq = await open(['electric']); const spec = () => eq().find(e => e.item === 'electric')!.load as any;
    expect(screen.getByText('min na stronę')).toBeTruthy();
    await type(byHint('min na stronę', EL), '50'); expect(spec().min).toBe(50);
    await type(byHint('max na stronę', EL), '20'); await flushAll(5);
    expect(screen.getByText('Zakres jest niepoprawny: „max” musi być ≥ „min”, krok > 0. Ciężary nie są liczone.')).toBeTruthy();
    await type(byHint('min na stronę', EL), '0'); await type(byHint('max na stronę', EL), '1000'); await type(byHint('krok', EL), '0,01'); await flushAll(5);
    expect(spec().step).toBe(0.01);
    expect(screen.getByText(`Za dużo ustawień (najwyżej ${LOAD_LIMITS.rangeValues}) — zwiększ krok.`)).toBeTruthy();
    expect(LOAD_LIMITS.rangeValues).toBe(2000); expect(screen.getByText('Za dużo ustawień (najwyżej 2000) — zwiększ krok.')).toBeTruthy();
  });

  test('lista: zły zakres „Wypełnij” → komunikat; 300 ciężarów i dodanie kolejnego → „Za dużo ciężarów (najwyżej 300).”', async () => {
    const eq = await open(['kettlebell']); const spec = () => eq().find(e => e.item === 'kettlebell')!.load as any;
    await type(byHint('od', KB), '10'); await type(byHint('do', KB), '5'); await type(byHint('co', KB), '1');
    await tap(screen.getByLabelText(`Wypełnij zakresem — ${KB}`)); await flushAll(5);
    expect(screen.getByText('Zakres jest niepoprawny: „do” musi być ≥ „od”, krok > 0, wartości od 0,001 do 1000.')).toBeTruthy(); expect(spec().items).toHaveLength(0);
    await type(byHint('od', KB), '1'); await type(byHint('do', KB), '300'); await tap(screen.getByLabelText(`Wypełnij zakresem — ${KB}`)); await flushAll(5);
    expect(spec().items).toHaveLength(LOAD_LIMITS.listItems);
    await type(byHint('dodaj ciężar', KB), '301'); await tap(screen.getByLabelText(`Dodaj ciężar — ${KB}`)); await flushAll(5);
    expect(screen.getByText('Za dużo ciężarów (najwyżej 300).')).toBeTruthy(); expect(spec().items).toHaveLength(300);
  });

  test('preset modelu: podpowiedź „Wstaw ciężary modelu”; przy wpisanych ciężarach pytanie „{p} zastąpi…”, „Zastąp” wstawia model', async () => {
    const eq = await open(['db_fixed'], l => { (l.equipment[0].load as any).items = [{ w: 7, on: true }]; });
    const chip = screen.getByText('Gymtek 2,5–24 kg'); const btn = screen.getByLabelText('Gymtek 2,5–24 kg');
    expect(btn.props.accessibilityHint).toBe(`Wstaw ciężary modelu — ${DBF}`); expect(chip).toBeTruthy();
    await tap(btn);
    expect(lastAlert()).toMatchObject({ title: 'Zastąpić wpisane ciężary?', msg: `Gymtek 2,5–24 kg zastąpi ciężary wpisane dla: ${DBF}.` });
    await act(async () => { pressAlert('Zastąpić wpisane ciężary?', 'Zastąp'); }); await flushAll(5);
    expect((eq()[0].load as any).items).toHaveLength(15);
  });

  test('talerze: zbyt wiele kombinacji → „Za dużo kombinacji talerzy…”; ponad 30 rodzajów (tylko stan w pamięci) → „Za dużo rodzajów talerzy…”', async () => {
    const eq = await open(['barbell'], l => { (l.equipment[0].load as any).plates = Array.from({ length: 20 }, (_, i) => ({ w: Math.round(1000 * Math.sqrt(i + 2)) / 1000, n: 20 })); });
    expect(screen.getByText('Za dużo kombinacji talerzy — ciężary nie są liczone. Usuń nietypowe talerze.')).toBeTruthy();
    /* edytor nie pozwala dodać 31. rodzaju („+ talerz” znika przy 30), a import przycina do 30 (sanitizeLoadSpec) — stan wstrzyknięty w pamięci */
    await act(async () => { const sp = eq()[0].load as any; sp.plates = Array.from({ length: 31 }, (_, i) => ({ w: i + 1, n: 2 })); store.save(); }); await flushAll(5);
    expect(screen.getByText(`Za dużo rodzajów talerzy (najwyżej ${LOAD_LIMITS.plateRows}).`)).toBeTruthy(); expect(screen.getByText('Za dużo rodzajów talerzy (najwyżej 30).')).toBeTruthy();
    expect(screen.queryByLabelText(`+ talerz — ${BAR}`)).toBeNull();
  });
});

/* ======================================================================= /exercise/[id] */
describe('/exercise/[id]', () => {
  test('nieistniejące ćwiczenie → „Nie ma takiego ćwiczenia.”', async () => {
    await renderApp(); await go('/exercise/brak'); await flushAll(10);
    expect(screen.getByText('Nie ma takiego ćwiczenia.')).toBeTruthy();
  });

  test('pola: „Co logujesz w serii”, „jak robocza”, partie główne i pomocnicze; opis masy ciała', async () => {
    await renderApp(); const id = ex('Bench Press (sztanga)').id; await go(`/exercise/${id}`); await flushAll(10);
    const e = () => store.getState().exercises.find(x => x.id === id)!;
    expect(screen.getByText('Co logujesz w serii')).toBeTruthy();
    await tap(byHint('ciężar + czas', 'Co logujesz w serii')); expect(e().metric).toBe('weight_time');
    await tap(byHint('ciężar + powtórzenia', 'Co logujesz w serii')); expect(e().metric).toBe('weight_reps');
    await type(screen.getByPlaceholderText('jak robocza'), '45'); expect(e().restWarmupSec).toBe(45);
    expect(screen.getByText('Partie główne (1 seria)')).toBeTruthy(); expect(screen.getByText('Partie pomocnicze (0,5 serii)')).toBeTruthy();
    await tap(byHint('plecy', 'Partie główne (1 seria)')); expect(e().muscles).toContain('plecy');
    await tap(byHint('plecy', 'Partie pomocnicze (0,5 serii)')); expect(e().secondaryMuscles).toContain('plecy'); expect(e().muscles).not.toContain('plecy');
    expect(screen.getByText('Masa ciała: „±” to dociążenie (plus) albo asysta, np. maszyny (minus); guma to osobne pole z poziomem. Masa ciała nie wchodzi do obliczeń: rekord to suma powtórzeń bez asysty, a e1RM i objętość liczą się tylko z dociążenia. Ćwiczenia na czas mają w treningu stoper — po upływie celu seria odhacza się sama. Przerwa ustawiona w pozycji szablonu ma pierwszeństwo; puste pole przerwy w szablonie oznacza przerwę z tego ćwiczenia.')).toBeTruthy();
  });

  test('obciążenie partii z katalogu: legenda i „stabilizacja” w opisie VoiceOver', async () => {
    await renderApp(); const e = ex('Decline Bench Press'); expect(muscleLoadOf(e).some(([, w]) => w !== 1 && w !== 0.5)).toBe(true);
    await go(`/exercise/${e.id}`); await flushAll(10);
    expect(screen.getByText('●●● główna · ●● pomocnicza · ● stabilizacja')).toBeTruthy();
    expect(screen.getByLabelText(/: stabilizacja/)).toBeTruthy();
  });

  test('guma jako opór (bez asysty): dopisek', async () => {
    await renderApp(); await go(`/exercise/${ex('Band Pull Apart').id}`); await flushAll(10);
    expect(screen.getByText('Guma jako opór: przy serii wybierasz gumę (poziom 1–7), rekordy liczą serie z gumą.')).toBeTruthy();
  });

  test('ćwiczenie z historią i w trwającym treningu: ostrzeżenie o przeliczeniu i dopisek w oknie usuwania; „Usuń” oznacza je w treningu', async () => {
    const saved = await prepared(() => { addWorkout(Date.now() - DAY, [['Back Squat', [{ weight: 100, reps: 5 }]]]); store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); });
    await renderApp({ saved }); const id = ex('Back Squat').id; await go(`/exercise/${id}`); await flushAll(10);
    expect(screen.getByText('Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi (objętość, rekordy, wykresy).')).toBeTruthy();
    await tap(screen.getByText('Usuń ćwiczenie'));
    expect(lastAlert()).toMatchObject({ title: 'Usunąć ćwiczenie?', msg: 'Zniknie z list i szablonów; historia, wykresy i eksport zostaną. W trwającym treningu zostanie oznaczone jako usunięte.' });
    await act(async () => { pressAlert('Usunąć ćwiczenie?', 'Usuń'); }); await flushAll(10);
    expect(store.getState().exercises.find(x => x.id === id)!.archived).toBe(true);
  });

  test('język inny niż polski: „Wyświetlane jako: …” (przetłumaczona nazwa z biblioteki)', async () => {
    await renderApp({ locale: 'en' }); const e = ex('Bench Press (sztanga)'); expect(exName(e)).not.toBe(e.name);
    await go(`/exercise/${e.id}`); await flushAll(10);
    expect(screen.getByText(tr('Wyświetlane jako: {n}', { n: exName(e) }))).toBeTruthy();
    expect(screen.getByText(`Shown as: ${exName(e)}`)).toBeTruthy();
  });
});

/* ======================================================================= / (zakładka Trening: ekran główny) */
describe('/ (ekran główny)', () => {
  test('wskazówka pierwszego startu: bez szablonów i z szablonami', async () => {
    await renderApp(); await flushAll(10);
    expect(screen.getByText('Pierwszy raz? Utwórz swój szablon („+ Nowy szablon” niżej) albo zacznij pusty trening. Wpisuj ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”.')).toBeTruthy();
    await renderApp({ saved: await prepared(() => { withDemoTemplates(); }) }); await flushAll(10);
    expect(screen.getByText('Pierwszy raz? Wybierz szablon niżej, wpisz ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”. Szablony i ćwiczenia zmienisz w zakładkach obok.')).toBeTruthy();
  });

  test('błąd zapisu: baner „Tapnij, by spróbować ponownie…”; tapnięcie zapisuje ponownie i baner znika', async () => {
    await renderApp(); await flushAll(10);
    global.__dbFail = true; await act(async () => { store.getState().settings.defaultRest = 77; store.save(); }); await flushAll(1000);
    expect(screen.getByText('Tapnij, by spróbować ponownie. Zrób też backup.')).toBeTruthy();
    global.__dbFail = false; await tap(screen.getByText('Nie udało się zapisać danych')); await flushAll(1000);
    expect(screen.queryByText('Tapnij, by spróbować ponownie. Zrób też backup.')).toBeNull(); expect(JSON.parse(global.__kv.get('state')!).settings.defaultRest).toBe(77);
  });

  test('nieczytelne dane: baner, ostrzeżenie przed ukryciem, „Wyślij kopię” (udostępnianie) i nieudane wysłanie → „Spróbuj ponownie.”', async () => {
    await renderApp({ saved: '{zle' }); await flushAll(10);
    expect(screen.getByText('Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup.')).toBeTruthy();
    await tap(screen.getByText('Poprzednich danych nie dało się odczytać'));
    expect(lastAlert()).toMatchObject({ title: 'Poprzednich danych nie dało się odczytać', msg: 'Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna.' });
    Sharing.shareAsync.mockClear();
    await act(async () => { pressAlert('Poprzednich danych nie dało się odczytać', 'Wyślij kopię'); }); await flushAll(20);
    expect(Sharing.shareAsync.mock.calls.pop()[1]).toMatchObject({ dialogTitle: 'Kopia nieczytelnych danych' });
    FS.writeAsStringAsync.mockRejectedValueOnce(new Error('brak miejsca'));
    await tap(screen.getByText('Poprzednich danych nie dało się odczytać')); await act(async () => { pressAlert('Poprzednich danych nie dało się odczytać', 'Wyślij kopię'); }); await flushAll(20);
    expect(lastAlert()).toMatchObject({ title: 'Nie udało się', msg: 'Spróbuj ponownie.' });
  });
});

/* ======================================================================= podpis aplikacji (/ i /more) */
describe('podpis aplikacji: baner na / , dopisek w /more, przypomnienie', () => {
  const profileB64 = (created: number, expires: number) => Buffer.from(`0garbage<?xml version="1.0"?><plist version="1.0"><dict><key>CreationDate</key><date>${new Date(created).toISOString().replace(/\.\d+Z$/, 'Z')}</date><key>Entitlements</key><dict><key>get-task-allow</key><true/></dict><key>ExpirationDate</key><date>${new Date(expires).toISOString().replace(/\.\d+Z$/, 'Z')}</date></dict></plist>`, 'latin1').toString('base64');
  const useProfile = (b64: string | null) => { signing.__resetSigningCache(); (global as any).__bundleDir = b64 ? '/var/Trening.app/' : null;
    FS.getInfoAsync.mockImplementation(async (uri: string) => ({ exists: !!b64 && uri.endsWith('embedded.mobileprovision') }));
    FS.readAsStringAsync.mockImplementation(async (uri: string) => (b64 && uri.endsWith('embedded.mobileprovision') ? b64 : '')); };
  afterEach(() => { useProfile(null); FS.getInfoAsync.mockImplementation(async () => ({ exists: false })); FS.readAsStringAsync.mockImplementation(async () => ''); });

  test('za 2 dni: „Podpis aplikacji wygasa za 2 dni.”, przypomnienie „Jutro wygasa…”, w Więcej „Podpis ważny do …”; tapnięcie → Backup', async () => {
    const exp = Date.now() + 2 * DAY; useProfile(profileB64(Date.now() - 4 * DAY, exp));
    await renderApp(); await flushAll(50);
    expect(signing.calendarDaysLeft(new Date(exp), new Date())).toBe(2);
    expect(screen.getByText('Podpis aplikacji wygasa za 2 dni.')).toBeTruthy();
    expect((global.__notifications as any[]).some(n => n.content.title === 'Jutro wygasa podpis aplikacji')).toBe(true);
    await tap(screen.getByText('Podpis aplikacji wygasa za 2 dni.')); await flushAll(20);
    expect(screen.getByText(/^Eksport tworzy plik JSON/)).toBeTruthy();
    await go('/more'); await flushAll(50);
    expect(screen.getByText(/Podpis ważny do .+\.$/)).toBeTruthy();
  });

  test('dziś: „Podpis aplikacji wygasa dziś.”; po wygaśnięciu (darmowe Apple ID): „Podpis aplikacji wygasł — odnów w Sideloadly.”', async () => {
    const end = new Date(); end.setHours(23, 59, 0, 0);
    if (end.getTime() - Date.now() > 60e3) { useProfile(profileB64(Date.now() - 6 * DAY, end.getTime())); await renderApp(); await flushAll(50);
      expect(screen.getByText('Podpis aplikacji wygasa dziś.')).toBeTruthy(); }
    useProfile(profileB64(Date.now() - 8 * DAY, Date.now() - DAY)); await renderApp(); await flushAll(50);
    expect(screen.getByText('Podpis aplikacji wygasł — odnów w Sideloadly.')).toBeTruthy();
  });
});

/* ======================================================================= app/_layout */
describe('app/_layout', () => {
  test('trening bez aktywności od 6 h zapisuje się sam przy starcie — komunikat „Zapisałem trening”', async () => {
    const now = Date.now(); let start = 0, last = 0;
    const saved = await prepared(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; start = a.startedAt = now - 8 * H; last = now - 7 * H;
      Object.assign(a.exercises[0].sets[0], { weight: 100, reps: 5, done: true, completedAt: last }); });
    await renderApp({ saved }); await flushAll(600);
    expect(store.getState().active).toBeNull();
    expect(alertOf('Zapisałem trening')!.msg).toBe(`Trening z ${store.fmtDate(start)} ${store.fmtTime(start)} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: ${store.fmtTime(last)} (ostatnia seria). Znajdziesz go w Historii.`);
  });

  test('tytuł okna wyboru ćwiczenia: „Wybierz ćwiczenie”', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); }); await go('/picker?target=active'); await flushAll(10);
    /* nagłówek natywnego stosu nie renderuje się w Jest — tytuł z opcji bieżącego ekranu nawigatora */
    const { store: rs } = require('expo-router/build/global-state/router-store');
    expect(rs.navigationRef.getCurrentRoute()?.name).toBe('picker'); expect(rs.navigationRef.getCurrentOptions()?.title).toBe('Wybierz ćwiczenie');
  });
});

/* ======================================================================= components/ActiveWorkout (trening w toku na /) */
describe('ActiveWorkout (/ z treningiem w toku)', () => {
  const blk = (i: number) => store.getState().active!.exercises[i];
  async function startWith(names: string[], fn: () => void = () => {}) {
    const saved = await prepared(() => { store.startEmpty(); names.forEach(n => store.addExerciseToActive(ex(n))); fn(); });
    await renderApp({ saved }); await flushAll(20);
  }
  const finishBtn = () => screen.getByText('Zakończ trening i zapisz');

  test('opis pod treningiem; brak odhaczonych serii (z wpisaną, nieodhaczoną) → „Nic do zapisania…”, „Odrzuć trening”', async () => {
    await startWith(['Back Squat']);
    expect(screen.getByText('Trening w toku zapisuje się na bieżąco. Tapnij numer serii, by oznaczyć rozgrzewkę (W), drop set (D), serię do upadku (F) albo dodać notatkę.')).toBeTruthy();
    await type(screen.getAllByLabelText('Powtórzenia')[0], '5'); expect(blk(0).sets[0].edited).toBe(true);
    await tap(finishBtn());
    expect(lastAlert()).toMatchObject({ title: 'Brak odhaczonych serii', msg: 'Nic do zapisania. Odrzucić ten trening?\nNieodhaczone serie z wpisanymi wynikami: 1 — nie zostaną zapisane. Seria zapisuje się po odhaczeniu ✓.' });
    await act(async () => { pressAlert('Brak odhaczonych serii', 'Odrzuć trening'); }); await flushAll(10);
    expect(store.getState().active).toBeNull();
  });

  test('tylko rozgrzewka → „Odhaczone są tylko serie rozgrzewkowe (1)…”; „Zapisz” zapisuje', async () => {
    await startWith(['Back Squat'], () => { const s = store.getState().active!.exercises[0].sets[0]; Object.assign(s, { kind: 'warmup', warmup: true, weight: 40, reps: 5, done: true, completedAt: Date.now() }); });
    await tap(finishBtn());
    expect(lastAlert()).toMatchObject({ title: 'Tylko rozgrzewka', msg: 'Odhaczone są tylko serie rozgrzewkowe (1). Zapisać taki trening?' });
    const n = store.getState().workouts.length; await act(async () => { pressAlert('Tylko rozgrzewka', 'Zapisz'); }); await flushAll(500);
    expect(store.getState().workouts.length).toBe(n + 1);
  });

  test('ostrzeżenia przy „Zakończ”: serie bez powtórzeń i bez czasu lub dystansu', async () => {
    await startWith(['Push Up', 'Bieg'], () => { const a = store.getState().active!; Object.assign(a.exercises[0].sets[0], { done: true, completedAt: Date.now() }); Object.assign(a.exercises[1].sets[0], { durationSec: 600, done: true, completedAt: Date.now() }); });
    await tap(finishBtn());
    const a = alertOf('Zakończyć trening?')!; expect(a.msg).toContain('Odhaczone serie bez powtórzeń: 1.'); expect(a.msg).toContain('Odhaczone serie bez czasu lub dystansu: 1.');
    await act(async () => { pressAlert('Zakończyć trening?', 'Wróć'); }); expect(store.getState().active).not.toBeNull();
  });

  test('„Anuluj trening” → „Serie z tej sesji przepadną.”; usunięcie odhaczonej serii (− seria i menu serii) pyta „Seria jest już odhaczona.”', async () => {
    await startWith(['Back Squat'], () => { const e = store.getState().active!.exercises[0]; e.sets = [store.emptySet(), store.emptySet(), store.emptySet()]; e.sets.forEach(s => Object.assign(s, { weight: 100, reps: 5, done: true, completedAt: Date.now() })); });
    await tap(screen.getByText('− seria'));
    expect(lastAlert()).toMatchObject({ title: 'Usunąć ostatnią serię?', msg: 'Seria jest już odhaczona.' });
    await act(async () => { pressAlert('Usunąć ostatnią serię?', 'Usuń'); }); await flushAll(5); expect(blk(0).sets).toHaveLength(2);
    await tap(screen.getAllByLabelText(/^Seria 1, typ:/)[0]); await act(async () => { (global as any).__pickSheet(5); });
    expect(lastAlert()).toMatchObject({ title: 'Usunąć serię?', msg: 'Seria jest już odhaczona.' });
    await act(async () => { pressAlert('Usunąć serię?', 'Usuń'); }); await flushAll(5); expect(blk(0).sets).toHaveLength(1);
    await tap(screen.getByText('Anuluj trening'));
    expect(lastAlert()).toMatchObject({ title: 'Anulować trening?', msg: 'Serie z tej sesji przepadną.' });
    await act(async () => { pressAlert('Anulować trening?', 'Anuluj trening'); }); await flushAll(5); expect(store.getState().active).toBeNull();
  });

  test('blok usuniętego ćwiczenia: „Usuń usunięte ćwiczenie z treningu” usuwa blok', async () => {
    await startWith(['Back Squat', 'Push Up'], () => { store.getState().active!.exercises[0].exerciseId = 'usuniete'; });
    await tap(screen.getByLabelText('Usuń usunięte ćwiczenie z treningu')); await flushAll(5);
    expect(store.getState().active!.exercises.map(e => e.exerciseId)).toEqual([ex('Push Up').id]);
  });

  test('stoper serii: bez celu „seria · bez celu” i „Stoper trwa”; z celem powiadomienie „Seria skończona / Minęło 30 s.”; ponowny pomiar pyta', async () => {
    await startWith(['Plank'], () => { const e = store.getState().active!.exercises[0]; e.sets = [store.emptySet(), store.emptySet()]; });
    await tap(screen.getAllByLabelText('Start stopera serii')[0]); await flushAll(10);
    expect(screen.getByText('seria · bez celu')).toBeTruthy(); expect(screen.getByLabelText('Stoper trwa')).toBeTruthy(); expect(timer.S.on).toBe(true);
    await flushAll(5000); await tap(screen.getByText('Zakończ serię')); await flushAll(10);
    expect(blk(0).sets[0].done).toBe(true); expect(Number(blk(0).sets[0].durationSec)).toBeGreaterThanOrEqual(5);
    await tap(screen.getAllByLabelText('Start stopera serii')[0]);
    expect(lastAlert()).toMatchObject({ title: 'Zmierzyć serię od nowa?', msg: 'Zapisany czas zostanie nadpisany.' });
    await act(async () => { pressAlert('Zmierzyć serię od nowa?', 'Nie'); });
    await type(screen.getAllByLabelText('czas')[1], '30'); global.__notifications.length = 0;
    await tap(screen.getAllByLabelText('Start stopera serii')[1]); await flushAll(10);
    expect(screen.getByText(/^seria · cel /)).toBeTruthy(); expect(timer.S.targetSec).toBe(30);
    expect((global.__notifications as any[]).find(n => n.content.title === 'Seria skończona').content.body).toBe('Minęło 30 s.');
  });

  test('✓ serii: przerwa z powiadomieniem „Następna seria.”; podpis przerwy przy ostatniej serii ćwiczenia: „dalej: <następne>”', async () => {
    await startWith(['Back Squat', 'Push Up'], () => { const s = store.getState().active!.exercises[0].sets[0]; Object.assign(s, { weight: 100, reps: 5 }); });
    global.__notifications.length = 0;
    await tap(screen.getAllByLabelText(/^Seria 1 zrobiona — Back Squat/)[0]); await flushAll(10);
    expect(timer.T.on).toBe(true); expect((global.__notifications as any[]).find(n => n.content.title === 'Przerwa minęła').content.body).toBe('Następna seria.');
    expect(timer.labels.subtitle).toBe('dalej: Push Up');
  });

  test('chip miejsca: menu „Miejsce tego treningu” zmienia miejsce sesji', async () => {
    await startWith(['Back Squat'], () => { addLocation('gym', 'Siłownia'); addLocation('home', 'Dom'); store.getState().active!.locationId = store.getState().settings.locations[0].id; });
    await tap(screen.getByLabelText('Miejsce treningu: Siłownia. Tapnij, by zmienić.'));
    const sh = (global as any).__sheets[(global as any).__sheets.length - 1]; expect(sh.opts.title).toBe('Miejsce tego treningu'); expect(sh.opts.options).toEqual(['Siłownia', 'Dom', 'Anuluj']);
    await act(async () => { (global as any).__pickSheet(1); }); await flushAll(5);
    expect(store.getState().active!.locationId).toBe(store.getState().settings.locations[1].id);
  });

  test('zamiana z szablonu w miejscu: „Zawsze w: …” (podpowiedź „Zapisuje zamiennik…”) zapisuje zamiennik; cofnięcie po wpisie pyta „Wpisane wartości zamiennika przepadną.”', async () => {
    const saved = await prepared(() => { addLocation('gym', 'Siłownia'); withDemoTemplates(); });
    await renderApp({ saved }); await tap(screen.getByLabelText('Start: Upper A')); await flushAll(10);
    const b0 = blk(0); const tpl = store.getState().templates[0]; const to = ex('Machine Chest Press');
    await act(async () => { store.swapBlock(b0.id, to.id); }); await flushAll(10);
    const btn = screen.getByLabelText(`Zawsze w: Siłownia — ${exName(to)}`); expect(btn.props.accessibilityHint).toBe('Zapisuje zamiennik w szablonie dla tego miejsca.');
    await tap(btn); expect(tpl.items[0].alternates?.[0]).toMatchObject({ exerciseId: to.id, locationId: store.getState().settings.locations[0].id });
    await type(screen.getAllByLabelText('Powtórzenia')[0], '9');
    await tap(screen.getByLabelText(`Cofnij zamianę: ${exName(to)}`));
    expect(lastAlert()).toMatchObject({ title: 'Cofnąć zamianę?', msg: 'Wpisane wartości zamiennika przepadną.' });
    await act(async () => { pressAlert('Cofnąć zamianę?', 'Cofnij'); }); await flushAll(5);
    expect(blk(0).exerciseId).toBe(tpl.items[0].exerciseId);
  });
});

/* ======================================================================= lib/timer — porzucony trening (pytanie w aplikacji i przypomnienie) */
describe('porzucony trening (ActiveWorkout + lib/timer)', () => {
  const stale = async (kind: 'work' | 'warmup' | 'none', agoH: number) => {
    const now = Date.now(); let at = 0;
    const saved = await prepared(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); const a = store.getState().active!; a.startedAt = now - (agoH + 0.5) * H; at = a.startedAt;
      if (kind !== 'none') { at = now - agoH * H; Object.assign(a.exercises[0].sets[0], { weight: 60, reps: 5, done: true, completedAt: at }, kind === 'warmup' ? { kind: 'warmup', warmup: true } : {}); } });
    await renderApp({ saved }); await flushAll(50); return at;
  };
  const ask = () => alertOf('Trening wciąż trwa');
  const reminder = () => (global.__notifications as any[]).filter(n => n.identifier === 'stale-reminder').pop();

  test('seria robocza 2,5 h temu: pytanie „Zakończyć trening z tą godziną końca?”; „Odrzuć” → potwierdzenie „Serie z tej sesji przepadną.”', async () => {
    const at = await stale('work', 2.5);
    expect(ask()!.msg).toBe(`Ostatnia seria o ${store.fmtTime(at)}. Zakończyć trening z tą godziną końca?`);
    await act(async () => { pressAlert('Trening wciąż trwa', 'Odrzuć'); });
    expect(lastAlert()).toMatchObject({ title: 'Odrzucić trening?', msg: 'Serie z tej sesji przepadną.' });
    await act(async () => { pressAlert('Odrzucić trening?', 'Odrzuć trening'); }); await flushAll(10); expect(store.getState().active).toBeNull();
  });
  test('rozgrzewka / brak serii 2,5 h temu: pytania „Kontynuować czy odrzucić?”', async () => {
    let at = await stale('warmup', 2.5);
    expect(ask()!.msg).toBe(`Ostatnia rozgrzewka o ${store.fmtTime(at)}, bez serii roboczych. Kontynuować czy odrzucić?`);
    await act(async () => { pressAlert('Trening wciąż trwa', 'Kontynuuj'); }); expect(store.getState().active).not.toBeNull();
    at = await stale('none', 2.5);
    expect(ask()!.msg).toBe(`Trening rozpoczęty o ${store.fmtTime(at)}, bez odhaczonych serii. Kontynuować czy odrzucić?`);
  });
  test('przypomnienie w powiadomieniu (aktywność 30 min temu): treść dla serii, rozgrzewki i braku serii', async () => {
    let at = await stale('work', 0.5);
    expect(reminder().content).toMatchObject({ title: 'Trening wciąż trwa', body: `Ostatnia seria o ${store.fmtTime(at)}. Otwórz, by zakończyć albo kontynuować.` });
    at = await stale('warmup', 0.5);
    expect(reminder().content.body).toBe(`Ostatnia rozgrzewka o ${store.fmtTime(at)}, bez serii roboczych. Otwórz, by kontynuować albo odrzucić.`);
    at = await stale('none', 0.5);
    expect(reminder().content.body).toBe(`Trening rozpoczęty o ${store.fmtTime(at)}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić.`);
  });
});

/* ======================================================================= /more/progress i components/Chart */
describe('/more/progress (+ Chart)', () => {
  const at = (d: number) => Date.now() - d * DAY;
  test('bez ćwiczenia: opisy wykresów tygodniowych, „Brak serii w tym i poprzednim tygodniu.”, „Pokazano 40 z … — wpisz nazwę”', async () => {
    const saved = await prepared(() => { addWorkout(at(40), [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    await renderApp({ saved }); await go('/more/progress'); await flushAll(10);
    expect(screen.getByText('Tygodnie od poniedziałku. Objętość = ciężar × powtórzenia × mnożnik ćwiczenia; rozgrzewka poza.')).toBeTruthy();
    expect(screen.getByText('Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie: klatka 1, triceps i barki po 0,5). Partie ustawisz w edycji ćwiczenia.')).toBeTruthy();
    expect(screen.getByText('Objętość serii roboczych (ciężar × powtórzenia × mnożnik ćwiczenia); partia główna liczy całość, pomocnicza połowę. Ćwiczenia bez ciężaru (masa ciała, gumy) się nie liczą.')).toBeTruthy();
    expect(screen.getAllByText('Brak serii w tym i poprzednim tygodniu.')).toHaveLength(2);
    const n = store.getState().exercises.filter(e => !e.archived).length;
    expect(screen.getByText(`Pokazano 40 z ${n} — wpisz nazwę, by zawęzić.`)).toBeTruthy();
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Back Squat'); await flushAll(5);
    expect(screen.queryByText(/^Pokazano 40 z/)).toBeNull();
  });

  test('ćwiczenie z ciężarem (2 sesje): opis wykresu dla VoiceOver, „obj.” w sesjach; chip „Tapnij, by wybrać inne ćwiczenie.” wraca do listy', async () => {
    const saved = await prepared(() => { addWorkout(at(10), [['Back Squat', [{ weight: 100, reps: 5 }]]]); addWorkout(at(3), [['Back Squat', [{ weight: 110, reps: 5 }]]]); });
    await renderApp({ saved }); await go(`/more/progress?ex=${ex('Back Squat').id}`); await flushAll(10);
    expect(screen.getByLabelText(/^Wykres, 2 sesje: od .+ do .+, najlepiej .+\.$/)).toBeTruthy();
    expect(tr('Wykres, {n} {s}: od {a} ({x}) do {b} ({y}), najlepiej {c} ({z}).', { n: 2, s: 'sesje', a: 'A', x: 'X', b: 'B', y: 'Y', c: 'C', z: 'Z' })).toBe('Wykres, 2 sesje: od A (X) do B (Y), najlepiej C (Z).');
    expect(screen.getAllByText(/ · obj\. /).length).toBe(2);
    const chip = screen.getByLabelText('Back Squat'); expect(chip.props.accessibilityHint).toBe('Tapnij, by wybrać inne ćwiczenie.');
    await tap(chip); await flushAll(5); expect(screen.getByPlaceholderText('Szukaj ćwiczenia…')).toBeTruthy();
  });

  test('masa ciała z dociążeniem i gumą: e1RM (dociążenie), Max dociążenie, Max powtórzeń bez asysty / z asystą, Najwięcej powtórzeń na treningu', async () => {
    const saved = await prepared(() => { const b = store.getState().bands[0]; addWorkout(at(3), [['Pull Up', [{ addKg: 10, reps: 5 }, { reps: 8 }, { reps: 12, bandId: b.id }]]]); });
    await renderApp({ saved }); await go(`/more/progress?ex=${ex('Pull Up').id}`); await flushAll(10);
    for (const l of ['e1RM (dociążenie)', 'Max dociążenie', 'Max powtórzeń bez asysty', 'Max powtórzeń z asystą', 'Najwięcej powtórzeń na treningu']) expect(screen.getAllByText(l).length).toBeGreaterThan(0); /* e1RM także jako chip wykresu */
    expect(screen.getByText('Max dociążenie').parent).toBeTruthy();
  });

  test('jednostronne: „e1RM (Epley, na stronę)”; na czas (1 sesja): „max czas”, „Najdłużej łącznie na treningu”, „Jedna sesja: … Wykres pojawi się po drugiej.”', async () => {
    const saved = await prepared(() => { addWorkout(at(3), [['Meadows Row', [{ weight: 30, reps: 10 }]], ['Plank', [{ durationSec: 60 }]], ['Push Up', [{ reps: 20 }]], ['Bieg', [{ distanceM: 5000, durationSec: 1500 }]]]); });
    await renderApp({ saved }); await go(`/more/progress?ex=${ex('Meadows Row').id}`); await flushAll(10);
    expect(screen.getByText('e1RM (Epley, na stronę)')).toBeTruthy();
    await go(`/more/progress?ex=${ex('Plank').id}`); await flushAll(10);
    expect(screen.getByText('max czas')).toBeTruthy(); expect(screen.getByText('Najdłużej łącznie na treningu')).toBeTruthy();
    expect(screen.getByText(/^Jedna sesja: .+\. Wykres pojawi się po drugiej\.$/)).toBeTruthy();
    expect(tr('Jedna sesja: {v}. Wykres pojawi się po drugiej.', { v: '1:00' })).toBe('Jedna sesja: 1:00. Wykres pojawi się po drugiej.');
    await go(`/more/progress?ex=${ex('Push Up').id}`); await flushAll(10);
    expect(screen.getByText('max pow.')).toBeTruthy(); expect(screen.getByText('Najwięcej powtórzeń na treningu')).toBeTruthy();
    await go(`/more/progress?ex=${ex('Bieg').id}`); await flushAll(10);
    expect(screen.getByText('max dystans')).toBeTruthy(); expect(screen.getByText('Najdłuższy dystans')).toBeTruthy(); expect(screen.getByText('Najdłuższy dystans na treningu')).toBeTruthy();
    await tap(screen.getByText('max dystans')); expect(screen.getByText('max dystans').parent).toBeTruthy();
  });

  test('etykieta pola ciężaru ćwiczenia jednostronnego w treningu: „kg/strona”', async () => {
    const saved = await prepared(() => { store.startEmpty(); store.addExerciseToActive(ex('Meadows Row')); });
    await renderApp({ saved }); await flushAll(10);
    expect(screen.getAllByLabelText('kg/strona').length).toBeGreaterThan(0);
    expect(tr('{u}/strona', { u: 'kg' })).toBe('kg/strona');
    await type(screen.getAllByLabelText('kg/strona')[0], '22'); expect(store.getState().active!.exercises[0].sets[0].weight).toBe(22);
  });
});

/* ======================================================================= /swap */
describe('/swap', () => {
  async function startIn(locPreset: 'gym' | 'home', names: string[]) {
    const saved = await prepared(() => { const l = addLocation(locPreset, locPreset === 'gym' ? 'Siłownia' : 'Dom'); store.startEmpty(); store.getState().active!.locationId = l.id; names.forEach(n => store.addExerciseToActive(ex(n))); });
    await renderApp({ saved }); await flushAll(20);
  }
  const blk = (i: number) => store.getState().active!.exercises[i];

  test('nieznany cel → „Tego ćwiczenia nie da się już zamienić.”', async () => {
    await renderApp(); await act(async () => { store.startEmpty(); }); await go('/swap?target=active:brak'); await flushAll(10);
    expect(screen.getByText('Tego ćwiczenia nie da się już zamienić.')).toBeTruthy();
  });

  test('brak propozycji w miejscu → „Brak podobnych ćwiczeń…”; „Inne ▾/▴” z opisem; „Pokaż więcej (n)” dokłada ćwiczenia', async () => {
    await startIn('home', ['Bent Over Row (sztanga)']);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Bent Over Row (sztanga)')); await flushAll(20);
    expect(screen.getByText('Brak podobnych ćwiczeń w tym miejscu — rozwiń „Inne”.')).toBeTruthy();
    expect(screen.getByText('lista ćwiczeń z filtrami, które możesz zdjąć')).toBeTruthy(); expect(screen.getByText('Inne ▾')).toBeTruthy();
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); await flushAll(5);
    expect(screen.getByText('Inne ▴')).toBeTruthy(); expect(screen.getByLabelText('Zwiń inne ćwiczenia')).toBeTruthy();
    await tap(screen.getByLabelText(/^Filtr partii: /)); await tap(screen.getByLabelText(/^Filtr miejsca: /)); await flushAll(5);
    const more = screen.getByText(/^Pokaż więcej \(\d+\)$/); const n = Number(/\((\d+)\)/.exec(more.props.children)![1]);
    expect(screen.getByLabelText(`Pokaż więcej ćwiczeń: zostało ${n}`)).toBeTruthy(); expect(more.props.children).toBe(`Pokaż więcej (${n})`);
    const before = screen.getAllByText('⇄').length; await tap(screen.getByLabelText(`Pokaż więcej ćwiczeń: zostało ${n}`)); await flushAll(5);
    expect(screen.getAllByText('⇄').length).toBeGreaterThan(before);
  });

  test('propozycje z powodem „te same mięśnie”; „Ten sam ruch, inny przyrząd”: „— gryf łamany” zmienia przyrząd bloku', async () => {
    await startIn('gym', ['Chest Dip', 'Upright Row (sztanga)']);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Chest Dip')); await flushAll(20);
    expect(screen.getAllByText(/^te same mięśnie · /).length).toBeGreaterThan(0);
    await tap(screen.getByText('Anuluj')); await flushAll(10);
    await tap(screen.getByLabelText('Zamień ćwiczenie: Upright Row (sztanga)')); await flushAll(20);
    expect(screen.getByText('Upright Row (sztanga) — gryf łamany')).toBeTruthy();
    await tap(screen.getByLabelText('Inny przyrząd: gryf łamany')); await flushAll(10);
    expect(blk(1).impl).toBe('ez_bar');
  });
});

/* ======================================================================= /template/[id] i /reorder */
describe('/template/[id], /reorder', () => {
  test('opis edytora; zakres powtórzeń z podpowiedzią „↑ więcej kg”; zamienniki pozycji; „Trening w toku” → „Najpierw zakończ albo anuluj…”', async () => {
    let tplB = '';
    const saved = await prepared(() => { const g = addLocation('gym', 'Siłownia'); const [a, b] = withDemoTemplates(); tplB = b.id;
      b.items[0].repMin = 8; b.items[0].repMax = 12; b.items[0].alternates = [{ locationId: g.id, exerciseId: ex('Machine Chest Press').id, restSec: null }];
      store.startFromTemplate(a); });
    await renderApp({ saved }); await go(`/template/${tplB}`); await flushAll(20);
    expect(screen.getByText('Dotknij etykiety serii, by zmienić typ albo usunąć serię. Zakres powtórzeń jest opcjonalny — z nim pojawiają się podpowiedzi „↑”. „⇅ SS” łączy ćwiczenie z następnym w superset, „✂ SS” wyjmuje z grupy. Kolejność: „≡ Kolejność”.')).toBeTruthy();
    await openCard(0); await flushAll(5);
    expect(screen.getByText('Zakres powtórzeń: 8–12 — po osiągnięciu górnej granicy podpowiedź „↑ więcej kg”.')).toBeTruthy();
    expect(screen.getByText('Zamienniki')).toBeTruthy(); expect(screen.getByText(`📍 Siłownia: ${exName(ex('Machine Chest Press'))}`)).toBeTruthy();
    await tap(screen.getByText('Trening w toku'));
    expect(lastAlert()).toMatchObject({ title: 'Trening w toku', msg: 'Najpierw zakończ albo anuluj bieżący trening.' });
    expect(store.getState().active!.templateId).not.toBe(tplB);
  });

  test('/reorder: opis przeciągania; „Gotowe” wraca', async () => {
    const saved = await prepared(() => { store.startEmpty(); store.addExerciseToActive(ex('Back Squat')); store.addExerciseToActive(ex('Push Up')); });
    await renderApp({ saved }); await tap(screen.getByLabelText('Zmień kolejność ćwiczeń')); await flushAll(10);
    expect(screen.getByText('Przeciągnij za ≡, żeby zmienić kolejność. Superset przesuwa się w całości; kolejność w nim zmienisz uchwytami przy ćwiczeniach.')).toBeTruthy();
    await tap(screen.getByText('Gotowe')); await flushAll(10); expect(screen.getByText('Zakończ trening i zapisz')).toBeTruthy();
  });
});

/* ======================================================================= /history/add, /history/edit/[id], lib/edit */
describe('/history/add, /history/edit/[id] (lib/edit)', () => {
  const when = async (date: string, time: string, min: string) => {
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), date); await type(screen.getByLabelText('Godzina startu'), time); await type(screen.getByLabelText('Czas trwania (min)'), min);
    await flushAll(800); /* „Pusty trening” blokuje drugie tapnięcie przez 700 ms (useOnce) */ await tap(screen.getByText('Pusty trening')); await flushAll(10);
  };
  test('trening wstecz: opis; błędy daty, godziny, czasu trwania, przyszłości i nachodzenia na trening w toku', async () => {
    const saved = await prepared(() => { store.startEmpty(); store.getState().active!.startedAt = Date.now() - 2 * H; });
    await renderApp({ saved }); await go('/history/add'); await flushAll(10);
    expect(screen.getByText('Trening, którego nie zapisałeś na bieżąco. Ustaw termin i wybierz szablon — serie uzupełnisz w następnym kroku (wartości z ostatniego treningu przed tą datą).')).toBeTruthy();
    const now = Date.now(); const err = () => lastAlert();
    await when('2026-13-45', '18:00', '60'); expect(err()).toMatchObject({ title: 'Sprawdź datę i godzinę', msg: `Nieprawidłowa data. Wpisz RRRR-MM-DD, np. ${edit.dateText(now)}.` });
    await when('2025-05-05', '25:00', '60'); expect(err().msg).toBe('Nieprawidłowa godzina. Wpisz GG:MM, np. 18:00.');
    await when('2025-05-05', '18:00', '0'); expect(err().msg).toBe('Czas trwania: od 1 do 1440 minut.');
    const fut = now + 2 * DAY; await when(edit.dateText(fut), '10:00', '60');
    const end = new Date(fut); end.setHours(11, 0, 0, 0);
    expect(err().msg).toBe(`Koniec treningu (${edit.dateText(end.getTime())} ${edit.timeText(end.getTime())}) jest w przyszłości. Zmień datę, godzinę albo czas trwania.`);
    const a = store.getState().active!; const s = a.startedAt + 10 * 60e3;
    await when(edit.dateText(s), edit.timeText(s), '5');
    expect(err().msg).toBe(`Ten termin nachodzi na trening w toku (start ${edit.dateText(a.startedAt)} ${edit.timeText(a.startedAt)}). Wybierz wcześniejszy.`);
    expect(store.getState().workouts).toHaveLength(0);
  });

  test('nowy trening wstecz: notatka (pole „np. samopoczucie, ból, sprzęt”), „Anuluj” → „Ten trening nie zostanie zapisany.”', async () => {
    await renderApp(); await go('/history/add'); await flushAll(10);
    await tap(screen.getByText('Pusty trening')); await flushAll(20);
    expect(screen.getByText('Tapnij numer serii, by zmienić typ (W, D, F) albo dodać notatkę. Serie bez wyniku nie zostaną zapisane.')).toBeTruthy();
    await type(screen.getByPlaceholderText('np. samopoczucie, ból, sprzęt'), 'zmęczony');
    expect(screen.getByDisplayValue('zmęczony')).toBeTruthy();
    await tap(screen.getByLabelText('Anuluj'));
    expect(lastAlert()).toMatchObject({ title: 'Odrzucić zmiany?', msg: 'Ten trening nie zostanie zapisany.' });
    await act(async () => { pressAlert('Odrzucić zmiany?', 'Odrzuć zmiany'); }); await flushAll(10);
    expect(store.getState().workouts).toHaveLength(0);
  });

  test('edycja sesji: nagłówki „Pow.” i „sek.”; nachodzenie na inną sesję → ostrzeżenie; notatka zapisuje się; bez serii → „Nie zostałaby żadna seria…”', async () => {
    let w1: any, w2: any;
    const saved = await prepared(() => { const d0 = new Date(Date.now() - 3 * DAY); d0.setHours(8, 0, 0, 0); const t0 = d0.getTime(); w1 = addWorkout(t0, [['Back Squat', [{ weight: 100, reps: 5 }]], ['Plank', [{ durationSec: 60 }]]], 'Nogi'); w2 = addWorkout(t0 + 3 * H, [['Push Up', [{ reps: 20 }]]], 'Pompki'); });
    await renderApp({ saved }); await go(`/history/edit/${w1.id}`); await flushAll(20);
    expect(screen.getAllByText('Pow.', { includeHiddenElements: true }).length).toBeGreaterThan(0); expect(screen.getAllByText('sek.', { includeHiddenElements: true }).length).toBeGreaterThan(0); /* rząd nagłówków ukryty przed VoiceOver */
    await type(screen.getByPlaceholderText('np. samopoczucie, ból, sprzęt'), 'dobrze'); await type(screen.getByLabelText('Godzina startu'), '11:15'); /* nachodzenie liczy się tylko po zmianie terminu */
    await tap(screen.getByText('Zapisz'));
    expect(lastAlert()).toMatchObject({ title: 'Zapisać zmiany?', msg: `Ten termin nachodzi na sesję „Pompki” (${edit.dateText(w2.startedAt)} ${edit.timeText(w2.startedAt)}).` });
    await act(async () => { pressAlert('Zapisać zmiany?', 'Zapisz'); }); await flushAll(50);
    expect(store.getState().workouts.find(x => x.id === w1.id)!.note).toBe('dobrze');
    await go(`/history/edit/${w2.id}`); await flushAll(20);
    await tap(screen.getByLabelText('Usuń serię 1 — Push Up')); await tap(screen.getByText('Zapisz'));
    expect(lastAlert()).toMatchObject({ title: 'Pusty trening', msg: 'Nie zostałaby żadna seria z wynikiem. Usunąć tę sesję z historii?' });
    await act(async () => { pressAlert('Pusty trening', 'Usuń sesję'); }); await flushAll(50);
    expect(store.getState().workouts.some(x => x.id === w2.id)).toBe(false);
  });

  test('lib/edit.commitDraft: szkic bez serii z wynikiem → „Nie ma żadnej serii z wynikiem.” (ekran sprawdza to wcześniej — checkDraft)', async () => {
    await fresh(); const d = edit.beginPast(null, Date.now() - 2 * DAY, Date.now() - 2 * DAY + H); edit.draftAddExercise(d.key, ex('Back Squat'));
    expect(edit.checkDraft(d.key)).toMatchObject({ empty: true });
    expect(edit.commitDraft(d.key)).toEqual({ error: 'Nie ma żadnej serii z wynikiem.' });
  });
});
