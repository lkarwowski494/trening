// Symulacja stanu końcowego linii 1.1 dla celu pokrycia katalogu (decyzja właściciela 09.11.2026: „Obniżmy próg wyciągając z niego ciężkie.”, docs/18).
// Cel wersji 1.1 w docs/research/pokrycie-cele.json = wartość każdej metryki w stanie końcowym bez nowych badań:
//   (b) wszystkie rodziny z danymi póz v2 (lib/figures/v2/poses/*.json) włączone i zrecenzowane (poza V2_WSTRZYMANE) + wszystkie zestawy ogólne (cue-sets.json, b = general)
//       przy ćwiczeniach z taką figurą zrecenzowane,
//   (a) wszystkie karty z tekstem w źródłach (data/zrodla/cues.json — także ukryte do recenzji i z werdyktem „do poprawy”) odsłonięte i przetłumaczone na każdy język,
//   (c) role mięśni uzupełnione u ćwiczeń, którym dziś do pełnej karty brakuje tylko ról (poza mobilnością).
// „Ciężkie” (poza celem — nowe badania/treści/ruch silnika → backlog 1.2): brak tekstu wskazówek w źródłach i brak zestawu ogólnego, brak danych póz v2, rodzina wymagająca ruchu silnika.
// Cel = max(symulacja, minimum zapadki) — cel nie jest łatwiejszy niż stan chroniony (tests/pokrycie-katalogu.test.ts). Liczby tylko z kodu i danych; nic nie zapisuje.
// Użycie: node scripts/pokrycie-symulacja.mjs [--json] — domyślnie czytelne podsumowanie; --json: pełny wynik (cel, rozbicie, rodziny, listy). Test: tests/cel-1-1-bez-ciezkich.test.ts.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { appRequire, repoRoot } from './strona/ts-loader.mjs';
import { policz, elementyKarty } from './pokrycie-katalogu.mjs';

/** Metryki zapadki, które nie wchodzą do celu wersji (zgodnie z pokrycie-cele.json przed decyzją 09.11.2026). */
export const BEZ_CELU = ['pelnaKartaBlad'];
const odczyt = p => JSON.parse(readFileSync(join(repoRoot, p), 'utf8'));
const own = (o, k) => (o && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined);

/** Zwraca { cel, symulacja (dobre w stanie końcowym), obecne (dobre dziś), rozbicie, rodziny, listy }. Mutuje statusy rodzin w pamięci procesu — wołać w osobnym procesie. */
export function symuluj() {
  const baza = policz(); /* stan dzisiejszy (przed mutacją statusów rodzin) */
  const R = appRequire();
  const v2 = R('lib/figures/v2/index.ts'), fig = R('lib/figures/v2/figure.ts'), ui = R('lib/figures/v2/ui.ts'), cueSets = R('lib/figures/v2/cueSets.ts');
  const cues = R('lib/cues/index.ts'), fig1 = R('lib/figures/index.ts');
  const zrodlo = odczyt('data/zrodla/cues.json').exercises;
  const dirPoz = join(repoRoot, 'lib/figures/v2/poses');
  const rodzinyZPozami = new Set(existsSync(dirPoz) ? readdirSync(dirPoz).filter(f => f.endsWith('.json')).map(f => f.replace(/\.json$/, '')) : []);
  for (const f of v2.FAMILIES) if (rodzinyZPozami.has(f.id)) f.status = 'ready'; /* (b): włączenie rodzin z danymi póz */
  /* „Podłączenie” rodziny = wpis w rejestrze plików póz (poseData.ts LOAD) i parametry prezentacji (DATA_UI) — oba są pracą wdrożeniową, nie badaniem; symulacja podstawia je w pamięci procesu:
   * plik póz czytany wprost z lib/figures/v2/poses, a brakujący DATA_UI zastąpiony wpisem rodziny curl (liczy się tylko to, że figura powstaje). */
  const pd = R('lib/figures/v2/poseData.ts'), pliki = {};
  for (const f of rodzinyZPozami) pliki[f] = odczyt(`lib/figures/v2/poses/${f}.json`);
  const poseOrig = pd.poseDataFor, uiOrig = pd.dataUiForPose;
  pd.poseDataFor = (key, family) => poseOrig(key, family) ?? (() => { const d = own(pliki[family]?.cwiczenia, key); return d && d.cwiczenie === key && d.rodzina === family ? d : null; })();
  pd.dataUiForPose = (family, data) => uiOrig(family, data) ?? pd.DATA_UI.curl;
  const wstrzymane = fig.V2_WSTRZYMANE;

  const dobre0 = baza.fixture.dobre, LANGS = baza.LANGS;
  const wiersze = baza.cw.map(c => {
    const key = c.key;
    const spec = !own(wstrzymane, key) ? fig.figureSpec(key) : null; /* figura po włączeniu rodzin i recenzji ruchu */
    const sel = cueSets.cueSelection(key), zr = own(zrodlo, key);
    const wskazowki = sel.mode === 'own' ? (zr ? 'wlasne' : 'brak') : sel.mode === 'general' && spec ? 'ogolne' : 'brak'; /* (a) karta w źródłach odsłonięta; (b) zestaw ogólny zrecenzowany przy figurze */
    const bledyTekst = wskazowki === 'wlasne' ? (zr.mistakes ?? []).length > 0 : wskazowki === 'ogolne' ? sel.err.length > 0 : false;
    const errCues = wskazowki === 'wlasne' ? (zr.mistakes ?? []).map(r => r.c) : wskazowki === 'ogolne' ? sel.err : [];
    const bledy = spec ? ui.errorsOf(spec, errCues) : [];
    const idsKarty = wskazowki === 'wlasne' ? cues.CUE_SECTIONS.flatMap(s => (zr[s] ?? []).map(r => r.c)) : sel.mode === 'general' && spec ? [...sel.ok, ...sel.err] : [];
    const cueIds = [...new Set([...idsKarty, ...bledy.map(b => b.cue)])];
    const rolki = c.rolki.length;
    return { c, spec: !!spec, wskazowki, bledyTekst, animowanyBlad: bledy.length > 0, cueIds, rolki };
  });
  /* (c): role uzupełnione tylko u ćwiczeń, którym DZIŚ do pełnej karty brakuje wyłącznie ról (poza mobilnością); pozostałe bez ról wymagają nowych badań (ciężkie) */
  for (const w of wiersze) {
    w.rolaUzupelniona = w.rolki === 0 && !w.c.mobilnosc && w.c.brakiPelna.length === 1 && w.c.brakiPelna[0] === 'roleMiesni';
    w.rolkiK = w.rolaUzupelniona ? 1 : w.rolki;
    Object.assign(w, elementyKarty({ wskazowki: w.wskazowki, bledyTekst: w.bledyTekst, figuraV2: w.spec, animowanyBlad: w.animowanyBlad, roleMiesni: w.rolkiK > 0, mobilnosc: w.c.mobilnosc }));
    w.wV1 = !w.spec && w.c.v1;
  }
  const ile = f => wiersze.filter(f).length;
  const zTekstem = ile(w => w.cueIds.length + w.rolkiK > 0);
  const sym = {
    'figura.v2': ile(w => w.spec), 'figura.wAplikacji': ile(w => w.spec || w.wV1), 'figura.zDanymiV2': ile(w => w.spec || w.c.dane),
    animowanyBlad: ile(w => w.animowanyBlad), 'wskazowki.wlasne': ile(w => w.wskazowki === 'wlasne'), 'wskazowki.wlasneZBledami': ile(w => w.wskazowki === 'wlasne' && w.bledyTekst),
    'wskazowki.zTekstem': ile(w => w.wskazowki === 'wlasne' || w.wskazowki === 'ogolne'), czesteBledyTekst: ile(w => w.bledyTekst), roleMiesni: ile(w => w.rolkiK > 0),
    pelnaKarta: ile(w => w.pelna), pelnaKartaBlad: ile(w => w.pelnaBlad), recenzjaFigur: ile(w => w.spec), 'nazwaLokalna.razem': 0,
    ...Object.fromEntries(LANGS.map(l => [`jezyk.${l}.kompletne`, zTekstem])), /* (a): wszystkie teksty przetłumaczone w każdym języku */
  };
  const min = odczyt('tests/fixtures/pokrycie-katalogu-min.json').minimum;
  const cel = Object.fromEntries(Object.keys(sym).filter(m => !BEZ_CELU.includes(m)).map(m => [m, Math.max(sym[m], min[m] ?? 0)]));

  /* rozbicie przyrostu pełnej karty względem dziś: co brakowało ćwiczeniu dziś (nazwy brakujących elementów po stronie (a)/(b)/(c)) */
  const pochodzenie = { juzJest: 0 }, kombinacje = {};
  const gain = [];
  for (const w of wiersze) {
    if (!w.pelna) continue;
    if (w.c.pelna) { pochodzenie.juzJest++; continue; }
    const braki = [];
    if (w.c.wskazowki === 'brak') braki.push(w.wskazowki === 'wlasne' ? 'a' : 'b-zestaw'); /* a: karta własna ukryta; b-zestaw: recenzja zestawu ogólnego */
    if (!w.c.spec) braki.push('b-figura');
    if (w.rolaUzupelniona) braki.push('c');
    const id = braki.join('+') || '?';
    kombinacje[id] = (kombinacje[id] ?? 0) + 1; gain.push({ key: w.c.key, rodzina: w.c.rodzina, braki: id });
  }
  const grupa = id => (id === 'a' ? 'a' : id === 'c' ? 'c' : id.split('+').every(x => x.startsWith('b-')) ? 'b' : 'aB');
  const rozbicie = { obecnie: pochodzenie.juzJest, przyrost: gain.length, kombinacje, a: 0, b: 0, c: 0, aB: 0 };
  for (const [id, n] of Object.entries(kombinacje)) rozbicie[grupa(id)] += n;
  const rodziny = {};
  for (const w of wiersze) {
    const r = (rodziny[w.c.rodzina] ??= { rodzina: w.c.rodzina, cwiczen: 0, pelnaDzis: 0, pelnaKoniec: 0, przyrost: 0, bezFigurySymulacji: 0 });
    r.cwiczen++; r.pelnaDzis += w.c.pelna ? 1 : 0; r.pelnaKoniec += w.pelna ? 1 : 0; r.przyrost += w.pelna && !w.c.pelna ? 1 : 0; r.bezFigurySymulacji += w.spec ? 0 : 1;
  }
  /* przyrost wg pracy: samo włączenie rodziny (wlaczenie), + recenzja zestawu ogólnego (zestawOgolny), + odsłonięcie karty własnej (karta), + role (role) */
  for (const g of gain) { const r = rodziny[g.rodzina]; r.wlaczenie ??= 0; r.zestawOgolny ??= 0; r.karta ??= 0; r.role ??= 0; { const b = g.braki.split('+'); r[b.includes('a') ? 'karta' : b.includes('b-zestaw') ? 'zestawOgolny' : b.includes('c') && b.length === 1 ? 'role' : 'wlaczenie']++; } }
  const listaRodzin = Object.values(rodziny).filter(r => r.przyrost > 0).sort((a, b) => b.przyrost - a.przyrost || a.rodzina.localeCompare(b.rodzina));
  const ciezkie = wiersze.filter(w => !w.pelna);
  const cwiczeniaCiezkie = { cwiczen: ciezkie.length, brakFigury: ciezkie.filter(w => !w.spec).length, brakTekstu: ciezkie.filter(w => w.wskazowki === 'brak').length, brakRol: ciezkie.filter(w => w.rolkiK === 0 && !w.c.mobilnosc).length };
  const kontrola = {
    cuesSetsOwnRownaZrodlu: Object.keys(cueSets.CUE_SETS.items).filter(k => cueSets.CUE_SETS.items[k].b === 'own').length === Object.keys(zrodlo).length,
    zWlasnymiBezSpec: ile(w => w.wskazowki === 'wlasne' && !w.spec), ogolneBezSpec: ile(w => w.c.wskazowki !== 'ogolne' && cueSets.cueSelection(w.c.key).mode === 'general' && !w.spec),
    zPozamiBezSpec: ile(w => w.c.dane && !w.spec), wstrzymane: Object.keys(wstrzymane), v1Open: fig1.FIG_DATA.open.length,
  };
  return { cel, symulacja: sym, obecne: dobre0, rozbicie, rodziny: listaRodzin, cwiczeniaCiezkie, kontrola, gain };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
  const w = symuluj();
  if (process.argv.includes('--json')) console.log(JSON.stringify(w));
  else {
    console.log('metryka | dziś | symulacja | cel (max z minimum zapadki)');
    for (const [m, c] of Object.entries(w.cel)) console.log(`${m} | ${w.obecne[m]} | ${w.symulacja[m]} | ${c}`);
    console.log('rozbicie pełnej karty:', JSON.stringify(w.rozbicie));
    console.log('rodziny wg zysku:'); for (const r of w.rodziny) console.log(`  ${r.rodzina}: +${r.przyrost} (samo włączenie ${r.wlaczenie}, + zestaw ogólny ${r.zestawOgolny}, + karta ${r.karta}, + role ${r.role}; koniec ${r.pelnaKoniec} z ${r.cwiczen})`);
    console.log('ciężkie:', JSON.stringify(w.cwiczeniaCiezkie), 'kontrola:', JSON.stringify(w.kontrola));
  }
}
