# Z-02 — przegląd treści krytycznej po przekładzie (R-010), 26.10.2026

Stan: `origin/integracja-2026-10-26b` @ 6ea116a. Recenzent lokalizacji, nic nie edytowane. Poprawki wprowadza `tlumacz`, zmiany tekstu źródłowego (PL/EN) — `programista`.

## 1. Zakres i metoda

**Czytane ręcznie (wszystkie 34 języki + efektywne pt-BR/es-419):**
- 205 kluczy UI treści krytycznej: ekran zakupu i „Uczciwe zasady” (ceny, okresy, odnawianie, anulowanie, przywracanie, limit dni, kod, Chmura rodzinna), karta subskrypcji, import/eksport/kopia/„Wyczyść wszystkie dane”, usuwanie (sesja, ćwiczenie, plan, miejsce, szablon, seria…), Apple Health (zgody, zapis, odczyt, cofnięcie zgody), powiadomienia, timer i Live Activity („Przerwa”, „Seria”, „przerwa {s} s”, „seria {s} s”, „Następna seria.”, „Nic więcej do zrobienia…”, zapowiedzi głosowe), zdanie medyczne, 5 kluczy asekuracji, teksty zdrowotne generatora (cardio, serie, częstotliwość, progresja, deload) — w tym wszystkie 21 kluczy dodanych po 23.10.
- 76 wskazówek techniki (4 zmienione 25.10, 15 „częstych błędów”, 57 zdań z zakazem/„bez …”), 33 języki.
- InfoPlist (`locales/*.json`: nazwa + 2 opisy zgód Zdrowia) — 35 języków; `targets/rest-widget/RestLabels.swift` i `*.lproj/InfoPlist.strings` — 35 języków.

**Sprawdzone automatycznie (całość: 1761 kluczy UI × 34, 306 wskazówek × 33):** brak brakujących kluczy, wszystkie `{x}` zgodne z PL, liczba form liczby mnogiej OK (test), brak nazw organizacji (ACSM, NSCA, WHO/OMS/ВОЗ, CDC…) i nazw innych firm (jedyne trafienie „Strava” w cs/sk = „dieta”, poprawne), fr: spacje nierozdzielające OK (0 naruszeń), przyciski cytowane w zdaniach („Dalej”, „Sprawdź zgodę na powiadomienia”, „Dźwięk na koniec przerwy”, „Zastąp/Zostaw”, zakładka „Plan”) zgodne z etykietami we wszystkich językach, `{left}` w „{left} {n} z {limit}…” składa się poprawnie we wszystkich językach. Przyciski (`Btn`) zawijają tekst — brak obcięcia (najdłuższe: lt/it 52 zn. „Skąd ta cena?…”, przycisk blokowy).

Testy: `npx jest tests/slownik-terminow.test.ts tests/i18n-locales.test.ts tests/i18n-variants.test.ts tests/widget-i18n.test.ts tests/live-activity-lang.test.ts tests/przeglad-tlumaczen.test.ts tests/przeklad-tlumaczen.test.ts tests/subscription-i18n.test.ts tests/watch-apple-i18n.test.ts tests/cues.test.tsx` → 1015/1016; jedyna porażka `cues.test.tsx` przy równoległym biegu (limit czasu komponentu), osobno zielony 15/15 — niestabilność czasu, nie treść.

## 2. BLOKUJE (App Store; R-010 nie da się zamknąć) — 4 wskazówki techniki nieprzetłumaczone po zmianie 25.10

Commit 3b6a656 (25.10, „poprawki 4 wskazówek PL/EN … pozostałe języki do przeglądu tłumacza”) zmienił treść merytoryczną 4 wskazówek tylko w PL/EN. We **wszystkich 33 językach (+ nakładka `lib/cues/text/pt-BR.json`)** zostało stare twierdzenie:
- `lunge.torso`: było „Tułów wyprostowany” → jest „Plecy proste przez cały ruch.” Tłumaczenia nadal mówią „tułów pionowo/wyprostowany” (de „Oberkörper … aufrecht”, ru „корпус вертикально”, ja „上体をまっすぐ” itd.).
- `pp.dip`: usunięto „tułów pionowo” → „Ugięcie krótkie, tułów napięty.” Tłumaczenia nadal „wyprostowany/pionowy i napięty”.
- `row.bbPull`, `row.dbPull`: „do dolnej części brzucha” → „do brzucha”. Tłumaczenia nadal „dolna część brzucha / lower stomach”.

Przyczyna, dla której nikt tego nie złapał: `docs/lokalizacja/zestaw-przekladu-2026-10-26.json` mówi „nic do przekładu”, bo zestaw i strażniki śledzą tylko klucze UI (`_source.json`), a wskazówki mają stały klucz (`lunge.torso`) — zmiana treści PL/EN nie tworzy nowego klucza, więc żaden test nie widzi przestarzałego przekładu. Propozycja mechanizmu (dla programisty/koordynatora, wpis do docs/40): test, który trzyma skrót (hash) tekstu PL+EN każdej wskazówki przy przekładzie i czerwieni się, gdy PL/EN się zmieni, a przekłady nie (analogicznie dla InfoPlist).

Proponowane teksty (minimalna zmiana: usunąć „pionowo/upright” i „dolną część”; rejestr „ton trenera”):

| język | lunge.torso | pp.dip | row.bbPull | row.dbPull |
|---|---|---|---|---|
| bg | Дръж гърба изправен през цялото движение. | Кратко подклякване, торсът стегнат. | Издърпай лоста към корема, после го спусни до изпънати ръце. | Издърпай дъмбелите към корема, после ги спусни до изпънати ръце. |
| cs | Drž záda rovná po celý pohyb. | Krátký podřep, trup zpevněný. | Přitáhni činku k břichu a pak ji spusť do propnutí paží. | Přitáhni jednoručky k břichu a pak je spusť do propnutí paží. |
| da | Hold ryggen ret gennem hele bevægelsen. | Kort nedgang med overkroppen spændt. | Træk stangen mod maven, og sænk den så, til armene er strakte. | Træk håndvægtene mod maven, og sænk dem så, til armene er strakte. |
| de | Rücken die ganze Zeit gerade. | Kurz in die Knie gehen, Oberkörper angespannt. | Zieh die Stange zum Bauch und senke sie dann ab, bis die Arme gestreckt sind. | Zieh die Hanteln zum Bauch und senke sie dann ab, bis die Arme gestreckt sind. |
| el | Κράτα την πλάτη ίσια σε όλη την κίνηση. | Σύντομο λύγισμα, με τον κορμό σφιγμένο. | Τράβα την μπάρα προς την κοιλιά και μετά κατέβασέ τη ώσπου να τεντωθούν τα χέρια. | Τράβα τους αλτήρες προς την κοιλιά και μετά κατέβασέ τους ώσπου να τεντωθούν τα χέρια. |
| es (i es-419) | Mantén la espalda recta todo el tiempo. | Flexión corta, con el tronco firme. | Lleva la barra al abdomen y luego bájala hasta extender los brazos. | Lleva las mancuernas al abdomen y luego bájalas hasta extender los brazos. |
| et | Hoia selg kogu liigutuse vältel sirge. | Lühike põlvede kõverdus, kehatüvi pingul. | Tõmba kang kõhu poole, siis langeta sirgete käteni. | Tõmba hantlid kõhu poole, siis langeta sirgete käteni. |
| fi | Pidä selkä suorana koko liikkeen ajan. | Lyhyt notkistus, vartalo jännitettynä. | Vedä tanko kohti vatsaa ja laske se sitten, kunnes kädet ovat suorat. | Vedä käsipainot kohti vatsaa ja laske ne sitten, kunnes kädet ovat suorat. |
| fr | Gardez le dos droit pendant tout le mouvement. | Flexion courte, buste gainé. | Tirez la barre vers le ventre, puis redescendez-la jusqu’à tendre les bras. | Tirez les haltères vers le ventre, puis redescendez-les jusqu’à tendre les bras. |
| hr | Drži leđa ravna tijekom cijelog pokreta. | Kratko savijanje koljena, trup učvršćen. | Povuci šipku prema trbuhu, a zatim je spusti do ispruženih ruku. | Povuci bučice prema trbuhu, a zatim ih spusti do ispruženih ruku. |
| hu | Tartsd a hátad végig egyenesen. | Rövid térdhajlítás, feszes törzs. | Húzd a rudat a hasadhoz, majd engedd le nyújtott karig. | Húzd a kézisúlyzókat a hasadhoz, majd engedd le nyújtott karig. |
| id | Jaga punggung tetap lurus sepanjang gerakan. | Tekuk lutut sebentar saja, dengan badan kencang. | Tarik batang ke perut, lalu turunkan hingga lengan lurus. | Tarik dumbel ke perut, lalu turunkan hingga lengan lurus. |
| it | Tieni la schiena dritta per tutto il movimento. | Piegamento breve, busto contratto. | Tira il bilanciere verso l’addome, poi abbassalo fino a distendere le braccia. | Tira i manubri verso l’addome, poi abbassali fino a distendere le braccia. |
| ja | 動作中ずっと背中をまっすぐに保ちます。 | 沈み込みは浅く、上体は固めたままにします。 | バーをお腹まで引き、腕が伸びるまで下ろします。 | ダンベルをお腹まで引き、腕が伸びるまで下ろします。 |
| ko | 동작 내내 등을 곧게 유지하세요. | 살짝만 앉고, 몸통은 단단하게 유지하세요. | 바를 배까지 당긴 뒤, 팔이 펴질 때까지 내리세요. | 덤벨을 배까지 당긴 뒤, 팔이 펴질 때까지 내리세요. |
| lt | Viso judesio metu laikyk nugarą tiesią. | Trumpas pritūpimas, liemuo įtemptas. | Pritrauk štangą prie pilvo, tada nuleisk iki ištiestų rankų. | Pritrauk hantelius prie pilvo, tada nuleisk iki ištiestų rankų. |
| lv | Visu kustību turi muguru taisnu. | Īss pietupiens, rumpis sasprindzināts. | Pievelc stieni pie vēdera, tad nolaid līdz iztaisnotām rokām. | Pievelc hanteles pie vēdera, tad nolaid līdz iztaisnotām rokām. |
| ms | Kekalkan belakang lurus sepanjang pergerakan. | Bengkokkan lutut sekejap sahaja, dengan badan diketatkan. | Tarik bar ke perut, kemudian turunkan hingga lengan lurus. | Tarik dumbel ke perut, kemudian turunkan hingga lengan lurus. |
| nb | Hold ryggen rett gjennom hele bevegelsen. | Kort nedgang med overkroppen spent. | Trekk stangen mot magen, og senk den så til armene er strake. | Trekk manualene mot magen, og senk dem så til armene er strake. |
| nl | Houd je rug de hele beweging recht. | Houd de dip kort, met je romp aangespannen. | Trek de stang naar je buik en laat hem dan zakken tot je armen gestrekt zijn. | Trek de dumbbells naar je buik en laat ze dan zakken tot je armen gestrekt zijn. |
| pt | Mantém as costas direitas durante todo o movimento. | Flexão curta, com o tronco firme. | Puxa a barra até à barriga e depois baixa-a até esticar os braços. | Puxa os halteres até à barriga e depois baixa-os até esticar os braços. |
| pt-BR (nakładka) | Mantenha as costas retas durante todo o movimento. | Flexão curta das pernas, com o tronco firme. | Puxe a barra até a barriga e depois desça até estender os braços. | Puxe os halteres até a barriga e depois desça até estender os braços. |
| ro | Ține spatele drept pe toată mișcarea. | O îndoire scurtă a genunchilor, trunchiul încordat. | Trage bara spre abdomen, apoi coboar-o până la brațe întinse. | Trage ganterele spre abdomen, apoi coboară-le până la brațe întinse. |
| ru | Держи спину прямой всё время. | Подсед короткий, корпус напряжённый. | Тяни гриф к животу, затем опускай до прямых рук. | Тяни гантели к животу, затем опускай до прямых рук. |
| sk | Drž chrbát rovný počas celého pohybu. | Krátky podrep, trup spevnený. | Pritiahni činku k bruchu a potom ju spusti do vystretia rúk. | Pritiahni jednoručky k bruchu a potom ich spusti do vystretia rúk. |
| sl | Hrbet ves gib drži raven. | Kratek počep, trup napet. | Drog potegni proti trebuhu, nato ga spusti do iztegnjenih rok. | Ročki potegni proti trebuhu, nato ju spusti do iztegnjenih rok. |
| sr | Држи леђа права током целог покрета. | Кратко савијање колена, труп учвршћен. | Повуци шипку према стомаку, а затим је спусти до опружених руку. | Повуци бучице према стомаку, а затим их спусти до опружених руку. |
| sv | Håll ryggen rak genom hela rörelsen. | Kort nedgång, med bålen spänd. | Dra stången mot magen och sänk den sedan tills armarna är raka. | Dra hantlarna mot magen och sänk dem sedan tills armarna är raka. |
| tr | Hareket boyunca sırtınızı düz tutun. | Kısa bir çöküş, gövde sıkı. | Halteri karnınıza doğru çekin, sonra kollar düzelene kadar indirin. | Dambılları karnınıza doğru çekin, sonra kollar düzelene kadar indirin. |
| uk | Тримай спину рівною впродовж усього руху. | Короткий підсід, корпус напружений. | Підтягни штангу до живота, потім опусти до прямих рук. | Підтягни гантелі до живота, потім опусти до прямих рук. |
| vi | Giữ lưng thẳng suốt động tác. | Nhún ngắn, thân người siết chặt. | Kéo đòn về phía bụng, sau đó hạ xuống đến khi tay thẳng. | Kéo tạ đơn về phía bụng, sau đó hạ xuống đến khi tay thẳng. |
| zh-Hant | 整個動作背部保持打直。 | 下蹲幅度要小，軀幹保持收緊。 | 把槓拉到腹部，再放到手臂伸直。 | 把啞鈴拉到腹部，再放到手臂伸直。 |

Pewność: wysoka co do sensu (zmiana ograniczona do usuniętego fragmentu; słownictwo z istniejących wskazówek `hinge.back`, `rt.back`); brzmienie bez recenzji native speakera jak reszta wskazówek. Waga: **blokuje wydanie w App Store** (twierdzenie techniki inne niż w źródle, w 33 językach); TestFlight — nie blokuje.

## 3. NIE blokuje — poprawki (backlog 1.0.x albo razem z poprawką z pkt 2)

Klucz podany po polsku (skrót).

| język | klucz (PL) | jest | powinno być | powód | pewność |
|---|---|---|---|---|---|
| es-419 | „Pierwszy trening za Tobą!” (okno Uczciwe zasady, nowy) | ¡Primer entreno completado! (dziedziczone z es) | ¡Primer entrenamiento completado! | (c) „entreno” zakazane w es-419 (docs/16) | wysoka |
| es-419 | „Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.” (paywall) | …desde una copia de seguridad. | …desde un respaldo. | (c) es-419 = „respaldo” (docs/16, Apple es-MX) | wysoka |
| es-419 | „Dopisuje treningi z plików CSV popularnych dzienników…” (2 klucze: z podglądem / „ani nie usuwa”) | Añade entrenamientos… | Agrega entrenamientos… | (c) reszta es-419 używa „Agrega” | wysoka |
| es-419 | InfoPlist `NSHealthShareUsageDescription` | …no los envía a ningún sitio… | …no los envía a ningún lado… | (c) „sitio” w tym znaczeniu jest hiszpańskie | średnia |
| pt-BR | „Plik jest za duży. Dane nie zostały zmienione.” | O arquivo é demasiado grande. | O arquivo é grande demais. | (c) „demasiado” = pt-PT | wysoka |
| pt-BR | „Zegarek zapisuje zakończony trening siłowy… w Apple Health.” | O relógio guarda no Apple Health… | O relógio salva no Apple Health… | (c) Brazylia „salvar” (reszta pt-BR) | wysoka |
| ko | „Jesteśmy z Ciebie dumni!” (paywall po limicie) | 저희는 정말 자랑스럽습니다! | 정말 자랑스러워요! (albo 회원님이 정말 자랑스러워요!) | (f) brak „z Ciebie” — brzmi „jesteśmy (z siebie) dumni” | do sprawdzenia przez native speakera |
| ko | „Cały rok treningów, rozliczany rocznie.” | 1년 내내 운동하는 연간 결제입니다. | 1년 동안 운동하고, 1년 단위로 결제합니다. | (b) zdanie sztuczne | średnia |
| el | „Twoja subskrypcja nadal się odnawia — anuluj ją, żeby nie płacić podwójnie.” | …ακυρώστε την για να μην πληρώσεις διπλά. | …ακυρώστε την για να μην πληρώσετε διπλά. | (b) mieszany rejestr w jednym zdaniu | wysoka |
| el | „Subskrypcja odnawia się automatycznie, dopóki jej nie anulujesz…” | …μέχρι να την ακυρώσεις στις ρυθμίσεις του λογαριασμού σας Apple. | …μέχρι να την ακυρώσετε… | (b) jw. (ujawnienie 3.1.2) | wysoka |
| el | „Trening z zegarka w Apple Health zostanie — usuniesz go…” / „Kopia w Apple Health zostanie…” | διάγραψέ την / διάγραψέ το | διαγράψτε την / διαγράψτε το | (b) rejestr „σας” jak reszta ekranów | wysoka |
| el | „Brak głosu dla języka aplikacji…” / „Brak zgody na zapis treningów…” | Κατέβασέ την… / Ενεργοποίησέ τη… | Κατεβάστε την… / Ενεργοποιήστε τη… | (b) jw. | wysoka |
| el | „Trening z {d} {s} nie miał aktywności od 6 godzin…” / „Zastąpić wpisane ciężary?” | Θα τη βρεις… / …που έβαλες; | Θα τη βρείτε… / …που βάλατε; | (b) jw. | wysoka |
| el | InfoPlist `NSHealthShareUsageDescription` / `Update` | (και από το ρολόι σου) … στο πρόγραμμά σου / το ρολόι σου | …σας | (b) okno zgody iOS w innym rejestrze niż aplikacja | wysoka |
| lt | „Twoja subskrypcja nadal się odnawia…” | …kad nemokėtum dukart. | …kad nemokėtumėte dukart. | (b) mieszany rejestr | wysoka |
| lt | „Subskrypcja odnawia się automatycznie, dopóki jej nie anulujesz…” | …kol jos neatšauksi… | …kol jos neatšauksite… | (b) jw. | wysoka |
| lt | „Zakupy są przypisane do konta Apple. Treningi przywrócisz z kopii zapasowej.” | Treniruotes atkursi… | Treniruotes atkursite… | (b) jw. | wysoka |
| lt | „Siła bez obciążenia zewnętrznego…” / „Dopisuje treningi… Przed zapisem zobaczysz podgląd.” | …nepadarysi… / …pamatysi peržiūrą. | …nepadarysite… / …pamatysite peržiūrą. | (b) jw. (skan: ok. 10 dalszych kluczy UI z formą „tu” w lt — do przejrzenia przez tlumacza) | wysoka |
| lv | „Zakupy są przypisane do konta Apple…” | Treniņus atjaunosi… | Treniņus atjaunosiet… | (b) mieszany rejestr | wysoka |
| cs | „Masz dostęp na zawsze” / „Masz pełną wersję” | Máš přístup navždy / Máš plnou verzi | Máte přístup navždy / Máte plnou verzi | (b) ekran zakupu: reszta „vy” | wysoka |
| cs | „Trening z Twojego planu tygodnia. Otwórz aplikację, by zacząć.” (powiadomienie) | …Otevřete aplikaci a začni. | …Otevřete aplikaci a začněte. | (b) dwa rejestry w jednym zdaniu | wysoka |
| cs | „rozgrzewka” (zapowiedź głosowa serii, lib/live.ts) | zahřívací | zahřívací série | (b) sam przymiotnik czytany głosem | średnia |
| sk | „Masz dostęp na zawsze” / „Masz pełną wersję” | Máš prístup navždy / Máš plnú verziu | Máte prístup navždy / Máte plnú verziu | (b) jw. | wysoka |
| sk | „Twoja subskrypcja nadal się odnawia…” | …aby sa nezaplatilo dvakrát. | …aby ste neplatili dvakrát. | (b) bezosobowe, nienaturalne | średnia |
| tr | „Plik jest pusty / za duży / nie zawiera… / To nie wygląda na obsługiwany plik CSV… Dane nie zostały zmienione.” (4 klucze) | Verilerin değiştirilmedi. | Verileriniz değiştirilmedi. | (b) rejestr „siz” (docs/16) | wysoka |
| tr | „Nie ma nowych treningów do dodania — wszystkie są już w historii.” / „Plik nie podaje godzin…” | …hepsi zaten geçmişinde. / …zaten antrenmanın olduğu… | …geçmişinizde. / …zaten antrenmanınızın olduğu… | (b) jw. | wysoka |
| id | 4 komunikaty importu „Dane nie zostały zmienione.” | Datamu tidak diubah. | Data Anda tidak diubah. | (b) rejestr „Anda” (docs/16) | wysoka |
| id | „Dopisuje treningi z plików CSV…” (2 klucze), „Nie ma nowych treningów…”, „Ćwiczenia dopasowane do Twoich: {n}”, „Kreska = cel serii…” | datamu / Kamu akan / riwayatmu / milikmu | data Anda / Anda akan / riwayat Anda / milik Anda | (b) jw. (skan: 12 kluczy) | wysoka |
| sr | 4 komunikaty importu „Dane nie zostały zmienione.” | Твоји подаци нису промењени. | Ваши подаци нису промењени. | (b) rejestr formalny | wysoka |
| sr | „Nie ma nowych treningów…” / „Ćwiczenia dopasowane do Twoich: {n}” | …у твојој историји / …са твојим | …у вашој историји / …са вашим | (b) jw. | wysoka |
| hu | „Nie ma nowych treningów do dodania…” | …az előzményeidben. | …az előzményeiben. | (b) rejestr „Ön” | wysoka |
| uk | „Ćwiczenie ma co najmniej jedną serię… przesuń w lewo jego nazwę.” | …проведи її назву ліворуч. | …проведіть її назву ліворуч. | (b) rejestr formalny | wysoka |
| pt | jw. | …desliza o nome… | …deslize o nome… | (b) pt-PT formalnie | wysoka |
| ro | „Miejsca głównego nie usuniesz — najpierw ustaw inne miejsce jako główne.” | …mai întâi setează alta ca principală. | …mai întâi setați alta ca principală. | (b) rejestr formalny | wysoka |
| zh-Hant | „seria {s} s” (podpis stopera serii, Live Activity) | 每組 {s} 秒 | 本組 {s} 秒 | (f) „每組” = „każda seria” | do sprawdzenia przez native speakera |
| da, sv, nb | „Cardio w planie: {n} min tygodniowo.” | Cardio i planen… | Kondition i planen… (jak nowy klucz z zaleceniem zdrowotnym) | (a) dwa terminy obok siebie na tym samym ekranie | średnia (patrz pytanie 6) |
| uk | „Backup z nowszej wersji aplikacji”, „Dane z nowszej wersji aplikacji”, teksty Zdrowia („w programі «Здоров’я»”) | програма / програми | застосунок / застосунку (jak opis zgody Zdrowia i reszta UI) | (a) dwa słowa na „aplikacja” | średnia |
| ja | „W trybie cichym telefon tylko wibruje” vs opis zapowiedzi | サイレントモード / 消音モード | jeden termin (iOS ja: 消音モード) | (a) | średnia |
| da / de / nb | „Progresja: gdy zrobisz górę zakresu powtórzeń…”, „Zakresy powtórzeń…” | gent.-interval / Wdh.-Bereichs / rep.-området | gentagelsesinterval / Wiederholungsbereichs / repetisjonsområdet | (b) skróty w pełnym zdaniu pomocy | średnia |
| ja | ok. 159 tekstów UI, m.in. „{p} zastąpi ciężary…”, „Import zastąpi wszystkie obecne dane…”, „Usuń sesję: {name}” | „: ” (półszerokość), „？ ” ze spacją | jednolicie „：” i bez spacji po „？” | (d) typografia; zbiorczo | do sprawdzenia przez native speakera |

Poprawki tekstu źródłowego (PL/EN → potem przekład; programista):
- „Trenuj {n} dni w miesiącu za darmo. … Anulujesz w ustawieniach **Apple ID**…” i „…instalacją z innego **Apple ID**…”: Apple od iOS 18 mówi „konto Apple / Apple Account”; dwa inne teksty ekranu zakupu już mówią „konto Apple”. Propozycja: „…w ustawieniach konta Apple…” (EN „Apple Account”). Nie blokuje.
- „Dane w telefonie zapisała nowsza wersja … zainstaluj najnowszą wersję **(TestFlight)**…” (`app/_layout.tsx:60`): w wersji z App Store odsyła do TestFlight. Propozycja: „…zainstaluj najnowszą wersję z App Store…”. Brzegowe (tylko po instalacji starszej wersji na nowszych danych); nie blokuje, tanie.
- „…nie miał aktywności od **6** godzin…” (`app/_layout.tsx:40`): liczba wpisana w tekst, a próg to `STALE_AUTO_MS` (`lib/state/finish.ts:17`) — zasada „liczby w jednym miejscu”: przekazać `{h}` z parametru. Nie blokuje (dziś zgodne).

## 4. Co jest w porządku (bez poprawek)

- Zdanie medyczne we wszystkich 34 językach: wierne, bez złagodzenia/wzmocnienia, rejestr z docs/16.
- 5 kluczy asekuracji i „Asekuracja”: sens zachowany (sztanga na tułowiu/nad głową i twarzą; hantle nad głową lub twarzą; ramiona asekuracyjne + osoba).
- Zakupy: ceny wyłącznie przez `{price}`/`{period}`, brak liczb w opisach planów, ujawnienie odnawiania i anulowania obecne i wierne we wszystkich językach; „Przywróć zakupy”, „Zrealizuj kod”, Chmura rodzinna — nazwy Apple w lokalnych formach.
- Utrata danych: „Import zastąpi wszystkie obecne dane…”, „Wyczyść wszystkie dane”, „Trening w toku też zostanie usunięty”, „Kopie automatyczne znikają razem z aplikacją”, „Dane nie zostały zmienione” — sens wierny wszędzie (z uwagami o rejestrze wyżej).
- Live Activity (zmiana 26.10): `RestLabels.swift` zgodny ze słownikami we wszystkich 35 językach (w tym pt-BR, es-419, zh-Hant), nazwy widżetu w `*.lproj` poprawne; podpisy „przerwa {s} s”, „seria {n} z {all}”, powiadomienia „Przerwa minęła”, „Następna seria.” wierne.
- Opisy zgód Zdrowia (InfoPlist): sens wierny we wszystkich 35 językach (odczyt, zapis, dane zostają w telefonie, nie w kopii, usuwanie własnej kopii przy zapisie z zegarka).
- 72 przeczytane wskazówki bezpieczeństwa/„częste błędy”: brak odwróconego sensu, zakazy zachowane, brak opisu błędu zapisanego jako polecenie.

## 5. Nowe terminy do dopisania do słownika (`docs/lokalizacja/slownik-terminow.json`, z testem)

1. **cardio** (pojęcie „cardio / trening wytrzymałościowy”): da/nb/sv dziś mieszają „Cardio” i „Kondition/Kondisjon” na tym samym ekranie, fi „Cardio/Kardio/kestävyysliikunta”, el „Cardio/Καρδιο”. Powód: ten sam termin w całej aplikacji (zalecany po odpowiedzi na pytanie 6).
2. **aplikacja** (słowo „aplikacja” w zdaniach): uk „застосунок” (zakazane „програма” w znaczeniu aplikacji), lt „programėlė” vs „programa” (oba występują). Powód: spójność, iOS uk/lt.
3. **tryb cichy** (iOS): ja „消音モード” (jedna forma). Powód: dwa terminy obok siebie w Ustawieniach.
4. **rejestr ekranów** (nie termin, ale strażnik): wzorce form „ty” w językach z rejestrem formalnym na ekranach (cs „máš/jsi”, sk „máš/si”, id „-mu/kamu”, sr „твој”, tr „-in değiştirilmedi”, el „σου/-έ το”, lt „-si/-tum”), wyłączając `lib/cues` („ton trenera”). Powód: ok. 40 tekstów UI z mieszanym rejestrem, w tym ekran zakupu; dziś żaden test tego nie łapie (przegląd API pomija „ty” tylko we wskazówkach).

## 6. Pytania do native speakerów

1. **ko** „Jesteśmy z Ciebie dumni!”: czy „저희는 정말 자랑스럽습니다!” brzmi jak „jesteśmy dumni (z siebie)” — lepiej „정말 자랑스러워요!” czy „정말 잘하셨어요!”?
2. **zh-Hant** podpis stopera serii na ekranie blokady: „本組 {s} 秒” czy „這組 {s} 秒”?
3. **el**: czy aplikacja po grecku ma mówić formalnie („σας”, „Πατήστε”) wszędzie, także w oknie zgody Zdrowia — tak jak iOS po grecku — czy dopuszczalne jest „εσύ”?
4. **ja**: w etykietach typu „今日: {name}” dwukropek półszerokości „:” czy pełnej szerokości „：”?
5. **tr**: w tekstach o Zdrowiu „Apple Sağlık” (dziś) czy „Sağlık uygulaması” / „Apple Health”?
6. **da/nb/sv**: na siłowni mówi się „cardio” czy „kondition/kondisjon” — który termin ma być w całej aplikacji?
7. **sl**: pytania potwierdzające w 1. osobie („Izbrišem ta trening iz zgodovine?”, „Prepišem podatke?”) czy jak iOS („Želite izbrisati …?”)?
8. **cs**: zapowiedź głosowa serii rozgrzewkowej — „zahřívací série” czy „rozcvička”?

(Otwarte z poprzedniej recenzji bez zmian: „do upadku” w lt/et/fi/tr/el/ro — pewność „niska” w słowniku; lista w docs/16, „Przegląd lokalizacji 71 kluczy”.)

## 7. Podsumowanie

Przeczytane ręcznie ok. 9 700 tekstów (205 kluczy UI × 34, 76 wskazówek × 33, InfoPlist i Live Activity × 35), automatycznie całość (≈ 70 000 tekstów); poprawek: 132 blokujących (4 wskazówki × 33 języki) + 41 pozycji nieblokujących (≈ 70 tekstów) + 3 zmiany tekstu źródłowego; pytań do native speakerów: 8.
