// Szkielet wpisów recenzji rodziny v2 (decyzja właściciela 2A, 03.11.2026 ~22:00 PL; docs/18; krok K16 planu docs/przekazanie/notatki/linia-1-1/plan-recenzji-rodzin-v2.md).
// Z bieżącego stanu repo wylicza KOMPLET wpisów, których bramka 4 wymaga dla rodziny (testy tests/figury-recenzja.test.tsx, karty-recenzja.test.tsx, recenzja-wyjatki-1-1.test.ts,
// l047-recenzja-niezalezna.test.ts, figures-v2-tor.test.ts), z polami werdykt/recenzent/uwagi pustymi do wypełnienia przez recenzenta:
//   v2      — jeden wpis rodziny: sha (rodzinaSkrot), liczba (ćwiczenia przypisane do rodziny przez assignAll, ŁĄCZNIE z wyjątkami bez rysunku), lista ćwiczeń, pole slad;
//   v1      — ćwiczenia rodziny z figurą v1 i rysunkiem v2: wpis do zmiany na werdykt „zastapiona” (pole `docelowy`), sha = figuraSkrot;
//   karty   — ćwiczenia rodziny z kartą własną (data/zrodla/cues.json) i rysunkiem v2: wpis z kartaSkrot (K11);
//   zestawy — ćwiczenia rodziny z zestawem ogólnym (cue-sets.json, b = general) i rysunkiem v2: wpis z zestawSkrot (K12);
//   kroki   — polecenia do wykonania po wpisaniu wypełnionego szkieletu do docs/research/figury-recenzja.json (pliki generowane, strażnicy).
// „Rysunek v2” = figureSpec(k) albo, gdy rodzina nie ma jeszcze statusu „ready”, wpis w danych póz z prezentacją (DATA_UI) — szkielet da się wygenerować przed podłączeniem.
// Użycie: node scripts/recenzja-szkielet.mjs <rodzina> [--out <plik>]   (szkielet na stdout albo do pliku)
//         node scripts/recenzja-szkielet.mjs --sprawdz <plik>          (porównanie wypełnionego szkieletu z bieżącym stanem; braki → lista, kod 1)
// Skrypt niczego nie zapisuje w docs/research/figury-recenzja.json — wpisy przenosi przepisujący (nie autor), recenzent pisze własny plik (K13, L-047).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { skroty } from './zrodla-runtime.mjs';
import { appRequire, repoRoot } from './strona/ts-loader.mjs';

const FORMAT = 'recenzja-szkielet@1';
const RE_DATA = /^\d{4}-\d\d-\d\d$/;
const POLA_TRESCI = ['werdykt', 'data', 'kto', 'stan', 'autor', 'recenzent', 'uwagi'];
const puste = () => Object.fromEntries(POLA_TRESCI.map(p => [p, '']));
/** Polecenia po wpisaniu recenzji (generatory i strażnicy); kolejność ma znaczenie: runtime → pokrycie → macierz → README. */
export const KROKI = [
  'node scripts/zrodla-runtime.mjs --write',
  'node scripts/pokrycie-katalogu.mjs --write',
  'node scripts/test-matrix.mjs --write',
  'node scripts/readme.mjs --write',
  'node scripts/zrodla-runtime.mjs --check && node scripts/pokrycie-katalogu.mjs --check && node scripts/test-matrix.mjs --check && node scripts/readme.mjs --check',
  'npx jest tests/figury-recenzja.test.tsx tests/karty-recenzja.test.tsx tests/recenzja-wyjatki-1-1.test.ts tests/l047-recenzja-niezalezna.test.ts tests/figures-v2-tor.test.ts --runInBand',
];

/** Bieżący stan rodziny: co jest wymagane i z jakimi skrótami. */
export function stanBiezacy(rodzina) {
  const V = appRequire()('lib/figures/v2/index.ts');
  const { CUE_SETS } = appRequire()('lib/figures/v2/cueSets.ts');
  if (!V.FAMILIES.some(f => f.id === rodzina)) throw new Error(`recenzja-szkielet: nieznana rodzina „${rodzina}”`);
  const czytaj = p => JSON.parse(readFileSync(`${repoRoot}/${p}`, 'utf8'));
  const full = czytaj('data/zrodla/figures.json'), cues = czytaj('data/zrodla/cues.json');
  const sk = skroty(undefined, undefined, undefined, [rodzina]); /* skrót z wyniku rysunku: tylko ta rodzina (także planowana — recenzja przed podłączeniem) */
  const ready = V.FAMILY[rodzina].status === 'ready';
  const rysuje = k => !!V.figureSpec(k) || (!ready && (d => !!d && !!V.dataUiForPose(rodzina, d))(V.poseDataFor(k, rodzina)));
  const wszystkie = V.assignAll();
  const cwiczenia = Object.keys(wszystkie).filter(k => wszystkie[k] === rodzina).sort();
  const wybierz = (lista, skrot, dod = () => ({})) => Object.fromEntries(lista.map(k => [k, { sha: skrot[k], ...dod(k) }]));
  return {
    v2: { sha: sk.v2[rodzina], liczba: cwiczenia.length, cwiczenia, bez_rysunku: cwiczenia.filter(k => !rysuje(k)) },
    v1: wybierz(cwiczenia.filter(k => full.exercises[k] && rysuje(k)), sk.v1),
    karty: wybierz(cwiczenia.filter(k => cues.exercises[k] && rysuje(k)), sk.karty),
    zestawy: wybierz(cwiczenia.filter(k => CUE_SETS.items[k]?.b === 'general' && rysuje(k)), sk.zestawy, k => ({ rodzina: CUE_SETS.items[k].f })),
  };
}

/** Szkielet wpisów do wypełnienia przez recenzenta. */
export function szkielet(rodzina, stan = stanBiezacy(rodzina)) {
  const mapuj = (o, dod) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, { ...dod(v), sha: v.sha }]));
  return {
    format: FORMAT,
    rodzina,
    opis: 'Szkielet wpisów recenzji rodziny v2 (scripts/recenzja-szkielet.mjs). Recenzent wypełnia werdykt, data, kto, stan, autor, recenzent, uwagi (v2: także slad); pola sha, liczba, rodzina i cwiczenia są wyliczone — nie zmieniać. v1: werdykt „zastapiona” (pole docelowy). Sprawdzenie: node scripts/recenzja-szkielet.mjs --sprawdz <plik>.',
    v2: { [rodzina]: { ...puste(), slad: '', sha: stan.v2.sha, liczba: stan.v2.liczba, cwiczenia: stan.v2.cwiczenia, bez_rysunku: stan.v2.bez_rysunku } },
    v1: mapuj(stan.v1, () => ({ rodzina, ...puste(), docelowy: 'zastapiona' })),
    karty: mapuj(stan.karty, () => puste()),
    zestawy: mapuj(stan.zestawy, v => ({ rodzina: v.rodzina, ...puste() })),
    kroki: KROKI,
  };
}

/** Braki wypełnionego szkieletu względem bieżącego stanu (puste = komplet). Format komunikatów: „sekcja/klucz: opis”. */
export function sprawdz(w, rodzina = w?.rodzina, stan = stanBiezacy(rodzina)) {
  const p = [];
  if (!w || w.format !== FORMAT) return [`format: oczekiwano ${FORMAT}`];
  if (w.rodzina !== rodzina) p.push(`rodzina: ${w.rodzina} ≠ ${rodzina}`);
  const pustePole = (e, pola) => pola.filter(x => typeof e[x] !== 'string' || !e[x].trim());
  const wspolne = (id, e, { stanWymagany = false, zwykly = false } = {}) => {
    const br = pustePole(e, zwykly ? ['werdykt', 'data', 'kto'] : ['werdykt', 'data', 'kto', 'autor', 'recenzent', 'uwagi', ...(stanWymagany ? ['stan'] : [])]);
    if (br.length) p.push(`${id}: puste pola ${br.join(', ')}`);
    if (e.data && !RE_DATA.test(e.data)) p.push(`${id}: data poza formatem RRRR-MM-DD`);
    if (e.autor && e.recenzent && e.autor.trim().toLowerCase() === e.recenzent.trim().toLowerCase()) p.push(`${id}: autor = recenzent (L-047)`);
    if (e.stan && !/^zrecenzowana niezależnie/.test(e.stan)) p.push(`${id}: stan bez „zrecenzowana niezależnie” (L-047)`);
  };
  const sekcja = (nazwa, wymagane, oc) => {
    const mam = w[nazwa] ?? {};
    for (const [k, s] of Object.entries(wymagane)) {
      const e = mam[k]; const id = `${nazwa}/${k}`;
      if (!e) { p.push(`${id}: brak wpisu${nazwa === 'v1' ? ' (v1 do zmiany na „zastapiona”)' : nazwa === 'karty' ? ' (karta własna z rysunkiem v2)' : nazwa === 'zestawy' ? ' (zestaw ogólny z rysunkiem v2)' : ''}`); continue; }
      if (e.sha !== s.sha) p.push(`${id}: sha ${e.sha} ≠ bieżący ${s.sha} (zmiana po wyliczeniu szkieletu — wygeneruj ponownie)`);
      oc(id, e, s);
    }
    for (const k of Object.keys(mam)) if (!(k in wymagane)) p.push(`${nazwa}/${k}: wpis nadmiarowy (nie jest wymagany dla rodziny ${rodzina})`);
  };
  sekcja('v2', { [rodzina]: stan.v2 }, (id, e, s) => {
    wspolne(id, e, { stanWymagany: true });
    if (e.werdykt && e.werdykt !== 'wyswietlana') p.push(`${id}: werdykt „${e.werdykt}” (v2 przyjmuje tylko „wyswietlana”; inny werdykt = rodzina bez wpisu)`);
    if (e.liczba !== s.liczba) p.push(`${id}: liczba ${e.liczba} ≠ ${s.liczba} (assignAll łącznie z wyjątkami bez rysunku: ${s.bez_rysunku.join(', ') || 'brak'})`);
    if (typeof e.slad !== 'string' || e.slad.trim().length <= 10) p.push(`${id}: pole slad puste albo krótsze niż 11 znaków (arkusz z nałożonym śladem toru, L-050)`);
  });
  sekcja('v1', stan.v1, (id, e) => {
    wspolne(id, e, { zwykly: true }); /* „zastapiona” to zapis mechaniczny (rysunek v2 wyświetla ćwiczenie), nie ocena: bez autora, recenzenta i uwag */
    if (e.werdykt !== 'zastapiona') p.push(`${id}: werdykt „${e.werdykt}” zamiast „zastapiona” (ćwiczenie wyświetla figurę v2)`);
    if (e.rodzina !== rodzina) p.push(`${id}: rodzina „${e.rodzina}” ≠ ${rodzina}`);
  });
  sekcja('karty', stan.karty, (id, e) => { wspolne(id, e, { stanWymagany: true }); if (e.werdykt && !['wyswietlana', 'do poprawy'].includes(e.werdykt)) p.push(`${id}: werdykt „${e.werdykt}” (wyswietlana | do poprawy)`); });
  sekcja('zestawy', stan.zestawy, (id, e, s) => {
    wspolne(id, e, { stanWymagany: true });
    if (e.werdykt && !['wyswietlana', 'do poprawy'].includes(e.werdykt)) p.push(`${id}: werdykt „${e.werdykt}” (wyswietlana | do poprawy)`);
    if (e.rodzina !== s.rodzina) p.push(`${id}: rodzina zestawu „${e.rodzina}” ≠ ${s.rodzina} (cue-sets.json)`);
  });
  return p;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const a = process.argv.slice(2);
  const arg = f => (a.includes(f) ? a[a.indexOf(f) + 1] : undefined);
  try {
    if (a.includes('--sprawdz')) {
      const plik = arg('--sprawdz'); if (!plik) throw new Error('brak pliku po --sprawdz');
      const problemy = sprawdz(JSON.parse(readFileSync(plik, 'utf8')));
      if (problemy.length) { console.error(`recenzja-szkielet: ${problemy.length} braków:\n- ${problemy.join('\n- ')}`); process.exit(1); }
      console.log('recenzja-szkielet: komplet — wypełniony szkielet zgodny z bieżącym stanem.\nKroki po wpisaniu do docs/research/figury-recenzja.json:\n' + KROKI.map((k, i) => `${i + 1}. ${k}`).join('\n'));
    } else {
      const rodzina = a.find(x => !x.startsWith('--') && x !== arg('--out')); if (!rodzina) throw new Error('Użycie: node scripts/recenzja-szkielet.mjs <rodzina> [--out plik] | --sprawdz plik');
      const json = JSON.stringify(szkielet(rodzina), null, 2) + '\n';
      if (arg('--out')) { writeFileSync(arg('--out'), json); console.log(`recenzja-szkielet: zapisano ${arg('--out')}`); } else process.stdout.write(json);
    }
  } catch (e) { console.error(String(e.message ?? e)); process.exit(2); }
}
