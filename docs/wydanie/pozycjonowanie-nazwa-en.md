# Nazwa EN — wariant właściciela a A (22.11.2026, dane E1 z tego dnia; mediana = mediana ocen pierwszej dziesiątki US / GB / AU / CA)

| Wariant | Nazwa (zn.) | Podtytuł (zn.) | Słowa kluczowe |
|---|---|---|---|
| W — właściciel | RepsGoat: Progressive Overload (30) | Gym Rest Timer & Log (20) | jak A, „notebook” → „tracker” (96 B) |
| A — STOP 2 | RepsGoat: Gym Rest Timer & Log (30) | Progressive overload tracker (28) | `workout,lifting,weight,strength,notes,notebook,diary,1rm,rpe,rir,sets,reps,barbell,dumbbell,watch` (97 B) |
| C — inny | RepsGoat: Progressive Overload (30) | Gym log & rest timer (20) | jak W (96 B) |

- Frazy: „gym rest timer” — 1. podpowiedź dla „rest t” w US i GB, mediana 8 / 1,5 / 0 / 0; „progressive overload” — 2. podpowiedź dla „progressive overload” (US, GB), mediana 4,5 / 1 / 0,5 / 1,5; obie do wygrania, RepsGoat dziś poza 200 na obu.
- W i A mają obie frazy w całości, w kolejności, w której ludzie je wpisują; różnią się tylko tym, która stoi w nazwie. C rozbija „gym rest timer” i stawia na „gym log” (mediana 804 / 881,5 — nie do wygrania).
- Powtórzenia: w W i A żadne słowo nie powtarza się między nazwą, podtytułem i słowami (kontrola jak `tests/store-metadata.test.ts:42-47`). W W „tracker” nie ma w polach widocznych, więc wchodzi do słów w miejsce „notebook” (fraza „progressive overload tracker” i „gym tracker”).
- Waga nazwy i podtytułu: Apple jej nie podaje. Strona „App Store search” (developer.apple.com/app-store/search/, odczyt 22.11.2026): „Search results are based on a number of factors, including text relevance (matches for your app’s title, subtitle, keywords, and primary category), as well as user behavior”. To, że nazwa waży więcej, to ocena praktyków, nie fakt Apple.
- Różnica W a A: „Rest timer” ma szerszy popyt (pierwsza podpowiedź już po 6 znakach), a „Progressive Overload” w nazwie mówi mniej, czym jest aplikacja, za to wyróżnia ją w wynikach. Na danych z E1 żaden z wariantów nie ma przewagi, którą da się wykazać.

**Rekomendacja:** przyjąć wariant właściciela W, ze słowem „tracker” w miejsce „notebook”. Jest równoważny z A na danych z E1, a wybór wagi nazwy należy do właściciela.
