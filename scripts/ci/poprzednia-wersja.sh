#!/usr/bin/env bash
# Poprzednia wersja aplikacji (symulator) dla testu aktualizacji w E2E (audyt M1-062, DEC-27, 20.10.2026): plik Trening-sim.zip dołączony do wydania (GitHub Release)
# przy tagu — zadanie „tag” w testflight.yml. Bierze NAJNOWSZE wydanie z tym plikiem, którego tag nie wskazuje bieżącego commitu (wydanie tego samego commitu to nie
# „poprzednia” wersja). Brak takiego wydania = porażka z instrukcją (nie ciche pominięcie). Plik to build symulatora bez podpisu i bez sekretów (publiczne repozytorium).
# Użycie: poprzednia-wersja.sh <właściciel/repo> <sha bieżącego commitu> <katalog docelowy>   (wynik: <katalog>/Trening-sim.zip; tag w $GITHUB_OUTPUT jako tag=)
set -u
REPO=${1:?repo}; SHA=${2:?sha}; OUT=${3:?katalog}
tags=$(gh api "repos/$REPO/releases?per_page=30" --jq '.[] | select(any(.assets[]; .name == "Trening-sim.zip")) | .tag_name' 2>/dev/null) || tags=""
for tag in $tags; do
  tsha=$(gh api "repos/$REPO/git/ref/tags/$tag" --jq '.object.sha' 2>/dev/null) || tsha=""
  [ "$tsha" = "$SHA" ] && continue
  mkdir -p "$OUT"
  if gh release download "$tag" --repo "$REPO" --pattern Trening-sim.zip --dir "$OUT" --clobber && [ -s "$OUT/Trening-sim.zip" ]; then
    echo "Poprzednia wersja (plik wydania): $tag"
    [ -n "${GITHUB_OUTPUT:-}" ] && echo "tag=$tag" >> "$GITHUB_OUTPUT"
    exit 0
  fi
done
echo "::error::Test aktualizacji (33–34): brak poprzedniej wersji — żadne wydanie (GitHub Release) z innego commitu niż ${SHA:0:7} nie ma pliku Trening-sim.zip. Plik dołącza zadanie „tag” w testflight.yml przy każdym wydaniu TestFlight (od tego wydania). Pierwsze wydanie albo świadome pominięcie: uruchom E2E z wejściem poprzednia_wersja_z_przebiegu = brak (powód zapisz w podsumowaniu); ręcznie: numer przebiegu z artefaktem trening-sim-app."
exit 1
