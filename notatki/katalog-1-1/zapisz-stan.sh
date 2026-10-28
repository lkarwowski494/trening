#!/bin/bash
# Użycie: zapisz-stan.sh "linia stanu" [ZRODLO CEL_WZGLEDNY]...
# Dopisuje linię do docs/przekazanie/README.md na gałęzi przekazanie-konta (opcjonalnie kopiuje pliki/katalogi), commit + push pod blokadą.
# Wyjątek (koordynator 27.10): push --no-verify — gałąź przekazanie-konta to tylko dokumenty, bez node_modules, nie do scalania.
set -e
LINIA="$1"; shift
exec 9>/tmp/claude-0/przekazanie.lock; flock 9
cd /home/user/wt/przekazanie-konta
for i in 1 2 3 4; do git fetch -q origin przekazanie-konta && break; sleep $((2**i)); done
git reset -q --hard origin/przekazanie-konta
while [ $# -ge 2 ]; do mkdir -p "$(dirname "$2")"; cp -r "$1" "$2"; git add "$2"; shift 2; done
echo "- $(date -u +%H:%M) UTC $(date -u +%d.%m): $LINIA" >> docs/przekazanie/README.md
git add docs/przekazanie/README.md
git commit -qm "Przekazanie: ${LINIA:0:60} [skip ci]

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01T66VBvPuyAg4fmtCyWDTgh"
for i in 1 2 3 4; do git push -q --no-verify origin HEAD:przekazanie-konta && exit 0; sleep $((2**i)); done; exit 1
