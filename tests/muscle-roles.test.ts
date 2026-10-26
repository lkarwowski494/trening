/*
 * Role mięśni w ruchu (decyzja właściciela 26.10.2026): zdanie o pracy mięśnia przy każdej parze (ćwiczenie, region). Rodzaje (docs/20): logika (reguła pierwszej
 * pasującej, role główna/pomocnicza, wyjątki, lista po nazwie), niezmienniki (każda para katalogu, każde ćwiczenie na czas, szyja), dane (runtime bez źródeł, zdania w słowniku EN),
 * liczby (plik data/zrodla/role-miesni-liczby.json = przeliczenie na aktualnym katalogu; zapis: UPDATE_ROLE_COUNTS=1 npx jest tests/muscle-roles.test.ts).
 */
import * as fs from 'fs';
import * as path from 'path';
import { CATALOG, MUSCLE_LOAD, type MuscleRegion } from '@/lib/catalog.generated';
import { ROLE_DATA, matchRole, ctxOfKey, roleKindOf, muscleRoleRows } from '@/lib/muscleRoles';
import { MUSCLE_MIN_LOAD } from '@/lib/figures/v2/muscles';
import { exerciseMapSets } from '@/lib/musclemap';
import { REGION_MUSCLE, REGION_LABEL, metricFor, seedState } from '@/lib/seed';
import { EN } from '@/lib/i18n.en';
import { SOURCE_NAME_PATTERNS } from '@/lib/sources';
import { tIn } from '@/lib/i18n';

const root = path.join(__dirname, '..');
const KEYS = Object.keys(CATALOG);
const loadsOf = (k: string) => ((MUSCLE_LOAD as Record<string, Partial<Record<MuscleRegion, number>>>)[k] ?? {});
const hit = (k: string, region: string) => { const L = loadsOf(k); const w = (L as Record<string, number>)[region]; return matchRole(ctxOfKey(k, L)!, region, w); };
const text = (k: string, region: string) => { const h = hit(k, region); return h?.show ? h.text : null; };

/** Liczby par na aktualnym katalogu (to samo liczy test i plik data/zrodla/role-miesni-liczby.json). */
function counts() {
  let all = 0, lit = 0, main = 0, aux = 0, shown = 0, hidden = 0, none = 0, small = 0; const byFn: Record<string, number> = {};
  for (const k of KEYS) for (const [r, w] of Object.entries(loadsOf(k)) as [string, number][]) {
    all++; if (w < MUSCLE_MIN_LOAD) { small++; continue; }
    lit++; if (w >= 1) main++; else aux++;
    const h = matchRole(ctxOfKey(k, loadsOf(k))!, r, w);
    if (!h) none++; else if (h.show) { shown++; byFn[h.fn] = (byFn[h.fn] ?? 0) + 1; } else hidden++;
  }
  return { exercises: KEYS.length, pairs: all, highlighted: lit, main, aux, smallShare: small, withRoleShown: shown, withRoleHidden: hidden, withoutRole: none, byFunction: Object.fromEntries(Object.entries(byFn).sort()) };
}

describe('liczby par (przeliczone na aktualnym katalogu)', () => {
  test('plik data/zrodla/role-miesni-liczby.json zgodny z katalogiem; pokazane + niewyświetlane + bez roli = podświetlane', () => {
    const c = counts(); const file = path.join(root, 'data/zrodla/role-miesni-liczby.json');
    if (process.env.UPDATE_ROLE_COUNTS === '1') fs.writeFileSync(file, JSON.stringify(c, null, 1) + '\n');
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual(c);
    expect(c.withRoleShown + c.withRoleHidden + c.withoutRole).toBe(c.highlighted);
    expect(c.main + c.aux).toBe(c.highlighted); expect(c.highlighted + c.smallShare).toBe(c.pairs); expect(c.exercises).toBe(709);
  });
});

describe('roleKindOf: rola z udziału', () => {
  test.each([[1, 'main'], [0.5, 'aux'], [0.25, null], [0, null]] as const)('udział %s → %s', (w, r) => expect(roleKindOf(w)).toBe(r));
});

describe('reguła pierwszej pasującej — przykłady z każdej rodziny', () => {
  test.each([
    ['Bench Press (sztanga)', 'chest', 'Przyciąga ramię do przodu i do środka, gdy pchasz.'],
    ['Bench Press (sztanga)', 'triceps', 'Pomaga prostować łokieć, gdy pchasz.'],
    ['Bench Press (sztanga)', 'front_delt', 'Pomaga unosić ramię do przodu, gdy pchasz.'],
    ['Back Squat', 'quads', 'Prostuje kolano, gdy wstajesz.'],
    ['Back Squat', 'glutes', 'Pomaga prostować biodro, gdy wstajesz.'],
    ['Deadlift (sztanga)', 'hamstrings', 'Prostuje biodro, gdy się prostujesz.'],
    ['Deadlift (sztanga)', 'lower_back', 'Prostuje plecy i trzyma je prosto.'],
    ['Lat Pulldown', 'lats', 'Ściąga ramię w dół i do tyłu, do tułowia.'],
    ['Lat Pulldown', 'biceps', 'Pomaga zginać łokieć, gdy przyciągasz.'],
    ['Seated Cable Row', 'upper_back', 'Ściąga łopatki do siebie, gdy przyciągasz.'],
    ['Pec Deck', 'chest', 'Przyciąga ramię do przodu i do środka.'],
    ['Biceps Curl (hantle)', 'biceps', 'Zgina łokieć.'],
    ['Lying Leg Curl', 'hamstrings', 'Zgina kolano.'],
    ['Crunch', 'abs', 'Zgina tułów, przybliżając żebra do miednicy.'],
  ])('%s / %s', (k, region, want) => { expect(KEYS).toContain(k); expect(text(k, region)).toBe(want); });
  test('rola pomocnicza dostaje „Pomaga …”, główna — bezokolicznik w 3. osobie bez „Pomaga”', () => {
    for (const f of Object.values(ROLE_DATA.functions)) {
      for (const [v, s] of Object.entries(f.t.main ?? {})) expect([v, /^Pomaga /.test(s)]).toEqual([v, false]);
      for (const [v, s] of Object.entries(f.t.aux ?? {})) expect([v, /^Pomaga /.test(s)]).toEqual([v, true]);
    }
  });
  test('requireMain: dwugłowe pomocnicze w izolacji mają opis tylko przy głównych pośladkach; bez tego — brak', () => {
    const ctx = { key: 'x', pattern: 'isolation', metric: 'weight_reps', loads: { hamstrings: 0.5, glutes: 1 } as Partial<Record<MuscleRegion, number>> };
    expect(matchRole(ctx, 'hamstrings', 0.5)?.text).toBe('Pomaga prostować biodro.');
    expect(matchRole({ ...ctx, loads: { hamstrings: 0.5, quads: 1 } }, 'hamstrings', 0.5)).toBeNull();
  });
  test('v_push: klatka tylko w roli głównej (pomocnicza przy wyciskaniu nad głowę — brak opisu)', () => {
    const base = { key: 'x', pattern: 'v_push', metric: 'weight_reps', loads: {} };
    expect(matchRole(base, 'chest', 0.5)).toBeNull(); expect(matchRole(base, 'chest', 1)?.fn).toBe('chest.shoulder_flex_add');
  });
  test('małe udziały (0,25) i szyja nigdy nie dostają roli; rodziny mieszane (other, cardio, mobility, core_other) — brak', () => {
    const c = (pattern: string) => ({ key: 'x', pattern, metric: 'weight_reps', loads: {} });
    expect(matchRole(c('h_push'), 'chest', 0.25)).toBeNull(); expect(matchRole(c('isolation'), 'neck', 1)).toBeNull();
    for (const p of ['other', 'cardio', 'mobility', 'core_other']) for (const r of Object.keys(REGION_LABEL)) for (const w of [1, 0.5]) expect([p, r, matchRole(c(p), r, w)]).toEqual([p, r, null]);
  });
});

describe('wyjątki: lista po nazwie i ćwiczenia na czas', () => {
  test('noRole: Wall Sit (czworogłowe), L-Sit i Scissor Kick (brzuch) — brak opisu; nazwy istnieją w katalogu', () => {
    for (const x of ROLE_DATA.noRole) expect(KEYS).toContain(x.e);
    expect(hit('Wall Sit', 'quads')).toBeNull(); expect(hit('L-Sit', 'abs')).toBeNull(); expect(hit('Scissor Kick', 'abs')).toBeNull();
  });
  test('strażnik: żadne ćwiczenie na czas w rodzinie z fazą nie ma opisu (każdy klucz katalogu)', () => {
    const bad: string[] = [];
    for (const k of KEYS) if (metricFor(k) === 'time' && ROLE_DATA.phases.includes(CATALOG[k].pattern)) for (const [r, w] of Object.entries(loadsOf(k)) as [string, number][]) if (matchRole(ctxOfKey(k, loadsOf(k))!, r, w)) bad.push(`${k}/${r}`);
    expect(bad).toEqual([]);
  });
  test('lista po nazwie (szrugsy, nadgarstek): nazwy istnieją, region i rola zgodne z katalogiem, wynik wg listy; spoza listy — brak', () => {
    expect(ROLE_DATA.names.length).toBe(3);
    const want: Record<string, string> = { 'upper_back.scap_elevate': 'Unosi barki.', 'forearms.wrist_flex': 'Zgina nadgarstek.', 'forearms.wrist_ext': 'Prostuje nadgarstek.' };
    for (const n of ROLE_DATA.names) for (const k of n.x) {
      expect(KEYS).toContain(k);
      expect([k, loadsOf(k)[n.m as MuscleRegion]]).toEqual([k, 1]); /* lista dotyczy roli głównej w katalogu */
      expect([k, text(k, n.m)]).toEqual([k, want[n.f]]);
    }
    expect(text('Middle Back Shrug', 'upper_back')).toBeNull(); /* nazwa nie wskazuje uniesienia barków */
    for (const k of ['Dumbbell Lying Pronation', 'Dumbbell Lying Supination', 'Wrist Roller', 'Plate Pinch', 'Scapular Pull-Up', 'Lying Neck Flexion (talerz)']) expect([k, text(k, k.includes('Neck') ? 'neck' : k === 'Scapular Pull-Up' ? 'upper_back' : 'forearms')]).toEqual([k, null]);
  });
  test('każdy klucz nameRules/noRole istnieje w katalogu także w pełnych danych (zmiana nazwy ćwiczenia nie zostawia martwej listy)', () => {
    const full = JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/role-miesni.json'), 'utf8'));
    for (const r of full.nameRules.reguly) for (const k of r.exercises) expect(KEYS).toContain(k);
    for (const k of Object.keys(full.nameRules.reguly[0].pominiete)) expect(KEYS).toContain(k);
  });
});

describe('niezmienniki na całym katalogu', () => {
  test('każda para: zdanie kończy się kropką, nie zawiera zakazanych treści (porady medyczne, zalecenia, liczby), jest w słowniku EN', () => {
    const seen = new Set<string>();
    for (const k of KEYS) for (const [r, w] of Object.entries(loadsOf(k)) as [string, number][]) { const s = text(k, r); if (!s) continue; seen.add(s);
      expect([k, r, /\.$/.test(s), /\d|ból|kontuzj|zaleca|powinien|musisz/i.test(s)]).toEqual([k, r, true, false]); expect([s, EN[s]?.length > 0]).toEqual([s, true]); }
    expect(seen.size).toBeGreaterThan(30);
  });
  test('rola jest zgodna z regionem funkcji (funkcja należy do tego samego regionu co reguła)', () => {
    for (const r of ROLE_DATA.rules) expect([r.f, ROLE_DATA.functions[r.f].r]).toEqual([r.f, r.m]);
    for (const n of ROLE_DATA.names) expect([n.f, ROLE_DATA.functions[n.f].r]).toEqual([n.f, n.m]);
  });
  test('każdy region poza szyją ma co najmniej jedną wyświetlaną funkcję; szyja — żadnej', () => {
    const shown = new Set(Object.values(ROLE_DATA.functions).filter(f => Object.keys(f.t).length).map(f => f.r));
    for (const r of Object.keys(REGION_LABEL)) expect([r, shown.has(r)]).toEqual([r, r !== 'neck']);
    expect(Object.values(ROLE_DATA.functions).some(f => f.r === 'neck')).toBe(false);
  });
  test('niewyświetlane funkcje (uproszczenie, jedno źródło) nie mają tekstu i nie pokazują się nigdzie', () => {
    const hidden = Object.entries(ROLE_DATA.functions).filter(([, f]) => !Object.keys(f.t).length).map(([id]) => id).sort();
    expect(hidden).toEqual(['abs.antilordosis', 'adductors.hip_ext', 'upper_back.scap_down_retract']);
    expect(hit('Pull Up', 'upper_back')?.show).toBe(false); expect(text('Pull Up', 'upper_back')).toBeNull();
    expect(hit('Plank', 'abs')?.show).toBe(false);
  });
});

describe('muscleRoleRows: ćwiczenie z biblioteki', () => {
  const lib = (libKey: string) => ({ lib: true, libKey, muscles: [] as never[], secondaryMuscles: [] as never[] });
  test('wiersze = podświetlane regiony (≥ 0,5) w kolejności obciążenia; ćwiczenie własne i klucz spoza katalogu → pusto', () => {
    const e = seedState('pl').exercises.find(x => x.libKey === 'Bench Press (sztanga)')!;
    const rows = muscleRoleRows(e); expect(rows.map(r => [r.region, r.load])).toEqual([['chest', 1], ['triceps', 0.5], ['front_delt', 0.5]]);
    expect(rows.map(r => r.muscle)).toEqual(['klatka', 'triceps', 'barki']);
    expect(muscleRoleRows({ lib: false, libKey: undefined })).toEqual([]); expect(muscleRoleRows(lib('nie ma takiego'))).toEqual([]);
  });
  test('język: zdanie w języku aplikacji (EN) albo polskie, gdy brak przekładu; szyja ma wiersz bez zdania', () => {
    const e = seedState('pl').exercises.find(x => x.libKey === 'Biceps Curl (hantle)')!;
    expect(muscleRoleRows(e)[0].role).toBe('Zgina łokieć.'); expect(tIn('en', 'Zgina łokieć.')).toBe('Bends your elbow.');
    const neck = seedState('pl').exercises.find(x => x.libKey === 'Lying Neck Flexion (talerz)'); if (neck) expect(muscleRoleRows(neck).map(r => r.role)).toEqual([null]);
  });
  test('mapa ćwiczenia: partia = największy udział jej regionów; szyja poza mapą; kolory: główna silniejsza niż pomocnicza', () => {
    expect(exerciseMapSets([{ muscle: 'barki', load: 0.5 }, { muscle: 'barki', load: 1 }, { muscle: null, load: 1 }, { muscle: 'triceps', load: 0.5 }])).toEqual({ barki: 1, triceps: 0.5 });
    expect(REGION_MUSCLE.neck).toBeNull();
  });
});

describe('runtime = funkcja pełnych danych, bez nazw źródeł', () => {
  test('lib/muscleRoles/data.json: brak nazw źródeł, identyfikatorów S1…, adresów i cytatów', () => {
    const raw = fs.readFileSync(path.join(root, 'lib/muscleRoles/data.json'), 'utf8');
    expect(new RegExp(SOURCE_NAME_PATTERNS.join('|'), 'u').test(raw)).toBe(false);
    expect(/"S\d+"|https?:|OpenStax|Kenhub|TeachMe|zrodla|cytaty|pewnosc|uwaga/i.test(raw)).toBe(false);
    expect(Object.keys(JSON.parse(raw)).sort()).toEqual(['functions', 'names', 'noRegions', 'noRole', 'phases', 'rules']);
  });
  test('wszystkie zdania runtime mają angielskie brzmienie złożone z części badacza (rola + faza), bez duplikatów kluczy o różnym EN', () => {
    const full = JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/role-miesni.json'), 'utf8'));
    for (const [id, f] of Object.entries(ROLE_DATA.functions)) for (const [role, vs] of Object.entries(f.t)) for (const [v, pl] of Object.entries(vs)) {
      const ph = v === '_' ? '' : ` ${full.phases[v].en}`; expect([id, role, v, EN[pl]]).toEqual([id, role, v, `${full.functions[id].en[role]}${ph}.`]);
    }
  });
});
