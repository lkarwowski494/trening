/*
 * Figury v2 — wskazówki techniki przypisane do ćwiczeń przez zestawy na wzorzec ruchu (badacz merytoryczny, 25.10.2026), NIE przez mapę z makiety
 * (jej mapa dawała błędne twierdzenia). Dane: cue-sets.json — dla każdego z 709 ćwiczeń tryb (own / general / open) i identyfikatory wskazówek (ok = zalecenia,
 * err = częste błędy). Teksty i źródła wskazówek: lib/cues (istniejące id w lib/cues/text/pl.json) oraz słownik badacza (newIds — wdroży tłumacz).
 *
 * Decyzja właściciela 25.10.2026 (wariant A): wskazówki wzorca pokazujemy także przy ćwiczeniach-analogiach, z dopiskiem „Ogólne wskazówki dla tego ruchu”;
 * przy ćwiczeniach opisanych w źródłach wprost (own = lib/cues/data.json, 102 ćwiczenia) dopisku nie ma; open = grafika bez tekstu wskazówek (brak 2 zgodnych źródeł).
 * Sposób pokazywania to przełącznik w danych: CUE_POLICY (A = ogólne z dopiskiem; B = tylko ćwiczenia ze źródłami).
 * Strażnik: wskazówka przypisana ćwiczeniu nie przeczy jego ruchowi — CUE_REQUIRES (poniżej) wiąże wskazówki z cechami wariantu rysunku (tests/figures-v2-cues.test.ts).
 */
import { t } from '@/lib/i18n';
import type { Variant } from './variants';
import { assignAll, type Family, type FamilyId } from './families';

type CueSetData = { meta: { newIds: string[] }; items: Record<string, { b: 'own' | 'general' | 'open'; f?: string; ok?: string[]; err?: string[] }> };
export const CUE_SETS: CueSetData = require('./cue-sets.json');

export type CuePolicy = 'A' | 'B';
/** Decyzja właściciela 25.10.2026: wariant A. */
export const CUE_POLICY: CuePolicy = 'A';

export type CueMode = 'own' | 'general' | 'none';
export type CueSelection = { mode: CueMode; family?: string; ok: string[]; err: string[] };

/** Co pokazać przy ćwiczeniu: własne wskazówki (bez dopisku), zestaw ogólny (z dopiskiem) albo nic. */
export function cueSelection(key: string, policy: CuePolicy = CUE_POLICY): CueSelection {
  const e = Object.prototype.hasOwnProperty.call(CUE_SETS.items, key) ? CUE_SETS.items[key] : undefined;
  if (!e || e.b === 'open') return { mode: 'none', ok: [], err: [] };
  if (e.b === 'own') return { mode: 'own', ok: [], err: [] };
  if (policy === 'B') return { mode: 'none', ok: [], err: [] };
  return { mode: 'general', family: e.f, ok: e.ok ?? [], err: e.err ?? [] };
}

/** Dopisek przy zestawie ogólnym (tylko tryb general). */
export const generalCueNote = (sel: CueSelection): string | null => sel.mode === 'general' ? t('Ogólne wskazówki dla tego ruchu') : null;

/**
 * Warunki: wskazówka wolno przypisać tylko ćwiczeniu, którego wariant rysunku spełnia predykat (ruch nie przeczy zdaniu). Rozszerzać przy kolejnych rodzinach.
 * Wpisy: id wskazówki → predykat na wariancie. Id bez wpisu = bez ograniczeń w tym stopniu (sprawdza je przegląd merytoryczny).
 */
/** ACG-001 (audyt ćwiczeń 31.10.2026): zdania, które przeczą kierunkowi ruchu całej rodziny — nie trafiają do żadnego jej ćwiczenia (rodziny bez wariantów rysunku, więc nie przez CUE_REQUIRES).
 * Strażnik: tests/figures-v2-cues.test.tsx „ACG-001”. */
export const CUE_NOT_IN_FAMILY: Record<string, { why: string; families: FamilyId[] }> = {
  'lpd.fullStretch': { why: '„na górze wyprostuj ręce” opisuje ściąganie drążka z góry; w podciąganiu na górze łokcie są zgięte, ręce proste na dole (pu.partial)', families: ['pull_up'] },
};
export const CUE_REQUIRES: Record<string, { why: string; ok: (v: Variant) => boolean }> = {
  'dl.lift': { why: 'ciężar zaczyna na podłodze (lub kołkach) i idzie w górę', ok: v => v.family === 'hinge' && v.p.style === 'floor' },
  'dl.close': { why: 'gryf przy nogach — ciężar w rękach przed udami na jednym gryfie', ok: v => v.family === 'hinge' && v.p.style === 'floor' && (v.p.impl === 'barbell' || v.p.impl === 'smith') },
  'tb.lift': { why: 'uchwyty po bokach ciała', ok: v => v.family === 'hinge' && v.p.impl === 'trapbar' },
  'sumo.kneesOut': { why: 'szeroki rozstaw stóp', ok: v => v.family === 'hinge' && v.p.stance >= 30 },
  'rdl.move': { why: 'start stojąc, ciężar na prostych rękach', ok: v => v.family === 'hinge' && (v.p.style === 'rdl' || v.p.style === 'singleLeg' || v.p.style === 'pullThrough') },
  'rdl.knees': { why: 'kolana prawie proste', ok: v => v.family === 'hinge' && v.p.style === 'rdl' },
  'rdl.depth': { why: 'zawias stojąc', ok: v => v.family === 'hinge' && (v.p.style === 'rdl' || v.p.style === 'singleLeg' || v.p.style === 'pullThrough') },
  'gm.move': { why: 'sztanga na plecach, zawias', ok: v => v.family === 'hinge' && v.p.style === 'goodMorning' },
  'bp.contact': { why: 'głowa, łopatki i biodra na ławce, stopy na podłodze (nie na podłodze zamiast ławki, nie na wałkach)', ok: v => v.family === 'bench_press' && !v.p.floor && v.p.angle >= 0 },
  'jm.elbows': { why: 'JM Press: łokcie wysoko, ramię ku stopom (rysunek liczy łokieć z kątów)', ok: v => v.family === 'bench_press' && !!v.p.jm },
  'dcgsk.elbows': { why: 'dwie fazy: wąskie wyciskanie i prostowanie z nieruchomym ramieniem', ok: v => v.family === 'bench_press' && !!v.p.skull },
  'sq.kneesToes': { why: 'obie stopy na podłodze, kolana w linii palców', ok: v => v.family === 'squat' && !v.p.wall },
  'sq.mis.heels': { why: 'stopa płasko na podłodze', ok: v => v.family === 'squat' && !v.p.wall },
  'sq.mis.kneesIn': { why: 'obie nogi pracują symetrycznie', ok: v => v.family === 'squat' },
};

/**
 * Strażnik kompletności tekstów (recenzja treści 1.1, 27.10.2026, S1): rodzina o statusie `ready` nie może używać identyfikatora wskazówki, który nie ma tekstu w PL i EN
 * (karta pomijałaby go po cichu albo pokazała surowe id). Zwraca listę „ćwiczenie: id (pl|en)”; pusta = komplet. `families` i słowniki są parametrami (test z fixture).
 */
export function cueTextGaps(families: Pick<Family, 'id' | 'status'>[], pl: Record<string, string>, en: Record<string, string>, assign: Record<string, string> = assignAll()): string[] {
  const ready = new Set(families.filter(f => f.status === 'ready').map(f => f.id as string)); const out: string[] = [];
  const has = (d: Record<string, string>, id: string) => Object.prototype.hasOwnProperty.call(d, id) && d[id].trim().length > 0;
  for (const [k, fam] of Object.entries(assign)) {
    if (!ready.has(fam)) continue;
    const sel = cueSelection(k);
    for (const id of [...sel.ok, ...sel.err]) for (const [lang, d] of [['pl', pl], ['en', en]] as const) if (!has(d, id)) out.push(`${k}: ${id} (${lang})`);
  }
  return out;
}
