#!/usr/bin/env node
// Inwentarz przekładu (W-03, 11.11.2026): ile tekstów czeka na przekład w każdym z 33 języków poza PL i EN — liczone z repo, nie ręcznie.
// Zakres: (1) teksty interfejsu — klucze słownika EN (lib/i18n.en.ts) bez wpisu w lib/locales/<język>.json (nakładki es-419/pt-BR: z językiem bazowym);
// (2) teksty „zmienione” — klucze z zestawów docs/lokalizacja/zestaw-przekladu-*.json rodzaju „zmieniony” (słownik trzyma stare tłumaczenie);
// (3) wskazówki techniki — identyfikatory lib/cues/text/pl.json bez wpisu w lib/cues/text/<język>.json (z nakładką jak wyżej);
// (4) nazwy lokalne ćwiczeń (ZB-044) — klucze NAME_EN bez nazwy w lib/nazwy-lokalne.ts (PL liczony osobno, bo też wymaga listy po recenzji).
// Użycie: node scripts/i18n/inwentarz-przekladu.mjs [--md plik.md] [--json plik.json]. Kod wyjścia 0 (to raport, nie bramka).
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const ts = createRequire(import.meta.url)('typescript');
const czytaj = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const NAKLADKI = { 'es-419': 'es', 'pt-BR': 'pt' };

/** Literały klucz → wartość z obiektu w pliku TS (słownik EN, NAME_EN, NAZWY_LOKALNE). */
export function literaly(plik) {
  const sf = ts.createSourceFile(plik, readFileSync(join(ROOT, plik), 'utf8'), ts.ScriptTarget.Latest, true);
  const w = {};
  const lit = (n) => n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n));
  const v = (n) => { if (ts.isPropertyAssignment(n) && lit(n.name) && lit(n.initializer)) w[n.name.text] = n.initializer.text; ts.forEachChild(n, v); };
  v(sf);
  return w;
}

export function inwentarz() {
  const en = literaly('lib/i18n.en.ts');
  const jezyki = readdirSync(join(ROOT, 'lib/locales')).filter((f) => /^[a-z]{2}(-[A-Za-z0-9]+)?\.json$/.test(f)).map((f) => f.slice(0, -5)).sort();
  const slow = Object.fromEntries(jezyki.map((j) => [j, czytaj(`lib/locales/${j}.json`)]));
  const zmienione = new Set(readdirSync(join(ROOT, 'docs/lokalizacja')).filter((f) => /^zestaw-przekladu-.*\.json$/.test(f))
    .flatMap((f) => (czytaj(`docs/lokalizacja/${f}`).klucze ?? []).filter((k) => k.rodzaj === 'zmieniony' && !k.id && !k.zrodlo).map((k) => k.pl)));
  const cuePl = czytaj('lib/cues/text/pl.json');
  const cue = Object.fromEntries(jezyki.map((j) => [j, existsSync(join(ROOT, `lib/cues/text/${j}.json`)) ? czytaj(`lib/cues/text/${j}.json`) : {}]));
  const nazwyEn = Object.keys(literaly('lib/nazwy-en.generated.ts'));
  const nlSrc = readFileSync(join(ROOT, 'lib/nazwy-lokalne.ts'), 'utf8');
  const nl = /NAZWY_LOKALNE[^=]*=\s*\{\s*\}/.test(nlSrc) ? {} : null; // dziś pusta mapa; po wypełnieniu liczenie z pliku danych
  const ma = (j, d, k) => k in d[j] || (NAKLADKI[j] && k in d[NAKLADKI[j]]);
  const wiersze = jezyki.map((j) => {
    const ui = Object.keys(en).filter((k) => !ma(j, slow, k));
    const zm = [...zmienione].filter((k) => ma(j, slow, k));
    const wsk = Object.keys(cuePl).filter((k) => !ma(j, cue, k));
    const nazwy = nl ? nazwyEn.length : null;
    return { jezyk: j, ui, zmienione: zm, wskazowki: wsk, nazwyLokalne: nazwy };
  });
  return { kluczyEn: Object.keys(en).length, wskazowekPl: Object.keys(cuePl).length, cwiczenBiblioteki: nazwyEn.length, wiersze };
}

function md(r) {
  const L = ['# Inwentarz przekładu W-03', '', `Wygenerowane: \`node scripts/i18n/inwentarz-przekladu.mjs --md docs/lokalizacja/inwentarz-w03.md\` (nie edytować ręcznie).`, '',
    `Słownik EN: ${r.kluczyEn} kluczy · wskazówki PL: ${r.wskazowekPl} · ćwiczenia biblioteki (NAME_EN): ${r.cwiczenBiblioteki}.`, '',
    '| Język | UI bez przekładu | UI zmienione (stare tłumaczenie) | Wskazówki bez przekładu | Nazwy lokalne bez wpisu |', '|---|---:|---:|---:|---:|'];
  for (const w of r.wiersze) L.push(`| ${w.jezyk} | ${w.ui.length} | ${w.zmienione.length} | ${w.wskazowki.length} | ${w.nazwyLokalne ?? '—'} |`);
  const unik = (pole) => [...new Set(r.wiersze.flatMap((w) => w[pole]))].sort();
  L.push('', '## Klucze (suma unikalnych po językach)', '');
  for (const [pole, tyt] of [['ui', 'UI bez przekładu'], ['zmienione', 'UI zmienione'], ['wskazowki', 'Wskazówki bez przekładu']]) {
    const u = unik(pole); L.push(`### ${tyt}: ${u.length}`, '', ...u.map((k) => `- ${k.replace(/\n/g, ' ')}`), '');
  }
  return L.join('\n') + '\n';
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const a = process.argv.slice(2), r = inwentarz();
  const i = a.indexOf('--md'); if (i >= 0) writeFileSync(a[i + 1], md(r));
  const k = a.indexOf('--json'); if (k >= 0) writeFileSync(a[k + 1], JSON.stringify(r, null, 1) + '\n');
  if (i < 0 && k < 0) process.stdout.write(md(r));
}
