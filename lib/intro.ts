import { ICON_PLATES, ICON_COLLAR, ICON_VIEWBOX, type IconRect } from './brandIcon';

/*
 * Animacja przy starcie (decyzja właściciela 09.10.2026 ok. 17:25, docs/18; warunki zatwierdzone przy zleceniu): talerze wsuwają się na gryf
 * i składają w ikonę aplikacji. Tylko zimny start (nie powrót z tła), ok. 1 s, tapnięcie pomija, przy „Ogranicz ruch” bez animacji.
 * Ekran startowy iOS pokazuje sam gryf (assets/brand/splash*.svg), więc pierwsza klatka animacji = ekran startowy (bez mignięcia).
 * Liczby w jednym miejscu (INTRO); rysunek: components/Intro.tsx, podpięcie: app/_layout.tsx. Grafika dekoracyjna — bez twierdzeń merytorycznych.
 */
export const INTRO = {
  /** Cała animacja razem ze zniknięciem (ok. 1 s — warunek właściciela). */
  totalMs: 1000,
  /** Wsunięcie jednego elementu (talerz, zacisk). */
  slideMs: 380,
  /** Odstęp startu kolejnych elementów (ładowanie po kolei, od najcięższego). */
  staggerMs: 100,
  /** Zniknięcie nakładki (przejście do aplikacji). */
  fadeMs: 150,
  /** Skąd startuje każdy element: tyle jednostek viewBox w prawo od miejsca na ikonie — wszystkie zaczynają poza ekranem (x ≥ 120). */
  fromRight: ICON_VIEWBOX,
  /** Ile najdłużej czekać na odpowiedź „Ogranicz ruch”; brak odpowiedzi = bez animacji (ostrożnie: ruch tylko, gdy wiadomo, że wolno). */
  reduceMotionWaitMs: 300,
} as const;
/** Koniec ruchu = ostatnia klatka (ikona); po niej zniknięcie, gdy dane są gotowe — inaczej ostatnia klatka zostaje do końca ładowania. */
export const INTRO_MOVE_MS = INTRO.totalMs - INTRO.fadeMs;

/** Elementy wsuwane po kolei: talerze od najcięższego, na końcu zacisk. */
export type IntroPiece = IconRect & { fill: 'ink' | (typeof ICON_PLATES)[number]['color']; delay: number };
export function introPieces(): IntroPiece[] {
  const order: (IconRect & { fill: IntroPiece['fill'] })[] = [...ICON_PLATES.map(({ color, ...r }) => ({ ...r, fill: color })), { ...ICON_COLLAR, fill: 'ink' }];
  return order.map((p, i) => ({ ...p, delay: i * INTRO.staggerMs }));
}
/** Wygaszenie ruchu: ta sama krzywa co Easing.out(Easing.cubic) z React Native (komponent używa Easing, test porównuje). */
export const easeOutCubic = (p: number): number => 1 - (1 - p) ** 3;
/** Przesunięcie elementu w prawo (jednostki viewBox) w chwili t ms od startu animacji: fromRight → 0. */
export function pieceOffset(p: Pick<IntroPiece, 'delay'>, t: number): number {
  const q = Math.min(1, Math.max(0, (t - p.delay) / INTRO.slideMs));
  return INTRO.fromRight * (1 - easeOutCubic(q));
}
/** Klatka w chwili t: położenie x każdego elementu (jednostki viewBox) i krycie nakładki (1 → 0 w czasie zniknięcia). */
export function introFrame(t: number): { x: number[]; opacity: number } {
  const x = introPieces().map(p => p.x + pieceOffset(p, t));
  const opacity = t <= INTRO_MOVE_MS ? 1 : Math.max(0, 1 - (t - INTRO_MOVE_MS) / INTRO.fadeMs);
  return { x, opacity };
}

/** Czy pokazać animację: tylko przy wyłączonym „Ogranicz ruch” (AccessibilityInfo.isReduceMotionEnabled); null = brak odpowiedzi → bez animacji. */
export const INTRO_MODES = ['animate', 'none'] as const;
export type IntroMode = (typeof INTRO_MODES)[number];
export const introMode = (reduceMotion: boolean | null): IntroMode => reduceMotion === false ? 'animate' : 'none';

/*
 * Zimny start: animacja raz na proces JS. Powrót z tła nie montuje układu od nowa, a gdyby (np. ponowne zamontowanie korzenia) — flaga już
 * zużyta. Proces uruchomiony w tle (system budzi aplikację, AppState 'background') też zużywa flagę bez animacji — użytkownik jej nie widzi.
 * Przy normalnym starcie iOS stan to 'inactive' albo 'active' (aplikacja staje się aktywna dopiero po starcie).
 */
let coldStartUsed = false;
export function takeColdStart(appState: string | null | undefined): boolean {
  if (coldStartUsed) return false;
  coldStartUsed = true;
  return appState !== 'background';
}
/** Testy: nowy „start aplikacji” (tests/app.tsx renderApp) = nowy proces. */
export function __resetIntroForTests() { coldStartUsed = false; }
