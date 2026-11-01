#!/usr/bin/env bash
# Bramka przed wysyłką do TestFlight (audyt M1-018, 20.10.2026): na TYM SAMYM commicie musi istnieć zielony przebieg e2e-ios.yml z pakietem podstawowym
# (albo pełnym / ścisłym). Rozpoznanie (audyt jakości 008, 01.11.2026): ścieżka workflowu z API (.path) + pola klucz=wartość w run-name e2e-ios.yml
# („E2E iOS · pakiet=… · tryb=… · zakres=wszystkie · aplikacja=wlasna · sha=<pełny SHA>”) — SHA w tytule musi równać się sprawdzanemu commitowi (przebieg z wcześniejszego commitu gałęzi się nie liczy).
# Trwający przebieg: czeka. Czerwony albo brak: błąd z instrukcją. Użycie: bramka-e2e.sh <właściciel/repo> <sha>
# Zmienne (testy): BRAMKA_POLL_SEC (60), BRAMKA_GRACE_POLLS (5 — tyle sprawdzeń na pojawienie się przebiegu po wypchnięciu), BRAMKA_MAX_POLLS (110).
set -u
REPO=${1:?repo}; SHA=${2:?sha}; POLL=${BRAMKA_POLL_SEC:-60}; GRACE=${BRAMKA_GRACE_POLLS:-5}; MAX=${BRAMKA_MAX_POLLS:-110}
WORKFLOW_PATH='.github/workflows/e2e-ios.yml'
OK_TITLE="^E2E iOS · pakiet=(podstawowy|pelny) · tryb=(zwykly|scisly) · zakres=wszystkie · aplikacja=wlasna · sha=${SHA}\$"
n=0
while :; do
  n=$((n + 1))
  rows=$(gh api "repos/$REPO/actions/workflows/e2e-ios.yml/runs?head_sha=$SHA&per_page=100" --jq '.workflow_runs[] | [.id, .status, (.conclusion // "-"), .path, .display_title] | @tsv' 2>/dev/null) || rows=""
  good=""; running=""; failed=""
  while IFS=$'\t' read -r id status concl wpath title; do
    [ -n "${id:-}" ] || continue
    [ "$wpath" = "$WORKFLOW_PATH" ] || continue
    printf '%s' "$title" | grep -Eq "$OK_TITLE" || continue
    if [ "$status" = completed ]; then [ "$concl" = success ] && good="$id" || failed="$id"; else running="$id"; fi
  done <<< "$rows"
  if [ -n "$good" ]; then
    echo "Bramka E2E: OK — zielony przebieg e2e-ios.yml #$good na commicie ${SHA:0:7}"
    [ -n "${GITHUB_OUTPUT:-}" ] && echo "run=$good" >> "$GITHUB_OUTPUT"  # numer przebiegu: z jego artefaktu trening-sim-app zadanie „tag” robi plik wydania (M1-062)
    exit 0
  fi
  if [ -n "$running" ]; then
    [ "$n" -ge "$MAX" ] && { echo "::error::Bramka E2E: limit czekania ($MAX × ${POLL}s) — przebieg e2e-ios.yml #$running nadal trwa. Poczekaj na wynik i uruchom TestFlight ponownie."; exit 1; }
    echo "Bramka E2E: czekam na przebieg e2e-ios.yml #$running (sprawdzenie $n)"; sleep "$POLL"; continue
  fi
  if [ -n "$failed" ]; then echo "::error::Bramka E2E: przebieg e2e-ios.yml #$failed na commicie ${SHA:0:7} jest czerwony — popraw, poczekaj na zielony pakiet podstawowy i ponów."; exit 1; fi
  if [ "$n" -ge "$GRACE" ]; then
    echo "::error::Bramka E2E: brak przebiegu e2e-ios.yml (pakiet podstawowy) na commicie ${SHA:0:7}. Uruchom Actions → „E2E iOS (symulator)” → Run workflow na tej gałęzi (pakiet: podstawowy), poczekaj na zielony wynik i ponów TestFlight. Przebieg dowodowy bez wysyłki: wejście bez_wysylki. Awaria E2E nie z winy kodu: wejścia pomin_bramke_e2e + powod."; exit 1
  fi
  echo "Bramka E2E: jeszcze brak przebiegu E2E dla ${SHA:0:7} (sprawdzenie $n z $GRACE)"; sleep "$POLL"
done
