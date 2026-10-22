// porownanie.mjs — porównanie modeli monetyzacji (rola 02, rozszerzenie rachunek.mjs o mieszankę planów i powtórne płatności).
// node porownanie.mjs porownanie.json   · kod wyjścia: 0 wynik, 1 błędne dane, 2 złe wywołanie
// Jednostka: jedna roczna kohorta pobrań w horyzoncie 24 mies. ≈ wpływ roczny w stanie ustalonym (stałe pobrania, płatności kohorty ≤ 24 mies.).
// Wzory:
//   płacący = pobrania × (1 − kara_ocen) × start_proby × konwersja_po_probie  +  pobrania × (1 − kara_ocen) × zakup_bez_proby
//   wpływ na płacącego = Σ_plan udział × wplyw_netto(plan) × płatności(plan)
//   płatności(okres o długości L mies., prawdopodobieństwo kolejnej płatności r) = Σ_{k=0}^{n−1} r^k, n = floor(24 / L) (dożywotni: 1)
//   wplyw_netto = cena / (1 + podatek_efektywny) × (1 − prowizja)
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HORYZONT = 24;
const ul = (x) => typeof x === 'number' && x >= 0 && x <= 1;

export function sprawdz(d) {
  const b = [];
  if (!/\d{4}-\d{2}-\d{2}/.test(d?.data ?? '')) b.push('data');
  for (const k of ['prowizja', 'podatek_efektywny']) if (!ul(d?.[k]?.stawka) || !d?.[k]?.zrodlo) b.push(`${k}: stawka 0–1 i źródło`);
  for (const [s, p] of Object.entries(d?.pobrania_rocznie ?? {})) if (!(p?.wartosc > 0) || !p?.zrodlo) b.push(`pobrania_rocznie.${s}`);
  for (const [m, M] of Object.entries(d?.modele ?? {})) {
    for (const [pl, P] of Object.entries(M.plany ?? {})) {
      if (!(P.cena > 0) || !(P.miesiace > 0 || P.miesiace === null)) b.push(`${m}.${pl}: cena > 0, miesiace > 0 albo null (dożywotni)`);
    }
    for (const [s, S] of Object.entries(M.scenariusze ?? {})) {
      if (!d.pobrania_rocznie?.[s]) b.push(`${m}.${s}: nieznany scenariusz`);
      for (const k of ['kara_ocen', 'start_proby', 'konwersja_po_probie', 'zakup_bez_proby']) if (!ul(S[k]?.w)) b.push(`${m}.${s}.${k}: ułamek`);
      for (const k of Object.keys(S)) if (!S[k]?.zrodlo) b.push(`${m}.${s}.${k}: brak źródła/metody`);
      const suma = Object.keys(M.plany).reduce((a, pl) => a + (S.udzial?.w?.[pl] ?? 0), 0);
      if (Math.abs(suma - 1) > 1e-6) b.push(`${m}.${s}.udzial: suma ${suma} ≠ 1`);
      for (const pl of Object.keys(M.plany)) if (M.plany[pl].miesiace && !ul(S.kolejna?.w?.[pl])) b.push(`${m}.${s}.kolejna.${pl}: ułamek`);
    }
  }
  return b;
}

const platnosci = (L, r) => { if (L === null) return 1; const n = Math.floor(HORYZONT / L); let s = 0; for (let k = 0; k < n; k++) s += r ** k; return s; };

export function policz(d, m, s, nadpisz = {}) {
  const M = d.modele[m]; const S = { ...M.scenariusze[s] };
  const w = (k) => (k in nadpisz ? nadpisz[k] : S[k].w);
  const netto = (c) => (c / (1 + d.podatek_efektywny.stawka)) * (1 - d.prowizja.stawka);
  let naPlacacego = 0;
  for (const [pl, P] of Object.entries(M.plany)) naPlacacego += S.udzial.w[pl] * netto(P.cena) * platnosci(P.miesiace, P.miesiace ? w('kolejna')[pl] : 0);
  const pob = (nadpisz.pobrania ?? d.pobrania_rocznie[s].wartosc) * (1 - w('kara_ocen'));
  const placacy = pob * w('start_proby') * w('konwersja_po_probie') + pob * w('zakup_bez_proby');
  return { placacy, naPlacacego, wplyw: placacy * naPlacacego };
}

const f = (x, n = 0) => x.toFixed(n).replace('.', ',');

export function raport(d) {
  const l = [`Porównanie modeli (${d.data}); prowizja ${f(d.prowizja.stawka * 100)}%; podatek efektywny ${f(d.podatek_efektywny.stawka * 100)}%; horyzont kohorty ${HORYZONT} mies.`];
  const scen = Object.keys(d.pobrania_rocznie);
  l.push(`| model | ${scen.map((s) => `${s}: płacący · USD/płac. · USD/rok`).join(' | ')} |`);
  l.push(`|---|${scen.map(() => '---').join('|')}|`);
  for (const m of Object.keys(d.modele)) l.push(`| ${m} | ${scen.map((s) => { const r = policz(d, m, s); return `${f(r.placacy)} · ${f(r.naPlacacego, 2)} · **${f(r.wplyw)}**`; }).join(' | ')} |`);
  l.push('', 'Wrażliwość (scenariusz normalny, jedna wielkość ×0,75 i ×1,25):');
  for (const m of Object.keys(d.modele)) {
    const S = d.modele[m].scenariusze.normalny; const baza = policz(d, m, 'normalny').wplyw;
    const parts = [];
    for (const k of ['start_proby', 'konwersja_po_probie', 'zakup_bez_proby', 'kara_ocen']) {
      if (!S[k].w) continue;
      const lo = policz(d, m, 'normalny', { [k]: Math.min(1, S[k].w * 0.75) }).wplyw, hi = policz(d, m, 'normalny', { [k]: Math.min(1, S[k].w * 1.25) }).wplyw;
      parts.push(`${k} ${f(lo)}–${f(hi)}`);
    }
    const kol = S.kolejna?.w; if (kol && Object.keys(kol).length) {
      const sc = (x) => Object.fromEntries(Object.entries(kol).map(([a, v]) => [a, Math.min(1, v * x)]));
      parts.push(`kolejna ${f(policz(d, m, 'normalny', { kolejna: sc(0.75) }).wplyw)}–${f(policz(d, m, 'normalny', { kolejna: sc(1.25) }).wplyw)}`);
    }
    l.push(`- ${m} (baza ${f(baza)}): ${parts.join('; ')}`);
  }
  l.push('', 'Przybliżenie z danych wejściowych ([OCENA] z metodą w pliku danych), nie prognoza; bez podatku dochodowego.');
  return l.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [plik] = process.argv.slice(2);
  if (!plik) { console.error('Użycie: node porownanie.mjs dane.json'); process.exit(2); }
  let d; try { d = JSON.parse(readFileSync(plik, 'utf8')); } catch (e) { console.error(`BŁĄD: ${e.message}`); process.exit(1); }
  const b = sprawdz(d); if (b.length) { b.forEach((x) => console.error(`BŁĄD ${x}`)); process.exit(1); }
  console.log(raport(d));
}
