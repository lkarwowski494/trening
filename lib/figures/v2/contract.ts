/*
 * Figury v2 — KONTRAKT DANYCH RODZINY (docs/50, rozdz. 10). Poza ćwiczenia jako dane (klatki kluczowe + błędy jako delty + sprzęt), które może wypełnić zewnętrzny
 * generator (pilotaż przez API), a nasze testy geometrii je sprawdzają. Ten moduł zawiera: typy kontraktu, JSON Schema (poseSchema), prosty walidator schematu,
 * interpreter klatek kluczowych (keyframeFrame: dane → ta sama Frame co rigi rodzin, więc działają kolidery, kształty i testy) oraz walidator semantyczny
 * (validatePose: geometria, zakres stawów, ciągłość, błędy jako modyfikacje pozy poprawnej). Przykład z gotowej rodziny: exampleFor (poza → dane).
 * Czysty moduł (bez React i aliasów): działa w aplikacji, testach i w scripts/figures/v2-validate.mjs.
 * Liczby (zakresy, tolerancje) w jednym miejscu: CONTRACT. Kąty i rozstawy bez źródła to uproszczenie ilustracyjne (nie pokazujemy ich użytkownikowi).
 */
import { add, dist, type V3 } from './math';
import { BODY, SIDES, jointAngles, type LegIn, type ArmIn, type PoseIn, type Side } from './skeleton';
import type { Frame } from './scene';
import { GEAR, GEAR_KINDS, BELL_MODES, CABLE_ATTACH, BENCH_KAT, BAND_MOUNT, LEVER_MODE, LEVER_POINT, SLED_HOLD, contactsFrom, gearFieldIssues, gearSetIssues, propsFrom, resolveBells, type Gear } from './gear';
import { checkFrame } from './colliders';
import { mkFrame } from './rigs/common';
import { FAMILY } from './families';
import type { Affects } from './errors';

export const CONTRACT = {
  id: 'figury-v2/poza@1',
  /** Liczba klatek kluczowych poprawnej pozy. */
  frames: { min: 2, max: 12 },
  /** Liczba klatek błędu (delty) i liczba błędów na ćwiczenie. */
  errorFrames: { min: 2, max: 8 }, errorsMax: 3,
  /** Siatka sprawdzeń geometrii (liczba przedziałów ruchu) i ciągłości (krok 1/48, maks. skok stawu w cm). */
  grid: 24, step: 48, maxJump: 6,
  /** Błąd musi być widoczny (≥ cm w którymkolwiek stawie albo ≥ stopni w którymkolwiek kącie) i niedeklarowane kąty mogą się różnić o ≤ stopni. */
  visibleCm: 3, visibleDeg: 8, undeclaredDeg: 4,
  /** Ruch musi istnieć: przemieszczenie dłoni, kolan lub miednicy między u = 0 a u = 1 (cm). */
  minMotionCm: 8,
  coord: 300, angle: 200, deltaCoord: 60, deltaAngle: 90,
  maxIssues: 12,
} as const;

export const MARKS = ['knees', 'heels', 'back', 'pelvis', 'bar'] as const;
export const AFFECTS: Affects[] = ['knee', 'ankle', 'hip', 'spine', 'kneeLat', 'heel', 'pelvis', 'bar', 'shoulder', 'elbow'];

/* ---------- typy danych ---------- */
export type LegData = { kostka: V3; podbicie?: number; rotacjaStopy?: number; odchylenieKolana?: number };
export type ArmData = { chwyt: V3; biegunLokcia?: V3; dolnaCzesc?: number };
export type KeyFrame = {
  u: number; miednica: V3; pochylenieTulowia: number; zgiecieKregoslupa?: number; pochylenieGlowy?: number;
  nogi: Record<Side, LegData>; rece: Record<Side, ArmData>;
};
export type DeltaFrame = {
  u: number; miednica?: V3; pochylenieTulowia?: number; zgiecieKregoslupa?: number; pochylenieGlowy?: number;
  nogi?: Partial<Record<Side, Partial<LegData>>>; rece?: Partial<Record<Side, { chwyt?: V3 }>>;
};
export type DataError = { cue: string; znacznik: typeof MARKS[number]; dotyczy: Affects[]; klatki: DeltaFrame[] };
export type PoseData = { kontrakt: string; rodzina: string; cwiczenie: string; sprzet: Gear[]; klatki: KeyFrame[]; bledy: DataError[] };

/* ---------- szablony rodzin (sprzęt i wyjątki zakresu) ---------- */
export type FamilyTemplate = {
  /** Zasady sprzętu rodziny (komunikaty dla generatora). */
  gear: string;
  /** Domyślny sprzęt (wzór do skopiowania). */
  defaultGear: Gear[];
  /** Wyjątki od zakresu stawów (uproszczenie ilustracyjne; powód obowiązkowy). */
  allow?: { elbow?: number; shSag?: number; shElev?: number; why: string };
  /** Opis ruchu do promptu (co ma pokazywać u = 0 i u = 1). */
  movement: string;
  check?: (g: Gear[]) => string[];
};
export const TEMPLATES: Record<string, FamilyTemplate> = {
  pull_up: {
    gear: 'Drążek poziomy ze słupkami (ćwiczenie z liną pionową zamiast drążka: wpis lina_pionowa, bez sztangi): dokładnie jedna sztanga bez talerzy i nieprzesuwająca się (talerze: false, podazaZaChwytem: false) na x = 0, y od 200 do 260 cm; słupek (slupek, x = 0, h = wysokość drążka + 5) i podłoga. Dłonie MUSZĄ leżeć na osi drążka: chwyt = [x drążka, y drążka, ±połowa rozstawu dłoni]. Jednorącz: ustaw na sztandze trzyma: "R" (albo "L") — wolna dłoń dostaje chwyt poza drążkiem (np. wzdłuż tułowia, ±15 cm od osi z = 0, nie przez drążek).',
    defaultGear: [{ rodzaj: 'podloga', x0: -120, x1: 120 }, { rodzaj: 'slupek', x: 0, h: 235 }, { rodzaj: 'sztanga', x: 0, y: 230, talerze: false, podazaZaChwytem: false, dlugosc: 128 }],
    allow: { shElev: 180, shSag: 200, why: 'zwis i podciąganie: ramiona nad głową względem tułowia, zgięcie barku powyżej średniego zakresu w płaszczyźnie strzałkowej (uproszczenie ilustracyjne)' },
    movement: 'u = 0: zwis na prostych rękach (łokcie wyprostowane), stopy nad podłogą. u = 1: górna pozycja — broda nad drążkiem, łokcie zgięte.',
    check: g => { const o: string[] = []; if (g.some(x => x.rodzaj === 'lina_pionowa')) return o; /* wspinanie po linie: zamiast drążka lina pionowa */ const bars = g.filter(x => x.rodzaj === 'sztanga');
      if (bars.length !== 1) o.push(`sprzęt: oczekiwano dokładnie jednej sztangi (drążka), jest ${bars.length}`);
      for (const b of bars) {
        if (b.talerze !== false) o.push('sprzęt: drążek nie ma talerzy — ustaw talerze: false');
        if (b.podazaZaChwytem !== false) o.push('sprzęt: drążek jest nieruchomy — ustaw podazaZaChwytem: false');
        if (b.y === undefined || b.y < 200 || b.y > 260) o.push(`sprzęt: wysokość drążka y = ${b.y} cm poza przedziałem 200–260 cm`);
        if (b.x === undefined || Math.abs(b.x) > 30) o.push(`sprzęt: drążek x = ${b.x} cm poza przedziałem −30…30 cm`);
      }
      return o; },
  },
};
const GENERIC: FamilyTemplate = { gear: 'Sprzęt wg rodzaju ćwiczenia: ' + GEAR.map(k => `${k} — ${GEAR_KINDS[k].opis}`).join('; ') + '.', defaultGear: [{ rodzaj: 'podloga', x0: -120, x1: 120 }], movement: 'u = 0: pozycja wyjściowa, u = 1: pozycja skrajna.' };
export const templateFor = (family: string): FamilyTemplate => TEMPLATES[family] ?? GENERIC;
export const knownFamily = (family: string): boolean => Object.prototype.hasOwnProperty.call(FAMILY, family);

/* ---------- JSON Schema (podzbiór obsługiwany przez structured output: bez $ref i oneOf) ---------- */
type Sch = Record<string, unknown>;
const num = (min: number, max: number, description: string): Sch => ({ type: 'number', minimum: min, maximum: max, description });
const vec = (description: string, lim: number = CONTRACT.coord): Sch => ({ type: 'array', items: { type: 'number', minimum: -lim, maximum: lim }, minItems: 3, maxItems: 3, description });
const obj = (properties: Record<string, Sch>, required: string[], description?: string): Sch => ({ type: 'object', properties, required, additionalProperties: false, ...(description ? { description } : {}) });
const legProps = (d: boolean): Record<string, Sch> => ({
  kostka: vec(d ? 'Zmiana położenia kostki [dx, dy, dz] w cm.' : 'Środek stawu skokowego [x, y, z] w cm (x = przód, y = góra, z = prawa strona osoby).', d ? CONTRACT.deltaCoord : CONTRACT.coord),
  podbicie: num(-90, 90, d ? 'Zmiana pochylenia stopy w stopniach.' : 'Pochylenie stopy w płaszczyźnie strzałkowej, stopnie (0 = płasko, dodatnie = palce wyżej niż pięta). Domyślnie 0.'),
  rotacjaStopy: num(-90, 90, d ? 'Zmiana rotacji zewnętrznej stopy w stopniach.' : 'Rotacja zewnętrzna stopy, stopnie. Domyślnie 10.'),
  odchylenieKolana: num(-90, 90, d ? 'Zmiana odchylenia kolana na zewnątrz (stopnie; ujemne = do środka).' : 'Odchylenie kolana na zewnątrz w poziomie, stopnie. Domyślnie 2 × rotacja stopy.'),
});
const keyProps = (d: boolean): Record<string, Sch> => ({
  miednica: vec(d ? 'Zmiana położenia środka miednicy [dx, dy, dz] w cm.' : 'Środek stawów biodrowych [x, y, z] w cm; z = 0 oznacza płaszczyznę symetrii osoby.', d ? CONTRACT.deltaCoord : CONTRACT.coord),
  pochylenieTulowia: num(-CONTRACT.angle, CONTRACT.angle, d ? 'Zmiana pochylenia tułowia w stopniach.' : 'Pochylenie tułowia od pionu w płaszczyźnie strzałkowej, stopnie: 0 = pion, do przodu dodatnie, 90 = poziomo głową do przodu, 180 = do góry nogami.'),
  zgiecieKregoslupa: num(-90, 90, d ? 'Zmiana zgięcia kręgosłupa w stopniach.' : 'Zgięcie kręgosłupa, stopnie: 0 = neutralny, dodatnie = zaokrąglony grzbiet. Domyślnie 0.'),
  pochylenieGlowy: num(-CONTRACT.angle, CONTRACT.angle, d ? 'Zmiana pochylenia głowy w stopniach.' : 'Pochylenie głowy od pionu (bezwzględne), stopnie, do przodu dodatnie. Domyślnie 40% pochylenia tułowia.'),
});
const side = (props: Record<string, Sch>, required: string[], d: boolean): Sch => obj({ R: obj(props, required), L: obj(props, required) }, d ? [] : ['R', 'L'], 'R = prawa strona osoby, L = lewa.');

/** JSON Schema odpowiedzi dla rodziny (opis pól po polsku; jednostki: cm, stopnie). */
export function poseSchema(family: string): Sch {
  const t = templateFor(family);
  const gear = obj({
    rodzaj: { type: 'string', enum: [...GEAR], description: 'sztanga (także drążek), slupek (pionowy), podloga, skrzynia (także stopień), hantel, kettlebell, talerz (trzymany), pilka_lekarska, smith (prowadnica suwnicy Smitha), landmine (gryf z osią obrotu przy podłodze), sciana, gryf_szesciokatny (trap bar), lancuchy, wyciag (kolumna z bloczkiem i linką), lawka (płaska, skośna, ujemna), guma (guma oporowa), dzwignia (maszyna: dźwignia obrotowa albo prowadnica), modlitewnik, zawieszenie (taśmy do podwieszania), lina_pionowa, sanie, poreczy, pilka_gimnastyczna (leży na podłodze), rolka (wałek piankowy). Hantel, kettlebell, talerz i piłka lekarska są trzymane w dłoniach i podążają za chwytem.' },
    x: num(-CONTRACT.coord, CONTRACT.coord, 'Położenie w przód (cm): środek sztangi, słupek, prowadnica Smitha albo oś obrotu landmine.'), y: num(0, CONTRACT.coord, 'Wysokość środka sztangi nad podłogą (cm); landmine: wysokość osi obrotu (domyślnie 5).'),
    h: num(0, CONTRACT.coord, 'Wysokość słupka (cm).'), x0: num(-CONTRACT.coord, CONTRACT.coord, 'Początek podłogi albo skrzyni (cm).'), x1: num(-CONTRACT.coord, CONTRACT.coord, 'Koniec podłogi albo skrzyni (cm).'),
    top: num(0, CONTRACT.coord, 'Wysokość górnej powierzchni skrzyni (cm); lawka: wysokość siedziska (domyślnie 43, ujemna 60).'), talerze: { type: 'boolean', description: 'Czy sztanga ma talerze (domyślnie true; drążek: false).' },
    trzyma: { type: 'string', enum: ['obie', 'R', 'L'], description: 'Która dłoń trzyma sztangę/drążek: obie (domyślnie), R albo L (ćwiczenie jednorącz; druga dłoń jest wolna i nie musi leżeć na osi — jej chwyt to dowolny punkt w zasięgu ramienia, bez przenikania sprzętu).' },
    podazaZaChwytem: { type: 'boolean', description: 'true: środek sztangi leży między dłońmi w każdej klatce (sztanga w ruchu); false: nieruchoma (x, y). Domyślnie false.' }, dlugosc: num(10, 300, 'Długość gryfu w cm (domyślnie 220; landmine: 200); wałek piankowy: długość walca (domyślnie 90).'),
    promien: num(3, 40, 'Promień w cm: główka hantla (domyślnie 6), dzwon kettlebell (9,5), talerz (22,5), piłka lekarska (11), piłka gimnastyczna (32,5), wałek piankowy (7,5).'),
    pionowo: { type: 'boolean', description: 'Tylko hantel: true = jeden hantel trzymany pionowo obiema dłońmi (goblet); domyślnie false.' },
    dzwon: { type: 'string', enum: [...BELL_MODES], description: 'Tylko kettlebell: kierunek dzwonu względem rączki: dol (domyślnie), wzdluz (w przedłużeniu przedramienia), tyl (za rączką, pozycja rack i nad głową).' },
    z: num(-CONTRACT.coord, CONTRACT.coord, 'Położenie w z (cm; domyślnie 0): oś obrotu landmine, oś obrotu albo początek prowadnicy dźwigni maszyny, środek piłki/wałka, kolumna wyciągu, zaczep taśm, lina pionowa; poręcze: połowa rozstawu.'),
    trzymanie: { type: 'string', enum: [...SLED_HOLD], description: 'Tylko sanie: slupki (dłonie na słupkach, domyślnie) albo lina (lina od przodu sań do dłoni).' },
    tryb: { type: 'string', enum: [...LEVER_MODE], description: 'Tylko dzwignia (maszyna): obrot (sztywne ramię wokół osi, domyślnie) albo prosta (prowadnica liniowa pod kątem kat).' },
    punkt: { type: 'string', enum: [...LEVER_POINT], description: 'Tylko dzwignia: punkt ciała, do którego mocuje się dźwignia: dlonie (domyślnie), kostki, miednica; trzyma wskazuje stronę (domyślnie R).' },
    mocowanie: { type: 'string', enum: [...BAND_MOUNT], description: 'Tylko guma: zaczep (stały punkt x, y, z), stopy (guma pod stopami), kostki (pętla między kostkami), dlonie (guma między dłońmi), sztanga (od końców gryfu do punktu pod/nad).' },
    kat: num(BENCH_KAT.min, BENCH_KAT.max, 'Kąt w stopniach od poziomu. Lawka: kąt oparcia (0 = płaska, dodatni = skos głową wyżej, ujemny = ławka ujemna). Dzwignia w trybie prosta: kąt prowadnicy (0 = do przodu +x, 90 = w górę). Modlitewnik: kąt podpórki od poziomu (30–80).'),
    siedzisko: num(20, 70, 'Tylko lawka: długość siedziska od zawiasu w stronę +x w cm (domyślnie 55; maszyny i ławki do siedzenia ok. 40–45).'),
    walki: { type: 'boolean', description: 'Tylko lawka: true = wałki na nogi (ławka ujemna).' },
    dwa: { type: 'boolean', description: 'Tylko wyciag: true = dwa wyciągi (kolumny i bloczki w z = ±|z|, po jednej lince na dłoń); domyślnie false = jeden wyciąg.' },
    chwyt: { type: 'string', enum: [...CABLE_ATTACH], description: 'Tylko wyciag: osprzęt linki: uchwyt (domyślnie), lina, drazek, kostka (opaska na kostkę; nogę wskazuje trzyma).' },
    przed: { type: 'boolean', description: 'Tylko sciana: true = ściana PRZED osobą (lita po stronie +x od x); domyślnie false = za osobą (lita po stronie −x).' },
    hak: num(0, CONTRACT.coord, 'Tylko slupek (stojak): wysokość haka na sztangę w cm (nie wyżej niż h).'),
    przesuniecie: vec('Tylko talerz i pilka_lekarska: położenie środka sprzętu względem środka między dłońmi [dx, dy, dz] w cm (domyślnie [0,0,0]; jedna dłoń: talerz [0, −(promień−1), 0], piłka [0, promień−1, 0]).', 40),
  }, ['rodzaj']);
  const key = obj({
    u: num(0, 1, 'Pozycja ruchu: 0 = wyjściowa, 1 = skrajna; klatki rosnąco, pierwsza u = 0, ostatnia u = 1.'), ...keyProps(false),
    nogi: side(legProps(false), ['kostka'], false),
    rece: side({ chwyt: vec('Środek chwytu dłoni [x, y, z] w cm (dla sztangi: na jej osi).'), biegunLokcia: vec('Kierunek zgięcia łokcia [x, y, z] (wektor kierunku, nie cm). Domyślnie w dół i do tyłu.', 10), dolnaCzesc: num(10, 40, 'Odległość łokieć–środek chwytu w cm (domyślnie 33).') }, ['chwyt'], false),
  }, ['u', 'miednica', 'pochylenieTulowia', 'nogi', 'rece']);
  const dframe = obj({ u: num(0, 1, 'Pozycja ruchu, na której delta ma pełną wartość (między klatkami interpolacja liniowa); pierwsza u = 0 z deltą zerową.'), ...keyProps(true),
    nogi: side(legProps(true), [], true), rece: side({ chwyt: vec('Zmiana położenia chwytu [dx, dy, dz] w cm.', CONTRACT.deltaCoord) }, [], true) }, ['u']);
  const err = obj({
    cue: { type: 'string', maxLength: 40, description: 'Identyfikator wskazówki „częsty błąd” z listy podanej dla ćwiczenia (tekst błędu pochodzi z naszego słownika, nie z odpowiedzi).' },
    znacznik: { type: 'string', enum: [...MARKS], description: 'Gdzie rysujemy znacznik ✕: kolana, pięty, plecy, miednica albo sztanga.' },
    dotyczy: { type: 'array', items: { type: 'string', enum: AFFECTS }, minItems: 1, maxItems: AFFECTS.length, description: 'Wielkości, które błąd zmienia (reszta kątów ma zostać jak w pozie poprawnej, ±' + CONTRACT.undeclaredDeg + '°): knee, ankle, hip (kąty), spine, kneeLat, heel, pelvis, bar, shoulder, elbow.' },
    klatki: { type: 'array', items: dframe, minItems: CONTRACT.errorFrames.min, maxItems: CONTRACT.errorFrames.max, description: 'Delty dodawane do pozy poprawnej.' },
  }, ['cue', 'znacznik', 'dotyczy', 'klatki'], 'Błąd = modyfikacja pozy poprawnej (delty), nie osobna poza.');
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema', title: `Poza ćwiczenia — rodzina ${family}`, description: t.movement,
    ...obj({
      kontrakt: { type: 'string', enum: [CONTRACT.id] }, rodzina: { type: 'string', maxLength: 40 }, cwiczenie: { type: 'string', maxLength: 120 },
      sprzet: { type: 'array', items: gear, minItems: 1, maxItems: 8, description: t.gear },
      klatki: { type: 'array', items: key, minItems: CONTRACT.frames.min, maxItems: CONTRACT.frames.max, description: 'Klatki kluczowe poprawnej pozy; między nimi interpolacja liniowa, więc dodaj klatki pośrednie, gdy ruch jest zakrzywiony.' },
      bledy: { type: 'array', items: err, maxItems: CONTRACT.errorsMax },
    }, ['kontrakt', 'rodzina', 'cwiczenie', 'sprzet', 'klatki', 'bledy']),
  };
}

/* ---------- walidator schematu (podzbiór: type, enum, required, properties, additionalProperties, items, min/max, pattern, długość) ---------- */
export type ContractIssue = { kod: string; szczegol: string };
export function checkSchema(value: unknown, schema: Sch, path = '$', out: ContractIssue[] = []): ContractIssue[] {
  const s = schema as { type?: string; enum?: unknown[]; required?: string[]; properties?: Record<string, Sch>; additionalProperties?: boolean; items?: Sch; minItems?: number; maxItems?: number; minimum?: number; maximum?: number; maxLength?: number };
  const bad = (m: string): void => { out.push({ kod: 'schemat', szczegol: `${path}: ${m}` }); };
  const kind = value === null ? 'null' : Array.isArray(value) ? 'tablica' : typeof value;
  if (s.type === 'object') {
    if (kind !== 'object') { bad(`oczekiwano obiektu, jest ${kind}`); return out; }
    const o = value as Record<string, unknown>;
    for (const r of s.required ?? []) if (!(r in o) || o[r] === undefined) bad(`brak wymaganego pola „${r}”`);
    for (const k of Object.keys(o)) { if (s.properties && k in s.properties) checkSchema(o[k], s.properties[k], `${path}.${k}`, out); else if (s.additionalProperties === false) bad(`nieznane pole „${k}” (dozwolone: ${Object.keys(s.properties ?? {}).join(', ')})`); }
  } else if (s.type === 'array') {
    if (kind !== 'tablica') { bad(`oczekiwano tablicy, jest ${kind}`); return out; }
    const a = value as unknown[];
    if (s.minItems !== undefined && a.length < s.minItems) bad(`za mało elementów: ${a.length} < ${s.minItems}`);
    if (s.maxItems !== undefined && a.length > s.maxItems) bad(`za dużo elementów: ${a.length} > ${s.maxItems}`);
    if (s.items) a.forEach((x, i) => checkSchema(x, s.items as Sch, `${path}[${i}]`, out));
  } else if (s.type === 'number') {
    if (typeof value !== 'number' || !Number.isFinite(value)) { bad(`oczekiwano liczby, jest ${kind}`); return out; }
    if (s.minimum !== undefined && value < s.minimum) bad(`${value} < minimum ${s.minimum}`);
    if (s.maximum !== undefined && value > s.maximum) bad(`${value} > maksimum ${s.maximum}`);
  } else if (s.type === 'string') {
    if (typeof value !== 'string') { bad(`oczekiwano tekstu, jest ${kind}`); return out; }
    if (s.maxLength !== undefined && value.length > s.maxLength) bad(`tekst dłuższy niż ${s.maxLength} znaków`);
    if (s.enum && !s.enum.includes(value)) bad(`wartość „${value}” spoza listy: ${s.enum.join(', ')}`);
  } else if (s.type === 'boolean') { if (typeof value !== 'boolean') bad(`oczekiwano true/false, jest ${kind}`); }
  return out;
}

/* ---------- interpreter klatek kluczowych ---------- */
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const opt = (a: number | undefined, b: number | undefined, t: number): number | undefined => a === undefined ? b : b === undefined ? a : lerp(a, b, t);
const opt3 = (a: V3 | undefined, b: V3 | undefined, t: number): V3 | undefined => a === undefined ? b : b === undefined ? a : lerp3(a, b, t);
/** Indeks segmentu i ułamek t dla pozycji u w posortowanej liście klatek (u poza zakresem → brzeg). */
function segment(us: number[], u: number): [number, number] {
  if (u <= us[0]) return [0, 0]; if (u >= us[us.length - 1]) return [us.length - 1, 0];
  let i = 0; while (i < us.length - 2 && u >= us[i + 1]) i++;
  const span = us[i + 1] - us[i]; return [i, span > 0 ? (u - us[i]) / span : 0];
}
/** Klatka kluczowa w pozycji u (interpolacja liniowa wszystkich pól). */
export function poseAt(frames: KeyFrame[], u: number): KeyFrame {
  const [i, t] = segment(frames.map(f => f.u), u); const a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
  const leg = (s: Side): LegData => ({ kostka: lerp3(a.nogi[s].kostka, b.nogi[s].kostka, t), podbicie: opt(a.nogi[s].podbicie, b.nogi[s].podbicie, t), rotacjaStopy: opt(a.nogi[s].rotacjaStopy, b.nogi[s].rotacjaStopy, t), odchylenieKolana: opt(a.nogi[s].odchylenieKolana, b.nogi[s].odchylenieKolana, t) });
  const arm = (s: Side): ArmData => ({ chwyt: lerp3(a.rece[s].chwyt, b.rece[s].chwyt, t), biegunLokcia: opt3(a.rece[s].biegunLokcia, b.rece[s].biegunLokcia, t), dolnaCzesc: opt(a.rece[s].dolnaCzesc, b.rece[s].dolnaCzesc, t) });
  return { u, miednica: lerp3(a.miednica, b.miednica, t), pochylenieTulowia: lerp(a.pochylenieTulowia, b.pochylenieTulowia, t), zgiecieKregoslupa: opt(a.zgiecieKregoslupa, b.zgiecieKregoslupa, t), pochylenieGlowy: opt(a.pochylenieGlowy, b.pochylenieGlowy, t), nogi: { R: leg('R'), L: leg('L') }, rece: { R: arm('R'), L: arm('L') } };
}
const ZERO: V3 = [0, 0, 0];
/** Delta błędu w pozycji u (interpolacja liniowa między klatkami delt; poza zakresem brzeg). */
export function deltaAt(frames: DeltaFrame[], u: number): DeltaFrame {
  const [i, t] = segment(frames.map(f => f.u), u); const a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
  const v = (x: V3 | undefined, y: V3 | undefined): V3 | undefined => x || y ? lerp3(x ?? ZERO, y ?? ZERO, t) : undefined;
  const n = (x: number | undefined, y: number | undefined): number | undefined => x !== undefined || y !== undefined ? lerp(x ?? 0, y ?? 0, t) : undefined;
  const leg = (s: Side): Partial<LegData> => ({ kostka: v(a.nogi?.[s]?.kostka, b.nogi?.[s]?.kostka), podbicie: n(a.nogi?.[s]?.podbicie, b.nogi?.[s]?.podbicie), rotacjaStopy: n(a.nogi?.[s]?.rotacjaStopy, b.nogi?.[s]?.rotacjaStopy), odchylenieKolana: n(a.nogi?.[s]?.odchylenieKolana, b.nogi?.[s]?.odchylenieKolana) });
  return { u, miednica: v(a.miednica, b.miednica), pochylenieTulowia: n(a.pochylenieTulowia, b.pochylenieTulowia), zgiecieKregoslupa: n(a.zgiecieKregoslupa, b.zgiecieKregoslupa), pochylenieGlowy: n(a.pochylenieGlowy, b.pochylenieGlowy),
    nogi: { R: leg('R'), L: leg('L') }, rece: { R: { chwyt: v(a.rece?.R?.chwyt, b.rece?.R?.chwyt) }, L: { chwyt: v(a.rece?.L?.chwyt, b.rece?.L?.chwyt) } } };
}
const plus = (a: V3, d: V3 | undefined): V3 => d ? add(a, d) : a;
const plusN = (a: number | undefined, d: number | undefined, base = 0): number | undefined => d === undefined ? a : (a ?? base) + d;
/** Poza z nałożoną deltą. */
export function applyDelta(k: KeyFrame, d: DeltaFrame): KeyFrame {
  const leg = (s: Side): LegData => { const l = k.nogi[s], x = d.nogi?.[s]; const toe = l.rotacjaStopy ?? 10; return { kostka: plus(l.kostka, x?.kostka), podbicie: plusN(l.podbicie, x?.podbicie), rotacjaStopy: plusN(l.rotacjaStopy, x?.rotacjaStopy, 10), odchylenieKolana: plusN(l.odchylenieKolana, x?.odchylenieKolana, toe * 2) }; };
  const arm = (s: Side): ArmData => ({ ...k.rece[s], chwyt: plus(k.rece[s].chwyt, d.rece?.[s]?.chwyt) });
  return { ...k, miednica: plus(k.miednica, d.miednica), pochylenieTulowia: k.pochylenieTulowia + (d.pochylenieTulowia ?? 0), zgiecieKregoslupa: plusN(k.zgiecieKregoslupa, d.zgiecieKregoslupa), pochylenieGlowy: d.pochylenieGlowy === undefined ? k.pochylenieGlowy : (k.pochylenieGlowy ?? Math.max(-20, Math.min(60, k.pochylenieTulowia * 0.4))) + d.pochylenieGlowy, nogi: { R: leg('R'), L: leg('L') }, rece: { R: arm('R'), L: arm('L') } };
}
export function toPoseIn(k: KeyFrame): PoseIn {
  const leg = (s: Side): LegIn => { const l = k.nogi[s]; return { ankle: l.kostka, footPitch: l.podbicie, toeOut: l.rotacjaStopy, kneeOut: l.odchylenieKolana }; };
  const arm = (s: Side): ArmIn => { const a = k.rece[s]; return { grip: a.chwyt, elbowPole: a.biegunLokcia, lower: a.dolnaCzesc }; };
  return { pelvis: k.miednica, trunkPitch: k.pochylenieTulowia, spineBend: k.zgiecieKregoslupa, headPitch: k.pochylenieGlowy, legs: { R: leg('R'), L: leg('L') }, arms: { R: arm('R'), L: arm('L') } };
}
/** Klatka danych rodziny w pozycji u; error = indeks błędu (poza poprawna + delta). Zwraca tę samą Frame co rigi (kolidery, kształty). */
export function keyframeFrame(d: PoseData, u: number, error?: number): Frame {
  let k = poseAt(d.klatki, u); if (error !== undefined && d.bledy[error]) k = applyDelta(k, deltaAt(d.bledy[error].klatki, u));
  const pose = toPoseIn(k); const grips = { R: pose.arms.R.grip, L: pose.arms.L.grip };
  const props = propsFrom(d.sprzet, grips, { R: pose.legs.R.ankle, L: pose.legs.L.ankle }, pose.pelvis); const bar = props.find(p => p.k === 'barbell');
  const info: Record<string, V3> = {}; if (bar && bar.k === 'barbell') info.load = bar.c;
  return resolveBells(mkFrame(pose, props, info, contactsFrom(d.sprzet)));
}

/* ---------- walidator semantyczny ---------- */
export type RomData = { side: Record<'hip' | 'knee' | 'ankle' | 'el' | 'sh', { min: number; max: number }>; front: { abd: { min: number; max: number } } };
export type ValidateCtx = { family: string; exercise: string; /** id wskazówek „częsty błąd” tego ćwiczenia (cue-sets.json albo lib/cues). */ errorCues: string[]; rom: RomData };

const f1 = (x: number): string => x.toFixed(1);
const f2 = (x: number): string => x.toFixed(2);
class Agg {
  private m = new Map<string, { text: (u: string) => string; us: number[] }>();
  add(key: string, u: number, text: (u: string) => string): void { const e = this.m.get(key); if (e) e.us.push(u); else this.m.set(key, { text, us: [u] }); }
  flush(kod: string, out: ContractIssue[]): void { for (const e of this.m.values()) out.push({ kod, szczegol: e.text(f2(e.us[0])) + (e.us.length > 1 ? ` (i w ${e.us.length - 1} innych fazach, ostatnia u=${f2(e.us[e.us.length - 1])})` : '') }); }
}
const ANG_OF: Record<string, Affects[]> = { hip: ['hip'], knee: ['knee'], ankle: ['ankle'], elbow: ['elbow'], shElev: ['shoulder'] };
const pts = (f: Frame): V3[] => [f.sk.pelvis, f.sk.head, f.sk.shoulderC, f.sk.spineMid, ...SIDES.flatMap(s => [f.sk.legs[s].knee, f.sk.legs[s].ankle, f.sk.legs[s].heel, f.sk.legs[s].toe, f.sk.arms[s].elbow, f.sk.arms[s].grip]), ...(f.info.load ? [f.info.load] : [])];
const gridU = (d: PoseData, extra: number[] = []): number[] => [...new Set([...Array.from({ length: CONTRACT.grid + 1 }, (_, i) => i / CONTRACT.grid), ...d.klatki.map(k => k.u), ...extra])].sort((a, b) => a - b);
const deltaMag = (d: DeltaFrame): number => Math.max(0, ...[d.miednica, d.nogi?.R?.kostka, d.nogi?.L?.kostka, d.rece?.R?.chwyt, d.rece?.L?.chwyt].map(v => v ? Math.max(...v.map(Math.abs)) : 0), ...[d.pochylenieTulowia, d.zgiecieKregoslupa, d.pochylenieGlowy, d.nogi?.R?.podbicie, d.nogi?.R?.rotacjaStopy, d.nogi?.R?.odchylenieKolana, d.nogi?.L?.podbicie, d.nogi?.L?.rotacjaStopy, d.nogi?.L?.odchylenieKolana].map(v => Math.abs(v ?? 0)));

function geometry(d: PoseData, error: number | undefined, label: string, out: ContractIssue[]): void {
  const agg = new Agg(); const grip = new Agg();
  for (const u of gridU(d, error === undefined ? [] : d.bledy[error].klatki.map(k => k.u))) {
    let f: Frame; try { f = keyframeFrame(d, u, error); } catch (e) { out.push({ kod: 'geometria', szczegol: `${label}u=${f2(u)}: nie da się policzyć pozy (${(e as Error).message})` }); return; }
    for (const i of checkFrame(f)) {
      const key = i.code + i.detail.replace(/[-\d.]+/g, '#');
      if (i.code === 'grip') grip.add(key, u, uu => `${label}${i.detail.replace(/^gryf\/R/, 'dłoń prawa wobec drążka/sztangi').replace(/^gryf\/L/, 'dłoń lewa wobec drążka/sztangi')} w fazie u=${uu} — ${i.hint ?? 'chwyt musi leżeć na osi sztangi (x, y sztangi, z = ±połowa rozstawu dłoni)'}`);
      else agg.add(key, u, uu => `${label}${i.detail} w fazie u=${uu}`);
    }
  }
  grip.flush('chwyt', out); agg.flush('geometria', out);
}

/** Pełna walidacja danych rodziny: schemat, spójność, geometria (kości, zasięg, podłoga, przenikanie, chwyt), zakres stawów, ciągłość, ruch i błędy jako delty. Komunikaty konkretne (cel: poprawka przez generator). */
export function validatePose(data: unknown, ctx: ValidateCtx): ContractIssue[] {
  const out: ContractIssue[] = [];
  if (!knownFamily(ctx.family)) return [{ kod: 'rodzina', szczegol: `nieznana rodzina „${ctx.family}”` }];
  const sch = checkSchema(data, poseSchema(ctx.family)); if (sch.length) return sch.slice(0, CONTRACT.maxIssues);
  const d = data as PoseData;
  if (d.rodzina !== ctx.family) out.push({ kod: 'kontrakt', szczegol: `rodzina „${d.rodzina}” zamiast „${ctx.family}”` });
  if (d.cwiczenie !== ctx.exercise) out.push({ kod: 'kontrakt', szczegol: `cwiczenie „${d.cwiczenie}” zamiast „${ctx.exercise}”` });
  const us = d.klatki.map(k => k.u);
  if (us[0] !== 0) out.push({ kod: 'klatki-u', szczegol: `pierwsza klatka ma u = ${us[0]}, powinna mieć u = 0` });
  if (us[us.length - 1] !== 1) out.push({ kod: 'klatki-u', szczegol: `ostatnia klatka ma u = ${us[us.length - 1]}, powinna mieć u = 1` });
  for (let i = 1; i < us.length; i++) if (us[i] <= us[i - 1]) out.push({ kod: 'klatki-u', szczegol: `klatki muszą mieć rosnące u: klatki[${i}].u = ${us[i]} ≤ klatki[${i - 1}].u = ${us[i - 1]}` });
  out.push(...[...d.sprzet.flatMap(gearFieldIssues), ...gearSetIssues(d.sprzet)].map(szczegol => ({ kod: 'sprzet', szczegol })));
  out.push(...(templateFor(ctx.family).check?.(d.sprzet) ?? []).map(szczegol => ({ kod: 'sprzet', szczegol })));
  if (out.length) return out.slice(0, CONTRACT.maxIssues);

  geometry(d, undefined, '', out);
  /* zakres stawów */
  const r = ctx.rom; const al = templateFor(ctx.family).allow ?? { why: '' }; const rg = new Agg();
  for (const u of gridU(d)) { const f = keyframeFrame(d, u); for (const s of SIDES) {
    const a = jointAngles(f.sk, s);
    const chk = (n: string, v: number, lo: number, hi: number): void => { if (v < lo - 0.5 || v > hi + 0.5) rg.add(`${n}${s}`, u, uu => `staw ${n} ${s} = ${f1(v)}° poza zakresem ruchu [${lo}°, ${hi}°] w fazie u=${uu} — zmień położenie kostki, miednicy lub chwytu`); };
    chk('hip', a.hip, r.side.hip.min, r.side.hip.max); chk('knee', a.knee, r.side.knee.min, r.side.knee.max); chk('ankle', a.ankle, r.side.ankle.min, r.side.ankle.max);
    chk('elbow', a.elbow, r.side.el.min, al.elbow ?? r.side.el.max); chk('shElev', a.shElev, 0, al.shElev ?? r.front.abd.max);
    if (a.shAbd < 30) chk('shSag', a.shSag, r.side.sh.min, al.shSag ?? r.side.sh.max);
  } }
  rg.flush('zakres', out);
  /* ciągłość */
  const cont = new Agg(); let prev = pts(keyframeFrame(d, 0));
  for (let i = 1; i <= CONTRACT.step; i++) { const cur = pts(keyframeFrame(d, i / CONTRACT.step)); cur.forEach((p, j) => { const dd = dist(p, prev[j]); if (dd > CONTRACT.maxJump) cont.add(`pt${j}`, i / CONTRACT.step, uu => `skok o ${f1(dd)} cm (limit ${CONTRACT.maxJump} cm na 1/${CONTRACT.step} ruchu) w fazie u=${uu} — dodaj klatki pośrednie albo zmniejsz zmianę między sąsiednimi klatkami`); }); prev = cur; }
  cont.flush('ciaglosc', out);
  /* ruch istnieje */
  const a = pts(keyframeFrame(d, 0)), b = pts(keyframeFrame(d, 1)); const moved = Math.max(...a.map((p, i) => dist(p, b[i])));
  if (moved < CONTRACT.minMotionCm) out.push({ kod: 'ruch', szczegol: `poza u = 1 prawie nie różni się od u = 0 (największe przemieszczenie punktu ${f1(moved)} cm, wymagane ≥ ${CONTRACT.minMotionCm} cm)` });

  /* błędy jako delty */
  const seen = new Set<string>();
  d.bledy.forEach((e, j) => {
    const L = `bledy[${j}] „${e.cue}”: `;
    if (!ctx.errorCues.includes(e.cue)) out.push({ kod: 'blad-cue', szczegol: `${L}to nie jest błąd tego ćwiczenia; dozwolone identyfikatory: ${ctx.errorCues.length ? ctx.errorCues.join(', ') : '(brak — zostaw bledy puste)'}` });
    if (seen.has(e.cue)) out.push({ kod: 'blad-cue', szczegol: `${L}ten błąd występuje dwa razy` }); seen.add(e.cue);
    const eu = e.klatki.map(k => k.u);
    if (eu[0] !== 0) out.push({ kod: 'blad-u', szczegol: `${L}pierwsza klatka błędu ma u = ${eu[0]}, powinna mieć u = 0` });
    if (eu[eu.length - 1] !== 1) out.push({ kod: 'blad-u', szczegol: `${L}ostatnia klatka błędu ma u = ${eu[eu.length - 1]}, powinna mieć u = 1` });
    for (let i = 1; i < eu.length; i++) if (eu[i] <= eu[i - 1]) out.push({ kod: 'blad-u', szczegol: `${L}klatki błędu muszą mieć rosnące u (klatki[${i}].u = ${eu[i]})` });
    if (eu[0] === 0 && deltaMag(e.klatki[0]) > 1e-9) out.push({ kod: 'blad-start', szczegol: `${L}na początku ruchu (u = 0) poza błędu ma być równa pozie poprawnej — delta w pierwszej klatce musi być zerowa` });
    if (out.some(x => x.kod.startsWith('blad-u'))) return;
    geometry(d, j, L, out);
    const decl = new Set(e.dotyczy); const an = new Agg(); let vis = 0, visDeg = 0;
    for (const u of gridU(d, eu)) {
      const f0 = keyframeFrame(d, u), f1_ = keyframeFrame(d, u, j);
      for (const s of SIDES) { const x = jointAngles(f0.sk, s), y = jointAngles(f1_.sk, s);
        for (const [k, need] of Object.entries(ANG_OF)) { const diff = Math.abs((x as Record<string, number>)[k] - (y as Record<string, number>)[k]); visDeg = Math.max(visDeg, diff);
          if (diff > CONTRACT.undeclaredDeg && !need.some(n => decl.has(n))) an.add(k, u, uu => `${L}kąt ${k} zmienia się o ${f1(diff)}° w fazie u=${uu}, a „dotyczy” tego nie deklaruje (dodaj ${need.join('/')} do „dotyczy” albo usuń tę zmianę z delty)`); } }
      const p0 = pts(f0), p1 = pts(f1_); vis = Math.max(vis, ...p0.map((p, i) => dist(p, p1[i])));
    }
    an.flush('blad-niedeklarowane', out);
    if (vis < CONTRACT.visibleCm && visDeg < CONTRACT.visibleDeg) out.push({ kod: 'blad-niewidoczny', szczegol: `${L}poza błędu prawie nie różni się od poprawnej (największa różnica punktu ${f1(vis)} cm, kąta ${f1(visDeg)}°; wymagane ≥ ${CONTRACT.visibleCm} cm albo ≥ ${CONTRACT.visibleDeg}°)` });
  });
  return out.slice(0, CONTRACT.maxIssues);
}

/** Tekst kontraktu do promptu generatora (co oznaczają pola, jednostki, układ współrzędnych, ograniczenia geometrii). */
export function describeContract(family: string): string {
  const t = templateFor(family);
  return [
    `Kontrakt ${CONTRACT.id}. Zwracasz JEDEN obiekt JSON zgodny ze schematem: kontrakt, rodzina, cwiczenie, sprzet[], klatki[] (poza poprawna), bledy[] (zmiany pozy poprawnej).`,
    'Układ współrzędnych (cm): x = do przodu (w stronę twarzy), y = w górę (podłoga y = 0), z = prawa strona osoby (z = 0 to płaszczyzna symetrii). Kąty w stopniach.',
    `Szkielet (stałe długości kości, cm): udo ${BODY.thigh}, podudzie ${BODY.shank}, wysokość kostki ${BODY.ankleH}, tułów (miednica do barków) ${BODY.trunk}, ramię ${BODY.uarm}, przedramię ${BODY.farm}, dłoń ${BODY.hand} (łokieć do środka chwytu ${BODY.farm + BODY.hand}); biodra ±${BODY.hipHalf} cm od płaszczyzny symetrii (z), barki ±${BODY.shHalf} cm. Ramię wyprostowane sięga 64 cm od barku do chwytu.`,
    'Podajesz tylko: miednicę (środek stawów biodrowych), pochylenie tułowia, zgięcie kręgosłupa i głowy, kostki obu nóg i środki chwytu obu dłoni. Kolana i łokcie liczy nasz IK (kierunek zgięcia: odchylenieKolana, biegunLokcia). Barki leżą na tułowiu: tułów od miednicy do barków ma stałą długość, więc chwyt musi być w zasięgu ramienia od barku (≤ 64 cm), a kostka w zasięgu nogi od biodra (≤ 83 cm).',
    `Ruch: ${t.movement} Między klatkami kluczowymi interpolacja jest liniowa: dla ruchów zakrzywionych dodaj klatki pośrednie (maks. ${CONTRACT.frames.max}); żaden staw nie może przeskakiwać o więcej niż ${CONTRACT.maxJump} cm na 1/${CONTRACT.step} ruchu.`,
    `Sprzęt: ${t.gear} Stopy opierają się o podłogę (podeszwa nie niżej niż y = 0), ciało nie przenika sprzętu, dłonie leżą na chwycie sztangi (tolerancja 0,6 cm). Sprzęt trzymany w dłoniach (hantel, kettlebell, talerz, pilka_lekarska) podąża za chwytem: nie podajesz jego położenia, tylko rodzaj i pola; talerz i piłka wymagają dłoni na obręczy/powierzchni (tolerancja 3 cm).`,
    `Błędy (bledy[]): każdy to MODYFIKACJA pozy poprawnej: klatki[] z deltami (dodawanymi do pozy poprawnej, interpolacja liniowa), pierwsza u = 0 z deltą zerową, ostatnia u = 1. cue = identyfikator wskazówki błędu z listy podanej dla ćwiczenia (tekstu nie piszesz). dotyczy = wielkości, które błąd zmienia; pozostałe kąty (biodro, kolano, kostka, łokieć, bark) mogą się różnić od pozy poprawnej najwyżej o ${CONTRACT.undeclaredDeg}°. Błąd musi być widoczny (≥ ${CONTRACT.visibleCm} cm lub ≥ ${CONTRACT.visibleDeg}°). Poza błędu też nie przenika sprzętu ani podłogi. Najwyżej ${CONTRACT.errorsMax} błędy; gdy ćwiczenie nie ma błędów na liście, bledy = [].`,
    'Nie dodajesz tekstów do wyświetlenia ani liczb kątów jako opisów: kąty i rozstawy bez źródła to uproszczenie ilustracyjne.',
  ].join('\n');
}
