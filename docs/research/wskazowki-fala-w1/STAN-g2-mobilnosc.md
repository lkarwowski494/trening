# STAN — fala W1, grupa G2 mobilność (02.11.2026)

Koordynator G2 (sesja badań). Gałąź `badania/g2-mobilnosc` od `integracja-1-1` (15abc58). Tylko dane badań — bez zmian w kodzie,
`data/zrodla/*.json`, `lib/**` i testach. Integruje koordynator linii 1.1.

## Zakres i metoda

- Rodziny (przypisanie `assignAll()` z `lib/figures/v2`, 02.11.2026): mobility_stand 36, mobility_floor 22, foam_roll 10, rotator_cuff 8 — razem 76 ćwiczeń,
  wszystkie w `LIB`. Żadne nie miało własnych wskazówek (74 × `general`, 2 × `open`: Cuban Press, Downward Facing Balance).
- Role mięśni: `muscleRoleRows` (na obiekcie `libExercise`) ma wiersze bez roli tylko w 9 ćwiczeniach (8 rotator_cuff + Downward Facing Balance, 13 par).
  Pozostałe 67 ćwiczeń (rozciągania, rolowanie) ma `muscleRoleRows` = [] — w katalogu tylko udziały 0,25 albo brak — ról nie dotyczy.
- Badacze (`badacz-merytoryczny`) równolegle, każdy jeden plik; brief wspólny z uzupełnieniami koordynatora linii 1.1 (strony innych aplikacji nie są źródłem;
  ExRx i Wayback niedostępne; zestawu ogólnego nie wpisujemy bez potwierdzenia; rozstrzygnięcie szczebli źródeł z 02.11.2026).

## Pliki (kolejność czytania przy integracji; późniejszy ma pierwszeństwo)

| Rodzina | Pliki |
|---|---|
| foam_roll | `foam_roll.md` |
| rotator_cuff | `rotator_cuff.md`; role: `../role-miesni-fala-w1/rotator_cuff.md` |
| mobility_floor | `mobility_floor-nogi.md`, `mobility_floor-tulow.md`, `mobility_floor-uzupelnienie.md`; role: `../role-miesni-fala-w1/mobility_floor.md` |
| mobility_stand | `mobility_stand-statyczne.md`, `-statyczne-2.md`, `-statyczne-3.md`, `mobility_stand-dynamiczne.md`, `-dynamiczne-uzupelnienie.md` |
| wszystkie | `korekta-szczebli-2026-11-02.md` (ocena źródeł z dowodami), potem `przeliczenie-2026-11-02.md` — stan końcowy, ma pierwszeństwo |

## Wynik na rodzinę (ćwiczenia: gotowe / częściowe / otwarte)

Stan końcowy = `przeliczenie-2026-11-02.md` (uzupełnienie 2 rozstrzygnięcia szczebli koordynatora linii 1.1 z 02.11.2026: szpitale, organizacje zdrowia i uczelniane służby zdrowia → 4;
uczelniane centra sportu, Sport Singapore, CFMWS i Extension bez autora, VHI → 5). Kolumna „przed korektą” — dla porównania.

| Rodzina | Ćwiczeń | Przed korektą | **Stan końcowy** | Nowe zdania | Role mięśni |
|---|---|---|---|---|---|
| foam_roll | 10 | 9 / 0 / 1 | **9 / 0 / 1** | 26 | nie dotyczy (brak podświetlanych mięśni) |
| rotator_cuff | 8 | 7 / 0 / 1 | **3 / 0 / 5** | 18 | 8 par gotowych (7 ćwiczeń komplet), 2 pary otwarte (Cuban Press: front_delt, upper_back); 2 nowe funkcje |
| mobility_floor | 22 | 15 / 3 / 4 | **10 / 4 / 8** | 48 | Downward Facing Balance — bez roli z powodem; reszta nie dotyczy |
| mobility_stand | 36 | 20 / 5 / 11 | **15 / 3 / 18** | 55 | nie dotyczy |
| **razem** | **76** | **51 / 8 / 17** | **37 / 7 / 32** | **147** | 8 par gotowych, 2 otwarte, 1 ćwiczenie bez roli |

Przeliczenie wypisuje też 73 zdania do pominięcia przy integracji (< 2 niezależne źródła szczebla ≤ 4). Rotator_cuff spada przez źródła marketingowe (Gym Reapers, Sole, Coach)
i uczelniane centrum sportu (Sussex) — szukanie źródeł szczebla 4 dla Band Pull Apart, External Rotation (linki), Cable Internal Rotation, Cuban Press to najtańszy następny krok.

## Otwarte do decyzji (nie dane)

1. ~~Szczebel instytucji~~ — rozstrzygnięty przez koordynatora linii 1.1 (uzupełnienie 2, 02.11.2026), zastosowany w przeliczeniu. Do zrobienia przy integracji: reguła „drugie źródło błędu = zaprzeczenie standardu” i sprawdzenie 11 PDF-ów „4p”.
2. **Zestaw ogólny** `st.*` / `dyn.*` / `smr.*`: przeczytane źródła prawie nigdzie nie potwierdzają `st.breathe`, `st.mis.force`, `st.noBounce`, `dyn.mis.jerk`, `smr.mis.fast` dla konkretnych ćwiczeń
   (szczegóły w „Otwarte” każdego pliku). Rekomendacja badaczy: ćwiczenia otwarte bez zdań z zestawu ogólnego. Band Pull Apart: `rear.elbows`, `rear.arms`, `mis.jerk` niepotwierdzone.
3. **Przypisanie rodzin:** Iron Crosses (Stretch), Hip Circles (Prone), Lying Leg Crossover Swings — w leżeniu/klęku, a w `mobility_stand` (`families.ts:140`, reguła po słowach);
   Downward Facing Balance — ćwiczenie równowagi/wzmacniające, nie rozciąganie; One Knee To Chest — źródła opisują leżenie.
4. **Postać ćwiczenia vs katalog** (decyzje produktowe A/B opisane w plikach): Standing Chest Stretch, Standing Elevated Quad Stretch, Torso Rotation (piłka?), Standing Hip Circles (kolano),
   Groiners, Runner's Stretch, Middle Back Stretch (scalone ze „Spinal Stretch”), Adductor-SMR (wariant przodem), Kneeling Forearm (kierunek).
5. **Zdanie ostrożności o bólu** („Jeśli coś boli, przerwij ćwiczenie.”) — 3 źródła szczebla 4 (KMPT, HSS, CUH), brak 1–2; twierdzenie zdrowotne — do rozstrzygnięcia wg zasad.
6. **Źródła `gcalf.*`** w `data/zrodla/wskazowki-ogolne.json` obejmują platformę ćwiczeń dla fizjoterapeutów — czy podpada pod regułę „inne aplikacje” (nowe dane jej nie używają).
7. Zdublowane id źródła: `nhs-sitting` = `nhs-sitting-exercises` (scalić). Numery S29–S35 (role) mogą kolidować z innymi grupami — przenumerować przy scalaniu.
8. 11 PDF-ów „4p” — data z metadanych/tytułu; sprawdzić `pdfinfo`/`pdftotext` przy integracji.
9. Nowe zdania PL/EN — recenzja lokalizacji i wpisy w rejestrze twierdzeń przy integracji.

## Git

Commity (lokalnie): 60a2fa5, a527a18, 5b7daf7, dfd94d4, 70e15a4, 951a206, 997766c (+ commit tego pliku).
Verify bazy (15abc58): patrz sekcja „Verify i wypchnięcie” niżej.

## Verify i wypchnięcie

(uzupełnia koordynator G2 po zakończeniu verify)

## Następny krok

Koordynator linii 1.1: odpowiedź na pkt 1, potem integracja wg kolejności plików; badania luk (ćwiczenia otwarte) — dwie tury szukania bez źródeł szczebla ≤ 4
dla większości otwartych w mobility_floor i mobility_stand-dynamiczne; dalsze szukanie ma sens po decyzjach z pkt 3–4.

## Pułapki

ExRx, mayoclinic.org, marines.mil, BYU — 403; web.archive.org zablokowane; NASM statyczne/dynamiczne — 404 albo lista ładowana skryptem; PDF-y przez WebFetch nieczytelne —
pobrać i czytać przez Read z `pages`; WebMD Ignite/Healthwise/StayWell/Krames = jedna organizacja niezależnie od szpitala-hosta; OrthoIndy i Upswing = treść MedBridge;
nationwidechildrens.org, hr.mtsac.edu — poza siecią sesji.
