#!/bin/bash
# Raport stanu worktree: brudne pliki, niewypchnięte commity, scalenie, rozmiar
cd /home/user/trening || exit 1
git fetch -q origin
for w in /home/user/wt/*; do
  b=$(basename "$w")
  head=$(git -C "$w" rev-parse HEAD)
  dirty=$(git -C "$w" status --porcelain | wc -l)
  unp=$(git -C "$w" rev-list --count "origin/$b..HEAD" 2>/dev/null || echo brak-zdalnej)
  where="-"
  git merge-base --is-ancestor "$head" origin/main && where=main
  [ "$where" = "-" ] && git merge-base --is-ancestor "$head" origin/integracja-1-1 2>/dev/null && where=integracja
  size=$(du -sh "$w" | cut -f1)
  echo "$b dirty=$dirty unpushed=$unp merged=$where size=$size"
done
