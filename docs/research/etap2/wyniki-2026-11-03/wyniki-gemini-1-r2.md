# Weryfikacja Gemini, partia 1 — runda 2: strony aplikacji treningowych (03.11.2026)

Podstawa: decyzja właściciela 03.11.2026, wariant A (`docs/18-przekazanie.md:201`) — strony aplikacji treningowych
dopuszczone jako szczebel 5; nazwa firmy nie trafia do aplikacji ani do `data/zrodla` (identyfikator nieprzezroczysty).
Reguła kompletu: etap 2 (CLAUDE.md) — ustawienie i przebieg ruchu z 2 niezależnych źródeł szczebla 5, „czego unikać”
wnioskowane z ruchu; liczby i zdrowie pominięte. Wszystkie źródła tutaj = szczebel 5 → pozycje „otwarte” do recenzji
niezależnej (L-047), nie „gotowe”. Szczegóły, adresy i cytaty: `wyniki-gemini-1-r2.json`.

Przeczytano 23 adresy (22 z rundy 1 + julielohre.com/copenhagen-plank dla ustawienia i maniacmuscle.com/clock-push-up dla pary).
Nieczytelne (403): 3 — fitbod (Cocoons), skimble (Behind-the-Back Wrist Curl), fitwill (Barbell Rollout from Bench).
julielohre.com/frog-crunch — w r1 zablokowana, teraz czytelna.

## Zmiana statusu (15)

| Ćwiczenie | Było | Jest |
|---|---|---|
| Cable Y Raise | 1 źródło | komplet (setup, move) |
| Copenhagen Plank | 1 źródło | komplet (setup, move) |
| Crunch - Hands Overhead | 1 źródło | komplet (setup, move) |
| Decline Oblique Crunch | 1 źródło | komplet (setup, move) |
| Decline Reverse Crunch | 1 źródło | komplet (setup, move) |
| Drop Push | 1 źródło (słabe) | komplet (setup, move; jedno ze źródeł słabe) |
| Belt Squat Machine | 1 źródło | komplet warunkowo (setup: część wspólna; move: recenzent — zdanie drugiego źródła stoi w sekcji błędów) |
| Frog Sit-Ups | brak | komplet (setup, move) |
| Donkey Calf Raise | brak | move komplet; setup — uproszczenie (oparcie o ławkę zamiast maszyny), do potwierdzenia |
| Cable Fly (high to low) | 1 z 3 | komplet – uproszczenie (drugie źródło w wersji jednorącz), do potwierdzenia |
| Bosu Ball Cable Crunch With Side Bends | brak | 1 źródło |
| Butt-Ups | brak | 1 źródło (wariant zgodny z katalogiem) |
| Body-Up | brak | 1 źródło (tekst wygląda na lustro free-exercise-db) |
| Dynamic Back Stretch | brak | 1 źródło (zgodność z rysunkiem do sprawdzenia) |
| Fast Skipping | brak | 1 źródło (tekst wygląda na lustro free-exercise-db) |

Komplet (z warunkowymi): 10. Brak → 1 źródło: 5.

## Bez zmiany statusu
- Dragon Flag — już komplet; druga strona potwierdza powrót w górę (teraz 2 źródła) → zdanie move może objąć powrót.
- Clock Push-Up — [OTWARTE] dwie różne wersje (obrót ciała przez krzyżowanie rąk vs przestawianie jednej dłoni po „tarczy”); rozstrzyga rysunek.
- Cable Seated Crunch — druga strona opisuje tylko wersję w klęku → nie pasuje.
- Chain Handle Extension — strona opisuje prostowanie ramion z linką od sanek; [OTWARTE] czy to ćwiczenie z katalogu.
- Behind-the-Back Wrist Curl, Cocoons (1 źródło), Barbell Rollout from Bench (brak) — strona 403.

## Cytaty Gemini niezgodne ze stroną
- fitvibe (Cable Y Raise): angielski cytat to przekład Gemini; strona po grecku opisuje ten sam ruch — liczę cytat grecki.
- getwrkout (Chain Handle): Gemini skleił zdania z kroków 1 i 2.
- Decline Reverse Crunch (strona aplikacji): cytat „setup” dosłowny, ale nie opisuje ustawienia — użyty inny.
- Donkey Calf (druga strona): cytat z opisu, nie z instrukcji — użyty krok 1.
- Pozostałe sprawdzone cytaty — dosłowne.

## Otwarte pytania
- [OTWARTE] Body-Up, Fast Skipping: czy tekst to lustro free-exercise-db (wtedy przy parze nie łączyć z innym lustrem).
- [OTWARTE] Belt Squat: czy zdanie z sekcji błędów liczy się jako opis ruchu; różnica biodra/talia — w zdaniu bez miejsca pasa.
- [OTWARTE] Clock Push-Up, Chain Handle Extension, Dynamic Back Stretch: zgodność wariantu z rysunkiem.
- [OTWARTE] Plik `szczeble-organizacji-2026-11-02.md` nadal nie istnieje w repo (sprawdzone 03.11.2026) — szczeble przypisane: wszystkie 5.
- Nazwy firm z tego pliku nie mogą trafić do repo aplikacji ani `data/zrodla` (decyzja 03.11.2026; strażnik `tests/forbidden-names.json`, zakresu strażnika nie sprawdzałem).
