/*
 * Słownik terminów treningowych (decyzja właściciela 25.10.2026, docs/lokalizacja/slownik-terminow.md): strażnik.
 * Powód: native speaker z Brazylii zauważył, że etykieta przerwy w karcie ćwiczenia („Descanso de trabalho”) brzmi jak przerwa w pracy;
 * analogiczne kalki („Pracovní pauza”, „休憩”, „減量” = odchudzanie, „intervalo de repetições”) siedziały w 10+ językach. Rodzaje (docs/20): dane (struktura słownika),
 * logika (wykrywanie i naruszenia), języki (każdy tekst UI i wskazówek techniki z pojęciem ze słownika nie używa terminu zakazanego), regresja (przypadki z audytu).
 */
import * as fs from 'fs';
import * as path from 'path';
import { LANGS, type Lang } from '@/lib/i18n';
import { LOCALES } from '@/lib/locales';
import { cueDict } from '@/lib/cues';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const S = require('../scripts/i18n/slownik.cjs');

type Zak = { wzorzec: string; powod: string };
type Wpis = { zalecany: string; zakazane?: Zak[]; pewnosc: string; uwaga?: string };
type Pojecie = { id: string; pl: string; tylko?: string[]; znaczenie: string; kanon: string | null; wykrywaj: string; wyklucz?: string; jezyki: Record<string, Wpis> };
type Slownik = { pojecia: Pojecie[] };
type Wyjatek = { pl: string; jezyki: string[] | '*'; pojecie: string; powod: string };

const root = path.join(__dirname, '..');
const slownik: Slownik = S.wczytaj(root);
const wyjatki: Wyjatek[] = JSON.parse(fs.readFileSync(path.join(root, 'docs/lokalizacja/slownik-wyjatki.json'), 'utf8')).wyjatki;
const source: { pl: string; en: string }[] = JSON.parse(fs.readFileSync(path.join(root, 'lib/locales/_source.json'), 'utf8'));
const cuesPl: Record<string, string> = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/text/pl.json'), 'utf8'));
const enOf = Object.fromEntries(source.map(s => [s.pl, s.en]));

describe('słownik terminów: struktura (dane)', () => {
  test('jest co najmniej 40 pojęć, identyfikatory unikalne, wyrażenia poprawne', () => {
    expect(slownik.pojecia.length).toBeGreaterThanOrEqual(40);
    expect(new Set(slownik.pojecia.map(p => p.id)).size).toBe(slownik.pojecia.length);
    for (const p of slownik.pojecia) {
      expect(() => new RegExp(p.wykrywaj, 'iu')).not.toThrow();
      if (p.wyklucz) expect(() => new RegExp(p.wyklucz!, 'iu')).not.toThrow();
      expect(p.znaczenie.length).toBeGreaterThan(10);
    }
  });
  test.each(LANGS as readonly string[])('%s: każde pojęcie ma termin zalecany i poprawne wpisy zakazane z powodem', (kod) => {
    for (const p of slownik.pojecia) {
      if (p.tylko && !p.tylko.includes(kod)) continue; /* 101-15: pojęcie z listą „tylko” dotyczy wskazanych języków (np. termin marketingowy ms, angielskie nazwy ćwiczeń w el) */
      const e = p.jezyki[kod];
      expect([p.id, !!e]).toEqual([p.id, true]);
      expect(e.zalecany.trim().length).toBeGreaterThan(0);
      expect(['wysoka', 'srednia', 'niska']).toContain(e.pewnosc);
      if (e.pewnosc === 'niska') expect([p.id, kod, !!e.uwaga]).toEqual([p.id, kod, true]); /* wątpliwość ma opis dla native speakera */
      for (const z of e.zakazane ?? []) { expect(() => new RegExp(z.wzorzec, 'iu')).not.toThrow(); expect(z.powod.length).toBeGreaterThan(10); }
    }
  });
  test('pojęcie z listą „tylko”: wpisy dokładnie dla wskazanych języków, kody istnieją', () => {
    for (const p of slownik.pojecia.filter(x => x.tylko)) {
      expect([p.id, Object.keys(p.jezyki).sort()]).toEqual([p.id, [...p.tylko!].sort()]);
      for (const k of p.tylko!) expect([p.id, k, (LANGS as readonly string[]).includes(k)]).toEqual([p.id, k, true]);
    }
  });
  test('termin zalecany występuje w tłumaczeniu klucza kanonicznego (słownik i słowniki UI nie rozjeżdżają się)', () => {
    const bad: string[] = [];
    for (const kod of LANGS) {
      if (kod === 'pl' || kod === 'en') continue;
      const d = LOCALES[kod as Lang] as Record<string, string>;
      for (const p of slownik.pojecia) {
        if (!p.kanon || !p.jezyki[kod]) continue;
        const t = (d[p.kanon] ?? '').toLowerCase(); const z = p.jezyki[kod].zalecany.toLowerCase();
        if (!t.includes(z)) bad.push(`${kod}/${p.id}: „${p.jezyki[kod].zalecany}” nie ma w „${d[p.kanon]}”`);
      }
    }
    expect(bad).toEqual([]);
  });
  test('wyjątki: każdy ma powód, istniejące pojęcie i istniejący tekst; nie ma martwych', () => {
    for (const w of wyjatki) {
      expect(w.powod.length).toBeGreaterThan(10);
      expect(slownik.pojecia.some(p => p.id === w.pojecie)).toBe(true);
      expect(source.some(s => s.pl === w.pl) || w.pl in cuesPl || Object.values(cuesPl).includes(w.pl)).toBe(true);
    }
  });
});

describe('słownik terminów: dokument', () => {
  test('docs/lokalizacja/slownik-terminow.md jest wygenerowany z JSON (UPDATE_I18N=1 przegenerowuje)', () => {
    const f = path.join(root, 'docs/lokalizacja/slownik-terminow.md'); const want: string = S.dokument(slownik);
    if (process.env.UPDATE_I18N) fs.writeFileSync(f, want);
    expect(fs.readFileSync(f, 'utf8')).toBe(want);
  });
});

describe('słownik terminów: logika (wykrywanie i naruszenia)', () => {
  const p = (id: string) => slownik.pojecia.find(x => x.id === id)!;
  test('wykrywanie pojęć w polskim tekście', () => {
    expect(S.wykryte(p('przerwa'), 'Domyślna przerwa (s)')).toBe(true);
    expect(S.wykryte(p('przerwa'), 'Zwykle lepiej z dniem przerwy')).toBe(false); /* dzień wolny, nie przerwa między seriami */
    expect(S.wykryte(p('przerwa'), 'Import przerwany')).toBe(false);
    expect(S.wykryte(p('przerwa_robocza'), 'Przerwa robocza (s)')).toBe(true);
    expect(S.wykryte(p('seria'), 'Seria zrobiona')).toBe(true);
    expect(S.wykryte(p('seria'), 'Seria')).toBe(true);
    expect(S.wykryte(p('dzien_wolny'), 'Wolne ciężary')).toBe(false);
    expect(S.wykryte(p('zakres_powtorzen'), 'Usuń zakres powtórzeń')).toBe(true);
    expect(S.wykryte(p('zakres_powtorzen'), 'Zakres dat: {a} – {b}')).toBe(false);
  });
  test('naruszenia: przypadki z audytu 25.10.2026 są wykrywane (regresja)', () => {
    expect(S.sprawdz(slownik, 'pt', 'Przerwa robocza', 'Descanso de trabalho').length).toBe(1);
    expect(S.sprawdz(slownik, 'pt-BR', '+ zakres powtórzeń', '+ intervalo de repetições').length).toBe(1);
    expect(S.sprawdz(slownik, 'pt-BR', '+ zakres powtórzeń', '+ faixa de repetições')).toEqual([]);
    expect(S.sprawdz(slownik, 'ja', 'Przerwa', '休憩').length).toBe(1);
    expect(S.sprawdz(slownik, 'ja', 'Przerwa', 'インターバル')).toEqual([]);
    expect(S.sprawdz(slownik, 'cs', 'Przerwa robocza', 'Pracovní pauza').length).toBe(1);
    expect(S.sprawdz(slownik, 'zh-Hant', 'Deload', '減量').length).toBe(1);
    expect(S.sprawdz(slownik, 'zh-Hant', 'Deload', '減載')).toEqual([]);
    expect(S.sprawdz(slownik, 'de', 'Seria', 'Serie').length).toBe(1);
    expect(S.sprawdz(slownik, 'de', 'Seria', 'Satz')).toEqual([]);
    /* 1.0.1, recenzja lokalizacji: „łokcie szeroko na boki” (wyciskanie) — ja: 開く, nie 広げる; fr: trop écartés, nie très écartés */
    const lok = 'Łokcie ustaw pośrodku — ani przyklejone do tułowia, ani szeroko na boki.';
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'lokcie_otwarte'), lok)).toBe(true);
    expect(S.sprawdz(slownik, 'ja', lok, '肘を広げすぎず').length).toBe(1); expect(S.sprawdz(slownik, 'ja', lok, '肘は開きすぎず')).toEqual([]);
    expect(S.sprawdz(slownik, 'fr', lok, 'ni très écartés').length).toBe(1); expect(S.sprawdz(slownik, 'fr', lok, 'ni trop écartés')).toEqual([]);
    /* 1.0.1, recenzja lokalizacji (r2): „łokcie wąsko” — es/pt: cerrados/fechados, nie „juntos” (= stykają się); ja: 締める, nie 狭く */
    const wsk = 'Łokcie wąsko przez cały ruch: przy wyciskaniu blisko tułowia.';
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'lokcie_waskie'), wsk)).toBe(true);
    expect(S.sprawdz(slownik, 'es', wsk, 'Mantén los codos juntos').length).toBe(1); expect(S.sprawdz(slownik, 'es', wsk, 'Mantén los codos cerrados')).toEqual([]);
    expect(S.sprawdz(slownik, 'pt-BR', wsk, 'Mantenha os cotovelos juntos').length).toBe(1); expect(S.sprawdz(slownik, 'pt', wsk, 'Mantém os cotovelos fechados')).toEqual([]);
    /* 1.0.1, recenzja lokalizacji (29.10.2026): podpis środkowych klatek „Pozycja pośrednia {n}” — nie słowo statusu (ru „В процессе”, id/ms „Sedang berjalan”, vi „Đang diễn ra”, zh „進行中”) */
    const poz = 'Pozycja pośrednia {n}';
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'pozycja_posrednia'), poz)).toBe(true);
    for (const [k, zle, ok] of [['ru', 'В процессе {n}', 'Промежуточное положение {n}'], ['id', 'Sedang berjalan {n}', 'Posisi tengah {n}'], ['ms', 'Sedang berjalan {n}', 'Kedudukan tengah {n}'], ['vi', 'Đang diễn ra {n}', 'Tư thế giữa {n}'], ['zh-Hant', '進行中 {n}', '中間姿勢 {n}']] as const) {
      expect([k, S.sprawdz(slownik, k, poz, zle).length]).toEqual([k, 1]); expect(S.sprawdz(slownik, k, poz, ok)).toEqual([]);
    }
    /* decyzja właściciela 29.10.2026: środkowa klatka przy trzech pozycjach to „Pozycja pośrednia” bez numeru (zamiast „W trakcie”) — ta sama forma co z numerem */
    const poz0 = 'Pozycja pośrednia';
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'pozycja_posrednia'), poz0)).toBe(true);
    for (const [k, zle, ok] of [['ru', 'В процессе', 'Промежуточное положение'], ['id', 'Sedang berjalan', 'Posisi tengah'], ['ms', 'Sedang berjalan', 'Kedudukan tengah'], ['vi', 'Đang diễn ra', 'Tư thế giữa'], ['zh-Hant', '進行中', '中間姿勢']] as const) {
      expect([k, S.sprawdz(slownik, k, poz0, zle).length]).toEqual([k, 1]); expect(S.sprawdz(slownik, k, poz0, ok)).toEqual([]);
    }
    expect(S.sprawdz(slownik, 'ja', wsk, '肘を狭く保ちます').length).toBe(1); expect(S.sprawdz(slownik, 'ja', wsk, '肘を締めておきます')).toEqual([]);
  });
  /* 09.11.2026, recenzja lokalizacji przekładu A1–A3 (lokalna lekcja): przekład API wstawił do vi dosłownie „upper arm” (placeholder słownika) — preacher.arms, rotator_cuff.cubanRotate;
     test słownika tego nie łapał (brak zakazu, a wykrywanie pomijało „ramiona”). Zakaz we wszystkich językach poza pl/en; „grip” w vi zostaje do odpowiedzi native speakera (pytanie 2 w docs/research/recenzje/lok-a1-a3-przeklad-2026-11-09.md). */
  test('09.11.2026: ramię — „upper arm” zakazane we wszystkich językach poza en; „ramiona” wykrywane; kettlebell.de wielką literą', () => {
    const ra = slownik.pojecia.find(x => x.id === 'ramie')!;
    expect(S.wykryte(ra, 'Obróć przedramiona w górę — ramiona zostają poziomo.')).toBe(true);
    expect(S.wykryte(ra, 'Oprzyj ramię na podpórce.')).toBe(true);
    for (const kod of LANGS as readonly string[]) {
      if (kod === 'pl' || kod === 'en') continue;
      expect([kod, S.sprawdz(slownik, kod, 'Oprzyj ramię na podpórce.', 'Rest your upper arm on the pad.').some((n: { pojecie: string }) => n.pojecie === 'ramie')]).toEqual([kod, true]);
      expect([kod, S.sprawdz(slownik, kod, 'Oprzyj ramię na podpórce.', ra.jezyki[kod].zalecany).some((n: { pojecie: string }) => n.pojecie === 'ramie')]).toEqual([kod, false]);
    }
    expect(S.sprawdz(slownik, 'vi', 'Obróć przedramiona w górę — ramiona zostają poziomo.', 'upper arm giữ ngang').length).toBe(1);
    expect(S.sprawdz(slownik, 'vi', 'Obróć przedramiona w górę — ramiona zostają poziomo.', 'cánh tay trên giữ ngang')).toEqual([]);
    const vi = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/text/vi.json'), 'utf8')) as Record<string, string>;
    expect([vi['preacher.arms'], vi['rotator_cuff.cubanRotate']].some(x => /upper arm/i.test(x))).toBe(false);
    expect(slownik.pojecia.find(x => x.id === 'kettlebell')!.jezyki.de.zalecany).toBe('Kettlebell');
  });
  /* 101-15 (1.0.1, recenzja lokalizacji ms/el): ms „Lukisan pergerakan” (rysunek) zamiast „Animasi pergerakan” użytego w opisie sklepu; el „κινούμενα σχέδια” = kreskówki; el: angielskie nazwy ćwiczeń */
  test('animacja ruchu: ms „Animasi pergerakan” (nie „Lukisan pergerakan”); el bez „κινούμενα σχέδια” (kreskówki)', () => {
    const rr = 'Rysunek ruchu: {opis}';
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'animacja_ruchu'), rr)).toBe(true);
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'animacja_ruchu'), 'Rysunek schematyczny — pozycje orientacyjne.')).toBe(false);
    expect(S.sprawdz(slownik, 'ms', rr, 'Lukisan pergerakan: {opis}').length).toBe(1); expect(S.sprawdz(slownik, 'ms', rr, 'Animasi pergerakan: {opis}')).toEqual([]);
    expect(S.sprawdz(slownik, 'el', rr, 'Κινούμενα σχέδια: {opis}').length).toBe(1); expect(S.sprawdz(slownik, 'el', rr, 'Σχέδιο της κίνησης: {opis}')).toEqual([]);
    expect(slownik.pojecia.find(x => x.id === 'animacja_ruchu')!.jezyki.ms.zalecany).toBe('Animasi pergerakan');
  });
  test('02.11.2026, pull_up C: „rysunek” w zdaniu pod rysunkiem i „następne powtórzenie” (recenzja lokalizacji)', () => {
    const z = 'Rysunek pokazuje ruch w jedną stronę — w kolejnym powtórzeniu podciągasz się do drugiej dłoni.';
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'rysunek_zdanie'), z)).toBe(true);
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'rysunek_zdanie'), 'Rysunek schematyczny — pozycje orientacyjne.')).toBe(false);
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'nastepne_powtorzenie'), z)).toBe(true);
    expect(S.sprawdz(slownik, 'ja', z, 'イラストは片側だけの動きを示しています。').length).toBe(1);
    expect(S.sprawdz(slownik, 'hu', z, 'Az ábra a mozdulatot mutatja.').length).toBe(1);
    expect(S.sprawdz(slownik, 'lt', z, 'Brėžinyje judesys rodomas.').length).toBe(1);
    expect(S.sprawdz(slownik, 'sv', z, 'Bilden visar rörelsen.').length).toBe(1);
    expect(S.sprawdz(slownik, 'ms', z, 'Lukisan menunjukkan pergerakan.').length).toBe(1);
    expect(S.sprawdz(slownik, 'ko', z, '그림은 보여 줍니다. 다음 횟수에서는 끌어올립니다.').length).toBe(1);
    expect(S.sprawdz(slownik, 'ko', z, '그림은 보여 줍니다. 다음 반복에서는 끌어올립니다.')).toEqual([]);
    expect(S.sprawdz(slownik, 'zh-Hant', z, '圖中只畫出拉向一側的動作 — 下一下改拉向另一隻手。')).toEqual([]);
  });
  /* Kontrola zastępcza 06.11.2026 (docs/18): id „fitur”, ms „ciri” (zakaz „fungsi”, nie łapie „berfungsi”), et „funktsioon”; ko/ja licznik sesji w uwadze pojęcia „trening” */
  test('06.11.2026: funkcja aplikacji — ms „ciri” zamiast „fungsi”; „berfungsi” (działa) dozwolone; licznik sesji ko/ja', () => {
    const fa = slownik.pojecia.find(x => x.id === 'funkcja_aplikacji')!; const z = 'Wszystkie funkcje działają od pierwszego dnia.';
    expect(S.wykryte(fa, z)).toBe(true); expect(S.wykryte(fa, 'Funkcjonalność')).toBe(false);
    expect(S.sprawdz(slownik, 'ms', z, 'Semua fungsi berfungsi').some((n: { pojecie: string }) => n.pojecie === 'funkcja_aplikacji')).toBe(true);
    expect(S.sprawdz(slownik, 'ms', z, 'Semua ciri berfungsi')).toEqual([]);
    expect([fa.jezyki.id.zalecany, fa.jezyki.ms.zalecany, fa.jezyki.et.zalecany]).toEqual(['fitur', 'ciri', 'funktsioon']);
    const tr = slownik.pojecia.find(x => x.id === 'trening')!; expect(tr.jezyki.ko.uwaga).toContain('회차'); expect(tr.jezyki.ja.uwaga).toContain('回目');
  });
  test('el: squat / bench press / deadlift zalecane po angielsku; pojęcia wykrywane w polskim tekście', () => {
    const zal = (id: string) => slownik.pojecia.find(x => x.id === id)!.jezyki.el.zalecany;
    expect([zal('przysiad'), zal('wyciskanie_lezac'), zal('martwy_ciag')]).toEqual(['squat', 'bench press', 'deadlift']);
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'przysiad'), 'Stojaki do przysiadów')).toBe(true);
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'wyciskanie_lezac'), 'wyciskanie leżąc')).toBe(true);
    expect(S.wykryte(slownik.pojecia.find(x => x.id === 'martwy_ciag'), 'wyciskanie, martwy ciąg…')).toBe(true);
    const b: string = S.blokPromptu(slownik, 'el'); expect(b).toContain('→ squat'); expect(b).toContain('→ bench press'); expect(b).toContain('→ deadlift');
    expect(S.blokPromptu(slownik, 'ms')).toContain('Animasi pergerakan'); expect(S.blokPromptu(slownik, 'ms')).not.toContain('→ squat');
  });
  /* Recenzja lokalizacji 09.11.2026: „nachwyt” jako övergrepp / overgreb / overgrep = nadużycie, napaść (fałszywy przyjaciel); poprawnie złożenie z „ręka” */
  test('sv/da/nb: nachwyt = överhandsgrepp / overhåndsgreb / overhåndsgrep (zakazane: övergrepp, overgreb, overgrep, także odmienione)', () => {
    const wzor: Record<string, [string, string[], string]> = {
      sv: ['Greppa stången i övergrepp.', ['övergreppet', 'övergrepp'], 'Greppa stången i överhandsgrepp.'],
      da: ['Tag fat i stangen i overgreb.', ['overgrebet', 'overgreb'], 'Tag fat i stangen i overhåndsgreb.'],
      nb: ['Grip stangen i overgrep.', ['overgrepet', 'overgrep'], 'Grip stangen i overhåndsgrep.'],
    };
    for (const [kod, [zle, formy, dobre]] of Object.entries(wzor)) {
      expect(S.sprawdz(slownik, kod, 'Chwyć sztangę nachwytem.', zle).length).toBe(1);
      for (const f of formy) expect(S.sprawdz(slownik, kod, 'nachwyt', `i ${f}`).length).toBe(1);
      expect(S.sprawdz(slownik, kod, 'Chwyć sztangę nachwytem.', dobre)).toEqual([]);
      const cues = JSON.parse(fs.readFileSync(path.join(root, `lib/cues/text/${kod}.json`), 'utf8')) as Record<string, string>;
      expect(cues['dl.grip']).toMatch(/överhandsgrepp|overhåndsgreb|overhåndsgrep/);
    }
  });
  /* 101-17 (recenzja lokalizacji el, 29.10.2026): ogólne „άρσεις” (podnoszenia) i „πιέσεις πάγκου” zamiast zalecanych angielskich deadlift / bench press */
  test('el: martwy ciąg = deadlift, wyciskanie leżąc = bench press (zakazane: άρσεις, νεκρή άρση, πιέσεις πάγκου); teksty z recenzji poprawione', () => {
    const el = JSON.parse(fs.readFileSync(path.join(root, 'lib/locales/el.json'), 'utf8')) as Record<string, string>;
    expect(S.sprawdz(slownik, 'el', 'wyciskanie, martwy ciąg…', 'κωπηλατική, πιέσεις, άρσεις…').length).toBe(1);
    expect(S.sprawdz(slownik, 'el', 'wyciskanie, martwy ciąg…', 'κωπηλατική, πιέσεις, deadlift…')).toEqual([]);
    expect(S.sprawdz(slownik, 'el', 'wyciskanie leżąc', 'πιέσεις πάγκου').length).toBe(1);
    expect(S.sprawdz(slownik, 'el', 'wyciskanie leżąc', 'bench press')).toEqual([]);
    expect(el['Maszyny dźwigniowe na talerze (wiosłowanie, wyciskanie, martwy ciąg…)']).toContain('deadlift…)');
    expect(el['Maszyny dźwigniowe na talerze (wiosłowanie, wyciskanie, martwy ciąg…)']).not.toContain('άρσεις');
    const k = Object.keys(el).find(x => x.startsWith('Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie:'))!;
    expect(el[k]).toContain('π.χ. bench press:'); expect(el[k]).not.toContain('πάγκου');
  });
  /* Przegląd API 31.10.2026 (krytyczne cs/sk/ro): „Pauza” w linii faz animacji (ExerciseFigureV2.tsx:113) to rzeczownik — zatrzymanie w pozycji —
     a nie przycisk; zakaz „pauz” z pojęcia pauza_treningu wymuszał czasownik (cs Pozastavit, sk Pozastaviť, ro Întrerupe, de Anhalten, et Peata).
     Osobne pojęcie faza_pauza; pauza_treningu wyklucza sam tekst „Pauza”. Plus ro faza „Podciąganie”: nie nazwa ćwiczenia „Tracțiune”. */
  test('31.10.2026: faza animacji „Pauza” odrębna od pauzy treningu i od przerwy (K1); ro „Podciąganie” = „Tragere în sus”', () => {
    const pt = slownik.pojecia.find(x => x.id === 'pauza_treningu')!; const fp = slownik.pojecia.find(x => x.id === 'faza_pauza')!;
    expect(fp).toBeDefined();
    expect(S.wykryte(fp, 'Pauza')).toBe(true); expect(S.wykryte(fp, 'Pauza treningu')).toBe(false);
    expect(S.wykryte(pt, 'Pauza treningu')).toBe(true); /* wzorce bez rozróżniania wielkości liter: „Pauza” (faza) i „pauza” (status zegara) rozdziela wyjątek na dokładny tekst */
    expect(wyjatki.some(w => w.pl === 'pauza' && w.pojecie === 'faza_pauza' && w.jezyki === '*')).toBe(true);
    expect((S.sprawdz(slownik, 'cs', 'pauza', 'pauza') as { pojecie: string }[]).some(n => n.pojecie === 'pauza_treningu')).toBe(true); /* status zegara nadal pod zakazem pauzy treningu */
    for (const [k, zle, ok] of [['cs', 'Pozastavit', 'Výdrž'], ['sk', 'Pozastaviť', 'Výdrž'], ['ro', 'Întrerupe', 'Menținere'], ['de', 'Anhalten', 'Halten'], ['et', 'Peata', 'Hoidmine']] as const) {
      expect([k, (S.sprawdz(slownik, k, 'Pauza', zle) as { pojecie: string }[]).filter(n => n.pojecie === 'faza_pauza').length]).toEqual([k, 1]); expect([k, (S.sprawdz(slownik, k, 'Pauza', ok) as { pojecie: string }[]).filter(n => !wyjatek('Pauza', k, n.pojecie))]).toEqual([k, []]);
      expect([k, (LOCALES[k as Lang] as Record<string, string>)['Pauza']]).toEqual([k, ok]);
    }
    expect(S.sprawdz(slownik, 'cs', 'Pauza treningu', 'Pauza tréninku').length).toBe(1); /* przycisk nadal pilnowany */
    /* K1 (09.10.2026): w cs/sk/ro/et/de „pauza/Pause” to przerwa między seriami — faza nie może jej użyć (wariant zgodny z K1, nie „Pauza” z przeglądu API) */
    for (const [k, rest] of [['cs', 'Pauza'], ['sk', 'Pauza'], ['ro', 'Pauză'], ['de', 'Pause'], ['et', 'Paus']] as const) expect([k, (S.sprawdz(slownik, k, 'Pauza', rest) as { pojecie: string }[]).some(n => n.pojecie === 'faza_pauza')]).toEqual([k, true]);
    expect(S.sprawdz(slownik, 'ro', 'Podciąganie', 'Tracțiune').length).toBe(1); expect(S.sprawdz(slownik, 'ro', 'Podciąganie', 'Tragere în sus')).toEqual([]);
    const ro = LOCALES.ro as Record<string, string>; expect(ro['Podciąganie']).toBe('Tragere în sus');
    expect(S.sprawdz(slownik, 'ro', 'Podciąganie', 'Tracţiune').length).toBe(1); /* recenzja 31.10.2026: także ţ z cedyllą */
  });
  /* Recenzja lokalizacji P2 (moc), 03.11.2026: strażnik nie złapał rozjazdu „wykrok”/„nożyce” dla pozycji split w dwuboju, trzech brzmień pozycji kettlebelli przy barkach,
     trzech form zakresu szerokości stóp, „trunk” zamiast „core” ani kalki „like for a …” w EN. Pojęcia dotyczą PL i EN (pozostałe 33 języki wg przekładu z poprawionej bazy). */
  test('03.11.2026, P2 moc: regresja — „wykrok” dla split, „pozycja rack”, trzy formy szerokości stóp, „trunk” i „like for a” są wykrywane, poprawione brzmienia przechodzą', () => {
    const nazwy = (kod: string, pl: string, tl: string) => (S.sprawdz(slownik, kod, pl, tl) as { pojecie: string }[]).map(n => n.pojecie);
    const wy = 'Ciągnij jak w zwykłym zarzucie, a sztangę przyjmij w wykroku — jedna noga w przód, druga w tył.', noz = 'Ciągnij jak w zwykłym zarzucie, a sztangę przyjmij w nożycach — jedna stopa w przód, druga w tył.';
    expect(nazwy('pl', wy, wy)).toEqual(['nozyce']); expect(nazwy('pl', noz, noz)).toEqual([]);
    expect(nazwy('en', noz, 'Pull like a regular clean, but catch the bar in a lunge.')).toEqual(['nozyce']);
    expect(nazwy('en', noz, 'Pull like a regular clean, but catch the bar in a split — one foot forward, one back.')).toEqual([]);
    for (const zle of ['Kettlebell w pozycji przy barku, łokieć przy tułowiu.', 'Zakończ w pozycji rack przy klatce.']) expect([zle, nazwy('pl', zle, zle)]).toEqual([zle, ['rack_kettlebell']]);
    const rk = 'Kettlebelle oparte przy barkach, łokcie przy tułowiu.'; expect(nazwy('pl', rk, rk)).toEqual([]);
    for (const zle of ['Stopy między szerokością bioder a barków, palce lekko na zewnątrz.', 'Hantle przy barkach, stopy mniej więcej od szerokości bioder do szerokości barków.']) expect([zle, nazwy('pl', zle, zle)]).toEqual([zle, ['szerokosc_stop']]);
    const sz = 'Hantle przy barkach, stopy na szerokość bioder do barków.'; expect(nazwy('pl', sz, sz)).toEqual([]);
    expect(nazwy('en', sz, 'Dumbbells at your shoulders, feet somewhere between hip- and shoulder-width.')).toEqual(['szerokosc_stop']);
    expect(nazwy('en', sz, 'Dumbbells at your shoulders, feet hip- to shoulder-width apart.')).toEqual([]);
    const tul = 'Zanim ugniesz kolana, mocno napnij tułów.'; expect(nazwy('en', tul, 'Brace your trunk hard before you bend your knees.')).toEqual(['core_en']);
    expect(nazwy('en', tul, 'Brace your core hard before you bend your knees.')).toEqual([]);
    const jd = 'Sztanga na górze pleców, jak do przysiadu.'; expect(nazwy('en', jd, 'Bar on your upper back, like for a squat.')).toEqual(['jak_do_en']);
    expect(nazwy('en', jd, 'Bar on your upper back, like a back squat.')).toEqual([]);
  });
  test('03.11.2026, P2 moc: wskazówki PL i EN partii (zdania z tests/fixtures/cues-p2-moc.json) nie łamią terminów nożyce / rack / szerokość stóp / core / „like for a”', () => {
    const enCues = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/text/en.json'), 'utf8')) as Record<string, string>;
    const P2 = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/cues-p2-moc.json'), 'utf8')) as { zdania: string[] };
    expect(P2.zdania.length).toBeGreaterThan(80);
    const bad: string[] = [];
    for (const i of P2.zdania) {
      for (const n of S.sprawdz(slownik, 'pl', cuesPl[i], cuesPl[i]) as { pojecie: string }[]) bad.push(`pl ${i} [${n.pojecie}]`);
      for (const n of S.sprawdz(slownik, 'en', cuesPl[i], enCues[i] ?? '') as { pojecie: string }[]) bad.push(`en ${i} [${n.pojecie}]`);
      if (/(?<![\p{L}])(trunk|lunge)(?![\p{L}])|like\s+for\s+a\b/iu.test(enCues[i])) bad.push(`en ${i} [trunk/lunge/like for a]`);
      if (/^(olympic\.|kbj\.|kbb\.)/.test(i) && /wykrok|pozycj\w*\s+rack/i.test(cuesPl[i])) bad.push(`pl ${i} [wykrok/rack]`);
    }
    expect(bad).toEqual([]);
    expect(cuesPl['olympic.splitCatch']).toContain('nożycach'); expect(cuesPl['olympic.snatchSplitMove']).toContain('nożyce'); expect(cuesPl['olympic.balanceMove']).toContain('nożyc');
    expect(cuesPl['kbj.rack']).toContain('oparte przy barkach'); expect(cuesPl['thruster.kbSetup']).toContain('oparte przy barkach');
  });
  /* Recenzja lokalizacji P1 (mobilność), 02.11.2026: strażnik nie złapał dwóch błędów — „pas” zamiast „taśma” do rozciągania oraz „przenieś ciężar” (masa ciała) przy pojęciu „ciężar” = obciążenie.
     Dochodzą „krążenia” (nie „zataczaj koła”) i „podwijanie miednicy”. Pojęcia dotyczą PL i EN (pozostałe 33 języki wg przekładu z poprawionej bazy). */
  test('02.11.2026, P1 mobilność: regresja — „pas” i „przenieś ciężar” są wykrywane, poprawione brzmienia przechodzą', () => {
    const pas = 'Usiądź i załóż pas lub ręcznik na stopę.', tasma = 'Usiądź i załóż taśmę albo ręcznik na stopę.';
    expect(S.sprawdz(slownik, 'pl', pas, pas).map((n: { pojecie: string }) => n.pojecie)).toEqual(['tasma_rozciaganie']);
    expect(S.sprawdz(slownik, 'pl', tasma, tasma)).toEqual([]);
    expect(S.sprawdz(slownik, 'en', tasma, 'Sit and loop a belt or towel around your foot.').length).toBe(1);
    expect(S.sprawdz(slownik, 'en', tasma, 'Sit and loop a strap or towel around your foot.')).toEqual([]);
    const cw = 'Ugnij przednie kolano i przenieś ciężar w stronę ściany; tylna noga prosta, pięta na podłodze.', cw2 = 'Ugnij przednie kolano i pochyl się do ściany; tylna noga prosta, pięta na podłodze.';
    expect(S.sprawdz(slownik, 'pl', cw, cw).map((n: { pojecie: string }) => n.pojecie)).toEqual(['ciezar']);
    expect(S.sprawdz(slownik, 'pl', cw2, cw2)).toEqual([]);
    expect(S.sprawdz(slownik, 'pl', 'Ciężar ciała na przednią nogę.', 'Ciężar ciała na przednią nogę.').length).toBe(1);
    expect(S.sprawdz(slownik, 'pl', 'Dobierz ciężar tak, by technika się nie zmieniała.', 'Dobierz ciężar tak, by technika się nie zmieniała.')).toEqual([]); /* ciężar = obciążenie — dozwolone */
    expect(S.sprawdz(slownik, 'en', cw, 'Shift your weight toward the wall.').length).toBe(1);
    const kr = 'Zataczaj stopą koła w kostce.'; expect(S.sprawdz(slownik, 'pl', kr, kr).length).toBe(1); expect(S.sprawdz(slownik, 'pl', 'Krąż stopą.', 'Krąż stopą.')).toEqual([]);
    const mi = 'Garbienie się i odchylanie miednicy w tył.'; expect(S.sprawdz(slownik, 'pl', mi, mi).length).toBe(1); expect(S.sprawdz(slownik, 'pl', 'Garbienie się i podwijanie miednicy.', 'Garbienie się i podwijanie miednicy.')).toEqual([]);
    expect(S.sprawdz(slownik, 'en', mi, 'Rounding your back with a posterior pelvic tilt.').length).toBe(1);
  });
  test('02.11.2026, P1 mobilność: wskazówki PL i EN mobilności (mobility_*, foam_roll.*, rotator_cuff.*) nie łamią terminów taśma / krążenia / podwijanie miednicy / ciężar', () => {
    const enCues = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/text/en.json'), 'utf8')) as Record<string, string>;
    const ids = Object.keys(cuesPl).filter(i => /^(mobility_|foam_roll\.|rotator_cuff\.)/.test(i)); expect(ids.length).toBeGreaterThan(70);
    const bad: string[] = [];
    for (const i of ids) {
      for (const n of S.sprawdz(slownik, 'pl', cuesPl[i], cuesPl[i]) as { pojecie: string }[]) bad.push(`pl ${i} [${n.pojecie}]`);
      for (const n of S.sprawdz(slownik, 'en', cuesPl[i], enCues[i] ?? '') as { pojecie: string }[]) bad.push(`en ${i} [${n.pojecie}]`);
    }
    expect(bad).toEqual([]);
    expect(cuesPl['mobility_floor.u.ankleStrap']).toContain('taśm'); expect(enCues['mobility_floor.u.ankleStrap']).toContain('strap');
  });
  test('blok promptu: tylko wpisy języka docelowego, z terminem zalecanym i zakazanym', () => {
    const b: string = S.blokPromptu(slownik, 'ja');
    expect(b).toContain('インターバル'); expect(b).toContain('休憩'); expect(b).toContain('naturalnie');
    expect(b).not.toContain('descanso'); expect(b).not.toContain('faixa');
    expect(S.blokPromptu(slownik, 'xx')).toBe('');
  });
});

/** Tekst polski → tłumaczenie w słowniku UI albo we wskazówkach techniki; sprawdza naruszenia słownika (po odjęciu wyjątków z powodem). */
const wyjatek = (pl: string, kod: string, pojecie: string) => wyjatki.some(w => w.pl === pl && w.pojecie === pojecie && (w.jezyki === '*' || w.jezyki.includes(kod)));
describe.each(LANGS.filter(l => l !== 'pl' && l !== 'en') as Lang[])('słownik terminów: teksty języka %s', (kod) => {
  test('słownik UI nie używa terminów zakazanych dla pojęć obecnych w polskim tekście', () => {
    const d = LOCALES[kod] as Record<string, string>; const bad: string[] = [];
    for (const [pl, tl] of Object.entries(d)) for (const n of S.sprawdz(slownik, kod, pl, tl) as { pojecie: string; wzorzec: string }[]) {
      if (!wyjatek(pl, kod, n.pojecie)) bad.push(`[${n.pojecie}] „${n.wzorzec}” w: ${tl.slice(0, 90)}  ← ${pl.slice(0, 60)}`);
    }
    expect(bad).toEqual([]);
  });
  test('wskazówki techniki nie używają terminów zakazanych', () => {
    const d = cueDict(kod) as Record<string, string>; const bad: string[] = [];
    for (const [id, tl] of Object.entries(d)) for (const n of S.sprawdz(slownik, kod, cuesPl[id] ?? '', tl) as { pojecie: string; wzorzec: string }[]) {
      if (!wyjatek(cuesPl[id], kod, n.pojecie)) bad.push(`[${n.pojecie}] „${n.wzorzec}” w ${id}: ${tl.slice(0, 90)}`);
    }
    expect(bad).toEqual([]);
  });
});

test('słownik UI: angielski (źródło odniesienia) nie używa „break” dla przerwy między seriami', () => {
  const zle = source.filter(s => S.wykryte(slownik.pojecia.find(p => p.id === 'przerwa'), s.pl) && /\bbreak\b/i.test(s.en)).map(s => s.en);
  expect(zle).toEqual([]);
  expect(enOf['Przerwa']).toBe('Rest');
});

describe('04.11.2026, recenzja lokalizacji T1 (delt_raise): uchwyt, nachwyt, uda, kettlebell sr/lt/lv, „Czego unikać” sv/da/nb', () => {
  const nar = (kod: string, pl: string, tl: string) => (S.sprawdz(slownik, kod, pl, tl) as { pojecie: string }[]).map(n => n.pojecie);
  test('uchwyt: pt „punho” i es-419 „maneral” są wykrywane, „pega”/„agarre” przechodzą', () => {
    const pl = 'Chwyć uchwyt dolnego wyciągu i stań prosto.';
    expect(nar('pt', pl, 'Agarra o punho da polia baixa.')).toContain('uchwyt');
    expect(nar('es-419', pl, 'Toma el maneral de la polea baja.')).toContain('uchwyt');
    expect(nar('pt', pl, 'Agarra a pega da polia baixa.')).not.toContain('uchwyt');
    expect(nar('es-419', pl, 'Toma el agarre de la polea baja.')).not.toContain('uchwyt');
  });
  test('nachwyt: ja オーバーハンド, id overhand, bg пронирован są wykrywane; 順手, genggaman atas, прав хват przechodzą', () => {
    const pl = 'Sztangę trzymaj nachwytem przed udami.';
    expect(nar('ja', pl, 'バーベルをオーバーハンドグリップで持ちます。')).toContain('nachwyt');
    expect(nar('id', pl, 'pegang barbel dengan genggaman overhand')).toContain('nachwyt');
    expect(nar('bg', pl, 'дръж щангата с пронирован хват')).toContain('nachwyt');
    expect(nar('ja', pl, 'バーベルを順手で持ちます。')).not.toContain('nachwyt');
    expect(nar('id', pl, 'pegang barbel dengan genggaman atas')).not.toContain('nachwyt');
    expect(nar('bg', pl, 'дръж щангата с прав хват')).not.toContain('nachwyt');
  });
  test('uda ru/uk: „перед ногами”, „біля ніг” są wykrywane, „бёдра”/„стегна” przechodzą', () => {
    const pl = 'Trzymaj ciężar przed udami.';
    expect(nar('ru', pl, 'держи вес перед ногами')).toContain('uda');
    expect(nar('uk', pl, 'тримай вагу перед ногами')).toContain('uda');
    expect(nar('uk', pl, 'ручки біля ніг')).toContain('uda');
    expect(nar('ru', pl, 'держи вес перед бёдрами')).not.toContain('uda');
    expect(nar('uk', pl, 'тримай вагу перед стегнами')).not.toContain('uda');
  });
  test('kettlebell: sr łacinką jest wykrywany, „кетлбел” przechodzi; lt i lv mają zapisaną odmianę', () => {
    expect(nar('sr', 'Trzymaj kettlebell przed klatką.', 'Држи kettlebell испред груди.')).toContain('kettlebell');
    expect(nar('sr', 'Trzymaj kettlebell przed klatką.', 'Држи кетлбел испред груди.')).not.toContain('kettlebell');
    const kb = slownik.pojecia.find(p => p.id === 'kettlebell')!;
    expect(kb.jezyki.lt.uwaga).toContain("kettlebell'ą");
    expect(kb.jezyki.lv.uwaga).toContain('kettlebellu');
  });
  test('reguła stylu: „Czego unikać” (8 zdań z czasownikiem) w sv/da/nb zaczyna się od „Att”/„At”/„Å” + bezokolicznik', () => {
    /* zdania „Czego unikać” z czasownikiem (karty delt_raise); rzeczownikowe (np. sq.mis.heels) zostają bez zmian */
    const KLUCZE_ATT = ['delt1.mis.arch', 'fidr.mis.back', 'fro.mis.arch', 'inc1.mis.shrug', 'isr.mis.press', 'rdelt.mis.swing', 'rear1.mis.high', 'yr.mis.chest'];
    const poczatek: Record<string, RegExp> = { sv: /^Att /, da: /^At /, nb: /^Å / };
    for (const [kod, re] of Object.entries(poczatek)) {
      const d = cueDict(kod as Lang) as Record<string, string>;
      const zle = KLUCZE_ATT.filter(id => !re.test(d[id])).map(id => `${kod}/${id}: ${d[id]}`);
      expect(zle).toEqual([]);
    }
  });
  test('adr.move: sv „Växelvis:”, da „Skiftevis:” (nie rozkaz „Växla:”/„Skift:”)', () => {
    expect(cueDict('sv' as Lang)['adr.move']).toMatch(/^Växelvis:/);
    expect(cueDict('da' as Lang)['adr.move']).toMatch(/^Skiftevis:/);
  });
  /* Recenzja lokalizacji T1b (triceps), 05.11.2026: ławka skośna głową w dół — nowe pojęcie; uchwyt (cs rukojeť, es agarre, nl handgreep) — sztanga sl/ro bez zmiany (decyzja koordynatora 05.11.2026: interfejs ma „palica”/„halteră”; ujednolicenie kart i UI → backlog) */
  test('05.11.2026: ławka skośna głową w dół (decline bench): wykrywanie, tr i ru nie mogą użyć samej „ławki skośnej”; terminy uchwytu i sztangi z recenzji T1b', () => {
    const lw = slownik.pojecia.find(x => x.id === 'lawka_skosna_glowa_w_dol')!; const pl = 'Połóż się na ławce skośnej głową w dół i trzymaj hantle nad sobą na prostych rękach.';
    expect(S.wykryte(lw, pl)).toBe(true); expect(S.wykryte(lw, 'Połóż się na ławce skośnej i trzymaj hantle nad sobą.')).toBe(false); /* ławka głową w górę (incline) to inne pojęcie */
    expect(Object.keys(lw.jezyki).sort()).toEqual([...LANGS].sort());
    expect(S.sprawdz(slownik, 'tr', pl, 'Eğimli sehpaya uzanın.').length).toBe(1); expect(S.sprawdz(slownik, 'tr', pl, 'Ters eğimli sehpaya uzanın.')).toEqual([]);
    expect(S.sprawdz(slownik, 'ru', pl, 'Ляг на наклонную скамью головой вниз.').length).toBe(1); expect(S.sprawdz(slownik, 'ru', pl, 'Ляг на скамью с обратным наклоном, головой вниз.')).toEqual([]);
    for (const k of ['skullDbDec', 'skullDec']) for (const kod of LANGS.filter(l => l !== 'pl' && l !== 'en' && l !== 'ru')) { /* ru: odmiana (скамью), pilnuje wzorzec zakazany */
      const t = (cueDict(kod as Lang) as Record<string, string>)[`tri.${k}.setup`]; const z = lw.jezyki[kod].zalecany.split(',')[0];
      if (lw.jezyki[kod].pewnosc !== 'niska') expect([kod, k, t.toLowerCase().includes(z.toLowerCase())]).toEqual([kod, k, true]);
    }
    const zal = (id: string, k: string) => slownik.pojecia.find(x => x.id === id)!.jezyki[k].zalecany;
    expect([zal('uchwyt', 'cs'), zal('uchwyt', 'es'), zal('uchwyt', 'nl'), zal('sztanga', 'sl'), zal('sztanga', 'ro')]).toEqual(['rukojeť', 'agarre', 'handgreep', 'palica', 'halteră']);
  });
});

/* Recenzja lokalizacji A4a (core i moc), 09.11.2026: es/pt-BR/zh-Hant zmieniły termin pozycji pompki w obrębie jednej karty (plancha / prancha / 撐體),
   ja „上のケーブル” zamiast „ハイケーブル”, piłka gimnastyczna rozjeżdżała się między interfejsem a kartami (rozszerzenie pojęcia o ja, ko, it, es, es-419). Zakaz pozycji pompki działa tylko przy polskim
   „podpór jak do pompki”, więc nie dotyka kart plank (deska na przedramionach). */
describe('09.11.2026, recenzja lokalizacji A4a: pozycja pompki, górny wyciąg ja, piłka gimnastyczna', () => {
  const nar = (kod: string, pl: string, tl: string) => (S.sprawdz(slownik, kod, pl, tl) as { pojecie: string }[]).map(n => n.pojecie);
  test('pozycja pompki: es plancha, pt-BR prancha, zh-Hant 撐體 są wykrywane; flexión/flexão/伏地挺身姿勢 przechodzą; plank (deska) nie jest dotknięty', () => {
    const pl = 'Przyciągnij kolana pod tułów, potem wyprostuj nogi z powrotem do podporu.', pl2 = 'Włóż stopy w uchwyty taśm i wejdź w podpór jak do pompki.';
    expect(nar('es', pl2, 'ponte en la plancha')).toContain('pozycja_pompki'); expect(nar('es', pl2, 'ponte en posición de flexión')).not.toContain('pozycja_pompki');
    expect(nar('pt-BR', pl, 'de volta à posição de prancha')).toContain('pozycja_pompki'); expect(nar('pt-BR', pl, 'de volta à posição de flexão')).not.toContain('pozycja_pompki');
    expect(nar('zh-Hant', pl, '回到撐體姿勢')).toContain('pozycja_pompki'); expect(nar('zh-Hant', pl, '回到伏地挺身姿勢')).not.toContain('pozycja_pompki');
    const plank = 'Oprzyj się na przedramionach, ciało w jednej linii.'; expect(nar('es', plank, 'Apóyate en los antebrazos en plancha')).toEqual([]); expect(nar('pt-BR', plank, 'Apoie-se em prancha')).toEqual([]);
  });
  test('górny wyciąg ja: „上のケーブル” jest wykrywane, „ハイケーブル” przechodzi', () => {
    const pl = 'Załóż linę na górny wyciąg, uklęknij i trzymaj końce liny przy głowie.';
    expect(nar('ja', pl, '上のケーブルにロープを取り付け')).toContain('wyciag_gorny'); expect(nar('ja', pl, 'ハイケーブルにロープを取り付け')).not.toContain('wyciag_gorny');
  });
  test('piłka gimnastyczna: nazwa sprzętu z interfejsu jest też zalecana w kartach (ja, ko, it, es, es-419); wskazówki 09.11.2026 (ja ハイケーブル, zh-Hant 伏地挺身姿勢) w słowniku wskazówek', () => {
    const zal = (k: string) => slownik.pojecia.find(x => x.id === 'pilka_gimnastyczna')!.jezyki[k].zalecany;
    expect(['ja', 'ko', 'it', 'es', 'es-419'].map(zal)).toEqual(['バランスボール', '짐볼', 'fitball', 'fitball', 'pelota de estabilidad']);
    for (const k of ['ja', 'ko', 'it', 'es', 'es-419']) expect([k, (LOCALES[k as Lang] as Record<string, string>)['piłka gimnastyczna'].toLowerCase()]).toEqual([k, zal(k).toLowerCase()]);
    expect(cueDict('ja' as Lang)['core_floor.ccSetup']).toContain('ハイケーブル'); expect(cueDict('zh-Hant' as Lang)['core_floor.suspRevCrunch.move']).toContain('伏地挺身姿勢');
  });
});

/* 09.11.2026, recenzja lokalizacji B2 (figury nóg), decyzja właściciela 09.11.2026 (lekcja L-123 nachwyt, wariant A): lista fałszywych przyjaciół w słowniku */
describe('09.11.2026, recenzja lokalizacji B2: pozycja wykroczna hu/nl, przodostopie sv, slidery ms/ro', () => {
  const nazwy = (kod: string, pl: string, tl: string) => (S.sprawdz(slownik, kod, pl, tl) as { pojecie: string }[]).map(n => n.pojecie);
  const spl = 'Stań w wykroku: jedna stopa z przodu, druga z tyłu, oparta na palcach.', sl = 'Połóż się na plecach, kolana ugięte, pięty na ślizgaczach.';
  test('wykrok: hu „terpesz”, nl „spreidstand” (rozkrok na boki) są wykrywane; kitöréses/lunge-houding przechodzą', () => {
    expect(nazwy('hu', spl, 'Állj terpeszállásba: egyik lábad elöl, a másik hátul.')).toEqual(['wykrok_postawa']);
    expect(nazwy('nl', spl, 'Ga in spreidstand staan: één voet voor, de andere achter je.')).toEqual(['wykrok_postawa']);
    expect(nazwy('hu', spl, 'Állj kitöréses állásba: egyik lábad elöl, a másik hátul.')).toEqual([]);
    expect(nazwy('nl', spl, 'Ga in een lunge-houding staan: één voet voor, de andere achter je.')).toEqual([]);
    expect(nazwy('hu', 'Stopy szeroko, w pozycji sumo.', 'Terpeszállás, sumo.')).toEqual([]); /* terpesz jest poprawny dla szerokiej postawy */
  });
  test('przodostopie sv: „fotblad” jest wykrywany, „trampdyna”/„på tå” przechodzą', () => {
    expect(nazwy('sv', spl, 'Stå i utfallsställning, den andra bak på fotbladet.')).toEqual(['przodostopie']);
    expect(nazwy('sv', spl, 'Stå i utfallsställning, den andra bak på tå.')).toEqual([]);
  });
  test('slidery: ms „pelungsur” (zjeżdżalnia), ro „glisoare” (część techniczna) są wykrywane', () => {
    expect(nazwy('ms', sl, 'tumit di atas pelungsur.')).toEqual(['slidery']);
    expect(nazwy('ro', sl, 'și călcâiele pe glisoare.')).toEqual(['slidery']);
    expect(nazwy('ms', sl, 'tumit di atas slider.')).toEqual([]); expect(nazwy('ro', sl, 'și călcâiele pe discurile de alunecare.')).toEqual([]);
  });
  test('teksty B2 (split.setup, slcurl.*) w hu/nl/sv/ms/ro nie zawierają zakazanych słów', () => {
    for (const [kod, re] of [['hu', /terpesz/i], ['nl', /spreidstand/i], ['sv', /fotblad/i], ['ms', /pelungsur/i], ['ro', /glisoar/i]] as const)
      for (const id of ['split.setup', 'slcurl.setup', 'slcurl.move']) expect([kod, id, re.test((cueDict(kod) as Record<string, string>)[id])]).toEqual([kod, id, false]);
  });
});
