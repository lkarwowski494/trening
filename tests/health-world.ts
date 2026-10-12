/*
 * Makieta „świata Apple Health” o kontrakcie @kingstinct/react-native-healthkit 16.x (kształty przeczytane w paczce: specs/*.nitro.ts, types/QuantityType.ts,
 * types/Workouts.ts, ios/PredicateHelpers.swift) — wspólna dla testów odczytu 0.16.0 (docs/29 rozdz. 12). Trzyma kroki dni, treningi (zegarka, innych źródeł i WŁASNE kopie
 * tej aplikacji), liczy wywołania i zapamiętuje filtry usuwania. Odwzorowuje też pułapki biblioteki: tętno bez jawnej jednostki wraca w count/s, a usuwanie bez źródła
 * w filtrze skasowałoby wpis dowolnego źródła o tym znaczniku — test niezmiennika sprawdza, że aplikacja nigdy tak nie woła.
 */
import { dayBounds } from '@/lib/healthRead';

export const OWN_BUNDLE = 'com.test.trening';
export const WATCH_BUNDLE = 'com.apple.health.watch';
export interface FakeWorkout { uuid: string; start: number; end: number; type?: number; durationSec?: number; distanceM?: number | null; syncId?: string; bundle?: string;
  hr?: { avg: number; max: number }; kcal?: number; totalKcal?: number }
export interface World {
  steps: Record<string, number>; workouts: FakeWorkout[]; deleted: { filter: any; count: number }[]; saved: FakeWorkout[];
  fail: { steps?: boolean; workouts?: boolean; delete?: boolean; stats?: boolean }; available: boolean;
  spies: Record<string, jest.SpyInstance>; proxies: { uuid: string; dispose: jest.Mock; getStatistic: jest.Mock }[]; calls: { statistics: any[][]; workouts: any[]; delete: any[][] };
}
const hkMod = () => require('@kingstinct/react-native-healthkit').default;
const same = (a: any, b: any) => a?.bundleIdentifier === b?.bundleIdentifier;
let uuidN = 0;
export const watchStrength = (start: number, minutes: number, extra: Partial<FakeWorkout> = {}): FakeWorkout => ({ uuid: `W-${++uuidN}`, start, end: start + minutes * 60e3, type: 50, bundle: WATCH_BUNDLE, hr: { avg: 128, max: 161 }, kcal: 312, ...extra });
export const watchOther = (start: number, minutes: number, extra: Partial<FakeWorkout> = {}): FakeWorkout => ({ uuid: `O-${++uuidN}`, start, end: start + minutes * 60e3, type: 37, bundle: WATCH_BUNDLE, distanceM: 5200, ...extra });

export function hkWorld(init: Partial<Pick<World, 'steps' | 'workouts'>> = {}): World {
  const w: World = { steps: { ...(init.steps ?? {}) }, workouts: [...(init.workouts ?? [])], deleted: [], saved: [], fail: {}, available: true, spies: {}, proxies: [],
    calls: { statistics: [], workouts: [], delete: [] } };
  const h = hkMod(); const s = (name: string, fn: (...a: any[]) => any) => {
    if (jest.isMockFunction(h[name]) && (h[name] as any).mockRestore) (h[name] as any).mockRestore(); /* kolejny świat w tym samym teście zaczyna z czystymi licznikami wywołań */
    w.spies[name] = jest.spyOn(h, name).mockImplementation(fn as any);
  };
  const matchFilter = (x: FakeWorkout, f: any): boolean => {
    if (!f) return true;
    if (f.date?.startDate && f.date?.endDate && !(x.end > f.date.startDate.getTime() && x.start < f.date.endDate.getTime())) return false;
    if (f.OR && !f.OR.some((o: any) => o.workoutActivityType === (x.type ?? 50))) return false;
    if (f.NOT && f.NOT.some((n: any) => n.sources?.some((src: any) => src.bundleIdentifier === (x.bundle ?? WATCH_BUNDLE)))) return false;
    if (f.sources && f.sources.length && !f.sources.some((src: any) => src.bundleIdentifier === (x.bundle ?? WATCH_BUNDLE))) return false;
    if (f.metadata && f.metadata.withMetadataKey === 'HKMetadataKeySyncIdentifier' && x.syncId !== f.metadata.value) return false;
    return true;
  };
  const proxy = (x: FakeWorkout) => {
    const p = { uuid: x.uuid, startDate: new Date(x.start), endDate: new Date(x.end), workoutActivityType: x.type ?? 50,
      duration: { unit: 's', quantity: x.durationSec ?? (x.end - x.start) / 1000 }, totalDistance: x.distanceM ? { unit: 'meters', quantity: x.distanceM } : undefined,
      totalEnergyBurned: x.totalKcal ? { unit: 'kcal', quantity: x.totalKcal } : undefined, metadata: x.syncId ? { HKMetadataKeySyncIdentifier: x.syncId } : {},
      sourceRevision: { source: { name: 'src', bundleIdentifier: x.bundle ?? WATCH_BUNDLE } }, dispose: jest.fn(),
      getStatistic: jest.fn(async (type: string, unit?: string) => {
        if (w.fail.stats) throw new Error('stat');
        if (type === 'HKQuantityTypeIdentifierHeartRate' && x.hr) { const k = unit === 'count/min' ? 1 : 1 / 60; return { averageQuantity: { unit: unit ?? 'count/s', quantity: x.hr.avg * k }, maximumQuantity: { unit: unit ?? 'count/s', quantity: x.hr.max * k } }; }
        if (type === 'HKQuantityTypeIdentifierActiveEnergyBurned' && x.kcal != null) return { sumQuantity: { unit: unit ?? 'kcal', quantity: x.kcal } };
        return undefined;
      }) };
    w.proxies.push(p as any); return p;
  };
  s('isHealthDataAvailableAsync', async () => w.available);
  s('requestAuthorization', async () => true);
  s('authorizationStatusFor', () => 2);
  s('currentAppSource', () => ({ name: 'Trening', bundleIdentifier: OWN_BUNDLE }));
  s('queryStatisticsCollectionForQuantity', async (type: string, stats: string[], anchor: Date, interval: any, options: any) => {
    w.calls.statistics.push([type, stats, anchor, interval, options]); if (w.fail.steps) throw new Error('steps');
    const out: any[] = []; const a = options?.filter?.date?.startDate as Date, b = options?.filter?.date?.endDate as Date;
    for (let d = new Date(a); d < b; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      out.push({ startDate: new Date(d), endDate: new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1), ...(key in w.steps ? { sumQuantity: { unit: options?.unit ?? 'count', quantity: w.steps[key] } } : {}) });
    }
    return out;
  });
  s('queryWorkoutSamples', async (opts: any) => { w.calls.workouts.push(opts); if (w.fail.workouts) throw new Error('workouts'); return w.workouts.filter(x => matchFilter(x, opts.filter)).sort((p, q) => p.start - q.start).map(proxy); });
  s('deleteObjects', async (type: string, filter: any) => {
    w.calls.delete.push([type, filter]); if (w.fail.delete) throw new Error('delete');
    const gone = w.workouts.filter(x => matchFilter(x, filter)); w.workouts = w.workouts.filter(x => !gone.includes(x)); w.deleted.push({ filter, count: gone.length }); return gone.length;
  });
  s('saveWorkoutSample', async (type: number, _q: unknown[], start: Date, end: Date, _t: unknown, meta: any) => {
    const f: FakeWorkout = { uuid: `OWN-${++uuidN}`, start: start.getTime(), end: end.getTime(), type, bundle: OWN_BUNDLE, syncId: meta?.HKMetadataKeySyncIdentifier };
    w.workouts.push(f); w.saved.push(f); return { uuid: f.uuid, dispose: jest.fn() };
  });
  return w;
}
/** Klucz dnia → środek dnia lokalnego (ms). */
export const noon = (key: string) => { const { from } = dayBounds(key); return from + 12 * 3600e3; };
export const at = (key: string, hh: number, mm = 0) => { const { from } = dayBounds(key); return from + (hh * 60 + mm) * 60e3; };
