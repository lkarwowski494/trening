# Wskazówki na archetyp ruchu — propozycja (25.10.2026)

Dane: `wskazowki-wzorce.json` — 21 archetypów, każdy z ≥ 2 wskazówkami mającymi ≥ 2 niezależne źródła (komplet); 5 z nich ma
otwarte pytania cząstkowe (pompki — kąt łokci; nad głowę — dipy/pike; unoszenie bokiem — „barki do uszu”; anty-rotacja — drwal;
noszenie — nad głową). 6 grup bez archetypu. Nic nie jest wdrożone.

## Wnioski

1. **Nie trzeba pisać nowych wskazówek od zera.** Każdy archetyp składa się z istniejących, sprawdzonych zdań
   `lib/cues/text/pl.json` (306 unikalnych, każde z ≥ 2 źródłami z różnych organizacji dla ćwiczenia źródłowego —
   docs/research/27). Nowe jest tylko jedno zdanie: `NEW.bp.elbowsMid` („Łokcie trochę bliżej tułowia — nie rozkładaj ich szeroko
   na boki”; NASM + SBS, przeczytane 25.10.2026), bez liczby kąta.
2. **Pewność zależy od ćwiczenia, nie od archetypu.** Dla ćwiczeń źródłowych (`sourceExercises`) zdanie jest „potwierdzone
   (2+ źródła)”. Dla pozostałych ćwiczeń tego samego wzorca to **„uproszczenie (analogia)”** — zgodnie z CLAUDE.md (analogia do
   innego ćwiczenia = uproszczenie, oznaczane niezależnie od liczby źródeł; docs/27 też nie liczy analogii do minimum).
3. **Źródeł szczebla 1–2 dla wskazówek technicznych nie znaleziono** w otwartym dostępie: stanowiska ACSM/AHA mówią o tempie,
   obciążeniu i bezpieczeństwie ogólnie, nie o ustawieniu łokci czy kolan. Wskazówki stoją na szczeblu 3–4 (biblioteki ćwiczeń
   ACE, NASM, ExRx, SBS, pojedyncze badania) — dlatego wymagamy ≥ 2 niezależnych.
4. **Język** (dopisek właściciela 25.10.2026): `userText` jest krótki i potoczny; twierdzenie i źródło w polach `claim`/`sources`.
   Istniejące zdania z żargonem do poprawy przy okazji: `ht.mis.arch`, `gb.noArch` („przeprost”), `sq.kneesToes` (długie).
   Zmiana tekstu = aktualizacja 36 języków (rola tłumacz) i `gen.mjs --check`.

## Pokrycie (szacunek z liczności wzorców w `lib/catalog.generated.ts`)

| Wzorzec katalogu | Ćwiczeń | Archetyp | Uwagi |
|---|---|---|---|
| isolation | 205 | iso_curl, iso_triceps, iso_raise, iso_fly, iso_leg_machine, iso_calf, shrug | nadgarstki, szyja, przywodzenie/odwodzenie — bez zestawu |
| other + mobility + cardio + carry | 146 | carry (tylko noszenie) | reszta [OTWARTE] |
| hinge | 81 | hinge_floor, hinge_rdl, hip_thrust_bridge | swing ma własne zdania; olimpijskie — otwarte |
| core_* | 78 | core_flexion, core_anti_ext, core_anti_rot | zwis, ab wheel, V-up, drwal — otwarte |
| h_push | 56 | h_push_bench, h_push_pushup | kąt łokci przy pompce — otwarte |
| v_push | 41 | v_push_overhead | dipy, handstand, pike — otwarte |
| squat | 36 | squat_bilateral | sissy, pistol — osobno |
| h_pull | 25 | h_pull_row | face pull, rear — własne zdania/raise |
| lunge_single_leg | 24 | lunge_split | |
| v_pull | 17 | v_pull | |

Zgrubnie: archetypy obejmą ok. 60–65% biblioteki; ok. 35% (głównie cardio, mobilność, strongman, olimpijskie, szyja, nadgarstki)
zostaje bez wskazówek — tylko figura i stopka. Dokładne przypisanie ćwiczeń do archetypów wymaga reguł po nazwie i sprzęcie
z listą wykluczeń (jak `compileCatalogEntry` w makiecie, ale bez jej błędów — audyt pkt 3) — zadanie dla programisty z testem macierzowym.

## Decyzja produktowa dla właściciela (nie merytoryczna)

Jak pokazywać wskazówki archetypu przy ćwiczeniach-analogiach?

- **A (rekomendacja): pokazywać z dopiskiem** „Wskazówki ogólne dla tego rodzaju ruchu”, w danych `certainty: uproszczenie
  (analogia)`. Plus: 60%+ biblioteki ma wskazówki w 1.0; zgodne z regułą (uproszczenie nazwane). Minus: wskazówka może nie pasować
  do nietypowego wariantu → lista wykluczeń i przegląd audytora.
- **B: wskazówki tylko przy ćwiczeniach ze źródłami (102)**, reszta tylko figura. Plus: zero analogii. Minus: ok. 85% biblioteki bez wskazówek.
- **C: archetyp tylko dla wariantów sprzętowych ćwiczeń źródłowych** (ten sam ruch, inny sprzęt — jak już robi docs/27: „wariant
  tego samego ćwiczenia… z opisem w miejscu odwołania”). Plus: mocniejsze niż A. Minus: pokrycie ok. 25–35%.

## Otwarte pytania

1. [OTWARTE] Kąt łokci (wyciskanie, pompki) — audyt, pkt 1.3–1.4.
2. [OTWARTE] Zestawy dla: cardio (poza ćwiczeniami z repo), mobilności, skoków, olimpijskich, strongmana, szyi, nadgarstków, zwisu,
   ab wheel, dipów, drwala.
3. [OTWARTE] ACSM's Resources for the Personal Trainer 6e (Dysk) — jeśli ma opisy techniki ćwiczeń podstawowych, to trzecie, niezależne
   źródło (szczebel 3) dla archetypów; sprawdzić rozdziały o technice ćwiczeń oporowych (przysiad, martwy ciąg, wyciskanie,
   wiosłowanie, ściąganie) i o elastyczności/mobilności.
