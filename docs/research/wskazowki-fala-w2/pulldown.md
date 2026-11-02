# Wskazówki techniki — rodzina `pulldown` (fala W2, grupa G6)

- Data: 02.11.2026; fala W2; autor: badacz-merytoryczny (agent).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1.
- Co zrobiono: błędy (ze źródeł i wnioskowane) dla kart bez błędów (Lat Pulldown, Straight Arm Pulldown oraz karty W1 Close-Grip Front i Underhand); nowa karta V-Bar Pulldown jako wariant uchwytu Lat Pulldown (uproszczenie). Reguły: CLAUDE.md (wyjątek dla wskazówek techniki), `szczeble-organizacji-2026-11-02.md`, przeliczenie W1 z 02.11.2026. Wszystkie strony z tabeli źródeł otwarte WebFetch 02.11.2026.

## Tabela ćwiczeń

| Klucz | Tryb dziś | Wynik W2 | Uwagi |
|---|---|---|---|
| Lat Pulldown | own (S1M1T2E0) | tylko błędy dopisane (2 ze źródeł + 1 wnioskowany) | `lpd.mis.lean`, `lpd.mis.shrug` — NASM (nazwa błędu) + ACE (standard, reguła „błąd = zaprzeczenie standardu”); `lpd.mis.thighs` — wniosek z `lpd.thighs` |
| Close-Grip Front Lat Pulldown | general (karta W1 bez błędów) | tylko błędy dopisane | te same błędy; źródła ogólne ściągania — „wariant: chwyt” (jak w W1) |
| Underhand Lat Pulldown | general (karta W1 bez błędów) | tylko błędy dopisane | jw. |
| V-Bar Pulldown | general | gotowe (ustawienie + ruch + 2 błędy) | **uproszczenie: wariant sprzętu Lat Pulldown** — inny uchwyt (V, dłonie do siebie), ten sam tor: do górnej części klatki, łopatki w dół, powrót do wyprostu. Catalyst 861 opisuje wprost chwyt neutralny; ACE 158 i NASM — ściąganie ogólnie. Punkt końcowy: na szczeblu 4 bez sprzeczności (NFPT „broda” = 5) |
| Straight Arm Pulldown | own (S1M1T1E0, `partial`) | tylko błąd wnioskowany dopisany | `sapd.mis.bend` — wniosek z `sapd.move`; uwaga W1: źródła `sapd.setup`/`sapd.move` do przeglądu koordynatora (Eleiko 659842f4 = HTTP 500/5) — błąd wnioskowany dziedziczy ten stan |
| Single Arm Lat Pulldown | general | otwarte | bez nowych źródeł w W2 (zostaje tylko Catalyst 895) |
| Full Range-Of-Motion Lat Pulldown | general | otwarte | nie badane w W2 (W1: brak definicji wariantu) |
| Wide-Grip Pulldown Behind The Neck | general | otwarte | nie badane w W2; NASM odradza wariant (ocena zdrowotna — nie do karty) |

### Blok do wdrożenia

```json
{
  "Lat Pulldown": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "lpd.mis.lean", "s": [["nasm-lpd-biomech", "Common Compensations (Excessive leaning or swinging)"], ["ace-158", "Step 2 (Avoid any additional backwards lean during the pull movement) — standard"]]},
      {"c": "lpd.mis.shrug", "s": [["nasm-lpd-biomech", "Common Compensations (Shrugged shoulders throughout the pull)"], ["ace-158", "Step 2 (initiate the downward pull by first depressing your scapulae) — standard"]]},
      {"c": "lpd.mis.thighs", "s": [["wniosek", "lpd.thighs"]]}
    ]
  },
  "Close-Grip Front Lat Pulldown": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "lpd.mis.lean", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: chwyt)"], ["ace-158", "Step 2 — standard (wariant: chwyt nieokreślony)"]]},
      {"c": "lpd.mis.shrug", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: chwyt)"], ["ace-158", "Step 2 — standard (wariant: chwyt nieokreślony)"]]},
      {"c": "lpd.mis.thighs", "s": [["wniosek", "lpd.thighs"]]}
    ]
  },
  "Underhand Lat Pulldown": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "lpd.mis.lean", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: chwyt)"], ["ace-158", "Step 2 — standard (wariant: chwyt nieokreślony)"]]},
      {"c": "lpd.mis.shrug", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: chwyt)"], ["ace-158", "Step 2 — standard (wariant: chwyt nieokreślony)"]]},
      {"c": "lpd.mis.thighs", "s": [["wniosek", "lpd.thighs"]]}
    ]
  },
  "Straight Arm Pulldown": {
    "_tryb": "dopisz",
    "mistakes": [
      {"c": "sapd.mis.bend", "s": [["wniosek", "sapd.move"]]}
    ]
  },
  "V-Bar Pulldown": {
    "setup": [
      {"c": "lpd.vbarSetup", "s": [["ace-158", "Step 1 (thigh pad to fit firmly; uproszczenie: wariant sprzętu Lat Pulldown)"], ["catalyst-861", "opis (Hold a neutral-grip cable attachment overhead)"]]}
    ],
    "move": [
      {"c": "lpd.vbarPull", "s": [["catalyst-861", "opis (pull the handles to the upper chest, pulling the shoulder blades down and back; return to the extended position under control)"], ["ace-158", "Step 2–4 (depress scapulae; bar nears the chest; slowly return; uproszczenie: wariant sprzętu Lat Pulldown)"]]}
    ],
    "tips": [
      {"c": "lpd.fullStretch", "s": [["ace-158", "Step 4 (until your elbows are fully extended; wariant sprzętu)"], ["catalyst-861", "opis (return to the extended position)"]]}
    ],
    "mistakes": [
      {"c": "lpd.mis.lean", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: uchwyt)"], ["ace-158", "Step 2 — standard"], ["catalyst-861", "opis (Keeping the trunk braced) — standard"]]},
      {"c": "lpd.mis.shrug", "s": [["nasm-lpd-biomech", "Common Compensations (wariant: uchwyt)"], ["catalyst-861", "opis (shoulder blades down and back) — standard"]]}
    ]
  }
}
```

## Nowe zdania

| id | PL | EN (propozycja) | uzasadnienie |
|---|---|---|---|
| lpd.mis.lean | Bujanie i odchylanie się do tyłu, żeby ściągnąć ciężar. | Swinging and leaning back to get the weight down. | NASM nazywa błąd; ACE 158 Step 2 podaje standard („bez dodatkowego odchylenia”) — reguła „błąd = zaprzeczenie standardu”. Lekkie odchylenie na starcie jest dozwolone (ACE Step 1, NASM) — dlatego zdanie mówi o odchylaniu „żeby ściągnąć”, nie o każdym odchyleniu |
| lpd.mis.shrug | Barki uciekają w górę, do uszu. | Shoulders creeping up toward your ears. | NASM (błąd) + ACE 158 Step 2 (standard: najpierw obniż łopatki). Tekst z propozycji W1 (wtedy NFPT + NASM; NFPT = 5) |
| lpd.mis.thighs | Wałki za luźno — uda odrywają się od siedziska. | Pads too loose — your thighs lift off the seat. | Wnioskowany: zaprzecza `lpd.thighs` („ustaw wałki tak, żeby mocno przytrzymywały uda”). Widoczny na rysunku (uda pod wałkiem) |
| sapd.mis.bend | Zginanie łokci w trakcie ruchu. | Bending your elbows during the movement. | Wnioskowany: zaprzecza `sapd.move` („Prostymi rękami ściągnij drążek…”). Uwaga: pokrywa się z wskazówką `sapd.arms` — koordynator może zamiast nowego zdania przenieść sens do błędów |
| lpd.vbarSetup | Usiądź, ustaw wałki mocno na udach i chwyć uchwyt V — dłonie zwrócone do siebie. | Sit down, set the pads firmly on your thighs and grab the V-handle, palms facing each other. | ACE 158 Step 1 (wałek na udach) + Catalyst 861 (chwyt neutralny); uproszczenie: wariant sprzętu |
| lpd.vbarPull | Ściągnij uchwyt do górnej części klatki, łopatki w dół i do tyłu; wróć powoli do wyprostu rąk. | Pull the handle to your upper chest, shoulder blades down and back; return slowly until your arms are straight. | Catalyst 861 (wprost) + ACE 158 Step 2–4 (wariant sprzętu). „Do tyłu” — Catalyst 861 i NASM („down and back”); ACE mówi tylko „w dół”, nie przeczy |

Zdania istniejące użyte ponownie: `lpd.fullStretch`. Nowe zdania wymagają wpisu w rejestrze twierdzeń (`node scripts/claims.mjs --stub`).

## Źródła

| id | adres | organizacja | szczebel | co przeczytano |
|---|---|---|---|---|
| nasm-lpd-biomech | https://www.nasm.org/resource-center/blog/training/the-biomechanics-of-the-lat-pulldown-muscles-grip-and-form | NASM | 4 — organizacja certyfikująca; autor Brian Sutton (NASM-CPT, CES, PES, NASM Master Instructor), opublikowane 2021, aktualizacja 21.07.2026 | sekcja „Common Compensations” (leaning/swinging, shrugged shoulders, pulling primarily with the arms, forward head); „Choosing the Right Grip”; tor do górnej części klatki |
| ace-158 | https://www.acefitness.org/resources/everyone/exercise-library/158/lat-pulldown/ | ACE | 4 — organizacja certyfikująca, treść firmowana (stopka ACE; precedens docs/research/27) | Step 1 (wałek na udach, lekkie odchylenie ≤ 30°), Step 2 („Avoid any additional backwards lean during the pull movement.”; najpierw obniżenie łopatek), Step 3–4 |
| catalyst-861 | https://www.catalystathletics.com/exercise/861/Neutral-Grip-Lat-Pulldown/ | Catalyst Athletics | 4 — rozstrzygnięcie 02.11.2026 (biblioteka firmowana) | cały opis: chwyt neutralny, „pull the handles to the upper chest, pulling the shoulder blades down and back”, tułów usztywniony |
| fitnessvolt-vbar-alt | https://fitnessvolt.com/substitute-exercises/v-bar-pulldown-alternatives | Fitness Volt | **5** — strona bez autora i daty (tylko stopka) — nie liczy się | instrukcja V-bar (do klatki, tułów nieruchomo) — kierunkowo zgodna, nie użyta |

## Otwarte i uwagi dla koordynatora

1. **Single Arm Lat Pulldown** — zostaje jedno źródło (Catalyst 895); w W2 nie znaleziono drugiego. Następny krok: artykuł Fitness Volt z autorem z kwalifikacjami albo ACE/NASM.
2. **Full Range-Of-Motion Lat Pulldown, Wide-Grip Pulldown Behind The Neck** — nie badane w W2 (W1: brak definicji wariantu / brak opisu techniki; ocena NASM o wariancie zza karku to twierdzenie zdrowotne).
3. **„Ciągnięcie samymi rękami”** (NASM, Common Compensations) — jedno źródło szczebla 4 nazywa błąd; standard w ACE („first depressing your scapulae”) dotyczy kolejności, nie udziału rąk — nie dopisano.
4. **Zestaw ogólny `vpull`** — błąd `mis.jerk` w zestawie V-Bar/Close-Grip/Underhand zostaje zastąpiony błędami z kart; `pu.shoulders` w zestawie zgodne z `lpd.mis.shrug`.
5. **Rysunek:** `lpd.mis.thighs` i `lpd.mis.lean` wymagają, by rysunek błędu pokazał uniesione uda / odchylenie tułowia — nie sprawdzałem `lib/figures/v2/poses/pulldown.json` (oszczędność kontekstu).
6. **Straight Arm Pulldown** — stan źródeł `sapd.setup`/`sapd.move` wg W1 do przeglądu; `sapd.mis.bend` ma sens tylko, gdy te zdania zostaną.
7. Role mięśni — W1 nie zostawiła otwartych pozycji w tej rodzinie; plik `role-miesni-fala-w2/pulldown.md` nie powstał.
