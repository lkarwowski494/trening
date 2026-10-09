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

test('regresja run 37600735711: przycisk „Discard workout” w oknie wskazany względem przycisku w tle, nie opisu (opis zachodzi na okno w kroju Tuleja)', () => {
  const fs = require('fs'); const path = require('path');
  const y = fs.readFileSync(path.join(__dirname, '..', '.maestro', '07-zamiana.yaml'), 'utf8');
  expect(y).toContain('tapOn: { text: "Discard workout", below: "Back", above: "Discard workout" }');
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
  const files = fs.readdirSync(dir).filter((f: string) => /^\d\d-.*\.yaml$/.test(f)).sort();
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

test('regresja run 37761959586: po wejściu w Postępy (ekran stosu bez paska zakładek) stuknięcie w zakładkę dopiero po „Back”', () => {
  const fs = require('fs'); const path = require('path'); const bad: string[] = [];
  for (const f of files(dir)) {
    let onStack = false; const name = path.basename(f);
    for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\s*-\s*tapOn:\s*"([^"]+)"/); if (!m) continue;
      if (/^Progress/.test(m[1])) onStack = true; else if (m[1] === 'Back') onStack = false;
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
      const s = steps(f); const kg = s.findIndex(l => l.trim() === '- tapOn: "kg"'); const firstKg = s.findIndex(l => /\bkg\b/.test(l) && !/tapOn: "kg"/.test(l));
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
    for (const l of taps) expect(l).toMatch(/below: "Set done\.\*"/);
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
