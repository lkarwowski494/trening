/*
 * Figury v2 — reguły techniki wyciskania leżąc z opisu NSCA (decyzja właściciela 25.10.2026; reguły własnymi słowami, źródło: NSCA Basics of Strength and Conditioning, 2012,
 * rozdz. o wyciskaniu leżąc; w UI bez nazw). Rodzaje (docs/20): niezmienniki geometrii dla czterech rdzeniowych wariantów (sztanga i hantle, płasko i skos):
 * (b) dół: gryf dotyka klatki w okolicy linii sutków; (c) tor w górę lekko do tyłu, w stronę barków; (d) pięć punktów podparcia przez cały ruch (głowa, plecy, pośladki, obie stopy);
 * (e) start: chwyt trochę szerzej niż barki, łokcie wyprostowane nad klatką; (f) błąd „wygięcie pleców / unoszenie klatki do sztangi” zgodny ze źródłem (dane lib/cues).
 * Reguła (a) „przedramiona prostopadle do podłogi i równolegle” NIE jest tu sprawdzana: w modelu koliduje z łokciami ok. 45° (decyzja z 25.10.2026) — patrz docs/50 rozdz. 11.
 */
import { figureSpec, frameAt, bodyColliders, equipColliders, gap, soleY, SIDES, BODY, ERRORS, CUE_TO_ERROR, jointAngles, type Frame, type V3 } from '@/lib/figures/v2';
import { CUE_DATA } from '@/lib/cues';

const CORE = ['Bench Press (sztanga)', 'Bench Press (hantle)', 'Incline Bench Press (sztanga)', 'Incline Bench Press (hantle)'];
const FLAT = ['Bench Press (sztanga)', 'Bench Press (hantle)'];
const U = Array.from({ length: 25 }, (_, i) => i / 24);
const fr = (k: string, u: number): Frame => frameAt(figureSpec(k)!, u);
/** Współrzędna punktu wzdłuż osi tułowia od barku w stronę miednicy (cm; dodatnia = niżej, w stronę stóp). */
const along = (f: Frame, p: V3): number => { const s = f.sk.shoulderC, h = f.sk.pelvis; const d = [h[0] - s[0], h[1] - s[1]]; const L = Math.hypot(d[0], d[1]); return ((p[0] - s[0]) * d[0] + (p[1] - s[1]) * d[1]) / L; };

describe('wyciskanie leżąc: reguły techniki (NSCA) na geometrii klatki', () => {
  test('(b) dół ruchu (płasko): środek gryfu/hantla na klatce na wysokości linii sutków: 12–24 cm od barku wzdłuż tułowia (tułów 50 cm)', () => {
    for (const k of FLAT) { const f = fr(k, 1); const d = along(f, f.info.load); expect([k, d > 12 && d < 24, +d.toFixed(1)]).toEqual([k, true, +d.toFixed(1)]); }
    for (const k of CORE) { const f = fr(k, 1); const d = along(f, f.info.load); expect([k, d > 8 && d < 24]).toEqual([k, true]); } /* skos: dotyk wyżej na klatce */
  });
  test('(c) tor w górę lekko do tyłu: na górze gryf jest w stronę głowy (−x) względem dołu o 3–25 cm i bliżej barków wzdłuż tułowia', () => {
    for (const k of CORE) { const a = fr(k, 0), b = fr(k, 1); const dx = a.info.load[0] - b.info.load[0]; expect([k, dx < -3 && dx > -25, +dx.toFixed(1)]).toEqual([k, true, +dx.toFixed(1)]); expect([k, along(a, a.info.load) < along(b, b.info.load)]).toEqual([k, true]); }
  });
  test('(d) pięć punktów podparcia w każdej klatce: plecy na oparciu i miednica na siedzisku (odstęp powierzchni ≤ 1,5 cm), głowa ≤ 4 cm od oparcia (głowa jest kulą pochyloną o 8°: uproszczenie ilustracyjne), obie stopy na podłodze (podeszwa 0 ± 0,5 cm)', () => {
    for (const k of CORE) for (const u of U) { const f = fr(k, u); const B = bodyColliders(f.sk), E = equipColliders(f.props); const g = (b: string, e: string) => Math.min(...B.filter(x => x.id === b).flatMap(x => E.filter(y => y.id === e).map(y => gap(x, y))));
      expect([k, u, Math.abs(g('head', 'benchBack')) <= 4, Math.abs(g('torso', 'benchBack')) <= 1.5, Math.abs(g('pelvis', 'benchSeat')) <= 1.5 || Math.abs(g('pelvis', 'benchBack')) <= 1.5]).toEqual([k, u, true, true, true]);
      for (const s of SIDES) expect([k, u, s, Math.abs(soleY(f.sk.legs[s])) <= 0.5]).toEqual([k, u, s, true]); }
  });
  test('(e) start: łokcie wyprostowane (≤ 5°) nad klatką; sztanga — chwyt trochę szerzej niż barki (połowa chwytu > połowa rozstawu barków, ≤ +20 cm); hantle startują bliżej siebie (nad klatką)', () => {
    for (const k of CORE) { const f = fr(k, 0); for (const s of SIDES) { const gz = Math.abs(f.sk.arms[s].grip[2]); if (k.includes('sztanga')) expect([k, s, gz > BODY.shHalf && gz <= BODY.shHalf + 20]).toEqual([k, s, true]); expect([k, s, jointAngles(f.sk, s).elbow <= 5]).toEqual([k, s, true]); }
      expect([k, Math.abs(f.info.load[0] - f.sk.shoulderC[0]) < 12 || k.includes('Incline')]).toEqual([k, true]); }
  });
  test('(f) błąd „wygięcie pleców / unoszenie klatki do sztangi” (arch): jest w danych ćwiczeń, ma źródło NSCA Basics s. 54 i pozę w rigu', () => {
    expect(CUE_TO_ERROR['bp.mis.arch']).toBe('arch'); expect(ERRORS.arch.affects).toContain('spine');
    const own = Object.values(CUE_DATA.exercises).flatMap(e => (e.mistakes ?? []).filter(m => m.c === 'bp.mis.arch')); expect(own.length).toBeGreaterThan(0);
    for (const m of own) expect(m.s.some(x => x[0] === 'nsca-basics-2012' && /s\. 54/.test(x[1]))).toBe(true);
    expect(CUE_DATA.sources['nsca-basics-2012'].level).toBe(4);
    const k = 'Bench Press (sztanga)'; const a = frameAt(figureSpec(k)!, 1), b = frameAt(figureSpec(k)!, 1, 'arch'); expect(b.sk.pelvis[1] - a.sk.pelvis[1]).toBeGreaterThan(6);
  });
});
