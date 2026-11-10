# Wąskie gardła (WG)
| WG | Objaw | Pomiar | Przyczyna | Działanie | Ryzyko | Stan |
|---|---|---|---|---|---|---|
| WG-01 | dociąganie integracji do każdej gałęzi przed scaleniem | ≥ 5 razy w nocy, ~1 h każde (B2, partia-2, partia-3, A4a), integracja przesuwała się w trakcie | wspólne JSON/pliki generowane (pokrycie, recenzje, słowniki) | pociąg scaleń (KO-014) | bez zmian kontroli | wdrożone 10.11 00:10 |
| WG-02 | Jest część 3 > 20 min | 3 przebiegi z rzędu anulowane (42743654166, 42747133427, 42751102557) | podział plików po sha1 ścieżki (sumy 903/2114/2513/2929 s) | 5 części + sekwencer po czasie (KO-012) | bez zmian zestawu testów | w toku (scal/pociag-3) |
| WG-03 | verify:szybkie w kontenerze koordynatora ~1 h, SIGKILL z braku pamięci | 2× (55c9f206: 10 ponowień), maszyna przeciążona agentami | ciężkie komendy w kontenerze koordynatora | M9 E3: verify robią sesje, koordynator tylko odbiera | bez zmian | od M9 |
| WG-04 | agenci lokalni budzili się bez postępu / zatrzymywali przed końcem | pociąg-1: 3 raporty pośrednie bez postępu | polecenie bez „do końca” | polecenia „DO KOŃCA w jednym ciągu” | bez zmian | wdrożone |
