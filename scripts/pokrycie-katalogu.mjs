// Licznik pokrycia katalogu ćwiczeń (decyzja właściciela 28.10.2026, M-B: „licznik pokrycia generowany z kodu + strażnik CI, że pokrycie nie spada + cel na wersję w liście
// kontrolnej wydania”; odrzucone M-C). Katalog (709 ćwiczeń) ma być regularnie powiększany do pełnego — licznik pilnuje tego mechanizmem, nie pamięcią.
// Liczby pochodzą z RUNTIME aplikacji (te same moduły co ekran karty ćwiczenia i eksport strony scripts/strona/eksport.mjs: lib/seed, lib/figures, lib/figures/v2,
// lib/cues, lib/muscleRoles, słowniki lib/locales i lib/cues/text), nie z osobnej listy. Nie zmienia danych ćwiczeń, figur ani tekstów — tylko je liczy.
// Wynik (wzór: scripts/test-matrix.mjs, gen.mjs --check):
//   docs/55-pokrycie-katalogu.md             — sumy, rodziny, języki, cele wersji, ćwiczenia najbliżej pełnej karty,
//   tests/fixtures/pokrycie-katalogu.json    — te same liczby dla testów; pole `dobre` = metryki, które nie mogą spadać (zapadka),
//   tests/fixtures/pokrycie-katalogu-min.json — zapisane minimum zapadki; obniżka tylko z polem `powod` (tests/pokrycie-katalogu.test.ts).
// Cele wersji: docs/research/pokrycie-cele.json (sekcja „Cele” w docs/55; krok listy kontrolnej wydania w docs/39).
// Definicja „pełnej karty”: własne wskazówki (źródłowe, nie zestaw ogólny) + częste błędy + figura v2 w aplikacji + animowany błąd + role mięśni (analiza 28.10.2026: 17).
// „Komplet tekstów w języku”: każdy tekst karty (zdania wskazówek, zdania animowanych błędów, zdania ról mięśni) jest w słowniku TEGO języka — angielski tekst zastępczy
// nie liczy się jako przekład (dla angielskiego i polskiego słownik bazowy jest przekładem).
// Użycie: node scripts/pokrycie-katalogu.mjs --write | --check | --podnies-minimum | --cel [wersja]
//   --write              zapisuje docs/55 i fixture (nie rusza pliku minimum),
//   --check              dokument albo fixture nieaktualne → kod 1,
//   --podnies-minimum    ustawia minimum (i rekord) na max(zapisane, bieżące) — po fali prac, tylko w górę,
//   --cel [wersja] [--cele plik]  kod 1, gdy cel wersji (domyślnie major.minor z app.json) nie jest osiągnięty albo go brak — krok listy kontrolnej wydania.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { appRequire, repoRoot } from './strona/ts-loader.mjs';
import { rodzinyZRecenzja } from './strona/recenzja-figur.mjs';

export const SCHEMAT = 'pokrycie-katalogu@1';
export const PLIKI = {
  doc: 'docs/55-pokrycie-katalogu.md', fixture: 'tests/fixtures/pokrycie-katalogu.json', min: 'tests/fixtures/pokrycie-katalogu-min.json', cele: 'docs/research/pokrycie-cele.json',
};
/** Elementy „pełnej karty” (kolejność = kolejność w dokumencie). */
export const ELEMENTY = [
  ['wlasneWskazowki', 'własne wskazówki (źródłowe)'], ['czesteBledy', 'częste błędy (własne)'], ['figuraV2', 'figura v2 w aplikacji'],
  ['animowanyBlad', 'animowany błąd'], ['roleMiesni', 'role mięśni'],
];
/** Ile ćwiczeń z jednej grupy braków wypisać z nazwy (dłuższe grupy tylko liczbą). */
const MAX_NAZW = 25;

const own = (o, k) => (o && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : undefined);
const tekst = s => typeof s === 'string' && s.trim().length > 0;
const odczyt = p => JSON.parse(readFileSync(resolve(repoRoot, p), 'utf8'));

/** Liczy pokrycie z modułów aplikacji. Zwraca { cwiczenia (rekordy), fixture }. */
export function policz() {
  const R = appRequire();
  const seed = R('lib/seed.ts'), i18n = R('lib/i18n.ts'), v2 = R('lib/figures/v2/index.ts'), ui = R('lib/figures/v2/ui.ts'), cues = R('lib/cues/index.ts');
  const cueSets = R('lib/figures/v2/cueSets.ts'), roles = R('lib/muscleRoles.ts'), fig1 = R('lib/figures/index.ts'), EN = R('lib/i18n.en.ts').EN, LOCALES = R('lib/locales/index.ts').LOCALES;
  i18n.applyLang('pl'); /* zdania ról: w polskim tekst = klucz słownika interfejsu */
  const LANGS = [...i18n.LANGS];
  const ready = v2.FAMILIES.filter(f => f.status === 'ready').map(f => f.id);
  const zRecenzja = rodzinyZRecenzja(ready);
  const pozy = new Set();
  const dirPoz = join(repoRoot, 'lib/figures/v2/poses');
  if (existsSync(dirPoz)) for (const f of readdirSync(dirPoz).filter(x => x.endsWith('.json'))) for (const k of Object.keys(JSON.parse(readFileSync(join(dirPoz, f), 'utf8')).cwiczenia ?? {})) pozy.add(k);
  const wyjatki = new Set(fig1.FIG_DATA.open); /* ćwiczenia z własnymi wskazówkami, ale jawnie bez animacji (powód w danych źródeł) */
  /* teksty interfejsu: słownik języka; polski = klucz, angielski = EN */
  const uiHas = (l, key) => l === 'pl' || tekst(own(l === 'en' ? EN : LOCALES[l], key));
  const cueHas = (l, id) => tekst(own(cues.cueDict(l), id));
  const dispName = k => own(seed.LIB_DISPLAY_NAME, k) ?? k;

  const cw = seed.LIB.map(row => {
    const key = row[0], e = seed.libExercise(row);
    const fam = v2.familyOf(key), spec = v2.figureSpec(key);
    const sel = cueSets.cueSelection(key), wl = own(cues.CUE_DATA.exercises, key);
    const bledy = spec ? ui.errorsOf(spec) : [];
    const rolki = roles.muscleRoleRows(e).map(r => r.role).filter(Boolean);
    const cueIds = [...new Set([...ui.cueIdsOf(key).ids, ...bledy.map(b => b.cue)])];
    const wskazowki = sel.mode === 'own' ? 'wlasne' : sel.mode === 'general' ? 'ogolne' : 'brak';
    const bledyTekst = sel.mode === 'own' ? (wl?.mistakes ?? []).length > 0 : sel.mode === 'general' ? sel.err.length > 0 : false;
    const el = {
      wlasneWskazowki: wskazowki === 'wlasne', czesteBledy: wskazowki === 'wlasne' && (wl?.mistakes ?? []).length > 0, figuraV2: !!spec, animowanyBlad: bledy.length > 0, roleMiesni: rolki.length > 0,
    };
    const v1 = !spec && !!fig1.figureByKey(key);
    return {
      key, nazwa: dispName(key), rodzina: fam, spec: !!spec, v1, daneV2: !spec && pozy.has(key), wyjatek: !spec && !v1 && wyjatki.has(key), dane: !!spec || pozy.has(key),
      wskazowki, bledyTekst, el, pelna: Object.values(el).every(Boolean), recenzja: !!spec && zRecenzja.has(fam), cueIds, rolki,
    };
  });

  const n = cw.length, ile = f => cw.filter(f).length;
  const razem = {
    cwiczen: n,
    figura: { v2: ile(c => c.spec), v1: ile(c => c.v1), bezFigury: ile(c => !c.spec && !c.v1), daneV2NieWlaczone: ile(c => c.daneV2), wyjatekBezAnimacji: ile(c => c.wyjatek) },
    animowanyBlad: ile(c => c.el.animowanyBlad),
    wskazowki: { wlasne: ile(c => c.wskazowki === 'wlasne'), wlasneZBledami: ile(c => c.el.czesteBledy), ogolne: ile(c => c.wskazowki === 'ogolne'), bezTekstu: ile(c => c.wskazowki === 'brak') },
    czesteBledyTekst: ile(c => c.bledyTekst),
    roleMiesni: ile(c => c.el.roleMiesni),
    pelnaKarta: ile(c => c.pelna),
    recenzjaFigur: ile(c => c.recenzja),
  };

  /* rodziny */
  const rodziny = {};
  for (const f of v2.FAMILIES) {
    const c = cw.filter(x => x.rodzina === f.id);
    rodziny[f.id] = { status: f.status, cwiczen: c.length, figuraV2: c.filter(x => x.spec).length, daneV2NieWlaczone: c.filter(x => x.daneV2).length, v1: c.filter(x => x.v1).length,
      wlasne: c.filter(x => x.wskazowki === 'wlasne').length, ogolne: c.filter(x => x.wskazowki === 'ogolne').length, bezTekstu: c.filter(x => x.wskazowki === 'brak').length,
      pelnaKarta: c.filter(x => x.pelna).length, recenzja: c.filter(x => x.recenzja).length };
  }

  /* języki: komplet tekstów karty. Nazwy lokalne: pole jeszcze nie istnieje (nazwy biblioteki są angielskie w każdym języku poza polskim, DEC-13) — liczone jako 0;
     gdy pole powstanie, zmienić `maNazweLokalna` na odczyt tego pola (wtedy zapadka zacznie je pilnować). */
  const maNazweLokalna = () => false;
  const jezyki = {};
  for (const l of LANGS) {
    let kompletne = 0, zBrakiem = 0, brakTekstow = 0, nazwy = 0;
    for (const c of cw) {
      const potrzebne = c.cueIds.length + c.rolki.length;
      if (maNazweLokalna(c.key, l)) nazwy++;
      if (!potrzebne) continue;
      const braki = c.cueIds.filter(id => !cueHas(l, id)).length + c.rolki.filter(r => !uiHas(l, r)).length;
      if (braki) { zBrakiem++; brakTekstow += braki; } else kompletne++;
    }
    jezyki[l] = { kompletne, zBrakiem, brakTekstow, nazwaLokalna: nazwy };
  }
  const zTekstem = cw.filter(c => c.cueIds.length + c.rolki.length > 0).length;

  /* metryki zapadki: tylko takie, które nie mogą spaść bez regresji (nie np. „zestaw ogólny”, który maleje, gdy ćwiczenie dostaje własne wskazówki) */
  const dobre = {
    'figura.v2': razem.figura.v2, 'figura.wAplikacji': razem.figura.v2 + razem.figura.v1, 'figura.zDanymiV2': cw.filter(c => c.dane).length,
    animowanyBlad: razem.animowanyBlad, 'wskazowki.wlasne': razem.wskazowki.wlasne, 'wskazowki.wlasneZBledami': razem.wskazowki.wlasneZBledami,
    'wskazowki.zTekstem': razem.wskazowki.wlasne + razem.wskazowki.ogolne, czesteBledyTekst: razem.czesteBledyTekst, roleMiesni: razem.roleMiesni,
    pelnaKarta: razem.pelnaKarta, recenzjaFigur: razem.recenzjaFigur,
    'nazwaLokalna.razem': Object.values(jezyki).reduce((s, j) => s + j.nazwaLokalna, 0),
    ...Object.fromEntries(LANGS.map(l => [`jezyk.${l}.kompletne`, jezyki[l].kompletne])),
  };
  const fixture = { schemat: SCHEMAT, razem, kartZTekstami: zTekstem, rodziny, jezyki, dobre };
  return { cw, fixture, LANGS, ready };
}

const proc = (a, b) => (b ? `${(Math.round((a / b) * 1000) / 10).toString().replace('.', ',')}%` : '—');
const nazwaMetryki = {
  'figura.v2': 'figura v2 w aplikacji', 'figura.wAplikacji': 'figura w aplikacji (v2 albo v1)', 'figura.zDanymiV2': 'ćwiczenia z danymi figury v2 (włączonymi albo nie)',
  animowanyBlad: 'animowany błąd', 'wskazowki.wlasne': 'własne wskazówki', 'wskazowki.wlasneZBledami': 'własne wskazówki z częstymi błędami', 'wskazowki.zTekstem': 'wskazówki (własne lub zestaw ogólny)',
  czesteBledyTekst: 'częste błędy (tekst)', roleMiesni: 'role mięśni', pelnaKarta: 'pełna karta', recenzjaFigur: 'figura z aktualną recenzją ruchu', 'nazwaLokalna.razem': 'nazwy lokalne (suma po językach)',
};
const etykieta = k => nazwaMetryki[k] ?? (k.startsWith('jezyk.') ? `komplet tekstów karty: ${k.split('.')[1]}` : k);

function wczytajCele(plik = PLIKI.cele) { return existsSync(resolve(repoRoot, plik)) ? odczyt(plik) : { wersje: {} }; }

/** Stan celu wersji względem bieżących liczb: lista { metryka, cel, stan, ok }. */
export function stanCelu(cel, dobre) {
  return Object.entries(cel.min).map(([m, c]) => ({ metryka: m, cel: c, stan: dobre[m] ?? 0, ok: (dobre[m] ?? 0) >= c }));
}

export function renderuj({ cw, fixture, LANGS }) {
  const r = fixture.razem, n = r.cwiczen, L = [];
  const cele = wczytajCele();
  L.push('# 55. Pokrycie katalogu ćwiczeń (generowane — nie edytować ręcznie)', '');
  L.push('Wygenerowano z runtime aplikacji poleceniem `node scripts/pokrycie-katalogu.mjs --write` (te same moduły co ekran karty ćwiczenia i eksport strony). Decyzja właściciela 28.10.2026 (M-B): katalog ma być',
    'regularnie powiększany do pełnego — licznik jest generowany z kodu, zapadka `tests/pokrycie-katalogu.test.ts` (część `npm run verify`) nie pozwala, by „dobre” liczby spadły poniżej `tests/fixtures/pokrycie-katalogu-min.json`',
    '(obniżka tylko świadomie, z polem `powod`; podniesienie po fali prac: `node scripts/pokrycie-katalogu.mjs --podnies-minimum`), a lista kontrolna wydania (`docs/39`) wymaga celu wersji z sekcji „Cele”. Dane ćwiczeń, figur i tekstów skrypt tylko liczy.', '');
  L.push(`**Pełna karta** = własne wskazówki (źródłowe, nie zestaw ogólny) + częste błędy + figura v2 w aplikacji + animowany błąd + role mięśni. **Komplet tekstów w języku** = wszystkie zdania karty (wskazówki, animowane błędy, role mięśni) są w słowniku tego języka;`,
    'angielski tekst zastępczy nie liczy się jako przekład.', '');
  L.push('## Sumy', '', `Ćwiczeń w katalogu: **${n}**.`, '', '| Co | Ćwiczeń | Udział |', '|---|---:|---:|');
  const w = (nazwa, x) => L.push(`| ${nazwa} | ${x} | ${proc(x, n)} |`);
  w('Figura v2 w aplikacji (rodzina gotowa)', r.figura.v2); w('Figura v1 w aplikacji (bez v2)', r.figura.v1); w('Bez figury w aplikacji', r.figura.bezFigury);
  w('— z czego: dane póz v2 są, rodzina jeszcze niewłączona', r.figura.daneV2NieWlaczone); w('— z czego: wyjątek bez animacji (brak źródła techniki, powód w danych)', r.figura.wyjatekBezAnimacji);
  w('Animowany błąd', r.animowanyBlad); w('Własne wskazówki (źródłowe)', r.wskazowki.wlasne); w('— z czego z częstymi błędami', r.wskazowki.wlasneZBledami);
  w('Zestaw ogólny wskazówek wzorca ruchu', r.wskazowki.ogolne); w('Bez tekstu wskazówek', r.wskazowki.bezTekstu); w('Częste błędy (własne albo zestaw ogólny)', r.czesteBledyTekst);
  w('Role mięśni', r.roleMiesni); w('**Pełna karta**', r.pelnaKarta); w('Figura z aktualną recenzją ruchu (bramka 4)', r.recenzjaFigur);
  L.push('');

  L.push('## Cele wersji', '', 'Źródło: `docs/research/pokrycie-cele.json`. Krok listy kontrolnej wydania (`docs/39`): cel wersji osiągnięty albo zgoda właściciela z datą; sprawdzenie: `node scripts/pokrycie-katalogu.mjs --cel <wersja>`.', '');
  const wersje = Object.entries(cele.wersje);
  if (!wersje.length) L.push('Brak zapisanych celów.', '');
  for (const [wer, c] of wersje) {
    const st = stanCelu(c, fixture.dobre), ok = st.filter(x => x.ok).length;
    L.push(`### Wersja ${wer} — ${c.status}`, '', `${c.opis ?? ''}`.trim(), '', `Cel osiągnięty: **${ok === st.length ? 'tak' : 'nie'}** (${ok} z ${st.length} liczb).`, '');
    const braki = st.filter(x => !x.ok);
    if (braki.length) { L.push('| Metryka | Cel | Stan | Brakuje |', '|---|---:|---:|---:|'); for (const b of braki) L.push(`| ${etykieta(b.metryka)} | ${b.cel} | ${b.stan} | ${b.cel - b.stan} |`); L.push(''); }
    else L.push('Wszystkie liczby celu są osiągnięte.', '');
  }

  L.push('## Rodziny ruchu', '', '| Rodzina | Stan | Ćwiczeń | Figura v2 | Dane v2 (niewłączone) | Figura v1 | Własne wsk. | Zestaw ogólny | Bez tekstu | Pełne karty | Recenzja |', '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|');
  for (const [f, x] of Object.entries(fixture.rodziny).sort((a, b) => b[1].cwiczen - a[1].cwiczen || a[0].localeCompare(b[0]))) {
    L.push(`| \`${f}\` | ${x.status === 'ready' ? 'gotowa' : 'do zrobienia'} | ${x.cwiczen} | ${x.figuraV2} | ${x.daneV2NieWlaczone} | ${x.v1} | ${x.wlasne} | ${x.ogolne} | ${x.bezTekstu} | ${x.pelnaKarta} | ${x.recenzja} |`);
  }
  L.push('');

  L.push('## Języki', '', `Kart z tekstami (wskazówki albo role mięśni): **${fixture.kartZTekstami}**. „Komplet” = karta ma wszystkie teksty w słowniku języka (bez angielskiego zastępczego). Nazwy lokalne: pole jeszcze nie istnieje (nazwy biblioteki są angielskie poza polskim) — 0.`, '',
    '| Język | Kart kompletnych | Kart z brakiem | Brakujących tekstów | Nazwy lokalne |', '|---|---:|---:|---:|---:|');
  for (const l of LANGS) { const j = fixture.jezyki[l]; L.push(`| ${l} | ${j.kompletne} | ${j.zBrakiem} | ${j.brakTekstow} | ${j.nazwaLokalna} |`); }
  L.push('');

  L.push('## Ćwiczenia najbliżej pełnej karty', '', `Pełnych kart: ${r.pelnaKarta}. Poniżej ćwiczenia, którym brakuje jednego elementu (grupy dłuższe niż ${MAX_NAZW} — tylko liczba).`, '');
  const bliskie = {};
  for (const c of cw) { const brak = ELEMENTY.filter(([id]) => !c.el[id]); if (brak.length === 1) (bliskie[brak[0][0]] ??= []).push(c.nazwa); }
  let cokolwiek = false;
  for (const [id, opis] of ELEMENTY) {
    const lista = bliskie[id]; if (!lista) continue; cokolwiek = true;
    L.push(`- Brakuje tylko: ${opis} — ${lista.length}${lista.length <= MAX_NAZW ? `: ${lista.sort().join(', ')}` : ''}`);
  }
  if (!cokolwiek) L.push('- Brak ćwiczeń z jednym brakującym elementem.');
  L.push('');
  const rozklad = {};
  for (const c of cw) { const b = ELEMENTY.filter(([id]) => !c.el[id]).length; rozklad[b] = (rozklad[b] ?? 0) + 1; }
  L.push('| Brakujących elementów pełnej karty | Ćwiczeń |', '|---:|---:|');
  for (let b = 0; b <= ELEMENTY.length; b++) L.push(`| ${b} | ${rozklad[b] ?? 0} |`);
  L.push('');
  return L.join('\n');
}

/** Płaska lista numerów ze struktur zapadki: { metryka: liczba }. */
export function wczytajMin() { return existsSync(join(repoRoot, PLIKI.min)) ? odczyt(PLIKI.min) : null; }

export const serializuj = o => JSON.stringify(o, null, 2) + '\n';

function podniesMinimum(dobre) {
  const stare = wczytajMin() ?? { opis: '', minimum: {}, rekord: {}, obnizenia: {} };
  const minimum = {}, rekord = {};
  for (const [m, v] of Object.entries(dobre)) { minimum[m] = Math.max(stare.minimum[m] ?? 0, v); rekord[m] = Math.max(stare.rekord?.[m] ?? 0, v); }
  return {
    opis: 'Minimum zapadki pokrycia katalogu (tests/pokrycie-katalogu.test.ts). Liczba „dobra” nie może spaść poniżej minimum. Podniesienie po fali prac: node scripts/pokrycie-katalogu.mjs --podnies-minimum. ' +
      'Obniżka tylko świadomie: zmień `minimum` i dopisz w `obnizenia` wpis { "powod": "…", "data": "DD.MM.RRRR" } pod nazwą metryki (rekord zostaje — test wymaga powodu, gdy minimum < rekord).',
    minimum, rekord, obnizenia: stare.obnizenia ?? {},
  };
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file://').href) {
  const a = process.argv.slice(2), tryb = a[0];
  const wynik = policz();
  const doc = renderuj(wynik), fix = serializuj(wynik.fixture);
  if (tryb === '--write') {
    writeFileSync(join(repoRoot, PLIKI.doc), doc); writeFileSync(join(repoRoot, PLIKI.fixture), fix);
    console.log(`zapisano ${PLIKI.doc} i ${PLIKI.fixture} (ćwiczeń ${wynik.fixture.razem.cwiczen}, pełnych kart ${wynik.fixture.razem.pelnaKarta})`);
  } else if (tryb === '--check') {
    const zle = [];
    const stan = p => (existsSync(join(repoRoot, p)) ? readFileSync(join(repoRoot, p), 'utf8') : null);
    if (stan(PLIKI.doc) !== doc) zle.push(PLIKI.doc);
    if (stan(PLIKI.fixture) !== fix) zle.push(PLIKI.fixture);
    if (zle.length) { console.error(`${zle.join(', ')} nieaktualne — node scripts/pokrycie-katalogu.mjs --write`); process.exit(1); }
  } else if (tryb === '--podnies-minimum') {
    const stare = wczytajMin(), min = podniesMinimum(wynik.fixture.dobre);
    const zmienione = Object.keys(min.minimum).filter(m => min.minimum[m] !== stare?.minimum?.[m]);
    writeFileSync(join(repoRoot, PLIKI.min), serializuj(min));
    console.log(`minimum zapisane (${Object.keys(min.minimum).length} metryk, pełna karta ≥ ${min.minimum.pelnaKarta}); podniesione: ${zmienione.length}${zmienione.length ? ` (${zmienione.slice(0, 8).join(', ')}${zmienione.length > 8 ? ', …' : ''})` : ''}`);
  } else if (tryb === '--cel') {
    const ic = a.indexOf('--cele'), cele = wczytajCele(ic > 0 ? a[ic + 1] : PLIKI.cele), wer = a[1] && !a[1].startsWith('--') ? a[1] : odczyt('app.json').expo.version.replace(/\.\d+$/, '');
    const c = cele.wersje[wer];
    if (!c) { console.error(`brak celu pokrycia dla wersji ${wer} (${PLIKI.cele})`); process.exit(1); }
    const braki = stanCelu(c, wynik.fixture.dobre).filter(x => !x.ok);
    if (braki.length) { console.error(`cel pokrycia wersji ${wer} NIE osiągnięty (${c.status}):\n${braki.map(b => `  ${etykieta(b.metryka)}: ${b.stan} z ${b.cel}`).join('\n')}\nalbo zgoda właściciela z datą`); process.exit(1); }
    console.log(`cel pokrycia wersji ${wer} osiągnięty (${c.status})`);
  } else { console.error('Użycie: node scripts/pokrycie-katalogu.mjs --write | --check | --podnies-minimum | --cel [wersja]'); process.exit(2); }
}
