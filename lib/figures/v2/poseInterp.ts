/*
 * Figury v2 — interpolacja klatek kluczowych (poseAt, deltaAt, applyDelta), pozy → PoseIn (toPoseIn) i lustro (mirrorKey).
 * Wydzielone z contract.ts: podział strukturalny, bez zmiany zachowania (backlog 1.1). Typy danych zostają w contract.ts (import typów nie tworzy cyklu);
 * contract.ts re-eksportuje publiczne nazwy, więc importy z './contract' działają bez zmian. Jego skutek na rysunku wchodzi do skrótu recenzji rodziny przez wynik klatek (scripts/skrot-v2-wynik.mjs).
 */
import { add, type V3 } from './math';
import { BODY, hipPoint, legJoints, type LegIn, type ArmIn, type PoseIn, type Side } from './skeleton';
import type { KeyFrame, DeltaFrame, LegData, ArmData } from './contract';

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const opt = (a: number | undefined, b: number | undefined, t: number): number | undefined => a === undefined ? b : b === undefined ? a : lerp(a, b, t);
const opt3 = (a: V3 | undefined, b: V3 | undefined, t: number): V3 | undefined => a === undefined ? b : b === undefined ? a : lerp3(a, b, t);
/** Pola OPCJONALNE poza@2 (liczbowe): interpolowane tylko, gdy występują w którejś z klatek; brak pola = brak klucza (poza@1 daje obiekt bez nowych kluczy). */
export const TRUNK_EXT = ['obrotTulowia', 'skretTulowia', 'przechylTulowia', 'przechylMiednicy', 'przechylGlowy', 'przesuniecieBoczne'] as const;
export const ARM_EXT = ['uniesienieBarkow', 'wysuniecieBarkow', 'zgiecieNadgarstka', 'obrotPrzedramienia'] as const;
function optFields<K extends string>(keys: readonly K[], a: Partial<Record<K, number>>, b: Partial<Record<K, number>>, t: number): Partial<Record<K, number>> {
  const o: Partial<Record<K, number>> = {}; for (const k of keys) { const v = opt(a[k], b[k], t); if (v !== undefined) o[k] = v; } return o;
}
/** Indeks segmentu i ułamek t dla pozycji u w posortowanej liście klatek (u poza zakresem → brzeg). */
function segment(us: number[], u: number): [number, number] {
  if (u <= us[0]) return [0, 0]; if (u >= us[us.length - 1]) return [us.length - 1, 0];
  let i = 0; while (i < us.length - 2 && u >= us[i + 1]) i++;
  const span = us[i + 1] - us[i]; return [i, span > 0 ? (u - us[i]) / span : 0];
}
/** Klatka kluczowa w pozycji u (interpolacja liniowa wszystkich pól). */
export function poseAt(frames: KeyFrame[], u: number): KeyFrame {
  const [i, t] = segment(frames.map(f => f.u), u); const a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
  const leg = (s: Side): LegData => ({ kostka: lerp3(a.nogi[s].kostka, b.nogi[s].kostka, t), podbicie: opt(a.nogi[s].podbicie, b.nogi[s].podbicie, t), rotacjaStopy: opt(a.nogi[s].rotacjaStopy, b.nogi[s].rotacjaStopy, t), odchylenieKolana: opt(a.nogi[s].odchylenieKolana, b.nogi[s].odchylenieKolana, t), biegunKolana: opt3(a.nogi[s].biegunKolana, b.nogi[s].biegunKolana, t) });
  const arm = (s: Side): ArmData => ({ chwyt: lerp3(a.rece[s].chwyt, b.rece[s].chwyt, t), biegunLokcia: opt3(a.rece[s].biegunLokcia, b.rece[s].biegunLokcia, t), dolnaCzesc: opt(a.rece[s].dolnaCzesc, b.rece[s].dolnaCzesc, t), ...optFields(ARM_EXT, a.rece[s], b.rece[s], t) });
  return { u, miednica: lerp3(a.miednica, b.miednica, t), pochylenieTulowia: lerp(a.pochylenieTulowia, b.pochylenieTulowia, t), zgiecieKregoslupa: opt(a.zgiecieKregoslupa, b.zgiecieKregoslupa, t), pochylenieGlowy: opt(a.pochylenieGlowy, b.pochylenieGlowy, t), ...optFields(TRUNK_EXT, a, b, t), nogi: { R: leg('R'), L: leg('L') }, rece: { R: arm('R'), L: arm('L') } };
}
const ZERO: V3 = [0, 0, 0];
/** Delta błędu w pozycji u (interpolacja liniowa między klatkami delt; poza zakresem brzeg). */
export function deltaAt(frames: DeltaFrame[], u: number): DeltaFrame {
  const [i, t] = segment(frames.map(f => f.u), u); const a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
  const v = (x: V3 | undefined, y: V3 | undefined): V3 | undefined => x || y ? lerp3(x ?? ZERO, y ?? ZERO, t) : undefined;
  const n = (x: number | undefined, y: number | undefined): number | undefined => x !== undefined || y !== undefined ? lerp(x ?? 0, y ?? 0, t) : undefined;
  const dExt = <K extends string>(keys: readonly K[], x: Partial<Record<K, number>> | undefined, y: Partial<Record<K, number>> | undefined): Partial<Record<K, number>> => { const o: Partial<Record<K, number>> = {}; for (const k of keys) { const w = n(x?.[k], y?.[k]); if (w !== undefined) o[k] = w; } return o; };
  const leg = (s: Side): Partial<LegData> => ({ kostka: v(a.nogi?.[s]?.kostka, b.nogi?.[s]?.kostka), podbicie: n(a.nogi?.[s]?.podbicie, b.nogi?.[s]?.podbicie), rotacjaStopy: n(a.nogi?.[s]?.rotacjaStopy, b.nogi?.[s]?.rotacjaStopy), odchylenieKolana: n(a.nogi?.[s]?.odchylenieKolana, b.nogi?.[s]?.odchylenieKolana) });
  return { u, miednica: v(a.miednica, b.miednica), pochylenieTulowia: n(a.pochylenieTulowia, b.pochylenieTulowia), zgiecieKregoslupa: n(a.zgiecieKregoslupa, b.zgiecieKregoslupa), pochylenieGlowy: n(a.pochylenieGlowy, b.pochylenieGlowy), ...dExt(TRUNK_EXT, a, b),
    nogi: { R: leg('R'), L: leg('L') }, rece: { R: { chwyt: v(a.rece?.R?.chwyt, b.rece?.R?.chwyt), ...dExt(ARM_EXT, a.rece?.R, b.rece?.R) }, L: { chwyt: v(a.rece?.L?.chwyt, b.rece?.L?.chwyt), ...dExt(ARM_EXT, a.rece?.L, b.rece?.L) } } };
}
const plus = (a: V3, d: V3 | undefined): V3 => d ? add(a, d) : a;
const plusN = (a: number | undefined, d: number | undefined, base = 0): number | undefined => d === undefined ? a : (a ?? base) + d;
/** Delta odchylenia kolana przy jawnym kierunku zgięcia (biegunKolana): obraca kierunek w poziomie o dOut stopni na zewnątrz (ujemne = do środka); bez jawnego kierunku odchylenie liczy IK (odchylenieKolana), bez delty kierunek bez zmian. Dotąd delta była przy jawnym kierunku ignorowana, więc wiersz „kolana do środka” suwnicy (kierunek z pozy) nic nie zmieniał (recenzja p2-r2, B1). */
const poleZDelta = (pole: V3 | undefined, dOut: number | undefined, s: Side): V3 | undefined => {
  if (!pole || dOut === undefined || dOut === 0) return pole;
  const h = Math.hypot(pole[0], pole[1]) || 1; return [pole[0], pole[1], pole[2] + (s === 'R' ? 1 : -1) * Math.tan(dOut * Math.PI / 180) * h];
};
/** Poza z nałożoną deltą. */
export function applyDelta(k: KeyFrame, d: DeltaFrame): KeyFrame {
  const leg = (s: Side): LegData => { const l = k.nogi[s], x = d.nogi?.[s]; const toe = l.rotacjaStopy ?? 10; return { biegunKolana: poleZDelta(l.biegunKolana, x?.odchylenieKolana, s), kostka: plus(l.kostka, x?.kostka), podbicie: plusN(l.podbicie, x?.podbicie), rotacjaStopy: plusN(l.rotacjaStopy, x?.rotacjaStopy, 10), odchylenieKolana: plusN(l.odchylenieKolana, x?.odchylenieKolana, toe * 2) }; };
  const sumExt = <K extends string>(keys: readonly K[], base: Partial<Record<K, number>>, dd: Partial<Record<K, number>> | undefined): Partial<Record<K, number>> => { const o: Partial<Record<K, number>> = {}; for (const key of keys) { const x = plusN(base[key], dd?.[key]); if (x !== undefined) o[key] = x; } return o; };
  const arm = (s: Side): ArmData => ({ ...k.rece[s], chwyt: plus(k.rece[s].chwyt, d.rece?.[s]?.chwyt), ...sumExt(ARM_EXT, k.rece[s], d.rece?.[s]) });
  return { ...k, ...sumExt(TRUNK_EXT, k, d), miednica: plus(k.miednica, d.miednica), pochylenieTulowia: k.pochylenieTulowia + (d.pochylenieTulowia ?? 0), zgiecieKregoslupa: plusN(k.zgiecieKregoslupa, d.zgiecieKregoslupa), pochylenieGlowy: d.pochylenieGlowy === undefined ? k.pochylenieGlowy : (k.pochylenieGlowy ?? Math.max(-20, Math.min(60, k.pochylenieTulowia * 0.4))) + d.pochylenieGlowy, nogi: { R: leg('R'), L: leg('L') }, rece: { R: arm('R'), L: arm('L') } };
}
/** Neutralne ustawienie stopy względem goleni (kąt kostki ≈ +NEUTRAL_ANKLE_DEG): stopa prostopadła do goleni w płaszczyźnie strzałkowej, palce lekko ku goleni. Używane, gdy `podbicie` nie jest podane (decyzja koordynatora 26.10.2026: model nie liczy kąta kostki; stopa istotą ruchu → podbicie jawnie). */
export const NEUTRAL_ANKLE_DEG = 5;
export function neutralFootPitch(pelvis: V3, side: Side, li: LegIn, hipAt?: V3): number {
  const j = legJoints(pelvis, side, li, hipAt); const sx = j.knee[0] - li.ankle[0], sy = j.knee[1] - li.ankle[1];
  const want = Math.atan2(-sx, sy) * 180 / Math.PI + NEUTRAL_ANKLE_DEG;
  /* stopa nie wchodzi w podłogę (y = 0): gdy neutralne ustawienie zanurzałoby piętę lub palce, zmniejszamy pochylenie ku stopie płaskiej */
  const soleY = (deg: number): number => {
    const fp = deg * Math.PI / 180, ay = li.ankle[1];
    const y = (along: number): number => ay + Math.sin(fp) * along - Math.cos(fp) * BODY.ankleH;
    return Math.min(y(-BODY.heelBack), y(BODY.toeFwd));
  };
  if (soleY(want) >= -1e-6 || soleY(0) < -1e-6) return want;
  let lo = 0, hi = want; /* lo: dopuszczalne, hi: zanurza */
  for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (soleY(mid) >= -1e-6) lo = mid; else hi = mid; }
  return lo;
}
export function toPoseIn(k: KeyFrame): PoseIn {
  const lat = k.przesuniecieBoczne; const pelvis: V3 = lat ? [k.miednica[0], k.miednica[1], k.miednica[2] + lat] : k.miednica; /* bez pola: jak dotąd */
  const ext = { trunkRoll: k.obrotTulowia, trunkTwist: k.skretTulowia, trunkLean: k.przechylTulowia, pelvisTilt: k.przechylMiednicy, headTilt: k.przechylGlowy, lateral: lat };
  const hipOf = (s: Side): V3 => hipPoint({ pelvis, trunkPitch: k.pochylenieTulowia, ...ext }, s); /* z przechyłem i obrotem miednicy biodra nie leżą na osi z */
  const leg = (s: Side): LegIn => { const l = k.nogi[s]; const li: LegIn = { ankle: l.kostka, footPitch: l.podbicie, toeOut: l.rotacjaStopy, kneeOut: l.odchylenieKolana, kneePole: l.biegunKolana };
    if (li.footPitch === undefined) li.footPitch = neutralFootPitch(pelvis, s, li, hipOf(s)); /* podbicie niepodane: stopa neutralnie względem goleni */
    return li; };
  const arm = (s: Side): ArmIn => { const a = k.rece[s]; return { grip: a.chwyt, elbowPole: a.biegunLokcia, lower: a.dolnaCzesc, shrug: a.uniesienieBarkow, protract: a.wysuniecieBarkow, wristFlex: a.zgiecieNadgarstka, forearmRoll: a.obrotPrzedramienia }; };
  return { pelvis, trunkPitch: k.pochylenieTulowia, spineBend: k.zgiecieKregoslupa, headPitch: k.pochylenieGlowy, ...ext, legs: { R: leg('R'), L: leg('L') }, arms: { R: arm('R'), L: arm('L') } };
}
/** Odbicie punktu względem płaszczyzny strzałkowej (z → −z; „0 −” unika −0). */
const reflect = (p: V3): V3 => [p[0], p[1], 0 - p[2]];
const mirrorLeg = (l: LegData): LegData => ({ ...l, kostka: reflect(l.kostka), ...(l.biegunKolana ? { biegunKolana: reflect(l.biegunKolana) } : {}) });
const mirrorArm = (a: ArmData): ArmData => ({ ...a, chwyt: reflect(a.chwyt), ...(a.biegunLokcia ? { biegunLokcia: reflect(a.biegunLokcia) } : {}) });
/**
 * Lustro klatki kluczowej (tryb cykliczny): strony nóg zamieniają się z odbiciem osi z; miednica odbita; pola tułowia o znaku zależnym od strony (obrót, skręt, skłon, przechył miednicy i głowy, przesunięcie
 * boczne) zmieniają znak; pochylenie tułowia i głowy (płaszczyzna strzałkowa) bez zmian. Ręce zamieniają strony tylko przy `rece` (ruch rąk jest częścią kroku); inaczej zostają.
 * Pola per strona (rotacja stopy, odchylenie kolana, pola poza@2 rąk) mają konwencję „na zewnątrz” i są przenoszone bez zmiany znaku.
 */
export function mirrorKey(k: KeyFrame, rece: boolean): KeyFrame {
  const o: KeyFrame = { ...k, miednica: reflect(k.miednica), nogi: { R: mirrorLeg(k.nogi.L), L: mirrorLeg(k.nogi.R) }, rece: rece ? { R: mirrorArm(k.rece.L), L: mirrorArm(k.rece.R) } : k.rece };
  const flip = o as unknown as Record<string, number | undefined>; for (const f of TRUNK_EXT) if (flip[f] !== undefined) flip[f] = 0 - (flip[f] as number);
  return o;
}
