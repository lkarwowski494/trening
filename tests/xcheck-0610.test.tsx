/* Przegląd spójności 06.10.2026 (sprzęt ↔ ćwiczenia, gumy oporowe) — testy odtwarzające znaleziska. */
import * as store from '@/lib/store';
import * as stats from '@/lib/stats';
import { fresh, ex, addWorkout } from './helpers';
import { addLocation, setEquip, setBandLevel, activeEquip } from '@/lib/locations';

beforeEach(async () => { await fresh(); });
test('WYSOKIE: rekordy ćwiczeń z gumą oporową liczą serie z gumą (dotąd suma powtórzeń 0)', () => {
  const b = store.getState().bands[0]; addWorkout(Date.now() - 86400000, [['Band Pull Apart', [{ reps: 15, bandId: b.id }, { reps: 12, bandId: b.id }]]]);
  expect(stats.sessionsFor(ex('Band Pull Apart')).map(s => s.total)).toEqual([27]);
  expect(stats.recordsFor(ex('Band Pull Apart')).maxReps).toBe(15);
  /* asysta gumą — bez zmian: seria z gumą nie jest „bez asysty” */
  addWorkout(Date.now() - 86400000, [['Pull Up', [{ reps: 8, bandId: b.id, addKg: '' }]]]); expect(stats.recordsFor(ex('Pull Up')).maxRepsFree).toBe(0);
});
test('ŚREDNIE: podpowiedź „↑” dla sztangi z gumami (Deadlift with Bands) nie znika przez gumę', () => {
  const b = store.getState().bands[0]; const sets = [{ weight: 100, reps: 8, bandId: b.id }, { weight: 100, reps: 8, bandId: b.id }] as any;
  const w = addWorkout(Date.now() - 86400000, [['Deadlift with Bands', sets]]);
  expect(store.progressionFor(ex('Deadlift with Bands'), 8, w.exercises[0].sets)).not.toBeNull();
  const pu = addWorkout(Date.now() - 86400000, [['Pull Up', [{ reps: 8, bandId: b.id, addKg: '' }]]]);
  expect(store.progressionFor(ex('Pull Up'), 8, pu.exercises[0].sets)).toBeNull(); /* asysta — bez zmian */
});
test('ŚREDNIE: guma tylko w „zalecanym” sprzęcie (Fire Hydrant, Clamshell) też ma przycisk gumy', () => {
  const rec = store.getState().exercises.filter(e => !e.archived && (e.recommended ?? []).includes('bands'));
  expect(rec.length).toBeGreaterThan(0); for (const e of rec) expect([e.name, store.usesBand(e)]).toEqual([e.name, true]);
});
test('NISKIE: gumy w miejscu z odznaczonymi wszystkimi poziomami — przycisk nie wybiera gumy spoza miejsca', () => {
  const l = addLocation('home'); setEquip(l, 'bands', true); for (const lv of activeEquip(l, 'bands')!.levels!.slice()) setBandLevel(l, lv, false);
  expect(activeEquip(l, 'bands')!.levels).toEqual([]); expect(store.nextBandId('', l.id)).toBe('');
});

/* partia 2 (ustawienia, teksty): liczby w tekstach z jednego źródła, jednostka z ustawień, poprawna odmiana */
import * as fs from 'fs';
import { AUTO_KEEP } from '@/lib/backup';
import { t } from '@/lib/i18n';
const src = (f: string) => fs.readFileSync(require('path').join(__dirname, '..', f), 'utf8');
test('NISKIE: liczba kopii automatycznych w tekstach pochodzi z AUTO_KEEP (nie wpisana „10”)', () => {
  for (const f of ['app/more/settings.tsx', 'app/more/backup.tsx']) { expect(src(f)).not.toMatch(/ostatnie 10/); expect(src(f)).toMatch(/n: AUTO_KEEP \}/); }
  expect(t('Pliki → Na moim iPhonie → {app} → Backup, ostatnie {n}', { app: 'Trening', n: AUTO_KEEP })).toContain(`ostatnie ${AUTO_KEEP}`);
});
test('NISKIE: podpowiedź zakresu w szablonie mówi o jednostce z ustawień, nie zawsze „kg”', () => {
  expect(src('app/template/[id].tsx')).not.toMatch(/więcej kg/); expect(src('app/template/[id].tsx')).toMatch(/więcej \{u\}”\.', \{ r: reps\(it\.repMin, it\.repMax\), u: wu\(\) \}/);
});
test('NISKIE: teksty LoadEditor bez odmiany zależnej od liczby („1 ustawień”, „3 ciężarów”)', () => {
  const s = src('components/LoadEditor.tsx'); expect(s).not.toMatch(/\{n\} ustawień|to \{c\} ciężarów/);
});
test('NISKIE: ostrzeżenie „Wyczyść wszystkie dane” mówi, że wracają też ustawienia, miejsca i gumy; alert Zdrowia bez żargonu (IPA, Expo Go)', () => {
  const s = src('app/more/settings.tsx'); expect(s).toMatch(/przywróci ustawienia domyślne \(także miejsca, sprzęt i gumy\)/); expect(s).not.toMatch(/build IPA|Expo Go go nie ma/);
});
test('NISKIE: ramka wskazówki pierwszego startu w kolorze z motywu (nie stały #5a5f6b — niewidoczna różnica w jasnym motywie)', () => {
  expect(src('app/(tabs)/index.tsx')).not.toMatch(/#5a5f6b/); expect(src('app/(tabs)/index.tsx')).toMatch(/borderColor: th\.line/);
});
test('ŚREDNIE (scenariusz 05b): liczba serii szablonu bez rozgrzewek wszędzie — ekran główny, trening wstecz, karta, Historia', () => {
  const tpl = { items: [{ id: 'i', exerciseId: 'x', sets: 3, rows: [{ id: 'a', kind: 'warmup', reps: '', weight: '', durationSec: '', distanceM: '' }, { id: 'b', kind: 'normal', reps: '', weight: '', durationSec: '', distanceM: '' }, { id: 'c', kind: 'drop', reps: '', weight: '', durationSec: '', distanceM: '' }] }] } as any;
  expect(store.tplWorkSets(tpl)).toBe(2);
  for (const f of ['app/(tabs)/index.tsx', 'app/history/add.tsx']) { expect(src(f)).toMatch(/tplWorkSets\(tpl\)/); expect(src(f)).not.toMatch(/a \+ i\.sets/); }
});
