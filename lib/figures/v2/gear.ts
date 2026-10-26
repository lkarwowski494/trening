/*
 * Figury v2 — SPRZĘT W KONTRAKCIE DANYCH (docs/50 rozdz. 10, docs/53, docs/54): rejestr rodzajów sprzętu, które generator może wpisać w `sprzet[]` pozy.
 * Każdy rodzaj to parametryczny prymityw: pola, rekwizyt(y) sceny (rysunek i kolidery w draw.ts/colliders.ts), możliwości katalogu ćwiczeń (`caps`), które pokrywa,
 * sprawdzenia pól i punkty odniesienia dla generatora poleceń (`ref`, liczby z EQUIP). Wymiary w EQUIP (draw.ts) są „konwencją rysunku”
 * (status i powód: data/zrodla/figury-sprzet.json). Czysty moduł (bez React).
 */
import { add, clamp, mul, norm, sub, type V3 } from './math';
import { BODY, GIRTH, SIDES, type Side } from './skeleton';
import { EQUIP } from './draw';
import type { Frame, Prop } from './scene';

export const GEAR = ['sztanga', 'slupek', 'podloga', 'skrzynia', 'hantel', 'kettlebell', 'talerz', 'pilka_lekarska'] as const;
export type GearName = typeof GEAR[number];
export type Gear = { rodzaj: GearName; x?: number; y?: number; h?: number; x0?: number; x1?: number; top?: number; talerze?: boolean; podazaZaChwytem?: boolean; trzyma?: 'obie' | 'R' | 'L'; dlugosc?: number; promien?: number; pionowo?: boolean; dzwon?: 'dol' | 'wzdluz' | 'tyl'; przesuniecie?: V3; hak?: number };
/** Pola sprzętu wprowadzone po pierwszej wersji kontraktu: dozwolone tylko dla rodzajów, które je wymieniają w `fields`. */
export const GEAR_EXTRA_FIELDS = ['promien', 'pionowo', 'dzwon', 'przesuniecie', 'hak'] as const;
export const BELL_MODES = ['dol', 'wzdluz', 'tyl'] as const;

export type GearGrips = Record<Side, V3>;
export type GearKind = {
  /** Możliwości katalogu ćwiczeń (lib/catalog.generated.ts → requires), które ten rodzaj pozwala narysować. */
  caps: readonly string[];
  /** Krótki opis do generatora poleceń (jak wypełnić pola). */
  opis: string;
  /** Rekwizyty sceny dla wpisu sprzętu (chwyty rąk potrzebne sprzętowi trzymanemu w dłoni). */
  props: (g: Gear, grips: GearGrips) => Prop[];
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
  skrzynia: { caps: ['box', 'bench.flat'], opis: 'skrzynia, stopień albo ławka płaska (x0, x1, top)', props: g => [{ k: 'box', x0: g.x0 ?? 0, x1: g.x1 ?? 40, top: g.top ?? 40 }] },
  hantel: {
    caps: ['db'], fields: ['promien', 'pionowo'], opis: 'hantel trzymany w dłoni (trzyma, promien, pionowo)',
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

/** Pola sprzętu użyte w niewłaściwym rodzaju (komunikaty dla generatora). */
export function gearFieldIssues(g: Gear): string[] {
  const own = GEAR_KINDS[g.rodzaj].fields ?? [];
  return [
    ...GEAR_EXTRA_FIELDS.filter(f => g[f] !== undefined && !own.includes(f)).map(f => `sprzęt: pole „${f}” nie dotyczy rodzaju „${g.rodzaj}”${own.length ? ` (dla tego rodzaju: ${own.join(', ')})` : ''}`),
    ...(GEAR_KINDS[g.rodzaj].check?.(g) ?? []),
  ];
}

/** Możliwości katalogu pokryte przez rejestr (wszystkie rodzaje). */
export const GEAR_CAPS: readonly string[] = Object.values(GEAR_KINDS).flatMap(k => k.caps);

/** Sprzęt jako rekwizyty sceny; sprzęt „podążający za chwytem” leży między dłońmi albo w dłoni. */
export function propsFrom(gear: Gear[], grips: GearGrips): Prop[] { return gear.flatMap(g => GEAR_KINDS[g.rodzaj].props(g, grips)); }
