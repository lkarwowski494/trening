/* Raport nocny (decyzja właściciela 21.10.2026, L-013 akcja 5): po nocnym przebiegu `nightly.yml` jedno zgłoszenie (GitHub issue, etykieta `nocne-testy`)
 * — czerwona noc otwiera albo aktualizuje je listą porażek, zielona zamyka z komentarzem; licznik kolejnych czystych nocy (bramka „3 czyste noce” przed App Store).
 * Logika: scripts/ci/nocny-raport.mjs (moduł ESM — Jest wywołuje go podprocesem Node). Zgłoszenia są publiczne: tylko wyniki zadań i nazwy scenariuszy, bez treści logów. */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

const root = path.join(__dirname, '..');
const skrypt = path.join(root, 'scripts/ci/nocny-raport.mjs');
const wf = fs.readFileSync(path.join(root, '.github/workflows/nightly.yml'), 'utf8');

/* wyrażenie dostaje `w` (eksporty modułu); wynik wraca jako JSON */
const mod = (expr: string) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', `import * as w from ${JSON.stringify('file://' + skrypt)}; console.log(JSON.stringify(${expr}))`], { encoding: 'utf8' }));

const OK = { losowe: { result: 'success' }, mutacje: { result: 'success' }, 'e2e-maly-ekran-ciemny': { result: 'success' } };
const E2E_CZYSTE = { scenariusze: [{ scenariusz: '01 start', wynik: 'przeszedl', czas_s: 10 }, { scenariusz: '02 serie', wynik: 'przeszedl', czas_s: 20 }] };
const E2E_PONOWIENIE = { scenariusze: [{ scenariusz: '01 start', wynik: 'przeszedl_w_ponowieniu', czas_s: 10, czas_ponowienia_s: 9 }, { scenariusz: '02 serie', wynik: 'przeszedl', czas_s: 20 }] };
const E2E_PADL = { scenariusze: [{ scenariusz: '07 plan | tydzień', wynik: 'padl_dwa_razy', czas_s: 10, czas_ponowienia_s: 9 }, { scenariusz: '31 @ktos', wynik: 'padl_dwa_razy', czas_s: 20, czas_ponowienia_s: 9 }, { scenariusz: '02 serie', wynik: 'przeszedl', czas_s: 20 }] };
const zad = (zmiana: Record<string, string>) => Object.fromEntries(Object.entries(OK).map(([k, v]) => [k, { result: zmiana[k] ?? v.result }]));

describe('ocena nocy — czerwona / zielona / czysta', () => {
  const ocen = (needs: any, e2e: any) => mod(`w.ocen({ needs: ${JSON.stringify(needs)}, e2e: ${JSON.stringify(e2e)} })`);
  test('wszystkie zadania success i E2E bez ponowień: czysta noc, pełna, nie czerwona', () => {
    const o = ocen(OK, E2E_CZYSTE);
    expect([o.czerwona, o.pelna, o.czysta, o.wPonowieniu, o.padle]).toEqual([false, true, true, [], []]);
    expect(o.wyniki.map((x: any) => x.wynik)).toEqual(['success', 'success', 'success']);
  });
  test.each(['failure', 'cancelled'])('zadanie %s: noc czerwona (anulowanie też jest sygnałem — noc nie została sprawdzona)', r => {
    for (const id of Object.keys(OK)) {
      const o = ocen(zad({ [id]: r }), E2E_CZYSTE);
      expect([id, o.czerwona, o.czysta]).toEqual([id, true, false]);
    }
  });
  test('nieznany wynik zadania liczy się jako porażka (nie przemilczamy)', () => {
    expect(ocen(zad({ mutacje: 'coś' }), E2E_CZYSTE).czerwona).toBe(true);
  });
  test('zadanie pominięte (skipped): przebieg niepełny — nie czerwony, ale nie czysty i nie liczony do bramki', () => {
    const o = ocen(zad({ mutacje: 'skipped' }), E2E_CZYSTE);
    expect([o.czerwona, o.pelna, o.czysta]).toEqual([false, false, false]);
  });
  test('brak zadania w needs to pominięte', () => {
    const o = ocen({ losowe: { result: 'success' } }, null);
    expect([o.czerwona, o.pelna]).toEqual([false, false]);
    expect(o.wyniki.map((x: any) => x.wynik)).toEqual(['success', 'skipped', 'skipped']);
  });
  test('scenariusz zielony dopiero w ponowieniu: noc zielona, ale nie czysta (bramka wymaga „bez ponowień”)', () => {
    const o = ocen(OK, E2E_PONOWIENIE);
    expect([o.czerwona, o.pelna, o.czysta, o.wPonowieniu]).toEqual([false, true, false, ['01 start']]);
  });
  test('E2E bez pliku wyników (artefakt niedostępny) przy sukcesie zadania: zielona, ale nie czysta — nie zgadujemy', () => {
    const o = ocen(OK, null);
    expect([o.czerwona, o.czysta, o.e2eBrak]).toEqual([false, false, true]);
  });
  test('scenariusz „padł dwa razy” w wynikach czerwieni noc nawet przy success zadania (obrona przed rozjazdem)', () => {
    const o = ocen(OK, E2E_PADL);
    expect([o.czerwona, o.padle]).toEqual([true, ['07 plan | tydzień', '31 @ktos']]);
  });
});

describe('licznik czystych nocy', () => {
  const n = (poprzedni: number, o: any) => mod(`w.nastepnyLicznik(${poprzedni}, ${JSON.stringify(o)})`);
  test('czysta +1; czerwona zeruje; zielona z ponowieniami zeruje; przebieg niepełny bez zmian', () => {
    expect(n(1, { czerwona: false, pelna: true, czysta: true })).toBe(2);
    expect(n(2, { czerwona: true, pelna: true, czysta: false })).toBe(0);
    expect(n(2, { czerwona: false, pelna: true, czysta: false })).toBe(0);
    expect(n(2, { czerwona: false, pelna: false, czysta: false })).toBe(2);
    expect(n(2, { czerwona: true, pelna: false, czysta: false })).toBe(0);
  });
  test('znacznik w treści zgłoszenia: odczyt, brak = 0, śmieci = 0', () => {
    expect(mod(`w.odczytajLicznik('<!-- nocne-testy licznik=2 -->\\n# x')`)).toBe(2);
    expect(mod(`w.odczytajLicznik('# bez znacznika')`)).toBe(0);
    expect(mod(`w.odczytajLicznik('<!-- nocne-testy licznik=abc -->')`)).toBe(0);
    expect(mod(`w.odczytajLicznik(null)`)).toBe(0);
  });
});

describe('treść zgłoszenia', () => {
  const ctx = { data: '2026-10-22', sha: 'abcdef0123456789abcdef0123456789abcdef01', ref: 'main', runUrl: 'https://github.com/o/r/actions/runs/123', zdarzenie: 'schedule', repoUrl: 'https://github.com/o/r' };
  const tresc = (needs: any, e2e: any, licznik = 0, nieudane: string[] = []) => mod(`w.zbudujTresc({ ...${JSON.stringify(ctx)}, ocena: w.ocen({ needs: ${JSON.stringify(needs)}, e2e: ${JSON.stringify(e2e)} }), licznik: ${licznik}, nieudaneZadania: ${JSON.stringify(nieudane)} })`) as string;
  test('data, krótki SHA z linkiem do commitu, gałąź, link do przebiegu, tabela trzech zadań z wynikiem', () => {
    const t = tresc(zad({ mutacje: 'failure' }), E2E_CZYSTE);
    expect(t).toContain('2026-10-22'); expect(t).toContain('[abcdef0](https://github.com/o/r/commit/abcdef0123456789abcdef0123456789abcdef01)');
    expect(t).toContain('main'); expect(t).toContain('https://github.com/o/r/actions/runs/123');
    expect(t).toMatch(/\| Losowe sekwencje[^|]*\| success \|/); expect(t).toMatch(/\| Testy mutacyjne[^|]*\| failure \|/); expect(t).toMatch(/\| E2E[^|]*\| success \|/);
    expect(t).toMatch(/^<!-- nocne-testy licznik=0 -->\n/);
  });
  test('czerwona: nagłówek „czerwono”, lista scenariuszy „padł dwa razy” (znaki | i @ zneutralizowane), nazwy nieudanych zadań', () => {
    const t = tresc(zad({ 'e2e-maly-ekran-ciemny': 'failure' }), E2E_PADL, 0, ['E2E · build', 'losowe (main)']);
    expect(t).toMatch(/^<!-- [^\n]*-->\n# Nocne testy: czerwono/);
    expect(t).toContain('07 plan \\| tydzień'); expect(t).not.toContain('@ktos'); expect(t).toContain('31 @​ktos');
    expect(t).toContain('padł dwa razy'); expect(t).toContain('E2E · build'); expect(t).toContain('losowe (main)');
    expect(t).not.toContain('02 serie');
  });
  test('zielona z ponowieniami: lista scenariuszy zielonych dopiero w ponowieniu i uwaga, że noc nie jest czysta', () => {
    const t = tresc(OK, E2E_PONOWIENIE, 0);
    expect(t).toContain('# Nocne testy: zielono'); expect(t).toContain('01 start'); expect(t).toMatch(/w ponowieniu/); expect(t).toMatch(/nie jest czysta|nie liczy się/);
  });
  test('czysta noc: licznik i bramka „3 czyste noce”; przy 3 z 3 informacja o spełnionej bramce', () => {
    const t2 = tresc(OK, E2E_CZYSTE, 2); expect(t2).toContain('2 z 3');
    const t3 = tresc(OK, E2E_CZYSTE, 3); expect(t3).toContain('3 z 3'); expect(t3).toMatch(/bramka .*spełniona/i);
  });
  test('przebieg niepełny (pominięte zadania, ręczne uruchomienie): wyraźna uwaga, że nie liczy się do bramki', () => {
    const t = tresc(zad({ mutacje: 'skipped' }), null, 1); expect(t).toMatch(/niepełny/i); expect(t).toMatch(/skipped/);
  });
  test('brak wyników E2E: informacja zamiast pustej listy', () => {
    expect(tresc(zad({ 'e2e-maly-ekran-ciemny': 'cancelled' }), null)).toMatch(/brak wyników E2E/);
  });
  test('długa lista scenariuszy jest obcięta (zgłoszenie ma pozostać czytelne)', () => {
    const wiele = { scenariusze: Array.from({ length: 60 }, (_, i) => ({ scenariusz: `sc${String(i).padStart(2, '0')}`, wynik: 'padl_dwa_razy', czas_s: 1 })) };
    const t = tresc(zad({ 'e2e-maly-ekran-ciemny': 'failure' }), wiele);
    expect(t).toContain('sc00'); expect(t).not.toContain('sc59'); expect(t).toMatch(/i \d+ więcej/);
  });
  test('publiczne zgłoszenie: bez treści logów, bez sekretów i adresów e-mail', () => {
    const t = tresc(zad({ losowe: 'failure' }), E2E_PADL, 0, ['losowe (main)']);
    expect(t).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i); expect(t).not.toMatch(/token|secret|UDID/i);
  });
});

describe('decyzja: otwórz / aktualizuj / zamknij', () => {
  const ctx = { data: '2026-10-22', runUrl: 'https://github.com/o/r/actions/runs/123' };
  const plan = (needs: any, e2e: any, istniejace: any) => mod(`w.zaplanuj({ ...${JSON.stringify(ctx)}, sha: 'a'.repeat(40), ref: 'main', zdarzenie: 'schedule', repoUrl: 'https://github.com/o/r', ocena: w.ocen({ needs: ${JSON.stringify(needs)}, e2e: ${JSON.stringify(e2e)} }), istniejace: ${JSON.stringify(istniejace)}, nieudaneZadania: [] })`);
  const ops = (p: any) => p.kroki.map((k: any) => k.op);
  const czerwona = zad({ mutacje: 'failure' });
  test('czerwona, brak zgłoszenia: utwórz (jedno)', () => {
    const p = plan(czerwona, E2E_CZYSTE, null); expect(ops(p)).toEqual(['create']); expect(p.licznik).toBe(0);
  });
  test('czerwona, zgłoszenie otwarte: zaktualizuj treść i dopisz komentarz (bez nowego zgłoszenia)', () => {
    const p = plan(czerwona, E2E_CZYSTE, { number: 7, state: 'OPEN', body: '<!-- nocne-testy licznik=0 -->' }); expect(ops(p)).toEqual(['edit', 'comment']); expect(p.kroki.every((k: any) => k.numer === 7)).toBe(true);
    expect(p.kroki[1].tresc).toContain('https://github.com/o/r/actions/runs/123'); expect(p.kroki[1].tresc).toMatch(/czerwon/i);
  });
  test('czerwona, zgłoszenie zamknięte: otwórz ponownie (to samo zgłoszenie), zaktualizuj, dopisz komentarz; licznik do zera', () => {
    const p = plan(czerwona, E2E_CZYSTE, { number: 7, state: 'CLOSED', body: '<!-- nocne-testy licznik=2 -->' }); expect(ops(p)).toEqual(['reopen', 'edit', 'comment']); expect(p.licznik).toBe(0);
  });
  test('zielona czysta, zgłoszenie otwarte: komentarz „zielono” z licznikiem i zamknięcie', () => {
    const p = plan(OK, E2E_CZYSTE, { number: 7, state: 'OPEN', body: '<!-- nocne-testy licznik=1 -->' }); expect(ops(p)).toEqual(['edit', 'close']); expect(p.licznik).toBe(2);
    expect(p.kroki[1].komentarz).toMatch(/zielono/i); expect(p.kroki[1].komentarz).toContain('2 z 3');
  });
  test('zielona, zgłoszenie otwarte, przebieg niepełny: zamknięcie z komentarzem, licznik bez zmian', () => {
    const p = plan(zad({ mutacje: 'skipped' }), null, { number: 7, state: 'OPEN', body: '<!-- nocne-testy licznik=1 -->' }); expect(ops(p)).toEqual(['edit', 'close']); expect(p.licznik).toBe(1);
  });
  test('zielona, brak zgłoszenia, pełna noc: utwórz i od razu zamknij (nośnik licznika); przebieg niepełny: nic', () => {
    const p = plan(OK, E2E_CZYSTE, null); expect(ops(p)).toEqual(['create', 'close']); expect(p.licznik).toBe(1);
    expect(ops(plan(zad({ mutacje: 'skipped' }), null, null))).toEqual([]);
  });
  test('zielona czysta, zgłoszenie zamknięte: cicha aktualizacja licznika w treści (bez komentarza), komentarz dopiero przy osiągnięciu bramki', () => {
    const p2 = plan(OK, E2E_CZYSTE, { number: 7, state: 'CLOSED', body: '<!-- nocne-testy licznik=1 -->' }); expect(ops(p2)).toEqual(['edit']); expect(p2.licznik).toBe(2);
    const p3 = plan(OK, E2E_CZYSTE, { number: 7, state: 'CLOSED', body: '<!-- nocne-testy licznik=2 -->' }); expect(ops(p3)).toEqual(['edit', 'comment']); expect(p3.licznik).toBe(3);
    expect(p3.kroki[1].tresc).toMatch(/bramka/i);
    const p4 = plan(OK, E2E_CZYSTE, { number: 7, state: 'CLOSED', body: '<!-- nocne-testy licznik=3 -->' }); expect(ops(p4)).toEqual(['edit']); expect(p4.licznik).toBe(4);
  });
  test('zielona, zgłoszenie zamknięte, przebieg niepełny: bez zmian', () => {
    expect(ops(plan(zad({ e2e: 'x', mutacje: 'skipped' }), null, { number: 7, state: 'CLOSED', body: '' }))).toEqual([]);
  });
});

/* ---- całość z atrapą `gh` na PATH: kolejność i argumenty poleceń, treść przez stdin ---- */
describe('skrypt end-to-end z atrapą gh', () => {
  const uruchom = (needs: any, e2e: any, istniejace: any, env: Record<string, string> = {}) => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'nocny-')); const bin = path.join(d, 'bin'); fs.mkdirSync(bin);
    const log = path.join(d, 'gh.log'); const lista = path.join(d, 'lista.json'); fs.writeFileSync(lista, JSON.stringify(istniejace ? [istniejace] : []));
    fs.writeFileSync(path.join(bin, 'gh'), `#!/bin/bash
printf '%s\\n' "$*" >> "${log}"
if [ "$1 $2" = "issue list" ]; then cat "${lista}"; exit 0; fi
if [ "$1 $2" = "issue create" ]; then echo "https://github.com/o/r/issues/42"; fi
if [ "$1" = "api" ]; then echo '{"jobs":[{"name":"losowe (main)","conclusion":"failure"},{"name":"mutacje (main)","conclusion":"success"},{"name":"zgłoszenie","conclusion":null}]}'; fi
for a in "$@"; do if [ "$a" = "-" ]; then cat >> "${log}.stdin"; echo "----" >> "${log}.stdin"; fi; done
exit 0
`, { mode: 0o755 });
    const e2eFile = path.join(d, 'e2e-wyniki.json'); if (e2e) fs.writeFileSync(e2eFile, JSON.stringify(e2e));
    const summary = path.join(d, 'summary.md');
    execFileSync('node', [skrypt], { encoding: 'utf8', env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, NEEDS_JSON: JSON.stringify(needs), E2E_WYNIKI: e2eFile, GITHUB_STEP_SUMMARY: summary, GITHUB_SHA: 'b'.repeat(40), GITHUB_REF_NAME: 'main', GITHUB_RUN_ID: '123', GITHUB_REPOSITORY: 'o/r', GITHUB_SERVER_URL: 'https://github.com', GITHUB_EVENT_NAME: 'schedule', NOCNY_DATA: '2026-10-22', ...env } });
    const calls = fs.readFileSync(log, 'utf8').trim().split('\n'); const stdin = fs.existsSync(`${log}.stdin`) ? fs.readFileSync(`${log}.stdin`, 'utf8') : '';
    return { calls, stdin, summary: fs.existsSync(summary) ? fs.readFileSync(summary, 'utf8') : '' };
  };
  const verbs = (c: string[]) => c.map(x => x.split(' ').slice(0, 2).join(' '));
  test('czerwona noc bez zgłoszenia: etykieta (idempotentnie), wyszukanie, utworzenie z etykietą; treść ze stdin; podsumowanie przebiegu', () => {
    const r = uruchom(zad({ losowe: 'failure' }), E2E_PADL, null);
    expect(verbs(r.calls)).toEqual(['api repos/o/r/actions/runs/123/jobs?per_page=100', 'label create', 'issue list', 'issue create']);
    expect(r.calls[1]).toMatch(/^label create nocne-testy --force /); expect(r.calls[2]).toBe('issue list --label nocne-testy --state all --limit 1 --json number,state,body');
    expect(r.calls[3]).toMatch(/^issue create --title .+ --label nocne-testy --body-file -$/);
    expect(r.stdin).toContain('# Nocne testy: czerwono'); expect(r.stdin).toContain('losowe (main)'); expect(r.stdin).not.toContain('mutacje (main)'); expect(r.stdin).not.toContain('"jobs"');
    expect(r.summary).toContain('# Nocne testy: czerwono');
  });
  test('czerwona noc, zgłoszenie otwarte: edit + comment, bez create', () => {
    const r = uruchom(zad({ losowe: 'failure' }), E2E_CZYSTE, { number: 7, state: 'OPEN', body: '<!-- nocne-testy licznik=0 -->' });
    expect(verbs(r.calls).slice(1)).toEqual(['label create', 'issue list', 'issue edit', 'issue comment']);
    expect(r.calls[3]).toBe('issue edit 7 --body-file -'); expect(r.calls[4]).toBe('issue comment 7 --body-file -');
  });
  test('zielona noc, zgłoszenie otwarte: edit + zamknięcie z komentarzem (powód: completed)', () => {
    const r = uruchom(OK, E2E_CZYSTE, { number: 7, state: 'OPEN', body: '<!-- nocne-testy licznik=0 -->' });
    expect(r.calls.some(c => /^issue close 7 --reason completed --comment /.test(c))).toBe(true); expect(r.calls.some(c => c.startsWith('issue create'))).toBe(false);
  });
  test('zamknięte zgłoszenie i czerwona noc: reopen, edit, comment', () => {
    const r = uruchom(zad({ mutacje: 'cancelled' }), E2E_CZYSTE, { number: 7, state: 'CLOSED', body: '' });
    expect(verbs(r.calls).slice(3)).toEqual(['issue reopen', 'issue edit', 'issue comment']);
  });
  test('zielona noc bez zgłoszenia: utworzenie i zamknięcie nowo utworzonego numeru z odpowiedzi gh', () => {
    const r = uruchom(OK, E2E_CZYSTE, null);
    expect(r.calls.some(c => /^issue close 42 /.test(c))).toBe(true);
  });
  test('brak pliku wyników E2E i brak odpowiedzi API zadań nie przerywają raportu', () => {
    const r = uruchom(zad({ 'e2e-maly-ekran-ciemny': 'failure' }), null, null, { E2E_WYNIKI: '/nie/ma/takiego.json' });
    expect(r.stdin).toMatch(/brak wyników E2E/);
  });
  test('zmienna NEEDS_JSON jest wymagana (błąd zamiast cichej zielonej nocy)', () => {
    expect(() => execFileSync('node', [skrypt], { stdio: 'pipe', env: { ...process.env, NEEDS_JSON: '' } })).toThrow();
  });
});

describe('nightly.yml — zadanie zgłoszenia (kształt)', () => {
  const job = wf.slice(wf.indexOf('\n  zgloszenie:\n'));
  test('istnieje, zbiera wyniki trzech zadań i działa zawsze (też po porażce / anulowaniu) — tylko harmonogram albo ręcznie z wejściem zgloszenie', () => {
    expect(job.length).toBeGreaterThan(10);
    expect(job).toMatch(/needs: \[losowe, mutacje, e2e-maly-ekran-ciemny\]/);
    expect(job).toMatch(/if: \$\{\{ always\(\) && \(github\.event_name == 'schedule' \|\| \(github\.event_name == 'workflow_dispatch' && inputs\.zgloszenie\)\) \}\}/);
    expect(job).toMatch(/NEEDS_JSON: \$\{\{ toJSON\(needs\) \}\}/);
  });
  test('wejścia: zgloszenie (boolean, domyślnie false) oraz pomin_* tylko dla ręcznego uruchomienia — harmonogram nie zmienia zachowania', () => {
    expect(wf).toMatch(/zgloszenie:\n\s+description:[^\n]*\n\s+type: boolean\n\s+default: false/);
    for (const k of ['losowe', 'mutacje', 'e2e']) expect(wf).toMatch(new RegExp(`pomin_${k}:\\n\\s+description:[^\\n]*\\n\\s+type: boolean\\n\\s+default: false`));
    for (const [id, k] of [['losowe', 'losowe'], ['mutacje', 'mutacje'], ['e2e-maly-ekran-ciemny', 'e2e']]) {
      const od = wf.indexOf(`\n  ${id}:\n`); const reszta = wf.slice(od + 1); const kon = reszta.slice(1).search(/\n  [a-z0-9-]+:\n/); const blok = kon < 0 ? reszta : reszta.slice(0, kon + 1);
      expect([id, blok.includes(`if: \${{ github.event_name != 'workflow_dispatch' || !inputs.pomin_${k} }}`)]).toEqual([id, true]);
    }
  });
});
