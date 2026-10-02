/**
 * Kolejka wywołań Live Activity: natywne AsyncFunction biegną współbieżnie, a start kończy poprzednie aktywności —
 * bez kolejki dwa starty (np. przerwa i stoper po restarcie) mogły zostawić dwie aktywności naraz (runda 3).
 */
let q: Promise<unknown> = Promise.resolve();
export const serial = <T>(f: () => Promise<T>): Promise<T> => { const p = q.then(f, f); q = p.catch(() => {}); return p; };
