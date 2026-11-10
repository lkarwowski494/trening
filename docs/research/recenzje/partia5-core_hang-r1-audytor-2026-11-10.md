# Recenzja niezależna rodziny v2 `core_hang` — partia 5, runda r1 (audytor, 10.11.2026)

Bramka 4 (L-047: autor ≠ recenzent; L-050: arkusze ze śladem). Stan zamrożony: `figury/partia-5-core_hang` @ 5b7f62f (worktree odłączony). Autor: programista (subagent, sesja session_01T66VByZrLpWxNF8yF3gpgu). Recenzent: audytor (subagent). Niczego nie poprawiałem.

**Werdykt rodziny: `wyswietlana`** — bez KRYTYCZNYCH i WYSOKICH; Ś1 tania, zalecana przed włączeniem.

## Znaleziska

| ID | Poziom | Pewność | Ćwiczenia | Opis i miara | Realność |
|---|---|---|---|---|---|
| Ś1 | ŚREDNIE | 95% | wszystkie 3 | Drążek praktycznie niewidoczny. Sprzęt to tylko `sztanga` (oś z, r 1,6 cm, `poses/core_hang.json`) + podłoga, **bez `slupek`**. W rzucie z boku drążek to kółko r 1,6 cm schowane pod dłonią (chwyt 0,00 cm od osi w 21/21 kadrach) — na arkuszu widać ciemną kropkę wewnątrz dłoni, postać „wisi w powietrzu”. Rodzina pull_up (Dead Hang, ten sam drążek y 230) ma słupek `{rodzaj: slupek, x: 0, h: 235}` — szablon `contract.ts:111-112` wymaga go dla zwisu. Karta `hang.setup`: „Zawiśnij na drążku”. Poprawka: dopisać słupek jak w pull_up (3 wpisy sprzętu). Arkusz: `Hanging-Knee-Raise-side.png`, kadr u = 0 powiększony 4× (`crop-bar-hkr.png`) vs `porown/Dead-Hang-side.png`. | realny (każde otwarcie karty) |
| N1 | NISKIE | 90% | wszystkie 3 | Zwis w u = 0 nie jest pod drążkiem: bark, miednica i kostki x = −11 cm, chwyt x = 0 → ramię 10,0° od pionu przy pozie statycznej (środek masy 11 cm za osią chwytu). Kierunkowo bez wpływu na kartę. | realny, kosmetyczny |
| N2 | NISKIE | 85% | Hanging Knee Raise | Nakładka `hangHipLimb` (cue `hang.ribs` „Żebra w dół, tułów spokojny — podwijaj miednicę”) rysuje łuk zgięcia biodra; poza ma `zgiecieKregoslupa` 0 we wszystkich klatkach, więc „podwijanie miednicy” nie jest pokazane — łuk ilustruje część „kolana ku klatce” reguły, nie zdanie wskazówki. Jako przybliżenie miary reguły uczciwy (niżej). | realny, bez błędnej treści |

## Ruch (K4–K8), liczby z `frameAt`, u co 0,05
- **Hanging Knee Raise**: biodro (measuredAngle) 10° → 100°, kolano 174° → 70° (kąt wewn.), odległość kolano–bark 92 → 60 cm (Δ 32 cm ≥ 20 cm `kolana_ku_klatce`) — zgodne z `hang.knees.move` „unieś ugięte kolana przed siebie”. Tułów −7° (spokojny), miednica przesuwa się 8,7 cm w przód, 0,7 cm w górę.
- **Hanging Leg Raise**: biodro 10° → 83°, kolano 163–168° (zgięcie 12–17° ≤ 30° `kolana_lekko`), nogi w u = 1 ok. 7° pod poziomem (`nogi_uniesione` ≥ −30° spełnione) — zgodne z `hang.legs.move`.
- **Toes to Bar** (12 klatek, limit dynamiczny — `figury-sens.json` „dynamiczne”): biodro 12° → 124°, kolano 162–175° (`hang.t2b.straight` ✓), nogi ok. 86° nad poziomem w u = 1 (`palce_do_drazka` ≥ 45° ✓). Stopa w u = 1: palec (−2; 236), pięta (23; 235) — stopa leży nad osią drążka, palec 6,3 cm od osi; na rysunku stopa styka się z drążkiem (zgodnie z „aż palce stóp dotkną drążka”). Przenikania stopa–dłoń brak (z 6–10 vs ±25).
- **Odchylenie tułowia w T2B**: miednica x −11 → +11 cm (22 cm **w przód**, nie wstecz) i 28 cm w górę; bark −11 → −30 cm, pochylenie tułowia −55°. To obrót wokół chwytu z równowagi (nogi w przód → bark w tył), zgodny z `hang.pressBar` „dociskaj drążek w dół”; `figury-sens.json` `otwarte_czesciowo` nazywa to wprost i nie mierzy `hang.noSwing`. Bez znaleziska wobec „bez bujania” (bujanie = pęd, poza go nie pokazuje).
- **Dłonie**: styk chwyt–oś drążka 0,00 cm, obie ręce, 21/21 kadrów, 3/3 ćwiczenia.
- **Ślad**: bez ciężaru — ślad miednicy (linia zielona): HKR/HLR krótki łuk w przód (8,7 / 10,4 cm), T2B łuk w górę i w przód (28 cm / 22 cm). `odstęp` 52 cm = odległość nóg od drążka (T2B u = 1: 10,2 cm, bez przenikania).

## Nakładka (`lib/figures/v2/overlay/core_hang.ts`)
- Jeden element `hangHipLimb`, tylko rzut z boku, tylko Hanging Knee Raise (`exercises`), reguła `kolana_ku_klatce` „ustalone (kierunek)”, cue `hang.ribs` jest na karcie HKR i w `wskazowki_na_reguly`. Pozostałe reguły (`rece_proste` analogia, `nogi_uniesione`, `kolana_lekko`, `palce_do_drazka`) bez elementu — poprawnie.
- Łuk biodra jako przybliżenie miary (odległość kolano–bark): przy sztywnym kręgosłupie (zgięcie 0 w pozach) odległość jest monotoniczną funkcją kąta biodro (10°→100° ↔ 92→60 cm) — kierunek uczciwy; łuk nie niesie liczby progu (20 cm zostaje w danych). Status „ustalone (kierunek)” kwalifikuje: reguła o kierunku, liczba oznaczona „konwencja” i nie rysowana. Arkusz `nakladka/Hanging-Knee-Raise-side.png`: łuk rośnie od zwisu do góry, 1 linia + ≤ 1 łuk.

## Karty (K11), zestawy (K12), v1 (K10)
- Karty własne HKR, HLR, T2B (`hang.*`, `hang.t2b.*`) zgodne z rysunkiem (wyjątek: `hang.setup` „na drążku” — Ś1, drążek niewidoczny; „ciało wyprostowane” ✓ w u = 0). `hang.ribs` na HLR bez elementu — zgodnie z wariantem.
- Zestawy ogólne: brak (wszystkie 3 mają karty własne; L-Sit bez rysunku).
- v1: brak wpisów w `figury-recenzja.json` v1 dla tych ćwiczeń — nic do zastąpienia.

## Testy (K14) `git diff 13a3eb7..5b7f62f -- tests/`
Bez poluzowań: nowy `figures-v2-nakladka-core-hang.test.tsx`; mapowanie (+core_hang, liczba +3), eksport 232 → 235, rejestr nakładek 10 → 11 rodzin — dopisania, nie osłabienia. Uruchomione `--runInBand`: nakładka core_hang + `figures-v2-tor` — 203/203 zielone.

## Skróty (`node scripts/zrodla-runtime.mjs --skroty` w worktree recenzenta)
core_hang `d5d8a4524dbe`; Hanging Leg Raise `063d8f4c9283`; Hanging Knee Raise `ac21253c514f`; Toes to Bar `369a88554933` (karty bez zmian od recenzji treści A4a). `assignAll()` → 4 (z L-Sit, bez rysunku).

Arkusze (poza repo): `scratchpad/rec-core_hang/`.
