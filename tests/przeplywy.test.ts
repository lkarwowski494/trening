/*
 * Strażnik katalogu przepływów użytkownika (polecenie właściciela 13.10.2026: scenariusze Maestro mają w pełni zastąpić ręczne testowanie właściciela
 * w każdym przypadku sensownym z perspektywy użytkownika). Źródło prawdy: tests/przeplywy.json; dokumenty docs/37 i docs/39 generuje
 * scripts/flows-catalog.mjs. Część `npm run verify` (jest), tak jak `check:matrix`:
 *   1. każdy przepływ ma istniejący scenariusz Maestro ze znacznikami kroków w pliku ALBO wyjątek z powodem i zastępnikiem (Jest) / kontrolą (telefon);
 *   2. każdy scenariusz .maestro/NN-*.yaml jest przypisany do przepływu;
 *   3. każdy ekran z app/ (tests/routes.ts) występuje w przepływie — NOWY ekran bez przepływu blokuje verify;
 *   4. przepływy wersji 0.20 mają projekt scenariusza (plik jeszcze nie istnieje; po jego dopisaniu trzeba zmienić wpis na prawdziwy);
 *   5. scenariusze „eksperyment” (nieuruchomione jeszcze na symulatorze) są oznaczone tagiem i poza listą flows w config.yaml;
 *   6. docs/37 i docs/39 są aktualne względem katalogu.
 * Testy tego pliku nie uruchamiają scenariuszy (to robi tests/maestro-flows.test.tsx) — sprawdzają, że katalog i pliki są ze sobą spójne.
 */
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { execFileSync } from 'child_process';
import { appRoutes } from './routes';

const root = join(__dirname, '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');
type Wyjatek = { typ: 'jest' | 'telefon'; powod: string; zastepnik: string[]; kontrola?: string };
type Flow = { id: string; tytul: string; stan: string; wersja: string; realnosc: string; kroki: string[]; wynik: string; ekrany: string[]; scenariusz?: string; znaczniki?: string[]; tryb?: string; status?: string; wyjatek?: Wyjatek; projekt?: { scenariusz: string; czeka_na: string; opis: string }; uwaga?: string };
const cat = JSON.parse(read('tests/przeplywy.json')) as { stany: Record<string, string>; grupy: Record<string, string>; przeplywy: Flow[]; pominiete: { opis: string; powod: string }[] };
const flows = cat.przeplywy;
/** Treść scenariusza bez komentarzy YAML (pełnowierszowych i końcowych) — znaczniki muszą wystąpić w KODZIE scenariusza, nie w opisie. */
const stripYaml = (src: string) => src.split('\n').filter(l => !/^\s*#/.test(l)).map(l => l.replace(/\s#.*$/, '')).join('\n');
/** + kod podprzepływów wołanych przez runFlow (np. szablon-testowy tworzy szablon w 01, 02, 03, 05…). */
const yamlCode = (file: string): string => { const own = stripYaml(read(`.maestro/${file}`)); return [own, ...[...own.matchAll(/runFlow:\s*(subflows\/[\w-]+\.yaml)/g)].map(m => stripYaml(read(`.maestro/${m[1]}`)))].join('\n'); };
const mainFiles = readdirSync(join(root, '.maestro')).filter(f => /^\d\d-.*\.yaml$/.test(f)).sort();
const listed = [...read('.maestro/config.yaml').matchAll(/^\s+-\s+(\S+\.yaml)\s*$/gm)].map(m => m[1]);
const isExp = (file: string) => /^tags:\n\s+- eksperyment$/m.test(read(`.maestro/${file}`));

describe('katalog przepływów — schemat', () => {
  test('identyfikatory: unikalne, wzór XX-NN, grupa istnieje; pola obowiązkowe niepuste', () => {
    const ids = flows.map(f => f.id); expect(new Set(ids).size).toBe(ids.length);
    for (const f of flows) {
      expect([f.id, /^[A-Z][A-Z0-9]-\d{2}$/.test(f.id), f.id.slice(0, 2) in cat.grupy]).toEqual([f.id, true, true]);
      expect([f.id, f.tytul.length > 10, f.wynik.length > 10, f.kroki.length > 0 && f.kroki.every(k => k.length > 3), f.ekrany.length > 0]).toEqual([f.id, true, true, true, true]);
      expect([f.id, f.stan in cat.stany]).toEqual([f.id, true]);
      expect([f.id, ['realny', 'brzegowy'].includes(f.realnosc)]).toEqual([f.id, true]); /* teoretyczne: tylko w `pominiete` z powodem (CLAUDE.md, pkt 6) */
      expect([f.id, ['0.19', '0.20'].includes(f.wersja)]).toEqual([f.id, true]);
    }
  });
  test('każdy stan startowy (nowy, istniejący, aktualizacja, kopia, język/motyw) ma przepływy; liczba przepływów nie spada poniżej 100', () => {
    for (const s of Object.keys(cat.stany)) expect([s, flows.filter(f => f.stan === s).length > 0]).toEqual([s, true]);
    expect(flows.length).toBeGreaterThanOrEqual(100);
  });
  test('pominięte jako teoretyczne mają powód', () => { expect(cat.pominiete.length).toBeGreaterThan(0); for (const p of cat.pominiete) expect([p.opis.length > 15, p.powod.length > 30]).toEqual([true, true]); });
  test('każdy przepływ ma dokładnie jedno pokrycie: scenariusz, projekt (0.20) albo wyjątek', () => {
    for (const f of flows) expect([f.id, [f.scenariusz, f.projekt, f.wyjatek].filter(Boolean).length]).toEqual([f.id, 1]);
  });
});

describe('katalog przepływów — scenariusze Maestro', () => {
  test('scenariusz istnieje, a znaczniki kroków występują w jego kodzie (bez komentarzy)', () => {
    const bad: string[] = [];
    for (const f of flows.filter(x => x.scenariusz)) {
      if (!existsSync(join(root, '.maestro', f.scenariusz!))) { bad.push(`${f.id}: brak pliku .maestro/${f.scenariusz}`); continue; }
      if (!f.znaczniki?.length) { bad.push(`${f.id}: brak znaczników`); continue; }
      const code = yamlCode(f.scenariusz!);
      for (const z of f.znaczniki) if (!code.includes(z)) bad.push(`${f.id}: w ${f.scenariusz} brak znacznika „${z}”`);
    }
    expect(bad).toEqual([]);
  });
  test('każdy scenariusz .maestro/NN-*.yaml jest przypisany do przepływu', () => {
    const used = new Set(flows.map(f => f.scenariusz).filter(Boolean));
    expect(mainFiles.filter(f => !used.has(f))).toEqual([]);
  });
  test('scenariusze eksperymentalne: tag „eksperyment”, poza listą flows; zwykłe: na liście, bez tagu', () => {
    const expFiles = new Set(flows.filter(f => f.tryb === 'eksperyment').map(f => f.scenariusz));
    const regular = new Set(flows.filter(f => f.scenariusz && f.tryb !== 'eksperyment').map(f => f.scenariusz));
    for (const f of expFiles) expect([f, existsSync(join(root, '.maestro', f!)) && isExp(f!), listed.includes(f!)]).toEqual([f, true, false]);
    for (const f of regular) expect([f, isExp(f!), listed.includes(f!)]).toEqual([f, false, true]);
    expect([...expFiles].filter(f => regular.has(f))).toEqual([]); /* plik albo eksperymentalny, albo zwykły */
  });
  test('przepływy 0.20 (projekt): plik scenariusza jeszcze nie istnieje (po jego dopisaniu zmień wpis na scenariusz ze znacznikami)', () => {
    const proj = flows.filter(f => f.projekt);
    expect(proj.length).toBeGreaterThan(0);
    for (const f of proj) {
      expect([f.id, f.status, f.wersja]).toEqual([f.id, 'projekt', '0.20']);
      expect([f.id, existsSync(join(root, f.projekt!.scenariusz))]).toEqual([f.id, false]);
      expect([f.id, f.projekt!.czeka_na.length > 20, f.projekt!.opis.length > 20]).toEqual([f.id, true, true]);
    }
    for (const f of flows.filter(x => x.status === 'projekt')) expect([f.id, !!f.projekt]).toEqual([f.id, true]);
  });
});

describe('katalog przepływów — wyjątki', () => {
  const ex = flows.filter(f => f.wyjatek);
  test('wyjątek ma powód, a „jest” — istniejące testy zastępcze; „telefon” — konkretną kontrolę dla właściciela', () => {
    expect(ex.length).toBeGreaterThan(0);
    for (const f of ex) {
      const w = f.wyjatek!; expect([f.id, ['jest', 'telefon'].includes(w.typ), w.powod.length >= 40]).toEqual([f.id, true, true]);
      for (const z of w.zastepnik) expect([f.id, z, existsSync(join(root, z))]).toEqual([f.id, z, true]);
      if (w.typ === 'jest') expect([f.id, w.zastepnik.length > 0]).toEqual([f.id, true]);
      else expect([f.id, (w.kontrola ?? '').length >= 40]).toEqual([f.id, true]);
    }
  });
  test('lista „tylko telefon” obejmuje to, czego nie obsłuży automat (powiadomienie przy zablokowanym ekranie, Zdrowie, prawdziwy zakup, TestFlight, wibracja, eksport do Plików)', () => {
    const txt = ex.filter(f => f.wyjatek!.typ === 'telefon').map(f => f.tytul + f.wyjatek!.kontrola).join(' ').toLowerCase();
    for (const s of ['zablokuj', 'zdrowie', 'piaskownic', 'testflight', 'wibracj', 'plikach']) expect([s, txt.includes(s)]).toEqual([s, true]);
  });
});

describe('katalog przepływów — ekrany aplikacji', () => {
  test('KAŻDY ekran z app/ występuje w przepływie (nowy ekran bez przepływu blokuje verify); przepływy nie wskazują nieistniejących ekranów', () => {
    const stems = appRoutes().map(r => r.stem); const used = new Set(flows.flatMap(f => f.ekrany));
    expect(stems.filter(s => !used.has(s))).toEqual([]);
    expect([...used].filter(u => !stems.includes(u))).toEqual([]);
  });
  test('ekran z przepływem tylko wyjątkowym (bez żadnego scenariusza Maestro) jest wyjaśniony — każdy ekran ma co najmniej jeden przepływ w Maestro albo w projekcie 0.20', () => {
    const stems = appRoutes().map(r => r.stem);
    const bezMaestro = stems.filter(s => !flows.some(f => f.ekrany.includes(s) && (f.scenariusz || f.projekt)));
    expect(bezMaestro).toEqual([]);
  });
});

describe('testID dodane dla scenariuszy (13.10.2026)', () => {
  /* [plik źródłowy, fragment testID w źródle, scenariusz, fragment testID użyty w scenariuszu] — brak któregokolwiek ogniwa = scenariusz nie znajdzie elementu (interpreter w Jest też to wykryje) */
  const ids: [string, string, string, string][] = [
    ['app/templates.tsx', 'tpl-list', '24-szablony-zarzadzanie.yaml', 'tpl-list-1-del'],
    ['app/(tabs)/history.tsx', 'session-', '28-dluga-historia.yaml', 'session-0-del'], ['app/plan.tsx', 'plan-saved-', '26-plan-zarzadzanie.yaml', 'plan-saved-0-del'],
    ['app/plan.tsx', 'testID="plan-name"', '26-plan-zarzadzanie.yaml', 'plan-name'], ['app/exercises.tsx', 'lib-row-', '27-biblioteka-cwiczen.yaml', 'lib-row-1-del'],
    ['components/ActiveWorkout.tsx', 'testID="workout-note"', '25-trening-narzedzia.yaml', 'workout-note'],
    ['components/ActiveWorkout.tsx', 'testID={`ex-${ei}`}', '25-trening-narzedzia.yaml', 'ex-1-del'], ['app/history/edit/[id].tsx', 'testID={`w-${ei}-${si}`}', '28-dluga-historia.yaml', 'w-0-0'],
  ];
  test.each(ids)('%s: „%s” w źródle i „%s” użyte w %s', (src, inSrc, sc, inSc) => {
    expect(read(src)).toContain(inSrc); expect(yamlCode(sc)).toContain(inSc);
  });
});

describe('katalog przepływów — dokumenty generowane', () => {
  test('docs/37 i docs/39 są aktualne (node scripts/flows-catalog.mjs --write)', () => {
    expect(() => execFileSync('node', ['scripts/flows-catalog.mjs', '--check'], { cwd: root, stdio: 'pipe' })).not.toThrow();
  });
  test('docs/38 (luki, czas, podział na części) istnieje i wymienia każdy scenariusz z katalogu', () => {
    const d = read('docs/38-przeplywy-i-luki-e2e.md');
    for (const f of new Set(flows.map(x => x.scenariusz).filter(Boolean))) expect([f, d.includes(f!.slice(0, 2))]).toEqual([f, true]);
  });
});
