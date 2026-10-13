// Katalog przepływów użytkownika (polecenie właściciela 13.10.2026: scenariusze Maestro zastępują ręczne testowanie właściciela).
// Źródło prawdy: tests/przeplywy.json. Z niego generowane są dokumenty (wzór: scripts/test-matrix.mjs, cues/gen.mjs --check):
//   docs/37-katalog-przeplywow.md      — wszystkie przepływy: kroki, wynik, stan startowy, realność, pokrycie,
//   docs/39-lista-kontrolna-wydania.md — to, czego nie sprawdzi żaden automat (telefon / właściciel), z konkretną kontrolą.
// Walidację (scenariusze istnieją, znaczniki w YAML, każdy ekran ma przepływ) robi tests/przeplywy.test.ts w `npm run verify`.
// Użycie: node scripts/flows-catalog.mjs --write | --check (dokumenty nieaktualne → kod 1)
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const cat = JSON.parse(readFileSync(join(root, 'tests/przeplywy.json'), 'utf8'));
const esc = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');

/** Rodzaj pokrycia przepływu (jedno miejsce — używa go też tests/przeplywy.test.ts). */
export function pokrycie(f) {
  if (f.projekt) return 'Projekt 0.20';
  if (f.scenariusz) return f.tryb === 'eksperyment' ? 'Maestro (eksperyment)' : 'Maestro';
  if (f.wyjatek?.typ === 'jest') return 'Jest';
  return 'Telefon';
}
const cell = f => {
  switch (pokrycie(f)) {
    case 'Maestro': case 'Maestro (eksperyment)': return `${pokrycie(f)}: \`.maestro/${f.scenariusz}\``;
    case 'Projekt 0.20': return `Projekt: \`${f.projekt.scenariusz}\` — czeka na: ${f.projekt.czeka_na}`;
    case 'Jest': return `Jest: ${f.wyjatek.zastepnik.map(x => `\`${x}\``).join(', ')} — ${f.wyjatek.powod}`;
    default: return `Telefon (lista kontrolna wydania) — ${f.wyjatek.powod}`;
  }
};

export function renderCatalog() {
  const fl = cat.przeplywy; const L = [];
  const count = (pred) => fl.filter(pred).length;
  L.push('# 37. Katalog przepływów użytkownika (generowany — nie edytować ręcznie)', '');
  L.push('Wygenerowano z `tests/przeplywy.json` poleceniem `node scripts/flows-catalog.mjs --write`. Zasada właściciela z 13.10.2026: scenariusze Maestro mają w pełni zastąpić ręczne testowanie',
    'właściciela w każdym przypadku sensownym z perspektywy użytkownika; warianty kombinatoryczne (35 języków, setki kombinacji danych) zostają w Jest. Bramka: `tests/przeplywy.test.ts` (część `npm run verify`) —',
    'każdy przepływ ma istniejący scenariusz Maestro (ze znacznikami kroków w pliku) albo wyjątek z powodem i zastępnikiem; każdy scenariusz `.maestro/NN-*.yaml` jest przypisany do przepływu;',
    'każdy ekran z `app/` występuje w co najmniej jednym przepływie (nowy ekran bez przepływu blokuje verify, tak jak `check:matrix`). Szczegóły i luki: `docs/38-przeplywy-i-luki-e2e.md`, lista dla właściciela: `docs/39-lista-kontrolna-wydania.md`.', '');
  L.push('## Podsumowanie', '');
  L.push(`Przepływów w katalogu: **${fl.length}** (realny: ${count(f => f.realnosc === 'realny')}, brzegowy: ${count(f => f.realnosc === 'brzegowy')}); pominięte jako teoretyczne: ${cat.pominiete.length} (na końcu).`, '');
  L.push('| Stan startowy | Przepływów | Opis |', '|---|---|---|');
  for (const [k, v] of Object.entries(cat.stany)) L.push(`| \`${k}\` | ${count(f => f.stan === k)} | ${esc(v)} |`);
  L.push('', '| Pokrycie | Przepływów |', '|---|---|');
  for (const p of ['Maestro', 'Maestro (eksperyment)', 'Jest', 'Telefon', 'Projekt 0.20']) L.push(`| ${p} | ${count(f => pokrycie(f) === p)} |`);
  L.push('', '„Maestro (eksperyment)” — scenariusz z krokami, których nikt jeszcze nie uruchomił na symulatorze (okna systemowe, tło, wybór pliku); znacznik `eksperyment`, poza listą `flows` w `.maestro/config.yaml`, uruchamiany osobno (docs/38 pkt 5).', '');
  for (const [g, nazwa] of Object.entries(cat.grupy)) {
    const gl = fl.filter(f => f.id.startsWith(g + '-')); if (!gl.length) continue;
    L.push(`## ${g} — ${nazwa}`, '', '| ID | Przepływ i kroki | Oczekiwany wynik | Stan | Realność | Pokrycie |', '|---|---|---|---|---|---|');
    for (const f of gl) L.push(`| ${f.id} | **${esc(f.tytul)}** — ${esc(f.kroki.join(' → '))} | ${esc(f.wynik)} | \`${f.stan}\` | ${f.realnosc} | ${esc(cell(f))} |`);
    L.push('');
  }
  L.push('## Pominięte jako teoretyczne (CLAUDE.md, „Audyty i wydania” pkt 6)', '', '| Przepływ | Powód |', '|---|---|');
  for (const p of cat.pominiete) L.push(`| ${esc(p.opis)} | ${esc(p.powod)} |`);
  L.push('');
  return L.join('\n');
}

export function renderChecklist() {
  const fl = cat.przeplywy.filter(f => f.wyjatek?.typ === 'telefon'); const L = [];
  L.push('# 39. Lista kontrolna wydania dla właściciela (generowana — nie edytować ręcznie)', '');
  L.push('Wygenerowano z `tests/przeplywy.json` (`node scripts/flows-catalog.mjs --write`). To jedyne rzeczy, których nie sprawdzi żaden automat (symulator CI, Maestro, Jest) — wymagają prawdziwego telefonu',
    'albo Ciebie. Wszystko inne robią scenariusze Maestro (`docs/37`) przy każdym wydaniu. Kolejność dowolna; całość na jednym telefonie z TestFlight to ok. 15–20 minut.', '',
    'Zasada: odhacz każdy punkt dla wersji, którą wypuszczasz; wada → wiadomość do agenta z numerem punktu (np. „PR-12”). Punkty wersji 0.20 obowiązują od jej wydania.', '');
  const grupy = {};
  for (const f of fl) (grupy[f.id.slice(0, 2)] ??= []).push(f);
  let n = 0;
  for (const [g, items] of Object.entries(grupy)) {
    L.push(`## ${cat.grupy[g] ?? g}`, '');
    for (const f of items) { n++; L.push(`- [ ] **${f.id}** ${f.tytul}${f.wersja === '0.20' ? ' *(od 0.20)*' : ''}`, `  - Co zrobić i czego oczekiwać: ${f.wyjatek.kontrola}`, `  - Dlaczego nie automat: ${f.wyjatek.powod}`, ...(f.wyjatek.zastepnik.length ? [`  - Pokrycie zastępcze w Jest: ${f.wyjatek.zastepnik.map(x => `\`${x}\``).join(', ')}`] : [])); }
    L.push('');
  }
  L.push(`Razem punktów: **${n}**.`, '');
  return L.join('\n');
}

const OUT = { 'docs/37-katalog-przeplywow.md': renderCatalog, 'docs/39-lista-kontrolna-wydania.md': renderChecklist };
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const mode = process.argv[2]; let bad = 0;
  for (const [file, fn] of Object.entries(OUT)) {
    const want = fn(); const path = join(root, file);
    if (mode === '--write') { writeFileSync(path, want); console.log('zapisano', file); }
    else if (!existsSync(path) || readFileSync(path, 'utf8') !== want) { console.error(`${file} nieaktualny — node scripts/flows-catalog.mjs --write`); bad++; }
  }
  if (mode !== '--write' && mode !== '--check') { console.error('Użycie: node scripts/flows-catalog.mjs --write | --check'); process.exit(2); }
  process.exit(bad ? 1 : 0);
}
