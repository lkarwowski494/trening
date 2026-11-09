/*
 * Pomoc testów skrótu recenzji rodziny v2 (09.11.2026): kod rysunku (TypeScript) ładuje skrypt z drzewa, w którym leży, więc mutację kodu i danych sprawdza się w KOPII drzewa
 * (lib, scripts, data + dowiązanie do node_modules), a skrót liczy `node scripts/skrot-v2-wynik.mjs <rodziny>` uruchomiony w tej kopii. Kopie są tymczasowe (sprzątanie: usunKopie).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFile } from 'child_process';

export const KORZEN = path.join(__dirname, '..', '..');
export type Zmiana = { plik: string; z?: string; na?: string; dopisz?: string };
export type Wynik = Record<string, { skrot: string; wynik: string; cwiczenia?: Record<string, string> }>;
const KOPIOWANE = ['lib', 'scripts', 'data'];
const kopie: string[] = [];

/** Stosuje zmiany do plików katalogu `dir` (z → na dokładnie raz; dopisz na końcu pliku). */
export function zastosuj(dir: string, zmiany: Zmiana[]): void {
  for (const m of zmiany) {
    const f = path.join(dir, m.plik); let t = fs.readFileSync(f, 'utf8');
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
