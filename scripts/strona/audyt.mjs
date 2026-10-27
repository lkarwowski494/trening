// Plik audytu rodzin figur (data/figury-audyt.json): jedno miejsce prawdy o tym, które rodziny przeszły niezależny audyt ruchu i treści karty
// (CLAUDE.md, „Animacje i karty ćwiczeń — audyt dogłębny”, 27.10.2026). Rodzina bez stanu `zatwierdzona` nie jest eksportowana na stronę (figura wypada, tekst zostaje).
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const AUDYT_SCHEMA = 'figury-audyt@1';
export const STANY = ['zatwierdzona', 'do_poprawy', 'brak'];
const DATA = /^\d{4}-\d{2}-\d{2}$/;

/** Wczytuje i sprawdza plik audytu względem listy rodzin (ids); zwraca { schema, rodziny } albo rzuca z listą błędów. */
export function wczytajAudyt(plik, ids, root) {
  const d = JSON.parse(readFileSync(plik, 'utf8')), bad = [];
  if (d.schema !== AUDYT_SCHEMA) bad.push(`schema ${d.schema}`);
  const r = d.rodziny && typeof d.rodziny === 'object' ? d.rodziny : {};
  for (const id of ids) if (!(id in r)) bad.push(`brak rodziny ${id}`);
  for (const [id, e] of Object.entries(r)) {
    if (!ids.includes(id)) { bad.push(`nieznana rodzina ${id}`); continue; }
    if (!STANY.includes(e?.stan)) { bad.push(`${id}: stan ${e?.stan}`); continue; }
    if (e.stan === 'zatwierdzona') {
      if (!DATA.test(e.data ?? '')) bad.push(`${id}: zatwierdzona bez daty`);
      for (const k of ['recenzjaRuchu', 'recenzjaTresci']) if (typeof e[k] !== 'string' || !existsSync(join(root, e[k]))) bad.push(`${id}: zatwierdzona bez istniejącego pliku ${k}`);
    } else if (typeof e.uwaga !== 'string' || !e.uwaga.trim()) bad.push(`${id}: ${e.stan} bez uwagi`);
  }
  if (bad.length) throw new Error(`plik audytu figur niepoprawny: ${bad.join('; ')}`);
  return { schema: d.schema, rodziny: r };
}
export const zatwierdzone = a => new Set(Object.entries(a.rodziny).filter(([, e]) => e.stan === 'zatwierdzona').map(([id]) => id));
