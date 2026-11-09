/* Zestaw do przekładu (docs/lokalizacja/zestaw-przekladu-2026-10-23.json, decyzja właściciela 23.10.2026): klucze, które w 33 językach poza PL i EN
 * czekają na przekład z Claude API (Message Batches). Rodzaj „nowy” — klucza nie ma w słownikach (aplikacja pokazuje angielski), wyjątek testów kompletności;
 * rodzaj „zmieniony” — słownik trzyma stare tłumaczenie pod nowym kluczem (wyjątek strażnika nazw źródeł, tests/zrodla-wiedzy.test.ts).
 * Po przekładzie plik traci wpisy (pusta lista = brak wyjątków). */
import * as fs from 'fs';
import * as path from 'path';

export const PENDING_FILE = path.join(__dirname, '..', 'docs', 'lokalizacja', 'zestaw-przekladu-2026-10-23.json');
export type Pending = { rodzaj: 'nowy' | 'zmieniony'; pl: string; en: string; poprzedni_pl?: string };
/** Dalsze zestawy interfejsu (zestaw-przekladu-<data>-<temat>.json z kluczami rodzaju nowy/zmieniony; bez zestawów wskazówek) — dopisywane do głównego. */
const LOK_UI = path.join(__dirname, '..', 'docs', 'lokalizacja');
const DALSZE = fs.readdirSync(LOK_UI).filter(f => /^zestaw-przekladu-.*\.json$/.test(f) && !/-wskazowki\.json$/.test(f) && path.join(LOK_UI, f) !== PENDING_FILE)
  .flatMap(f => ((JSON.parse(fs.readFileSync(path.join(LOK_UI, f), 'utf8')) as { klucze?: Pending[] }).klucze ?? []).filter(k => (k.rodzaj === 'nowy' || k.rodzaj === 'zmieniony') && !(k as { zrodlo?: string }).zrodlo)); /* pozycja z polem „zrodlo” pochodzi z niescalonej gałęzi (klucza nie ma jeszcze w źródle) — przekładana razem, ale bez wyjątku testów, dopóki gałąź nie wejdzie */
export const PENDING: Pending[] = [...(JSON.parse(fs.readFileSync(PENDING_FILE, 'utf8')) as { klucze: Pending[] }).klucze, ...DALSZE];
export const PENDING_NEW = new Set(PENDING.filter(p => p.rodzaj === 'nowy').map(p => p.pl));
export const PENDING_CHANGED = new Set(PENDING.filter(p => p.rodzaj === 'zmieniony').map(p => p.pl));

/** Id wskazówek techniki czekających na przekład (docs/lokalizacja/zestaw-przekladu-*-wskazowki.json): pl i en mają je od razu, reszta języków — angielski w zastępstwie (cueText). */
const LOK = path.join(__dirname, '..', 'docs', 'lokalizacja');
export const PENDING_CUE_IDS = new Set<string>(fs.readdirSync(LOK).filter(f => /^zestaw-przekladu-.*-wskazowki\.json$/.test(f))
  .flatMap(f => (JSON.parse(fs.readFileSync(path.join(LOK, f), 'utf8')).klucze as { id: string }[]).map(k => k.id)));
