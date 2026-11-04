// Dobór linii odniesienia, elementów nakładki i póz błędów po kartach ćwiczeń rodziny v2 — składnik skrótu recenzji rodziny (fix4 R2, 04.11.2026; recenzja niezależna różnicy elementów, znalezisko R2).
// Powód: rysunek ćwiczenia zależy od TEGO, CO WYBIERAJĄ wskazówki karty (guidesOf, techniquesOf, errorsOf: ui.ts), a dane wskazówek (lib/figures/v2/cue-sets.json, lib/cues/data.json)
// są poza skrótem (V2_POZA_SKROTEM) — scalenie spójności karta–rysunek zmieniło rysunek w 38 ćwiczeniach bez zmiany skrótu i bez sygnału bramki 4.
// Skrót obejmuje więc WYNIK doboru (nie same dane): dodanie wskazówki, która dodaje linię, element albo pozę błędu → inny skrót; zmiana zdania karty albo wskazówka bez wpływu na rysunek → ten sam.
// Dane wejściowe: pełne dane kart (data/zrodla/cues.json) i zestawy ogólne (cue-sets.json) BEZ bramki recenzji kart — nadzbiór tego, co pokazuje aplikacja (karta ukryta po recenzji treści też podlega recenzji ruchu;
// to ścisła strona błędu: recenzent widzi więcej, nie mniej). Funkcje doboru to te same, których używa aplikacja (guidesFor, techniquesFor, errorsOf z ui.ts), wywołane na surowych id.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { appRequire, repoRoot } from './strona/ts-loader.mjs';

export const DANE_DOBORU = ['data/zrodla/cues.json', 'lib/figures/v2/cue-sets.json'];
const SEKCJE = ['setup', 'move', 'tips', 'mistakes'];
const czytajDomyslnie = p => readFileSync(join(repoRoot, p), 'utf8');
const pamiec = new Map();
const parsuj = tekst => { if (!pamiec.has(tekst)) { if (pamiec.size > 8) pamiec.clear(); pamiec.set(tekst, JSON.parse(tekst)); } return pamiec.get(tekst); };
const ma = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/** Surowe id wskazówek ćwiczenia (wzór: cueIdsOf w lib/figures/v2/ui.ts bez bramki recenzji): karta własna albo zestaw ogólny (ok + err). */
export function wskazowkiSurowe(key, czytaj = czytajDomyslnie) {
  const cues = parsuj(czytaj(DANE_DOBORU[0])), sets = parsuj(czytaj(DANE_DOBORU[1]));
  if (ma(cues.exercises, key)) { const own = cues.exercises[key]; return { ids: SEKCJE.flatMap(s => (own[s] ?? []).map(r => r.c)), errs: (own.mistakes ?? []).map(r => r.c) }; }
  const e = ma(sets.items, key) ? sets.items[key] : null;
  if (e && e.b === 'general') return { ids: [...(e.ok ?? []), ...(e.err ?? [])], errs: e.err ?? [] };
  return { ids: [], errs: [] };
}
/** { ćwiczenie: { guides, techniques, errors: [[id błędu, id wskazówki]] } } dla ćwiczeń rodziny z rysunkiem v2 (figureSpec), posortowane po kluczu. */
export function doborPoKluczach(rodzina, czytaj = czytajDomyslnie) {
  const rq = appRequire(); const fam = rq('lib/figures/v2/families.ts'), fg = rq('lib/figures/v2/figure.ts'), ui = rq('lib/figures/v2/ui.ts'), gd = rq('lib/figures/v2/guides.ts'), ov = rq('lib/figures/v2/overlay.ts');
  const all = fam.assignAll(); const out = {};
  for (const key of Object.keys(all).filter(k => all[k] === rodzina).sort()) {
    let spec = null; try { spec = fg.figureSpec(key); } catch { spec = null; }
    if (!spec) continue;
    const { ids, errs } = wskazowkiSurowe(key, czytaj);
    out[key] = { guides: gd.guidesFor(ids), techniques: ov.techniquesFor(spec.family, ids, key).map(d => d.id), errors: ui.errorsOf(spec, errs).map(e => [e.error, e.cue]) };
  }
  return out;
}
/** Deterministyczna serializacja doboru rodziny (wchodzi do skrótu recenzji rodziny). */
export const doborRodziny = (rodzina, czytaj = czytajDomyslnie) => JSON.stringify(doborPoKluczach(rodzina, czytaj));
