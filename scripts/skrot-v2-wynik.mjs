// Skrót recenzji rodziny v2 z WYNIKU rysunku (decyzja właściciela 09.11.2026, wariant A; docs/18; lekcja o skrótach całych plików wspólnych).
// Do 09.11.2026 skrót rodziny liczył tekst WSZYSTKICH plików wspólnych silnika (variants.ts, overlay.ts, reguly-cwiczen.json …): zmiana jednego wariantu (RDL) albo jednego elementu nakładki
// (Pull-Up) unieważniała recenzje wszystkich rodzin i ukrywała wszystkie rysunki (fail-closed) do zaświadczenia audytora dla rodzin, których rysunek się nie zmienił.
// Teraz skrót rodziny = skrót tego, co rodzina POKAZUJE. Dla każdego ćwiczenia rodziny z rysunkiem v2 (assignAll + figureSpec): specyfikacja i wariant, kadr, tempo i fazy, pętla, pomiar i jego linia,
// legenda i mięśnie, dobór linii/elementów/błędów po kartach (surowe dane, bez bramki recenzji — skrypt skrot-v2-dobor.mjs), przebieg czasu animacji oraz kształty klatek: każdy rzut, u co 1/16,
// poza poprawna i każdy błąd — ciało z mięśniami, styki, tor, linie odniesienia, nakładka techniki (wybrana, pełna rodziny, pełna z liniami), znaczki, kolejność rysowania (sortShapes).
// Współrzędne zaokrąglone do 1e-4 (determinizm między platformami; liczby zmiennoprzecinkowe różnią się ostatnim bitem).
// Zmiana, która zmienia rysunek rodziny, ZAWSZE zmienia jej skrót (to strażnik bramki 4, L-047); zmiana wspólnego pliku, która rysunku rodziny nie zmienia (komentarz, wariant albo element innej rodziny),
// jej skrótu nie rusza. Do skrótu wchodzi ponadto tekst: (1) pliku samej rodziny (rig albo pozy) i jej nakładki (plik wyłącznie jej), (2) warstwy rysowania kształtów na ekran (V2_RENDER):
// render.ts i palette.ts zmieniają wygląd wszystkich rodzin naraz, a „wyniku po renderze” nie da się policzyć bez motywu i platformy — wspólny kod renderowania unieważnia wszystkie, świadomie.
// Rodzina „planned” jest liczona jak „ready”: podłączenie rodziny (status, wpis LOAD i DATA_UI) nie jest zmianą rysunku (decyzja 1A, 03.11.2026) — zastępuje normalizację skrot-v2-norm.mjs.
// Jedno źródło dla zapisu recenzji (scripts/zrodla-runtime.mjs) i eksportu strony (scripts/strona/recenzja-figur.mjs): parytet z konstrukcji (tests/strona-eksport-recenzja.test.ts).
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { appRequire, repoRoot } from './strona/ts-loader.mjs';
import { doborPoKluczach, wskazowkiSurowe } from './skrot-v2-dobor.mjs';

export const U_SIATKA = Array.from({ length: 17 }, (_, i) => i / 16);
export const ZAOKRAGLENIE = 1e4;
/** Pliki rigów rodzin v2 z własnym rigiem; pozostałe rodziny mają pozy w lib/figures/v2/poses/<rodzina>.json. */
export const V2_RIGI = { squat: 'squat.ts', bench_press: 'benchPress.ts', hinge: 'hinge.ts' };
/** Warstwa rysowania kształtów na ekran wspólna dla wszystkich rodzin: tekst wchodzi do skrótu każdej rodziny (zob. nagłówek). */
export const V2_RENDER = ['lib/figures/v2/render.ts', 'lib/figures/v2/palette.ts'];
/** Nakładki techniki wspólne dla wielu rodzin (linie odniesienia wybiera się po wskazówkach karty, nie po rodzinie — N1, 04.11.2026): ich wpływ jest w wyniku, tekst nie wchodzi do skrótu żadnej rodziny. */
export const NAKLADKI_WSPOLNE = ['common', 'squat', 'hinge'];
const sha12 = t => createHash('sha256').update(t).digest('hex').slice(0, 12);
const zaokr = (_k, v) => typeof v === 'number' ? Math.round(v * ZAOKRAGLENIE) / ZAOKRAGLENIE : v; /* funkcje JSON pomija sam */
const json = x => JSON.stringify(x, zaokr) ?? 'null';
const probuj = f => { try { return f(); } catch { return 'BLAD'; } };
const czytajDomyslnie = p => readFileSync(join(repoRoot, p), 'utf8');

/** Plik danych rodziny: rig albo pozy z danych (ten sam wzór w zapisie recenzji i w eksporcie strony). */
export const plikRodziny = rodzina => V2_RIGI[rodzina] ? `lib/figures/v2/rigs/${V2_RIGI[rodzina]}` : `lib/figures/v2/poses/${rodzina}.json`;
/** Plik nakładki techniki wyłącznie tej rodziny (overlay/<rodzina>.ts); null, gdy rodzina nie ma własnej nakładki albo nakładka jest wspólna. */
export const plikNakladki = (rodzina, istnieje = p => existsSync(join(repoRoot, p))) => { if (NAKLADKI_WSPOLNE.includes(rodzina)) return null; const p = `lib/figures/v2/overlay/${rodzina}.ts`; return istnieje(p) ? p : null; };

/** { ćwiczenie: skrót 12 znaków } dla ćwiczeń rodziny z rysunkiem v2 (posortowane po kluczu); wynik, którego nie da się policzyć (wyjątek), daje „BLAD” — zmiana → inny skrót. */
export function wynikiRodziny(rodzina, czytaj = czytajDomyslnie) {
  const rq = appRequire(); const fam = rq('lib/figures/v2/families.ts'), fg = rq('lib/figures/v2/figure.ts'), ui = rq('lib/figures/v2/ui.ts'), ov = rq('lib/figures/v2/overlay.ts'), bd = rq('lib/figures/v2/badges.ts'), os = rq('lib/figures/v2/overlayShapes.ts'), an = rq('lib/figures/v2/anim.ts'), dr = rq('lib/figures/v2/draw.ts');
  const wpis = fam.FAMILY[rodzina]; const status = wpis?.status; if (wpis) wpis.status = 'ready';
  try {
    const dobor = doborPoKluczach(rodzina, czytaj); const out = {};
    const wszystkieTech = (ov.TECHNIQUE[rodzina] ?? []).map(d => d.id);
    for (const key of Object.keys(dobor)) {
      let spec = null; try { spec = fg.figureSpec(key); } catch { out[key] = 'BLAD'; continue; }
      if (!spec) { out[key] = 'NULL'; continue; }
      const d = dobor[key]; const ids = wskazowkiSurowe(key, czytaj).ids; const bledy = d.errors.map(e => e[0]); const errs = [undefined, ...bledy];
      const h = createHash('sha256'); const dodaj = x => h.update(json(x) + '\n');
      dodaj({ spec, d, wszystkieTech, rysowane: probuj(() => ui.onDrawingCues(spec, d.guides, d.techniques, ids)), toe: probuj(() => ui.toeAngleApplies(spec)) });
      dodaj(probuj(() => ({ loop: fg.loopOf(spec), span: fg.loopSpan(spec), stat: fg.staticPositions(spec), joint: fg.measuredJoint(spec), line: fg.angleLineShown(spec), side: fg.measuredSide(spec), mus: fg.musclesFor(key),
        legend: (l => l && { main: l.main, aux: l.aux, simplified: l.simplified })(ui.legendOf(key)),
        tempo: errs.map(e => { const t = fg.tempoFor(spec, e); const f = fg.phasesFor(spec, t); return [t, f, Array.from({ length: 49 }, (_, i) => spec.static ? 1 : fg.loopOf(spec) === 'cykl_lustro' ? an.cycleAt(i * 125) : fg.loopOf(spec) === 'jednokierunkowa' ? an.oneWayAt(i * 125) : an.uAt(i * 125, spec.lowerFirst, t))]; }),
        box: spec.views.map(v => fg.boxFor(spec, v, bledy)) })));
      for (const v of spec.views) dodaj(probuj(() => fg.trailFor(spec, v)));
      /* pętla błąd → u → rzut: klatka (frameAt, pamięć 48 pozycji) liczona raz na parę (błąd, u) */
      for (const e of errs) for (const u of U_SIATKA) for (const v of spec.views) {
        dodaj(probuj(() => {
          const ciało = fg.shapesAt(spec, u, v, true, e), styki = fg.contactShapes(spec, u, v, e), tor = fg.trailFor(spec, v), linie = os.guideShapes(spec, u, v, d.guides, e), nakladka = os.overlayShapes(spec, u, v, d.techniques, e, d.guides);
          const znaczki = e ? ui.badgesFor(spec, u, v, e) : bd.okBadges(fg.frameAt(spec, u), v, ids);
          const kat = fg.measuredAngle(spec, u, e); /* kształty składa się jak w aplikacji (ExerciseFigureV2): jedna lista posortowana — zawiera ciało, tor, linie, nakładkę, styki i znaczki ✓ */
          return [dr.sortShapes([...ciało, ...tor, ...linie, ...nakladka, ...styki, ...bd.badgeShapes(znaczki)]), kat, ui.measureLine(kat), os.overlayShapes(spec, u, v, wszystkieTech, e, []), os.overlayShapes(spec, u, v, wszystkieTech, e, d.guides), znaczki, bd.spaceBadges(znaczki, 8)];
        }));
      }
      out[key] = sha12(h.digest('hex'));
    }
    return out;
  } finally { if (wpis) wpis.status = status; }
}
/** Skrót wyniku rodziny (12 znaków). */
export const wynikRodziny = (rodzina, czytaj = czytajDomyslnie) => sha12(json(wynikiRodziny(rodzina, czytaj)));
/** Skrót recenzji rodziny v2: wynik rysunku + tekst pliku rodziny, jej nakładki i warstwy rysowania (zob. nagłówek). `czytaj` podmienia czytanie tekstów plików rodziny i warstwy rysowania oraz danych wskazówek (testy doboru); kod rysunku (TypeScript) zawsze z drzewa — testy mutacji kodu liczą skrót w kopii drzewa (tests/skrot-v2-wynik.test.ts). */
const skrotZWyniku = (rodzina, wyniki, czytaj = czytajDomyslnie) => sha12([plikRodziny(rodzina), plikNakladki(rodzina, p => existsSync(join(repoRoot, p))), ...V2_RENDER].filter(Boolean).map(p => czytaj(p)).concat(sha12(json(wyniki))).join('\n'));
export const rodzinaSkrot = (rodzina, czytaj = czytajDomyslnie) => skrotZWyniku(rodzina, wynikiRodziny(rodzina, czytaj), czytaj);

/* Użycie: node scripts/skrot-v2-wynik.mjs <rodzina>[,<rodzina>…] [--cwiczenia]  →  JSON { rodzina: { skrot, wynik, cwiczenia? } } (skrót recenzji, skrót samego wyniku rysunku, skróty ćwiczeń).
 * Dowód migracji (docs/research/figury-skrot-migracja-2026-11-09.md) i testy mutacji (tests/skrot-v2-wynik.test.ts) liczą nim w kopiach drzewa. */
if (process.argv[1] && process.argv[1].endsWith('skrot-v2-wynik.mjs') && process.argv[2]) {
  const cw = process.argv.includes('--cwiczenia'); const out = {};
  for (const f of process.argv[2].split(',')) { const w = wynikiRodziny(f); out[f] = { skrot: skrotZWyniku(f, w), wynik: sha12(json(w)), ...(cw ? { cwiczenia: w } : {}) }; }
  process.stdout.write(JSON.stringify(out));
}
