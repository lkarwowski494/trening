# Plan audytu M1 — Trening — 2026-10-27
Commit: 025a50b96f504ea9d16d573720d1e92dc951a103 (main, build TestFlight 1.0 (1031)) · Etap: TestFlight, przed zgłoszeniem 1.0 do App Store; użytkownicy: tylko testerzy · Wariant: **głęboki** (polecenie właściciela 27.10; potwierdzam: dane, pieniądze, treści krytyczne techniki) · Subagenci: narzędzie Agent, do 4 naraz (maszyna współdzielona, 4 rdzenie)

## Bramka opłacalności
Istniejący wynik (docs/monetyzacja.md, „Bramka W0”, 21.10.2026 + dopisek DEC-07 K8 23.10.2026): próg 500 USD netto/rok (decyzja właściciela 21.10, = D-024). Model M5 S1 (od 22.10): normalny ok. 471 USD/rok przy prowizji 15%, ok. 388 USD przy 30% — **poniżej progu, model wybrany świadomie przez właściciela** (22.10); pesymistyczny ok. 4 USD, optymistyczny ok. 23 tys. USD (liczone dla modelu z 19.10). Punkt kontrolny: 8 tygodni po premierze (≥ ok. 310 pobrań/mies. albo ≥ 75 płacących/rok). Wynik ma < 1 rok; model zmienił się 22.10, ale rachunek M5 S1 jest w dopisku 23.10 → propozycja: **użyć ponownie (MON-18)**, bez odświeżenia (oszczędność 0,2–0,4 mln tokenów). Odświeżenie tylko na życzenie właściciela.

## Linia bazowa (5 zdań)
Kategoria dojrzała: trzy alternatywy czytane dziś mają 4,9–5,0★ i ceny 14,99–499,99 zł; skargi dotyczą zegarka (dublowane serie), znikającej historii i limitów darmowej wersji. Najlepsza w klasie aplikacja nie traci historii, pokazuje cenę równą pobieranej, działa przy największym tekście i na zegarku, a liczby i wskazówki techniki ma ze źródeł. Trening różnicuje się offline/bez konta, niską ceną i planem dożywotnim. Sygnały z telefonu dotykają LB-02 (waluta USD vs pobranie w PLN, brak nazwy posiadanego planu), LB-04 (ucięte ikony przy największym tekście) i LB-10 (decyzja bez wdrożenia/testu). Szczegóły: K/linia-bazowa.md (12 punktów LB-01…LB-12).

## Role
| Rola | Status | Moduły | Partia | Tokeny (od–do) | Czas |
|---|---|---|---|---|---|
| soczewki E0b ×5 | uruchomić (wariant głęboki: 4–5) | — | 1 | 0,4–0,7 mln | 20–40 min |
| 01-odkrywanie | uruchomić (funkcje i obietnice) | dotyczące | 1 | 0,25–0,5 mln | 40–70 min |
| 02-monetyzacja | uruchomić (zakupy; bramka ponownie użyta) | dotyczące | 1 | 0,3–0,6 mln | 40–80 min |
| 03-zakres | uruchomić | dotyczące | 1 | 0,25–0,5 mln | 40–70 min |
| 06-tresci | uruchomić (technika, e1RM, rejestr twierdzeń; treści w tym repo) | dotyczące | 2 | 0,4–0,9 mln | 60–120 min |
| 09-lokalizacja | uruchomić (35 języków) | dotyczące, próbkowanie języków | 2 | 0,4–0,9 mln | 60–120 min |
| 10-wydanie | uruchomić (przygotowanie do sklepu) | dotyczące | 2 | 0,3–0,6 mln | 40–80 min |
| 11-wzrost | uruchomić (plan startu) | dotyczące | 2 | 0,2–0,4 mln | 30–60 min |
| 04-studio-projektowe | uruchomić (ekrany; dostępność — T-04) | dotyczące | 3 | 0,3–0,7 mln | 50–100 min |
| 05-architekt | uruchomić (SQLite, migracje, kopia) | dotyczące | 3 | 0,4–0,8 mln | 60–100 min |
| 08-programista | uruchomić | dotyczące | 3 | 0,4–0,8 mln | 60–100 min |
| 12-niezawodnosc | uruchomić (dane na urządzeniu) | dotyczące | 3 | 0,3–0,7 mln | 50–90 min |
| 02-monetyzacja-b | drugi niezależny przebieg (głęboki): pieniądze — waluta, stan po zakupie, decyzje docs/18 o paywallu | dotyczące | 3 | 0,3–0,6 mln | 40–80 min |
| 07-jakosc | uruchomić, sama (pełne testy, macierz, przepływy) | dotyczące | 4 | 0,4–0,9 mln | 60–120 min |
| weryfikacja przeciwna | P0, P1 + P2 w obszarach krytycznych; grupy po ≤5 | — | 5 | 0,6–1,5 mln (4–8 grup) | 30–60 min |
| M1 (E0–E3, scalanie, raport, plan napraw) | — | plan-napraw | całość | 0,6–1,2 mln | 1–2 h |

Szczególny nacisk (koordynator): zgodność kodu z KAŻDĄ decyzją właściciela w docs/18 — przekazuję 02, 03, 08 i 07 jako zakres (tabela decyzja → kod → test); kolejność planów na paywallu = decyzja 27.10 (nie znalezisko), luka „decyzja bez testu” do oceny. Waluta na ekranie zakupu: 02 i 02-b oceniają ryzyko produkcyjne i rozstrzygnięcie.

## Partie
1: soczewki + 01, 02, 03 (dokumenty, sklep) · 2: 06, 09, 10, 11 · 3: 04, 05, 08, 12, 02-b · 4: 07 sama (pełne testy jednym wątkiem) · 5: weryfikacja przeciwna. Maks. 4 subagenty naraz; partie 1 i 2 mogą się zazębiać (4 naraz).

## Koszt razem
Tokeny: **ok. 5,5–11 mln** (bez bramki: ponownie użyta). Założenia: rachunek z wzorców (Piekarz 7,0 mln przy planie 1,8–7,2); materiał ról przycięty (słowniki 35 języków i catalog.generated.ts tylko próbkowane). Próg przekroczenia: 1,5 × 11 = 16,5 mln → STOP wyjątkowy. Punkt kontrolny po partii 1: **nie** (nie pierwszy M1 repo: audyt M1 21–22.10, DEC-01…27) — opcja, jeśli właściciel chce.
Czas agenta: ok. **5–8 h** zegarowo (partie po kolei, w partii równolegle). Oczekiwanie: brak buildów i macOS (patrz niżej). Czas właściciela: STOP 1 (ok. 10 min + zgoda na dostęp do biblioteki prompts, 2 min), STOP 2 (ok. 30 min decyzji); opcjonalnie krok z telefonu w sprawie waluty (ok. 10 min, niżej).

## Poza zakresem i niesprawdzalne tu; kroki właściciela w trakcie
- Brak macOS/Xcode: natywne moduły (Live Activity, zegarek, HealthKit, StoreKit) tylko z kodu i testów + wyniki z telefonu 27.10. **Workflowów macOS nie planuję** (E2E pakiet podstawowy biegł na main 27.10; limit maszyn). Wyjątek do zgody: jeden przebieg `e2e-ios.yml` `tylko_scenariusze` dla scenariuszy dużego tekstu, jeśli 04 zgłosi znalezisko wymagające dowodu na symulatorze.
- Dysk Google (rejestr decyzji, research konkurencji): brak dostępu w tej sesji → 06 i 02 opierają się na repo; czego nie da się sprawdzić — „nie sprawdzono”.
- Animacje ćwiczeń: bramka 4 (recenzja ruchu) — rola 06 sprawdza, czy rodziny `ready` mają recenzję; samej recenzji ruchu klatka po klatce nie wykonuje (osobny proces).
- Krok właściciela (opcjonalny, przyspiesza ocenę waluty): na telefonie testerki Ustawienia → Programista → Sandbox Apple Account — czy zalogowane i jaki region.
- **Blokada startu:** biblioteka `lkarwowski494/prompts` (assemble.mjs, prompty ról) jest prywatna; dołączenie do sesji (add_repo, tylko odczyt) zostało odrzucone przez automatyczny filtr uprawnień. Bez niej fan-out nie działa.

## Decyzja
(a) plan jak wyżej (rekomendacja) · (b) wariant standardowy: bez 02-b, 3 soczewki, weryfikacja tylko P0/P1 — ok. 4,5–9 mln, 4–6 h · (c) zmiany właściciela
