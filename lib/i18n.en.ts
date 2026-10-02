/*
 * Słownik angielski (T-040). Klucz = polski tekst źródłowy z kodu. Kompletność sprawdza scripts/check-i18n.mjs
 * (literały w t()/tp()) oraz tests/regress.test.tsx R39-02 (wartości domenowe: partie, mięśnie, sprzęt, metryki, typy serii, moduły, rekordy).
 * Liczebniki: klucz 'jeden|kilka|wiele' → 'one|other'.
 */
export const EN: Record<string, string> = {
  /* nawigacja */
  'Trening': 'Workout', 'Szablony': 'Templates', 'Ćwiczenia': 'Exercises', 'Historia': 'History', 'Więcej': 'More',
  'Wróć': 'Back', 'Wybierz ćwiczenie': 'Choose exercise', 'Szablon': 'Template', 'Ćwiczenie': 'Exercise', 'Sesja': 'Session',
  'Gumy': 'Bands', 'Postępy': 'Progress', 'Poranny wpis': 'Morning check-in', 'Poranne wpisy': 'Morning check-ins', 'Ustawienia': 'Settings', 'Backup': 'Backup',
  'Backup (eksport / import)': 'Backup (export / import)',

  /* liczebniki */
  'sesja|sesje|sesji': 'session|sessions', 'seria|serie|serii': 'set|sets', 'dzień|dni|dni': 'day|days',

  /* ekran główny */
  'Podpis aplikacji wygasł — odnów w Sideloadly.': 'App signature expired — renew it in Sideloadly.',
  'Podpis aplikacji wygasa dziś.': 'App signature expires today.',
  'Podpis aplikacji wygasa za {n} {d}.': 'App signature expires in {n} {d}.',
  'Zrób backup i odnów w Sideloadly (ok. 2 min). Dane zostają w telefonie.': 'Make a backup and renew in Sideloadly (about 2 min). Your data stays on the phone.',
  'Dziś rano': 'This morning', 'sen': 'sleep', 'BB, sen, waga — 20 sekund': 'BB, sleep, weight — 20 seconds',
  'Pierwszy raz? Wybierz szablon niżej, wpisz ciężar i powtórzenia, odhaczaj serie ✓ — przerwa odlicza się sama. Na koniec „Zakończ trening i zapisz”. Szablony i ćwiczenia zmienisz w zakładkach obok.':
    'First time? Pick a template below, enter weight and reps, tick sets ✓ — the rest timer starts by itself. When done, tap “Finish and save workout”. Edit templates and exercises in the other tabs.',
  'Zacznij z szablonu': 'Start from a template', 'ćw.': 'ex.', 'ostatnio': 'last', 'Start': 'Start',
  'Powtórz ostatni ({name})': 'Repeat last ({name})', 'bez szablonu': 'no template', 'Pusty trening': 'Empty workout',
  'Podpis ważny do {d}.': 'Signature valid until {d}.',
  'Trening {v} · dane tylko w telefonie, bez konta i bez sieci. Backup po ważnych sesjach (i przed odnowieniem podpisu).': 'Trening {v} · data stays on your phone, no account, no network. Back up after important sessions (and before renewing the signature).',

  /* listy */
  'guma': 'band', 'tempo': 'tempo', '+ Nowe': '+ New', '+ Nowy': '+ New', 'Szukaj…': 'Search…', 'Szukaj ćwiczenia…': 'Search exercises…',
  'Jeszcze pusto — pierwszy trening czeka.': 'Nothing yet — your first workout is waiting.',
  'Brak szablonów — dodaj pierwszy.': 'No templates — add the first one.',
  'Utwórz „{name}”': 'Create “{name}”', 'nowe ćwiczenie własne': 'new custom exercise', 'Wszystkie': 'All', 'Nic nie pasuje.': 'No matches.',

  /* edycja ćwiczenia */
  'Nie ma takiego ćwiczenia.': 'Exercise not found.', 'Nazwa': 'Name', 'Wyświetlane jako: {n}': 'Shown as: {n}', 'Partia': 'Body part', 'Sprzęt': 'Equipment',
  'Co logujesz w serii': 'What you log per set', 'Jak liczyć ciężar w objętości': 'How weight counts toward volume',
  'Przerwa robocza (s)': 'Working rest (s)', 'domyślna {s}': 'default {s}', 'Przerwa po rozgrzewce (s)': 'Rest after warm-up (s)', 'jak robocza': 'same as working',
  'Partie główne (1 seria)': 'Primary muscles (1 set)', 'Partie pomocnicze (0,5 serii)': 'Secondary muscles (0.5 set)',
  'Asysta gumą': 'Band assistance', 'tak — przy serii wybierasz gumę': 'yes — pick a band for each set', 'nie': 'no',
  'Tempo (opcjonalnie, np. 3-1-1)': 'Tempo (optional, e.g. 3-1-1)', 'Notatki techniczne': 'Technique notes', 'Ostatnio {d}:': 'Last time {d}:',
  'Usuń ćwiczenie': 'Delete exercise', 'Usunąć ćwiczenie?': 'Delete exercise?',   'Nie': 'No', 'Usuń': 'Delete', 'usuń': 'remove',

  /* historia */
  'Brak sesji.': 'Session not found.', 'objętość': 'volume', 'pow.': 'reps', 'dystans': 'distance', 'czas': 'time', 'przerwa': 'rest',
  'Usuń sesję': 'Delete session', 'Usunąć tę sesję z historii?': 'Delete this session from history?',

  /* backup */
  'Nie udało się': 'Something went wrong', 'Spróbuj ponownie.': 'Please try again.',
  'Eksport tworzy plik JSON z całą historią i szablonami — zapisz go w Plikach/iCloud albo wyślij sobie. Import przyjmuje ten sam format, także backup z wersji webowej.': 'Export creates a JSON file with your whole history and templates — save it to Files/iCloud or send it to yourself. Import accepts the same format, including backups from the web version.',
  'Eksportuj backup (plik JSON)': 'Export backup (JSON file)', 'Eksportuj historię do CSV (format Strong)': 'Export history to CSV (Strong format)',
  'CSV: ciężar w jednostce z ustawień ({u}), dystans w metrach.': 'CSV: weight in your unit setting ({u}), distance in metres.',
  'Importuj backup': 'Import backup', 'Nadpisać dane?': 'Overwrite data?', 'Import zastąpi wszystkie obecne dane zawartością pliku.': 'Import will replace all current data with the file contents.',
  'Importuj': 'Import', 'Zaimportowano': 'Imported', 'To nie wygląda na backup z tej apki': 'This does not look like a backup from this app',
  'Backup treningów': 'Workout backup', 'Eksport CSV': 'CSV export', 'do upadku': 'to failure',
  'Plik ma schemat {a}, a ta wersja obsługuje do {b}. Zaktualizuj aplikację.': 'The file has schema {a}; this version supports up to {b}. Update the app.',

  /* gumy */
  'Kolor · poziom (1 = cienka, 7 = bardzo gruba) · szacowana asysta w {u} (opcjonalnie — nie ma standardu kolorów, wpisz z opakowania lub własny szacunek). Gdy asysta jest podana, wybór gumy przy serii wpisuje ją jako ujemne ± (zapis, ile pomogła guma — rekordem jest suma powtórzeń bez asysty).':
    'Colour · level (1 = thin, 7 = very thick) · estimated assistance in {u} (optional — there is no colour standard, use the package value or your own estimate). When assistance is set, picking the band for a set enters it as negative ± (a record of how much the band helped — the record is total unassisted reps).',
  'kolor': 'colour', '+ Guma': '+ Band', 'nowa': 'new', 'czerwona': 'red', 'czarna': 'black', 'fioletowa': 'purple',

  /* poranny wpis */
  'Sen (wynik)': 'Sleep (score)', 'Sen (godziny)': 'Sleep (hours)', 'Waga ({u})': 'Weight ({u})', 'Ostatnie': 'Recent',

  /* postępy */
  'Objętość tygodniowo ({u})': 'Weekly volume ({u})', 'Serie robocze tygodniowo': 'Working sets per week',
  'Tygodnie od poniedziałku. Objętość = ciężar × powtórzenia × mnożnik ćwiczenia; rozgrzewka poza.': 'Weeks start on Monday. Volume = weight × reps × exercise multiplier; warm-ups excluded.',
  'Serie per partia — ten tydzień vs poprzedni': 'Sets per muscle — this week vs last', 'poprz.': 'prev.',
  'Brak serii w tym i poprzednim tygodniu.': 'No sets this week or last week.',
  'Partia główna liczy 1 serię, pomocnicza 0,5 (np. wyciskanie: klatka 1, triceps i barki po 0,5). Partie ustawisz w edycji ćwiczenia.': 'A primary muscle counts 1 set, a secondary one 0.5 (e.g. bench press: chest 1, triceps and shoulders 0.5 each). Set muscles in the exercise editor.',
  'Wykresy pojawią się po pierwszym zakończonym treningu.': 'Charts appear after your first finished workout.',
  'Max dociążenie': 'Max added weight', 'Max ciężar (per hantel)': 'Max weight (per dumbbell)', 'Max ciężar': 'Max weight',
  'e1RM (Epley, per hantel)': 'e1RM (Epley, per dumbbell)', 'Najlepsza seria (objętość)': 'Best set (volume)', 'Max powtórzeń w serii': 'Max reps in a set',
  'Najdłuższa seria': 'Longest set', 'Najdłuższy dystans': 'Longest distance', 'REKORDY': 'RECORDS', 'Sesje': 'Sessions', 'najlepsza': 'best', 'obj.': 'vol.',
  'Brak zapisanych sesji z tym ćwiczeniem.': 'No saved sessions with this exercise.',
  'max ±': 'max ±', 'max ciężar': 'max weight', 'e1RM (dociążenie)': 'e1RM (added weight)', 'max pow.': 'max reps', 'max czas': 'max time', 'max dystans': 'max distance',
  'Jedna sesja: {v}. Wykres pojawi się po drugiej.': 'One session: {v}. The chart appears after the second.', 'Brak danych do wykresu.': 'No data to chart.',

  /* ustawienia */
  'włączone': 'on', 'wyłączone': 'off', 'Język': 'Language', 'Jak w telefonie': 'Phone setting', 'Jednostka ciężaru': 'Weight unit',
  'Domyślna przerwa (sekundy)': 'Default rest (seconds)', 'Dźwięk i wibracja na koniec przerwy': 'Sound and vibration at the end of rest',
  'np. 73': 'e.g. 73',
  'Zapisuj zakończone treningi do Apple Health': 'Save finished workouts to Apple Health', 'Apple Health niedostępne': 'Apple Health unavailable',
  'Brak zgody albo moduł HealthKit nie jest w tej wersji aplikacji (Expo Go go nie ma — potrzebny build IPA).': 'No permission, or HealthKit is not in this build (Expo Go does not include it — an IPA build is needed).',
  'RPE / RIR przy serii (opcjonalne pole, nie wpływa na objętość)': 'RPE / RIR per set (optional, does not affect volume)', 'pokazuj': 'show', 'ukryte': 'hidden',
  'Ekran włączony podczas treningu': 'Keep screen on during workout', 'Sprawdź zgodę na powiadomienia': 'Check notification permission',
  'Powiadomienia działają': 'Notifications work', 'Brak zgody': 'No permission', 'Koniec przerwy da znać nawet na zablokowanym ekranie.': 'The end of rest will alert you even on a locked screen.',
  'Włącz powiadomienia dla Trening w Ustawieniach iOS.': 'Enable notifications for Trening in iOS Settings.',
  'Timer odlicza w aplikacji, a na koniec przerwy przychodzi powiadomienie — także przy zablokowanym telefonie.': 'The timer counts down in the app and a notification arrives at the end of rest — even when the phone is locked.',
  'Moduły (ukryj to, czego nie używasz)': 'Modules (hide what you do not use)', 'wkrótce': 'coming soon',
  'Trening jest zawsze włączony. Pozostałe moduły pojawią się w kolejnych wersjach — przełącznik już czeka. Schemat danych: v{v}.': 'Training is always on. Other modules arrive in later versions — the switch is ready. Data schema: v{v}.',
  'Wyczyść wszystkie dane': 'Erase all data', 'Na pewno?': 'Are you sure?', 'Usunie ćwiczenia, szablony i całą historię. Bez cofania.': 'This deletes exercises, templates and all history. It cannot be undone.', 'Wyczyść': 'Erase',

  /* szablon */
  'Nie ma takiego szablonu.': 'Template not found.', 'Duplikuj': 'Duplicate', 'Usunąć szablon?': 'Delete template?',
  'serie': 'sets', 'pow. od': 'reps from', 'do': 'to', 'cel s': 'target s', 'np. 60': 'e.g. 60', 'przerwa s': 'rest s', 'start {u}': 'start {u}',
  '+ Dodaj ćwiczenie': '+ Add exercise',
  'Puste „pow. od” = seria do maksimum. „⇅ SS” łączy ćwiczenie z następnym w superset (wspólna przerwa po ostatnim z grupy), „✂” wyjmuje z grupy.': 'Empty “reps from” = set to max. “⇅ SS” links the exercise with the next one into a superset (shared rest after the last in the group), “✂” removes it from the group.',
  'Nowy szablon': 'New template', '(kopia)': '(copy)', 'Nowe ćwiczenie': 'New exercise',

  /* trening w toku */
  'seria {n}': 'set {n}', 'dalej: {name}': 'next: {name}', 'Nowy rekord!': 'New record!', 'Nowe rekordy: {n}': 'New records: {n}',
  'Brak odhaczonych serii': 'No sets ticked', 'Zakończ': 'Finish',
  'Anulować trening?': 'Cancel workout?', 'Serie z tej sesji przepadną.': 'Sets from this session will be lost.', 'Anuluj trening': 'Cancel workout',
  'start': 'started', 'Notatka do treningu': 'Workout note', 'np. BB 86 rano, świeżo': 'e.g. BB 86 this morning, feeling fresh', 'Zakończ trening i zapisz': 'Finish and save workout',
  'Poprzednio': 'Previous', 'Pow.': 'Reps', 'sek.': 'sec.', 'Guma': 'Band',
  '+ seria': '+ set', '− seria': '− set', 'Przerwa (sekundy)': 'Rest (seconds)', 'Zapamiętać dla tego ćwiczenia?': 'Remember for this exercise?',
  'Tylko teraz': 'This time only', 'Zapamiętaj': 'Remember',
  'seria · cel {s}': 'set · target {s}', 'seria · bez celu': 'set · no target', 'Zakończ serię': 'Finish set',
  'przerwa minęła': 'rest is over', 'przerwa z {s}': 'rest of {s}', 'Pomiń': 'Skip',

  /* powiadomienia i Live Activity */
  'przerwa {s} s': 'rest {s} s', 'Przerwa minęła': 'Rest is over', 'Następna seria.': 'Next set.', 'seria {s} s': 'set {s} s',
  'Seria skończona': 'Set finished', 'Minęło {s} s.': '{s} s have passed.',
  'Jutro wygasa podpis aplikacji': 'App signature expires tomorrow',
  'Zrób backup (Więcej → Backup) i odnów w Sideloadly. Dane zostają.': 'Make a backup (More → Backup) and renew in Sideloadly. Your data stays.',

  /* jednostki w etykietach */
  '{u}/hantel': '{u}/dumbbell', '{u}/strona': '{u}/side',

  /* wartości domenowe (zapisane w danych po polsku, tłumaczone przy wyświetlaniu) */
  // partie (GROUPS) i mięśnie (MUSCLES)
  'klatka': 'chest', 'plecy': 'back', 'barki': 'shoulders', 'biceps': 'biceps', 'triceps': 'triceps', 'nogi': 'legs', 'pośladki': 'glutes', 'łydki': 'calves',
  'core': 'core', 'cardio': 'cardio', 'inne': 'other', 'czworogłowe': 'quads', 'dwugłowe': 'hamstrings', 'przedramiona': 'forearms',
  // sprzęt
  'hantle': 'dumbbells', 'sztanga': 'barbell', 'masa ciała': 'body weight', 'maszyna': 'machine', 'linki': 'cables',
  // metryki i tryby liczenia
  'ciężar + powtórzenia': 'weight + reps', 'powtórzenia': 'reps', 'dystans + czas': 'distance + time', 'ciężar + czas': 'weight + time',
  'per hantel (×2)': 'per dumbbell (×2)', 'łącznie': 'total', 'jednostronne (per strona, ×2)': 'unilateral (per side, ×2)',
  // moduły
  'Dieta': 'Diet', 'Sen': 'Sleep', 'Cardio': 'Cardio', 'Suplementy': 'Supplements', 'Zalecenia': 'Recommendations',
  // rodzaje rekordów (stats.setPRs)
  'dociążenie': 'added weight', 'ciężar': 'weight', 'e1RM': 'e1RM', 'objętość serii': 'set volume', 'objętość treningu': 'session volume', 'suma powtórzeń': 'session reps', 'łączny czas': 'session time', 'łączny dystans': 'session distance', 'suma pow.': 'session reps', 'Najlepszy trening (objętość)': 'Best session (volume)', 'Najwięcej powtórzeń na treningu': 'Most reps in a session', 'Najdłużej łącznie na treningu': 'Longest total time in a session', 'Najdłuższy dystans na treningu': 'Longest distance in a session', 'e1RM {v} (seria {s})': 'e1RM {v} (set {s})', '{k}: {v}': '{k}: {v}',

  /* audyt 0.8.1 */
  'Nie udało się zapisać danych': 'Could not save your data', 'Tapnij, by spróbować ponownie. Zrób też backup.': 'Tap to try again. Also make a backup.',
  'Poprzednich danych nie dało się odczytać': 'Your previous data could not be read', 'Kopia jest zachowana w telefonie. Tapnij, by ją wysłać, a potem zaimportuj backup.': 'A copy is kept on the phone. Tap to send it, then import a backup.',
  'Kopia nieczytelnych danych': 'Copy of unreadable data',
  'Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi (objętość, rekordy, wykresy).': 'Note: changing equipment, weight counting or metric also recalculates past workouts (volume, records, charts).',
  'Zniknie z list i szablonów; historia, wykresy i eksport zostaną.': 'It disappears from lists and templates; history, charts and export keep it.', 'Zniknie z list i szablonów.': 'It disappears from lists and templates.',
  'Usuń gumę': 'Delete band', 'Usunąć gumę?': 'Delete band?', 'W historii serie z tą gumą pokażą „?”.': 'Sets with this band will show “?” in history.', 'W trwającym treningu guma i jej asysta znikną z nieodhaczonych serii.': 'In the current workout the band and its assist are removed from sets not yet ticked.', 'powtórzenie|powtórzenia|powtórzeń': 'rep|reps', 'Usunąć z treningu?': 'Remove from workout?', 'Trening wciąż trwa': 'Workout still in progress', 'Ostatnia seria o {t}. Zakończyć trening z tą godziną końca?': 'Last set at {t}. Finish the workout with that end time?', 'Kontynuuj': 'Continue', 'superset · przerwa po rundzie {t}': 'superset · rest after round {t}', 'Max powtórzeń bez asysty': 'Max reps unassisted', 'Max powtórzeń z asystą': 'Max reps assisted', 'Odrzucić trening?': 'Discard workout?', 'Zakończ i zapisz': 'Finish and save', 'Odrzuć': 'Discard', 'Ostatnia seria o {t}. Otwórz, by zakończyć albo kontynuować.': 'Last set at {t}. Open to finish or continue.', 'Ostatnia rozgrzewka o {t}, bez serii roboczych. Kontynuować czy odrzucić?': 'Last warm-up at {t}, no working sets. Continue or discard?', 'Ostatnia rozgrzewka o {t}, bez serii roboczych. Otwórz, by kontynuować albo odrzucić.': 'Last warm-up at {t}, no working sets. Open to continue or discard.', 'Trening rozpoczęty o {t}, bez odhaczonych serii. Kontynuować czy odrzucić?': 'Workout started at {t}, no sets ticked. Continue or discard?', 'Trening rozpoczęty o {t}, bez odhaczonych serii. Otwórz, by kontynuować albo odrzucić.': 'Workout started at {t}, no sets ticked. Open to continue or discard.', 'Zapisałem trening': 'Workout saved', 'Trening z {d} {s} nie miał aktywności od 6 godzin, więc zapisał się sam. Koniec: {e} (ostatnia seria). Znajdziesz go w Historii.': 'The workout from {d} {s} had no activity for 6 hours, so it was saved automatically. End: {e} (last set). You will find it in History.', '{u}/hant.': '{u}/DB', '{u}/str.': '{u}/side', 'Max ciężar (na stronę)': 'Max weight (per side)', 'e1RM (Epley, na stronę)': 'e1RM (Epley, per side)', 'Brak gum. Dodaj pierwszą, by zapisywać asystę przy podciąganiu.': 'No bands yet. Add one to log assisted pull-ups.', '{c}, poziom {n}': '{c}, level {n}', 'Odhaczone serie bez czasu lub dystansu: {n}.': 'Ticked sets without time or distance: {n}.', 'Wykres, {n} {s}: od {a} ({x}) do {b} ({y}), najlepiej {c} ({z}).': 'Chart, {n} {s}: from {a} ({x}) to {b} ({y}), best {c} ({z}).', 'Wykres słupkowy: {v}': 'Bar chart: {v}', 'Tapnij, by wybrać inne ćwiczenie.': 'Tap to choose another exercise.', 'W trwającym treningu zostanie oznaczone jako usunięte.': 'In the current workout it will be marked as deleted.',
  'Połącz z następnym w superset': 'Link with next into a superset', 'Wyjmij z supersetu': 'Remove from superset', 'Przesuń wyżej': 'Move up', 'Przesuń niżej': 'Move down',
  'Usuń z szablonu': 'Remove from template', 'Usunąć z szablonu?': 'Remove from template?', '„do” jest mniejsze niż „od” — zakres pokaże się jako {n}+': '“to” is lower than “from” — the range will show as {n}+',
  'Nic do zapisania. Odrzucić ten trening?': 'Nothing to save. Discard this workout?', 'Odrzuć trening': 'Discard workout',
  'Usunięte ćwiczenie': 'Deleted exercise', 'serii': 'sets', 'usunięte': 'deleted', 'Usunąć ostatnią serię?': 'Remove the last set?', 'Seria jest już odhaczona.': 'This set is already ticked.',
  'Notatka do serii': 'Set note', 'Anuluj': 'Cancel', 'Zapisz': 'Save',
  'Powtórzenia': 'Reps', 'Stoper trwa': 'Stopwatch running', 'Start stopera serii': 'Start set stopwatch', 'Guma: {b}. Tapnij, by zmienić.': 'Band: {b}. Tap to change.', 'brak': 'none',
  'Skróć przerwę o 15 sekund': 'Shorten rest by 15 seconds', 'Wydłuż przerwę o 15 sekund': 'Extend rest by 15 seconds',
  // typy serii (dynamicznie, SET_KINDS)
  'normalna': 'normal', 'rozgrzewkowa': 'warm-up', 'drop set': 'drop set',
  /* audyt r1 */
  'Start: {name}': 'Start: {name}', 'Zakończyć trening?': 'Finish workout?',

  'Trening w toku zapisuje się na bieżąco. Tapnij numer serii, by oznaczyć rozgrzewkę (W), drop set (D), serię do upadku (F) albo dodać notatkę.': 'The workout in progress saves continuously. Tap a set number to mark a warm-up (W), drop set (D), set to failure (F) or add a note.',
  'Seria normalna': 'Normal set', 'Rozgrzewka (W)': 'Warm-up (W)', 'Drop set (D)': 'Drop set (D)', 'Do upadku (F)': 'To failure (F)', 'Edytuj notatkę': 'Edit note', 'Dodaj notatkę': 'Add note', 'Seria {n}': 'Set {n}',
  'Seria {n}, typ: {k}. Tapnij, by zmienić typ lub dodać notatkę.': 'Set {n}, type: {k}. Tap to change the type or add a note.',
  'Przerwa: {s}. Tapnij, by zmienić.': 'Rest: {s}. Tap to change.',
  /* runda 2 */
  'Nie udało się otworzyć danych.': 'Could not open your data.', 'Spróbuj ponownie': 'Try again',
  'Masa ciała: „±” to dociążenie (plus) albo asysta gumą/maszyną (minus). Masa ciała nie wchodzi do obliczeń: rekord to suma powtórzeń bez asysty, a e1RM i objętość liczą się tylko z dociążenia. Ćwiczenia na czas mają w treningu stoper — po upływie celu seria odhacza się sama. Przerwa ustawiona w pozycji szablonu ma pierwszeństwo; puste pole przerwy w szablonie oznacza przerwę z tego ćwiczenia.':
    'Body weight: “±” is added weight (plus) or band/machine assistance (minus). Body weight itself is not counted: the record is total unassisted reps, and e1RM and volume use only the added weight. Timed exercises get a stopwatch during the workout — the set ticks itself off when the target is reached. A rest set on a template item takes priority; an empty rest field in the template means this exercise’s rest.',
  'Pokazano {n} z {m} — wpisz nazwę, by zawęzić.': 'Showing {n} of {m} — type a name to narrow down.',
  'Zmierzyć serię od nowa?': 'Time this set again?', 'Zapisany czas zostanie nadpisany.': 'The saved time will be overwritten.', 'Zmierz': 'Time it',
  'Seria {n} zrobiona — {ex}': 'Set {n} done — {ex}',
  /* runda 3 */
  'Trening w toku': 'Workout in progress', 'Najpierw zakończ albo anuluj bieżący trening.': 'Finish or cancel the current workout first.',
  /* runda 4 */
  'Zapisane zostaną serie robocze: {n}.': 'Working sets to be saved: {n}.', 'Odhaczone serie bez powtórzeń: {n}.': 'Ticked sets without reps: {n}.',
  'Przywróć „{name}”': 'Restore “{name}”', 'usunięte ćwiczenie z historią': 'deleted exercise with history',
  'Kolor gumy': 'Band colour',
  'Poziom (1–7)': 'Level (1–7)',
  'Asysta ({u})': 'Assistance ({u})',
  'Tylko rozgrzewka': 'Warm-up only',
  'Odhaczone są tylko serie rozgrzewkowe ({n}). Zapisać taki trening?': 'Only warm-up sets are ticked ({n}). Save this workout anyway?',
  'Seria {n} — {ex}': 'Set {n} — {ex}',
  'Usuń ćwiczenie: {name}': 'Remove exercise: {name}',
  'Usuń usunięte ćwiczenie z treningu': 'Remove the deleted exercise from this workout',
  'Nieodhaczone serie z wpisanymi wynikami: {n} — nie zostaną zapisane. Seria zapisuje się po odhaczeniu ✓.': 'Unticked sets with entered results: {n} — they won’t be saved. A set is saved when you tick ✓.',
  '+ Nowy szablon': '+ New template',
  'przerwa {s}': 'rest {s}',
  'Backup z nowszej wersji aplikacji': 'Backup from a newer app version',
  'Ukryj komunikat': 'Hide message',
  'Wyślij kopię': 'Send copy',
  'Po ukryciu komunikatu kopii nie da się już wysłać z aplikacji — najpierw ją wyślij, jeśli jest potrzebna.': 'After hiding this message the copy can no longer be sent from the app — send it first if you need it.',
  'Seria': 'Set',
  'Przerwa': 'Rest',
  'usunięte ćwiczenie (w bieżącym treningu)': 'deleted exercise (in the current workout)',
  /* runda 75 */
  'Podpowiedź progresji (↑ przy ćwiczeniu, gdy ostatnio wszystkie serie były na górze zakresu powtórzeń)': 'Progression hint (↑ on the exercise when all sets last time reached the top of the rep range)',
  'Automatyczna kopia po każdym treningu (Pliki → Na moim iPhonie → Trening → Backup, ostatnie 10)': 'Automatic backup after every workout (Files → On My iPhone → Trening → Backup, last 10)',
  'Przypomnienie o wadze w poniedziałek o 7:00': 'Weigh-in reminder on Monday at 7:00',
  '↑ spróbuj {n} pow.': '↑ try {n} reps', '↑ spróbuj {v}': '↑ try {v}',
  'Poniedziałek — zważ się i zapisz wagę w porannym wpisie.': 'Monday — weigh yourself and log it in the morning check-in.',
  'Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam w Plikach (Na moim iPhonie → Trening → Backup, ostatnie 10). Import przyjmuje też te pliki. Te kopie znikają razem z aplikacją — przed jej usunięciem albo instalacją z innego Apple ID wyeksportuj backup na zewnątrz.': 'Automatic backup: after every workout a JSON file is saved in Files (On My iPhone → Trening → Backup, last 10). Import accepts these files too. These copies are deleted together with the app — before removing it or installing from a different Apple ID, export a backup elsewhere.',
  'Kopia automatyczna po treningu jest wyłączona (Ustawienia).': 'Automatic backup after a workout is off (Settings).',
  'Postęp treningu: {d} z {n} serii': 'Workout progress: {d} of {n} sets',
  '↑ spróbuj bez asysty': '↑ try without assistance',
  // T-010: kolejność przeciąganiem
  'Kolejność ćwiczeń': 'Exercise order', '≡ Kolejność': '≡ Reorder', 'Zmień kolejność ćwiczeń': 'Reorder exercises', 'Zmień kolejność: {name}': 'Reorder: {name}', '{n} z {all}': '{n} of {all}',
  'Przeciągnij za ≡, żeby zmienić kolejność. Superset przesuwa się w całości; kolejność w nim zmienisz uchwytami przy ćwiczeniach.': 'Drag by ≡ to change the order. A superset moves as a whole; use the handles next to its exercises to reorder within it.',
  'Nie ma treningu w toku.': 'No workout in progress.', 'Gotowe': 'Done', 'superset': 'superset', 'ćwiczenie|ćwiczenia|ćwiczeń': 'exercise|exercises',
};
