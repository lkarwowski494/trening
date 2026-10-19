#!/usr/bin/env bash
# Strażnik uprawnień (14.10.2026, błąd TestFlight 0.18/1015: „Nie udało się włączyć Apple Health”).
# Sprawdza, że podpisany pakiet (.app) ma WSZYSTKIE klucze uprawnień z pliku uprawnień celu z projektu natywnego (prebuild).
# Użycie: check-entitlements.sh <pakiet.app> <plik.entitlements> [etykieta] [lista-wymaganych.txt]
# Lista wymaganych (19.10.2026, powiadomienie „pilne”): klucze, które MUSZĄ być i w pliku uprawnień celu, i w pakiecie — sam plik z prebuildu nie wystarcza,
# bo gdy prebuild zgubi uprawnienie, porównanie pakietu z plikiem przejdzie (lekcja L-001). Jeden klucz w wierszu, # = komentarz.
# Dodatkowo: get-task-allow=true w pakiecie dystrybucyjnym = błąd (Apple odrzuca taki upload). ENTITLEMENTS_XML=<plik> podstawia XML zamiast codesign (testy na Linuksie).
# Wypisuje TYLKO nazwy kluczy (bez identyfikatorów zespołu, UDID i wartości) — logi CI są publiczne. Kod wyjścia 1 = brak klucza.
set -u
APP="$1"; SRC="$2"; LABEL="${3:-$(basename "$APP")}"; REQ="${4:-}"
[ -d "$APP" ] || { echo "::error::$LABEL: brak pakietu $APP"; exit 1; }
[ -f "$SRC" ] || { echo "::error::$LABEL: brak pliku uprawnień $SRC"; exit 1; }
[ -z "$REQ" ] || [ -f "$REQ" ] || { echo "::error::$LABEL: brak listy wymaganych uprawnień $REQ"; exit 1; }
keys() { grep -o '<key>[^<]*</key>' | sed -e 's/<key>//' -e 's/<\/key>//'; }
XML=$(if [ -n "${ENTITLEMENTS_XML:-}" ]; then cat "$ENTITLEMENTS_XML"; else codesign -d --entitlements :- "$APP" 2>/dev/null; fi)
HAVE=$(echo "$XML" | keys | sort -u)
WANT=$(keys < "$SRC" | sort -u)
NEED=$([ -n "$REQ" ] && sed -e 's/#.*//' -e 's/[[:space:]]//g' "$REQ" | grep -v '^$' | sort -u)
for k in $NEED; do
  echo "$WANT" | grep -qx -- "$k" || { echo "::error::$LABEL: brak w pliku $(basename "$SRC") (prebuild) — wymagane $k (lista $(basename "$REQ"))"; rc_req=1; }
done
WANT=$(printf '%s\n%s\n' "$WANT" "$NEED" | grep -v '^$' | sort -u)
echo "$LABEL — klucze uprawnień w pakiecie:"; echo "$HAVE" | sed 's/^/  /'
rc=${rc_req:-0}
for k in $WANT; do
  echo "$HAVE" | grep -qx -- "$k" || { echo "::error::$LABEL bez uprawnienia $k (jest w $(basename "$SRC"), nie ma w podpisanym pakiecie)"; rc=1; }
done
echo "$XML" | tr -d ' \t\n' | grep -q '<key>get-task-allow</key><true/>' && { echo "::error::$LABEL ma get-task-allow=true (pakiet deweloperski, nie dystrybucyjny)"; rc=1; }
[ -n "$WANT" ] || { echo "::error::$LABEL: pusty plik uprawnień — nie ma czego sprawdzać"; rc=1; }
exit $rc
