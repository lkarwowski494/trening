# overhead_press — role mięśni, fala W2 (badacz-merytoryczny, 02.11.2026)

Luki z W1 (`role-miesni-fala-w1/overhead_press.md`, pozycje „otwarte”): Push Press - Behind the Neck (quads), Landmine Linear Jammer
i Single-Arm Linear Jammer (quads), See-Saw Press (obliques). Wariant A: reguły po nazwie (`nameRules`). Funkcja `quads.knee_ext` istnieje (ustalone).

## Propozycje nameRules (x, m, o, f)

| x (ćwiczenie) | m (mięsień) | o (rola) | f (funkcja) | źródło | stan |
|---|---|---|---|---|---|
| Push Press - Behind the Neck | quads | aux | quads.knee_ext | catalyst-push-press-behind-the-neck — Description: „Dip by bending at the knees only…”, następnie „drive straight back up aggressively with the legs” (prostowanie kolan w samym ćwiczeniu zza karku) | **jedno źródło** (szczebel 4); W1G5-5 (Soriano i in., szczebel 3) opisuje wybicie ogólnie (wyprost bioder i kolan), bez wersji zza karku — tylko obok, nie liczy się jako drugie |

```json
{
 "nameRules": [
  {"muscle": "quads", "roles": ["aux"], "function": "quads.knee_ext", "exercises": ["Push Press - Behind the Neck"], "jednoZrodlo": true, "uwaga": "Catalyst #88 (Description): ugięcie tylko w kolanach i wybicie nogami; ta sama faza co Push Press (W1G5-5)"}
 ]
}
```

Status do decyzji koordynatora: „jedno źródło” — wg CLAUDE.md nie „ustalone”; wyświetlanie jak dla innych ról z jednym źródłem szczebla 4.

## Źródła
| id | adres | organizacja | szczebel | miejsce | odczyt |
|---|---|---|---|---|---|
| catalyst-push-press-behind-the-neck | https://www.catalystathletics.com/exercise/88/Push-Press-Behind-The-Neck/ | Catalyst Athletics (biblioteka ćwiczeń, firmowana) | 4 | Description (dip, drive, lockout) | 02.11.2026 |
| W1G5-5 | jak w pliku W1 | Soriano i in. | 3 | Introduction, s. 4 | W1 |

## Otwarte
- Landmine Linear Jammer, Single-Arm Linear Jammer (quads) — brak przeczytanego opisu jammera spoza sprzedawców (W1: Dynamo Fitness, szczebel 5, wersja bez pracy nóg). Nie szukałem w W2.
- See-Saw Press (obliques) — bez zmian: tylko EMG wyciskania jednorącz (S26), brak funkcji wprost; samo ćwiczenie bez ustalonej wersji (W1).

## Podsumowanie
Luk: 4 ćwiczenia; propozycje: 1 (jedno źródło); gotowe (ustalone): 0; otwarte: 3.
