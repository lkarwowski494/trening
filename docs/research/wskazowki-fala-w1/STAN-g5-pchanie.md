# STAN — G5 „pchanie”, fala W1 (koordynator grupy, 02.11.2026)

Zakres: tylko zbieranie danych (polecenie właściciela 02.11.2026). Bez zmian w kodzie, `data/zrodla/*.json`, `lib/**` i testach.
Gałąź `badania/g5-pchanie` od `integracja-1-1` (15abc58). Integruje koordynator linii 1.1.
Szczeble źródeł: rozstrzygnięcie koordynatora linii 1.1 z 02.11.2026 (szczebel 4 = organizacja szkoląca trenerów / serwis z redakcją i recenzją
ekspercką / producent dla własnego rodzaju sprzętu; autor+data albo treść firmowana; bez marketingu). Wszystkie pliki wskazówek przeszły
korektę wg tego rozstrzygnięcia (sekcje „Korekta szczebli (02.11.2026)”; overhead_press cz. 1 — korekta w `overhead_press-cz1b.md`).

## Punkt wyjścia (zrzut z `assignAll()`, `LIB`, `cue-sets.json`, `data/zrodla/cues.json`, `muscleRoleRows`)
117 ćwiczeń w 7 rodzinach; bez własnych wskazówek: 94; z luką roli mięśnia: 27 ćwiczeń (20 par rodzina–wzorzec–mięsień).

## Wynik — wskazówki (stan PO korekcie szczebli)
„gotowe” = min. 1 ustawienie + 1 ruch + 1 błąd, każde zdanie ≥ 2 niezależne źródła szczebla 4; „częściowe” = ustawienie i ruch bez błędu
(w JSON tylko z dopiskiem — decyzja przy scalaniu, czy karty częściowe idą do aplikacji); reszta „otwarte” z powodem w plikach.

| Rodzina | Bez wskazówek | Gotowe | Częściowe | Otwarte | Pliki |
|---|---|---|---|---|---|
| bench_press | 25 | 6 (Decline BP, Smith Bench, Smith Incline, JM Press, Bench Press with Chains, One Arm DB Bench) + Squeeze Press warunkowo | 0 | 18–19 | bench_press-cz1.md, -cz1b.md, -cz2.md |
| pushup_plank | 23 | 2 (Ab Wheel, Rollout (sztanga)) | 1 (Renegade Row) | 20 | pushup_plank-cz1.md, -cz2.md |
| overhead_press | 18 | 5 (Arnold, Seated Barbell Military, Kettlebell Press, Band Shoulder Press, Standing Barbell Press Behind Neck) | 1 (Landmine Press) | 12 | overhead_press-cz1.md, -cz1b.md, -cz2.md |
| chest_fly | 18 | 1 (Pec Deck) | 3 (Cable Fly low→high, Band Chest Fly, Pullover (hantel)) | 14 | chest_fly-cz1.md, -cz2.md |
| dip | 4 | 0 | 1 (Dip Machine) | 3 | dip.md |
| chest_press_machine | 3 | 0 | 0 | 3 | chest_press_machine.md |
| cable_press | 3 | 0 | 1 (Single Arm Cable Chest Press) | 2 | cable_press.md |
| **Razem** | **94** | **14 (+1 warunkowo)** | **7** | **72–73** | |

Uwaga bench_press: Squeeze Press (hantle) —
warunkowe (Mikolo bez autora/daty, korekta A ocenia, że Mikolo nie produkuje hantli → najpewniej otwarte). Liczby w kolumnie „Gotowe” do
przeliczenia przez koordynatora przy scalaniu z bloków JSON (źródło prawdy: bloki JSON po sekcjach „Korekta szczebli”).

Nowe zdania: zaproponowane łącznie ok. 130 (PL + EN) — po korekcie część przeszła do „Otwarte” jako kandydaci; zdania w blokach JSON = te do wdrożenia.
Przy scalaniu policz z bloków JSON (`node -e` po plikach) — liczba w raportach agentów sprzed korekty jest zawyżona.

**Pułapka przy scalaniu (bloki JSON):** `overhead_press-cz1.md` ma blok sprzed korekty — wpisy „Single Arm Overhead Press (hantel)” i
„Push Press - Behind the Neck” są NIEWAŻNE (po korekcie otwarte, zob. `overhead_press-cz1b.md`); Arnold, Seated Barbell, Kettlebell, Band — brać z cz1b
(nadpisuje cz1); „Standing Barbell Press Behind Neck” — z cz1. `bench_press-cz1b.md`: „Squeeze Press (hantle)” warunkowe (pytanie 4, Mikolo).
Wpisy częściowe (z dopiskiem): Single Arm Cable Chest Press, Cable Fly (low to high), Band Chest Fly, Pullover (hantel), Dip Machine, Landmine Press, Renegade Row.

**Uzupełnienie 2 szczebli (koordynator 1.1, 02.11 ~07:55):** Coach przy Plank Shoulder Taps → 5 (autor bez kwalifikacji) → ćwiczenie otwarte
(wpis w JSON `pushup_plank-cz2.md` nieważny, notka na końcu pliku). Physitrack → 5 (potwierdza otwarte Single Arm OHP). Reguła „błąd = zaprzeczenie
standardu”: odwrotna wskazówka liczy się jako drugie źródło błędu tylko przy bezpośrednim zaprzeczeniu — Seated Barbell i Band Shoulder Press
(`ohp.mis.arch` vs „keep the back straight”) — bezpośrednie zaprzeczenie → zostają gotowe, oznaczyć przy scalaniu „błąd = zaprzeczenie standardu”;
`ohp.mis.flare` vs „elbows pointed forward” (Seated Barbell) — do oceny recenzenta. Pytanie 5 niżej — rozstrzygnięte tą regułą.

## Wynik — role mięśni (`docs/research/role-miesni-fala-w1/`)
Wszystkie propozycje to reguły po nazwie (`nameRules`) — sprawdzane w `matchRole` przed regułami rodziny i blokadą „rodzina z fazą + ćwiczenie na czas”; zdanie bez fazy.

| Rodzina | Pary z luką | Gotowe | Otwarte | Uwagi |
|---|---|---|---|---|
| pushup_plank | 13 ćwiczeń | skośne w Side Plank, Copenhagen Plank, Push Up to Side Plank (nowa funkcja `obliques.side_hold`, NFPT + NASM + 2 badania) | prosty brzucha w desce/rolloutach (`abs.antilordosis` — jedno źródło), anty-rotacja, Mountain Climbers, przywodziciele Copenhagen (uproszczenie) | **Uwaga:** NFPT wg rozstrzygnięcia = 4 tylko z autorem, datą i kwalifikacjami — sprawdzić przy scalaniu |
| overhead_press | 6 | Push Press — czworogłowe (`quads.knee_ext`); Landmine Press — klatka (`chest.shoulder_flex`) | jammery i Push Press zza karku (analogia), See-Saw — skośne | **Push Press: jedno badanie szczebla 3 → „jedno źródło”, nie „ustalone”; Landmine — analogia → „uproszczenie”** |
| dip | 4 | Triceps Dip, Ring Dips, Triceps Dips (ławka) — klatka (`chest.shoulder_flex_add`) | Dip Machine (analogia) | **zastosowanie do dipów: jedno badanie szczebla 3 → „jedno źródło”** |
| chest_fly | 4 | Front Raise And Pullover — przedni akton, najszerszy; Crucifix — przedramiona (`forearms.grip`) | Bent-Arm Pullover — klatka; Around The Worlds; Crucifix — barki/plecy | |

Przyczyna strukturalna luk (pushup_plank, dip): brak funkcji utrzymania pozycji i reguł dla core_other / cardio / core_anti_rot; reguła v_push celowo
wyklucza pomocniczy piersiowy. Opcje (do decyzji koordynatora 1.1 — produktowo właściciela): A reguły po nazwie + funkcje utrzymania z własnym statusem
(rekomendacja badacza); B reguły rodziny z warunkiem „ćwiczenie na czas”; C bez opisu.

## Błędy zestawów ogólnych (tryb `general`) — znalezione przy badaniu (cenne niezależnie od wdrożenia)
- `ohp.mis.lock` — żadne przeczytane źródło nie potwierdza; kilka każe zablokować łokcie na górze.
- `press.noLock` / `bp.move` „do wyprostu” — przeczą źródłom maszyn i Smitha („bez blokowania łokci”); propozycja `press.mis.lock`.
- `bp.control` (powoli) — przeczy źródłom dla łańcuchów/odwróconych gum (szybko); `bp.mis.arch` — przy board/pin źródło zaleca utrzymać łuk.
- `bp.grip` „nieco szerzej niż barki” — błędne dla Wide-Grip Barbell Bench Press (karta myląca dziś).
- `bp.blades` „w dół” — niepotwierdzone dla wariantów skośnych w dół.
- `ohp.seat` (hantle) — nie pasuje do Smitha, sztangi siedząc ani wyciągu.
- `ohp.tall` / `ohp.elbowsUnder` — przeczą See-Saw Press (pochylenie boczne) i wyciskaniu zza karku. See-Saw: rekomendacja — tryb `open`.
- `pp.legs` — przeczy jedynemu opisowi jammerów (nogi nie pracują) — ustalić, co pokazuje figura.
- zestaw `dip` = zdania `bdip.*` z ławki — nie pasują do poręczy, kółek, maszyny.
- zestaw `plank` (przedramiona) — nie pasuje do Shoulder Taps (proste ręce); `splank.setup` — nie pasuje do Copenhagen.
- `push.mis.partial` — częściowo sprzeczne ze źródłami (każą nie blokować łokci na górze); `push.setup` — różna szerokość dłoni w Decline.
- `raiseSide` dla Crucifix — to izometryczne utrzymanie, nie wznosy.
- Front Raise And Pullover — `po.slow` („wracaj nad klatkę”) prawdopodobnie nie pasuje (start ze sztangą na udach; niepotwierdzone).

## Otwarte pytania dla koordynatora linii 1.1
1. Karty „częściowe” (bez błędu) — czy wdrażać (wzór: istniejące wpisy z pustym `mistakes`, np. „Incline Push Up”, „Triceps Dips (ławka)”).
2. Rozbieżność korekt: Eleiko — korekta A: 4 (platforma edukacyjna firmowana marką), korekta B: 5 (brak autora/daty) → ujednolicić.
3. Kopie instrukcji Life Fitness z serwisu z instrukcjami (Pec Deck, Dip Machine, maszyny) — przyjęte jako 4; jeśli odrzucone, Pec Deck → otwarte.
4. Szczeble do potwierdzenia: Inspire US (5; jeśli 4 — Board Press wraca do gotowe), Barbell Logic (4 bez autora/daty, firmowane), Onnit (4),
   Healthline (4), Men's Health (przedruk), Experience Life, Coach, fit-pro.com, OriGym, Physitrack (platforma dla fizjoterapeutów — czy „dokumentacja aplikacji”),
   Fitness Volt (5), Mikolo (dla hantli/ławek).
5. Czy odwrotna wskazówka („keep the back straight”) liczy się jako potwierdzenie błędu (Seated Barbell, Band Shoulder Press — cz1b, pkt 1).
6. Co przedstawiają Band Bench Press i Chain Press (guma/łańcuchy + ławka, bez sztangi?) oraz Clock Push-Up (dwa różne ćwiczenia pod tą nazwą).
7. Renegade Row — NASM Best Abs jako drugie źródło `renegade.mis.twist` (wtedy gotowe).

## Odpowiedzi koordynatora linii 1.1 (02.11.2026)
1. Karty „częściowe” (ustawienie + ruch) — kwalifikują się (minimalna karta własna, decyzja koordynatora 02.11 w docs/18); przy integracji z pustym `mistakes`.
2./4. Szczeble Eleiko, Inspire US, Barbell Logic, Onnit, Healthline, Men's Health, Experience Life, fit-pro.com, OriGym, Fitness Volt, Mikolo —
   „uzupełnienie 3” badacza koordynatora; oznaczenia warunkowe zostają. Coach i Physitrack — jak w uzupełnieniu 2 (5).
3. Kopie instrukcji Life Fitness — warunkowo 4 (dokumentacja producenta tylko dla jego maszyny; inna marka = analogia), ostatecznie w uzupełnieniu 3.
5. Rozstrzygnięte regułą „błąd = zaprzeczenie standardu”.
6. Band Bench Press, Chain Press (bench_press-cz2.md „Otwarte”) i Clock Push-Up (pushup_plank-cz1.md „Otwarte”) — obie interpretacje opisane; rozstrzyga koordynator przy integracji z katalogiem.
Role mięśni — wariant A (reguły po nazwie + funkcje utrzymania z własnym statusem); jedno badanie = „jedno źródło”, analogia = „uproszczenie”.

## Pułapki
ExRx 403; web.archive.org zablokowane w narzędziu; muscleandstrength 403; kettlebellkings 402; StrongFirst 307 (niektóre strony); elitefts 404 (część);
tao.dragondoor poza siecią sesji; StatPearls captcha; Physiopedia, BJSM, MDPI 403. Wiele trafień to strony aplikacji — nie są źródłem.
Id źródeł ról W1G5-1…7 robocze (przy scalaniu kolejne numery S; W1G5-4 = istniejące L6-S6).

## Następny krok
Scalenie przez koordynatora linii 1.1: bloki JSON → `data/zrodla/cues.json`, zdania → `lib/cues/text/pl.json` + EN (recenzent-lokalizacji),
role → `data/zrodla/role-miesni.json`; niezależna recenzja kart (L-047). Druga fala dla otwartych: szukać źródeł pod konkretny błąd.

## Wynik verify bazy i wypchnięcia
- Pełne `npm run verify` na czystej bazie `integracja-1-1` (15abc58), 02.11.2026: **zielone** (EXIT 0; jest 654/656 plików w pierwszym przebiegu,
  2 przerwane SIGTERM — `jest-ponow`: oba ponowienia zielone; znacznik `pelne`, drzewo c0330e6dbbf1).
- `npm run verify:docs` w worktree: pierwszy przebieg czerwony (1 test; w logu „ReferenceError: … Jest environment after it has been torn down. From
  tests/cues.test.tsx”); każdy z 4 testów osobno zielony (public-repo 37, cues 16, e2e-pakiet 20, readme 31); powtórka verify:docs zielona.
  Ocena: niestabilność `tests/cues.test.tsx` przy wspólnym przebiegu (fałszywe timery po zakończeniu środowiska) — nie z winy zmian (same dokumenty);
  do sprawdzenia przez koordynatora 1.1, czy wpis do docs/40 / backlog (ten zakres nie zmienia testów).
- verify:docs wymaga `origin/main` i wspólnego przodka: w płytkiej kopii `git fetch origin main` + `git fetch --deepen=200 origin integracja-1-1 main`.
- SHA wypchnięć: zob. wiadomość końcowa koordynatora grupy (gałąź `badania/g5-pchanie`).
