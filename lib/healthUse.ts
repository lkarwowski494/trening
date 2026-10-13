import { useEffect, useState } from 'react';
import { useForegroundTick } from './store';

/**
 * Odczyt ze Zdrowia do wyświetlenia (0.16.0, docs/29 rozdz. 7): wynik żyje wyłącznie w stanie komponentu (pamięć ekranu) — znika z ekranem, nie jest zapisywany nigdzie.
 * `key` identyfikuje pytanie (dzień, tydzień, sesja); zmiana klucza pokazuje „ładowanie”, powrót aplikacji z tła (useForegroundTick) odświeża w tle, zostawiając
 * dotychczasowy wynik do czasu nowego (bez migotania — zegarek mógł się właśnie zsynchronizować). `enabled` = false → status „off”, zero zapytań.
 */
export type HealthLoad<T> = { status: 'off' | 'loading' | 'ready'; data: T | null };
export function useHealthLoad<T>(enabled: boolean, key: string, load: () => Promise<T>): HealthLoad<T> {
  const fg = useForegroundTick(); const [res, setRes] = useState<{ key: string; data: T | null } | null>(null);
  useEffect(() => {
    if (!enabled) { setRes(null); return; }
    let alive = true;
    load().then(d => { if (alive) setRes({ key, data: d }); }).catch(() => { if (alive) setRes({ key, data: null }); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, key, fg]);
  return !enabled ? { status: 'off', data: null } : res && res.key === key ? { status: 'ready', data: res.data } : { status: 'loading', data: null };
}
