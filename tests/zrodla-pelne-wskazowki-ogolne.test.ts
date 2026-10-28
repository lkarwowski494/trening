/*
 * M1-audytor-generalny-021 (06-tresci-003, DEC-05 a, 27.10.2026): źródła zestawów ogólnych wskazówek figur v2 i kąta stóp w przysiadzie były tylko w plikach badacza
 * z 25.10.2026 poza repozytorium aplikacji — łańcucha zdanie → źródło nie dało się sprawdzić. Są w data/zrodla/wskazowki-ogolne.json (wewnętrzny rejestr; aplikacja
 * nie wymienia źródeł — decyzja właściciela 25.10.2026), a kontrola brakiZrodelOgolnych (scripts/zrodla-runtime.mjs, część check:zrodla-runtime w verify) kończy się
 * błędem, gdy wyświetlane id wskazówki zestawu ogólnego nie ma wpisu źródła z adresem i miejscem.
 * Rodzaje (docs/20): dane (pokrycie źródłami), niezmiennik (każde id zestawu ogólnego ma wpis), regresja (kontrola potrafi paść na danych sztucznych).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
const script = path.join(root, 'scripts/zrodla-runtime.mjs');
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
type Sets = { items: Record<string, { b: string; f?: string; ok?: string[]; err?: string[] }> };

/** Wywołuje brakiZrodelOgolnych w osobnym procesie (moduł ESM); dane sztuczne przez stdin (argument byłby za długi), bez danych — pliki z repo. */
function braki(data?: { sets: unknown; ogolne: unknown }): string[] {
  const code = `import * as z from ${JSON.stringify('file://' + script)}; import { readFileSync } from 'node:fs';
    const wej = readFileSync(0, 'utf8'); const a = wej ? JSON.parse(wej) : null; const j = (p) => JSON.parse(readFileSync(p, 'utf8'));
    const full = j(${JSON.stringify(path.join(root, 'data/zrodla/cues.json'))});
    const sets = a ? a.sets : j(z.CUE_SETS); const ogolne = a ? a.ogolne : j(z.OGOLNE);
    process.stdout.write(JSON.stringify(z.brakiZrodelOgolnych(sets, ogolne, full, z.TOE_TEXT)));`;
  return JSON.parse(execFileSync('node', ['--input-type=module', '-e', code], { input: data ? JSON.stringify(data) : '', encoding: 'utf8', maxBuffer: 1 << 26 }));
}

describe('M1-audytor-generalny-021 (27.10.2026): źródła zestawów ogólnych i kąta stóp w repo', () => {
  const sets: Sets = read('lib/figures/v2/cue-sets.json');
  const ogolne = read('data/zrodla/wskazowki-ogolne.json');
  test('każde id wskazówki z zestawu ogólnego ma wpis źródła z adresem i miejscem; każde ćwiczenie z zestawem ogólnym — przypisanie z plikiem badacza', () => {
    expect(braki()).toEqual([]);
    const general = Object.entries(sets.items).filter(([, e]) => e.b === 'general');
    expect(general.length).toBeGreaterThan(0);
    expect(Object.keys(ogolne.przypisania).sort()).toEqual(general.map(([k]) => k).sort());
  });
  test('wyświetlane id bez wpisu źródła → błąd (kontrola potrafi paść)', () => {
    const [ex, e] = Object.entries(sets.items).find(([, x]) => x.b === 'general' && (x.ok ?? []).length)!;
    const id = e.ok![0];
    const bez = { ...ogolne, wskazowki: Object.fromEntries(Object.entries(ogolne.wskazowki).filter(([k]) => k !== id)) };
    expect(braki({ sets, ogolne: bez }).join('\n')).toContain(`${ex}: wskazówka ${id} bez wpisu źródła`);
    const jedno = { ...ogolne, wskazowki: { ...ogolne.wskazowki, [id]: { zrodla: [{ adres: 'https://example.org/a', miejsce: 'x' }] } } };
    expect(braki({ sets, ogolne: jedno }).join('\n')).toContain(`${id}: wymagane ≥ 2 źródła`);
  });
  test('kąt stóp: tekst z karty ćwiczenia ma wpis źródła z adresem i miejscem; bez wpisu → błąd; stan zgodny z rejestrem twierdzeń (T-054; potwierdzone 28.10.2026 — 2 źródła szczebla 4)', () => {
    const toe = ogolne.katy['sq.toesAngle'];
    expect(fs.readFileSync(path.join(root, 'components/ExerciseFigureV2.tsx'), 'utf8')).toContain(`t('${toe.tekst}')`);
    expect(toe.zrodla.every((z: { adres: string; miejsce: string }) => /^https:\/\//.test(z.adres) && z.miejsce)).toBe(true);
    expect(braki({ sets, ogolne: { ...ogolne, katy: {} } }).join('\n')).toMatch(/kąt stóp: brak wpisu źródła/);
    const reg = read('docs/research/rejestr-twierdzen.json') as { twierdzenia: { id: string; rodzaje: string[]; uwaga?: string }[] };
    const t054 = reg.twierdzenia.find((e) => e.id === 'T-054')!;
    /* decyzja właściciela 28.10.2026 „5b” (M1-audytor-generalny-021): drugie źródło szczebla 4 przeczytane — T-054 zamknięte; przedział kąta: ≥ 2 źródła z adresem https (zasada 25.10.2026) */
    expect(toe.status).toBe('potwierdzone'); expect(t054.rodzaje).not.toContain('otwarte'); expect(t054.uwaga).not.toMatch(/\[OTWARTE/);
    expect(new Set(toe.zrodla.map((z: { adres: string }) => new URL(z.adres).hostname)).size).toBeGreaterThanOrEqual(2);
  });
  test('verify uruchamia kontrolę (check:zrodla-runtime) i aplikacja nie importuje pliku źródeł', () => {
    expect(read('package.json').scripts.verify).toMatch(/npm run check:zrodla-runtime/);
    const g = spawnSync('git', ['grep', '-l', 'wskazowki-ogolne', '--', 'lib', 'app', 'components'], { cwd: root, encoding: 'utf8' });
    expect(g.stdout.trim()).toBe('');
  });
});
