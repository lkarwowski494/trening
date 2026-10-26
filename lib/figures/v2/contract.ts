/*
 * Figury v2 — KONTRAKT DANYCH RODZINY (docs/50, rozdz. 10). Poza ćwiczenia jako dane (klatki kluczowe + błędy jako delty + sprzęt), które może wypełnić zewnętrzny
 * generator (pilotaż przez API), a nasze testy geometrii je sprawdzają. Ten moduł zawiera: typy kontraktu, JSON Schema (poseSchema), prosty walidator schematu,
 * interpreter klatek kluczowych (keyframeFrame: dane → ta sama Frame co rigi rodzin, więc działają kolidery, kształty i testy) oraz walidator semantyczny
 * (validatePose: geometria, zakres stawów, ciągłość, błędy jako modyfikacje pozy poprawnej). Przykład z gotowej rodziny: exampleFor (poza → dane).
 * Czysty moduł (bez React i aliasów): działa w aplikacji, testach i w scripts/figures/v2-validate.mjs.
 * Liczby (zakresy, tolerancje) w jednym miejscu: CONTRACT. Kąty i rozstawy bez źródła to uproszczenie ilustracyjne (nie pokazujemy ich użytkownikowi).
 */
import { add, dist, type V3 } from './math';
import { BODY, EXT_ROM, SIDES, hipPoint, jointAngles, legJoints, type LegIn, type ArmIn, type PoseIn, type Side } from './skeleton';
import type { Frame, Prop } from './scene';
import { checkFrame } from './colliders';
import { mkFrame } from './rigs/common';
import { FAMILY } from './families';
import type { Affects } from './errors';

export const CONTRACT = {
  /** poza@2 (26.10.2026): zgodna wstecz z poza@1 — dochodzą wyłącznie pola OPCJONALNE (obrót i skręt tułowia, skłon boczny, przechył miednicy, uniesienie barku, zgiecieNadgarstka, obrót przedramienia); stare pozy działają bez zmian. */
  id: 'figury-v2/poza@2',
  /** Wcześniejsze wersje kontraktu przyjmowane przez walidator (dane zapisane w lib/figures/v2/poses/ mogą mieć poza@1). */
  legacy: ['figury-v2/poza@1'] as readonly string[],
  /** Liczba klatek kluczowych poprawnej pozy. */
  frames: { min: 2, max: 12 },
  /** Liczba klatek błędu (delty) i liczba błędów na ćwiczenie. */
  errorFrames: { min: 2, max: 8 }, errorsMax: 3,
  /** Siatka sprawdzeń geometrii (liczba przedziałów ruchu) i ciągłości (krok 1/48, maks. skok stawu w cm). */
  grid: 24, step: 48, maxJump: 6,
  /** Błąd musi być widoczny (≥ cm w którymkolwiek stawie albo ≥ stopni w którymkolwiek kącie) i niedeklarowane kąty mogą się różnić o ≤ stopni. */
  visibleCm: 3, visibleDeg: 8, undeclaredDeg: 4, undeclaredCm: 1.5,
  /** Ruch musi istnieć: przemieszczenie dłoni, kolan lub miednicy między u = 0 a u = 1 (cm). */
  minMotionCm: 8,
  coord: 300, angle: 200, deltaCoord: 60, deltaAngle: 90,
  maxIssues: 12,
} as const;

export const MARKS = ['knees', 'heels', 'back', 'pelvis', 'bar'] as const;
export const AFFECTS: Affects[] = ['knee', 'ankle', 'hip', 'spine', 'kneeLat', 'heel', 'pelvis', 'bar', 'shoulder', 'elbow'];
export const GEAR = ['sztanga', 'slupek', 'podloga', 'skrzynia'] as const;

/* ---------- typy danych ---------- */
export type LegData = { kostka: V3; podbicie?: number; rotacjaStopy?: number; odchylenieKolana?: number; biegunKolana?: V3 };
export type ArmData = {
  chwyt: V3; biegunLokcia?: V3; dolnaCzesc?: number;
  /** poza@2: uniesienie (+) / obniżenie (−) barku wzdłuż osi tułowia (cm). */ uniesienieBarkow?: number;
  /** poza@2: zgięcie dłoniowe (+) / wyprost (−) nadgarstka (stopnie). */ zgiecieNadgarstka?: number;
  /** poza@2: wysunięcie (+, protrakcja) / cofnięcie (−, retrakcja) barku wzdłuż „przodu” klatki (cm). */ wysuniecieBarkow?: number;
  /** poza@2: obrót przedramienia (stopnie; 0 = kciuk w górę, + supinacja, − pronacja). */ obrotPrzedramienia?: number;
};
export type KeyFrame = {
  u: number; miednica: V3; pochylenieTulowia: number; zgiecieKregoslupa?: number; pochylenieGlowy?: number;
  /** poza@2: obrót całego tułowia z miednicą wokół osi długiej (stopnie; +90 = klatka ku prawej stronie osoby, np. deska bokiem). */ obrotTulowia?: number;
  /** poza@2: skręt klatki piersiowej względem miednicy (stopnie; + = ku prawej stronie). */ skretTulowia?: number;
  /** poza@2: skłon boczny tułowia (stopnie; + = głowa ku prawej stronie). */ przechylTulowia?: number;
  /** poza@2: przechył miednicy w płaszczyźnie czołowej (stopnie; + = prawe biodro wyżej). */ przechylMiednicy?: number;
  /** poza@2: skłon boczny głowy względem tułowia (stopnie; + = ucho ku prawemu barkowi). */ przechylGlowy?: number;
  nogi: Record<Side, LegData>; rece: Record<Side, ArmData>;
};
export type Gear = { rodzaj: typeof GEAR[number]; x?: number; y?: number; h?: number; x0?: number; x1?: number; top?: number; talerze?: boolean; podazaZaChwytem?: boolean; trzyma?: 'obie' | 'R' | 'L'; dlugosc?: number };
export type DeltaFrame = {
  u: number; miednica?: V3; pochylenieTulowia?: number; zgiecieKregoslupa?: number; pochylenieGlowy?: number;
  obrotTulowia?: number; skretTulowia?: number; przechylTulowia?: number; przechylMiednicy?: number; przechylGlowy?: number;
  nogi?: Partial<Record<Side, Partial<LegData>>>; rece?: Partial<Record<Side, { chwyt?: V3; uniesienieBarkow?: number; wysuniecieBarkow?: number; zgiecieNadgarstka?: number; obrotPrzedramienia?: number }>>;
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
  allow?: { elbow?: number; shSag?: number; shElev?: number; ankleMin?: number; hipMin?: number; why: string };
  /** Opis ruchu do promptu (co ma pokazywać u = 0 i u = 1). */
  movement: string;
  check?: (g: Gear[]) => string[];
};
export const TEMPLATES: Record<string, FamilyTemplate> = {
  pull_up: {
    gear: 'Drążek poziomy ze słupkami: dokładnie jedna sztanga bez talerzy i nieprzesuwająca się (talerze: false, podazaZaChwytem: false) na x = 0, y od 200 do 260 cm; słupek (slupek, x = 0, h = wysokość drążka + 5) i podłoga. Dłonie MUSZĄ leżeć na osi drążka: chwyt = [x drążka, y drążka, ±połowa rozstawu dłoni]. Jednorącz: ustaw na sztandze trzyma: "R" (albo "L") — wolna dłoń dostaje chwyt poza drążkiem (np. wzdłuż tułowia, ±15 cm od osi z = 0, nie przez drążek).',
    defaultGear: [{ rodzaj: 'podloga', x0: -120, x1: 120 }, { rodzaj: 'slupek', x: 0, h: 235 }, { rodzaj: 'sztanga', x: 0, y: 230, talerze: false, podazaZaChwytem: false, dlugosc: 128 }],
    allow: { shElev: 180, shSag: 200, why: 'zwis i podciąganie: ramiona nad głową względem tułowia, zgięcie barku powyżej średniego zakresu w płaszczyźnie strzałkowej (uproszczenie ilustracyjne)' },
    movement: 'u = 0: zwis na prostych rękach (łokcie wyprostowane), stopy nad podłogą. u = 1: górna pozycja — broda nad drążkiem, łokcie zgięte.',
    check: g => { const o: string[] = []; const bars = g.filter(x => x.rodzaj === 'sztanga');
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
/* pushup_plank: pozy w podporze (dłonie i stopy na podłodze); stanie na palcach daje kąt kostki ok. −55…−65° — blisko dolnej granicy zakresu (−60°), więc wyjątek rodziny (decyzja koordynatora 26.10.2026; uproszczenie ilustracyjne, nie pokazujemy kąta użytkownikowi). */
TEMPLATES.pushup_plank = { gear: 'Podłoga (rodzaj podloga) i ewentualnie skrzynia/ławka płaska jako podwyższenie (dłonie albo stopy); dłonie i stopy w kontakcie z podłożem w pozycji podporu.', defaultGear: [{ rodzaj: 'podloga', x0: -150, x1: 150 }],
  allow: { ankleMin: -75, why: 'stanie na palcach w podporze: zgięcie podeszwowe kostki ok. −55…−65°, blisko dolnej granicy zakresu (uproszczenie ilustracyjne)' }, movement: 'u = 0: pozycja wyjściowa podporu (ręce proste), u = 1: pozycja skrajna (np. dół pompki: łokcie zgięte, ciało w jednej linii); ćwiczenia izometryczne: poza statyczna.' };
const GENERIC: FamilyTemplate = { gear: 'Sprzęt wg rodzaju ćwiczenia: sztanga (x, y, talerze, podazaZaChwytem), słupek (x, h), podłoga, skrzynia (x0, x1, top).', defaultGear: [{ rodzaj: 'podloga', x0: -120, x1: 120 }], movement: 'u = 0: pozycja wyjściowa, u = 1: pozycja skrajna.' };
export const templateFor = (family: string): FamilyTemplate => TEMPLATES[family] ?? GENERIC;
export const knownFamily = (family: string): boolean => Object.prototype.hasOwnProperty.call(FAMILY, family);

/* ---------- JSON Schema (podzbiór obsługiwany przez structured output: bez $ref i oneOf) ---------- */
type Sch = Record<string, unknown>;
const num = (min: number, max: number, description: string): Sch => ({ type: 'number', minimum: min, maximum: max, description });
const vec = (description: string, lim: number = CONTRACT.coord): Sch => ({ type: 'array', items: { type: 'number', minimum: -lim, maximum: lim }, minItems: 3, maxItems: 3, description });
const obj = (properties: Record<string, Sch>, required: string[], description?: string): Sch => ({ type: 'object', properties, required, additionalProperties: false, ...(description ? { description } : {}) });
const legProps = (d: boolean): Record<string, Sch> => ({
  kostka: vec(d ? 'Zmiana położenia kostki [dx, dy, dz] w cm.' : 'Środek stawu skokowego [x, y, z] w cm (x = przód, y = góra, z = prawa strona osoby).', d ? CONTRACT.deltaCoord : CONTRACT.coord),
  podbicie: num(-90, 90, d ? 'Zmiana pochylenia stopy w stopniach.' : 'Pochylenie stopy w płaszczyźnie strzałkowej, stopnie (dodatnie = palce wyżej niż pięta). NIE PODAWAJ, gdy stopa nie jest istotą ruchu (np. leżenie, zwis): wtedy stopa ustawia się sama neutralnie względem goleni (kąt kostki ≈ 5°). Podaj tylko tam, gdzie stopa jest ruchem lub podporą: wspięcia, stanie na palcach (np. −60).'),
  rotacjaStopy: num(-90, 90, d ? 'Zmiana rotacji zewnętrznej stopy w stopniach.' : 'Rotacja zewnętrzna stopy, stopnie. Domyślnie 10.'),
  odchylenieKolana: num(-90, 90, d ? 'Zmiana odchylenia kolana na zewnątrz (stopnie; ujemne = do środka).' : 'Odchylenie kolana na zewnątrz w poziomie, stopnie. Domyślnie 2 × rotacja stopy.'),
  ...(d ? {} : { biegunKolana: vec('Kierunek zgięcia kolana [x, y, z] (wektor kierunku, nie cm). Domyślnie do przodu i na zewnątrz (stojąc). Przy leżeniu na plecach i unoszonych nogach WSKAŻ [0.15, 1, 0] (kolano w górę, nie w podłogę); na czworaka i na brzuchu [0.15, -1, 0] (kolano opiera się o podłogę). Gdy podane, odchylenieKolana jest ignorowane.', 10) }),
});
const keyProps = (d: boolean): Record<string, Sch> => ({
  miednica: vec(d ? 'Zmiana położenia środka miednicy [dx, dy, dz] w cm.' : 'Środek stawów biodrowych [x, y, z] w cm; z = 0 oznacza płaszczyznę symetrii osoby.', d ? CONTRACT.deltaCoord : CONTRACT.coord),
  pochylenieTulowia: num(-CONTRACT.angle, CONTRACT.angle, d ? 'Zmiana pochylenia tułowia w stopniach.' : 'Pochylenie tułowia od pionu w płaszczyźnie strzałkowej, stopnie: 0 = pion, do przodu dodatnie, 90 = poziomo głową do przodu, 180 = do góry nogami.'),
  zgiecieKregoslupa: num(-90, 90, d ? 'Zmiana zgięcia kręgosłupa w stopniach.' : 'Zgięcie kręgosłupa, stopnie: 0 = neutralny, dodatnie = zaokrąglony grzbiet. Domyślnie 0.'),
  pochylenieGlowy: num(-CONTRACT.angle, CONTRACT.angle, d ? 'Zmiana pochylenia głowy w stopniach.' : 'Pochylenie głowy od pionu (bezwzględne), stopnie, do przodu dodatnie. Domyślnie 40% pochylenia tułowia.'),
  obrotTulowia: d ? num(-90, 90, 'Zmiana obrotu tułowia w stopniach.') : num(-180, 180, 'OPCJONALNIE (poza@2): obrót całego tułowia z miednicą wokół osi długiej, stopnie: 0 = klatka do przodu (domyślnie), +90 = klatka zwrócona ku prawej stronie osoby (+z), −90 = ku lewej. Tylko dla ćwiczeń na boku (deska bokiem, Copenhagen), nie dla ćwiczeń z obrotem klatki względem miednicy — te opisuje skretTulowia. Wraz z obrotem nogi i ręce nadal podajesz jako punkty w układzie świata.'),
  skretTulowia: d ? num(-45, 45, 'Zmiana skrętu klatki w stopniach.') : num(-90, 90, `OPCJONALNIE (poza@2): skręt klatki piersiowej względem miednicy wokół osi tułowia, stopnie (${EXT_ROM.twist.min}…${EXT_ROM.twist.max}): dodatni = klatka ku prawej stronie osoby. Miednica zostaje (rotacje tułowia, drwal, Russian twist).`),
  przechylTulowia: d ? num(-35, 35, 'Zmiana skłonu bocznego w stopniach.') : num(-90, 90, `OPCJONALNIE (poza@2): skłon boczny tułowia, stopnie (${EXT_ROM.lean.min}…${EXT_ROM.lean.max}): dodatni = głowa ku prawej stronie osoby. Przechyla całą oś tułowia w stawach biodrowych (uproszczenie: sztywno, nie łukiem).`),
  przechylGlowy: headTiltProp(d),
  przechylMiednicy: d ? num(-15, 15, 'Zmiana przechyłu miednicy w stopniach.') : num(-90, 90, `OPCJONALNIE (poza@2): przechył miednicy w płaszczyźnie czołowej, stopnie (${EXT_ROM.tilt.min}…${EXT_ROM.tilt.max}): dodatni = prawe biodro wyżej niż lewe. Przesuwa tylko stawy biodrowe (tułów zostaje).`),
});
const headTiltProp = (d: boolean): Sch => d ? num(-35, 35, 'Zmiana skłonu bocznego głowy w stopniach.') : num(-90, 90, `OPCJONALNIE (poza@2): skłon boczny głowy względem tułowia, stopnie (${EXT_ROM.headTilt.min}…${EXT_ROM.headTilt.max}): dodatni = ucho ku prawemu barkowi.`);
const armExtProps = (d: boolean): Record<string, Sch> => ({
  uniesienieBarkow: d ? num(-9, 9, 'Zmiana uniesienia barku w cm.') : num(-30, 30, `OPCJONALNIE (poza@2): uniesienie (+) albo obniżenie (−) barku wzdłuż osi tułowia, cm (${EXT_ROM.shrug.min}…${EXT_ROM.shrug.max}); szrugsy. Barki obu stron podajesz osobno (zwykle ta sama wartość).`),
  wysuniecieBarkow: d ? num(-10, 10, 'Zmiana wysunięcia barku w cm.') : num(-30, 30, `OPCJONALNIE (poza@2): wysunięcie (+, protrakcja) albo cofnięcie (−, retrakcja) barku wzdłuż „przodu” klatki, cm (${EXT_ROM.protract.min}…${EXT_ROM.protract.max}).`),
  zgiecieNadgarstka: d ? num(-90, 90, 'Zmiana zgięcia nadgarstka w stopniach.') : num(-90, 90, `OPCJONALNIE (poza@2): zgięcie dłoniowe (+) albo wyprost (−) nadgarstka, stopnie (${EXT_ROM.wrist.min}…${EXT_ROM.wrist.max}): dłoń odchyla się od osi przedramienia ku stronie dłoni (+) albo grzbietu (−). chwyt nadal oznacza środek chwytu dłoni; silnik cofa zgiecieNadgarstka o długość dłoni wzdłuż odchylonej dłoni.`),
  obrotPrzedramienia: d ? num(-90, 90, 'Zmiana obrotu przedramienia w stopniach.') : num(-90, 90, `OPCJONALNIE (poza@2): obrót przedramienia, stopnie (${EXT_ROM.forearm.min}…${EXT_ROM.forearm.max}): 0 = kciuk w górę, dodatni = supinacja (dłoń w górę), ujemny = pronacja (dłoń w dół). Wyznacza płaszczyznę zgięcia nadgarstka.`),
});
const side = (props: Record<string, Sch>, required: string[], d: boolean): Sch => obj({ R: obj(props, required), L: obj(props, required) }, d ? [] : ['R', 'L'], 'R = prawa strona osoby, L = lewa.');

/** JSON Schema odpowiedzi dla rodziny (opis pól po polsku; jednostki: cm, stopnie). */
export function poseSchema(family: string): Sch {
  const t = templateFor(family);
  const gear = obj({
    rodzaj: { type: 'string', enum: [...GEAR], description: 'sztanga (także drążek), slupek (pionowy), podloga, skrzynia.' },
    x: num(-CONTRACT.coord, CONTRACT.coord, 'Położenie w przód (cm): środek sztangi albo słupka.'), y: num(0, CONTRACT.coord, 'Wysokość środka sztangi nad podłogą (cm).'),
    h: num(0, CONTRACT.coord, 'Wysokość słupka (cm).'), x0: num(-CONTRACT.coord, CONTRACT.coord, 'Początek podłogi albo skrzyni (cm).'), x1: num(-CONTRACT.coord, CONTRACT.coord, 'Koniec podłogi albo skrzyni (cm).'),
    top: num(0, CONTRACT.coord, 'Wysokość górnej powierzchni skrzyni (cm).'), talerze: { type: 'boolean', description: 'Czy sztanga ma talerze (domyślnie true; drążek: false).' },
    trzyma: { type: 'string', enum: ['obie', 'R', 'L'], description: 'Która dłoń trzyma sztangę/drążek: obie (domyślnie), R albo L (ćwiczenie jednorącz; druga dłoń jest wolna i nie musi leżeć na osi — jej chwyt to dowolny punkt w zasięgu ramienia, bez przenikania sprzętu).' },
    podazaZaChwytem: { type: 'boolean', description: 'true: środek sztangi leży między dłońmi w każdej klatce (sztanga w ruchu); false: nieruchoma (x, y). Domyślnie false.' }, dlugosc: num(10, 300, 'Długość gryfu w cm (domyślnie 220).'),
  }, ['rodzaj']);
  const key = obj({
    u: num(0, 1, 'Pozycja ruchu: 0 = wyjściowa, 1 = skrajna; klatki rosnąco, pierwsza u = 0, ostatnia u = 1.'), ...keyProps(false),
    nogi: side(legProps(false), ['kostka'], false),
    rece: side({ chwyt: vec('Środek chwytu dłoni [x, y, z] w cm (dla sztangi: na jej osi).'), biegunLokcia: vec('Kierunek zgięcia łokcia [x, y, z] (wektor kierunku, nie cm). Domyślnie w dół i do tyłu.', 10), dolnaCzesc: num(10, 40, 'Odległość łokieć–środek chwytu w cm (domyślnie 33).'), ...armExtProps(false) }, ['chwyt'], false),
  }, ['u', 'miednica', 'pochylenieTulowia', 'nogi', 'rece']);
  const dframe = obj({ u: num(0, 1, 'Pozycja ruchu, na której delta ma pełną wartość (między klatkami interpolacja liniowa); pierwsza u = 0 z deltą zerową.'), ...keyProps(true),
    nogi: side(legProps(true), [], true), rece: side({ chwyt: vec('Zmiana położenia chwytu [dx, dy, dz] w cm.', CONTRACT.deltaCoord), ...armExtProps(true) }, [], true) }, ['u']);
  const err = obj({
    cue: { type: 'string', maxLength: 40, description: 'Identyfikator wskazówki „częsty błąd” z listy podanej dla ćwiczenia (tekst błędu pochodzi z naszego słownika, nie z odpowiedzi).' },
    znacznik: { type: 'string', enum: [...MARKS], description: 'Gdzie rysujemy znacznik ✕: kolana, pięty, plecy, miednica albo sztanga.' },
    dotyczy: { type: 'array', items: { type: 'string', enum: AFFECTS }, minItems: 1, maxItems: AFFECTS.length, description: 'Wielkości, które błąd zmienia (reszta kątów ma zostać jak w pozie poprawnej, ±' + CONTRACT.undeclaredDeg + '°): knee, ankle, hip (kąty), spine, kneeLat, heel, pelvis, bar, shoulder, elbow.' },
    klatki: { type: 'array', items: dframe, minItems: CONTRACT.errorFrames.min, maxItems: CONTRACT.errorFrames.max, description: 'Delty dodawane do pozy poprawnej.' },
  }, ['cue', 'znacznik', 'dotyczy', 'klatki'], 'Błąd = modyfikacja pozy poprawnej (delty), nie osobna poza.');
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema', title: `Poza ćwiczenia — rodzina ${family}`, description: t.movement,
    ...obj({
      kontrakt: { type: 'string', enum: [CONTRACT.id] }, /* dane poza@1 przechodzą walidator (CONTRACT.legacy), ale generator dostaje wersję bieżącą */ rodzina: { type: 'string', maxLength: 40 }, cwiczenie: { type: 'string', maxLength: 120 },
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
/** Pola OPCJONALNE poza@2 (liczbowe): interpolowane tylko, gdy występują w którejś z klatek; brak pola = brak klucza (poza@1 daje obiekt bez nowych kluczy). */
export const TRUNK_EXT = ['obrotTulowia', 'skretTulowia', 'przechylTulowia', 'przechylMiednicy', 'przechylGlowy'] as const;
export const ARM_EXT = ['uniesienieBarkow', 'wysuniecieBarkow', 'zgiecieNadgarstka', 'obrotPrzedramienia'] as const;
function optFields<K extends string>(keys: readonly K[], a: Partial<Record<K, number>>, b: Partial<Record<K, number>>, t: number): Partial<Record<K, number>> {
  const o: Partial<Record<K, number>> = {}; for (const k of keys) { const v = opt(a[k], b[k], t); if (v !== undefined) o[k] = v; } return o;
}
/** Indeks segmentu i ułamek t dla pozycji u w posortowanej liście klatek (u poza zakresem → brzeg). */
function segment(us: number[], u: number): [number, number] {
  if (u <= us[0]) return [0, 0]; if (u >= us[us.length - 1]) return [us.length - 1, 0];
  let i = 0; while (i < us.length - 2 && u >= us[i + 1]) i++;
  const span = us[i + 1] - us[i]; return [i, span > 0 ? (u - us[i]) / span : 0];
}
/** Klatka kluczowa w pozycji u (interpolacja liniowa wszystkich pól). */
export function poseAt(frames: KeyFrame[], u: number): KeyFrame {
  const [i, t] = segment(frames.map(f => f.u), u); const a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
  const leg = (s: Side): LegData => ({ kostka: lerp3(a.nogi[s].kostka, b.nogi[s].kostka, t), podbicie: opt(a.nogi[s].podbicie, b.nogi[s].podbicie, t), rotacjaStopy: opt(a.nogi[s].rotacjaStopy, b.nogi[s].rotacjaStopy, t), odchylenieKolana: opt(a.nogi[s].odchylenieKolana, b.nogi[s].odchylenieKolana, t), biegunKolana: opt3(a.nogi[s].biegunKolana, b.nogi[s].biegunKolana, t) });
  const arm = (s: Side): ArmData => ({ chwyt: lerp3(a.rece[s].chwyt, b.rece[s].chwyt, t), biegunLokcia: opt3(a.rece[s].biegunLokcia, b.rece[s].biegunLokcia, t), dolnaCzesc: opt(a.rece[s].dolnaCzesc, b.rece[s].dolnaCzesc, t), ...optFields(ARM_EXT, a.rece[s], b.rece[s], t) });
  return { u, miednica: lerp3(a.miednica, b.miednica, t), pochylenieTulowia: lerp(a.pochylenieTulowia, b.pochylenieTulowia, t), zgiecieKregoslupa: opt(a.zgiecieKregoslupa, b.zgiecieKregoslupa, t), pochylenieGlowy: opt(a.pochylenieGlowy, b.pochylenieGlowy, t), ...optFields(TRUNK_EXT, a, b, t), nogi: { R: leg('R'), L: leg('L') }, rece: { R: arm('R'), L: arm('L') } };
}
const ZERO: V3 = [0, 0, 0];
/** Delta błędu w pozycji u (interpolacja liniowa między klatkami delt; poza zakresem brzeg). */
export function deltaAt(frames: DeltaFrame[], u: number): DeltaFrame {
  const [i, t] = segment(frames.map(f => f.u), u); const a = frames[i], b = frames[Math.min(i + 1, frames.length - 1)];
  const v = (x: V3 | undefined, y: V3 | undefined): V3 | undefined => x || y ? lerp3(x ?? ZERO, y ?? ZERO, t) : undefined;
  const n = (x: number | undefined, y: number | undefined): number | undefined => x !== undefined || y !== undefined ? lerp(x ?? 0, y ?? 0, t) : undefined;
  const dExt = <K extends string>(keys: readonly K[], x: Partial<Record<K, number>> | undefined, y: Partial<Record<K, number>> | undefined): Partial<Record<K, number>> => { const o: Partial<Record<K, number>> = {}; for (const k of keys) { const w = n(x?.[k], y?.[k]); if (w !== undefined) o[k] = w; } return o; };
  const leg = (s: Side): Partial<LegData> => ({ kostka: v(a.nogi?.[s]?.kostka, b.nogi?.[s]?.kostka), podbicie: n(a.nogi?.[s]?.podbicie, b.nogi?.[s]?.podbicie), rotacjaStopy: n(a.nogi?.[s]?.rotacjaStopy, b.nogi?.[s]?.rotacjaStopy), odchylenieKolana: n(a.nogi?.[s]?.odchylenieKolana, b.nogi?.[s]?.odchylenieKolana) });
  return { u, miednica: v(a.miednica, b.miednica), pochylenieTulowia: n(a.pochylenieTulowia, b.pochylenieTulowia), zgiecieKregoslupa: n(a.zgiecieKregoslupa, b.zgiecieKregoslupa), pochylenieGlowy: n(a.pochylenieGlowy, b.pochylenieGlowy), ...dExt(TRUNK_EXT, a, b),
    nogi: { R: leg('R'), L: leg('L') }, rece: { R: { chwyt: v(a.rece?.R?.chwyt, b.rece?.R?.chwyt), ...dExt(ARM_EXT, a.rece?.R, b.rece?.R) }, L: { chwyt: v(a.rece?.L?.chwyt, b.rece?.L?.chwyt), ...dExt(ARM_EXT, a.rece?.L, b.rece?.L) } } };
}
const plus = (a: V3, d: V3 | undefined): V3 => d ? add(a, d) : a;
const plusN = (a: number | undefined, d: number | undefined, base = 0): number | undefined => d === undefined ? a : (a ?? base) + d;
/** Poza z nałożoną deltą. */
export function applyDelta(k: KeyFrame, d: DeltaFrame): KeyFrame {
  const leg = (s: Side): LegData => { const l = k.nogi[s], x = d.nogi?.[s]; const toe = l.rotacjaStopy ?? 10; return { biegunKolana: l.biegunKolana, kostka: plus(l.kostka, x?.kostka), podbicie: plusN(l.podbicie, x?.podbicie), rotacjaStopy: plusN(l.rotacjaStopy, x?.rotacjaStopy, 10), odchylenieKolana: plusN(l.odchylenieKolana, x?.odchylenieKolana, toe * 2) }; };
  const sumExt = <K extends string>(keys: readonly K[], base: Partial<Record<K, number>>, dd: Partial<Record<K, number>> | undefined): Partial<Record<K, number>> => { const o: Partial<Record<K, number>> = {}; for (const key of keys) { const x = plusN(base[key], dd?.[key]); if (x !== undefined) o[key] = x; } return o; };
  const arm = (s: Side): ArmData => ({ ...k.rece[s], chwyt: plus(k.rece[s].chwyt, d.rece?.[s]?.chwyt), ...sumExt(ARM_EXT, k.rece[s], d.rece?.[s]) });
  return { ...k, ...sumExt(TRUNK_EXT, k, d), miednica: plus(k.miednica, d.miednica), pochylenieTulowia: k.pochylenieTulowia + (d.pochylenieTulowia ?? 0), zgiecieKregoslupa: plusN(k.zgiecieKregoslupa, d.zgiecieKregoslupa), pochylenieGlowy: d.pochylenieGlowy === undefined ? k.pochylenieGlowy : (k.pochylenieGlowy ?? Math.max(-20, Math.min(60, k.pochylenieTulowia * 0.4))) + d.pochylenieGlowy, nogi: { R: leg('R'), L: leg('L') }, rece: { R: arm('R'), L: arm('L') } };
}
/** Neutralne ustawienie stopy względem goleni (kąt kostki ≈ +NEUTRAL_ANKLE_DEG): stopa prostopadła do goleni w płaszczyźnie strzałkowej, palce lekko ku goleni. Używane, gdy `podbicie` nie jest podane (decyzja koordynatora 26.10.2026: model nie liczy kąta kostki; stopa istotą ruchu → podbicie jawnie). */
export const NEUTRAL_ANKLE_DEG = 5;
export function neutralFootPitch(pelvis: V3, side: Side, li: LegIn, hipAt?: V3): number {
  const j = legJoints(pelvis, side, li, hipAt); const sx = j.knee[0] - li.ankle[0], sy = j.knee[1] - li.ankle[1];
  const want = Math.atan2(-sx, sy) * 180 / Math.PI + NEUTRAL_ANKLE_DEG;
  /* stopa nie wchodzi w podłogę (y = 0): gdy neutralne ustawienie zanurzałoby piętę lub palce, zmniejszamy pochylenie ku stopie płaskiej */
  const soleY = (deg: number): number => {
    const fp = deg * Math.PI / 180, ay = li.ankle[1];
    const y = (along: number): number => ay + Math.sin(fp) * along - Math.cos(fp) * BODY.ankleH;
    return Math.min(y(-BODY.heelBack), y(BODY.toeFwd));
  };
  if (soleY(want) >= -1e-6 || soleY(0) < -1e-6) return want;
  let lo = 0, hi = want; /* lo: dopuszczalne, hi: zanurza */
  for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (soleY(mid) >= -1e-6) lo = mid; else hi = mid; }
  return lo;
}
export function toPoseIn(k: KeyFrame): PoseIn {
  const ext = { trunkRoll: k.obrotTulowia, trunkTwist: k.skretTulowia, trunkLean: k.przechylTulowia, pelvisTilt: k.przechylMiednicy, headTilt: k.przechylGlowy };
  const hipOf = (s: Side): V3 => hipPoint({ pelvis: k.miednica, trunkPitch: k.pochylenieTulowia, ...ext }, s); /* z przechyłem i obrotem miednicy biodra nie leżą na osi z */
  const leg = (s: Side): LegIn => { const l = k.nogi[s]; const li: LegIn = { ankle: l.kostka, footPitch: l.podbicie, toeOut: l.rotacjaStopy, kneeOut: l.odchylenieKolana, kneePole: l.biegunKolana };
    if (li.footPitch === undefined) li.footPitch = neutralFootPitch(k.miednica, s, li, hipOf(s)); /* podbicie niepodane: stopa neutralnie względem goleni */
    return li; };
  const arm = (s: Side): ArmIn => { const a = k.rece[s]; return { grip: a.chwyt, elbowPole: a.biegunLokcia, lower: a.dolnaCzesc, shrug: a.uniesienieBarkow, protract: a.wysuniecieBarkow, wristFlex: a.zgiecieNadgarstka, forearmRoll: a.obrotPrzedramienia }; };
  return { pelvis: k.miednica, trunkPitch: k.pochylenieTulowia, spineBend: k.zgiecieKregoslupa, headPitch: k.pochylenieGlowy, ...ext, legs: { R: leg('R'), L: leg('L') }, arms: { R: arm('R'), L: arm('L') } };
}
const BAR_LEN = 220;
/** Sprzęt jako rekwizyty sceny; sztanga „podążająca za chwytem” leży między dłońmi. */
export function propsFrom(gear: Gear[], grips: Record<Side, V3>): Prop[] {
  const out: Prop[] = [];
  for (const g of gear) {
    if (g.rodzaj === 'sztanga') { const c: V3 = g.podazaZaChwytem ? [(grips.R[0] + grips.L[0]) / 2, (grips.R[1] + grips.L[1]) / 2, 0] : [g.x ?? 0, g.y ?? 0, 0]; out.push({ k: 'barbell', c, plates: g.talerze !== false, held: g.trzyma === 'R' || g.trzyma === 'L' ? g.trzyma : true, len: g.dlugosc ?? BAR_LEN }); }
    else if (g.rodzaj === 'slupek') out.push({ k: 'post', x: g.x ?? 0, h: g.h ?? 200 });
    else if (g.rodzaj === 'podloga') out.push({ k: 'floor', x0: g.x0 ?? -120, x1: g.x1 ?? 120 });
    else out.push({ k: 'box', x0: g.x0 ?? 0, x1: g.x1 ?? 40, top: g.top ?? 40 });
  }
  return out;
}
/** Klatka danych rodziny w pozycji u; error = indeks błędu (poza poprawna + delta). Zwraca tę samą Frame co rigi (kolidery, kształty). */
export function keyframeFrame(d: PoseData, u: number, error?: number): Frame {
  let k = poseAt(d.klatki, u); if (error !== undefined && d.bledy[error]) k = applyDelta(k, deltaAt(d.bledy[error].klatki, u));
  const pose = toPoseIn(k); const grips = { R: pose.arms.R.grip, L: pose.arms.L.grip };
  const props = propsFrom(d.sprzet, grips); const bar = props.find(p => p.k === 'barbell');
  const info: Record<string, V3> = {}; if (bar && bar.k === 'barbell') info.load = bar.c;
  return mkFrame(pose, props, info);
}

/* ---------- walidator semantyczny ---------- */
export type RomData = { side: Record<'hip' | 'knee' | 'ankle' | 'el' | 'sh', { min: number; max: number }>; front: { abd: { min: number; max: number } } };
export type ValidateCtx = { family: string; exercise: string; /** id wskazówek „częsty błąd” tego ćwiczenia (cue-sets.json albo lib/cues). */ errorCues: string[]; rom: RomData; /** Ćwiczenie izometryczne (decyzja koordynatora 26.10.2026): poza statyczna, wymóg ruchu ≥ minMotionCm nie obowiązuje; błąd jest jedynym ruchem. */ isometric?: boolean };

const f1 = (x: number): string => x.toFixed(1);
const f2 = (x: number): string => x.toFixed(2);
class Agg {
  private m = new Map<string, { text: (u: string) => string; us: number[] }>();
  add(key: string, u: number, text: (u: string) => string): void { const e = this.m.get(key); if (e) e.us.push(u); else this.m.set(key, { text, us: [u] }); }
  flush(kod: string, out: ContractIssue[]): void { for (const e of this.m.values()) out.push({ kod, szczegol: e.text(f2(e.us[0])) + (e.us.length > 1 ? ` (i w ${e.us.length - 1} innych fazach, ostatnia u=${f2(e.us[e.us.length - 1])})` : '') }); }
}
/** Kąty sprawdzane pod kątem niedeklarowanych zmian błędu → wielkości z `dotyczy`, które je usprawiedliwiają. Nowe stopnie swobody (poza@2) używają istniejących etykiet: tułów (obrót, skręt, skłon) = spine, przechył miednicy = pelvis, barki = shoulder, zgiecieNadgarstka i przedramię = elbow. */
const ANG_OF: Record<string, Affects[]> = { hip: ['hip'], knee: ['knee'], ankle: ['ankle'], elbow: ['elbow'], shElev: ['shoulder'], trunkRoll: ['spine'], trunkTwist: ['spine'], trunkLean: ['spine'], pelvisTilt: ['pelvis'], headTilt: ['spine'], wristFlex: ['elbow'], forearmRoll: ['elbow'] };
const pts = (f: Frame): V3[] => [f.sk.pelvis, f.sk.head, f.sk.shoulderC, f.sk.spineMid, ...SIDES.flatMap(s => [f.sk.legs[s].knee, f.sk.legs[s].ankle, f.sk.legs[s].heel, f.sk.legs[s].toe, f.sk.arms[s].elbow, f.sk.arms[s].grip]), ...(f.info.load ? [f.info.load] : [])];
const gridU = (d: PoseData, extra: number[] = []): number[] => [...new Set([...Array.from({ length: CONTRACT.grid + 1 }, (_, i) => i / CONTRACT.grid), ...d.klatki.map(k => k.u), ...extra])].sort((a, b) => a - b);
const deltaMag = (d: DeltaFrame): number => Math.max(0, ...[d.miednica, d.nogi?.R?.kostka, d.nogi?.L?.kostka, d.rece?.R?.chwyt, d.rece?.L?.chwyt].map(v => v ? Math.max(...v.map(Math.abs)) : 0), ...[d.pochylenieTulowia, d.zgiecieKregoslupa, d.pochylenieGlowy, d.nogi?.R?.podbicie, d.nogi?.R?.rotacjaStopy, d.nogi?.R?.odchylenieKolana, d.nogi?.L?.podbicie, d.nogi?.L?.rotacjaStopy, d.nogi?.L?.odchylenieKolana,
  d.obrotTulowia, d.skretTulowia, d.przechylTulowia, d.przechylMiednicy, d.przechylGlowy, ...SIDES.flatMap(sd => [d.rece?.[sd]?.uniesienieBarkow, d.rece?.[sd]?.wysuniecieBarkow, d.rece?.[sd]?.zgiecieNadgarstka, d.rece?.[sd]?.obrotPrzedramienia])].map(v => Math.abs(v ?? 0)));
/** Pola poza@2 użyte w danych (nazwy) — poza@1 ich nie może zawierać. */
function extFieldsUsed(d: PoseData): string[] {
  const o = new Set<string>(); const scan = (k: object, keys: readonly string[]): void => { for (const f of keys) if ((k as Record<string, unknown>)[f] !== undefined) o.add(f); };
  const frames: object[] = [...d.klatki, ...d.bledy.flatMap(e => e.klatki)];
  for (const k of frames) { scan(k, TRUNK_EXT); for (const sd of SIDES) { const a = (k as { rece?: Record<string, object> }).rece?.[sd]; if (a) scan(a, ARM_EXT); } }
  return [...o];
}

function geometry(d: PoseData, error: number | undefined, label: string, out: ContractIssue[]): void {
  const agg = new Agg(); const grip = new Agg();
  for (const u of gridU(d, error === undefined ? [] : d.bledy[error].klatki.map(k => k.u))) {
    let f: Frame; try { f = keyframeFrame(d, u, error); } catch (e) { out.push({ kod: 'geometria', szczegol: `${label}u=${f2(u)}: nie da się policzyć pozy (${(e as Error).message})` }); return; }
    for (const i of checkFrame(f)) {
      const key = i.code + i.detail.replace(/[-\d.]+/g, '#');
      if (i.code === 'grip') grip.add(key, u, uu => `${label}${i.detail.replace(/^gryf\/R/, 'dłoń prawa wobec drążka/sztangi').replace(/^gryf\/L/, 'dłoń lewa wobec drążka/sztangi')} w fazie u=${uu} — chwyt musi leżeć na osi sztangi (x, y sztangi, z = ±połowa rozstawu dłoni)`);
      else agg.add(key, u, uu => `${label}${i.detail} w fazie u=${uu}`);
    }
  }
  grip.flush('chwyt', out); agg.flush('geometria', out);
}

/** Pełna walidacja danych rodziny: schemat, spójność, geometria (kości, zasięg, podłoga, przenikanie, chwyt), zakres stawów, ciągłość, ruch i błędy jako delty. Komunikaty konkretne (cel: poprawka przez generator). */
export function validatePose(data: unknown, ctx: ValidateCtx): ContractIssue[] {
  const out: ContractIssue[] = [];
  if (!knownFamily(ctx.family)) return [{ kod: 'rodzina', szczegol: `nieznana rodzina „${ctx.family}”` }];
  const schema = poseSchema(ctx.family); const kontrakt = (data as { kontrakt?: unknown } | null)?.kontrakt; const stary = typeof kontrakt === 'string' && CONTRACT.legacy.includes(kontrakt);
  if (stary) (schema.properties as Record<string, Sch>).kontrakt = { type: 'string', enum: [CONTRACT.id, ...CONTRACT.legacy] }; /* poza@1 nadal przyjmowana */
  const sch = checkSchema(data, schema); if (sch.length) return sch.slice(0, CONTRACT.maxIssues);
  const d = data as PoseData;
  if (stary) { const uz = extFieldsUsed(d); if (uz.length) return [{ kod: 'kontrakt', szczegol: `pola ${uz.join(', ')} należą do ${CONTRACT.id}, a kontrakt = ${kontrakt as string} — ustaw kontrakt: ${CONTRACT.id}` }]; }
  if (d.rodzina !== ctx.family) out.push({ kod: 'kontrakt', szczegol: `rodzina „${d.rodzina}” zamiast „${ctx.family}”` });
  if (d.cwiczenie !== ctx.exercise) out.push({ kod: 'kontrakt', szczegol: `cwiczenie „${d.cwiczenie}” zamiast „${ctx.exercise}”` });
  const us = d.klatki.map(k => k.u);
  if (us[0] !== 0) out.push({ kod: 'klatki-u', szczegol: `pierwsza klatka ma u = ${us[0]}, powinna mieć u = 0` });
  if (us[us.length - 1] !== 1) out.push({ kod: 'klatki-u', szczegol: `ostatnia klatka ma u = ${us[us.length - 1]}, powinna mieć u = 1` });
  for (let i = 1; i < us.length; i++) if (us[i] <= us[i - 1]) out.push({ kod: 'klatki-u', szczegol: `klatki muszą mieć rosnące u: klatki[${i}].u = ${us[i]} ≤ klatki[${i - 1}].u = ${us[i - 1]}` });
  out.push(...(templateFor(ctx.family).check?.(d.sprzet) ?? []).map(szczegol => ({ kod: 'sprzet', szczegol })));
  if (out.length) return out.slice(0, CONTRACT.maxIssues);

  geometry(d, undefined, '', out);
  /* zakres stawów */
  const r = ctx.rom; const al = templateFor(ctx.family).allow ?? { why: '' }; const rg = new Agg();
  for (const u of gridU(d)) { const f = keyframeFrame(d, u); for (const s of SIDES) {
    const a = jointAngles(f.sk, s);
    const chk = (n: string, v: number, lo: number, hi: number): void => { if (v < lo - 0.5 || v > hi + 0.5) rg.add(`${n}${s}`, u, uu => `staw ${n} ${s} = ${f1(v)}° poza zakresem ruchu [${lo}°, ${hi}°] w fazie u=${uu} — zmień położenie kostki, miednicy lub chwytu`); };
    chk('hip', a.hip, al.hipMin ?? r.side.hip.min, r.side.hip.max); chk('knee', a.knee, r.side.knee.min, r.side.knee.max); chk('ankle', a.ankle, al.ankleMin ?? r.side.ankle.min, r.side.ankle.max);
    chk('elbow', a.elbow, r.side.el.min, al.elbow ?? r.side.el.max); chk('shElev', a.shElev, 0, al.shElev ?? r.front.abd.max);
    if (a.shAbd < 30) chk('shSag', a.shSag, r.side.sh.min, al.shSag ?? r.side.sh.max);
    /* poza@2: nowe stopnie swobody (zakresy: EXT_ROM; uproszczenie ilustracyjne). Obrót tułowia (orientacja ciała, nie staw) bez ograniczenia stawowego; skręt, skłon i przechył raz na klatkę. */
    const ex = (n: string, v: number, lim: { min: number; max: number }, unit: string): void => { if (v < lim.min - 0.5 || v > lim.max + 0.5) rg.add(n, u, uu => `pole ${n} = ${f1(v)}${unit} poza zakresem [${lim.min}${unit}, ${lim.max}${unit}] w fazie u=${uu} — zmniejsz tę wartość w klatkach kluczowych`); };
    if (s === 'R') { ex('skretTulowia', a.trunkTwist, EXT_ROM.twist, '°'); ex('przechylTulowia', a.trunkLean, EXT_ROM.lean, '°'); ex('przechylMiednicy', a.pelvisTilt, EXT_ROM.tilt, '°'); ex('przechylGlowy', a.headTilt, EXT_ROM.headTilt, '°'); }
    ex(`rece.${s}.uniesienieBarkow`, a.shrug, EXT_ROM.shrug, ' cm'); ex(`rece.${s}.wysuniecieBarkow`, a.protract, EXT_ROM.protract, ' cm'); ex(`rece.${s}.zgiecieNadgarstka`, a.wristFlex, EXT_ROM.wrist, '°'); ex(`rece.${s}.obrotPrzedramienia`, a.forearmRoll, EXT_ROM.forearm, '°');
  } }
  rg.flush('zakres', out);
  /* ciągłość */
  const cont = new Agg(); let prev = pts(keyframeFrame(d, 0));
  for (let i = 1; i <= CONTRACT.step; i++) { const cur = pts(keyframeFrame(d, i / CONTRACT.step)); cur.forEach((p, j) => { const dd = dist(p, prev[j]); if (dd > CONTRACT.maxJump) cont.add(`pt${j}`, i / CONTRACT.step, uu => `skok o ${f1(dd)} cm (limit ${CONTRACT.maxJump} cm na 1/${CONTRACT.step} ruchu) w fazie u=${uu} — dodaj klatki pośrednie albo zmniejsz zmianę między sąsiednimi klatkami`); }); prev = cur; }
  cont.flush('ciaglosc', out);
  /* ruch istnieje */
  const a = pts(keyframeFrame(d, 0)), b = pts(keyframeFrame(d, 1)); const moved = Math.max(...a.map((p, i) => dist(p, b[i])));
  if (!ctx.isometric && moved < CONTRACT.minMotionCm) out.push({ kod: 'ruch', szczegol: `poza u = 1 prawie nie różni się od u = 0 (największe przemieszczenie punktu ${f1(moved)} cm, wymagane ≥ ${CONTRACT.minMotionCm} cm)` });

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
        if (Math.abs(x.shrug - y.shrug) > CONTRACT.undeclaredCm && !decl.has('shoulder')) an.add('shrug' + s, u, uu => `${L}uniesienie barku ${s} zmienia się o ${f1(Math.abs(x.shrug - y.shrug))} cm w fazie u=${uu}, a „dotyczy” tego nie deklaruje (dodaj shoulder do „dotyczy” albo usuń tę zmianę z delty)`);
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
    'Podajesz tylko: miednicę (środek stawów biodrowych), pochylenie tułowia, zgięcie kręgosłupa i głowy, kostki obu nóg i środki chwytu obu dłoni. Kolana i łokcie liczy nasz IK (kierunek zgięcia: odchylenieKolana albo biegunKolana, biegunLokcia). Barki leżą na tułowiu: tułów od miednicy do barków ma stałą długość, więc chwyt musi być w zasięgu ramienia od barku (≤ 64 cm), a kostka w zasięgu nogi od biodra (≤ 83 cm).',
    `Opcjonalne stopnie swobody (poza@2; domyślnie 0, pomijaj, gdy ćwiczenie ich nie wymaga): obrotTulowia (deska bokiem, Copenhagen; ${EXT_ROM.roll.min}…${EXT_ROM.roll.max}°, +90 = klatka ku prawej stronie, obraca cały tułów z miednicą wokół osi długiej), skretTulowia (klatka względem miednicy, ${EXT_ROM.twist.min}…${EXT_ROM.twist.max}°, + ku prawej), przechylTulowia (${EXT_ROM.lean.min}…${EXT_ROM.lean.max}°, + głowa ku prawej; sztywny przechył osi tułowia w biodrach), przechylMiednicy (${EXT_ROM.tilt.min}…${EXT_ROM.tilt.max}°, + prawe biodro wyżej; przesuwa tylko biodra), przechylGlowy (${EXT_ROM.headTilt.min}…${EXT_ROM.headTilt.max}°, + ucho ku prawemu barkowi), a w rece.R / rece.L: uniesienieBarkow (cm wzdłuż osi tułowia, ${EXT_ROM.shrug.min}…${EXT_ROM.shrug.max}, + w górę; szrugsy), wysuniecieBarkow (cm wzdłuż przodu klatki, ${EXT_ROM.protract.min}…${EXT_ROM.protract.max}, + protrakcja), zgiecieNadgarstka (zgięcie dłoniowe + / wyprost −, ${EXT_ROM.wrist.min}…${EXT_ROM.wrist.max}°; chwyt zostaje środkiem dłoni, a nadgarstek cofa się o długość dłoni ${BODY.hand} cm wzdłuż odchylonej dłoni) i obrotPrzedramienia (${EXT_ROM.forearm.min}…${EXT_ROM.forearm.max}°; 0 = kciuk w górę, + supinacja; wyznacza stronę zgięcia nadgarstka). Zakresy to uproszczenie ilustracyjne i są sprawdzane w każdej fazie. Gdy tułów jest obrócony, barki i biodra nie leżą na osi z (barki: ±${BODY.shHalf} cm wzdłuż obróconej osi barków), więc kostki i chwyty podawaj w układzie świata zgodnie z tym obrotem. Błąd, który zmienia te pola, deklaruje: tułów (obrót, skręt, skłon) = spine, przechył miednicy = pelvis, uniesienie barku = shoulder, zgiecieNadgarstka i przedramię = elbow.`,
    `Ruch: ${t.movement} Między klatkami kluczowymi interpolacja jest liniowa: dla ruchów zakrzywionych dodaj klatki pośrednie (maks. ${CONTRACT.frames.max}); żaden staw nie może przeskakiwać o więcej niż ${CONTRACT.maxJump} cm na 1/${CONTRACT.step} ruchu.`,
    `Sprzęt: ${t.gear} Stopy opierają się o podłogę (podeszwa nie niżej niż y = 0), ciało nie przenika sprzętu, dłonie leżą na chwycie sztangi (tolerancja 0,6 cm).`,
    `Błędy (bledy[]): każdy to MODYFIKACJA pozy poprawnej: klatki[] z deltami (dodawanymi do pozy poprawnej, interpolacja liniowa), pierwsza u = 0 z deltą zerową, ostatnia u = 1. cue = identyfikator wskazówki błędu z listy podanej dla ćwiczenia (tekstu nie piszesz). dotyczy = wielkości, które błąd zmienia; pozostałe kąty (biodro, kolano, kostka, łokieć, bark) mogą się różnić od pozy poprawnej najwyżej o ${CONTRACT.undeclaredDeg}°. Błąd musi być widoczny (≥ ${CONTRACT.visibleCm} cm lub ≥ ${CONTRACT.visibleDeg}°). Poza błędu też nie przenika sprzętu ani podłogi. Najwyżej ${CONTRACT.errorsMax} błędy; gdy ćwiczenie nie ma błędów na liście, bledy = [].`,
    'Nie dodajesz tekstów do wyświetlenia ani liczb kątów jako opisów: kąty i rozstawy bez źródła to uproszczenie ilustracyjne.',
  ].join('\n');
}
