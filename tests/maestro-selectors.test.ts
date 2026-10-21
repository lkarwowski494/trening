/* Scenariusze Maestro: selektor `id` jest wyrażeniem regularnym dopasowywanym do całego testID.
 * Przebieg E2E 03.10.2026: id "sw-Pull-up bar (doorway, wall-mounted)" nie znalazł przełącznika, bo nawiasy były grupą. */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const dir = join(__dirname, '../.maestro');
const files = (d: string): string[] => readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(d, e.name)) : e.name.endsWith('.yaml') ? [join(d, e.name)] : []);

test('każdy selektor id w scenariuszach Maestro dopasowuje swój testID dosłownie (znaki specjalne regex poprzedzone \\)', () => {
  const ids: string[] = [];
  for (const f of files(dir)) {
    for (const m of readFileSync(f, 'utf8').matchAll(/\bid:\s*"((?:[^"\\]|\\.)*)"/g)) ids.push(JSON.parse('"' + m[1] + '"'));
  }
  expect(ids.length).toBeGreaterThan(0);
  for (const id of ids) {
    const literal = id.replace(/\\(.)/g, '$1');
    expect({ id, matches: new RegExp('^(?:' + id + ')$').test(literal) }).toEqual({ id, matches: true });
  }
});

test('scenariusze rozwijają grupy sprzętu po angielskich nazwach z EQUIP_GROUP_LABEL (05.10.2026: grupy zwinięte)', () => {
  const fs = require('fs'); const path = require('path'); const { EQUIP_GROUP_LABEL } = require('@/lib/equipment');
  const names = Object.values(EQUIP_GROUP_LABEL as Record<string, { en: string }>).map(x => x.en);
  const dir = path.join(__dirname, '..', '.maestro'); const used: string[] = [];
  for (const f of fs.readdirSync(dir).filter((x: string) => x.endsWith('.yaml'))) for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/tapOn: "([^"]+)\.\*"/g)) if (/^[A-Z][a-z]+ (?:weights|and|dip)/.test(m[1]) && !/^Places and equipment/.test(m[1]) /* H2: pozycja Ustawień, nie grupa sprzętu */) used.push(m[1]);
  expect(used.length).toBeGreaterThanOrEqual(3); for (const u of used) expect(names).toContain(u);
});

test('regresja run 37600735711: przycisk karty „teraz” ma etykietę VoiceOver dłuższą niż tekst — selektory „Set done” dopasowują całą etykietę, nie ✓ wiersza', () => {
  const { EN } = require('@/lib/i18n.en'); const fs = require('fs'); const path = require('path');
  const card = EN['Seria zrobiona: {ex}, seria {n}'].replace('{ex}', 'Back Squat').replace('{n}', '1');
  const row = EN['Seria {n} zrobiona — {ex}'].replace('{ex}', 'Back Squat').replace('{n}', '1');
  const y = fs.readFileSync(path.join(__dirname, '..', '.maestro', '11-widok-skupiony.yaml'), 'utf8');
  const sel = [...y.matchAll(/(?:visible|tapOn|assertNotVisible):\s*"(Set done[^"]*)"/g)].map(m => JSON.parse('"' + m[1] + '"'));
  expect(sel.length).toBeGreaterThanOrEqual(3);
  for (const s of sel) { const re = new RegExp('^(?:' + s + ')$'); expect({ s, card: re.test(card), row: re.test(row) }).toEqual({ s, card: true, row: false }); }
});

test('regresja run 37600735711 i 37900617167: przycisk „Discard workout” w oknie wskazany względem „Back” okna (styl cancel — na dole okna), nie opisu w tle', () => {
  const fs = require('fs'); const path = require('path');
  const y = fs.readFileSync(path.join(__dirname, '..', '.maestro', '07-zamiana.yaml'), 'utf8');
  expect(y).toContain('tapOn: { text: "Discard workout", above: "Cancel" }');
  expect(y).not.toContain('below: "Cancel", above: "Discard workout"');
  expect(y).not.toMatch(/above: "The workout in progress saves/);
});

test('regresja run 37611882320: scenariusz 11 nie używa hideKeyboard (klawiatura numeryczna nie ma akcji „schowaj”) — tap w tekst karty', () => {
  const fs = require('fs'); const path = require('path'); const { EN } = require('@/lib/i18n.en');
  const y = fs.readFileSync(path.join(__dirname, '..', '.maestro', '11-widok-skupiony.yaml'), 'utf8');
  expect(y).not.toMatch(/^- hideKeyboard/m);
  /* audyt 0.10 (A11-19): licznik z NBSP (glue) — selektor z „.” zamiast spacji (regex Maestro: „.” pasuje do NBSP) */
  expect(y).toContain(`- tapOn: "${EN['seria {n} z {all}'].replace('{n}', '1').replace('{all}', '1').replace(/ /g, '.')}"`);
});

test('regresja run 37645619096: każdy scenariusz .maestro/*.yaml jest na liście flows w config.yaml (inaczej Maestro go pomija)', () => {
  const fs = require('fs'); const path = require('path'); const dir = path.join(__dirname, '..', '.maestro');
  /* 13.10.2026: scenariusze z tagiem `eksperyment` (docs/38 pkt 5) celowo NIE są na liście — główny przebieg ich nie uruchamia */
  const files = fs.readdirSync(dir).filter((f: string) => /^\d\d-.*\.yaml$/.test(f) && !/^tags:\n\s+- eksperyment$/m.test(fs.readFileSync(path.join(dir, f), 'utf8'))).sort();
  const listed = [...fs.readFileSync(path.join(dir, 'config.yaml'), 'utf8').matchAll(/^\s+-\s+(\S+\.yaml)\s*$/gm)].map((m: RegExpMatchArray) => m[1]);
  expect(listed).toEqual(files);
});

test('regresja run 37657730493: po przesunięciu wiersza scenariusz stuka odsłonięty przycisk <id>-del (gest Maestro nie sięga progu „od razu pytaj”); SwipeRow nadaje ten testID', () => {
  let n = 0;
  for (const f of files(dir)) {
    const s = readFileSync(f, 'utf8');
    for (const m of s.matchAll(/- swipe: \{ from: \{ id: "([^"]+)" \}, direction: LEFT[^\n]*\n((?:#[^\n]*\n)?)- runFlow:\n\s+when: \{ visible: \{ id: "([^"]+)" \} \}\n\s+commands:\n\s+- tapOn: \{ id: "([^"]+)" \}/g)) {
      expect([m[3], m[4]]).toEqual([`${m[1]}-del`, `${m[1]}-del`]); n++;
    }
    expect((s.match(/- swipe: \{ from: \{ id: "[^"]+" \}, direction: LEFT/g) ?? []).length).toBe([...s.matchAll(/- swipe: \{ from: \{ id: "([^"]+)" \}, direction: LEFT[^\n]*\n(?:#[^\n]*\n)?- runFlow:/g)].length);
  }
  expect(n).toBeGreaterThanOrEqual(4);
  expect(readFileSync(join(__dirname, '../components/SwipeRow.tsx'), 'utf8')).toContain('testID={testID ? `${testID}-del` : undefined}');
});

/* Zawężone do „+ Add exercise” (ekran treningu w zakładce — pod nim pasek zakładek). Pozostałe przewinięcia (33) zostają: część elementów
 * leży na końcu listy, gdzie wyśrodkowanie jest niemożliwe i Maestro czekałby do limitu czasu. */
test('regresja run 37730170793: przewinięcie do „+ Add exercise” na ekranie treningu wyśrodkowuje go (inaczej stuknięcie trafia w pasek zakładek)', () => {
  const bad: string[] = [];
  for (const f of files(dir).filter(x => !x.includes('/subflows/'))) { /* podprzepływy: edytor szablonu — ekran bez paska zakładek */
    const lines = readFileSync(f, 'utf8').split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    lines.forEach((l, i) => {
      const m = /^- scrollUntilVisible: \{ element: ("(?:[^"\\]|\\.)*")/.exec(l); if (!m) return; if (m[1] !== '"\\\\+ Add exercise"') return;
      const next = lines[i + 1] ?? ''; const tapsSame = next.startsWith(`- tapOn: ${m[1]}`) || next.startsWith(`- tapOn: { text: ${m[1]}`);
      if (tapsSame && !/centerElement: true/.test(l)) bad.push(`${f.split('/').pop()}: ${l.trim()}`);
    });
  }
  expect(bad).toEqual([]);
});

test('regresja run 37738868663: każde stuknięcie „Swap exercise: …” na ekranie treningu poprzedza przewinięcie z wyśrodkowaniem (wyjątek oznaczony: ekran bez paska zakładek); w 05 „Month” po powrocie w górę', () => {
  const bad: string[] = [];
  for (const f of files(dir)) {
    const lines = readFileSync(f, 'utf8').split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    lines.forEach((l, i) => {
      const m = /^- tapOn: ("Swap exercise: [^"]+")/.exec(l); if (!m || /ekran bez paska zakładek/.test(l)) return;
      const prev = lines[i - 1] ?? '';
      if (!(prev.startsWith(`- scrollUntilVisible: { element: ${m[1]},`) && /centerElement: true/.test(prev))) bad.push(`${f.split('/').pop()}: ${l.trim()}`);
    });
    if (/05-/.test(f)) { const k = lines.findIndex(l => l.startsWith('- tapOn: "Month"')); if (k >= 0 && !/scrollUntilVisible: \{ element: "Month", direction: UP/.test(lines[k - 1] ?? '')) bad.push('05: „Month” bez przewinięcia w górę'); }
  }
  expect(bad).toEqual([]);
});

test('regresja run 37761959586: po wejściu w ekran stosu bez paska zakładek (od 11.10.2026: Templates, Exercises pod Więcej; dawniej Postępy) stuknięcie w zakładkę dopiero po „Back”', () => {
  const fs = require('fs'); const path = require('path'); const bad: string[] = [];
  for (const f of files(dir)) {
    let onStack = false; const name = path.basename(f);
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      if (/^\s*-\s*launchApp/.test(line)) { onStack = false; continue; } /* nowy start aplikacji zaczyna od zakładek */
      const m = line.match(/^\s*-\s*tapOn:\s*"([^"]+)"/); if (!m) continue;
      if (/^(Templates|Exercises)$/.test(m[1])) onStack = true; else if (m[1] === 'Back') onStack = false;
      else if (/, tab\.\*$/.test(m[1]) && onStack) bad.push(`${name}: ${m[1]}`);
    }
  }
  expect(bad).toEqual([]);
});

test('regresja run 37771270988: po przycisku okna (Set, Cancel, Make active, Fewer sets) sprawdzenie widoczności czeka (extendedWaitUntil), nie assertVisible od razu', () => {
  const fs = require('fs'); const path = require('path'); const bad: string[] = []; const ALERT = new Set(['Set', 'Cancel', 'Make active', 'Fewer sets']);
  for (const f of files(dir)) {
    const steps = fs.readFileSync(f, 'utf8').split('\n').filter((l: string) => /^\s*-\s/.test(l));
    steps.forEach((l: string, i: number) => { const m = l.match(/tapOn:\s*"([^"]+)"/); if (m && ALERT.has(m[1]) && /assertVisible/.test(steps[i + 1] ?? '')) bad.push(`${path.basename(f)}: ${m[1]} → ${steps[i + 1].trim()}`); });
  }
  expect(bad).toEqual([]);
});

/* Przebieg E2E 89 (09.10.2026, dfa7ab8): 12 z 16 scenariuszy padło na selektorach nieaktualnych po fali 2 audytu 0.10. Całe scenariusze przechodzi
 * tests/maestro-flows.test.tsx (interpreter na drzewie dostępności); tu — przyczyny, których interpreter nie modeluje albo które warto przypiąć wprost. */
describe('regresja E2E 89', () => {
  const y = (f: string) => readFileSync(join(dir, f), 'utf8');
  const steps = (f: string) => y(f).split('\n').filter(l => /^\s*-\s/.test(l));
  test('nazwa nowego szablonu: tytuł nagłówka edycji to ten sam tekst co wartość pola — stuknięcie w pole „pod etykietą Name”', () => {
    const { EN } = require('@/lib/i18n.en');
    expect(readFileSync(join(__dirname, '../app/template/[id].tsx'), 'utf8')).toContain("DraftHeader title={isNew.current ? t('Nowy szablon')");
    expect(EN['Nowy szablon']).toBe('New template'); expect(EN['Nazwa']).toBe('Name');
    for (const f of ['subflows/szablon-testowy.yaml', '08-szablon-wiersze.yaml']) {
      expect(steps(f).filter(l => /tapOn: (\{ text: )?"New template"/.test(l)).map(l => l.replace(/\s+#.*$/, ''))).toEqual(['- tapOn: { text: "New template", below: "Name" }']);
    }
  });
  test('jednostka z regionu (H4): symulator en-US startuje w lb — scenariusze z kg najpierw wybierają „kg” w Ustawieniach (przed dodaniem miejsca)', () => {
    const { deviceUnit } = require('@/lib/i18n'); expect(deviceUnit('en-US')).toBe('lb');
    for (const f of ['11-widok-skupiony.yaml', '15-masa-licencje.yaml']) {
      const s = steps(f); const kg = s.findIndex(l => l.trim() === '- tapOn: { id: "unit-system-kg" }'); const firstKg = s.findIndex(l => /\bkg\b/.test(l) && !/unit-system-kg/.test(l) && !/^\s*#/.test(l)); /* M2-LOK07-01: segment „System miar” wybierany po testID */
      const place = s.findIndex(l => /Places and equipment/.test(l));
      expect({ f, kg: kg >= 0 && kg < firstKg && (place < 0 || kg < place) }).toEqual({ f, kg: true });
    }
  });
  test('plan tygodnia: wiersz dnia „{dzień}, {szablon}” (UX-15 A), „{dzień}: {szablon}” to chip rozwiniętego wiersza', () => {
    expect(readFileSync(join(__dirname, '../app/plan.tsx'), 'utf8')).toContain('accessibilityLabel={`${weekdayName(i)}, ${nm}`}');
    expect(y('14-generator.yaml')).toContain('visible: "Monday, Full Body A"'); expect(y('14-generator.yaml')).not.toMatch(/visible: "Monday: /);
  });
  test('gumy: karta „teraz” pokazuje „band: …” małą literą, Maestro porównuje bez wielkości liter — każde stuknięcie przycisku gumy pod „Set done.*”', () => {
    const taps = steps('10-gumy.yaml').filter(l => /tapOn: .*"Band: /.test(l)); expect(taps.length).toBeGreaterThanOrEqual(6);
    for (const l of taps) expect(l).toMatch(/below: "Set done\.\*"|leftOf: "Set 1 done — [^"]+"/); /* E2E 91: wiersz pod kartą po przewinięciu — względem ✓ wiersza */
    const { EN } = require('@/lib/i18n.en'); const card = EN['Seria zrobiona: {ex}, seria {n}'].replace('{ex}', 'Pull Up').replace('{n}', '1');
    const row = EN['Seria {n} zrobiona — {ex}'].replace('{ex}', 'Pull Up').replace('{n}', '1');
    expect([/^(?:Set done.*)$/i.test(card), /^(?:Set done.*)$/i.test(row)]).toEqual([true, false]); /* kotwica to tylko przycisk karty */
  });
  test('edycja ćwiczenia: stukany chip metryki mieści się na ekranie (jeden z pierwszych trzech) — piąty „weight + time” był poza krawędzią', () => {
    const { METRICS, METRIC_LABEL } = require('@/lib/seed'); const { EN } = require('@/lib/i18n.en');
    const label = (m: string) => EN[(METRIC_LABEL as Record<string, string>)[m]] as string;
    const first = (METRICS as string[]).slice(0, 3).map(label);
    const taps = steps('16-edycja-na-zadanie.yaml').map(l => /^- tapOn: "([^"]+)"$/.exec(l.trim())?.[1]).filter((x): x is string => !!x).map(x => x.replace(/\\(.)/g, '$1'));
    const chips = taps.filter(x => (METRICS as string[]).some(m => label(m) === x)); expect(chips.length).toBe(2);
    for (const c of chips) expect(first).toContain(c);
  });
  test('zamiana z podziałem: odhaczona seria starego ćwiczenia sprawdzana przewinięciem w górę, nie assertVisible od razu', () => {
    const s = steps('07-zamiana.yaml'); const i = s.findIndex(l => l.includes('"instead of: Overhead Press \\\\(Barbell\\\\).*"'));
    expect(i).toBeGreaterThan(0); expect(s[i + 1].trim()).toBe('- scrollUntilVisible: { element: "Set 1 done — Overhead Press \\\\(Barbell\\\\)", direction: UP, timeout: 30000 }');
  });
});

/* Przebieg E2E 91 (09.10.2026, build z 1080a40): 7 z 17 scenariuszy — przyczyny w scenariuszach (elementy poza ekranem, okno zgody, etykieta
 * grupy dostępności), aplikacja bez zmian. Interpreter (tests/maestro-runner.test.tsx) odtwarza te porażki na krokach w wersji z 224d229;
 * tu — że poprawki zostały w plikach. */
describe('regresja E2E 91', () => {
  const fs = require('fs'); const path = require('path');
  const y = (f: string) => fs.readFileSync(path.join(__dirname, '..', '.maestro', f), 'utf8') as string;
  const steps = (f: string) => y(f).split('\n').filter((l: string) => /^\s*- /.test(l)).map((l: string) => l.trim());

  test('11: przed tapnięciem pola powtórzeń klawiatura numeryczna jest schowana (tap w tekst karty) — „Now: 805 kg”', () => {
    const s = steps('11-widok-skupiony.yaml'); const i = s.indexOf('- tapOn: { id: "r-0-0" }');
    expect(i).toBeGreaterThan(1); expect(s[i - 1]).toBe('- tapOn: "set.1.of.1"'); expect(s[i - 2]).toBe('- inputText: "80"');
  });
  test('15: nagłówek „Packages (n)” sprawdzany po przewinięciu (pod kilkunastoma licencjami)', () => {
    expect(y('15-masa-licencje.yaml')).toContain('- scrollUntilVisible: { element: "Packages \\\\(\\\\d+\\\\)", direction: DOWN');
    expect(y('15-masa-licencje.yaml')).not.toContain('extendedWaitUntil: { visible: "Packages');
  });
  test('17: „Setup” sprawdzane po przewinięciu (sekcja zaczyna się rysunkiem ruchu)', () => {
    expect(y('17-biblioteka-technika.yaml')).toContain('- scrollUntilVisible: { element: "Setup", direction: DOWN');
    expect(y('17-biblioteka-technika.yaml')).not.toContain('extendedWaitUntil: { visible: "Setup"');
  });
  test('10: guma Pull Up wskazana względem ✓ wiersza (leftOf), nie karty „Set done” (po przewinięciu nad ekranem)', () => {
    const s = steps('10-gumy.yaml'); const after = s.slice(s.indexOf('- extendedWaitUntil: { visible: "Set 1 done — Pull Up", timeout: 30000 }'));
    expect(after).toContain('- tapOn: { text: "Band: none", below: "Pull Up", leftOf: "Set 1 done — Pull Up" }');
    expect(after.filter((l: string) => /below: "Set done/.test(l))).toEqual([]);
  });
  test('10 (run 38264871642): guma Pull Up kotwiczona także nagłówkiem „Pull Up” — `leftOf` samo trafiało w gumę wiersza Band Pull Apart (zrzut: Pull Up nadal G1)', () => {
    const s = steps('10-gumy.yaml'); const after = s.slice(s.indexOf('- extendedWaitUntil: { visible: "Set 1 done — Pull Up", timeout: 30000 }'));
    const upTo = after.slice(0, after.indexOf('- takeScreenshot: 62-guma-pull-up')).filter((l: string) => /"Band: /.test(l));
    expect(upTo.length).toBe(4);
    for (const l of upTo) expect(l).toContain('below: "Pull Up"');
  });
  test('14 (run 38264871642): przejście Więcej → Przewodnik czeka 30 s (nawigacja jak w innych scenariuszach), nie 15 s', () => {
    const s = steps('14-generator.yaml');
    expect(s.filter((l: string) => /visible: "Read: \.\*"|visible: "Show: Weekly plan and Calendar"/.test(l)).every((l: string) => /timeout: 30000/.test(l))).toBe(true);
    expect(s.some((l: string) => /visible: "Read: \.\*", timeout: 30000/.test(l))).toBe(true);
  });
  test('07: przed „Always at Home — …” przewinięcie na środek ekranu (tap przy górnej krawędzi trafił w baner iOS → Ustawienia)', () => {
    const s = steps('07-zamiana.yaml'); const i = s.indexOf('- tapOn: "Always at Home — .*"');
    expect(i).toBeGreaterThan(0); expect(s[i - 1]).toMatch(/^- scrollUntilVisible: \{ element: "Always at Home — \.\*".*centerElement: true/);
  });
  test('07 (run 38241528019): przed stuknięciem podpowiedzi „Swap to substitute” przesunięcie listy w dół (podpowiedź pod paskiem stanu → tap w pasek)', () => {
    const s = steps('07-zamiana.yaml'); const i = s.lastIndexOf('- tapOn: "Swap to substitute: .*"');
    expect(i).toBeGreaterThan(2); expect(s[i - 1]).toBe('- waitForAnimationToEnd'); expect(s[i - 2]).toMatch(/^- swipe: \{ start: "50%, 30%", end: "50%, 80%"/);
  });
  test('13: po pierwszym dniu planu okno zgody na przypomnienie zamykane „Not now” (opcjonalnie)', () => {
    const { EN } = require('@/lib/i18n.en'); const s = steps('13-kalendarz-plan.yaml'); const i = s.indexOf('- tapOn: "Monday: Upper A"');
    expect(i).toBeGreaterThan(0); /* run 37973427584: okno pojawia się chwilę po zmianie planu (PlanReminderSync) — najpierw krótkie czekanie, potem tapnięcie */
    expect(s.slice(i + 1, i + 3)).toEqual([`- extendedWaitUntil: { visible: "${EN['Nie teraz']}", timeout: 8000, optional: true }`, `- tapOn: { text: "${EN['Nie teraz']}", optional: true }`]);
  });
  test('01: kafelki tygodnia — jedna etykieta przycisku „Postępy” („Workouts: …; Sets: …”), kafelek nie jest osobnym elementem', () => {
    const { EN } = require('@/lib/i18n.en');
    /* 11.10.2026: „Ten tydzień” bez porównania z poprzednim — etykieta „{label}: {v}” czterech kafelków, połączona średnikami */
    expect(EN['{label}: {v}, poprzedni tydzień {p}']).toBeUndefined(); expect(EN['Treningi']).toBe('Workouts'); expect(EN['Serie']).toBe('Sets');
    expect(y('01-trening-z-szablonu.yaml')).toContain('- assertVisible: "Workouts: 1;.*"');
  });
});

test('TST2-05: figura ruchu ma E2E — w 17 rysunek (etykieta VoiceOver „Movement drawing: …”) i przycisk pauzy/wznowienia animacji (WCAG 2.2.2)', () => {
  const { EN } = require('@/lib/i18n.en'); const fs = require('fs'); const path = require('path');
  const s = fs.readFileSync(path.join(__dirname, '..', '.maestro', '17-biblioteka-technika.yaml'), 'utf8').split('\n').filter((l: string) => /^- /.test(l)).map((l: string) => l.trim());
  const drawing = EN['Rysunek ruchu: {opis}'].replace('{opis}', '.*'); const pause = EN['Zatrzymaj animację']; const resume = EN['Wznów animację'];
  const tech = s.indexOf('- tapOn: "Technique"'); expect(tech).toBeGreaterThan(0);
  const after = s.slice(tech + 1);
  const iD = after.indexOf(`- assertVisible: "${drawing}"`); const iP = after.indexOf(`- tapOn: "${pause}"`); const iR = after.findIndex((l: string) => l.startsWith(`- extendedWaitUntil: { visible: "${resume}"`));
  expect([iD >= 0, iP > iD, iR > iP]).toEqual([true, true, true]);
});

test('22 (0.18): scenariusz „Dostosuj do miejsca” — angielskie literały zgodne ze słownikiem, kolejność: okno samo → „Cancel” bez zmian → wiersz pod chipem → „Apply (1)” → „instead of” → powrót z „Back to your plan”', () => {
  const { EN } = require('@/lib/i18n.en'); const s = readFileSync(join(dir, '22-dostosuj-do-miejsca.yaml'), 'utf8').split('\n').filter((l: string) => l.startsWith('- '));
  const at = (re: RegExp, from = 0) => { const i = s.findIndex((l: string, k: number) => k >= from && re.test(l)); expect(i).toBeGreaterThanOrEqual(from); return i; };
  expect(EN['Dostosuj do: {l}'].replace('{l}', 'Hotel')).toBe('Adjust to: Hotel'); expect(EN['Zastosuj ({n})'].replace('{n}', '1')).toBe('Apply (1)'); expect(EN['Wraca z planu']).toBe('Back to your plan');
  expect(EN['Ćwiczenia bez sprzętu']).toBe('Exercises without equipment'); expect(EN['Zamiany tylko w tym treningu — szablon i plan bez zmian.']).toBe('Swaps apply to this workout only — your template and plan stay as they are.');
  expect(EN['{n} {w} · Dostosuj'].replace('{n}', '1').replace('{w}', EN['ćwiczenie bez sprzętu|ćwiczenia bez sprzętu|ćwiczeń bez sprzętu'].split('|')[0])).toBe('1 exercise without equipment · Adjust');
  const auto = at(/visible: "Adjust to: Hotel"/); const cancel = at(/tapOn: "Cancel"/, auto); const line = at(/visible: "1 exercise without equipment · Adjust"/, cancel); const reopen = at(/tapOn: "1 exercise without equipment · Adjust"/, line);
  const apply = at(/tapOn: "Apply /, reopen); const instead = at(/visible: "instead of: Bench Press/, apply); const back = at(/visible: "Adjust to: Full gym"/, instead); at(/assertVisible: "Back to your plan"/, back);
  expect(s.slice(cancel + 1, line).some((l: string) => /Apply/.test(l))).toBe(false); /* „Cancel” niczego nie zastosował */
});

test('23 (0.19): scenariusz „Inne miejsce (tylko dziś)” — angielskie literały zgodne ze słownikiem, kolejność: arkusz pinezki → okno „Inne miejsce” → zestaw → „Use” → „Adjust to: Today only” → „Apply (1)” → „instead of” → lista miejsc bez miejsca jednorazowego', () => {
  const { EN } = require('@/lib/i18n.en'); const s = readFileSync(join(dir, '23-miejsce-jednorazowe.yaml'), 'utf8').split('\n').filter((l: string) => l.startsWith('- '));
  const at = (re: RegExp, from = 0) => { const i = s.findIndex((l: string, k: number) => k >= from && re.test(l)); expect(i).toBeGreaterThanOrEqual(from); return i; };
  expect(EN['Inne miejsce (tylko dziś)…']).toBe('Another place (today only)…'); expect(EN['Tylko dziś']).toBe('Today only'); expect(EN['Użyj']).toBe('Use'); expect(EN['Gotowe zestawy']).toBe('Ready-made sets'); expect(EN['Zapisz jako miejsce']).toBe('Save as a place');
  expect(EN['Dostosuj do: {l}'].replace('{l}', EN['Tylko dziś'])).toBe('Adjust to: Today only'); expect(EN['Miejsce tylko na ten trening. Wybierz sprzęt, jaki tam masz — ciężarów nie trzeba wpisywać.']).toMatch(/^A place for this workout only\./);
  const { LOCATION_PRESET_LABEL } = require('@/lib/equipment'); expect(LOCATION_PRESET_LABEL.bodyweight.en).toBe('Bodyweight only');
  const sheet = at(/tapOn: "Workout place: Full gym"/); const once = at(/tapOn: "Another place /, sheet); const win = at(/visible: "Ready-made sets"/, once); const preset = at(/tapOn: "Bodyweight only"/, win); const use = at(/tapOn: "Use"/, preset);
  const adjust = at(/visible: "Adjust to: Today only"/, use); const apply = at(/tapOn: "Apply /, adjust); const instead = at(/visible: "instead of: Bench Press/, apply); const list = at(/tapOn: "Places and equipment"/, instead); at(/assertNotVisible: ".\*Today only\.\*"/, list);
});

test('13 (0.19): miejsce na zakres dni w planie — Hotel w panelu dnia, linijka „Workout place: Hotel”, „Remove place” po „Set place”; scrollUntilVisible przed przyciskami pod krawędzią', () => {
  const { EN } = require('@/lib/i18n.en'); const s = readFileSync(join(dir, '13-kalendarz-plan.yaml'), 'utf8').split('\n').filter((l: string) => /^\s*- /.test(l)).map((l: string) => l.trim()); const at = (re: RegExp, from = 0) => { const i = s.findIndex((l: string, k: number) => k >= from && re.test(l)); expect(i).toBeGreaterThanOrEqual(from); return i; };
  expect(EN['Miejsce na te dni']).toBe('Place for these days'); expect(EN['Ustaw miejsce']).toBe('Set place'); expect(EN['Usuń miejsce']).toBe('Remove place'); expect(EN['Miejsce treningu: {l}'].replace('{l}', 'Hotel')).toBe('Workout place: Hotel');
  const open = at(/tapOn: "Place for these days"/); const set = at(/tapOn: "Set place"/, open); expect(s[set - 1]).toMatch(/scrollUntilVisible: \{ element: "Set place"/); const line = at(/visible: "Workout place: Hotel"/, set);
  const reopen = at(/tapOn: "Place for these days"/, line); const rm = at(/tapOn: "Remove place"/, reopen); expect(s[rm - 1]).toMatch(/scrollUntilVisible: \{ element: "Remove place"/); at(/assertNotVisible: "Workout place: Hotel"/, rm);
  expect(at(/tapOn: "Full gym,\.\*"/)).toBeLessThan(at(/tapOn: "Monday, Rest"/)); /* miejsca tworzone przed planem; główne = pełna siłownia, więc start „Upper A” bez okna */
});

test('interpreter modeluje inset klawiatury tylko tam, gdzie aplikacja go ma (automaticallyAdjustKeyboardInsets) — 14.10.2026, edytor szablonu po zdjęciu stopki z gestami (08, „reps to”)', () => {
  const fs = require('fs'); const path = require('path');
  const runner = fs.readFileSync(path.join(__dirname, 'maestro-runner.ts'), 'utf8');
  expect(runner).toMatch(/kbInset\(sc: LNode\) \{ return this\.focused && sc\.props\.automaticallyAdjustKeyboardInsets \?/); expect(runner).toMatch(/maxScroll\(sc: LNode, top: number\) \{ return .*\+ this\.kbInset\(sc\); \}/);
  /* założenie: edytor szablonu (tryb edycji) ma tę właściwość — w aplikacji lista da się przewinąć nad klawiaturę niezależnie od długości treści */
  expect(fs.readFileSync(path.join(__dirname, '..', 'app/template/[id].tsx'), 'utf8')).toMatch(/<ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="interactive" automaticallyAdjustKeyboardInsets/);
});
