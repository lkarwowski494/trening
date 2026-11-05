/*
 * Nakładka techniki: wyciskanie leżąc (rodzina wzorcowa etapu 1, 04.11.2026). Każdy element ma id wskazówki (`cue`) z karty ćwiczenia i regułę ze źródłem (`rule` w data/zrodla/figury-sens.json,
 * grupa reguły wyznacza kolor „danger” przy błędzie z tej samej grupy). Wskazówki elementów = `wskazowki_na_reguly` reguły (pilnuje tego tests/figures-v2-nakladka.test.ts).
 * NIE ma tu elementu reguły `przedramie_pod_sztanga` (pion nadgarstek–łokieć): reguła ma `cue: null`, więc nie ma tekstu wskazówki — element dopiero po dodaniu wskazówki (badacz).
 */
import type { TechniqueDef } from '../overlay';

export const BENCH_TECHNIQUE: TechniqueDef[] = [
  /** Pełny zakres: linia przez ramię i łokieć + łuk zgięcia łokcia (rzut boczny); kąt = „Kąt na rysunku: zgięcie łokcia”. */
  { id: 'benchElbowLimb', kind: 'limb', cue: ['bp.move', 'ibp.move', 'dbp.move', 'ibp.dbMove', 'cgbp.move'], rule: 'pelny_zakres', views: ['side'], joint: 'elbow' },
  /** Łokcie pośrodku (nie za szeroko): łuk odwiedzenia ramienia od płaszczyzny strzałkowej (rzut z góry); bez strefy zakresu — liczba reguły to konwencja. */
  { id: 'benchShoulderAbduction', kind: 'abduction', cue: ['bp.elbowsMid'], rule: 'lokcie_nie_szeroko', views: ['top'] },
  /** Łokcie blisko tułowia (chwyt wąski): ten sam łuk, reguła i wskazówka wąskiego chwytu. */
  { id: 'benchShoulderAbductionClose', kind: 'abduction', cue: ['cgbp.elbows'], rule: 'lokcie_przy_tulowiu', views: ['top'] },
];
