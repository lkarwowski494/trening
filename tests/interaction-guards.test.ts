/*
 * Strażniki wzorców interakcji (właściciel, 13.10.2026: „akcje tego samego typu działają w całej aplikacji tak samo”; katalog: docs/32-wzorce-interakcji.md).
 * Statyczny skan źródeł app/, components/, lib/ — nowy kod, który łamie wzorzec, robi test czerwonym. Numeracja S1–S16 jak w audycie spójności (docs/32, sekcja „Strażniki”); S17 — wzorzec ⓘ (14.10.2026).
 * Zamykanie okien (S1) pilnuje osobno tests/close-button-guard.test.tsx; wzorzec usuwania — tests/swipe-delete.test.tsx.
 * Pominięte lub częściowe (z powodem): S14 (pole dotyku ≥ 44 pt — Jest nie liczy układu; pilnujemy komponentów wspólnych i zakazu roli „link”), S6 (wybór 1 z 2–4 / boolean —
 * reguła semantyczna, sprawdzamy miejsca naprawione), S16 (arkusz akcji — lista wyjątków z powodem).
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, sep } from 'path';

const ROOT = join(__dirname, '..');
const walk = (d: string): string[] => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const rel = (p: string) => relative(ROOT, p).split(sep).join('/');
const code = ['app', 'components', 'lib'].flatMap(d => walk(join(ROOT, d))).filter(f => /\.tsx?$/.test(f) && !/\.generated\.ts$/.test(f) && !/lib\/(i18n\.en|locales)/.test(rel(f)) && !/lib\/(cues|figures)\//.test(rel(f)));
const src = new Map(code.map(f => [rel(f), readFileSync(f, 'utf8')]));
/** Pliki, w których wzorzec wolno wyrazić ręcznie (implementacja wzorca). */
const hits = (re: RegExp, allow: string[] = []) => [...src].filter(([f, s]) => !allow.includes(f) && re.test(s)).map(([f]) => f);
const lines = (re: RegExp, allow: string[] = []) => [...src].filter(([f]) => !allow.includes(f)).flatMap(([f, s]) => s.split('\n').map((l, i) => [f, i + 1, l] as const).filter(([, , l]) => re.test(l)).map(([f2, n]) => `${f2}:${n}`));

describe('S2/S1: nagłówki — przyciski tylko przez wspólne komponenty', () => {
  test('headerLeft/headerRight tylko w DraftHeader, CloseButton, AddButton (poza resetem `: undefined`)', () => {
    const own = ['components/DraftHeader.tsx', 'components/CloseButton.tsx', 'components/AddButton.tsx'];
    const bad = lines(/header(Left|Right)\s*:/, own).filter(x => { const [f, n] = x.split(':'); const l = src.get(f)!.split('\n')[+n - 1]; return !/header(Left|Right): undefined/.test(l.replace(/header(Left|Right): undefined[^}]*/g, 'header$1: undefined')) || /header(Left|Right): \(\)/.test(l); });
    expect(bad).toEqual([]);
  });
  test('zakaz <Pressable w opcjach nagłówka: wspólne komponenty używają HeaderButton (44 pt, limit powiększenia)', () => {
    expect(src.get('components/DraftHeader.tsx')).toMatch(/minHeight: SIZE\.hit, minWidth: SIZE\.hit/) /* M3: 44 pt z tokenu SIZE.hit */; expect(src.get('components/DraftHeader.tsx')).toMatch(/maxFontSizeMultiplier=\{1\.4\}/);
    expect(src.get('components/CloseButton.tsx')).toContain('<HeaderButton'); expect(src.get('components/AddButton.tsx')).toMatch(/minHeight: 44, minWidth: 44/);
  });
});

describe('S3: edycja na szkicu — zapis tylko w nagłówku, te same etykiety', () => {
  test.each(['app/template/[id].tsx', 'app/exercise/[id].tsx', 'app/history/edit/[id].tsx'])('%s: <DraftHeader> z cancelLabel i saveLabel; brak drugiego przycisku „Zapisz …” na dole', f => {
    const s = src.get(f)!; const m = /<DraftHeader[^>]*>/.exec(s); expect(m).not.toBeNull(); expect(m![0]).toMatch(/cancelLabel=/); expect(m![0]).toMatch(/saveLabel=/);
    expect(s).not.toMatch(/<Btn[^>]*title=\{t\('Zapisz (zmiany|szablon|ćwiczenie|sesję)'\)\}/);
  });
});

describe('S4: dodawanie na listach — „+” w nagłówku, jeden komponent', () => {
  test.each([['app/templates.tsx', 'Dodaj szablon'], ['app/exercises.tsx', 'Dodaj ćwiczenie'], ['app/more/locations.tsx', 'Dodaj miejsce'], ['app/more/bands.tsx', 'Dodaj gumę'], ['app/plan.tsx', 'Dodaj plan']])('%s: useAddHeader z etykietą „%s”', (f, label) => {
    expect(src.get(f)).toContain(`useAddHeader(`); expect(src.get(f)).toContain(`'${label}'`);
  });
  test('zakaz starych przycisków dodawania na ekranach list', () => {
    expect(lines(/title=\{t(r)?\('\+ (Nowy|Nowe|Guma|Dodaj miejsce|Nowy plan)'\)\}/)).toEqual([]);
  });
});

describe('S5: potwierdzenia — rezygnacja zawsze „Anuluj” (jedna stała w lib/confirm.ts)', () => {
  test('style: \'cancel\' tylko w lib/confirm.ts (i wyjątek: „Nie teraz” przy prośbie o zgodę na powiadomienia)', () => {
    expect(lines(/style: 'cancel'/, ['lib/confirm.ts', 'lib/planReminder.ts'])).toEqual([]);
    expect(src.get('lib/planReminder.ts')!.match(/style: 'cancel'/g)).toHaveLength(1); /* wyjątek nazwany: odroczenie pytania o zgodę, nie anulowanie akcji */
  });
  test('zakaz słów „Nie” i „Wróć” jako przycisków okien (jedyny wyjątek: „Wróć do edycji” w odrzucaniu zmian)', () => {
    expect(lines(/text: (t|tr)\('(Nie|Wróć)'\)/)).toEqual([]);
    const c = src.get('lib/confirm.ts')!; expect(c).toContain("t('Anuluj')"); expect(c).toContain("t('Wróć do edycji')"); expect(src.get('components/DraftHeader.tsx')).toContain('backToEditButton()');
  });
});

describe('S6: wybór i przełączniki (miejsca naprawione)', () => {
  test('„Asysta gumą” to SwitchRow; Tydzień/Miesiąc to Segmented (tryb generatora zniknął — ZM-03, 21.10.2026); partie mięśni to Chip toggle', () => {
    expect(src.get('app/exercise/[id].tsx')).toMatch(/<SwitchRow label=\{t\('Asysta gumą'\)\}/); expect(src.get('app/exercise/[id].tsx')).not.toMatch(/<Field label=\{t\('Asysta gumą'\)\}>/);
    expect(src.get('app/generator.tsx')).not.toContain('<Segmented'); /* ZM-03: generator bez przełącznika trybu */ expect(src.get('components/PeriodSummary.tsx')).toContain('<Segmented');
    expect((src.get('app/exercise/[id].tsx')!.match(/<Chip toggle key=\{mu\}/g) ?? [])).toHaveLength(2);
  });
});

describe('S7: czas przerwy i formaty', () => {
  test('przerwa zawsze przez fmtSec (nigdy fmtDur) i etykiety „(s)”', () => {
    expect(lines(/fmtDur\([^)]*[rR]est/)).toEqual([]); expect(lines(/t\('(przerwa s|Przerwa \(sekundy\)|Domyślna przerwa \(sekundy\))'\)/)).toEqual([]);
  });
});

describe('S8/S17: informacja zwrotna', () => {
  test('zakaz accessibilityLiveRegion (Android-only) — tylko lib/announce.ts', () => { expect(lines(/accessibilityLiveRegion/, ['lib/announce.ts'])).toEqual([]); expect(src.get('lib/announce.ts')).toContain('announceForAccessibility'); });
  test('zakaz ogólnego błędu „Nie udało się” + „Spróbuj ponownie.” bez nazwania, co się nie udało', () => {
    expect(lines(/Alert\.alert\(t\('Nie udało się'\)/)).toEqual([]);
  });
  test('zakaz okna Alert przy starcie z autozapisu — wiersz na ekranie Trening (lib/notices.ts)', () => { expect(src.get('app/_layout.tsx')).toContain('setAutoSavedNotice('); expect(src.get('app/_layout.tsx')).not.toMatch(/Alert\.alert\(t\('Zapisałem trening'\)/); });
});

describe('S9: słownik terminów', () => {
  const dict = readFileSync(join(ROOT, 'lib/i18n.en.ts'), 'utf8');
  test('brak zakazanych wariantów: „anuluj bieżący trening”, „↺ przywróć” (zamiana), pierwsza osoba („ponowię”, „Ponawiam”)', () => {
    expect(dict).not.toMatch(/anuluj bieżący trening/); expect(dict).not.toMatch(/'↺ przywróć/); expect(dict).not.toMatch(/ponowię|Ponawiam|Zapisałem/);
  });
  test('cofnięcie zamiany: ta sama akcja ma to samo słowo w treningu i w oknie zamiany', () => { expect(src.get('app/swap.tsx')).toContain("'↺ cofnij zamianę: {name}'"); expect(src.get('components/ActiveWorkout.tsx')).toContain("'↺ cofnij'"); });
});

describe('S10: puste stany', () => {
  test('„nie ma takiego …” / „Brak sesji.” zawsze przez <Missing>', () => {
    expect(lines(/t\('(Nie ma takiego (ćwiczenia|miejsca|planu|szablonu)\.|Brak sesji\.|Nie ma treningu w toku\.|Tego ćwiczenia nie da się już zamienić\.)'\)/).filter(x => { const [f, n] = x.split(':'); return /^(app|components)\//.test(f) && !/<Missing>/.test(src.get(f)!.split('\n')[+n - 1]); })).toEqual([]);
  });
  test('pusta lista masy ciała to <Empty>', () => { expect(src.get('app/more/bodymass.tsx')).toMatch(/<Empty>\{t\('Brak pomiarów\.'\)\}<\/Empty>/); });
});

describe('S11: rozwijanie — ▸/▾, stan expanded', () => {
  test('zakaz znaków ⌃ ⌄ ▴ w interfejsie', () => { expect(lines(/[⌃⌄▴]/)).toEqual([]); });
  test('plik z ▸/▾ jako znakiem rozwijania ma accessibilityState expanded (wyjątki: menu „miejsce ▾” z ikoną otwiera arkusz, nie rozwija)', () => {
    const menu = ['components/ActiveWorkout.tsx', 'app/history/edit/[id].tsx'];
    expect(hits(/[▸▾]/, [...menu, 'components/ui.tsx']).filter(f => !/expanded/.test(src.get(f)!))).toEqual([]);
  });
  test('Btn/Item mają wspólną właściwość expanded', () => { expect(src.get('components/ui.tsx')).toMatch(/expanded\?: boolean/); });
});

describe('S12: daty — formatery tylko w lib/state/time.ts, lib/calendar.ts, lib/period.ts', () => {
  test('toLocaleDateString/toLocaleTimeString tylko tam; zakaz month: \'numeric\'', () => {
    expect(lines(/toLocale(Date|Time)String\(/, ['lib/state/time.ts', 'lib/calendar.ts', 'lib/period.ts'])).toEqual([]); expect(lines(/month: 'numeric'/)).toEqual([]);
  });
});

describe('S13: dostępność — język VoiceOver', () => {
  test('każdy <Pressable ma accessibilityLanguage albo accessible={false} (poza ui.tsx — tam komponenty bazowe mają własny test A11-09)', () => {
    const bad: string[] = [];
    for (const [f, s] of src) for (const m of s.matchAll(/<Pressable\b/g)) { let i = m.index! + 8, depth = 0; for (; i < s.length; i++) { const c = s[i]; if (c === '{') depth++; else if (c === '}') depth--; else if (depth === 0 && c === '>') break; }
      const tag = s.slice(m.index!, i + 1); if (!/accessibilityLanguage|accessible=\{false\}|\{\.\.\.[a-z]/.test(tag)) bad.push(`${f}:${s.slice(0, m.index!).split('\n').length}`); }
    expect(bad).toEqual([]);
  });
});

describe('S14: pola dotyku (częściowo — patrz nagłówek pliku)', () => {
  test('zakaz roli „link” (przejścia w aplikacji to „button”; zewnętrzne strony — Btn z podpowiedzią)', () => { expect(lines(/accessibilityRole="link"/)).toEqual([]); });
});

describe('S15: wyszukiwanie — jeden komponent SearchField', () => {
  test('placeholder „Szukaj …” tylko przez SearchField', () => { expect(lines(/placeholder=\{t\('Szukaj/).filter(x => { const [f, n] = x.split(':'); return !/<SearchField/.test(src.get(f)!.split('\n')[+n - 1]); })).toEqual([]); });
  test('SearchField: przycisk czyszczenia, limit 80 znaków', () => { const u = src.get('components/ui.tsx')!; expect(u).toMatch(/export function SearchField/); expect(u).toMatch(/clearButtonMode="while-editing"/); expect(u).toMatch(/maxLength=\{80\}/); });
});

describe('S16: arkusze akcji — najwyżej 4 opcje (z „Anuluj”) albo wyjątek z powodem', () => {
  const EXC: Record<string, string> = {
    'components/ActiveWorkout.tsx': 'dwa arkusze: miejsce treningu (lista miejsc użytkownika — długość zmienna) i rodzaj serii (4 rodzaje + notatka + Anuluj; dwupoziomowy arkusz wydłużyłby najczęstszą akcję treningu)',
    'app/history/edit/[id].tsx': 'jak w treningu: miejsce sesji i rodzaj serii (ta sama lista)',
    'app/template/[id].tsx': 'rodzaj serii szablonu: 4 rodzaje + Anuluj (zamknięty zbiór, bez notatki)',
  };
  test('wszystkie wywołania ActionSheetIOS są na liście wyjątków z powodem (nowe — czerwony test: najwyżej 4 opcje)', () => {
    const files = hits(/ActionSheetIOS\.showActionSheetWithOptions/); expect(files.sort()).toEqual(Object.keys(EXC).sort()); Object.values(EXC).forEach(v => expect(v.length).toBeGreaterThan(20));
  });
});

describe('N1/N28: ekran zakupu', () => {
  test('bez nagłówka H1 powtarzającego tytuł nagłówka; zamknięcie przez useCloseHeader', () => { const s = src.get('app/paywall.tsx')!; expect(s).not.toMatch(/<H1>/); expect(s).toContain('useCloseHeader('); });
});

/* ---------- S17: teksty objaśniające pod ⓘ (docs/32 wzorzec 27; decyzje właściciela 14.10.2026) ---------- */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsc = require('typescript');
type Lit = { file: string; line: number; text: string };
/** Literały t('…')/tr('…') wewnątrz elementów `<Muted>` i atrybutów `detail=` (widoczne teksty pomocnicze) — AST, nie wyrażenie regularne. */
function visibleHelperTexts(): Lit[] {
  const out: Lit[] = [];
  for (const [f, s] of src) {
    if (!/\.tsx$/.test(f)) continue;
    const sf = tsc.createSourceFile(f, s, tsc.ScriptTarget.Latest, true, tsc.ScriptKind.TSX);
    const visit = (n: any) => {
      const hit = (tsc.isJsxElement(n) && n.openingElement.tagName.getText() === 'Muted') || (tsc.isJsxAttribute(n) && n.name.getText() === 'detail');
      if (hit) { const v = (m: any) => { if (tsc.isCallExpression(m) && /^(t|tr)$/.test(m.expression.getText()) && m.arguments[0] && tsc.isStringLiteralLike(m.arguments[0])) out.push({ file: f, line: sf.getLineAndCharacterOfPosition(m.getStart()).line + 1, text: m.arguments[0].text }); tsc.forEachChild(m, v); }; tsc.forEachChild(n, v); }
      tsc.forEachChild(n, visit);
    };
    visit(sf);
  }
  return out;
}
/** Próg długości widocznego tekstu objaśniającego (polskie źródło, bez podstawienia parametrów) — decyzja właściciela 14.10.2026 (P7 A). */
const INFO_MAX_CHARS = 100;
/** Teksty, które zostają na wierzchu mimo długości — tylko z powodem (subskrypcja, zdrowie, utrata danych, błędy, prywatność, pusty stan z działaniem). Klucz = początek tekstu. */
const LONG_OK: Record<string, string> = {
  'Na koniec przerwy telefon wyśle powiadomienie': 'wyjaśnienie przed systemowym oknem zgody na powiadomienia (M1-035): musi być widoczne przed prośbą, nie pod ⓘ',
  'Aplikacja nie udziela porad medycznych.': 'zastrzeżenie zdrowotne (MedicalNote) — zasada właściciela: zdrowie zawsze na wierzchu',
  'Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi': 'ostrzeżenie: zmiana działa wstecz na dane',
  'Nie zapisano jeszcze w Apple Health': 'stan zapisu do Zdrowia (dane, ponowienie) — błąd/stan wymagający uwagi',
  'Czeka na zapis w Apple Health:': 'stan zapisu do Zdrowia (dane, ponowienie) — błąd/stan wymagający uwagi',
  'Brak danych z Apple Health dla tego dnia.': 'pusty stan z działaniem (sprawdź dostęp) — zdrowie',
  'Brak szablonów z ćwiczeniami —': 'pusty stan z działaniem (wskazuje, gdzie utworzyć szablon)',
  'Aplikacja nie zbiera danych:': 'prywatność — oświadczenie, że dane zostają w telefonie (zasada właściciela: prywatność na wierzchu)',
  'Plik nie podaje godzin treningów —': 'ostrzeżenie: dzień z treningiem zostanie pominięty (dane przy imporcie)',
  'Brak zgody na powiadomienia —': 'błąd uprawnień z działaniem (przypomnienia nie przyjdą)',
  '„≥” — w zaplanowanych szablonach': 'legenda znaku „≥” przy liczbie — wyjaśnia widoczną wartość (plan bez ciężaru), nie jest objaśnieniem metody',
  'Zaczynasz od tej wersji —': 'kontekst nowej osoby po aktualizacji („Co nowego”)',
};
describe('S17: ⓘ — jeden komponent, objaśnienia nie wracają na wierzch', () => {
  test('okrąg „i” (przycisk ⓘ) i etykieta VoiceOver „Więcej informacji” tylko w components/InfoTip.tsx; znak U+24D8 nie służy jako ikona', () => {
    expect(lines(/Więcej informacji: \{name\}/, ['components/InfoTip.tsx'])).toEqual([]);
    expect(lines(/>i<\/Text>/, ['components/InfoTip.tsx'])).toEqual([]);
    const glyph: string[] = []; /* znak U+24D8 w tekście interfejsu (literał / tekst JSX) — w komentarzach wolno */
    for (const [f, s] of src) { const sf = tsc.createSourceFile(f, s, tsc.ScriptTarget.Latest, true, /\.tsx$/.test(f) ? tsc.ScriptKind.TSX : tsc.ScriptKind.TS); const v = (n: any) => { if ((tsc.isStringLiteralLike(n) || tsc.isJsxText(n) || tsc.isTemplateHead(n) || tsc.isTemplateMiddle(n) || tsc.isTemplateTail(n)) && n.text.includes('\u24d8')) glyph.push(f); tsc.forEachChild(n, v); }; v(sf); }
    expect(glyph).toEqual([]);
    const tip = src.get('components/InfoTip.tsx')!; expect(tip).toMatch(/hitSlop=\{INFO_HIT_SLOP\}/); expect(tip).toMatch(/accessibilityState=\{\{ expanded: open \}\}/); expect(tip).toMatch(/accessibilityRole="button"/);
  });
  test('SectionTitle / H2 / Field / SwitchRow: parametr `info` obsługuje wspólny komponent (nie osobna implementacja)', () => {
    const u = src.get('components/ui.tsx')!;
    for (const c of ['SectionTitle', 'H2', 'Field', 'SwitchRow']) expect([c, new RegExp(`export function ${c}\\([^)]*info`).test(u) || new RegExp(`export function ${c}\\(\\{[^}]*\\binfo\\b`).test(u)]).toEqual([c, true]);
    expect(u).toContain("from '@/components/InfoTip'");
  });
  test('teksty przeniesione pod ⓘ występują w kodzie tylko jako `info=` (albo w zmiennej używanej wyłącznie jako `info=`)', () => {
    const MOVED: [string, string][] = [
      ['components/ActiveWorkout.tsx', 'Zegar treningu stoi i pauza nie wlicza się do czasu trwania.'], ['components/DeloadHint.tsx', 'Tygodnie treningu z rzędu bez deloadu: {n}.'],
      ['components/DayPanel.tsx', 'Kolejność: najpierw zmiany'], ['components/DayPanel.tsx', 'Uproszczenie: zwykle dzień przerwy'], ['components/DayPanel.tsx', 'Start treningu w tych dniach weźmie to miejsce'],
      ['app/more/settings.tsx', 'Lista: ćwiczenia i serie jak w poprzednich wersjach'], ['app/more/settings.tsx', 'Skupiony: bieżąca seria dużymi cyframi'], ['app/more/settings.tsx', 'Na początku przerwy telefon zapowiada następne ćwiczenie'], ['app/more/settings.tsx', 'Zapowiedzi działają, gdy włączony jest'], /* 19.10.2026: wybór „Zapowiedzi głosowe” zamiast przełącznika */
      ['app/more/settings.tsx', 'RIR — powtórzenia w zapasie'], ['app/more/settings.tsx', 'RIR wpisuje się w zakresie'], ['app/more/settings.tsx', 'Kreska w „Ten tydzień” i w Postępach.'], ['app/more/settings.tsx', 'Timer odlicza w aplikacji'],
      ['app/generator.tsx', 'Propozycja według Twoich założeń'], ['app/generator.tsx', 'Nie masz jeszcze miejsc treningu'], ['app/generator.tsx', 'Cardio poza planem: sesja cardio'], ['app/generator.tsx', 'Cardio w planie: {n} min tygodniowo. Zalecenie WHO'],
      ['app/generator.tsx', 'Siła: bój główny na początku'], ['app/generator.tsx', 'Masa: serie na partię w tygodniu'], ['app/generator.tsx', 'Każda główna partia co najmniej'],
      ['components/OwnPlan.tsx', 'Plan tygodnia z Twoich szablonów według tych samych reguł'], ['components/GuardSection.tsx', 'Kierunek dla partii liczymy tylko'], ['components/GuardSection.tsx', 'Miara: tonaż'], ['components/PeriodSummary.tsx', 'Obok w nawiasie'], ['components/PeriodSummary.tsx', 'Kolor względem partii z największą'], ['app/(tabs)/progress.tsx', 'Partia główna liczy 1 serię, pomocnicza 0,5'], ['app/(tabs)/progress.tsx', 'Objętość serii roboczych'], ['app/progression.tsx', 'Zaplanowane = szablony z planu'], ['components/OwnPlan.tsx', 'Każda główna partia co najmniej'], ['components/OwnPlan.tsx', 'Uproszczenie: zwykle dzień przerwy'], ['app/plan.tsx', 'Plan powtarza się co tydzień.'], ['app/plan.tsx', 'Obowiązuje jeden plan naraz.'],
      ['app/template/[id].tsx', 'Zakres powtórzeń: {r} — gdy ostatnio'], ['app/reorder.tsx', 'Przeciągnij za ≡, żeby zmienić kolejność.'],
      ['app/exercise/[id].tsx', 'Masa ciała: „±” to dociążenie'], ['app/exercise/[id].tsx', 'Przypisanie partii mięśniowych — jedno źródło, nie ustalone.'], ['app/exercise/[id].tsx', 'Przypisanie partii mięśniowych — uproszczenie, nie wynik badań.'],
      ['app/history/add.tsx', 'Trening, którego nie zapisałeś na bieżąco.'], ['app/more/locations.tsx', 'Gdzie trenujesz i jaki sprzęt tam masz. Wybór ćwiczenia'], ['app/more/location/[id].tsx', '★ Miejsce główne — domyślne'],
      ['app/more/bands.tsx', 'Kolor i poziom trudności: 1 = cienka'], ['app/more/bodymass.tsx', 'Opcjonalnie, tylko w telefonie. Z nią aplikacja liczy e1RM'], ['app/more/backup.tsx', 'Eksport tworzy plik JSON'],
      ['app/more/backup.tsx', 'Dopisuje treningi z plików CSV'], ['app/more/backup.tsx', 'Kopia automatyczna: po każdym treningu'], ['app/more/import.tsx', 'Dopisuje treningi z plików CSV'], ['app/more/licenses.tsx', 'Aplikacja korzysta z bibliotek open source.'],
    ];
    const bad: string[] = [];
    for (const [f, start] of MOVED) {
      const s = src.get(f); if (!s) { bad.push(`${f}: brak pliku`); continue; }
      const sf = tsc.createSourceFile(f, s, tsc.ScriptTarget.Latest, true, tsc.ScriptKind.TSX); let seen = 0;
      const inInfo = (n: any): boolean => { for (let p = n.parent; p; p = p.parent) { if (tsc.isJsxAttribute(p) && p.name.getText() === 'info') return true; if (tsc.isVariableDeclaration(p) && ['goalNote', 'basis', 'simplification', 'bwNote', 'note'].includes(p.name.getText())) return true; if (tsc.isFunctionDeclaration(p) || tsc.isSourceFile(p)) return false; } return false; };
      const visit = (n: any) => { if (tsc.isCallExpression(n) && /^(t|tr)$/.test(n.expression.getText()) && n.arguments[0] && tsc.isStringLiteralLike(n.arguments[0]) && n.arguments[0].text.startsWith(start)) { seen++; if (!inInfo(n)) bad.push(`${f}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1} „${start}” poza ⓘ`); } tsc.forEachChild(n, visit); };
      visit(sf); if (!seen) bad.push(`${f}: „${start}” nie występuje (zmieniono tekst? zaktualizuj listę)`);
    }
    expect(bad).toEqual([]);
  });
  test('zmienne pośrednie (goalNote, basis, simplification, bwNote) są używane wyłącznie w `info=`', () => {
    const bad: string[] = [];
    for (const [f, names] of [['app/generator.tsx', ['goalNote', 'basis']], ['components/DayPanel.tsx', ['simplification']], ['app/exercise/[id].tsx', ['bwNote']]] as [string, string[]][]) {
      const sf = tsc.createSourceFile(f, src.get(f)!, tsc.ScriptTarget.Latest, true, tsc.ScriptKind.TSX);
      const visit = (n: any) => { if (tsc.isIdentifier(n) && names.includes(n.text) && !(tsc.isVariableDeclaration(n.parent) && n.parent.name === n)) { let ok = false; for (let p = n.parent; p; p = p.parent) if (tsc.isJsxAttribute(p) && p.name.getText() === 'info') { ok = true; break; } if (!ok) bad.push(`${f}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1} ${n.text}`); } tsc.forEachChild(n, visit); };
      visit(sf);
    }
    expect(bad).toEqual([]);
  });
  test(`lekkość: widoczny tekst pomocniczy (<Muted>, detail) ma najwyżej ${INFO_MAX_CHARS} znaków poza listą z powodem`, () => {
    const long = visibleHelperTexts().filter(x => x.text.length > INFO_MAX_CHARS);
    const bad = long.filter(x => !Object.keys(LONG_OK).some(k => x.text.startsWith(k))).map(x => `${x.file}:${x.line} (${x.text.length}) ${x.text.slice(0, 60)}`);
    expect(bad).toEqual([]);
    Object.values(LONG_OK).forEach(v => expect(v.length).toBeGreaterThan(15));
    const unused = Object.keys(LONG_OK).filter(k => !visibleHelperTexts().some(x => x.text.startsWith(k) && x.text.length > INFO_MAX_CHARS)); expect(unused).toEqual([]); /* wyjątek, który nic nie zwalnia, jest błędem */
  });
  test('instrukcje gestów nie wracają na ekrany (są w Przewodniku): stopki treningu, edytora szablonu i edycji sesji', () => {
    expect(lines(/Tapnij numer serii|Dotknij etykiety serii|Przesuń serię albo nazwę ćwiczenia w lewo/, ['lib/guide.ts'])).toEqual([]);
  });
  test('„Technika ›” to przejście (wzorzec 17), nie ⓘ', () => { const c = src.get('components/ExerciseCues.tsx')!; expect(c).toContain("`${t('Technika')} ›`"); expect(c).not.toMatch(/ⓘ \$\{t\('Technika'\)\}/); });
});
