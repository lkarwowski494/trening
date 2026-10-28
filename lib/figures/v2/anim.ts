/*
 * Figury v2 — czas animacji (liczby w jednym miejscu). Tempo ilustracyjne: ok. 2 s w dół, 1 s w górę (mieści się w zaleceniu umiarkowanej prędkości 1–2 s na fazę:
 * ACSM Position Stand 2009, Med Sci Sports Exerc 41(3):687–708; zakres czasu powtórzenia 0,5–8 s daje podobny przerost: Schoenfeld, Ogborn, Krieger 2015,
 * Sports Med 45:577–585 — badacz, docs/research, 25.10.2026). Pauzy na końcach (HOLD_MS) to KONWENCJA bez źródła. Brak cyklu oddechu i etykiet oddechu
 * (decyzja z badań 25.10.2026: konwencja bez źródła szczebla 1–2, sprzeczna z częścią źródeł przy ciężkich bojach).
 */
export const TEMPO = { downMs: 2000, upMs: 1000, holdMs: 500, tickMs: 33 } as const;
/**
 * Tempo marszu w trybie cyklicznym (27.10.2026): czas jednego kroku = połowy pętli (u 0 → 1, potem ta sama faza w lustrze). KONWENCJA ilustracyjna bez źródła (jak pauzy HOLD_MS): ruch ciągły,
 * bez pauz i bez zwolnień; tempo opuszczania i podnoszenia z TEMPO nie dotyczy kroku, a czasu kroku w aplikacji nie podajemy.
 */
export const WALK = { stepMs: 1000 } as const;
/**
 * Pętla jednokierunkowa (28.10.2026; skoki i rzuty, `petla: 'jednokierunkowa'`): u 0 → 1 obejmuje całe powtórzenie (np. stanie → ugięcie → lot → lądowanie), więc po końcu nie ma powrotu — krótka pauza w pozycji końcowej
 * i skok do u = 0. KONWENCJA ilustracyjna bez źródła (jak WALK i pauzy HOLD_MS): ruch liniowo w czasie (najszybszy punkt ma stałą prędkość, jak zakłada generator póz), czasu powtórzenia w aplikacji nie podajemy.
 */
export const ONE_WAY = { repMs: 1500, holdStartMs: 500, holdEndMs: 500 } as const;
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
/** Pętla marszu w chwili `ms`: pozycja p ∈ [0, 2) rosnąca liniowo (0 → 1 = krok, 1 → 2 = ta sama faza w lustrze), zawija się bez skoku klatki. Tempo wahadła nie wpływa na krok. */
export function cycleAt(ms: number, _tempo: Tempo = TEMPO): number { const total = cycleLength(); return (((ms % total) + total) % total) / WALK.stepMs; }
/** Czas pełnej pętli marszu (dwa kroki), ms. */
export const cycleLength = (): number => 2 * WALK.stepMs;
/** Czas pełnej pętli jednokierunkowej: pauza na starcie + ruch + pauza na końcu, ms. */
export const oneWayLength = (): number => ONE_WAY.holdStartMs + ONE_WAY.repMs + ONE_WAY.holdEndMs;
/** Pozycja u (0–1) w chwili `ms` pętli jednokierunkowej: pauza w u = 0, ruch liniowy do u = 1, pauza w u = 1, potem skok do u = 0 (bez cofania ruchu). */
export function oneWayAt(ms: number): number {
  const total = oneWayLength(); const x = ((ms % total) + total) % total;
  if (x < ONE_WAY.holdStartMs) return 0;
  if (x < ONE_WAY.holdStartMs + ONE_WAY.repMs) return (x - ONE_WAY.holdStartMs) / ONE_WAY.repMs;
  return 1;
}
const lowLeg = (tempo: Tempo): number => tempo.holdLowMs ?? TEMPO.holdMs;
export const loopLength = (_lowerFirst: boolean, tempo: Tempo = TEMPO): number => TEMPO.holdMs + lowLeg(tempo) + tempo.downMs + tempo.upMs;

/** Fazy pętli do licznika: etykiety (klucze t()) i czas w ms. `first` = faza 0→1 (u rośnie), `second` = powrót. */
export type PhaseName = 'Podciąganie' | 'Opuszczanie' | 'Wypychanie' | 'Wstawanie' | 'Podnoszenie' | 'Prostowanie' | 'Unoszenie' | 'Obrót' | 'Powrót' | 'Rozsuwanie' | 'Ściąganie' | 'Uginanie' | 'Grzbiet w dół' | 'Koci grzbiet' | 'Marsz' | 'Skok' | 'Rzut' | 'Pauza';
/** `untimed`: faza bez czasu w liczniku (chód: sekundy opuszczania i podnoszenia nie dotyczą kroku); `ms` służy wtedy tylko do wyznaczenia bieżącej fazy w pętli. */
export type Phase = { name: PhaseName; ms: number; untimed?: true };
export type PhaseNames = { first: PhaseName; second: PhaseName };

/** Cztery fazy jednej pętli w kolejności: pierwsza, pauza, druga, pauza (pauza ilustracyjna 0,5 s). */
export function phasesOf(names: PhaseNames, lowerFirst: boolean, tempo: Tempo = TEMPO): Phase[] {
  const a = lowerFirst ? tempo.downMs : tempo.upMs, b = lowerFirst ? tempo.upMs : tempo.downMs;
  return [{ name: names.first, ms: a }, { name: 'Pauza', ms: lowLeg(tempo) }, { name: names.second, ms: b }, { name: 'Pauza', ms: TEMPO.holdMs }];
}
/** Jedna faza pętli dla ruchu chodzonego (noszenie): „Marsz” przez całą pętlę, bez sekund i bez pauz. */
export const walkPhases = (tempo: Tempo = TEMPO): Phase[] => [{ name: 'Marsz', ms: loopLength(false, tempo), untimed: true }];
/** Jedna faza pętli jednokierunkowej (skok, rzut): nazwa z DATA_UI (`first`) przez całą pętlę, bez sekund i bez pauz — czas powtórzenia nie jest podawany (brak źródła). */
export const oneWayPhases = (name: PhaseName): Phase[] => [{ name, ms: oneWayLength(), untimed: true }];
/** Indeks fazy (w `phasesOf`) w chwili ms pętli: wiodąca pauza na starcie jest ostatnią fazą poprzedniej pętli. */
export function phaseIndexAt(ms: number, phases: Phase[]): number {
  const total = phases.reduce((s, p) => s + p.ms, 0); let x = ((ms % total) + total) % total;
  /* uAt zaczyna pętlę od pauzy na starcie, potem faza pierwsza — przesuwamy liczenie o tę pauzę */
  x = (x - TEMPO.holdMs + total) % total;
  for (let i = 0; i < phases.length; i++) { if (x < phases[i].ms) return i; x -= phases[i].ms; }
  return phases.length - 1;
}
