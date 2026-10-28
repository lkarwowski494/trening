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
type Pojecie = { id: string; pl: string; znaczenie: string; kanon: string | null; wykrywaj: string; wyklucz?: string; jezyki: Record<string, Wpis> };
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
      const e = p.jezyki[kod];
      expect([p.id, !!e]).toEqual([p.id, true]);
      expect(e.zalecany.trim().length).toBeGreaterThan(0);
      expect(['wysoka', 'srednia', 'niska']).toContain(e.pewnosc);
      if (e.pewnosc === 'niska') expect([p.id, kod, !!e.uwaga]).toEqual([p.id, kod, true]); /* wątpliwość ma opis dla native speakera */
      for (const z of e.zakazane ?? []) { expect(() => new RegExp(z.wzorzec, 'iu')).not.toThrow(); expect(z.powod.length).toBeGreaterThan(10); }
    }
  });
  test('termin zalecany występuje w tłumaczeniu klucza kanonicznego (słownik i słowniki UI nie rozjeżdżają się)', () => {
    const bad: string[] = [];
    for (const kod of LANGS) {
      if (kod === 'pl' || kod === 'en') continue;
      const d = LOCALES[kod as Lang] as Record<string, string>;
      for (const p of slownik.pojecia) {
        if (!p.kanon) continue;
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
    expect(S.sprawdz(slownik, 'ja', wsk, '肘を狭く保ちます').length).toBe(1); expect(S.sprawdz(slownik, 'ja', wsk, '肘を締めておきます')).toEqual([]);
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
