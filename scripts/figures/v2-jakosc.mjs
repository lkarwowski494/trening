// Reguły JAKOŚCI póz figur v2 (docs/53, bramka 3 i 4; L-040): luki znalezione przez recenzenta ruchu w pilotażu agent-pozy 26.10.2026 zamienione w sprawdzenia automatyczne.
// Każda reguła: funkcja czysta (poza lub kształty → lista komunikatów z liczbami), id w REGULY_JAKOSCI, test na pozie spełniającej i łamiącej (tests/figury-jakosc.test.ts).
// Używa je waliduj() (v2-validate.mjs, kod „jakosc”) po przejściu schematu, geometrii i sensu; liczby w PROGI (jedno miejsce).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const R = Math.PI / 180;
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
  podparcieMarginesCm: 2, /* podpór jednorącz/jednonóż: rzut środka ciężkości leży wewnątrz wielokąta podparcia o co najmniej tyle */
  lokiecNadNadgarstkiemCm: 8, /* dolna faza: |łokieć z − dłoń z| ≤ tyle (przedramię pionowe z przodu; wymiar: ok. 40% szerokości barków) */
  rozstawTolerancja: 0.25, /* rozstaw dłoni = wielokrotność rozstawu barków ± tyle */
  ledzwieCm: 3, /* leżenie na plecach z wskazówką „lędźwie przy podłodze”: dolna krawędź odcinka lędźwiowego (25% długości tułowia od miednicy, po krzywiźnie kręgosłupa) najwyżej tyle nad podłogą */
  bladWidocznyDeg: 8, /* błąd widoczny w klatce: kąt któregokolwiek stawu różni się od pozy poprawnej o ≥ tyle (błąd postawy: w każdej klatce kluczowej; błąd zakresu: w ostatniej) */
  rolloutRekaMaxCm: 30, /* rollout: chwyt na sztandze/kole przy podłodze (z talerzami ok. 22 cm); mostek biodrowy ze sztangą ma chwyt wyżej lub barki na podłodze */
  rolloutBarkiMinCm: 40, /* rollout: barki wyżej niż tyle nad podłogą, gdy ręce są przy podłodze (odróżnia od mostka, gdzie barki leżą) */
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
  rzadBleduKolanoDeg: 10, /* tolerancja dla kolana: noga prawie prosta (uda + golenie = 83 cm) zmienia kąt kolana o ok. 14° na każdy 1 cm odległości biodro–kostka, więc 8° było zbyt ostre (fałszywy alarm Pike Push Up: 8,5°); konwencja */
  rzadBleduTolDeg: 8, /* staw spoza obszaru błędu (WSZYSTKIE: biodro, kolano, kostka, łokieć, bark) może się różnić od pozy poprawnej najwyżej o tyle; wyjątki: TOL_BLEDU */
  kolanoStykCm: 11, /* R13: klęk (z deklaracji ćwiczenia): oś kolana najwyżej tyle nad powierzchnią podparcia (podłoga albo blat ławki) w każdej klatce; kolano klęczące leży ok. 9,8 cm nad powierzchnią */
  ksztaltPodPodlogaCm: -3.5, /* R15: dolna krawędź narysowanych kształtów ciała (tułów, kończyny) w rzucie z boku i z przodu nie niżej niż (cm; pozy leżące mają −2,0, Superman −2,9 z grubości kształtu) */
  tulowUnosiMinDeg: 15, kregoslupZwijaMinDeg: 20, /* R16: gdy tułów unosi się o więcej niż tyle ponad podłogę, kręgosłup zgina się o co najmniej tyle (zwija się, nie sztywna deska) */
  zwijanieMiednicaCm: 3, zwijanieKregoslupDeg: 20, vUpMinDeg: 30, /* R14b: mechanizm wyjątku „zwijanie obu końców” (miednica unosi się ≥ cm, kręgosłup zgięty ≥ stopni) i „V” (tułów i nogi razem ≥ stopni nad podłogą) */
  declineNachylenieMaxDeg: 5, /* R19 (n7): wariant decline pompki, u = 0: linia kostka–bark wznosi się ku głowie najwyżej tyle stopni nad poziom (konwencja rysunku; Decline n6 miało +15,5°, n7 +0,3°, zwykła pompka +20,1°) */
  lezenieUgniecenieCm: 1.5, /* R21 (n7): poza leżąca, u = 0: środek miednicy najwyżej tyle cm NIŻEJ niż promień kolizji tułowia z silnika (GIRTH.trunkCollide = 9,5); 8,0 starszych póz = 9,5 − 1,5. Konwencja rysunku bez źródła; wyżej dopuszczalne wisiCm */
  stykPodparciaCm: 4.5, /* punkt ciała uznany za podparcie, gdy jego (oś) wysokość ≤ tyle: dłoń, stopa, kolano (promień kończyny) */
};
/** P2 (recenzja n5): kierunek progów (max: wielkość ≤ próg; min: wielkość ≥ próg). Progi bramkujące (rolloutRekaMaxCm, rolloutBarkiMinCm, stykPodparciaCm, widocznoscBiodroMaxDeg, tulowUnosiMinDeg, statyczneMaxKlatek) i obiekty nie są zaostrzane. */
export const PROGI_MAX = ['declineNachylenieMaxDeg', 'lezenieUgniecenieCm', 'liniaPelnaCm', 'koloProsteMaxDeg', 'kolanoPodTulowiemCm', 'przedramieBokDeg', 'receProsteMaxDeg', 'rzadBleduKolanoDeg', 'rzadBleduTolDeg', 'wisiCm', 'lokiecPrzedPlecamiMaxCm', 'lokiecNadNadgarstkiemCm', 'ledzwieCm', 'prosteReceDeg', 'zwisKatDeg', 'zwisMostekCm', 'falloutLokiecMaxDeg', 'szyjaMaxDeg', 'rozstawTolerancja', 'stykFrontCm', 'kolanoStykCm', 'lokiecPodBarkiemCm'];
export const PROGI_MIN = ['bladMinCm', 'rozneKlatkiCm', 'podstawaMinCm', 'kolanoNadPodlogaCm', 'kolanaUgieteMinDeg', 'bladGorszyCm', 'bladWidocznyDeg', 'falloutBarkMinDeg', 'podparcieMarginesCm', 'podlogaKonczyna', 'podlogaTulow', 'ksztaltPodPodlogaCm', 'kregoslupZwijaMinDeg', 'zwijanieMiednicaCm', 'zwijanieKregoslupDeg', 'vUpMinDeg'];
export const marginesJakosci = (v) => Math.max(0.05 * Math.abs(v), Math.abs(v) >= 4 ? 1 : 0);
/** Wykonuje `fn` z progami zaostrzonymi o margines (P2) i przywraca progi. */
export function zZaostrzonymiProgami(fn) {
  const kopia = { ...PROGI }; try { for (const k of PROGI_MAX) PROGI[k] = kopia[k] - marginesJakosci(kopia[k]); for (const k of PROGI_MIN) PROGI[k] = kopia[k] + marginesJakosci(kopia[k]); return fn(); } finally { Object.assign(PROGI, kopia); }
}
/** Reguły jakości, które poza spełnia z zapasem mniejszym niż margines progu (przechodzi próg, nie przechodzi progu zaostrzonego): [{ regula, szczegol }]. */
export function krawedzJakosci(poza, ctx) {
  const baza = new Set(sprawdzJakosc(poza, ctx).map((x) => x.regula)); return zZaostrzonymiProgami(() => sprawdzJakosc(poza, ctx)).filter((x) => !baza.has(x.regula)).map((x) => ({ regula: x.regula, szczegol: x.szczegol }));
}
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
export const LEDZWIE_WYJATKI = { 'V-Up': 'zamierzone: „V” na kości krzyżowej, tułów i nogi unoszą się jednocześnie', 'Cocoons': 'zamierzone: zwijanie obu końców, styk na kości krzyżowej' };
/** Mechanizm, który musi występować w pozie, żeby wyjątek od reguły „lędźwie przy podłodze” był prawdziwy (R14b): 'zwijanie' = miednica unosi się i kręgosłup się zgina; 'v' = tułów i nogi unoszą się jednocześnie. */
export const LEDZWIE_MECHANIZM = { 'V-Up': 'v', 'Cocoons': 'zwijanie' };
/** Wskazówka ćwiczenia, która czyni z lędźwi przy podłodze sprawdzalny warunek obrazu (tekst w lib/cues/text/pl.json). */
export const WSKAZOWKA_LEDZWIE = /Lędźwi\w* przy podłodze|Dolna część pleców zostaje na podłodze/i;
/** Czy wskazówki ćwiczenia (zestaw ogólny cue-sets.json albo własne lib/cues/data.json; teksty `teksty`) zawierają warunek „lędźwie przy podłodze”. */
export function maWskazowkeLedzwie(cwiczenie, teksty, root = ROOT) { return maWskazowke(cwiczenie, teksty, WSKAZOWKA_LEDZWIE, root); }
function maWskazowkeLedzwieStare(cwiczenie, teksty, root = ROOT) {
  const set = JSON.parse(fs.readFileSync(path.join(root, 'lib/figures/v2/cue-sets.json'), 'utf8')).items?.[cwiczenie]; const wlasne = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/data.json'), 'utf8')).exercises?.[cwiczenie];
  const ids = [...(set?.ok ?? []), ...Object.values(wlasne ?? {}).flat().map((c) => c.c).filter(Boolean)]; return ids.some((id) => WSKAZOWKA_LEDZWIE.test(teksty[id] ?? ''));
}
/** Przyciąganie w poziomie (łokieć kończy za plecami): tylko ćwiczenia z tej listy. */
export const PRZYCIAGANIE = ['Inverted Row'];
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
export const REGULY_JAKOSCI = ['blad_widoczny_stale', 'pod_podloga', 'styk_z_podloga_przod', 'zaslanianie_sprzetu', 'rece_wzdluz_ciala', 'klatki_rozne', 'sprzet_rozpoznawczy', 'podstawa_szeroka', 'szyja_neutralna', 'etykieta_bledu', 'odwiedzenie_lokcia', 'lokiec_za_barkiem', 'cialo_w_linii_pelne', 'fallout_start_rece_przod', 'kolana_proste_podpor', 'kolano_pod_tulowiem', 'podpor_bez_kleku', 'lokiec_nad_nadgarstkiem_bok', 'kolana_ugiete_min', 'rece_proste', 'rzad_bledu_nie_lepszy', 'odwiedzenie_lokcia_przod', 'lokiec_nad_nadgarstkiem', 'rozstaw_dloni', 'nic_nie_wisi', 'ledzwie_przy_podlodze', 'rzad_bledu_dotyczy', 'widocznosc_bledu_kat', 'tor_lokcia_przyciaganie', 'zwis_startowy', 'tor_lokcia_srodek', 'proste_rece_rollout', 'srodek_ciezkosci_podparcie', 'podparcie_kolan', 'ksztalty_nad_podloga', 'styk_z_podlozem', 'styk_kazdego_podparcia', 'podparcie_wyzej_niz_dlonie', 'baza_lezenia', 'kregoslup_zwija_sie', 'wyjatek_nie_przeczy_wskazowce', 'wyjatek_wymaga_mechanizmu'];
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
    const zle = Object.entries(naj).filter(([et, v]) => v.d > (TOL_BLEDU[b.cue]?.[et] ?? (et === 'knee' ? PROGI.rzadBleduKolanoDeg : PROGI.rzadBleduTolDeg)));
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
  const min = KOLANA_UGIETE[poza.cwiczenie] ?? PROGI.kolanaUgieteMinDeg;
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

/** R13. Podparcie kolan z deklaracji ćwiczenia (figury-cechy.json: klęk na ławce / na podłodze): oś kolana najwyżej kolanoStykCm nad powierzchnią (blat ławki albo podłoga) w każdej klatce, a przy ławce w jej obrębie (x ± dlugosc). */
export function podparcieKolan(v2, poza, powierzchnia) {
  const lawka = poza.sprzet.find((g) => g.rodzaj === 'lawka'); if (powierzchnia === 'lawka' && !lawka) return ['ćwiczenie deklaruje klęk na ławce, a poza nie ma ławki w sprzęcie'];
  const y0 = powierzchnia === 'lawka' ? (lawka.top ?? 0) : 0; const nazwa = powierzchnia === 'lawka' ? 'blatem ławki' : 'podłogą';
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; for (const k of ['R', 'L']) { const kn = s.legs[k].knee; const h = kn[1] - y0;
    if (h > PROGI.kolanoStykCm) return [`kolano ${k} (oś) jest ${f1(h)} cm nad ${nazwa} (u = ${u}; ≤ ${PROGI.kolanoStykCm} cm) — ćwiczenie z klękiem: kolana i golenie opierają się o powierzchnię`];
    if (lawka && powierzchnia === 'lawka' && Math.abs(kn[0] - lawka.x) > (lawka.dlugosc ?? 0)) return [`kolano ${k} (x = ${f1(kn[0])}) leży poza blatem ławki (x ${f1(lawka.x)} ± ${lawka.dlugosc} cm, u = ${u})`]; } }
  return [];
}
const CIALO_KSZTALT = /^(thigh|shorts|shank|foot|uarm|farm|hand|torso|neck)/;
/** R15. Narysowane kształty ciała (nie tylko punkty osi) nad podłogą: dolna krawędź kształtów tułowia i kończyn w rzucie z boku i z przodu, w pozie poprawnej i w każdym rzędzie błędu, nie niżej niż ksztaltPodPodlogaCm. */
export function ksztaltyNadPodloga(v2, poza) {
  for (const err of [undefined, ...poza.bledy.map((_, i) => i)]) for (const u of siatka(poza, 12)) for (const view of ['side', 'front']) {
    for (const sh of v2.dataShapes(poza, u, view, err)) { if (sh.k !== 'poly' || !CIALO_KSZTALT.test(sh.id ?? '')) continue; const y = Math.min(...sh.pts.map((q) => q[1]));
      if (y < PROGI.ksztaltPodPodlogaCm) return [`kształt „${sh.id}” sięga ${f1(y)} cm (rzut z ${view === 'side' ? 'boku' : 'przodu'}, u = ${u}${err === undefined ? '' : `, błąd ${err}`}), a ma ≥ ${PROGI.ksztaltPodPodlogaCm} cm — kształt schodzi pod podłogę`]; } }
  return [];
}
/** R17. Styk z podłożem (niezmiennik, bez warunku cechy ćwiczenia; recenzja n6): w każdej klatce najniższy punkt NARYSOWANEGO ciała (rzut z boku) leży najwyżej wisiCm nad podłożem pod nim: podłogą albo wierzchem zadeklarowanej skrzyni/ławki.
 * Wyjątki: ćwiczenie z zadeklarowanym lotem (LOT) i ciało podwieszone (chwyt ≥ PODWIESZENIE_MIN_CM nad podłogą na sprzęcie zawieszenie/sztanga; zwis na drążku nie dotyka podłoża). */
export const PODWIESZENIE_MIN_CM = 120;
/** Dłoń na gryfie sztangi leżącej na talerzach na podłodze (rollout): spód dłoni ok. tyle cm pod osią gryfu (konwencja rysunku); gryf na talerzach jest podłożem dla dłoni. */
export const DLON_POD_OSIA_GRYFU_CM = 3;
/** Powierzchnie, na których może stać albo opierać się ciało: podłoga, wierzch skrzyni i ławki, gryf na talerzach (dla dłoni). Zawsze jest podłoga y = 0. */
export function powierzchniePodparcia(poza) {
  const pow = poza.sprzet.filter((g) => ['podloga', 'skrzynia', 'lawka'].includes(g.rodzaj)).map((g) => g.rodzaj === 'podloga' ? { y: 0, x0: g.x0 ?? -1e9, x1: g.x1 ?? 1e9, rodzaj: 'podloga' } : g.rodzaj === 'skrzynia' ? { y: g.top ?? 0, x0: g.x0, x1: g.x1, rodzaj: 'skrzynia' } : { y: g.top ?? 0, x0: (g.x ?? 0) - (g.dlugosc ?? 0), x1: (g.x ?? 0) + (g.dlugosc ?? 0), rodzaj: 'lawka' });
  for (const g of poza.sprzet) if (g.rodzaj === 'sztanga' && g.talerze && (g.y ?? 0) < PODWIESZENIE_MIN_CM) pow.push({ y: (g.y ?? 0) - DLON_POD_OSIA_GRYFU_CM, x0: -1e9, x1: 1e9 });
  if (!pow.some((q) => q.y === 0)) pow.push({ y: 0, x0: -1e9, x1: 1e9 });
  return pow;
}
export function stykZPodlozem(v2, poza) {
  if (poza.cwiczenie in LOT) return [];
  const hang = poza.sprzet.some((g) => g.rodzaj === 'zawieszenie' || (g.rodzaj === 'sztanga' && (g.y ?? 0) >= PODWIESZENIE_MIN_CM));
  const pow = powierzchniePodparcia(poza);
  for (const u of siatka(poza, 12)) {
    if (hang && ['R', 'L'].some((k) => v2.keyframeFrame(poza, u).sk.arms[k].grip[1] >= PODWIESZENIE_MIN_CM)) continue;
    let nisko = null; for (const sh of v2.dataShapes(poza, u, 'side')) { if (sh.k !== 'poly' || !CIALO_KSZTALT.test(sh.id ?? '')) continue; for (const q of sh.pts) if (!nisko || q[1] < nisko[1]) nisko = q; }
    if (!nisko) continue;
    const pod = pow.filter((q) => q.y <= nisko[1] + 0.5 && nisko[0] >= q.x0 - 5 && nisko[0] <= q.x1 + 5).map((q) => q.y); const h = nisko[1] - (pod.length ? Math.max(...pod) : 0);
    if (h > PROGI.wisiCm) return [`najniższy punkt narysowanego ciała leży ${f1(h)} cm nad podłożem (u = ${u}; ≤ ${PROGI.wisiCm} cm) — ciało wisi w powietrzu (bez zadeklarowanego lotu ani zwisu)`];
  }
  return [];
}
/** R17b (recenzja n7). Styk KAŻDEGO podparcia, nie tylko najniższego punktu (R17 nie widział stóp w Decline, bo najniżej są dłonie).
 * (a) pompki z listy DOL_POMPKI: dłonie i stopy (każda kończyna osobno, kształt dłoni/stopy w rzucie z boku) leżą najwyżej wisiCm nad powierzchnią pod nimi (podłoga albo wierzch skrzyni) w każdej klatce;
 * (b) stopa, która w KAŻDEJ klatce jest nad zadeklarowaną skrzynią (x ± 5 cm; top > 0) i w żadnej jej nie dotyka (≤ wisiCm): Decline z podwyższeniem za niskim albo za wysokim. Ruch, w którym stopa przechodzi nad skrzynią (Step Up, Box Jump), tego nie spełnia; ławka nie jest sprawdzana (jej zasięg x to przedział orientacyjny, stopy nad nim stoją na podłodze).
 * Wyjątek: ćwiczenie z zadeklarowanym lotem (LOT). Progi: wisiCm i ksztaltPodPodlogaCm (jedno miejsce). */
export function stykKazdegoPodparcia(v2, poza) {
  if (poza.cwiczenie in LOT) return [];
  const pow = powierzchniePodparcia(poza); const podwyzszenia = pow.filter((q) => q.y > 0 && q.rodzaj === 'skrzynia');
  const nadSkrzynia = {}; const o = []; const sprawdz = (txt) => { if (o.length < 3 && !o.includes(txt)) o.push(txt); };
  for (const u of siatka(poza, 12)) {
    const sh = v2.dataShapes(poza, u, 'side').filter((x) => x.k === 'poly');
    if (DOL_POMPKI.includes(poza.cwiczenie)) for (const [nazwa, re] of [['dłoń', /^hand/], ['stopa', /^foot/]]) for (const k of ['R', 'L']) {
      const ksz = sh.find((x) => re.test(x.id ?? '') && (x.id ?? '').endsWith(k)); if (!ksz) continue; const q = ksz.pts.reduce((m, a) => (a[1] < m[1] ? a : m));
      const pod = pow.filter((w) => w.y <= q[1] - PROGI.ksztaltPodPodlogaCm && q[0] >= w.x0 - 5 && q[0] <= w.x1 + 5).map((w) => w.y); const h = q[1] - (pod.length ? Math.max(...pod) : 0); /* kształt może zagłębiać się w powierzchnię do |ksztaltPodPodlogaCm| (jak w R15) */
      if (h > PROGI.wisiCm) sprawdz(`${nazwa} ${k} leży ${f1(h)} cm nad podłożem (u = ${u}; ≤ ${PROGI.wisiCm} cm) — podparcie wisi w powietrzu`);
    }
    for (const w of podwyzszenia) for (const k of ['R', 'L']) { const ksz = sh.find((x) => /^foot/.test(x.id ?? '') && (x.id ?? '').endsWith(k)); const q = ksz && ksz.pts.reduce((m, a) => (a[1] < m[1] ? a : m)); const klucz = w.y + ':' + w.x0 + ':' + k; (nadSkrzynia[klucz] ??= { w, k, klatki: 0, wszystkie: 0, minH: Infinity }); const e = nadSkrzynia[klucz]; e.wszystkie++; if (q && q[0] >= w.x0 - 5 && q[0] <= w.x1 + 5) { e.klatki++; e.minH = Math.min(e.minH, q[1] - w.y); } }
  }
  for (const e of Object.values(nadSkrzynia)) if (e.klatki === e.wszystkie && e.minH > PROGI.wisiCm) sprawdz(`stopa ${e.k} jest nad podwyższeniem o wierzchu ${f1(e.w.y)} cm (x ${f1(e.w.x0)}…${f1(e.w.x1)}) w każdej klatce i nigdy go nie dotyka (najbliżej ${f1(e.minH)} cm nad wierzchem; ≤ ${PROGI.wisiCm} cm) — stopa wisi nad skrzynią`);
  return o;
}
/** R19 (recenzja n7, z n6). Wariant decline pompki: w u = 0 linia kostka–bark wznosi się ku głowie najwyżej declineNachylenieMaxDeg nad poziom (stopy wyżej niż dłonie; zwykła pompka ma +20°). Tylko rodzina pushup_plank. */
export const WARIANT_DECLINE_POMPKI = /^Decline\b.*Push[- ]?Up/;
export function podparcieWyzejNizDlonie(v2, poza, rodzina) {
  if (rodzina !== 'pushup_plank' || !WARIANT_DECLINE_POMPKI.test(poza.cwiczenie)) return [];
  const s = v2.keyframeFrame(poza, 0).sk; const a = s.legs.R.ankle, b = s.shoulderC; const kat = (Math.atan2(b[1] - a[1], Math.abs(b[0] - a[0])) * 180) / Math.PI;
  return kat > PROGI.declineNachylenieMaxDeg + 1e-6 ? [`linia kostka–bark w u = 0 wznosi się o ${f1(kat)}° ku głowie, a ma ≤ ${PROGI.declineNachylenieMaxDeg}° (stopy na podwyższeniu: wariant decline traci cechę, gdy podwyższenie jest za niskie)`] : [];
}
/** R21 (recenzja n7). Baza póz leżących: wysokość środka miednicy w u = 0 = promień kolizji tułowia z silnika (jedno miejsce: GIRTH.trunkCollide) − lezenieUgniecenieCm … + wisiCm.
 * Poza „leżąca”: oś tułowia ≤ LEZENIE_OS_MAX_DEG od poziomu i miednica ≤ promień + LEZENIE_MIEDNICA_MAX_NAD_CM. Dla płaskich póz dolna granica pokrywa się z R15 (kształt tułowia sięga ok. 11,5 cm pod środkiem miednicy). */
export const LEZENIE_OS_MAX_DEG = 20; export const LEZENIE_MIEDNICA_MAX_NAD_CM = 3; /* konwencje rysunku: poza leżąca (nie czworaki, nie podpór) */
export const lezenieBazaCm = (v2) => v2.GIRTH.trunkCollide;
export function bazaLezenia(v2, poza) {
  const s = v2.keyframeFrame(poza, 0).sk; const baza = lezenieBazaCm(v2); const dx = s.shoulderC[0] - s.pelvis[0], dy = s.shoulderC[1] - s.pelvis[1];
  const os = Math.abs((Math.atan2(dy, Math.abs(dx)) * 180) / Math.PI); if (os > LEZENIE_OS_MAX_DEG || s.pelvis[1] > baza + LEZENIE_MIEDNICA_MAX_NAD_CM) return [];
  const y = s.pelvis[1]; const lo = baza - PROGI.lezenieUgniecenieCm, hi = baza + PROGI.wisiCm;
  return y < lo - 1e-6 || y > hi + 1e-6 ? [`środek miednicy w u = 0 leży ${f1(y)} cm nad podłogą, a poza leżąca ma ${f1(lo)}…${f1(hi)} cm (promień kolizji tułowia ${f1(baza)} cm − ugniecenie ${PROGI.lezenieUgniecenieCm} … + ${PROGI.wisiCm})`] : [];
}
const uniesienieTulowia = (s) => { const dy = s.shoulderC[1] - s.pelvis[1]; const d = Math.hypot(s.shoulderC[0] - s.pelvis[0], dy); return Math.asin(Math.max(-1, Math.min(1, dy / d))) / R; };
/** R16. Kręgosłup zwija się: gdy tułów unosi się nad podłogę o więcej niż tulowUnosiMinDeg (wskazówka „lędźwie zostają na podłodze”), zgięcie kręgosłupa ≥ kregoslupZwijaMinDeg (zwija się odcinek piersiowy, nie sztywna deska). */
export function kregoslupZwijaSie(v2, poza) {
  for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; const el = uniesienieTulowia(s); const zg = Math.abs(v2.poseAt(poza.klatki, u).zgiecieKregoslupa ?? 0);
    if (el > PROGI.tulowUnosiMinDeg && zg < PROGI.kregoslupZwijaMinDeg) return [`tułów unosi się o ${f1(el)}° (u = ${u}), a kręgosłup jest zgięty tylko o ${f1(zg)}° (≥ ${PROGI.kregoslupZwijaMinDeg}°) — tułów unosi się jak sztywna deska`]; }
  return [];
}
/** R14. Wyjątek od reguły ze wskazówki nie może przeczyć wskazówce wyświetlanej przy ćwiczeniu: ćwiczenie z wyjątku „lędźwie” nie może mieć wskazówki o lędźwiach. */
export function wyjatekNieStoiWSprzecznosci(cwiczenie, teksty, root = ROOT, wyjatki = LEDZWIE_WYJATKI) {
  return cwiczenie in wyjatki && maWskazowke(cwiczenie, teksty, WSKAZOWKA_LEDZWIE, root) ? [`ćwiczenie jest wyjątkiem od reguły „lędźwie przy podłodze” (${wyjatki[cwiczenie]}), a aplikacja wyświetla przy nim wskazówkę o lędźwiach — wyjątek przeczy wskazówce (usuń wyjątek i popraw pozę albo zmień zestaw wskazówek)`] : [];
}
/** R14b. Wyjątek wymaga mechanizmu w pozie: „zwijanie” = miednica unosi się o ≥ zwijanieMiednicaCm i kręgosłup zgięty ≥ zwijanieKregoslupDeg; „v” = tułów i nogi razem ≥ vUpMinDeg nad podłogą w jednej klatce. */
export function wyjatekWymagaMechanizmu(v2, poza, wyjatki = LEDZWIE_WYJATKI, mechanizmy = LEDZWIE_MECHANIZM) {
  const cw = poza.cwiczenie; if (!(cw in wyjatki)) return []; const m = mechanizmy[cw]; if (!m) return [`wyjątek „${cw}” nie ma zadeklarowanego mechanizmu (LEDZWIE_MECHANIZM)`];
  const us = siatka(poza); const fr = us.map((u) => ({ u, s: v2.keyframeFrame(poza, u).sk, zg: Math.abs(v2.poseAt(poza.klatki, u).zgiecieKregoslupa ?? 0) }));
  if (m === 'zwijanie') { const rise = Math.max(...fr.map((x) => x.s.pelvis[1])) - Math.min(...fr.map((x) => x.s.pelvis[1])); const zg = Math.max(...fr.map((x) => x.zg));
    return rise >= PROGI.zwijanieMiednicaCm && zg >= PROGI.zwijanieKregoslupDeg ? [] : [`wyjątek „zwijanie obu końców” bez mechanizmu: miednica unosi się o ${f1(rise)} cm (≥ ${PROGI.zwijanieMiednicaCm}), kręgosłup zgięty maks. ${f1(zg)}° (≥ ${PROGI.zwijanieKregoslupDeg}°)`]; }
  if (m === 'v') { const ok = fr.some((x) => uniesienieTulowia(x.s) >= PROGI.vUpMinDeg && Math.min(...['R', 'L'].map((k) => Math.atan2(x.s.legs[k].ankle[1] - x.s.pelvis[1], Math.abs(x.s.legs[k].ankle[0] - x.s.pelvis[0])) / R)) >= PROGI.vUpMinDeg);
    return ok ? [] : [`wyjątek „V” bez mechanizmu: nie ma klatki, w której tułów i nogi jednocześnie unoszą się ≥ ${PROGI.vUpMinDeg}° nad podłogę`]; }
  return [`nieznany mechanizm wyjątku „${m}”`];
}
/** Cechy deklarowane w danych (data/zrodla/figury-cechy.json): cechy, których nie da się wyprowadzić z reguł sensu ani z tekstów wskazówek. */
export const wczytajCechy = (root = ROOT) => { const p = path.join(root, 'data/zrodla/figury-cechy.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')).cechy ?? {} : {}; };
const maDeklarowana = (cecha, cwiczenie, root) => { const c = wczytajCechy(root)[cecha]; return !!c && (c.cwiczenia.includes(cwiczenie) || (c.wzorce_nazw ?? []).some((w) => new RegExp(w).test(cwiczenie))); };
/** Czy wskazówki ćwiczenia (zestaw ogólny albo własne; teksty `teksty`) zawierają tekst pasujący do wzorca. */
export function maWskazowke(cwiczenie, teksty, wzorzec, root = ROOT) {
  const set = JSON.parse(fs.readFileSync(path.join(root, 'lib/figures/v2/cue-sets.json'), 'utf8')).items?.[cwiczenie]; const wlasne = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/data.json'), 'utf8')).exercises?.[cwiczenie];
  return [...(set?.ok ?? []), ...Object.values(wlasne ?? {}).flat().map((c) => c.c).filter(Boolean)].some((id) => wzorzec.test(teksty[id] ?? ''));
}
export const WSKAZOWKA_RECE_PROSTE = /Ręce proste przez cały ruch|nie zginaj łokci/i;
/** Cechy ruchu pozy wyprowadzone z DANYCH (nie z listy ćwiczeń i nie z nazwy rodziny): reguły sensu (`ctx.reguly` = regulyDla), teksty wskazówek, deklaracje w figury-cechy.json, geometria pozy.
 * Zwraca Set: linia_ciala (R1, R3, R10), nogi_proste_podpor (R3), podpor_dlonie_ruch_nog (R4, R5), dol_pompki (R6, odwiedzenie z przodu), kolana_podkulone (R7), rece_proste (R8),
 * fallout_zawieszenie (R2), rollout (proste ręce), lezenie (nic_nie_wisi), ledzwie_przy_podlodze, rzad_bledu (R9/R10 — gdy poza ma rząd błędu). */
export function cechyRuchu(v2, poza, ctx) {
  /* rollout = chwyt przy podłodze w każdej klatce, a barki wysoko w każdej klatce (mostek biodrowy ma tę samą regułę „miednica na linii do kolana”, ale barki leżą na podłodze) */
  const reka = () => siatka(poza).every((u) => { const s = v2.keyframeFrame(poza, u).sk; return ['R', 'L'].every((k) => s.arms[k].grip[1] <= PROGI.rolloutRekaMaxCm) && s.shoulderC[1] > PROGI.rolloutBarkiMinCm; });
  const c = new Set(); const reg = ctx.reguly ?? []; const cw = ctx.cwiczenie; const root = ctx.root ?? ROOT; const teksty = ctx.teksty ?? {};
  const ma = (typ, pred) => reg.some((r) => r.typ === typ && (!pred || pred(r))); const zaw = poza.sprzet.some((g) => g.rodzaj === 'zawieszenie');
  if (ma('miednica_na_linii', (r) => r.parametry?.koniec === 'kostka_dalsza' && !r.parametry?.tylko_skrajna) && !(cw in LINIA_WYJATKI)) { c.add('linia_ciala'); c.add('nogi_proste_podpor'); }
  if (ma('miednica_na_linii', (r) => r.parametry?.koniec === 'kostka_dalsza' && r.parametry?.tylko_skrajna)) { c.add('nogi_proste_podpor'); if (zaw) c.add('fallout_zawieszenie'); else if (reka()) c.add('rollout'); }
  if (ma('miednica_na_linii', (r) => r.parametry?.koniec === 'kolano') && reka()) c.add('rollout');
  if (ma('klatka_przy_dloniach') && !zaw) c.add('dol_pompki');
  if (ma('miednica_pion_span')) { let rece = true; for (const u of siatka(poza)) { const s = v2.keyframeFrame(poza, u).sk; if (['R', 'L'].some((k) => s.arms[k].grip[1] > PROGI.stykPodparciaCm)) { rece = false; break; } } if (rece) c.add('podpor_dlonie_ruch_nog'); }
  if (maDeklarowana('kolana_podkulone', cw, root)) c.add('kolana_podkulone');
  if (maDeklarowana('rece_proste_wzdluz', cw, root) || maWskazowke(cw, teksty, WSKAZOWKA_RECE_PROSTE, root)) c.add('rece_proste');
  if (ma('miednica_na_podlodze') && !NIE_LEZY.includes(cw) && !(cw in LOT)) c.add('lezenie');
  if (!(cw in LEDZWIE_WYJATKI) && !NIE_LEZY.includes(cw) && maWskazowke(cw, teksty, WSKAZOWKA_LEDZWIE, root)) c.add('ledzwie_przy_podlodze');
  if (maDeklarowana('podparcie_kolan_lawka', cw, root)) c.add('klek_lawka'); else if (maDeklarowana('podparcie_kolan_podloga', cw, root)) c.add('klek_podloga');
  if (poza.bledy.length) c.add('rzad_bledu');
  return c;
}
/** Ćwiczenia z regułą „ciało w linii”, w których ciało z założenia opuszcza linię (lot): ćwiczenie → powód. */
export const LINIA_WYJATKI = { 'Plyo Push-Up': 'faza lotu: dłonie odrywają się od podłogi, barki i nogi zmieniają położenie' };
/** Wszystkie reguły dla pozy (waliduj): [{ kod: 'jakosc', regula, szczegol }]. `ctx` = { v2, rodzina, cwiczenie, postural:Set, izometryczne, teksty }. */
export function sprawdzJakosc(poza, ctx) {
  const { v2, rodzina, cwiczenie, postural, izometryczne, teksty } = ctx; const out = []; const dodaj = (regula, lista) => lista.forEach((szczegol) => out.push({ kod: 'jakosc', regula, szczegol: `${regula}: ${szczegol}` }));
  dodaj('blad_widoczny_stale', bladWidocznyStale(v2, poza, postural)); dodaj('pod_podloga', podPodloga(v2, poza));
  const front = poza.klatki.flatMap((k) => { const f = v2.keyframeFrame(poza, k.u); const sole = { R: Math.min(f.sk.legs.R.heel[1], f.sk.legs.R.toe[1]), L: Math.min(f.sk.legs.L.heel[1], f.sk.legs.L.toe[1]) }; const sh = v2.dataShapes(poza, k.u, 'front'); return stykZPodlogaPrzod(sh, sole, k.u); });
  dodaj('styk_z_podloga_przod', [...new Set(front)].slice(0, 3));
  const box = poza.sprzet.filter((g) => g.rodzaj === 'skrzynia'); if (box.length) dodaj('zaslanianie_sprzetu', zaslanianieSprzetu(v2.dataShapes(poza, 0, 'front'), Math.max(...box.map((g) => g.x1 ?? 0))));
  const cechy = cechyRuchu(v2, poza, { ...ctx, reguly: ctx.reguly ?? [] });
  if (RECE_WZDLUZ.includes(cwiczenie)) dodaj('rece_wzdluz_ciala', receWzdluzCiala(v2, poza));
  if (cechy.has('rece_proste')) dodaj('rece_proste', receProste(v2, poza));
  if (cechy.has('linia_ciala')) { dodaj('cialo_w_linii_pelne', cialoWLiniiPelne(v2, poza)); dodaj('rzad_bledu_nie_lepszy', rzadBleduNieLepszy(v2, poza)); }
  if (cechy.has('nogi_proste_podpor')) dodaj('kolana_proste_podpor', kolanaProstePodpor(v2, poza));
  if (cechy.has('fallout_zawieszenie')) dodaj('fallout_start_rece_przod', falloutStartRecePrzod(v2, poza));
  if (cechy.has('podpor_dlonie_ruch_nog')) { dodaj('kolano_pod_tulowiem', kolanoPodTulowiem(v2, poza)); dodaj('podpor_bez_kleku', podporBezKleku(v2, poza)); }
  if (cechy.has('dol_pompki')) dodaj('lokiec_nad_nadgarstkiem_bok', lokiecNadNadgarstkiemBok(v2, poza));
  if (cechy.has('kolana_podkulone')) dodaj('kolana_ugiete_min', kolanaUgieteMin(v2, poza));
  dodaj('klatki_rozne', klatkiRozne(v2, poza, izometryczne)); dodaj('sprzet_rozpoznawczy', sprzetRozpoznawczy(poza));
  if (PODSTAWA_SZEROKA.includes(cwiczenie)) dodaj('podstawa_szeroka', podstawaSzeroka(poza));
  if (rodzina === 'pushup_plank') { dodaj('szyja_neutralna', szyjaNeutralna(v2, poza)); if (/Push[- ]?Up|Inverted Row/.test(cwiczenie)) { dodaj('odwiedzenie_lokcia', odwiedzenieLokcia(v2, poza)); dodaj('lokiec_za_barkiem', lokiecZaBarkiem(v2, poza)); } }
  dodaj('etykieta_bledu', etykietaBledu(poza, teksty ?? {}));
  if ((cechy.has('dol_pompki') || cechy.has('linia_ciala')) && /Push[- ]?Up|Inverted Row/.test(cwiczenie)) dodaj('odwiedzenie_lokcia_przod', odwiedzenieLokciaPrzod(v2, poza));
  if (cechy.has('lezenie')) dodaj('nic_nie_wisi', nicNieWisi(v2, poza));
  if (cechy.has('ledzwie_przy_podlodze')) dodaj('ledzwie_przy_podlodze', ledzwiePrzyPodlodze(v2, poza));
  dodaj('rzad_bledu_dotyczy', rzadBleduDotyczy(v2, poza));
  if (PRZYCIAGANIE.includes(cwiczenie)) { dodaj('tor_lokcia_przyciaganie', torLokciaPrzyciagania(v2, poza)); dodaj('zwis_startowy', zwisStartowy(v2, poza)); dodaj('tor_lokcia_srodek', torLokciaSrodek(v2, poza)); }
  if (cechy.has('rollout')) dodaj('proste_rece_rollout', prosteReceRollout(v2, poza));
  dodaj('widocznosc_bledu_kat', widocznoscBleduKat(v2, poza));
  if (cechy.has('klek_lawka')) dodaj('podparcie_kolan', podparcieKolan(v2, poza, 'lawka')); else if (cechy.has('klek_podloga')) dodaj('podparcie_kolan', podparcieKolan(v2, poza, 'podloga'));
  dodaj('ksztalty_nad_podloga', ksztaltyNadPodloga(v2, poza)); dodaj('styk_z_podlozem', stykZPodlozem(v2, poza));
  dodaj('styk_kazdego_podparcia', stykKazdegoPodparcia(v2, poza)); dodaj('podparcie_wyzej_niz_dlonie', podparcieWyzejNizDlonie(v2, poza, rodzina)); if (rodzina === 'core_floor') dodaj('baza_lezenia', bazaLezenia(v2, poza)); /* rigi (np. Floor Press leży na macie 2 cm, której sprzet nie opisuje) mają własne bazy */
  if (cechy.has('ledzwie_przy_podlodze')) dodaj('kregoslup_zwija_sie', kregoslupZwijaSie(v2, poza));
  if (cwiczenie in LEDZWIE_WYJATKI) { dodaj('wyjatek_nie_przeczy_wskazowce', wyjatekNieStoiWSprzecznosci(cwiczenie, teksty ?? {}, ctx.root ?? ROOT)); dodaj('wyjatek_wymaga_mechanizmu', wyjatekWymagaMechanizmu(v2, poza)); }
  if (PODPARCIE_ZMIENNE.includes(cwiczenie)) dodaj('srodek_ciezkosci_podparcie', srodekCiezkosciNadPodparciem(v2, poza));
  return out;
}
export const wczytajTeksty = (root = ROOT) => { const p = path.join(root, 'lib/cues/text/pl.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}; };
