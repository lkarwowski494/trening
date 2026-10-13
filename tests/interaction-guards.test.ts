/*
 * Strażniki wzorców interakcji (właściciel, 13.10.2026: „akcje tego samego typu działają w całej aplikacji tak samo”; katalog: docs/32-wzorce-interakcji.md).
 * Statyczny skan źródeł app/, components/, lib/ — nowy kod, który łamie wzorzec, robi test czerwonym. Numeracja S1–S16 jak w audycie spójności (docs/32, sekcja „Strażniki”).
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
    expect(src.get('components/DraftHeader.tsx')).toMatch(/minHeight: 44, minWidth: 44/); expect(src.get('components/DraftHeader.tsx')).toMatch(/maxFontSizeMultiplier=\{1\.4\}/);
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
  test('„Asysta gumą” to SwitchRow; tryb generatora i Tydzień/Miesiąc to Segmented; partie mięśni to Chip toggle', () => {
    expect(src.get('app/exercise/[id].tsx')).toMatch(/<SwitchRow label=\{t\('Asysta gumą'\)\}/); expect(src.get('app/exercise/[id].tsx')).not.toMatch(/<Field label=\{t\('Asysta gumą'\)\}>/);
    expect(src.get('app/generator.tsx')).toContain('<Segmented'); expect(src.get('components/PeriodSummary.tsx')).toContain('<Segmented');
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
  test('plik z ▸/▾ jako znakiem rozwijania ma accessibilityState expanded (wyjątki: menu „📍 miejsce ▾” otwiera arkusz, nie rozwija)', () => {
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
