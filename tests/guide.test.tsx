/*
 * Przewodnik po funkcjach (decyzja właściciela 08.10.2026: wariant A — tematy z krokami i „Pokaż”; nowym w „Pierwszych krokach”, po aktualizacji
 * w „Co nowego”, zawsze w Więcej). Rodzaje (docs/20): logika (tematy, postęp, odhaczanie), dane (sanityzacja, bez userTouched, dane bez pola 1:1),
 * spójność treści z interfejsem (cytowane nazwy przycisków istnieją jako teksty UI; ścieżki „Pokaż” istnieją), ekran (rozwijanie, kroki, ✓,
 * VoiceOver, „Pokaż” dla każdego tematu), wejścia (Więcej, Pierwsze kroki, Co nowego), języki (EN). E2E: .maestro/14.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { GUIDE, guideSeen, guideProgress, markGuideSeen } from '@/lib/guide';
import { EN } from '@/lib/i18n.en';
import { WHATS_NEW } from '@/lib/whatsnew';
import { applyLang } from '@/lib/i18n';
import { fresh, saved, addWorkout } from './helpers';
import { renderApp, flushAll, screen, tap, act } from './app';

const S = () => store.getState();
afterEach(() => { applyLang('pl'); });

describe('treść i logika', () => {
  beforeEach(async () => { await fresh(); });
  test('tematy: unikalne id, 2–4 kroki, zdania z kropką; ścieżki „Pokaż” istnieją w app/', () => {
    const ids = GUIDE.map(g => g.id); expect(new Set(ids).size).toBe(ids.length); expect(GUIDE.length).toBe(8);
    for (const g of GUIDE) {
      const st = g.steps(); expect(st.length).toBeGreaterThanOrEqual(2); expect(st.length).toBeLessThanOrEqual(4); st.forEach(s => expect(s).toMatch(/[.…]”?\.?$/));
      const file = g.route === '/' ? 'app/(tabs)/index.tsx' : g.route === '/templates' || g.route === '/history' ? `app/(tabs)${g.route}.tsx` : `app${g.route}.tsx`;
      expect([g.id, fs.existsSync(path.join(__dirname, '..', file))]).toEqual([g.id, true]);
    }
  });
  test('cytowane w krokach nazwy przycisków („…”) to teksty z interfejsu — zmiana nazwy przycisku wymaga zmiany przewodnika', () => {
    const quoted = GUIDE.flatMap(g => g.steps()).flatMap(s => [...s.matchAll(/„([^”]+)”/g)].map(m => m[1]));
    expect(quoted.length).toBeGreaterThan(10);
    const missing = quoted.map(q => (q === 'Zaplanuj deload od …' ? 'Zaplanuj deload od {date}' : q === 'Powtórz ostatni' ? 'Powtórz ostatni ({name})' /* przycisk z nazwą treningu */ : q)).filter(q => !(q in EN));
    expect(missing).toEqual([]);
  });
  test('postęp i odhaczanie: nieznane id pomijane, bez powtórzeń, bez userTouched', () => {
    expect(guideProgress()).toEqual({ seen: 0, total: 8 }); markGuideSeen('plan'); markGuideSeen('plan'); markGuideSeen('xyz');
    expect(guideSeen()).toEqual(['plan']); expect(guideProgress().seen).toBe(1); expect(S().userTouched).not.toBe(true);
  });
  test('dane: zapis i odczyt; sanityzacja (teksty ≤ 40, bez powtórzeń); dane bez pola 1:1', async () => {
    markGuideSeen('workout'); await store.flush(); await fresh(saved()); expect(S().guideSeen).toEqual(['workout']);
    (S() as any).guideSeen = ['a', 'a', 7, '', 'x'.repeat(41)]; store.save(); await store.flush(); await fresh(saved()); expect(S().guideSeen).toEqual(['a']);
    (S() as any).guideSeen = 'zły'; store.save(); await store.flush(); await fresh(saved()); expect('guideSeen' in S()).toBe(false);
  });
});

test('macierz: każdy tekst przewodnika (i punkt „Co nowego”) jest w treści tematów albo wpisów', () => {
  const texts = [
    '„⏸ Pauza” zatrzymuje zegar treningu; czas pauzy nie liczy się do czasu trwania.',
    '„Propozycje” układają tydzień z najmniejszą liczbą zmian, z uwzględnieniem regeneracji partii.',
    '„Wygeneruj szablony i plan” (Szablony albo Plan tygodnia): wybierz cel, miejsce, liczbę i długość sesji.',
    'Automatyczna kopia po każdym treningu trafia do Plików (Ustawienia).',
    'Kilka planów: „Zapisz kopię jako nowy plan” i „Ustaw jako aktywny” w „Inne plany”.',
    'Kopia zapasowa',
    'Lista ćwiczeń, zamiany i generator pokazują to, co da się zrobić w wybranym miejscu.',
    'Mapa mięśni i serie na partię z kreską 10 serii tygodniowo.',
    'Na ekranie Trening stuknij „Start” przy szablonie albo „Pusty trening”.',
    'Na koniec „Zakończ trening i zapisz” — sesja trafi do Kalendarza.',
    'Nowy ekran Trening: dzisiejszy trening, tydzień w liczbach i ostatni trening; przewodnik po funkcjach w Więcej.',
    'Po kilku tygodniach treningu z rzędu Kalendarz podpowie „Zaplanuj deload od …”.',
    'Postępy i rekordy',
    'Przejrzyj podgląd i „Na czym to oparte” — wynik zapisuje się dopiero po zatwierdzeniu.',
    'Przesunięcie w lewo na liście usuwa szablon (z potwierdzeniem).',
    'Stuknij dzień w Kalendarzu: przesuń plan o 1 dzień, przesuń tylko ten trening albo zmień go na inny.',
    'Szablony trafiają do folderu „Wygenerowane”, a plan do „Inne plany” albo od razu jako aktywny.',
    'Trening i serie',
    'Tydzień oznaczysz też w Postępach przełącznikiem „Tydzień deload”.',
    'W edytorze szablonu przeniesiesz go do folderu albo archiwum.',
    'W Kalendarzu „Plan tygodnia” przypisuje szablony do dni — plan powtarza się co tydzień.',
    'W tygodniu deload „Start” i „Powtórz ostatni” zaproponują „Mniej serii”: o około 1/3–1/2 mniej serii (np. 2 z 3; ćwiczenia z 1 serią bez zmian); ciężary i szablon bez zmian.', /* audyt 0.10 (D1, MER-04) */
    'W zakładce Szablony „+ Nowy” tworzy szablon: ćwiczenia, serie, zakres powtórzeń i przerwy.',
    'Więcej → Backup: eksport wszystkich danych do pliku i import z pliku.',
    'Więcej → Miejsca i sprzęt: dom, siłownia, hotel — każdy ze swoim sprzętem i ciężarami.',
    'Więcej → Postępy: podsumowanie tygodnia lub miesiąca z poprzednim okresem obok.',
    'Wpisz ciężar i powtórzenia, odhacz serię ✓ — przerwa odlicza się sama.',
    'Wykresy ćwiczeń i rekordy; rekord w trakcie treningu widać przy serii.',
  ];
  const all = new Set([...GUIDE.flatMap(g => [g.title(), ...g.steps()]), ...WHATS_NEW.flatMap(e => e.items())]);
  expect(texts.filter(x => !all.has(x))).toEqual([]);
});

describe('ekrany', () => {
  const boot = async (url: string, fn: () => void = () => {}, locale: 'pl' | 'en' = 'pl') => {
    jest.useFakeTimers({ now: new Date(2026, 9, 8, 9) }); await fresh(undefined, locale); fn();
    await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale, url }); await flushAll(10);
  };
  test('przewodnik: opis, postęp, tematy zwinięte; rozwinięcie — kroki, ✓, VoiceOver; zwinięcie', async () => {
    await boot('/guide');
    expect(screen.getByText('Najważniejsze funkcje w kilku krokach. „Pokaż” otwiera opisany ekran.')).toBeTruthy(); expect(screen.getByText('Przeczytane: 0 z 8')).toBeTruthy();
    expect(screen.getByLabelText('Plan tygodnia i Kalendarz, nieprzeczytane')).toBeTruthy(); expect(screen.queryByText(/^1\. W Kalendarzu/)).toBeNull();
    await tap(screen.getByLabelText('Plan tygodnia i Kalendarz, nieprzeczytane')); await flushAll(5);
    GUIDE.find(g => g.id === 'plan')!.steps().forEach((s, i) => expect(screen.getByText(`${i + 1}. ${s}`)).toBeTruthy());
    expect(screen.getByText('Przeczytane: 1 z 8')).toBeTruthy(); expect(screen.getByLabelText('Plan tygodnia i Kalendarz, przeczytane').props.accessibilityState).toEqual({ expanded: true });
    await tap(screen.getByLabelText('Plan tygodnia i Kalendarz, przeczytane')); await flushAll(5); expect(screen.queryByText(/^1\. W Kalendarzu/)).toBeNull();
  });
  test('wszystkie tematy po polsku na ekranie; „Pokaż” otwiera opisany ekran', async () => {
    const expectOn: Record<string, () => void> = {
      workout: () => expect(screen.getByText('Zacznij z szablonu')).toBeTruthy(), templates: () => expect(screen.getByText('+ Nowy')).toBeTruthy(),
      plan: () => expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(), generator: () => expect(screen.getByText('Podgląd')).toBeTruthy(),
      deload: () => expect(screen.getByRole('header', { name: 'Kalendarz' })).toBeTruthy(), progress: () => expect(screen.getByText('Wykresy pojawią się po pierwszym zakończonym treningu.')).toBeTruthy(), /* ekran Postępów bez treningów */
      places: () => expect(screen.getAllByText(/Miejsc|miejsc/).length).toBeGreaterThan(0), backup: () => expect(screen.getAllByText(/Eksport|eksport/).length).toBeGreaterThan(0),
    };
    for (const g of GUIDE) {
      await boot('/guide'); await tap(screen.getByLabelText(`${g.title()}, nieprzeczytane`)); await flushAll(5);
      g.steps().forEach((s, i) => expect(screen.getByText(`${i + 1}. ${s}`)).toBeTruthy());
      await tap(screen.getByLabelText(`Pokaż: ${g.title()}`)); await flushAll(10); expectOn[g.id]();
    }
  });
  test('wejścia: Więcej (z postępem), „Pierwsze kroki” (nowa osoba), „Co nowego” (po aktualizacji)', async () => {
    await boot('/more', () => { markGuideSeen('workout'); });
    expect(screen.getByText('Przewodnik')).toBeTruthy(); expect(screen.getByText('Przeczytane: 1 z 8')).toBeTruthy();
    await tap(screen.getByText('Przewodnik')); await flushAll(10); expect(screen.getByText('Przeczytane: 1 z 8')).toBeTruthy();
    await boot('/'); await tap(screen.getByLabelText('Przewodnik po funkcjach')); await flushAll(10); expect(screen.getByText(/^Najważniejsze funkcje/)).toBeTruthy();
    await boot('/', () => { addWorkout(new Date(2026, 9, 7, 18).getTime(), [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    await tap(screen.getByTestId('whats-new-i')); await flushAll(5); await tap(screen.getByText('Przewodnik po funkcjach')); await flushAll(10);
    expect(screen.getByText(/^Najważniejsze funkcje/)).toBeTruthy(); expect(screen.queryByTestId('whats-new')).toBeNull();
  });
  test('English', async () => {
    await boot('/guide', () => {}, 'en');
    expect(screen.getByText('Read: 0 of 8')).toBeTruthy(); await tap(screen.getByLabelText('Weekly plan and Calendar, unread')); await flushAll(5);
    expect(screen.getByText('1. In the Calendar, “Weekly plan” assigns templates to days — the plan repeats every week.')).toBeTruthy();
    expect(screen.getByLabelText('Show: Weekly plan and Calendar')).toBeTruthy();
  });
});
