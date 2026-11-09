// start-1-1-r4-gen.mjs — C′ v4 (wybrany kierunek z poprawkami właściciela, 05.11.2026). Użycie: node docs/design/narzedzia/start-1-1-r4-gen.mjs
// Pisze docs/design/kierunki/start-1-1-r4.html. Style: start-1-1.css, start-1-1-r2.css, start-1-1-r3.css (tytuł, pasek, tablica = C′), start-1-1-r4.css (kafelki).
// Teksty istniejące: lib/i18n + lib/locales/{de,el}.json; nowe — klasa .nowy (pl) i [ROBOCZE] (de, el: przekład roboczy do tłumacza i recenzenta lokalizacji).
import { readFileSync, writeFileSync } from 'node:fs';
const K = 'docs/design/kierunki/';
const src = readFileSync(K + 'start-1-1-tablica-dnia.html', 'utf8');
const zakl = src.match(/<nav class="zakl"[\s\S]*?<\/nav>/)[0];
const ikonka = src.match(/<div class="tyt"><h1>Trening<\/h1>(<svg[\s\S]*?<\/svg>)/)[1];
const sb = `<div class="sb"><span>9:41</span><span class="sb-i" aria-hidden="true"><i style="width:17px;height:11px"></i><i style="width:15px;height:11px;border-radius:5px"></i><i style="width:25px;height:12px;border-radius:4px"></i></span></div>`;
/* ikony w siatce ICON (lib/tokens.ts): kalendarz = ikona zakładki Plan, pin = components/Icon.tsx; dokument ze strzałką i książka — NOWE ikony */
const IK = {
  plan: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
  csv: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M12.5 11v6.5M9.8 14.8l2.7 2.7 2.7-2.7"/>',
  ksiazka: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/>',
};
const N = (s, l) => (l === 'pl' ? `<span class="nowy">${s}</span>` : `${s} <span class="przyk" style="padding:0">[ROBOCZE]</span>`);
const T = {
  pl: { dni: ['PON.', 'WT.', 'ŚR.', 'CZW.', 'PT.', 'SOB.', 'NIEDZ.'], trening: 'Trening', ustaw: 'Ustaw plan', data: 'czwartek, 5 listopada', bez: 'Bez planu tygodnia', tab: 'Pierwszy trening', dzis: 'dziś', jedn: 'trening', flaps: ['CZW', '05', 'LIS'],
    start: 'Zacznij pierwszy trening', startS: 'ćwiczenia dodasz w trakcie', inny: 'Inny trening', innyS: 'z gotowego szablonu', sek: 'Zacznij od ustawień',
    kaf: [['plan', 'Szablony i plan', 'Utwórz pierwszy szablon albo wygeneruj szablony i plan.', 0], ['pin', 'Miejsca i sprzęt', 'Dom albo siłownia — ustaw swój sprzęt.', 1], ['csv', 'Historia z CSV', 'Masz historię w innej aplikacji? Możesz ją dopisać z pliku CSV.', 2], ['ksiazka', 'Przewodnik', 'Co gdzie jest i jak działa.', 1]] },
  de: { dni: ['MO.', 'DI.', 'MI.', 'DO.', 'FR.', 'SA.', 'SO.'], trening: 'Training', ustaw: 'Plan festlegen', data: 'Donnerstag, 5. November', bez: 'Kein Wochenplan', tab: 'Erstes Training', dzis: 'heute', jedn: 'Training', flaps: ['DO', '05', 'NOV'],
    start: 'Erstes Training starten', startS: 'Übungen fügst du unterwegs hinzu', inny: 'Anderes Training', innyS: 'aus einer fertigen Vorlage', sek: 'Mit Einstellungen beginnen',
    kaf: [['plan', 'Vorlagen und Plan', 'Erstelle deine erste Vorlage oder lass Vorlagen und Plan erstellen.', 0], ['pin', 'Orte und Ausrüstung', 'Zu Hause oder im Fitnessstudio — stelle deine Ausrüstung ein.', 1], ['csv', 'Verlauf aus einer CSV-Datei importieren', 'Hast du schon einen Trainingsverlauf in einer anderen App? Du kannst ihn aus einer CSV-Datei importieren.', 0], ['ksiazka', 'Anleitung', 'Was wo ist und wie es funktioniert.', 1]] },
  el: { dni: ['ΔΕΥ.', 'ΤΡΙ.', 'ΤΕΤ.', 'ΠΕΜ.', 'ΠΑΡ.', 'ΣΑΒ.', 'ΚΥΡ.'], trening: 'Προπόνηση', ustaw: 'Ορίστε πρόγραμμα', data: 'Πέμπτη, 5 Νοεμβρίου', bez: 'Χωρίς εβδομαδιαίο πρόγραμμα', tab: 'Πρώτη προπόνηση', dzis: 'σήμερα', jedn: 'προπόνηση', flaps: ['ΠΕΜ', '05', 'ΝΟΕ'],
    start: 'Ξεκινήστε την πρώτη προπόνηση', startS: 'προσθέτετε ασκήσεις στην πορεία', inny: 'Άλλη προπόνηση', innyS: 'από έτοιμο πρότυπο', sek: 'Ξεκινήστε από τις ρυθμίσεις',
    kaf: [['plan', 'Πρότυπα και πρόγραμμα', 'Δημιουργήστε το πρώτο σας πρότυπο ή δημιουργήστε αυτόματα πρότυπα και πρόγραμμα.', 0], ['pin', 'Χώροι και εξοπλισμός', 'Σπίτι ή γυμναστήριο — ορίστε τον εξοπλισμό σας.', 1], ['csv', 'Εισαγωγή ιστορικού από αρχείο CSV', 'Έχετε ιστορικό σε άλλη εφαρμογή; Μπορείτε να το προσθέσετε από αρχείο CSV.', 0], ['ksiazka', 'Οδηγός', 'Τι βρίσκεται πού και πώς λειτουργεί.', 1]] },
};
const fl = (s) => [...s].map((c) => `<span class="fl" data-v="${c}"></span>`).join('');
/* nowe: 0 = tekst istniejący, 1 = nowy, 2 = nowy tytuł (zdanie istniejące) */
const kafelki = (t, l, w) => `<p class="g-sek">${N(t.sek, l)}</p><div class="kaf ${w}">${t.kaf.map(([ik, ti, z, nowe]) => `<a href="#" aria-label="${ti}. ${z}"><span class="gl"><svg viewBox="0 0 24 24" aria-hidden="true">${IK[ik]}</svg><span class="t">${nowe === 2 ? N(ti, l) : ti}</span></span><span class="z">${nowe === 1 ? N(z, l) : z}</span><span class="s" aria-hidden="true">›</span></a>`).join('')}</div>`;
function ekran(l, { w = 'w1', po = false } = {}) {
  const t = T[l];
  const glowa = `${sb}<div class="g-tyt"><h1>${t.trening}</h1>${ikonka}<a class="up">${t.ustaw}</a></div><p class="g-data">${t.data} <span class="przyk" style="padding:0">[PRZYKŁAD: bieżąca data]</span></p>`;
  const tydz = `<p class="g-bez">${t.bez}</p><div class="g-tydz" role="img" aria-label="Ten tydzień, dziś czwartek 5 listopada.${po ? ' Trening: czwartek.' : ''}">${t.dni.map((d, i) => `<div class="${i === 3 ? 'dzis' : ''}"><small>${d}</small><b>${i + 2}</b>${po && i === 3 ? '<i></i>' : ''}</div>`).join('')}</div>`;
  const tablica = `<section class="g-tab" role="img" aria-label="${t.tab}. ${t.data}."><div class="g-r1"><span class="g-nazwa">${N(t.tab, l)}</span><span class="g-meta">${t.dzis}</span></div>
<div class="g-duza"><span class="fl" data-big data-v="1"></span><span class="jedn">${t.jedn}</span></div><div class="g-pola">${t.flaps.map((f) => `<span>${fl(f)}</span>`).join('')}</div></section>`;
  if (po) return `${glowa}${tydz}<button class="g-start"><span><b>Powtórz ostatni (Back Squat)</b><small>1 ćw.</small></span><i>›</i></button><button class="g-inny2"><span><b>${t.inny}</b><small>${N(t.innyS, l)}</small></span><i>›</i></button>
<p class="g-sek">Ten tydzień</p><div class="g-kafle"><div><b>1</b><span>Treningi</span></div><div><b>3</b><span>Serie</span></div><div><b>900 kg</b><span>Objętość</span></div><div><b>25 min</b><span>Czas</span></div></div><p class="przyk">[PRZYKŁAD: liczby z zapisanego treningu; tablica i „Zacznij od ustawień” znikają jak dziś „Pierwsze kroki”]</p>`;
  return `${glowa}${tydz}${tablica}<button class="g-start"><span><b>${N(t.start, l)}</b><small>${t.startS}</small></span><i>›</i></button><button class="g-inny2"><span><b>${t.inny}</b><small>${N(t.innyS, l)}</small></span><i>›</i></button>${kafelki(t, l, w)}`;
}
const mains = [
  ['nowa', '', 'pl', 'C′ v4, kafelki W1', ekran('pl')],
  ['nowa-w2', '', 'pl', 'C′ v4, kafelki W2', ekran('pl', { w: 'w2' })],
  ['nowa-ogranicz-ruch', 'rm', 'pl', 'C′ v4, Ogranicz ruch', ekran('pl')],
  ['nowa-kontrast', 'rm hc', 'pl', 'C′ v4, Zwiększ kontrast', ekran('pl')],
  ['po-treningu', '', 'pl', 'Po pierwszym treningu', ekran('pl', { po: true })],
  ['nowa-de', 'rm', 'de', 'C′ v4 po niemiecku, W1', ekran('de')],
  ['nowa-el', 'rm', 'el', 'C′ v4 po grecku, W1', ekran('el')],
];
const panel = `<h2>C′ v4</h2><p>Wybrany kierunek C′ z poprawkami właściciela (05.11.2026): „Inny trening” z podpisem „z gotowego szablonu”; zamiast „Kiedy zechcesz” sekcja „Zacznij od ustawień” z 4 osobnymi kafelkami 2 × 2.</p>
<h3>Kafelki</h3><p>W1 — jak kafelki „Ten tydzień” (obwódka, promień 10), ikona przy tytule. W2 — wyższe, ikona w kółku na górze, tytuł Barlow. Cały kafelek jest przyciskiem (≥ 44 pt), „›” wg docs/32 wzorzec 17. Ikony: kalendarz (zakładka Plan), pinezka (Icon.tsx); dokument i książka — nowe, w siatce ICON. Bez barw talerzy.</p>
<h3>Duży tekst i długie języki</h3><p>Siatka przechodzi w 1 kolumnę, gdy kafelek byłby węższy niż ok. 144 pt (pl) / 156 pt (de, el) albo przy dużym tekście.</p>
<h3>VoiceOver</h3><p class="vo">Kafelek: „Szablony i plan. Utwórz pierwszy szablon albo wygeneruj szablony i plan. Przycisk.”</p>`;
const html = `<!doctype html><html lang="pl" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>C′ v4</title>
<link rel="stylesheet" href="wspolne.css"><link rel="stylesheet" href="start-1-1.css"><link rel="stylesheet" href="start-1-1-r2.css"><link rel="stylesheet" href="start-1-1-r3.css"><link rel="stylesheet" href="start-1-1-r4.css">
<script src="start-1-1-r2-figury.js"></script><script src="start-1-1-r2.js" defer></script></head><body><div class="uklad">
${mains.map(([n, c, l, lab, b]) => `<main data-ekran="${n}" data-kier="c" lang="${l}" class="tel ${c}" ${c.includes('hc') ? 'data-hc' : ''} aria-label="${lab}">${b}${zakl}</main>`).join('\n')}
<aside class="panel">${panel}</aside></div></body></html>`;
writeFileSync(K + 'start-1-1-r4.html', html); console.log(K + 'start-1-1-r4.html');
