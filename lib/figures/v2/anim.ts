/*
 * Figury v2 — czas animacji (liczby w jednym miejscu). Tempo ilustracyjne: ok. 2 s w dół, 1 s w górę (mieści się w zaleceniu umiarkowanej prędkości 1–2 s na fazę:
 * ACSM Position Stand 2009, Med Sci Sports Exerc 41(3):687–708; zakres czasu powtórzenia 0,5–8 s daje podobny przerost: Schoenfeld, Ogborn, Krieger 2015,
 * Sports Med 45:577–585 — badacz, docs/research, 25.10.2026). Pauzy na końcach (HOLD_MS) to KONWENCJA bez źródła. Brak cyklu oddechu i etykiet oddechu
 * (decyzja z badań 25.10.2026: konwencja bez źródła szczebla 1–2, sprzeczna z częścią źródeł przy ciężkich bojach).
 */
export const TEMPO = { downMs: 2000, upMs: 1000, holdMs: 500, tickMs: 33 } as const;

/**
 * Pozycja u (0–1) w chwili `ms` pętli. lowerFirst = faza 0→1 to opuszczanie (przysiad, wyciskanie, RDL: 2 s), inaczej to podnoszenie (martwy ciąg z podłogi: 1 s),
 * a powrót trwa odpowiednio dłużej. Na obu końcach pauza HOLD_MS.
 */
export function uAt(ms: number, lowerFirst: boolean): number {
  const a = lowerFirst ? TEMPO.downMs : TEMPO.upMs, b = lowerFirst ? TEMPO.upMs : TEMPO.downMs, h = TEMPO.holdMs;
  const total = h + a + h + b; const x = ((ms % total) + total) % total;
  const ease = (k: number): number => (1 - Math.cos(Math.PI * k)) / 2;
  if (x < h) return 0;
  if (x < h + a) return ease((x - h) / a);
  if (x < h + a + h) return 1;
  return 1 - ease((x - 2 * h - a) / b);
}
export const loopLength = (lowerFirst: boolean): number => 2 * TEMPO.holdMs + TEMPO.downMs + TEMPO.upMs;
