// Marka w powłoce strony apps4brew.com (W-18, 15.11.2026; decyzje właściciela 09.11.2026 „RepsGoat” i 15.11.2026 „nazwa wszędzie”).
// Eksport (eksport-apps4brew.mjs) podmienia sekcje treści ze site/, a tytuły, meta, og:*, h1, aria-label, stopka i komentarze powłoki niosą nazwę aplikacji —
// ta funkcja ustawia w nich markę z lib/brand.ts (przez scripts/marka.mjs). Treść sekcji <section lang="pl|en"> zostaje bez zmian (rzeczownik „trening” jest dozwolony).
// Ścieżki trening/… i assets/trening-icon.png nie zawierają nazwy w sensie marki — są w App Store Connect, nie zmieniamy ich.
const SEKCJA = /(<section lang="(?:pl|en)"[^>]*>[\s\S]*?<\/section>)/g;

/** Zamienia starą nazwę w powłoce (poza sekcjami treści). Idempotentna. */
export function przemarkuj(html, marka) {
  return html.split(SEKCJA).map((kawalek, i) => (i % 2 === 1 ? kawalek : zamien(kawalek, marka))).join('');
}

function zamien(s, marka) {
  return s
    .replace(/\b(?:Trening|Training) — /g, `${marka} — `) /* tytuł, og:title, h1 (PL i EN) */
    .replace(/aplikacji Trening\b/g, `aplikacji ${marka}`) /* meta description, og:description, aria-label, komentarze */
    .replace(/\bTraining path:/g, `${marka} path:`) /* data-label-en figury „Droga aplikacji…” */
    .replace(/data-pl="Trening" data-en="Training">Trening</g, `data-pl="${marka}" data-en="${marka}">${marka}<`); /* stopka */
}
