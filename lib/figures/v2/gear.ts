/*
 * Figury v2 — SPRZĘT W KONTRAKCIE DANYCH (docs/50 rozdz. 10, docs/53, docs/54): rejestr rodzajów sprzętu, które generator może wpisać w `sprzet[]` pozy.
 * Każdy rodzaj to parametryczny prymityw: pola, rekwizyt(y) sceny (rysunek i kolidery w draw.ts/colliders.ts), możliwości katalogu ćwiczeń (`caps`), które pokrywa,
 * sprawdzenia pól i punkty odniesienia dla generatora poleceń (`ref`, liczby z EQUIP). Wymiary w EQUIP (draw.ts) są „konwencją rysunku”
 * (status i powód: data/zrodla/figury-sprzet.json). Czysty moduł (bez React).
 */
import { add, clamp, mul, norm, sub, type V3 } from './math';
import { BODY, GIRTH, SIDES, type Side } from './skeleton';
import { EQUIP } from './draw';
import { TOL } from './colliders';
import type { Contact, Frame, Prop } from './scene';

export const GEAR = ['sztanga', 'slupek', 'podloga', 'skrzynia', 'hantel', 'kettlebell', 'talerz', 'pilka_lekarska', 'smith', 'landmine', 'sciana', 'gryf_szesciokatny'] as const;
export type GearName = typeof GEAR[number];
export type Gear = { rodzaj: GearName; x?: number; y?: number; h?: number; x0?: number; x1?: number; top?: number; talerze?: boolean; podazaZaChwytem?: boolean; trzyma?: 'obie' | 'R' | 'L'; dlugosc?: number; promien?: number; pionowo?: boolean; dzwon?: 'dol' | 'wzdluz' | 'tyl'; przesuniecie?: V3; hak?: number; z?: number; przed?: boolean };
/** Pola sprzętu wprowadzone po pierwszej wersji kontraktu: dozwolone tylko dla rodzajów, które je wymieniają w `fields`. */
export const GEAR_EXTRA_FIELDS = ['promien', 'pionowo', 'dzwon', 'przesuniecie', 'hak', 'z', 'przed'] as const;
export const BELL_MODES = ['dol', 'wzdluz', 'tyl'] as const;

export type GearGrips = Record<Side, V3>;
export type GearKind = {
  /** Możliwości katalogu ćwiczeń (lib/catalog.generated.ts → requires), które ten rodzaj pozwala narysować. */
  caps: readonly string[];
  /** Krótki opis do generatora poleceń (jak wypełnić pola). */
  opis: string;
  /** Rekwizyty sceny dla wpisu sprzętu (chwyty rąk potrzebne sprzętowi trzymanemu w dłoni). */
  props: (g: Gear, grips: GearGrips) => Prop[];
  /** Dozwolone kontakty ciało–sprzęt dla wpisu (tolerancja przenikania, cm). */
  contacts?: (g: Gear) => Contact[];
  /** Pola z GEAR_EXTRA_FIELDS, które ten rodzaj przyjmuje. */
  fields?: readonly (typeof GEAR_EXTRA_FIELDS[number])[];
  /** Sprawdzenia pól wpisu (komunikaty dla generatora). */
  check?: (g: Gear) => string[];
  /** Punkty odniesienia dla generatora poleceń (liczby z EQUIP i modelu). */
  ref?: () => string[];
};

const BAR_LEN = 220;
const sidesOf = (g: Gear): Side[] => g.trzyma === 'R' ? ['R'] : g.trzyma === 'L' ? ['L'] : [...SIDES];
const avg = (vs: V3[]): V3 => mul(vs.reduce((a, v) => add(a, v), [0, 0, 0] as V3), 1 / vs.length);
/** Kontakt ciała ze ścianą: dopuszczalne przenikanie (cm). */
export const WALL_CONTACT = 1.5;
const BELL_BACK: V3 = norm([-1, -0.15, 0]);
const f1 = (x: number): string => String(Math.round(x * 10) / 10).replace('.', ',');
const bounds = (name: string, v: number | undefined, lo: number, hi: number): string[] => v !== undefined && (v < lo || v > hi) ? [`sprzęt: ${name} = ${v} cm poza przedziałem ${lo}–${hi} cm`] : [];
export const GEAR_KINDS: Record<GearName, GearKind> = {
  sztanga: {
    caps: ['pullup.bar', 'rings', 'barbell', 'ez_bar', 'axle_bar'], opis: 'sztanga albo drążek poziomy; gryf łamany (dlugosc 120) i gruby rysujemy jak sztangę (x, y, dlugosc, talerze, podazaZaChwytem, trzyma)',
    props: (g, grips) => { const c: V3 = g.podazaZaChwytem ? [(grips.R[0] + grips.L[0]) / 2, (grips.R[1] + grips.L[1]) / 2, 0] : [g.x ?? 0, g.y ?? 0, 0]; return [{ k: 'barbell', c, plates: g.talerze !== false, held: g.trzyma === 'R' || g.trzyma === 'L' ? g.trzyma : true, len: g.dlugosc ?? BAR_LEN }]; },
  },
  slupek: {
    caps: ['rack', 'bench.uprights', 'rack.safeties'], fields: ['hak'], opis: 'słupek pionowy albo stojak (x, h, hak)',
    props: g => [{ k: 'post', x: g.x ?? 0, h: g.h ?? 200, ...(g.hak !== undefined ? { hook: g.hak } : {}) }],
    check: g => g.hak !== undefined && g.h !== undefined && g.hak > g.h ? [`sprzęt: hak = ${g.hak} cm wyżej niż słupek (h = ${g.h} cm)`] : [],
    ref: () => [
      `slupek jako STOJAK (klatka, stojaki ławki, asekuracja): x = położenie słupków w osi x, h = wysokość (typowo 200–230 cm), hak = wysokość haka na sztangę (cm; rysowany haczyk ${f1(5)} cm do przodu). Z boku widać jeden słupek, z przodu dwa (z = ±${f1(EQUIP.postSpan)} cm, grubość ${f1(EQUIP.postW)} cm). Słupki stoją poza zasięgiem ciała, więc kolizje z ciałem nie występują, a położenie względem sztangi NIE jest sprawdzane programem (ocenia je recenzent ruchu): sztangę zdjętą ze stojaka trzymaj przed słupkami albo za nimi (nie w osi słupków), a w haku tylko w pozycji, w której ćwiczenie ją odkłada.`,
    ] },
  podloga: { caps: [], opis: 'podłoga (x0, x1)', props: g => [{ k: 'floor', x0: g.x0 ?? -120, x1: g.x1 ?? 120 }] },
  smith: {
    caps: ['smith'], opis: 'prowadnica suwnicy Smitha (x, h); sztanga o podazaZaChwytem: true porusza się po niej tylko w pionie',
    props: g => [{ k: 'rail', x: g.x ?? 0, h: g.h ?? 200 }],
    ref: () => [
      `smith: suwnica Smitha = pionowa prowadnica w x (rysunek: z boku linia, z przodu dwie w z = ±${f1(EQUIP.railSpan)} cm) o wysokości h (typowo 190–210 cm). Sztanga jest nadal wpisem sztanga (talerze: true, podazaZaChwytem: true), ale w KAŻDEJ klatce jej oś leży w x prowadnicy (± ${f1(TOL.rail)} cm): chwyt dłoni x = x prowadnicy, sztanga porusza się tylko w pionie (y); ruch do przodu/tyłu wykonuje ciało względem sztangi, nie sztanga. Prowadnica nie ma pochylenia (uproszczenie).`,
    ],
  },
  landmine: {
    caps: ['landmine'], fields: ['z'], opis: 'gryf landmine: oś obrotu przy podłodze (x, y, z), długość gryfu (dlugosc), dłonie na końcu gryfu (trzyma)',
    props: (g, grips) => [{ k: 'pivot', from: [g.x ?? 0, g.y ?? 5, g.z ?? 0], to: avg(sidesOf(g).map(s => grips[s])), len: g.dlugosc ?? EQUIP.landmineLen }],
    check: g => [...bounds('dlugosc gryfu landmine', g.dlugosc, 100, 300), ...(g.y !== undefined && (g.y < 0 || g.y > 30) ? [`sprzęt: wysokość osi obrotu y = ${g.y} cm poza przedziałem 0–30 cm`] : [])],
    ref: () => {
      const L = EQUIP.landmineLen; const ex = (px: number, gx: number): string => `grip.x = ${gx} → y ≈ ${f1(5 + Math.sqrt(L * L - (gx - px) ** 2))}`;
      return [
        `landmine: gryf przymocowany jednym końcem do osi obrotu przy podłodze P = [x, y, z] (y domyślnie 5 cm, z domyślnie 0), drugi koniec trzymasz w dłoniach. Gryf jest SZTYWNY o długości dlugosc (domyślnie ${L} cm): w KAŻDEJ klatce środek między dłońmi (trzyma "obie"; "R"/"L" = jedna dłoń) leży na sferze o promieniu dlugosc wokół P (± ${TOL.pivot} cm). W płaszczyźnie z = 0 dla P = [175, 5, 0] (oś obrotu przed osobą): ${ex(175, 20)}; ${ex(175, 35)}; ${ex(175, 50)} (wzór: y = P.y + sqrt(dlugosc² − (grip.x − P.x)²)). Ruch dłoni po łuku: klatki co najwyżej ${Math.floor(Math.sqrt(8 * L * TOL.pivot * 0.5))} cm drogi dłoni (interpolacja liniowa skraca łuk). Sztangi NIE dodawaj osobno — gryf landmine jest tym prętem; gryf nie przenika ciała (poza dłońmi).`,
      ];
    },
  },
  sciana: {
    caps: ['wall'], fields: ['przed'], opis: 'ściana (x, h, przed)',
    props: g => [{ k: 'wall', x: g.x ?? 0, h: g.h ?? 250, ...(g.przed ? { front: true } : {}) }],
    contacts: () => [{ body: '', equip: 'wall', tol: WALL_CONTACT }],
    check: g => g.h !== undefined && (g.h < 100 || g.h > 400) ? [`sprzęt: wysokość ściany h = ${g.h} cm poza przedziałem 100–400 cm`] : [],
    ref: () => [
      `sciana: ściana pionowa o grubości ${f1(EQUIP.wallW)} cm, powierzchnia robocza w x, wysokość h (domyślnie 250). Domyślnie lita po stronie −x od x, czyli ZA osobą (plecy, siedzenie przy ścianie: ćwiczenie „Wall Sit”); przed: true = lita po stronie +x, czyli PRZED osobą (piłka rzucana w ścianę, stójka na rękach przodem do ściany, rozciąganie z dłońmi na ścianie). Ciało dotyka ściany: dozwolone przenikanie do ${f1(WALL_CONTACT)} cm (kontakt), głębiej odrzucane; dłonie i plecy opieraj o powierzchnię x (± 1,5 cm).`,
    ],
  },
  gryf_szesciokatny: {
    caps: ['trap_bar'], opis: 'gryf sześciokątny (trap bar): uchwyty w z = ±29, środek między dłońmi',
    props: (g, grips) => [{ k: 'trapbar', c: avg(SIDES.map(s => grips[s])) }],
    ref: () => [
      `gryf_szesciokatny: gryf sześciokątny (trap bar) bez własnych współrzędnych — środek gryfu = środek między dłońmi, uchwyty leżą wzdłuż z w z = ±${f1(EQUIP.trapW)} cm (rozstaw ${f1(2 * EQUIP.trapW)} cm), każdy długości 14 cm wzdłuż x. W KAŻDEJ klatce dłonie: z = ±${f1(EQUIP.trapW)} (± 0,6 cm), x i y obu dłoni takie same (± 0,6 cm), x dłoni w obrębie ±7 cm od środka. Z boku widać gryf i tarczę talerza o promieniu ${f1(EQUIP.plateR)} cm (tło, bez kolizji).`,
    ],
  },
  skrzynia: { caps: ['box', 'bench.flat'], opis: 'skrzynia, stopień albo ławka płaska (x0, x1, top)', props: g => [{ k: 'box', x0: g.x0 ?? 0, x1: g.x1 ?? 40, top: g.top ?? 40 }] },
  hantel: {
    caps: ['db', 'farmers_handles'], fields: ['promien', 'pionowo'], opis: 'hantel trzymany w dłoni; uchwyty farmerskie rysujemy jak hantle z dużym promieniem (trzyma, promien, pionowo)',
    props: (g, grips) => g.pionowo
      ? [{ k: 'dumbbell', c: avg(sidesOf(g).map(s => grips[s])), side: 'R', vertical: true, r: g.promien, held: true }]
      : sidesOf(g).map((s): Prop => ({ k: 'dumbbell', c: grips[s], side: s, r: g.promien, held: true })),
    check: g => bounds('promien hantla', g.promien, 3, 12),
    ref: () => [
      `hantel: środek hantla = środek chwytu dłoni w każdej klatce (hantel podąża za dłonią, nie podajesz jego położenia). trzyma: "obie" (domyślnie) = dwa hantle, po jednym w każdej dłoni; "R" albo "L" = jeden hantel w jednej dłoni (druga ręka wolna). Główka to koło o promieniu ${f1(EQUIP.dbHeadR)} cm (promien) wokół chwytu — ciało nie może jej przenikać (hantel w zwisie obok uda: z dłoni co najmniej ±${Math.ceil(BODY.hipHalf + GIRTH.thigh[0] + EQUIP.dbHeadR)} cm, bo udo ma oś na z = ±${f1(BODY.hipHalf)} i promień ${f1(GIRTH.thigh[0])} cm).`,
      `hantel pionowo: true = JEDEN hantel trzymany pionowo obiema dłońmi (np. goblet, przysiad z hantlem): środek hantla = środek między dłońmi, dłonie nie dalej niż 13 cm od siebie (z = ±3…6). Rysunek: dwie główki ${f1(EQUIP.dbHandle * 1.5)} cm od siebie (jedna nad drugą).`,
    ],
  },
  kettlebell: {
    caps: ['kb'], fields: ['promien', 'dzwon'], opis: 'kettlebell trzymany za rączkę (trzyma, promien, dzwon)',
    props: (g, grips) => {
      const ss = sidesOf(g); const bell = g.dzwon === 'wzdluz' ? 'along' as const : g.dzwon === 'tyl' ? 'back' as const : 'down' as const;
      const mk = (c: V3, side: 'R' | 'L' | 'C'): Prop => ({ k: 'kettlebell', c, side, r: g.promien, held: true, bell, ...(bell === 'back' ? { dir: BELL_BACK } : {}) });
      return g.trzyma === 'R' || g.trzyma === 'L' ? [mk(grips[g.trzyma], g.trzyma)] : [mk(avg(ss.map(s => grips[s])), 'C')];
    },
    check: g => bounds('promien dzwonu', g.promien, 5, 15),
    ref: () => [
      `kettlebell: środek rączki = środek chwytu (obie dłonie na rączce: odległość dłoni od środka rączki ≤ 7 cm, czyli z = ±2…5). trzyma: "obie" (domyślnie) = jeden kettlebell trzymany obiema dłońmi (swing, goblet), "R"/"L" = jeden kettlebell w jednej dłoni. Dzwon (kula o promieniu ${f1(EQUIP.kbBallR)} cm, promien) ma środek ${f1(EQUIP.kbBallR + 2)} cm od rączki; kierunek wybierasz polem dzwon (stałe w całym ruchu):`,
      'dzwon "dol" (domyślnie) = dzwon pod rączką (goblet, martwy ciąg, zwis); "wzdluz" = dzwon w przedłużeniu przedramienia (swing, clean, snatch w fazie zwisu i wyrzutu; gdy przedramię jest uniesione powyżej poziomu, dzwon płynnie przechodzi za przedramię); "tyl" = dzwon za rączką w kierunku −x (pozycja rack i nad głową).',
    ],
  },
  talerz: {
    caps: ['plate'], fields: ['promien', 'przesuniecie'], opis: 'talerz trzymany za brzegi (trzyma, promien, przesuniecie)',
    props: (g, grips) => {
      const r = g.promien ?? EQUIP.plateR; const ss = sidesOf(g);
      return [{ k: 'plate', c: add(avg(ss.map(s => grips[s])), g.przesuniecie ?? (ss.length === 1 ? [0, -(r - 1), 0] : [0, 0, 0])), r: g.promien, held: g.trzyma === 'R' || g.trzyma === 'L' ? g.trzyma : true }];
    },
    check: g => bounds('promien talerza', g.promien, 8, 30),
    ref: () => [
      `talerz: tarcza o promieniu ${f1(EQUIP.plateR)} cm (promien; talerz 20 kg) w płaszczyźnie y–z, powierzchnią do przodu (z boku widać cienki pas ${f1(EQUIP.plateW)} cm). Dłonie leżą na OBRĘCZY (odległość dłoni od okręgu ≤ 3 cm). Środek talerza = środek między dłońmi + przesuniecie. Domyślnie (trzyma "obie", przesuniecie [0,0,0]) dłonie na wysokości środka talerza po bokach: chwyt = [x, y, ±${f1(EQUIP.plateR - 1.5)}] i środek talerza [x, y, 0]. Chwyt jedna dłoń nad drugą (za górną i dolną krawędź) nie jest obsługiwany — ustaw dłonie po bokach.`,
      `talerz trzymany jedną dłonią (trzyma "R"/"L"): domyślne przesuniecie [0, −${f1(EQUIP.plateR - 1)}, 0] (chwyt za górną krawędź, talerz wisi pod dłonią).`,
    ],
  },
  pilka_lekarska: {
    caps: ['med_ball'], fields: ['promien', 'przesuniecie'], opis: 'piłka lekarska (trzyma, promien, przesuniecie)',
    props: (g, grips) => {
      const r = g.promien ?? EQUIP.medBallR; const ss = sidesOf(g);
      return [{ k: 'ball', c: add(avg(ss.map(s => grips[s])), g.przesuniecie ?? (ss.length === 1 ? [0, r - 1, 0] : [0, 0, 0])), r: g.promien, held: g.trzyma === 'R' || g.trzyma === 'L' ? g.trzyma : true }];
    },
    check: g => bounds('promien piłki', g.promien, 6, 20),
    ref: () => [
      `pilka_lekarska: kula o promieniu ${f1(EQUIP.medBallR)} cm (promien; piłka ok. 4 kg). Dłonie leżą na POWIERZCHNI (odległość dłoni od środka = promień ± 3 cm). Środek piłki = środek między dłońmi + przesuniecie. Domyślnie (trzyma "obie", przesuniecie [0,0,0]) dłonie po bokach piłki: chwyt = [x, y, ±${f1(EQUIP.medBallR)}], piłka [x, y, 0]. Chwyt od dołu (rzut spod kolan, scoop): dłonie pod piłką, przesuniecie [0, ${f1(EQUIP.medBallR - 1)}, 0]. Jedna dłoń ("R"/"L"): domyślnie piłka na dłoni (przesuniecie [0, ${f1(EQUIP.medBallR - 1)}, 0]). Piłka jest w dłoniach w każdej klatce (moment wyrzutu nie jest pokazywany); nie może wejść pod podłogę ani w ciało.`,
    ],
  },
};

/** Skierowanie dzwonu kettlebell „wzdłuż przedramienia” liczone ze szkieletu: przedłużenie przedramienia, a gdy jest uniesione powyżej poziomu — płynnie za przedramię. */
export function resolveBells(f: Frame): Frame {
  if (!f.props.some(p => p.k === 'kettlebell' && p.bell === 'along')) return f;
  const props = f.props.map((p): Prop => {
    if (p.k !== 'kettlebell' || p.bell !== 'along') return p;
    const ss = p.side === 'R' || p.side === 'L' ? [p.side] : SIDES;
    const fv = norm(avg(ss.map(s => norm(sub(f.sk.arms[s].grip, f.sk.arms[s].elbow)))));
    const t = clamp((fv[1] - 0.2) / 0.4, 0, 1);
    return { ...p, dir: norm(add(mul(fv, 1 - t), mul(norm([-0.8, -0.6, 0]), t))) };
  });
  return { ...f, props };
}

/** Sprawdzenia całego zestawu sprzętu (zależności między wpisami). */
export function gearSetIssues(gear: Gear[]): string[] {
  const out: string[] = [];
  if (gear.some(g => g.rodzaj === 'smith') && !gear.some(g => g.rodzaj === 'sztanga')) out.push('sprzęt: smith wymaga wpisu sztanga (talerze: true, podazaZaChwytem: true) — sztanga porusza się po prowadnicy');
  if (gear.filter(g => g.rodzaj === 'smith').length > 1) out.push('sprzęt: dokładnie jedna prowadnica smith');
  return out;
}

/** Pola sprzętu użyte w niewłaściwym rodzaju (komunikaty dla generatora). */
export function gearFieldIssues(g: Gear): string[] {
  const own = GEAR_KINDS[g.rodzaj].fields ?? [];
  return [
    ...GEAR_EXTRA_FIELDS.filter(f => g[f] !== undefined && !own.includes(f)).map(f => `sprzęt: pole „${f}” nie dotyczy rodzaju „${g.rodzaj}”${own.length ? ` (dla tego rodzaju: ${own.join(', ')})` : ''}`),
    ...(GEAR_KINDS[g.rodzaj].check?.(g) ?? []),
  ];
}

/** Dozwolone kontakty ciała ze sprzętem zadeklarowane przez wpisy sprzętu. */
export function contactsFrom(gear: Gear[]): Contact[] { return gear.flatMap(g => GEAR_KINDS[g.rodzaj].contacts?.(g) ?? []); }

/** Możliwości katalogu pokryte przez rejestr (wszystkie rodzaje). */
export const GEAR_CAPS: readonly string[] = Object.values(GEAR_KINDS).flatMap(k => k.caps);

/** Sprzęt jako rekwizyty sceny; sprzęt „podążający za chwytem” leży między dłońmi albo w dłoni. */
export function propsFrom(gear: Gear[], grips: GearGrips): Prop[] { return gear.flatMap(g => GEAR_KINDS[g.rodzaj].props(g, grips)); }
