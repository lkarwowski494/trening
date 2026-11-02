# Role mięśni — rodzina `hip_bridge` (luka: London Bridges)

Data: 02.11.2026 · autor: badacz-merytoryczny · **Status: PROPOZYCJA — dane do integracji przez koordynatora linii 1.1**

## Luki

| Ćwiczenie | Mięśnie (katalog, `muscleLoad`) | Rola | Wynik |
|---|---|---|---|
| London Bridges | lats 1, forearms 1 | main | **otwarte** |
| London Bridges | biceps 0,5, upper_back 0,5, abs 0,5 | aux | **otwarte** |

## Ustalenia

- Czym jest ćwiczenie (katalog `docs/research/equipment/catalog.json`, „London Bridges”, pole `note`): stoisz na zablokowanej sztandze
  Smitha lub skrzyni i schodzisz rękami po zwisającej linie do poziomu, potem wracasz. `pattern: other`, `confidence: low`,
  research: „brak źródła — uproszczenie”. To ćwiczenie chwytu i przyciągania na linie, **nie mostek biodrowy** — przypisanie do
  rodziny `hip_bridge` wygląda na błąd (zgłoszone też w `docs/research/wskazowki-fala-w1/hip_bridge.md`).
- `withoutRole.wzorce` zawiera `other` świadomie (rodzina mieszana). Reguła po nazwie (`nameRules`) wymaga ≥ 2 przeczytanych źródeł
  szczebla 2–3 o funkcji mięśnia w TYM ruchu. Nie znaleziono żadnego przeczytanego źródła o London Bridges powyżej szczebla 5
  (wyniki wyszukiwania: kopie baz ćwiczeń bez autora i strony aplikacji — nieczytane jako źródła, nazw nie zapisano).
- W `role-miesni.json` nie ma funkcji chwytu dla `forearms` (są tylko `wrist_flex` i `wrist_ext` w `nameRules`) — nawet przy opisie
  ćwiczenia rola przedramion wymagałaby nowej funkcji („zaciskanie palców / chwyt”) z własnymi źródłami anatomicznymi.

## Propozycje

Brak (blok JSON pusty).

```json
{}
```

## Otwarte

| Luka | Powód | Co by rozstrzygnęło |
|---|---|---|
| London Bridges — wszystkie role | brak przeczytanego źródła opisującego ćwiczenie (szczebel ≥ 4) i źródeł roli (szczebel 2–3); `other` w `withoutRole.wzorce` | najpierw decyzja o rodzinie (nie `hip_bridge`); potem źródła biomechaniczne o zejściu po linie (np. analogia do podciągania — wtedy oznaczenie „uproszczenie”) |
| forearms — funkcja chwytu | brak funkcji w `functions` | 2 źródła anatomiczne (np. OpenStax: zginacze palców) i decyzja, czy chwyt pokazywać jako rolę |
