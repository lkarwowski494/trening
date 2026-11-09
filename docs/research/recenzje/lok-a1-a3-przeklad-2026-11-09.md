Autor: tłumacz (przekład API, 09.11.2026). Recenzent: recenzent-lokalizacji (nie pisał treści; L-047). Stan po recenzji: poprawki BLOKUJĄCE, ŚREDNIE i mechaniczne NISKIE naniesione na gałęzi `lok/przeklad-a1-a3` (09.11.2026); pozostałe NISKIE i pytania do native speakerów w docs/21 (backlog 1.1.x).

# Recenzja lokalizacji — przekład API A1–A3 + 5 kluczy UI (09.11.2026)

Materiał: gałąź `lok/przeklad-a1-a3` @ 699d526c. Recenzent: recenzent-lokalizacji. Nic nie edytowano.
Strażniki uruchomione na tym drzewie: `npx jest tests/slownik-terminow.test.ts` — 127/127 zielone; `npx jest tests/i18n-variants.test.ts` — 54/54 zielone (pt-BR bez enklizy, es-419 bez słów europejskich).

Zakres przeczytany:
- w całości (104 wskazówki): ja, ko, zh-Hant, ru, uk, de, fr, es, es-419 (tekst efektywny: nakładka + baza es), it, pt-BR (nakładka + baza pt), el, ms;
- próbka 22 wskazówek na język (te same klucze o największym ryzyku: arnold.move, dip.mis.depth, kbp.move, ohp.mis.flare, press.mis.lock, push.mis.sag, rollout.range, spush.setup, bw.setup, clam.move, gb.slSetup, lp.mis.lock, slp.setup, lpd1.blade, meadows.setup2, preacher.arms, rotator_cuff.cubanRotate, rotator_cuff.erStartCable, shrug.setupBehind, zottman.move, ck.setup, calf.seatedEdge1) dla bg, cs, sk, hr, sl, sr, da, nb, sv, fi, nl, et, hu, ro, lt, lv, pt, tr, id, vi; do tego skan automatyczny wszystkich 33 języków × 104 (słowa angielskie w tekście, apostrofy i cudzysłowy względem reszty pliku, końcowe 。 w ja/zh-Hant, kropka w ko, spacja nierozdzielająca w fr, długość względem EN);
- 5 kluczy UI × 33 języki, w tym zgodność cytowanych nazw z rzeczywistymi etykietami („Zacznij pierwszy trening”, „Pierwszy trening”, zakładka „Trening”) w danym języku.

Uwaga do zakresu: w aplikacji nie ma ar, he, th, hi ani zh-Hans (33 języki poza pl/en to: bg cs da de el es es-419 et fi fr hr hu id it ja ko lt lv ms nb nl pt pt-BR ro ru sk sl sr sv tr uk vi zh-Hant). Języki z priorytetu 2, których nie ma, pominięto; zh-Hant przejrzany w całości.

Kluczowe sprawdzenia merytoryczne (wszystkie języki, klucze ryzykowne): press.mis.lock ma we wszystkich 33 językach „gwałtownie / z szarpnięciem” (wyjątek lv — niżej); lp.mis.lock — przeprost / hiperekstensja wszędzie; łopatki „w dół i do tyłu” w tej kolejności wszędzie; ru/uk „таз” dla bioder, „бёдра/стегна” dla ud (zgodnie ze słownikiem), el „ισχία”; nachwyt/podchwyt w zottman.move i shrug.setupBehind nigdzie nie są odwrócone (uk „зворотний хват” = podchwyt, tak samo jak w 6 wcześniejszych wskazówkach uk); kierunek ruchu, strona ciała i sprzęt bez odwróceń. Błędów zmieniających technikę nie znalazłem.

## Priorytet 1 — ręczne poprawki tłumacza (werdykty)

| Język | Co | Werdykt | Uzasadnienie |
|---|---|---|---|
| ja | 25 zdań `*.mis.*` na „こと。” | zostaje | W pliku jest 87 zdań na „こと。” (62 starsze); naturalna forma listy błędów; wszystkie nowe zdania kończą się na 。 |
| pt-BR | 9 wskazówek bez enklizy | zostaje (1 drobna sugestia) | Enklizę blokuje test `tests/i18n-variants.test.ts:106`. Sześć zdań przepisano przez powtórzenie rzeczownika („desça o halter”, „segure a barra”) i brzmią normalnie. Trzy zostały z zaimkiem („puxe ela”, „mantenha ele”, „segure eles”). W pliku są już takie formy: `csr.chest` „mantenha ele ali”, `fp.elbowsBack` „leve eles para trás”, więc rejestr jest spójny i przy kryterium „trener na siłowni” nie razi. Jedyna sugestia (NISKIE): gb.slSetup — „puxe ela” zamienić na „leve o joelho ao peito” (to bliżej EN „pull that knee” i jaśniejsze) |
| ms | „pergerakan” | zostaje | W pliku ms jest 34 razy „pergerakan” i ani razu samo „gerakan”, więc jest spójnie |
| ko | cudzysłowy ‘…’ | zostaje | W lib/locales/ko.json jest 115 razy ‘…’ i 0 innych, więc jest spójnie |
| el | „την μπάρα” | zostaje | Poprawne (końcowe -ν zostaje przed μπ); 76 wystąpień w pliku, jednolicie |

## Tabela poprawek

| Język | Klucz | Obecne | Proponowane | Waga | Powód |
|---|---|---|---|---|---|
| vi | preacher.arms | Hãy tì upper arm lên đệm ghế preacher và giữ yên trong suốt chuyển động. | Hãy tì cánh tay trên lên đệm ghế preacher và giữ yên trong suốt chuyển động. | BLOKUJĄCE | Zostało angielskie „upper arm” (przeniesione z placeholdera w słowniku `ramie`.vi). W pliku vi 16 razy „cánh tay trên” |
| vi | rotator_cuff.cubanRotate | Xoay cẳng tay lên mà không hạ khuỷu tay; upper arm giữ ngang. | Xoay cẳng tay lên mà không hạ khuỷu tay; cánh tay trên giữ ngang. | BLOKUJĄCE | jw. |
| de | kbp.move | Drück die kettlebell gerade über den Kopf; … | Drück die Kettlebell gerade über den Kopf; senk sie zurück zur Schulter und zieh dabei den Ellbogen zu den Rippen. | BLOKUJĄCE | Rzeczownik małą literą to rażący błąd w niemieckim; w pliku 14 razy „Kettlebell”. Prawdopodobna przyczyna: słownik `kettlebell`.de = „kettlebell” małą literą |
| de | dip.mis.depth | Zu tief runtergehen oder zu früh oben stoppen. | Zu tief runtergehen oder zu weit oben stoppen. | ŚREDNIE | „zu früh” = za wcześnie (czas), a chodzi o zatrzymanie za wysoko (zakres ruchu) |
| el | lpd.mis.lean | Ταλάντευση και γείρσιμο προς τα πίσω για να κατεβάσεις το βάρος. | Ταλάντευση και γέρσιμο προς τα πίσω για να κατεβάσεις το βάρος. | ŚREDNIE | Ortografia: „γέρσιμο” (od γέρνω); w tej samej partii są 3 razy „Γέρσιμο” i 3 razy „γέρσιμο” |
| el | scrow.mis.lean | Γείρσιμο του κορμού πίσω ή μπροστά για να τραβήξεις το βάρος. | Γέρσιμο του κορμού πίσω ή μπροστά για να τραβήξεις το βάρος. | ŚREDNIE | jw. |
| fi | meadows.setup2 | Seiso sivuttain tankoon nähden pienessä haara-asennossa, … | Seiso sivuttain tankoon nähden pienessä käyntiasennossa, taivuta lantiosta ja tartu tangon päähän myötäotteella; nojaa toisella kyynärvarrella etummaisen jalan reiteen. | ŚREDNIE | „haara-asento” to rozkrok na boki, a w ćwiczeniu jest lekki wykrok (stopy przód–tył) i zdanie dalej mówi o „nodze z przodu”. Pewność średnia: do sprawdzenia przez native speakera |
| lv | press.mis.lock | Strauja elkoņu iztaisnošana līdz galam kustības beigās. | Strauja elkoņu nobloķēšana kustības beigās. | ŚREDNIE | Obecne znaczy „gwałtowne prostowanie łokci do końca”, czyli sens, który słownik `gwaltowne_blokowanie_lokci` wyklucza (pełny wyprost to cel ruchu). Chodzi o zatrzaskiwanie łokci |
| ro | band.ohpSetup | Urcă pe bandă, prinde-i capetele … | Calcă pe bandă, prinde-i capetele și ridică mâinile în dreptul umerilor, cu coatele îndoite. | ŚREDNIE | „Urcă pe bandă” znaczy „wejdź na taśmę” i kojarzy się z bieżnią („bandă de alergare”); „calcă” = nadepnij. Pewność średnia |
| zh-Hant | UI: Nowe rysunki ruchu w ćwiczeniach na triceps… | 新增三頭肌動作，以及上膊、抓舉與其變化式的動作示意圖。 | 三頭肌動作以及上膊、抓舉與其變化式新增了動作示意圖。 | ŚREDNIE | Obecne czyta się jak „dodano ćwiczenia na triceps”, a nowe są tylko rysunki. To zmienia sens punktu „Co nowego” |
| bg | UI: Nowa osoba zaczyna… | … с бутона „Започнете първата си тренировка“ … | Новият потребител започва от екрана „Тренировка“ с бутона „Започване на първа тренировка“ и таблото „Първа тренировка“. | ŚREDNIE | Nazwa przycisku nie zgadza się z etykietą w aplikacji („Започване на първа тренировка”) |
| de | UI: Nowa osoba zaczyna… | … mit dem Button „Erstes Training starten“ … | Neue Nutzer starten auf dem Bildschirm „Training“ mit dem Button „Starte dein erstes Training“ und der Karte „Erstes Training“. | ŚREDNIE | Etykieta przycisku w aplikacji to „Starte dein erstes Training” |
| es | UI: Nowa osoba zaczyna… | … con el botón «Empezar tu primer entreno» … | Un usuario nuevo empieza en la pantalla Entreno con el botón «Empieza tu primer entreno» y el panel «Primer entreno». | ŚREDNIE | Etykieta w aplikacji to „Empieza tu primer entreno” |
| it | UI: Nowa osoba zaczyna… | … con il pulsante “Inizia il primo allenamento” e il riquadro “Primo allenamento”. | Chi è nuovo parte dalla schermata Allenamento con il pulsante «Inizia il tuo primo allenamento» e il riquadro «Primo allenamento». | ŚREDNIE | Etykieta w aplikacji to „Inizia il tuo primo allenamento”; przy okazji cudzysłowy «» jak w reszcie it (51 do 13) |
| tr | UI: Nowa osoba zaczyna… | … “İlk antrenmana başla” düğmesi … | Yeni kullanıcılar Antrenman ekranında “İlk antrenmanınıza başlayın” düğmesi ve “İlk antrenman” panosuyla başlar. | ŚREDNIE | Etykieta w aplikacji to „İlk antrenmanınıza başlayın” (forma siz) |
| ko | 12 × `*.mis.*` z A1 (dip.mis.depth, dip.mis.leanBack, dip.mis.overLean, fly.mis.elbows, ohp.mis.arch, ohp.mis.flare, ohp.mis.sideLean, press.mis.lock, push.mis.flare, push.mis.sag, renegade.mis.twist, rollout.mis.arch) | np. „너무 깊이 내려가거나 너무 높은 곳에서 멈추기” (bez kropki) | dodać końcową kropkę (gotowe teksty w JSON, sekcja „mechaniczne”) | NISKIE | Wszystkie 51 starszych błędów w ko kończą się kropką. Forma „~기” może zostać, bo w pliku są już takie zdania (np. ohp.mis.lock „…잠그기.”) |
| it | 12 kluczy A3 (lpd.mis.lean, lpd.vbarSetup, meadows.pull, meadows.setup2, mrow.setup, rotator_cuff.cableSetup, rotator_cuff.cubanRotate, rotator_cuff.cubanRow, rotator_cuff.pullHold, rotator_cuff.pullMove, scrow.mis.lean, scrow.setup) | apostrof prosty ' | ’ | NISKIE | Reszta pliku it: 165 razy ’ i 0 razy ' |
| uk | bandcurl.move, calf.rise, calf.seatedEdge, calf.seatedEdge1, calf.stepOne, gb.slMove | п'ятою, п'яти… | п’ятою, п’яти… (’) | NISKIE | Reszta pliku uk: 46 razy ’ i 0 razy ' |
| el | cpress.seatedMove, rollout.bar.setup | φέρ' τες, πιάσ' τη | φέρ’ τες, πιάσ’ τη | NISKIE | Reszta pliku el: 21 razy ’ i 0 razy ' |
| da, es-419, et, lv, nl, sr | UI: Nowa osoba zaczyna… | cudzysłowy inne niż w pliku | cudzysłowy jak w reszcie pliku (gotowe teksty w JSON) | NISKIE | da “” (56 do 8), es-419 «» (28 do 1), et „“ (77 do 1), lv “” (61 do 15), nl ‘’ (57 do 14), sr „” (60 do 18) |
| pt-BR | gb.slSetup | … estenda a outra perna ou puxe ela em direção ao peito. | Deite-se de costas, com um joelho dobrado e o pé apoiado no chão; estenda a outra perna ou leve o joelho em direção ao peito. | NISKIE | Jaśniejsze (kolano, jak EN), bez zaimka; reszta zaimków zostaje (patrz Priorytet 1) |
| da / nb / sv | lp.mis.lock | Låser knæet… / Låser kneet… / Låser knät… | At låse knæet i overstrækning i toppen. / Å låse kneet i overstrekk på toppen. / Att låsa knät i översträckning i toppen. | NISKIE | Pozostałe błędy w tej partii mają formę „At/Å/Att + bezokolicznik” |
| nb | ohp.mis.flare | Albuene glipper ut til sidene… | Albuene går ut til sidene i stedet for å peke fremover. | NISKIE | „glippe” = wyślizgnąć się; nienaturalne |
| sv | spush.setup | … med kroppen rak och snett. | … med kroppen rak och lutad. | NISKIE | Składnia |
| fi | dip.mis.depth | … tai pysähtyminen liian ylös. | Liian syvälle laskeutuminen tai pysähtyminen liian ylhäällä. | NISKIE | Forma przysłówka |
| et | gb.slSetup | … või tõmba see põlvega rinna poole. | … või tõmba põlv rinna poole. | NISKIE | Niezręczne „ciągnij ją kolanem” |
| tr | rollout.range | … gidebildiğiniz kadar öne açılın. | Belinizi kavislendirmeden ancak gidebildiğiniz kadar öne yuvarlanın. | NISKIE | „öne açılın” jest niejasne. Pewność: do sprawdzenia przez native speakera |
| it | push.mis.sag / renegade.mis.twist | fianchi | bacino („Il bacino cede e il corpo non è più in linea.”; „Ruotare bacino e busto per tirare su il manubrio.”) | NISKIE | W A2 tej partii jest „anche/bacino”. „fianchi” jest potocznie poprawne, ale w deskach mówi się „bacino” |
| el | zottman.move | … με υπτία λαβή … | … με ανάποδη λαβή … | NISKIE | W pliku el podchwyt to 5 razy „ανάποδη λαβή”, a „υπτία” występuje tylko tu |
| zh-Hant | calf.seatedEdge1 | 坐好、膝蓋彎曲，前腳掌踩在墊高處… (identyczne z calf.seatedEdge) | 坐好、單腳膝蓋彎曲，前腳掌踩在墊高處，腳跟懸空在邊緣外。 | NISKIE | Wariant jednonóż nie różni się od obunóż; karta i tak to mówi |
| uk | UI: Nowe i dopracowane wskazówki… | … зокрема для дельт … | … зокрема для плечей … | NISKIE | „дельти” to slang; w ru jest „плеч”; „barki” w innych tekstach uk |
| id | UI: Nowe rysunki ruchu… | Gambar gerakan baru untuk gerakan triceps … | Gambar gerakan baru untuk latihan triceps serta clean, snatch, dan variasinya. | NISKIE | Powtórzone „gerakan” |
| de | dip.move | … wieder hoch bis die Arme gestreckt sind. | … wieder hoch, bis die Arme gestreckt sind. | NISKIE | Przecinek |

Sprawdzone bez uwag (nie wymagają zmian): fr (spacja nierozdzielająca przed ; : we wszystkich 104, forma vous jak w reszcie pliku), es i es-419 (tekst efektywny bez „coger” i słów z Hiszpanii), ru, ja, ko (poza kropkami), ms, pt, cs, sk, hr, sl, sr, hu, lt, id oraz próbki pozostałych języków. ru „подконтрольно” jest 5 razy w starszych tekstach — zostaje (spójne).

## JSON — BLOKUJĄCE i ŚREDNIE (do mechanicznego naniesienia)

Wskazówki: `lib/cues/text/<język>.json` (klucz = id). UI: `lib/locales/<język>.json` (klucz = tekst polski).

(Kod JSON z gotowymi tekstami usunięty z kopii: poprawki BLOKUJĄCE i ŚREDNIE są już w lib/cues/text/*.json i lib/locales/*.json na gałęzi lok/przeklad-a1-a3; obowiązują teksty z tych plików.)

## JSON — NISKIE mechaniczne (typografia; opcjonalnie, ale bez ryzyka)

(Kod JSON typografii usunięty z kopii: poprawki naniesione w tych samych plikach.)

## Nowe terminy do słownika (dopisuje programista/koordynator razem z testem)

1. **ramie** — placeholdery „upper arm” (cs, sk, hu, ro, bg, hr, sl, sr, lt, lv, tr, el, id, ms, vi, ja, ko, zh-Hant) zastąpić terminami, które już są w plikach (vi „cánh tay trên” — 16 wystąpień), albo przynajmniej dopisać wzorzec zakazany `(?<![\p{L}])upper arm(?![\p{L}])` dla wszystkich języków poza en. Powód: przekład przez API wstawił placeholder dosłownie (vi, 2 zdania), a test słownika to przepuścił.
2. **chwyt** (vi, ja, ko, zh-Hant „grip” jako placeholder) — ten sam mechanizm: w vi 6 razy „grip sấp/ngửa” wpisane łacinką. Do decyzji po odpowiedzi native speakera (pytanie 2).
3. **kettlebell**.de — zalecany „Kettlebell” wielką literą (rzeczownik). Powód: de kbp.move ma „die kettlebell” małą literą.
4. **lekki wykrok / staggered stance** (meadows.setup2): fi „käyntiasento” (zakazane „haara-asento” = rozkrok na boki). Pewność średnia, do potwierdzenia.
5. **γέρσιμο** (el, „odchylanie / przechylanie”) — zakazane „γείρσιμο” (błąd pisowni).

## Pytania do native speakerów

1. tr: Czy „silkme, koparma” (punkt „Co nowego”) dobrze nazywa zarzut/podrzut i rwanie na tureckiej siłowni, czy lepiej zostawić „clean, snatch”? Czy „hafif çapraz duruş” (meadows.setup2) to lekki wykrok, czy lepiej „bir ayağınız hafif önde”?
2. vi: Na siłowni mówi się „grip sấp / grip ngửa” czy raczej „nắm sấp / nắm ngửa” (cầm sấp)?
3. pt-BR: W tekście aplikacji „segure eles” / „mantenha ele parado” brzmi jak trener, czy lepiej powtórzyć rzeczownik („segure os pegadores”)?
4. ro: Przy gumie stojąc: „calcă pe bandă” czy „urcă pe bandă” (bez skojarzenia z bieżnią)?
5. fi: Lekki wykrok przy wiosłowaniu: „pieni käyntiasento” czy „porrastettu asento”?

## Podsumowanie

Teksty przeczytane: ok. 1 960 (13 języków × 104 w całości = 1 352; 20 języków × 22 próbki = 440; UI 33 × 5 = 165), do tego skan automatyczny 33 × 104. Poprawki: 3 BLOKUJĄCE, 12 ŚREDNICH, 21 pozycji NISKICH (w tym 4 grupy typograficzne obejmujące 38 tekstów). Pytania do native speakerów: 5.
