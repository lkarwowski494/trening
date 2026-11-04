// Normalizacja plików wspólnych przed liczeniem skrótu recenzji rodziny v2 (decyzja właściciela 1A, 03.11.2026 ~22:00 PL; docs/18).
// Skrót rodziny (`rodzinaSkrot` w scripts/zrodla-runtime.mjs, `skrotRodziny` w scripts/strona/recenzja-figur.mjs) nie ma się zmieniać od samego PODŁĄCZENIA innej rodziny.
// Z dwóch plików wspólnych wyjmujemy więc tylko to, co podłączenie zmienia i co nie jest rysunkiem:
//   families.ts — wartość pola `status` rodziny ('ready' | 'planned'); reszta pliku (widoki, etykiety, przypisanie ćwiczeń do rodzin) zostaje w skrócie, bo wpływa na to, co widać;
//   poseData.ts — wpisy ładowania LOAD (`rodzina: () => require('./poses/….json')`) oraz wpisy prezentacji INNYCH rodzin w DATA_UI i ONE_WAY_UI (wpis własnej rodziny zostaje:
//                 nazwy faz i mierzony staw są częścią recenzowanego ekranu); reszta pliku (ISOMETRIC, GAIT_UI, logika, komentarze) zostaje w skrócie.
// Wszystko, co zmienia rysunek (contract/scene/draw, dane póz, rigi), zostaje w skrócie bez zmian. Jedno źródło dla obu skryptów (parytet: tests/strona-eksport-recenzja.test.ts).
const LOAD_WPIS = /^  \w+: \(\) => require\('\.\/poses\/[\w-]+\.json'\),$/;
const BLOK_POCZATEK = /^export const (?:DATA_UI|ONE_WAY_UI)\b.*= \{$/;
const WPIS_RODZINY = /^  (\w+): \{/;

/** Linie bloku `export const DATA_UI/ONE_WAY_UI = { … };` bez wpisów rodzin innych niż `rodzina` (wpis = linie od „  klucz: {” do następnego wpisu albo linii o wcięciu 2). */
function bezObcychWpisow(linie, rodzina) {
  const out = []; let wBloku = false, pomijaj = false;
  for (const l of linie) {
    if (!wBloku) { out.push(l); if (BLOK_POCZATEK.test(l)) { wBloku = true; pomijaj = false; } continue; }
    if (l === '};') { wBloku = false; out.push(l); continue; }
    const m = WPIS_RODZINY.exec(l);
    if (m) pomijaj = m[1] !== rodzina;
    else if (/^  \S/.test(l)) pomijaj = false; /* komentarz o wcięciu 2 kończy wpis */
    if (!pomijaj) out.push(l);
  }
  return out;
}

/** Plik danych nakładki techniki rodziny (overlay/<rodzina>.ts) — tylko w skrócie swojej rodziny (W1, recenzja 1R, 04.11.2026); null, gdy rodzina nie ma nakładki. */
export const plikNakladki = (rodzina, istnieje) => { const p = `lib/figures/v2/overlay/${rodzina}.ts`; return istnieje(p) ? p : null; };
const IMPORT_NAKLADKI = /^import \{ (\w+) \} from '\.\/overlay\/(\w+)';$/;
/** overlay.ts i guides.ts składają dane WSZYSTKICH rodzin (importy + rejestr); do skrótu rodziny wchodzi tylko jej własny import i wpis (jak DATA_UI, decyzja 1A) — dodanie nakładki innej rodziny nie unieważnia recenzji. */
function bezObcychNakladek(tekst, rodzina) {
  const obce = [...tekst.split('\n')].map(l => IMPORT_NAKLADKI.exec(l)).filter(m => m && m[2] !== 'common' && m[2] !== rodzina).map(m => m[1]);
  let out = tekst.split('\n').filter(l => { const m = IMPORT_NAKLADKI.exec(l); return !(m && obce.includes(m[1])); }).join('\n');
  for (const n of obce) out = out.replace(new RegExp(`\\.\\.\\.${n},? ?`, 'g'), '').replace(new RegExp(`\\w+: ${n},? ?`, 'g'), '');
  return out;
}
/** Tekst pliku wspólnego rodziny v2 w postaci wchodzącej do skrótu rodziny `rodzina`. Pliki inne niż families.ts i poseData.ts: bez zmian. */
export function normalizujPlikV2(plik, tekst, rodzina) {
  if (plik === 'lib/figures/v2/families.ts') return tekst.replace(/\bstatus: '(?:ready|planned)'/g, "status: '_'");
  if (plik === 'lib/figures/v2/poseData.ts') return bezObcychWpisow(tekst.split('\n').filter(l => !LOAD_WPIS.test(l)), rodzina).join('\n');
  if (plik === 'lib/figures/v2/overlay.ts' || plik === 'lib/figures/v2/guides.ts') return bezObcychNakladek(tekst, rodzina);
  return tekst;
}
