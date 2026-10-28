// Strażnik „decyzja → wdrożenie → test” dla dziennika decyzji docs/18-przekazanie.md (M1-audytor-generalny-009, DEC-02 a, 27.10.2026;
// lekcja w docs/40: decyzja z 23.10.2026 zapisana, nigdy niewdrożona, a test przypinał stan przeciwny — nic tego nie sygnalizowało).
// Dlaczego: dziennik decyzji to zdania, nie kolejka prac; bez pola wdrożenia i wskazanego testu rozjazd decyzja–kod wychodzi dopiero na telefonie.
//
// Wpis = punkt listy zaczynający się datą (`- 23.10.2026 …`, `- **23.10.2026 …`, `- 14–18.10.2026 …`) albo nagłówek `## … DD.MM.RRRR …` z własną
// treścią (punkty bez daty pod nim), od sekcji „## Decyzje” do końca pliku. Każdy wpis ma dokładnie jedno pole wdrożenia:
//   [wdrożenie: kod]                  + co najmniej jedno [test: ścieżka] albo [test: ścieżka :: fragment], albo [bez testu: powód ≥ 10 znaków]
//   [wdrożenie: bez kodu — powód]     decyzja procesowa, dokument, App Store Connect, zapis stanu (powód ≥ 5 znaków)
//   [wdrożenie: zastąpione DD.MM.RRRR] decyzja zastąpiona późniejszą (data nie wcześniejsza niż wpis)
//   [wdrożenie: otwarte → ID]         niewdrożona; ID zadania albo znaleziska, które ją prowadzi (np. 03-zakres-002)
//   [wdrożenie: odłożone → wersja]    świadomie przesunięta (np. 1.0.1), z miejscem w backlogu
// Test: plik istnieje i zawiera datę decyzji (DD.MM.RRRR albo DD.MM) albo podany fragment (np. nazwę testu). Od 28.10.2026 fragment nie
// zastępuje daty: nowy wskazany test musi zawierać datę decyzji (07-jakosc-005: test wskazuje decyzję, którą pilnuje).
// Użycie: node scripts/decyzje.mjs --check [plik…]   (domyślnie docs/18-przekazanie.md; kod 1 przy błędach)
//         node scripts/decyzje.mjs --lista [plik]    (JSON wpisów: linia, data, pole wdrożenia, testy — do przeglądu)
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const PLIKI = ['docs/18-przekazanie.md'];
/** Od tej daty wskazany test musi zawierać datę decyzji (fragment nie wystarcza). */
export const OD_DATY_W_TESCIE = '2026-10-28';

const DATA = /(\d{1,2})(?:[–-]\d{1,2})?\.(\d{2})\.(\d{4})/;
const START_PUNKTU = /^- (?:\*\*)?\d{1,2}(?:[–-]\d{1,2})?\.\d{2}\.\d{4}/;
const ROZDZIAL = /^## /;
const POCZATEK = /^## Decyzje\b/;

const iso = (d, m, r) => `${r}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** Dzieli dziennik na wpisy decyzji. */
export function wpisy(tekst) {
  const linie = tekst.split('\n');
  const start = linie.findIndex(l => POCZATEK.test(l));
  if (start < 0) return [];
  const out = [];
  let biezacy = null;
  const zamknij = () => { if (biezacy && biezacy.linie.some(l => l.trim())) out.push(biezacy); biezacy = null; };
  for (let i = start + 1; i < linie.length; i++) {
    const l = linie[i];
    if (ROZDZIAL.test(l)) {
      zamknij();
      const m = DATA.exec(l);
      if (m) biezacy = { linia: i + 1, rodzaj: 'rozdział', data: iso(+m[1], +m[2], +m[3]), naglowek: l, linie: [] };
      continue;
    }
    if (START_PUNKTU.test(l)) {
      zamknij();
      const m = DATA.exec(l);
      biezacy = { linia: i + 1, rodzaj: 'punkt', data: iso(+m[1], +m[2], +m[3]), naglowek: l, linie: [l] };
      continue;
    }
    if (biezacy) biezacy.linie.push(l);
  }
  zamknij();
  return out.map(w => ({ ...w, tekst: [w.rodzaj === 'rozdział' ? w.naglowek : '', ...w.linie].join('\n') }));
}

const POLE = /\[wdrożenie: ([^\]]*)\]/g;
const TEST = /\[test: ([^\]]+)\]/g;
const BEZ_TESTU = /\[bez testu: ([^\]]*)\]/g;

/** Wymagane formy daty w pliku testu: DD.MM.RRRR, D.MM.RRRR albo DD.MM (bez roku). */
export function formyDaty(dataIso) {
  const [r, m, d] = dataIso.split('-');
  return [`${d}.${m}.${r}`, `${+d}.${m}.${r}`, `${d}.${m}`, `${+d}.${m}`];
}

/** Sprawdza jeden wpis; zwraca listę błędów (puste = poprawny). czytaj(ścieżka) → treść albo null. */
export function sprawdzWpis(w, czytaj) {
  const b = [];
  const pola = [...w.tekst.matchAll(POLE)].map(m => m[1].trim());
  if (pola.length !== 1) { b.push(pola.length ? `${pola.length} pola [wdrożenie: …] (ma być jedno)` : 'brak pola [wdrożenie: …]'); return b; }
  const pole = pola[0];
  const testy = [...w.tekst.matchAll(TEST)].map(m => m[1].trim());
  const bez = [...w.tekst.matchAll(BEZ_TESTU)].map(m => m[1].trim());
  for (const t of testy) {
    const [sciezka, fragment] = t.split(' :: ').map(s => s.trim());
    const tresc = czytaj(sciezka);
    if (tresc === null) { b.push(`test ${sciezka} nie istnieje`); continue; }
    const maDate = formyDaty(w.data).some(f => tresc.includes(f));
    if (w.data >= OD_DATY_W_TESCIE) { if (!maDate) b.push(`test ${sciezka} nie zawiera daty decyzji (${formyDaty(w.data)[0]})`); continue; }
    if (fragment ? !tresc.includes(fragment) : !maDate) b.push(fragment ? `test ${sciezka} nie zawiera fragmentu „${fragment}”` : `test ${sciezka} nie zawiera daty decyzji (${formyDaty(w.data)[0]}) ani fragmentu (dopisz „ :: fragment”)`);
  }
  for (const p of bez) if (p.length < 10) b.push(`[bez testu: …] — powód krótszy niż 10 znaków`);
  if (/^kod\b/.test(pole)) {
    if (pole !== 'kod') b.push(`pole „${pole}”: po „kod” nic (testy w [test: …])`);
    if (!testy.length && !bez.length) b.push('[wdrożenie: kod] bez [test: …] i bez [bez testu: powód]');
  } else if (/^bez kodu\b/.test(pole)) {
    const powod = pole.replace(/^bez kodu\s*[—–-]?\s*/, '');
    if (powod.length < 5) b.push('[wdrożenie: bez kodu — powód]: brak powodu');
  } else if (/^zastąpione\b/.test(pole)) {
    const m = DATA.exec(pole);
    if (!m) b.push('[wdrożenie: zastąpione DD.MM.RRRR]: brak daty');
    else if (iso(+m[1], +m[2], +m[3]) < w.data) b.push('zastąpione decyzją wcześniejszą niż wpis');
  } else if (/^(otwarte|odłożone)\b/.test(pole)) {
    if (!/→\s*\S.{2,}/.test(pole)) b.push(`[wdrożenie: ${pole.split(' ')[0]} → ID/wersja]: brak wskazania, co ją prowadzi`);
  } else b.push(`nieznane pole wdrożenia „${pole}” (kod | bez kodu — powód | zastąpione DD.MM.RRRR | otwarte → ID | odłożone → wersja)`);
  return b;
}

/* M1-audytor-generalny-047 (28.10.2026): „[wdrożenie: otwarte → M1-audytor-generalny-NNN]” przy zadaniu, które ma już commit naprawy z tym ID
 * (konwencja commitów napraw M2: „[M1-audytor-generalny-NNN;” albo „…NNN]”, od audytu 1.0 z 27.10.2026), to wpis nieaktualny — pole trzeba zmienić
 * na „kod” z testem, „bez kodu — powód” albo wskazać nowe ID; zadanie otwarte ponownie po reaudycie oznacza się „(pętla N)” po ID. Historia git: lokalnie pełna; w CI (fetch-depth 1) tylko ostatni commit — sprawdzenie słabsze. */
export const AUDYT_OD = '2026-10-27';
export function zadaniaZNaprawa(root = ROOT) {
  /* płytka kopia (CI, fetch-depth 1): historia niepełna — null, jak brak historii (porażka tests.yml 40716367925, 28.10.2026) */
  const sh = spawnSync('git', ['rev-parse', '--is-shallow-repository'], { cwd: root, encoding: 'utf8' });
  if (sh.status !== 0 || sh.stdout.trim() === 'true') return null;
  const r = spawnSync('git', ['log', `--since=${AUDYT_OD}`, '--format=%B'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) return null;
  return [...new Set([...r.stdout.matchAll(/\[(M1-audytor-generalny-\d{3})[;\]]/g)].map(m => m[1]))];
}
export function nieaktualneWskazniki(tekst, zNaprawa) {
  const z = new Set(zNaprawa);
  return wpisy(tekst).flatMap(w => [...w.tekst.matchAll(POLE)].map(m => m[1]).filter(p => /^otwarte\b/.test(p))
    .flatMap(p => [...p.matchAll(/(M1-audytor-generalny-\d{3})(?! \(pętla \d+\))/g)].map(x => x[1]).filter(id => z.has(id)).map(id => ({ linia: w.linia, id, poczatek: w.naglowek.slice(0, 90) }))));
}

const czytajZ = root => p => { const f = join(root, p); return existsSync(f) ? readFileSync(f, 'utf8') : null; };

/** Wszystkie błędy dziennika: [{ plik, linia, błąd }]. */
export function sprawdz(plik, tekst, root = ROOT) {
  const czytaj = czytajZ(root);
  return wpisy(tekst).flatMap(w => sprawdzWpis(w, czytaj).map(blad => ({ plik, linia: w.linia, blad, poczatek: w.naglowek.slice(0, 90) })));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const pliki = args.filter(a => !a.startsWith('--'));
  if (args.includes('--lista')) {
    const p = pliki[0] || PLIKI[0];
    console.log(JSON.stringify(wpisy(readFileSync(resolve(ROOT, p), 'utf8')).map(w => ({ linia: w.linia, data: w.data, rodzaj: w.rodzaj,
      pole: [...w.tekst.matchAll(POLE)].map(m => m[1]), testy: [...w.tekst.matchAll(TEST)].map(m => m[1]), poczatek: w.naglowek.slice(0, 120) })), null, 1));
  } else {
    const lista = pliki.length ? pliki : PLIKI;
    const bledy = lista.flatMap(p => sprawdz(p, readFileSync(resolve(ROOT, p), 'utf8')));
    const zNaprawa = zadaniaZNaprawa();
    if (zNaprawa) for (const p of lista) for (const x of nieaktualneWskazniki(readFileSync(resolve(ROOT, p), 'utf8'), zNaprawa))
      bledy.push({ plik: p, linia: x.linia, blad: `[wdrożenie: otwarte → ${x.id}], a zadanie ma commit naprawy — zmień pole na „kod” z [test: …], „bez kodu — powód” albo wskaż nowe ID (M1-047)`, poczatek: x.poczatek });
    for (const e of bledy) console.error(`${e.plik}:${e.linia}: ${e.blad} — ${e.poczatek}`);
    const ile = lista.reduce((s, p) => s + wpisy(readFileSync(resolve(ROOT, p), 'utf8')).length, 0);
    if (bledy.length) { console.error(`check:decyzje — ${bledy.length} błędów w ${ile} wpisach decyzji (wzór pól: nagłówek scripts/decyzje.mjs)`); process.exit(1); }
    console.log(`check:decyzje — ${ile} wpisów decyzji, każdy z polem wdrożenia i testem albo powodem`);
  }
}
