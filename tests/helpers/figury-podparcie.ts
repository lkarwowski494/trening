/*
 * Reguły walidatora figur v1: podparcie i pompki (niezależna recenzja figur 3a, 28.10.2026; decyzja właściciela 28.10.2026 „poprawić przed 1.0”).
 * Luka kryteriów roli 06: mierzyły ślizg i przenikanie, nie PODPARCIE — czy ciało opuszcza się, gdy jedyną podporą jest punkt daleko od
 * środka ciężkości, a druga stopa jest w powietrzu. Liczby w jednym miejscu (LIM); jednostka „j.” = 1/100 wzrostu figury.
 * Czysty moduł (bez jest) — ten sam kod uruchamia test i narzędzie przeglądu póz.
 */
import { framePoints, poseBetween, type Figure, type Points, type Pt } from '../../lib/figures/geom';

export const LIM = {
  /** Rzut środka ciężkości (biodro/miednica) może wychodzić poza podstawę podparcia najwyżej o tyle. */
  comTol: 10,
  /** Punkt stykający się z podłożem: najwyżej tyle nad powierzchnią. */
  contact: 1.5,
  /** Stopa „w powietrzu”: cała (palce i pięta) wyżej niż tyle nad powierzchnią. */
  airborne: 2,
  /**
   * Gdy stopa krokowa jest w powietrzu, biodro w kierunku animacji nie obniża się o więcej niż tyle (w odcinku z wolną stopą).
   * Granica 7 j. (ok. 12 cm), nie 0: rozstawienie prostych nóg w kroku samo obniża biodro o kilka j.; wady z recenzji to 11–24 j.
   */
  hipDrop: 7,
  /** Przy jednej podporze (druga stopa w powietrzu) rzut środka ciężkości mieści się w obrębie stopy podporowej (pięta–palce) z tą tolerancją. */
  comSingle: 2.5,
  /** Pompki: w dolnej pozycji bark nie dalej niż tyle w poziomie od dłoni. */
  shoulderHand: 10,
  /** Pompki: tułów (odcinki ciała) nie wchodzi w podłoże ani blat głębiej niż tyle. */
  penetration: 1,
  /** Podział przejścia na pozy pośrednie (co 0,05). */
  step: 0.05,
};

type Rect = { x: number; y: number; w: number; h: number };
const rects = (f: Figure): Rect[] => f.props.filter(p => p.k === 'rect') as unknown as Rect[];
/** Wysokość powierzchni pod punktem: podłoga (jeśli figura ją ma) albo wierzch skrzyni/ławki, nad którą punkt się znajduje. */
export function surface(f: Figure, q: Pt): number {
  let s = f.floor ? 0 : -Infinity;
  for (const r of rects(f)) if (q[0] >= r.x - 0.5 && q[0] <= r.x + r.w + 0.5 && q[1] >= r.y + r.h - LIM.contact) s = Math.max(s, r.y + r.h);
  return s;
}
const SUPPORT_PTS = ['toe', 'heel', 'toe2', 'heel2', 'hand', 'hand2', 'knee', 'knee2'];
/** Punkty ciała w styku z podłożem lub blatem (podstawa podparcia). */
export function contacts(f: Figure, P: Points): string[] {
  return SUPPORT_PTS.filter(n => P[n] && P[n][1] - surface(f, P[n]) <= LIM.contact);
}
/** Podstawa podparcia: przedział x styków, albo null, gdy ciało nie ma styku (zwis, w powietrzu). */
export function base(f: Figure, P: Points): [number, number] | null {
  const c = contacts(f, P); if (!c.length) return null;
  const xs = c.map(n => P[n][0]); return [Math.min(...xs), Math.max(...xs)];
}
/** Pozy animacji: pozy kluczowe oraz pośrednie co LIM.step w każdym przejściu (kolejność jak w animacji, ping-pong powtarza te same pozy). */
export function transitions(f: Figure): { from: string; to: string; k: number; P: Points }[][] {
  const out: { from: string; to: string; k: number; P: Points }[][] = [];
  const n = Math.round(1 / LIM.step);
  for (let i = 0; i + 1 < f.frames.length; i++) {
    const row: { from: string; to: string; k: number; P: Points }[] = [];
    for (let s = 0; s <= n; s++) { const k = s / n; row.push({ from: f.frames[i].n, to: f.frames[i + 1].n, k, P: poseBetween(f, i, i + 1, k).P }); }
    out.push(row);
  }
  if (!out.length) out.push([{ from: f.frames[0].n, to: f.frames[0].n, k: 0, P: framePoints(f, 0) }]);
  return out;
}

const FEET: [string, string][] = [['toe', 'heel'], ['toe2', 'heel2']];
const footH = (f: Figure, P: Points, [a, b]: [string, string]): number => Math.min(P[a][1] - surface(f, P[a]), P[b][1] - surface(f, P[b]));
/**
 * Stopy „krokowe”: dotykają podłoża lub przyrządu w którejś pozie kluczowej i bywają w powietrzu w pozie pośredniej (krok, wejście na skrzynię).
 * Stopa trzymana w powietrzu przez cały ruch (wolna noga w przysiadzie na jednej nodze) ani stopa na maszynie nie są krokowe.
 */
export function steppingFeet(f: Figure): [string, string][] {
  const key = f.frames.map((_, i) => framePoints(f, i));
  return FEET.filter(ft => key.some(P => footH(f, P, ft) <= LIM.contact) && transitions(f).some(row => row.some(s => footH(f, s.P, ft) > LIM.airborne)));
}

/**
 * Reguła podparcia (dla figur z krokiem, czyli ze stopą krokową). Zwraca opisy naruszeń (pusta lista = spełniona):
 *  1. w pozie, w której stopa krokowa jest w powietrzu (wyżej niż LIM.airborne), rzut biodra leży nad podstawą podparcia (styki pozostałych punktów) ± LIM.comTol;
 *  2. w takim odcinku biodro w kierunku animacji nie obniża się o więcej niż LIM.hipDrop (ciało nie opada, zanim stopa dotknie podłoża).
 * Figury z obiema stopami stale na podporze (zawias, wiosłowanie) mają ciężar przeciwwagą ciężaru w rękach, więc rzut samego biodra nie jest dla nich miarą.
 */
export function podparcieMiary(f: Figure): { opis: string; nadmiar: number }[] {
  const bad: { opis: string; nadmiar: number }[] = [], feet = steppingFeet(f); if (!feet.length) return bad;
  const air = (P: Points) => feet.some(ft => footH(f, P, ft) > LIM.airborne);
  for (const row of transitions(f)) {
    for (const s of row) {
      if (!air(s.P)) continue;
      const b = base(f, s.P); if (!b) { bad.push({ opis: `${s.from}→${s.to} k=${s.k.toFixed(2)}: brak styku z podłożem`, nadmiar: 50 }); continue; }
      const hx = s.P.hip[0], out = hx < b[0] - LIM.comTol ? b[0] - LIM.comTol - hx : hx > b[1] + LIM.comTol ? hx - b[1] - LIM.comTol : 0;
      if (out > 0) bad.push({ opis: `${s.from}→${s.to} k=${s.k.toFixed(2)}: biodro x=${hx.toFixed(1)} poza podporą [${b[0].toFixed(1)}; ${b[1].toFixed(1)}] o ${out.toFixed(1)} ponad tolerancję`, nadmiar: out });
    }
    let start = -1;
    for (let i = 0; i <= row.length; i++) {
      const a = i < row.length && air(row[i].P);
      if (a && start < 0) start = i;
      if (!a && start >= 0) {
        const seg = row.slice(start, i), drop = Math.max(seg[0].P.hip[1] - seg[seg.length - 1].P.hip[1], seg[0].P.hip[1] - Math.min(...seg.map(s => s.P.hip[1])));
        if (drop > LIM.hipDrop) bad.push({ opis: `${seg[0].from}→${seg[0].to} k=${seg[0].k.toFixed(2)}…${seg[seg.length - 1].k.toFixed(2)}: stopa w powietrzu, a biodro opada o ${drop.toFixed(1)} j.`, nadmiar: drop - LIM.hipDrop });
        start = -1;
      }
    }
  }
  return bad;
}

export const podparcie = (f: Figure): string[] => podparcieMiary(f).map(m => m.opis);

/** Figura w podporze na rękach (pompki): druga podpora „level” = dłoń. */
export const jestPompka = (f: Figure): boolean => f.level === 'hand';

/** Segmenty ciała do sprawdzenia przenikania (próbkowane co 5% długości). */
const BODY_SEGS: [string, string][] = [['hip', 'shoulder'], ['shoulder', 'head'], ['hip', 'knee'], ['knee', 'ankle'], ['ankle', 'toe'], ['ankle', 'heel'], ['shoulder', 'elbow'], ['elbow', 'hand']];
/** Najgłębsze wejście segmentów ciała w prostokąty przyrządów i pod podłogę (j.). */
export function penetration(f: Figure, P: Points): number {
  let worst = 0;
  for (const [a, b] of BODY_SEGS) for (let u = 0; u <= 1.0001; u += 0.05) {
    const q: Pt = [P[a][0] + (P[b][0] - P[a][0]) * u, P[a][1] + (P[b][1] - P[a][1]) * u];
    if (f.floor && q[1] < 0) worst = Math.max(worst, -q[1]);
    for (const r of rects(f)) if (q[0] > r.x && q[0] < r.x + r.w && q[1] > r.y && q[1] < r.y + r.h) worst = Math.max(worst, Math.min(q[0] - r.x, r.x + r.w - q[0], q[1] - r.y, r.y + r.h - q[1]));
  }
  return worst;
}

/**
 * Reguła pompek: (1) w dolnej pozycji (ostatnia klatka) bark nie dalej niż LIM.shoulderHand w poziomie od dłoni;
 * (2) tułów i kończyny nie wchodzą w podłoże ani blat głębiej niż LIM.penetration w żadnej pozie animacji.
 */
export function pompki(f: Figure): string[] {
  const bad: string[] = [];
  const last = framePoints(f, f.frames.length - 1), dx = Math.abs(last.shoulder[0] - last.hand[0]);
  if (dx > LIM.shoulderHand) bad.push(`dolna pozycja: bark ${dx.toFixed(1)} j. od dłoni w poziomie (limit ${LIM.shoulderHand})`);
  for (const row of transitions(f)) for (const s of row) { const w = penetration(f, s.P); if (w > LIM.penetration) bad.push(`${s.from}→${s.to} k=${s.k.toFixed(2)}: ciało wchodzi w podłoże/blat o ${w.toFixed(1)} j.`); }
  return bad;
}

/** Przybliżony środek ciężkości ze stałego podziału mas segmentów (uproszczenie ilustracyjne; ciężar w rękach pominięty). */
export function srodekCiezkosci(P: Points): Pt {
  const segs: [string, string, number][] = [['hip', 'shoulder', 0.497], ['head', 'head', 0.081], ['shoulder', 'elbow', 0.028], ['elbow', 'hand', 0.022], ['shoulder', 'elbow2', 0.028], ['elbow2', 'hand2', 0.022],
    ['hip', 'knee', 0.1], ['knee', 'ankle', 0.0465], ['ankle', 'toe', 0.0145], ['hip', 'knee2', 0.1], ['knee2', 'ankle2', 0.0465], ['ankle2', 'toe2', 0.0145]];
  let x = 0, y = 0, m = 0;
  for (const [a, b, w] of segs) { x += w * (P[a][0] + P[b][0]) / 2; y += w * (P[a][1] + P[b][1]) / 2; m += w; }
  return [x / m, y / m];
}

/**
 * Reguła jednej podpory: gdy jedna stopa krokowa jest w powietrzu, a druga stoi na podłożu lub skrzyni, rzut środka ciężkości (nie samego biodra)
 * mieści się w obrębie stopy podporowej (od pięty do palców) ± LIM.comSingle. Stopa podporowa stoi całą podeszwą (pięta i palce na podłożu) — stopa na palcach
 * (wykrok: tylna noga z uniesioną piętą) i podpora na rękach/kolanach to ruch dynamiczny z przenoszeniem ciężaru, objęty regułą podparcia (±10 j.).
 */
export function jednaPodpora(f: Figure): { opis: string; nadmiar: number }[] {
  const bad: { opis: string; nadmiar: number }[] = [];
  const feet = steppingFeet(f); if (!feet.length) return bad;
  for (const row of transitions(f)) for (const s of row) {
    const air = FEET.filter(ft => footH(f, s.P, ft) > LIM.airborne), ground = FEET.filter(ft => Math.max(s.P[ft[0]][1] - surface(f, s.P[ft[0]]), s.P[ft[1]][1] - surface(f, s.P[ft[1]])) <= LIM.contact);
    if (contacts(f, s.P).some(n => !/^(toe|heel)2?$/.test(n))) continue; /* podpora na rękach/kolanach (Bird Dog, Mountain Climbers) — nie ta reguła */
    if (air.length !== 1 || ground.length !== 1 || !feet.some(ft => ft[0] === air[0][0])) continue;
    const xs = [s.P[ground[0][0]][0], s.P[ground[0][1]][0]], lo = Math.min(...xs), hi = Math.max(...xs), cx = srodekCiezkosci(s.P)[0];
    const out = cx < lo - LIM.comSingle ? lo - LIM.comSingle - cx : cx > hi + LIM.comSingle ? cx - hi - LIM.comSingle : 0;
    if (out > 0) bad.push({ opis: `${s.from}→${s.to} k=${s.k.toFixed(2)}: środek ciężkości x=${cx.toFixed(1)} poza stopą podporową [${lo.toFixed(1)}; ${hi.toFixed(1)}] o ${out.toFixed(1)} ponad tolerancję`, nadmiar: out });
  }
  return bad;
}
