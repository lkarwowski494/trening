# Z-02 — recenzja lokalizacji 1.0 (recenzent-lokalizacji, 27.10.2026)

Zakres: gałąź `z02-przeklad-1-0`, commity `cf27efb7` (17 tekstów) i `125b5bc2` (poprawki nieblokujące). Tylko odczyt; testów nie uruchamiano (maszyna przeciążona) — zgodność ze słownikiem sprawdzona skryptem na wzorcach z `docs/lokalizacja/slownik-terminow.json` (terminy zakazane: 0 trafień w zmienionych tekstach). Kontekst ekranów z kodu (np. `app/more/import.tsx:43–74`, ekran zakupu, `app/_layout.tsx`).

## Wynik w skrócie
- `cf27efb7`: 17/17 poprawnych. Ścieżki „Więcej → Miejsca i sprzęt” zgodne z etykietami zakładki i ekranu w cs, hu, ro, sr, tr, pt-BR (pt-BR dziedziczy z pt „Mais → Locais e equipamento”). „Konto Apple” spójne na całym ekranie zakupu w de, fr, it, pt, ru. el i ro w formie formalnej jak reszta.
- `125b5bc2`: 47/48 poprawnych (rejestr ujednolicony zgodnie z docs/16, warianty es-419/pt-BR poprawne). Jeden błąd zgodności ze słownikiem (id), poniżej.

## Poprawki

| język | klucz (PL) | jest | proponowane | powód | waga |
|---|---|---|---|---|---|
| id | Ćwiczenia dopasowane do Twoich: {n} | Latihan yang cocok dengan milik Anda: {n} | Gerakan yang cocok dengan gerakan Anda: {n} | (a) słownik: ćwiczenie = „gerakan”, „latihan” = trening; na podglądzie importu stoi pod „Sesi latihan yang akan ditambahkan: {n}”, więc czyta się jak „pasujące treningi” | **blokuje 1.0** (niezgodność ze słownikiem, błąd znaczenia) |
| id | Nowe ćwiczenia: {n} (ten sam ekran, poza diffem) | Latihan baru: {n} | Gerakan baru: {n} | (a) jw.; obok „Gerakan baru” (l. poj.) na liście | nie blokuje — zalecane razem z wierszem wyżej |
| id | Ćwiczenia z pliku (ten sam ekran, poza diffem) | Latihan di file | Gerakan di file | (a) jw. | nie blokuje — zalecane razem |
| de | „…Apple-Account…” (4 teksty ekranu zakupu i kopii, w tym 2 z cf27efb7) | Apple-Account / Apple-Accounts | Apple Account / Apple Accounts (bez łącznika) | (b) Apple w iOS po niemiecku pisze „Apple Account”; dziś spójne w aplikacji | nie blokuje; do sprawdzenia przez native speakera |
| el | Trenuj {n} dni w miesiącu za darmo… | Το Pro αίρει το όριο. | Με το Pro δεν υπάρχει όριο. | (b) „αίρει” brzmi urzędowo | nie blokuje; średnia |

## Pozostałości z notatki Z02-lokalizacja pkt 3 (pewność „wysoka”), nienaniesione
| język | klucz / plik | jest | proponowane | waga |
|---|---|---|---|---|
| lt | Siła bez obciążenia zewnętrznego… | …čia nepadarysi… | …čia nepadarysite… | nie blokuje (rejestr) |
| el | `locales/el.json` (okno zgody Zdrowia na iPhonie): NSHealthShareUsageDescription, NSHealthUpdateUsageDescription | ρολόι σου, πρόγραμμά σου | ρολόι σας, πρόγραμμά σας | nie blokuje; po `125b5bc2` cała aplikacja el jest formalna, a okno zgody iOS zostało w „εσύ” |

Poza zakresem (mieszany rejestr w jednym zdaniu, istniejące, tanie): cs/sk „Místo pro {a} – {b}. Vyberte vybavení, které tam **máš** — …” (2 klucze w każdym języku → „máte”); lt „Bakstelėkite planą, kad **pakeistum**…” → „pakeistumėte”; id zgoda Zdrowia zegarka „perangkat**mu**” → „perangkat Anda”. Nie blokują 1.0.

## Liczba zmian w 125b5bc2
- W `lib/locales/*.json`: **48** zmian klucz×język (cs 3, el 7, es-419 4 nowe, hu 1, id 9, lt 4, lv 1, pt-BR 2, pt 1, ro 1, sk 2, sr 6, tr 6, uk 1) — zgodnie z tabelą Z02-49 (48 wierszy).
- Plus 1 linia w `targets/watch-app/pt-BR.lproj/InfoPlist.strings` — generowana kopia wiersza 31 (pt-BR „salva no Apple Health”), nie osobna decyzja przekładu. Razem 49 zmienionych tekstów w plikach.
- Uwaga: liczba „49” pochodzi już z `06c9aced`, który pliku zegarka nie zawierał, więc zgodność z InfoPlist jest przypadkowa. Notatka pkt 3 ma 52 pozycje „wysoka” klucz×język; 48 naniesiono, el „Trening z {d} {s}…” (βρείτε) weszło już w `cf27efb7` (tekst źródłowy zmieniony), a 3 nie weszły (lt „Siła bez obciążenia”, el InfoPlist ×2 — tabela wyżej). „49” to najpewniej 48 + el „Trening z {d} {s}” policzone podwójnie; tego nie da się potwierdzić z historii.

## Słownik — do dopisania (koordynator, z testem)
- **es-419 „trening”**: słownik ma `zalecany: "Entreno"`, a docs/16 i notatka Z-02 mówią, że „entreno” w es-419 jest hiszpańskie (Hiszpania); tekst efektywny es-419 ma „entrenamiento” 179 razy i „entreno” 4 razy. Propozycja: es-419 `zalecany: "Entrenamiento"`, `zakazane: entreno` (powód: kolokwializm hiszpański, w Ameryce Łacińskiej „entrenamiento”). Najpierw sprawdzić te 4 wystąpienia.

## Pytania do native speakerów
1. de: czy w aplikacji pisać „Apple Account” (jak Apple), czy „Apple-Account” (pisownia złożeń)?
2. el: czy „Με το Pro δεν υπάρχει όριο” brzmi naturalniej niż „Το Pro αίρει το όριο”?

Podsumowanie: przeczytano 65 tekstów (17 + 48) i 1 linię pliku zegarka; 5 poprawek (1 blokuje 1.0: id), 3 pozostałości z notatki, 1 zmiana słownika, 2 pytania.
