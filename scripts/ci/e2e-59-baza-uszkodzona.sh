#!/usr/bin/env bash
# R-RES (docs/40, decyzja właściciela D8 wariant B, 29.10.2026): dowód na symulatorze, że kopia ratunkowa plików bazy (lib/rescue.ts) naprawdę powstaje.
# Wywołuje ją krok eksperymentów w e2e-ios.yml zamiast `maestro test` dla scenariusza 59. Uruchomienie: e2e-59-baza-uszkodzona.sh <udid symulatora> <plik scenariusza> <katalog wyjścia>
# Kroki: 1) pierwszy start aplikacji (tworzy bazę w Library/SQLite), 2) zamknięcie, 3) pliki bazy zastąpione plikami nie-SQLite (kontener z `simctl get_app_container … data`),
# 4) scenariusz Maestro (ekran błędu startu → „Send data”), 5) sprawdzenie z powłoki: Documents/Backup/Rescue-… z kompletem plików o zawartości oryginałów, oryginały bez zmian.
# Repo publiczne: do logu trafiają tylko nazwy plików i rozmiary — nigdy ścieżka kontenera ani identyfikatory.
set -uo pipefail
SIM=${1:?udid symulatora}; FLOW=${2:?plik scenariusza}; OUT=${3:?katalog wyjścia}; APP=pl.lukasz.trening
mkdir -p "$OUT"
blad() { echo "::error::R-RES: $*"; { echo "### R-RES — kopia ratunkowa: PORAŻKA"; echo "$*"; } >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; exit 1; }

xcrun simctl terminate "$SIM" "$APP" 2>/dev/null || true
xcrun simctl launch "$SIM" "$APP" >/dev/null || blad "pierwszy start aplikacji nie powiódł się"
DATA=$(xcrun simctl get_app_container "$SIM" "$APP" data) || blad "brak kontenera danych aplikacji"
DB="$DATA/Library/SQLite/trening.db"
for _ in $(seq 1 60); do [ -s "$DB" ] && break; sleep 2; done
[ -s "$DB" ] || blad "po pierwszym starcie nie ma Library/SQLite/trening.db (aplikacja nie utworzyła bazy)"
sleep 5   # chwila na pierwszy zapis stanu; potem zamykamy aplikację
xcrun simctl terminate "$SIM" "$APP" || true
sleep 2
echo "Pliki bazy po pierwszym starcie (nazwa, rozmiar):"
for f in "$DB"*; do echo "  $(basename "$f") $(( $(wc -c < "$f") )) B"; done

# uszkodzenie: główny plik i pliki dziennika zastąpione tekstem 8 KiB (nie-SQLite); kopie wzorcowe pozwalają porównać zawartość kopii ratunkowej bajt po bajcie.
# Przebiegi 40838191401 i 40851520517: SQLite przy pierwszej (nieudanej) próbie otwarcia sam usuwa nieczytelne -wal i -shm — tylko trening.db jest wymagany w kopii,
# pliki dziennika sprawdzamy, jeśli przetrwały do „Send data” (ich kopiowanie na realnym SQLite w trybie WAL pokrywa Jest: tests/audit-m1-2026-10-27-004-ratunek.test.tsx).
for n in "" -wal -shm; do head -c 8192 /dev/zero | tr '\0' 'x' > "$DB$n"; done
rm -f "$DB-journal"
mkdir -p "$OUT/oczekiwane"
for n in trening.db trening.db-wal trening.db-shm; do cp "$DATA/Library/SQLite/$n" "$OUT/oczekiwane/$n"; done
rm -rf "$DATA/Documents/Backup"/Rescue-* 2>/dev/null || true

maestro --device "$SIM" test "$FLOW" --format junit --output "$OUT/report.xml" --test-output-dir "$OUT/maestro"
rc=$?

RES=$(ls -d "$DATA/Documents/Backup"/Rescue-* 2>/dev/null | tail -1)
[ -n "$RES" ] && [ -d "$RES" ] || blad "scenariusz Maestro zakończył się kodem $rc, a w Documents/Backup nie powstał folder Rescue-… (kopia ratunkowa nie działa na iOS)"
echo "Folder kopii ratunkowej: $(basename "$RES")"
echo "Pliki w folderze (nazwa, rozmiar):"
for f in "$RES"/*; do echo "  $(basename "$f") $(( $(wc -c < "$f") )) B"; done
bad=0
for n in trening.db trening.db-wal trening.db-shm; do
  if [ -f "$RES/$n" ]; then
    if cmp -s "$RES/$n" "$OUT/oczekiwane/$n"; then echo "  $n: zawartość identyczna z oryginałem (cmp)"; else echo "::error::R-RES: zawartość $n w kopii różni się od oryginału"; bad=1; fi
  elif [ "$n" = trening.db ]; then echo "::error::R-RES: w kopii brak pliku $n"; bad=1
  else echo "  $n: brak w kopii (plik usunięty przez SQLite przy próbie otwarcia, jeszcze przed „Send data”)"; fi
done
cmp -s "$DATA/Library/SQLite/trening.db" "$OUT/oczekiwane/trening.db" || { echo "::error::R-RES: oryginał trening.db zmieniony (kopia ma być tylko odczytem)"; bad=1; }
{
  echo "### R-RES — kopia ratunkowa plików bazy na symulatorze"
  echo "- Folder: \`$(basename "$RES")\` w Documents/Backup"
  for f in "$RES"/*; do echo "- \`$(basename "$f")\` $(( $(wc -c < "$f") )) B"; done
  echo "- Scenariusz Maestro (ekran błędu → Send data → okno z miejscem kopii): kod wyjścia $rc"
  echo "- Porównanie bajt po bajcie z oryginałami i brak zmian oryginałów: $([ $bad -eq 0 ] && echo zgodne || echo NIEZGODNE)"
} >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
[ "$bad" -eq 0 ] && [ "$rc" -eq 0 ]
