// Rejestr błędów wstrzymanych w generatorach (bledy-wstrzymane.json): id błędu → powód, dla którego generator go jeszcze nie rysuje.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const REJESTR = JSON.parse(readFileSync(fileURLToPath(new URL('./bledy-wstrzymane.json', import.meta.url)), 'utf8'));
/** Powód wstrzymania błędu `cue` albo null (rysowany); POZY_BLEDY_WSTRZYMANE=zwolnij rysuje także wstrzymane (podgląd do recenzji). */
export const powodWstrzymania = (cue) => (process.env.POZY_BLEDY_WSTRZYMANE === 'zwolnij' ? null : (typeof REJESTR[cue] === 'string' && !cue.startsWith('_') ? REJESTR[cue] : null));
