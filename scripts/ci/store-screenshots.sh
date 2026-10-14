#!/usr/bin/env bash
# Zrzuty ekranu iPhone'a do App Store Connect z symulatora (store-screenshots.yml; scenorys 9 ekranów zaakceptowany 14.10.2026 — docs/41). Wzór: watch-screenshots.sh.
# Dane pokazowe (zmyślone, scripts/screens/store-seed.test.ts) trafiają do aplikacji bez zmian w kodzie: przed każdym ekranem zapisujemy stan wariantu
# (trening / adapt / jasny / ciemny) w bazie aplikacji tak, jak robi to sama aplikacja (Library/SQLite/trening.db, tabela kv, klucz „state” — lib/state/db.ts,
# lib/state/boot.ts); pole __sklepRestLeft zamieniamy na koniec przerwy liczony od chwili zrzutu. Ekran otwiera łącze aplikacji (schemat „trening”,
# ścieżki expo-router); akcje (dotknięcie, przewinięcie, wybór pliku CSV) robi Maestro z scripts/ci/maestro-sklep/<akcja>.yaml. Zrzut: `simctl io screenshot`.
# W logu tylko nazwy plików i liczby (repo publiczne — bez identyfikatorów urządzeń).
# Użycie: bash scripts/ci/store-screenshots.sh <UDID> <katalog_wyjściowy> <katalog_danych> [języki po przecinku | all]
set -euo pipefail
UDID="$1"; OUT="$2"; DATA="$3"; LANGS="${4:-pl,en}"
BUNDLE="pl.lukasz.trening"; FLOWS="$(cd "$(dirname "$0")" && pwd)/maestro-sklep"
if [ "$LANGS" = "all" ]; then LANGS=$(ls "$DATA" | sed -n 's/^routes-\(.*\)\.json$/\1/p' | paste -sd, -); fi
mkdir -p "$OUT"
maestro_run() { command -v maestro >/dev/null 2>&1 || { echo "::warning::Brak Maestro — akcja $1 pominięta"; return 0; }
  maestro --device "$UDID" test "$FLOWS/$1.yaml" >/dev/null 2>&1 || echo "::warning::Akcja $1 nie powiodła się ($2)"; }
# Pasek stanu jak w materiałach Apple: stała godzina, pełna bateria i zasięg (bez nazwy operatora).
xcrun simctl status_bar "$UDID" override --time "9:41" --dataNetwork wifi --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100 >/dev/null 2>&1 || echo "::warning::Nie udało się ustawić paska stanu"
maestro_run przygotuj "zgody"
for lang in ${LANGS//,/ }; do
  ROUTES="$DATA/routes-$lang.json"
  [ -f "$ROUTES" ] || { echo "::warning::Brak danych dla języka $lang — pomijam"; continue; }
  mkdir -p "$OUT/$lang"
  i=0
  while IFS=$'\t' read -r name route variant action; do
    i=$((i + 1)); STATE="$DATA/state-$lang-$variant.json"
    [ -f "$STATE" ] || { echo "::warning::Brak stanu $lang-$variant — pomijam $name"; continue; }
    xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
    C=$(xcrun simctl get_app_container "$UDID" "$BUNDLE" data)
    mkdir -p "$C/Library/SQLite" "$C/Documents"; rm -f "$C/Library/SQLite/trening.db" "$C/Library/SQLite/trening.db-wal" "$C/Library/SQLite/trening.db-shm"
    node -e 'const fs=require("fs"); const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); if (s.__sklepRestLeft) { s.timer.restEndAt = Date.now() + s.__sklepRestLeft * 1000; delete s.__sklepRestLeft; } fs.writeFileSync(process.argv[2], JSON.stringify(s))' "$STATE" "$OUT/.state.json"
    python3 -I -c '
import sqlite3, sys
db = sqlite3.connect(sys.argv[1])
db.execute("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)")
db.execute("INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)", ("state", open(sys.argv[2], encoding="utf-8").read()))
db.commit(); db.close()' "$C/Library/SQLite/trening.db" "$OUT/.state.json"
    [ "$action" = import ] && [ -f "$DATA/trening-historia.csv" ] && cp "$DATA/trening-historia.csv" "$C/Documents/trening-historia.csv"
    xcrun simctl launch "$UDID" "$BUNDLE" >/dev/null
    sleep 8   # animacja startowa (tylko zimny start) i wczytanie danych
    [ "$route" = "/" ] || { xcrun simctl openurl "$UDID" "trening://${route#/}"; sleep 4; }
    [ -z "$action" ] || { maestro_run "$action" "$lang/$name"; sleep 1; }
    xcrun simctl io "$UDID" screenshot "$OUT/$lang/$(printf '%02d' "$i")-$name.png" >/dev/null 2>&1
  done < <(node -e 'for (const [n, r, v, a] of JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))) console.log([n, r, v, a || ""].join("\t"))' "$ROUTES")
done
rm -f "$OUT/.state.json"
xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
xcrun simctl status_bar "$UDID" clear >/dev/null 2>&1 || true
echo "Zrzuty: $(find "$OUT" -name '*.png' | wc -l | tr -d ' ') plików"
