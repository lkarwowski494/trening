/*
 * Polecenia do ręcznego generowania póz figur v2 w aplikacji Gemini (26.10.2026, docs/52 pkt 7): scripts/figures/gemini-polecenia.mjs (generator poleceń)
 * oraz scripts/figures/gemini-pozy.mjs --z-pliku (import odpowiedzi: wyciągnięcie JSON, walidacja, nałożenie przechodzących, polecenie poprawkowe).
 * Rodzaje (docs/20): logika (podział na części, wyciąganie JSON), dane (liczby z silnika w poleceniu), scenariusze importu (poprawna, z błędem, z otoczką, ucięta,
 * nieznany klucz, brak JSON), niezmienniki (gotowe rodziny pominięte, długość, tryb „tylko raport” niczego nie zapisuje), macierz (każda rodzina do zrobienia ma polecenie).
 * Atrapa Gemini: odpowiedzi budowane z prawdziwych póz zapisanych w lib/figures/v2/poses/pull_up.json (Chin Up, Dead Hang — przeszły walidację w pilotażu API).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(240000);
const ROOT = path.join(__dirname, '..');
const POL = path.join(ROOT, 'scripts/figures/gemini-polecenia.mjs');
const POZY = path.join(ROOT, 'scripts/figures/gemini-pozy.mjs');
const run = (script: string, code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(script)}; ${code}`], { env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

/** Korzeń tymczasowy: dane wejściowe skopiowane, skrypty przez dowiązanie; zapis póz trafia tylko tutaj. */
function tmpRoot(): string {
  const r = fs.mkdtempSync(path.join(os.tmpdir(), 'polecenia-'));
  for (const f of ['docs/51-figury-v2-pokrycie.md', 'lib/figures/data.json', 'lib/figures/v2/cue-sets.json', 'lib/cues/data.json', 'lib/cues/text/pl.json']) { fs.mkdirSync(path.dirname(path.join(r, f)), { recursive: true }); fs.copyFileSync(path.join(ROOT, f), path.join(r, f)); }
  /* rodzina pull_up w kopii dokumentu ograniczona do dwóch ćwiczeń (jedna część polecenia), żeby odpowiedź z dwiema pozami była kompletna */
  const dp = path.join(r, 'docs/51-figury-v2-pokrycie.md'); fs.writeFileSync(dp, fs.readFileSync(dp, 'utf8').replace(/(### pull_up \(\d+\) — do zrobienia\n\n)[^\n]*/, '$1Chin Up; Dead Hang'));
  fs.mkdirSync(path.join(r, 'scripts'), { recursive: true }); fs.symlinkSync(path.join(ROOT, 'scripts/figures'), path.join(r, 'scripts/figures'));
  return r;
}
const POZY_REPO = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/v2/poses/pull_up.json'), 'utf8')).cwiczenia as Record<string, any>;
const importuj = (root: string, plik: string, extra: string[] = []) => run(POZY, `const log = []; const c = await m.main(${JSON.stringify(['--z-pliku', plik, '--wyjscie', path.join(root, 'wyj'), ...extra])}, {}, { root: ${JSON.stringify(root)}, log: (s) => log.push(s) }); console.log(JSON.stringify({ c, log }));`) as { c: number; log: string[] };
const zapisane = (root: string) => { const p = path.join(root, 'lib/figures/v2/poses/pull_up.json'); return fs.existsSync(p) ? Object.keys(JSON.parse(fs.readFileSync(p, 'utf8')).cwiczenia) : []; };
const wyj = (root: string, f: string) => fs.readFileSync(path.join(root, 'wyj', f), 'utf8');
const plik = (root: string, nazwa: string, tresc: string) => { const p = path.join(root, nazwa); fs.writeFileSync(p, tresc); return p; };
const odp = (poze: Record<string, unknown>) => JSON.stringify({ rodzina: 'pull_up', poze });

describe('pozy w danych (pilotaż API, nałożone 26.10.2026)', () => {
  test('Chin Up i Dead Hang zapisane w lib/figures/v2/poses/pull_up.json i przechodzą walidację na aktualnym kodzie', () => {
    expect(Object.keys(POZY_REPO).sort()).toEqual(['Chin Up', 'Dead Hang']);
    const w = run(path.join(ROOT, 'scripts/figures/v2-validate.mjs'), `const r = Object.entries(${JSON.stringify(POZY_REPO)}).map(([c, p]) => [c, m.waliduj(p, { rodzina: 'pull_up', cwiczenie: c }).ok]); console.log(JSON.stringify(r));`);
    expect(w).toEqual([['Chin Up', true], ['Dead Hang', true]]);
  });
});

describe('gemini-polecenia: logika', () => {
  test('podział na części: do 12 ćwiczeń jedna część, więcej — równe części; plik <id> albo <id>-N', () => {
    expect(run(POL, `console.log(JSON.stringify([m.MAX_CWICZEN_W_CZESCI, m.podzielNaCzesci(['a','b','c']), m.podzielNaCzesci(Array.from({length: 13}, (_, i) => 'x' + i)).map(x => x.length), m.podzielNaCzesci([]), m.podzielNaCzesci(Array.from({length: 5}, (_, i) => i), 2).map(x => x.length)]))`))
      .toEqual([12, [['a', 'b', 'c']], [7, 6], [], [2, 2, 1]]);
    const cz = run(POL, `console.log(JSON.stringify(m.czesciRodziny('pull_up').map(c => [c.id, c.numer, c.ile, c.cwiczenia.length])))`);
    expect(cz).toEqual([['pull_up', 1, 1, 11]]);
    const duza = run(POL, `console.log(JSON.stringify(m.czesciRodziny('core_floor').map(c => [c.id, c.cwiczenia.length])))`);
    expect(duza.map((x: any) => x[0])).toEqual(['core_floor-1', 'core_floor-2', 'core_floor-3', 'core_floor-4']);
    expect(duza.reduce((a: number, x: any) => a + x[1], 0)).toBe(44);
  });
  test('rodziny gotowe (przysiad, wyciskanie, zawias) nie mają poleceń; ćwiczenia z zapisaną pozą są pomijane', () => {
    expect(run(POL, `console.log(JSON.stringify(['squat','bench_press','hinge'].map(r => m.doZrobienia(r))))`)).toEqual([[], [], []]);
    const lista = run(POL, `console.log(JSON.stringify(m.doZrobienia('pull_up')))`);
    expect(lista).not.toContain('Chin Up'); expect(lista).not.toContain('Dead Hang'); expect(lista).toContain('Pull Up');
  });
  test('argumenty: wymagane --wyjscie i dokładnie jedno z --rodzina / --wszystkie; nieznany argument odrzucony', () => {
    const e = (a: string[]) => run(POL, `try { m.parsujArgumenty(${JSON.stringify(a)}); console.log('"ok"'); } catch (e) { console.log(JSON.stringify(e.message)); }`);
    expect(e(['--rodzina', 'pull_up', '--wyjscie', 'x'])).toBe('ok'); expect(e(['--wszystkie', '--wyjscie', 'x'])).toBe('ok');
    expect(e(['--rodzina', 'pull_up'])).toMatch(/--wyjscie/); expect(e(['--wyjscie', 'x'])).toMatch(/dokładnie jedno/);
    expect(e(['--rodzina', 'pull_up', '--wszystkie', '--wyjscie', 'x'])).toMatch(/dokładnie jedno/); expect(e(['--foo'])).toMatch(/nieznany argument/);
  });
});

describe('gemini-polecenia: treść polecenia (dane z silnika, nie przepisane)', () => {
  const tresc = (() => { const r = tmpRoot(); const out = path.join(r, 'out'); run(POL, `await m.main(['--rodzina','pull_up','--wyjscie',${JSON.stringify(out)}], { log: () => {} }); console.log('0')`); return fs.readFileSync(path.join(out, 'pull_up.md'), 'utf8'); })();
  test('zawiera kontrakt, przykład poprawnej pozy (JSON), listę ćwiczeń z kluczami i dozwolonymi błędami oraz format odpowiedzi', () => {
    expect(tresc).toContain('Kontrakt figury-v2/poza@1'); expect(tresc).toContain('## Pola obiektu pozy'); expect(tresc).toContain('## Przykład poprawnej pozy');
    const blok = /```json\n(\{.*\})\n```/.exec(tresc)!; const przyklad = JSON.parse(blok[1]); expect(przyklad.kontrakt).toBe('figury-v2/poza@1'); expect(przyklad.klatki.length).toBeGreaterThan(1);
    for (const cw of ['Pull Up', 'Muscle Up', 'Rope Climb', 'Wide-Grip Rear Pull-Up']) expect(tresc).toContain(`- "${cw}"`);
    expect(tresc).not.toContain('- "Chin Up"'); expect(tresc).not.toContain('- "Dead Hang"');
    expect(tresc).toContain('pu.partial (Skracanie ruchu'); expect(tresc).toContain('brak (bledy: [])');
    expect(tresc).toContain('FORMAT ODPOWIEDZI'); expect(tresc).toContain('{ "rodzina": "pull_up", "poze": {'); expect(tresc).toContain('```json');
  });
  test('liczby z walidatora: ruch ≥ 8 cm, skok ≤ 6 cm/48, przenikanie 0,3 cm, zakresy stawów z data.json, wyjątek rodziny, odniesienia (drążek 230, miednica 116, segmenty)', () => {
    const rom = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/figures/data.json'), 'utf8')).rom;
    expect(tresc).toContain('co najmniej 8 cm'); expect(tresc).toContain('więcej niż 6 cm na 1/48'); expect(tresc).toContain('więcej niż 0.3 cm');
    expect(tresc).toContain(`kolano ${rom.side.knee.min}°…${rom.side.knee.max}°`); expect(tresc).toContain(`kostka ${rom.side.ankle.min}°…${rom.side.ankle.max}°`); expect(tresc).toContain(`biodro ${rom.side.hip.min}°…${rom.side.hip.max}°`);
    expect(tresc).toContain('Wyjątek tej rodziny: zwis i podciąganie'); expect(tresc).toContain('0° = staw wyprostowany'); expect(tresc).toContain('miednica.y ≈ drążek.y − 64 − 50 = 116 cm');
    expect(tresc).toContain('udo 42, podudzie 41'); expect(tresc).toContain('Podłoga: y = 0'); expect(tresc).toContain('więcej niż 4°');
  });
  test('brak nazw innych aplikacji i marek; polecenie mieści się w oknie czatu (limit znaków)', () => {
    expect(tresc.length).toBeLessThan(30000); expect(tresc.length).toBeGreaterThan(5000);
    expect(tresc).not.toMatch(/strong|hevy|fitbod|jefit|stronglifts|myfitnesspal/i);
  });
});

describe('gemini-polecenia: macierz rodzin (--wszystkie)', () => {
  test('plik dla każdej rodziny do zrobienia (bez gotowych), części ≤ 12 ćwiczeń, długość ≤ limitu, klucze ćwiczeń z docs/51, a polecenie zawiera każdy klucz części', () => {
    const r = tmpRoot(); const out = path.join(r, 'out');
    const wynik = run(POL, `const log = []; await m.main(['--wszystkie','--wyjscie',${JSON.stringify(out)}], { log: (s) => log.push(s) }); console.log(JSON.stringify(log));`) as string[];
    const pliki = fs.readdirSync(out).sort(); expect(wynik[wynik.length - 1]).toMatch(/^rodzin: 40, plików: \d+, najdłuższe: \d+ znaków$/);
    expect(pliki.length).toBeGreaterThanOrEqual(40);
    for (const g of ['squat', 'bench_press', 'hinge']) expect(pliki.filter((p) => p.startsWith(g))).toEqual([]);
    const doc = fs.readFileSync(path.join(ROOT, 'docs/51-figury-v2-pokrycie.md'), 'utf8');
    const rodziny = [...doc.matchAll(/^\| `([a-z_0-9]+)` \| do zrobienia/gm)].map((m) => m[1]); expect(rodziny.length).toBe(40);
    let najdl = 0;
    for (const id of rodziny) {
      const mp = pliki.filter((p) => p === `${id}.md` || new RegExp(`^${id}-\\d+\\.md$`).test(p)); expect([id, mp.length > 0]).toEqual([id, true]);
      for (const f of mp) {
        const t = fs.readFileSync(path.join(out, f), 'utf8'); najdl = Math.max(najdl, t.length); expect([f, t.length < 30000]).toEqual([f, true]);
        const klucze = /DOKŁADNIE te nazwy[^:]*: (.*)\.$/m.exec(t)![1].split('", "').map((k) => k.replace(/^"|"$/g, '')); expect(klucze.length).toBeLessThanOrEqual(12);
        for (const k of klucze) expect([f, t.includes(`- "${k}"`)]).toEqual([f, true]);
      }
    }
    expect(najdl).toBeGreaterThan(10000);
  });
});

describe('gemini-pozy --z-pliku: wyciąganie JSON z wklejonej odpowiedzi', () => {
  const wyc = (t: string) => run(POZY, `console.log(JSON.stringify(m.wyciagnijOdpowiedz(${JSON.stringify(t)})))`) as any;
  test('czysty JSON, blok ```json, otoczka tekstu przed i po bloku, nawiasy i cudzysłowy wewnątrz napisów', () => {
    const j = odp({ 'Pull Up': { klatki: [], x: 'a } "{ b' } });
    for (const t of [j, '```json\n' + j + '\n```', 'Oto pozy:\n```json\n' + j + '\n```\nDaj znać, jeśli coś poprawić {nie JSON}.', 'Jasne!\n' + j + '\nPozdrawiam']) {
      const r = wyc(t); expect(r.blad).toBeNull(); expect(r.ucieta).toBe(false); expect(r.rodzina).toBe('pull_up'); expect(Object.keys(r.poze)).toEqual(['Pull Up']); expect(r.poze['Pull Up'].x).toBe('a } "{ b');
    }
  });
  test('pojedyncza poza bez opakowania traktowana jako jedno ćwiczenie; tekst bez JSON = błąd', () => {
    expect(Object.keys(wyc(JSON.stringify(POZY_REPO['Chin Up'])).poze)).toEqual(['Chin Up']);
    const r = wyc('Przepraszam, nie mogę tego zrobić.'); expect(r.blad).toMatch(/nie znaleziono obiektu JSON/); expect(r.poze).toEqual({});
  });
  test('odpowiedź ucięta: odzyskane kompletne pozy, nazwa urwanego wpisu, rodzina z nagłówka', () => {
    const pelna = odp({ 'Chin Up': POZY_REPO['Chin Up'], 'Dead Hang': POZY_REPO['Dead Hang'] });
    const urwij = pelna.slice(0, pelna.indexOf('"Dead Hang"') + 400);
    const r = wyc('```json\n' + urwij); expect(r.ucieta).toBe(true); expect(Object.keys(r.poze)).toEqual(['Chin Up']); expect(r.ostatniKlucz).toBe('Dead Hang'); expect(r.rodzina).toBe('pull_up'); expect(r.blad).toMatch(/ucięta.*1 kompletnych/);
    expect(wyc(pelna.slice(0, 40)).poze).toEqual({});
  });
});

describe('gemini-pozy --z-pliku: scenariusze importu (walidacja, nałożenie tylko przechodzących, polecenie poprawkowe)', () => {
  test('poprawna odpowiedź: obie pozy nałożone do lib/figures/v2/poses/pull_up.json, raport, kod 0, bez polecenia poprawkowego', () => {
    const r = tmpRoot(); const p = plik(r, 'o.json', odp({ 'Chin Up': POZY_REPO['Chin Up'], 'Dead Hang': POZY_REPO['Dead Hang'] }));
    const w = importuj(r, p); expect(w.c).toBe(0); expect(zapisane(r).sort()).toEqual(['Chin Up', 'Dead Hang']);
    const rap = JSON.parse(wyj(r, 'raport-import.json')); expect(rap.przeszly).toEqual(['Chin Up', 'Dead Hang']); expect(rap.nie_przeszly).toEqual([]);
    expect(fs.existsSync(path.join(r, 'wyj/pull_up-poprawka.md'))).toBe(false); expect(w.log[0]).toMatch(/przeszło 2, nie przeszło 0, brakuje 0; nałożono do lib\/figures\/v2\/poses\/pull_up\.json/);
  });
  test('poza z błędem: przechodząca nałożona, nieprzechodząca nie; raport z liczbami; polecenie poprawkowe z kodem i szczegółem walidatora, kod 1', () => {
    const r = tmpRoot(); const zla = JSON.parse(JSON.stringify(POZY_REPO['Dead Hang'])); zla.klatki = zla.klatki.map((k: any) => ({ ...JSON.parse(JSON.stringify(zla.klatki[0])), u: k.u })); zla.bledy = [];
    const p = plik(r, 'o.md', 'Proszę:\n```json\n' + odp({ 'Chin Up': POZY_REPO['Chin Up'], 'Dead Hang': zla }) + '\n```');
    const w = importuj(r, p); expect(w.c).toBe(1); expect(zapisane(r)).toEqual(['Chin Up']);
    const rap = JSON.parse(wyj(r, 'raport-import.json')); expect(rap.nie_przeszly).toEqual(['Dead Hang']); const kody = rap.wyniki.find((x: any) => x.cwiczenie === 'Dead Hang').bledy.map((b: any) => b.kod); expect(kody).toContain('ruch');
    const pop = wyj(r, 'pull_up-poprawka.md'); expect(pop).toContain('## Dead Hang'); expect(pop).toMatch(/- \[ruch\] poza u = 1 prawie nie różni się od u = 0 \(największe przemieszczenie punktu [\d.]+ cm, wymagane ≥ 8 cm\)/);
    expect(pop).not.toContain('## Chin Up'); expect(pop).toContain('FORMAT ODPOWIEDZI'); expect(pop).toContain('"Dead Hang": <poprawiona poza>');
    expect(wyj(r, 'raport-import.md')).toMatch(/OK  Chin Up[\s\S]*NIE Dead Hang[\s\S]*\[ruch\]/); expect(w.log.join('\n')).toContain('[ruch]');
  });
  test('odpowiedź ucięta: odzyskana poza nałożona, polecenie poprawkowe prosi o brakujące ćwiczenia (część polecenia rozpoznana po kluczach)', () => {
    const r = tmpRoot(); const lista: string[] = run(POL, `console.log(JSON.stringify(m.doZrobienia('pull_up', { root: ${JSON.stringify(r)} })))`);
    expect(lista).toContain('Chin Up');
    const pelna = odp({ 'Chin Up': POZY_REPO['Chin Up'], 'Dead Hang': POZY_REPO['Dead Hang'] }); const p = plik(r, 'o.md', '```json\n' + pelna.slice(0, pelna.indexOf('"Dead Hang"') + 500));
    const w = importuj(r, p); expect(w.c).toBe(1); expect(zapisane(r)).toEqual(['Chin Up']);
    const rap = JSON.parse(wyj(r, 'raport-import.json')); expect(rap.ucieta).toBe(true); expect(rap.brakujace).toContain('Dead Hang'); expect(rap.brakujace).not.toContain('Chin Up');
    const pop = wyj(r, 'pull_up-poprawka.md'); expect(pop).toContain('Brakujące pozy (odpowiedź została ucięta)'); expect(pop).toContain('"Dead Hang"');
  });
  test('nieznany klucz ćwiczenia: odrzucony z komunikatem, nie nałożony; brak JSON: kod 1, nic nie zapisane', () => {
    const r = tmpRoot(); const w = importuj(r, plik(r, 'o.json', odp({ 'Chin Up': POZY_REPO['Chin Up'], 'Pullup xyz': POZY_REPO['Dead Hang'] })));
    expect(w.c).toBe(1); expect(zapisane(r)).toEqual(['Chin Up']); expect(JSON.parse(wyj(r, 'raport-import.json')).nieznane).toEqual(['Pullup xyz']); expect(wyj(r, 'pull_up-poprawka.md')).toContain('Nieznane klucze');
    const r2 = tmpRoot(); const w2 = importuj(r2, plik(r2, 'o.md', 'Nie umiem.')); expect(w2.c).toBe(2); expect(zapisane(r2)).toEqual([]);
  });
  test('--tylko-raport: walidacja i raport bez nakładania; --rodzina niezgodna z odpowiedzią = kod 2; brakujące pola nagłówka (kontrakt, rodzina, cwiczenie) uzupełniane', () => {
    const r = tmpRoot(); const gol = (x: any) => { const { kontrakt, rodzina, cwiczenie, ...bez } = x; return bez; };
    const p = plik(r, 'o.json', odp({ 'Chin Up': gol(POZY_REPO['Chin Up']), 'Dead Hang': gol(POZY_REPO['Dead Hang']) }));
    const w = importuj(r, p, ['--tylko-raport']); expect(w.c).toBe(0); expect(zapisane(r)).toEqual([]); expect(JSON.parse(wyj(r, 'raport-import.json')).przeszly).toEqual(['Chin Up', 'Dead Hang']);
    expect(importuj(r, p, ['--rodzina', 'pulldown']).c).toBe(2); expect(zapisane(r)).toEqual([]);
    expect(importuj(r, p).c).toBe(0); expect(zapisane(r).sort()).toEqual(['Chin Up', 'Dead Hang']);
  });
  test('skrypt importu nie zapisuje nic poza katalogiem wyniku i danymi póz; klucza API nie potrzebuje (brak sieci)', () => {
    const src = fs.readFileSync(POZY, 'utf8'); const blok = src.slice(src.indexOf('importujZPliku'), src.indexOf('/* ---------- uruchomienie'));
    expect(blok).not.toMatch(/fetch|GEMINI_API_KEY|process\.env/);
  });
});
