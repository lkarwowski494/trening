/*
 * 0.16.0, odczyt z Apple Health: hook useHealthLoad (lib/healthUse.ts) — wynik tylko w stanie komponentu, status off / loading / ready, zmiana klucza, błąd, odmontowanie
 * przed wynikiem, odświeżenie po powrocie z tła bez migotania (docs/29 rozdz. 7). Rodzaje (docs/20): logika.
 */
import { renderHook, act } from '@testing-library/react-native';
import * as store from '@/lib/store';
import { useHealthLoad } from '@/lib/healthUse';
import { fresh } from './helpers';

beforeEach(async () => { await fresh(); });
const flush = async () => { await act(async () => { await Promise.resolve(); await Promise.resolve(); }); };

test('wyłączony → status off i zero wywołań; włączony → loading, potem ready z wynikiem', async () => {
  /* RNTL 14: await renderHook opróżnia mikrozadania — wynik wstrzymany bramką, żeby stan „loading” był widoczny (ZB-010) */
  let release: () => void = () => {}; const gate = new Promise<void>(r => { release = r; }); const load = jest.fn(async () => { await gate; return 5; });
  const off = await renderHook(() => useHealthLoad(false, 'k', load)); expect(off.result.current).toEqual({ status: 'off', data: null }); await flush(); expect(load).not.toHaveBeenCalled();
  const on = await renderHook(() => useHealthLoad(true, 'k', load)); expect(on.result.current).toEqual({ status: 'loading', data: null }); release(); await flush(); expect(on.result.current).toEqual({ status: 'ready', data: 5 }); expect(load).toHaveBeenCalledTimes(1);
});
test('zmiana klucza → znów loading i nowe pytanie; powrót do wyłączonego czyści wynik', async () => {
  /* RNTL 14: bramka jak wyżej — stan „loading” po rerender widoczny przed wynikiem (ZB-010) */
  let n = 0; let release: () => void = () => {}; let gate: Promise<void> | null = null; const hold = () => { gate = new Promise<void>(r => { release = r; }); };
  const load = jest.fn(async () => { if (gate) await gate; return ++n; }); const h = await renderHook(({ k, on }: { k: string; on: boolean }) => useHealthLoad(on, k, load), { initialProps: { k: 'a', on: true } }); await flush(); expect(h.result.current.data).toBe(1);
  hold(); await h.rerender({ k: 'b', on: true }); expect(h.result.current.status).toBe('loading'); release(); await flush(); expect(h.result.current).toEqual({ status: 'ready', data: 2 });
  await h.rerender({ k: 'b', on: false }); expect(h.result.current.status).toBe('off'); hold(); await h.rerender({ k: 'b', on: true }); expect(h.result.current.status).toBe('loading'); release(); await flush(); expect(h.result.current.data).toBe(3);
});
test('błąd zapytania → ready z pustym wynikiem (ekrany pokazują „brak danych”, bez wyjątku)', async () => {
  const h = await renderHook(() => useHealthLoad(true, 'k', async () => { throw new Error('HealthKit'); })); await flush(); expect(h.result.current).toEqual({ status: 'ready', data: null });
});
test('odmontowanie przed wynikiem: późny wynik nie zmienia stanu (bez ostrzeżeń Reacta)', async () => {
  const err = jest.spyOn(console, 'error').mockImplementation(() => {}); let done: (v: number) => void = () => {}; const h = await renderHook(() => useHealthLoad(true, 'k', () => new Promise<number>(r => { done = r; })));
  await h.unmount(); done(7); await flush(); expect(err).not.toHaveBeenCalled(); err.mockRestore();
});
test('powrót aplikacji z tła odświeża w tle: stary wynik zostaje do czasu nowego (bez migotania)', async () => {
  let n = 0; let release: () => void = () => {}; let gate: Promise<void> | null = null; const load = jest.fn(async () => { if (gate) await gate; return ++n; });
  const h = await renderHook(() => useHealthLoad(true, 'k', load)); await flush(); expect(h.result.current).toEqual({ status: 'ready', data: 1 });
  gate = new Promise<void>(r => { release = r; }); await act(async () => { store.refreshViews(); }); expect(load).toHaveBeenCalledTimes(2); expect(h.result.current).toEqual({ status: 'ready', data: 1 });
  release(); await flush(); expect(h.result.current).toEqual({ status: 'ready', data: 2 });
});
