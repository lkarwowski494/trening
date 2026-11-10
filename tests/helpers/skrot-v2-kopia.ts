/*
 * Pomoc testów skrótu recenzji rodziny v2 (09.11.2026): kod rysunku (TypeScript) ładuje skrypt z drzewa, w którym leży, więc mutację kodu i danych sprawdza się w KOPII drzewa
 * (lib, scripts, data + dowiązanie do node_modules), a skrót liczy `node scripts/skrot-v2-wynik.mjs <rodziny>` uruchomiony w tej kopii. Kopie są tymczasowe (sprzątanie: usunKopie).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFile } from 'child_process';

export const KORZEN = path.join(__dirname, '..', '..');
export type Zmiana = { plik: string; z?: string; na?: string; dopisz?: string; usun?: true };
export type Wynik = Record<string, { skrot: string; wynik: string; cwiczenia?: Record<string, string> }>;
const KOPIOWANE = ['lib', 'scripts', 'data'];
const kopie: string[] = [];

/** Podłączenie rodziny v2 w rejestrze (KO-022, 10.11.2026): nowy plik `rodziny/<rodzina>.ts` (load = plik póz, ui = wpis DATA_UI) i linia w `rodziny/index.ts` — bez statusu w families.ts. */
export function podlaczenie(rodzina: string, wpis: { load?: true; ui?: string }): Zmiana[] {
  const pola = [...(wpis.load ? [`load: () => require('../poses/${rodzina}.json')`] : []), ...(wpis.ui ? [`ui: ${wpis.ui}`] : [])].join(', ');
  return [{ plik: 'lib/figures/v2/rodziny/' + rodzina + '.ts', dopisz: `import type { RodzinaPoz } from '../poseData';\nconst rodzina: RodzinaPoz = { ${pola} };\nexport default rodzina;\n` },
    { plik: 'lib/figures/v2/rodziny/index.ts', z: "  pull_up: require('./pull_up').default,\n", na: `  pull_up: require('./pull_up').default,\n  ${rodzina}: require('./${rodzina}').default,\n` }];
}
/**
 * Odłączenie gotowej rodziny v2 w kopii (10.11.2026, scalenie pociąg-7, decyzja w docs/18 do weta): status ready → planned w families.ts, bez linii w `rodziny/index.ts`
 * i bez pliku `rodziny/<rodzina>.ts`; plik póz zostaje. Daje stan wejściowy scenariuszy podłączenia (L-080, 1A) — „rodzina planned z plikiem póz, bez wpisu w rejestrze” —
 * gdy w repozytorium takiej rodziny już nie ma (po partii 8 planned są tylko cardio, foam_roll i neck, wszystkie bez póz). Każda zmiana musi trafić dokładnie raz (zastosuj).
 */
export function odlaczenie(rodzina: string): Zmiana[] {
  return [{ plik: 'lib/figures/v2/families.ts', z: `{ id: '${rodzina}', status: 'ready'`, na: `{ id: '${rodzina}', status: 'planned'` },
    { plik: 'lib/figures/v2/rodziny/index.ts', z: `  ${rodzina}: require('./${rodzina}').default,\n`, na: '' },
    { plik: 'lib/figures/v2/rodziny/' + rodzina + '.ts', usun: true }];
}
/** Stosuje zmiany do plików katalogu `dir` (z → na dokładnie raz; dopisz na końcu pliku; usun — plik musi istnieć). */
export function zastosuj(dir: string, zmiany: Zmiana[]): void {
  for (const m of zmiany) {
    const f = path.join(dir, m.plik); if (m.usun) { if (!fs.existsSync(f)) throw new Error(`${m.plik}: brak pliku do usunięcia`); fs.rmSync(f); continue; } let t = m.z === undefined && !fs.existsSync(f) ? '' : fs.readFileSync(f, 'utf8'); /* sam „dopisz” do nieistniejącego pliku tworzy go (nowy plik rodziny, KO-022) */
    if (m.z !== undefined) { const ile = t.split(m.z).length - 1; if (ile !== 1) throw new Error(`${m.plik}: tekst do zamiany występuje ${ile} razy: ${m.z.slice(0, 80)}`); t = t.replace(m.z, () => m.na ?? ''); }
    if (m.dopisz) t += m.dopisz;
    fs.writeFileSync(f, t);
  }
}
/** Kopia drzewa (lib, scripts, data) ze zmianami; zwraca katalog. */
export function kopia(zmiany: Zmiana[] = []): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'skrot-v2-')); kopie.push(dir);
  for (const k of KOPIOWANE) fs.cpSync(path.join(KORZEN, k), path.join(dir, k), { recursive: true });
  fs.symlinkSync(fs.realpathSync(path.join(KORZEN, 'node_modules')), path.join(dir, 'node_modules'));
  zastosuj(dir, zmiany); return dir;
}
export const usunKopie = (): void => { while (kopie.length) fs.rmSync(kopie.pop()!, { recursive: true, force: true }); };
/** Skróty rodzin liczone w drzewie `dir` (domyślnie repo). */
export const skroty = (dir: string, rodziny: string[], cwiczenia = false): Promise<Wynik> => new Promise((ok, err) => {
  execFile('node', ['scripts/skrot-v2-wynik.mjs', rodziny.join(','), ...(cwiczenia ? ['--cwiczenia'] : [])], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 28 }, (e, out) => e ? err(e) : ok(JSON.parse(out)));
});
/** Kolejka z ograniczoną równoległością (każdy proces liczy kilka sekund i zajmuje rdzeń). */
export async function kolejka<T>(zadania: (() => Promise<T>)[], rownolegle = 3): Promise<T[]> {
  const out: T[] = new Array(zadania.length); let i = 0;
  await Promise.all(Array.from({ length: Math.min(rownolegle, zadania.length) }, async () => { while (i < zadania.length) { const k = i++; out[k] = await zadania[k](); } }));
  return out;
}
