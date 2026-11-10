/* Rodzina v2 „olympic”: plik póz, prezentacja (DATA_UI) — jeden plik na rodzinę, poseData.ts tylko składa rejestr (KO-022, 10.11.2026). */
/* olympic: u = 0 start (podłoga, wiszenie, rack), u = 1 przechwyt/wyprost; Jerk Dip Squat to zejście w dół (u: 0 → 1 = ugięcie 52°), więc wyjątek odwraca kierunek (R1-N1) */
import type { RodzinaPoz, PhaseOverride } from '../poseData';

const rodzina: RodzinaPoz = {
  load: () => require('../poses/olympic.json'),
  ui: { names: { first: 'Podnoszenie', second: 'Opuszczanie' }, lowerFirst: false, joints: ['knee', 'hip'],
    /* 05.11.2026: 19 ćwiczeń (18 z lotem albo wyrzutem i Snatch Balance, 05.11.2026 r6-W1) ma petla = jednokierunkowa — jedna faza „Podnoszenie” (całe powtórzenie od podłogi, wiszenia albo racka do przechwytu i wstania), bez opuszczania; kierunek u 0 → 1 ich nie dotyczy.
     * Jerk Dip Squat to zejście w dół (u 0 → 1 = opuszczanie, wahadło); Snatch Balance (wybicie i zejście pod sztangę, jak Squat Jerk) jest jednokierunkowy — wahadło cofałoby wybicie, a licznik z 2 s przeczyłby błędowi „zbyt wolne zejście”. Clean Pull, Snatch Pull i wzruszenia (bez lotu) zostają wahadłem z nazwami rodziny. Wyjątki są we wpisie olympic, nie w ONE_WAY_UI:
     * wpis rodziny pozostaje jeden, a skróty recenzji pozostałych rodzin nie zmieniają się od poprawki olympic (skrót liczy się z wyniku rysunku rodziny: scripts/skrot-v2-wynik.mjs). */
    exceptions: { 'Jerk Dip Squat': { names: { first: 'Opuszczanie', second: 'Podnoszenie' }, lowerFirst: true },
      ...Object.fromEntries(['Power Clean', 'Clean', 'Split Clean', 'Hang Clean', 'Block Clean', 'Block Power Clean', 'Barbell Snatch', 'Power Snatch', 'Split Snatch', 'Hang Snatch', 'Block Snatch', 'Block Power Snatch',
        'Power Jerk', 'Split Jerk', 'Squat Jerk', 'Muscle Snatch', 'Clean and Jerk', 'Jerk Balance', 'Snatch Balance'].map((k): [string, PhaseOverride] => [k, { names: { first: 'Podnoszenie', second: 'Podnoszenie' } }])) } },
};
export default rodzina;
