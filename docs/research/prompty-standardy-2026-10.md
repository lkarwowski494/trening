# Prompty i wzorce pracy z AI przy wytwarzaniu oprogramowania — research (11.10.2026)

Cel: podstawa do definicji ról agentów w `.claude/agents/*.md` (analityk produktu, badacz merytoryczny, programista,
tłumacz, tester E2E, audytor, wydawca).

Metoda: każde źródło otwarte (WebFetch / curl) 11.10.2026. Cytaty najwyżej 1–2 zdania, reszta własnymi słowami.
Statusy:
- **potwierdzone** — strona autora/organizacji, oficjalna dokumentacja, przeczytana;
- **pośrednie** — ktoś cytuje autora (podano kogo);
- **niepotwierdzone, ale sensowne — moja ocena** — wniosek własny z uzasadnieniem.

Uwaga o narzędziu: WebFetch zwraca tekst przetworzony przez mały model; dosłowne cytaty sprawdzałem tam, gdzie pobrałem
surowy tekst (Anthropic „Prompting best practices”, Claude Code „Best practices”, `sub-agents`, prompt `claude-code-security-review`,
plik Kenta Becka). Pozostałe cytaty pochodzą z odpowiedzi WebFetch na prośbę o cytat dosłowny — przed wklejeniem do repo warto
je jeszcze raz porównać ze stroną.

---

## A. Anthropic — oficjalne

### A1. Claude Code: „Best practices for Claude Code”
- **URL:** https://code.claude.com/docs/en/best-practices (dawniej anthropic.com/engineering/claude-code-best-practices — przekierowanie 308)
- **Status:** potwierdzone (pełny tekst przeczytany)
- **Cytat** (wstęp): „Most best practices are based on one constraint: Claude's context window fills up fast, and performance degrades as it fills.”
- **Wzorce (wg sekcji):**
  - *Give Claude a way to verify its work* — agent kończy, gdy praca „wygląda na gotową”; trzeba mu dać sprawdzenie zwracające
    pass/fail (testy, build, linter, zrzut ekranu). Agent ma pokazać **dowód** (wynik polecenia, zrzut), a nie twierdzić, że działa.
    Bramki: w promptcie, `/goal`, hook `Stop`, albo osobny subagent weryfikujący („agent wykonujący nie ocenia sam siebie”).
  - *Explore first, then plan, then code* — cztery fazy: Explore → Plan → Implement → Commit (plan mode). Planowanie pomijać,
    gdy zmianę da się opisać jednym zdaniem.
  - *Provide specific context* — wskazać pliki, scenariusz, istniejący wzorzec w kodzie; przy błędzie: objaw + miejsce + „napisz
    test, który odtwarza problem, potem napraw”.
  - *Write an effective CLAUDE.md* — krótko; przy każdej linii pytać „czy jej usunięcie spowoduje błąd?”. Za długi plik → reguły
    giną. Wiedza potrzebna tylko czasem → skills (ładowane na żądanie). Rzeczy, które muszą zajść zawsze → hooki (deterministyczne).
  - *Let Claude interview you* — przy większych funkcjach agent przeprowadza wywiad (UI/UX, przypadki brzegowe, kompromisy)
    i zapisuje `SPEC.md`; implementacja w **nowej sesji** z czystym kontekstem. Dobra specyfikacja: nazywa pliki i interfejsy, mówi,
    co jest poza zakresem, kończy się krokiem weryfikacji end-to-end.
  - *Manage context aggressively* — `/clear` między niezwiązanymi zadaniami; po dwóch nieudanych poprawkach — nowa sesja z lepszym
    promptem; instrukcje dla kompaktowania w CLAUDE.md (np. zachowaj listę zmienionych plików i polecenia testów).
  - *Use subagents for investigation* — research w osobnym kontekście, do głównego wraca streszczenie.
  - *Writer/Reviewer* — świeży kontekst lepiej recenzuje, bo nie jest przywiązany do kodu, który sam napisał; można też: jeden agent
    pisze testy, drugi kod.
  - *Add an adversarial review step* — subagent widzi tylko diff i kryteria (np. plan); raportuje luki, nie preferencje stylu.
    Ostrzeżenie: recenzent proszony o luki prawie zawsze jakieś znajdzie → kazać zgłaszać tylko to, co wpływa na poprawność
    lub wymagania; reszta opcjonalna (inaczej przeinżynierowanie).
  - *Avoid common failure patterns* — „kitchen sink session”, wielokrotne poprawianie, przerośnięty CLAUDE.md, „trust-then-verify gap”,
    nieograniczona eksploracja.
- **Jak zastosować u nas:** szkielet wszystkich ról. Programista: Explore→Plan→Implement z dowodem (wynik `npm run verify`).
  Analityk produktu: wywiad → spec z „poza zakresem” i krokiem E2E. Audytor: przegląd diffu w świeżym kontekście, tylko znaleziska
  wpływające na poprawność/wymagania (pasuje do progu KRYTYCZNE/WYSOKIE z CLAUDE.md). Wszyscy: krótkie, nieredundantne prompty ról.

### A2. Claude Code: „Create custom subagents”
- **URL:** https://code.claude.com/docs/en/sub-agents
- **Miejsce:** „Choose the subagent scope”, „Frontmatter reference”, „Example subagents” (ramka *Best practices*)
- **Status:** potwierdzone
- **Cytat** („Choose the subagent scope”): „Check them into version control so your team can use and improve them collaboratively.”
- **Wzorzec:** plik Markdown z YAML (`name`, `description` wymagane; `tools`, `disallowedTools`, `model`, `permissionMode`,
  `maxTurns`, `skills`, `hooks`, `memory`, `effort`, `isolation`…); treść = system prompt. Dobre praktyki z ramki: jeden subagent =
  jedno zadanie; opis jednoznacznie wskazujący, kiedy delegować (łączny budżet opisów ~15 000 tokenów); minimalne uprawnienia
  narzędzi; w repozytorium. Przykłady: `code-reviewer` (tylko odczyt: Read, Grep, Glob, Bash; checklista; wynik w priorytetach
  Critical/Warnings/Suggestions), `debugger` (przyczyna źródłowa, dowód, minimalna poprawka, weryfikacja), `db-reader` (hook
  `PreToolUse` jako twarda bariera, prompt jako pierwsza linia).
- **Jak zastosować u nas:** format plików `.claude/agents/*.md`. Audytor i badacz — bez Edit/Write. Wydawca — hook blokujący
  niebezpieczne polecenia (np. push do `main`, wypisanie sekretów w logach). Opisy ról tak, by się nie nakładały.

### A3. „Prompting best practices” (Claude API docs)
- **URL:** https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
  (przekierowanie z …/claude-4-best-practices)
- **Status:** potwierdzone (pełny tekst przeczytany)
- **Cytat** („Be clear and direct”): „Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too.”
- **Wzorce (sekcje):**
  - *Add context to improve performance* — podawać **powód** reguły; model uogólnia z uzasadnienia lepiej niż z zakazu.
  - *Give Claude a role* — nawet jedno zdanie roli w system prompcie skupia zachowanie.
  - *Workflows across multiple context windows* — pierwsze okno: przygotowanie ramy (testy, skrypty startowe); kolejne: praca
    wg listy; testy w formacie strukturalnym (`tests.json`); notatki postępu (`progress.txt`) + git jako stan; przy starcie nowej
    sesji: przeczytaj postęp, testy, log gita, uruchom podstawowy test integracyjny. Cytat: „It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality.”
  - *Balancing autonomy and safety* — działania lokalne i odwracalne: śmiało; nieodwracalne / widoczne dla innych (push, komentarze
    w PR, force-push, usuwanie): pytać; nie obchodzić zabezpieczeń (`--no-verify`).
  - *Research and information gathering* — kryteria sukcesu, weryfikacja w kilku źródłach, konkurujące hipotezy, śledzenie pewności
    w notatkach, samokrytyka.
  - *Subagent orchestration* — modele same delegują, czasem za często; przykładowy prompt: subagenty tylko przy pracy równoległej,
    izolowanym kontekście lub niezależnych strumieniach; proste zadania — bezpośrednio.
  - *Chain complex prompts* — wzorzec samokorekty: szkic → przegląd wg kryteriów → poprawa.
  - *Overeagerness* — gotowy prompt przeciw przeinżynierowaniu (zakres, dokumentacja, obrona przed scenariuszami niemożliwymi,
    abstrakcje na zapas).
  - *Avoid focusing on passing tests and hardcoding* — rozwiązanie ogólne, nie pod testy; jeśli test jest błędny — zgłosić, nie obchodzić.
  - *Minimizing hallucinations in agentic coding* — „nie spekuluj o kodzie, którego nie otworzyłeś”.
  - *Frontend design* — bez wskazówek modele zbiegają do generycznego wyglądu („AI slop”); prompt nakazuje świadome decyzje
    o typografii, kolorze, ruchu, tle.
- **Jak zastosować u nas:** Programista: bloki „overeagerness”, „no hardcoding to tests”, „investigate before answering”.
  Wszystkie role: każda reguła z jednym zdaniem „dlaczego”. Wydawca: blok „autonomy and safety” (push, TestFlight, App Store Connect
  = działania widoczne dla innych → potwierdzenie właściciela). Badacz merytoryczny: blok „research” + hierarchia źródeł z CLAUDE.md.
  Analityk/UX: blok „frontend design” przełożony na iOS (z zastrzeżeniem: u nas obowiązuje spójność z HIG i dostępność, nie „zaskakiwanie”).

### A4. „Effective context engineering for AI agents” (29.09.2025)
- **URL:** https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- **Status:** potwierdzone
- **Cytat** („Why context engineering is important…”): „Context, therefore, must be treated as a finite resource with diminishing marginal returns.”
- **Wzorzec:** najmniejszy zestaw tokenów o wysokim sygnale; system prompt na „właściwej wysokości” (ani sztywne if-y, ani ogólniki;
  zacząć od minimum i dopisywać tylko pod zaobserwowane błędy); pobieranie „just in time” (ścieżki, zapytania zamiast wklejania
  treści); kompaktowanie; strukturalne notatki poza kontekstem; subagenty zwracające skondensowane streszczenie (rzędu 1–2 tys. tokenów).
- **Jak zastosować u nas:** prompty ról krótkie, odsyłają do plików (`docs/20`, `docs/09`) zamiast je kopiować. Każdy subagent
  kończy raportem o ograniczonej długości. Tester E2E: zwraca tylko błędy, nie całe logi.

### A5. „Building effective agents” (19.12.2024)
- **URL:** https://www.anthropic.com/engineering/building-effective-agents
- **Status:** potwierdzone
- **Cytat** (sekcja o ACI): „Tool definitions and specifications should be given just as much prompt engineering attention as your overall prompts.”
- **Wzorzec:** wzorce przepływów: łańcuch promptów (z bramkami programowymi między krokami), routing, równoległość (podział lub
  głosowanie), orkiestrator–wykonawcy, ewaluator–optymalizator (pętla z jasnymi kryteriami). Zasady: prostota (złożoność tylko
  gdy mierzalnie pomaga), przejrzystość planu.
- **Jak zastosować u nas:** spec → plan → kod → verify to łańcuch z bramkami (verify, check:matrix). Audytor wobec programisty =
  ewaluator–optymalizator, ale z limitem „jeden audyt na wydanie” (CLAUDE.md, wariant A) — pętla zamyka się na testach, nie na
  kolejnym audycie. Głosowanie (kilka niezależnych przebiegów) — sensowne dla badacza przy sprzecznych źródłach.

### A6. „How we built our multi-agent research system” (13.06.2025)
- **URL:** https://www.anthropic.com/engineering/multi-agent-research-system
- **Miejsce:** „Prompt engineering and evaluations for research agents”, „Effective evaluation of agents”
- **Status:** potwierdzone
- **Cytat:** „Multi-agent systems work mainly because they help spend enough tokens to solve the problem.”
- **Wzorzec:** orkiestrator musi każdemu podagentowi dać cel, format wyniku, wskazówki narzędzi i granice zadania (inaczej
  duplikacja pracy); skala wysiłku dopasowana do złożoności; najpierw szerokie zapytania, potem zawężanie; ocena: małe próbki od razu,
  LLM-as-judge z rubryką (trafność faktów, cytowań, kompletność, jakość źródeł), plus ocena ludzka — ludzie wyłapali, że agenci
  wybierali farmy treści SEO zamiast źródeł autorytatywnych. Systemy wieloagentowe zużywają ok. 15× więcej tokenów niż czat.
- **Jak zastosować u nas:** szablon zlecenia dla każdej roli: cel / format wyniku / narzędzia / granice. Badacz merytoryczny:
  „szeroko, potem wąsko”, odrzucanie źródeł niskiej jakości (zgodnie z hierarchią). Oszczędność: wieloagentowość tylko tam, gdzie
  zadanie jest wartościowe i równoległe.

### A7. „Effective harnesses for long-running agents” (26.11.2025)
- **URL:** https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **Status:** potwierdzone
- **Cytat:** „Providing Claude with these kinds of testing tools dramatically improved performance.”
- **Wzorzec:** agent inicjalizujący (skrypt startowy, plik postępu, pierwszy commit, lista funkcji w JSON — wszystkie „nieukończone”)
  + agent kodujący (jedna funkcja na sesję, zostawia kod w stanie do scalenia, aktualizuje notatki). JSON wybrany, bo model rzadziej
  go niewłaściwie zmienia niż Markdown. Agenci oznaczali funkcje jako gotowe po samych testach jednostkowych — testowanie „jak
  użytkownik” (automatyzacja przeglądarki) wyraźnie pomogło; narzędzie nie widziało natywnych modali → te funkcje były słabsze.
- **Jak zastosować u nas:** Tester E2E (Maestro) jako warunek „ukończone” (zgodne z `docs/20`). Uwaga z artykułu przenosi się 1:1:
  elementy niewidoczne dla narzędzia E2E (alerty systemowe iOS, uprawnienia) wymagają osobnego planu testu. Stan prac w `docs/`
  + git; status funkcji w formie strukturalnej.

### A8. `anthropics/claude-code-security-review` — prompt przeglądu bezpieczeństwa
- **URL:** https://github.com/anthropics/claude-code-security-review (prompt: `claudecode/prompts.py`)
- **Status:** potwierdzone (pobrany plik źródłowy)
- **Cytat** (FINAL REMINDER): „Better to miss some theoretical issues than flood the report with false positives.”
- **Wzorzec:** recenzja tylko zmian z PR (nie istniejących problemów); zgłaszać tylko przy >80% pewności co do realnej
  wykorzystywalności; jawna lista wykluczeń (np. DoS, rate limiting); skala HIGH/MEDIUM/LOW i liczbowa pewność (poniżej 0,7 — nie
  zgłaszać); wynik wyłącznie w JSON; README ostrzega, że akcja nie jest odporna na prompt injection.
- **Jak zastosować u nas:** Audytor: zakres = diff od poprzedniego wydania + stała lista kontrolna; każde znalezisko z poziomem
  (KRYTYCZNE/WYSOKIE/ŚREDNIE/NISKIE wg CLAUDE.md), pewnością i dowodem; jawna lista „nie zgłaszaj”; wynik w strukturze (JSON lub
  tabela), żeby wydawca mógł automatycznie sprawdzić, czy są blokery.

---

## B. OpenAI

### B1. „GPT-4.1 Prompting Guide” (cookbook)
- **URL:** https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide (przekierowanie z cookbook.openai.com)
- **Miejsce:** „Agentic Workflows → System Prompt Reminders”, „Long context”, „Instruction following”
- **Status:** potwierdzone
- **Cytat** (przypomnienie o wytrwałości): „Only terminate your turn when you are sure that the problem is solved.”
- **Wzorzec:** trzy przypomnienia w prompcie agenta: wytrwałość, używanie narzędzi zamiast zgadywania, planowanie i refleksja
  między wywołaniami narzędzi (wg OpenAI podniosły wewnętrzny wynik SWE-bench Verified o prawie 20%). Struktura promptu: rola i cel →
  instrukcje → kroki rozumowania → format wyniku → przykłady → kontekst. Przy sprzecznych instrukcjach model zwykle wybiera tę
  bliżej końca; unikać WIELKICH LITER bez potrzeby; przy długim kontekście instrukcje na początku i na końcu.
- **Jak zastosować u nas:** wspólny szkielet pliku roli (Rola i cel / Zasady / Kroki / Format wyniku / Przykład). Przegląd promptów
  ról pod kątem sprzeczności z CLAUDE.md.

### B2. „GPT-5 prompting guide” (cookbook)
- **URL:** https://developers.openai.com/cookbook/examples/gpt-5/gpt-5_prompting_guide
- **Miejsce:** „Agentic eagerness”, „Tool preambles”, „Self-reflection / zero-to-one”, „Matching codebase design standards”,
  „Cursor's learnings”, „Contradictory instructions”
- **Status:** potwierdzone
- **Cytat** (Cursor's learnings): „Write code for clarity first.”
- **Wzorzec:** sterowanie „zapałem” agenta (kryteria wczesnego zatrzymania i limity wywołań vs. wytrwałość); preambuły —
  agent powtarza cel, plan, relacjonuje kroki, podsumowuje; dla nowych aplikacji ukryta rubryka 5–7 kategorii jakości i iteracja do
  jej spełnienia; jawne reguły zgodności ze stylem kodu; zbyt mocne nakazy dokładności (np. „maximize…”) powodowały nadmiar wywołań
  narzędzi; sprzeczne instrukcje marnują rozumowanie — audytować prompty pod kątem sprzeczności.
- **Jak zastosować u nas:** badacz i analityk — jawne kryteria zatrzymania („wystarczy N niezależnych źródeł szczebla 2–3”).
  Programista — rubryka jakości przed oddaniem (testy, i18n, macierz, dostępność). Unikać przesadnych „ZAWSZE/MAKSYMALNIE”.

### B3. „GPT-5-Codex prompting guide” — zasada „less is more”
- **URL źródła:** https://cookbook.openai.com/examples/gpt-5-codex_prompting_guide (pod tym adresem / nowym adresem developers.openai.com
  dostałem 404 — nie przeczytałem oryginału)
- **Status:** pośrednie — cytuje Simon Willison, https://simonwillison.net/2025/Sep/23/gpt-5-codex/
- **Cytat (za Willisonem):** „The core prompting principle for GPT-5-Codex is “less is more.””
- **Wzorzec:** modele trenowane do kodowania mają wbudowane dobre praktyki; nadmiar instrukcji może obniżać jakość.
- **Jak zastosować u nas:** zgodne z A1 (krótki CLAUDE.md) i A4 (minimalny prompt) — prompt roli nie powtarza tego, co model robi sam.

### B4. AGENTS.md (otwarty format, Agentic AI Foundation / Linux Foundation; współtwórcy m.in. OpenAI Codex, Google Jules, Cursor)
- **URL:** https://agents.md/
- **Status:** potwierdzone
- **Cytat:** „Think of AGENTS.md as a README for agents.”
- **Wzorzec:** plik instrukcji dla agentów w repo: przegląd projektu, polecenia build/test, styl kodu, instrukcje testów, bezpieczeństwo,
  zasady PR; najbliższy plik względem edytowanego wygrywa, a polecenie użytkownika ma pierwszeństwo.
- **Jak zastosować u nas:** CLAUDE.md pełni tę rolę; kategorie z AGENTS.md jako lista kontrolna kompletności CLAUDE.md
  (opcjonalnie AGENTS.md jako dowiązanie, jeśli kiedyś inne narzędzia).

---

## C. Google

### C1. „Prompt design strategies” (Gemini API)
- **URL:** https://ai.google.dev/gemini-api/docs/prompting-strategies
- **Miejsce:** „Zero-shot vs few-shot prompts”, „Gemini 3 → Core prompting principles”, „Agentic workflows”
- **Status:** potwierdzone
- **Cytat** (Zero-shot vs few-shot): „We recommend to always include few-shot examples in your prompts.”
- **Wzorzec:** przykłady w spójnym formacie (ale nie za dużo — przeuczenie na przykładach); rozbijanie złożonych zadań na łańcuch;
  przy dużym kontekście najpierw kontekst, potem pytanie; spójne ograniczniki (XML/nagłówki); dla agentów — sterowanie planowaniem,
  obsługą błędów, oceną ryzyka i tym, kiedy pytać użytkownika.
- **Jak zastosować u nas:** każdy plik roli z 1 krótkim przykładem dobrego wyniku (np. znalezisko audytu, wpis źródła badacza,
  wpis słownika tłumacza). Sekcja „kiedy pytać właściciela” w każdej roli.

---

## D. Uznani praktycy

### D1. Simon Willison — „Here's how I use LLMs to help me write code” (11.03.2025)
- **URL:** https://simonwillison.net/2025/Mar/11/using-llms-for-code/
- **Status:** potwierdzone
- **Cytat** („You have to test what it writes!”): „If you haven't seen it run, it's not a working system.”
- **Wzorzec:** realistyczne oczekiwania (pewny siebie partner, który się myli); uwzględnianie daty odcięcia wiedzy (stabilne
  biblioteki, przykłady dla nowych API); „context is king” — nowa rozmowa = kontekst od zera; prosić o opcje (research, prototyp);
  przy kodzie produkcyjnym mówić dokładnie, co zrobić (sygnatury, zachowanie); testowanie zawsze po stronie człowieka/procesu.
- **Jak zastosować u nas:** programista — przy Expo/RN SDK sprawdzać aktualną dokumentację, nie pamięć modelu (data odcięcia).
  Analityk — „prośba o opcje” = wymóg CLAUDE.md „co najmniej dwie opcje z kompromisami”.

### D2. Simon Willison — „Agentic Engineering Patterns” (przewodnik)
- **URL:** https://simonwillison.net/guides/agentic-engineering-patterns/ (rozdziały niżej)
- **Status:** potwierdzone
- **Red/green TDD** — https://simonwillison.net/guides/agentic-engineering-patterns/red-green-tdd/ — test najpierw, potwierdzić, że
  **nie przechodzi**, potem implementacja. Przykładowy prompt: „Build a Python function to extract headers from a markdown string. Use red/green TDD.”
  Hasło „red/green TDD” wystarcza dobrym modelom jako skrót całej procedury.
- **First run the tests** — https://simonwillison.net/guides/agentic-engineering-patterns/first-run-the-tests/ — na starcie sesji
  uruchomić istniejące testy: agent uczy się, że są i jak je odpalać, i częściej je potem uruchamia.
- **Agentic manual testing** — https://simonwillison.net/guides/agentic-engineering-patterns/agentic-manual-testing/ — testy
  jednostkowe mogą przechodzić, a aplikacja nie startuje; agent ma ręcznie przećwiczyć kod (curl, przeglądarka, zrzuty) i zapisać
  notatki z **rzeczywistym** wynikiem; znaleziony błąd → test red/green. Cytat: „Never assume that code generated by an LLM works until that code has been executed.”
- **Subagents** — https://simonwillison.net/guides/agentic-engineering-patterns/subagents/ — eksploracja, równoległość,
  specjaliści (recenzent, „test runner” zgłaszający tylko porażki, debugger); przestroga: nie mnożyć specjalistów — główna wartość
  to ochrona kontekstu głównego agenta.
- **Anti-patterns** — https://simonwillison.net/guides/agentic-engineering-patterns/anti-patterns/ — nie przekazywać innym
  nieprzejrzanego kodu agenta; dołączać dowody sprawdzenia (notatki, zrzuty). Cytat: „Don't file pull requests with code you haven't reviewed yourself”.
- **Jak zastosować u nas:** programista — „red/green TDD” + „najpierw uruchom testy” w prompcie; tester E2E — notatki z rzeczywistym
  wynikiem (zrzut Maestro), błąd → test regresji (`tests/regress.test.tsx`); wydawca — opis PR z dowodami. Liczba ról: 7 to
  rozsądny górny pułap — nie dzielić dalej.

### D3. Harper Reed — „My LLM codegen workflow atm” (16.02.2025)
- **URL:** https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/
- **Miejsce:** „Idea honing”, „Planning”, „Execution”
- **Status:** potwierdzone
- **Cytat** (Idea honing): „Ask me one question at a time so we can develop a thorough, step-by-step spec for this idea.”
- **Wzorzec:** (1) dopracowanie pomysłu przez pytania zadawane pojedynczo → `spec.md`; (2) model rozumujący tworzy plan i dzieli go
  na małe, budujące na sobie kroki (wariant TDD) → `prompt_plan.md` + `todo.md` jako lista kontrolna trzymająca stan między sesjami;
  (3) wykonanie krok po kroku z testami.
- **Jak zastosować u nas:** analityk produktu — wywiad „jedno pytanie naraz” (z opcjami i rekomendacją wg CLAUDE.md); plan w małych
  krokach, każdy kończony zielonym verify.

### D4. Addy Osmani — „My LLM coding workflow going into 2026” (04.01.2026)
- **URL:** https://addyosmani.com/blog/ai-coding-workflow/
- **Status:** potwierdzone
- **Cytat** (Start with a clear plan): „Don't just throw wishes at the LLM - begin by defining the problem and planning a solution.”
- **Wzorzec:** spec i plan przed kodem; małe kroki; bogaty kontekst; wybór modelu do zadania; człowiek w pętli — wynik AI traktowany
  jako niezaufany, przegląd drugim modelem/sesją; częste commity jako punkty zapisu; pliki reguł; CI i linters jako obiektywne sprawdzenie.
- **Jak zastosować u nas:** wspiera podział programista/audytor i częste małe commity na gałęzi funkcji.

### D5. Addy Osmani — „How to write a good spec for AI agents” (13.01.2026)
- **URL:** https://addyosmani.com/blog/good-spec/ (przedruk: O'Reilly Radar)
- **Miejsce:** sekcje 2 („Structure the spec like a professional PRD”), 3 („Break tasks into modular prompts…”), 4 („Build in self-checks…”)
- **Status:** potwierdzone
- **Cytat** (sekcja 3): „The bottom line: small, focused context beats one giant prompt.”
- **Wzorzec:** zacząć od krótkiej wizji, agent rozwija ją w spec, człowiek zatwierdza; sześć obszarów (polecenia, testy, struktura,
  styl, git, granice — wg analizy GitHuba ponad 2 500 plików konfiguracji agentów); granice w trzech poziomach: **zawsze / najpierw
  zapytaj / nigdy**; samosprawdzenie i testy zgodności ze spec; spec jako żywy dokument w repo; do zadania ładować tylko potrzebne
  fragmenty spec.
- **Jak zastosować u nas:** każda rola ma sekcję „Zawsze / Zapytaj właściciela / Nigdy” (np. wydawca: nigdy merge do `main` bez
  polecenia; zapytaj przed wysyłką do TestFlight; zawsze verify).

### D6. Kent Beck — „Augmented Coding: Beyond the Vibes” (25.06.2025)
- **URL:** https://newsletter.kentbeck.com/p/augmented-coding-beyond-the-vibes (dawniej tidyfirst.substack.com)
- **Miejsce:** pytanie „What were the warning signs that told you the AI was going off track?” oraz Appendix 1 (system prompt)
- **Status:** potwierdzone
- **Cytat** (sygnał ostrzegawczy): „Any indication that the genie was cheating, for example by disabling or deleting tests.”
- **Wzorzec:** system prompt (Appendix 1; zaczyna się od „Always follow the instructions in plan.md.”): cykl Red→Green→Refactor
  małymi krokami; „Tidy First” — zmiany strukturalne oddzielone od zmian zachowania, testy przed i po zmianie strukturalnej; commit
  tylko przy zielonych testach i bez ostrzeżeń, jeden logiczny krok na commit, oznaczony jako strukturalny/behawioralny. Sygnały,
  że agent zbacza: pętle, funkcje, o które nie proszono, oszukiwanie (wyłączanie/usuwanie testów).
- **Uzupełnienie** (potwierdzone, plik w repo autora): https://github.com/KentBeck/BPlusTree3/blob/main/.claude/system_prompt_additions.md —
  „ALWAYS / NEVER”, testy przed implementacją, punkty kontrolne przed uznaniem kodu za gotowy (brak ostrzeżeń, testy, brak ryzyka
  zepsucia danych, dokumentacja zgodna z implementacją).
- **Jak zastosować u nas:** programista — zakaz usuwania/osłabiania testów bez zapisanego powodu; commit strukturalny osobno od
  behawioralnego; audytor — „nieproszone funkcje” jako kategoria znaleziska (zgodne z zamrożeniem zakresu).

### D7. Andrej Karpathy — „Software Is Changing (Again)” / Software 3.0 (YC AI Startup School, czerwiec 2025)
- **URL notatek:** https://www.latent.space/p/s3 — sekcja „Part 3b: Human-AI Generation-Verification Loop” (w „Part 3: Partial Autonomy”)
- **Status:** pośrednie — notatki Shawna „swyx” Wanga (Latent Space), nie transkrypcja Karpathy’ego. Nagrania nie przeczytałem.
- **Cytat (za swyx):** „To improve generation: Keep AI on tight leash”
- **Wzorzec:** pętla generowanie (AI) ↔ weryfikacja (człowiek) ma być jak najszybsza: ułatwić weryfikację (diff, podgląd,
  zrzuty) i trzymać AI „na krótkiej smyczy” (małe przyrosty); „suwak autonomii”.
- **Jak zastosować u nas:** małe PR-y z dowodami (zrzut, wynik testu) skracają czas weryfikacji właściciela.

### D8. Birgitta Böckeler (Thoughtworks) — „Understanding Spec-Driven-Development: Kiro, spec-kit, and Tessl” (15.10.2025)
- **URL:** https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html
- **Miejsce:** „One workflow to fit all sizes?”, „Reviewing markdown over reviewing code?”
- **Status:** potwierdzone
- **Cytat:** „the workflow was like using a sledgehammer to crack a nut.”
- **Wzorzec (krytyczny głos):** narzędzia SDD rozdmuchują małe poprawki (mały błąd → 4 historyjki i 16 kryteriów); dużo rozwlekłych
  plików Markdown do przejrzenia; agenci i tak ignorowali części spec (duplikowali istniejące klasy) albo nadgorliwie stosowali
  „konstytucję”. Rozróżnia spec-first / spec-anchored / spec-as-source.
- **Jak zastosować u nas:** waga procesu proporcjonalna do zmiany (jak w A1: plan pomijany przy zmianie opisywalnej jednym zdaniem).
  Spec krótki; recenzja kodu i testów ważniejsza niż objętość dokumentów.

### D9. GitHub — Spec Kit, „Spec-Driven Development”
- **URL:** https://github.com/github/spec-kit/blob/main/spec-driven.md
- **Status:** potwierdzone
- **Cytat:** „Specifications don't serve code—code serves specifications.”
- **Wzorzec:** konstytucja (zasady projektu) → specify → plan → tasks → implement; znaczniki `[NEEDS CLARIFICATION]` zamiast zgadywania;
  spec opisuje „co i dlaczego”, bez technologii; checklisty jako „testy jednostkowe” spec; bramki wymagające uzasadnienia złożoności;
  kolejność: kontrakty → testy → kod; artykuł „test-first”: brak kodu przed testami zatwierdzonymi i potwierdzonymi jako czerwone.
- **Jak zastosować u nas:** znacznik „[DO WYJAŚNIENIA]” w spec = zasada CLAUDE.md „nie zgaduj liczb — oznacz jako otwarte”.
  (Artykuł „library-first” nie pasuje do aplikacji mobilnej — pominąć.)

### D10. Nielsen Norman Group — „Good from Afar, But Far from Good: AI Prototyping in Real Design Contexts” (24.10.2025)
- **URL:** https://www.nngroup.com/articles/ai-prototyping/ — autorki: Huei-Hsin Wang, Megan Brown
- **Status:** potwierdzone
- **Cytat** (Conclusion): „the real work of design remains in the judgment, empathy, and intent that only human designers can provide”
- **Wzorzec:** ogólne prompty → losowe wyniki (narzędzie wypełnia luki założeniami); szczegółowe prompty (komponenty, styl, **stany**
  interakcji, dokładny kontekst) i załączone szkice/makiety → wyniki bliskie ludzkim; mimo to problemy z hierarchią, grupowaniem,
  kontrastem, odstępami; terminy niejednoznaczne („profil”) prowadziły do złego wzorca. Rekomendacja: AI do ideacji i prototypów
  niskiej/średniej wierności, każdy wynik przejrzeć pod kątem hierarchii, kontrastu, dopasowania wzorca.
- **Jak zastosować u nas:** analityk produktu (UX/przepływy): prompt podaje istniejące ekrany i komponenty, wszystkie stany (pusty,
  błąd, ładowanie, offline), słownik pojęć aplikacji; wynik = propozycja do decyzji właściciela, z checklistą (hierarchia, kontrast,
  dostępność, Dynamic Type).

---

## E. Luki — nie znalazłem przeczytanego źródła

- **Prompty do tłumaczeń/lokalizacji UI przez LLM** od uznanej organizacji — nie znalazłem w tym przebiegu. Dla roli tłumacza:
  **niepotwierdzone, ale sensowne — moja ocena:** zastosować wzorce ogólne (A3: kontekst i powód reguły; C1: przykłady w spójnym
  formacie; A6: rubryka oceny) + słownik terminów i limity długości z projektu. Warto osobno poszukać w dokumentacji Apple
  (lokalizacja, String Catalogs) — to szczebel „dokumentacja producenta”.
- **Prompty UX od NN/g w formie gotowych szablonów** — NN/g daje wnioski z badania, nie prompty; zbiory „X promptów dla UX” w sieci
  to blogi bez weryfikowalnych źródeł — pominięte.
- **Karpathy** — tylko pośrednio (notatki Latent Space).

---

## F. 10–15 zasad do wbudowania w prompty ról

1. **Weryfikacja zamiast deklaracji.** Każda rola kończy pracę dowodem (wynik `npm run verify`, zrzut/raport Maestro, link do
   źródła z miejscem), nie stwierdzeniem „działa”. — A1 („Give Claude a way to verify its work”), D2 (agentic manual testing), D1.
2. **Spec → plan → kod → weryfikacja, z wagą proporcjonalną do zmiany.** Plan i spec przy zmianach wieloplikowych lub niejasnych;
   zmiana opisywalna jednym zdaniem — bez planu. — A1 („Explore first…”), D3, D5, D9, D8 (krytyka nadmiaru).
3. **Wywiad przed spec, jedno pytanie naraz, z opcjami.** Analityk zadaje pytania pojedynczo, przy decyzjach produktowych podaje
   ≥2 opcje z kompromisami i rekomendacją; implementacja w nowej sesji ze spec. — A1 („Let Claude interview you”), D3, D1 („Ask them for options”).
4. **Niewiadome oznaczać, nie zgadywać.** Znacznik „[DO WYJAŚNIENIA]” w spec; badacz zapisuje do otwartych pytań to, czego nie
   potwierdził. — D9 (`[NEEDS CLARIFICATION]`), A3 („Minimizing hallucinations…”).
5. **Red/green TDD i „najpierw uruchom testy”.** Test najpierw, potwierdzić, że jest czerwony, potem kod; na starcie sesji uruchomić
   istniejące testy; błąd z testów ręcznych/E2E → test regresji. — D2 (Red/green TDD, First run the tests), D6, D9 (test-first).
6. **Zakaz osłabiania testów i kodu „pod testy”.** Nie usuwać, nie wyłączać, nie edytować testów, by przeszły; błędny test zgłosić.
   — A3 („Avoid focusing on passing tests and hardcoding”, „Workflows across multiple context windows”), A7, D6 (warning signs).
7. **Minimalny zakres zmian.** Bez nieproszonych funkcji, abstrakcji na zapas i refaktoru „przy okazji”; zmiany strukturalne
   osobno od zmian zachowania. — A3 („Overeagerness”), D6 (Tidy First, „Functionality I hadn't asked for”).
8. **Czytaj, zanim twierdzisz.** Nie spekulować o kodzie ani źródle, którego się nie otworzyło. — A3 („Minimizing hallucinations”),
   D1 („training cut-off” — sprawdzać aktualną dokumentację SDK).
9. **Recenzja w świeżym kontekście, tylko istotne znaleziska.** Audytor widzi diff i kryteria, nie rozumowanie autora; zgłasza
   z poziomem, pewnością i dowodem; jawna lista „nie zgłaszaj”; drobiazgi opcjonalne. — A1 (Writer/Reviewer, „adversarial review”),
   A2 (code-reviewer), A8 (próg pewności, wykluczenia).
10. **Granice: zawsze / zapytaj / nigdy.** Działania lokalne i odwracalne — samodzielnie; nieodwracalne lub widoczne dla innych
    (push na `main`, wysyłka do TestFlight/App Store Connect, komentarze publiczne) — za zgodą właściciela; nigdy obchodzenie
    zabezpieczeń (`--no-verify`). — D5 (sekcja 4), A3 („Balancing autonomy and safety”).
11. **Kontekst to zasób skończony.** Krótkie prompty ról odsyłające do plików zamiast ich kopiowania; research i długie logi
    w subagentach, które zwracają zwięzły raport (tylko porażki testów); `/clear` między zadaniami, po dwóch nieudanych poprawkach —
    nowa sesja. — A4, A1 („Manage context aggressively”, „Use subagents for investigation”), D2 (Subagents), D5 (sekcja 3).
12. **Stan pracy poza kontekstem.** Postęp i decyzje w `docs/` z datą + git; status funkcji/testów w formie strukturalnej; nowa sesja
    zaczyna od przeczytania stanu i uruchomienia testów. — A3 („State management best practices”), A7, D3 (`todo.md`).
13. **Subagent = jedno zadanie, minimalne narzędzia, jednoznaczny opis; nie mnożyć ról.** Każde zlecenie zawiera cel, format wyniku,
    narzędzia i granice. — A2 (Best practices), A6 („Teach the orchestrator how to delegate”), D2 (Subagents — przestroga), A3 („Subagent orchestration”).
14. **Każda reguła z powodem, bez sprzeczności i bez krzyku.** Jedno zdanie „dlaczego” przy regule; przegląd promptów pod kątem
    sprzeczności z CLAUDE.md; WIELKIE LITERY tylko dla jednej reguły, którą model pomija; jeden krótki przykład dobrego wyniku. —
    A3 („Add context…”), A1 (emfaza w CLAUDE.md), B1, B2 („Contradictory instructions”), B3 („less is more”, pośrednie), C1 (few-shot).
15. **UX: konkret, stany i przegląd człowieka.** Prompt UX podaje istniejące ekrany, komponenty, wszystkie stany i słownik pojęć;
    wynik to propozycja do decyzji właściciela, przejrzana pod kątem hierarchii, kontrastu i dostępności; testy E2E obejmują też
    elementy systemowe (alerty), których narzędzie może nie widzieć. — D10, A3 („Frontend design”), A7 (natywne modale).
