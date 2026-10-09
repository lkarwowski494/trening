/*
 * Figury ruchu (grafiki ćwiczeń, etap 2–3 — decyzja właściciela 08.10.2026 ok. 23:50, research docs/research/26 pkt 7).
 * Geometria szkieletu 2D: kąty stawów → punkty (kinematyka prosta). Czysty moduł bez React i bez aliasów importu,
 * żeby liczył to samo w aplikacji, w testach i w podglądzie deweloperskim. Wszystkie liczby rysunku są tutaj (CLAUDE.md: jedno miejsce).
 *
 * Układ: x w prawo, y w górę, jednostka = 1/100 wzrostu figury. Kąty w stopniach; kierunek odcinka jak w matematyce (0° = w prawo, 90° = w górę).
 * Widok z boku: figura zwrócona w prawo (+x) przy tułowiu pionowym. Kąty względne (zgięcie stawu, 0 = wyprost):
 *   t   — kierunek tułowia (biodro → bark), bezwzględny: 90 = pion, 0 = poziomo głową w prawo, 180 = poziomo głową w lewo;
 *   hip — zgięcie biodra (udo do przodu względem tułowia; ujemne = wyprost za linię tułowia);
 *   knee — zgięcie kolana; ft — kierunek stopy (bezwzględny, 0 = płasko); zgięcie grzbietowe stopy wynika z ft i podudzia;
 *   sh  — zgięcie barku (ramię do przodu względem tułowia; ujemne = wyprost w tył); el — zgięcie łokcia.
 *   Para [bliższa, dalsza] dla kończyn; jedna liczba = obie strony tak samo.
 *   ap, fp — skrót rzutu ramienia i przedramienia (0–1): ręka odwiedziona w bok (szeroki chwyt, łokcie na boki) widziana z boku jest krótsza; wtedy sh/el
 *         to kąty rzutu, nie stawu (figura z armProj — bez sprawdzania zakresu ręki, uproszczenie opisane w dokumencie).
 * Widok z przodu (unoszenie bokiem, szrugsy): sh = odwiedzenie ramienia, el = ugięcie łokcia w dół, hip = odwiedzenie uda, elev = uniesienie barków.
 * Proporcje segmentów i stopy — uproszczenie ilustracyjne (schemat, nie pomiar); figura nie twierdzi nic o proporcjach ciała.
 */

export type Pair = number | [number, number];
export type SidePose = { t: number; hip: Pair; knee: Pair; ft?: Pair; sh: Pair; el: Pair; ap?: Pair; fp?: Pair };
export type FrontPose = { hip?: Pair; sh: Pair; el?: Pair; elev?: number };
export type Pose = SidePose | FrontPose;
export type View = 'side' | 'front';
export type Pt = [number, number];
export type Points = Record<string, Pt>;

/** Długości segmentów (jednostki = 1/100 wzrostu) — uproszczenie ilustracyjne. */
export const SEG = { trunk: 30, neck: 11, headR: 6.5, uarm: 18, farm: 20, thigh: 25, shank: 25, heel: [-3, -4] as Pt, toe: [11, -4] as Pt, hipW: 5, shW: 10 } as const;
/** Grubości kresek rysunku (jednostki rysunku). */
export const STROKE = { trunk: 6, limb: 4.5, prop: 3, cable: 1.2 } as const;
/** Animacja: czas przejścia między pozycjami i zatrzymanie w pozycji kluczowej (ms), odświeżanie (ms ≈ 30 klatek/s). Pętla start → … → koniec → … → start. */
export const ANIM = { moveMs: 1100, holdMs: 450, tickMs: 33 } as const;

const rad = (d: number) => d * Math.PI / 180;
const dir = (a: number, l: number): Pt => [l * Math.cos(rad(a)), l * Math.sin(rad(a))];
const add = (p: Pt, q: Pt): Pt => [p[0] + q[0], p[1] + q[1]];
const rot = (v: Pt, a: number): Pt => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
export const side = (v: Pair | undefined, i: 0 | 1, d = 0): number => v === undefined ? d : Array.isArray(v) ? v[i] : v;
/** Kąt do przedziału (-180, 180]. */
export const norm = (a: number): number => { let x = ((a % 360) + 360) % 360; if (x > 180) x -= 360; return x; };

/** Punkty figury (przed zakotwiczeniem — biodro w (0,0)). Bliższa strona bez przyrostka, dalsza z „2”. */
export function rawPoints(p: Pose, view: View): Points {
  const P: Points = {};
  if (view === 'front') {
    const f = p as FrontPose; const e = f.elev ?? 0;
    P.hip = [0, 0]; P.neck = [0, SEG.trunk + e * 0.3]; P.head = [0, SEG.trunk + SEG.neck]; P.shoulder = [SEG.shW, SEG.trunk + e]; P.shoulder2 = [-SEG.shW, SEG.trunk + e];
    for (const i of [0, 1] as const) {
      const sg = i === 0 ? 1 : -1, sx = i === 0 ? '' : '2';
      const hp: Pt = [sg * SEG.hipW, 0]; P['hipj' + sx] = hp;
      const la = 270 + sg * side(f.hip, i);
      const knee = add(hp, dir(la, SEG.thigh)), ankle = add(knee, dir(la, SEG.shank));
      P['knee' + sx] = knee; P['ankle' + sx] = ankle; P['heel' + sx] = add(ankle, [-sg * 1, -4]); P['toe' + sx] = add(ankle, [sg * 7, -4]);
      const aa = 270 + sg * side(f.sh, i), fa = aa - sg * side(f.el, i);
      const sh = P['shoulder' + (i ? '2' : '')]; const elbow = add(sh, dir(aa, SEG.uarm));
      P['elbow' + sx] = elbow; P['hand' + sx] = add(elbow, dir(fa, SEG.farm));
    }
    return P;
  }
  const s = p as SidePose;
  P.hip = [0, 0]; P.shoulder = dir(s.t, SEG.trunk); P.neck = P.shoulder; P.head = add(P.shoulder, dir(s.t, SEG.neck));
  for (const i of [0, 1] as const) {
    const sx = i === 0 ? '' : '2';
    const ta = s.t + 180 + side(s.hip, i), sa = ta - side(s.knee, i);
    const knee = dir(ta, SEG.thigh), ankle = add(knee, dir(sa, SEG.shank)), fa = side(s.ft, i);
    P['knee' + sx] = knee; P['ankle' + sx] = ankle; P['heel' + sx] = add(ankle, rot(SEG.heel, fa)); P['toe' + sx] = add(ankle, rot(SEG.toe, fa));
    const aa = s.t + 180 + side(s.sh, i), elbow = add(P.shoulder, dir(aa, SEG.uarm * side(s.ap, i, 1)));
    P['elbow' + sx] = elbow; P['hand' + sx] = add(elbow, dir(aa + side(s.el, i), SEG.farm * side(s.fp, i, 1)));
  }
  return P;
}

/** Punkty zakotwiczone: punkt `anchor` (np. „toe” — przód stopy na podłodze, „hand” — dłoń na drążku, „hip” — miednica na ławce) trafia w `at`. */
export function posePoints(p: Pose, view: View, anchor: string, at: Pt = [0, 0]): Points {
  const raw = rawPoints(p, view); const a = raw[anchor] ?? raw.hip; const dx = at[0] - a[0], dy = at[1] - a[1];
  const out: Points = {}; for (const [k, v] of Object.entries(raw)) out[k] = [v[0] + dx, v[1] + dy]; return out;
}

/** Kąty stawów do sprawdzenia zakresu (zgięcie dodatnie, wyprost ujemny). Zgięcie grzbietowe stopy wyliczone z kierunku stopy i podudzia. */
export function jointAngles(p: Pose, view: View): Record<string, number> {
  const out: Record<string, number> = {};
  if (view === 'front') {
    const f = p as FrontPose;
    for (const i of [0, 1] as const) { const sx = i ? '2' : ''; out['abd' + sx] = side(f.sh, i); out['el' + sx] = side(f.el, i); out['hipAbd' + sx] = side(f.hip, i); }
    out.elev = f.elev ?? 0;
    return out;
  }
  const s = p as SidePose;
  for (const i of [0, 1] as const) {
    const sx = i ? '2' : '';
    out['hip' + sx] = norm(side(s.hip, i)); out['knee' + sx] = norm(side(s.knee, i)); out['sh' + sx] = norm(side(s.sh, i)); out['el' + sx] = norm(side(s.el, i));
    const sa = s.t + 180 + side(s.hip, i) - side(s.knee, i);
    out['ankle' + sx] = norm(side(s.ft, i) - sa - 90);
  }
  return out;
}

/** Kąt odcinka a→b względem poziomu, ostry (0 = poziomo, 90 = pionowo). */
export function toHorizontal(a: Pt, b: Pt): number { const d = Math.abs(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI); return d > 90 ? 180 - d : d; }
/** Kąt przy wierzchołku b w trójkącie a-b-c (180 = punkty w jednej linii). */
export function angleAt(a: Pt, b: Pt, c: Pt): number {
  const u = [a[0] - b[0], a[1] - b[1]], v = [c[0] - b[0], c[1] - b[1]];
  const cos = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(u[0], u[1]) * Math.hypot(v[0], v[1]) || 1);
  return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
}

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const lerpPair = (a: Pair | undefined, b: Pair | undefined, k: number, d: number): Pair | undefined => a === undefined && b === undefined ? undefined
  : (!Array.isArray(a) && !Array.isArray(b)) ? lerp(a ?? d, b ?? d, k) : [lerp(side(a, 0, d), side(b, 0, d), k), lerp(side(a, 1, d), side(b, 1, d), k)];
/** Wartość domyślna pola pozy, gdy jedna z klatek go nie ma (skrót rzutu ręki = 1, czyli bez skrótu; reszta = 0). */
const POSE_DEFAULT: Record<string, number> = { ap: 1, fp: 1 };
/** Poza pośrednia (interpolacja kątów; kierunki bezwzględne — tułów i stopy — najkrótszą drogą). */
export function lerpPose<T extends Pose>(a: T, b: T, k: number): T {
  const out: Record<string, unknown> = {};
  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = (a as Record<string, Pair | undefined>)[key], y = (b as Record<string, Pair | undefined>)[key];
    if (key === 't') { out[key] = (x as number) + norm((y as number) - (x as number)) * k; continue; }
    if (key === 'ft' && (x !== undefined || y !== undefined)) { const f = (i: 0 | 1) => side(x, i) + norm(side(y, i) - side(x, i)) * k; out[key] = !Array.isArray(x) && !Array.isArray(y) ? f(0) : [f(0), f(1)]; continue; }
    out[key] = lerpPair(x, y, k, POSE_DEFAULT[key] ?? 0);
  }
  return out as T;
}
export const lerpPt = (a: Pt, b: Pt, k: number): Pt => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];

/**
 * Stan pętli w chwili `ms`: która para pozycji i jak daleko (0–1, wygładzone). Kolejność ping-pong 0→1→…→n-1→…→0,
 * na każdej pozycji kluczowej zatrzymanie ANIM.holdMs. Jedna pozycja (np. deska) → zawsze 0.
 */
export function loopAt(ms: number, n: number): { from: number; to: number; k: number } {
  if (n < 2) return { from: 0, to: 0, k: 0 };
  const order: number[] = []; for (let i = 0; i < n; i++) order.push(i); for (let i = n - 2; i > 0; i--) order.push(i);
  const seg = ANIM.moveMs + ANIM.holdMs, total = order.length * seg, x = ((ms % total) + total) % total;
  const i = Math.floor(x / seg), r = x - i * seg, from = order[i], to = order[(i + 1) % order.length];
  if (r < ANIM.holdMs) return { from, to, k: 0 };
  const u = (r - ANIM.holdMs) / ANIM.moveMs; return { from, to, k: (1 - Math.cos(Math.PI * u)) / 2 };
}
/** Długość pełnej pętli (ms). */
export const loopMs = (n: number): number => n < 2 ? 0 : 2 * (n - 1) * (ANIM.moveMs + ANIM.holdMs);

/* ---------- Dane figury i sprawdzenia póz ---------- */

/**
 * Sprawdzenie pozy powiązane ze zdaniem wskazówki etapu 1 (`c` = id zdania z lib/cues): pozycja wynika z tego zdania.
 *   horiz  — odcinek a–b pod kątem `eq` do poziomu (0 = poziomo, 90 = pionowo), ± tol;
 *   joint  — kąt stawu `j` (jointAngles) równy `eq` ± tol;          alignX — punkty a i b w pionie nad sobą (|Δx| ≤ tol);
 *   line   — punkty `pts` w jednej linii (kąt w środkowym ≥ 180 − tol); low — punkt a tuż nad poziomem y (y − 0,5 ≤ a.y ≤ y + tol);
 *   above  — punkt a (przesunięty o dy) wyżej niż b (albo niż poziom y); ahead — punkt a dalej w przód (w stronę twarzy, +x) niż b;
 *   behind — punkt a za linią pleców (po stronie grzbietu, o ≥ tol); touch — punkt a w odległości ≤ tol od punktu b przesuniętego o tb
 *            (tb = [wzdłuż tułowia, do przodu], np. dolna część brzucha = biodro + [9, 7]).
 * Kąty, których zdanie nie podaje, są uproszczeniem ilustracyjnym (dokument docs/research/28 wypisuje, co wynika z którego zdania).
 */
export type Check = { q: 'horiz' | 'joint' | 'alignX' | 'line' | 'low' | 'above' | 'ahead' | 'behind' | 'touch'; c: string; a?: string; b?: string; pts?: string[]; j?: string; eq?: number; tol?: number; y?: number; dy?: number; tb?: Pt };
export type FrameName = 'start' | 'mid' | 'end';
export type Frame = { n: FrameName; p: Pose; at?: Pt; why: Check[] };
/** level — druga podpora (np. dłonie przy pompkach, gdy kotwicą jest stopa): w pozach pośrednich figura obraca się wokół kotwicy tak,
 * żeby kierunek kotwica → level przechodził płynnie między pozycjami kluczowymi (bez wchodzenia dłoni pod podłogę). */
/** lift — w pozach pośrednich figura unosi się, gdy punkt zszedłby pod podłogę (stopa obraca się na schemacie wokół kostki, nie palców). */
export type FigDef = { like?: string; view?: View; anchor?: string; props?: Prop[]; frames?: Frame[]; note?: string; armProj?: boolean; floor?: boolean; level?: string; lift?: boolean };
export type Figure = { key: string; view: View; anchor: string; props: Prop[]; frames: Frame[]; note?: string; armProj: boolean; floor: boolean; level?: string; lift?: boolean };

/** Figura z danych; „like” = dziedziczy widok, kotwicę, przyrządy i pozy po innym ćwiczeniu (warianty hantle/sztanga), własne pola nadpisują. */
export function resolveFigure(defs: Record<string, FigDef>, key: string, seen: string[] = []): Figure | null {
  const d = Object.prototype.hasOwnProperty.call(defs, key) ? defs[key] : undefined; if (!d || seen.includes(key)) return null;
  const base = d.like ? resolveFigure(defs, d.like, [...seen, key]) : null;
  if (d.like && !base) return null;
  const view = d.view ?? base?.view ?? 'side', anchor = d.anchor ?? base?.anchor ?? 'toe', props = d.props ?? base?.props ?? [], frames = d.frames ?? base?.frames ?? [];
  return frames.length ? { key, view, anchor, props, frames, note: d.note ?? base?.note, armProj: d.armProj ?? base?.armProj ?? false, floor: d.floor ?? base?.floor ?? true, level: d.level ?? base?.level, lift: d.lift ?? base?.lift } : null;
}

/** Punkty klatki figury (z kotwicą). */
export const framePoints = (f: Figure, i: number): Points => posePoints(f.frames[i].p, f.view, f.anchor, f.frames[i].at);

/** Poza pośrednia między klatkami i i j (k = 0–1) z punktami; z `level` — obrót wokół kotwicy (widok z boku: t i ft o tę samą poprawkę).
 * Bez obrotu, gdy w którejś klatce druga podpora leży przy kotwicy (kierunek nieokreślony). */
export function poseBetween(f: Figure, i: number, j: number, k: number): { p: Pose; P: Points } {
  const a = f.frames[i], b = f.frames[j], at = lerpPt(a.at ?? [0, 0], b.at ?? [0, 0], k);
  let p = lerpPose(a.p, b.p, k);
  const far = (Q: Points) => Math.hypot(Q[f.level as string][0] - Q[f.anchor][0], Q[f.level as string][1] - Q[f.anchor][1]) > 5;
  if (f.level && f.view === 'side' && k > 0 && k < 1 && far(framePoints(f, i)) && far(framePoints(f, j))) {
    const ang = (Q: Points) => Math.atan2(Q[f.level as string][1] - Q[f.anchor][1], Q[f.level as string][0] - Q[f.anchor][0]) * 180 / Math.PI;
    const ta = ang(framePoints(f, i)), tb = ang(framePoints(f, j)), want = ta + norm(tb - ta) * k;
    const d = norm(want - ang(posePoints(p, f.view, f.anchor, at))), s = p as SidePose;
    p = { ...s, t: s.t + d, ft: [side(s.ft, 0) + d, side(s.ft, 1) + d] };
  }
  let P = posePoints(p, f.view, f.anchor, at);
  if (f.lift && f.floor) { const low = Math.min(...Object.values(P).map(q => q[1])); if (low < 0) { const Q: Points = {}; for (const [n, q] of Object.entries(P)) Q[n] = [q[0], q[1] - low]; P = Q; } }
  return { p, P };
}

/** Czy poza spełnia sprawdzenie (true/false) i jaka jest zmierzona wartość (do komunikatu testu). */
export function evalCheck(ch: Check, pose: Pose, view: View, P: Points): { ok: boolean; v: number } {
  const A = ch.a ? P[ch.a] : undefined, B = ch.b ? P[ch.b] : undefined, tol = ch.tol ?? 0;
  switch (ch.q) {
    case 'horiz': { if (!A || !B) return { ok: false, v: NaN }; const v = toHorizontal(A, B); return { ok: Math.abs(v - (ch.eq ?? 0)) <= tol, v }; }
    case 'joint': { const v = jointAngles(pose, view)[ch.j ?? '']; return { ok: v !== undefined && Math.abs(v - (ch.eq ?? 0)) <= tol, v }; }
    case 'alignX': { if (!A || !B) return { ok: false, v: NaN }; const v = Math.abs(A[0] - B[0]); return { ok: v <= tol, v }; }
    case 'line': { const p = (ch.pts ?? []).map(n => P[n]); if (p.length !== 3 || p.some(x => !x)) return { ok: false, v: NaN }; const v = angleAt(p[0], p[1], p[2]); return { ok: v >= 180 - tol, v }; }
    case 'low': { if (!A) return { ok: false, v: NaN }; const v = A[1] - (ch.y ?? 0); return { ok: v >= -0.5 && v <= tol, v }; }
    case 'above': { if (!A || (!B && ch.y === undefined)) return { ok: false, v: NaN }; const v = A[1] + (ch.dy ?? 0) - (B ? B[1] : ch.y as number); return { ok: v > 0, v }; }
    case 'ahead': { if (!A || !B) return { ok: false, v: NaN }; const v = A[0] - B[0]; return { ok: v > 0, v }; }
    case 'touch': {
      if (!A || !B) return { ok: false, v: NaN };
      let q = B; if (ch.tb && view === 'side') { const t = (pose as SidePose).t; q = add(q, add(dir(t, ch.tb[0]), dir(t - 90, ch.tb[1]))); }
      const v = Math.hypot(A[0] - q[0], A[1] - q[1]); return { ok: v <= tol, v };
    }
    case 'behind': {
      if (!A || view !== 'side') return { ok: false, v: NaN };
      const t = (pose as SidePose).t, n = dir(t - 90, 1), v = -((A[0] - P.shoulder[0]) * n[0] + (A[1] - P.shoulder[1]) * n[1]);
      return { ok: v >= tol, v };
    }
  }
  return { ok: false, v: NaN };
}

/* ---------- Rysunek: pozy + przyrządy → proste kształty (kolory dobiera komponent z motywu) ---------- */

/**
 * Przyrząd: ruchomy przypięty do punktu figury (`at`: „hand”, „hand2”, „hip”, „shoulder”…; przesunięcie `d` w świecie albo `tb` = [wzdłuż tułowia, do przodu])
 * albo stały w świecie (ławka, skrzynia, drążek, bloczek). Rodzaje: plate (talerz sztangi widziany z boku), db (hantel), kb (kettlebell),
 * grip (uchwyt / gryf bez talerzy), cable (linka od bloczka `from` do punktu), rect (ławka, skrzynia, siedzisko), line (rama, oparcie), bar (drążek),
 * rod (gryf / dźwignia między dwoma punktami figury albo świata, przedłużona o ext; fixed = część maszyny, nie ciężar),
 * plank (platforma maszyny: odcinek długości len przez punkt figury, pod stałym kątem ang — np. platforma suwnicy pod stopami).
 */
export type Prop =
  | { k: 'plate' | 'db' | 'kb' | 'grip'; at: string; r?: number; d?: Pt; tb?: Pt }
  | { k: 'cable'; at: string; from: Pt }
  | { k: 'rect'; x: number; y: number; w: number; h: number }
  | { k: 'line'; pts: Pt[] }
  | { k: 'bar'; x: number; y: number }
  | { k: 'rod'; a: string | Pt; b: string | Pt; ext?: number; fixed?: boolean }
  | { k: 'plank'; at: string; ang: number; len: number };
export type Role = 'body' | 'far' | 'load' | 'fixed' | 'pad' | 'cable';
export type Shape =
  | { s: 'poly'; pts: Pt[]; w: number; role: Role; close?: boolean; fill?: boolean }
  | { s: 'circle'; c: Pt; r: number; role: Role; fill: boolean; w?: number };

/** Promienie przyrządów (jednostki rysunku) — uproszczenie ilustracyjne. */
export const PROP_R = { plate: 13, db: 5, kb: 6, grip: 2.4, bar: 3, pulley: 2.5 } as const;

function propPoint(p: { at: string; d?: Pt; tb?: Pt }, P: Points, pose: Pose, view: View): Pt {
  const base = P[p.at] ?? P.hip;
  let q: Pt = p.d ? add(base, p.d) : base;
  if (p.tb && view === 'side') { const t = (pose as SidePose).t; q = add(q, add(dir(t, p.tb[0]), dir(t - 90, p.tb[1]))); }
  return q;
}

/** Kształty jednej klatki. Kolejność rysowania: stałe przyrządy, dalsze kończyny, linki, tułów i głowa, bliższe kończyny, gryfy, drążek, ciężary. */
export function shapes(pose: Pose, view: View, P: Points, props: Prop[]): Shape[] {
  const out: Shape[] = [];
  for (const pr of props) {
    if (pr.k === 'rect') out.push({ s: 'poly', pts: [[pr.x, pr.y], [pr.x + pr.w, pr.y], [pr.x + pr.w, pr.y + pr.h], [pr.x, pr.y + pr.h]], w: STROKE.prop, role: 'pad', close: true, fill: true });
    else if (pr.k === 'line') out.push({ s: 'poly', pts: pr.pts, w: STROKE.prop, role: 'fixed' });
  }
  const leg = (sx: string): Pt[] => view === 'front' ? [P['hipj' + sx], P['knee' + sx], P['ankle' + sx], P['toe' + sx]] : [P.hip, P['knee' + sx], P['ankle' + sx], P['heel' + sx], P['toe' + sx], P['ankle' + sx]];
  const arm = (sx: string): Pt[] => [view === 'front' && sx ? P.shoulder2 : P.shoulder, P['elbow' + sx], P['hand' + sx]];
  if (view === 'side') { out.push({ s: 'poly', pts: leg('2'), w: STROKE.limb, role: 'far' }); out.push({ s: 'poly', pts: arm('2'), w: STROKE.limb, role: 'far' }); }
  for (const pr of props) if (pr.k === 'cable') { const h = P[pr.at] ?? P.hand; out.push({ s: 'poly', pts: [pr.from, h], w: STROKE.cable, role: 'cable' }); out.push({ s: 'circle', c: pr.from, r: PROP_R.pulley, role: 'fixed', fill: false, w: STROKE.cable * 1.5 }); }
  if (view === 'front') {
    out.push({ s: 'poly', pts: [P.shoulder2, P.shoulder, P.hipj, P.hipj2], w: STROKE.limb, role: 'body', close: true, fill: true });
    out.push({ s: 'poly', pts: [P.neck, P.head], w: STROKE.trunk, role: 'body' });
    for (const sx of ['', '2']) { out.push({ s: 'poly', pts: leg(sx), w: STROKE.limb, role: 'body' }); out.push({ s: 'poly', pts: arm(sx), w: STROKE.limb, role: 'body' }); }
  } else {
    out.push({ s: 'poly', pts: [P.hip, P.shoulder], w: STROKE.trunk, role: 'body' });
    out.push({ s: 'poly', pts: [P.shoulder, lerpPt(P.shoulder, P.head, 0.5)], w: STROKE.limb, role: 'body' });
    out.push({ s: 'poly', pts: leg(''), w: STROKE.limb, role: 'body' });
  }
  out.push({ s: 'circle', c: P.head, r: SEG.headR, role: 'body', fill: true });
  if (view === 'side') out.push({ s: 'poly', pts: arm(''), w: STROKE.limb, role: 'body' });
  const at = (x: string | Pt): Pt => typeof x === 'string' ? (P[x] ?? P.hip) : x;
  for (const pr of props) if (pr.k === 'rod') {
    const a = at(pr.a), b = at(pr.b), L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, e = (pr.ext ?? 0) / L, u: Pt = [(b[0] - a[0]) * e, (b[1] - a[1]) * e];
    out.push({ s: 'poly', pts: [[a[0] - u[0], a[1] - u[1]], [b[0] + u[0], b[1] + u[1]]], w: STROKE.prop, role: pr.fixed ? 'fixed' : 'load' });
  }
  for (const pr of props) if (pr.k === 'plank') { const c = at(pr.at), u = dir(pr.ang, pr.len / 2); out.push({ s: 'poly', pts: [[c[0] - u[0], c[1] - u[1]], [c[0] + u[0], c[1] + u[1]]], w: STROKE.prop, role: 'fixed' }); }
  for (const pr of props) if (pr.k === 'bar') out.push({ s: 'circle', c: [pr.x, pr.y], r: PROP_R.bar, role: 'fixed', fill: true }); /* drążek na wierzchu dłoni — widać chwyt */
  for (const pr of props) {
    if (pr.k !== 'plate' && pr.k !== 'db' && pr.k !== 'kb' && pr.k !== 'grip') continue;
    const c = propPoint(pr, P, pose, view), r = pr.r ?? PROP_R[pr.k], role: Role = pr.at.endsWith('2') && view === 'side' ? 'far' : 'load';
    if (pr.k === 'kb') { out.push({ s: 'circle', c: [c[0], c[1] - r - 1], r, role, fill: true }); continue; }
    if (pr.k === 'plate') { out.push({ s: 'circle', c, r, role, fill: false, w: STROKE.prop }); out.push({ s: 'circle', c, r: 2, role, fill: true }); continue; }
    out.push({ s: 'circle', c, r, role, fill: true });
  }
  return out;
}

/** Prostokąt obejmujący kształty (z grubością kresek) — wspólny dla wszystkich klatek ćwiczenia, żeby rysunek nie skakał. Podłoga (y = 0) w kadrze, gdy figura ją ma (floor). */
export function bounds(all: Shape[][], pad = 4, floor = true): { x: number; y: number; w: number; h: number } {
  let x0 = Infinity, y0 = floor ? 0 : Infinity, x1 = -Infinity, y1 = floor ? 0 : -Infinity;
  const take = (p: Pt, m: number) => { x0 = Math.min(x0, p[0] - m); x1 = Math.max(x1, p[0] + m); y0 = Math.min(y0, p[1] - m); y1 = Math.max(y1, p[1] + m); };
  for (const list of all) for (const s of list) { if (s.s === 'circle') take(s.c, s.r + (s.w ?? 0)); else for (const p of s.pts) take(p, s.w / 2); }
  if (!isFinite(x0)) { x0 = 0; x1 = 0; }
  return { x: x0 - pad, y: y0 - pad, w: x1 - x0 + 2 * pad, h: y1 - y0 + 2 * pad };
}
