# Recenzja lokalizacji — 02-monetyzacja fix p2 (27.10.2026)

Rola: recenzent-lokalizacji. Kopia: `.claude/worktrees/agent-a7d922beb4ab89982`, commit 72338f0. Niczego nie zmieniano.

Zakres: 2 nowe klucze × 32 słowniki (`lib/locales/*.json`; pt-BR: nakładka „Masz plan: {name}” = „Seu plano: {name}”, „Przejdź na ten plan” z bazy pt; es-419 = es).
Kontekst: `app/paywall.tsx:84` (nagłówek karty stanu, `accessibilityRole="header"`), `app/paywall.tsx:34,109` (przycisk główny `block`, pełna szerokość), obok `Btn small` „Zmień plan” (`:92`).

## Sprawdzone
- (a) Słownik: `npx jest tests/slownik-terminow.test.ts` — 109/109 zielonych. Termin planu taki sam jak w „Zmień plan” i „Aktualny plan” we wszystkich językach (plan/plán/plano/piano/Plan/πλάνο/план/plāns/planas/formule/abonnement/pakett/paket/paket(sl)/tilaus/csomag/pelan/요금제/gói/方案/プラン).
- (b) Rejestr: forma jak w „Masz pełną wersję” (de/da/nb/sv/es/it/nl/ko/zh/vi „ty”; bg/cs/sk/hr/sr/sl/lt/lv/ro/hu/el/tr/ru/uk/pt/fr formalnie). Przycisk w trybie rozkazującym/bezokolicznikiem tak jak istniejące „Subskrybuj”/„Kup na zawsze” w danym słowniku.
- „Przejdź na ten plan” różni się od „Zmień plan” w każdym języku (np. ja このプランに変更 / プランを変更, de Zu diesem Plan wechseln / Plan wechseln).
- (c) pt-BR: „Seu plano”, „Mudar para este plano” — naturalne w BR. es-419: „Tu plan”, „Cambiar a este plan” — bez europeizmów.
- (d) fr: „Votre formule : {name}” ma U+00A0 przed „:”. zh-Hant: „你的方案：{name}”. ja: „ご利用中のプラン: {name}” — dwukropek ASCII jak w większości etykiet ja (161 vs 35 z „：”).
- (e) Najdłuższy przycisk: nl „Overstappen naar dit abonnement” (31 znaków) — przycisk na pełną szerokość, mieści się przy 320 pt; nagłówek się zawija.
- (f) {name} zachowany wszędzie.

## Poprawki
Brak poprawek koniecznych.

| język | klucz | obecnie | proponowane | powód | pewność |
|---|---|---|---|---|---|
| nl | Przejdź na ten plan | Overstappen naar dit abonnement | Overstappen op dit abonnement (opcjonalnie) | b — „overstappen op” częstsze przy abonnementach; obie formy poprawne | do sprawdzenia przez native speakera |
| sl | Przejdź na ten plan | Preklopi na ta paket | Preidi na ta paket (opcjonalnie) | b — „preklopi” brzmi jak przełącznik ustawienia | do sprawdzenia przez native speakera |

## Nowe terminy do słownika
Brak.

## Pytania do native speakerów
1. nl: przy zmianie subskrypcji w aplikacji naturalniej brzmi „Overstappen op dit abonnement” czy „Overstappen naar dit abonnement”?
2. sl: na przycisku zmiany pakietu subskrypcji naturalniej „Preklopi na ta paket” czy „Preidi na ta paket”?

Podsumowanie: przeczytano 63 teksty (32 × 2, es-419 jako es; pt-BR efektywnie), poprawek koniecznych 0, opcjonalnych 2, pytań 2.
