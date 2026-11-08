# Recenzja lokalizacji: 2 opisy roli mięśni skośnych (deski boczne), commit 7a915e74

Teksty: A = „Pomaga trzymać tułów prosto, żeby nie opadał na bok.”, B = „Trzyma tułów prosto, żeby nie opadał na bok.”
Kontekst: karta ćwiczenia, sekcja mięśni (zdanie pod nazwą mięśnia; dane `data/zrodla/role-miesni.json`), zawija się — długość bez problemu we wszystkich językach.
Wzór porównania: sąsiednie role w tych samych plikach, zwłaszcza „Skręca tułów i pochyla go na bok.” (ten sam mięsień) i „Pomaga trzymać miednicę poziomo…”.
Słownik: `npx jest tests/slownik-terminow.test.ts` — 127/127 zielone. Hasło `core_en` (zakaz „trunk”) dotyczy tylko wskazówek techniki; EN „trunk” zgodne z sąsiednimi rolami.

## Poprawki

Każda poprawka dotyczy obu tekstów (A i B) tak samo; podaję wersję A, B analogicznie bez „Pomaga/Helps”.

| język | obecne (A) | proponowane (A) | powód | pewność |
|---|---|---|---|---|
| lv | Palīdz noturēt rumpi taisni, lai tā nekristu uz sāniem. | Palīdz noturēt rumpi taisnu, lai tas nekristu uz sāniem. | (b/gramatyka) „rumpis” jest rodzaju męskiego → „tas”, nie „tā”; przymiotnik „taisnu” jak w sąsiednim „noturēt to taisnu” | wysoka (tas); średnia (taisnu) |
| pt | Ajuda a manter o tronco reto para que não descaia para o lado. | Ajuda a manter o tronco direito para que não descaia para o lado. | (c) „reto” to forma brazylijska; pt-PT w sąsiedniej roli „mantê-las direitas” (nakładka pt-BR zmienia to na „retas”) | wysoka |
| pt-BR (nowa nakładka) | (efektywnie baza) …o tronco reto para que não descaia para o lado. | Ajuda a manter o tronco reto para ele não cair para o lado. | (c) po zmianie bazy na „direito” pt-BR potrzebuje nakładki z „reto”; „descair” brzmi książkowo w Brazylii | średnia / do sprawdzenia |
| es-419 (nowa nakładka) | (efektywnie baza) Ayuda a mantener el tronco recto para que no se hunda hacia un lado. | Ayuda a mantener el torso recto para que no se caiga hacia un lado. | (a/spójność) nakładka es-419 dla „Skręca tułów…” używa „torso”; bez nakładki ten sam mięsień ma dwa terminy na jednej karcie | średnia |
| ms | Membantu mengekalkan badan anda lurus supaya tidak melorot ke tepi. | Membantu mengekalkan batang badan anda lurus supaya tidak jatuh ke sisi. | (a/spójność) sąsiednie role: „batang badan”, „ke sisi”; „melorot” brzmi indonezyjsko | średnia / do sprawdzenia |
| tr | Gövdenizi dik tutmaya yardımcı olur, böylece yana düşmez. | Gövdenizi düz tutmaya yardımcı olur, böylece yana sarkmaz. | (f/b) „dik” = pionowo; w desce bocznej tułów leży skośnie — chodzi o „prosto w linii” (düz); „sarkmak” = opadać/zwisać | średnia |
| uk | Допомагає тримати корпус прямо, щоб він не западав убік. | Допомагає тримати корпус прямо, щоб він не завалювався вбік. | (b) „западати” = zapadać się do środka; „завалюватися вбік” jak w ru („заваливался набок”) | średnia |
| da | Hjælper med at holde overkroppen lige, så den ikke dykker ned til siden. | Hjælper med at holde overkroppen lige, så den ikke synker ned til siden. | (b) „dykke” = nurkować, brzmi obco; „synke ned” = opadać | średnia |
| nl | Helpt je romp recht te houden, zodat hij niet zijwaarts zakt. | Helpt je romp recht te houden, zodat hij niet opzij zakt. | (b) „zijwaarts” urzędowe; sąsiednia rola: „buigt hem opzij” | średnia |
| fr | Aide à garder le tronc droit pour qu’il ne s’affaisse pas sur le côté. | Aide à garder le buste droit pour qu’il ne s’affaisse pas sur le côté. | (a/spójność) ten sam mięsień: „Fait pivoter le buste…”; „garder le buste droit” to zwrot z sali | średnia |

Bez uwag (naturalne, spójne z sąsiednimi rolami, forma grzecznościowa zgodna): bg, cs, de, el, es, et, fi, hr, hu, id*, it*, ja*, ko, lt, nb, ro, ru, sk, sl, sr, sv*, vi*, zh-Hant* (* — pytania niżej, bez zmiany do czasu odpowiedzi).
Wątpliwości tłumacza: „tułów” w id („badan”), ms (popr. wyżej), vi („thân người”), zh („軀幹”) — spójne z sąsiednią rolą „Skręca tułów…”, poprawne. „opadał”: de „durchhängt” i es „se hunda” — zwroty z desek, dopuszczalne; id/vi/zh — pytania niżej.

## Pytania do native speakerów

- id: „agar tidak melorot ke samping” czy „agar tidak turun ke samping” — co powie trener o biodrach opadających w desce bocznej?
- vi: „không bị võng sang một bên” czy „không bị đổ sang một bên”?
- zh-Hant: „不往旁邊垮” czy „不往旁邊塌下去”? (oraz czy „挺直” nie sugeruje pozycji pionowej — alternatywa „保持一直線”)
- ja: 「横に落ちないように」czy「横に崩れないように」?
- de: „zur Seite durchhängt” czy „zur Seite absackt”?
- sv: „sjunker ihop åt sidan” czy „sjunker ner åt sidan”?
- it: „così non cede di lato” czy „così non cade di lato”?
- pt-BR: „para que não descaia” czy „para ele não cair” — co brzmi naturalnie w Brazylii?

## Nowe terminy do słownika

- „tułów” w rolach mięśni (nie we wskazówkach): fr „buste”, es-419 „torso”, ms „batang badan” — utrwalić, bo ten sam mięsień ma już kilka ról na jednej karcie (powód: rozjazd fr/es-419/ms w tej paczce).

## Podsumowanie

Przeczytano 62 teksty (2 × 31 języków) + efektywne pt-BR i es-419. Poprawek: 10 (każda w obu tekstach), pytań: 8.
Blokująca: 1 — lv „tā” → „tas” (błąd gramatyczny, zgoda rodzaju). tr „dik” to drobne przesunięcie sensu (pionowo vs prosto), zalecane przed wydaniem, nie blokujące. Pozostałe: spójność terminu i naturalność, nieblokujące.
