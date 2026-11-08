#!/usr/bin/env bash
# L-117 (wariant A, 08.11.2026): po utworzeniu tagu wydania dopisuje wiersz „Dziennik wydań” (docs/09-plan-testow.md) i wypycha commit na gałąź builda.
# Wywołanie z zadania `tag` w testflight.yml (katalog roboczy = kopia repozytorium). Środowisko: T (tag), GITHUB_SHA, GITHUB_RUN_NUMBER, GITHUB_RUN_ID, REF_NAME (gałąź), opcjonalnie BUILD_BASE.
# Zasady:
#  - Błąd tego kroku NIGDY nie unieważnia wydania (tag i build już istnieją): kończy się kodem 0, a przy porażce wypisuje ostrzeżenie i w podsumowaniu przebiegu
#    wiersz do ręcznego dopisania (GITHUB_STEP_SUMMARY).
#  - Wyścig (gałąź przesunięta w trakcie): jedno powtórzenie — pobranie czubka gałęzi, odrzucenie własnego commitu i ponowne wygenerowanie wiersza (skrypt jest idempotentny;
#    działa też w płytkim klonie, gdzie rebase nie ma wspólnej historii).
#  - Hak pre-push (core.hooksPath ustawia `npm ci`, którego to zadanie nie uruchamia) jest wyłączony jawnie: commit zmienia tylko dokument, a znacznika zielonego verify w CI nie ma.
#  - Push z GITHUB_TOKEN nie uruchamia `tests.yml` dla nowego commitu (zasada GitHub) — to zamierzone; commit zmienia tylko wiersz dziennika.
# Test: tests/dziennik-wydan-push.test.ts (lokalne repozytorium zdalne, wyścig, odrzucenie wypchnięcia).
set -u
KAT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLIK="${DZIENNIK_PLIK:-docs/09-plan-testow.md}"
: "${T:?brak T}" "${GITHUB_SHA:?brak GITHUB_SHA}" "${GITHUB_RUN_NUMBER:?}" "${GITHUB_RUN_ID:?}" "${REF_NAME:?brak REF_NAME}"

wiersz() { node "$KAT/../dziennik-wydan.mjs" --tag "$T" --sha "$GITHUB_SHA" --run-number "$GITHUB_RUN_NUMBER" --run-id "$GITHUB_RUN_ID" --galaz "$REF_NAME" --build-base "${BUILD_BASE:-1000}" --plik "$PLIK"; }
ostrzez() {
  echo "::warning::Dziennik wydań: $1 — wydanie $T jest kompletne (tag i build są), ale tests.yml zaczerwieni się na tagu bez wiersza w docs/09, dopóki ktoś go nie dopisze"
  { echo "### Dziennik wydań: wiersz do ręcznego dopisania"; echo "$1. Dopisz w docs/09-plan-testow.md (sekcja „Dziennik wydań”, koniec tabeli): \`node scripts/dziennik-wydan.mjs --tag $T --sha $GITHUB_SHA --run-number $GITHUB_RUN_NUMBER --run-id $GITHUB_RUN_ID --galaz $REF_NAME\`"; } >> "${GITHUB_STEP_SUMMARY:-/dev/null}"
  exit 0
}

git config user.name "github-actions[bot]"; git config user.email "41898282+github-actions[bot]@users.noreply.github.com"
for proba in 1 2; do
  wiersz || ostrzez "skrypt wiersza zwrócił błąd"
  if git diff --quiet -- "$PLIK"; then echo "Wiersz $T już jest w dzienniku — nic do wypchnięcia"; exit 0; fi
  git add -- "$PLIK" && git commit -q -m "docs/09: wiersz dziennika wydań dla $T (automat testflight.yml, L-117)" || ostrzez "commit nieudany"
  if git -c core.hooksPath=/dev/null push -q origin "HEAD:refs/heads/$REF_NAME"; then
    echo "Wiersz $T dopisany i wypchnięty na $REF_NAME"; echo "Dziennik wydań: wiersz $T dopisany na gałęzi $REF_NAME." >> "${GITHUB_STEP_SUMMARY:-/dev/null}"; exit 0
  fi
  [ "$proba" -eq 2 ] && break
  echo "Wypchnięcie odrzucone (gałąź $REF_NAME przesunięta w trakcie) — pobieram czubek i generuję wiersz od nowa"
  git fetch -q origin "$REF_NAME" && git reset -q --hard FETCH_HEAD || ostrzez "nie udało się pobrać gałęzi $REF_NAME"
done
ostrzez "wypchnięcie na $REF_NAME odrzucone (ochrona gałęzi albo kolejny wyścig)"
