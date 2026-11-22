// Wspólne funkcje skryptów odczytu ASC (KO-121): stronicowanie z dołączonymi zasobami (`included`) i zapis JSON.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

/** GET ze stronicowaniem po `links.next`; zwraca { data, included } (wszystkie strony). `c` musi mieć `call` (readOnlyClient). Limit 200 na stronę (maksimum API). */
export async function stronicuj(c, sciezka) {
  const data = []; const included = [];
  let next = sciezka + (sciezka.includes('?') ? '&' : '?') + 'limit=200';
  while (next) {
    const j = await c.call('GET', next);
    data.push(...(j?.data ?? [])); included.push(...(j?.included ?? []));
    next = j?.links?.next ?? null;
  }
  return { data, included };
}

export function zapiszJson(out, nazwa, wartosc) {
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, nazwa), JSON.stringify(wartosc, null, 2) + '\n');
}
