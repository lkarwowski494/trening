/*
 * Figury v2 — czas animacji (liczby w jednym miejscu). Tempo ilustracyjne: ok. 2 s w dół, 1 s w górę (mieści się w zaleceniu umiarkowanej prędkości 1–2 s na fazę:
 * ACSM Position Stand 2009, Med Sci Sports Exerc 41(3):687–708; zakres czasu powtórzenia 0,5–8 s daje podobny przerost: Schoenfeld, Ogborn, Krieger 2015,
 * Sports Med 45:577–585 — badacz, docs/research, 25.10.2026). Pauzy na końcach (HOLD_MS) to KONWENCJA bez źródła. Brak cyklu oddechu i etykiet oddechu
 * (decyzja z badań 25.10.2026: konwencja bez źródła szczebla 1–2, sprzeczna z częścią źródeł przy ciężkich bojach).
 */
export const TEMPO = { downMs: 2000, upMs: 1000, holdMs: 500, tickMs: 33 } as const;
/** Tempo animacji; holdLowMs = pauza po fazie opuszczania (u = 1) zamiast HOLD_MS (0 = bez pauzy na dole: przysiad, NSCA Basics 2012 s. 49–50). */
export type Tempo = { downMs: number; upMs: number; holdLowMs?: number };

/**
 * Pozycja u (0–1) w chwili `ms` pętli. lowerFirst = faza 0→1 to opuszczanie (przysiad, wyciskanie, RDL: 2 s), inaczej to podnoszenie (martwy ciąg z podłogi: 1 s),
 * a powrót trwa odpowiednio dłużej. Na obu końcach pauza HOLD_MS.
 */
export function uAt(ms: number, lowerFirst: boolean, tempo: Tempo = TEMPO): number {
  const a = lowerFirst ? tempo.downMs : tempo.upMs, b = lowerFirst ? tempo.upMs : tempo.downMs, h = TEMPO.holdMs, hl = lowLeg(tempo);
  const total = h + a + hl + b; const x = ((ms % total) + total) % total;
  const ease = (k: number): number => (1 - Math.cos(Math.PI * k)) / 2;
  if (x < h) return 0;
  if (x < h + a) return ease((x - h) / a);
  if (x < h + a + hl) return 1;
  return 1 - ease((x - h - a - hl) / b);
}
const lowLeg = (tempo: Tempo): number => tempo.holdLowMs ?? TEMPO.holdMs;
export const loopLength = (_lowerFirst: boolean, tempo: Tempo = TEMPO): number => TEMPO.holdMs + lowLeg(tempo) + tempo.downMs + tempo.upMs;

/** Fazy pętli do licznika: etykiety (klucze t()) i czas w ms. `first` = faza 0→1 (u rośnie), `second` = powrót. */
export type PhaseName = 'Podciąganie' | 'Opuszczanie' | 'Wypychanie' | 'Wstawanie' | 'Podnoszenie' | 'Prostowanie' | 'Grzbiet w dół' | 'Koci grzbiet' | 'Pauza';
export type Phase = { name: PhaseName; ms: number };
export type PhaseNames = { first: PhaseName; second: PhaseName };

/** Cztery fazy jednej pętli w kolejności: pierwsza, pauza, druga, pauza (pauza ilustracyjna 0,5 s). */
export function phasesOf(names: PhaseNames, lowerFirst: boolean, tempo: Tempo = TEMPO): Phase[] {
  const a = lowerFirst ? tempo.downMs : tempo.upMs, b = lowerFirst ? tempo.upMs : tempo.downMs;
  return [{ name: names.first, ms: a }, { name: 'Pauza', ms: lowLeg(tempo) }, { name: names.second, ms: b }, { name: 'Pauza', ms: TEMPO.holdMs }];
}
/** Indeks fazy (w `phasesOf`) w chwili ms pętli: wiodąca pauza na starcie jest ostatnią fazą poprzedniej pętli. */
export function phaseIndexAt(ms: number, phases: Phase[]): number {
  const total = phases.reduce((s, p) => s + p.ms, 0); let x = ((ms % total) + total) % total;
  /* uAt zaczyna pętlę od pauzy na starcie, potem faza pierwsza — przesuwamy liczenie o tę pauzę */
  x = (x - TEMPO.holdMs + total) % total;
  for (let i = 0; i < phases.length; i++) { if (x < phases[i].ms) return i; x -= phases[i].ms; }
  return phases.length - 1;
}
