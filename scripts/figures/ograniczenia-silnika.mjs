// Przybliżenia póz, które powołują się na ograniczenie silnika albo kontraktu (recenzja ruchu r2, L4, 28.10.2026).
// Luka: uzasadnienie „model stopy nie ma palców do tyłu” przeżyło zmianę silnika (podbicie 91–270°, b07c7ed7) i opisywało nieistniejące ograniczenie.
// Mechanizm: każde przybliżenie ze słowem model/kontrakt/silnik ma wpis w data/zrodla/figury-ograniczenia-silnika.json; wpis jest przejrzany przy bieżącym odcisku schematu kontraktu
// (zmiana schematu = test czerwony, aż wpis zostanie przejrzany) albo jawnie „do_przegladu” z powodem.
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PLIK_OGRANICZEN = 'data/zrodla/figury-ograniczenia-silnika.json';
/** Przybliżenie „powołuje się na ograniczenie silnika”, gdy zawiera któreś z tych słów (nie: „niemodelowane”, „modelować”). */
export const WZORZEC_OGRANICZENIA = /\b(model|modelu|kontrakt|kontraktu|silnik|silnika)\b/i;
/** Odcisk schematu kontraktu (12 znaków SHA-256 z `schematRepo()`): zmienia się, gdy zmieni się zakres, opis albo pole kontraktu. */
export const odciskKontraktu = (schemat) => createHash('sha256').update(schemat).digest('hex').slice(0, 12);
/** Przybliżenia z ograniczeniem w generatorach rodzin: ['rodzina|ćwiczenie', …]. */
export async function znajdzPrzyblizeniaZOgraniczeniem(dir = join(ROOT, 'scripts/figures/agent-pozy')) {
  const out = [];
  for (const f of readdirSync(dir).sort()) {
    if (!f.endsWith('.mjs') || /^(run|run-dyn|dbg|dyn)/.test(f)) continue; let m; try { m = await import(pathToFileURL(join(dir, f)).href); } catch { continue; }
    for (const [cw, t] of Object.entries(m.PRZYBLIZENIA ?? {})) if (WZORZEC_OGRANICZENIA.test(String(t))) out.push(`${f.replace('.mjs', '')}|${cw}`);
  }
  return out;
}
/** Lista problemów rejestru (pusta = zgodny): brakujące i zbędne wpisy, wpis przejrzany przy innym odcisku, „do_przegladu” bez powodu. */
export function sprawdzRejestrOgraniczen({ rejestr, znalezione, odcisk }) {
  const o = []; const wpisy = rejestr.wpisy ?? []; const klucz = (w) => `${w.rodzina}|${w.cwiczenie}`; const maRej = new Set(wpisy.map(klucz));
  for (const k of znalezione) if (!maRej.has(k)) o.push(`przybliżenie „${k}” powołuje się na model/kontrakt/silnik, a nie ma wpisu w ${PLIK_OGRANICZEN}`);
  for (const w of wpisy) {
    if (!znalezione.includes(klucz(w))) o.push(`wpis „${klucz(w)}” w ${PLIK_OGRANICZEN} nie ma już odpowiadającego przybliżenia z ograniczeniem (usuń wpis)`);
    if (String(w.ograniczenie ?? '').trim().length < 10) o.push(`wpis „${klucz(w)}” bez opisu ograniczenia`);
    if (w.status === 'do_przegladu') { if (String(w.powod ?? '').trim().length < 20) o.push(`wpis „${klucz(w)}” jest do_przegladu bez powodu (≥ 20 znaków)`); }
    else if (w.przejrzane_przy !== odcisk) o.push(`wpis „${klucz(w)}” przejrzany przy schemacie kontraktu ${w.przejrzane_przy ?? '—'}, a bieżący to ${odcisk} — kontrakt silnika się zmienił: sprawdź, czy ograniczenie nadal istnieje, i zapisz nowy odcisk (albo status do_przegladu z powodem)`);
  }
  return o;
}
export const wczytajRejestrOgraniczen = (root = ROOT) => JSON.parse(readFileSync(join(root, PLIK_OGRANICZEN), 'utf8'));
