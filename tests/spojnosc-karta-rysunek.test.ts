/*
 * Strażnik spójności karty z rysunkiem (decyzja właściciela 04.11.2026, wariant A, docs/18; audyt /docs/09 „Spójność karta–rysunek”): jeśli reguła rysunku ma zdanie, a rysunek je sprawdza,
 * to karta TEGO ćwiczenia ma to zdanie — inaczej rysunek wymaga czegoś, czego karta nie mówi. Zakres w JEDNYM miejscu: tests/spojnosc-karta-rysunek.json (`rodziny`); ćwiczenia z shownFigureSpec != null.
 * Karta = TREŚĆ karty (karta własna: data/zrodla/cues.json, zestaw ogólny: lib/figures/v2/cue-sets.json), niezależnie od stanu recenzji (recenzja ma własny strażnik: tests/karty-recenzja.test.tsx).
 * Reguła w zakresie: pewność „ustalone” (albo bez pola pewnosc) i niepuste `cue`; zdania reguły = `cue`, `cue_dodatkowe` i zdania z `wskazowki_na_reguly`; w danych reguły
 * `cue_wariant[ćwiczenie] = { cue: id | null, powod }` zastępuje zdanie reguły dla wariantu (id musi być na karcie; null = brak zdania wariantu, powód obowiązkowy).
 * Wyjątki (z powodem): `ogolne_bez_ruchu` (zestaw ogólny z założenia nie ma sekcji „Ruch”, components/ExerciseCues.tsx:34) i `wyjatki` (ćwiczenie → reguła → powód). Wyjątek musi być prawdziwy (zapadka).
 * Rodzaje (docs/20): dane (zakres, liczby), niezmienniki (wyjątek ma powód i jest użyty), regresja (brak luk), macierz (każda rodzina z zakresu).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';
import { CATALOG } from '@/lib/catalog.generated';
import { shownFigureSpec } from '@/lib/figures/v2/figure';

jest.setTimeout(120000);
const ROOT = path.join(__dirname, '..');
type Cfg = { rodziny: string[]; ogolne_bez_ruchu: Record<string, Record<string, string>>; wyjatki: Record<string, Record<string, string>>; };
const CFG: Cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/spojnosc-karta-rysunek.json'), 'utf8'));
type Regula = { id: string; cue?: string | null; cue_dodatkowe?: string[]; pewnosc?: string; cue_wariant?: Record<string, { cue: string | null; powod?: string }> };
type Sec = { c: string }[];
const SETS: { items: Record<string, { b: string; ok?: string[]; err?: string[] }> } = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/cue-sets.json'), 'utf8'));
const FULL: { exercises: Record<string, Record<string, Sec>> } = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/cues.json'), 'utf8'));
const pary = Object.keys(CATALOG).map((k) => ({ k, s: shownFigureSpec(k) })).filter((x) => x.s && CFG.rodziny.includes(x.s.family)).map((x) => ({ k: x.k, family: x.s!.family }));
const PL: Record<string, string> = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/cues/text/pl.json'), 'utf8'));
const SENS = path.join(ROOT, 'scripts/figures/v2-sens.mjs');
const wynik: Record<string, { reguly: Regula[]; wnr: Record<string, string[]> }> = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SENS)};
const p = ${JSON.stringify(pary)}; const o = {}; for (const x of p) { const d = m.wczytajSens().rodziny[x.family]; o[x.k] = { reguly: m.regulyDla(x.family, x.k).map((r) => ({ ...r, cue_wariant: m.wczytajSens().rodziny[x.family].reguly[r.id].cue_wariant })), wnr: d.wskazowki_na_reguly ?? {} }; } console.log(JSON.stringify(o));`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv }));

const ustalone = (r: Regula) => r.pewnosc === undefined || /ustalon/i.test(r.pewnosc);
/** Treść karty ćwiczenia (id zdań) i rodzaj: własna albo ogólna; null = ćwiczenie bez zdań. */
export function kartaTresc(k: string): { ids: Set<string>; ogolna: boolean } {
  const e = SETS.items[k]; const own = FULL.exercises[k];
  if (e?.b === 'own' && own) return { ids: new Set(Object.values(own).flatMap((s) => (Array.isArray(s) ? s.map((x) => x.c) : []))), ogolna: false };
  return { ids: new Set([...(e?.ok ?? []), ...(e?.err ?? [])]), ogolna: e?.b === 'general' };
}
type Wynik = { luki: string[]; uzyteOgolne: Set<string>; uzyteWyjatki: Set<string>; wariantyBledne: string[] };
export function sprawdz(cfg: Cfg = CFG): Wynik {
  const w: Wynik = { luki: [], uzyteOgolne: new Set(), uzyteWyjatki: new Set(), wariantyBledne: [] };
  for (const { k, family } of pary) {
    const { ids: karta, ogolna } = kartaTresc(k); const a = wynik[k];
    for (const r of a.reguly) {
      if (!ustalone(r) || !r.cue) continue;
      const wr = r.cue_wariant?.[k];
      const zdania = [r.cue, ...(r.cue_dodatkowe ?? []), ...Object.entries(a.wnr).filter(([, ids]) => ids.includes(r.id)).map(([c]) => c)];
      if (wr) {
        if (wr.cue === null) { if (!wr.powod) w.wariantyBledne.push(`${k}/${r.id}: cue_wariant null bez powodu`); const ma = zdania.find((c) => karta.has(c)); if (ma) w.wariantyBledne.push(`${k}/${r.id}: cue_wariant null, a karta ma zdanie reguły ${ma} (zapadka — usuń null)`); continue; }
        if (!(wr.cue in PL)) w.wariantyBledne.push(`${k}/${r.id}: cue_wariant ${wr.cue} nie ma tekstu`);
        if (!karta.has(wr.cue)) w.luki.push(`${family} | ${k} | ${r.id} | brak ${wr.cue} (cue_wariant)`);
        continue;
      }
      if (zdania.some((c) => karta.has(c))) continue;
      if (cfg.wyjatki[k]?.[r.id]) { w.uzyteWyjatki.add(`${k}/${r.id}`); continue; }
      if (ogolna && cfg.ogolne_bez_ruchu[family]?.[r.id]) { w.uzyteOgolne.add(`${family}/${r.id}`); continue; }
      w.luki.push(`${family} | ${k} | ${r.id} | brak ${r.cue}`);
    }
  }
  return w;
}

describe('spójność karty z rysunkiem (decyzja 04.11.2026, A)', () => {
  const w = sprawdz();
  test('dane: zakres to 5 rodzin gotowych; każda ma wyświetlane ćwiczenia (132) i reguły', () => {
    expect(CFG.rodziny).toEqual(['squat', 'bench_press', 'hinge', 'curl', 'pull_up']);
    const n = Object.fromEntries(CFG.rodziny.map((f) => [f, pary.filter((p) => p.family === f).length]));
    expect(n).toEqual({ squat: 25, bench_press: 30, hinge: 32, curl: 34, pull_up: 11 });
    expect(pary).toHaveLength(132);
  });
  test('regresja: żadna reguła rysunku ze zdaniem nie ma luki na karcie wariantu (brak = dopisz zdanie, cue_wariant albo wyjątek z powodem)', () => { expect(w.luki).toEqual([]); });
  test('niezmiennik: wyjątki mają powód, są prawdziwe (użyte) i dotyczą wyświetlanych ćwiczeń; cue_wariant null ma powód', () => {
    expect(w.wariantyBledne).toEqual([]);
    for (const [cw, reg] of Object.entries(CFG.wyjatki)) { expect([cw, pary.some((p) => p.k === cw)]).toEqual([cw, true]); for (const [id, powod] of Object.entries(reg)) expect([cw, id, powod.length > 15, w.uzyteWyjatki.has(`${cw}/${id}`)]).toEqual([cw, id, true, true]); }
    for (const [f, reg] of Object.entries(CFG.ogolne_bez_ruchu)) for (const [id, powod] of Object.entries(reg)) expect([f, id, powod.length > 15, w.uzyteOgolne.has(`${f}/${id}`)]).toEqual([f, id, true, true]);
  });
  test('dane: klucze cue_wariant wskazują wyświetlane ćwiczenie z zakresu i regułę, która do niego należy (wpis martwy czerwieni)', () => {
    const sens = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')) as { rodziny: Record<string, { reguly: Record<string, { cue_wariant?: Record<string, unknown> }> }> };
    const zle: string[] = [];
    for (const f of CFG.rodziny) for (const [id, r] of Object.entries(sens.rodziny[f].reguly)) for (const k of Object.keys(r.cue_wariant ?? {})) {
      if (!pary.some((p) => p.k === k && p.family === f)) zle.push(`${f}/${id}: ${k} nie jest wyświetlanym ćwiczeniem tej rodziny`);
      else if (!wynik[k].reguly.some((x) => x.id === id)) zle.push(`${f}/${id}: reguła nie dotyczy ćwiczenia ${k}`);
    }
    expect(zle).toEqual([]);
  });
  test('negatyw cue_wariant: id spoza karty daje lukę, null bez powodu błąd, null przy zdaniu reguły na karcie błąd (zapadka)', () => {
    const k = 'Dead Hang'; const reg = wynik[k].reguly.find((r) => r.id === 'rece_proste_caly_ruch')!; const bak = reg.cue_wariant;
    try {
      reg.cue_wariant = { [k]: { cue: 'bd.level' } }; expect(sprawdz().luki.some((l) => l.includes(`${k} | rece_proste_caly_ruch | brak bd.level (cue_wariant)`))).toBe(true);
      reg.cue_wariant = { [k]: { cue: null } }; expect(sprawdz().wariantyBledne.some((l) => l.includes('null bez powodu'))).toBe(true);
      reg.cue_wariant = { [k]: { cue: null, powod: 'symulacja' } }; expect(sprawdz().wariantyBledne.some((l) => l.includes('zapadka'))).toBe(false);
      const e = SETS.items[k]; const b2 = [...(e.ok ?? [])]; e.ok = [...b2, 'npu.hang'];
      try { reg.cue_wariant = { [k]: { cue: null, powod: 'symulacja' } }; expect(sprawdz().wariantyBledne.some((l) => l.includes('zapadka'))).toBe(true); } finally { e.ok = b2; }
    } finally { reg.cue_wariant = bak; }
  });
  test('strażnik wykrywa lukę: zestaw bez zdania reguły (symulacja — zdanie usunięte z karty) daje wynik niepusty, wyjątek z powodem ją zamyka', () => {
    const e = SETS.items['Band Squat']; const bak = [...(e.ok ?? [])]; e.ok = bak.filter((x) => x !== 'sq.down');
    try {
      const bez = sprawdz(); expect(bez.luki.some((l) => /Band Squat \| zejscie_biodra_i_kolana/.test(l))).toBe(true);
      const z = sprawdz({ ...CFG, wyjatki: { ...CFG.wyjatki, 'Band Squat': { zejscie_biodra_i_kolana: 'symulacja testu: wyjątek zamyka lukę' } } }); expect(z.luki.some((l) => /Band Squat/.test(l))).toBe(false);
    } finally { e.ok = bak; }
  });
});
