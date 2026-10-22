// limit-dni.mjs — ilu pobierających zapłaci w modelu „darmowe do N dni treningowych w miesiącu” (rola 02, badanie 22.10.2026).
// node limit-dni.mjs limit-dni.json   · kod wyjścia: 0 wynik, 1 błędne dane, 2 złe wywołanie
// Metoda: aktywny użytkownik ma tygodniową częstotliwość f (rozkład [OCENA]); dni treningowe w miesiącu ~ Dwumian(dni dostępne, f/7).
// Pierwszy miesiąc jest niepełny (instalacja w losowym dniu). W każdym miesiącu, w którym jest aktywny (retencja [OCENA]) i chce
// trenować więcej niż N dni, trafia na blokadę; przy każdej blokadzie kupuje z p-stwem c. Wynik: płacący / pobranie dla każdego N.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ul = (x) => typeof x === 'number' && x >= 0 && x <= 1;
function binomOver(n, p, k) { // P(X > k), X ~ Bin(n, p)
  let c = 1, s = 0; const q = 1 - p;
  for (let i = 0; i <= n; i++) { if (i > 0) c = (c * (n - i + 1)) / i; if (i > k) s += c * p ** i * q ** (n - i); }
  return s;
}
export function sprawdz(d) {
  const b = [];
  const suma = (d?.czestosc?.w ?? []).reduce((a, x) => a + x.udzial, 0);
  if (Math.abs(suma - 1) > 1e-6) b.push('czestosc: udziały sumują się do ' + suma);
  for (const k of ['czestosc', 'retencja', 'aktywacja', 'kupno_przy_blokadzie']) if (!d?.[k]?.zrodlo) b.push(`${k}: brak źródła/metody`);
  for (const s of Object.values(d?.aktywacja?.w ?? {})) if (!ul(s)) b.push('aktywacja: ułamek');
  for (const s of Object.values(d?.kupno_przy_blokadzie?.w ?? {})) if (!ul(s)) b.push('kupno_przy_blokadzie: ułamek');
  if (!Array.isArray(d?.limity) || !d.limity.length) b.push('limity: lista N');
  return b;
}
export function placacyNaPobranie(d, scen, N) {
  const act = d.aktywacja.w[scen], c = d.kupno_przy_blokadzie.w[scen], ret = d.retencja.w[scen];
  let wynik = 0;
  for (const { na_tydzien: f, udzial } of d.czestosc.w) {
    const p = Math.min(1, f / 7); let niezaplacil = 1;
    for (let m = 0; m < 24; m++) {
      const aktywny = ret[Math.min(m, ret.length - 1)] * (m >= ret.length ? (d.retencja.dalej ?? 1) ** (m - ret.length + 1) : 1);
      let hit;
      if (m === 0) { hit = 0; for (let start = 0; start < 30; start++) hit += binomOver(30 - start, p, N) / 30; } else hit = binomOver(30, p, N);
      const kupuje = niezaplacil * aktywny * hit * c; wynik += udzial * kupuje; niezaplacil -= aktywny * hit * c * niezaplacil;
    }
  }
  return act * wynik;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [plik] = process.argv.slice(2);
  if (!plik) { console.error('Użycie: node limit-dni.mjs dane.json'); process.exit(2); }
  let d; try { d = JSON.parse(readFileSync(plik, 'utf8')); } catch (e) { console.error(`BŁĄD: ${e.message}`); process.exit(1); }
  const b = sprawdz(d); if (b.length) { b.forEach((x) => console.error(`BŁĄD ${x}`)); process.exit(1); }
  const scen = Object.keys(d.aktywacja.w);
  console.log(`Model limitu dni (${d.data}); płacący na 100 pobrań (24 mies.)`);
  console.log(`| N dni/mies. | ${scen.join(' | ')} | odsetek aktywnych, którzy w 1. pełnym miesiącu trafią na blokadę |`);
  console.log(`|---|${scen.map(() => '---').join('|')}|---|`);
  for (const N of d.limity) {
    const hit1 = d.czestosc.w.reduce((a, x) => a + x.udzial * binomOver(30, Math.min(1, x.na_tydzien / 7), N), 0);
    console.log(`| ${N} | ${scen.map((s) => (placacyNaPobranie(d, s, N) * 100).toFixed(2).replace('.', ',')).join(' | ')} | ${(hit1 * 100).toFixed(0)}% |`);
  }
}
