import { MUSCLES, type Muscle } from './seed';

/*
 * Mapa mięśni (decyzja właściciela 08.10.2026, docs/21 4b): uproszczona sylwetka przód/tył, partie z listy MUSCLES (te same, co „Serie per
 * partia”) zabarwione według liczby serii roboczych w okresie. Rysunek własny (proste kształty, bez cudzych grafik — bez licencji).
 * Skala WZGLĘDNA: odcień = udział w partii z największą liczbą serii w tym okresie (4 stopnie), nie progi „ile serii to dużo” — takie
 * progi byłyby twierdzeniem dziedzinowym bez źródła (CLAUDE.md, merytoryczne podstawy). Uproszczenie: jedna partia „plecy” zabarwia
 * czworobok, najszersze i prostowniki; „barki” — przód na sylwetce z przodu, tył na sylwetce z tyłu.
 */
export type View = 'front' | 'back';
export type Shape = { e: [number, number, number, number] } | { d: string };
export type Part = { muscle: Muscle | null; view: View; shapes: Shape[] };

/** Odbicie lustrzane kształtu względem osi sylwetki (x = 60). */
const mirror = (s: Shape): Shape => 'e' in s ? { e: [120 - s.e[0], s.e[1], s.e[2], s.e[3]] } : { d: s.d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${120 - Number(x)},${y}`) };
const pair = (...s: Shape[]): Shape[] => [...s, ...s.map(mirror)];

/** Części ciała bez partii (głowa, szyja, tułów, miednica, dłonie, kolana, stopy) — wspólne dla obu widoków. */
const BODY: Shape[] = [
  { e: [60, 20, 13, 16] }, { d: 'M54,34 L66,34 L67,46 L53,46 Z' },
  { d: 'M36,46 Q60,40 84,46 L88,62 L81,118 Q60,126 39,118 L32,62 Z' },
  { d: 'M39,116 Q60,126 81,116 L84,136 Q60,146 36,136 Z' },
  ...pair({ e: [21, 136, 5, 6] }, { e: [47, 196, 7, 7] }, { e: [47, 249, 9, 4] }),
];

export const PARTS: Part[] = [
  { muscle: null, view: 'front', shapes: BODY }, { muscle: null, view: 'back', shapes: BODY },
  /* przód */
  { muscle: 'barki', view: 'front', shapes: pair({ e: [33, 55, 10, 9] }) },
  { muscle: 'klatka', view: 'front', shapes: pair({ d: 'M59,52 L43,52 Q36,62 42,76 Q51,82 59,79 Z' }) },
  { muscle: 'core', view: 'front', shapes: [{ d: 'M49,84 Q60,80 71,84 L70,117 Q60,121 50,117 Z' }, ...pair({ d: 'M41,82 Q46,98 47,116 L42,115 Q37,98 38,84 Z' })] },
  { muscle: 'biceps', view: 'front', shapes: pair({ e: [27, 80, 7, 15] }) },
  { muscle: 'przedramiona', view: 'front', shapes: pair({ e: [23, 112, 6, 16] }) },
  { muscle: 'czworogłowe', view: 'front', shapes: pair({ d: 'M38,138 Q36,160 40,186 Q47,192 54,186 Q56,160 53,140 Z' }) },
  { muscle: 'przywodziciele', view: 'front', shapes: pair({ d: 'M54,140 Q59,142 59,150 Q58,168 55,178 Q53,160 54,140 Z' }) },
  { muscle: 'łydki', view: 'front', shapes: pair({ e: [46, 222, 6, 19] }) },
  /* tył */
  { muscle: 'barki', view: 'back', shapes: pair({ e: [33, 55, 10, 9] }) },
  { muscle: 'plecy', view: 'back', shapes: [{ d: 'M60,44 L45,50 L60,74 L75,50 Z' }, ...pair({ d: 'M42,58 Q37,82 47,104 L57,104 L57,76 Z' }), { d: 'M50,105 L70,105 L69,117 Q60,120 51,117 Z' }] },
  { muscle: 'triceps', view: 'back', shapes: pair({ e: [27, 80, 7, 15] }) },
  { muscle: 'przedramiona', view: 'back', shapes: pair({ e: [23, 112, 6, 16] }) },
  { muscle: 'pośladki', view: 'back', shapes: pair({ e: [50, 132, 10, 11] }) },
  { muscle: 'dwugłowe', view: 'back', shapes: pair({ d: 'M39,146 Q36,166 41,188 Q47,192 54,188 Q57,166 55,146 Z' }) },
  { muscle: 'przywodziciele', view: 'back', shapes: pair({ d: 'M55,146 Q59,148 59,154 Q58,168 56,176 Q54,160 55,146 Z' }) },
  { muscle: 'łydki', view: 'back', shapes: pair({ e: [46, 220, 8, 19] }) },
];

/** Stopień odcienia 0–4: 0 = brak serii, 1–4 = ćwiartki partii z największą liczbą serii w okresie. */
export function shadeLevel(value: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (!(value > 0) || !(max > 0)) return 0;
  return Math.min(4, Math.max(1, Math.ceil((4 * value) / max))) as 1 | 2 | 3 | 4;
}
/** Krycie koloru akcentu dla stopnia (0 — kolor neutralny partii). */
export const SHADE_OPACITY = [0, 0.3, 0.5, 0.75, 1] as const;

/** Partie z seriami w okresie, od największej liczby (opis dla VoiceOver i do testów). */
export function rankedMuscles(sets: Partial<Record<string, number>>): [Muscle, number][] {
  return MUSCLES.map(m => [m, sets[m] ?? 0] as [Muscle, number]).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
}

/** Znacznik SVG (podgląd poza aplikacją i testy kształtów) — ten sam rysunek co components/MuscleMap.tsx. */
export function svgMarkup(sets: Partial<Record<string, number>>, colors = { body: '#E9ECF2', part: '#C9CFDA', accent: '#1F5FD1' }): string {
  const max = Math.max(0, ...MUSCLES.map(m => sets[m] ?? 0));
  const one = (view: View, dx: number) => PARTS.filter(p => p.view === view).map(p => {
    const lvl = p.muscle ? shadeLevel(sets[p.muscle] ?? 0, max) : 0;
    const fill = p.muscle == null ? colors.body : lvl ? colors.accent : colors.part; const op = p.muscle && lvl ? SHADE_OPACITY[lvl] : 1;
    return p.shapes.map(s => 'e' in s ? `<ellipse cx="${s.e[0] + dx}" cy="${s.e[1]}" rx="${s.e[2]}" ry="${s.e[3]}" fill="${fill}" fill-opacity="${op}"/>` : `<path transform="translate(${dx},0)" d="${s.d}" fill="${fill}" fill-opacity="${op}"/>`).join('');
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 260">${one('front', 0)}${one('back', 130)}</svg>`;
}
