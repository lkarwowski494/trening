// Eksport danych biblioteki ćwiczeń dla strony (osobne repo `techniqueatlas`, decyzja właściciela 26.10.2026). Jeden plik JSON na język (35) + manifest.
// Dane pochodzą z RUNTIME aplikacji (te same moduły, które trafiają do paczki: lib/seed, lib/catalog.generated, lib/cues/data.json, lib/figures/v2/cue-sets.json,
// lib/i18n + lib/locales) — nie z data/zrodla (pełne dane ze źródłami), więc nazwy źródeł i organizacji nie mają skąd się wziąć. Dodatkowo ostatnia bramka:
// przed zapisem każdy tekst przechodzi te same wzorce co tests/zrodla-wiedzy.test.ts (lib/sources.ts) — trafienie przerywa eksport (kod 1).
// Pole `app` przypina eksport do wersji aplikacji (app.json), skrótu commitu i rewizji katalogu; strona czyta eksport przypięty do wersji.
// Pliki: atlas-<język>.json (teksty i dane ćwiczeń), figury.json (dane figur — niezależne od języka, więc raz), manifest.json, wzorce-zrodel.json (lista wzorców dla strażnika
// w repo strony: ta sama co lib/sources.ts). Figura = próbki klatek (poza + rekwizyty w 25 punktach ruchu, już rozwiązane przez rig albo kontrakt pozy), z których przeglądarka
// składa kształty silnikiem z silnik-build.mjs; dane pozy w kontrakcie figury-v2/poza@1 (jeśli są) dołączone obok.
// Użycie: node scripts/strona/eksport.mjs --out <katalog> [--langs pl,en,…] [--commit <sha>]
import { execSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { appRequire, repoRoot } from './ts-loader.mjs';

export const SCHEMA = 'techniqueatlas-eksport@1';
/** Liczba zamienników przy ćwiczeniu (jedno miejsce; aplikacja pokazuje 3 w arkuszu zamiany — strona ma więcej miejsca). */
export const ALTERNATIVES = 5;
/** Liczba przedziałów ruchu w próbkach figury (25 próbek: u = 0, 1/24, …, 1). */
export const FRAME_STEPS = 24;
const SECTIONS = ['setup', 'move', 'tips', 'mistakes'];
const own = (o, k) => Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined;

/** Slug niezależny od języka: z angielskiej nazwy ćwiczenia, tylko a–z 0–9 i „-”; kolizje (po kolejności kluczy) dostają przyrostek -2, -3… */
export function makeSlugs(names) {
  const used = new Set(), out = {};
  for (const [key, name] of names) {
    const base = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'cwiczenie';
    let s = base, n = 2; while (used.has(s)) s = `${base}-${n++}`;
    used.add(s); out[key] = s;
  }
  return out;
}

function gitCommit() { try { return execSync('git rev-parse HEAD', { cwd: repoRoot, encoding: 'utf8' }).trim(); } catch { return 'unknown'; } }

/** Wczytuje moduły aplikacji i zwraca konstruktor eksportu: buildLang(lang) → obiekt JSON. */
export function createExporter({ commit = process.env.ATLAS_COMMIT || gitCommit() } = {}) {
  const R = appRequire();
  const seed = R('lib/seed.ts'), i18n = R('lib/i18n.ts'), cat = R('lib/catalog.generated.ts'), cues = R('lib/cues/index.ts'), eq = R('lib/equipment.ts');
  const v2 = R('lib/figures/v2/index.ts'), cueSets = R('lib/figures/v2/cueSets.ts'), ui = R('lib/figures/v2/ui.ts'), swapScore = R('lib/swapScore.ts'), sources = R('lib/sources.ts');
  const app = JSON.parse(readFileSync(join(repoRoot, 'app.json'), 'utf8')).expo;
  const keys = seed.LIB.map(r => r[0]);
  const exOf = Object.fromEntries(seed.LIB.map(r => [r[0], seed.libExercise(r)]));
  const dispName = k => own(seed.LIB_DISPLAY_NAME, k) ?? k;
  /* nazwa angielska = kanoniczna nazwa wyświetlana w aplikacji dla języka en */
  i18n.applyLang('en');
  const slugs = makeSlugs(keys.map(k => [k, i18n.exName({ name: dispName(k), lib: true })]));
  const posesDir = join(repoRoot, 'lib/figures/v2/poses');
  const poseFiles = {};
  /** Dane pozy w kontrakcie: z plików lib/figures/v2/poses/<rodzina>.json (jeśli są), inaczej z rigu gotowej rodziny (exampleFor). */
  const poseFor = (key, spec) => {
    const fam = spec ? spec.family : v2.familyOf(key);
    if (!(fam in poseFiles)) { const f = join(posesDir, `${fam}.json`); poseFiles[fam] = existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null; }
    const fromFile = poseFiles[fam]?.cwiczenia?.[key];
    if (fromFile) return fromFile;
    if (!spec) return null;
    const errs = {}; for (const e of ui.errorsOf(spec)) errs[e.error] = e.cue;
    return v2.exampleFor(key, errs);
  };
  const r2 = o => typeof o === 'number' ? Math.round(o * 100) / 100 : Array.isArray(o) ? o.map(r2) : o && typeof o === 'object' ? Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => [k, r2(v)])) : o;
  const sample = at => Array.from({ length: FRAME_STEPS + 1 }, (_, i) => { const f = at(i / FRAME_STEPS); return r2({ pose: f.pose, props: f.props }); });
  /** Wpis figury (niezależny od języka). Gotowa rodzina: próbki z rigu (także pozy błędów); poza gotową rodziną: tylko dane pozy z plików, jeśli są (pilotaż). */
  const figureEntry = key => {
    const spec = v2.figureSpec(key), pose = poseFor(key, spec);
    if (spec) {
      const errors = ui.errorsOf(spec).map(({ error, cue }) => {
        const def = v2.ERRORS[error];
        return { id: error, cue, kind: def.kind, mark: def.mark, ...(def.kind === 'pose' ? { frames: sample(u => v2.frameAt(spec, u, error)) } : { tempo: def.mods.tempo }) };
      });
      return { family: spec.family, views: spec.views, static: spec.static, lowerFirst: spec.lowerFirst, tempo: v2.tempoFor(spec), pose, frames: sample(u => v2.frameAt(spec, u)), errors };
    }
    if (!pose) return null;
    const fam = v2.FAMILIES.find(f => f.id === v2.familyOf(key));
    return { family: fam.id, views: fam.views, static: false, lowerFirst: true, tempo: { ...v2.TEMPO }, pose, frames: sample(u => v2.keyframeFrame(pose, u)), errors: [] };
  };
  const figures = {};
  for (const k of keys) { const fe = figureEntry(k); if (fe) figures[slugs[k]] = fe; }
  const cueTextIn = (l, id) => { const a = cues.cueDict(l)[id] ?? cues.cueDict('en')[id] ?? cues.cueDict('pl')[id]; return a; };

  /* zamienniki: ranking niezależny od języka (nazwa angielska rozstrzyga remisy) — ten sam kod co arkusz zamiany w aplikacji (lib/swapScore.ts) */
  const enName = Object.fromEntries(keys.map(k => [k, i18n.exName({ name: dispName(k), lib: true })]));
  const alternatives = {};
  for (const a of keys) {
    const A = exOf[a], rows = [];
    for (const b of keys) {
      if (b === a || (exOf[b].metric ?? 'weight_reps') !== (A.metric ?? 'weight_reps')) continue;
      const sim = swapScore.similarity(A, exOf[b]); if (sim) rows.push([b, sim.score, exOf[b].equipment === A.equipment ? 1 : 0]);
    }
    rows.sort((x, y) => y[1] - x[1] || y[2] - x[2] || (enName[x[0]] < enName[y[0]] ? -1 : enName[x[0]] > enName[y[0]] ? 1 : 0));
    alternatives[a] = rows.slice(0, ALTERNATIVES).map(r => slugs[r[0]]);
  }
  const NAME = new RegExp(`(?<![\\p{L}])(?:${sources.SOURCE_NAME_PATTERNS.join('|')})`, 'u');
  const GENERIC = new RegExp(`(?<![\\p{L}])(?:${sources.GENERIC_REFERENCE_PATTERNS.join('|')})`, 'iu');

  function buildLang(l) {
    i18n.applyLang(l);
    const t = i18n.t;
    const labels = {
      groups: Object.fromEntries(seed.GROUPS.map(g => [g, t(g)])),
      muscles: Object.fromEntries(seed.MUSCLES.map(m => [m, t(m)])),
      regions: Object.fromEntries(Object.keys(seed.REGION_LABEL).map(r => [r, t(seed.REGION_LABEL[r])])),
      equipment: Object.fromEntries(['hantle', 'sztanga', 'masa ciała', 'maszyna', 'linki', 'inne'].map(e => [e, t(e)])),
      capabilities: Object.fromEntries(cat.CATALOG_CAPS.map(c => [c, eq.capLabel(c)])),
      phases: Object.fromEntries(['Opuszczanie', 'Wypychanie', 'Wstawanie', 'Podnoszenie', 'Prostowanie', 'Pauza'].map(p => [p, t(p)])),
    };
    const figurePhases = key => { const spec = v2.figureSpec(key); return spec ? v2.phasesFor(spec, v2.tempoFor(spec)).map(p => ({ name: t(p.name), ms: p.ms })) : []; };
    const figureErrors = key => { const spec = v2.figureSpec(key); return spec ? ui.errorsOf(spec).map(e => ({ id: e.error, text: cueTextIn(l, e.cue) ?? null })).filter(e => e.text) : []; };
    let withoutText = 0;
    const exercises = keys.map(key => {
      const e = exOf[key], entry = cat.CATALOG[key];
      const sel = cueSets.cueSelection(key);
      const txt = id => { const s = cueTextIn(l, id); if (s === undefined) { withoutText++; return null; } return s; };
      let cueBlock;
      if (sel.mode === 'own') { const o = cues.CUE_DATA.exercises[key]; cueBlock = { scope: 'own', ...Object.fromEntries(SECTIONS.filter(s => (o[s] ?? []).length).map(s => [s, o[s].map(r => txt(r.c)).filter(x => x !== null)])) }; }
      else if (sel.mode === 'general') cueBlock = { scope: 'general', ok: sel.ok.map(txt).filter(x => x !== null), mistakes: sel.err.map(txt).filter(x => x !== null) };
      else cueBlock = { scope: 'none' };
      const load = seed.muscleLoadOf(e);
      return {
        id: key, slug: slugs[key], name: i18n.exName({ name: dispName(key), lib: true }),
        group: e.group, equipment: e.equipment, metric: e.metric, pattern: entry.pattern, loadSource: entry.loadSource,
        muscles: { main: e.muscles, aux: e.secondaryMuscles },
        regions: load.map(([id, w]) => ({ id, load: w })),
        requires: entry.requires, recommended: entry.recommended,
        family: v2.familyOf(key),
        figure: own(figures, slugs[key]) ? { phases: figurePhases(key), errors: figureErrors(key) } : null,
        cues: cueBlock,
        alternatives: alternatives[key],
      };
    });
    const out = { schema: SCHEMA, app: { version: app.version, commit, catalogRev: cat.CATALOG_REV }, lang: l, meta: { exercises: exercises.length, cuesWithoutText: withoutText }, labels, exercises };
    guard(out, l);
    return out;
  }
  /** Bramka anonimowości: żaden tekst nie ma nazwy źródła (wszystkie języki) ani odwołania ogólnego (pl, en — jak tests/zrodla-wiedzy.test.ts). */
  function guard(obj, l) {
    const bad = [];
    const walk = (v, path) => {
      if (typeof v === 'string') { if (NAME.test(v) || ((l === 'pl' || l === 'en') && GENERIC.test(v))) bad.push(`${path}: ${v.slice(0, 60)}`); }
      else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    };
    walk(obj, l);
    if (bad.length) throw new Error(`eksport zawiera nazwy źródeł lub odwołania ogólne (${bad.length}), np. ${bad.slice(0, 3).join(' | ')}`);
  }
  return { buildLang, guard, figures, patterns: { name: sources.SOURCE_NAME_PATTERNS, generic: sources.GENERIC_REFERENCE_PATTERNS }, languages: i18n.LANGS, app: { version: app.version, commit, catalogRev: cat.CATALOG_REV } };
}

export const serialize = obj => JSON.stringify(obj) + '\n';

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
  const a = process.argv.slice(2), arg = n => { const i = a.indexOf(n); return i >= 0 ? a[i + 1] : undefined; };
  const out = arg('--out'); if (!out) { console.error('użycie: node scripts/strona/eksport.mjs --out <katalog> [--langs pl,en] [--commit <sha>]'); process.exit(2); }
  const ex = createExporter(arg('--commit') ? { commit: arg('--commit') } : {});
  const langs = arg('--langs') ? arg('--langs').split(',') : [...ex.languages];
  mkdirSync(out, { recursive: true });
  const manifest = { schema: SCHEMA, app: ex.app, languages: [], figures: 'figury.json', patterns: 'wzorce-zrodel.json' };
  const figText = serialize({ schema: SCHEMA, app: ex.app, figures: ex.figures }); writeFileSync(join(out, 'figury.json'), figText); manifest.figuresBytes = Buffer.byteLength(figText);
  writeFileSync(join(out, 'wzorce-zrodel.json'), serialize({ schema: SCHEMA, ...ex.patterns }));
  for (const l of langs) {
    const file = `atlas-${l}.json`; const text = serialize(ex.buildLang(l));
    writeFileSync(join(out, file), text); manifest.languages.push({ lang: l, file, bytes: Buffer.byteLength(text) });
  }
  writeFileSync(join(out, 'manifest.json'), serialize(manifest));
  console.log(`eksport: ${langs.length} języków → ${out} (wersja ${ex.app.version}, commit ${ex.app.commit.slice(0, 7)})`);
}
