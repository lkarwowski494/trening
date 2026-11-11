# Stan sesji Q — W-04a nazwy (ZB-025, ZB-044)

Gałąź `zb/w04-nazwy` od `integracja-1-1` @ d11a948d. Rola 08-programista build. Koordynator: session_01T66VBwLEERfcSTE1sVqA6n.

## Stan ZB u źródła (11.11.2026)
- ZB-025 a — zrobione w integracji: dwa standardy (decyzja 02.11.2026 zastąpiła Z3) w `scripts/pokrycie-katalogu.mjs:37-56`, test `tests/pokrycie-katalogu.test.ts`, `node scripts/pokrycie-katalogu.mjs --check` kod 0.
- ZB-025 b — warstwa nazw i strażnik regex w integracji (a0e06d73, `tests/nazwy-en.test.ts`); recenzje badacza i lokalizacji: w toku w tej sesji.
- ZB-044 — kod w integracji (`funkcja/zb044-nazwy`); w tej sesji: wzorzec 34 w docs/32 + strażnik S21 (f9501cf4). Lista nazw lokalnych PL: PYTANIE do koordynatora (A: lista PL w tej sesji; B: z 33 językami w W-03).

## Następny krok
Recenzje nazw EN → zapis w `docs/research/equipment/nazwy-en.json` (pola recenzja) + poprawki; odpowiedź koordynatora o liście PL; verify:szybkie, push, tests.yml, audytor.
