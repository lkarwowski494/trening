# Stan W-04 — RepsGoat (ZB-056) i głosy zapowiedzi (ZB-039), sesja R, 11.11.2026

Gałąź `zb/w04-repsgoat-glosy` od `integracja-1-1` @ d11a948d.

## Ustalone u źródła (zadanie 1)
- ZB-056: rezerwacja w App Store Connect — docs/18 (wpis 09.11.2026 „nowa nazwa aplikacji od wersji 1.1”). Kod w integracji: c9590496 (scalenie aff4c4cc, tests.yml 42624026980). `node scripts/marka.mjs` → 127 plików zgodnych, kod 0.
- ZB-039: wariant A w integracji (9321d918); `ios-unsigned.yml` zielony 41763742923 na 687ad52b (potomek 9321d918).

## Zrobione
- Lista „tylko telefon”: W2-04 (jakość głosu, wskazówka „lepszy głos”), ZD-02 („RepsGoat” pod ikoną, zegarek); test `tests/w04-telefon-1-1.test.ts`; docs/39 przeliczony.
- Stan ZB-039 i ZB-056 w docs/zobowiazania.md, W-04 w docs/49.

- Na aeab7fa0: `verify:szybkie` kod 0 (125 plików, 7329 testów), `tests.yml` 43027319569 zielony, `ios-unsigned.yml` 43027324931 zielony (zmiany natywne marki i ZB-039 skompilowane). Recenzja niezależna (audytor): brak uwag.

## Zostało (poza tą sesją)
- W-22 metadane + „Co nowego”, W-23 zrzuty, W-24/ZB-037: nazwa grupy subskrypcji pl/en-US w `store/iap-localizations.json` (`wpisaneRecznie`) nadal „Trening …”.
- Odsłuch właściciela i nazwa pod ikoną — W-20 po buildzie 1.1.

