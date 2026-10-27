// Reguły JAKOŚCI póz figur v2 (docs/53, bramka 3 i 4; L-040): luki znalezione przez recenzenta ruchu w pilotażu agent-pozy 26.10.2026 zamienione w sprawdzenia automatyczne.
// Każda reguła: funkcja czysta (poza lub kształty → lista komunikatów z liczbami), id w REGULY_JAKOSCI, test na pozie spełniającej i łamiącej (tests/figury-jakosc.test.ts).
// Używa je waliduj() (v2-validate.mjs, kod „jakosc”) po przejściu schematu, geometrii i sensu; liczby w PROGI (jedno miejsce).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wskazowkiCwiczenia } from './v2-sens.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const f1 = (x) => x.toFixed(1);
const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/** Progi (cm, stopnie). Wartości bez źródła to konwencje rysunku (uproszczenie ilustracyjne), nie twierdzenia merytoryczne. */
export const PROGI = {
  bladMinCm: 4, /* błąd postawy: różnica punktu poza błędu − poprawna w KAŻDEJ klatce */
  rozneKlatkiCm: 0.5, /* kolejne klatki ruchu nie są kopiami: różnią się o co najmniej tyle w którymś punkcie (gęste klatki ruchu płynnego mogą różnić się niewiele) */
  statyczneMaxKlatek: 2, /* ćwiczenie izometryczne: najwyżej tyle klatek (minimum kontraktu) */
  podlogaKonczyna: -1.6, /* oś ramienia/przedramienia minus promień nie niżej niż (cm; dłoń leżąca na podłodze ma −1,3) */
  podlogaTulow: -2, /* tułów, miednica, głowa leżące (oś − promień) */
  stykFrontCm: 1.5, /* rzut z przodu: but stojący na podłodze sięga najwyżej tyle nad linią podłogi */
  szyjaMaxDeg: 40, /* kąt osi głowy względem osi tułowia w podporze */
  podstawaMinCm: 28, /* podpór na jednej ręce: rozstaw kostek (szerzej niż biodra ±8,5) */
  receWzdluz: { lokiecNadBarkiemCm: 2, dlonMaxY: 12 }, /* leżąc: łokieć nie wyżej niż bark, dłoń blisko podłogi */
  wisiCm: 1, /* ćwiczenie na podłodze: najniższy punkt tułowia/miednicy (oś − promień) najwyżej tyle nad podłogą (leżąc i siedząc ciało leży, nie wisi) */
  lokiecPrzedPlecamiMaxCm: 2, /* przyciąganie (wiosłowanie): na końcu łokieć leży najwyżej tyle PRZED płaszczyzną pleców (po stronie klatki/drążka); łokieć ma kończyć przy tułowiu, za linią pleców, nie nad klatką */
  dzwonGoraMaxOdPionuDeg: 45, /* kettlebell dnem do góry (dzwon nad rączką): przedramię najwyżej tyle od pionu (dłoń nad łokciem); w zwisie dzwon wisi pod rączką */
  highPullLokiecPodDloniaCm: 5, /* high pull: na końcu łokieć nie niżej niż dłoń minus tyle (łokcie prowadzą w górę, nad dłonią) */
  highPullOdwiedzenieMinDeg: 35, /* high pull: na końcu odwiedzenie ramienia (łokieć na bok) co najmniej tyle; dłonie na jednej rączce (≤ 7 cm od jej środka) i długość przedramienia dają w tym rigu fizyczne maksimum ok. 43°, a poza poprzednia miała 12,6° (uproszczenie rysunku: reguła 45° z recenzji niewykonalna) */
  podparcieMarginesCm: 2, /* podpór jednorącz/jednonóż: rzut środka ciężkości leży wewnątrz wielokąta podparcia o co najmniej tyle */
  lokiecNadNadgarstkiemCm: 8, /* dolna faza: |łokieć z − dłoń z| ≤ tyle (przedramię pionowe z przodu; wymiar: ok. 40% szerokości barków) */
  rozstawTolerancja: 0.25, /* rozstaw dłoni = wielokrotność rozstawu barków ± tyle */
  ledzwieCm: 3, /* leżenie na plecach z wskazówką „lędźwie przy podłodze”: dolna krawędź odcinka lędźwiowego (25% długości tułowia od miednicy, po krzywiźnie kręgosłupa) najwyżej tyle nad podłogą */
  bladWidocznyDeg: 8, /* błąd widoczny w klatce: kąt któregokolwiek stawu różni się od pozy poprawnej o ≥ tyle (błąd postawy: w każdej klatce kluczowej; błąd zakresu: w ostatniej) */
  widocznoscBiodroMaxDeg: 30, /* R9: klatki ze zgięciem biodra pozy poprawnej > tyle (start rolloutu w skłonie) zwolnione z wymogu widoczności błędu postawy */
  zwisKatDeg: 10, /* przyciąganie, u = 0: ręce w pionie ± tyle */
  zwisMostekCm: 8, /* przyciąganie, u = 0: drążek nad mostkiem ± tyle (oś x) */
  prosteReceDeg: 15, /* rollout: zgięcie łokcia ≤ tyle (łokieć ≥ 165°) w każdej klatce pozy poprawnej */
  /* recenzja n4 (26.10.2026), R1–R10: progi to KONWENCJA RYSUNKU (do potwierdzenia przez badacza), nie twierdzenia merytoryczne */
  liniaPelnaCm: 11, /* R1: kolano i miednica najwyżej tyle od linii kostka–bark w każdej klatce (podpór na stopach z ciałem prostym) */
  falloutBarkMinDeg: 70, falloutLokiecMaxDeg: 25, /* R2: Suspended Fallout u = 0: zgięcie barku ≥, łokieć ≤ */
  koloProsteMaxDeg: 22, /* R3: zgięcie kolana w podporze z prostym ciałem ≤ (silnik: noga prosta = 0°, ale uda + golenie = 83 cm, więc 1 cm niedoboru odległości biodro–kostka to już ok. 14° — to czułość cosinusa, nie przesunięcie zera; 22° ≈ 1,5 cm niedoboru) */
  kolanoPodTulowiemCm: 13, /* R4: |z kolana| − |z biodra| ≤ */
  kolanoNadPodlogaCm: 11, /* uwaga: dobrany blisko wartości poprawionej pozy (11,3) i błędnej z n4 (10,2) — słaba separacja, do potwierdzenia */ /* R5: podpór na dłoniach: kolano (oś) ≥ tyle nad podłogą (bez klęku) */
  przedramieBokDeg: 55, lokiecPodBarkiemCm: 2, /* R6: dół pompki do podłogi: przedramię z boku ≤ od pionu, łokieć nie niżej niż bark − tyle */
  kolanaUgieteMinDeg: 80, /* R7: ćwiczenia z podkulonymi kolanami */
  receProsteMaxDeg: 30, /* R8: ręce „wzdłuż ciała”/„sięgające”: zgięcie łokcia ≤ */
  bladGorszyCm: 2.5, /* R10: rząd błędu opadania: odchylenie miednicy od linii kostka–bark większe niż w pozie poprawnej o ≥ tyle (w stronę opadania) */
  rzadBleduTolDeg: 8, /* staw spoza obszaru błędu (WSZYSTKIE: biodro, kolano, kostka, łokieć, bark) może się różnić od pozy poprawnej najwyżej o tyle; wyjątki: TOL_BLEDU */
  dlonWysokoscBarkowCm: 15, /* delt_raise (lat.height), układ ŚWIATA: w u = 1 |y dłoni − y barku| ≤ tyle, a przez cały ruch dłoń nie wyżej niż bark + tyle (KONWENCJA rysunku; badacz 27.10.2026: ręce „mniej więcej równolegle do podłogi”, bez liczby w źródłach) */
  zwisPrzedramieDeg: 15, /* leżenie przodem ze sztangą (zwis na prostych rękach): u = 0 przedramię pionowo w dół ± tyle (KONWENCJA) */
  tulowPrzodemFrontY: -0.3, /* leżenie przodem na ławce: składowa pionowa wektora „przód” klatki piersiowej ≤ tyle (klatka zwrócona ku ławce/podłodze; KONWENCJA) */
  stykPodparciaCm: 4.5, /* punkt ciała uznany za podparcie, gdy jego (oś) wysokość ≤ tyle: dłoń, stopa, kolano (promień kończyny) */
};
/** Odwiedzenie ramienia widoczne Z PRZODU (stopnie): arcsin(wysunięcie łokcia w bok poza oś barku / PRAWDZIWA długość ramienia 3D, nie długość w rzucie), sprawdzane w KAŻDEJ klatce. To druga linia obrony; pierwsza to geometria (lokiec_nad_nadgarstkiem, rozstaw_dloni).
 * Konwencja rysunku (nie twierdzenie merytoryczne; badacz 26.10.2026, scratchpad/badania-figury/lokiec-masy.md; rozstrzygnięcie koordynatora): pompka standardowa, wąska i diamentowa ≤ 45° (część wspólna źródeł: NASM ok. 45°, ACE „na boki” — brak liczb dla wąskiej/diamentowej,
 * a źródła różnią się kierunkowo), szeroka ≤ 70° i wyraźnie szersza niż standardowa (≥ ODWIEDZENIE_DOLNE), wiosłowanie odwrócone ≤ 45° (spójnie ze wskazówką inv.pull „łokcie blisko tułowia”). Litera T (≈ 90°) jest odrzucana w każdym wariancie. */
export const ODWIEDZENIE_PRZOD = { domyslnie: 45, 'Push-Up Wide': 70, 'Close-Grip Push-Up': 45, 'Incline Push-Up Close-Grip': 45, 'Diamond Push Up': 45, 'Inverted Row': 45 };
/** Dolna granica odwiedzenia (najwyższy kąt w ruchu ≥): pompka szeroka ma łokcie wyraźnie szerzej niż standardowa (kierunek: źródła jakościowo; liczba = konwencja). */
export const ODWIEDZENIE_DOLNE = { 'Push-Up Wide': 50 };
/** Pompki z łokciem nad nadgarstkiem w dolnej fazie (przedramię pionowe w rzucie z przodu; pompka standardowa i szeroka). Wąska i diamentowa mają dłonie bliżej osi, łokieć na zewnątrz — wyłączone. */
export const LOKIEC_NAD_NADGARSTKIEM = ['Push Up', 'Push-Up Wide', 'Decline Push Up', 'Incline Push Up'];
/** Rozstaw dłoni jako ułamek rozstawu barków (S4: wąski 50%, normalny 100%, szeroki 150%); ćwiczenia spoza listy (diamentowa — dłonie złączone, Single-Arm, Clock) bez sprawdzenia. */
export const ROZSTAW_DLONI = { 'Push Up': 1, 'Decline Push Up': 1, 'Incline Push Up': 1, 'Push-Up Wide': 1.5, 'Close-Grip Push-Up': 0.5, 'Incline Push-Up Close-Grip': 0.5 };
export const ODWIEDZENIE = ODWIEDZENIE_PRZOD; /* reguła 11 (klatka największego zgięcia) używa tych samych progów */
/** Ćwiczenia na podłodze, w których tułów nie leży (czworaki): reguła nic_nie_wisi ich nie obejmuje. */
export const NIE_LEZY = ['Bird Dog'];
/** Ćwiczenia z deklarowanym lotem (ciało oderwane od podłogi z założenia): ćwiczenie → powód. Puste: żadne ćwiczenie na podłodze rodziny core_floor nie ma fazy lotu. */
export const LOT = {};
/** Leżenie na plecach: ćwiczenia, w których tułów unosi się ŚWIADOMIE od miednicy (styk na kości krzyżowej), mimo że wskazówka rodziny mówi o lędźwiach przy podłodze: ćwiczenie → powód. */
export const LEDZWIE_WYJATKI = { 'V-Up': 'zamierzone: „V” na kości krzyżowej, tułów i nogi unoszą się jednocześnie', 'Cocoons': 'zamierzone: zwijanie obu końców, styk na kości krzyżowej', 'Tuck Crunch': 'zamierzone: zwijanie obu końców (kolana do klatki), styk na kości krzyżowej' };
/** Wskazówka ćwiczenia, która czyni z lędźwi przy podłodze sprawdzalny warunek obrazu (tekst w lib/cues/text/pl.json). */
export const WSKAZOWKA_LEDZWIE = /Lędźwi\w* przy podłodze|Dolna część pleców zostaje na podłodze/i;
/** Czy wskazówki ćwiczenia (zestaw ogólny cue-sets.json albo własne lib/cues/data.json; teksty `teksty`) zawierają warunek „lędźwie przy podłodze”. */
export function maWskazowkeLedzwie(cwiczenie, teksty, root = ROOT) {
  const set = JSON.parse(fs.readFileSync(path.join(root, 'lib/figures/v2/cue-sets.json'), 'utf8')).items?.[cwiczenie]; const wlasne = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/data.json'), 'utf8')).exercises?.[cwiczenie];
  const ids = [...(set?.ok ?? []), ...Object.values(wlasne ?? {}).flat().map((c) => c.c).filter(Boolean)]; return ids.some((id) => WSKAZOWKA_LEDZWIE.test(teksty[id] ?? ''));
}
/** Przyciąganie w poziomie (łokieć kończy za plecami): tylko ćwiczenia z tej listy. */
export const PRZYCIAGANIE = ['Inverted Row'];
/** Ćwiczenia „high pull”: łokcie na końcu ruchu wysoko i na boki (reguła high_pull_lokcie). */
export const HIGH_PULL = ['Kettlebell Sumo High Pull'];
/** Podpór jednorącz/jednonóż (stabilność): środek ciężkości nad podparciem. */
export const PODPARCIE_ZMIENNE = ['Single-Arm Push-Up']; /* Plank Shoulder Taps i Mountain Climbers: faza jednej ręki/lotu trwa ułamek ruchu (przybliżenie przejścia) — reguła je mierzy (jakosc-raport), ale ich nie wymusza; powód: ruch dynamiczny, recenzja n2 = OK */
/** Udziały mas segmentów i położenia ich środków mas: jeden komplet (de Leva 1996, zbiór męski; data/zrodla/figury-masy-segmentow.json — źródło i status w pliku). */
export const MASY = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/zrodla/figury-masy-segmentow.json'), 'utf8')).segmenty;
/** Dozwolone obszary zmian rzędu błędu według wskazówki: rząd błędu zmienia wyłącznie to, co opisuje jego wskazówka; kąty stawów spoza listy nie mogą się różnić od pozy poprawnej o więcej niż PROGI.rzadBleduTolDeg
 * (etykiety jak `dotyczy`: hip, knee, ankle, elbow, shoulder). Brak wpisu dla wskazówki = brak sprawdzenia. */
export const DOTYCZY_BLEDU = {
  'plank.mis.sag': ['hip', 'shoulder'], /* opadające biodra: kąt biodra i ramienia; kolana, kostki i łokcie bez zmian (poza tolerancją) */
  'push.mis.partial': ['elbow', 'shoulder', 'hip', 'ankle'], /* płytki dół: łokcie i ułożenie tułowia (ciało obraca się wokół palców, więc kostka podąża za linią ciała); kolana bez zmian */
  'cobra.mis': ['hip', 'shoulder'], /* przeprost lędźwi */
};
/** Wyjątki per ćwiczenie: w rollout z podparciem na kolanach opadanie miednicy obraca udo wokół kolana na podłodze, więc kąt kolana, kostki i łokcia (chwyt na sztandze) zmienia się z natury błędu. */
export const DOTYCZY_BLEDU_CWICZENIE = { 'Rollout (sztanga)': { 'plank.mis.sag': ['knee', 'ankle', 'elbow'] }, 'Barbell Rollout from Bench': { 'plank.mis.sag': ['knee', 'ankle', 'elbow'] } };
/** Większa tolerancja dla wybranych stawów (zapas 2 cm w długości nogi w modelu opadania biodra daje ≤ 13° w kolanie i kostce; „wyraźnie ugięte kolana” to ≥ 30°). */
export const TOL_BLEDU = { 'plank.mis.sag': { knee: 15, ankle: 15, elbow: 15 } }; /* łokieć: wygięcie lędźwi przesuwa barki względem dłoni na sztandze, więc ręce prostują się o ≤ 15° */
export const BLAD_POSTAWY = ['plank.mis.sag', 'cobra.mis']; /* widoczny w każdej klatce kluczowej; pozostałe z DOTYCZY_BLEDU (zakres) — w ostatniej */
export const ROLLOUTY = ['Rollout (sztanga)', 'Barbell Rollout from Bench', 'Standing Barbell Rollout'];
const KAT_STAWU = { hip: 'hip', knee: 'knee', ankle: 'ankle', elbow: 'elbow', shElev: 'shoulder' };
export const LOKIEC_ZA_BARKIEM = { 'Close-Grip Push-Up': 6, 'Incline Push-Up Close-Grip': 6, 'Diamond Push Up': 6 }; /* cm za barkiem w rzucie bocznym (łokieć w tył) */
/** Grupy błędów POSTAWY (widoczne w każdej klatce); pozostałe (zakres, tempo, bujanie) narastają z fazą ruchu. */
export const GRUPY_POSTAWY = ['linia', 'przeprost', 'lokcie'];
export const RECE_WZDLUZ = ['Lying Leg Raise', 'Reverse Crunch', 'Leg Pull-In', 'Scissor Kick', 'Alternate Heel Touchers'];
export const PODSTAWA_SZEROKA = ['Single-Arm Push-Up'];
export const WYMAGA_PODWIESZENIA = /^Suspended /;
/** R1/R3/R10: podpór na stopach z ciałem prostym (bez Standing Rollout: start w skłonie, Mountain Climbers: kolano w ruchu, Plyo Push-Up: lot). */
export const LINIA_PELNA = ['Push Up', 'Push-Up Wide', 'Close-Grip Push-Up', 'Diamond Push Up', 'Decline Push Up', 'Incline Push Up', 'Incline Push-Up Close-Grip', 'Single-Arm Push-Up', 'Plank', 'Plank Shoulder Taps', 'Suspended Push-Up', 'Suspended Fallout']; /* bez Plyo Push-Up: faza lotu zmienia położenie barków */
export const FALLOUTY = ['Suspended Fallout'];
export const PODPOR_NA_DLONIACH_KOLANO = ['Mountain Climbers'];
/** R6: pompki do podłogi i z podwyższeń (bez zawieszenia — taśmy zmieniają tor przedramienia). */
export const DOL_POMPKI = ['Push Up', 'Push-Up Wide', 'Close-Grip Push-Up', 'Diamond Push Up', 'Decline Push Up', 'Incline Push Up', 'Incline Push-Up Close-Grip'];
/** R7: najmniejsze zgięcie kolana (w KAŻDEJ klatce) w ćwiczeniach z podkulonymi kolanami. */
export const KOLANA_UGIETE = { 'Tuck Crunch': 80, 'Reverse Crunch': 80 };
/** Ćwiczenia delt_raise ze wskazówką lat.height poza regułą dlon_na_wysokosci_barkow_swiat (powód obowiązkowy). Raport 27.10.2026 na wszystkich 30 pozach rodziny: 1 trafienie prawdziwe (Straight Raises on Incline Bench), 1 fałszywy alarm (Car Drivers). */
export const DLON_NA_WYSOKOSCI_BARKOW_WYJATKI = { 'Car Drivers': 'ruch kołowy kierownicy: podniesiona dłoń leży o promień koła (21 cm, rysunek 16,2 cm) nad osią obrotu; wysokość nie jest „ręce poziomo”' };
/** Leżenie PRZODEM na ławce skośnej ze zwisem rąk (opis źródłowy: face down, ręce proste, unoszenie przodem). Front Incline Dumbbell Raise: [OTWARTE] — jedno źródło mówi o siadzie tyłem do oparcia, nie dodawać, dopóki nie ma drugiego. */
export const LEZENIE_PRZODEM = ['Straight Raises on Incline Bench'];
export const REGULY_JAKOSCI = ['blad_widoczny_stale', 'pod_podloga', 'styk_z_podloga_przod', 'zaslanianie_sprzetu', 'rece_wzdluz_ciala', 'klatki_rozne', 'sprzet_rozpoznawczy', 'podstawa_szeroka', 'szyja_neutralna', 'etykieta_bledu', 'odwiedzenie_lokcia', 'lokiec_za_barkiem', 'cialo_w_linii_pelne', 'fallout_start_rece_przod', 'kolana_proste_podpor', 'kolano_pod_tulowiem', 'podpor_bez_kleku', 'lokiec_nad_nadgarstkiem_bok', 'kolana_ugiete_min', 'rece_proste', 'rzad_bledu_nie_lepszy', 'odwiedzenie_lokcia_przod', 'lokiec_nad_nadgarstkiem', 'rozstaw_dloni', 'nic_nie_wisi', 'ledzwie_przy_podlodze', 'rzad_bledu_dotyczy', 'widocznosc_bledu_kat', 'tor_lokcia_przyciaganie', 'zwis_startowy', 'tor_lokcia_srodek', 'proste_rece_rollout', 'srodek_ciezkosci_podparcie', 'dzwon_gora_tylko_przy_pionowym_przedramieniu', 'high_pull_lokcie'];
/** Reguły poziomu manifestu podglądu (nie pozy): zgodność manifestu z obrazem i układ podglądu. */
export const REGULY_MANIFESTU = ['manifest_klatki', 'manifest_przyblizenia', 'manifest_opis_bledu', 'podglad_jeden_wiersz'];

const pts = (f) => { const s = f.sk; return [s.pelvis, s.head, s.shoulderC, s.spineMid, ...['R', 'L'].flatMap((k) => [s.legs[k].knee, s.legs[k].ankle, s.legs[k].heel, s.legs[k].toe, s.arms[k].elbow, s.arms[k].grip])]; };
const maxPrzem = (a, b) => Math.max(...a.map((p, i) => dist3(p, b[i])));
const siatka = (poza, n = 20) => [...new Set([...Array.from({ length: n + 1 }, (_, i) => i / n), ...poza.klatki.map((k) => k.u)])].sort((a, b) => a - b);

/** 1. Błąd postawy (nie błąd zakresu) jest widoczny w KAŻDEJ klatce kluczowej, także w u = 0; rząd błędu różni się od poprawnego tylko tym błędem (reszta kątów ≤ 4° — pilnuje kontrakt). `postural` = zbiór cue błędów postawy. */
export function bladWidocznyStale(v2, poza, postural) {
  const o = [];
  poza.bledy.forEach((b, j) => { if (!postural.has(b.cue)) return; const nie = [];
    for (const k of poza.klatki) { const d = maxPrzem(pts(v2.keyframeFrame(poza, k.u)), pts(v2.keyframeFrame(poza, k.u, j))); if (d < PROGI.bladMinCm) nie.push(`u = ${k.u}: ${f1(d)} cm`); }
    if (nie.length) o.push(`błąd „${b.cue}” (postawa) jest za słabo widoczny w klatkach: ${nie.join('; ')} — musi różnić się o ≥ ${PROGI.bladMinCm} cm w każdej klatce, także w u = 0 (błąd postawy nie narasta z fazą ruchu)`); });
  return o;
}
/** 2. Nic pod podłogą: oś ramienia i przedramienia minus promień, tułów/miednica/głowa — w żadnej klatce (3D, więc w każdym widoku). */
export function podPodloga(v2, poza) {
  const o = []; const seen = new Set(); const B = v2.BODY, G = v2.GIRTH;
  const ramki = [[undefined]]; poza.bledy.forEach((_, j) => ramki.push([j]));
  for (const [j] of ramki) for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u, j).sk; const et = j === undefined ? '' : `błąd ${poza.bledy[j].cue}, `;
    const spr = (nazwa, y, prog) => { if (y < prog && !seen.has(nazwa + et)) { seen.add(nazwa + et); o.push(`${et}${nazwa} schodzi o ${f1(prog - y)} cm pod podłogę (u = ${u}; próg ${prog} cm)`); } };
    for (const k of ['R', 'L']) { const a = s.arms[k]; spr(`przedramię ${k}`, Math.min(a.elbow[1], a.grip[1]) - 3.3, PROGI.podlogaKonczyna); spr(`ramię ${k}`, Math.min(a.shoulder[1], a.elbow[1]) - G.uarm[0], PROGI.podlogaKonczyna); }
    spr('tułów', Math.min(s.pelvis[1], s.shoulderC[1]) - G.trunkCollide, PROGI.podlogaTulow); spr('głowa', s.head[1] - B.headR, PROGI.podlogaTulow); }
  return o;
}
const bbox = (pts2) => pts2.reduce((b, p) => [Math.min(b[0], p[0]), Math.min(b[1], p[1]), Math.max(b[2], p[0]), Math.max(b[3], p[1])], [Infinity, Infinity, -Infinity, -Infinity]);
const polyPts = (s) => s.pts ?? (s.a && s.b ? [s.a, s.b] : []);
/** 3. Styk z podłogą w rzucie z przodu: stopa stojąca na podłodze (podeszwa ≤ 1 cm) ma kształt sięgający linii podłogi (≤ stykFrontCm), a nie wiszący nad nią. `sole` = {R,L} wysokość podeszwy. */
export function stykZPodlogaPrzod(shapes, sole, u = 0) {
  const o = []; for (const k of ['R', 'L']) { if (sole[k] > 1) continue; const s = shapes.find((x) => x.id === 'foot' + k); if (!s) continue; const low = bbox(polyPts(s))[1]; if (low > PROGI.stykFrontCm) o.push(`stopa ${k} stoi na podłodze, a w rzucie z przodu jej kształt kończy się ${f1(low)} cm nad linią podłogi (u = ${u}; ≤ ${PROGI.stykFrontCm} cm)`); }
  return o;
}
/** 4. Kolejność zasłaniania w rzucie z przodu: sprzęt (skrzynia) bliżej widza niż część ciała, z którą nakłada się w rzucie, jest rysowany PO niej. `layerBody` = 0; głębokość kształtu ciała = z − 1000·warstwa. */
export function zaslanianieSprzetu(shapes, boxX1) {
  const o = []; const boxes = shapes.filter((s) => s.id === 'box'); const dep = (s) => s.z; if (!boxes.length) return o;
  for (const bx of boxes) { const bb = bbox(polyPts(bx)); for (const s of shapes) { if (s === bx || !/^(foot|shank|thigh|farm|uarm|torso|shoes?)/.test(s.id ?? '')) continue; const sb = bbox(polyPts(s)); if (sb[2] < bb[0] || sb[0] > bb[2] || sb[3] < bb[1] || sb[1] > bb[3]) continue;
      if (dep(s) < boxX1 && dep(s) >= -500 && dep(bx) < dep(s)) o.push(`„${s.id}” jest dalej od widza niż skrzynia (głębokość ${f1(dep(s))} < ${f1(boxX1)}), ale narysowana przed nią — skrzynia ma ją zasłaniać`); } }
  return [...new Set(o)];
}
/** 5. Ręce leżące wzdłuż ciała (leżenie na plecach): łokieć nie wyżej niż bark (+margines), dłoń blisko podłogi — w KAŻDEJ klatce. */
export function receWzdluzCiala(v2, poza) {
  const o = []; const P = PROGI.receWzdluz; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const a = s.arms[k];
    if (a.elbow[1] > s.shoulderC[1] + P.lokiecNadBarkiemCm) { o.push(`łokieć ${k} (y = ${f1(a.elbow[1])}) jest ${f1(a.elbow[1] - s.shoulderC[1])} cm nad barkiem (u = ${u}) — leżące ręce wzdłuż ciała mają łokieć przy podłodze`); return o; }
    if (a.grip[1] > P.dlonMaxY) { o.push(`dłoń ${k} jest na y = ${f1(a.grip[1])} cm (u = ${u}; ≤ ${P.dlonMaxY}) — ręka wzdłuż ciała leży przy podłodze`); return o; } } }
  return o;
}
/** 6. Kolejne klatki kluczowe różnią się (≥ rozneKlatkiCm w którymś punkcie); ćwiczenie izometryczne ma najwyżej statyczneMaxKlatek klatek. */
export function klatkiRozne(v2, poza, izometryczne) {
  const o = []; if (izometryczne) { if (poza.klatki.length > PROGI.statyczneMaxKlatek) o.push(`ćwiczenie izometryczne ma ${poza.klatki.length} klatek, a ma najwyżej ${PROGI.statyczneMaxKlatek} (poza statyczna: jedna klatka zamiast kopii)`); return o; }
  for (let i = 1; i < poza.klatki.length; i++) { const d = maxPrzem(pts(v2.keyframeFrame(poza, poza.klatki[i - 1].u)), pts(v2.keyframeFrame(poza, poza.klatki[i].u))); const dObr = Math.max(...['R', 'L'].map((sd) => Math.abs((poza.klatki[i].rece?.[sd]?.obrotPrzedramienia ?? 0) - (poza.klatki[i - 1].rece?.[sd]?.obrotPrzedramienia ?? 0)))); /* czysty obrót przedramienia (pronacja/supinacja) nie przemieszcza punktów szkieletu, ale jest widocznym ruchem */ if (d < PROGI.rozneKlatkiCm && dObr < 5) o.push(`klatki ${i - 1} i ${i} (u = ${poza.klatki[i - 1].u} i ${poza.klatki[i].u}) różnią się tylko o ${f1(d)} cm (≥ ${PROGI.rozneKlatkiCm}) — zbędna kopia klatki albo brak ruchu`); }
  return o;
}
/** 7. Sprzęt rozpoznawczy obecny w pozie: ćwiczenia „Suspended …” muszą mieć w sprzecie zawieszenie (taśmy), inaczej wyjątek. */
export function sprzetRozpoznawczy(poza) {
  if (!WYMAGA_PODWIESZENIA.test(poza.cwiczenie)) return [];
  return poza.sprzet.some((g) => g.rodzaj === 'zawieszenie') ? [] : [`ćwiczenie „${poza.cwiczenie}” wymaga zawieszenia (taśm) w sprzęcie, a ma: ${poza.sprzet.map((g) => g.rodzaj).join(', ')} — bez taśm jest nierozpoznawalne (do czasu rodzaju „zawieszenie” w kontrakcie: wyjątek)`];
}
/** 8. Podpór na jednej ręce: rozstaw kostek ≥ podstawaMinCm w każdej klatce (stabilność). */
export function podstawaSzeroka(poza) {
  return poza.klatki.flatMap((k) => { const d = Math.abs(k.nogi.R.kostka[2] - k.nogi.L.kostka[2]); return d < PROGI.podstawaMinCm ? [`rozstaw kostek ${f1(d)} cm (u = ${k.u}), a ma ≥ ${PROGI.podstawaMinCm} cm — podpór na jednej ręce wymaga szerokiej podstawy`] : []; });
}
/** 9. Szyja neutralna w podporze: kąt osi głowy względem osi tułowia ≤ szyjaMaxDeg. */
export function szyjaNeutralna(v2, poza) {
  const o = []; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const dot = s.up[0] * s.headUp[0] + s.up[1] * s.headUp[1] + s.up[2] * s.headUp[2]; const a = (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI; if (a > PROGI.szyjaMaxDeg) { o.push(`kąt głowa–tułów ${f1(a)}° w u = ${u}, a ma ≤ ${PROGI.szyjaMaxDeg}° (szyja nie w przeproście)`); break; } }
  return o;
}
/** 10. Etykieta błędu: każdy identyfikator błędu w pozie ma opis w tekstach wskazówek (żeby recenzent i manifest wiedziały, jaki błąd widzą). `teksty` = pl.json. */
export function etykietaBledu(poza, teksty) { return poza.bledy.filter((b) => !teksty[b.cue]).map((b) => `błąd „${b.cue}” nie ma opisu w lib/cues/text/pl.json — manifest nie powie, jaki błąd pokazuje`); }
/** 11. Odwiedzenie łokcia (kąt ramię–płaszczyzna strzałkowa tułowia przy największym zgięciu łokcia) ≤ próg wariantu: łokcie nie w literę T. */
export function odwiedzenieLokcia(v2, poza) {
  const lim = ODWIEDZENIE[poza.cwiczenie] ?? ODWIEDZENIE.domyslnie; let best = null; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const e = (v2.jointAngles(s, 'R').elbow + v2.jointAngles(s, 'L').elbow) / 2; if (!best || e > best.e) best = { e, s, u }; }
  const o = []; for (const k of ['R', 'L']) { const a = v2.jointAngles(best.s, k).shAbd; if (a > lim) o.push(`odwiedzenie ramienia ${k} przy największym zgięciu łokcia (u = ${best.u}) to ${f1(a)}°, a ma ≤ ${lim}° (łokcie bliżej tułowia, nie w literę T)`); }
  return o;
}
/** 12. Wariant wąski/diamentowy: przy największym zgięciu łokieć leży w rzucie bocznym ≥ N cm za barkiem (łokieć w tył). Kierunek „w tył” = przeciwny do przodu tułowia (do głowy). */
export function lokiecZaBarkiem(v2, poza) {
  const need = LOKIEC_ZA_BARKIEM[poza.cwiczenie]; if (need === undefined) return []; let best = null; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const e = (v2.jointAngles(s, 'R').elbow + v2.jointAngles(s, 'L').elbow) / 2; if (!best || e > best.e) best = { e, s, u }; }
  const s = best.s; const ax = [s.shoulderC[0] - s.pelvis[0], s.shoulderC[1] - s.pelvis[1]]; const l = Math.hypot(...ax); const o = [];
  for (const k of ['R', 'L']) { const el = s.arms[k].elbow; const za = -((el[0] - s.shoulderC[0]) * ax[0] + (el[1] - s.shoulderC[1]) * ax[1]) / l; if (za < need) o.push(`łokieć ${k} jest ${f1(za)} cm za barkiem wzdłuż tułowia (u = ${best.u}), a ma ≥ ${need} cm (łokcie wzdłuż żeber, do tyłu)`); }
  return o;
}

/** 13. Odwiedzenie łokcia widoczne z przodu w KAŻDEJ klatce (ODWIEDZENIE_PRZOD, per ćwiczenie/wariant): arcsin(wysunięcie łokcia w bok poza oś barku / długość ramienia). Poprzednia reguła (11) ocenia tylko klatkę największego zgięcia. */
export function odwiedzenieLokciaPrzod(v2, poza) {
  const lim = ODWIEDZENIE_PRZOD[poza.cwiczenie] ?? ODWIEDZENIE_PRZOD.domyslnie; let naj = null;
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const a = s.arms[k]; const sg = Math.sign(a.shoulder[2]) || 1; const w = Math.max(0, sg * (a.elbow[2] - a.shoulder[2])); const kat = (Math.asin(Math.min(1, w / (dist3(a.shoulder, a.elbow) || 1))) * 180) / Math.PI; if (!naj || kat > naj.kat) naj = { kat, u, k, w }; } }
  const dol = ODWIEDZENIE_DOLNE[poza.cwiczenie]; if (naj && dol !== undefined && naj.kat < dol) return [`największe odwiedzenie łokcia z przodu to ${f1(naj.kat)}°, a „${poza.cwiczenie}” ma łokcie wyraźnie szerzej: ≥ ${dol}° (cecha wariantu szerokiego)`];
  return naj && naj.kat > lim ? [`łokieć ${naj.k} wychodzi w rzucie z przodu ${f1(naj.w)} cm poza oś barku, czyli odwiedzenie ${f1(naj.kat)}° (u = ${naj.u}), a ma ≤ ${lim}° dla „${poza.cwiczenie}” w KAŻDEJ klatce (łokcie nie w literę T)`] : [];
}
/** 13b. Łokieć nad nadgarstkiem w dolnej fazie (klatka największego zgięcia łokcia): różnica z (rzut z przodu) ≤ lokiecNadNadgarstkiemCm. Dotyczy LOKIEC_NAD_NADGARSTKIEM. */
export function lokiecNadNadgarstkiem(v2, poza) {
  let best = null; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const e = (v2.jointAngles(s, 'R').elbow + v2.jointAngles(s, 'L').elbow) / 2; if (!best || e > best.e) best = { e, s, u }; }
  const o = []; for (const k of ['R', 'L']) { const a = best.s.arms[k]; const d = Math.abs(a.elbow[2] - a.grip[2]); if (d > PROGI.lokiecNadNadgarstkiemCm) o.push(`łokieć ${k} jest ${f1(d)} cm od pionu nadgarstka w rzucie z przodu (u = ${best.u}), a ma ≤ ${PROGI.lokiecNadNadgarstkiemCm} cm (łokieć nad nadgarstkiem, przedramię pionowe)`); }
  return o;
}
/** 13c. Rozstaw dłoni (u = 0) jako wielokrotność rozstawu barków: ROZSTAW_DLONI ± rozstawTolerancja. */
export function rozstawDloni(v2, poza) {
  const cel = ROZSTAW_DLONI[poza.cwiczenie]; if (cel === undefined) return []; const s = v2.keyframeFrame(poza, poza.klatki[0].u).sk; const w = Math.abs(s.arms.R.grip[2] - s.arms.L.grip[2]) / (2 * v2.BODY.shHalf);
  return Math.abs(w - cel) > PROGI.rozstawTolerancja ? [`rozstaw dłoni to ${f1(w * 100)}% rozstawu barków, a „${poza.cwiczenie}” ma ${f1(cel * 100)}% ± ${f1(PROGI.rozstawTolerancja * 100)}% (wąski 50%, normalny 100%, szeroki 150%)`] : [];
}
/** 14b. Lędźwie przy podłodze (leżenie na plecach): w KAŻDEJ klatce dolna krawędź odcinka lędźwiowego (połowa drogi miednica → środek tułowia) ≤ ledzwieCm nad podłogą; unosi się tylko odcinek piersiowy. */
export function ledzwiePrzyPodlodze(v2, poza) {
  const G = v2.GIRTH; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const y = (s.pelvis[1] + s.spineMid[1]) / 2 - G.trunkCollide; if (y > PROGI.ledzwieCm) return [`odcinek lędźwiowy leży ${f1(y)} cm nad podłogą (u = ${u}; ≤ ${PROGI.ledzwieCm} cm) — wskazówka: lędźwie przy podłodze, unosi się tylko część piersiowa (spięcie, nie siad)`]; }
  return [];
}
/** 14. Nic nie wisi: w ćwiczeniu na podłodze najniższy punkt tułowia/miednicy (oś − promień kolidera) jest najwyżej wisiCm nad podłogą w każdej klatce (leżąc i siedząc ciało leży). */
export function nicNieWisi(v2, poza) {
  const G = v2.GIRTH; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const nisko = Math.min(s.pelvis[1], s.shoulderC[1]) - G.trunkCollide; if (nisko > PROGI.wisiCm) return [`najniższy punkt tułowia jest ${f1(nisko)} cm nad podłogą (u = ${u}; ≤ ${PROGI.wisiCm} cm) — ciało leży albo siedzi na podłodze, nie wisi w powietrzu`]; }
  return [];
}
/** 15. Rząd błędu zmienia tylko to, co opisuje jego wskazówka: kąty stawów spoza DOTYCZY_BLEDU[cue] różnią się od pozy poprawnej o ≤ rzadBleduTolDeg w każdej klatce (np. „sag” nie zgina kolan). Liczone z kątów, nie z deklaracji `dotyczy` (ta jest wyliczana z tych samych zmian). */
export function rzadBleduDotyczy(v2, poza) {
  const o = [];
  poza.bledy.forEach((b, j) => { const baza = DOTYCZY_BLEDU[b.cue]; if (!baza) return; const dop = new Set([...baza, ...(DOTYCZY_BLEDU_CWICZENIE[poza.cwiczenie]?.[b.cue] ?? [])]); const naj = {};
    for (const u of siatka(poza)) { const a = v2.keyframeFrame(poza, u).sk, c = v2.keyframeFrame(poza, u, j).sk; for (const k of ['R', 'L']) { const x = v2.jointAngles(a, k), y = v2.jointAngles(c, k); for (const [kat, et] of Object.entries(KAT_STAWU)) { if (dop.has(et)) continue; const d = Math.abs(x[kat] - y[kat]); if (d > (naj[et]?.d ?? 0)) naj[et] = { d, u }; } } }
    const zle = Object.entries(naj).filter(([et, v]) => v.d > (TOL_BLEDU[b.cue]?.[et] ?? PROGI.rzadBleduTolDeg));
    if (zle.length) o.push(`błąd „${b.cue}” zmienia też: ${zle.map(([et, v]) => `${et} o ${f1(v.d)}° (u = ${v.u})`).join(', ')} (dozwolone: ${[...dop].join(', ')}; tolerancja ${PROGI.rzadBleduTolDeg}° (wyjątki: ${JSON.stringify(TOL_BLEDU[b.cue] ?? {})}) — rząd błędu ma pokazywać wyłącznie ten jeden błąd`); });
  return o;
}
/** 15b. Minimalna widoczność błędu: różnica kąta stawu z obszaru błędu (R9) względem pozy poprawnej ≥ bladWidocznyDeg w klatce, w której błąd ma być widoczny (błąd postawy: w każdej klatce kluczowej; błąd zakresu: w ostatniej). */
export function widocznoscBleduKat(v2, poza) {
  /* R9: widoczność liczona tylko ze stawów z BAZOWEGO obszaru błędu (DOTYCZY_BLEDU[cue], bez wyjątków per ćwiczenie) i z osi tułowia/kręgosłupa — zmiana niezwiązana z błędem (np. prostowanie łokcia) jej nie spełnia;
     klatki, w których biodro pozy poprawnej jest zgięte o > widocznoscBiodroMaxDeg (rolloutowy start w skłonie), są jawnie zwolnione z wymogu „w każdej klatce”. */
  const o = []; poza.bledy.forEach((b, j) => { const dop = DOTYCZY_BLEDU[b.cue]; if (!dop) return; const us = BLAD_POSTAWY.includes(b.cue) ? poza.klatki.map((k) => k.u) : [poza.klatki[poza.klatki.length - 1].u]; const slabe = [];
    for (const u of us) { const fa = v2.keyframeFrame(poza, u), fc = v2.keyframeFrame(poza, u, j); const a = fa.sk, c = fc.sk; if (BLAD_POSTAWY.includes(b.cue) && Math.max(v2.jointAngles(a, 'R').hip, v2.jointAngles(a, 'L').hip) > PROGI.widocznoscBiodroMaxDeg) continue;
      let m = Math.max(Math.abs((fa.pose?.trunkPitch ?? 0) - (fc.pose?.trunkPitch ?? 0)), Math.abs((fa.pose?.spineBend ?? 0) - (fc.pose?.spineBend ?? 0)));
      for (const k of ['R', 'L']) { const x = v2.jointAngles(a, k), y = v2.jointAngles(c, k); for (const [kat, et] of Object.entries(KAT_STAWU)) if (dop.includes(et)) m = Math.max(m, Math.abs(x[kat] - y[kat])); } if (m < PROGI.bladWidocznyDeg) slabe.push(`u = ${u}: ${f1(m)}°`); }
    if (slabe.length) o.push(`błąd „${b.cue}” jest za słabo widoczny (w stawach swojego obszaru: ${dop.join(', ')} i osi tułowia) w klatkach: ${slabe.join('; ')} — różnica ma być ≥ ${PROGI.bladWidocznyDeg}°`); });
  return o;
}
const odlOdOdcinka = (p, a, b) => { const v = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [p[0] - a[0], p[1] - a[1], p[2] - a[2]]; const t = Math.max(0, Math.min(1, (w[0] * v[0] + w[1] * v[1] + w[2] * v[2]) / ((v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1))); return dist3(p, [a[0] + v[0] * t, a[1] + v[1] * t, a[2] + v[2] * t]); };
const odchylenieLinii = (s) => { const A = dist3(s.legs.R.ankle, s.pelvis) >= dist3(s.legs.L.ankle, s.pelvis) ? s.legs.R.ankle : s.legs.L.ankle; return { miednica: odlOdOdcinka(s.pelvis, s.shoulderC, A), kolano: Math.max(...['R', 'L'].map((k) => odlOdOdcinka(s.legs[k].knee, s.shoulderC, s.legs[k].ankle))) }; };
/** R1. Ciało w linii w KAŻDEJ klatce pozy poprawnej: kolano i miednica ≤ liniaPelnaCm od linii kostka–bark (nie tylko miednica i nie tylko klatka skrajna). */
export function cialoWLiniiPelne(v2, poza) {
  for (const u of siatka(poza)) { const o = odchylenieLinii(v2.keyframeFrame(poza, u).sk); const m = Math.max(o.miednica, o.kolano); if (m > PROGI.liniaPelnaCm) return [`${o.kolano > o.miednica ? 'kolano' : 'miednica'} odchyla się od linii kostka–bark o ${f1(m)} cm (u = ${u}), a ma ≤ ${PROGI.liniaPelnaCm} cm w każdej klatce (ciało proste, nie półprzysiad)`]; }
  return [];
}
/** R2. Fallout, start (u = 0): ręce przed klatką — zgięcie barku ≥ falloutBarkMinDeg i łokieć ≤ falloutLokiecMaxDeg. */
export function falloutStartRecePrzod(v2, poza) {
  const s = v2.keyframeFrame(poza, poza.klatki[0].u).sk; const o = [];
  for (const k of ['R', 'L']) { const a = v2.jointAngles(s, k); if (a.shSag < PROGI.falloutBarkMinDeg) o.push(`zgięcie barku ${k} w u = 0 to ${f1(a.shSag)}°, a ma ≥ ${PROGI.falloutBarkMinDeg}° (ręce przed klatką, nie przy biodrach)`); if (a.elbow > PROGI.falloutLokiecMaxDeg) o.push(`łokieć ${k} w u = 0 zgięty o ${f1(a.elbow)}°, a ma ≤ ${PROGI.falloutLokiecMaxDeg}°`); }
  return o;
}
/** R3. Kolana proste w podporze: zgięcie kolana ≤ koloProsteMaxDeg w każdej klatce pozy poprawnej. */
export function kolanaProstePodpor(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const e = v2.jointAngles(s, k).knee; if (e > PROGI.koloProsteMaxDeg) return [`kolano ${k} zgięte o ${f1(e)}° (u = ${u}), a ma ≤ ${PROGI.koloProsteMaxDeg}° (noga prosta w podporze)`]; } }
  return [];
}
/** R4. Kolano pod tułowiem (Mountain Climbers): |z kolana| − |z biodra| ≤ kolanoPodTulowiemCm i |z kolana| ≤ |z dłoni| w każdej klatce. */
export function kolanoPodTulowiem(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const zd = Math.max(...['R', 'L'].map((k) => Math.abs(s.arms[k].grip[2]))); for (const k of ['R', 'L']) { const l = s.legs[k]; const zk = Math.abs(l.knee[2]); if (zk - Math.abs(l.hip[2]) > PROGI.kolanoPodTulowiemCm || zk > zd) return [`kolano ${k} idzie w bok do z = ${f1(zk)} cm (biodro ${f1(Math.abs(l.hip[2]))}, dłoń ${f1(zd)}; u = ${u}) — kolano ma iść prosto pod klatkę, między ręce (≤ biodro + ${PROGI.kolanoPodTulowiemCm} cm)`]; } }
  return [];
}
/** R5. Podpór na dłoniach bez klęku: najniższe kolano (oś) ≥ kolanoNadPodlogaCm nad podłogą w każdej klatce. */
export function podporBezKleku(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const y = Math.min(s.legs.R.knee[1], s.legs.L.knee[1]); if (y < PROGI.kolanoNadPodlogaCm) return [`najniższe kolano jest ${f1(y)} cm nad podłogą (u = ${u}), a ma ≥ ${PROGI.kolanoNadPodlogaCm} cm (podpór na dłoniach, nie klęk)`]; }
  return [];
}
/** R6. Dół pompki w rzucie z boku (klatka największego zgięcia łokcia ≥ 120°): przedramię ≤ przedramieBokDeg od pionu i łokieć nie niżej niż bark − lokiecPodBarkiemCm. */
export function lokiecNadNadgarstkiemBok(v2, poza) {
  let best = null; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const e = (v2.jointAngles(s, 'R').elbow + v2.jointAngles(s, 'L').elbow) / 2; if (!best || e > best.e) best = { e, s, u }; }
  if (best.e < 120) return []; const o = [];
  for (const k of ['R', 'L']) { const a = best.s.arms[k]; const dx = Math.abs(a.grip[0] - a.elbow[0]), dy = a.elbow[1] - a.grip[1]; const kat = (Math.atan2(dx, Math.abs(dy) || 1e-6) * 180) / Math.PI; const nizej = a.shoulder[1] - a.elbow[1];
    if (kat > PROGI.przedramieBokDeg) o.push(`przedramię ${k} w rzucie z boku odchyla się ${f1(kat)}° od pionu (u = ${best.u}), a ma ≤ ${PROGI.przedramieBokDeg}° (dół pompki, nie zejście na przedramiona)`);
    else if (nizej > PROGI.lokiecPodBarkiemCm) o.push(`łokieć ${k} jest ${f1(nizej)} cm poniżej barku (u = ${best.u}), a ma być nie niżej niż bark − ${PROGI.lokiecPodBarkiemCm} cm`); }
  return o;
}
/** R7. Kolana podkulone: zgięcie kolana ≥ KOLANA_UGIETE[ćwiczenie] w każdej klatce. */
export function kolanaUgieteMin(v2, poza) {
  const min = KOLANA_UGIETE[poza.cwiczenie]; if (min === undefined) return [];
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const e = v2.jointAngles(s, k).knee; if (e < min) return [`kolano ${k} zgięte tylko o ${f1(e)}° (u = ${u}), a „${poza.cwiczenie}” ma ≥ ${min}° w każdej klatce (podkulone kolana — cecha ćwiczenia)`]; } }
  return [];
}
/** R8. Ręce proste (wzdłuż ciała, sięgające): zgięcie łokcia ≤ receProsteMaxDeg w każdej klatce (RECE_WZDLUZ). */
export function receProste(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const e = v2.jointAngles(s, k).elbow; if (e > PROGI.receProsteMaxDeg) return [`łokieć ${k} zgięty o ${f1(e)}° (u = ${u}), a ma ≤ ${PROGI.receProsteMaxDeg}° (ręce proste)`]; } }
  return [];
}
/** R10. Rząd błędu opadania nie jest „lepszy” od pozy poprawnej: odchylenie miednicy od linii kostka–bark w rzędzie błędu ≥ w pozie poprawnej + bladGorszyCm w każdej klatce błędu postawy. */
export function rzadBleduNieLepszy(v2, poza) {
  const o = []; poza.bledy.forEach((b, j) => { if (b.cue !== 'plank.mis.sag') return; const slabe = [];
    for (const k of poza.klatki) { const a = v2.keyframeFrame(poza, k.u).sk, c = v2.keyframeFrame(poza, k.u, j).sk; const d = odchylenieLinii(c).miednica - odchylenieLinii(a).miednica; if (d < PROGI.bladGorszyCm) slabe.push(`u = ${k.u}: ${f1(d)} cm`); }
    if (slabe.length) o.push(`rząd błędu „${b.cue}” nie jest gorszy od pozy poprawnej o ≥ ${PROGI.bladGorszyCm} cm odchylenia miednicy od linii kostka–bark w klatkach: ${slabe.join('; ')} (błąd ma wyglądać gorzej, nie lepiej)`); });
  return o;
}
/** 16b. Proste ręce w rolloutach: zgięcie łokcia ≤ prosteReceDeg w każdej klatce pozy poprawnej (ROLLOUTY). */
export function prosteReceRollout(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const e = v2.jointAngles(s, k).elbow; if (e > PROGI.prosteReceDeg) return [`łokieć ${k} jest zgięty o ${f1(e)}° (u = ${u}), a ma ≤ ${PROGI.prosteReceDeg}° (ręce proste w rolloucie, łokieć ≥ ${180 - PROGI.prosteReceDeg}°)`]; } }
  return [];
}
/** 16d. Tor łokcia w środku ruchu przyciągania (u 0,3…0,7): łokieć nie leży po stronie klatki (≤ lokiecPrzedPlecamiMaxCm przed płaszczyzną pleców). */
export function torLokciaSrodek(v2, poza) {
  const o = [];
  for (const u of siatka(poza).filter((x) => x >= 0.3 && x <= 0.7)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const a = s.arms[k]; const d = [a.elbow[0] - a.shoulder[0], a.elbow[1] - a.shoulder[1], a.elbow[2] - a.shoulder[2]]; const przodem = d[0] * s.front[0] + d[1] * s.front[1] + d[2] * s.front[2]; if (przodem > PROGI.lokiecPrzedPlecamiMaxCm) return [`łokieć ${k} w środku ruchu (u = ${u}) leży ${f1(przodem)} cm przed płaszczyzną pleców, a ma ≤ ${PROGI.lokiecPrzedPlecamiMaxCm} cm (nie po stronie klatki)`]; } }
  return o;
}
/** 16c. Zwis startowy w przyciąganiu (u = 0): ręce w pionie ± zwisKatDeg, drążek nad mostkiem ± zwisMostekCm (oś x; mostek = 15% drogi bark → miednica); tor łokcia w środku ruchu osobno (torLokciaSrodek). */
export function zwisStartowy(v2, poza) {
  const o = []; const s0 = v2.keyframeFrame(poza, poza.klatki[0].u).sk; const most = [s0.shoulderC[0] + (s0.pelvis[0] - s0.shoulderC[0]) * 0.15, s0.shoulderC[1] + (s0.pelvis[1] - s0.shoulderC[1]) * 0.15];
  for (const k of ['R', 'L']) { const a = s0.arms[k]; const d = [a.grip[0] - a.shoulder[0], a.grip[1] - a.shoulder[1]]; const kat = (Math.atan2(Math.abs(d[0]), d[1]) * 180) / Math.PI; if (kat > PROGI.zwisKatDeg) o.push(`ręka ${k} w zwisie startowym odchyla się ${f1(kat)}° od pionu, a ma ≤ ${PROGI.zwisKatDeg}° (ręce proste w pionie)`); const dx = Math.abs(a.grip[0] - most[0]); if (dx > PROGI.zwisMostekCm) { o.push(`drążek jest ${f1(dx)} cm od mostka w osi x (u = ${poza.klatki[0].u}), a ma ≤ ${PROGI.zwisMostekCm} cm (drążek nad mostkiem)`); break; } }
  return o;
}
/** 16. Tor łokcia w przyciąganiu (wiosłowanie odwrócone): w ostatniej klatce łokieć leży najwyżej lokiecPrzedPlecamiMaxCm PRZED płaszczyzną pleców (po stronie klatki, czyli drążka) i nie dalej ku głowie niż bark (kończy przy tułowiu, ku biodrom).
 * Wskazówka: ruch łokcia za linię pleców, mostek do drążka (inv.pull; ExRx BWSupineRow, ACE #84 — por. data/zrodla/figury-sens.json). */
export function torLokciaPrzyciagania(v2, poza) {
  const o = []; const u = poza.klatki[poza.klatki.length - 1].u; const s = v2.keyframeFrame(poza, u).sk;
  for (const k of ['R', 'L']) { const a = s.arms[k]; const d = [a.elbow[0] - a.shoulder[0], a.elbow[1] - a.shoulder[1], a.elbow[2] - a.shoulder[2]]; const przodem = d[0] * s.front[0] + d[1] * s.front[1] + d[2] * s.front[2]; const wBiodra = -(d[0] * s.up[0] + d[1] * s.up[1] + d[2] * s.up[2]);
    if (przodem > PROGI.lokiecPrzedPlecamiMaxCm) o.push(`łokieć ${k} na końcu (u = ${u}) leży ${f1(przodem)} cm PRZED płaszczyzną pleców (po stronie klatki i drążka), a ma ≤ ${PROGI.lokiecPrzedPlecamiMaxCm} cm (łokieć wychodzi za linię pleców, nie przed klatkę)`);
    else if (wBiodra < 0) o.push(`łokieć ${k} na końcu (u = ${u}) leży ${f1(-wBiodra)} cm bliżej głowy niż bark, a ma być przy tułowiu (ku biodrom)`); }
  return o;
}
/** 17. delt_raise, wysokość w UKŁADZIE ŚWIATA (nie stawu): w ostatniej klatce dłoń (przynajmniej jednej ręki) leży |y dłoni − y barku| ≤ dlonWysokoscBarkowCm, a w żadnej klatce żadna dłoń nie jest wyżej niż bark + tyle. */
export function dlonNaWysokosciBarkowSwiat(v2, poza) {
  const o = []; const t = PROGI.dlonWysokoscBarkowCm; const us = siatka(poza); const hs = (u) => { const s = v2.keyframeFrame(poza, u).sk; return ['R', 'L'].map((k) => s.arms[k].grip[1] - s.arms[k].shoulder[1]); };
  const uk = poza.klatki[poza.klatki.length - 1].u; const h1 = hs(uk);
  if (!h1.some((h) => Math.abs(h) <= t)) o.push(`w u = ${uk} dłoń leży ${f1(h1.reduce((a, b) => (Math.abs(a) <= Math.abs(b) ? a : b)))} cm względem barku (świat, oś y), a ma |Δy| ≤ ${t} cm (ręce mniej więcej poziomo, dłonie na wysokości barków)`);
  for (const u of us) { const m = Math.max(...hs(u)); if (m > t) { o.push(`w u = ${u} dłoń leży ${f1(m)} cm nad barkiem (świat), a ma ≤ ${t} cm (nie wyżej niż bark + ${t} cm)`); break; } }
  return o;
}
/** 17b. Leżenie przodem: w każdej klatce klatka piersiowa zwrócona w dół (składowa y wektora „przód” ≤ tulowPrzodemFrontY) — tułów leży przodem do ławki. */
export function tulowPrzodemDoLawki(v2, poza) {
  const o = []; for (const u of siatka(poza)) { const fy = v2.keyframeFrame(poza, u).sk.front[1]; if (fy > PROGI.tulowPrzodemFrontY) { o.push(`w u = ${u} wektor „przód” klatki ma składową pionową ${fy.toFixed(2)}, a ma ≤ ${PROGI.tulowPrzodemFrontY} (tułów leży przodem do ławki, nie plecami)`); break; } } return o;
}
/** 17c. Leżenie przodem ze sztangą, u = 0: przedramię pionowo w dół ± zwisPrzedramieDeg (ręce zwisają). */
export function zwisPrzedramieU0(v2, poza) {
  const o = []; const s = v2.keyframeFrame(poza, poza.klatki[0].u).sk; for (const k of ['R', 'L']) { const a = s.arms[k]; const d = [a.grip[0] - a.elbow[0], a.grip[1] - a.elbow[1], a.grip[2] - a.elbow[2]]; const kat = (Math.acos(Math.max(-1, Math.min(1, -d[1] / Math.hypot(...d)))) * 180) / Math.PI; if (kat > PROGI.zwisPrzedramieDeg) { o.push(`przedramię ${k} w u = ${poza.klatki[0].u} odchyla się ${f1(kat)}° od pionu w dół, a ma ≤ ${PROGI.zwisPrzedramieDeg}° (ręce zwisają)`); break; } } return o;
}
const wskazowkiLatHeight = (cwiczenie) => wskazowkiCwiczenia(cwiczenie).includes('lat.height');
const miedzy = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
/** Środek ciężkości ciała (3D): suma mas segmentów (MASY.masa) w ich środkach mas (MASY.srodek × długość od końca bliższego). */
export function srodekCiezkosci(s) {
  const m = MASY; const czesci = [[m.tulow, miedzy(s.shoulderC, s.pelvis, m.tulow.srodek)], [m.glowa, s.head]];
  for (const k of ['R', 'L']) { const a = s.arms[k], l = s.legs[k]; czesci.push([m.ramie, miedzy(a.shoulder, a.elbow, m.ramie.srodek)], [m.przedramie, miedzy(a.elbow, a.wrist, m.przedramie.srodek)], [m.dlon, miedzy(a.wrist, a.grip, m.dlon.srodek)], [m.udo, miedzy(l.hip, l.knee, m.udo.srodek)], [m.golen, miedzy(l.knee, l.ankle, m.golen.srodek)], [m.stopa, miedzy(l.heel, l.toe, m.stopa.srodek)]); }
  const M = czesci.reduce((t, c) => t + c[0].masa, 0); return [0, 1, 2].map((i) => czesci.reduce((t, c) => t + c[0].masa * c[1][i], 0) / M);
}
/** Wypukła otoczka punktów (x, z), przeciwnie do wskazówek zegara. */
export function otoczka(pts2) {
  const p = [...new Map(pts2.map((q) => [q.join(','), q])).values()].sort((a, b) => a[0] - b[0] || a[1] - b[1]); if (p.length < 3) return p;
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const dol = [], gora = [];
  for (const q of p) { while (dol.length >= 2 && cr(dol[dol.length - 2], dol[dol.length - 1], q) <= 0) dol.pop(); dol.push(q); }
  for (const q of [...p].reverse()) { while (gora.length >= 2 && cr(gora[gora.length - 2], gora[gora.length - 1], q) <= 0) gora.pop(); gora.push(q); }
  return [...dol.slice(0, -1), ...gora.slice(0, -1)];
}
/** Punkty podparcia w płaszczyźnie podłogi (x, z): dłonie i stopy (palce, pięta) dotykające podłogi (oś ≤ stykPodparciaCm). */
export function punktyPodparcia(s) {
  const o = []; for (const k of ['R', 'L']) { const g = s.arms[k].grip; if (g[1] <= PROGI.stykPodparciaCm) o.push([g[0], g[2]]); for (const q of [s.legs[k].toe, s.legs[k].heel]) if (q[1] <= PROGI.stykPodparciaCm / 2) o.push([q[0], q[2]]); }
  return o;
}
/** 17. Środek ciężkości nad podparciem: rzut środka ciężkości na podłogę leży wewnątrz wielokąta podparcia (≥ podparcieMarginesCm od krawędzi) w każdej klatce — podpór jednorącz/jednonóż. */
export function srodekCiezkosciNadPodparciem(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const c = srodekCiezkosci(s); const h = otoczka(punktyPodparcia(s));
    if (h.length < 3) return [`podparcie w u = ${u} nie tworzy wielokąta (${h.length} p.) — środek ciężkości nie ma nad czym się znaleźć`];
    let min = Infinity; for (let i = 0; i < h.length; i++) { const a = h[i], b = h[(i + 1) % h.length]; const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; min = Math.min(min, ((b[0] - a[0]) * (c[2] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) / l); }
    if (min < PROGI.podparcieMarginesCm) return [`rzut środka ciężkości (x = ${f1(c[0])}, z = ${f1(c[2])}) leży ${f1(min)} cm od krawędzi wielokąta podparcia (u = ${u}; ≥ ${PROGI.podparcieMarginesCm} cm wewnątrz) — tułów wypada poza podparcie`]; }
  return [];
}

/** 20. Kettlebell dnem do góry tylko przy pionowym przedramieniu (recenzja p4a r2: bottoms-up wisiał dzwonem do góry na prostej ręce): w KAŻDEJ klatce, w której dzwon wskazuje w górę (kierunek y > 0,75),
 * przedramię trzymającej ręki jest najwyżej dzwonGoraMaxOdPionuDeg od pionu, a dłoń leży nad łokciem. Dotyczy każdej pozy z kettlebellem (trybów gora i wzdluz_gora; inne tryby nie kierują dzwonu w górę). */
export function dzwonGoraTylkoPrzyPionowymPrzedramieniu(v2, poza) {
  const cos = Math.cos((PROGI.dzwonGoraMaxOdPionuDeg * Math.PI) / 180);
  for (const u of siatka(poza, 40)) { const f = v2.keyframeFrame(poza, u);
    for (const p of f.props.filter((x) => x.k === 'kettlebell' && x.dir && x.dir[1] > 0.75)) for (const side of (p.side === 'R' || p.side === 'L' ? [p.side] : ['R', 'L'])) { const a = f.sk.arms[side]; const v = [a.grip[0] - a.elbow[0], a.grip[1] - a.elbow[1], a.grip[2] - a.elbow[2]]; const n = Math.hypot(...v) || 1;
      if (v[1] / n < cos) return [`kettlebell dnem do góry (dzwon nad rączką) w u = ${u}, a przedramię ${side} jest ${f1((Math.acos(Math.max(-1, Math.min(1, v[1] / n))) * 180) / Math.PI)}° od pionu (≤ ${PROGI.dzwonGoraMaxOdPionuDeg}°) — w zwisie i wymachu dzwon wisi pod rączką, do góry dopiero przy pionowym przedramieniu`]; } }
  return [];
}
/** 21. High pull: w ostatniej klatce łokieć leży nie niżej niż dłoń minus highPullLokiecPodDloniaCm, a odwiedzenie ramienia wynosi co najmniej highPullOdwiedzenieMinDeg (łokcie wysoko i na boki, nie uginanie z ciężarem pod brodą). */
export function highPullLokcie(v2, poza) {
  const o = []; const u = poza.klatki[poza.klatki.length - 1].u; const s = v2.keyframeFrame(poza, u).sk;
  for (const k of ['R', 'L']) { const a = s.arms[k]; const pod = a.grip[1] - a.elbow[1]; const abd = v2.jointAngles(s, k).shAbd;
    if (pod > PROGI.highPullLokiecPodDloniaCm) { o.push(`łokieć ${k} na końcu (u = ${u}) leży ${f1(pod)} cm pod dłonią, a ma być nie niżej niż dłoń − ${PROGI.highPullLokiecPodDloniaCm} cm (łokcie prowadzą w górę, nad dłonią)`); break; }
    if (abd < PROGI.highPullOdwiedzenieMinDeg) { o.push(`odwiedzenie ramienia ${k} na końcu (u = ${u}) to ${f1(abd)}°, a ma być ≥ ${PROGI.highPullOdwiedzenieMinDeg}° (łokcie na boki, nie w przód)`); break; } }
  return o;
}

/** 18. Zgodność manifestu podglądu z obrazem (poziom manifestu, nie pozy): (a) liczba i położenie klatek na obrazie = klatki_u; (b) ćwiczenie z przybliżeń jest w zestawie albo w wyjątkach z powodem;
 * (c) każdy identyfikator błędu (rząd w pozie i wskazówki katalogu) ma opis w tekstach albo jawny wyjątek z powodem (`wyjatkiOpisu`: id → powód). Zwraca [{ regula, szczegol }]. */
export function zgodnoscManifestu(manifest, teksty, wyjatkiOpisu = {}) {
  const out = []; const dodaj = (regula, szczegol) => out.push({ regula, szczegol }); const cw = manifest.cwiczenia ?? [];
  for (const c of cw) {
    if (!Array.isArray(c.klatki_na_obrazie)) dodaj('manifest_klatki', `${c.cwiczenie}: manifest nie podaje klatek na obrazie (klatki_na_obrazie) — nie da się sprawdzić zgodności z klatki_u`);
    else if (JSON.stringify(c.klatki_na_obrazie) !== JSON.stringify(c.klatki_u)) dodaj('manifest_klatki', `${c.cwiczenie}: obraz ma ${c.klatki_na_obrazie.length} klatek (${c.klatki_na_obrazie.join(', ')}), a klatki_u ma ${c.klatki_u.length} (${c.klatki_u.join(', ')})`);
    for (const id of new Set([...(c.bledy_wskazowki_id ?? []), ...(c.bledy_w_pozie ?? [])])) if (!teksty[id] && !wyjatkiOpisu[id]) dodaj('manifest_opis_bledu', `${c.cwiczenie}: błąd „${id}” nie ma opisu w lib/cues/text/pl.json ani wyjątku z powodem`);
  }
  for (const [id, powod] of Object.entries(wyjatkiOpisu)) if (!String(powod ?? '').trim()) dodaj('manifest_opis_bledu', `wyjątek opisu „${id}” bez powodu`);
  for (const nazwa of Object.keys(manifest.przyblizenia ?? {})) if (!cw.some((c) => c.cwiczenie === nazwa) && !String(manifest.wyjatki?.[nazwa] ?? '').trim()) dodaj('manifest_przyblizenia', `„${nazwa}” jest w przybliżeniach, a nie ma go w zestawie ani w wyjątkach z powodem — wypada z pomiaru po cichu`);
  for (const [nazwa, powod] of Object.entries(manifest.wyjatki ?? {})) if (!String(powod ?? '').trim()) dodaj('manifest_przyblizenia', `wyjątek „${nazwa}” bez powodu`);
  return out;
}
/** Tabela kątów stawów dla recenzenta (recenzja n4, krok 5 listy kontrolnej bramki 4): min i max na staw w całym ruchu pozy poprawnej (obie strony, siatka + klatki). Recenzent porównuje ją z opisem ćwiczenia, nie tylko z obrazem.
 * Kąty z silnika: zgięcie dodatnie (łokieć i kolano proste = 0°, noga „prosta” w tym rigu ≈ 10–18°: uda + golenie = 83 cm, więc 1 cm niedoboru odległości to ok. 14°); biodro ze znakiem (przeprost < 0); bark: zgięcie w płaszczyźnie strzałkowej (shSag), uniesienie (shElev), odwiedzenie (shAbd). */
export const STAWY_TABELA = { hip: 'biodro', knee: 'kolano', ankle: 'kostka', elbow: 'łokieć', shSag: 'bark zgięcie', shElev: 'bark uniesienie', shAbd: 'bark odwiedzenie' };
export function tabelaKatow(v2, poza) {
  const t = {}; for (const k of Object.keys(STAWY_TABELA)) t[k] = { min: Infinity, max: -Infinity };
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const side of ['R', 'L']) { const a = v2.jointAngles(s, side); for (const k of Object.keys(STAWY_TABELA)) { t[k].min = Math.min(t[k].min, a[k]); t[k].max = Math.max(t[k].max, a[k]); } } }
  for (const k of Object.keys(t)) { t[k].min = Math.round(t[k].min * 10) / 10; t[k].max = Math.round(t[k].max * 10) / 10; } return t;
}
/** Tabela kątów jako Markdown (jeden wiersz na ćwiczenie): `wiersze` = [{ cwiczenie, katy }]. */
export function tabelaKatowMd(wiersze) {
  const kol = Object.entries(STAWY_TABELA); const L = [`| ćwiczenie | ${kol.map(([, n]) => n).join(' | ')} |`, `|---|${kol.map(() => '---').join('|')}|`];
  for (const w of wiersze) L.push(`| ${w.cwiczenie} | ${kol.map(([k]) => `${f1(w.katy[k].min)}…${f1(w.katy[k].max)}°`).join(' | ')} |`); return L.join('\n') + '\n';
}
/** P1 (recenzja n4): podgląd jest WAŻNY dla recenzji tylko z wynikiem kontroli manifestu (`zgodnosc_manifestu`: tablica; pusta = zgodny) i tabelą kątów stawów (`katy_stawow`) przy każdym ćwiczeniu, a każde ćwiczenie ma obraz. Zwraca listę powodów nieważności (pusta = ważny). */
export function podgladWazny(manifest) {
  const o = []; if (!Array.isArray(manifest.zgodnosc_manifestu)) o.push('manifest nie ma pola zgodnosc_manifestu — kontrola manifestu (zgodnoscManifestu) nie została uruchomiona przy budowie podglądu');
  else if (manifest.zgodnosc_manifestu.length) o.push(`kontrola manifestu zgłasza ${manifest.zgodnosc_manifestu.length} niezgodności (${manifest.zgodnosc_manifestu.map((x) => x.regula).join(', ')})`);
  for (const c of manifest.cwiczenia ?? []) { if (!c.obraz) o.push(`${c.cwiczenie}: brak obrazu PNG`); if (!c.katy_stawow || !c.katy_stawow.knee) o.push(`${c.cwiczenie}: brak tabeli kątów stawów (katy_stawow)`); }
  return o;
}
/** 19. Układ podglądu: wszystkie komórki jednego wiersza (poprawna poza / błąd) leżą w jednej linii — mają wspólną dolną krawędź (wiersz wyrównany do dołu; zawinięta komórka ma dolną krawędź o wysokość wiersza niżej). `wiersze` = [{ etykieta, dolne: [px…] }] (pomiar z przeglądarki). */
export function wierszeWJednejLinii(wiersze, tolPx = 2) {
  return wiersze.flatMap((w) => { const t = w.dolne; const rozrzut = t.length ? Math.max(...t) - Math.min(...t) : 0; return rozrzut > tolPx ? [`wiersz „${w.etykieta}”: komórki mają różne położenie pionowe (rozrzut ${f1(rozrzut)} px) — klatki jednego rzędu muszą leżeć w jednym wierszu`] : []; });
}

/** Wszystkie reguły dla pozy (waliduj): [{ kod: 'jakosc', regula, szczegol }]. `ctx` = { v2, rodzina, cwiczenie, postural:Set, izometryczne, teksty }. */
export function sprawdzJakosc(poza, ctx) {
  const { v2, rodzina, cwiczenie, postural, izometryczne, teksty } = ctx; const out = []; const dodaj = (regula, lista) => lista.forEach((szczegol) => out.push({ kod: 'jakosc', regula, szczegol: `${regula}: ${szczegol}` }));
  dodaj('blad_widoczny_stale', bladWidocznyStale(v2, poza, postural)); dodaj('pod_podloga', podPodloga(v2, poza));
  const front = poza.klatki.flatMap((k) => { const f = v2.keyframeFrame(poza, k.u); const sole = { R: Math.min(f.sk.legs.R.heel[1], f.sk.legs.R.toe[1]), L: Math.min(f.sk.legs.L.heel[1], f.sk.legs.L.toe[1]) }; const sh = v2.dataShapes(poza, k.u, 'front'); return stykZPodlogaPrzod(sh, sole, k.u); });
  dodaj('styk_z_podloga_przod', [...new Set(front)].slice(0, 3));
  const box = poza.sprzet.filter((g) => g.rodzaj === 'skrzynia'); if (box.length) dodaj('zaslanianie_sprzetu', zaslanianieSprzetu(v2.dataShapes(poza, 0, 'front'), Math.max(...box.map((g) => g.x1 ?? 0))));
  if (RECE_WZDLUZ.includes(cwiczenie)) { dodaj('rece_wzdluz_ciala', receWzdluzCiala(v2, poza)); dodaj('rece_proste', receProste(v2, poza)); }
  if (rodzina === 'pushup_plank') { if (LINIA_PELNA.includes(cwiczenie)) { dodaj('cialo_w_linii_pelne', cialoWLiniiPelne(v2, poza)); dodaj('kolana_proste_podpor', kolanaProstePodpor(v2, poza)); dodaj('rzad_bledu_nie_lepszy', rzadBleduNieLepszy(v2, poza)); } if (FALLOUTY.includes(cwiczenie)) dodaj('fallout_start_rece_przod', falloutStartRecePrzod(v2, poza)); if (PODPOR_NA_DLONIACH_KOLANO.includes(cwiczenie)) { dodaj('kolano_pod_tulowiem', kolanoPodTulowiem(v2, poza)); dodaj('podpor_bez_kleku', podporBezKleku(v2, poza)); } if (DOL_POMPKI.includes(cwiczenie)) dodaj('lokiec_nad_nadgarstkiem_bok', lokiecNadNadgarstkiemBok(v2, poza)); }
  if (cwiczenie in KOLANA_UGIETE) dodaj('kolana_ugiete_min', kolanaUgieteMin(v2, poza));
  dodaj('klatki_rozne', klatkiRozne(v2, poza, izometryczne)); dodaj('sprzet_rozpoznawczy', sprzetRozpoznawczy(poza));
  if (PODSTAWA_SZEROKA.includes(cwiczenie)) dodaj('podstawa_szeroka', podstawaSzeroka(poza));
  if (rodzina === 'pushup_plank') { dodaj('szyja_neutralna', szyjaNeutralna(v2, poza)); if (/Push[- ]?Up|Inverted Row/.test(cwiczenie)) { dodaj('odwiedzenie_lokcia', odwiedzenieLokcia(v2, poza)); dodaj('lokiec_za_barkiem', lokiecZaBarkiem(v2, poza)); } }
  dodaj('etykieta_bledu', etykietaBledu(poza, teksty ?? {}));
  if (rodzina === 'pushup_plank' && /Push[- ]?Up|Inverted Row/.test(cwiczenie)) dodaj('odwiedzenie_lokcia_przod', odwiedzenieLokciaPrzod(v2, poza));
  if (rodzina === 'core_floor' && !NIE_LEZY.includes(cwiczenie) && !(cwiczenie in LOT)) dodaj('nic_nie_wisi', nicNieWisi(v2, poza));
  if (rodzina === 'core_floor' && !(cwiczenie in LEDZWIE_WYJATKI) && !NIE_LEZY.includes(cwiczenie) && maWskazowkeLedzwie(cwiczenie, teksty ?? {})) dodaj('ledzwie_przy_podlodze', ledzwiePrzyPodlodze(v2, poza));
  dodaj('rzad_bledu_dotyczy', rzadBleduDotyczy(v2, poza));
  if (PRZYCIAGANIE.includes(cwiczenie)) { dodaj('tor_lokcia_przyciaganie', torLokciaPrzyciagania(v2, poza)); dodaj('zwis_startowy', zwisStartowy(v2, poza)); dodaj('tor_lokcia_srodek', torLokciaSrodek(v2, poza)); }
  if (rodzina === 'delt_raise' && wskazowkiLatHeight(cwiczenie) && !(cwiczenie in DLON_NA_WYSOKOSCI_BARKOW_WYJATKI)) dodaj('dlon_na_wysokosci_barkow_swiat', dlonNaWysokosciBarkowSwiat(v2, poza));
  if (LEZENIE_PRZODEM.includes(cwiczenie)) { dodaj('tulow_przodem_do_lawki', tulowPrzodemDoLawki(v2, poza)); dodaj('zwis_przedramie_u0', zwisPrzedramieU0(v2, poza)); }
  if (ROLLOUTY.includes(cwiczenie)) dodaj('proste_rece_rollout', prosteReceRollout(v2, poza));
  dodaj('widocznosc_bledu_kat', widocznoscBleduKat(v2, poza));
  if (poza.sprzet.some((g) => g.rodzaj === 'kettlebell')) dodaj('dzwon_gora_tylko_przy_pionowym_przedramieniu', dzwonGoraTylkoPrzyPionowymPrzedramieniu(v2, poza));
  if (HIGH_PULL.includes(cwiczenie)) dodaj('high_pull_lokcie', highPullLokcie(v2, poza));
  if (PODPARCIE_ZMIENNE.includes(cwiczenie)) dodaj('srodek_ciezkosci_podparcie', srodekCiezkosciNadPodparciem(v2, poza));
  return out;
}
export const wczytajTeksty = (root = ROOT) => { const p = path.join(root, 'lib/cues/text/pl.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}; };
