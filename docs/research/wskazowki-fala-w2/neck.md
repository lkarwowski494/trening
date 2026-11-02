# Wskazówki techniki — rodzina neck (fala W2, 02.11.2026)

Tylko zbieranie danych (bez zmian w `lib/`, `data/zrodla/`, testach). Podstawa: `wskazowki-fala-w1/neck.md` (po uzupełnieniu 2).
Szyja nie ma póz figur v2 — karta częściowa (bez błędu) też może wejść. Szyja = obszar wrażliwy: bez czasów, obciążeń i ostrzeżeń
zdrowotnych (aplikacja nie daje porad medycznych; ból, zawroty — do specjalisty).

## 1. Tabela ćwiczeń

| klucz katalogu | stan | zdania | uwagi |
|---|---|---|---|
| Isometric Neck Exercise - Sides | gotowe (W1, bez zmian) | 3 (setup, move, mistakes) | ma błąd `neck.iso.mis.headMoves` (W1) — nic do dopisania |
| Isometric Neck Exercise - Front And Back | gotowe (W1, bez zmian; tylko przód) | 3 | ma błąd `neck.iso.mis.headMoves` (W1); tył wstrzymany (W1, otwarte 2) |
| Lying Neck Extension (talerz) | otwarte | 0 | W2: brak przeczytanego źródła szczebla ≥ 4 (p. 5) |
| Lying Neck Flexion (talerz) | otwarte | 0 | jw. |
| Neck Harness Extension | otwarte | 0 | W2: nadal jeden producent (Iron Neck, 2 artykuły = jedno źródło), pozycja wyjściowa niespójna między nimi |

## 2. Blok do wdrożenia

### Blok do wdrożenia

```json
{}
```

Brak nowych pozycji: obie izometrie mają już ustawienie, ruch i błąd w bloku W1; ćwiczenia z talerzem i uprzężą — otwarte.

## 3. Nowe zdania

Brak.

## 4. Źródła (przeczytane w W2)

| id | adres | organizacja | szczebel | miejsce i wynik |
|---|---|---|---|---|
| ironneck-weights | https://www.iron-neck.com/blogs/articles/neck-exercises-with-weights-progressive-overload (07.04.2026, akt. 30.07.2026; czytane 02.11.2026) | Iron Neck (producent sprzętu do treningu szyi) | 4 tylko dla własnego sprzętu; bez autora — „Reviewed By: Iron Neck” | ćwiczeń z talerzem w leżeniu nie opisuje; uprząż: „Sit on the edge of a bench or stand with a slight forward lean.” (przy zginaniu, wyprost „tak samo”) — ta sama organizacja co `ironneck-harness` z W1 → nie drugie źródło |
| conley-1997 | https://pubmed.ncbi.nlm.nih.gov/9189733 (czytane 02.11.2026) | Conley MS i in., Eur J Appl Physiol 1997 | 3 | abstrakt: tylko „three sets of ten repetitions of a head extension exercise” — bez opisu wykonania (nie nadaje się na wskazówkę) |

Próby nieudane (02.11.2026): iron-neck.com „how-to-use-a-neck-harness” — 404; Rogue „Product Guide Spud Inc Neck Harness” — 403; elitefts (artykuł o uprzęży z J. Bryantem) — 404;
DTIC ADA497309 — 403; PMC2938315 (Almosnino i in. 2010) — tylko test izometryczny w urządzeniu, bez ćwiczeń; wyszukiwania „lying neck extension plate” i „nsca neck” — wyłącznie
serwisy konsumenckie, strony aplikacji i sklepy (nie źródło).

## 5. Otwarte

1. **Lying Neck Extension / Flexion (talerz)** — brak źródła szczebla ≥ 4: organizacje szkolące trenerów (ACE, NASM, ISSA, NSCA) nie mają przeczytanego hasła; producent talerzy nie opisuje ćwiczeń szyi; Iron Neck nie jest producentem talerzy. Kandydaci: NSCA „Exercise Technique Manual” (szczebel 3 — wystarczyłoby jedno przeczytane źródło jako „jedno źródło”), materiały federacji zapaśniczych/rugby z autorem, badania z opisem protokołu w metodach (pełny tekst).
2. **Neck Harness Extension** — Iron Neck (2 artykuły, jedna organizacja); RDX/DMoose odrzucone w W1. Kandydaci: instrukcja producenta uprzęży (oryginał, nie kopia u sprzedawcy), pełny tekst Conley 1997 (metody — szczebel 3).
3. **Izometrie — z W1 bez zmian:** tył „Front And Back”, pozycja wyjściowa głowy (sprzeczność NHS CHT vs HealthLink BC/NCM), siła docisku, czasy — otwarte; dwa trusty NHS jako dwie organizacje — do potwierdzenia przez koordynatora.

## 6. Stan

- Zrobione: sprawdzenie bloków izometrii (mają błąd), nowe próby źródeł dla talerza i uprzęży (bez skutku).
- Zostało: p. 5.
- Następny krok: książka szczebla 3 (NSCA ETM) — dostęp poza narzędziem WebFetch; pełne teksty badań z protokołem ćwiczeń z talerzem/uprzężą.
- Pułapki: wyszukiwarka dla ćwiczeń szyi zwraca prawie wyłącznie aplikacje i sklepy; Iron Neck — kilka artykułów, jedna organizacja.
