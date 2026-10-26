#!/usr/bin/env node
// Polecenia do ręcznego generowania póz figur v2 w aplikacji Gemini (decyzja właściciela 26.10.2026, docs/52 pkt 7): jedno polecenie na rodzinę ruchu (część rodziny przy > 8 ćwiczeniach),
// właściciel wkleja je do rozmowy, odpowiedź (jeden blok JSON) zapisuje do pliku i wczytuje: node scripts/figures/gemini-pozy.mjs --z-pliku <plik> (import, walidacja, polecenie poprawkowe).
// Użycie:
//   node scripts/figures/gemini-polecenia.mjs --rodzina pull_up --wyjscie <katalog>
//   node scripts/figures/gemini-polecenia.mjs --wszystkie --wyjscie <katalog>        (każda rodzina, której pozy nie są jeszcze gotowe; pliki <id>.md albo <id>-1.md, <id>-2.md…)
// Liczby (zakresy stawów, tolerancje, minimalny ruch) pochodzą z silnika (CONTRACT, TOL, lib/figures/data.json) — nie są przepisane ręcznie. Nic nie jest zapisywane w repozytorium.
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cwiczeniaRodziny, wczytajKontrakt } from './gemini-pozy.mjs';
import { loadV2 } from './v2-build.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const czytaj = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** Najwięcej ćwiczeń w jednej części i górna granica długości polecenia (znaki) — mieści się w oknie czatu z zapasem. */
export const MAX_CWICZEN_W_CZESCI = 12; /* docs/52 pkt 7: jedno polecenie na rodzinę, gdy odpowiedź mieści się w jednej wiadomości (ok. 4 tys. znaków na pozę); większe rodziny dzielone */
export const MAX_ZNAKOW = 30000;

/* ---------- rodziny i dane ---------- */
/** Tabela rodzin z docs/51 (generowana z kodu): { id, stan, widoki, opis }. */
export function rodzinyZDokumentu(plik) {
  const wynik = [];
  for (const l of readFileSync(plik, 'utf8').split('\n')) {
    const m = /^\| `([a-z_0-9]+)` \| ([^|]+) \| (\d+) \| ([^|]+) \| [^|]+ \| (.*) \|$/.exec(l);
    if (m) wynik.push({ id: m[1], stan: m[2].trim(), widoki: m[4].trim(), opis: m[5].trim() });
  }
  return wynik;
}
/** Pozy już zapisane w danych (lib/figures/v2/poses/<rodzina>.json): zbiór kluczy ćwiczeń. */
export function pozyGotowe(rodzina, root = ROOT) {
  const p = join(root, 'lib/figures/v2/poses', `${rodzina}.json`);
  return existsSync(p) ? czytaj(p) : { cwiczenia: {} };
}
/** Ćwiczenia rodziny, którym brakuje pozy (rodzina gotowa w kodzie → pusta lista). */
export function doZrobienia(rodzina, { root = ROOT, lista } = {}) {
  const r = rodzinyZDokumentu(lista ?? join(root, 'docs/51-figury-v2-pokrycie.md')).find((x) => x.id === rodzina);
  if (!r) throw new Error(`rodzina „${rodzina}” nie występuje w docs/51`);
  if (r.stan === 'gotowa') return [];
  const mam = pozyGotowe(rodzina, root).cwiczenia ?? {};
  return cwiczeniaRodziny(rodzina, lista ?? join(root, 'docs/51-figury-v2-pokrycie.md')).filter((c) => !(c in mam));
}
export function podzielNaCzesci(lista, max = MAX_CWICZEN_W_CZESCI) {
  const n = Math.max(1, Math.ceil(lista.length / max)); const roz = Math.ceil(lista.length / n); /* równe części */
  return Array.from({ length: n }, (_, i) => lista.slice(i * roz, (i + 1) * roz)).filter((x) => x.length);
}
/** Identyfikatory plików poleceń rodziny: [{ id, cwiczenia }] — `<rodzina>` albo `<rodzina>-1`, `-2`… */
export function czesciRodziny(rodzina, opcje) {
  const cz = podzielNaCzesci(doZrobienia(rodzina, opcje));
  return cz.map((cwiczenia, i) => ({ id: cz.length === 1 ? rodzina : `${rodzina}-${i + 1}`, numer: i + 1, ile: cz.length, cwiczenia }));
}

/* ---------- silnik (liczby) ---------- */
let silnikCache = null;
const silnik = () => (silnikCache ??= loadV2(mkdtempSync(join(tmpdir(), 'polecenia-'))));

/* ---------- opis pól (zwięzła tabela ze schematu) ---------- */
const rowne = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function typ(s) {
  if (s.enum) return s.enum.join('|');
  if (s.type === 'number') return `liczba${s.minimum !== undefined ? ` ${s.minimum}…${s.maximum}` : ''}`;
  if (s.type === 'array' && s.items?.type === 'number') return `[${s.minItems} liczby]`;
  if (s.type === 'array') return `tablica${s.minItems !== undefined ? ` ${s.minItems}–${s.maxItems}` : ''}`;
  return s.type;
}
/** Linie „ścieżka (typ) — opis” dla schematu; strony R i L o identycznym schemacie zapisane raz jako R/L. */
export function opisPol(schemat, wciecie = '', sciezka = '', out = []) {
  const wlasc = schemat.properties ?? {}; const wym = new Set(schemat.required ?? []);
  const klucze = Object.keys(wlasc).filter((k) => !(k === 'L' && rowne(wlasc.R, wlasc.L)));
  for (const k of klucze) {
    const s = wlasc[k]; const nazwa = k === 'R' && wlasc.L && rowne(wlasc.R, wlasc.L) ? 'R/L' : k; const p = `${sciezka}${sciezka ? '.' : ''}${nazwa}`;
    const dziecko = s.type === 'array' && s.items?.type === 'object' ? s.items : s.type === 'object' ? s : null;
    out.push(`${wciecie}- ${p}${s.type === 'array' && dziecko ? '[]' : ''} (${typ(s)}${wym.has(k) ? ', wymagane' : ', opcjonalne'})${s.description ? ` — ${s.description}` : ''}`);
    if (dziecko) opisPol(dziecko, wciecie, p + (s.type === 'array' ? '[]' : ''), out);
  }
  return out;
}

/* ---------- wymagania liczbowe (z walidatora) ---------- */
export function wymagania(rodzina) {
  const { v2 } = silnik(); const C = v2.CONTRACT; const rom = czytaj(join(ROOT, 'lib/figures/data.json')).rom; const al = v2.templateFor(rodzina).allow;
  const S = rom.side; const lim = (k, max) => `${S[k].min}°…${max ?? S[k].max}°`;
  return [
    `RUCH: poza u = 1 musi różnić się od u = 0 o co najmniej ${C.minMotionCm} cm (największe przemieszczenie dowolnego punktu: dłoń, kolano, miednica…). Zbyt mały ruch to najczęstsza przyczyna odrzucenia.`,
    `KLATKI: ${C.frames.min}–${C.frames.max} klatek, rosnące u, pierwsza u = 0, ostatnia u = 1. Interpolacja między klatkami jest LINIOWA, a żaden punkt ciała nie może skoczyć o więcej niż ${C.maxJump} cm na 1/${C.step} ruchu — dla ruchu zakrzywionego dodaj klatki pośrednie (zwykle 4–7).`,
    `ZAKRESY STAWÓW (sprawdzane w każdej fazie ruchu, obie strony): biodro ${lim('hip')}, kolano ${lim('knee')}, kostka ${lim('ankle')}, łokieć ${lim('el', al?.elbow)}, bark w płaszczyźnie strzałkowej ${lim('sh', al?.shSag)} (sprawdzany, gdy ramię nie jest odwiedzione), uniesienie ramienia 0°…${al?.shElev ?? rom.front.abd.max}°.${al ? ` Wyjątek tej rodziny: ${al.why}.` : ''} Kostka bywa przekraczana przy stopach luźno zwisających — ustaw podbicie tak, by kąt kostki mieścił się w zakresie.`,
    `PRZENIKANIE: ciało nie może wnikać w sprzęt (drążek, słupek, ławkę, skrzynię) więcej niż ${v2.TOL.pen} cm — dotyczy też pozy z zastosowanym błędem (głowa i tułów względem drążka są najczęstszym naruszeniem; zostaw wokół drążka zapas kilku cm). Najniższy punkt stopy nie niżej niż y = 0 (tolerancja ${v2.TOL.floor} cm).`,
    `CHWYT: środek chwytu każdej dłoni leży na osi sztangi/drążka (tolerancja 0,6 cm) w KAŻDEJ klatce i w każdej klatce błędu; chwyt w zasięgu ramienia od barku (≤ ${v2.BODY.uarm + v2.BODY.farm + v2.BODY.hand} cm), kostka w zasięgu nogi od biodra (≤ ${v2.BODY.thigh + v2.BODY.shank + v2.BODY.ankleH} cm).`,
    `BŁĘDY (bledy[]): najwyżej ${C.errorsMax}, tylko z listy identyfikatorów podanej przy ćwiczeniu (inne = odrzucenie; brak listy = bledy: []). Każdy błąd: ${C.errorFrames.min}–${C.errorFrames.max} klatek z deltami, pierwsza u = 0 i delta ZEROWA, ostatnia u = 1. Błąd ma być widoczny (≥ ${C.visibleCm} cm albo ≥ ${C.visibleDeg}° w którymś stawie).`,
    `DOTYCZY: każdy kąt (biodro, kolano, kostka, łokieć, bark) zmieniony przez deltę o więcej niż ${C.undeclaredDeg}° MUSI być zadeklarowany w „dotyczy” (hip, knee, ankle, elbow, shoulder; do tego spine, kneeLat, heel, pelvis, bar). Zmiana pozycji dłoni zmienia łokieć i bark — zadeklaruj elbow i shoulder albo nie zmieniaj chwytu w delcie.`,
    'WYMIARY: współrzędne w cm, kąty w stopniach, liczby z co najwyżej jednym miejscem po przecinku. Strona R ma z dodatnie, L ujemne (symetrycznie względem z = 0).',
  ];
}


/* ---------- punkty odniesienia (liczby i relacje w układzie kontraktu) ---------- */
const f0 = (x) => Math.round(x * 10) / 10;
/** Relacje faz specyficzne dla rodziny (liczone z wymiarów sylwetki i domyślnego sprzętu); brak wpisu → tylko reguły ogólne. */
const FAZY = {
  pull_up: (g) => {
    const bar = g.defaultGear.find((x) => x.rodzaj === 'sztanga'); const r = g.reach; const h = g.BODY; const w = h.trunk + h.neckUp + h.headFromC7;
    return [
      `Zwis (u = 0): ramiona proste (kąt łokcia 0–15°), więc przy pionowym tułowiu miednica.y ≈ drążek.y − ${f0(r)} − ${h.trunk} = ${f0(bar.y - r - h.trunk)} cm (dla drążka y = ${bar.y}); stopy nad podłogą: kostka.y ≥ ${h.ankleH} i najlepiej ≥ 20 cm.`,
      `Chwyt: x = x drążka (${bar.x}), y = y drążka (${bar.y}), z = ±(połowa rozstawu dłoni): wąski ±10…15, standard ±20…25, szeroki ±30…40 cm. Rozstaw większy od szerokości barków (±${h.shHalf}) ustawia łokcie na zewnątrz.`,
      `Góra (u = 1): broda nad drążkiem — środek głowy leży ok. ${f0(w)} cm nad miednicą przy pionowym tułowiu (miednica.y + ${f0(w)}), broda ≈ 9,5 cm niżej, więc cel: miednica.y + ${f0(w - h.headR)} ≥ drążek.y, czyli miednica.y ≥ ${f0(bar.y - w + h.headR)} cm. Łokcie zgięte do 90–140°, nigdy powyżej 149°.`,
      `Głowa nie przenika drążka: w górze przesuń głowę w x o ok. 10–20 cm do przodu lub do tyłu względem drążka (pochylenieGlowy i pochylenieTulowia), albo odchyl tułów do tyłu (pochylenieTulowia −10…−25°) — nie prowadź głowy przez oś drążka.`,
      'Między u = 0 a u = 1: miednica unosi się o ok. 45–60 cm; dodaj klatki pośrednie (u = 0.25, 0.5, 0.75), łokcie zginają się stopniowo.',
    ];
  },
};
export function punktyOdniesienia(rodzina) {
  const { v2 } = silnik(); const B = v2.BODY; const t = v2.templateFor(rodzina); const reach = B.uarm + B.farm + B.hand;
  const L = [
    '- Układ: x = przód, y = góra, z = prawa strona osoby. Podłoga: y = 0 (podeszwa stopy nie niżej). Płaszczyzna symetrii: z = 0.',
    `- Sprzęt domyślny rodziny (wzór do skopiowania i dopasowania): ${JSON.stringify(t.defaultGear)}`,
    `- Segmenty ciała (cm, stałe): udo ${B.thigh}, podudzie ${B.shank}, wysokość kostki ${B.ankleH}, tułów miednica→bark ${B.trunk}, szyja ${B.neckUp}, środek głowy ${B.headFromC7} nad barkiem, promień głowy ${B.headR}, ramię ${B.uarm}, przedramię ${B.farm}, dłoń ${B.hand}; biodra ±${B.hipHalf}, barki ±${B.shHalf} od z = 0.`,
    `- Przy pionowym tułowiu (pochylenieTulowia 0, zgiecieKregoslupa 0): bark = miednica + [0, ${B.trunk}, ±${B.shHalf}], środek głowy = miednica + [0, ${B.trunk + B.neckUp + B.headFromC7}, 0]. Przy pochyleniu α tułów odchyla się od pionu o α° (do przodu dodatnie).`,
    `- Zasięg: chwyt do ${reach} cm od barku (ramię proste = ${reach} cm), kostka do ${B.thigh + B.shank + B.ankleH} cm od biodra. Leżąca poza (ławka, podłoga): tułów poziomo = pochylenieTulowia 90.`,
    '- Konwencja kątów w walidatorze: 0° = staw wyprostowany, kąt rośnie ze zgięciem (łokieć prosty = 0°, zgięty maks. 149°; kolano prosty 0°, maks. 141°). „Łokcie wyprostowane ≥ 165°” w zapisie anatomicznym to tutaj 0–15°.',
  ];
  const f = FAZY[rodzina]; const bar = t.defaultGear.find((x) => x.rodzaj === 'sztanga');
  if (f && bar) L.push('- Relacje faz ruchu (pozy wyjściowa i skrajna):', ...f({ defaultGear: t.defaultGear, reach, BODY: B }).map((x) => `  - ${x}`));
  else L.push('- Relacje faz: dla KAŻDEGO ćwiczenia najpierw ustal punkty kluczowe obu faz (gdzie ma być chwyt względem sprzętu, miednica, kostki — jako liczby w cm w układzie powyżej), potem zapisz klatki tak, by te relacje zachodziły; stopy opierają się o podłogę lub sprzęt, dłonie leżą na chwycie.');
  return L;
}

/* ---------- opis ćwiczeń ---------- */
export function opisCwiczenia(cw, { root = ROOT, bledyCwiczenia }) {
  const tekst = existsSync(join(root, 'lib/cues/text/pl.json')) ? czytaj(join(root, 'lib/cues/text/pl.json')) : {};
  const bledy = bledyCwiczenia(cw, root).map((id) => (tekst[id] ? `${id} (${tekst[id]})` : id));
  const cd = join(root, 'lib/cues/data.json'); const ruch = [];
  const own = existsSync(cd) ? czytaj(cd).exercises?.[cw] : null;
  for (const c of (own?.move ?? []).slice(0, 2)) if (tekst[c.c]) ruch.push(tekst[c.c]);
  if (!ruch.length) { const cs = czytaj(join(root, 'lib/figures/v2/cue-sets.json')).items?.[cw]; for (const id of (cs?.ok ?? []).slice(0, 2)) if (tekst[id]) ruch.push(tekst[id]); }
  return { klucz: cw, bledy, ruch };
}

/* ---------- polecenie ---------- */
export const FORMAT_ODPOWIEDZI = (rodzina, klucze) => [
  'FORMAT ODPOWIEDZI (obowiązkowy):',
  `- Odpowiedz JEDNYM blokiem kodu \`\`\`json zawierającym obiekt { "rodzina": "${rodzina}", "poze": { "<klucz ćwiczenia>": <poza wg kontraktu>, ... } }.`,
  `- Kluczami w "poze" są DOKŁADNIE te nazwy (bez zmian, wielkość liter jak niżej): ${klucze.map((k) => `"${k}"`).join(', ')}.`,
  '- Każda poza zawiera pola: kontrakt, rodzina, cwiczenie (= klucz), sprzet, klatki, bledy.',
  '- Bez komentarzy, bez tekstu przed i po bloku, bez dopisków w JSON, bez przecinków końcowych. Zapisz JSON zwięźle: jedna klatka w jednej linii, bez zbędnych wcięć (odpowiedź musi się zmieścić w jednej wiadomości).',
  '- Jeśli nie jesteś w stanie dopasować pozy do wymagań, i tak ją zwróć (błędy sprawdzimy my) — nie pomijaj ćwiczeń.',
];

export function budujPolecenie({ rodzina, opisRodziny, widoki, czesc, cwiczenia, przyklad, kontrakt, opisy }) {
  const L = [];
  L.push(`# Pozy figur ćwiczeń — rodzina „${rodzina}”${czesc.ile > 1 ? ` (część ${czesc.numer}/${czesc.ile})` : ''}`, '');
  L.push('Jesteś animatorem postaci do aplikacji treningowej. Tworzysz dane póz (klatki kluczowe szkieletu) dla ćwiczeń jednej rodziny ruchu. Dane wczyta program, który sprawdzi geometrię — poza niezgodna z wymaganiami zostanie odrzucona, więc trzymaj się liczb poniżej.');
  L.push(`Rodzina: ${opisRodziny}. Widoki w aplikacji: ${widoki} (pozę podajesz w 3D, widoki liczy program).`, '');
  L.push('## Kontrakt danych', '', kontrakt.opisKontraktu(rodzina), '');
  L.push('## Pola obiektu pozy', '', ...opisPol(kontrakt.schematPozy(rodzina)), '');
  L.push('## Punkty odniesienia (stałe wymiary i relacje)', '', ...punktyOdniesienia(rodzina), '');
  L.push('## Wymagania, które najczęściej łamano w próbach', '', ...wymagania(rodzina).map((x) => `- ${x}`), '');
  L.push(`## Przykład poprawnej pozy (ćwiczenie „${przyklad.cwiczenie}”, ta sama struktura; liczby dopasuj do swojego ćwiczenia)`, '', '```json', JSON.stringify(przyklad.poza), '```', '');
  L.push('## Ćwiczenia do wykonania', '', 'Dla każdego: klucz (nazwa ćwiczenia), opis ruchu (jeśli jest) i dozwolone identyfikatory błędów (pole cue).', '');
  for (const o of opisy) L.push(`- "${o.klucz}"${o.ruch.length ? ` — ruch: ${o.ruch.join(' ')}` : ''} — błędy: ${o.bledy.length ? o.bledy.join('; ') : 'brak (bledy: [])'}`);
  L.push('', '## Zasady dla każdego ćwiczenia', '', '- u = 0 to pozycja wyjściowa, u = 1 pozycja skrajna ruchu; dobierz sprzęt (sprzet[]) i chwyt do tego konkretnego ćwiczenia.', '- Poza ma być anatomicznie wiarygodna dla nazwanego ćwiczenia (chwyt, rozstaw, kierunek ruchu), ale zgodność z liczbami powyżej jest ważniejsza niż szczegół.', '');
  L.push(...FORMAT_ODPOWIEDZI(rodzina, cwiczenia));
  return L.join('\n') + '\n';
}

/** Polecenia rodziny: [{ plik, tresc, cwiczenia }]. */
export async function poleceniaRodziny(rodzina, { root = ROOT, lista } = {}) {
  const kontrakt = await wczytajKontrakt(root);
  if (!kontrakt) throw new Error('brak scripts/figures/v2-validate.mjs');
  const docs = lista ?? join(root, 'docs/51-figury-v2-pokrycie.md'); const r = rodzinyZDokumentu(docs).find((x) => x.id === rodzina);
  const wlasne = Object.entries(pozyGotowe(rodzina, root).cwiczenia ?? {})[0];
  const przykl = wlasne ? { cwiczenie: wlasne[0], poza: wlasne[1] } : (kontrakt.przyklad(rodzina)[0] ?? kontrakt.przyklad('squat')[0]);
  return czesciRodziny(rodzina, { root, lista: docs }).map((czesc) => ({
    plik: `${czesc.id}.md`, cwiczenia: czesc.cwiczenia,
    tresc: budujPolecenie({ rodzina, opisRodziny: r.opis, widoki: r.widoki, czesc, cwiczenia: czesc.cwiczenia, przyklad: przykl, kontrakt, opisy: czesc.cwiczenia.map((c) => opisCwiczenia(c, { root, bledyCwiczenia: kontrakt.bledyCwiczenia })) }),
  }));
}

export function parsujArgumenty(argv) {
  const o = { rodzina: null, wszystkie: false, wyjscie: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]; const w = () => { if (i + 1 >= argv.length) throw new Error(`brak wartości dla ${a}`); return argv[++i]; };
    if (a === '--rodzina') { o.rodzina = w(); if (!/^[a-z][a-z0-9_]{1,40}$/.test(o.rodzina)) throw new Error('--rodzina: oczekiwany identyfikator rodziny'); }
    else if (a === '--wszystkie') o.wszystkie = true;
    else if (a === '--wyjscie') o.wyjscie = w();
    else throw new Error(`nieznany argument: ${a}`);
  }
  if (!o.wyjscie) throw new Error('wymagane: --wyjscie <katalog>');
  if (!!o.rodzina === o.wszystkie) throw new Error('wymagane: dokładnie jedno z --rodzina <id> albo --wszystkie');
  return o;
}

export async function main(argv, { root = ROOT, log = console.log } = {}) {
  const o = parsujArgumenty(argv); const docs = join(root, 'docs/51-figury-v2-pokrycie.md');
  const ids = o.wszystkie ? rodzinyZDokumentu(docs).filter((r) => r.stan !== 'gotowa').map((r) => r.id) : [o.rodzina];
  mkdirSync(resolve(o.wyjscie), { recursive: true }); let plikow = 0, najdluzsze = 0, rodzin = 0;
  for (const id of ids) {
    const p = await poleceniaRodziny(id, { root }); if (!p.length) { log(`${id}: nic do zrobienia (pozy gotowe)`); continue; }
    rodzin++;
    for (const x of p) {
      if (x.tresc.length > MAX_ZNAKOW) throw new Error(`${x.plik}: polecenie ma ${x.tresc.length} znaków (limit ${MAX_ZNAKOW})`);
      writeFileSync(join(resolve(o.wyjscie), x.plik), x.tresc); plikow++; najdluzsze = Math.max(najdluzsze, x.tresc.length);
      log(`${x.plik}: ${x.cwiczenia.length} ćwiczeń, ${x.tresc.length} znaków`);
    }
  }
  log(`rodzin: ${rodzin}, plików: ${plikow}, najdłuższe: ${najdluzsze} znaków`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2)).then((c) => process.exit(c), (e) => { console.error(`błąd: ${e.message}`); process.exit(1); });
