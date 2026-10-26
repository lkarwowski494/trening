#!/usr/bin/env node
// Bramka adresów wydania (audyt 1.0, B-01/B-02; L-037 rejestr ryzyk): każdy adres wpisany w aplikację (lib/products.ts: *_URL) i w store/app-store-urls.json
// (prywatność, wsparcie, marketing) musi zwracać 200, a strony Trening (prywatność, wsparcie, espresso) muszą mieć na żywo tę samą treść co site/ (w tym znacznik
// wersji „wersja aplikacji X”). Strona marki apps4brew.com to osobne repo (apps4brew-www) z kopią site/ — rozjazd = brak strony albo stara treść u recenzenta.
// NIE jest częścią `npm run verify` (verify działa offline). Krok bramki wydania: docs/48 Faza A (Z-11), ręcznie workflow „Sprawdzenie adresów” (check-urls.yml).
// Użycie: node scripts/check-urls.mjs [--tylko-statusy]   (kod 1 = niezgodność lub adres nie zwraca 200)
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const ENCJE = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const dekoduj = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => (e[0] === '#' ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : ENCJE[e.toLowerCase()] ?? m));
/** Tekst bez znaczników, z zwiniętymi odstępami (jednakowo dla źródła i strony na żywo). */
export const tekst = (html) => dekoduj(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Adresy z lib/products.ts (`export const X_URL = '…'`) i store/app-store-urls.json. */
export function adresy(root = ROOT) {
  const out = new Map();
  const p = readFileSync(join(root, 'lib/products.ts'), 'utf8');
  for (const m of p.matchAll(/export const (\w+_URL)\s*=\s*'(https:\/\/[^']+)'/g)) out.set(m[2], `lib/products.ts ${m[1]}`);
  const j = JSON.parse(readFileSync(join(root, 'store/app-store-urls.json'), 'utf8'));
  for (const [k, v] of Object.entries(j)) if (typeof v === 'string' && /^https:\/\//.test(v)) out.set(v, out.get(v) ?? `store/app-store-urls.json ${k}`);
  return [...out.entries()].map(([url, zrodlo]) => ({ url, zrodlo }));
}

/** Fragmenty tekstu strony źródłowej site/*.html, które muszą być na stronie na żywo (sekcje pl i en, bez elementów, które eksport celowo pomija: h1, marka, zgłoszenia na GitHubie). */
export function fragmenty(html) {
  const out = [];
  for (const sec of html.matchAll(/<section lang="(pl|en)"[^>]*>([\s\S]*?)<\/section>/g)) {
    const body = sec[2].replace(/<h1[\s\S]*?<\/h1>/g, '').replace(/<p class="brand"[\s\S]*?<\/p>/g, '').replace(/<p>(?:Zgłoszenia techniczne|You can also report technical issues)[\s\S]*?<\/p>/g, '');
    for (const b of body.matchAll(/<(h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) { const t = tekst(b[2]); if (t) out.push(`${sec[1]}: ${t}`); }
  }
  return out;
}
/** Które fragmenty źródła nie występują w tekście strony na żywo (wartość: lista brakujących, pusta = zgodne). */
export function brakujace(zrodloHtml, zywaHtml) {
  const zywy = tekst(zywaHtml);
  return fragmenty(zrodloHtml).filter((f) => !zywy.includes(f.slice(f.indexOf(': ') + 2)));
}
/** Znacznik wersji „(wersja aplikacji X)” / „(app version X)” ze strony prywatności — wszystkie wystąpienia. */
export const wersje = (html) => [...tekst(html).matchAll(/(?:wersja aplikacji|app version) (\d+\.\d+\.\d+)/g)].map((m) => m[1]);

async function pobierz(url) {
  let ost;
  for (let i = 0; i < 3; i++) {
    try { const r = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'trening-check-urls' } }); return { status: r.status, html: r.status === 200 ? await r.text() : '' }; }
    catch (e) { ost = e; await new Promise((s) => setTimeout(s, 1500)); }
  }
  return { status: 0, html: '', blad: String(ost?.message ?? ost).slice(0, 120) };
}

export async function main(argv = process.argv.slice(2), root = ROOT) {
  const tylkoStatusy = argv.includes('--tylko-statusy'); let zle = 0;
  for (const { url, zrodlo } of adresy(root)) {
    const r = await pobierz(url);
    const sciezka = (() => { try { return new URL(url).pathname; } catch { return ''; } })();
    const plik = /^\/trening\/[\w-]+\.html$/.test(sciezka) ? join(root, 'site', basename(sciezka)) : null;
    const wiersze = [];
    if (r.status !== 200) wiersze.push(`status ${r.status}${r.blad ? ` (${r.blad})` : ''}`);
    else if (plik && !tylkoStatusy) {
      if (!existsSync(plik)) wiersze.push(`brak pliku źródłowego ${plik}`);
      else {
        const src = readFileSync(plik, 'utf8'); const brak = brakujace(src, r.html);
        if (brak.length) wiersze.push(`treść na żywo różni się od site/${basename(plik)}: brak ${brak.length} fragmentów, np. „${brak[0].slice(0, 90)}”`);
        const ws = new Set(wersje(src)), wz = new Set(wersje(r.html));
        if (ws.size && [...ws].some((v) => !wz.has(v))) wiersze.push(`znacznik wersji: źródło ${[...ws].join(',')}, na żywo ${[...wz].join(',') || 'brak'}`);
      }
    }
    console.log(`${wiersze.length ? 'BŁĄD' : 'OK  '} ${url}  [${zrodlo}]${wiersze.length ? '\n     ' + wiersze.join('\n     ') : ''}`);
    zle += wiersze.length ? 1 : 0;
  }
  console.log(zle ? `\n${zle} adres(y) niezgodne — wydania nie robić (rejestr ryzyk docs/40).` : '\nWszystkie adresy zwracają 200, treść zgodna z site/.');
  return zle ? 1 : 0;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().then((c) => process.exit(c));
