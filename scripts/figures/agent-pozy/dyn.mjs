// Wspólne narzędzia generatorów póz RUCHÓW DYNAMICZNYCH (wersja 1.1, 26.10.2026): olympic, plyo, kb_ballistic, sled_throw, strongman.
// Pozy liczone z modelu przez kinematykę PROSTĄ w płaszczyźnie strzałkowej (kąty uda i kolana → kostka; kąty ramienia i łokcia → chwyt), biegun kolana i łokcia z FK, długości kości z BODY.
// Ruch dynamiczny (lot, przechwyt, wymach) = kilka punktów kluczowych, których u wyznacza DROGA najszybszego punktu (kontrakt: skok ≤ CONTRACT.maxJump cm na 1/CONTRACT.step ruchu).
// Wejście: wyłącznie liczby z modelu i wskazówki z katalogu (docs/53, bramka 11); żadnych cudzych obrazów.
import { v2, silnik, BODY, R, r1, up, front, klatka, bladZTrajektorii, zbuduj, barki, przeciecie, delta } from './model.mjs';
import { wczytajTeksty } from '../v2-jakosc.mjs';
import { powodWstrzymania } from './bledy-wstrzymane.mjs';
import { bledyCwiczenia } from '../v2-validate.mjs';
export { v2, BODY, R, r1, up, front, klatka, bladZTrajektorii, zbuduj, barki, przeciecie, delta };

/** Tryb cykliczny pętli (27.10.2026, marsz): po fazie 0 → 1 ta sama faza z zamienionymi nogami (i rękami, gdy `rece`); klatka u = 1 MUSI być lustrem klatki u = 0 (walidator, kod „petla”). Pole po „cwiczenie”. */
export function cyklLustro(poza, { rece = false } = {}) { const { sprzet, klatki, bledy, ...head } = poza; return { ...head, petla: 'cykl_lustro', ...(rece ? { lustroRece: true } : {}), sprzet, klatki, bledy }; }
/** Tryb jednokierunkowy pętli (28.10.2026, skoki i rzuty): u 0 → 1 to CAŁE powtórzenie (stanie → ugięcie → lot → lądowanie; przysiad → rzut), animacja po końcu skacze do u = 0 zamiast odtwarzać ruch wstecz (silnik: oneWayAt). Pole po „cwiczenie”. */
export function jednokierunkowa(poza) { const { sprzet, klatki, bledy, ...head } = poza; return { ...head, petla: 'jednokierunkowa', sprzet, klatki, bledy }; }
export const lerp = (a, b, t) => a + (b - a) * t;
export const lerpV = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const ease = (x) => { const t = clamp(x, 0, 1); return t * t * (3 - 2 * t); };
export const PODLOGA = (x0 = -150, x1 = 150) => ({ rodzaj: 'podloga', x0, x1 });
export const HIPZ = () => BODY().hipHalf;
export const SHZ = () => BODY().shHalf;
const sgn = (s) => (s === 'R' ? 1 : -1);

/** Błędy z katalogu wskazówek, które mają opis w lib/cues/text/pl.json (reguła jakości etykieta_bledu); pozostałe nie są rysowane, powód trafia do `rejestr` (ćwiczenie → powód). */
export function bledyZOpisem(cw, bledy, rejestr = {}) {
  const t = wczytajTeksty();
  return bledy.filter((b) => { const w = powodWstrzymania(b.cue); if (w) { rejestr[cw] = `błąd „${b.cue}” wstrzymany: ${w}`; return false; } if (t[b.cue] || process.env.POZY_TEKSTY_BLEDOW === 'wszystkie') return true; rejestr[cw] = `błąd „${b.cue}” bez opisu w lib/cues/text/pl.json — nie rysowany (reguła jakości etykieta_bledu); generator narysuje go po wdrożeniu tekstu`; return false; });
}

/** Wyjątki opisu (manifest): id błędu z katalogu wskazówek ćwiczeń rodziny, który nie ma tekstu w lib/cues/text/pl.json → powód (tekst wdroży tłumacz; błąd nierysowany). */
export function wyjatkiOpisu(rodzina) {
  const { v2: E, catalog } = silnik(); const t = wczytajTeksty(); const o = {};
  for (const [k, e] of Object.entries(catalog.CATALOG)) if (E.familyOf(k, e) === rodzina) for (const c of bledyCwiczenia(k)) if (!t[c]) o[c] = 'brak tekstu w lib/cues/text/pl.json (id w newIds cue-sets.json: tekst wdroży tłumacz); błąd nierysowany do czasu wdrożenia tekstu (reguła etykieta_bledu)';
  return o;
}
/** Noga z FK: biodro (x, y), kąt uda t (od +x, przeciwnie do wskazówek zegara; −90 = udo w dół), zgięcie kolana k. Zwraca kolano, kostkę, kierunek goleni sd i biegun kolana. */
export function nogaFK(hip, t, k) {
  const b = BODY(); const Kn = [hip[0] + b.thigh * Math.cos(t * R), hip[1] + b.thigh * Math.sin(t * R)]; const sd = t - k;
  const A = [Kn[0] + b.shank * Math.cos(sd * R), Kn[1] + b.shank * Math.sin(sd * R)];
  const mid = [(hip[0] + A[0]) / 2, (hip[1] + A[1]) / 2]; let pole = [Kn[0] - mid[0], Kn[1] - mid[1]]; const l = Math.hypot(...pole); pole = l < 0.4 ? null : pole.map((x) => x / l);
  return { knee: Kn, ankle: A, sd, pole };
}
/** Biodro, gdy kostka stoi w A = [x, y] przy kącie uda t i zgięciu kolana k. */
export function biodroZKostki(A, t, k) { const f = nogaFK([0, 0], t, k); return [A[0] - f.ankle[0], A[1] - f.ankle[1]]; }
/** Ramię z FK: bark S (x, y), kąt ramienia psi (od +x, −90 = w dół, 90 = w górę), zgięcie łokcia th (przedramię obraca się od psi ku +x i górze). Zwraca łokieć, chwyt (x, y) i biegun. */
export function ramieFK(S, psi, th) {
  const b = BODY(); const E = [S[0] + b.uarm * Math.cos(psi * R), S[1] + b.uarm * Math.sin(psi * R)]; const fd = psi + th; const l2 = b.farm + b.hand;
  const G = [E[0] + l2 * Math.cos(fd * R), E[1] + l2 * Math.sin(fd * R)];
  const mid = [(S[0] + G[0]) / 2, (S[1] + G[1]) / 2]; let pole = [E[0] - mid[0], E[1] - mid[1]]; const l = Math.hypot(...pole); pole = l < 0.4 ? null : pole.map((x) => x / l);
  return { elbow: E, grip: G, pole };
}
/** Chwyt sięgający celu: ramię w płaszczyźnie (x, y) od barku S do punktu G (z IK dwukostnego, łokieć po stronie `pole`); zwraca { g, pole }. */
export function ramieDoCelu(S, G, strona = 'dol') {
  const b = BODY(); const l2 = b.farm + b.hand; const p = przeciecie(S, b.uarm, G, l2, strona === 'dol' ? 'dol' : 'gora'); if (!p) return null;
  const mid = [(S[0] + G[0]) / 2, (S[1] + G[1]) / 2]; let pole = [p[0] - mid[0], p[1] - mid[1]]; const l = Math.hypot(...pole); pole = l < 0.4 ? null : pole.map((x) => x / l); return { elbow: p, grip: G, pole };
}
/**
 * Klatka kontraktu z opisu w kątach.
 *  u, pel [x, y] (środek stawów biodrowych), pitch (pochylenie tułowia), bend, head (pochylenie głowy);
 *  nogi: { R: { t, k, dors (zgięcie grzbietowe względem prostopadłej do goleni) | pod (bezwzględne), z (rozstaw kostki), rot, odch }, L: {...} } (L domyślnie = R),
 *  rece: { R: { psi, th, z } | { g: [x, y, z], pole }, L } (L domyślnie = R).
 */
export function F({ u, pel, pitch, bend = 0, head, nogi, rece, z0 = 0, zo = 0, bocz = false }) {
  const hip = [pel[0], pel[1]]; const S = barki(hip, pitch, bend); const nog = {}; const rec = {};
  for (const s of ['R', 'L']) {
    const g = nogi[s] ?? nogi.R; const sg = sgn(s); const f = nogaFK(hip, g.t, g.k); const pole = g.nopole ? null : (g.pole ?? f.pole);
    const pod = g.pod !== undefined ? g.pod : f.sd + 90 + (g.dors ?? 0);
    nog[s] = { k: [f.ankle[0], f.ankle[1], sg * (g.z ?? 12) + zo], pod, rot: g.rot ?? 10, pole: pole ? [pole[0], pole[1], sg * (g.kz ?? 0.12)] : undefined, odchylenie: g.odch };
    const a = rece[s] ?? rece.R;
    if (a.w !== undefined) { /* chwyt = w · punkt w świecie + (1 − w) · punkt w układzie tułowia (sztanga zakotwiczona na podłodze → przy barkach) */
      const u2 = up(pitch), f2 = front(pitch); const gz = sg * (a.z ?? 30) + zo; const wx = a.g[0], wy = a.g[1]; const rx = S[0] + u2[0] * a.rel[0] + f2[0] * a.rel[1], ry = S[1] + u2[1] * a.rel[0] + f2[1] * a.rel[1];
      rec[s] = { g: [lerp(rx, wx, a.w), lerp(ry, wy, a.w), gz], pole: a.pole ? [a.pole[0], a.pole[1], sg * a.pole[2]] : undefined }; continue; }
    if (a.rel) { const u2 = up(pitch), f2 = front(pitch); const gz = sg * (a.z ?? 30) + zo; rec[s] = { g: [S[0] + u2[0] * a.rel[0] + f2[0] * a.rel[1], S[1] + u2[1] * a.rel[0] + f2[1] * a.rel[1], gz], pole: a.pole ?? [-0.5, -1, sg * 0.6] }; continue; } /* chwyt względem tułowia (a w górę, b do przodu klatki): sztanga na plecach, ciężar przy klatce */
    if (a.g) { rec[s] = { g: [a.g[0], a.g[1], a.g[2] + zo], pole: a.pole }; continue; }
    const r = ramieFK(S, a.psi, a.th); const z = sg * (a.z ?? SHZ()) + zo; rec[s] = { g: [r.grip[0], r.grip[1], z], pole: r.pole ? [r.pole[0], r.pole[1], sg * (a.pz ?? 0.25)] : undefined };
  }
  /* bocz: zo to boczne przesunięcie korzenia (poza@2, przesuniecieBoczne): miednica.z bez przesunięcia, kostki i chwyty w świecie (już z zo) */
  return klatka({ u, miednica: [hip[0], hip[1], bocz ? z0 : z0 + zo], pitch, bend, glowa: head ?? pitch * 0.5, nogi: nog, rece: rec, boczne: bocz ? zo : undefined });
}

/** Kostka dla biodra hip, kąta goleni al i zgięcia kolana k (FK) — do opisu pozy przez wysokość miednicy. */
export const kostkaZBiodra = (hip, al, k) => nogaFK(hip, -90 - al + k, k).ankle;
/** Kolano w płaszczyźnie (x, y): przecięcie okręgów udo/goleń; z dwóch rozwiązań to po stronie wektora `pole` względem prostej biodro–kostka (domyślnie ku przodowi). */
export function kolano2D(hip, ankle, pole = [1, 0]) {
  const b = BODY(); const dx = ankle[0] - hip[0], dy = ankle[1] - hip[1]; const d = Math.hypot(dx, dy) || 1e-6; const dd = Math.min(Math.max(d, Math.abs(b.thigh - b.shank) + 1e-6), b.thigh + b.shank - 1e-6);
  const a = (b.thigh ** 2 - b.shank ** 2 + dd * dd) / (2 * dd); const h = Math.sqrt(Math.max(0, b.thigh ** 2 - a * a)); const ux = dx / d, uy = dy / d; const n = [-uy, ux]; const sg = n[0] * pole[0] + n[1] * pole[1] >= 0 ? 1 : -1;
  return [hip[0] + ux * a + sg * n[0] * h, hip[1] + uy * a + sg * n[1] * h];
}
/** Kąty nogi (t, k) dla biodra i celu kostki (IK w płaszczyźnie). */
export function katyNogi(hip, ankle, pole = [1, 0]) {
  const Kn = kolano2D(hip, ankle, pole); const t = Math.atan2(Kn[1] - hip[1], Kn[0] - hip[0]) / R; const sd = Math.atan2(ankle[1] - Kn[1], ankle[0] - Kn[0]) / R; let k = t - sd; while (k < 0) k += 360; while (k > 180) k = 360 - k; return { t, k };
}
/**
 * Klatka z PARAMETRÓW (korzeń = kostka prawej nogi, więc stopa stojąca na podłożu nie ślizga się, gdy parametry się nie zmieniają; miednica z FK):
 *  A [x, y] kostka prawej nogi, al (pochylenie goleni od pionu: kolano przed kostką), k (zgięcie kolana), pod (bezwzględne podbicie) albo dors (zgięcie grzbietowe względem prostopadłej do goleni), zR/zL (rozstaw kostek),
 *  AL [x, y] (opcjonalnie) kostka lewej nogi z IK (noga lewa inna niż prawa: wykrok, jednonóż), podL (podbicie lewej, domyślnie jak prawej), pz (przesunięcie boczne miednicy),
 *  pitch, bend, head, ra/rl: ramiona { psi, th, z } albo { g: [x, y, z], pole } (rl domyślnie = ra).
 */
export function P(p) {
  const l = { t: -90 - p.al + p.k, k: p.k }; const hip = biodroZKostki(p.A, l.t, l.k); const nogi = { R: { ...l, pod: p.pod ?? (p.dors === undefined ? 0 : undefined), dors: p.dors, z: p.zR ?? 12, rot: p.rotR, odch: p.odchR, kz: p.kz, nopole: p.nopole } };
  if (p.AL) { const kt = katyNogi(hip, p.AL); nogi.L = { ...kt, pod: p.podL ?? p.pod ?? (p.dors === undefined ? 0 : undefined), dors: p.dors, z: p.zL ?? p.zR ?? 12, rot: p.rotL, odch: p.odchL, kz: p.kz, nopole: p.nopole }; } else nogi.L = { ...nogi.R, z: p.zL ?? p.zR ?? 12 };
  return F({ u: 0, pel: hip, pitch: p.pitch === undefined || (p.ra?.w !== undefined && p.ra.w >= 0.999 && p.ra.g) ? pitchDoChwytu(hip, p.ra, p.bend ?? 0) : p.pitch, bend: p.bend ?? 0, head: p.head, nogi, rece: { R: p.ra, L: p.rl ?? p.ra }, zo: p.zo ?? 0, bocz: !!p.bocz });
}
/** Pochylenie tułowia, przy którym chwyt zakotwiczony w świecie (ra.g, z) leży w prawie wyprostowanym zasięgu ramienia (ra.reach, domyślnie 62 cm) od barku; skan 0…100° (wybór najmniejszego błędu). */
export function pitchDoChwytu(hip, ra, bend = 0) {
  const reach = ra.reach ?? 62; const dz = (ra.z ?? 30) - SHZ(); let best = 0, bv = Infinity;
  for (let p = 0; p <= 100; p += 0.25) { const S = barki(hip, p, bend); const d = Math.sqrt((S[0] - ra.g[0]) ** 2 + (S[1] - ra.g[1]) ** 2 + dz * dz); const e = Math.abs(d - reach); if (e < bv) { bv = e; best = p; } }
  return best;
}
/** Klatka z położeń: miednica pel [x, y], kostki AR i AL [x, y] (IK nóg w płaszczyźnie, kolana ku przodowi), podbicia podR/podL, pitch, bend, head, ra/rl (ramiona), zo (przesunięcie boczne), zR/zL (rozstaw kostek). */
export function Q(p) {
  const hip = [p.pel[0], p.pel[1]]; const kR = katyNogi(hip, p.AR, p.pole ?? [1, 0]), kL = katyNogi(hip, p.AL, p.poleL ?? p.pole ?? [1, 0]); /* poleL: kolano lewej (tylnej) nogi, np. [−1, 0] — do tyłu */
  return F({ u: 0, pel: hip, pitch: p.pitch === undefined || (p.ra?.w !== undefined && p.ra.w >= 0.999 && p.ra.g) ? pitchDoChwytu(hip, p.ra, p.bend ?? 0) : p.pitch, bend: p.bend ?? 0, head: p.head, nogi: { R: { ...kR, pod: p.podR ?? 0, z: p.zR ?? 12, nopole: p.nopoleR, rot: p.rot, kz: p.kz }, L: { ...kL, pod: p.podL ?? p.podR ?? 0, z: p.zL ?? 12, rot: p.rot, kz: p.kz } }, rece: { R: p.ra, L: p.rl ?? p.ra }, zo: p.zo ?? 0, bocz: !!p.bocz });
}
/** Punkty do pomiaru ciągłości (jak pts() w contract.ts). */
const pts = (f) => [f.sk.pelvis, f.sk.head, f.sk.shoulderC, f.sk.spineMid, ...['R', 'L'].flatMap((s) => [f.sk.legs[s].knee, f.sk.legs[s].ankle, f.sk.legs[s].heel, f.sk.legs[s].toe, f.sk.arms[s].elbow, f.sk.arms[s].grip]), ...(f.info?.load ? [f.info.load] : [])];
const d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
/**
 * Przydział u do punktów kluczowych według DROGI najszybszego punktu (kontrakt: interpolacja liniowa, skok ≤ maxJump cm na 1/step ruchu). Najpierw odcinek dostaje u proporcjonalne do drogi między punktami,
 * potem kilka iteracji wyrównuje RZECZYWISTĄ szybkość (kolana i łokcie z IK poruszają się nieliniowo między klatkami, więc sama droga między końcami nie wystarcza): Δu_i ∝ v_i · Δu_i, gdzie v_i = największy skok na 1/step w odcinku.
 * `minU` = najmniejsze Δu odcinka. Zwraca { us, suma (Σ dróg, cm), szczyt (największy skok na 1/step, cm), dl }.
 */
export function przydzielU(klatki, { rodzina, cw, sprzet, minU = 0.015, iter = 30 }) {
  const E = v2(); const n = klatki.length; const mk = (us) => ({ kontrakt: E.CONTRACT.id, rodzina, cwiczenie: cw, sprzet, klatki: klatki.map((k, i) => ({ ...k, u: us[i] })), bledy: [] });
  let us = klatki.map((_, i) => i / (n - 1));
  const P0 = us.map((u) => pts(E.keyframeFrame(mk(us), u))); const dl = []; for (let i = 1; i < n; i++) dl.push(Math.max(...P0[i].map((q, j) => d3(q, P0[i - 1][j]))));
  const norm = (w) => { const raw = w.map((x) => Math.max(minU, x)); const t = raw.reduce((a, b) => a + b, 0); let acc = 0; const o = [0]; raw.forEach((x) => { acc += x / t; o.push(acc); }); o[o.length - 1] = 1; return o.map((x) => Math.round(x * 1000) / 1000); };
  const suma = dl.reduce((a, b) => a + b, 0) || 1; us = norm(dl.map((d) => d / suma));
  let szczyt = 0; let najlepszy = { us, szczyt: Infinity }; const N = 192;
  for (let it = 0; it < iter; it++) {
    const poza = mk(us); const v = Array(n - 1).fill(0); let prev = pts(E.keyframeFrame(poza, 0));
    for (let g = 1; g <= N; g++) { const u = g / N; const cur = pts(E.keyframeFrame(poza, u)); const m = Math.max(...cur.map((q, j) => d3(q, prev[j]))); let i = 0; while (i < n - 2 && u > us[i + 1] + 1e-9) i++; v[i] = Math.max(v[i], m * N); prev = cur; }
    szczyt = Math.max(...v) / E.CONTRACT.step; /* v = cm na jednostkę u → cm na 1/step */
    if (process.env.DBG_U) console.error(it, szczyt.toFixed(1), us.join(","), v.map((x) => (x / 48).toFixed(1)).join(" "));
    if (szczyt < najlepszy.szczyt) najlepszy = { us: [...us], szczyt };
    const eff = norm(v.map((vi, i) => vi * (us[i + 1] - us[i]))); us = us.map((x, i) => Math.round((x + 0.6 * (eff[i] - x)) * 1000) / 1000); /* tłumienie 0,6: bez oscylacji */
  }
  return { us: najlepszy.us, suma, szczyt: najlepszy.szczyt, dl };
}
/** Zbiera klatki z listy opisów (bez u), przydziela u wg drogi i zwraca klatki kontraktu z u. */
export function kluczowe(klatki, ctx) { const { us } = przydzielU(klatki, ctx); return klatki.map((k, i) => ({ ...k, u: us[i] })); }

/** Mieszanie parametrów (zagnieżdżone obiekty i tablice liczb): a + (b − a) · t; pola nieliczbowe i brakujące w b bierze z a. */
export function mix(a, b, t) {
  if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * t;
  if (Array.isArray(a) && Array.isArray(b)) return a.map((x, i) => mix(x, b[i], t));
  if (a && typeof a === 'object' && b && typeof b === 'object') { const o = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) o[k] = k in a && k in b ? mix(a[k], b[k], t) : (k in a ? a[k] : b[k]); return o; }
  return t < 0.5 ? a : b;
}
/**
 * Ruch z punktów zwrotnych w przestrzeni PARAMETRÓW (kąty, położenie kostki): `W` = lista opisów; `buduj(params)` → klatka kontraktu. Parametry między punktami zwrotnymi mieszane liniowo (łuki zamiast cięciwy
 * w przestrzeni kartezjańskiej, stopy zakotwiczone, dopóki parametry kostki są stałe). Wybiera n ≤ 12 klatek kluczowych: wszystkie punkty zwrotne + dodatkowe tam, gdzie droga najszybszego punktu na klatkę jest największa
 * (równa droga na odcinek), potem przydziela u (`przydzielU`). Zwraca { klatki, szczyt (cm na 1/48), suma (cm) }.
 */
export function ruch(W, buduj, { rodzina, cw, sprzet, n = 12, gesto = 480, wagiOdcinkow = null }) {
  const E = v2(); const m = W.length - 1; const klatkaAt = (s) => { const i = Math.min(m - 1, Math.floor(s - 1e-9)); const j = Math.max(0, i); const t = s - j; return buduj(mix(W[j], W[j + 1], clamp(t, 0, 1))); };
  /* gęsta próbka (s od 0 do m) i skumulowana droga najszybszego punktu */
  const S = Array.from({ length: gesto + 1 }, (_, g) => (g / gesto) * m); const base = { kontrakt: E.CONTRACT.id, rodzina, cwiczenie: cw, sprzet, bledy: [] };
  const fr = S.map((s) => ({ ...klatkaAt(s), u: s / m })); const pose = { ...base, klatki: fr.map((k, i) => ({ ...k, u: i / gesto })) };
  const P = fr.map((_, i) => pts(E.keyframeFrame(pose, i / gesto))); const cum = [0]; for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.max(...P[i].map((q, j) => d3(q, P[i - 1][j]))));
  const calk = cum[cum.length - 1] || 1;
  if (process.env.DBG_RUCH) { const nm = ['miednica', 'glowa', 'bark', 'spine', ...['R', 'L'].flatMap((x) => ['kolano' + x, 'kostka' + x, 'pieta' + x, 'palce' + x, 'lokiec' + x, 'chwyt' + x])]; const rows = [];
    for (let i = 0; i < m; i++) { const a = Math.round((i / m) * gesto), b = Math.round(((i + 1) / m) * gesto); const per = P[a].map(() => 0); for (let g = a + 1; g <= b; g++) P[g].forEach((q, j) => { per[j] += d3(q, P[g - 1][j]); }); const top = per.map((d, j) => [d, nm[j] ?? 'ciezar']).sort((x, y) => y[0] - x[0]).slice(0, 3); rows.push(`  odc ${i}: max-pkt ${(cum[b] - cum[a]).toFixed(0)} | ${top.map((t) => `${t[1]} ${t[0].toFixed(0)}`).join(', ')}`); } console.error(rows.join('\n')); }
  /* liczba klatek na odcinek: punkty zwrotne + reszta do najdłuższych odcinków */
  const dlOdc = Array.from({ length: m }, (_, i) => cum[Math.round(((i + 1) / m) * gesto)] - cum[Math.round((i / m) * gesto)]).map((d, i) => d * (wagiOdcinkow?.[i] ?? 1));
  const wew = Array(m).fill(0); for (let k = 0; k < n - (m + 1); k++) { let b = 0, bv = -1; dlOdc.forEach((d, i) => { const v = d / (wew[i] + 1); if (v > bv) { bv = v; b = i; } }); wew[b]++; }
  const ss = [0]; for (let i = 0; i < m; i++) { const a = Math.round((i / m) * gesto), b = Math.round(((i + 1) / m) * gesto); for (let k = 1; k <= wew[i]; k++) { const target = cum[a] + ((cum[b] - cum[a]) * k) / (wew[i] + 1); let g = a; while (g < b && cum[g] < target) g++; ss.push(S[g]); } ss.push(i + 1); }
  const klatki = ss.map((s) => klatkaAt(s)); const r = przydzielU(klatki, { rodzina, cw, sprzet });
  const wynik = { klatki: klatki.map((k, i) => ({ ...k, u: r.us[i] })), szczyt: r.szczyt, suma: calk, ss, W, buduj };
  /** Te same klatki kluczowe (te same s i u) dla innego zestawu punktów zwrotnych W2 (np. wariant błędu) — do delt błędu. */
  wynik.jak = (W2, buduj2 = buduj) => ss.map((s, i) => { const j = Math.max(0, Math.min(m - 1, Math.floor(s - 1e-9))); return { ...buduj2(mix(W2[j], W2[j + 1], clamp(s - j, 0, 1))), u: r.us[i] }; });
  return wynik;
}
/** Błąd „kolana do środka”: odchylenie kolana (delta w stopniach, ujemne = do środka) rośnie z zgięciem kolana (od kmin do kmin + 70°); pierwsza klatka błędu zerowa. Poza bazowa MUSI być bez `biegunKolana` (opcja nopole w P). */
export function bladKolana(r, { cue, od = -45, kmin = 25, znacznik = 'knees', kf = (w) => w.k }) {
  const m = r.W.length - 1; const kAt = (s) => { const j = Math.max(0, Math.min(m - 1, Math.floor(s - 1e-9))); return mix(kf(r.W[j]), kf(r.W[j + 1]), clamp(s - j, 0, 1)); };
  const klatki = r.klatki.map((k, i) => { if (i === 0) return { u: 0 }; const w = clamp((kAt(r.ss[i]) - kmin) / 70, 0, 1); return { u: k.u, nogi: { R: { odchylenieKolana: r1(od * w) }, L: { odchylenieKolana: r1(od * w) } } }; });
  const idx = klatki.map((_, i) => i); while (idx.length > 8) { let b = 1, bv = Infinity; for (let i = 1; i < idx.length - 1; i++) { const v = klatki[idx[i + 1]].u - klatki[idx[i - 1]].u; if (v < bv) { bv = v; b = i; } } idx.splice(b, 1); }
  return { cue, znacznik, dotyczy: ['kneeLat'], klatki: idx.map((i) => klatki[i]) };
}
/** Błąd z ruchu: delty (klatka błędna − poprawna) w kluczach od punktu zwrotnego `od` (klucz tuż przed nim ma deltę zerową); najwyżej 8 kluczy. */
export function bladZRuchu({ cue, znacznik, ruch: r, W2, buduj2, od = 0, postawa = false }) {
  const bad = r.jak(W2, buduj2); const n = r.klatki.length; const start = Math.max(0, r.ss.findIndex((x) => x >= od - 1e-9)); /* od = indeks punktu zwrotnego, od którego wariant błędu różni się od poprawnego */ let idx = [];
  if (!postawa && start > 0) idx.push(0);
  for (let i = Math.max(0, postawa ? 0 : start - 1); i < n; i++) idx.push(i);
  idx = [...new Set(idx)]; while (idx.length > 8) { /* usuń najmniej ważny klucz: środkowy z najbliższej pary */ let b = 1, bv = Infinity; for (let i = 1; i < idx.length - 1; i++) { const v = r.klatki[idx[i + 1]].u - r.klatki[idx[i - 1]].u; if (v < bv) { bv = v; b = i; } } idx.splice(b, 1); }
  return { cue, znacznik, dotyczy: [], klatki: idx.map((i) => (i === 0 && !postawa ? { u: 0 } : delta(bad[i], r.klatki[i]))) };
}
