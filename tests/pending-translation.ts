/* Zestaw do przekładu (docs/lokalizacja/zestaw-przekladu-2026-10-23.json, decyzja właściciela 23.10.2026): klucze, które w 33 językach poza PL i EN
 * czekają na przekład z Claude API (Message Batches). Rodzaj „nowy” — klucza nie ma w słownikach (aplikacja pokazuje angielski), wyjątek testów kompletności;
 * rodzaj „zmieniony” — słownik trzyma stare tłumaczenie pod nowym kluczem (wyjątek strażnika nazw źródeł, tests/zrodla-wiedzy.test.ts).
 * Po przekładzie plik traci wpisy (pusta lista = brak wyjątków). */
import * as fs from 'fs';
import * as path from 'path';

export const PENDING_FILE = path.join(__dirname, '..', 'docs', 'lokalizacja', 'zestaw-przekladu-2026-10-23.json');
export type Pending = { rodzaj: 'nowy' | 'zmieniony'; pl: string; en: string; poprzedni_pl?: string };
export const PENDING: Pending[] = (JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8')) as { klucze: Pending[] }).klucze;
export const PENDING_NEW = new Set(PENDING.filter(p => p.rodzaj === 'nowy').map(p => p.pl));
export const PENDING_CHANGED = new Set(PENDING.filter(p => p.rodzaj === 'zmieniony').map(p => p.pl));

/** Id wskazówek techniki czekających na przekład (docs/lokalizacja/zestaw-przekladu-*-wskazowki.json): pl i en mają je od razu, reszta języków — angielski w zastępstwie (cueText). */
const LOK = path.join(__dirname, '..', 'docs', 'lokalizacja');
export const PENDING_CUE_IDS = new Set<string>(fs.readdirSync(LOK).filter(f => /^zestaw-przekladu-.*-wskazowki\.json$/.test(f))
  .flatMap(f => (JSON.parse(fs.readFileSync(path.join(LOK, f), 'utf8')).klucze as { id: string }[]).map(k => k.id)));
