// start-1-1-r3-gen.mjs — kierunek C′ „spójny” (05.11.2026). Użycie: node docs/design/narzedzia/start-1-1-r3-gen.mjs
// Pisze docs/design/kierunki/start-1-1-r3-spojny.html: nowa osoba (C′), Ogranicz ruch, Zwiększ kontrast, po 1. treningu (zwykły ekran główny), w treningu (tablica).
// Wzór układu: ekran główny bez planu i tablica treningu z prawdziwej aplikacji (zrzuty koordynatora z eksportu web, 05.11.2026).
// Ruch: start-1-1-r2.js (sceneC — klapki .fl[data-v], kaskada od lewej; data-big = pusta klapka, potem wartość, nigdy liczby pośrednie).
import { readFileSync, writeFileSync } from 'node:fs';
const K = 'docs/design/kierunki/';
const src = readFileSync(K + 'start-1-1-tablica-dnia.html', 'utf8');
const zakl = src.match(/<nav class="zakl"[\s\S]*?<\/nav>/)[0];
const ikonka = src.match(/<div class="tyt"><h1>Trening<\/h1>(<svg[\s\S]*?<\/svg>)/)[1];
const sb = `<div class="sb"><span>9:41</span><span class="sb-i" aria-hidden="true"><i style="width:17px;height:11px"></i><i style="width:15px;height:11px;border-radius:5px"></i><i style="width:25px;height:12px;border-radius:4px"></i></span></div>`;
const DNI = [['PON.', 2], ['WT.', 3], ['ŚR.', 4], ['CZW.', 5], ['PT.', 6], ['SOB.', 7], ['NIEDZ.', 8]];
const glowa = `${sb}<div class="g-tyt"><h1>Trening</h1>${ikonka}<a class="up">Ustaw plan</a></div><p class="g-data">czwartek, 5 listopada <span class="przyk" style="padding:0">[PRZYKŁAD: bieżąca data]</span></p>`;
const tydz = (znak) => `<p class="g-bez">Bez planu tygodnia</p><div class="g-tydz" role="img" aria-label="Ten tydzień, dziś czwartek 5 listopada.${znak ? ' Trening: czwartek.' : ''}">${DNI.map(([d, n], i) => `<div class="${i === 3 ? 'dzis' : ''}"><small>${d}</small><b>${n}</b>${znak && i === 3 ? '<i></i>' : ''}</div>`).join('')}</div>`;
const fl = (s) => [...s].map((c) => `<span class="fl" data-v="${c}"></span>`).join('');
const tablica = `<section class="g-tab" role="img" aria-label="Pierwszy trening. Czwartek, 5 listopada.">
<div class="g-r1"><span class="g-nazwa nowy">Pierwszy trening</span><span class="g-meta">dziś</span></div>
<div class="g-duza"><span class="fl" data-big data-v="1"></span><span class="jedn nowy">trening</span></div>
<div class="g-pola"><span>${fl('CZW')}</span><span>${fl('05')}</span><span>${fl('LIS')}</span></div></section>`;
const start = (b, s) => `<button class="g-start"><span><b>${b}</b><small>${s}</small></span><i>›</i></button><button class="g-inny">Inny trening</button>`;
const kiedy = `<p class="g-sek nowy">Kiedy zechcesz</p><ul class="g-lista"><li><a><span>Szablony i plan</span><i>›</i></a></li><li><a><span>Miejsca i sprzęt</span><i>›</i></a></li><li><a><span>Importuj historię z pliku CSV</span><i>›</i></a></li><li><a><span>Przewodnik</span><i>›</i></a></li></ul>`;
const nowa = `${glowa}${tydz(false)}${tablica}${start('<span class="nowy">Zacznij pierwszy trening</span>', 'ćwiczenia dodasz w trakcie')}${kiedy}`;
const po = `${glowa}${tydz(true)}${start('Powtórz ostatni (Back Squat)', '1 ćw.')}<p class="g-sek">Ten tydzień</p><div class="g-kafle"><div><b>1</b><span>Treningi</span></div><div><b>3</b><span>Serie</span></div><div><b>900 kg</b><span>Objętość</span></div><div><b>25 min</b><span>Czas</span></div></div><p class="przyk">[PRZYKŁAD: liczby z zapisanego treningu; niżej bez zmian — sylwetka i „Szczegóły w Postępach”]</p>`;
const trening = `${sb}<div class="w-nag"><b>Trening</b><span>0:05</span><em>Zakończ</em></div><div class="w-post"><i></i></div>
<section class="g-tab" aria-label="Back Squat, seria 1 z 3, 60 kilogramów razy 5"><div class="g-r1"><span class="g-nazwa">Back Squat</span><span class="g-meta">seria 1 z 3</span></div>
<div class="w-liczby">60<small>kg</small>×<span>5</span></div><div class="w-pola"><span class="teraz">1</span><span>2</span><span>3</span></div></section>
<button class="w-seria">Seria zrobiona</button><p class="przyk">[PRZYKŁAD: ćwiczenie i liczby; układ tablicy jak w aplikacji — BoardFace]</p>`;
const mains = [['nowa', '', 'C′ nowa osoba', nowa], ['nowa-ogranicz-ruch', 'rm', 'C′ Ogranicz ruch', nowa], ['nowa-kontrast', 'rm hc', 'C′ Zwiększ kontrast', nowa], ['po-treningu', '', 'Po pierwszym treningu', po], ['w-treningu', '', 'W trakcie treningu', trening]];
const panel = `<h2>C′. Spójny</h2><p><b>Idea:</b> nowa osoba widzi dokładnie ten ekran główny, który zostanie z nią na co dzień, plus jedną rzecz: tablicę „pierwszy trening” — tę samą granatową tablicę z wielkimi cyframi, którą zobaczy w trakcie serii.</p>
<h3>Kolejność</h3><p>Pasek tygodnia na górze (tam, gdzie będzie zawsze), tablica pod nim, przycisk startu pod tablicą — jak w treningu: tablica, pod nią główny przycisk. Po pierwszym treningu tablica znika, a wszystko inne zostaje na swoim miejscu.</p>
<h3>Ruch</h3><p>Raz przy wejściu: klapki daty kaskadą od lewej (ok. 0,7 s), wielka „1” jednym przewrotem. Ogranicz ruch: przenikanie 150 ms (<code>MOTION.reducedCrossfadeMs</code>, jak BoardFace).</p>
<h3>VoiceOver</h3><p class="vo">„Pierwszy trening. Czwartek, 5 listopada.” Klapki ukryte.</p>`;
const html = `<!doctype html><html lang="pl" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>C′ spójny</title>
<link rel="stylesheet" href="wspolne.css"><link rel="stylesheet" href="start-1-1.css"><link rel="stylesheet" href="start-1-1-r2.css"><link rel="stylesheet" href="start-1-1-r3.css">
<script src="start-1-1-r2-figury.js"></script><script src="start-1-1-r2.js" defer></script></head><body><div class="uklad">
${mains.map(([n, c, l, b]) => `<main data-ekran="${n}" data-kier="c" class="tel ${c}" ${c.includes('hc') ? 'data-hc' : ''} aria-label="${l}">${b}${zakl}</main>`).join('\n')}
<aside class="panel">${panel}</aside></div></body></html>`;
writeFileSync(K + 'start-1-1-r3-spojny.html', html); console.log(K + 'start-1-1-r3-spojny.html');
