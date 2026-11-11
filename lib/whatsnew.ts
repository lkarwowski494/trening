import { getState, save, finishedWorkouts } from '@/lib/store';
import { WHATS_NEW } from '@/lib/whatsnew-wpisy';

/* Wpisy i typ: lib/whatsnew-wpisy.ts (W-22, 11.11.2026). */
export { WHATS_NEW, type WhatsNewEntry } from '@/lib/whatsnew-wpisy';

/** Kropka na „i”: najnowszy wpis nieprzeczytany — tylko u kogoś, kto już trenował (nowej osobie wszystko jest nowe; jak w Organizerze). */
export const whatsNewUnseen = () => WHATS_NEW.length > 0 && getState().whatsNewSeen !== WHATS_NEW[0].id && finishedWorkouts().length > 0;
/** Otwarcie sekcji = przeczytane. Bez `userTouched` — to stan ekranu, nie dane treningowe. */
export function markWhatsNewSeen() { const st = getState(); if (!WHATS_NEW.length || st.whatsNewSeen === WHATS_NEW[0].id) return; st.whatsNewSeen = WHATS_NEW[0].id; save(); }
