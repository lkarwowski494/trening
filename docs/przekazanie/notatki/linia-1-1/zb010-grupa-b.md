# ZB-010 — grupa B (migracja testów do RNTL 14 / SDK 58), 02.11.2026

Sesja: https://claude.ai/code/session_01T66VBvmo6dyun6EMA8NXqt. Gałąź `zb010/sdk`, start od `cdf3539`. Lista plików: `raport-zb010.md` pkt 7, grupa B (33 pliki).
Pomiar: każdy plik osobno `npx jest <plik> --runInBand --ci`; „przed” w osobnym worktree na `cdf3539` (żeby edycje nie wpływały na pomiar).

## Wynik

| | pliki czerwone | testy czerwone |
|---|---|---|
| przed (`cdf3539`) | 33 / 33 | 231 / 585 + `figures.test.tsx` w ogóle nie ruszył (41 testów) |
| po (`2cf073b` + `a4becdd` (raport)) | 1 / 33 | 1 / 626 |

Jedyny czerwony: `tests/audit-0.10-data-ui.test.tsx` — sygnał zachowania, nie API (niżej). `npx tsc --noEmit`: w plikach grupy B i w `tests/fiber-tree.ts` 0 błędów (cały projekt: 300 linii błędów, reszta w plikach innych grup).

Commity (SHA po rebase): `5b24b04` (fiber-tree, motyw, matrix-a11y), `606f1d8` (figury + nagłówek migawki), `eca2ec2`, `16e8687`, `fe1f32b`, `2cf073b`, `a4becdd` (raport).

## Sygnał zmiany zachowania (asercja nietknięta, do decyzji koordynatora)

- `tests/audit-0.10-data-ui.test.tsx` › „SEC-08 … dane listy: pakiety aplikacji z licencją…”, linia 145: `expect(LICENSES.some(r => r[0] === 'query-string')).toBe(true)` — jest `false`. Ta sama przyczyna co sygnał grupy D w `tests/public-repo.test.ts` (SEC-06): expo-router 58 nie zależy już od `query-string` (cel ZB-010), więc lista licencji go nie zawiera. Założenie testu nieaktualne — do zmiany razem z public-repo (decyzja SEC-06).

## Nowy pomocnik (nie zmienia wspólnych)

`tests/fiber-tree.ts` — drzewo w kształcie dawnego `UNSAFE_root` (komponenty złożone + natywne, `type`, `props`, `children`, `parent`, `findAll` z samym węzłem) budowane z `unstable_fiber`; zasady pomijania włókien jak w react-test-renderer.
- `fiberRoot(container = screen.container)` — cały ekran (zamiast `screen.UNSAFE_root` / `render(...).UNSAFE_root`),
- `fiberOf(el)` / `asFiber(el)` — element natywny RNTL 14 → węzeł z poddrzewem komponentów i łańcuchem `parent` do korzenia.
Do użycia tam, gdzie asercja dotyczy komponentu złożonego (`Pressable` z `onPress`, `Switch` z `onValueChange`, `Rect`/`Path` z react-native-svg po nazwie typu, `typeof n.type !== 'string'`, `.parent` tekstu = komponent `Text`). Przydatne też dla grupy A (`UNSAFE_*ByType`): `fiberRoot().findAll(n => n.type === Komponent)`.

## Wzorce API (dodatkowe do listy grupy D)

1. `screen.UNSAFE_root.findAll(p)` → `screen.container.queryAll(p)`, gdy predykat dotyczy elementów natywnych (`typeof n.type === 'string'`, testID, `'Text'`, `'View'`, `accessibilityRole`, styl) — próbka: elementy natywne zachowują `props.children`, typ `'Text'`/`'View'` i `parent`.
2. **Uwaga — testy „na pusto”:** predykat na props komponentu złożonego (`onPress`, `onValueChange`, `typeof n.type !== 'string'`) w drzewie natywnym daje pustą listę — test z `expect(lista).toEqual([])` przechodziłby bez sprawdzania. Takie miejsca → `fiberRoot()`/`asFiber()` (audit-0.10-lang-ui A11-06/A11-15, audit-0.10-plan-ui `panelButtons`, m1-043 przycisk-rodzic, period-bars `.parent`).
3. Kolory/ścieżki SVG (`fill`, `stroke`, `d`): element natywny ma kolor jako liczbę → `compPropsAll(screen.container)` (figures, figures-v2-ui, figura-klatka-zrzutu, muscle-map).
4. `screen.unmount()` / `a.unmount()` / `rerender` bez `await` przeciekają do następnego testu (figures-v2-ui: 13 testów czerwonych tylko w całym pliku, osobno zielone) → `await`.
5. `render(...).toJSON()` → `(await render(...)).toJSON()`; `n.type === RN.Text` → `n.type === 'Text'`.
6. Nagłówek migawki: Jest 30 odrzuca stary link (`https://goo.gl/fbAQLP`) — „Test suite failed to run” pod `--ci`. Zmieniony tylko link w 1. linii `tests/figures.test.tsx.snap.ios`; treść migawek bez zmian, 5/5 zgodne z `--ci`. To jest ta „1 linia”, którą pełny Jest zmienił wcześniej (raport pkt 7).
7. Czas: test pętli 26 języków × wszystkie ćwiczenia (audit-k1-bl-mer „regresja…”) z asynchronicznym `render`/`press` trwa ok. 30 s — dostał limit 120 s (argument testu, asercje bez zmian).

## Stan

- Zrobione: wszystkie 33 pliki grupy B (SHA wyżej); wypchnięte na `zb010/sdk`.
- Zostało: decyzja o sygnale `query-string` (audit-0.10-data-ui, razem z public-repo z grupy D).
- Następny krok (koordynator): pełny Jest i verify po scaleniu grup.
- Pułapki: nie uruchamiać `pkill -f <wzorzec>` z tym samym wzorcem w tej samej komendzie (zabija własną powłokę); świeży kontener nie ma `node_modules` — najpierw `npm ci`.
