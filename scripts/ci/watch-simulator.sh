#!/usr/bin/env bash
# Wybiera i uruchamia symulator Apple Watch dla testów zegarka (watch-sim.yml, docs/35-zegarek-apple). Wypisuje TYLKO identyfikator symulatora na stdout
# (log CI jest publiczny — żadnych nazw maszyn ani numerów urządzeń poza tym jednym wynikiem, który workflow zapisuje do zmiennej).
# Użycie: UDID=$(bash scripts/ci/watch-simulator.sh [wzorzec_nazwy])   (domyślnie: „Apple Watch Series 1[0-9]” albo dowolny dostępny zegarek)
# Zmienne: DRY_RUN=1 — nie uruchamia symulatora (test w Jest na Linuksie podaje własny wynik `simctl list` w SIMCTL_LIST_JSON).
set -euo pipefail
PATTERN="${1:-Apple Watch Series 1[0-9]}"
if [ -n "${SIMCTL_LIST_JSON:-}" ]; then LIST=$(cat "$SIMCTL_LIST_JSON"); else LIST=$(xcrun simctl list devices available -j); fi
UDID=$(printf '%s' "$LIST" | node -e '
  const j = JSON.parse(require("fs").readFileSync(0, "utf8")); const pat = new RegExp(process.argv[1]);
  const rows = Object.entries(j.devices).filter(([rt]) => /watchOS/.test(rt)).flatMap(([rt, ds]) => ds.map(d => ({ ...d, rt })));
  const ver = rt => (rt.match(/watchOS-(\d+)-?(\d+)?/) || []).slice(1).map(x => Number(x || 0));
  const cmp = (a, b) => (ver(b.rt)[0] - ver(a.rt)[0]) || (ver(b.rt)[1] - ver(a.rt)[1]);
  const pick = rows.filter(d => pat.test(d.name)).sort(cmp)[0] || rows.sort(cmp)[0];
  if (!pick) { console.error("Brak symulatora watchOS (xcrun simctl list devices available)"); process.exit(1); }
  console.log(pick.udid);' "$PATTERN")
if [ -z "${DRY_RUN:-}" ]; then
  xcrun simctl boot "$UDID" >/dev/null 2>&1 || true
  xcrun simctl bootstatus "$UDID" -b >/dev/null 2>&1 || true
fi
printf '%s\n' "$UDID"
