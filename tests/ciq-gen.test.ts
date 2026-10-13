/* Pliki aplikacji na zegarek (garmin/) GENEROWANE z jednego źródła — lib/watch/ciqWire.ts, ciqModel.ts, ciqWrap.ts i słowników t() (wzór: widget-i18n):
 *   garmin/source/Wire.mc            stałe wiadomości (klucze, tryby, zdarzenia, progi),
 *   garmin/source/Labels.mc          dostęp do stałych etykiet (zasób zegarka, nadpisywany etykietami z telefonu),
 *   garmin/source/tests/Fixtures.mc  pliki „złote” dla testów Monkey C (kroki + oczekiwany wynik policzony modelem TypeScript, przypadki zawijania),
 *   garmin/manifest.xml              identyfikator, wersja, modele, języki,
 *   garmin/resources/strings/ i garmin/resources-<kod>/strings/   nazwa aplikacji i etykiety w językach zegarka.
 * Po zmianie: UPDATE_CIQ=1 npx jest tests/ciq-gen.test.ts. Bez UPDATE test porównuje pliki z wygenerowaną treścią (zmiana ręczna = błąd).
 * Testy Monkey C (Run No Evil) wymagają symulatora Connect IQ — instrukcja w docs/35-zegarek-garmin.md i garmin-test-wlasciciela. */
import * as fs from 'fs';
import * as path from 'path';
import {
  CIQ_APP_ID_HEX, CIQ_WATCH_APP_VERSION, CIQ_WIRE_VERSION, CIQ_UNDO_WINDOW_SEC, CIQ_QUEUE_MAX, CIQ_QUEUE_TTL_SEC, CIQ_OFFLINE_AFTER, CIQ_RECORD_MIN_SEC, CIQ_RECORDER_ACTIONS, ciqRecorderAction, CIQ_KEYS, CIQ_KINDS, CIQ_MODES, CIQ_EVENT_TYPES,
  CIQ_LABEL_IDS, CIQ_LANG, CIQ_PRODUCTS, CIQ_MIN_API, ciqLabelsAllLangs, ciqAppName,
} from '@/lib/watch/ciqWire';
import { ciqWrapLines } from '@/lib/watch/ciqWrap';
import { LANGS, type Lang } from '@/lib/i18n';
import { SCRIPTS, type Step } from './ciq-scenarios';
import { runScript } from './ciq-run';

const ROOT = path.join(__dirname, '..', 'garmin');
const HEAD = 'Generowane: tests/ciq-gen.test.ts (UPDATE_CIQ=1) — nie edytuj ręcznie.';

/** Literał Monkey C dla wartości JSON (null, tekst, liczba całkowita, tablica, słownik). */
export function mc(v: unknown): string {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'string') return `"${v.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
  if (typeof v === 'number') { if (!Number.isInteger(v)) throw new Error(`liczba nie całkowita: ${v}`); return String(v); }
  if (typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return `[${v.map(mc).join(', ')}]`;
  return `{${Object.entries(v as Record<string, unknown>).map(([k, x]) => `${mc(k)} => ${mc(x)}`).join(', ')}}`;
}
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const rezId = (id: string) => `Lbl${cap(id)}`;
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const W10 = (s: string) => [...s].length * 10;
const KIND_CODE = { done: 0, doneDiff: 1, skip: 2 } as const;

function wireMc(): string {
  const K = Object.entries(CIQ_KEYS).map(([n, v]) => `    const K_${n.replace(/([A-Z])/g, '_$1').toUpperCase()} = ${mc(v)};`).join('\n');
  const M = Object.entries(CIQ_MODES).map(([n, v]) => `    const MODE_${n.toUpperCase()} = ${v};`).join('\n');
  const KI = Object.entries(CIQ_KINDS).map(([n, v]) => `    const KIND_${n.toUpperCase()} = ${mc(v)};`).join('\n');
  const EV = Object.entries(CIQ_EVENT_TYPES).map(([n, v]) => `    const EV_${n.replace(/([A-Z])/g, '_$1').toUpperCase()} = ${mc(v)};`).join('\n');
  const REC = Object.entries(CIQ_RECORDER_ACTIONS).map(([n, v]) => `    const REC_${n.toUpperCase()} = ${v};`).join('\n');
  return `// ${HEAD}\n// Stałe wiadomości telefon <-> zegarek (lib/watch/ciqWire.ts).\nmodule Wire {\n    const VERSION = ${CIQ_WIRE_VERSION};\n    const APP_VERSION = ${mc(CIQ_WATCH_APP_VERSION)};\n    const APP_ID = ${mc(CIQ_APP_ID_HEX)};\n    const UNDO_WINDOW_SEC = ${CIQ_UNDO_WINDOW_SEC};\n    const QUEUE_MAX = ${CIQ_QUEUE_MAX};\n    const QUEUE_TTL_SEC = ${CIQ_QUEUE_TTL_SEC};\n    const OFFLINE_AFTER = ${CIQ_OFFLINE_AFTER};\n    const RECORD_MIN_SEC = ${CIQ_RECORD_MIN_SEC};\n${REC}\n${KI}\n${M}\n${K}\n${EV}\n}\n`;
}

function labelsMc(): string {
  const body = CIQ_LABEL_IDS.map(id => `        if (id.equals(${mc(id)})) {\n            return WatchUi.loadResource(Rez.Strings.${rezId(id)}) as String;\n        }`).join('\n');
  return `import Toybox.Lang;\nimport Toybox.WatchUi;\n\n// ${HEAD}\n// Stałe etykiety: tekst z telefonu (w języku aplikacji, migawka z polem lb) albo zasób zegarka w jego języku.\nmodule Labels {\n    function fallback(id as String) as String {\n${body}\n        return "";\n    }\n\n    function get(model, id as String) as String {\n        var v = model.labels[id];\n        if (v instanceof String && v.length() > 0) {\n            return v;\n        }\n        return fallback(id);\n    }\n}\n`;
}

function fixturesMc(): string {
  const names = Object.keys(SCRIPTS);
  const scriptFn = (name: string) => {
    const steps = runScript(SCRIPTS[name]).map(r => {
      const s = r.step as Step; const base: Record<string, unknown> = { op: s.op, at: s.at, event: r.event, view: r.view };
      if (s.op === 'snap') base.msg = r.msg; if (s.op === 'press') base.kind = KIND_CODE[s.kind];
      return `            ${mc(base)}`;
    });
    return `    function script_${name}() as Array {\n        return [\n${steps.join(',\n')}\n        ];\n    }`;
  };
  const wrapCases = [
    ['', 100], ['abc', 100], ['ab cd ef', 50], ['ab cd ef', 40], ['abcdefghij', 50], ['  ab', 100], ['ab\ncd', 100], ['ab cdefgh', 50], ['日本語のテキスト', 30],
    ['Wyciskanie sztangi leżąc', 120], ['Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)', 200],
  ].map(([text, w]) => ({ text, maxW: w, lines: ciqWrapLines(text as string, w as number, W10) }));
  const recCases = [[false, 1, false, 0], [false, 2, false, 0], [true, 1, false, 500], [true, 2, false, 500], [false, 0, false, 0], [false, 3, false, 0], [true, 3, false, 60], [true, 3, false, 59], [true, 0, false, 3600], [true, 0, false, 10], [false, 1, true, 0], [true, 3, true, 3600]]
    .map(([rec, mode, upd, el]) => ({ recording: rec, mode, needsUpdate: upd, elapsed: el, action: ciqRecorderAction(rec as boolean, mode as number, upd as boolean, el as number) }));
  const disp = names.map(n => `        if (name.equals(${mc(n)})) {\n            return script_${n}();\n        }`).join('\n');
  const tests = names.map(n => `(:test)\nfunction test_script_${n}(logger as Logger) as Boolean {\n    return ModelTests.runScript(${mc(n)}, logger);\n}`).join('\n\n');
  return `import Toybox.Lang;\nimport Toybox.Test;\n\n// ${HEAD}\n// Pliki „złote” z tests/ciq-scenarios.ts: kroki (migawka, naciśnięcie, cofnięcie, tyknięcie) i wynik policzony przez lib/watch/ciqModel.ts.\n(:test)\nmodule Fixtures {\n    function scriptNames() as Array {\n        return ${mc(names)};\n    }\n\n${names.map(scriptFn).join('\n\n')}\n\n    function script(name as String) as Array {\n${disp}\n        return [];\n    }\n\n    // Szerokość atrapy: 10 px na znak.\n    function wrapCases() as Array {\n        return ${mc(wrapCases)};\n    }\n\n    function recorderCases() as Array {\n        return ${mc(recCases)};\n    }\n}\n\n${tests}\n`;
}

function manifestXml(): string {
  const langs = [...new Set(Object.values(CIQ_LANG).filter((c): c is string => !!c))].sort();
  return `<?xml version="1.0"?>\n<!-- ${HEAD} -->\n<iq:manifest xmlns:iq="http://www.garmin.com/xml/connectiq" version="3">\n    <iq:application entry="TreningApp" id="${CIQ_APP_ID_HEX}" launcherIcon="@Drawables.LauncherIcon" minApiLevel="${CIQ_MIN_API}" name="@Strings.AppName" type="watch-app" version="${CIQ_WATCH_APP_VERSION}">\n        <iq:products>\n${CIQ_PRODUCTS.map(p => `            <iq:product id="${p}"/>`).join('\n')}\n        </iq:products>\n        <iq:permissions>\n            <iq:uses-permission id="Communications"/>\n            <iq:uses-permission id="Fit"/>\n        </iq:permissions>\n        <iq:languages>\n${langs.map(c => `            <iq:language>${c}</iq:language>`).join('\n')}\n        </iq:languages>\n        <iq:barrels/>\n    </iq:application>\n</iq:manifest>\n`;
}

/** Język aplikacji, z którego pochodzą zasoby dla kodu Connect IQ (es-419 i pt-BR dzielą kod z es i pt — bierzemy bazowe). */
const SOURCE_LANG: Record<string, Lang> = Object.fromEntries((Object.entries(CIQ_LANG) as [Lang, string | null][]).filter(([, c]) => !!c).map(([l, c]) => [c as string, l]));

function stringsXml(l: Lang): string {
  const lab = ciqLabelsAllLangs()[l];
  return `<?xml version="1.0"?>\n<!-- ${HEAD} -->\n<strings>\n    <string id="AppName">${xml(ciqAppName(l))}</string>\n${CIQ_LABEL_IDS.map(id => `    <string id="${rezId(id)}">${xml(lab[id])}</string>`).join('\n')}\n</strings>\n`;
}

function expected(): Record<string, string> {
  const out: Record<string, string> = {
    'source/Wire.mc': wireMc(), 'source/Labels.mc': labelsMc(), 'source/tests/Fixtures.mc': fixturesMc(), 'manifest.xml': manifestXml(),
    'resources/strings/strings.xml': stringsXml('en'),
  };
  for (const [code, l] of Object.entries(SOURCE_LANG)) out[`resources-${code}/strings/strings.xml`] = stringsXml(l);
  return out;
}

const exp = expected();
const generatedDirs = () => fs.readdirSync(ROOT).filter(d => /^resources-[a-z]{3}$/.test(d)).sort();

test('pliki garmin/ zgodne z wygenerowanymi (UPDATE_CIQ=1 zapisuje)', () => {
  if (process.env.UPDATE_CIQ) {
    for (const [f, c] of Object.entries(exp)) { fs.mkdirSync(path.dirname(path.join(ROOT, f)), { recursive: true }); fs.writeFileSync(path.join(ROOT, f), c); }
    for (const d of generatedDirs()) if (!Object.keys(exp).some(f => f.startsWith(`${d}/`))) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
  }
  for (const [f, c] of Object.entries(exp)) expect([f, fs.existsSync(path.join(ROOT, f)) ? fs.readFileSync(path.join(ROOT, f), 'utf8') : 'BRAK']).toEqual([f, c]);
  expect(generatedDirs()).toEqual(Object.keys(SOURCE_LANG).map(c => `resources-${c}`).sort());
});

describe('zawartość wygenerowanych plików', () => {
  test('Wire.mc: wszystkie klucze, tryby, zdarzenia i progi', () => {
    const w = exp['source/Wire.mc'];
    for (const v of Object.values(CIQ_KEYS)) expect(w).toContain(`= "${v}";`);
    expect(w).toContain('const K_SET_ID = "id";'); expect(w).toContain('const K_REST_LEFT = "rs";'); expect(w).toContain('const MODE_REST = 2;'); expect(w).toContain('const EV_DONE_DIFF = "x";');
    expect(w).toContain(`const APP_ID = "${CIQ_APP_ID_HEX}";`); expect(w).toContain(`const UNDO_WINDOW_SEC = ${CIQ_UNDO_WINDOW_SEC};`); expect(w).toContain('const QUEUE_TTL_SEC = 900;'); expect(w).toContain('const RECORD_MIN_SEC = 60;'); expect(w).toContain('const REC_DISCARD = 3;');
  });
  test('manifest: aplikacja typu watch-app z uprawnieniem Communications, modele fēnix 8, języki zegarka', () => {
    const m = exp['manifest.xml'];
    expect(m).toContain('type="watch-app"'); expect(m).toContain('<iq:uses-permission id="Communications"/>'); expect(m).toContain('<iq:uses-permission id="Fit"/>'); expect(m).toContain(`id="${CIQ_APP_ID_HEX}"`);
    for (const p of CIQ_PRODUCTS) expect(m).toContain(`<iq:product id="${p}"/>`);
    for (const c of ['pol', 'deu', 'fre', 'dut', 'slo', 'zsm', 'zht', 'jpn', 'kor']) expect(m).toContain(`<iq:language>${c}</iq:language>`);
    for (const c of ['sr', 'el', 'srp', 'ell']) expect(m).not.toContain(`<iq:language>${c}</iq:language>`);
    expect(m).not.toContain('<iq:language>eng</iq:language>');
  });
  test('zasoby: base = angielski; każdy kod zegarka ma plik z AppName i wszystkimi etykietami; XML poprawnie zakodowany', () => {
    const base = exp['resources/strings/strings.xml']; expect(base).toContain('>Training<'); expect(base).toContain('Start a workout in the app on your phone');
    for (const [f, c] of Object.entries(exp).filter(([f]) => f.endsWith('strings.xml'))) {
      expect([f, (c.match(/<string id=/g) ?? []).length]).toEqual([f, 1 + CIQ_LABEL_IDS.length]);
      for (const id of ['AppName', ...CIQ_LABEL_IDS.map(rezId)]) expect(c).toContain(`<string id="${id}">`);
      expect(c).not.toMatch(/<string id="\w+"><\/string>/); expect(c).not.toMatch(/&(?!amp;|lt;|gt;|quot;)/);
    }
    expect(exp['resources-pol/strings/strings.xml']).toContain('Zacznij trening w aplikacji na telefonie'); expect(exp['resources-deu/strings/strings.xml']).toContain('Rückgängig');
    expect(exp['resources-spa/strings/strings.xml']).toContain('Sin conexión con el teléfono'); /* hiszpański bazowy, nie es-419 */ expect(exp['resources-por/strings/strings.xml']).toContain('Sem ligação ao telemóvel');
  });
  test('Fixtures.mc: wszystkie skrypty mają funkcję testową i wpis w script(); atrapa szerokości 10 px; brak liczb ułamkowych', () => {
    const f = exp['source/tests/Fixtures.mc'];
    for (const n of Object.keys(SCRIPTS)) { expect(f).toContain(`function script_${n}()`); expect(f).toContain(`function test_script_${n}(logger as Logger)`); expect(f).toContain(`if (name.equals("${n}"))`); }
    expect(f).toContain('(:test)\nmodule Fixtures'); expect(f.match(/\(:test\)/g)!.length).toBe(1 + Object.keys(SCRIPTS).length);
  });
  test('mc(): literały Monkey C — escapowanie, zagnieżdżenie, null, błąd dla liczb niecałkowitych', () => {
    expect(mc({ a: 'x"y\\z\n', b: [1, true, null], c: {} })).toBe('{"a" => "x\\"y\\\\z\\n", "b" => [1, true, null], "c" => {}}');
    expect(() => mc(1.5)).toThrow(); expect(mc(undefined)).toBe('null');
  });
  test('wszystkie języki aplikacji obsłużone: język z kodem ma zasób, bez kodu korzysta z bazy (en) lub etykiet z telefonu', () => {
    for (const l of LANGS) { const c = CIQ_LANG[l]; if (c) expect(Object.keys(exp)).toContain(`resources-${c}/strings/strings.xml`); }
  });
});
