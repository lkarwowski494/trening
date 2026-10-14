#!/usr/bin/env bash
# Strażnik uprawnień (14.10.2026, błąd TestFlight 0.18/1015: „Nie udało się włączyć Apple Health”).
# Sprawdza, że podpisany pakiet (.app) ma WSZYSTKIE klucze uprawnień z pliku uprawnień celu z projektu natywnego (prebuild).
# Użycie: check-entitlements.sh <pakiet.app> <plik.entitlements> [etykieta]
# Wypisuje TYLKO nazwy kluczy (bez identyfikatorów zespołu, UDID i wartości) — logi CI są publiczne. Kod wyjścia 1 = brak klucza.
set -u
APP="$1"; SRC="$2"; LABEL="${3:-$(basename "$APP")}"
[ -d "$APP" ] || { echo "::error::$LABEL: brak pakietu $APP"; exit 1; }
[ -f "$SRC" ] || { echo "::error::$LABEL: brak pliku uprawnień $SRC"; exit 1; }
keys() { grep -o '<key>[^<]*</key>' | sed -e 's/<key>//' -e 's/<\/key>//'; }
HAVE=$(codesign -d --entitlements :- "$APP" 2>/dev/null | keys | sort -u)
WANT=$(keys < "$SRC" | sort -u)
echo "$LABEL — klucze uprawnień w pakiecie:"; echo "$HAVE" | sed 's/^/  /'
rc=0
for k in $WANT; do
  echo "$HAVE" | grep -qx -- "$k" || { echo "::error::$LABEL bez uprawnienia $k (jest w $(basename "$SRC"), nie ma w podpisanym pakiecie)"; rc=1; }
done
[ -n "$WANT" ] || { echo "::error::$LABEL: pusty plik uprawnień — nie ma czego sprawdzać"; rc=1; }
exit $rc
