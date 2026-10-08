// Podsumowanie części L2 generowane z L2.json do L2-zrodla.md (między znacznikami).
// Użycie: node docs/research/25-biblioteka/podsumowanie-L2.mjs --write | --check
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));
const recs = JSON.parse(readFileSync(join(dir, 'L2.json'), 'utf8'));
const mdPath = join(dir, 'L2-zrodla.md');
const md = readFileSync(mdPath, 'utf8');
const START = '<!-- PODSUMOWANIE:START (generowane: node docs/research/25-biblioteka/podsumowanie-L2.mjs --write) -->';
const END = '<!-- PODSUMOWANIE:END -->';

const count = (key) => recs.reduce((m, r) => (m[r[key]] = (m[r[key]] ?? 0) + 1, m), {});
const fmt = (obj, order) => order.filter(k => obj[k]).map(k => `${k} ${obj[k]}`).join(' · ');
const fmtVal = (v) => (typeof v === 'string' ? v : JSON.stringify(v));
const list = (rs, f) => rs.map(r => `- ${r.name}${f(r)}`).join('\n');

const v = count('verdict'), s = count('scope'), c = count('confidence');
const fixes = recs.filter(r => r.verdict === 'POPRAWIĆ');
const renames = recs.filter(r => r.fixes?.name);
const merges = recs.filter(r => r.mergeInto);
const removes = recs.filter(r => r.verdict === 'USUNĄĆ');
const fieldCount = {};
for (const r of fixes) for (const k of Object.keys(r.fixes)) fieldCount[k] = (fieldCount[k] ?? 0) + 1;
const srcUse = {};
for (const r of recs) for (const id of r.sources) srcUse[id] = (srcUse[id] ?? 0) + 1;

const out = [
  START,
  '## Podsumowanie (z L2.json)',
  '',
  `- Ćwiczeń: **${recs.length}**.`,
  `- Werdykt: ${fmt(v, ['OK', 'POPRAWIĆ', 'SCALIĆ', 'USUNĄĆ'])}.`,
  `- Zakres: ${fmt(s, ['ZOSTAJE', 'NISZOWE', 'SCALIĆ', 'USUNĄĆ'])}.`,
  `- Pewność: ${fmt(c, ['mocne', 'umiarkowane', 'jedno źródło', 'brak źródła — uproszczenie'])}.`,
  `- Poprawiane pola (liczba ćwiczeń): ${Object.entries(fieldCount).sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k} ${n}`).join(' · ')}.`,
  `- Użyte źródła: ${Object.keys(srcUse).length} (${Object.entries(srcUse).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, n]) => `${k} ×${n}`).join(', ')} …).`,
  '',
  '### Poprawki (POPRAWIĆ)',
  list(fixes, r => ` — ${Object.entries(r.fixes).map(([k, x]) => `${k}: ${fmtVal(x)}`).join('; ')}`),
  '',
  '### Scalenia (SCALIĆ → zostaje)',
  list(merges, r => ` → **${r.mergeInto}**`),
  '',
  '### Do usunięcia (USUNĄĆ; w danych użytkownika — archiwizacja)',
  list(removes, r => ` — ${r.note}`),
  '',
  `### Zmiany nazw (${renames.length})`,
  list(renames, r => ` → ${r.fixes.name}`),
  '',
  '### Niszowe (ukryć w domyślnych listach)',
  recs.filter(r => r.scope === 'NISZOWE').map(r => r.name).join(' · '),
  END,
].join('\n');

const i = md.indexOf(START), j = md.indexOf(END);
if (i < 0 || j < 0) { console.error('brak znaczników'); process.exit(1); }
const next = md.slice(0, i) + out + md.slice(j + END.length);
if (process.argv.includes('--check')) {
  if (next !== md) { console.error('L2-zrodla.md nieaktualne — uruchom z --write'); process.exit(1); }
  console.log('OK');
} else if (process.argv.includes('--write')) {
  writeFileSync(mdPath, next);
  console.log('zapisano', recs.length);
} else console.log(out);
