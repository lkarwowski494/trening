#!/usr/bin/env node
// Układ podpisów na ramkach zrzutów App Store (store-frames.sh; przegląd ramek przebiegu 40942847798, 29.10.2026). Wcześniej `caption:` z ImageMagick dobierał rozmiar
// czcionki osobno dla każdego obrazu i łamał wiersze tylko na spacjach: w jednym języku podpisy miały różne rozmiary, pojedyncze słowo lądowało w trzecim wierszu,
// a japoński i chiński (bez spacji) były cięte w środku słowa, także przed małą kaną i przecinkiem „、”.
// Teraz: jeden rozmiar czcionki na język (największy, przy którym każdy z jego podpisów mieści się w polu w 1 albo 2 wierszach), podział na 2 wiersze wyrównane
// szerokością, tylko między słowami — ja i zh-Hant dzielone przez Intl.Segmenter; interpunkcja i w japońskim cząstki pisane hiraganą (を, も, で…) doklejone do poprzedniego słowa.
// Użycie: node scripts/ci/store-caption-layout.mjs <plik_podpisów> <język> <czcionka> <szerokość_pola> <wysokość_pola>
//   → stdout JSON {"pointsize": P, "podpisy": {"<ekran>": "wiersz 1\nwiersz 2"}}; pomiar tekstu: ImageMagick `convert … label:` (szerokość i wysokość przy 100 pt).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const NO_SPACES = new Set(['ja', 'zh-Hant']);
/** Znaki, od których wiersz nie może się zaczynać (interpunkcja zamykająca; japońskie i chińskie zasady łamania). */
const NO_LINE_START = /^[、。，．,.!?！？:：;；)）\]」』…・ー]+$/u;
/** Podział zaraz po przecinku, pytajniku albo myślniku ma pierwszeństwo (jeśli mieści się w rozmiarze języka) — nie rozdziela fraz. */
const AFTER_PUNCT = /[,，、?？:：;；—–]$/u;
const HIRAGANA_ONLY = /^[ぁ-ゟ]+$/u;

/** Słowa (jednostki, między którymi wolno złamać wiersz) wraz z separatorem, który je poprzedza. */
export function tokens(lang, text) {
  if (!NO_SPACES.has(lang)) return text.split(/ +/).filter(Boolean).map((w, i) => ({ w, sep: i ? ' ' : '' }));
  const out = []; let sep = '';
  for (const { segment } of new Intl.Segmenter(lang, { granularity: 'word' }).segment(text)) {
    if (segment.trim() === '') { sep = ' '; continue; } /* spacja (np. przed „App”) zostaje separatorem przed następnym słowem */
    const glue = out.length && !sep && (NO_LINE_START.test(segment) || (lang === 'ja' && HIRAGANA_ONLY.test(segment)));
    if (glue) out[out.length - 1].w += segment; else out.push({ w: segment, sep });
    sep = '';
  }
  return out;
}

/** Kandydaci układu: jeden wiersz i każdy podział na dwa wiersze między słowami. */
export function layouts(toks) {
  const join = a => a.map((t, i) => (i ? t.sep : '') + t.w).join('');
  const out = [join(toks)];
  /* Bez podziału zaraz po jednoliterowym słowie („a”, „i”, „v”, „z” — w cs, sk, pl, hr błąd składu; w innych językach też wygląda źle). */
  for (let i = 1; i < toks.length; i++) if (!/^\p{L}$/u.test(toks[i - 1].w)) out.push(`${join(toks.slice(0, i))}\n${join(toks.slice(i))}`);
  return out;
}

/** Największy rozmiar (pt), przy którym tekst mieści się w polu W×H — pomiar przy 100 pt skaluje się liniowo. */
export const fit = ({ w, h }, W, H) => Math.floor(100 * Math.min(W / w, H / h));

/**
 * Wybór rozmiaru języka i układu każdego podpisu. `measure(text)` → {w, h} przy 100 pt.
 * Rozmiar języka = najmniejszy z najlepszych rozmiarów jego podpisów; przy nim podpis bierze jeden wiersz, jeśli się mieści, inaczej podział po znaku interpunkcyjnym, a w dalszej kolejności najwęższy.
 */
export function plan(lang, captions, W, H, measure) {
  const opts = Object.fromEntries(Object.entries(captions).map(([k, text]) =>
    [k, layouts(tokens(lang, text)).map(t => ({ t, f: fit(measure(t), W, H), w: measure(t).w }))]));
  const pointsize = Math.min(...Object.values(opts).map(o => Math.max(...o.map(x => x.f))));
  const podpisy = {};
  for (const [k, o] of Object.entries(opts)) {
    const ok = o.filter(x => x.f >= pointsize);
    /* Dwa wiersze ogranicza zwykle wysokość pola, więc wiele podziałów ma ten sam rozmiar — wygrywa najwęższy, czyli najrówniejszy. */
    const poZnaku = ok.filter(x => AFTER_PUNCT.test(x.t.split('\n')[0] ?? ''));
    podpisy[k] = (ok.find(x => !x.t.includes('\n')) ?? (poZnaku.length ? poZnaku : ok).sort((a, b) => a.w - b.w)[0]).t;
  }
  return { pointsize, podpisy };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [file, lang, font, W, H] = process.argv.slice(2);
  const caps = JSON.parse(readFileSync(file, 'utf8')).podpisy[lang] ?? {};
  const cache = new Map();
  const measure = t => {
    if (!cache.has(t)) {
      const [w, h] = execFileSync('convert', ['-font', font, '-pointsize', '100', `label:${t}`, '-format', '%w %h', 'info:'], { encoding: 'utf8' }).trim().split(' ').map(Number);
      cache.set(t, { w, h });
    }
    return cache.get(t);
  };
  process.stdout.write(JSON.stringify(plan(lang, caps, Number(W), Number(H), measure)));
}
