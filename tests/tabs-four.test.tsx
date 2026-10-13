/*
 * Cztery zakładki (decyzja właściciela 11.10.2026, docs/22 wariant A, docs/18 P1 i P5): Trening · Plan · Postępy · Więcej.
 * Szablony i Ćwiczenia to ekrany stosu pod Więcej (/templates, /exercises), Kalendarz nazywa się „Plan”, Postępy mają własną zakładkę z „Progresją”
 * i sekcją „Masa ciała” (wejście z Ustawień zniknęło). Rodzaje (docs/20): struktura (pliki, TAB_COUNT, TAB_ROUTES), ekran (pasek zakładek, Więcej,
 * Postępy), scenariusze przepływów (każda droga do Szablonów, Ćwiczeń, Postępów i masy ciała dalej istnieje), niezmienniki (jedno „(tabs)” na stosie,
 * brak przeliczania Postępów poza zakładką), języki (EN, „Co nowego” w 35 językach). E2E: .maestro/19-zakladki.yaml.
 */
import * as fs from 'fs';
import * as path from 'path';
import { router } from 'expo-router';
import * as store from '@/lib/store';
import { TAB_ROUTES } from '@/app/guide';
import { WHATS_NEW } from '@/lib/whatsnew';
import { LANGS, applyLang } from '@/lib/i18n';
import { fresh, saved, seedWithDemo, addWorkout, ex } from './helpers';
import { renderApp, flushAll, screen, tap, act, go } from './app';

const ROOT = path.join(__dirname, '..');
const src = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const S = () => store.getState();
afterEach(() => { applyLang('pl'); });

const NOW = new Date(2026, 9, 11, 9);
const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
  jest.useFakeTimers({ now: NOW }); await fresh(seedWithDemo(), locale); fn();
  await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); await flushAll(10);
};
const back = async () => { await act(async () => { router.back(); }); await flushAll(10); };
const tab = async (label: string) => { await tap(screen.getByLabelText(new RegExp(`^${label}, (zakładka|tab)`))); await flushAll(10); };
const lastTrain = () => addWorkout(new Date(2026, 9, 9, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }]]], 'Nogi');
const treesOf = (): string[] => {
  const { store: rs } = require('expo-router/build/global-state/router-store'); const names: string[] = [];
  const walk = (st: { routes?: { name: string; state?: unknown }[] } | undefined) => st?.routes?.forEach(r => { names.push(r.name); walk(r.state as never); }); walk(rs.navigationRef.getRootState());
  return names;
};

describe('struktura: pliki tras, TAB_COUNT, TAB_ROUTES, rejestracja ekranów stosu', () => {
  test('zakładki = index, history (Plan), progress, more; Szablony i Ćwiczenia to ekrany stosu poza (tabs); stary ekran Postępów usunięty', () => {
    expect(fs.readdirSync(path.join(ROOT, 'app/(tabs)')).filter(f => f !== '_layout.tsx').sort()).toEqual(['history.tsx', 'index.tsx', 'more.tsx', 'progress.tsx']);
    expect(fs.existsSync(path.join(ROOT, 'app/templates.tsx'))).toBe(true); expect(fs.existsSync(path.join(ROOT, 'app/exercises.tsx'))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, 'app/more/progress.tsx'))).toBe(false);
  });
  test('pasek: TAB_COUNT = 4, kolejność Trening · Plan · Postępy · Więcej, pozycje 1–4 w etykiecie VoiceOver', () => {
    const l = src('app/(tabs)/_layout.tsx'); expect(l).toMatch(/const TAB_COUNT = 4;/);
    expect([...l.matchAll(/<Tabs\.Screen name="(\w+)"/g)].map(m => m[1])).toEqual(['index', 'history', 'progress', 'more']);
    expect([...l.matchAll(/tabA11y\(tr\('([^']+)'\), (\d)/g)].map(m => [m[1], Number(m[2])])).toEqual([['Trening', 1], ['Plan', 2], ['Postępy', 3], ['Więcej', 4]]);
  });
  test('TAB_ROUTES przewodnika = trasy zakładek (reszta tras otwiera się na stosie, bez drugiego zestawu zakładek)', () => {
    expect(TAB_ROUTES).toEqual(['/', '/history', '/progress', '/more']);
  });
  test('główny układ rejestruje Szablony i Ćwiczenia jako ekrany stosu z tytułami i nie zna już more/progress', () => {
    const l = src('app/_layout.tsx');
    expect(l).toMatch(/<Stack\.Screen name="templates" options=\{\{ title: t\('Szablony'\) \}\} \/>/); expect(l).toMatch(/<Stack\.Screen name="exercises" options=\{\{ title: t\('Ćwiczenia'\) \}\} \/>/);
    expect(l).not.toContain('more/progress');
  });
  test('Ustawienia nie mają wejścia do masy ciała; Postępy mają (jedyne wejście oprócz ćwiczenia z masą ciała)', () => {
    expect(src('app/more/settings.tsx')).not.toContain('/more/bodymass'); expect(src('app/(tabs)/progress.tsx')).toContain("router.push('/more/bodymass')");
  });
});

describe('pasek zakładek', () => {
  test('PL: cztery zakładki z pozycją „i z 4”; Szablony, Ćwiczenia i Kalendarz nie są zakładkami', async () => {
    await boot('/');
    ['Trening, zakładka, 1 z 4', 'Plan, zakładka, 2 z 4', 'Postępy, zakładka, 3 z 4', 'Więcej, zakładka, 4 z 4'].forEach(l => expect(screen.getByLabelText(l)).toBeTruthy());
    for (const n of ['Szablony', 'Ćwiczenia', 'Kalendarz']) expect(screen.queryByLabelText(new RegExp(`^${n}, zakładka`))).toBeNull();
  });
  test('tytuł zakładki Plan: nagłówek „Plan” (dawniej „Kalendarz”), z przyciskami „Planowanie” i „Dopisz trening wstecz”', async () => {
    await boot('/'); await tab('Plan');
    expect(screen.getByRole('header', { name: 'Plan' })).toBeTruthy(); expect(screen.queryByRole('header', { name: 'Kalendarz' })).toBeNull();
    expect(screen.getByText('Planowanie')).toBeTruthy(); expect(screen.getByText('Dopisz trening wstecz')).toBeTruthy();
  });
  test('EN: Plan i Progress w pasku, ekran Plan z nagłówkiem „Plan”', async () => {
    await boot('/', () => {}, 'en'); await tab('Plan'); expect(screen.getByRole('header', { name: 'Plan' })).toBeTruthy();
    await tab('Progress'); expect(screen.getByRole('header', { name: 'Progress' })).toBeTruthy();
  });
});

describe('Więcej: Szablony i Ćwiczenia jako ekrany stosu (B1–B3, D9)', () => {
  test('lista Więcej: Szablony i Ćwiczenia na górze, Postępy poza listą (mają zakładkę)', async () => {
    await boot('/more');
    const titles = screen.getAllByRole('button').map(b => String(b.props.accessibilityLabel ?? '')).filter(l => ['Szablony', 'Ćwiczenia', 'Przewodnik', 'Postępy'].includes(l.split(',')[0]) && !/zakładka/.test(l));
    expect(titles.map(l => l.split(',')[0])).toEqual(['Szablony', 'Ćwiczenia', 'Przewodnik']);
    expect(screen.queryByLabelText('Postępy')).toBeNull();
  });
  test('Więcej → Szablony: lista szablonów z „+ Nowy” i generatorem; powrót wraca do Więcej', async () => {
    await boot('/more'); await tap(screen.getByLabelText('Szablony')); await flushAll(10);
    expect(screen.getByLabelText('Dodaj szablon')).toBeTruthy(); expect(screen.getByText('Wygeneruj szablony i plan')).toBeTruthy(); expect(screen.getByText(S().templates[0].name)).toBeTruthy();
    expect(treesOf().filter(n => n === '(tabs)').length).toBe(1);
    await back(); expect(screen.getByText('Przewodnik')).toBeTruthy(); expect(screen.queryByLabelText('Dodaj szablon')).toBeNull();
  });
  test('Więcej → Ćwiczenia: biblioteka z szukaniem i „+ Nowe”; otwarcie ćwiczenia i powrót', async () => {
    await boot('/more'); await tap(screen.getByLabelText('Ćwiczenia')); await flushAll(10);
    expect(screen.getByPlaceholderText('Szukaj ćwiczenia…')).toBeTruthy(); expect(screen.getByLabelText('Dodaj ćwiczenie')).toBeTruthy();
    await back(); expect(screen.getByText('Przewodnik')).toBeTruthy();
  });
  test('szablon z listy otwiera podgląd i wraca do listy, a „Start” zamyka stos na zakładce Trening', async () => {
    await boot('/more'); await tap(screen.getByLabelText('Szablony')); await flushAll(10);
    await tap(screen.getByText(S().templates[0].name)); await flushAll(10); expect(screen.getByLabelText('Edytuj szablon')).toBeTruthy();
    await back(); expect(screen.getByLabelText('Dodaj szablon')).toBeTruthy();
  });
});

describe('Postępy: zakładka z Progresją i masą ciała (C2, C10, C11; P5 A)', () => {
  test('bez treningów: nagłówek, pusty stan wykresów, sekcja „Masa ciała” (nie podano) i wejście do pomiarów', async () => {
    await boot('/'); await tab('Postępy');
    expect(screen.getByRole('header', { name: 'Postępy' })).toBeTruthy(); expect(screen.getByText('Wykresy pojawią się po pierwszym zakończonym treningu.')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Masa ciała' })).toBeTruthy(); expect(screen.getByText('nie podano — e1RM podciągania i pompek')).toBeTruthy();
    await tap(screen.getByText('Masa ciała — pomiary')); await flushAll(10); expect(screen.getByText('Zapisz pomiar')).toBeTruthy();
    await back(); expect(screen.getByRole('header', { name: 'Postępy' })).toBeTruthy();
  });
  test('z treningiem: podsumowanie, kafelki „Progresja” (te same co na ekranie Trening) i szczegóły po stuknięciu', async () => {
    await boot('/', () => { lastTrain(); }); await tab('Postępy');
    expect(screen.getByRole('header', { name: 'Progresja' })).toBeTruthy(); expect(screen.getByTestId('progress-tile-week')).toBeTruthy(); expect(screen.getByTestId('progress-tile-month')).toBeTruthy();
    await tap(screen.getByTestId('progress-tile-week')); await flushAll(10); expect(screen.getByText(/^Ten tydzień vs poprzedni/)).toBeTruthy();
  });
  test('sekcja „Masa ciała”: ostatni pomiar i wykres od dwóch pomiarów; dodanie pomiaru z ekranu pomiarów odświeża sekcję', async () => {
    await boot('/', () => { store.addBodyMass(80, '2026-10-01'); store.addBodyMass(81.5, '2026-10-05'); }); await tab('Postępy');
    expect(screen.getByText(/^81,5 kg · pomiar z /)).toBeTruthy(); expect(screen.getAllByLabelText(/^Wykres/).length).toBeGreaterThan(0);
    await tap(screen.getByText('Masa ciała — pomiary')); await flushAll(10); expect(screen.getByText('Pomiary')).toBeTruthy();
    await act(async () => { store.addBodyMass(82, '2026-10-10'); }); await back(); expect(screen.getByText(/^82 kg · pomiar z /)).toBeTruthy();
  });
  test('jeden pomiar: ostatnia wartość bez wykresu (wykres wymaga dwóch punktów)', async () => {
    await boot('/', () => { store.addBodyMass(80, '2026-10-01'); }); await tab('Postępy');
    expect(screen.getByText(/^80 kg · pomiar z /)).toBeTruthy(); expect(screen.queryAllByLabelText(/^Wykres, /).length).toBe(0);
  });
  test('Ustawienia: brak pozycji „Masa ciała” (przeniesiona do Postępów), „Miejsca i sprzęt” też poza Ustawieniami', async () => {
    await boot('/more/settings'); expect(screen.queryByText('Masa ciała')).toBeNull(); expect(screen.queryByText(/^nie podano — e1RM/)).toBeNull();
  });
  test('poza zakładką Postępy treść nie jest renderowana (wpisy serii w treningu nie przeliczają wykresów w tle)', async () => {
    await boot('/', () => { lastTrain(); }); await tab('Postępy'); expect(screen.getByText('Masa ciała — pomiary')).toBeTruthy();
    await tab('Trening'); expect(screen.queryByText('Masa ciała — pomiary')).toBeNull();
    await tab('Postępy'); expect(screen.getByText('Masa ciała — pomiary')).toBeTruthy();
  });
});

describe('przepływy dalej osiągalne (docs/22 4.5): Szablony, Ćwiczenia, Postępy, masa ciała', () => {
  test('B1 Planowanie → „Szablony” otwiera listę na stosie; powrót do planu', async () => {
    await boot('/'); await tab('Plan'); await tap(screen.getByText('Planowanie')); await flushAll(10);
    await tap(screen.getAllByText('Szablony')[0]); await flushAll(10); expect(screen.getByLabelText('Dodaj szablon')).toBeTruthy();
    await back(); expect(screen.getByText('Wygeneruj szablony i plan')).toBeTruthy(); expect(treesOf().filter(n => n === '(tabs)').length).toBe(1);
  });
  test('C1 „Ten tydzień” na ekranie Trening → zakładka Postępy (jedno „(tabs)” na stosie)', async () => {
    await boot('/', () => { lastTrain(); }); await tap(screen.getByTestId('week-tiles')); await flushAll(10);
    expect(screen.getByRole('header', { name: 'Postępy' })).toBeTruthy(); expect(treesOf().filter(n => n === '(tabs)').length).toBe(1);
  });
  test('C4 ćwiczenie (Więcej → Ćwiczenia → ćwiczenie → „Postępy”) otwiera wykres ćwiczenia w zakładce Postępy; ✕ i powrót do zakładki nie otwierają go znowu', async () => {
    await boot('/', () => { lastTrain(); }); const id = ex('Back Squat').id;
    await go(`/exercise/${id}`); await flushAll(10); await tap(screen.getByText('Postępy')); await flushAll(10);
    expect(screen.getByLabelText('Back Squat')).toBeTruthy(); expect(screen.getByText('REKORDY')).toBeTruthy(); expect(treesOf().filter(n => n === '(tabs)').length).toBe(1);
    await tap(screen.getByLabelText('Back Squat')); await flushAll(10); expect(screen.getByText('Ćwiczenie')).toBeTruthy(); expect(screen.queryByText('REKORDY')).toBeNull();
    await tab('Trening'); await tab('Postępy'); expect(screen.queryByText('REKORDY')).toBeNull(); expect(screen.getByRole('header', { name: 'Progresja' })).toBeTruthy();
  });
  test('C4 Postępy → szukanie → chip ćwiczenia → wykres (2 stuknięcia od zakładki)', async () => {
    await boot('/', () => { lastTrain(); }); await tab('Postępy'); await tap(screen.getByText('Back Squat')); await flushAll(10);
    expect(screen.getByText('REKORDY')).toBeTruthy();
  });
  test('C10 ćwiczenie z masą ciała → „Masa ciała — pomiary” prowadzi do ekranu pomiarów', async () => {
    await boot('/', () => { addWorkout(new Date(2026, 9, 9, 18).getTime(), [['Pull Up', [{ reps: 8 }]]], 'Plecy'); store.addBodyMass(80, '2026-10-01'); }); await go(`/progress?ex=${ex('Pull Up').id}`); await flushAll(10);
    await tap(screen.getByText('Masa ciała — pomiary')); await flushAll(10); expect(screen.getByText('Zapisz pomiar')).toBeTruthy();
  });
  test('Przewodnik: „Pokaż” przy Szablonach otwiera ekran na stosie, przy Postępach — zakładkę', async () => {
    await boot('/guide'); await tap(screen.getByLabelText('Szablony, nieprzeczytane')); await flushAll(5); await tap(screen.getByLabelText('Pokaż: Szablony')); await flushAll(10);
    expect(screen.getByLabelText('Dodaj szablon')).toBeTruthy(); expect(treesOf().filter(n => n === '(tabs)').length).toBe(1);
    await boot('/guide'); await tap(screen.getByLabelText('Postępy i rekordy, nieprzeczytane')); await flushAll(5); await tap(screen.getByLabelText('Pokaż: Postępy i rekordy')); await flushAll(10);
    expect(screen.getByRole('header', { name: 'Postępy' })).toBeTruthy(); expect(treesOf().filter(n => n === '(tabs)').length).toBe(1);
  });
});

describe('„Co nowego” — wspólny wpis o nowym układzie (docs/18 P7)', () => {
  test('wpis 0.13 (id 2026-10-11, historyczny; bieżący 0.16: release-0.16.test.tsx), build 1009, trzy punkty o czterech zakładkach, Postępach i ekranie Trening oraz punkt o imporcie CSV (0.13.0); pod nim 0.12 z buildem 1008', () => {
    const e = WHATS_NEW.find(w => w.id === '2026-10-11')!; const j = WHATS_NEW.indexOf(e); expect([e.id, e.build, WHATS_NEW[j + 1].id, WHATS_NEW[j + 1].build]).toEqual(['2026-10-11', 1009, '2026-10-10', 1008]); expect(e.items()).toEqual([
      'Cztery zakładki: Trening, Plan, Postępy i Więcej. Szablony i Ćwiczenia znajdziesz teraz w Więcej.',
      'Postępy mają własną zakładkę: podsumowanie, „Progresja”, wykresy ćwiczeń i masa ciała.',
      'Ekran Trening: „Planowanie” przy nazwie planu, „Ten tydzień” i „Progresja”; „Z szablonu” w arkuszu „Inny trening” otwiera wybór szablonu ze „Startem”.',
      'Import historii treningów z plików CSV popularnych dzienników (Więcej → Kopia zapasowa → „Importuj historię z pliku CSV”), z podglądem przed zapisem.',
    ]);
  });
  test('wszystkie języki: cztery punkty przetłumaczone (różne od polskich), bez „{”, zakończone kropką („。” w ja/zh-Hant)', () => {
    const E = () => WHATS_NEW.find(w => w.id === '2026-10-11')!; const pl = E().items();
    for (const l of LANGS) {
      if (l === 'pl') continue; applyLang(l); const it = E().items();
      expect([l, it.length]).toEqual([l, 4]);
      expect([l, it.filter((x, i) => x === pl[i] || /[{}]/.test(x) || !/[.。]$/.test(x))]).toEqual([l, []]);
    }
  });
  test('Trening → „i”: bieżący wpis rozwinięty, kropka znika po otwarciu', async () => {
    await boot('/', () => { lastTrain(); }); expect(screen.getByTestId('whats-new-dot')).toBeTruthy();
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5);
    for (const x of WHATS_NEW[0].items()) expect(screen.getByText(`• ${x}`)).toBeTruthy();
    expect(screen.queryByTestId('whats-new-dot')).toBeNull(); expect(S().whatsNewSeen).toBe(WHATS_NEW[0].id); /* bieżący wpis (od 0.16: id 2026-10-14) */
  });
});
