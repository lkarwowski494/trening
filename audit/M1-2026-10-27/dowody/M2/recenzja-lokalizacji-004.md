# Recenzja lokalizacji 004 — ekran błędu startu (components/StartError.tsx), 27.10.2026

Klucze: 1 = „Nie usuwaj aplikacji — … „Wyślij dane” …”, 2 = „Kopia bazy w Plikach”, 3 = „Pliki → Na moim iPhonie → {app} → Backup → {folder}. …”.
Przeczytane: 34 języki × 3 klucze (pt-BR i es-419: baza + nakładka). `npx jest tests/slownik-terminow.test.ts`: 109/109 zielone.
Znaczniki {app} {folder} wszędzie bez zmian; tekst przycisku w cudzysłowie = klucz „Wyślij dane” we wszystkich językach.

| język | klucz | obecnie | proponowane | powód |
|---|---|---|---|---|
| sl | 1 | „Pošlji podatke“ | »Pošlji podatke« | (d) w sl.json »…« 89×, „…“ 20× |
| lv | 1 | „Sūtīt datus” | “Sūtīt datus” | (d) w lv.json “…” 90×, „…” 18× |
| da | 1 | »Send dataene« | “Send dataene” | (d) w da.json “…” 85×, »…« 18× (wybór spójności z plikiem) |
| pt-BR | 1 | «Enviar dados» | “Enviar dados” | (c/d) w Brazylii “…”, «» to zapis europejski; to samo w 78 innych tekstach nakładki — osobne zadanie |
| fi | 1 | Älä poista appia | Älä poista sovellusta | (b) w fi.json wszędzie „sovellus”, „appi” tylko tu (recenzja 07.10 usunęła „Apin”) |
| sr | 3 | Сачувајте овај фолдер | Сачувајте ову фасциклу | (b) w sr.json „фасцикла” 8×, „фолдер” tylko tu |
| uk | 3 | Збережіть цю теку | Збережіть цю папку | (b) w uk.json „папка” 7×, „тека” tylko tu |
| el | 2 | Αντίγραφο της βάσης στα Αρχεία | Αντίγραφο της βάσης δεδομένων στα Αρχεία | (b) samo „βάση” niejasne |
| ja | 3 | このフォルダはiPhoneの外に… | このフォルダをiPhoneの外に… | (b) polecenie z を jak w kluczu 1 (ファイルを) |
| ja | 2 | 「ファイル」内のデータベースコピー | 「ファイル」にあるデータベースのコピー | (b) „データベースコピー” sztuczny złożony rzeczownik; do sprawdzenia przez native speakera |
| zh-Hant | 1 | 不要刪除 App， | 請不要刪除 App， | (b) ton: to samo zdanie ma dalej 請先, bez 請 brzmi szorstko |
| lt | 3 | Failai → Mano iPhone | „Failai“ → Mano iPhone | (b) spójnie z istniejącymi kluczami 4/5 („Failai“ w cudzysłowie) |
| es | 1 | se irán con ella tus datos y copias | con ella se borran tus datos y copias de seguridad | (b) samo „copias” niejasne; es.json używa „copia de seguridad” |
| fr | 1 | avec elle disparaissent vos données et sauvegardes | vos données et sauvegardes disparaîtront avec elle | (b) inwersja książkowa |

Bez poprawek: bg, cs, de, et, hr, hu, id, it, ko, ms, nb, nl, pt, ro, ru, sk, sv, tr, vi, es-419.
Wątpliwości tłumacza: da „Filer” poprawne (aplikacja iOS), „Arkiver” nie; hr i sr „…” spójne z plikiem; tr „Dosyalar’da” — apostrof przed przyrostkiem nazwy własnej poprawny; ko ton poprawny.
Poza zakresem (istniejące klucze, niespójne między sobą): fi „Omassa iPhonessa” (klucz „Automatyczna kopia…”) vs „Omalla iPhonella” (2×); pt-BR „No Meu iPhone” vs „No meu iPhone” (3×); vi „Trên iPhone của tôi” vs „Trên iPhone” (3×) — pytanie do native speakera: która forma jest w aplikacji Pliki w iOS?
