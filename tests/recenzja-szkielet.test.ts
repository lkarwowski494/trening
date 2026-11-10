/*
 * Decyzja właściciela 2A (03.11.2026 ~22:00 PL): scripts/recenzja-szkielet.mjs wylicza z bieżącego stanu KOMPLET wpisów recenzji rodziny v2 (v2, v1 → „zastapiona”, karty własne,
 * zestawy ogólne, kroki generowane) z pustymi polami werdykt/recenzent/uwagi, a `--sprawdz <plik>` porównuje wypełniony szkielet z bieżącym stanem i wypisuje braki
 * (tak jak dziś zgłaszają je figury-recenzja / karty-recenzja / recenzja-wyjatki-1-1). Rodzaje (docs/20): logika (wyliczenie), dane (komplet curl = wpisy w figury-recenzja.json),
 * macierz (rodzaj braku × komunikat), regresja (brak v1, karty, zestawu, zła liczba, stary skrót), proces (CLI: kod wyjścia).
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync, spawnSync } from 'child_process';

const root = path.join(__dirname, '..');
const SK = path.join(root, 'scripts/recenzja-szkielet.mjs');
const REC = JSON.parse(fs.readFileSync(path.join(root, 'docs/research/figury-recenzja.json'), 'utf8'));
type Szk = { format: string; rodzina: string; v2: Record<string, Record<string, unknown>>; v1: Record<string, Record<string, unknown>>; karty: Record<string, Record<string, unknown>>; zestawy: Record<string, Record<string, unknown>>; kroki: string[] };

/** Szkielet curl + wyniki `sprawdz` dla scenariuszy (mutacje wypełnionego szkieletu zapisane jako kod JS), jedno uruchomienie węzła. */
function uruchom(mutacje: Record<string, string>): { szk: Szk; wyniki: Record<string, string[]> } {
  const code = `import { szkielet, sprawdz } from ${JSON.stringify(SK)}; import { readFileSync } from 'node:fs';
    const rec = JSON.parse(readFileSync(${JSON.stringify(path.join(root, 'docs/research/figury-recenzja.json'))}, 'utf8'));
    const szk = szkielet('curl');
    /* wypełnienie szkieletu wpisami z figury-recenzja.json; skróty bieżące (po przepisaniu wpisów równe) */
    const wypelnij = () => { const w = structuredClone(szk);
      for (const sek of ['v2', 'v1', 'karty', 'zestawy']) for (const k of Object.keys(w[sek])) w[sek][k] = { ...(rec[sek][k] ?? {}), sha: w[sek][k].sha, ...(sek === 'v2' ? { liczba: w[sek][k].liczba, cwiczenia: w[sek][k].cwiczenia, bez_rysunku: w[sek][k].bez_rysunku } : {}) };
      return w; };
    const wyniki = { poprawny: sprawdz(wypelnij(), 'curl'), pusty: sprawdz(structuredClone(szk), 'curl') };
    for (const [n, m] of Object.entries(JSON.parse(process.env.MUT))) { const w = wypelnij(); new Function('w', 'szk', m)(w, szk); wyniki[n] = sprawdz(w, 'curl'); }
    process.stdout.write(JSON.stringify({ szk, wyniki }));`;
  return JSON.parse(execFileSync('node', ['--input-type=module', '-e', code], { encoding: 'utf8', env: { ...process.env, MUT: JSON.stringify(mutacje) }, maxBuffer: 1 << 26 }));
}
const MUT = {
  bezV1: "delete w.v1['Barbell Curl'];",
  v1Wyswietlana: "w.v1['Barbell Curl'].werdykt = 'wyswietlana';",
  bezKarty: "delete w.karty[Object.keys(w.karty)[0]];",
  bezZestawu: "delete w.zestawy[Object.keys(w.zestawy)[0]];",
  liczbaBezWyjatkow: "w.v2.curl.liczba = szk.v2.curl.liczba - szk.v2.curl.bez_rysunku.length;",
  starySkrot: "w.v2.curl.sha = '000000000000';",
  autorRownyRecenzentowi: "w.karty[Object.keys(w.karty)[0]].recenzent = w.karty[Object.keys(w.karty)[0]].autor;",
  bezSladu: "w.v2.curl.slad = '';",
  nadmiarowy: "w.v1['Squat'] = { werdykt: 'zastapiona', data: '2026-11-03', kto: 'zapis testowy', sha: '000000000000', rodzina: 'curl' };",
  bezWpisuV2: "delete w.v2.curl;",
};
const R = uruchom(MUT);

describe('2A: szkielet wpisów recenzji rodziny v2 (scripts/recenzja-szkielet.mjs)', () => {
  test('curl: szkielet odtwarza komplet wpisów obecnych w figury-recenzja.json (klucze, rodzina, liczba, skróty bieżące); pola recenzji puste', () => {
    const klucze = (o: Record<string, unknown>) => Object.keys(o).sort();
    const wszystkie = Object.keys(JSON.parse(execFileSync('node', ['-e', `console.log(JSON.stringify(require(${JSON.stringify(path.join(root, 'docs/research/figury-recenzja.json'))}).v1))`], { encoding: 'utf8' })));
    expect(R.szk.format).toBe('recenzja-szkielet@1');
    expect(klucze(R.szk.v2)).toEqual(['curl']);
    expect(R.szk.v2.curl.liczba).toBe(REC.v2.curl.liczba);
    expect(klucze(R.szk.v1)).toEqual(wszystkie.filter(k => REC.v1[k].rodzina === 'curl').sort());
    expect(klucze(R.szk.karty)).toEqual(klucze(REC.karty).filter(k => (R.szk.v2.curl.cwiczenia as string[]).includes(k) && !(R.szk.v2.curl.bez_rysunku as string[]).includes(k)).sort()); /* 09.11.2026: Zottman (bez rysunku v2) ma wpis karty, ale szkielet wymaga wpisów tylko dla ćwiczeń z rysunkiem */
    expect(klucze(R.szk.zestawy)).toEqual(klucze(REC.zestawy).filter(k => REC.zestawy[k].rodzina === 'curl' && (R.szk.v2.curl.cwiczenia as string[]).includes(k)).sort()); /* 10.11.2026 (partia 5): Reverse Plate Curls ma zestaw ogólny `curl`, ale rysunek v2 w rodzinie forearm — szkielet curl go nie obejmuje (jak w wierszu kart wyżej) */
    for (const sek of ['v1', 'karty', 'zestawy'] as const) for (const e of Object.values(R.szk[sek])) expect(e.sha).toMatch(/^[0-9a-f]{12}$/);
    for (const e of [R.szk.v2.curl, ...Object.values(R.szk.karty), ...Object.values(R.szk.zestawy), ...Object.values(R.szk.v1)]) for (const p of ['werdykt', 'recenzent', 'uwagi']) expect([p, e[p]]).toEqual([p, '']);
    expect(R.szk.v2.curl.slad).toBe('');
    for (const e of Object.values(R.szk.v1)) expect([e.rodzina, e.docelowy]).toEqual(['curl', 'zastapiona']);
  });
  test('curl: liczba v2 liczy też wyjątki bez rysunku (Zottman Curl, Zottman Preacher Curl); zestawy tylko z rysunkiem (28)', () => {
    expect(R.szk.v2.curl.bez_rysunku).toEqual(['Zottman Curl', 'Zottman Preacher Curl']);
    expect(R.szk.v2.curl.liczba).toBe((R.szk.v2.curl.cwiczenia as string[]).length);
    expect(Object.keys(R.szk.zestawy)).toHaveLength(28);
    expect(Object.keys(R.szk.zestawy)).not.toContain('Zottman Curl');
  });
  test('kroki: generatory w kolejności runtime → pokrycie → macierz → README, potem kontrole i testy bramki', () => {
    expect(R.szk.kroki.slice(0, 4)).toEqual(['node scripts/zrodla-runtime.mjs --write', 'node scripts/pokrycie-katalogu.mjs --write', 'node scripts/test-matrix.mjs --write', 'node scripts/readme.mjs --write']);
    expect(R.szk.kroki.join('\n')).toMatch(/--check[\s\S]*figury-recenzja\.test\.tsx.*karty-recenzja.*recenzja-wyjatki-1-1/);
  });
  test('--sprawdz: wypełniony szkielet (wpisy curl z figury-recenzja.json) nie ma braków; pusty szkielet zgłasza pola każdej sekcji', () => {
    expect(R.wyniki.poprawny).toEqual([]);
    expect(R.wyniki.pusty.some(x => /^v2\/curl: puste pola werdykt/.test(x))).toBe(true);
    expect(R.wyniki.pusty.some(x => /^v1\/Barbell Curl: puste pola werdykt/.test(x))).toBe(true);
    expect(R.wyniki.pusty.some(x => /^zestawy\//.test(x))).toBe(true);
  });
  test.each([
    ['bezV1', /^v1\/Barbell Curl: brak wpisu \(v1 do zmiany na „zastapiona”\)$/],
    ['v1Wyswietlana', /^v1\/Barbell Curl: werdykt „wyswietlana” zamiast „zastapiona”/],
    ['bezKarty', /^karty\/.+: brak wpisu \(karta własna z rysunkiem v2\)$/],
    ['bezZestawu', /^zestawy\/.+: brak wpisu \(zestaw ogólny z rysunkiem v2\)$/],
    ['liczbaBezWyjatkow', /^v2\/curl: liczba 34 ≠ 36 \(assignAll łącznie z wyjątkami bez rysunku: Zottman Curl, Zottman Preacher Curl\)$/],
    ['starySkrot', /^v2\/curl: sha 000000000000 ≠ bieżący [0-9a-f]{12}/],
    ['autorRownyRecenzentowi', /^karty\/.+: autor = recenzent \(L-047\)$/],
    ['bezSladu', /^v2\/curl: pole slad puste/],
    ['nadmiarowy', /^v1\/Squat: wpis nadmiarowy/],
    ['bezWpisuV2', /^v2\/curl: brak wpisu$/],
  ])('--sprawdz wykrywa braki: %s', (nazwa, wzor) => {
    const w = R.wyniki[nazwa as string];
    expect(w.filter(x => (wzor as RegExp).test(x))).toHaveLength(1);
    expect(w).toHaveLength(1); /* dokładnie jeden brak — bez echa w innych sekcjach */
  });
  test('CLI: szkielet na stdout, --sprawdz z kodem 1 przy brakach i 0 przy komplecie, nieznana rodzina → kod 2', () => {
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'szk-'));
    try {
      const out = spawnSync('node', [SK, 'curl'], { encoding: 'utf8', maxBuffer: 1 << 26 });
      expect(out.status).toBe(0);
      const szk = JSON.parse(out.stdout) as Szk; expect(szk.rodzina).toBe('curl');
      const plik = path.join(tmp, 'szk.json'); fs.writeFileSync(plik, out.stdout);
      const pusty = spawnSync('node', [SK, '--sprawdz', plik], { encoding: 'utf8' });
      expect([pusty.status, /braków/.test(pusty.stderr)]).toEqual([1, true]);
      const zle = spawnSync('node', [SK, 'nie_ma_takiej'], { encoding: 'utf8' });
      expect([zle.status, /nieznana rodzina/.test(zle.stderr)]).toEqual([2, true]);
      const wyp = JSON.parse(out.stdout) as Szk;
      for (const sek of ['v2', 'v1', 'karty', 'zestawy'] as const) for (const k of Object.keys(wyp[sek])) wyp[sek][k] = { ...(REC[sek][k] ?? {}), sha: wyp[sek][k].sha, ...(sek === 'v2' ? { liczba: wyp.v2[k].liczba, cwiczenia: wyp.v2[k].cwiczenia, bez_rysunku: wyp.v2[k].bez_rysunku } : {}) };
      fs.writeFileSync(plik, JSON.stringify(wyp));
      const ok = spawnSync('node', [SK, '--sprawdz', plik], { encoding: 'utf8' });
      expect([ok.status, /komplet/.test(ok.stdout), /zrodla-runtime\.mjs --write/.test(ok.stdout)]).toEqual([0, true, true]);
    } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  });
});
