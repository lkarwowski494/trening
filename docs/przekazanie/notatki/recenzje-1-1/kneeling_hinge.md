# Recenzja ruchu 1.1: rodzina kneeling_hinge (1 ćwiczenie), 27.10.2026

Metoda jak w `back_extension.md` (`origin/integracja-1-1` @ 4e5a7f95, zapisane pozy, PNG w pełnej rozdzielczości, liczby z silnika v2).

Walidator: **1/1 OK**. Błędów: 0.

## Wynik

| Ćwiczenie | Werdykt | Uwaga |
|---|---|---|
| Seated Good Mornings | OK z uwagą | Siedzi na skrzyni (blat 46 cm), miednica nieruchoma (0; 57,8). Golenie pionowo, kolano 78°. Sztanga na górze pleców (u = 0: 13 cm za barkiem, 2,6 cm niżej; u = 1: za i nad barkiem), podąża za tułowiem. Kręgosłup prosty (0°), skłon tylko w biodrze: 78° → 119°, tułów 2° → 44°. Chwyt ±32 cm, łokcie w dół. Uwagi A, B |

## OK z uwagą (backlog, nie blokuje)

- **A. Płytki skłon:** tułów kończy w 44° od pionu. Wskazówka `gm.depth` daje górną granicę „nie dalej niż do poziomu tułowia”, więc 44° jej nie łamie. W wersji siedzącej ruch zwykle prowadzi się jednak dalej, w stronę poziomu, bo kolana nie ograniczają skłonu. 60–70° lepiej pokazałoby ruch. Pewność 45% (brak przeczytanego źródła na liczbę, `[DO USTALENIA]`).
- **B. Błąd `mis.roundBack` niewidoczny w pierwszej klatce** (jak uwaga C w `row.md`): delta zgięcia kręgosłupa wynosi 0 / 4,1 / 13 / 21,9 / 26° w u = 0…1. Pierwsza klatka wiersza błędu jest identyczna z pozą poprawną. Pewność 60%.
