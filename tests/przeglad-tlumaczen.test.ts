/*
 * Przegląd tłumaczeń przez API Anthropic (20.10.2026, R-010): scripts/i18n/przeglad-api.mjs + .github/workflows/przeglad-tlumaczen.yml.
 * Bez sieci: zbieranie zdań i budowa żądań na fixture, parsowanie odpowiedzi batcha z atrapą, szacunek kosztu, strażnik workflowu (styl public-repo.test.ts).
 * Skrypt jest modułem ESM — wywołujemy go przez `node --input-type=module` (jak w innych testach skryptów).
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { execFileSync } from 'child_process';

const ROOT = path.join(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts/i18n/przeglad-api.mjs');
const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/przeglad-tlumaczen.yml'), 'utf8');
/** Wykonuje kod w module ESM z zaimportowanym skryptem jako `m`; wynik = JSON z console.log. */
const run = (code: string, env: Record<string, string> = {}) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', `import * as m from ${JSON.stringify(SCRIPT)}; ${code}`], { env: { PATH: process.env.PATH ?? '', ...env }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));

const MED = 'Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.';
const ASE = 'Asekuracja';
const ASE2 = 'Ćwiczenie ze sztangą nad ciałem lub na barkach: ustaw w stojakach ramiona asekuracyjne tak, aby dało się bezpiecznie odłożyć sztangę, albo ćwicz z osobą asekurującą.';
const ASE3 = 'bez asekuracji w stojakach';

/** Fixture: mały „projekt” z _source.json, słownikami fr/pt/pt-BR, wskazówkami pl/en/fr/pt/pt-BR i jedną nowością względem poprzedniego źródła. */
function fixture(): { root: string; stare: { pl: string; en: string }[] } {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'przeglad-'));
  const w = (f: string, o: unknown) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), JSON.stringify(o)); };
  const zrodlo = [
    { pl: MED, en: 'The app does not give medical advice.' }, { pl: ASE, en: 'Spotting' }, { pl: ASE2, en: 'Set safeties.' }, { pl: ASE3, en: 'no spotter in racks' },
    { pl: 'Zapisz {n} serii', en: 'Save {n} sets' }, { pl: 'Stare zdanie', en: 'Old sentence' }, { pl: 'Zmienione zdanie', en: 'Changed sentence NEW' }, { pl: 'Nowe zdanie', en: 'New sentence' },
  ];
  w('lib/locales/_source.json', zrodlo);
  w('lib/locales/fr.json', { [MED]: 'L’app ne donne pas de conseil médical.', [ASE]: 'Assurance', [ASE2]: 'Réglez les sécurités.', [ASE3]: 'sans pareur', 'Zapisz {n} serii': 'Enregistrer {n} séries', 'Nowe zdanie': 'Nouvelle phrase', 'Zmienione zdanie': 'Phrase modifiée' });
  w('lib/locales/pt.json', { [MED]: 'A app não dá aconselhamento médico.', [ASE]: 'Segurança', [ASE2]: 'Ajuste os apoios.', [ASE3]: 'sem apoio', 'Zapisz {n} serii': 'Guardar {n} séries', 'Nowe zdanie': 'Nova frase', 'Zmienione zdanie': 'Frase alterada' });
  w('lib/locales/pt-BR.json', { 'Nowe zdanie': 'Nova frase (BR)' });
  w('lib/locales/en.json', {}); /* en jest w kodzie (i18n.en.ts), pliku nie ma — jezyki() i tak dodaje en */
  fs.unlinkSync(path.join(root, 'lib/locales/en.json'));
  w('lib/cues/text/pl.json', { 'a.x': 'Plecy neutralnie.', 'b.y': 'Wydech na wysiłku.' });
  w('lib/cues/text/en.json', { 'a.x': 'Keep your back neutral.', 'b.y': 'Breathe out on effort.' });
  w('lib/cues/text/fr.json', { 'a.x': 'Gardez le dos neutre.' }); /* brak b.y — luka */
  w('lib/cues/text/pt.json', { 'a.x': 'Mantenha as costas neutras.', 'b.y': 'Expire no esforço.' });
  w('lib/cues/text/pt-BR.json', { 'a.x': 'Mantenha as costas retas.' });
  const stare = zrodlo.filter((e) => e.pl !== 'Nowe zdanie').map((e) => (e.pl === 'Zmienione zdanie' ? { ...e, en: 'Changed sentence' } : e));
  return { root, stare };
}
const fx = fixture();
const R = JSON.stringify(fx.root); const S = JSON.stringify(fx.stare);

describe('przegląd tłumaczeń API: zbieranie zdań', () => {
  test('bez poprzedniego źródła: 4 zdania krytyczne + wskazówki posortowane po id, numeracja od 1', () => {
    const z = run(`console.log(JSON.stringify(m.zbierzZdania(${R}, null)))`);
    expect(z.map((x: any) => x.rodzaj)).toEqual(['krytyczne', 'krytyczne', 'krytyczne', 'krytyczne', 'wskazowka', 'wskazowka']);
    expect(z.map((x: any) => x.id)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(z[0]).toMatchObject({ klucz: MED, pl: MED, en: 'The app does not give medical advice.' });
    expect(z[4]).toMatchObject({ klucz: 'a.x', pl: 'Plecy neutralnie.', en: 'Keep your back neutral.' });
  });
  test('klucze dodane lub zmienione od --od (różnica _source.json) trafiają do przeglądu; niezmienione i krytyczne nie dublują się', () => {
    const z = run(`console.log(JSON.stringify(m.zbierzZdania(${R}, ${S})))`);
    expect(z.filter((x: any) => x.rodzaj === 'nowe').map((x: any) => x.klucz)).toEqual(['Zmienione zdanie', 'Nowe zdanie']);
    expect(z.filter((x: any) => x.klucz === MED)).toHaveLength(1);
    expect(z.map((x: any) => x.klucz)).not.toContain('Stare zdanie');
  });
  test('brak klucza treści krytycznej w źródle = błąd (nie ciche pominięcie)', () => {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'przeglad-bad-')); fs.mkdirSync(path.join(d, 'lib/locales'), { recursive: true });
    fs.writeFileSync(path.join(d, 'lib/locales/_source.json'), '[]');
    expect(() => run(`m.zbierzZdania(${JSON.stringify(d)}, null); console.log('{}')`)).toThrow();
  });
  test('prawdziwe repozytorium: 4 zdania krytyczne istnieją w _source.json, wskazówek jest tyle, co w pl.json, a jezyki() daje 34', () => {
    const z = run(`console.log(JSON.stringify({ z: m.zbierzZdania(${JSON.stringify(ROOT)}, null).map(x => x.rodzaj), j: m.jezyki(${JSON.stringify(ROOT)}) }))`);
    expect(z.z.filter((r: string) => r === 'krytyczne')).toHaveLength(4);
    expect(z.z.filter((r: string) => r === 'wskazowka')).toHaveLength(Object.keys(JSON.parse(fs.readFileSync(path.join(ROOT, 'lib/cues/text/pl.json'), 'utf8'))).length);
    expect(z.j).toHaveLength(34); expect(z.j[0]).toBe('en'); expect(z.j).toEqual(expect.arrayContaining(['fr', 'tr', 'es-419', 'pt-BR', 'zh-Hant']));
  });
  test('każdy z 34 języków ma wpis rejestru; fr = vous, tr = siz', () => {
    const r = run(`console.log(JSON.stringify({ j: m.jezyki(${JSON.stringify(ROOT)}), r: m.REJESTR }))`);
    for (const l of r.j) expect([l, typeof r.r[l]]).toEqual([l, 'string']);
    expect(r.r.fr).toMatch(/vous/); expect(r.r.tr).toMatch(/siz/);
  });
});

describe('przegląd tłumaczeń API: tłumaczenia języka i kontrola lokalna', () => {
  const z = (l: string) => run(`const z = m.zbierzZdania(${R}, ${S}); console.log(JSON.stringify(m.zdaniaJezyka(${R}, ${JSON.stringify(l)}, z)))`);
  test('fr: tłumaczenia ze słownika i ze wskazówek; brak zdania wskazówki = tlum null', () => {
    const j = z('fr');
    expect(j.find((x: any) => x.klucz === ASE).tlum).toBe('Assurance');
    expect(j.find((x: any) => x.klucz === 'a.x').tlum).toBe('Gardez le dos neutre.');
    expect(j.find((x: any) => x.klucz === 'b.y').tlum).toBeNull();
  });
  test('pt-BR: nakładka na pt (słownik i wskazówki) — wynik złożony', () => {
    const j = z('pt-BR');
    expect(j.find((x: any) => x.klucz === 'Nowe zdanie').tlum).toBe('Nova frase (BR)');
    expect(j.find((x: any) => x.klucz === MED).tlum).toBe('A app não dá aconselhamento médico.');
    expect(j.find((x: any) => x.klucz === 'a.x').tlum).toBe('Mantenha as costas retas.');
    expect(j.find((x: any) => x.klucz === 'b.y').tlum).toBe('Expire no esforço.');
  });
  test('en: tłumaczeniem jest tekst angielski', () => { expect(z('en').find((x: any) => x.klucz === 'a.x').tlum).toBe('Keep your back neutral.'); });
  test('kontrola lokalna: brak tłumaczenia i niezgodne zmienne {…} są krytyczne, zgodne nie', () => {
    const w = run(`console.log(JSON.stringify(m.kontrolaLokalna([
      { id: 1, klucz: 'k1', pl: 'Zapisz {n} {s}', tlum: 'Save {n} {s}' }, { id: 2, klucz: 'k2', pl: 'Zapisz {n}', tlum: 'Enregistrer {nb}' },
      { id: 3, klucz: 'k3', pl: 'x', tlum: null }, { id: 4, klucz: 'k4', pl: '{s} {n}', tlum: '{n} {s}' } ])))`);
    expect(w.map((x: any) => x.klucz)).toEqual(['k2', 'k3']); expect(w.every((x: any) => x.waga === 'krytyczna')).toBe(true);
  });
});

describe('przegląd tłumaczeń API: żądanie', () => {
  const zad = (l: string, extra = '') => run(`const z = m.zbierzZdania(${R}, ${S}); console.log(JSON.stringify(m.budujZadanieBatcha(${JSON.stringify(l)}, m.zdaniaJezyka(${R}, ${JSON.stringify(l)}, z), { model: m.DOMYSLNY_MODEL, effort: 'medium' }${extra})))`);
  test('jedno żądanie na język: custom_id, model Opus, effort medium w output_config, brak thinking/temperature, JSON-lista w jednej wiadomości', () => {
    const r = zad('fr');
    expect(r.custom_id).toBe('tl-fr'); expect(r.params.model).toBe('claude-opus-5-5'); expect(r.params.output_config).toEqual({ effort: 'medium' });
    expect(r.params).not.toHaveProperty('thinking'); expect(r.params).not.toHaveProperty('temperature'); expect(r.params.max_tokens).toBe(64000);
    expect(r.params.messages).toHaveLength(1); expect(r.params.messages[0].role).toBe('user');
    expect(r.custom_id).toMatch(/^[a-zA-Z0-9_-]{1,64}$/);
  });
  test('treść: wszystkie zdania z PL, EN i tłumaczeniem; rejestr fr (vous); zdania bez tłumaczenia pominięte w liście', () => {
    const t = zad('fr').params.messages[0].content as string;
    const lista = JSON.parse(t.slice(t.indexOf('[{')));
    expect(lista.every((x: any) => x.klucz === undefined)).toBe(true); /* klucze nie idą do modelu — tylko numery */
    expect(lista.find((x: any) => x.pl === 'Plecy neutralnie.')).toMatchObject({ en: 'Keep your back neutral.', tlumaczenie: 'Gardez le dos neutre.' });
    expect(lista.find((x: any) => x.pl === 'Wydech na wysiłku.')).toBeUndefined();
    expect(t).toMatch(/vous/); expect(t).toMatch(/francuski \(fr\)/);
  });
  test('instrukcja systemowa pokrywa znaczenie, złagodzenie/wzmocnienie medyczne, formę grzecznościową, naturalność, zmienne i liczbę mnogą oraz format odpowiedzi', () => {
    const s = zad('fr').params.system as string;
    for (const re of [/znaczenia/, /złagodzon|złagodz/, /wzmocnion|wzmocni/, /medyczn/, /bezpiecze/, /grzecznościow/, /naturalno/, /zmiennych/, /liczb\S+ mnog/, /"ok"/, /krytyczna/, /średnia/, /niska/, /poprawka/, /powod/]) expect(s).toMatch(re);
  });
  test('en: bez pola „en” (źródło angielskie oceniane względem polskiego)', () => {
    const t = zad('en').params.messages[0].content as string; const lista = JSON.parse(t.slice(t.indexOf('[{')));
    expect(lista[0]).not.toHaveProperty('en'); expect(lista[0]).toHaveProperty('tlumaczenie');
  });
  test('wartości domyślne: Opus 5.5, effort medium, limit kosztu 50 USD, identyfikatory modeli ze skilla', () => {
    const d = run(`console.log(JSON.stringify({ o: m.DOMYSLNY_MODEL, e: m.DOMYSLNY_EFFORT, l: m.LIMIT_KOSZTU_USD, M: m.MODELE, c: m.CENY, r: m.RABAT_BATCH }))`);
    expect(d).toEqual({ o: 'claude-opus-5-5', e: 'medium', l: 50, M: { opus: 'claude-opus-5-5', sonnet: 'claude-sonnet-5-5' }, c: { 'claude-opus-5-5': { we: 4, wy: 20 }, 'claude-sonnet-5-5': { we: 2, wy: 10 } }, r: 0.5 });
  });
  test('argumenty: --model sonnet, --limit, --effort; błędne wartości odrzucone', () => {
    const a = run(`console.log(JSON.stringify(m.parsujArgumenty(['--model','sonnet','--limit','2','--effort','high','--szacuj'])))`);
    expect(a).toMatchObject({ model: 'claude-sonnet-5-5', limit: 2, effort: 'high', szacuj: true });
    expect(run(`console.log(JSON.stringify(m.parsujArgumenty(['--limit',''])))`).limit).toBeNull();
    for (const bad of ["['--model','gpt']", "['--effort','ultra']", "['--limit','0']", "['--x']"]) expect(() => run(`console.log(JSON.stringify(m.parsujArgumenty(${bad})))`)).toThrow();
  });
});

describe('przegląd tłumaczeń API: odpowiedź batcha (atrapa)', () => {
  test('parsowanie: ok, poprawka z powodem i wagą, blok kodu wokół JSON, brakujące wpisy, nieznana waga → średnia', () => {
    const p = run(`console.log(JSON.stringify(m.parsujOdpowiedz('\`\`\`json\\n' + JSON.stringify({ '1': 'ok', '2': { poprawka: 'X', powod: 'p', waga: 'krytyczna' }, '3': { poprawka: 'Y', powod: 'q', waga: 'dziwna' }, '9': 'ok' }) + '\\n\`\`\`', [1, 2, 3, 4])))`);
    expect(p.blad).toBeNull(); expect(p.wyniki['1']).toEqual({ ocena: 'ok' });
    expect(p.wyniki['2']).toEqual({ ocena: 'poprawka', poprawka: 'X', powod: 'p', waga: 'krytyczna' });
    expect(p.wyniki['3'].waga).toBe('średnia'); expect(p.brak).toEqual([4]);
  });
  test('parsowanie: tekst bez JSON i niepoprawny JSON dają błąd i wszystkie id jako brak', () => {
    for (const t of ['brak', '{"1": ']) {
      const p = run(`console.log(JSON.stringify(m.parsujOdpowiedz(${JSON.stringify(t)}, [1, 2])))`);
      expect(p.blad).toBeTruthy(); expect(p.brak).toEqual([1, 2]);
    }
  });
  test('linia wyniku: succeeded (tylko bloki tekstu, bez myślenia), errored, expired, ucięta odpowiedź', () => {
    const l = (r: unknown) => run(`console.log(JSON.stringify(m.odczytajLinie(${JSON.stringify(JSON.stringify(r))})))`);
    const ok = l({ custom_id: 'tl-fr', result: { type: 'succeeded', message: { stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: '{"1":"ok"}' }], usage: { input_tokens: 5, output_tokens: 3 } } } });
    expect(ok).toMatchObject({ kod: 'fr', blad: null, tekst: '{"1":"ok"}' });
    expect(l({ custom_id: 'tl-tr', result: { type: 'errored', error: { type: 'error', error: { type: 'invalid_request_error', message: 'zły parametr' } } } }).blad).toMatch(/errored.*zły parametr/);
    expect(l({ custom_id: 'tl-de', result: { type: 'expired' } }).blad).toBe('expired');
    expect(l({ custom_id: 'tl-ja', result: { type: 'succeeded', message: { stop_reason: 'max_tokens', content: [{ type: 'text', text: '{' }] } } }).blad).toMatch(/max_tokens/);
  });
  test('raport języka: liczy ok, sortuje uwagi wagą, zapisuje braki i kontrolę lokalną; nie zawiera surowej odpowiedzi ani nagłówków', () => {
    const r = run(`const z = m.zbierzZdania(${R}, ${S}); const j = m.zdaniaJezyka(${R}, 'fr', z);
      const ids = j.filter(x => x.tlum !== null).map(x => x.id); const o = {}; ids.forEach(i => { o[i] = 'ok'; });
      o[ids[0]] = { poprawka: 'P', powod: 'zmiana znaczenia', waga: 'niska' }; o[ids[1]] = { poprawka: 'Q', powod: 'złagodzenie', waga: 'krytyczna' }; delete o[ids[2]];
      const odczyt = m.odczytajLinie(JSON.stringify({ custom_id: 'tl-fr', result: { type: 'succeeded', message: { stop_reason: 'end_turn', content: [{ type: 'text', text: JSON.stringify(o) }] }, headers: { 'x-api-key': 'sekret' } } }));
      console.log(JSON.stringify(m.raportJezyka('fr', j, odczyt, { model: 'claude-opus-5-5', effort: 'medium', batch_id: 'msgbatch_1' })))`);
    expect(r.uwagi.map((u: any) => u.waga)).toEqual(['krytyczna', 'niska']); expect(r.brak_odpowiedzi).toHaveLength(1);
    expect(r.zdan).toBe(8); expect(r.ok).toBe(4); /* 7 przetłumaczonych − 2 uwagi − 1 bez odpowiedzi (b.y bez tłumaczenia nie trafia do żądania) */
    expect(r.kontrola_lokalna.map((k: any) => k.problem)).toEqual(['brak tłumaczenia']);
    expect(JSON.stringify(r)).not.toMatch(/sekret|x-api-key|headers/i);
  });
  test('podsumowanie.md: tabela języków, lista uwag krytycznych, informacja że słowniki nie zostały zmienione', () => {
    const md = run(`const r = { jezyk: 'fr', zdan: 3, ok: 1, uwagi: [{ klucz: 'k', rodzaj: 'krytyczne', pl: 'a|b', tlumaczenie: 't', poprawka: 'p', powod: 'x', waga: 'krytyczna' }, { klucz: 'k2', rodzaj: 'nowe', pl: 'a', tlumaczenie: 't', poprawka: 'p', powod: 'x', waga: 'niska' }], brak_odpowiedzi: [], blad: null, kontrola_lokalna: [] };
      console.log(JSON.stringify(m.podsumowanieMd([r], { model: 'claude-opus-5-5', effort: 'medium', batch_id: 'b1' })))`);
    expect(md).toMatch(/\| fr \| 3 \| 1 \| 1 \| 0 \| 1 \|/); expect(md).toMatch(/## Uwagi krytyczne \(1\)/); expect(md).toMatch(/słowniki nie zostały zmienione/); expect(md).toContain('a\\|b');
  });
});

describe('przegląd tłumaczeń API: szacunek kosztu', () => {
  test('koszt = (we·cena_we + wy·cena_wy)/1e6 · 0,5 (Batch); Opus 5.5 i Sonnet 5.5 według cennika ze skilla', () => {
    const k = run(`console.log(JSON.stringify([m.kosztUsd(1e6, 1e6, 'claude-opus-5-5'), m.kosztUsd(1e6, 1e6, 'claude-sonnet-5-5'), m.kosztUsd(0, 0, 'claude-opus-5-5')]))`);
    expect(k).toEqual([12, 6, 0]); expect(() => run(`console.log(m.kosztUsd(1, 1, 'nieznany'))`)).toThrow();
  });
  test('przybliżenie tokenów: zawyża łacinkę, CJK ~1 znak na token, rośnie z długością', () => {
    const t = run(`console.log(JSON.stringify([m.przyblizTokeny('abcdefghij'), m.przyblizTokeny('日本語のテキスト'), m.przyblizTokeny(''), m.przyblizTokeny('a'.repeat(100))]))`);
    expect(t[0]).toBeGreaterThanOrEqual(3); expect(t[1]).toBe(8); expect(t[2]).toBe(0); expect(t[3]).toBeGreaterThan(t[0]);
  });
  test('szacunek: sumy i koszt dla obu modeli', () => {
    const s = run(`console.log(JSON.stringify(m.szacunek([{ we: 1e6, wy: 0, zdan: 2 }, { we: 1e6, wy: 1e6, zdan: 3 }], 'claude-opus-5-5')))`);
    expect(s).toMatchObject({ jezykow: 2, zdan: 5, tokeny_we: 2e6, tokeny_wy: 1e6 }); expect(s.koszt_usd).toBeCloseTo(14); expect(s.koszt_wg_modelu['claude-sonnet-5-5']).toBeCloseTo(7);
  });
  test('prawdziwe dane, tryb --szacuj bez klucza: nic nie jest wysyłane (fetch rzuca), wynik poniżej limitu 50 USD, zapis szacunek.json', () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'przeglad-out-'));
    const r = run(`globalThis.fetch = () => { throw new Error('sieć niedozwolona'); };
      const logi = []; const kod = await m.main(['--szacuj', '--od', '', '--limit', '3', '--wyjscie', ${JSON.stringify(out)}], {}, { root: ${JSON.stringify(ROOT)}, log: (s) => logi.push(s) });
      console.log(JSON.stringify({ kod, logi }))`);
    expect(r.kod).toBe(0); const s = JSON.parse(fs.readFileSync(path.join(out, 'szacunek.json'), 'utf8'));
    expect(s.jezykow).toBe(3); expect(s.koszt_usd).toBeLessThan(50); expect(s.zrodlo).toMatch(/przybliżenie/);
  });
  test('bramka kosztu: powyżej limitu STOP (kod 3) bez zgody, przy --zgoda-koszt dalej (bez klucza kod 2 — przebieg płatny niemożliwy)', () => {
    const o = (a: string) => run(`const logi = []; const kod = await m.main(${a}, {}, { root: ${JSON.stringify(ROOT)}, log: (s) => logi.push(s), fetchFn: () => { throw new Error('sieć'); } }); console.log(JSON.stringify({ kod, logi }))`);
    const w = JSON.stringify(fs.mkdtempSync(path.join(os.tmpdir(), 'przeglad-g-')));
    expect(o(`['--od', '', '--limit', '1', '--max-koszt', '0.0001', '--wyjscie', ${w}]`).kod).toBe(3);
    expect(o(`['--od', '', '--limit', '1', '--max-koszt', '0.0001', '--zgoda-koszt', '--wyjscie', ${w}]`).kod).toBe(2);
    expect(o(`['--od', '', '--limit', '1', '--max-koszt', '0.0001', '--szacuj', '--wyjscie', ${w}]`).kod).toBe(3);
  });
});

describe('przegląd tłumaczeń API: przebieg batcha z atrapą fetch', () => {
  /** Atrapa API: tworzenie batcha → 1× „in_progress” → „ended” z results_url → JSONL. Zapisuje wywołania (url, metoda, nagłówki). */
  const kod = (extra: string) => `
    const wywolania = []; let stan = 0;
    const jsonl = (kodJ, tekst) => JSON.stringify({ custom_id: 'tl-' + kodJ, result: { type: 'succeeded', message: { stop_reason: 'end_turn', content: [{ type: 'text', text: tekst }], usage: { input_tokens: 1, output_tokens: 1 } } } });
    const fetchFn = async (url, init) => { wywolania.push({ url, metoda: init.method, naglowki: Object.keys(init.headers), klucz: init.headers['x-api-key'], cialo: init.body ? JSON.parse(init.body) : null });
      const ok = (o) => ({ ok: true, status: 200, json: async () => o, text: async () => o });
      if (url.endsWith('/messages/count_tokens')) return ok({ input_tokens: 1000 });
      if (url.endsWith('/messages/batches')) return ok({ id: 'msgbatch_test', processing_status: 'in_progress' });
      if (url.endsWith('/results')) { const w = ${'${WYNIK}'}; return ok(w); }
      if (url.includes('/messages/batches/msgbatch_test')) { stan++; return ok(stan < 2 ? { id: 'msgbatch_test', processing_status: 'in_progress', request_counts: { processing: 2 } } : { id: 'msgbatch_test', processing_status: 'ended', results_url: 'https://api.anthropic.com/v1/messages/batches/msgbatch_test/results' }); }
      return { ok: false, status: 404, json: async () => ({ error: { message: 'nie ma' } }) }; };
    ${extra}`;
  const uruchom = (wynik: string, args: string, env = "{ ANTHROPIC_API_KEY: 'sk-ant-test-SEKRET' }") => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'przeglad-b-'));
    const r = run(kod(`const logi = [];
      const kodW = await m.main([${args}, '--od', '', '--wyjscie', ${JSON.stringify(out)}, '--czekaj-min', '5'], ${env}, { root: ${JSON.stringify(ROOT)}, log: (s) => logi.push(s), fetchFn });
      console.log(JSON.stringify({ kodW, logi, wywolania }))`).replace('${WYNIK}', wynik), {});
    return { r, out };
  };
  test('pełny przebieg (1 język, szybki zegar): tworzy batch z jednym żądaniem, odbiera wyniki, zapisuje <język>.json i podsumowanie.md, nie zmienia słowników', () => {
    const wynik = `[jsonl('en', JSON.stringify(Object.fromEntries(Array.from({ length: 400 }, (_, i) => [String(i + 1), i === 0 ? { poprawka: 'Z', powod: 'test', waga: 'krytyczna' } : 'ok'])))) ].join('\\n')`;
    const sloVorher = fs.readFileSync(path.join(ROOT, 'lib/locales/fr.json'), 'utf8');
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'przeglad-b-'));
    const kodJs = kod(`const logi = [];
      const kodW = await m.main(['--limit', '1', '--od', '', '--wyjscie', ${JSON.stringify(out)}, '--czekaj-min', '5'], { ANTHROPIC_API_KEY: 'sk-ant-test-SEKRET' }, { root: ${JSON.stringify(ROOT)}, log: (s) => logi.push(s), fetchFn });
      console.log(JSON.stringify({ kodW, logi, wywolania }))`).replace('${WYNIK}', wynik);
    /* czekajNaBatch czeka INTERWAL_S między odpytaniami — w teście skracamy przez sztuczny zegar (setTimeout natychmiast) */
    const r = run(`const st = globalThis.setTimeout; globalThis.setTimeout = (f) => st(f, 0); ${kodJs}`);
    expect(r.kodW).toBe(0);
    const utw = r.wywolania.filter((w: any) => w.metoda === 'POST' && w.url.endsWith('/messages/batches'));
    expect(utw).toHaveLength(1); expect(utw[0].cialo.requests).toHaveLength(1);
    expect(utw[0].cialo.requests[0]).toMatchObject({ custom_id: 'tl-en', params: { model: 'claude-opus-5-5', output_config: { effort: 'medium' } } });
    const rap = JSON.parse(fs.readFileSync(path.join(out, 'en.json'), 'utf8'));
    expect(rap.uwagi).toHaveLength(1); expect(rap.uwagi[0].waga).toBe('krytyczna'); expect(rap.model).toBe('claude-opus-5-5'); expect(rap.batch_id).toBe('msgbatch_test');
    expect(fs.existsSync(path.join(out, 'podsumowanie.md'))).toBe(true);
    expect(fs.readFileSync(path.join(ROOT, 'lib/locales/fr.json'), 'utf8')).toBe(sloVorher);
    /* klucz tylko w nagłówku x-api-key, nigdy w logach, treści żądań ani raportach */
    expect(r.wywolania.every((w: any) => w.naglowki.includes('x-api-key'))).toBe(true);
    expect(JSON.stringify(r.logi)).not.toMatch(/SEKRET|sk-ant/); expect(JSON.stringify(r.wywolania.map((w: any) => w.cialo))).not.toMatch(/SEKRET|sk-ant/);
    for (const f of fs.readdirSync(out)) expect(fs.readFileSync(path.join(out, f), 'utf8')).not.toMatch(/SEKRET|sk-ant/);
  });
  test('bez klucza przebieg płatny kończy się kodem 2 i niczego nie wysyła', () => {
    const { r } = uruchom('""', "'--limit', '1'", '{}');
    expect(r.kodW).toBe(2); expect(r.wywolania).toEqual([]);
  });
  test('z kluczem i --szacuj: używa count_tokens (darmowy), nie tworzy batcha', () => {
    const { r } = uruchom('""', "'--limit', '2', '--szacuj'");
    expect(r.kodW).toBe(0); expect(r.wywolania.map((w: any) => w.url.split('/').pop())).toEqual(['count_tokens', 'count_tokens']); expect(r.wywolania.some((w: any) => w.url.endsWith('/messages/batches'))).toBe(false);
  });
  test('błąd API (HTTP) nie ujawnia klucza w komunikacie', () => {
    const e = run(`const api = m.klient(async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'invalid x-api-key' } }) }), 'sk-ant-test-SEKRET');
      try { await api.utworz([]); console.log(JSON.stringify({ msg: 'brak błędu' })); } catch (e) { console.log(JSON.stringify({ msg: e.message })); }`);
    expect(e.msg).toMatch(/HTTP 401/); expect(e.msg).not.toMatch(/SEKRET|sk-ant-test/);
  });
});

describe('przegląd tłumaczeń API: strażnik workflowu (styl public-repo.test.ts)', () => {
  test('tylko workflow_dispatch, odczyt treści, bez push/schedule/pull_request, bez zapisu', () => {
    expect(wf).toMatch(/on:\n\s+workflow_dispatch:/); expect(wf).toMatch(/permissions:\n\s+contents: read/);
    expect(wf).not.toMatch(/^\s+(push|pull_request|pull_request_target|schedule|workflow_run|workflow_call):/m); expect(wf).not.toMatch(/contents: write|: write/);
  });
  test('wejścia: model, limit (domyślnie puste), tylko_szacuj (domyślnie true), zgoda_koszt (domyślnie nie)', () => {
    expect(wf).toMatch(/model:\n\s+description:[^\n]*\n\s+type: choice\n\s+default: opus\n\s+options: \[opus, sonnet\]/);
    expect(wf).toMatch(/limit:\n\s+description:[^\n]*\n\s+type: string\n\s+default: ''/);
    expect(wf).toMatch(/tylko_szacuj:\n\s+description:[^\n]*\n\s+type: boolean\n\s+default: true/);
    expect(wf).toMatch(/zgoda_koszt:\n\s+description:[^\n]*\n\s+type: choice\n\s+default: 'nie'\n\s+options: \['nie', 'tak'\]/);
  });
  test('sekret ANTHROPIC_API_KEY w dokładnie jednym kroku, jako zmienna env; żaden inny sekret', () => {
    const uzycia = wf.match(/secrets\.[A-Z_0-9]+/g) ?? [];
    expect(uzycia).toEqual(['secrets.ANTHROPIC_API_KEY']);
    const kroki = wf.split(/\n      - /).slice(1); const zSekretem = kroki.filter((k) => k.includes('secrets.ANTHROPIC_API_KEY'));
    expect(zSekretem).toHaveLength(1); expect(zSekretem[0]).toMatch(/env:\n\s+ANTHROPIC_API_KEY: \$\{\{ secrets\.ANTHROPIC_API_KEY \}\}/);
    expect(wf).not.toMatch(/^ {0,4}env:/m); /* env tylko na poziomie kroku (8 spaces), nie workflowu ani zadania */
  });
  test('brak wypisywania sekretu (echo/printenv/env/set -x/debug) i brak interpolacji wejść w skrypt powłoki', () => {
    expect(wf).not.toMatch(/echo[^\n]*(ANTHROPIC|secrets\.)/i); expect(wf).not.toMatch(/printenv|\benv\s*\||set -x|ACTIONS_STEP_DEBUG|--debug/);
    expect(wf).not.toMatch(/run:[^\n]*\$\{\{ *(inputs|github\.event)/); expect(wf).not.toMatch(/^\s+\$\{\{ *(inputs|github\.event)[^\n]*$/m);
    expect(wf).not.toMatch(/ANTHROPIC_API_KEY[^\n]*(\$GITHUB_|>>|tee)/);
  });
  test('krok zatrzymujący przy koszcie > 50 USD działa przed krokiem z sekretem i nie ma dostępu do klucza', () => {
    const kroki = wf.split(/\n      - /).slice(1); const iBramka = kroki.findIndex((k) => /--szacuj/.test(k) && !k.includes('ANTHROPIC_API_KEY')); const iSekret = kroki.findIndex((k) => k.includes('secrets.ANTHROPIC_API_KEY'));
    expect(iBramka).toBeGreaterThan(-1); expect(iBramka).toBeLessThan(iSekret); expect(kroki[iBramka]).toMatch(/50 USD/); expect(kroki[iBramka]).toMatch(/--zgoda-koszt/); expect(kroki[iBramka]).toMatch(/WEJ_ZGODA/);
  });
  test('artefakt raport-tlumaczen: 7 dni, tylko pliki raportu (json, podsumowanie.md), bez katalogu głównego, logów i odpowiedzi surowych', () => {
    expect(wf.split('actions/upload-artifact@v4').length - 1).toBe(1);
    expect(wf).toMatch(/name: raport-tlumaczen\n\s+path: \|\n\s+raport-tlumaczen\/\*\.json\n\s+raport-tlumaczen\/podsumowanie\.md\n/); expect(wf).toMatch(/retention-days: 7\n/);
    const art = wf.slice(wf.indexOf('actions/upload-artifact@v4')); expect(art).not.toMatch(/path: (\.|raport-tlumaczen\/?)\s*$/m); expect(art).not.toMatch(/\.log|headers|odpowiedz_surowa|raw/i);
  });
  test('checkout bez zapisanych poświadczeń (fetch-depth 0 dla historii --od), model z listy, ścieżka skryptu istnieje', () => {
    expect(wf).toMatch(/persist-credentials: false/); expect(wf).toMatch(/fetch-depth: 0/); expect(fs.existsSync(SCRIPT)).toBe(true);
    expect(fs.readFileSync(SCRIPT, 'utf8')).not.toMatch(/console\.(log|error)\([^)]*(klucz|ANTHROPIC_API_KEY|env\b)/);
  });
  test('skrypt: tylko fetch i moduły wbudowane (bez nowych zależności), bez zapisu do lib/', () => {
    const s = fs.readFileSync(SCRIPT, 'utf8');
    for (const m of s.matchAll(/from '([^']+)'/g)) expect(m[1]).toMatch(/^node:/);
    expect(s).not.toMatch(/require\(/); expect(s).not.toMatch(/writeFileSync\(\s*join\(root/);
  });
});
