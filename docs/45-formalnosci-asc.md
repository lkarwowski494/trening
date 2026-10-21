# 45. Formalności App Store Connect przed wysyłką 1.0 (M8, stan 21.10.2026)

Projekt do akceptacji właściciela (rola M8 Formalności, gałąź `formalnosci/trening-2026-10-21`). Oczekiwane wartości są w
`store/asc-odpowiedzi.json` (test `tests/store-asc-odpowiedzi.test.ts` pilnuje zgodności z kodem); notatki dla recenzenta w `store/review-notes.md`
(test `tests/store-review-notes.test.ts`). Po scaleniu kontroli ASC u koordynatora (`store/asc-kontrola.json`) wartości przechodzą do jej formatu.
Lista braków i raport M8 są prywatne (poza repo publicznym); tu tylko to, co trafia do App Store Connect.

## Pola i odpowiedzi

| Pole w App Store Connect | Wartość | Podstawa (źródło szczebla 1, odczyt) | Stan |
|---|---|---|---|
| App Privacy | „Data Not Collected”, bez śledzenia | inwentarz danych z kodu: brak połączeń sieciowych i SDK; Apple: dane tylko na urządzeniu nie są „collected”; e-mail do wsparcia — wyjątek „Optional disclosure” („customer service requests”); dane zbierane przez Apple — „You are not responsible for disclosing data collected by Apple” (developer.apple.com/app-store/app-privacy-details/, 21.10.2026) | wpisane 14.10.2026 (docs/18); zgodne |
| Ocena wieku | 9+: tylko „Health or Wellness Topics” = tak; reszta „brak”/„nie” | „Health or Wellness Topics: Content that provides self-care or lifestyle recommendations”, w progu 9+ (…/age-ratings-values-and-definitions/, 21.10.2026) | wpisane 14.10.2026 (9+); odpowiedzi do porównania z `store/asc-odpowiedzi.json` |
| Szyfrowanie (export compliance) | brak pytania: `ITSAppUsesNonExemptEncryption = false` | wartość NO, gdy aplikacja „doesn’t use encryption, or … only uses forms of encryption that are exempt” (developer.apple.com/documentation/security/complying-with-encryption-export-regulations, 21.10.2026) | w `app.json` |
| App Review Information → Sign-in required | wyłączone (aplikacja bez konta; konto demo niepotrzebne) | aplikacja nie ma konta (inwentarz) | do wpisania przy wersji 1.0 |
| App Review Information → Notes | wersja EN z `store/review-notes.md` (limit 4000 bajtów) | 2.1: wyjaśnienie zakupów i funkcji nieoczywistych | szkic odświeżony 21.10.2026; ścieżki sprawdzić na buildzie 1.0 (po M3) |
| Subskrypcje → Review Notes | blok trzeci z `store/review-notes.md` (oferta 14 dni) | „Required if the subscription offers introductory pricing” | do wpisania przy obu subskrypcjach |
| Oferta wprowadzająca | 2 tygodnie, obie subskrypcje (`TRIAL_DAYS = 14`) | decyzja właściciela 19.10.2026 | krok K-011 (docs/43) |
| Family Sharing | tak, trzy produkty | decyzja 11.10.2026 | wpisane 14.10.2026 |
| License Agreement | standardowa licencja Apple (bez własnej) | decyzja P9 A 12.10.2026; `TERMS_URL` w `lib/products.ts` | nic do wpisania |
| DSA | przedsiębiorca | weryfikacja Apple 20.10.2026 (docs/18) | zrobione |
| Privacy Policy URL, Support URL | `store/app-store-urls.json` | 5.1.1(i), 1.5 | K-013 (docs/43) |
| Kategoria | Health & Fitness | docs/41 D8 | wpisane |

## Decyzje STOP 1 (21.10.2026) i otwarte
Decyzje właściciela (STOP 1, przez koordynatora): docs/18, wpis 21.10.2026 „STOP 1 roli M8”. Skutki: polityka prywatności uzupełniona o elementy art. 13 RODO
i bez AI w obsłudze wiadomości (`site/privacy.html`, `site/support.html`, test `tests/public-repo.test.ts`); procedura podatności, naruszeń i żądań:
`docs/prawne/procedura-bezpieczenstwa.md`; licencje OFL-1.1 i MPL-2.0 dopuszczone.

Otwarte do STOP 2: etykieta App Privacy wobec e-maila wysyłanego z aplikacji Poczta (warunek Apple „provided by the user in your app’s interface”);
manifest prywatności w `app.json` (ryzyko R-007, docs/40); publikacja poprawionych stron na apps4brew.com (zgoda właściciela; opublikowana strona
wsparcia mówi, że kopię automatyczną się „włącza”, a w kodzie jest domyślnie włączona — `tests/audit-m1-043-support-page.test.ts`).
