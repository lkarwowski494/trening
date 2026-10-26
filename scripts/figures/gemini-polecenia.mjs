#!/usr/bin/env node
// Polecenia do ręcznego generowania póz figur v2 w aplikacji Gemini (decyzja właściciela 26.10.2026, docs/52 pkt 7): jedno polecenie na rodzinę ruchu (część rodziny przy > 8 ćwiczeniach),
// właściciel wkleja je do rozmowy, odpowiedź (jeden blok JSON) zapisuje do pliku i wczytuje: node scripts/figures/gemini-pozy.mjs --z-pliku <plik> (import, walidacja, polecenie poprawkowe).
// Użycie:
//   node scripts/figures/gemini-polecenia.mjs --rodzina pull_up --wyjscie <katalog>
//   node scripts/figures/gemini-polecenia.mjs --wszystkie --wyjscie <katalog>        (każda rodzina, której pozy nie są jeszcze gotowe; pliki <id>.md albo <id>-1.md, <id>-2.md…)
// Liczby (zakresy stawów, tolerancje, minimalny ruch) pochodzą z silnika (CONTRACT, TOL, lib/figures/data.json) — nie są przepisane ręcznie. Nic nie jest zapisywane w repozytorium.
import { readFileSync, writeFileSync, mkdirSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cwiczeniaRodziny, wczytajKontrakt } from './gemini-pozy.mjs';
import { loadV2 } from './v2-build.mjs';
import { regulyDla, stopaAutomatyczna, pominiecie, otwarteDla, EWALUATORY, grupaBledu, wczytajSens, bledyBezAnimacji, czekaNaKontrakt } from './v2-sens.mjs';
import { wczytajRejestr, liniePolecenia, statystykaWersji } from './gemini-rejestr.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const czytaj = (p) => JSON.parse(readFileSync(p, 'utf8'));
/** Najwięcej ćwiczeń w jednej części i górna granica długości polecenia (znaki) — mieści się w oknie czatu z zapasem. */
export const MAX_CWICZEN_W_CZESCI = 12; /* docs/52 pkt 7: jedno polecenie na rodzinę, gdy odpowiedź mieści się w jednej wiadomości (ok. 4 tys. znaków na pozę); większe rodziny dzielone */
export const MAX_ZNAKOW = 36000;
/** Wersja rdzenia polecenia (docs/53): zmiana tylko przez generator; wchodzi do odpowiedzi (pole "polecenie"), by mierzyć zaliczone za 1. razem per wersja. */
export const WERSJA_POLECENIA = 2;
export const ETYKIETA_WERSJI = `polecenie@${WERSJA_POLECENIA}`;

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
/** Ćwiczenia rodziny, którym brakuje pozy (rodzina gotowa z rigiem → pusta lista; rodzina gotowa z danych → ćwiczenia bez wpisu w poses/). */
/** Jawne wyjątki bez animacji (data/zrodla/figury-wyjatki.json): powód dla ćwiczenia (z rodziny albo imiennie) albo null. */
export function wyjatekBezAnimacji(rodzina, cwiczenie, root = ROOT) {
  const p = join(root, 'data/zrodla/figury-wyjatki.json'); if (!existsSync(p)) return null; const w = czytaj(p); return w.cwiczenia?.[cwiczenie] ?? w.rodziny?.[rodzina] ?? null;
}
export function doZrobienia(rodzina, { root = ROOT, lista } = {}) {
  const r = rodzinyZDokumentu(lista ?? join(root, 'docs/51-figury-v2-pokrycie.md')).find((x) => x.id === rodzina);
  if (!r) throw new Error(`rodzina „${rodzina}” nie występuje w docs/51`);
  if (r.stan === 'gotowa' && !existsSync(join(root, 'lib/figures/v2/poses', `${rodzina}.json`))) return []; /* gotowa z rigiem: nic do zrobienia; gotowa z danych: brakujące pozy */
  const mam = pozyGotowe(rodzina, root).cwiczenia ?? {};
  return cwiczeniaRodziny(rodzina, lista ?? join(root, 'docs/51-figury-v2-pokrycie.md')).filter((c) => !(c in mam) && !wyjatekBezAnimacji(rodzina, c, root));
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
export const silnik = () => { if (!silnikCache) { const dir = mkdtempSync(join(tmpdir(), 'polecenia-')); silnikCache = loadV2(dir); process.on('exit', () => { try { rmSync(dir, { recursive: true, force: true }); } catch { /* sprzątanie best effort */ } }); } return silnikCache; };
export const silnikCatalog = () => silnik().catalog;

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
    `RUCH: poza u = 1 musi różnić się od u = 0 o co najmniej ${C.minMotionCm} cm (największe przemieszczenie dowolnego punktu: dłoń, kolano, miednica…). Zbyt mały ruch to najczęstsza przyczyna odrzucenia. WYJĄTEK: ćwiczenia izometryczne (oznaczone w poleceniu) — poza statyczna (u = 0 i u = 1 mogą być identyczne); wtedy jedynym ruchem jest błąd z listy.`,
    `KLATKI: ${C.frames.min}–${C.frames.max} klatek, rosnące u, pierwsza u = 0, ostatnia u = 1. Interpolacja między klatkami jest LINIOWA, a żaden punkt ciała nie może skoczyć o więcej niż ${C.maxJump} cm na 1/${C.step} ruchu — dla ruchu zakrzywionego dodaj klatki pośrednie (zwykle 4–7). REGUŁA KLATEK: dopuszczalne przemieszczenie punktu (miednica, kostka, chwyt) między sąsiednimi klatkami to co najwyżej ${Math.floor((C.maxJump * C.step) / 2)} cm na 1,0 u (połowa limitu na zapas dla kolan i łokci), czyli ≤ ${Math.floor((C.maxJump * C.step) / 20)} cm przy odstępie klatek 0,1 i ≤ ${Math.floor((C.maxJump * C.step) / 40)} cm przy 0,05; gdy punkt przesuwa się o więcej niż ${Math.floor((C.maxJump * C.step) / 20)} cm, dodaj klatki co 0,1 (w szybkich fazach i przy mijaniu sprzętu co 0,05).`,
    `ZAKRESY STAWÓW (sprawdzane w każdej fazie ruchu, obie strony): biodro ${lim('hip')}, kolano ${lim('knee')}, kostka ${al?.ankleMin !== undefined ? `${al.ankleMin}°…${S.ankle.max}°` : lim('ankle')}, łokieć ${lim('el', al?.elbow)}, bark w płaszczyźnie strzałkowej ${lim('sh', al?.shSag)} (sprawdzany, gdy ramię nie jest odwiedzione), uniesienie ramienia 0°…${al?.shElev ?? rom.front.abd.max}°.${al ? ` Wyjątek tej rodziny: ${al.why}.` : ''} ${stopaAutomatyczna(rodzina, '') ? 'STOPA: NIE podawaj pola podbicie — silnik ustawia stopę neutralnie względem goleni (kąt kostki ≈ 5°, nie głębiej niż podłoga); podaj tylko kostka (położenie).' : `KOSTKA (częsty błąd): kąt kostki = podbicie + nachylenie goleni (kolano przed kostką = dodatnie, w zwisie zwykle +10…+20°), limit ${S.ankle.max}°, więc w zwisie ustaw podbicie ${v2.CONTRACT ? '−20…−5' : ''} (palce lekko w dół, nigdy dodatnie); sprawdzone na modelu: podbicie −10 przy kostkach 10 cm przed miednicą daje kąt kostki ≈ 0°, podbicie +20 daje ≈ 30–38° i przekracza limit.`}`,
    `PRZENIKANIE: ciało nie może wnikać w sprzęt (drążek, słupek, ławkę, skrzynię) więcej niż ${v2.TOL.pen} cm — dotyczy też pozy z zastosowanym błędem (głowa i tułów względem drążka są najczęstszym naruszeniem; zostaw wokół drążka zapas kilku cm). Najniższy punkt stopy nie niżej niż y = 0 (tolerancja ${v2.TOL.floor} cm).`,
    `CHWYT: środek chwytu każdej dłoni leży na osi sztangi/drążka (tolerancja 0,6 cm) w KAŻDEJ klatce i w każdej klatce błędu; chwyt w zasięgu ramienia od barku (≤ ${v2.BODY.uarm + v2.BODY.farm + v2.BODY.hand} cm), kostka w zasięgu nogi od biodra (≤ ${v2.BODY.thigh + v2.BODY.shank + v2.BODY.ankleH} cm).`,
    `BŁĘDY (bledy[]): najwyżej ${C.errorsMax}, tylko z listy identyfikatorów podanej przy ćwiczeniu (inne = odrzucenie; brak listy = bledy: []). Każdy błąd: ${C.errorFrames.min}–${C.errorFrames.max} klatek z deltami, pierwsza u = 0 i delta ZEROWA, ostatnia u = 1. Błąd ma być widoczny (≥ ${C.visibleCm} cm albo ≥ ${C.visibleDeg}° w którymś stawie).`,
    `DOTYCZY: każdy kąt (biodro, kolano, kostka, łokieć, bark) zmieniony przez deltę o więcej niż ${C.undeclaredDeg}° MUSI być zadeklarowany w „dotyczy” (hip, knee, ankle, elbow, shoulder; do tego spine, kneeLat, heel, pelvis, bar). Zmiana pozycji dłoni zmienia łokieć i bark — zadeklaruj elbow i shoulder albo nie zmieniaj chwytu w delcie.`,
    'WYMIARY: współrzędne w cm, kąty w stopniach, liczby z co najwyżej jednym miejscem po przecinku. Strona R ma z dodatnie, L ujemne (symetrycznie względem z = 0).',
  ];
}


/* ---------- punkty odniesienia (liczby wyliczone z modelu) ---------- */
const f0 = (x) => Math.round(x * 10) / 10;
/** Liczby silnika dla szablonów zapobiegania w rejestrze błędów (miejsca {nazwa}). */
export function liczbyZSilnika(rodzina = 'pull_up') {
  const { v2 } = silnik(); const C = v2.CONTRACT; const B = v2.BODY; const rom = czytaj(join(ROOT, 'lib/figures/data.json')).rom; const al = v2.templateFor(rodzina).allow ?? {};
  const reach = B.uarm + B.farm + B.hand; const s = wczytajSens().rodziny?.pull_up?.reguly ?? {};
  const par = (id, k, d) => s[id]?.parametry?.[k] ?? d;
  return { gripTol: 0.6, reach, reachAim: reach - 0.5, trunk: B.trunk, shHalf: B.shHalf, ankleMax: rom.side.ankle.max, ankleSafe: '−20…−5°', elbowMax: rom.side.el.max, elbowAim: 140, shSagMax: rom.side.sh.max, shElevMax: rom.front.abd.max, shSagAllow: al.shSag ?? rom.side.sh.max,
    hipMin: rom.side.hip.min, hipMax: rom.side.hip.max, kneeMax: rom.side.knee.max, pen: v2.TOL.pen, maxJump: C.maxJump, step: C.step, perFrame: C.maxJump * C.step, gap10: Math.floor((C.maxJump * C.step) / 20), minMotion: C.minMotionCm,
    undeclared: C.undeclaredDeg, visibleCm: C.visibleCm, visibleDeg: C.visibleDeg, chinMargin: par('broda_nad_drazkiem', 'margines_cm', 2), armsStraight: par('dol_rece_proste', 'max_lokiec_deg', 25), swingPelvis: par('miednica_nie_buja', 'max_cm', 3),
    ankleRel: `${par('nogi_nieruchome', 'min_cm', -10)}…${par('nogi_nieruchome', 'max_cm', 5)}`, trunkRange: `${par('tulow_pion', 'min_deg', -12)}…${par('tulow_pion', 'max_deg', 3)}`, freeHand: par('jedna_reka', 'min_wolna_od_osi_cm', 15) };
}
const KOSTKI_Z = 15;
/** Układ wzorca podciągania: miednica za drążkiem o |PX| cm (głowa mija drążek z przodu; łokieć w górze < limitu), broda w u = 1 co najmniej BRODA_CEL cm nad drążkiem (reguła 2 cm + zapas). */
export const PX = -18, BRODA_CEL = 3;
/** Poza zwisu/podciągnięcia WYLICZONA Z MODELU dla drążka na y = B i chwytu z = ±c: miednica za drążkiem (głowa mija drążek z przodu), ramię z zapasem 0,5 cm, broda ≥ B + 3 w u = 1. Zwraca { poza, u0, u1 } albo null. */
export function wzorzecPodciagania(B = 230, c = 22, { cwiczenie = 'Pull Up', bledy = true } = {}) {
  const { v2 } = silnik(); const bd = v2.BODY; const reach = bd.uarm + bd.farm + bd.hand; const aim = reach - 0.5; const px = PX; const trunk = bd.trunk;
  const py0 = B - trunk - Math.sqrt(Math.max(0, aim ** 2 - (c - bd.shHalf) ** 2 - px ** 2)); /* u = 0: ramię prawie proste */
  const legs = (x, y, dx = 0) => ({ R: { kostka: [x - 4 + dx, y - 80, KOSTKI_Z], podbicie: -10, rotacjaStopy: 10 }, L: { kostka: [x - 4 + dx, y - 80, -KOSTKI_Z], podbicie: -10, rotacjaStopy: 10 } });
  const kl = (u, y) => ({ u, miednica: [px, y, 0], pochylenieTulowia: 0, zgiecieKregoslupa: 0, pochylenieGlowy: 0, nogi: legs(px, y), rece: { R: { chwyt: [0, B, c] }, L: { chwyt: [0, B, -c] } } });
  const sprzet = [{ rodzaj: 'sztanga', x: 0, y: B, dlugosc: 128, talerze: false, podazaZaChwytem: false }, { rodzaj: 'slupek', x: 0, h: B + 5 }, { rodzaj: 'podloga', x0: -120, x1: 120 }];
  const chinY = (d) => { const f = v2.keyframeFrame(d, 1); return f.sk.head[1] - f.sk.headUp[1] * bd.headR; };
  for (let y1 = B - 66; y1 <= B - 30; y1 += 0.5) {
    const d = { kontrakt: v2.CONTRACT.id, rodzina: 'pull_up', cwiczenie, sprzet, klatki: [kl(0, py0), kl(1, y1)], bledy: [] };
    if (v2.checkFrame(v2.keyframeFrame(d, 1)).length || chinY(d) < B + BRODA_CEL) continue;
    const us = [0, 0.25, 0.5, 0.75, 1]; d.klatki = us.map((u) => kl(u, py0 + (y1 - py0) * (u * (2 - u)))); /* szybciej na początku, łagodnie przy drążku (ease-out) */
    if (bledy) d.bledy = [{ cue: 'pu.partial', znacznik: 'bar', dotyczy: ['elbow', 'shoulder', 'hip', 'knee', 'ankle'], klatki: [{ u: 0 }, { u: 0.5, miednica: [0, -8, 0], nogi: { R: { kostka: [0, -8, 0] }, L: { kostka: [0, -8, 0] } } }, { u: 1, miednica: [0, -16, 0], nogi: { R: { kostka: [0, -16, 0] }, L: { kostka: [0, -16, 0] } } }] }];
    return { poza: d, u0: { y: f0(py0) }, u1: { y: f0(y1), brodaY: f0(chinY(d)) } };
  }
  return null;
}
/** Tabela referencyjna (B, c) → miednica.y dla u = 0 i u = 1 (wyliczona z modelu: zapas ramienia 0,5 cm w u = 0, broda ≥ B + 3 w u = 1). */
export function tabelaPodciagania() {
  const { v2 } = silnik(); const bd = v2.BODY; const reach = bd.uarm + bd.farm + bd.hand; const px = PX;
  return [[215, 15], [230, 22], [245, 35]].map(([B, c]) => {
    const u0 = B - bd.trunk - Math.sqrt((reach - 0.5) ** 2 - (c - bd.shHalf) ** 2 - px ** 2); const w = wzorzecPodciagania(B, c, { bledy: false });
    return `  - drążek y = ${B}, chwyt z = ±${c}: u = 0 → miednica.y = ${f0(u0)} (łokieć ≈ 14°, ramię z zapasem); u = 1 → miednica.y ≈ ${w ? w.u1.y : '?'} (broda y = ${w ? w.u1.brodaY : '?'} ≥ ${B + BRODA_CEL})`;
  });
}
const FAZY = {
  pull_up: () => [
    `Układ osoby względem drążka (x): miednica ZA drążkiem — miednica.x = drążek.x − 18 (stała w całym ruchu, ±3 cm), chwyt x = x drążka; wtedy głowa mija drążek z przodu (odstęp środka głowy od osi drążka ≥ 15 cm; promień głowy 9,5 cm), nie przenika go, a łokieć w górze nie przekracza limitu (bliżej drążka łokieć zginałby się powyżej 149°). Tułów pionowo (pochylenieTulowia 0, w całym ruchu −12…3°), pochylenieGlowy 0.`,
    'Zwis (u = 0): ramiona prawie proste (łokieć ≤ 25°, cel 14°: odległość bark–chwyt 63,5 cm przy zasięgu 64 cm), stopy tuż za miednicą (x kostki = miednica.x − 4), kostki ok. 80 cm pod miednicą, podbicie −10.',
    `Góra (u = 1): broda (środek głowy minus 9,5 cm) co najmniej ${BRODA_CEL} cm nad drążkiem (reguła: ≥ 2 cm, zapas 1 cm); łokcie zgięte 130–145° (limit 149°) — nie unoś miednicy wyżej niż w tabeli.`,
    'Tabela referencyjna (wyliczona z modelu, tułów pionowo, miednica.x = drążek.x − 18, kostki 80 cm pod miednicą):',
    ...tabelaPodciagania(),
    'Dla innych wysokości drążka i rozstawu: u = 0 → miednica.y = B − 50 − sqrt(63,5² − (c − 19)² − 18²); u = 1 → miednica.y ≈ wartość z tabeli dla najbliższego B, przesunięta o różnicę B (szybka kontrola: broda = miednica.y + 62,5 ≥ B + 3).',
    'Chwyt: x = x drążka, y = y drążka, z = ±(połowa rozstawu dłoni): wąski ±10…15, standard ±20…25, szeroki ±30…40 cm.',
  ],
};
/** Tabela chwytu nad głową dla kilku pochyleń tułowia (wzór: bark + 62 · (0,87 · a + 0,5 · n)); liczona, nie przepisywana. */
export function tabelaRakNadGlowa() {
  const f = (x) => (Math.round(x * 10) / 10).toString().replace('.', ',');
  return [-90, -80, -70, -60, -50].map((p) => { const r = p * Math.PI / 180, a = [Math.sin(r), Math.cos(r)], n = [Math.cos(r), -Math.sin(r)]; return `pochylenie ${p}°: dx = ${f(62 * (0.87 * a[0] + 0.5 * n[0]))}, dy = ${f(62 * (0.87 * a[1] + 0.5 * n[1]))}`; }).join('; ');
}
const FAZY_CORE_FLOOR = () => [
  'Układ leżący na plecach (jak w crunch): głowa w stronę −x, nogi w stronę +x: pochylenieTulowia = −90 (poziomo), pochylenieGlowy ≈ pochylenieTulowia (głowa leży na podłodze), miednica = [0, 8, 0] (y = 8 cm — najniżej, przy którym uda nie przenikają podłogi; reguła: ≤ 12 cm), barki = miednica + 50 cm w stronę −x przy pochyleniu −90.',
  'KOLANA (najczęstszy błąd — uda i golenie pod podłogą do 25 cm): przy leżeniu na plecach ZAWSZE podawaj w każdej klatce nogi.R/L.biegunKolana = [0.15, 1, ±0.1] (kolano w górę; bez tego IK kieruje kolano w podłogę); na czworaka i na brzuchu [0.15, −1, ±0.1] (kolano opiera się o podłogę). Kostki nie niżej niż y = 7. STOPY: w tej rodzinie NIE PODAWAJ pola podbicie (kąt kostki był najczęstszym błędem) — silnik ustawia stopę sam, neutralnie względem goleni, nie głębiej niż podłoga.',
  'Ręce za głową (leżąc na plecach): chwyt = bark + 62 cm · (0,87 · oś tułowia ku głowie + 0,5 · przód klatki), gdzie oś tułowia ku głowie a = (sin p, cos p) w płaszczyźnie (x, y), przód klatki n = (cos p, −sin p), p = pochylenieTulowia w danej klatce (przy p = −90: a = (−1, 0), n = (0, 1)); kąt barku ≈ 150° (limit 171°). Ręka wzdłuż podłogi za głową (180°) łamie limit barku. Tabela (przesunięcie chwytu względem barku {dx, dy} w płaszczyźnie x/y, z=±szerokość barków; zapas ≥ 5° do limitu): ' + tabelaRakNadGlowa() + '.',
  'Nogi zgięte, stopy na podłodze: kostki = [35, 7, ±15] (wysokość kostki 7 cm); kolana liczy IK. Dłonie: wzdłuż ciała, ramiona prawie proste: chwyt = bark + 63,3 cm w stronę miednicy (ramię proste: łokieć ≤ 15°; krótszy dystans zgina łokieć), z = ±24 (skrzyżowane na klatce zginają łokieć powyżej limitu 149° — unikaj); dłonie przy skroniach tylko bez ciągnięcia głowy.',
  'Unoszenie tułowia (crunch): u = 0 pochylenieTulowia −90 → u = 1 około −62 (barki unoszą się o ≈ 20 cm), pochylenieGlowy podąża za tułowiem (różnica ≤ 30°), miednica nie rusza się (y ≤ 12, zmiana ≤ 3 cm).',
  'Ruch prowadzony miednicą (reverse crunch): barki i głowa nieruchome na podłodze, miednica unosi się o ≥ 8 cm (u = 1: y ≈ 20), kostki podążają za miednicą (kolana do klatki).',
  'Pozycja na czworaka (bird dog): tułów poziomo (pochylenieTulowia 90 w stronę +x), ręce i kolana na podłodze/pod barkami; w u = 1 jedna dłoń wyprostowana do przodu na wysokości barku i przeciwna kostka wyprostowana do tyłu na wysokości miednicy.',
];
/** Wzorzec: crunch leżąc na plecach wyliczony z modelu (barki unoszą się o ≈ 20 cm, głowa podąża za tułowiem, miednica nieruchoma); przechodzi geometrię i reguły sensu core_floor. */
export function wzorzecCrunch(cwiczenie = 'Crunch') {
  const { v2 } = silnik(); const base = (u, pitch) => ({ u, miednica: [0, 8, 0], pochylenieTulowia: pitch, zgiecieKregoslupa: 0, pochylenieGlowy: pitch, nogi: { R: { kostka: [35, 7, 15] }, L: { kostka: [35, 7, -15] } }, rece: { R: { chwyt: [0, 0, 0] }, L: { chwyt: [0, 0, 0] } } });
  const sprzet = [{ rodzaj: 'podloga', x0: -150, x1: 150 }];
  const klatki = [0, 0.5, 1].map((u) => { const k = base(u, -90 + 28 * u); const d = { kontrakt: v2.CONTRACT.id, rodzina: 'core_floor', cwiczenie, sprzet, klatki: [k, { ...k, u: 1 }], bledy: [] }; const sh = v2.keyframeFrame(d, 0).sk.shoulderC;
    const w = [8 - sh[0], 8 - sh[1]]; const n = Math.hypot(...w); const g = [sh[0] + (w[0] / n) * 63.3, sh[1] + (w[1] / n) * 63.3 - 1]; /* ręce wzdłuż ciała, proste (63,3 cm od barku: łokieć ≤ 15°), w stronę miednicy */
    k.rece = { R: { chwyt: [g[0], g[1], 24] }, L: { chwyt: [g[0], g[1], -24] } }; for (const q of ['R', 'L']) for (const i of [0, 1, 2]) k.rece[q].chwyt[i] = Math.round(k.rece[q].chwyt[i] * 10) / 10; return k; });
  return { kontrakt: v2.CONTRACT.id, rodzina: 'core_floor', cwiczenie, sprzet, klatki, bledy: [] };
}

/* ---------- pushup_plank: układ podporu przodem (wzorzec Push Up z modelu) ---------- */
export const PU = { dl: 82, phiGora: 20, phiDol: 0, phiBlad: 10, podbicie: -60, biegunLokcia: [-1, -0.3, 0.9] };
/** Poza pompki wyliczona z modelu: ciało w jednej linii od kostek (na palcach) do barków, kąt linii φ nad podłogą (góra 20°, dół 10°), dłonie NA STAŁE pod barkami z u = 0, kostki 20 cm nad podłogą (palce stoją na podłodze); błąd push.mis.partial = płytki dół (φ 18°). */
export function wzorzecPompki(cwiczenie = 'Push Up') {
  const { v2 } = silnik(); const r = Math.PI / 180; const pod = PU.podbicie;
  const ay = -(Math.sin(pod * r) * 19 - Math.cos(pod * r) * 7) + 0.3; const ax = 0;
  const pozaPhi = (phi) => { const c = Math.cos(phi * r), sn = Math.sin(phi * r); const pel = [ax + PU.dl * c, ay + PU.dl * sn]; return { pel, pitch: 90 - phi, sh: [pel[0] + 50 * c, pel[1] + 50 * sn] }; };
  const gora = pozaPhi(PU.phiGora); const gx = Math.round(gora.sh[0] * 10) / 10; /* dłonie stałe */
  const kl = (u, phi) => { const q = pozaPhi(phi); const f = (x) => Math.round(x * 10) / 10; return { u, miednica: [f(q.pel[0]), f(q.pel[1]), 0], pochylenieTulowia: f(q.pitch), zgiecieKregoslupa: 0, pochylenieGlowy: f(q.pitch * 0.6), nogi: { R: { kostka: [ax, f(ay), 10], podbicie: pod }, L: { kostka: [ax, f(ay), -10], podbicie: pod } }, rece: { R: { chwyt: [gx, 2, 19], biegunLokcia: PU.biegunLokcia }, L: { chwyt: [gx, 2, -19], biegunLokcia: [PU.biegunLokcia[0], PU.biegunLokcia[1], -PU.biegunLokcia[2]] } } }; };
  const phiU = (u) => PU.phiGora + (PU.phiDol - PU.phiGora) * u; const klatki = [0, 0.25, 0.5, 0.75, 1].map((u) => kl(u, phiU(u)));
  const bl = pozaPhi(PU.phiBlad), dn = pozaPhi(PU.phiDol); const f = (x) => Math.round(x * 10) / 10;
  const delta = (u, w) => ({ u, miednica: [f((bl.pel[0] - dn.pel[0]) * w), f((bl.pel[1] - dn.pel[1]) * w), 0], pochylenieTulowia: f((bl.pitch - dn.pitch) * w), pochylenieGlowy: f((bl.pitch - dn.pitch) * 0.6 * w) });
  const bledy = [{ cue: 'push.mis.partial', znacznik: 'pelvis', dotyczy: ['elbow', 'shoulder', 'hip', 'knee', 'ankle'], klatki: [{ u: 0 }, delta(0.5, 0.5), delta(1, 1)] }];
  return { kontrakt: v2.CONTRACT.id, rodzina: 'pushup_plank', cwiczenie, sprzet: [{ rodzaj: 'podloga', x0: -150, x1: 150 }], klatki, bledy };
}
const FAZY_PUSHUP_PLANK = () => [
  `Układ podporu przodem: kostki NA PALCACH za osobą: kostka = [0, ${f0(-(Math.sin(PU.podbicie * Math.PI / 180) * 19 - Math.cos(PU.podbicie * Math.PI / 180) * 7) + 0.3)}, ±10] z podbicie = ${PU.podbicie} (palce stoją na podłodze, pięta w górze; kąt kostki ≈ −55…−65° — dopuszczalny wyjątek rodziny: dolna granica −75°), dłonie na podłodze: chwyt = [x barków w u = 0, 2, ±19] i NIE zmieniają położenia w ruchu (dłonie stałe).`,
  `Ciało w jednej linii: miednica leży na odcinku bark–kostka (odchyłka ≤ 6 cm). Oś ciała nad podłogą pod kątem φ: miednica = kostka + ${PU.dl}·[cos φ, sin φ], bark = miednica + 50·[cos φ, sin φ], pochylenieTulowia = 90 − φ (90 = poziomo głową do przodu), pochylenieGlowy ≈ 0,6 · pochylenieTulowia.`,
  `Pompka: u = 0 góra φ = ${PU.phiGora}° (ramiona proste: łokieć ≤ 20°), u = 1 dół φ = ${PU.phiDol}° (klatka ≤ 20 cm nad dłońmi: bark − dłoń ≤ 20 cm, łokieć ≥ 85°; wzorzec ma ≈ 18 cm i łokieć ≈ 144° zgięcia); klatki pośrednie co 0,25 (φ liniowo). ŁOKCIE (technika: łokcie do tyłu, nie na boki — błąd klasyczny): w KAŻDEJ klatce rece.R.biegunLokcia = [${PU.biegunLokcia.join(', ')}], rece.L.biegunLokcia = [${PU.biegunLokcia[0]}, ${PU.biegunLokcia[1]}, ${-PU.biegunLokcia[2]}] (łokieć za tułowiem, ramię ≈ 45° od tułowia z góry — konwencja/uproszczenie, zakres techniki 30–60°); limit reguły: odwiedzenie barku ≤ 75°. Deska (Plank): jedna poza (φ = ${PU.phiGora}°, łokcie zgięte 90° albo proste), ćwiczenie izometryczne.`,
  'Nogi proste (kolana ≤ 20°): odległość miednica–kostka ≈ 82 cm; kostka dalej niż 90 cm od biodra = poza zasięgiem nogi.',
];

export function punktyOdniesienia(rodzina) {
  const { v2 } = silnik(); const B = v2.BODY; const t = v2.templateFor(rodzina); const reach = B.uarm + B.farm + B.hand;
  const L = [
    '- Układ: x = przód (twarz), y = góra, z = prawa strona osoby. Podłoga: y = 0 (podeszwa stopy nie niżej). Płaszczyzna symetrii: z = 0.',
    `- Sprzęt domyślny rodziny (wzór do skopiowania i dopasowania): ${JSON.stringify(t.defaultGear)}`,
    `- Segmenty ciała (cm, stałe): udo ${B.thigh}, podudzie ${B.shank}, wysokość kostki ${B.ankleH}, tułów miednica→bark ${B.trunk}, szyja ${B.neckUp}, środek głowy ${B.headFromC7} nad barkiem, promień głowy ${B.headR}, ramię ${B.uarm}, przedramię ${B.farm}, dłoń ${B.hand}; biodra ±${B.hipHalf}, barki ±${B.shHalf} od z = 0.`,
    `- Przy pionowym tułowiu (pochylenieTulowia 0, zgiecieKregoslupa 0): bark = miednica + [0, ${B.trunk}, ±${B.shHalf}], środek głowy = miednica + [0, ${B.trunk + B.neckUp + B.headFromC7}, 0], broda ≈ środek głowy − ${B.headR} w y. Przy pochyleniu α tułów odchyla się od pionu o α° (do przodu dodatnie).`,
    `- Zasięg: chwyt do ${reach} cm od barku (ramię proste = ${reach} cm; CELUJ w ${reach - 0.5} cm, bo nadmiar > 0,5 cm = odrzucenie), kostka do ${B.thigh + B.shank + B.ankleH} cm od biodra. Poza leżąca (ławka, podłoga): tułów poziomo = pochylenieTulowia 90.`,
    '- Konwencja kątów w walidatorze: 0° = staw wyprostowany, kąt rośnie ze zgięciem (łokieć prosty = 0°, zgięty maks. 149°; kolano prosty 0°, maks. 141°). „Łokcie wyprostowane ≥ 165°” w zapisie anatomicznym to tutaj ≤ 15°.',
    '- MARGINES: celuj 1–2 cm i 2–3° DO ŚRODKA każdego limitu (zasięg, zakresy stawów, przenikanie, chwyt) — model ma tolerancję 0,3–0,6 cm, a odrzucenia z poprzednich prób dotyczyły przekroczeń o 0,6–1,5 cm i 1°.',
  ];
  const f = FAZY[rodzina] ?? (rodzina === 'core_floor' ? FAZY_CORE_FLOOR : rodzina === 'pushup_plank' ? FAZY_PUSHUP_PLANK : null);
  if (f) L.push('- Relacje faz ruchu (pozy wyjściowa i skrajna):', ...f().map((x) => `  - ${x}`));
  else L.push('- Relacje faz: dla KAŻDEGO ćwiczenia najpierw ustal punkty kluczowe obu faz (gdzie ma być chwyt względem sprzętu, miednica, kostki — jako liczby w cm w układzie powyżej), potem zapisz klatki tak, by te relacje zachodziły; stopy opierają się o podłogę lub sprzęt, dłonie leżą na chwycie.');
  return L;
}

/* ---------- reguły sensu (data/zrodla/figury-sens.json; każda reguła ma odpowiednik w walidatorze v2-sens.mjs) ---------- */
const OPIS_TYPU = {
  broda_nad_drazkiem: (q) => `w u = 1 broda (środek głowy − 9,5 cm wzdłuż osi głowy) ≥ y drążka + ${q.margines_cm} cm`,
  lokiec_u0: (q) => `w u = 0 kąt łokcia obu rąk ≤ ${q.max_lokiec_deg}° (ramiona prawie proste)`,
  lokiec_caly_ruch: (q) => `w KAŻDEJ klatce kąt łokcia ≤ ${q.max_lokiec_deg}° (ramiona proste przez cały ruch)`,
  miednica_poziomo: (q) => `miednica przesuwa się poziomo (${q.osie.join(', ')}) o ≤ ${q.max_cm} cm w całym ruchu`,
  kostka_wzgledem_miednicy: (q) => `(x kostki − x miednicy) w ${q.min_cm}…${q.max_cm} cm w każdej klatce, a jej zmiana w ruchu ≤ ${q.zmiana_max_cm} cm`,
  pochylenie_tulowia: (q) => `pochylenieTulowia w każdej klatce ${q.min_deg}°…${q.max_deg}°`,
  miednica_na_podlodze: (q) => `środek miednicy ma y ≤ ${q.max_y_cm} cm w KAŻDEJ klatce (dolna część pleców zostaje na podłodze; leżąca osoba: y ≈ 8)`,
  szyja_neutralna: (q) => `kąt między osią głowy a osią tułowia ≤ ${q.max_deg}° w każdej klatce (pochylenieGlowy podąża za pochylenieTulowia ± ${q.max_deg}°; bez ciągnięcia głowy)`,
  lopatki_od_podlogi: (q) => `barki w u = 1 co najmniej ${q.min_cm} cm wyżej niż w u = 0, a miednica zmienia wysokość o ≤ ${q.max_miednica_cm} cm`,
  miednica_unosi_sie: (q) => `miednica w u = 1 co najmniej ${q.min_cm} cm wyżej niż w u = 0, a barki zmieniają wysokość o ≤ ${q.max_barki_cm} cm`,
  bird_dog_linia: (q) => `w u = 1 dłoń jednej ręki na wysokości barku (± ${q.tol_cm} cm) i kostka PRZECIWNEJ nogi na wysokości miednicy (± ${q.tol_cm} cm)`,
  kolana_ku_barkom: (q) => `odległość środka kolan od barków w u = 1 jest o ≥ ${q.min_zblizenie_cm} cm mniejsza niż w u = 0 (kolana zbliżają się do klatki)`,
  miednica_nieruchoma: (q) => `wysokość miednicy zmienia się o ≤ ${q.max_cm} cm w całym ruchu (miednica zostaje na podporze)`,
  miednica_pion_span: (q) => `wysokość miednicy zmienia się o ≤ ${q.max_cm} cm w całym ruchu (stała wysokość)`,
  zgiecie_tulowia_biodra_nieruchome: (q) => `odległość barki–miednica maleje o ≥ ${q.min_skrocenie_cm} cm (zgięcie kręgosłupa), a miednica przesuwa się o ≤ ${q.max_miednica_cm} cm`,
  konczyny_uniesione: (q) => `w u = 1 obie dłonie i obie kostki leżą co najmniej ${q.min_cm} cm wyżej niż w u = 0`,
  stawy_proste: (q) => `stawy ${q.stawy.join(', ')} (elbow = łokieć, knee = kolano) mają kąt ≤ ${q.max_deg}° w KAŻDEJ klatce (proste)`,
  barki_unoszenie_max: (q) => `barki unoszą się najwyżej o ${q.max_cm} cm względem u = 0`,
  start_lezenie: (q) => `w u = 0 barki i kostki leżą najwyżej ${q.max_cm} cm nad miednicą (start leżąc)`,
  kat_tulowia_nad_poziomem_u1: (q) => `w u = 1 oś miednica→barki jest ≥ ${q.min_deg}° nad poziomem`,
  kat_nog_nad_poziomem_u1: (q) => `w u = 1 oś miednica→kostki jest ≥ ${q.min_deg}° nad poziomem`,
  szkielet_nieruchomy: (q) => `żaden punkt szkieletu nie przesuwa się o więcej niż ${q.max_cm} cm w ruchu`,
  lokiec_nieruchomy_wzgledem_barku: (q) => `łokieć przesuwa się względem barku o ≤ ${q.max_cm} cm w ruchu (nieruchomo przy tułowiu)`,
  tulow_nieruchomy: (q) => `pochylenieTulowia zmienia się o ≤ ${q.max_pochylenie_deg}°, a miednica przesuwa się poziomo o ≤ ${q.max_miednica_cm} cm`,
  lokiec_zakres: (q) => `kąt łokcia: ${[q.u0_min_deg !== undefined && `w u = 0 ≥ ${q.u0_min_deg}°`, q.u0_max_deg !== undefined && `w u = 0 ≤ ${q.u0_max_deg}°`, q.u1_min_deg !== undefined && `w u = 1 ≥ ${q.u1_min_deg}°`, q.u1_max_deg !== undefined && `w u = 1 ≤ ${q.u1_max_deg}°`].filter(Boolean).join(', ')}`,
  lokiec_zakres_ruch: (q) => `kąt łokcia w ruchu dochodzi do ≥ ${q.min_max_deg}° i schodzi do ≤ ${q.max_min_deg}° (pełny zakres)`,
  lokiec_staly_kat: (q) => `kąt łokcia zmienia się o ≤ ${q.max_zmiana_deg}° i nie przekracza ${q.max_deg}° (stały, lekko zgięty)`,
  lokiec_wysokosc_u1: (q) => `w u = 1 łokieć jest ${q.min_cm}…${q.max_cm} cm względem wysokości barku (łokcie na wysokości barków)`,
  kat_ramie_tulow_wzrost: (q) => `kąt ramię–tułów (0° = ramię wzdłuż tułowia) rośnie z u = 0 do u = 1 o ≥ ${q.min_deg}°`,
  dlon_w_plaszczyznie_barkow_u1: (q) => `w u = 1 dłoń leży w płaszczyźnie barków (prostopadłej do tułowia), z odchyłką ≤ ${q.max_cm} cm`,
  dlon_odchodzi_w_bok: (q) => `dłoń oddala się od tułowia wzdłuż osi barków o ≥ ${q.min_cm} cm od u = 0 do u = 1`,
  lokiec_nad_dlonia_u1: (q) => `w u = 1 łokieć jest co najmniej ${q.min_cm} cm nad dłonią`,
  ciezar_blisko_glowy: (q) => `ciężar (środek chwytu) jest w całym ruchu ≤ ${q.max_cm} cm od głowy`,
  miednica_na_linii: (q) => `miednica leży ≤ ${q.max_cm} cm od linii barki–${q.koniec === 'kolano' ? 'kolano' : 'kostka (dalsza)'}${q.tylko_skrajna ? ' w pozycji skrajnej' : ' w całym ruchu'} (ciało w jednej linii)`,
  kregoslup_neutralny: (q) => `zgięcie kręgosłupa (zgiecieKregoslupa; dodatnie = zaokrąglony grzbiet) w ${q.min_deg}°…${q.max_deg}° w każdej klatce (plecy neutralne)`,
  kolano_w_linii_stopy: (q) => `przy zgięciu kolana ≥ ${q.min_zgiecie_deg}° środek kolana (nogi: ${q.strony ?? q.nogi}) leży najwyżej ${q.max_do_srodka_cm} cm przyśrodkowo od prostej pięta–palce stopy (kolana w linii palców)`,
  zawias_biodrowy: (q) => `ruch prowadzą biodra: biodro (${q.noga ?? 'srednia'}) w ruchu dochodzi do ≥ ${q.min_biodro_deg}°, a jego zakres ≥ ${q.min_stosunek} × zakres kolana`,
  klatka_przy_dloniach: (q) => `w najniższym punkcie klatka (bark) jest ≤ ${q.max_cm} cm nad dłońmi (klatka nisko, przy podłodze)`,
  piety_na_podlodze: (q) => `pięta każdej nogi zmienia wysokość o ≤ ${q.max_cm} cm (pięty na podłodze)`,
  kolano_biodro_zakres: (q) => `w ruchu średnie kolano sięga ≥ ${q.kolano_min_max_deg}° i prostuje się do ≤ ${q.kolano_max_min_deg}°, a biodro sięga ≥ ${q.biodro_min_max_deg}°`,
  udo_rownolegle_na_dole: (q) => `w najniższym punkcie (najniższa miednica) udo każdej nogi jest ≤ ${q.max_deg}° nad poziomem (równolegle albo niżej)`,
  stanie_wyprost: (q) => `w którejś klatce kolana ≤ ${q.max_kolano_deg}°, biodra ≤ ${q.max_biodro_deg}° i |pochylenieTulowia| ≤ ${q.max_tulow_deg}° (pełny wyprost)`,
  ciezar_blisko_nog: (q) => `środek chwytu ≤ ${q.max_cm} cm od linii kostka → kolano → miednica → barki (w płaszczyźnie x, y)${q.tylko_ponizej_barkow ? ', dopóki jest poniżej barków' : ''}`,
  ciezar_ponizej_kolan: (q) => `w którejś klatce chwyt jest ≥ ${q.min_cm} cm poniżej środka kolan (start z podłogi)`,
  pochylenie_tulowia_ruch: (q) => `pochylenieTulowia w ruchu: ${[q.min_deg !== undefined && `≥ ${q.min_deg}°`, q.max_deg !== undefined && `≤ ${q.max_deg}°`, q.min_zmiana_deg !== undefined && `zmiana ≥ ${q.min_zmiana_deg}°`, q.max_zmiana_deg !== undefined && `zmiana ≤ ${q.max_zmiana_deg}°`].filter(Boolean).join(', ')}`,
  kolana_max: (q) => `kąt kolan ≤ ${q.max_deg}° w każdej klatce (kolana tylko lekko ugięte)`,
  lawka_kontakt: (q) => `miednica zmienia wysokość o ≤ ${q.max_cm} cm, a zgiecieKregoslupa ≥ ${q.min_kregoslup_deg}° (pośladki i lędźwie na ławce)`,
  chwyt_przy_klatce: (q) => `przy największym zgięciu łokcia chwyt jest ≤ ${q.max_cm} cm przed klatką (w osi normalnej klatki)`,
  lokiec_pod_chwytem: (q) => `odległość chwytu od łokcia w osiach ${q.osie.join(', ')} ≤ ${q.max_cm} cm w całym ruchu (przedramię pionowo)`,
  odwiedzenie_ramienia_max: (q) => `przy największym zgięciu łokcia odwiedzenie ramienia ≤ ${q.max_deg}°`,
  ciezar_nad_glowa: (q) => `${q.tylko_u1 ? 'w u = 1' : 'w którejś klatce'} chwyt ≥ ${q.min_cm} cm nad głową${q.lokiec_max_deg !== undefined ? `, łokcie ≤ ${q.lokiec_max_deg}°` : ''}`,
  chwyt_przy_barkach: (q) => `${q.caly_ruch ? 'w każdej klatce' : 'w którejś klatce'} chwyt jest ${q.min_cm !== undefined ? `${q.min_cm}…` : 'najwyżej '}${q.max_cm} cm względem wysokości barków`,
  ciezar_nad_barkami: (q) => `w najwyższym punkcie chwyt jest ≤ ${q.max_cm} cm przed/za barkami (w osi x)`,
  ugiecie_kolan_zakres: (q) => `największe zgięcie kolan w ruchu ≥ ${q.min_deg}°${q.max_deg !== undefined ? ` i ≤ ${q.max_deg}°` : ''}`,
  dlonie_zblizaja_sie: (q) => `odległość między dłońmi zmienia się o ≥ ${q.min_cm} cm w ruchu`,
  chwyt_nie_ponizej_barkow: (q) => `chwyt nie schodzi poniżej ${q.min_cm} cm względem barku w żadnej klatce`,
  kat_ramie_tulow_zakres: (q) => `kąt ramię–tułów zmienia się o ≥ ${q.min_deg}° w ruchu (dla co najmniej jednej strony)`,
  lokiec_za_tulowiem: (q) => `w którejś klatce łokcie są ≥ ${q.min_cm} cm za linią barków (po stronie pleców)`,
  lokcie_w_dol: (q) => `przy najniższym chwycie łokcie są ≥ ${q.min_cm} cm pod barkami`,
  lot: (q) => `w którejś klatce obie stopy są ≥ ${q.min_cm} cm nad podparciem (podłoga albo wierzch skrzyni) — lot`,
  amortyzacja_ladowania: (q) => `po ostatniej klatce w locie ruch kończy się lądowaniem: kolano ≥ ${q.min_kolano_deg}° i biodro ≥ ${q.min_biodro_deg}° (miękkie lądowanie)`,
  potrojny_wyprost: (q) => `w którejś klatce (nogi: ${q.nogi}) kolano ≤ ${q.max_kolano_deg}°, biodro ≤ ${q.max_biodro_deg}°${q.max_kostka_deg !== undefined ? `, kostka ≤ ${q.max_kostka_deg}°` : ''} — potrójny wyprost`,
  dlonie_na_wysokosci_barkow: (q) => `w którejś klatce ${q.min_rak} ręk(a/i) ma dłoń ≥ ${q.min_cm} cm nad barkiem`,
  rece_przed_wyprostem_bioder: (q) => `od najgłębszego zgięcia bioder do ich wyprostu (≤ ${q.max_biodro_deg}°) łokcie ≤ ${q.max_lokiec_deg}° (ręce proste)`,
  odbior_na_barkach_u1: (q) => `w u = 1 chwyt ${q.min_cm}…${q.max_cm} cm względem barków, łokcie nie niżej niż ${q.max_lokiec_pod_barkiem_cm} cm pod barkiem (odbiór na barkach)`,
  wolna_noga_przod: (q) => `wolna noga (mniej zgięta): kostka ≥ ${q.min_y_cm} cm nad podłogą w ruchu i ≥ ${q.min_przod_cm} cm przed miednicą w najniższym punkcie`,
  wejscie_na_podwyzszenie: (q) => `miednica unosi się o ≥ ${q.min_cm} cm, a na szczycie mniejszy kąt kolan ≤ ${q.max_kolano_deg}°`,
  kolano_tylne_nisko: (q) => `w najniższym punkcie tylne kolano ma y ≤ ${q.max_cm} cm (przy podłodze)`,
  lokcie_wysoko: (q) => `łokcie nie schodzą więcej niż ${q.max_cm} cm pod barki w żadnej klatce`,
  chwyt_blisko_tulowia: (q) => `środek chwytu ≤ ${q.max_cm} cm od odcinka miednica–barki w całym ruchu`,
  kolana_do_klatki: (q) => `w locie (stopy ≥ ${q.min_cm} cm nad podparciem) biodro ≥ ${q.min_biodro_deg}° i kolano ≥ ${q.min_kolano_deg}° (kolana do klatki)`,
  styk_dlonie: (q) => 'w KAŻDEJ klatce dłonie (obie albo tylko ręka trzymająca) mają styk z drążkiem: chwyt leży na osi drążka',
  kolano_zakres_ruch: (q) => `kąt kolana KAŻDEJ nogi osobno (${q.nogi === 'co_najmniej_jedna' ? 'wystarczy, że spełnia go co najmniej jedna noga — noga pracująca' : 'obie nogi'}) w ruchu: ${[q.min_max_deg !== undefined && `dochodzi do ≥ ${q.min_max_deg}°`, q.max_min_deg !== undefined && `prostuje się do ≤ ${q.max_min_deg}°`, q.min_min_deg !== undefined && `nie schodzi poniżej ${q.min_min_deg}° (lekko ugięte)`].filter(Boolean).join(', ')}`,
  rozstaw_zakres: (q) => `odległość między ${q.punkt === 'kolana' ? 'kolanami' : 'kostkami'} (lewa–prawa, w 3D) zmienia się w ruchu o ≥ ${q.min_cm} cm (rozstaw rośnie albo maleje)`,
  stopien_swobody: (q) => `pole klatki „${q.pole}”${q.strona ? ` (ręce: ${q.strona})` : ''}: ${[q.min !== undefined && `≥ ${q.min} w każdej klatce`, q.max !== undefined && `≤ ${q.max} w każdej klatce`, q.min_zakres !== undefined && `zmienia się w ruchu o ≥ ${q.min_zakres} (max − min)`, q.max_zakres !== undefined && `zmienia się w ruchu o ≤ ${q.max_zakres}`, q.osiaga_co_najmniej !== undefined && `w którejś klatce ≥ ${q.osiaga_co_najmniej}`, q.osiaga_co_najwyzej !== undefined && `w którejś klatce ≤ ${q.osiaga_co_najwyzej}`, q.min_abs !== undefined && `w którejś klatce |wartość| ≥ ${q.min_abs}`].filter(Boolean).join(', ')} (jednostki: stopnie albo cm wg opisu pola; pola poza@2 opcjonalne, domyślnie 0; zgiecieSzyi = pochylenieGlowy − pochylenieTulowia)`,
  punkt_zakres: (q) => `punkt „${q.punkt}”${q.strona ? ` (${q.strona})` : ''} przesuwa się w ruchu (max − min) o ≥ ${q.min_cm} cm w ${q.tryb === 'dowolna' ? 'co najmniej jednej z osi' : 'każdej z osi'} ${q.osie.join(', ')}`,
  jedna_reka: (q) => `sztanga ma trzyma: "R" albo "L", a wolna dłoń jest ≥ ${q.min_wolna_od_osi_cm} cm od osi drążka`,
};
/** Sekcja „Reguły sensu” dla ćwiczeń części: reguły raz (z liczbami), potem które ćwiczenia ich dotyczą; + wymóg dla błędów. */
export function sekcjaRegul(rodzina, cwiczenia, root = ROOT) {
  const per = Object.fromEntries(cwiczenia.map((c) => [c, regulyDla(rodzina, c, root)])); const ids = [...new Set(Object.values(per).flatMap((l) => l.map((r) => r.id)))];
  if (!ids.length) return [];
  const dane = wczytajSens(root).rodziny[rodzina]; const L = ['Poza POPRAWNA ma spełniać wszystkie reguły swojego ćwiczenia (bez bujania, z pełnym zakresem). Reguły sprawdza program — każda ma identyfikator:', ''];
  for (const id of ids) { const r = dane.reguly[id]; const dla = cwiczenia.filter((c) => per[c].some((x) => x.id === id));
    L.push(`- [reguła: ${id}] ${OPIS_TYPU[r.typ](r.parametry)} (wskazówka ${r.cue ?? 'z nazwy ćwiczenia'})${r.wskazowka_liczbowa ? `: ${r.wskazowka_liczbowa}` : ''}. Dotyczy: ${dla.length === cwiczenia.length ? 'wszystkich ćwiczeń tej listy' : dla.map((c) => `"${c}"`).join(', ')}.`); }
  const gr = Object.entries(dane.grupy_bledow ?? {}); const grupy = [...new Set(ids.map((id) => dane.reguly[id].grupa))]; const bez = Object.entries(dane.bledy_bez_animacji ?? {});
  if (bez.length) L.push('', 'Błędy tempa i oddechu NIE są animowane pozą (bledy: [] dla tych błędów): ' + bez.map(([cue, t]) => `${cue} — ${t}`).join('; ') + '.');
  if (gr.some(([, g]) => grupy.includes(g))) L.push('', 'BŁĘDY (bledy[]) muszą łamać DOKŁADNIE reguły swojej grupy i żadnych innych: ' + gr.filter(([, g]) => grupy.includes(g)).map(([cue, g]) => `${cue} → grupa „${g}” (${ids.filter((id) => dane.reguly[id].grupa === g).join(', ')})`).join('; ') + '. Czyli błąd pu.noSwing wyraźnie przekracza limity bujania (np. miednica o kilka cm w x, kostki z przodu), ale nie zmienia zakresu ruchu; błąd pu.partial skraca zakres (broda nie dochodzi do drążka), ale nie buja.');
  return L;
}

/* ---------- opis ćwiczeń ---------- */
/** Sprzęt, który kontrakt umie narysować (rodzaje sprzętu: sztanga/drążek, słupek, podłoga, skrzynia/ławka płaska): możliwości katalogu spoza listy (wyciągi, taśmy, piłki, maszyny, ławki skośne, hantle, linę…) → ćwiczenie do zrobienia przez naszego agenta. */
export const sprzetObslugiwany = () => silnik().v2.GEAR_CAPS; /* rejestr lib/figures/v2/gear.ts: możliwości katalogu, które kontrakt umie narysować */
export function sprzetNieobslugiwany(cw, catalog) {
  const e = catalog?.CATALOG?.[cw]; if (!e) return null;
  for (const grupa of e.requires) if (grupa.length && !grupa.some((c) => sprzetObslugiwany().includes(c))) return `sprzęt spoza kontraktu: ${grupa.join(' / ')} — silnik go nie rysuje`;
  return null;
}
const OPIS_SPRZETU = { 'pullup.bar': 'drążek poziomy', rings: 'kółka (zastępuje drążek — rysuj jako drążek)', db: 'hantle (sprzet: rodzaj \"hantel\")', kb: 'kettlebell (sprzet: rodzaj \"kettlebell\")', plate: 'talerz trzymany (sprzet: rodzaj \"talerz\")', med_ball: 'piłka lekarska (sprzet: rodzaj \"pilka_lekarska\")', bench: 'ławka', barbell: 'sztanga', chains: 'łańcuchy (sprzet: rodzaj \"lancuchy\")', wall: 'ściana (sprzet: rodzaj \"sciana\", pole przed)', trap_bar: 'gryf sześciokątny (sprzet: rodzaj \"gryf_szesciokatny\")', farmers_handles: 'uchwyty farmerskie (sprzet: rodzaj \"hantel\", promien 10–12)', landmine: 'landmine (sprzet: rodzaj \"landmine\"; gryf to ten pręt, bez osobnej sztangi)', smith: 'suwnica Smitha (sprzet: rodzaj \"smith\" + sztanga podążająca za chwytem)', ez_bar: 'gryf łamany (sprzet: rodzaj \"sztanga\", dlugosc 120)', axle_bar: 'gryf gruby (sprzet: rodzaj \"sztanga\")', rack: 'stojak (sprzet: rodzaj \"slupek\" z polem hak)', 'bench.uprights': 'stojaki ławki (sprzet: rodzaj \"slupek\" z polem hak)', 'rack.safeties': 'asekuracja stojaka (sprzet: rodzaj \"slupek\")' };
/** Opis możliwości katalogu z rejestru kontraktu (capLabel + rodzaj + wymaganie, np. wysokość bloczka); możliwość spoza rejestru → identyfikator. */
export function opisMozliwosci(cap) {
  const { v2 } = silnik(); const k = v2.GEAR.find((x) => v2.GEAR_KINDS[x].caps.includes(cap)); if (!k) return cap;
  const d = v2.GEAR_KINDS[k]; const label = d.capLabel?.[cap] ?? d.nazwa; return `${label} (sprzet: rodzaj \"${k}\"${d.capNeed?.[cap] ? `, ${d.capNeed[cap]}` : ''})`;
}
/** Rodzaje sprzętu z rejestru kontraktu, których potrzebują ćwiczenia (możliwości katalogu → rodzaj); kolejność jak w rejestrze. */
export function rodzajeSprzetu(cwiczenia, catalog) {
  const { v2 } = silnik(); const caps = new Set(cwiczenia.flatMap((c) => (catalog?.CATALOG?.[c]?.requires ?? []).flat()));
  return v2.GEAR.filter((k) => v2.GEAR_KINDS[k].caps.some((c) => caps.has(c)) && v2.GEAR_KINDS[k].ref);
}
/** Sekcja polecenia „Sprzęt w ćwiczeniach tej części”: punkty odniesienia rodzajów sprzętu (liczby z silnika) albo [] (tylko sprzęt dotychczasowy). */
export function sekcjaSprzetu(cwiczenia, catalog) {
  const { v2 } = silnik(); const rodzaje = rodzajeSprzetu(cwiczenia, catalog); if (!rodzaje.length) return [];
  return ['Rodzaje sprzętu w sprzet[] (pole rodzaj) potrzebne w tej części; sprzęt trzymany w dłoniach NIE ma własnych współrzędnych — podąża za chwytem, a jego pola opisano niżej. Sprzęt dodajesz obok podłogi (podloga).', '', ...rodzaje.flatMap((k) => v2.GEAR_KINDS[k].ref().map((x) => `- ${x}`))];
}
/** Sens ruchu z danych katalogu i nazwy: sprzęt, liczba rąk, obciążenie (bez zgadywania). */
export function sensZKatalogu(cw, catalog) {
  const o = []; const e = catalog?.CATALOG?.[cw];
  if (e) { const sp = e.requires.map((g) => g.map((c) => OPIS_SPRZETU[c] ?? opisMozliwosci(c)).join(' albo ')).join(' + '); if (sp) o.push(`sprzęt: ${sp}`); if (e.loadSource === 'bodyweight') o.push('ciężar ciała'); if (e.implements === 1) o.push('jeden przyrząd (jedna ręka)'); if (e.implements === 2) o.push('dwa przyrządy'); }
  if (/one[- ]arm|single[- ]arm|jednor/i.test(cw)) o.push('JEDNORĄCZ: drążek trzyma jedna dłoń (sprzet: trzyma "R"/"L"), druga ręka wolna poza drążkiem');
  if (/(mixed)/i.test(cw)) o.push('chwyt mieszany: jedna dłoń nachwytem, druga podchwytem (w danych: oba chwyty na osi drążka, rozstaw ±20)');
  if (/neutral/i.test(cw)) o.push('chwyt neutralny (dłonie skierowane do siebie)'); if (/wide/i.test(cw)) o.push('chwyt szeroki (z ±30…40)'); if (/(rear)/i.test(cw)) o.push('ruch za głowę nie jest wymagany — rysuj chwyt szeroki, broda nad drążkiem');
  if (/side[- ]to[- ]side/i.test(cw)) o.push('na górze przesunięcie boczne (miednica.z zmienia się w ruchu)');
  return o;
}
export function opisCwiczenia(cw, { root = ROOT, bledyCwiczenia, catalog = null, rodzina = null }) {
  const tekst = existsSync(join(root, 'lib/cues/text/pl.json')) ? czytaj(join(root, 'lib/cues/text/pl.json')) : {};
  const bez = bledyBezAnimacji(rodzina, root); const wszystkie = bledyCwiczenia(cw, root); const bledy = wszystkie.filter((id) => !(id in bez)).map((id) => (tekst[id] ? `${id} (${tekst[id]})` : id));
  const bezAnim = wszystkie.filter((id) => id in bez);
  const cd = join(root, 'lib/cues/data.json'); const ruch = [];
  const own = existsSync(cd) ? czytaj(cd).exercises?.[cw] : null;
  for (const c of (own?.move ?? []).slice(0, 2)) if (tekst[c.c]) ruch.push(tekst[c.c]);
  if (!ruch.length) { const cs = czytaj(join(root, 'lib/figures/v2/cue-sets.json')).items?.[cw]; for (const id of (cs?.ok ?? []).slice(0, 2)) if (tekst[id]) ruch.push(tekst[id]); }
  return { klucz: cw, bledy, bezAnim, ruch, sens: sensZKatalogu(cw, catalog) };
}

/* ---------- polecenie ---------- */
export const FORMAT_ODPOWIEDZI = (rodzina, klucze) => [
  'FORMAT ODPOWIEDZI (obowiązkowy):',
  `- Odpowiedz JEDNYM blokiem kodu \`\`\`json zawierającym obiekt { "polecenie": "${ETYKIETA_WERSJI}", "rodzina": "${rodzina}", "poze": { "<klucz ćwiczenia>": <poza wg kontraktu>, ... } }.`,
  `- Kluczami w "poze" są DOKŁADNIE te nazwy (bez zmian, wielkość liter jak niżej): ${klucze.map((k) => `"${k}"`).join(', ')}.`,
  '- Każda poza zawiera pola: kontrakt, rodzina, cwiczenie (= klucz), sprzet, klatki, bledy.',
  '- Bez komentarzy, bez tekstu przed i po bloku, bez dopisków w JSON, bez przecinków końcowych. Zapisz JSON zwięźle: jedna klatka w jednej linii, bez zbędnych wcięć (odpowiedź musi się zmieścić w jednej wiadomości).',
  '- Jeśli nie jesteś w stanie dopasować pozy do wymagań, i tak ją zwróć (błędy sprawdzimy my) — nie pomijaj ćwiczeń.',
];

/** Zakres kontraktu w poleceniu dla jednej części (decyzja koordynatora 26.10.2026, limit 36 000 znaków zostaje): rodzaje sprzętu = podłoga i skrzynia, sprzęt domyślny rodziny, sprzęt z możliwości katalogu ćwiczeń części i rodzaje wymienione w szablonie rodziny; pola poza@2 = tylko pola, które nazywają reguły sensu ćwiczeń części (parametry.pole itd.). */
export function zakresPolecenia(rodzina, cwiczenia, root = ROOT) {
  const { v2, catalog } = silnik(); const t = v2.templateFor(rodzina);
  const gear = new Set(['podloga', 'skrzynia', ...(t.defaultGear ?? []).map((g) => g.rodzaj), ...rodzajeSprzetu(cwiczenia, catalog)]);
  if (v2.hasOwnTemplate?.(rodzina)) for (const k of v2.GEAR) if (new RegExp(`\\b${k}\\b`).test(t.gear)) gear.add(k);
  const ext = new Set(); const pola = JSON.stringify(cwiczenia.flatMap((c) => regulyDla(rodzina, c, root).map((r) => r.parametry ?? {})));
  for (const k of v2.EXT_FIELDS) if (pola.includes(`"${k}"`)) ext.add(k);
  return { gear: v2.GEAR.filter((k) => gear.has(k)), ext: [...ext] };
}
export function budujPolecenie({ rodzina, opisRodziny, widoki, czesc, cwiczenia, przyklady, kontrakt, opisy, pomijane = [], sprzet = [], root = ROOT }) {
  const L = [];
  L.push(`# Pozy figur ćwiczeń — rodzina „${rodzina}”${czesc.ile > 1 || czesc.sufiks ? ` (część ${czesc.numer}${czesc.sufiks ?? ''}/${czesc.ile})` : ''} [${ETYKIETA_WERSJI}]`, '');
  L.push('Jesteś animatorem postaci do aplikacji treningowej. Tworzysz dane póz (klatki kluczowe szkieletu) dla ćwiczeń jednej rodziny ruchu. Dane wczyta program, który sprawdzi geometrię ORAZ sens ruchu — poza niezgodna z wymaganiami zostanie odrzucona, więc trzymaj się liczb poniżej. Liczby i relacje są wyliczone z naszego modelu; nie zgaduj ich, tylko podstaw.');
  L.push(`Rodzina: ${opisRodziny}. Widoki w aplikacji: ${widoki} (pozę podajesz w 3D, widoki liczy program).`, '');
  const zakres = zakresPolecenia(rodzina, cwiczenia, root);
  L.push('## Kontrakt danych', '', kontrakt.opisKontraktu(rodzina, zakres), '');
  L.push('## Pola obiektu pozy', '', ...opisPol(kontrakt.schematPozy(rodzina, zakres)), '');
  L.push('## Punkty odniesienia (stałe wymiary i relacje)', '', ...punktyOdniesienia(rodzina), '');
  if (sprzet.length) L.push('## Sprzęt w ćwiczeniach tej części', '', ...sprzet, '');
  L.push('## Wymagania liczbowe walidatora', '', ...wymagania(rodzina).map((x) => `- ${x}`), '');
  const reg = sekcjaRegul(rodzina, cwiczenia, root); if (reg.length) L.push('## Reguły sensu ruchu', '', ...reg, '');
  const aktywne = new Set(cwiczenia.flatMap((c) => regulyDla(rodzina, c, root).map((x) => x.id))); const rej = liniePolecenia(wczytajRejestr(root), liczbyZSilnika(rodzina), undefined, { rodzina, reguly: aktywne }); if (rej.length) L.push('## Najczęstsze błędy z poprzednich odpowiedzi i jak ich uniknąć', '', 'Rejestr błędów popełnionych w poprzednich odpowiedziach (liczba wystąpień) — sprawdź każdy punkt przed odpowiedzią:', ...rej, '');
  przyklady.forEach((p, i) => L.push(`## Wzorzec ${i + 1}: ${p.opis}`, '', '```json', JSON.stringify(p.poza), '```', ''));
  L.push('## Ćwiczenia do wykonania', '', 'Dla każdego: klucz (nazwa ćwiczenia), sens ruchu z katalogu (sprzęt, chwyt), opis ruchu i dozwolone identyfikatory błędów (pole cue).', '');
  for (const o of opisy) L.push(`- "${o.klucz}"${o.sens.length ? ` — sens: ${o.sens.join('; ')}` : ''}${o.ruch.length ? ` — ruch: ${o.ruch.join(' ')}` : ''} — błędy: ${o.bledy.length ? o.bledy.join('; ') : 'brak (bledy: [])'}${o.bezAnim?.length ? ` (nie animujemy: ${o.bezAnim.join(', ')} — to cecha tempa/oddechu, nie pozy)` : ''}`);
  if (pomijane.length) L.push('', `Poza tym poleceniem (nie generuj ich): ${pomijane.map((x) => `"${x.klucz}" — ${x.powod}`).join('; ')}.`);
  L.push('', '## Zasady dla każdego ćwiczenia', '', '- u = 0 to pozycja wyjściowa, u = 1 pozycja skrajna ruchu; dobierz sprzęt (sprzet[]) i chwyt do tego konkretnego ćwiczenia (sens z listy powyżej).', '- Poza ma być anatomicznie wiarygodna dla nazwanego ćwiczenia, ale zgodność z liczbami i regułami powyżej jest ważniejsza niż szczegół.', '- Przed odpowiedzią sprawdź każdą pozę punkt po punkcie: zasięg ramienia, zakresy stawów z marginesem, przenikanie, chwyt na osi, reguły sensu, deklaracje „dotyczy”.', '');
  L.push(...FORMAT_ODPOWIEDZI(rodzina, cwiczenia));
  return L.join('\n') + '\n';
}

const PODOBNE = { pulldown: 'pull_up', core_hang: 'pull_up', dip: 'pull_up', cable_row: 'pull_up' };
/** Wzorce: (1) z tej samej rodziny — zaliczone pozy z poses/ (najpierw z błędami, najwięcej klatek) albo wyliczony z modelu (pull_up), (2) z rodziny podobnej, (3) w ostateczności przysiad. Razem ≤ 2. */
export function wzorce(rodzina, kontrakt, root = ROOT) {
  const o = []; const wlasne = Object.entries(pozyGotowe(rodzina, root).cwiczenia ?? {}).sort((a, b) => (b[1].bledy.length > 0) - (a[1].bledy.length > 0) || b[1].klatki.length - a[1].klatki.length);
  if (rodzina === 'pushup_plank') o.push({ opis: '„Push Up” wyliczony z modelu (ciało w jednej linii na palcach, dłonie stałe; przechodzi geometrię i reguły sensu; liczby dopasuj do swojego ćwiczenia, ta sama struktura)', poza: wzorzecPompki() });
  if (rodzina === 'core_floor') o.push({ opis: '„Crunch” leżąc na plecach wyliczony z modelu (przechodzi geometrię i reguły sensu; liczby dopasuj do swojego ćwiczenia, ta sama struktura)', poza: wzorzecCrunch() });
  if (rodzina === 'pull_up') { const w = wzorzecPodciagania(); if (w) o.push({ opis: `„Pull Up” wyliczony z modelu (drążek y = 230, chwyt z = ±22; przechodzi walidację geometrii i sensu; liczby dopasuj do swojego ćwiczenia, ta sama struktura i sposób liczenia)`, poza: w.poza }); }
  for (const [cw, poza] of wlasne.slice(0, 1)) o.push({ opis: `zaliczona poza „${cw}” z tej samej rodziny`, poza });
  const pod = PODOBNE[rodzina]; if (pod && pod !== rodzina && o.length < 2) { const [cw, poza] = Object.entries(pozyGotowe(pod, root).cwiczenia ?? {})[0] ?? []; if (poza) o.push({ opis: `zaliczona poza „${cw}” z rodziny podobnej (${pod})`, poza }); }
  if (!o.length) { const p = kontrakt.przyklad(rodzina)[0] ?? kontrakt.przyklad('squat')[0]; o.push({ opis: `przykład poprawnej pozy (ćwiczenie „${p.cwiczenie}” z gotowej rodziny; ta sama struktura, liczby dopasuj do swojego ćwiczenia)`, poza: p.poza }); }
  return o.slice(0, 2);
}
/** Polecenia rodziny: [{ plik, tresc, cwiczenia, pomijane }]. */
/** Klasyfikacja ćwiczeń rodziny do zrobienia: do polecenia (mają reguły sensu), pomijane (sprzęt spoza kontraktu / wyjątek — zrobi nasz agent) i WSTRZYMANE (brak reguły sensu — bramka per ćwiczenie, docs/53; `bezRegul` wpuszcza je). */
export function klasyfikujCwiczenia(rodzina, { root = ROOT, lista, bezRegul = false } = {}) {
  const { catalog } = silnik(); const wszystkie = doZrobienia(rodzina, { root, lista }); const robic = [], pomijane = [], wstrzymane = [];
  for (const c of wszystkie) { const p = pominiecie(rodzina, c, root) ?? sprzetNieobslugiwany(c, catalog);
    const czeka = regulyDla(rodzina, c, root).map((r) => czekaNaKontrakt(r, silnik().v2.CONTRACT.id)).find(Boolean);
    if (p) pomijane.push({ klucz: c, powod: `pomiń — zrobi nasz agent (${p})` });
    else if (czeka) wstrzymane.push({ klucz: c, powod: `czeka na kontrakt — ${czeka}` });
    else if (otwarteDla(rodzina, c, root)) wstrzymane.push({ klucz: c, powod: `OTWARTE — brak źródła ruchu (${otwarteDla(rodzina, c, root)})` });
    else if (!bezRegul && !regulyDla(rodzina, c, root).length) wstrzymane.push({ klucz: c, powod: 'wstrzymane — brak reguły sensu dla tego ćwiczenia (docs/53, bramka 3)' });
    else robic.push(c); }
  return { robic, pomijane, wstrzymane };
}
/** Części polecenia po odfiltrowaniu (tylko ćwiczenia z regułami i sprzętem w kontrakcie): [{ id, cwiczenia }] — te same części, których używa generator i import (rozpoznanie wklejonej części i brakujących ćwiczeń). */
export function czesciPolecen(rodzina, opcje = {}) {
  const cz = podzielNaCzesci(klasyfikujCwiczenia(rodzina, opcje).robic);
  return cz.map((cwiczenia, i) => ({ id: cz.length === 1 ? rodzina : `${rodzina}-${i + 1}`, cwiczenia }));
}
/** Polecenia rodziny: [{ plik, tresc, cwiczenia, pomijane, wstrzymane }] — części liczone po odfiltrowaniu (tylko ćwiczenia z regułami), pominięte i wstrzymane wymienione w pierwszej części. */
export async function poleceniaRodziny(rodzina, { root = ROOT, lista, bezRegul = false, wyklucz = [], nazwa = null, maxZnakow = MAX_ZNAKOW } = {}) {
  const kontrakt = await wczytajKontrakt(root);
  if (!kontrakt) throw new Error('brak scripts/figures/v2-validate.mjs');
  const docs = lista ?? join(root, 'docs/51-figury-v2-pokrycie.md'); const r = rodzinyZDokumentu(docs).find((x) => x.id === rodzina);
  const przyklady = wzorce(rodzina, kontrakt, root); const { catalog } = silnik();
  const kl = klasyfikujCwiczenia(rodzina, { root, lista: docs, bezRegul }); const { pomijane, wstrzymane } = kl; const robic = kl.robic.filter((c) => !wyklucz.includes(c)); /* --wyklucz: ćwiczenia już wysłane wcześniejszymi plikami */
  const cz = podzielNaCzesci(robic);
  /* jedna część rodziny → polecenie; gdy tekst przekracza limit okna czatu (sekcja sprzętu rośnie z liczbą rodzajów), część dzielona na pół (sufiks a/b, rekurencyjnie); pominięte i wstrzymane wymienia tylko pierwsze polecenie */
  const zbuduj = (czesc, cwiczenia, sufiks, pierwsze) => {
    const info = pierwsze ? [...pomijane, ...wstrzymane] : [];
    return { plik: `${czesc.id}${sufiks}.md`, cwiczenia, pomijane: pierwsze ? pomijane : [], wstrzymane: pierwsze ? wstrzymane : [],
      tresc: budujPolecenie({ rodzina, opisRodziny: r.opis, widoki: r.widoki, czesc: { ...czesc, sufiks }, cwiczenia, przyklady, kontrakt, pomijane: info, sprzet: sekcjaSprzetu(cwiczenia, catalog), root, opisy: cwiczenia.map((c) => opisCwiczenia(c, { root, bledyCwiczenia: kontrakt.bledyCwiczenia, catalog, rodzina })) }) };
  };
  const dziel = (czesc, cwiczenia, sufiks = '', pierwsze = false) => {
    const w = zbuduj(czesc, cwiczenia, sufiks, pierwsze); if (w.tresc.length <= maxZnakow || cwiczenia.length <= 1) return [w];
    const hh = Math.ceil(cwiczenia.length / 2);
    return [...dziel(czesc, cwiczenia.slice(0, hh), sufiks + 'a', pierwsze), ...dziel(czesc, cwiczenia.slice(hh), sufiks + 'b', false)];
  };
  return cz.flatMap((cwiczenia, i) => dziel({ id: nazwa && cz.length === 1 ? nazwa : nazwa ? `${nazwa}-${i + 1}` : cz.length === 1 ? rodzina : `${rodzina}-${i + 1}`, numer: i + 1, ile: cz.length }, cwiczenia, '', i === 0));
}

export function parsujArgumenty(argv) {
  const o = { rodzina: null, wszystkie: false, bezRegul: false, wyklucz: [], nazwa: null, wyjscie: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]; const w = () => { if (i + 1 >= argv.length) throw new Error(`brak wartości dla ${a}`); return argv[++i]; };
    if (a === '--rodzina') { o.rodzina = w(); if (!/^[a-z][a-z0-9_]{1,40}$/.test(o.rodzina)) throw new Error('--rodzina: oczekiwany identyfikator rodziny'); }
    else if (a === '--wszystkie') o.wszystkie = true;
    else if (a === '--wyklucz') o.wyklucz = w().split(',').map((x) => x.trim()).filter(Boolean); /* ćwiczenia pominięte w tym przebiegu (już wysłane innymi plikami) */
    else if (a === '--nazwa') { o.nazwa = w(); if (!/^[a-z][a-z0-9_-]{1,40}$/.test(o.nazwa)) throw new Error('--nazwa: oczekiwana nazwa pliku bez rozszerzenia'); } /* nazwa pliku wyniku zamiast <rodzina> (nie nadpisuje plików już wysłanych) */
    else if (a === '--bez-regul') o.bezRegul = true; /* wymusza polecenie dla rodziny bez reguł sensu (bramka 3 pominięta — tylko świadomie) */
    else if (a === '--wyjscie') o.wyjscie = w();
    else throw new Error(`nieznany argument: ${a}`);
  }
  if (!o.wyjscie) throw new Error('wymagane: --wyjscie <katalog>');
  if (!!o.rodzina === o.wszystkie) throw new Error('wymagane: dokładnie jedno z --rodzina <id> albo --wszystkie');
  return o;
}

export async function main(argv, { root = ROOT, log = console.log, maxZnakow = MAX_ZNAKOW } = {}) {
  const o = parsujArgumenty(argv); const docs = join(root, 'docs/51-figury-v2-pokrycie.md');
  const maRegul = (id) => !!wczytajSens(root).rodziny?.[id];
  const ids = (o.wszystkie ? rodzinyZDokumentu(docs).filter((r) => r.stan !== 'gotowa' || existsSync(join(root, 'lib/figures/v2/poses', `${r.id}.json`))).map((r) => r.id) : [o.rodzina]).filter((id) => { if (maRegul(id) || o.bezRegul) return true; log(`${id}: POMINIĘTA — brak reguł sensu w data/zrodla/figury-sens.json (docs/53, bramka 3; --bez-regul wymusza)`); return false; });
  mkdirSync(resolve(o.wyjscie), { recursive: true }); let plikow = 0, najdluzsze = 0, rodzin = 0, przekroczone = 0;
  for (const id of ids) {
    const p = await poleceniaRodziny(id, { maxZnakow, root, bezRegul: o.bezRegul, wyklucz: o.wyklucz, nazwa: o.nazwa }); if (!p.length) { log(`${id}: brak ćwiczeń do wysłania (pozy gotowe, albo wszystkie pominięte/wstrzymane — sprzęt poza kontraktem, OTWARTE, brak reguł)`); continue; }
    rodzin++;
    for (const x of p) {
      if (x.tresc.length > maxZnakow) { if (x.cwiczenia.length > 1) throw new Error(`${x.plik}: polecenie ma ${x.tresc.length} znaków (limit ${maxZnakow})`); log(`${x.plik}: POMINIĘTE — polecenie jednego ćwiczenia (${x.cwiczenia[0]}) ma ${x.tresc.length} znaków, limit ${maxZnakow} (sekcja sprzętu + kontrakt); zrobi nasz agent albo po skróceniu kontraktu`); przekroczone++; continue; }
      writeFileSync(join(resolve(o.wyjscie), x.plik), x.tresc); plikow++; najdluzsze = Math.max(najdluzsze, x.tresc.length);
      log(`${x.plik}: ${x.cwiczenia.length} ćwiczeń, ${x.tresc.length} znaków`);
    }
  }
  if (przekroczone) log(`UWAGA: ${przekroczone} polecenie(a) jednego ćwiczenia przekracza limit ${maxZnakow} znaków i nie zostało zapisane`);
  log(`rodzin: ${rodzin}, plików: ${plikow}, najdłuższe: ${najdluzsze} znaków`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2)).then((c) => process.exit(c), (e) => { console.error(`błąd: ${e.message}`); process.exit(1); });
