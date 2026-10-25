/*
 * Ekran Ustawienia → „Źródła wiedzy” (decyzja właściciela 23.10.2026, docs/18). Rodzaje (docs/20): ekran (wejście z Ustawień, grupy, wiersze, powrót), scenariusz
 * (Ustawienia → Źródła wiedzy → Wróć), języki (EN), dostępność (nagłówki sekcji, wiersze bez roli przycisku), wskazówki bez stopki ze źródłami.
 * Teksty „do czego służy” są wpisane literalnie poniżej (macierz testów: każdy tekst UI ma dowód w teście).
 */
import { renderApp, flushAll, screen, go, tap, openInfo } from './app';
import { SOURCE_GROUPS, CUE_SOURCE_LINES } from '@/lib/sources';
import { applyLang } from '@/lib/i18n';

jest.setTimeout(60000);
const USES: [string, string][] = [
  ['acsm-2026', 'Ile serii i powtórzeń oraz jak blisko upadku trenować, żeby budować siłę i mięśnie.'], ['acsm-2011', 'Zakresy powtórzeń, liczba serii i przerwa między sesjami.'],
  ['acsm-2009', 'Jak stopniowo zwiększać obciążenie.'], ['pelland-2026', 'Jak liczyć serie w tygodniu, gdy partia pracuje tylko pomocniczo.'],
  ['ramos-campo-2024', 'Czy podział treningu na sesje (całe ciało, góra/dół) zmienia efekty.'], ['robinson-2024', 'Jak blisko upadku kończyć serie.'],
  ['lopez-2021', 'Jaki ciężar i ile powtórzeń w serii daje przyrost mięśni.'], ['singer-2024', 'Jak długie powinny być przerwy między seriami.'],
  ['who-2020', 'Ile ruchu w tygodniu: cardio i ćwiczenia wzmacniające.'], ['pag-2018', 'Jak zacząć od jednego dnia siłowego w tygodniu i ile serii wystarczy.'],
  ['zourdos-2016', 'Skala RPE oparta na powtórzeniach w zapasie (RIR).'], ['helms-2016', 'Jak stosować skalę RPE i RIR w treningu oraz jak opisać niski wysiłek słowami.'],
  ['bastos-2024', 'Przegląd tego, jak używa się skali powtórzeń w zapasie.'], ['epley', 'Wzór, który z ciężaru i liczby powtórzeń szacuje maksymalny ciężar na jedno powtórzenie.'],
  ['sanchez-moreno-2017', 'Maksymalny ciężar w podciąganiu to masa ciała plus dociążenie.'], ['talaber-2022', 'Jak mierzy się maksymalny ciężar w podciąganiu.'],
  ['van-den-tillaar-2020', 'Jaką część masy ciała podnosisz w pompkach.'], ['gouvali-2005', 'Jaką część masy ciała podnosisz w pompkach.'],
  ['bell-2023', 'Jak często trenerzy planują lżejszy tydzień.'], ['rogerson-2024', 'Jak często lżejszy tydzień planują zawodnicy.'], ['nsca-2017', 'Kiedy przy sztandze nad ciałem potrzebna jest asekuracja.'],
];
const TITLES = ['Plan: serie, powtórzenia, przerwy', 'Ruch dla zdrowia', 'Wysiłek: RPE i RIR', 'Szacowany maksymalny ciężar (e1RM)', 'Lżejszy tydzień (deload)', 'Asekuracja'];
const LINES = ['biblioteki ćwiczeń organizacji szkoleniowych', 'specjalistyczne serwisy treningowe', 'materiały producenta sprzętu', 'badania naukowe'];
const text = () => screen.UNSAFE_root.findAll((n: { type: unknown; props: { children?: unknown } }) => n.type === 'Text').map((n: { props: { children?: unknown } }) => [n.props.children].flat(Infinity).join(''));

describe('Ustawienia → Źródła wiedzy', () => {
  afterEach(() => { applyLang('pl'); });
  test('wiersz w Ustawieniach otwiera ekran; ekran ma wszystkie grupy, źródła z opisem i cytatem, sekcje o technice, partiach i uproszczeniach oraz zdanie medyczne', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    expect(screen.getByText('Źródła wiedzy')).toBeTruthy(); expect(screen.getByText('Na czym opierają się liczby i zalecenia')).toBeTruthy();
    await tap(screen.getByText('Źródła wiedzy')); await flushAll(700);
    expect(screen.getByTestId('sources-screen')).toBeTruthy();
    const all = text();
    for (const t of TITLES) expect([t, all.some(x => x.toUpperCase() === t.toUpperCase())]).toEqual([t, true]);
    expect(USES.map(u => u[0]).sort()).toEqual(SOURCE_GROUPS.flatMap(g => g.items.map(i => i.id)).sort()); /* test zna każde źródło z listy */
    for (const g of SOURCE_GROUPS) for (const i of g.items) {
      const u = USES.find(x => x[0] === i.id)![1];
      expect([i.id, all.includes(`${u}\n${i.detail}`)]).toEqual([i.id, true]); expect([i.id, screen.queryAllByText(i.cite).length]).toEqual([i.id, 1]);
    }
    expect(screen.getByText('ACSM 2026')).toBeTruthy(); expect(screen.getByText('WHO 2020')).toBeTruthy(); expect(screen.getByText('Epley')).toBeTruthy();
    for (const l of CUE_SOURCE_LINES) expect(LINES).toContain(l()); /* pętla po stałej: każdy rodzaj źródła wskazówek */
    for (const l of LINES) expect(screen.getByText(l)).toBeTruthy();
    expect(screen.getByText('Opisy techniki są napisane własnymi słowami, na podstawie:')).toBeTruthy();
    expect(screen.getByText('Partie pracujące w ćwiczeniach ustalamy z przeglądów badań i badań aktywności mięśni.')).toBeTruthy();
    expect(screen.getByText('Część reguł w aplikacji to nasze uproszczenia albo wybory, a nie wynik badań.')).toBeTruthy();
    expect(screen.getByText('Na czym opierają się liczby i zalecenia w aplikacji.')).toBeTruthy();
    expect(screen.getByText(/^Aplikacja nie udziela porad medycznych/)).toBeTruthy();
  });
  test('objaśnienia pod ⓘ są zwinięte na starcie i rozwijają się w miejscu (wzorzec 27)', async () => {
    await renderApp(); await go('/more/sources'); await flushAll(10);
    for (const x of [/^Liczby i zalecenia w aplikacji opierają się na/, /^Gdy opieramy się na jednym źródle albo na uproszczeniu/, /^Nie wszystko da się wyczytać z badań/]) expect(screen.queryByText(x)).toBeNull();
    await openInfo('sources-intro'); await openInfo('sources-muscles'); await openInfo('sources-ours');
    expect(screen.getByText('Liczby i zalecenia w aplikacji opierają się na stanowiskach organizacji naukowych, przeglądach badań i badaniach z recenzowanych czasopism. Tu są wszystkie źródła w jednym miejscu — w pozostałych miejscach aplikacji piszemy zwykłym językiem.')).toBeTruthy();
    expect(screen.getByText('Przy części ćwiczeń przypisanie partii opiera się na jednym źródle albo na uproszczeniu.')).toBeTruthy();
    expect(screen.getByText('Nie wszystko da się wyczytać z badań. Przykłady: długość przerw w planie, krok zmiany ciężaru.')).toBeTruthy();
  });
  test('dostępność: nagłówki sekcji mają rolę header, wiersze źródeł nie są przyciskami (nic nie otwierają)', async () => {
    await renderApp(); await go('/more/sources'); await flushAll(10);
    const heads = screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => n.props.accessibilityRole === 'header').length;
    expect(heads).toBeGreaterThanOrEqual(TITLES.length + 3);
    const rows = SOURCE_GROUPS.flatMap(g => g.items).map(i => screen.getByText(i.cite));
    for (const r of rows) { let p = r.parent; let btn = false; while (p) { if (p.props?.accessibilityRole === 'button') btn = true; p = p.parent; } expect(btn).toBe(false); }
  });
  test('English: tytuły sekcji i zdania po angielsku, cytaty bez zmian', async () => {
    await renderApp({ locale: 'en' }); await go('/more/sources'); await flushAll(10);
    expect(text().some(x => x.toUpperCase() === 'PLAN: SETS, REPS, REST')).toBe(true);
    expect(screen.getByText('How many sets and reps, and how close to failure to train, to build strength and muscle.\nAmerican College of Sports Medicine — Currier et al., Med Sci Sports Exerc 2026;58(4)')).toBeTruthy();
    expect(screen.getByText('exercise libraries of fitness education organisations')).toBeTruthy(); expect(screen.getByText('ACSM 2026')).toBeTruthy();
  });
});
