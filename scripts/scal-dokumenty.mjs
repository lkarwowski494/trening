// Łączenie konfliktów scalenia w dokumentach dopisywanych równolegle (L-120, wariant A, decyzja koordynatora 08.11.2026 w nocy z upoważnienia właściciela).
// Używa scripts/scal-galaz.mjs: docs/18-przekazanie.md (lista wpisów „- …” i nagłówki „#”, dopisywana na końcu) i docs/40-lekcje.md (lekcje „## L-NNN …”, najnowsze u góry).
// Wejście: tekst pliku w stylu diff3 (`git checkout --conflict=diff3 -m -- plik`). Konflikt jest łączony tylko wtedy, gdy obie strony WYŁĄCZNIE DODAJĄ pełne wpisy w tym samym miejscu
// (sekcja bazowa pusta, pierwszy niepusty wiersz każdej strony zaczyna wpis, a po konflikcie zaczyna się następny wpis albo koniec pliku). Wynik: wpisy strony docelowej, potem źródłowej,
// bez identycznych duplikatów; w docs/40 wpisy „## L-NNN” przed numerowanymi (strażnik tests/audit-m1-p4b-queue.test.ts). Wszystko inne (edycja istniejącego wpisu, dopisek do wpisu,
// ten sam nagłówek z inną treścią, nierozpoznany układ) → null, czyli odmowa jak dotąd.
export const DOKUMENTY_LACZONE = ['docs/18-przekazanie.md', 'docs/40-lekcje.md'];

const POCZATEK = { 'docs/18-przekazanie.md': /^(- |#)/, 'docs/40-lekcje.md': /^## / };
const pusty = (l) => l.trim() === '';

/** Dzieli wiersze strony konfliktu na wpisy (początek: wiersz pasujący do `poczatek`); null, gdy pierwszy niepusty wiersz nie zaczyna wpisu. */
function wpisy(linie, poczatek) {
  const w = [];
  for (const l of linie) {
    if (poczatek.test(l)) w.push([l]);
    else if (w.length) w[w.length - 1].push(l);
    else if (!pusty(l)) return null;
  }
  return w;
}
const bezPustychNaKoncu = (w) => { const k = [...w]; while (k.length && pusty(k[k.length - 1])) k.pop(); return k; };
const pustychNaKoncu = (linie) => { let n = 0; for (let i = linie.length - 1; i >= 0 && pusty(linie[i]); i--) n++; return n; };

/** @returns {{ tekst: string, wpisy: number } | null} */
export function polaczWpisy(plik, tekst) {
  const poczatek = POCZATEK[plik];
  if (!poczatek) return null;
  const linie = tekst.split('\n'); const wynik = []; let razem = 0; let i = 0;
  while (i < linie.length) {
    if (!linie[i].startsWith('<<<<<<<')) { wynik.push(linie[i++]); continue; }
    const cel = []; const baza = []; const zrodlo = []; let sekcja = cel; i++;
    for (; i < linie.length && !linie[i].startsWith('>>>>>>>'); i++) {
      if (linie[i].startsWith('|||||||')) sekcja = baza; else if (linie[i] === '=======') sekcja = zrodlo; else sekcja.push(linie[i]);
    }
    if (i >= linie.length || baza.length || sekcja !== zrodlo) return null; /* niedomknięty konflikt albo ktoś zmienił istniejące wiersze */
    i++;
    const nastepny = linie.slice(i).find((l) => !pusty(l));
    if (nastepny !== undefined && !poczatek.test(nastepny) && !nastepny.startsWith('<<<<<<<')) return null; /* konflikt w środku wpisu */
    const wc = wpisy(cel, poczatek); const wz = wpisy(zrodlo, poczatek);
    if (!wc || !wz || (!wc.length && !wz.length)) return null;
    const tc = wc.map(bezPustychNaKoncu); const tz = wz.map(bezPustychNaKoncu);
    const dolacz = [];
    for (const e of tz) {
      const ten = tc.find((c) => c[0] === e[0]);
      if (!ten) dolacz.push(e); else if (ten.join('\n') !== e.join('\n')) return null; /* ten sam wpis, inna treść */
    }
    let razemWpisy = [...tc, ...dolacz];
    if (plik === 'docs/40-lekcje.md') razemWpisy = [...razemWpisy.filter((e) => e[0].startsWith('## L-NNN ')), ...razemWpisy.filter((e) => !e[0].startsWith('## L-NNN '))];
    const odstep = plik === 'docs/40-lekcje.md' ? [''] : [];
    const ogon = Math.max(pustychNaKoncu(cel), pustychNaKoncu(zrodlo));
    razemWpisy.forEach((e, k) => { wynik.push(...e); if (k < razemWpisy.length - 1) wynik.push(...odstep); });
    for (let b = 0; b < ogon; b++) wynik.push('');
    razem += razemWpisy.length;
  }
  const scalone = wynik.join('\n');
  if (plik === 'docs/40-lekcje.md') {
    const naglowki = [...scalone.matchAll(/^## L-(\d{3}|NNN) /gm)].map((m) => m[1]);
    const ostatniaRobocza = naglowki.lastIndexOf('NNN');
    if (naglowki.slice(0, ostatniaRobocza + 1).some((n) => n !== 'NNN')) return null; /* L-NNN pod numerowaną — kolejność wymaga decyzji człowieka */
  }
  return { tekst: scalone, wpisy: razem };
}
