/*
 * Figury v2 — przykład kontraktu danych z GOTOWEJ rodziny (few-shot dla zewnętrznego generatora): rig → klatki kluczowe + błędy jako delty + sprzęt.
 * Przykład przechodzi ten sam walidator co wynik generatora (test: figures-v2-contract), więc jest wzorcem formatu i poprawności.
 */
import { frameAt, faultApplicable, figureSpec } from './figure';
import { ERRORS, type ErrorId } from './errors';
import { bodyShapes, propShapes } from './draw';
import { keyframeFrame, CONTRACT, type DataError, type DeltaFrame, type Gear, type KeyFrame, type PoseData } from './contract';
import type { PoseIn, Side } from './skeleton';
import type { Frame, Shape, View } from './scene';
import type { V3 } from './math';
import { SIDES } from './skeleton';

const r2 = (x: number): number => Math.round(x * 100) / 100;
const v3 = (v: V3): V3 => [r2(v[0]), r2(v[1]), r2(v[2])];
const headDefault = (p: PoseIn): number => p.headPitch ?? Math.max(-20, Math.min(60, p.trunkPitch * 0.4));
/** Poza rigu → klatka kontraktu (wartości domyślne jawnie, zaokrąglenie do 0,01). */
export function keyFrameOf(p: PoseIn, u: number): KeyFrame {
  const leg = (s: Side) => { const l = p.legs[s]; const toe = l.toeOut ?? 10; return { kostka: v3(l.ankle), podbicie: r2(l.footPitch ?? 0), rotacjaStopy: r2(toe), odchylenieKolana: r2(l.kneeOut ?? toe * 2) }; };
  const arm = (s: Side) => { const a = p.arms[s]; return { chwyt: v3(a.grip), ...(a.elbowPole ? { biegunLokcia: v3(a.elbowPole) } : {}), ...(a.lower !== undefined ? { dolnaCzesc: r2(a.lower) } : {}) }; };
  return { u: r2(u), miednica: v3(p.pelvis), pochylenieTulowia: r2(p.trunkPitch), zgiecieKregoslupa: r2(p.spineBend ?? 0), pochylenieGlowy: r2(headDefault(p)), nogi: { R: leg('R'), L: leg('L') }, rece: { R: arm('R'), L: arm('L') } };
}
const dv = (a: V3, b: V3): V3 | undefined => { const d: V3 = [r2(b[0] - a[0]), r2(b[1] - a[1]), r2(b[2] - a[2])]; return d.some(x => x !== 0) ? d : undefined; };
const dn = (a: number, b: number): number | undefined => { const d = r2(b - a); return d !== 0 ? d : undefined; };
const clean = <T extends object>(o: T): T => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && !(typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length === 0))) as T;
/** Różnica dwóch póz rigu jako delta kontraktu (tylko pola, które się zmieniły). */
export function deltaOf(base: PoseIn, err: PoseIn, u: number): DeltaFrame {
  const a = keyFrameOf(base, u), b = keyFrameOf(err, u);
  const nogi: Partial<Record<Side, object>> = {}, rece: Partial<Record<Side, object>> = {};
  for (const s of SIDES) {
    const l = clean({ kostka: dv(a.nogi[s].kostka, b.nogi[s].kostka), podbicie: dn(a.nogi[s].podbicie ?? 0, b.nogi[s].podbicie ?? 0), rotacjaStopy: dn(a.nogi[s].rotacjaStopy ?? 0, b.nogi[s].rotacjaStopy ?? 0), odchylenieKolana: dn(a.nogi[s].odchylenieKolana ?? 0, b.nogi[s].odchylenieKolana ?? 0) });
    if (Object.keys(l).length) nogi[s] = l;
    const g = dv(a.rece[s].chwyt, b.rece[s].chwyt); if (g) rece[s] = { chwyt: g };
  }
  return clean({ u: r2(u), miednica: dv(a.miednica, b.miednica), pochylenieTulowia: dn(a.pochylenieTulowia, b.pochylenieTulowia), zgiecieKregoslupa: dn(a.zgiecieKregoslupa ?? 0, b.zgiecieKregoslupa ?? 0), pochylenieGlowy: dn(a.pochylenieGlowy ?? 0, b.pochylenieGlowy ?? 0), nogi, rece }) as DeltaFrame;
}
const gearOf = (f: Frame): Gear[] => f.props.flatMap((p): Gear[] => {
  if (p.k === 'barbell') return [{ rodzaj: 'sztanga', talerze: p.plates !== false, podazaZaChwytem: true, dlugosc: p.len ?? 220 }];
  if (p.k === 'floor') return [{ rodzaj: 'podloga', x0: p.x0, x1: p.x1 }];
  if (p.k === 'box') return [{ rodzaj: 'skrzynia', x0: p.x0, x1: p.x1, top: p.top }];
  return [];
});
const MARK = (e: ErrorId): DataError['znacznik'] => ERRORS[e].mark;
const AFF = (e: ErrorId): DataError['dotyczy'] => ERRORS[e].affects;
/** Dane rodziny dla ćwiczenia gotowej rodziny: 9 klatek kluczowych, błędy pozowe z `errors` (id → identyfikator wskazówki), sprzęt z rigu. null, gdy rodzina nie jest gotowa albo jest z danych (poses/*.json — to nie rig, a wzorce z danych wybiera generator poleceń). */
export function exampleFor(key: string, errors: Partial<Record<ErrorId, string>> = {}): PoseData | null {
  const spec = figureSpec(key); if (!spec || 'data' in spec.variant) return null;
  const us = Array.from({ length: 9 }, (_, i) => i / 8); const frames = us.map(u => frameAt(spec, u));
  const bledy: DataError[] = [];
  for (const [id, cue] of Object.entries(errors) as [ErrorId, string][]) {
    if (ERRORS[id].kind !== 'pose' || !faultApplicable(spec, id)) continue;
    const eu = [0, 0.25, 0.5, 0.75, 1]; const klatki = eu.map(u => deltaOf(frameAt(spec, u).pose as PoseIn, frameAt(spec, u, id).pose as PoseIn, u));
    if (klatki[0].miednica || klatki[0].pochylenieTulowia || klatki[0].zgiecieKregoslupa || klatki[0].nogi) continue;
    bledy.push({ cue, znacznik: MARK(id), dotyczy: [...AFF(id)], klatki });
  }
  void CONTRACT;
  return { kontrakt: CONTRACT.id, rodzina: spec.family, cwiczenie: key, sprzet: gearOf(frames[0]), klatki: frames.map((f, i) => keyFrameOf(f.pose as PoseIn, us[i])), bledy };
}

/** Kształty klatki danych rodziny (podgląd wyniku generatora: arkusz SVG w scripts/figures/v2-validate.mjs --svg). */
export function dataShapes(d: PoseData, u: number, view: View, error?: number): Shape[] {
  const f = keyframeFrame(d, u, error); return [...bodyShapes(f.sk, view), ...propShapes(f.props, view)];
}
