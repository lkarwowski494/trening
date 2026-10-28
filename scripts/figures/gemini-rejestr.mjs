// Rejestr błędów modelu (docs/53, „polecenie uniwersalne, które uczy się na błędach”): data/figury-bledy-modelu.json.
// Zasilany AUTOMATYCZNIE przez import (gemini-pozy.mjs --z-pliku) po każdej odpowiedzi: kategoria błędu (kod walidatora/sensu + stawu/reguły), liczba wystąpień, przykład liczbowy, reguła zapobiegawcza.
// Czyta go generator poleceń (gemini-polecenia.mjs): sekcja „Najczęstsze błędy z poprzednich rodzin i jak ich uniknąć” — 10 najczęstszych kategorii. Pomiar: zaliczone za 1. razem per wersja polecenia.
// Zapobieganie: tekst z miejscami `{nazwa}` uzupełnianymi liczbami z silnika przy generowaniu (liczby w jednym miejscu); dla nowej kategorii bez wpisu w ZAPOBIEGANIE — wprost komunikat walidatora z liczbami.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const PLIK_REJESTRU = 'data/figury-bledy-modelu.json';
export const MAX_W_POLECENIU = 10;

/** Reguły zapobiegawcze znanych kategorii (zasilane z obserwacji pilotażu 26.10.2026). Miejsca `{...}` = liczby z silnika (patrz gemini-polecenia.mjs → liczbyZSilnika). */
export const ZAPOBIEGANIE = {
  'chwyt': 'dłoń musi leżeć na osi drążka z dokładnością {gripTol} cm: chwyt = [x drążka, y drążka, ±z], bez zaokrągleń; a miednicę ustaw tak, by ręka sięgała celu (zasięg ramienia {reach} cm od barku, cel w odległości ≤ {reachAim} cm).',
  'geometria:cel poza zasięgiem': 'zasięg ramienia od barku do chwytu to {reach} cm; w zwisie celuj w {reachAim} cm (zapas), czyli miednica.y = drążek.y − {trunk} − sqrt({reachAim}² − (z chwytu − {shHalf})²) (tabela w punktach odniesienia).',
  'zakres:ankle': 'kąt kostki = podbicie + nachylenie goleni (kolano przed kostką = dodatnie, zwykle +10…+20° w zwisie); zakres −60…{ankleMax}°. W zwisie ustaw podbicie {ankleSafe}; przy uniesionych nogach leżąc podbicie 0…20° (nie −60…−90°: kostka nie schodzi poniżej −60°).',
  'zakres:elbow': 'łokieć ma zakres 0…{elbowMax}° (0° = prosty); w górnej pozycji celuj w ≤ {elbowAim}°: miednica za drążkiem (x = drążek − 18) i nie wyżej niż w tabeli, bo bliżej drążka łokieć zgina się powyżej limitu.',
  'zakres:shSag': 'bark w płaszczyźnie strzałkowej ma limit {shSagMax}°: nie prowadź ręki za głowę wzdłuż osi ciała (180°) — ręce za głową (leżąc): chwyt = bark + 62 cm · (0,87 · oś tułowia ku głowie + 0,5 · przód klatki) (kąt barku ≈ 150°); w podciąganiu chwyt tuż nad barkiem.',
  'zakres:hip': 'biodro {hipMin}…{hipMax}°; nie podnoś kolan wyżej niż do poziomu miednicy.',
  'zakres:knee': 'kolano 0…{kneeMax}°.',
  'geometria:poniżej podłogi': 'uda, golenie i stopy nie mogą wchodzić pod podłogę (y = 0): przy leżeniu na plecach i unoszonych nogach ZAWSZE podaj biegunKolana [0.15, 1, ±0.1] (kolano w górę; bez tego IK kieruje kolano w podłogę), na czworaka i na brzuchu [0.15, −1, ±0.1]; kostki nie niżej niż y = 7, miednicę leżącej osoby na y ≈ 8.',
  'zakres:shElev': 'uniesienie ramienia ma limit {shElevMax}°: ręce za głową (leżąc) = chwyt = bark + 62 cm · (0,87 · oś tułowia ku głowie + 0,5 · przód klatki) — kąt barku ≈ 150°, NIE wzdłuż podłogi za głową (180°).',
  'geometria:head × bar': 'głowa nie może przenikać drążka (max {pen} cm): w górnej pozycji przesuń głowę w x o ≥ 15 cm od osi drążka (do przodu lub do tyłu) i dobierz pochylenieGlowy; sprawdź klatki pośrednie, w których głowa mija wysokość drążka (u ≈ 0,4–0,6).',
  'geometria:torso × bar': 'tułów nie może przenikać drążka: odsuń miednicę w x o ≥ 10 cm od osi drążka w klatkach, w których drążek jest na wysokości klatki piersiowej.',
  'ciaglosc': 'żaden punkt nie może skoczyć o więcej niż {maxJump} cm na 1/{step} ruchu; gdy punkt (miednica, kostka, chwyt) przesuwa się o więcej niż {gap10} cm między klatkami, dodaj klatki co 0,1, a w szybkich fazach (mijanie drążka) co 0,05.',
  'ruch': 'poza u = 1 musi różnić się od u = 0 o ≥ {minMotion} cm (dłoń, kolano lub miednica).',
  'blad-niedeklarowane': 'każdy kąt zmieniony przez deltę o > {undeclared}° musi być w „dotyczy” (hip, knee, ankle, elbow, shoulder); zmiana chwytu lub miednicy zmienia łokieć i bark — deklaruj albo nie zmieniaj.',
  'blad-niewidoczny': 'błąd musi się różnić od pozy poprawnej o ≥ {visibleCm} cm lub ≥ {visibleDeg}° — wyraźna delta, nie kosmetyka.',
  'blad-start': 'pierwsza klatka błędu (u = 0) ma deltę ZEROWĄ.',
  'blad-cue': 'identyfikator błędu tylko z listy podanej przy ćwiczeniu; brak listy = bledy: [].',
  'geometria:uarm × bar': 'ramię nie może przenikać drążka (max {pen} cm): przy mijaniu drążka w przejściu nad drążek (np. muscle-up) odsuń łokcie od osi drążka i zadbaj o klatki pośrednie co 0,05 w tej fazie.',
  'geometria:farm × bar': 'przedramię nie może przenikać drążka (max {pen} cm): chwyt na osi, łokieć poza drążkiem.',
  'sens:broda_nad_drazkiem': 'w u = 1 broda ≥ drążek + {chinMargin} cm: miednica.y ≥ wartość z tabeli „u = 1” (punkty odniesienia); nie kończ ruchu, gdy głowa dochodzi tylko do drążka.',
  'sens:dol_rece_proste': 'w u = 0 łokcie ≤ {armsStraight}° (ramię prawie proste): miednica.y z tabeli „u = 0”, nie niżej.',
  'sens:miednica_nie_buja': 'poprawna poza NIE buja: miednica.x i miednica.z prawie stałe (≤ {swingPelvis} cm w całym ruchu); bujanie to osobny błąd (pu.noSwing).',
  'sens:nogi_nieruchome': 'kostki względem miednicy: x kostki − x miednicy w {ankleRel} cm (stopy pod lub za biodrami), prawie stałe w ruchu; nie wyrzucaj nóg do przodu.',
  'sens:tulow_pion': 'pochylenieTulowia w poprawnej pozie w {trunkRange}° w każdej klatce; odchylenie tułowia to bujanie.',
  'sens:jedna_reka': 'ćwiczenie jednorącz: na drążku trzyma: "R" albo "L"; wolna dłoń ≥ {freeHand} cm od osi drążka, nie na drążku.',
  'sens:rece_proste_caly_ruch': 'ramiona proste w całym ruchu (łokieć ≤ {armsStraight}°); porusza się tylko obręcz barkowa (miednica o kilka cm w y).',
  'sens:stopa_na_platformie': 'stopa na platformie maszyny leży NA płycie: płyta jest prostopadła do prowadnicy, a punkt mocowania prowadnicy to PODESZWA (punkt: "podeszwy" = kostka + {ankleH} cm wzdłuż prowadnicy), nie kostka; punkt "kostki" dotyczy wałka lub poduszki przy kostce (Leg Extension, Leg Curl); odstęp podeszwy od płyty −0,5…+1 cm w każdej klatce.',
  'jakosc:cialo_lezy': 'poza leżąca na boku, plecach albo siedząca LEŻY: obrys tułowia (z boku) i spodenek ≤ {lezyCm} cm nad podłogą w każdej klatce (leżąc na boku miednica ≈ 20 cm, a nie 23: obrys ma szerokość ciała, nie grubość); dolny bark nie wchodzi pod podłogę dzięki obrotowi tułowia ok. −75° (nie −90°) i przechyłowi 2°; głowa leży na podłodze albo na dłoni/przedramieniu, a ta kończyna sama leży na podłodze (dolna krawędź ≤ {lezyCm} cm, odstęp głowy od niej ≤ {glowaPodparcieCm} cm; głowę opuść skłonem bocznym głowy ok. −20°, nie podnoś ręki); dolna noga (udo, goleń) ≤ {lezyBokNogaCm} cm nad podłogą (kostka na y ≈ 7, kolano wypchnięte w głąb, biegun [0, 0, −1]).',
  'jakosc:czesc_ciala_nie_znika': 'żaden kształt części ciała (stopa, goleń, dłoń, tułów) nie ma w rzucie z boku rozmiaru < {znikaCm} cm: stopa obrócona wprost na kamerę (rotacjaStopy 90° przy poziomej goleni) rysuje się jako punkt — ustaw rotacjaStopy 45–70° albo stopę wzdłuż podłogi.',
  'sens:obie_kolana_lekko': '„lekko ugięte” kolano to {lekkoMin}…{lekkoMax}° (konwencja rysunku): wykrok z kolanem 58° nie jest lekkim zgięciem; odległość biodro–kostka ≈ 81 cm daje kolano ≈ 25° (przy pionowej nodze: miednica ≥ 84 cm nad podłogą).',
  'blad-sens': 'błąd ma łamać TYLKO regułę swojej wskazówki (np. pu.noSwing: przekroczyć limit bujania) i żadnej innej; poza poprawna nie łamie żadnej.',
};

export function wczytajRejestr(root) {
  const p = path.join(root, PLIK_REJESTRU);
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  return { _opis: 'Rejestr błędów modelu (docs/53): zasilany automatycznie przez gemini-pozy.mjs --z-pliku; czytany przez gemini-polecenia.mjs. Nie edytować ręcznie liczników.', kategorie: {}, odpowiedzi: [] };
}
export function zapiszRejestr(root, r) {
  const p = path.join(root, PLIK_REJESTRU); fs.mkdirSync(path.dirname(p), { recursive: true });
  const kat = Object.fromEntries(Object.entries(r.kategorie).sort((a, b) => b[1].wystapien - a[1].wystapien || a[0].localeCompare(b[0])));
  fs.writeFileSync(p, JSON.stringify({ ...r, kategorie: kat }, null, 1) + '\n');
}

/** Kategoria błędu z kodu walidatora i komunikatu (szczegółu). */
export function kluczKategorii(kod, szczegol) {
  const s = String(szczegol ?? '');
  if (kod === 'zakres') { const m = /staw (\w+) /.exec(s); return `zakres:${m ? m[1] : '?'}`; }
  if (kod === 'geometria') {
    const t = s.replace(/^bledy\[\d+\] „[^”]*”: /, '').replace(/ w fazie u=.*$/, '').replace(/[-\d.]+/g, '#').replace(/\s+/g, ' ').trim();
    if (/poniżej podłogi/.test(t) && !/stopa/.test(t)) return 'geometria:poniżej podłogi'; /* uda, golenie, stopy: osobno strona i część nie tworzą kategorii */
    if (/^stopa [RL] poniżej podłogi/.test(t)) return 'geometria:poniżej podłogi';
    const m = /^(\S+ × \S+): przenikanie/.exec(t) ?? /^(ręka [RL]): cel poza zasięgiem/.exec(t); if (m) return /ręka/.test(m[1]) ? 'geometria:cel poza zasięgiem' : `geometria:${m[1].replace(/([a-z]+)[RL] × /, '$1 × ')}`; /* strona ciała nie tworzy osobnej kategorii */
    return `geometria:${t.slice(0, 40)}`;
  }
  if (kod === 'sens') { const m = /reguła „([^”]+)”/.exec(s); return `sens:${m ? m[1].replace(/_x$/, '') : '?'}`; }
  if (kod === 'jakosc') { const m = /^([a-z0-9_]+): /.exec(s); return m ? `jakosc:${m[1]}` : 'jakosc'; } /* reguły jakości (v2-jakosc.mjs) osobno: komunikat zaczyna się od nazwy reguły */
  return kod;
}

/** Zapisuje wyniki jednej odpowiedzi (idempotentnie: ten sam hash odpowiedzi + runda tylko raz). wyniki: [{ cwiczenie, ok, bledy:[{kod,szczegol}] }]. */
export function zapiszOdpowiedz(root, { rodzina, wersja = 'polecenie@?', runda = 1, tekst, wyniki, data = new Date().toISOString().slice(0, 10) }) {
  const r = wczytajRejestr(root); const hash = crypto.createHash('sha1').update(`${runda}|${tekst}`).digest('hex').slice(0, 12);
  if (r.odpowiedzi.some((o) => o.hash === hash)) return { powtorka: true, rejestr: r };
  for (const w of wyniki) {
    const widziane = new Set();
    for (const b of w.bledy ?? []) {
      const k = kluczKategorii(b.kod, b.szczegol); const e = (r.kategorie[k] ??= { wystapien: 0, cwiczen: 0, rodziny: [], przyklad: null, zapobieganie: null });
      e.wystapien++; if (!widziane.has(k)) { e.cwiczen++; widziane.add(k); }
      if (!e.rodziny.includes(rodzina)) e.rodziny.push(rodzina);
      e.przyklad = `${w.cwiczenie}: ${String(b.szczegol).replace(/\s*\(i w \d+ innych fazach.*$/, '').slice(0, 220)}`;
      if (!e.zapobieganie && ZAPOBIEGANIE[k]) e.zapobieganie = ZAPOBIEGANIE[k];
    }
  }
  r.odpowiedzi.push({ hash, data, rodzina, wersja, runda, cwiczen: wyniki.length, zaliczone: wyniki.filter((w) => w.ok).length });
  zapiszRejestr(root, r); return { powtorka: false, rejestr: r };
}
/** Odsetek zaliczonych w 1. rundzie per wersja polecenia: { wersja: { cwiczen, zaliczone, odsetek } }. */
export function statystykaWersji(r) {
  const o = {};
  for (const a of r.odpowiedzi.filter((x) => x.runda === 1)) { const e = (o[a.wersja] ??= { cwiczen: 0, zaliczone: 0 }); e.cwiczen += a.cwiczen; e.zaliczone += a.zaliczone; }
  for (const e of Object.values(o)) e.odsetek = e.cwiczen ? Math.round((100 * e.zaliczone) / e.cwiczen) : 0;
  return o;
}
export const podstaw = (t, liczby) => t.replace(/\{(\w+)\}/g, (m, k) => (k in liczby ? String(liczby[k]) : m));
/** Linie sekcji „Najczęstsze błędy…”: do 10 najczęstszych kategorii; zapobieganie z liczbami z silnika (liczby), a gdy brak reguły — przykład z walidatora. */
export function liniePolecenia(r, liczby, max = MAX_W_POLECENIU, { rodzina = null, reguly = null } = {}) {
  /* trafne dla rodziny: reguły sensu tylko aktywne w poleceniu, kolizje ze sprzętem tylko z rodzin, które je zgłosiły; reszta (zasięg, zakresy, chwyt, ciągłość…) jest ogólna */
  const trafna = ([k, e]) => (k.startsWith('sens:') ? !reguly || reguly.has(k.slice(5)) || [...reguly].some((id) => id.replace(/_x$/, '') === k.slice(5)) : /^geometria:\S+ × \S+$/.test(k) || k.startsWith('jakosc:') ? !rodzina || e.rodziny.includes(rodzina) : true);
  return Object.entries(r.kategorie).filter(trafna).slice(0, max).map(([k, e]) => {
    const zap = ZAPOBIEGANIE[k] ?? e.zapobieganie;
    return `- (${e.wystapien}×) ${k}: ${zap ? podstaw(zap, liczby) : `unikaj — walidator zgłosił: ${e.przyklad}`}${ZAPOBIEGANIE[k] ? '' : ''}`;
  });
}
