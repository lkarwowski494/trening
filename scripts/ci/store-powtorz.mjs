#!/usr/bin/env node
// Zrzuty sklepu: ekrany do powtórzenia mimo uzupełniania z poprzedniego przebiegu (wejście `powtorz`, np. "hu/01-trening,ja/02-cwiczenie";
// przegląd 29.10.2026: hu/01 z banerem przerwy i uciętą plakietką). Usuwa pasujące pliki z katalogu uzupełnienia we wszystkich rozmiarach,
// więc podział zadań liczy je jako brakujące, a skrypt zrzutów robi je od nowa. Użycie: node store-powtorz.mjs <katalog> "<lista>"
import fs from 'node:fs';
import path from 'node:path';

export function powtorz(dir, list) {
  const pairs = String(list || '').split(',').map(s => s.trim()).filter(Boolean);
  const removed = [];
  if (!pairs.length || !fs.existsSync(dir)) return removed;
  for (const p of pairs) {
    if (!/^[A-Za-z-]+\/\d{2}-[a-z-]+$/.test(p)) throw new Error(`Zły wpis w powtorz: "${p}" (wzór: język/NN-ekran, np. hu/01-trening)`);
    for (const size of fs.readdirSync(dir)) {
      const f = path.join(dir, size, `${p}.png`);
      if (fs.existsSync(f)) { fs.unlinkSync(f); removed.push(path.join(size, `${p}.png`)); }
    }
  }
  return removed;
}

if (process.argv[1] && import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  const removed = powtorz(process.argv[2], process.argv[3]);
  console.log(removed.length ? `Do powtórzenia (usunięte z uzupełnienia): ${removed.join(', ')}` : 'powtorz: nic do usunięcia');
}
