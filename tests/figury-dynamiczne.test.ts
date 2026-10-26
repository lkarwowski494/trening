/*
 * Figury v2 — ruchy dynamiczne (wersja 1.1, 26.10.2026): lot (plyo), przechwyt (olympic), balistyczny wymach (kb_ballistic), sanie i rzuty (sled_throw), strongman.
 * Kontrakt ma limit skoku punktu 6 cm na 1/48 ruchu (CONTRACT.maxJump); pełny skok z zamachem rąk, zarzut z przechwytem czy wymach kettlebella przekraczają go tylko dlatego, że są szybkie.
 * Rozszerzenie: ćwiczenie z deklaracją „dynamiczne” w data/zrodla/figury-sens.json (z powodem) ma limit CONTRACT.maxJumpDynamic; inne rodziny i ćwiczenia bez zmian.
 * Rodzaje (docs/20): dane (deklaracje z powodem), niezmienniki (zgodność wsteczna: rodziny bez deklaracji mają limit 6), macierz (każde ćwiczenie dynamicznej rodziny ma pozę albo wyjątek z powodem),
 * regresja (pozy zapisane przechodzą walidator; limit dynamiczny jest REALNIE używany — bez niego co najmniej jedna poza z rodziny nie przechodzi ciągłości).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const SENS = path.join(ROOT, 'scripts/figures/v2-sens.mjs');
const VAL = path.join(ROOT, 'scripts/figures/v2-validate.mjs');
const run = (script: string, code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(script)}; ${code}`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 1 << 26 }));
const DYN = ['olympic', 'plyo', 'kb_ballistic', 'sled_throw', 'strongman'];
const sens = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-sens.json'), 'utf8')).rodziny as Record<string, { dynamiczne?: Record<string, string>; warianty?: Record<string, unknown> }>;

describe('deklaracja „dynamiczne” w danych sensu (powód obowiązkowy)', () => {
  test('tylko rodziny ruchów dynamicznych; każdy wpis ma powód (co najmniej zdanie), gwiazdka = cała rodzina', () => {
    for (const [r, v] of Object.entries(sens)) {
      if (!v.dynamiczne) continue;
      expect(DYN).toContain(r);
      for (const [cw, powod] of Object.entries(v.dynamiczne)) { expect(typeof powod).toBe('string'); expect(powod.trim().length).toBeGreaterThan(25); expect(cw === '*' || cw in (v.warianty ?? {})).toBe(true); }
    }
  });
  test('zgodność wsteczna: v2-sens.dynamiczne jest fałszem dla każdego ćwiczenia z rodzin spoza listy dynamicznych', () => {
    const pary = Object.entries(sens).filter(([r]) => !DYN.includes(r)).flatMap(([r, v]) => Object.keys(v.warianty ?? {}).filter((c) => !c.startsWith('_')).map((c) => [r, c]));
    expect(pary.length).toBeGreaterThan(100);
    const wynik = run(SENS, `console.log(JSON.stringify(${JSON.stringify(pary)}.map(([r, c]) => m.dynamiczne(r, c))))`) as boolean[];
    expect(wynik.some(Boolean)).toBe(false);
  });
  test('rodziny z pozami w poses/ i deklaracją: dynamiczne dla ćwiczeń z deklaracji i dla gwiazdki', () => {
    for (const r of DYN) {
      const d = sens[r]?.dynamiczne; if (!d) continue;
      const cw = Object.keys(d).find((k) => k !== '*') ?? Object.keys(sens[r].warianty ?? {}).find((k) => !k.startsWith('_'));
      expect(run(SENS, `console.log(JSON.stringify(m.dynamiczne(${JSON.stringify(r)}, ${JSON.stringify(cw)})))`)).toBe(true);
    }
  });
});

describe('pozy dynamicznych rodzin zapisane w danych', () => {
  const rodziny = DYN.filter((r) => sens[r]?.dynamiczne); /* deklaracja => poses/<rodzina>.json istnieje (deklaruje się po wygenerowaniu póz) */
  const plikPoz = (r: string) => path.join(ROOT, 'lib/figures/v2/poses', `${r}.json`);
  test('rodzina z deklaracją „dynamiczne” ma plik póz', () => { for (const r of rodziny) expect(fs.existsSync(plikPoz(r))).toBe(true); });
  test.each(rodziny.length ? rodziny : ['(brak deklaracji)'])('%s: każda zapisana poza przechodzi waliduj() (geometria, sens, jakość, ciągłość z limitem dynamicznym)', (r) => {
    if (!rodziny.length) return;
    const wynik = run(VAL, `import * as fs from 'node:fs'; const poze = JSON.parse(fs.readFileSync(${JSON.stringify(plikPoz(r))}, 'utf8')).cwiczenia; const o = {}; for (const [cw, p] of Object.entries(poze)) o[cw] = m.waliduj(p, { rodzina: ${JSON.stringify(r)}, cwiczenie: cw }); console.log(JSON.stringify(o))`) as Record<string, { ok: boolean }>;
    expect(Object.entries(wynik).filter(([, v]) => !v.ok).map(([k]) => k)).toEqual([]);
  });
  test('limit dynamiczny jest używany: bez flagi dynamic co najmniej jedna poza z rodzin z deklaracją łamie ciągłość (rozszerzenie nie jest dekoracją)', () => {
    if (!rodziny.length) return;
    const kody = run(VAL, `import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))}; import * as os from 'node:os'; import * as fs from 'node:fs'; import * as path from 'node:path';
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dyn-')); const { v2 } = loadV2(dir); const rom = JSON.parse(fs.readFileSync(${JSON.stringify(path.join(ROOT, 'lib/figures/data.json'))}, 'utf8')).rom; let o = false;
      for (const r of ${JSON.stringify(rodziny)}) { const poze = JSON.parse(fs.readFileSync(path.join(${JSON.stringify(path.join(ROOT, 'lib/figures/v2/poses'))}, r + '.json'), 'utf8')).cwiczenia;
        for (const [cw, p] of Object.entries(poze)) if (v2.validatePose(p, { family: r, exercise: cw, errorCues: p.bledy.map((b) => b.cue), rom }).some((i) => i.kod === 'ciaglosc')) o = true; }
      fs.rmSync(dir, { recursive: true, force: true }); console.log(JSON.stringify(o))`);
    expect(kody).toBe(true);
  });
});
