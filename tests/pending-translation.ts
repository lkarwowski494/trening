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
