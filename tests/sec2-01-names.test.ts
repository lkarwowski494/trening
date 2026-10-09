/*
 * SEC2-01 (reszta; audyt kontrolny 1, 09.10.2026, backlog przed App Store): znaki towarowe innych firm w nazwach ćwiczeń katalogu i etykietach sprzętu
 * (CLAUDE.md „Treści cudze i nazwy innych firm”; wytyczne Apple 2.3.7, 5.2.1) → nazwy ogólne, opisowe. Klucze w danych użytkownika zostają:
 * `libKey` ćwiczenia (wskazówki, figury, rodzaj aktywności w Zdrowiu, krok katalogu idą po nim), id sprzętu i możliwości. Zmienia się tylko nazwa
 * wyświetlana: nowa instalacja (libExercise) i dane z wcześniejszych wersji (migrate — gdy nazwa jest równa kluczowi, czyli nieprzemianowana).
 * Nazwy ćwiczeń: PL ogólna, inne języki — angielska (konwencja biblioteki, lib/i18n.ts exName); etykiety sprzętu — 26 języków (słowniki).
 * Rodzaje (docs/20): dane (migracja z historią, szablonem, rekordami; idempotencja; restart; przemianowane i własne bez zmian), logika (exName),
 * języki (każde ćwiczenie i etykieta sprzętu w 26 językach bez nazw z listy), regresja (klucze bez zmian).
 */
import * as store from '@/lib/store';
import { recordsFor, sessionsFor } from '@/lib/stats';
import { seedState, LIB_DISPLAY_NAME, uid, type State } from '@/lib/seed';
import { exName, applyLang, LANGS } from '@/lib/i18n';
import { EQUIPMENT, CAP_LABEL, equipLabel, capLabel } from '@/lib/equipment';
import { cuesFor } from '@/lib/cues';
import { figureFor } from '@/lib/figures';
import { CARDIO_KIND, HK_ACTIVITY } from '@/lib/health';
import { fresh, saved, set } from './helpers';
import { namesIn } from './forbidden-names';

afterEach(() => applyLang('pl'));
const AT = new Date(2026, 8, 1, 18).getTime();
const KEYS = Object.keys(LIB_DISPLAY_NAME);

describe('SEC2-01: nazwy ćwiczeń katalogu bez znaków towarowych (klucz zostaje)', () => {
  test('mapa nazw: każdy klucz jest w katalogu i zawiera nazwę z listy zakazanych; nazwa wyświetlana nie (PL i EN)', () => {
    const s = seedState('pl'); expect(KEYS.length).toBe(3);
    for (const k of KEYS) {
      expect({ k, inCatalog: s.exercises.some(e => e.libKey === k), brand: namesIn(k).length > 0 }).toEqual({ k, inCatalog: true, brand: true });
      const e = s.exercises.find(x => x.libKey === k)!;
      expect(e.name).toBe(LIB_DISPLAY_NAME[k]); expect(namesIn(e.name)).toEqual([]);
      applyLang('en'); expect(namesIn(exName(e))).toEqual([]); expect(exName(e)).not.toBe(e.name); applyLang('pl');
    }
  });
  test('nazwy ogólne (PL / EN)', () => {
    const s = seedState('pl'); const by = (k: string) => s.exercises.find(x => x.libKey === k)!;
    const both = (k: string) => { applyLang('pl'); const pl = exName(by(k)); applyLang('en'); const en = exName(by(k)); applyLang('pl'); return [pl, en]; };
    expect(both(KEYS.find(k => /bike/i.test(k))!)).toEqual(['Rower powietrzny', 'Air Bike']);
    expect(both(KEYS.find(k => /erg/i.test(k))!)).toEqual(['Ergometr narciarski', 'Ski Ergometer']);
    expect(both(KEYS.find(k => /crunch/i.test(k))!)).toEqual(['Cable Crunch With Side Bends (półkula balansowa)', 'Cable Crunch With Side Bends (Balance Dome)']);
  });
  test('wszystkie ćwiczenia nowej instalacji w 26 językach — nazwa bez nazw z listy', () => {
    const s = seedState('pl'); const bad: string[] = [];
    for (const l of LANGS) { applyLang(l); for (const e of s.exercises) { const n = exName(e); if (namesIn(n).length) bad.push(`${l}: ${n}`); } }
    expect(bad).toEqual([]);
  });
  test('klucz zostaje: wskazówki, figura i rodzaj aktywności w Zdrowiu po kluczu jak przed zmianą nazwy', () => {
    const s = seedState('pl');
    for (const k of KEYS) {
      const e = s.exercises.find(x => x.libKey === k)!; const asKey = { ...e, name: k };
      expect({ k, cues: !!cuesFor(e), fig: !!figureFor(e) }).toEqual({ k, cues: !!cuesFor(asKey), fig: !!figureFor(asKey) });
    }
    const bike = s.exercises.find(x => /bike/i.test(x.libKey ?? ''))!; /* rodzaj aktywności w Zdrowiu po kluczu (MER-18) — rower */
    expect(CARDIO_KIND[bike.libKey!]).toBe(HK_ACTIVITY.cycling);
  });
});

/** Stan sprzed zmiany (0.10.0): ćwiczenia z nazwą równą kluczowi, historia, szablon. */
function legacy(): { s: State; ids: string[] } {
  const s = JSON.parse(JSON.stringify(seedState('pl'))) as State; const ids: string[] = [];
  for (const k of KEYS) { const e = s.exercises.find(x => x.libKey === k)!; e.name = k; ids.push(e.id); }
  s.workouts.push({ id: uid(), ownerId: 'local', createdAt: AT, updatedAt: AT, loggedBy: 'local', sessionMode: 'solo', healthUUID: null, templateId: null, templateName: 'T', startedAt: AT, finishedAt: AT + 3600e3, note: '',
    exercises: ids.map(id => ({ id: uid(), exerciseId: id, restSec: 60, repMin: null, repMax: null, groupId: null, sets: [set({ weight: 20, reps: 12, durationSec: 300, distanceM: 1000, done: true, completedAt: AT })] })) } as never);
  s.templates.push({ id: 'tpl1', ownerId: 'local', createdAt: AT, updatedAt: AT, name: 'Kondycja', items: ids.map((id, i) => ({ id: 'it' + i, exerciseId: id, sets: 3, repMin: 10, repMax: 12, restSec: null, startWeight: '', targetSec: '', groupId: null })) } as never);
  return { s, ids };
}
const snap = (ids: string[]) => ({
  workouts: JSON.stringify(store.getState().workouts), templates: JSON.stringify(store.getState().templates),
  keys: ids.map(id => store.exById(id)!.libKey), records: ids.map(id => JSON.stringify(recordsFor(store.exById(id)!))), sessions: ids.map(id => JSON.stringify(sessionsFor(store.exById(id)!))),
});

describe('SEC2-01: migracja nazw z wcześniejszych wersji', () => {
  test('nazwa równa kluczowi → nazwa ogólna; id, klucz, historia, szablon, rekordy i sesje bez zmian; idempotentnie i po restarcie', async () => {
    const { s, ids } = legacy();
    await fresh(JSON.parse(JSON.stringify(s)));
    for (const [i, k] of KEYS.entries()) { const e = store.exById(ids[i])!; expect({ k, name: e.name, key: e.libKey }).toEqual({ k, name: LIB_DISPLAY_NAME[k], key: k }); }
    const a = snap(ids);
    expect(JSON.parse(a.workouts).map((w: { exercises: { exerciseId: string }[] }) => w.exercises.map(x => x.exerciseId))).toEqual([ids]);
    /* te same liczby co w danych sprzed zmiany nazwy (rekordy po id) — porównanie z wczytaniem stanu, w którym nazwa już jest ogólna */
    const m = store.migrate(JSON.parse(JSON.stringify(s)));
    expect(m.exercises.filter(e => ids.includes(e.id)).map(e => e.name)).toEqual(KEYS.map(k => LIB_DISPLAY_NAME[k]));
    expect(JSON.stringify(store.migrate(JSON.parse(JSON.stringify(m))))).toBe(JSON.stringify(m)); /* idempotentnie */
    await store.flush(); await fresh(saved()); expect(snap(ids)).toEqual(a); /* restart */
    expect(JSON.stringify(m.workouts)).toBe(JSON.stringify(s.workouts)); expect(JSON.stringify(m.templates)).toBe(JSON.stringify(s.templates));
  });
  test('rekordy i sesje liczone tak samo przed i po zmianie nazwy (stan bez migracji nazwy = ta sama historia)', async () => {
    const { s, ids } = legacy();
    await fresh(JSON.parse(JSON.stringify(s))); const after = snap(ids);
    const s2 = JSON.parse(JSON.stringify(s)) as State; for (const [i, k] of KEYS.entries()) s2.exercises.find(e => e.id === ids[i])!.name = LIB_DISPLAY_NAME[k];
    await fresh(s2); expect(snap(ids)).toEqual(after);
  });
  test('przemianowane przez użytkownika i ćwiczenie własne o nazwie klucza — bez zmian', async () => {
    const { s, ids } = legacy(); s.exercises.find(e => e.id === ids[0])!.name = 'Mój rower';
    const own = { ...JSON.parse(JSON.stringify(s.exercises.find(e => e.id === ids[1])!)), id: 'own1', lib: undefined, libKey: undefined };
    delete own.lib; delete own.libKey; s.exercises.push(own);
    const m = store.migrate(JSON.parse(JSON.stringify(s)));
    expect(m.exercises.find(e => e.id === ids[0])!.name).toBe('Mój rower');
    expect(m.exercises.find(e => e.id === 'own1')!.name).toBe(KEYS[1]);
  });
});

describe('SEC2-01: etykiety sprzętu i możliwości w 26 językach bez nazw z listy (id bez zmian)', () => {
  test('przyrządy i możliwości', () => {
    expect(EQUIPMENT.some(e => e.id === 'bosu') && EQUIPMENT.some(e => e.id === 'suspension') && EQUIPMENT.some(e => e.id === 'ski_erg')).toBe(true);
    const bad: string[] = [];
    for (const l of LANGS) { applyLang(l);
      for (const e of EQUIPMENT) { const s = equipLabel(e); if (namesIn(s).length) bad.push(`${l} ${e.id}: ${s}`); }
      for (const c of Object.keys(CAP_LABEL)) { const s = capLabel(c); if (namesIn(s).length) bad.push(`${l} ${c}: ${s}`); } }
    expect(bad).toEqual([]);
  });
  test('nazwy ogólne (PL, EN) i tłumaczenie w innym języku', () => {
    const it = (id: string) => EQUIPMENT.find(e => e.id === id)!;
    const pe = (id: string) => { applyLang('pl'); const pl = equipLabel(it(id)); applyLang('en'); const en = equipLabel(it(id)); applyLang('de'); const de = equipLabel(it(id)); applyLang('pl'); return { pl, en, deDiffers: de !== pl && de !== en }; };
    expect(pe('suspension')).toEqual({ pl: 'Taśmy do podwieszania', en: 'Suspension trainer', deDiffers: true });
    expect(pe('bosu')).toEqual({ pl: 'Półkula balansowa / platforma balansowa', en: 'Balance dome / balance board', deDiffers: true });
    expect(pe('ski_erg')).toEqual({ pl: 'Ergometr narciarski', en: 'Ski ergometer', deDiffers: true });
  });
});
