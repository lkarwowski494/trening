/*
 * M1-audytor-generalny-071 (DEC-25 a): plan startu z tabelą kanałów w docs/wzrost.md. Każdy kanał ma adres, 2–3 wątki z datą i cytat zasady o autopromocji z datą odczytu —
 * albo jawny znacznik [DO USTALENIA] / [DO PRZECZYTANIA] (nie zgadujemy). Kanały z zakazem (SFD) i nieprzeczytane mają tryb „tylko pomocna obecność bez linku”.
 * Tabela jest pilnowana tak, by cytat bez daty odczytu albo „link dozwolony” bez kompletu danych nie przeszły.
 */
import * as fs from 'fs';
import * as path from 'path';

const doc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'wzrost.md'), 'utf8');
const DATE = /\b\d{2}\.\d{2}\.\d{4}\b/g;
const sec = doc.slice(doc.indexOf('## 2. Tabela kanałów startu'), doc.indexOf('## 3. Dziennik zgód'));
const rows = sec.split('\n').filter((l) => /^\| \d+ \|/.test(l)).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
const NO_LINK = 'tylko pomocna obecność bez linku';

describe('docs/wzrost.md: tabela kanałów startu', () => {
  test('tabela ma kanały z docs (Reddit, SFD, AZS, kluby trójboju, lokalne fora)', () => {
    expect(rows.length).toBeGreaterThanOrEqual(5);
    const names = rows.map((r) => r[1]).join(' | ');
    for (const n of ['Reddit', 'SFD', 'AZS', 'trójboju', 'fora']) expect(names).toContain(n);
  });
  test('każdy wiersz: adres (URL albo [DO USTALENIA]), wątki, zasada, tryb — bez pustych komórek', () => {
    for (const r of rows) { expect(r).toHaveLength(6); for (const c of r) expect(c).not.toBe(''); expect(r[2]).toMatch(/^https:\/\/\S+$|\[DO USTALENIA/); }
  });
  test('wątki: co najmniej 2 z datą albo znacznik [DO USTALENIA]; cytat zasady tylko z datą odczytu albo [DO PRZECZYTANIA]', () => {
    for (const r of rows) {
      expect((r[3].match(DATE) ?? []).length >= 2 || /\[DO USTALENIA/.test(r[3])).toBe(true);
      const hasQuote = /„[^”]{10,}”/.test(r[4]);
      if (hasQuote) expect(r[4]).toMatch(/odczyt\w* \d{2}\.\d{2}\.\d{4}/); else expect(r[4]).toMatch(/\[DO PRZECZYTANIA/);
    }
  });
  test('SFD i kanały bez przeczytanej zasady: tryb „tylko pomocna obecność bez linku”', () => {
    const sfd = rows.find((r) => r[1].includes('SFD'))!; expect(sfd[5]).toBe(NO_LINK);
    for (const r of rows) if (/\[DO PRZECZYTANIA/.test(r[4]) || /zakaz/i.test(r[4])) expect(r[5]).toBe(NO_LINK);
  });
  test('„link dozwolony” tylko przy komplecie: adres, 2 wątki z datą i cytat z datą odczytu', () => {
    for (const r of rows.filter((x) => /link dozwolony/.test(x[5]))) {
      expect(r[2]).toMatch(/^https:/); expect((r[3].match(DATE) ?? []).length).toBeGreaterThanOrEqual(2); expect(r[4]).toMatch(/„[^”]{10,}”/); expect(r[4]).toMatch(/odczyt\w* \d{2}\.\d{2}\.\d{4}/);
    }
  });
  test('dziennik zgód i 3–5 działań są zapisane; nic nie opublikowano bez zgody', () => {
    expect(doc).toContain('## 3. Dziennik zgód'); expect(doc).toMatch(/zgody właściciela[^\n]*przed/i);
    const act = doc.slice(doc.indexOf('## 4. Działania na start'), doc.indexOf('## 5.')); const n = (act.match(/^\d+\. /gm) ?? []).length;
    expect(n).toBeGreaterThanOrEqual(3); expect(n).toBeLessThanOrEqual(5);
  });
  test('bez nazw aplikacji konkurencji w dokumencie', () => { expect(doc).not.toMatch(/\b(Hevy|Fitbod|Jefit|JEFIT|Liftosaur|FitNotes|StrongLifts)\b/); });
});
