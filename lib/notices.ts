import { useSyncExternalStore } from 'react';

/*
 * Wzorzec „informacja przy starcie” (docs/32 wzorzec 14; HIG Alerts: „Avoid showing an alert when your app starts”): to, co aplikacja zrobiła sama przed
 * otwarciem (np. autozapis porzuconego treningu), pokazuje się jako wiersz na ekranie Trening — bez okna blokującego start. Znika po stuknięciu.
 */
let autoSaved: string | null = null; const subs = new Set<() => void>();
const emit = () => subs.forEach(f => f());
export const setAutoSavedNotice = (msg: string | null) => { autoSaved = msg; emit(); };
export const useAutoSavedNotice = (): string | null => useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb); }; }, () => autoSaved, () => null);
export const autoSavedNotice = (): string | null => autoSaved;
export const __resetNoticesForTests = () => { autoSaved = null; };
