#!/usr/bin/env bash
# Zrzuty ekranu iPhone'a do App Store Connect z symulatora (store-screenshots.yml; scenorys 9 ekranów zaakceptowany 14.10.2026 — docs/41). Wzór: watch-screenshots.sh.
# Dane pokazowe (zmyślone, scripts/screens/store-seed.test.ts) trafiają do aplikacji bez zmian w kodzie: przed każdym ekranem zapisujemy stan wariantu
# (trening / adapt / jasny / ciemny) w bazie aplikacji tak, jak robi to sama aplikacja (Library/SQLite/trening.db, tabela kv, klucz „state” — lib/state/db.ts,
# lib/state/boot.ts); pole __sklepSavedAt (chwila zapisu danych) przesuwa czasy treningu w toku i przerwy na chwilę zrzutu. Ekran otwiera łącze aplikacji (schemat „trening”,
# ścieżki expo-router); akcje (dotknięcie, przewinięcie, wybór pliku CSV) robi Maestro z scripts/ci/maestro-sklep/<akcja>.yaml. Zrzut: `simctl io screenshot`.
# W logu tylko nazwy plików i liczby (repo publiczne — bez identyfikatorów urządzeń).
# Zmienna EKRANY (po przecinku, np. „cwiczenie” albo „cwiczenie,plan”; pusta = wszystkie): tylko te ekrany, numeracja plików zostaje jak w pełnym scenorysie (02-cwiczenie.png) —
# powtórzenie jednego ekranu we wszystkich językach bez przebiegu całości (27.10.2026; podział języków na zadania: scripts/ci/store-shards.mjs).
# Zmienna UZUPELNIJ (katalog z zrzutami poprzedniego przebiegu dla tego rozmiaru: <język>/NN-ekran.png; pusta = jak dotąd; 29.10.2026, decyzja właściciela, wariant A): ekran, który ma tam
# niepusty plik, jest kopiowany do wyniku i NIE jest robiony od nowa — robimy tylko brakujące; pliki z .nieudane poprzedniego przebiegu leżą poza tym katalogiem (nie są gotowe),
# więc ekran idzie od nowa. Wynik zadania jest kompletem dla jego języków (ramki i asc-zrzuty biorą jeden przebieg). Podział zadań po brakujących ekranach: store-shards.mjs.
# Użycie: bash scripts/ci/store-screenshots.sh <UDID> <katalog_wyjściowy> <katalog_danych> [języki po przecinku | all]
set -euo pipefail
UDID="$1"; OUT="$2"; DATA="$3"; LANGS="${4:-pl,en}"
BUNDLE="pl.lukasz.trening"; FLOWS="$(cd "$(dirname "$0")" && pwd)/maestro-sklep"
if [ "$LANGS" = "all" ]; then LANGS=$(ls "$DATA" | sed -n 's/^routes-\(.*\)\.json$/\1/p' | paste -sd, -); fi
mkdir -p "$OUT"
maestro_run() { command -v maestro >/dev/null 2>&1 || { echo "::warning::Brak Maestro — akcja $1 pominięta"; return 0; }
  local log="$OUT/.maestro/${2//\//-}-$1"; mkdir -p "$log"   # dziennik i zrzut porażki Maestro w artefakcie (katalog z kropką — pomijany przez ramki)
  maestro_env "${2%%/*}"
  maestro --device "$UDID" test "$FLOWS/$1.yaml" ${ENVARGS[@]+"${ENVARGS[@]}"} --test-output-dir "$log" > "$log/maestro.log" 2>&1 || { echo "::warning::Akcja $1 nie powiodła się ($2)"; tail -5 "$log/maestro.log" | sed 's/^/    /'; return 1; }; }
# Teksty aplikacji w języku zrzutu (teksty-<język>.json z danych pokazowych) → zmienne scenariusza przez -e; znaki wyrażeń regularnych zakodowane (Maestro dopasowuje tekst jako regex).
maestro_env() {   # $1 = język; wynik w tablicy ENVARGS
  ENVARGS=(); local tf="$DATA/teksty-$1.json" l
  if [ -f "$tf" ]; then while IFS= read -r l; do ENVARGS+=(-e "$l"); done < <(node -e 'const t=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); for (const [k,v] of Object.entries(t)) console.log(k+"="+String(v).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"))' "$tf"); fi; }
# Jedno uruchomienie Maestro na ekran (101-24, 29.10.2026): dotąd „dialogi” → akcja → „dialogi” to 2–3 osobne uruchomienia (każde ok. 1 min na starcie sterownika XCTest na symulatorze
# macos-26; L-054: 2,7–3,5 min na ekran). Te same pliki akcji składamy w jeden przepływ (runFlow), więc kroki i zrzut są takie same, a sterownik startuje raz. Przepływ powstaje
# w katalogu dziennika (nazwa = akcja, np. import.yaml); ścieżki bezwzględne do plików w scripts/ci/maestro-sklep.
maestro_ekran() {   # $1 = akcja albo pusto, $2 = język/ekran
  command -v maestro >/dev/null 2>&1 || { echo "::warning::Brak Maestro — ekran $2 pominięty"; return 0; }
  local act="${1:-dialogi}" log="$OUT/.maestro/${2//\//-}-ekran"; mkdir -p "$log"
  { printf 'appId: %s\n---\n- runFlow: %s/dialogi.yaml\n- waitForAnimationToEnd\n' "$BUNDLE" "$FLOWS"
    [ -z "$1" ] || printf -- '- runFlow: %s/%s.yaml\n- waitForAnimationToEnd\n' "$FLOWS" "$1"
    printf -- '- runFlow: %s/dialogi.yaml\n' "$FLOWS"; } > "$log/$act.yaml"
  maestro_env "${2%%/*}"
  maestro --device "$UDID" test "$log/$act.yaml" ${ENVARGS[@]+"${ENVARGS[@]}"} --test-output-dir "$log" > "$log/maestro.log" 2>&1 || { echo "::warning::Ekran $2 (akcja ${1:-brak}) nie powiódł się"; tail -5 "$log/maestro.log" | sed 's/^/    /'; return 1; }; }
# Pasek stanu jak w materiałach Apple: stała godzina, pełna bateria i zasięg (bez nazwy operatora).
xcrun simctl status_bar "$UDID" override --time "9:41" --dataNetwork wifi --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100 >/dev/null 2>&1 || echo "::warning::Nie udało się ustawić paska stanu"
FAILED=""
shoot_screen() {   # jeden ekran: stan → uruchomienie → łącze → okna systemowe → akcja → zrzut; kod 1 = akcja Maestro nie powiodła się (zrzut byłby błędny, np. otwarte okno wyboru pliku zamiast podglądu importu)
  local ok=0
  xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
  C=$(xcrun simctl get_app_container "$UDID" "$BUNDLE" data)
  mkdir -p "$C/Library/SQLite" "$C/Documents"; rm -f "$C/Library/SQLite/trening.db" "$C/Library/SQLite/trening.db-wal" "$C/Library/SQLite/trening.db-shm"
  # trening w toku „teraz”: czasy treningu i przerwy przesunięte o czas od zapisu danych (__sklepSavedAt) — jak w chwili zapisu w danych pokazowych
  node -e 'const fs=require("fs"); const s=JSON.parse(fs.readFileSync(process.argv[1],"utf8")); const d = s.__sklepSavedAt ? Date.now() - s.__sklepSavedAt : 0;
    if (s.active && d) { for (const k of ["startedAt","createdAt","updatedAt"]) if (typeof s.active[k] === "number") s.active[k] += d; for (const e of s.active.exercises || []) for (const x of e.sets || []) if (typeof x.completedAt === "number") x.completedAt += d; }
    /* godzina startu spójna z zegarem 9:41 na pasku stanu: strefa treningu (tzOffsetMin, jak trening zaczęty w innej strefie) dobrana tak, by start = 9:41 − czas trwania */
    if (s.active && typeof s.active.startedAt === "number") { const now = Date.now(), u = new Date(s.active.startedAt), want = 9 * 60 + 41 - Math.round((now - s.active.startedAt) / 60000);
      let tz = ((want - (u.getUTCHours() * 60 + u.getUTCMinutes())) % 1440 + 1440) % 1440; if (tz > 840) tz -= 1440; s.active.tzOffsetMin = tz; }
    if (s.timer && typeof s.timer.restEndAt === "number" && d) s.timer.restEndAt += d; delete s.__sklepSavedAt; fs.writeFileSync(process.argv[2], JSON.stringify(s))' "$STATE" "$OUT/.state.json"
  python3 -I -c '
import sqlite3, sys
db = sqlite3.connect(sys.argv[1])
db.execute("CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)")
db.execute("INSERT OR REPLACE INTO kv (k, v) VALUES (?, ?)", ("state", open(sys.argv[2], encoding="utf-8").read()))
db.commit(); db.close()' "$C/Library/SQLite/trening.db" "$OUT/.state.json"
  [ "$action" = import ] && [ -f "$DATA/trening-historia.csv" ] && cp "$DATA/trening-historia.csv" "$C/Documents/trening-historia.csv"
  xcrun simctl launch "$UDID" "$BUNDLE" >/dev/null
  sleep 8   # animacja startowa (tylko zimny start) i wczytanie danych
  [ "$route" = "/" ] || { xcrun simctl openurl "$UDID" "trening://${route#/}"; sleep 2; }
  # „Open in …?” po łączu i pytanie o powiadomienia — zatwierdzone poza kadrem; akcja ekranu; ponowne „dialogi” tuż przed zrzutem (pytanie o powiadomienia przy treningu
  # w toku potrafi przyjść po pierwszym zatwierdzaniu: run 39181699626, 6.9 pl/01) — wszystko w jednym uruchomieniu Maestro
  maestro_ekran "$action" "$lang/$name" || ok=1; sleep 2
  xcrun simctl io "$UDID" screenshot "$OUT/$lang/$(printf '%02d' "$i")-$name.png" >/dev/null 2>&1
  return $ok
}
T0=$(date +%s); N=0; REUSED=0   # pomiar czasu na ekran — lekcja z 27.10.2026 (estymata 2 h zamiast zmierzonych ok. 16 h)
maestro_run przygotuj "zgody" || true
for lang in ${LANGS//,/ }; do
  ROUTES="$DATA/routes-$lang.json"
  [ -f "$ROUTES" ] || { echo "::warning::Brak danych dla języka $lang — pomijam"; continue; }
  mkdir -p "$OUT/$lang"
  i=0
  while IFS=$'\t' read -r name route variant action; do
    i=$((i + 1))
    if [ -n "${EKRANY:-}" ] && [[ ",$EKRANY," != *",$name,"* ]]; then continue; fi
    PREV="${UZUPELNIJ:+$UZUPELNIJ/$lang/$(printf '%02d' "$i")-$name.png}"
    if [ -n "$PREV" ] && [ -s "$PREV" ]; then cp "$PREV" "$OUT/$lang/" && REUSED=$((REUSED + 1)); continue; fi   # gotowy z poprzedniego przebiegu
    STATE="$DATA/state-$lang-$variant.json"
    [ -f "$STATE" ] || { echo "::warning::Brak stanu $lang-$variant — pomijam $name"; continue; }
    N=$((N + 1))
    # akcja ekranu (import CSV, wykres, przewinięcie) bywa zgubiona na wolnym symulatorze (przebieg 40487178778: pl/10-import z otwartym pustym oknem plików) — ekran powtarzamy raz;
    # drugi raz nieudany: zrzut do .nieudane (poza artefaktem sklepu, ramki go pomijają), ekran na liście w podsumowaniu przebiegu, powtórka: wejście ekrany
    if ! shoot_screen; then echo "::warning::Akcja ekranu $lang/$name nie powiodła się — ponawiam ekran"; shoot_screen || { FAILED="$FAILED $lang/$name"; mkdir -p "$OUT/.nieudane/$lang"; mv "$OUT/$lang/$(printf '%02d' "$i")-$name.png" "$OUT/.nieudane/$lang/" 2>/dev/null || true; }; fi
  done < <(node -e 'for (const [n, r, v, a] of JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))) console.log([n, r, v, a || ""].join("\t"))' "$ROUTES")
done
rm -f "$OUT/.state.json"   # dzienniki Maestro zostają w $OUT/.maestro
xcrun simctl terminate "$UDID" "$BUNDLE" >/dev/null 2>&1 || true
xcrun simctl status_bar "$UDID" clear >/dev/null 2>&1 || true
[ "$REUSED" -eq 0 ] || echo "Uzupełnienie: $REUSED ekranów z poprzedniego przebiegu (nie robione od nowa)"
echo "Zrzuty: $(find "$OUT" -name '*.png' | wc -l | tr -d ' ') plików"
if [ -n "$FAILED" ]; then M="Ekrany do powtórzenia (akcja nie powiodła się dwukrotnie):$FAILED"; echo "::warning::$M"; [ -z "${GITHUB_STEP_SUMMARY:-}" ] || echo "$M" >> "$GITHUB_STEP_SUMMARY"; fi
if [ "$N" -gt 0 ]; then SEK=$(( ($(date +%s) - T0) / N )); MSG="Pomiar: ${SEK} s na ekran (${N} ekranów, $(( $(date +%s) - T0 )) s łącznie) — podstawa szacunku czasu kolejnych przebiegów (scripts/ci/store-shards.mjs: PER_SCREEN_MIN)"; echo "$MSG"; [ -z "${GITHUB_STEP_SUMMARY:-}" ] || echo "$MSG" >> "$GITHUB_STEP_SUMMARY"; fi
