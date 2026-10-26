/*
 * Figury v2 — punkty styku liczone AUTOMATYCZNIE z geometrii klatki (nie ręcznie per ćwiczenie; polecenie właściciela 26.10.2026): stopy (pięta, palce) na podłodze albo na podwyższeniu,
 * głowa, plecy (górna część tułowia) i miednica na ławce, macie lub ścianie, dłonie na trzymanym sprzęcie. Styk = odległość powierzchni ≤ tolerancja (CONTACT, cm — jedno miejsce).
 * Rysunek: delikatna poświata (elipsa) w kolorze „dobrze” (poza poprawna) albo „błąd” (styk, który poza poprawna ma, a poza błędu go traci: oderwana pięta, oderwane pośladki).
 * Czysty moduł (bez React). „Pięć punktów styku” w wyciskaniu leżąc: NSCA Basics 2012 (głowa, barki i górne plecy, pośladki, obie stopy) — źródło przy wskazówce bp.contact (data/zrodla/cues.json);
 * dla pozostałych rodzin punkty wynikają wyłącznie z geometrii (bez dodatkowych twierdzeń).
 */
import type { V3 } from './math';
import { mul, sub } from './math';
import { SIDES, type Side } from './skeleton';
import { bodyColliders, equipColliders, gap, holdChecks } from './colliders';
import { proj } from './draw';
import type { Frame, Shape, View } from './scene';

/** Tolerancje styku (cm). */
/** `head`: środek głowy modelu leży na osi tułowia, więc oparta na ławce głowa ma ok. 3,2 cm odstępu od powierzchni (podkładka, kształt głowy) — uproszczenie ilustracyjne. */
export const CONTACT = { floor: 1.0, surface: 1.5, head: 3.5, glowAlpha: 0.55, haloAlpha: 0.2 } as const;

export type ContactId = 'heelR' | 'heelL' | 'toeR' | 'toeL' | 'handR' | 'handL' | 'head' | 'back' | 'seat';
export const CONTACT_IDS: ContactId[] = ['heelR', 'heelL', 'toeR', 'toeL', 'handR', 'handL', 'head', 'back', 'seat'];
export type ContactKind = 'foot' | 'hand' | 'body';
export type ContactPoint = { id: ContactId; kind: ContactKind; p: V3 };
export const kindOf = (id: ContactId): ContactKind => /^(heel|toe)/.test(id) ? 'foot' : /^hand/.test(id) ? 'hand' : 'body';

/** Powierzchnie, na których można leżeć, siedzieć lub opierać się (ławka, mata, ściana, skrzynia). */
const SURFACES = /^(benchSeat|benchBack|mat|wall|box)$/;

/** Wysokości powierzchni nośnych pod punktem x: podłoga, wierzch skrzyni i maty. */
function supports(f: Frame, x: number): number[] {
  const out = [0];
  for (const p of f.props) { if (p.k === 'box' && x >= p.x0 && x <= p.x1) out.push(p.top); else if (p.k === 'mat' && x >= p.x0 && x <= p.x1) out.push(p.h); }
  return out;
}

/** Punkty styku klatki. Stopa: pięta i palce osobno (punkty podeszwy) względem podłogi/podwyższenia; dłoń: chwyt na trzymanym sprzęcie (tolerancja z holdChecks); ciało: kolider głowy, tułowia i miednicy względem ławki, maty, ściany, skrzyni. */
const MEMO = new WeakMap<Frame, ContactPoint[]>(); /* klatki są niezmienne (figure.frameAt trzyma je w pamięci) — styki liczone raz na klatkę, oba widoki korzystają z tego samego wyniku */
export function contactsOf(f: Frame): ContactPoint[] {
  const hit = MEMO.get(f); if (hit) return hit;
  const out: ContactPoint[] = []; const sk = f.sk;
  for (const s of SIDES) {
    const L = sk.legs[s];
    for (const [name, p] of [['heel', L.heel], ['toe', L.toe]] as const) {
      const sy = supports(f, p[0]).find(y => Math.abs(p[1] - y) <= CONTACT.floor);
      if (sy !== undefined) out.push({ id: (name + s) as ContactId, kind: 'foot', p: [p[0], sy, p[2]] });
    }
  }
  for (const h of holdChecks(f)) { const side = h.name.slice(-1) as Side; if (h.err <= h.tol && SIDES.includes(side)) out.push({ id: ('hand' + side) as ContactId, kind: 'hand', p: sk.arms[side].grip }); }
  const body = bodyColliders(sk), eq = equipColliders(f.props).filter(e => SURFACES.test(e.id));
  const touches = (id: string, tol: number = CONTACT.surface): boolean => { const b = body.find(x => x.id === id); return !!b && eq.some(e => gap(b, e) <= tol); };
  if (touches('head', CONTACT.head)) out.push({ id: 'head', kind: 'body', p: sk.head });
  if (touches('torso')) out.push({ id: 'back', kind: 'body', p: sub(sk.shoulderC, mul(sk.up, 8)) });
  if (touches('pelvis')) out.push({ id: 'seat', kind: 'body', p: sk.pelvis });
  MEMO.set(f, out); return out;
}

const ELLIPSE = { foot: [6, 1.9], hand: [4.6, 4.6], body: [6.5, 4.2] } as const;
/** Poświata jednego punktu: dwie elipsy (halo i rdzeń); stopa płasko na podłodze, reszta wzdłuż osi tułowia. z — nad ciałem (dłoń, ciało) albo tuż nad podłogą (stopa). */
export function glowShapes(c: ContactPoint, view: View, role: 'contactOk' | 'contactBad', up: V3 = [0, 1, 0]): Shape[] {
  const [rx, ry] = ELLIPSE[c.kind]; const at = proj(c.p, view); const u2 = proj(up, view); const rot = c.kind === 'body' ? Math.atan2(u2[1], u2[0]) * 180 / Math.PI - 90 : 0;
  const z = c.kind === 'foot' ? -1900 : 3000; const id = role;
  return [
    { k: 'ellipse', c: at, rx: rx + 2.4, ry: ry + 1.6, rot, fill: role, a: CONTACT.haloAlpha, z, id },
    { k: 'ellipse', c: at, rx, ry, rot, fill: role, a: CONTACT.glowAlpha, z: z + 0.01, id },
  ];
}

/**
 * Poświaty stref styku: w pozie poprawnej wszystkie wykryte styki (kolor „dobrze”); przy pozie błędu — styk, który poza poprawna w tej samej pozycji ma, a poza błędu go nie ma,
 * rysowany na miejscu styku pozy poprawnej (kolor „błąd”), pozostałe nadal „dobrze”.
 */
export function contactGlows(frame: Frame, view: View, reference?: Frame): Shape[] {
  const now = contactsOf(frame); const out: Shape[] = []; const up = frame.sk.up;
  const have = new Set(now.map(c => c.id));
  for (const c of now) out.push(...glowShapes(c, view, 'contactOk', up));
  if (reference) for (const c of contactsOf(reference)) if (!have.has(c.id)) {
    const p: V3 = c.kind === 'foot' ? [frame.sk.legs[c.id.endsWith('R') ? 'R' : 'L'][c.id.startsWith('heel') ? 'heel' : 'toe'][0], c.p[1], c.p[2]] : c.p;
    out.push(...glowShapes({ ...c, p }, view, 'contactBad', reference.sk.up));
  }
  return out;
}
export const lostContacts = (frame: Frame, reference: Frame): ContactId[] => { const have = new Set(contactsOf(frame).map(c => c.id)); return contactsOf(reference).filter(c => !have.has(c.id)).map(c => c.id); };

