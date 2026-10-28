/*
 * Rodzina „zawias biodrowy” (martwy ciąg i odmiany, RDL, dzień dobry, przeciąganie linki, martwy na jednej nodze): ciężar w rękach wiszących przed
 * udami, tułów pochyla się w biodrach.
 *
 * Model sterowany wysokością ciężaru (gryf/hantle/uchwyty): dla każdej klatki wysokość `barY(u)` jest dana, a pozostałe wielkości WYNIKAJĄ z ograniczeń:
 *  1. ciężar przesuwa się po nogach, przed nimi (od przodu: pierwszy kontakt z kapsułą uda lub podudzia — nie przenika),
 *  2. ramiona wyprostowane (długość ręki), bark = ciężar + wektor ręki (przesunięcie barku względem gryfu sx),
 *  3. zgięcie kolana K dobrane tak, by odległość biodro–bark = długość tułowia (rozwiązanie bisekcją).
 * Dzięki temu gryf jest zawsze nad śródstopiem w granicach kontaktu z nogami i nie przechodzi przez ciało. Kąty i rozstawy bez źródła = UPROSZCZENIE ILUSTRACYJNE.
 * Ciężar przed nogami (sztanga, linka, kettlebell; skan torów 28.10.2026, lekcja w docs/40): tor GŁADKI bez zawracania — górna obwiednia wypukła styków z nogami w całym ruchu
 * (ciężar przy goleniach na starcie i przy udach na wyproście, pomiędzy łuk), nie styk liczony osobno w każdej klatce (było: tor „S” 4–6 cm, 2 zawrócenia przy kolanie).
 * Maszyna Smitha: szyna stała, tor pionowy (x = najdalszy styk w ruchu; było: szyna jechała z gryfem).
 */
import { BODY, GIRTH, legJoints, trunkChord } from '../skeleton';
import type { Fault } from '../errors';
import { distSegSeg, mul, sag, type V3 } from '../math';
import type { Contact, Frame, Prop } from '../scene';
import { EQUIP } from '../draw';
import { ease, legFK, mkFrame, solveRoot, type ShinRule } from './common';
import { squatFrame, type SquatParams } from './squat';
import type { PoseIn } from '../skeleton';

export type HingeStyle = 'floor' | 'rdl' | 'goodMorning' | 'pullThrough' | 'singleLeg';
export type HingeImpl = 'barbell' | 'trapbar' | 'db' | 'kb' | 'cable' | 'smith';
export type HingeParams = {
  style: HingeStyle; impl: HingeImpl;
  /** Wysokość środka ciężaru na starcie (podłoga) albo na górze (RDL, brak = wyprost) i na końcu, cm. */
  yStart?: number;
  /** Wysokość na końcu; brak = wyprost („lockout”): wyliczona z długości nóg i tułowia, żeby ramiona zostały proste do końca ruchu. */
  yEnd?: number;
  /** Połowa rozstawu kostek, rotacja stóp, połowa rozstawu dłoni (cm). */
  stance: number; toeOut: number; grip: number;
  shin: ShinRule;
  /** Przesunięcie barku względem gryfu (cm, + = bark przed gryfem) na starcie i na końcu. */
  sx: [number, number];
  platform?: number; band?: boolean; chain?: boolean; oneArm?: boolean; pull?: boolean;
  /** Odmiana „reverse”: guma zwisa z góry stojaka do gryfu (zamiast od gryfu do podłogi). */
  reverse?: boolean;
};

export const HINGE = {
  /** Kotwica gumy „reverse” (górna belka stojaka), cm — nad gryfem na wyproście (ok. 80–100). */
  bandHang: 150,
  /** Martwy ciąg z hantlami: połowa rozstawu dłoni — hantle obok ud, nie przez kolana (tor ciężaru prawie pionowy). */
  dbFloorGrip: 30,
  /** Ręce proste: długość ręki minus 0,05 cm (łokieć ≈ 3° zgięcia; dokładny wyprost = osobliwość IK). */
  arm: BODY.uarm + BODY.farm + BODY.hand - 0.05,
  /** Najdalej do tyłu (x kostki = 0): ciężar nie schodzi za śródstopie (ręce przy bokach nie mają kontaktu z nogami). */
  /** Martwy ciąg jedną ręką z boku: środek gryfu (x nad środkiem stopy, z po zewnętrznej stronie uda), gryf wzdłuż x. */
  sideBar: [6.5, 26] as [number, number],
  /** RDL i martwy na prostych nogach: bark przed gryfem na dole (cm) — ręce lekko odchylone do tyłu, kolana ≤ 27° (docs/research/28: 15° ± 12°) przy tułowiu ok. 60° od pionu. */
  rdlSxEnd: 25,
  xMin: 4.5, clear: 0.0, pulley: [75, 14] as [number, number],
  shin: {
    floor: { stand: 3, perKnee: 0.32, max: 28 } as ShinRule,
    /** Martwy ciąg klasyczny: goleń prawie pionowo (gryf zostaje nad środkiem stopy, tor niemal pionowy); uproszczenie ilustracyjne. */
    conv: { stand: 0, perKnee: 0.1, max: 8 } as ShinRule,
    sumo: { stand: 3, perKnee: 0.28, max: 24 } as ShinRule,
    rdl: { stand: 2, perKnee: 0.06, max: 8 } as ShinRule,
  },
} as const;

type Item = { a: V3; b: V3; r: number };
/** Elementy ciężaru (kapsuły) w punkcie (x, y) — do odstępu od nóg. */
function items(p: HingeParams, x: number, y: number): Item[] {
  if (p.impl === 'barbell' || p.impl === 'smith') return [{ a: [x, y, -60], b: [x, y, 60], r: EQUIP.barR }];
  if (p.impl === 'trapbar') return [1, -1].map(sg => ({ a: [x - 7, y, sg * p.grip], b: [x + 7, y, sg * p.grip], r: 1.8 }));
  if (p.impl === 'db') return [1, -1].map(sg => ({ a: [x, y, sg * p.grip], b: [x, y, sg * p.grip], r: EQUIP.dbHeadR }));
  if (p.impl === 'kb') return [{ a: [x, y - 10, 0], b: [x, y - 10, 0], r: EQUIP.kbBallR }];
  return [{ a: [x, y, -p.grip], b: [x, y, p.grip], r: 2 }];
}

/** Promień nogi w punkcie t odcinka (0 = staw bliższy) do styku z ciężarem: jak na rysunku (draw.ts: udo 9,2 → 8,6 w t 0,45 → 6,0 przy kolanie, spodenki +0,7 do t 0,52;
 * podudzie 5,8 → 6,4 w t 0,3 → 4,2), nie mniej niż promień kapsuły kolizji (colliders.ts: średnia) — rysunek i walidator przenikania mówią to samo. */
const lerp3 = (r: readonly number[], m: number, t: number): number => t <= m ? r[0] + (r[1] - r[0]) * t / m : r[1] + (r[2] - r[1]) * (t - m) / (1 - m);
export function legRadius(seg: 'thigh' | 'shank', t: number): number {
  if (seg === 'shank') return Math.max(lerp3(GIRTH.shank, 0.3, t), (GIRTH.shank[0] + GIRTH.shank[2]) / 2);
  const skin = Math.max(lerp3(GIRTH.thigh, 0.45, t), (GIRTH.thigh[0] + GIRTH.thigh[2]) / 2);
  return t <= 0.52 ? Math.max(skin, GIRTH.thigh[0] + 0.7 + (GIRTH.thigh[1] - GIRTH.thigh[0]) * t / 0.52) : skin;
}
/** Najmniejsze x środka ciężaru (wysokość y) bez przenikania nóg: każdy punkt nogi (41 na odcinek) z promieniem jak na rysunku; elementy ciężaru leżą wzdłuż z. */
export function contactX(p: HingeParams, y: number, legs: { hip: V3; knee: V3; ankle: V3 }[]): number {
  let x = -Infinity;
  for (const it of items(p, 0, y)) {
    const z0 = Math.min(it.a[2], it.b[2]), z1 = Math.max(it.a[2], it.b[2]), iy = it.a[1];
    for (const L of legs) for (const [seg, a, b] of [['thigh', L.hip, L.knee], ['shank', L.knee, L.ankle]] as const) for (let i = 0; i <= 40; i++) {
      const t = i / 40; const q: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
      const dz = q[2] < z0 ? z0 - q[2] : q[2] > z1 ? q[2] - z1 : 0; const R = legRadius(seg, t) + it.r;
      const h = R * R - (iy - q[1]) ** 2 - dz * dz; if (h > 0) x = Math.max(x, q[0] + Math.sqrt(h));
    }
  }
  return x;
}
/** Ciężar przed nogami jedzie po pionie (sztanga, Smith, linka, kettlebell; nie: hantle i uchwyty po bokach, gryf z boku, przeciąganie linki między nogami). */
const vertical = (p: HingeParams): boolean => (p.impl === 'barbell' || p.impl === 'smith' || p.impl === 'cable' || p.impl === 'kb') && !(p.oneArm && p.impl === 'barbell' && p.style === 'floor') && p.style !== 'pullThrough';
const vertCache = new Map<string, number[]>();
/** Górna obwiednia wypukła punktów (u, x): tor bez wybrzuszeń — co najwyżej jedna zmiana kierunku w poziomie. */
function upperHull(us: number[], xs: number[]): number[] {
  const h: number[] = [];
  for (let i = 0; i < us.length; i++) {
    while (h.length >= 2) { const a = h[h.length - 2], b = h[h.length - 1]; if ((xs[b] - xs[a]) * (us[i] - us[a]) <= (xs[i] - xs[a]) * (us[b] - us[a])) h.pop(); else break; }
    h.push(i);
  }
  return us.map(u => { let j = 0; while (j < h.length - 2 && us[h[j + 1]] < u) j++; const a = h[j], b = h[j + 1] ?? a; return b === a ? xs[a] : xs[a] + (xs[b] - xs[a]) * (u - us[a]) / (us[b] - us[a]); });
}

/** Odstęp ciężaru od nóg (min po kapsułach uda i podudzia obu stron), cm; ujemny = przenikanie. */
function clearance(p: HingeParams, x: number, y: number, legs: { hip: V3; knee: V3; ankle: V3 }[]): number {
  let m = Infinity;
  /* sztanga przechodzi przed nogami (powierzchnia uda/podudzia z zapasem); ciężar po bokach (hantle, uchwyty) — promienie jak w kolizjach */
  const centre = p.impl === 'barbell' || p.impl === 'smith' || p.impl === 'cable' || p.impl === 'kb';
  const rt = centre ? 8.9 : (GIRTH.thigh[0] + GIRTH.thigh[2]) / 2, rs = centre ? 6.2 : (GIRTH.shank[0] + GIRTH.shank[2]) / 2;
  for (const it of items(p, x, y)) for (const L of legs) {
    m = Math.min(m, distSegSeg(it.a, it.b, L.hip, L.knee) - it.r - rt, distSegSeg(it.a, it.b, L.knee, L.ankle) - it.r - rs);
  }
  return m;
}

export function hingeFrame(p0: HingeParams, u: number, fault?: Fault): Frame {
  if (p0.style === 'goodMorning') return goodMorning(p0, u, fault);
  const fw = fault?.w ?? 0; const fs = fault?.m.shin;
  const pShin: HingeParams = fs ? { ...p0, shin: { stand: fs.stand ?? p0.shin.stand, perKnee: p0.shin.perKnee + ((fs.perKnee ?? p0.shin.perKnee) - p0.shin.perKnee) * fw, max: p0.shin.max + ((fs.max ?? p0.shin.max) - p0.shin.max) * fw } } : p0;
  /* błąd „kolana jak w przysiadzie”: bark wraca bliżej gryfu (ręce pionowo), więc biodra nie mogą się cofnąć i kolana muszą się ugiąć */
  const sxTo = fault?.m.shoulderAheadTo; const p: HingeParams = sxTo === undefined ? pShin : { ...pShin, sx: [pShin.sx[0], pShin.sx[1] + (sxTo - pShin.sx[1]) * fw] };
  const bend = (fault?.m.spineBend ?? 0) * fw; const Tl = BODY.trunk * trunkChord(bend);
  const k = ease(u); const sx = p.sx[0] + (p.sx[1] - p.sx[0]) * k;
  const ankY = BODY.ankleH + (p.platform ?? 0); const ankles: Record<'R' | 'L', V3> = { R: [0, ankY, p.stance], L: [0, ankY, -p.stance] };
  const single = p.style === 'singleLeg'; if (single) { ankles.R = [0, ankY, BODY.hipHalf]; }
  const rz = p.impl === 'db' ? p.grip : 2; const sideBar = !!p.oneArm && p.impl === 'barbell' && p.style === 'floor'; const gz = sideBar ? HINGE.sideBar[1] : p.oneArm ? rz : p.grip; const dz = Math.abs(gz - BODY.shHalf);
  const dzLeg = Math.abs(p.stance - BODY.hipHalf);
  const yEnd = p.yEnd ?? (legFK(0, p.shin, ankles.R, single ? 0 : dzLeg).hip[1] + BODY.trunk * 0.995 - Math.sqrt(Math.max(1, HINGE.arm ** 2 - p.sx[1] ** 2 - dz * dz)));
  const rdlLike = p.style === 'rdl' || p.style === 'singleLeg' || p.style === 'pullThrough';
  const yTop = legFK(0, p.shin, ankles.R, single ? 0 : dzLeg).hip[1] + BODY.trunk * 0.995 - Math.sqrt(Math.max(1, HINGE.arm ** 2 - p.sx[0] ** 2 - dz * dz));
  const y0 = p.yStart ?? (rdlLike ? yTop : 22.5), y1 = rdlLike ? (p.yEnd ?? 55) : yEnd;
  /* wysokość ciężaru, przesunięcie barku i pion ręki w chwili uu */
  const at = (uu: number) => { const kk = ease(uu); const sxu = p.sx[0] + (p.sx[1] - p.sx[0]) * kk; return { y: y0 + (y1 - y0) * kk, sx: sxu, L: Math.sqrt(Math.max(1, HINGE.arm ** 2 - sxu * sxu - dz * dz)) }; };
  const barY = at(u).y;
  const Larm = at(u).L;
  const chain = (K: number) => legFK(K, p.shin, ankles.R, single ? 0 : dzLeg);
  const legsAt = (K: number): { hip: V3; knee: V3; ankle: V3 }[] => {
    const c = chain(K); const pel: V3 = [c.hip[0], c.hip[1], 0];
    return (single ? ['R'] as const : ['R', 'L'] as const).map(s => { const j = legJoints(pel, s, { ankle: ankles[s], toeOut: p.toeOut }); return { hip: j.hip, knee: j.knee, ankle: ankles[s] }; });
  };
  /** Zgięcie kolana, przy którym bark (ciężar + ręka) leży w długości tułowia od biodra, dla ciężaru w x w chwili uu. */
  const kneeFor = (uu: number, x: number): number => { const a = at(uu); const S: V3 = [x + a.sx, a.y + a.L, 0]; return solveRoot(kk => { const h = chain(kk).hip; return Math.hypot(S[0] - h[0], S[1] - h[1]) - Tl; }, 0, 141); };
  let K = p.style === 'rdl' ? 20 : 80; let barX = 8;
  if (!sideBar && vertical(p)) {
    const key = JSON.stringify([p, bend]); let path = vertCache.get(key);
    if (path === undefined) {
      const US = Array.from({ length: 25 }, (_, i) => i / 24);
      const touch = (uu: number): number => { let K0 = K, x = 8; for (let it = 0; it < 8; it++) { x = Math.max(HINGE.xMin, contactX(p, at(uu).y, legsAt(K0)) + 0.25); K0 = kneeFor(uu, x); } return x; };
      let xs = US.map(touch);
      for (let r = 0; r < 6; r++) {
        xs = p.impl === 'smith' ? US.map(() => Math.max(...xs)) : upperHull(US, xs);
        const need = US.map((uu, i) => Math.max(HINGE.xMin, contactX(p, at(uu).y, legsAt(kneeFor(uu, xs[i]))) + 0.25));
        if (need.every((n, i) => n <= xs[i] + 0.01)) break; xs = xs.map((x, i) => Math.max(x, need[i]));
      }
      path = xs; vertCache.set(key, path);
    }
    const f = u * 24, i0 = Math.min(23, Math.floor(f)); const xu = path[i0] + (path[i0 + 1] - path[i0]) * (f - i0);
    barX = xu + (fault?.m.barAway ?? 0) * fw; K = kneeFor(u, barX);
  } else for (let it = 0; it < 8; it++) {
    const legs = legsAt(K); barX = 60;
    if (sideBar) barX = HINGE.sideBar[0] + (fault?.m.barAway ?? 0) * fw; /* gryf z boku ciała, wzdłuż x: nie przechodzi przed nogami */
    else {
      while (barX > HINGE.xMin && clearance(p, barX, barY, legs) >= HINGE.clear) barX -= 0.25; /* od przodu: pierwszy kontakt z nogami, nie dalej niż xMin */
      barX += 0.25 + (fault?.m.barAway ?? 0) * fw;
    }
    K = kneeFor(u, barX);
  }
  const ch = chain(K); const hip: V3 = [ch.hip[0], ch.hip[1], 0];
  const S: V3 = [barX + sx, barY + Larm, 0]; const tau = Math.atan2(S[0] - hip[0], S[1] - hip[1]) * 180 / Math.PI;
  const gripHalf = p.grip; const c: V3 = [barX, barY, sideBar ? gz : 0];
  const props: Prop[] = [{ k: 'floor', x0: -95, x1: 120 }]; const info: Record<string, V3> = {}; const contacts: Contact[] = [];
  const g = (z: number): V3 => [barX, barY, z];
  let arms: PoseIn['arms'] = { R: { grip: g(gripHalf), elbowPole: [0, -1, 0.2] }, L: { grip: g(-gripHalf), elbowPole: [0, -1, -0.2] } };
  let legs: PoseIn['legs'] = { R: { ankle: ankles.R, toeOut: p.toeOut }, L: { ankle: ankles.L, toeOut: p.toeOut } };
  if (p.oneArm && !single) arms = { R: { grip: g(sideBar ? gz : rz), elbowPole: [0, -1, 0.2] }, L: { grip: [barX - 4, barY + 20, -BODY.shHalf - 6], elbowPole: [0, -1, -0.5] } };
  if (single) {
    const back = mul(sag(tau + 180), 1); void back;
    const dir = sag(tau + 180 + 6);
    const free: V3 = [hip[0] + dir[0] * 80, hip[1] + dir[1] * 80, -BODY.hipHalf];
    /* stopa wolnej nogi: podeszwowe zgięcie ok. 30° względem podudzia (palce „wskazują” wzdłuż nogi), nie niżej niż podłoga */
    const legAng = Math.atan2(dir[1], dir[0]) * 180 / Math.PI; const pitch = Math.max(-90, Math.min(40, legAng + 90 - 30 * k));
    const minY = BODY.ankleH * Math.cos(pitch * Math.PI / 180) + BODY.toeFwd * Math.max(0, Math.sin(-pitch * Math.PI / 180)) + 0.5; free[1] = Math.max(minY, free[1]);
    legs = { R: { ankle: ankles.R, toeOut: 5 }, L: { ankle: free, footPitch: pitch, toeOut: 5 } };
    arms = { R: { grip: g(BODY.hipHalf + 4), elbowPole: [0, -1, 0.2] }, L: { grip: [barX - 8, barY + 14, -BODY.shHalf + 4], elbowPole: [-0.5, -0.3, -1] } };
  }
  const pose: PoseIn = { pelvis: hip, trunkPitch: tau, spineBend: bend, legs, arms };
  info.load = c; info.hip = hip; info.shoulder = S; info.midfoot = [6.5, 0, 0];
  if (p.platform) props.push({ k: 'box', x0: -26, x1: 34, top: p.platform, w: 60 });
  if (p.impl === 'barbell' || p.impl === 'smith') { props.push({ k: 'barbell', c, held: p.oneArm ? 'R' : true, axis: sideBar ? 'x' : undefined }); info.bar = c; }
  if (p.impl === 'smith') props.push({ k: 'rail', x: barX, h: 190 });
  if (p.impl === 'trapbar') { props.push({ k: 'trapbar', c, w: p.grip }); info.bar = c; }
  if (p.impl === 'db') for (const s of single || p.oneArm ? ['R'] as const : ['R', 'L'] as const) props.push({ k: 'dumbbell', c: [barX, barY, s === 'R' ? gripHalf : -gripHalf], side: s });
  if (p.impl === 'kb') props.push({ k: 'kettlebell', c, side: 'C' });
  if (p.impl === 'cable') props.push({ k: 'cable', from: p.pull ? [-HINGE.pulley[0], HINGE.pulley[1], 0] : [barX, 0, 0], to: c });
  if (p.band) props.push(p.reverse ? { k: 'band', from: [c[0], HINGE.bandHang, 0], to: c, bar: true, hang: true } : { k: 'band', from: c, to: [c[0], 0, 0], bar: true });
  if (p.chain) props.push({ k: 'chain', from: c, to: [c[0], 0, 0], bar: true });
  if (p.platform) contacts.push({ body: 'foot', equip: 'box', tol: 1.5 });
  contacts.push({ body: 'thigh', equip: 'bar', tol: 1.5 }, { body: 'shank', equip: 'bar', tol: 1.5 }, { body: 'thigh', equip: 'plateNear', tol: 99 });
  return mkFrame(pose, props, info, contacts);
}

/** Dzień dobry: sztanga na plecach (jak przysiad wysokim gryfem), kolana prawie proste, tułów pochyla się do przodu, gryf nad śródstopiem. */
function goodMorning(p: HingeParams, u: number, fault?: Fault): Frame {
  const sq: SquatParams = { load: 'highBar', impl: 'barbell', depth: 24, stance: p.stance, toeOut: p.toeOut, shin: { stand: 1, perKnee: 0, max: 1 }, band: p.band, chain: p.chain };
  return squatFrame(sq, u, fault);
}

