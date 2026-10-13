import { getState, save, toggleDone, restAfter, roundRest, findSet, markActivity } from './store';
import { restLabel } from './live';
import * as timer from './timer';
import { t as tr } from './i18n';

/*
 * Odhaczenie serii z przerwą i stoperem — przepływ wspólny dla ekranu treningu (components/ActiveWorkout.tsx) i zegarka (lib/watch/*):
 * jedna droga, więc ✓ na telefonie i „Seria zrobiona” na zegarku robią to samo (docs/32: to samo działa tak samo). Wydzielone z ekranu
 * bez zmiany zachowania (0.20, commit strukturalny); logika i komentarze z audytów jak dotąd.
 */

/** T11: domykanie serii czasowej w toku — pytanie o porzucony trening czeka (ekran czyta `isClosingSet`). */
let closing = false;
export const isClosingSet = () => closing;

/** Odhaczenie serii: startuje przerwę; cofnięcie — zatrzymuje ją tylko, jeśli pochodziła z tej serii. */
export async function completeSet(ei: number, si: number, at?: number): Promise<void> {
    const a = getState().active; if (!a) return; const set = a.exercises[ei]?.sets[si]; if (!set) return;
    if (timer.S.on && timer.S.setId === set.id) { await finishTimedSet(); return; }
    if (timer.S.on && timer.S.setId !== set.id && !set.done) await finishTimedSet(); // runda 19: odhaczenie innej serii kończy trwający pomiar (jeden timer naraz)
    if (!set.done) restLabels(ei, si); // runda 23: tylko przy odhaczeniu — odznaczenie nie zmienia podpisu trwającej przerwy
    const rest = toggleDone(ei, si, at);
    /* T8: przerwa liczona od końca serii — po późnym wybudzeniu zostaje reszta albo nic */
    const live = !!rest && (at == null || at + rest * 1000 > Date.now());
    if (set.done) { if (rest && live) await timer.start(rest, set.id, at); else await timer.stop(); }
    else await timer.stopIfFrom(set.id);
}
/** Podpis przerwy na Live Activity: następna seria albo następne ćwiczenie (runda 22: wspólny dla odhaczenia i ponownego pomiaru; audyt 0.10 LIVE-04:
 * ta sama reguła co karta „teraz”, po ostatniej serii — `last`). */
export function restLabels(ei: number, si: number) {
    const a = getState().active; if (!a) return; const e = a.exercises[ei]; if (!e) return; timer.labels.title = a.templateName || tr('Trening');
    const r = restLabel(a, ei, si); timer.labels.subtitle = r.sub; timer.labels.last = r.last;
}
/** Koniec serii czasowej (auto po osiągnięciu celu, ✓ albo ręcznie): zapisuje czas (maks. cel) i odhacza. */
export async function finishTimedSet(): Promise<void> { closing = true; try { await finishTimedSetInner(); } finally { closing = false; } }
async function finishTimedSetInner(): Promise<void> {
    const { setId, sec, endAt } = await timer.stopSet(); const pos = findSet(setId); const a = getState().active; if (!pos || !a) return;
    const set = a.exercises[pos.ei].sets[pos.si]; set.durationSec = Math.max(1, sec); if (set.done) markActivity(a, endAt); /* Q-010 */ save(a);
    if (!set.done) await completeSet(pos.ei, pos.si, endAt);
    else { const nx = a.exercises[pos.ei].sets[pos.si + 1]; const rest = nx && nx.kind === 'drop' && !nx.done ? null /* T7: przed drop setem bez przerwy, także po ponownym pomiarze */ : restAfter(pos.ei, pos.si) ?? roundRest(pos.ei); if (rest && endAt + rest * 1000 > Date.now()) { restLabels(pos.ei, pos.si); await timer.start(rest, set.id, endAt); } /* T9: przerwa od końca serii, jak przy pierwszym pomiarze */ } // runda 19/21/22: po ponownym pomiarze przerwa od nowa (w supersecie — przerwa rundy)
}
/** Podpis TRWAJĄCEJ przerwy liczony od nowa dla serii, która ją uruchomiła (lib/live.ts restLabel) — po zamianie (E2 pkt 3.8), „Pomiń dziś”
 * i każdej innej zmianie treningu (audyt 0.10, LIVE-03/04). Bez przerwy albo bez tej serii — nic. */
export function relabelRest() { const a = getState().active; const pos = timer.T.on ? findSet(timer.T.setId) : null; if (a && pos) { const r = restLabel(a, pos.ei, pos.si); timer.relabel(r.sub, r.last); } }
