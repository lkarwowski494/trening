# 02-monetyzacja · fix p2 · 2026-10-27 — wynik

Zadanie: M1-audytor-generalny-010 (DEC-09 a; źródła 02-monetyzacja-001, 02-monetyzacja-504, 04-studio-projektowe-001, 08-programista-002, 03-zakres-005, 07-jakosc-003).
Kopia robocza: `/home/user/trening/.claude/worktrees/agent-a7d922beb4ab89982`, gałąź `worktree-agent-a7d922beb4ab89982`, baza `naprawy/M2-koordynator-napraw-2026-10-27-p2` (82f6310).
Commit: `72338f0` → M1-audytor-generalny-010 (02-monetyzacja-001, 02-monetyzacja-504). Nie wypchnięty, nie scalony.

## E0 (skrót, plan zatwierdzony w M2)
Klasyfikacja: P rozstrzygnięte (DEC-09 a) → wdrożenie jak D. Brakowało względem testu akceptacyjnego po c9cacfa: (1) nagłówek „Masz plan X” — był „Masz pełną wersję” + wiersz „Plan: X”; rozstrzygnięte wg brzmienia decyzji: nagłówek karty „Masz plan: {nazwa}” (dwukropek, bo nazwy planów to zdania), wiersz „Plan:” usunięty; (2) lista planów i zakup zwinięte pod „Zmień plan” (wzorzec 20 docs/32); (3) przycisk zakupu przy zmianie planu nazywał się tak samo jak przełącznik — zmieniony na „Przejdź na ten plan”; (4) teksty: istniejące klucze były w 31 słownikach + 2 nakładkach (komplet), nowe dodane do wszystkich.

## E1/E2 dowody
| ID | Test | Przed | Po | Commit |
|---|---|---|---|---|
| M1-audytor-generalny-010 | `tests/audit-m1-2026-10-27-010-stan-mam-plan.test.tsx` (10 testów: miesięczny, roczny, z kodu, z Chmury rodzinnej, rozwijanie/zwijanie, zmiana planu, dożywotni przy subskrypcji, PL, dożywotni, bez dostępu) | 9 czerwonych, 1 zielony (bez dostępu) — dowody/010-przed.txt | 10/10 | 72338f0 |

- Kod: `app/paywall.tsx:84` nagłówek `paywall-owned-title`; `app/paywall.tsx:92` przełącznik `paywall-change-plan` z `expanded`; `app/paywall.tsx:34` etykieta zakupu przy zmianie planu.
- BRD: `docs/brd/wymagania.md:722` i `docs/brd/wymagania.md:726` (BR-ZAK-003: posiadany plan, zmiana planu, dożywotni); `node scripts/kontrola-brd.mjs docs/brd` kod 0.
- Decyzja: wpis 27.10.2026 DEC-09 a na końcu docs/18 z `[wdrożenie: kod] [test: …010-stan-mam-plan.test.tsx]`; `npm run check:decyzje` kod 0.
- Testy dostosowane do zwiniętej listy (decyzja zmienia stan, który przypinały): `tests/subscription-ui.test.tsx`, `tests/audit-m1-2026-10-27-001-dozywotni-przy-subskrypcji.test.tsx`, `tests/maestro-zakup-m5s1.test.ts` (czeka na „Your plan: …”). Maestro 21 (stan po zakupie, rozwinięcie, zrzut 99-zakup-zmiana-planu) i 35 (oczekiwanie po zakupie).
- Związane testy przed: dowody/przed-zwiazane.txt (7/8 zestawów; 1 przekroczenie czasu w subscription-ui przy równoległym obciążeniu maszyny, nie błąd asercji). Po: dowody/po-zwiazane.txt — 22/22 zestawy, 575/575 (m.in. maestro-flows, i18n-locales, slownik-terminow, interaction-guards, close-button-guard, przeplywy, decyzje-straznik, audit-m1-044-brd). typecheck 0, lint 0 błędów, check:i18n, check:claims, check:matrix (bez testu: 0), check:readme, check:decyzje — kod 0.
- Pełne `npm run verify` nie uruchomione (polecenie: tylko związane; pełne verify koordynator raz po scaleniu partii).
- Zrzuty przed/po: brak (Linux bez symulatora); zrzuty 99-zakup-plan-aktywny i 99-zakup-zmiana-planu powstaną w przebiegu E2E scenariusza 21 (`tylko_scenariusze`, uruchamia koordynator).

## Teksty (2 nowe klucze)
„Masz plan: {name}” (EN „Your plan: {name}”), „Przejdź na ten plan” (EN „Switch to this plan”) — EN, `_source.json`, 31 słowników + nakładka pt-BR („Seu plano: {name}”); es-419 dziedziczy es. Wartości w pliku dowody/tlumaczenia-010.json (do przeglądu)
Odstępstwo nazwane: subagenci `tlumacz` i `recenzent-lokalizacji` nie byli dostępni (sesja jako subagent bez narzędzia subagentów); tłumaczyła sesja według `.claude/agents/tlumacz.md` (terminy planu jak w istniejących „Zmień plan”/„Aktualny plan”, fr z nbsp, zh „：”). Przegląd: polecenie-recenzent-lokalizacji.md — NIEODBYTY.

## Przegląd ścieżki wrażliwej (zakupy, D-043)
NIEODBYTY z tego samego powodu; polecenie: polecenie-przeglad-sciezki-wrazliwej.md (uruchamia koordynator przed scaleniem).

## Otwarte / poza zakresem
- „Odnawia się {data}” zamiast „Dostęp do {data}” (02-monetyzacja-504, T1 roli 04): aplikacja nie zna stanu automatycznego odnawiania (uprawnienie bez `willRenew`), więc tekst mógłby kłamać po anulowaniu — wymaga zmiany adaptera sklepu; nowe znalezisko do backlogu (P2), nie wdrożone.
- Podtytuł wiersza „Pełna wersja” w Ustawieniach z nazwą planu i rodziną (02-monetyzacja-504) — zakres zadania 037 (DEC-07 b).
- Wygląd karty i przełącznika — przegląd roli 04 (zasada wspólna 15) przy zrzutach z E2E.

## Kroki właściciela
Telefon (TestFlight z tą zmianą, konto Sandbox z subskrypcją): Ustawienia → Pełna wersja → oczekiwane: „Masz plan: …”, brak „Trenuj 5 dni…”, brak listy planów; „Zmień plan” rozwija listę z „Aktualny plan” przy posiadanym i „Przejdź na ten plan”; VoiceOver czyta „Zmień plan, zwinięte/rozwinięte”.

Kontrola dowodów i sekretów (narzedzia/sprawdz-raport.mjs, kod 0): OK: odwołania, cytaty, pliki dowodów i sekrety sprawdzone
