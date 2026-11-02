# Role mięśni — rodzina `strongman` (fala W1, grupa G6)

- Data: 02.11.2026
- Autor: badacz-merytoryczny (agent)
- Zakres: luki w rodzinie `strongman`: hinge × upper_back (Atlas Stones, Keg Load, Tire Flip, Sandbag Load), v_push × glutes (Log Lift, Circus Bell), carry (Yoke Walk, Conan's Wheel).
- Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1.

Nowe źródła (SN-C1 … SN-C5) i zasada „noszenie = utrzymanie”: `carry.md`. Uwaga techniczna: `nameRules` dają zdanie bez fazy (wariant `_` w `lib/muscleRoles.ts`), więc w Log Lift zdanie brzmi „Pomaga prostować biodro.” bez „gdy pchasz” — i dobrze, bo biodro prostuje się przy zarzucie i podbiciu, nie przy samym wypychaniu.

## Wyniki

| Ćwiczenie | Region (udział) | Wynik | Uzasadnienie |
|---|---|---|---|
| Log Lift | glutes (0,5) | gotowe — nameRule do istniejącej `glutes.hip_ext` (`ustalone`) | SN-C4 (przegląd systematyczny, szczebel 2; Discussion → Log Lift): w zarzucie kłody liczy się szybki wyprost biodra w drugim ciągu. SN-C1 (Results → Log Lift, s. 1159, ryc. 4): u lepszego zawodnika wyprost pleców i biodra jednocześnie, z aktywnością mięśni pośladkowych. Funkcja pośladków (wyprost biodra) — S11, S19. Jedno źródło szczebla 2 wprost + jedno szczebla 3. |
| Circus Bell | glutes (0,5) | otwarte | Brak przeczytanego źródła o tym ćwiczeniu; przeniesienie z kłody to analogia. |
| Yoke Walk | abductors (0,5) | gotowe — nameRule do istniejącej `abductors.pelvis_level` (`dwa_zrodla`) | SN-C1 (Results → Super Yoke Walk, s. 1158; Discussion s. 1160, ryc. 7): ciężar jarzma wymaga momentu odwodzenia biodra ok. 112% siły odwodzicieli zmierzonej u zawodników — przy każdym kroku biodro nogi podporowej musi utrzymać miednicę. S27 (wstęp): opadanie miednicy w chodzie wiąże się z mniejszą aktywnością odwodzicieli. S11: funkcja pośladkowego średniego. Zdanie „gdy stoisz na jednej nodze” pasuje do fazy podporu jednonóż w chodzie. |
| Yoke Walk | abs (1) | otwarte — **jedno źródło** | Rolę usztywnienia tułowia (najwyższa współskurczu mięśni tułowia) opisuje tylko SN-C1; SN-C4 powtarza te dane. |
| Yoke Walk | quads (1), glutes (0,5), upper_back (0,5), lower_back (0,5) | otwarte | Brak przeczytanego źródła roli w chodzie z jarzmem (SN-C4: mało analiz jarzma). Prostowniki: SN-C1 opisuje ich szczyt przy podnoszeniu i odkładaniu jarzma, nie w chodzie — zdanie „Prostuje plecy” nie opisze chodu. |
| Conan's Wheel | quads (1), abs (1), upper_back (0,5), biceps (0,5) | otwarte | Brak jakiegokolwiek przeczytanego źródła o tym ćwiczeniu. |
| Atlas Stones, Keg Load, Tire Flip, Sandbag Load | upper_back (0,5) | otwarte | SN-C1 mierzył prostowniki piersiowe, nie czworoboczny ani równoległoboczne; opisuje „zahaczenie” kamienia przy zgiętym kręgosłupie (s. 1160), bez roli górnej części pleców. SN-C4: brak wzmianki o górnej części pleców w tych ćwiczeniach. `withoutRole.kombinacje` („upper_back poza regułami … w hinge”) zostaje. |

## Propozycje do `data/zrodla/role-miesni.json`

### `nameRules.reguly` (nowe wpisy)

```json
{ "muscle": "glutes", "roles": ["aux"], "function": "glutes.hip_ext", "exercises": ["Log Lift"],
  "zrodlaListy": ["SN-C4", "SN-C1"], "uwaga": "wyprost biodra w zarzucie kłody; bez fazy" },
{ "muscle": "abductors", "roles": ["aux"], "function": "abductors.pelvis_level", "exercises": ["Yoke Walk"],
  "zrodlaListy": ["SN-C1", "S27"], "uwaga": "utrzymanie miednicy w podporze jednonóż w chodzie z jarzmem" }
```

(Pole `zrodlaListy` — propozycja: zapis, dlaczego ćwiczenie jest na liście; jeśli schemat go nie przewiduje, przenieść do `uwaga`.)

Pominięte z powodem (do `pominiete` przy regule Log Lift): `"Circus Bell": "brak źródła o tym ćwiczeniu — analogia do kłody"`.

## Otwarte

- [OTWARTE] Circus Bell — pośladki: źródło o tym ćwiczeniu.
- [OTWARTE] Yoke Walk — brzuch (drugie niezależne źródło), czworogłowe, pośladki, górna część pleców, prostowniki w chodzie.
- [OTWARTE] Conan's Wheel — wszystkie regiony.
- [OTWARTE] Górna część pleców w podnoszeniu kamienia, beczki, worka i przewracaniu opony.
- [OTWARTE] SN-C4 — przeczytać korektę (10.1186/s40798-020-0239-3) i resztę strony (powyżej 100 000 znaku), zanim reguła trafi do aplikacji.
