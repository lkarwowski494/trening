// Podsumowanie testów mutacyjnych z wielu zadań (nightly.yml, zadanie „mutacje-podsumowanie”; decyzja właściciela 25.10.2026, docs/18):
// każdy moduł z `mutate` w stryker.config.json ma własne zadanie i raport (artefakt mutacje-N/report.json). Tu: wynik na moduł i dla całości,
// moduły bez raportu oraz próg `break` ze stryker.config.json dla CAŁOŚCI (kod wyjścia 1 poniżej progu albo bez żadnego raportu).
// 02.11.2026 (analiza nocy 41347718181): moduł dzielony na zakresy wierszy (`plan:1-130`, `state/migrate:101-200`) — raporty zakresów wpadają do jednego pliku, więc brak raportu
// JEDNEGO zakresu był niewidoczny (zielone na częściowych danych). Teraz: każdy zakres z listy `modul:` w nightly.yml musi mieć w raportach choć jednego mutanta
// z linii z tego zakresu (location.start.line), inaczej „Brak raportu zakresów” i kod 1.
// Użycie: node scripts/ci/mutacje-podsumowanie.mjs <katalog z raportami> [stryker.config.json] [nightly.yml]   (Markdown na stdout)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

export function znajdzRaporty(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap(n => { const p = join(dir, n); return statSync(p).isDirectory() ? znajdzRaporty(p) : n === 'report.json' ? [p] : []; });
}

const DETEKCJA = ['Killed', 'Timeout'];
const WSZYSTKIE = ['Killed', 'Timeout', 'Survived', 'NoCoverage'];

/** Zakresy wierszy z listy `modul: [...]` w nightly.yml: [{ plik: 'lib/plan.ts', od, do }] (wpisy bez zakresu pomija). */
export function zakresyZWorkflow(tekst) {
  const lista = /modul:\s*\[([^\]]+)\]/.exec(tekst)?.[1] ?? '';
  return lista.split(',').map(x => x.trim().replace(/['"]/g, '')).filter(x => /:\d+-\d+$/.test(x))
    .map(x => { const [m, r] = x.split(':'); const [od, d] = r.split('-').map(Number); return { plik: `lib/${m}.ts`, od, do: d }; });
}

/** raporty: obiekty report.json Strykera; oczekiwane: lista modułów (ścieżki z `mutate`); prog: break albo null; zakresy: z zakresyZWorkflow (opcjonalne). */
export function podsumuj(raporty, oczekiwane, prog, zakresy = []) {
  const wynik = new Map(); const linie = new Map();
  for (const r of raporty) for (const [plik, f] of Object.entries(r.files ?? {})) {
    const c = wynik.get(plik) ?? {};
    for (const m of f.mutants ?? []) { c[m.status] = (c[m.status] ?? 0) + 1; const l = m.location?.start?.line; if (l != null) linie.set(plik, [...(linie.get(plik) ?? []), l]); }
    wynik.set(plik, c);
  }
  const brakujaceZakresy = zakresy.filter(z => !(linie.get(z.plik) ?? []).some(l => l >= z.od && l <= z.do)).map(z => `${z.plik}:${z.od}-${z.do}`);
  const licz = c => { const det = DETEKCJA.reduce((a, k) => a + (c[k] ?? 0), 0); const all = WSZYSTKIE.reduce((a, k) => a + (c[k] ?? 0), 0); return { det, all, proc: all ? 100 * det / all : null }; };
  const wiersze = [...wynik].sort(([a], [b]) => a.localeCompare(b)).map(([plik, c]) => ({ plik, ...licz(c) }));
  const razem = licz(Object.fromEntries(WSZYSTKIE.map(k => [k, [...wynik.values()].reduce((a, c) => a + (c[k] ?? 0), 0)])));
  const brakujace = oczekiwane.filter(m => !wynik.has(m));
  const ponizej = prog != null && razem.proc != null && razem.proc < prog;
  return { wiersze, razem, brakujace, ponizej, ok: wynik.size > 0 && !ponizej && brakujace.length === 0 && brakujaceZakresy.length === 0, brakujaceZakresy };
}

export function tresc(p, prog) {
  const L = ['## Testy mutacyjne (wszystkie moduły)', ''];
  if (!p.wiersze.length) return [...L, 'Brak raportów — zadania modułów nie zapisały wyniku.'].join('\n');
  L.push('| Moduł | Wykryte | Wszystkie | % |', '|---|---|---|---|');
  for (const w of p.wiersze) L.push(`| ${w.plik} | ${w.det} | ${w.all} | ${w.proc == null ? '—' : w.proc.toFixed(1)} |`);
  L.push('', `Razem: ${p.razem.det} z ${p.razem.all} (${p.razem.proc == null ? '—' : p.razem.proc.toFixed(1)}%)${prog != null ? `; próg break: ${prog}%` : ''}.`);
  if (p.brakujace.length) L.push('', `Brak raportu modułów: ${p.brakujace.join(', ')} (zadanie padło albo zostało przerwane).`);
  if (p.brakujaceZakresy?.length) L.push('', `Brak raportu zakresów: ${p.brakujaceZakresy.join(', ')} (zadanie zakresu padło albo zostało przerwane — wynik modułu jest niepełny).`);
  if (p.ponizej) L.push('', `Wynik poniżej progu ${prog}%.`);
  return L.join('\n');
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const [dir = 'raporty', cfg = 'stryker.config.json', wf] = process.argv.slice(2);
  const conf = JSON.parse(readFileSync(cfg, 'utf8')); const prog = conf.thresholds?.break ?? null;
  const raporty = znajdzRaporty(dir).map(p => JSON.parse(readFileSync(p, 'utf8')));
  const p = podsumuj(raporty, conf.mutate ?? [], prog, wf && existsSync(wf) ? zakresyZWorkflow(readFileSync(wf, 'utf8')) : []);
  console.log(tresc(p, prog));
  process.exit(p.ok ? 0 : 1);
}
