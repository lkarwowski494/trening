/*
 * Decyzja właściciela 1A (03.11.2026 ~22:00 PL; plan: docs/przekazanie/notatki/linia-1-1/plan-recenzji-rodzin-v2.md): skrót recenzji rodziny v2 nie zmienia się od samego PODŁĄCZENIA innej rodziny —
 * status rodziny (families.ts: `status`), wpis ładowania (poseData.ts: LOAD) i wpis prezentacji innej rodziny (DATA_UI) nie są zmianą rysunku.
 * Od 09.11.2026 (wariant A; docs/18) gwarancja wynika z konstrukcji: skrót liczy się z WYNIKU rysunku rodziny (scripts/skrot-v2-wynik.mjs; rodzina „planned” liczona jak „ready”),
 * a nie z normalizacji tekstu plików (scripts/skrot-v2-norm.mjs usunięty). Scenariusze 1A sprawdzone w kopii drzewa (tests/helpers/skrot-v2-kopia.ts); to, co jest rysunkiem rodziny
 * (jej widoki, jej wpis DATA_UI, jej ćwiczenia izometryczne), nadal zmienia skrót TEJ rodziny — i tylko jej.
 * Parytet z eksportem strony: tests/strona-eksport-recenzja.test.ts. Rodzaje (docs/20): logika (skrót), niezmienniki (podłączenie ≠ zmiana rysunku), macierz (zmiana × rodzina),
 * regresja (zgodność wsteczna: tests/figures-v2-zgodnosc-wsteczna.test.ts), proces (L-080: tests/skrot-v2-wynik.test.ts, gałąź z wcześniejszymi zmianami względem main).
 */
import { KORZEN, kopia, kolejka, skroty, usunKopie, type Wynik, type Zmiana } from './helpers/skrot-v2-kopia';

const FAM = ['squat', 'pull_up', 'curl', 'olympic'];
const V2 = 'lib/figures/v2/';
const STATUS_LEG_ISOLATION: Zmiana = { plik: V2 + 'families.ts', z: "{ id: 'leg_isolation', status: 'planned'", na: "{ id: 'leg_isolation', status: 'ready'" };
const LOAD_LEG_ISOLATION: Zmiana = { plik: V2 + 'poseData.ts', z: "  pull_up: () => require('./poses/pull_up.json'),\n", na: "  pull_up: () => require('./poses/pull_up.json'),\n  leg_isolation: () => require('./poses/leg_isolation.json'),\n" };
const UI_LEG_ISOLATION: Zmiana = { plik: V2 + 'poseData.ts', z: 'export const DATA_UI: Record<string, DataUi> = {\n', na: "export const DATA_UI: Record<string, DataUi> = {\n  leg_isolation: { names: { first: 'Rozpiętka', second: 'Powrót' }, lowerFirst: false, joints: ['shAbd'] },\n" };
const SCEN: Record<string, Zmiana[]> = {
  statusInnej: [STATUS_LEG_ISOLATION],
  statusWlasnej: [{ plik: V2 + 'families.ts', z: "{ id: 'curl', status: 'ready'", na: "{ id: 'curl', status: 'planned'" }],
  load: [LOAD_LEG_ISOLATION],
  uiInnej: [{ plik: V2 + 'poseData.ts', z: "carry: { names: { first: 'Marsz'", na: "carry: { names: { first: 'Chód'" }, UI_LEG_ISOLATION],
  uiWlasny: [{ plik: V2 + 'poseData.ts', z: "pull_up: { names: { first: 'Podciąganie'", na: "pull_up: { names: { first: 'Podciągnięcie'" }],
  pelny: [STATUS_LEG_ISOLATION, LOAD_LEG_ISOLATION, UI_LEG_ISOLATION],
  widoki: [{ plik: V2 + 'families.ts', z: "label: 'Przysiad obustronny', views: ['side', 'front']", na: "label: 'Przysiad obustronny', views: ['side']" }],
  izometria: [{ plik: V2 + 'poseData.ts', z: "  'Dead Hang',\n", na: '' }],
};
let baza: Wynik; const wyn: Record<string, Wynik> = {};
beforeAll(async () => {
  await kolejka([async () => { baza = await skroty(KORZEN, FAM); }, ...Object.entries(SCEN).map(([id, zm]) => async () => { wyn[id] = await skroty(kopia(zm), FAM); })], 3);
}, 900_000);
afterAll(usunKopie);
const zmienione = (id: string): string[] => FAM.filter(f => wyn[id][f].skrot !== baza[f].skrot);

describe('1A: podłączenie innej rodziny nie zmienia skrótu recenzji (03.11.2026; od 09.11.2026 z wyniku rysunku)', () => {
  test('baza: cztery gotowe rodziny mają cztery różne skróty 12-znakowe', () => {
    expect(new Set(FAM.map(f => baza[f].skrot)).size).toBe(FAM.length);
    for (const f of FAM) expect(baza[f].skrot).toMatch(/^[0-9a-f]{12}$/);
  });
  test('status innej rodziny planned → ready (families.ts) nie zmienia skrótu żadnej rodziny', () => { expect(zmienione('statusInnej')).toEqual([]); });
  test('status własnej rodziny też nie jest rysunkiem (planned ↔ ready to podłączenie, nie zmiana rysunku): skrót curl liczony jak dla „ready”', () => { expect(zmienione('statusWlasnej')).toEqual([]); });
  test('wpis ładowania LOAD innej rodziny (poseData.ts) nie zmienia skrótu', () => { expect(zmienione('load')).toEqual([]); });
  test('wpis prezentacji DATA_UI innej rodziny (dodany albo zmieniony) nie zmienia skrótu; własny wpis zmienia tylko skrót tej rodziny', () => {
    expect(zmienione('uiInnej')).toEqual([]);
    expect(zmienione('uiWlasny')).toEqual(['pull_up']);
  });
  test('pełny scenariusz podłączenia (status + LOAD + DATA_UI nowej rodziny) = skróty bez zmian', () => { expect(zmienione('pelny')).toEqual([]); });
  test('to, co jest rysunkiem rodziny, zmienia skrót tej rodziny i tylko jej: jej widoki (families.ts) i izometria jej ćwiczenia (poseData.ts ISOMETRIC)', () => {
    expect(zmienione('widoki')).toEqual(['squat']);
    expect(zmienione('izometria')).toEqual(['pull_up']); /* Dead Hang (rodzina pull_up) przestaje być izometrią: rysunek się porusza */
  });
});
