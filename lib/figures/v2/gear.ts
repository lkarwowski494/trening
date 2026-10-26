/*
 * Figury v2 — SPRZĘT W KONTRAKCIE DANYCH (docs/50 rozdz. 10, docs/53, docs/54): rejestr rodzajów sprzętu, które generator może wpisać w `sprzet[]` pozy.
 * Każdy rodzaj to parametryczny prymityw: pola, rekwizyt(y) sceny (rysunek i kolidery w draw.ts/colliders.ts), możliwości katalogu ćwiczeń (`caps`), które pokrywa,
 * sprawdzenia pól i punkty odniesienia dla generatora poleceń (`ref`, liczby z EQUIP). Wymiary w EQUIP (draw.ts) są „konwencją rysunku”
 * (status i powód: data/zrodla/figury-sprzet.json). Czysty moduł (bez React).
 */
import { add, clamp, mul, norm, rad, sub, type V3 } from './math';
import { BODY, GIRTH, SIDES, type Side } from './skeleton';
import { EQUIP } from './draw';
import { TOL } from './colliders';
import { BENCH } from './rigs/benchPress';
import type { Contact, Frame, Prop } from './scene';

export const GEAR = ['sztanga', 'slupek', 'podloga', 'skrzynia', 'hantel', 'kettlebell', 'talerz', 'pilka_lekarska', 'smith', 'landmine', 'sciana', 'gryf_szesciokatny', 'lancuchy', 'wyciag', 'lawka', 'guma', 'pilka_gimnastyczna', 'rolka', 'dzwignia', 'modlitewnik', 'zawieszenie', 'lina_pionowa', 'sanie', 'poreczy'] as const;
export type GearName = typeof GEAR[number];
export type Gear = { rodzaj: GearName; x?: number; y?: number; h?: number; x0?: number; x1?: number; top?: number; talerze?: boolean; podazaZaChwytem?: boolean; trzyma?: 'obie' | 'R' | 'L'; dlugosc?: number; promien?: number; pionowo?: boolean; dzwon?: 'dol' | 'wzdluz' | 'tyl'; przesuniecie?: V3; hak?: number; z?: number; przed?: boolean; dwa?: boolean; chwyt?: typeof CABLE_ATTACH[number]; kat?: number; walki?: boolean; mocowanie?: typeof BAND_MOUNT[number]; tryb?: typeof LEVER_MODE[number]; punkt?: typeof LEVER_POINT[number]; siedzisko?: number; trzymanie?: typeof SLED_HOLD[number] };
/** Pola sprzętu wprowadzone po pierwszej wersji kontraktu: dozwolone tylko dla rodzajów, które je wymieniają w `fields`. */
export const GEAR_EXTRA_FIELDS = ['promien', 'pionowo', 'dzwon', 'przesuniecie', 'hak', 'z', 'przed', 'dwa', 'chwyt', 'kat', 'walki', 'mocowanie', 'tryb', 'punkt', 'siedzisko', 'trzymanie'] as const;
export const BELL_MODES = ['dol', 'wzdluz', 'tyl'] as const;
/** Osprzęt linki wyciągu: uchwyt (jeden na dłoń), lina (dwa końce), drążek (prosty, między dłońmi), kostka (opaska na kostkę). */
export const CABLE_ATTACH = ['uchwyt', 'lina', 'drazek', 'kostka'] as const;
/** Mocowanie gumy oporowej: zaczep (stały punkt x, y, z), stopy (guma pod stopami), kostki (pętla między kostkami), dlonie (guma między dłońmi), sztanga (od końców gryfu do punktu pod/nad). */
export const BAND_MOUNT = ['zaczep', 'stopy', 'kostki', 'dlonie', 'sztanga'] as const;
/** Dźwignia maszyny: obrót wokół osi (sztywne ramię) albo prowadnica liniowa (skok po prostej); punkt mocowania: dłonie, kostki, miednica. */
export const LEVER_MODE = ['obrot', 'prosta'] as const;
export const LEVER_POINT = ['dlonie', 'kostki', 'miednica'] as const;
/** Sposób trzymania sań: słupki (dłonie na uchwytach sań, pchanie) albo lina (linka od sań do dłoni, ciągnięcie). */
export const SLED_HOLD = ['slupki', 'lina'] as const;
/** Kąt oparcia ławki (stopnie, 0 = płasko, dodatni = skos głową wyżej, ujemny = głową niżej) wg możliwości katalogu — konwencja rysunku. */
export const BENCH_KAT = { min: -45, max: 90, flat: [-5, 5], incline: [10, 90], decline: [-45, -5] } as const;
/** Wysokość bloczka stacji wyciągów (cm) wg możliwości katalogu — konwencja rysunku (data/zrodla/figury-sprzet.json → wyciag): niski, środkowy, wysoki. */
export const CABLE_Y = { low: [5, 60], mid: [70, 160], high: [150, 240] } as const;

export type GearGrips = Record<Side, V3>;
export type GearKind = {
  /** Krótka nazwa w komunikatach (np. „hantle”). */
  nazwa: string;
  /** Możliwości katalogu ćwiczeń (lib/catalog.generated.ts → requires), które ten rodzaj pozwala narysować. */
  caps: readonly string[];
  /** Krótki opis do generatora poleceń (jak wypełnić pola). */
  opis: string;
  /** Rekwizyty sceny dla wpisu sprzętu (chwyty rąk potrzebne sprzętowi trzymanemu w dłoni). */
  props: (g: Gear, grips: GearGrips, all: Gear[], ankles: GearGrips, pelvis: V3) => Prop[];
  /** Czy wpis spełnia możliwość katalogu (np. bloczek wysoki ↔ cable.high); domyślnie tak. */
  capOk?: (cap: string, g: Gear) => boolean;
  /** Opis możliwości dla generatora poleceń (jak ją narysować); brak = opis ogólny. */
  capLabel?: Record<string, string>;
  /** Wymaganie możliwości w zrozumiałej formie (do komunikatu, gdy wpis nie spełnia capOk). */
  capNeed?: Record<string, string>;
  /** Możliwości, których obecność w pozie nie jest wymagana (sprzęt tła, np. stojak). */
  optionalCaps?: readonly string[];
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
/**
 * Środek miednicy osoby na ławce o zawiasie w x = 0 i siedzisku na wysokości seatY: leżąc/półleżąc (kat ≤ 45°) tak jak w rigu wyciskania leżąc (miednica BENCH.padBack nad oparciem,
 * wzdłuż normalnej do oparcia); siedząc (kat > 45°) miednica styka się z siedziskiem i oparciem (leży na dwusiecznej kąta między nimi).
 */
export function benchHip(kat: number, seatY: number): V3 {
  const th = rad(kat);
  if (kat <= 45) return [BENCH.padBack * Math.sin(th), seatY + BENCH.padBack * Math.cos(th), 0];
  const sx = 1 - Math.cos(th), sy = Math.sin(th); const l = Math.hypot(sx, sy); const dd = BENCH.padBack / Math.cos(th / 2);
  return [dd * sx / l, seatY + dd * sy / l, 0];
}

/** Dozwolone kontakty ciała z ławką (jak w rigu wyciskania leżąc, docs/50): plecy/miednica/uda/głowa 1,5 cm, ramię 6 cm, przedramię 2,5 cm; sztanga na klatce: tułów 2,6 cm, ramię 2,2 cm. */
const BENCH_CONTACTS: Contact[] = [
  { body: 'torso', equip: 'benchBack', tol: 1.5 }, { body: 'pelvis', equip: 'benchSeat', tol: 1.5 }, { body: 'pelvis', equip: 'benchBack', tol: 1.5 }, { body: 'thigh', equip: 'benchSeat', tol: 1.5 }, { body: 'torso', equip: 'benchSeat', tol: 1.5 },
  { body: 'uarm', equip: 'benchBack', tol: 6 }, { body: 'uarm', equip: 'benchSeat', tol: 6 }, { body: 'farm', equip: 'benchBack', tol: 2.5 }, { body: 'farm', equip: 'benchSeat', tol: 2.5 }, { body: 'head', equip: 'benchBack', tol: 1.5 },
  { body: 'torso', equip: 'bar', tol: 2.6 }, { body: 'uarm', equip: 'bar', tol: 2.2 },
];
/** Dopuszczalne wgniecenie miękkiego sprzętu (piłka gimnastyczna, wałek piankowy) przy kontakcie z ciałem (cm). */
export const SOFT_CONTACT = { gymBall: 3, roll: 2 } as const;
/** Dozwolone kontakty ciała z modlitewnikiem: ramiona i przedramiona na podpórce, klatka przy jej górnym końcu, miednica i uda na siedzisku. */
const PREACHER_CONTACTS: Contact[] = [
  { body: 'uarm', equip: 'preacherPad', tol: 3 }, { body: 'farm', equip: 'preacherPad', tol: 3 }, { body: 'torso', equip: 'preacherPad', tol: 2 }, { body: 'pelvis', equip: 'preacherSeat', tol: 1.5 }, { body: 'thigh', equip: 'preacherSeat', tol: 1.5 },
];
/** Kontakt ciała ze ścianą: dopuszczalne przenikanie (cm). */
export const WALL_CONTACT = 1.5;
const BELL_BACK: V3 = norm([-1, -0.15, 0]);
const f1 = (x: number): string => String(Math.round(x * 10) / 10).replace('.', ',');
const bounds = (name: string, v: number | undefined, lo: number, hi: number): string[] => v !== undefined && (v < lo || v > hi) ? [`sprzęt: ${name} = ${v} cm poza przedziałem ${lo}–${hi} cm`] : [];
export const GEAR_KINDS: Record<GearName, GearKind> = {
  sztanga: {
    nazwa: 'sztanga albo drążek',
    caps: ['pullup.bar', 'rings', 'barbell', 'ez_bar', 'axle_bar'], opis: 'sztanga albo drążek poziomy; gryf łamany (dlugosc 120) i gruby rysujemy jak sztangę (x, y, dlugosc, talerze, podazaZaChwytem, trzyma)',
    props: (g, grips) => { const c: V3 = g.podazaZaChwytem ? [(grips.R[0] + grips.L[0]) / 2, (grips.R[1] + grips.L[1]) / 2, 0] : [g.x ?? 0, g.y ?? 0, 0]; return [{ k: 'barbell', c, plates: g.talerze !== false, held: g.trzyma === 'R' || g.trzyma === 'L' ? g.trzyma : true, len: g.dlugosc ?? BAR_LEN }]; },
  },
  slupek: {
    nazwa: 'stojak (słupek)',
    caps: ['rack', 'bench.uprights', 'rack.safeties'], optionalCaps: ['rack', 'bench.uprights', 'rack.safeties'], fields: ['hak'], opis: 'słupek pionowy albo stojak (x, h, hak)',
    props: g => [{ k: 'post', x: g.x ?? 0, h: g.h ?? 200, ...(g.hak !== undefined ? { hook: g.hak } : {}) }],
    check: g => g.hak !== undefined && g.h !== undefined && g.hak > g.h ? [`sprzęt: hak = ${g.hak} cm wyżej niż słupek (h = ${g.h} cm)`] : [],
    ref: () => [
      `slupek jako STOJAK (klatka, stojaki ławki, asekuracja): x = położenie słupków w osi x, h = wysokość (typowo 200–230 cm), hak = wysokość haka na sztangę (cm; rysowany haczyk ${f1(5)} cm do przodu). Z boku widać jeden słupek, z przodu dwa (z = ±${f1(EQUIP.postSpan)} cm, grubość ${f1(EQUIP.postW)} cm). Słupki stoją poza zasięgiem ciała, więc kolizje z ciałem nie występują, a położenie względem sztangi NIE jest sprawdzane programem (ocenia je recenzent ruchu): sztangę zdjętą ze stojaka trzymaj przed słupkami albo za nimi (nie w osi słupków), a w haku tylko w pozycji, w której ćwiczenie ją odkłada.`,
    ] },
  podloga: { nazwa: 'podłoga', caps: [], opis: 'podłoga (x0, x1)', props: g => [{ k: 'floor', x0: g.x0 ?? -120, x1: g.x1 ?? 120 }] },
  smith: {
    nazwa: 'suwnica Smitha',
    caps: ['smith'], opis: 'prowadnica suwnicy Smitha (x, h); sztanga o podazaZaChwytem: true porusza się po niej tylko w pionie',
    props: g => [{ k: 'rail', x: g.x ?? 0, h: g.h ?? 200 }],
    ref: () => [
      `smith: suwnica Smitha = pionowa prowadnica w x (rysunek: z boku linia, z przodu dwie w z = ±${f1(EQUIP.railSpan)} cm) o wysokości h (typowo 190–210 cm). Sztanga jest nadal wpisem sztanga (talerze: true, podazaZaChwytem: true), ale w KAŻDEJ klatce jej oś leży w x prowadnicy (± ${f1(TOL.rail)} cm): chwyt dłoni x = x prowadnicy, sztanga porusza się tylko w pionie (y); ruch do przodu/tyłu wykonuje ciało względem sztangi, nie sztanga. Prowadnica nie ma pochylenia (uproszczenie).`,
    ],
  },
  landmine: {
    nazwa: 'landmine',
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
    nazwa: 'ściana',
    caps: ['wall'], fields: ['przed'], opis: 'ściana (x, h, przed)',
    props: g => [{ k: 'wall', x: g.x ?? 0, h: g.h ?? 250, ...(g.przed ? { front: true } : {}) }],
    contacts: () => [{ body: '', equip: 'wall', tol: WALL_CONTACT }],
    check: g => g.h !== undefined && (g.h < 100 || g.h > 400) ? [`sprzęt: wysokość ściany h = ${g.h} cm poza przedziałem 100–400 cm`] : [],
    ref: () => [
      `sciana: ściana pionowa o grubości ${f1(EQUIP.wallW)} cm, powierzchnia robocza w x, wysokość h (domyślnie 250). Domyślnie lita po stronie −x od x, czyli ZA osobą (plecy, siedzenie przy ścianie: ćwiczenie „Wall Sit”); przed: true = lita po stronie +x, czyli PRZED osobą (piłka rzucana w ścianę, stójka na rękach przodem do ściany, rozciąganie z dłońmi na ścianie). Ciało dotyka ściany: dozwolone przenikanie do ${f1(WALL_CONTACT)} cm (kontakt), głębiej odrzucane; dłonie i plecy opieraj o powierzchnię x (± 1,5 cm).`,
    ],
  },
  gryf_szesciokatny: {
    nazwa: 'gryf sześciokątny (trap bar)',
    caps: ['trap_bar'], opis: 'gryf sześciokątny (trap bar): uchwyty w z = ±29, środek między dłońmi',
    props: (g, grips) => [{ k: 'trapbar', c: avg(SIDES.map(s => grips[s])) }],
    ref: () => [
      `gryf_szesciokatny: gryf sześciokątny (trap bar) bez własnych współrzędnych — środek gryfu = środek między dłońmi, uchwyty leżą wzdłuż z w z = ±${f1(EQUIP.trapW)} cm (rozstaw ${f1(2 * EQUIP.trapW)} cm), każdy długości 14 cm wzdłuż x. W KAŻDEJ klatce dłonie: z = ±${f1(EQUIP.trapW)} (± 0,6 cm), x i y obu dłoni takie same (± 0,6 cm), x dłoni w obrębie ±7 cm od środka. Z boku widać gryf i tarczę talerza o promieniu ${f1(EQUIP.plateR)} cm (tło, bez kolizji).`,
    ],
  },
  lancuchy: {
    nazwa: 'łańcuchy',
    caps: ['chains'], opis: 'łańcuchy zawieszone na sztandze (albo trzymane w dłoniach, gdy nie ma sztangi) i opadające na podłogę',
    props: (g, grips, all, ankles, pelvis) => {
      const bar = all.find(x => x.rodzaj === 'sztanga');
      if (bar) { const [b] = GEAR_KINDS.sztanga.props(bar, grips, all, ankles, pelvis); if (b.k !== 'barbell') return []; return [-1, 1].map((sg): Prop => ({ k: 'chain', from: [b.c[0], b.c[1], sg * EQUIP.chainZ], to: [b.c[0], 0, sg * EQUIP.chainZ] })); }
      return SIDES.map((s): Prop => ({ k: 'chain', from: grips[s], to: [grips[s][0], 0, grips[s][2]] }));
    },
    ref: () => [
      `lancuchy: dwa łańcuchy opadające prosto w dół na podłogę, zawieszone na końcach gryfu (z = ±${f1(EQUIP.chainZ)} cm od osi, x i y jak sztanga) — gdy w sprzet[] jest sztanga; bez sztangi (ćwiczenia z łańcuchami w dłoniach) wiszą z dłoni. Rysunek: linia przerywana od sztangi (dłoni) do podłogi. Łańcuchy nie mają kolidera i nie mają własnych pól: pokazują tylko, że ćwiczenie jest z łańcuchami (obciążenie rośnie z wysokością sztangi — tego rysunek nie pokazuje).`,
    ],
  },
  wyciag: {
    nazwa: 'wyciąg',
    caps: ['cable.high', 'cable.mid', 'cable.low', 'cable.dual', 'cable.row_seat', 'lat_pulldown', 'ankle_strap', 'cable.handles', 'cable.rope'], fields: ['z', 'dwa', 'chwyt'],
    opis: 'wyciąg: kolumna z bloczkiem na wysokości y i linka do osprzętu w dłoniach albo na kostce (x, y, z, h, dwa, chwyt, trzyma)',
    capLabel: { 'cable.high': 'wyciąg z bloczkiem wysokim', 'cable.mid': 'wyciąg z bloczkiem na średniej wysokości', 'cable.low': 'wyciąg z bloczkiem niskim', 'cable.dual': 'dwa wyciągi', 'cable.row_seat': 'stacja do wiosłowania (bloczek niski)', lat_pulldown: 'wyciąg górny do ściągania (bloczek wysoki)', ankle_strap: 'opaska na kostkę', 'cable.handles': 'uchwyty do linki', 'cable.rope': 'lina do wyciągu' },
    capNeed: { 'cable.high': `bloczek wysoki: y ${CABLE_Y.high[0]}–${CABLE_Y.high[1]} cm`, lat_pulldown: `bloczek wysoki: y ${CABLE_Y.high[0]}–${CABLE_Y.high[1]} cm`, 'cable.mid': `bloczek środkowy: y ${CABLE_Y.mid[0]}–${CABLE_Y.mid[1]} cm`, 'cable.low': `bloczek niski: y ${CABLE_Y.low[0]}–${CABLE_Y.low[1]} cm`, 'cable.row_seat': `bloczek niski: y ${CABLE_Y.low[0]}–${CABLE_Y.low[1]} cm`, 'cable.dual': 'dwa: true (dwa wyciągi)', ankle_strap: 'chwyt: "kostka"', 'cable.handles': 'chwyt: "uchwyt"', 'cable.rope': 'chwyt: "lina"' },
    capOk: (cap, g) => {
      const y = g.y ?? 20; const within = (r: readonly [number, number]): boolean => y >= r[0] && y <= r[1];
      switch (cap) {
        case 'cable.high': case 'lat_pulldown': return within(CABLE_Y.high);
        case 'cable.mid': return within(CABLE_Y.mid);
        case 'cable.low': case 'cable.row_seat': return within(CABLE_Y.low);
        case 'cable.dual': return g.dwa === true;
        case 'ankle_strap': return g.chwyt === 'kostka';
        case 'cable.handles': return (g.chwyt ?? 'uchwyt') === 'uchwyt';
        case 'cable.rope': return g.chwyt === 'lina';
        default: return true;
      }
    },
    props: (g, grips, _all, ankles) => {
      const x = g.x ?? 0, y = g.y ?? 20, h = g.h ?? 230; const kind = g.chwyt ?? 'uchwyt'; const ss = sidesOf(g);
      const at = (s: Side): V3 => kind === 'kostka' ? ankles[s] : grips[s];
      const attach = kind === 'uchwyt' ? 'handle' as const : kind === 'lina' ? 'rope' as const : kind === 'drazek' ? 'bar' as const : 'strap' as const;
      if (g.dwa) return ss.flatMap((s): Prop[] => { const z = (s === 'R' ? 1 : -1) * Math.abs(g.z ?? EQUIP.cableSpan); return [{ k: 'tower', x, z, h, solid: true }, { k: 'cable', from: [x, y, z], to: at(s), attach, ends: [at(s)], solid: true }]; });
      const z = g.z ?? 0; return [{ k: 'tower', x, z, h, solid: true }, { k: 'cable', from: [x, y, z], to: avg(ss.map(at)), attach, ends: ss.map(at), solid: true }];
    },
    check: g => [
      ...(g.y !== undefined && (g.y < 5 || g.y > 240) ? [`sprzęt: wysokość bloczka y = ${g.y} cm poza przedziałem 5–240 cm`] : []),
      ...(g.h !== undefined && g.y !== undefined && g.h < g.y ? [`sprzęt: kolumna wyciągu h = ${g.h} cm niższa niż bloczek (y = ${g.y} cm)`] : []),
      ...(g.chwyt === 'kostka' && !g.dwa && g.trzyma !== 'R' && g.trzyma !== 'L' ? ['sprzęt: opaska na kostkę (chwyt: "kostka") jednego wyciągu wymaga trzyma: "R" albo "L" (kostka tej nogi)'] : []),
    ],
    ref: () => {
      const r = (k: keyof typeof CABLE_Y): string => `${CABLE_Y[k][0]}–${CABLE_Y[k][1]}`;
      return [
        `wyciag: kolumna stacji wyciągów w x (przód/tył), z (domyślnie 0) o wysokości h (domyślnie 230) z bloczkiem na wysokości y; linka biegnie prosto od bloczka do osprzętu i wyznacza KIERUNEK OPORU (ruch ćwiczenia ma być przeciw temu kierunkowi: linka napięta w całym zakresie). Wysokość bloczka wg możliwości katalogu ćwiczenia: niski y ${r('low')} cm (cable.low, cable.row_seat), środkowy ${r('mid')} cm (cable.mid), wysoki ${r('high')} cm (cable.high, lat_pulldown) — ćwiczenie z możliwości „wysoki” z y poza zakresem jest odrzucane.`,
        `wyciag, osprzęt (pole chwyt): "uchwyt" (domyślnie; kółko przy każdej dłoni), "lina" (dwa końce, lina rozwidla się od punktu między dłońmi), "drazek" (prosty drążek między dłońmi), "kostka" (opaska na kostce: trzyma "R" albo "L" wskazuje nogę; linka kończy się na kostce, kostka = cel linki, nie dłoń). Linka kończy się w punkcie osprzętu: środek między dłońmi (trzyma "obie"), jedna dłoń ("R"/"L") albo kostka.`,
        `wyciag dwa: true = dwa wyciągi, po jednym na dłoń: kolumny i bloczki w z = ±|z| (domyślnie ±${f1(EQUIP.cableSpan)} cm), każda linka do swojej dłoni (rozpiętki, wyciskanie na linkach; wymóg możliwości cable.dual). Jeden wyciąg (domyślnie): jeden bloczek w z (domyślnie 0).`,
        `wyciag, kolizje: ciało NIE przenika kolumny (prostopadłościan ${f1(EQUIP.towerW)} × ${f1(EQUIP.towerW)} cm) ani linki (poza ostatnimi ${f1(EQUIP.cableEnd)} cm przy dłoniach/kostce): ustaw osobę tak, by linka od bloczka do dłoni nie przechodziła przez tułów, głowę ani ramię (typowo stań przodem do kolumny w odległości 40–80 cm albo bokiem). Jedna kolumna na jeden wpis; kilka wpisów wyciag = kilka kolumn.`,
      ];
    },
  },
  lawka: {
    nazwa: 'ławka regulowana', caps: ['bench.flat', 'bench.incline', 'bench.decline'], fields: ['kat', 'walki', 'siedzisko'], optionalCaps: [],
    opis: 'ławka z regulowanym kątem oparcia: płaska, skośna, ujemna (x = zawias, top = wysokość siedziska, kat, dlugosc oparcia, walki na nogi)',
    capLabel: { 'bench.flat': 'ławka płaska', 'bench.incline': 'ławka skośna (głową wyżej)', 'bench.decline': 'ławka ujemna (głową niżej)' },
    capNeed: { 'bench.flat': `kat ${BENCH_KAT.flat[0]}…${BENCH_KAT.flat[1]}°`, 'bench.incline': `kat ${BENCH_KAT.incline[0]}…${BENCH_KAT.incline[1]}°`, 'bench.decline': `kat ${BENCH_KAT.decline[0]}…${BENCH_KAT.decline[1]}°` },
    capOk: (cap, g) => { const k = g.kat ?? 0; const r = cap === 'bench.flat' ? BENCH_KAT.flat : cap === 'bench.incline' ? BENCH_KAT.incline : cap === 'bench.decline' ? BENCH_KAT.decline : null; return !r || (k >= r[0] && k <= r[1]); },
    props: g => {
      const th = rad(g.kat ?? 0); const seatY = g.top ?? ((g.kat ?? 0) < 0 ? BENCH.declineSeat : BENCH.seatTop); const H: [number, number] = [g.x ?? 0, seatY]; const L = g.dlugosc ?? BENCH.backLen;
      return [{ k: 'bench', seatFrom: [H[0] + (g.siedzisko ?? BENCH.seatLen), seatY], hinge: H, backTo: [H[0] - Math.cos(th) * L, H[1] + Math.sin(th) * L], legH: seatY, ...(g.walki ? { rollers: true } : {}) }];
    },
    contacts: () => BENCH_CONTACTS,
    check: g => [
      ...(g.kat !== undefined && (g.kat < BENCH_KAT.min || g.kat > BENCH_KAT.max) ? [`sprzęt: kąt ławki kat = ${g.kat}° poza przedziałem ${BENCH_KAT.min}…${BENCH_KAT.max}°`] : []),
      ...(g.top !== undefined && (g.top < 20 || g.top > 80) ? [`sprzęt: wysokość siedziska top = ${g.top} cm poza przedziałem 20–80 cm`] : []),
      ...(g.dlugosc !== undefined && (g.dlugosc < 30 || g.dlugosc > 120) ? [`sprzęt: długość oparcia dlugosc = ${g.dlugosc} cm poza przedziałem 30–120 cm`] : []),
      ...bounds('siedzisko (długość siedziska)', g.siedzisko, 20, 70),
    ],
    ref: () => {
      const hip = (deg: number, top?: number): { hip: V3; pitch: number; sh: V3; head: V3 } => {
        const th = rad(deg); const seatY = top ?? (deg < 0 ? BENCH.declineSeat : BENCH.seatTop); const h = benchHip(deg, seatY);
        const d: V3 = [-Math.cos(th), Math.sin(th), 0]; return { hip: h, pitch: deg - 90, sh: add(h, mul(d, BODY.trunk)), head: add(h, mul(d, BODY.trunk + BODY.neckUp + BODY.headFromC7)) };
      };
      const row = (deg: number, top?: number): string => { const q = hip(deg, top); const feet = deg < 0 ? `kostki [${f1(q.hip[0] + 44)}, ${f1(BENCH.declineSeat + 6)}, ±${BENCH.footHalf}] (stopy pod wałkami)` : `kostki [${f1(q.hip[0] + BENCH.footBack)}, ${f1(BODY.ankleH)}, ±${BENCH.footHalf}] (stopy na podłodze)`; return `kat ${deg}°: miednica [${f1(q.hip[0])}, ${f1(q.hip[1])}, 0], pochylenieTulowia ${q.pitch}, bark [${f1(q.sh[0])}, ${f1(q.sh[1])}], środek głowy [${f1(q.head[0])}, ${f1(q.head[1])}] (pochylenieGlowy = pochylenieTulowia), ${feet}`; };
      return [
        `lawka: ławka z regulowanym oparciem. Zawias (styk siedziska i oparcia) w x (domyślnie 0) na wysokości top (siedzisko ${BENCH.seatTop} cm; ławka ujemna ${BENCH.declineSeat} cm); siedzisko biegnie od zawiasu o siedzisko cm (domyślnie ${BENCH.seatLen}; maszyny i ławki do siedzenia ok. 40–45) w stronę +x (stopy), oparcie o dlugosc (domyślnie ${BENCH.backLen}) cm w stronę −x pod kątem kat od poziomu: 0 = płaska, dodatni = skos (głowa wyżej), ujemny = ławka ujemna (głowa niżej). Pole kat: ławka płaska ${BENCH_KAT.flat[0]}…${BENCH_KAT.flat[1]}°, skośna ${BENCH_KAT.incline[0]}…${BENCH_KAT.incline[1]}°, ujemna ${BENCH_KAT.decline[0]}…${BENCH_KAT.decline[1]}° — kąt musi odpowiadać możliwości katalogu ćwiczenia (płaska/skośna/ujemna). Szerokość ${EQUIP.benchW} cm (z = ±${EQUIP.benchW / 2}).`,
        `lawka walki: true = wałki na nogi (ławka ujemna): wałek o promieniu ${f1(EQUIP.rollerR)} cm nad kostkami przy końcu siedziska (stopy pod wałkami: kostki ${BENCH.declineSeat + 6} cm nad podłogą, nogi nie przenikają wałka).`,
        `OSOBA NA ŁAWCE (głowa w stronę −x, stopy +x): miednica leży ${BENCH.padBack} cm nad powierzchnią — kat ≤ 45°: [x + ${BENCH.padBack}·sin(kat), top + ${BENCH.padBack}·cos(kat), 0] (leżąc); kat > 45° (siedząc): miednica styka się z siedziskiem i oparciem, na dwusiecznej kąta między nimi w odległości ${BENCH.padBack}/cos(kat/2) od zawiasu; pochylenieTulowia = kat − 90; bark = miednica + ${BODY.trunk}·[−cos(kat), sin(kat)]; pochylenieGlowy = pochylenieTulowia (głowa na oparciu). Wartości wyliczone z modelu: ${row(0)}; ${row(30)}; ${row(-15)}; ${row(75, 45)}.`,
        `lawka, kontakty: plecy, miednica, uda i głowa mogą dotykać ławki (przenikanie do 1,5 cm), ramię do 6 cm, przedramię do 2,5 cm; sztanga na klatce: tułów do 2,6 cm, ramię do 2,2 cm — głębiej odrzucane. Ławka nie ma kolidera poza siedziskiem i oparciem (dwa graniastosłupy).`,
      ];
    },
  },
  guma: {
    nazwa: 'guma oporowa', caps: ['bands'], fields: ['mocowanie', 'z'], opis: 'guma oporowa: linia sprężysta od punktu zamocowania do dłoni, kostek lub sztangi (mocowanie, x, y, z, trzyma)',
    capLabel: { bands: 'guma oporowa' },
    props: (g, grips, all, ankles, pelvis) => {
      const m = g.mocowanie ?? 'zaczep'; const ss = sidesOf(g); const band = (from: V3, to: V3): Prop => ({ k: 'band', from, to });
      if (m === 'stopy') return ss.map(s => band([ankles[s][0], 0, ankles[s][2]], grips[s]));
      if (m === 'kostki') return [band(ankles.R, ankles.L)];
      if (m === 'dlonie') return [band(grips.R, grips.L)];
      if (m === 'sztanga') { const bar = all.find(x => x.rodzaj === 'sztanga'); if (!bar) return []; const [b] = GEAR_KINDS.sztanga.props(bar, grips, all, ankles, pelvis); if (b.k !== 'barbell') return []; return [-1, 1].map(sg => band([g.x ?? b.c[0], g.y ?? 0, sg * EQUIP.chainZ], [b.c[0], b.c[1], sg * EQUIP.chainZ])); }
      const a: V3 = [g.x ?? 0, g.y ?? 100, g.z ?? 0]; return ss.map(s => band(a, grips[s]));
    },
    check: g => [
      ...(g.y !== undefined && (g.y < 0 || g.y > 300) ? [`sprzęt: wysokość zaczepu gumy y = ${g.y} cm poza przedziałem 0–300 cm`] : []),
    ],
    ref: () => [
      `guma: guma oporowa (pole mocowanie): "zaczep" (domyślnie) = stały punkt P = [x, y, z] (domyślnie [0, 100, 0]: drzwi, słupek, kolumna), guma biegnie od P do dłoni (jedna linia na dłoń; trzyma "obie" / "R" / "L"); "stopy" = guma pod stopami: od podłogi pod kostką (x, z kostki, y = 0) do dłoni tej samej strony (przysiad z gumą, uginanie, wznosy); "kostki" = pętla między kostkami (kroki w bok, odwodzenie: linia od kostki R do kostki L); "dlonie" = guma między dłońmi (rozciąganie gumy w poziomie: linia od dłoni R do dłoni L); "sztanga" = guma od końców gryfu (z = ±${f1(EQUIP.chainZ)} cm) do punktu [x (domyślnie x sztangi), y (domyślnie 0 = podłoga; wysoko = guma odwrócona), z] — wymaga wpisu sztanga.`,
      'guma rysowana jest jako linia przerywana; nie ma kolidera ani limitu długości (guma się rozciąga): położenie zaczepu wyznacza KIERUNEK OPORU (ruch ćwiczenia ma rozciągać gumę); w całym ruchu linia ma prowadzić od zaczepu do dłoni/kostek/sztangi.',
    ],
  },
  pilka_gimnastyczna: {
    nazwa: 'piłka gimnastyczna', caps: ['stability_ball'], fields: ['promien', 'z'], opis: 'piłka gimnastyczna leżąca na podłodze (x, z, promien)',
    props: g => { const r = g.promien ?? EQUIP.gymBallR; return [{ k: 'ball', c: [g.x ?? 0, r, g.z ?? 0], r: g.promien, held: false }]; },
    contacts: () => [{ body: '', equip: 'gymBall', tol: SOFT_CONTACT.gymBall }],
    check: g => bounds('promien piłki gimnastycznej', g.promien, 20, 40),
    ref: () => [
      `pilka_gimnastyczna: kula leżąca na podłodze o promieniu ${f1(EQUIP.gymBallR)} cm (promien; piłka o średnicy 65 cm; 55 cm = ${f1(27.5)}, 75 cm = ${f1(37.5)}), środek [x, promien, z] (x domyślnie 0, z domyślnie 0). Piłka NIE jest w dłoniach — stoi na podłodze i niesie ciężar ciała (plecy, miednica, łydki, stopy albo dłonie). Ciało dotyka piłki, gdy odległość osi tułowia (odcinek miednica–bark) od środka piłki wynosi promień + ${f1(GIRTH.trunkCollide)} cm (promień kapsuły tułowia); dopuszczalne wgniecenie ${f1(SOFT_CONTACT.gymBall)} cm (miękka piłka), głębiej odrzucane. Podeszwy na podłodze (y = 0) albo na piłce (stopy na piłce: kostka nad powierzchnią o ${f1(BODY.ankleH)} cm).`,
    ],
  },
  rolka: {
    nazwa: 'wałek (roller piankowy)', caps: ['foam_roller'], fields: ['promien', 'z'], opis: 'wałek piankowy leżący na podłodze wzdłuż z (x, promien, dlugosc)',
    props: g => { const r = g.promien ?? EQUIP.foamR; return [{ k: 'roll', c: [g.x ?? 0, r, g.z ?? 0], r, len: g.dlugosc ?? EQUIP.foamLen }]; },
    contacts: () => [{ body: '', equip: 'roll', tol: SOFT_CONTACT.roll }],
    check: g => [...bounds('promien wałka', g.promien, 4, 12), ...bounds('dlugosc wałka', g.dlugosc, 30, 120)],
    ref: () => [
      `rolka: wałek piankowy leżący na podłodze wzdłuż osi z: promień ${f1(EQUIP.foamR)} cm (promien; wałek o średnicy 15 cm), długość ${EQUIP.foamLen} cm (dlugosc), środek [x, promien, z]. Ciało (łydka, udo, plecy, pośladek) toczy się po wałku: odległość kapsuły ciała od osi wałka = promień ciała + promień wałka; dopuszczalne wgniecenie ${f1(SOFT_CONTACT.roll)} cm. Wałek się nie rusza (ciało przesuwa się po nim): zmianę położenia opisz ruchem ciała.`,
    ],
  },
  dzwignia: {
    nazwa: 'maszyna (dźwignia)', caps: ['leg_ext', 'leg_curl', 'leg_press', 'hack_squat', 'pendulum_squat', 'belt_squat_machine', 'chest_press_machine', 'shoulder_press_machine', 'pec_deck', 'row_machine', 'pullover_machine', 'ab_crunch_machine', 'biceps_curl_machine', 'triceps_ext_machine', 'lateral_raise_machine', 'glute_kickback_machine', 'hip_thrust_machine', 'hip_abductor_adductor', 'calf_machine', 'lever_machine', 'dip_machine', 't_bar'], fields: ['kat', 'z', 'tryb', 'punkt'], optionalCaps: [],
    opis: 'maszyna rysowana schematycznie: dźwignia obrotowa albo prowadnica liniowa z punktem mocowania na dłoniach, kostkach lub miednicy; siedzisko i oparcie jako lawka (x, y, z, kat, dlugosc, tryb, punkt, trzyma)',
    capLabel: { leg_ext: 'maszyna do prostowania nóg (obrót, punkt: kostki)', leg_curl: 'maszyna do uginania nóg (obrót, punkt: kostki)', leg_press: 'suwnica na nogi (prowadnica, punkt: kostki — platforma pod stopami)', hack_squat: 'hack squat (prowadnica, punkt: miednica — wózek z oparciem)', pendulum_squat: 'pendulum squat (obrót, punkt: miednica)', belt_squat_machine: 'belt squat (prowadnica albo obrót, punkt: miednica — pas)', chest_press_machine: 'maszyna do wyciskania (klatka; obrót, punkt: dłonie)', shoulder_press_machine: 'maszyna do wyciskania nad głowę (obrót, punkt: dłonie)', pec_deck: 'butterfly (obrót, punkt: dłonie)', row_machine: 'maszyna do wiosłowania (obrót, punkt: dłonie)', pullover_machine: 'maszyna pullover (obrót, punkt: dłonie)', ab_crunch_machine: 'maszyna do brzucha (obrót, punkt: dłonie)', biceps_curl_machine: 'maszyna do bicepsa (obrót, punkt: dłonie)', triceps_ext_machine: 'maszyna do tricepsa (obrót, punkt: dłonie)', lateral_raise_machine: 'maszyna do wznosów bokiem (obrót, punkt: dłonie)', glute_kickback_machine: 'maszyna do wykopów (pośladki; obrót, punkt: kostki)', hip_thrust_machine: 'maszyna do hip thrustu (obrót, punkt: miednica)', hip_abductor_adductor: 'maszyna do odwodzenia/przywodzenia (obrót, punkt: kostki)', calf_machine: 'maszyna do łydek (prowadnica, punkt: dłonie albo miednica; wspięcia: kostki)', lever_machine: 'maszyna dźwigniowa (obrót, punkt: dłonie)', dip_machine: 'maszyna do dipów (obrót, punkt: dłonie)', t_bar: 'T-bar (obrót wokół osi przy podłodze, punkt: dłonie)' },
    props: (g, grips, _all, ankles, pelvis) => {
      const ss: Side[] = g.trzyma === 'L' ? ['L'] : g.trzyma === 'obie' ? [...SIDES] : ['R'];
      const pt: V3 = g.punkt === 'kostki' ? avg(ss.map(s => ankles[s])) : g.punkt === 'miednica' ? pelvis : avg(ss.map(s => grips[s]));
      const from: V3 = [g.x ?? 0, g.y ?? 50, g.z ?? 0];
      if (g.tryb === 'prosta') { const th = rad(g.kat ?? 0); return [{ k: 'slide', from, to: pt, dir: [Math.cos(th), Math.sin(th), 0], len: g.dlugosc ?? EQUIP.leverStroke }]; }
      return [{ k: 'pivot', from, to: pt, len: g.dlugosc ?? EQUIP.leverArm, label: 'dzwignia', cut: EQUIP.leverEnd }];
    },
    check: g => [
      ...(g.tryb === 'prosta' ? bounds('dlugosc skoku prowadnicy', g.dlugosc, 10, 150) : bounds('dlugosc ramienia dźwigni', g.dlugosc, 20, 150)),
      ...(g.tryb !== 'prosta' && g.kat !== undefined ? ['sprzęt: pole „kat” (kąt prowadnicy) dotyczy tylko dźwigni w trybie „prosta”'] : []),
    ],
    ref: () => [
      `dzwignia: maszyna rysowana SCHEMATYCZNIE (nie odwzorowujemy konstrukcji): siedzisko i oparcie dodaj jako wpis lawka (kat oparcia, top siedziska), a ruchomą część jako wpis dzwignia. Punkt mocowania (pole punkt) podąża za ciałem: "dlonie" (środek chwytu), "kostki" (środek kostek; stopy na platformie albo wałek na goleniach), "miednica" (środek miednicy: pas, wózek z oparciem). trzyma: "R" (domyślnie) albo "L" = punkt jednej strony ciała (kostka albo dłoń tej strony), "obie" = środek między obiema stronami. Dla maszyn z dźwigniami po bokach (prostowanie/uginanie nóg, wyciskanie) rysujemy JEDNĄ dźwignię po jednej stronie (trzyma "R"), z poza ciałem (z pivotu ±28…35 cm), żeby nie przenikała ud i łydek.`,
      `dzwignia tryb "obrot" (domyślnie): sztywne ramię o długości dlugosc (domyślnie ${f1(EQUIP.leverArm)} cm) obraca się wokół osi P = [x, y, z] (y domyślnie 50): w KAŻDEJ klatce punkt mocowania leży na sferze o promieniu dlugosc wokół P (± ${TOL.pivot} cm), czyli na łuku; klatki co ≤ ${Math.floor(Math.sqrt(8 * 60 * TOL.pivot * 0.5))} cm drogi punktu (ramię 60 cm). Kolider ramienia (kapsuła) poza ostatnimi ${f1(EQUIP.leverEnd)} cm przy punkcie mocowania: ciało nie przenika ramienia.`,
      `dzwignia tryb "prosta" (suwnica na nogi, hack squat, wózki): prowadnica liniowa od punktu P = [x, y, z] w kierunku kąta kat (stopnie od poziomu w płaszczyźnie x–y: 0 = do przodu +x, 90 = w górę, −45 = w dół do przodu), długość skoku dlugosc (domyślnie ${f1(EQUIP.leverStroke)} cm): w KAŻDEJ klatce punkt mocowania leży na odcinku prowadnicy (± ${TOL.pivot} cm), w skoku 0…dlugosc od P. Z boku rysunek: linia prowadnicy i platforma (odcinek ${f1(EQUIP.machinePad)} cm prostopadły do prowadnicy w punkcie mocowania).`,
    ],
  },
  modlitewnik: {
    nazwa: 'modlitewnik', caps: ['preacher_bench'], fields: ['kat'], opis: 'modlitewnik: pochyła podpórka na ramiona przed osobą i siedzisko (x = górny koniec podpórki, top = jego wysokość, kat, dlugosc, y = siedzisko)',
    props: g => {
      const x = g.x ?? 0, top = g.top ?? EQUIP.preacherTop, th = rad(g.kat ?? EQUIP.preacherKat), L = g.dlugosc ?? EQUIP.preacherLen;
      return [{ k: 'preacher', top: [x, top], bottom: [x + Math.cos(th) * L, top - Math.sin(th) * L], seat: [x - EQUIP.preacherSeatDx, g.y ?? EQUIP.preacherSeatY] }];
    },
    contacts: () => PREACHER_CONTACTS,
    check: g => [
      ...(g.kat !== undefined && (g.kat < 30 || g.kat > 80) ? [`sprzęt: kąt podpórki modlitewnika kat = ${g.kat}° poza przedziałem 30–80°`] : []),
      ...bounds('dlugosc podpórki modlitewnika', g.dlugosc, 25, 70), ...bounds('wysokość siedziska modlitewnika y', g.y, 30, 70), ...bounds('wysokość podpórki modlitewnika top', g.top, 60, 130),
    ],
    ref: () => [
      `modlitewnik: pochyła podpórka na ramiona (preacher curl). Górny koniec podpórki w [x, top] (domyślnie x = 0, top = ${f1(EQUIP.preacherTop)} cm: na wysokości klatki osoby siedzącej), podpórka opada od osoby w stronę +x pod kątem kat od poziomu (domyślnie ${EQUIP.preacherKat}°, 30–80°) na długość dlugosc (domyślnie ${EQUIP.preacherLen} cm), grubość ${f1(EQUIP.preacherT)} cm, szerokość ${f1(EQUIP.preacherW)} cm (z = ±${f1(EQUIP.preacherW / 2)}). Siedzisko ${f1(EQUIP.preacherSeatL)} × ${f1(EQUIP.preacherSeatW)} cm w [x − ${f1(EQUIP.preacherSeatDx)}, y] (y = wysokość siedziska, domyślnie ${f1(EQUIP.preacherSeatY)} cm). Osoba siedzi PRZODEM do podpórki (twarz +x): miednica na siedzisku, klatka tuż za górnym końcem podpórki, ramiona (łokcie) leżą na powierzchni podpórki, dłonie trzymają sztangę/hantle/uchwyt przed nią. Kontakty: ramię i przedramię z podpórką do 3 cm, tułów do 2 cm, miednica i uda z siedziskiem do 1,5 cm; głębiej odrzucane.`,
    ],
  },
  zawieszenie: {
    nazwa: 'taśmy do podwieszania', caps: ['suspension'], fields: ['z', 'punkt'], opis: 'taśmy do podwieszania (TRX): punkt zaczepu wysoko (x, y, z), dwie taśmy do dłoni albo kostek (punkt, trzyma)',
    props: (g, grips, _all, ankles) => {
      const anchor: V3 = [g.x ?? 0, g.y ?? EQUIP.suspensionY, g.z ?? 0]; const kost = g.punkt === 'kostki';
      return sidesOf(g).map((s): Prop => ({ k: 'cable', from: anchor, to: kost ? ankles[s] : grips[s], attach: kost ? 'strap' : 'handle', ends: [kost ? ankles[s] : grips[s]], solid: true }));
    },
    check: g => [...bounds('wysokość zaczepu taśm y', g.y, 100, 350), ...(g.punkt === 'miednica' ? ['sprzęt: taśmy do podwieszania mocujemy do dłoni albo kostek (punkt: "dlonie" lub "kostki")'] : [])],
    ref: () => [
      `zawieszenie: taśmy do podwieszania (TRX) przypięte do jednego punktu zaczepu P = [x, y, z] (domyślnie x = 0, y = ${EQUIP.suspensionY} cm, z = 0: belka nad głową), dwie taśmy prosto do uchwytów w dłoniach (punkt "dlonie", domyślnie) albo do pętli na kostkach (punkt "kostki": stopy w pętlach; trzyma "obie" = obie nogi, "R"/"L" = jedna noga, druga na podłodze). Taśma napięta w całym ruchu: linia od P do dłoni/kostki. Taśmy nie przenikają ciała (poza ostatnimi ${f1(EQUIP.cableEnd)} cm przy dłoni/kostce): ustaw P tak, by linie nie przechodziły przez tułów i głowę.`,
    ],
  },
  lina_pionowa: {
    nazwa: 'lina pionowa', caps: ['climbing_rope'], fields: ['z'], opis: 'lina do wspinania zawieszona pionowo (x, z, y = dół, h = góra), dłonie na linie (trzyma)',
    props: g => [{ k: 'rope', x: g.x ?? 0, z: g.z ?? 0, top: g.h ?? EQUIP.ropeTop, bottom: g.y ?? EQUIP.ropeBottom, held: g.trzyma === 'R' || g.trzyma === 'L' ? g.trzyma : true }],
    contacts: () => [{ body: 'foot', equip: 'rope', tol: 3 }, { body: 'shank', equip: 'rope', tol: 3 }],
    check: g => [...bounds('góra liny h', g.h, 150, 600), ...bounds('dół liny y', g.y, 0, 150)],
    ref: () => [
      `lina_pionowa: lina do wspinania zawieszona prosto w dół w (x, z) (domyślnie x = 0, z = 0) od dołu y (domyślnie ${EQUIP.ropeBottom} cm nad podłogą) do góry h (domyślnie ${EQUIP.ropeTop} cm), średnica ${f1(2 * EQUIP.ropeR)} cm. Dłonie OBEJMUJĄ linę: środek chwytu na osi liny (x i z liny, y między dołem a górą), odchylenie ≤ 3 cm w KAŻDEJ klatce (trzyma "obie" domyślnie; "R"/"L" = jedna dłoń). Ciało nie przenika liny; stopy i łydki mogą ją dociskać (wspinaczka): przenikanie do 3 cm.`,
    ],
  },
  sanie: {
    nazwa: 'sanie obciążeniowe', caps: ['sled'], fields: ['trzymanie'], opis: 'sanie obciążeniowe na podłodze: słupki uchwytów w x (wysokość h), podstawa długości dlugosc w stronę +x; dłonie na słupkach albo lina do dłoni (trzymanie)',
    props: (g, grips) => {
      const x = g.x ?? 0, len = g.dlugosc ?? EQUIP.sledLen; const rope = g.trzymanie === 'lina';
      const body: Prop = { k: 'sled', x, h: g.h ?? EQUIP.sledPostH, len, posts: !rope };
      return rope ? [body, { k: 'cable', from: [x + len, 15, 0], to: avg(sidesOf(g).map(s => grips[s])), attach: 'handle', ends: sidesOf(g).map(s => grips[s]), solid: true }] : [body];
    },
    check: g => [...bounds('dlugosc podstawy sań', g.dlugosc, 30, 120), ...bounds('wysokość słupków sań h', g.h, 40, 160)],
    ref: () => [
      `sanie: sanie obciążeniowe (prowler) stojące na podłodze: dwa słupki uchwytów w x (z = ±${f1(EQUIP.sledHalf)} cm) o wysokości h (domyślnie ${EQUIP.sledPostH} cm), podstawa wysokości ${f1(EQUIP.sledBase)} cm od x o dlugosc (domyślnie ${EQUIP.sledLen} cm) w stronę +x (sanie przed osobą, pchanie w stronę +x), talerze na podstawie (tło). trzymanie: "slupki" (domyślnie; pchanie i ciągnięcie za słupki): w KAŻDEJ klatce dłonie na słupkach (x słupków, z = ±${f1(EQUIP.sledHalf)}, y od ${f1(EQUIP.sledBase)} cm do h; ± 1,5 cm); "lina" = lina od przodu sań [x + dlugosc, 15, 0] do dłoni (wiosłowanie, ciągnięcie wstecz, wznosy z liną). Ciało nie przenika sań ani słupków.`,
    ],
  },
  poreczy: {
    nazwa: 'poręcze do dipów', caps: ['dip.bars'], fields: ['z'], opis: 'dwie równoległe poręcze (x0, x1, h wysokość, z = połowa rozstawu), dłonie na poręczach',
    props: g => [{ k: 'dipbars', x0: g.x0 ?? -EQUIP.dipLen / 2, x1: g.x1 ?? EQUIP.dipLen / 2, h: g.h ?? EQUIP.dipH, z: g.z ?? EQUIP.dipHalf }],
    check: g => [...bounds('rozstaw poręczy z', g.z, 15, 40), ...bounds('wysokość poręczy h', g.h, 80, 160), ...(g.x0 !== undefined && g.x1 !== undefined && g.x1 - g.x0 < 30 ? [`sprzęt: poręcze krótsze niż 30 cm (x0 = ${g.x0}, x1 = ${g.x1})`] : [])],
    ref: () => [
      `poreczy: dwie równoległe poziome poręcze na wysokości h (domyślnie ${EQUIP.dipH} cm) w z = ±z, gdzie z (pole z) to POŁOWA rozstawu poręczy (domyślnie ${f1(EQUIP.dipHalf)} cm, dozwolone 15–40 cm, czyli rozstaw 30–80 cm), od x0 do x1 (domyślnie ±${f1(EQUIP.dipLen / 2)} cm), średnica ${f1(2 * EQUIP.dipR)} cm. W KAŻDEJ klatce dłonie na poręczach: y = h, z = ±z (R dodatnie), x między x0 a x1 (± 1 cm). Tułów przechodzi między poręczami (nie przenika ich).`,
    ],
  },
  skrzynia: { nazwa: 'skrzynia albo stopień', caps: ['box'], opis: 'skrzynia albo stopień (x0, x1, top)', props: g => [{ k: 'box', x0: g.x0 ?? 0, x1: g.x1 ?? 40, top: g.top ?? 40 }] },
  hantel: {
    nazwa: 'hantle',
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
    nazwa: 'kettlebell',
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
    nazwa: 'talerz',
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
    nazwa: 'piłka lekarska',
    caps: ['med_ball', 'atlas_stones', 'keg', 'sandbag'], capLabel: { med_ball: 'piłka lekarska', atlas_stones: 'kamień atlas (rysowany jak kula — uproszczenie)', keg: 'beczka (rysowana jak kula — uproszczenie)', sandbag: 'worek z piaskiem (rysowany jak kula — uproszczenie)' }, fields: ['promien', 'przesuniecie'], opis: 'piłka lekarska (trzyma, promien, przesuniecie)',
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
  if (gear.some(g => g.rodzaj === 'guma' && g.mocowanie === 'sztanga') && !gear.some(g => g.rodzaj === 'sztanga')) out.push('sprzęt: guma z mocowaniem „sztanga” wymaga wpisu sztanga');
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

/**
 * Wymagany sprzęt ćwiczenia (katalog: requires = lista grup „wszystkie z listy, w grupie dowolna”): dla każdej grupy, w której choć jedna możliwość ma rodzaj w rejestrze,
 * poza musi zawierać wpis takiego rodzaju spełniający możliwość (np. bloczek wysoki). Grupy bez możliwości w rejestrze pomijane (ćwiczenia z nimi generator i tak pomija);
 * grupy z samych możliwości opcjonalnych (stojak) nie są wymagane.
 */
export function requiredGearIssues(requires: string[][], gear: Gear[]): string[] {
  const kindOf = (cap: string) => GEAR.map(k => ({ k, def: GEAR_KINDS[k] })).filter(x => x.def.caps.includes(cap));
  const out: string[] = [];
  for (const group of requires) {
    const covered = group.filter(c => kindOf(c).length > 0); if (!covered.length) continue;
    if (covered.every(c => kindOf(c).every(x => x.def.optionalCaps?.includes(c)))) continue;
    const ok = covered.some(c => kindOf(c).some(x => gear.some(g => g.rodzaj === x.k && (x.def.capOk?.(c, g) ?? true))));
    if (ok) continue;
    const label = (c: string): string => { const x = kindOf(c)[0]; return `${x.def.capLabel?.[c] ?? x.def.nazwa} (rodzaj „${x.k}”${x.def.capNeed?.[c] ? `, ${x.def.capNeed[c]}` : ''})`; };
    out.push(`sprzęt: ćwiczenie wymaga: ${[...new Set(covered.map(label))].join(' ALBO ')}, a sprzet[] tego nie zawiera`);
  }
  return out;
}

/** Dozwolone kontakty ciała ze sprzętem zadeklarowane przez wpisy sprzętu. */
export function contactsFrom(gear: Gear[]): Contact[] { return gear.flatMap(g => GEAR_KINDS[g.rodzaj].contacts?.(g) ?? []); }

/** Możliwości katalogu pokryte przez rejestr (wszystkie rodzaje). */
export const GEAR_CAPS: readonly string[] = Object.values(GEAR_KINDS).flatMap(k => k.caps);

/** Sprzęt jako rekwizyty sceny; sprzęt „podążający za chwytem” leży między dłońmi albo w dłoni. */
export function propsFrom(gear: Gear[], grips: GearGrips, ankles: GearGrips = { R: [0, 0, 0], L: [0, 0, 0] }, pelvis: V3 = [0, 0, 0]): Prop[] { return gear.flatMap(g => GEAR_KINDS[g.rodzaj].props(g, grips, gear, ankles, pelvis)); }
