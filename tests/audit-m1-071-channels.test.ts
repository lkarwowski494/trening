/*
 * M1-audytor-generalny-071 (DEC-25 a): plan startu z tabelą kanałów w docs/wzrost.md. Każdy kanał ma adres, 2–3 wątki z datą i cytat zasady o autopromocji z datą odczytu —
 * albo jawny znacznik [DO USTALENIA] / [DO PRZECZYTANIA] (nie zgadujemy). Kanały z zakazem (SFD) i nieprzeczytane mają tryb „tylko pomocna obecność bez linku”.
 * Tabela jest pilnowana tak, by cytat bez daty odczytu albo „link dozwolony” bez kompletu danych nie przeszły.
 * M1-audytor-generalny-051 (11-wzrost-001, DEC-02 a, 23.10.2026): strażnik przechodził na samych znacznikach, a regulamin SFD zakazuje promocji
 * bez pisemnej zgody. Teraz: forum i grupy są poza planem startu (wpis tylko po pisemnej zgodzie administracji, zgodnie z jej regulaminem);
 * kanał z zakazem albo z nieprzeczytaną zasadą nie może mieć trybu pozwalającego na wpis; wiersz SFD ma adres regulaminu, cytat i datę odczytu.
 */
import * as fs from 'fs';
import * as path from 'path';
import { namesIn, CFG } from './forbidden-names';

const doc = fs.readFileSync(path.join(__dirname, '..', 'docs', 'wzrost.md'), 'utf8');
const DATE = /\b\d{2}\.\d{2}\.\d{4}\b/g;
const sec = doc.slice(doc.indexOf('## 2. Tabela kanałów startu'), doc.indexOf('## 3. Dziennik zgód'));
const rows = sec.split('\n').filter((l) => /^\| \d+ \|/.test(l)).map((l) => l.split('|').slice(1, -1).map((c) => c.trim()));
const NO_LINK = 'tylko pomocna obecność bez linku';
const CONSENT = 'poza planem startu — wpis tylko po pisemnej zgodzie administracji';
const ALLOWS_POST = (mode: string) => mode !== CONSENT;

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
  test('tryby tylko ze słownika: „link dozwolony”, „tylko pomocna obecność bez linku” albo „poza planem startu” (M1-051)', () => {
    for (const r of rows) expect([r[1], [NO_LINK, CONSENT].includes(r[5]) || /^link dozwolony/.test(r[5])]).toEqual([r[1], true]);
  });
  test('kanał z zakazem albo z nieprzeczytaną zasadą: żaden tryb z wpisem — tylko „poza planem startu” (M1-051)', () => {
    for (const r of rows) if (/\[DO PRZECZYTANIA/.test(r[4]) || /zakaz/i.test(r[4])) expect([r[1], ALLOWS_POST(r[5])]).toEqual([r[1], false]);
  });
  test('forum i grupy (SFD, Reddit, lokalne fora i grupy): poza planem startu (DEC-02 a, M1-051)', () => {
    const forums = rows.filter((r) => /SFD|Reddit|fora|forum|grup/i.test(r[1])); expect(forums.length).toBeGreaterThanOrEqual(3);
    for (const r of forums) expect([r[1], r[5]]).toEqual([r[1], CONSENT]);
  });
  test('SFD: adres regulaminu, cytat zakazu z datą odczytu (M1-051)', () => {
    const sfd = rows.find((r) => r[1].includes('SFD'))!;
    expect(sfd[4]).toContain('https://www.sfd.pl/regulamin'); expect(sfd[4]).toMatch(/„[^”]*bez pisemnej zgody Usługodawcy”/); expect(sfd[4]).toMatch(/odczyt\w* \d{2}\.\d{2}\.\d{4}/); expect(sfd[4]).toMatch(/zakaz/i);
  });
  test('reguła zapisana (docs/wzrost.md pkt 1 i docs/15): wpis na forum/grupie tylko po pisemnej zgodzie administracji, zgodnie z regulaminem; plan startu bez wpisów na forach (M1-051)', () => {
    const rule = /wpis na forum (?:albo|lub|\/) ?w? ?grupie[^\n]*tylko po pisemnej zgodzie administracji[^\n]*regulamin/i;
    expect(doc.slice(0, doc.indexOf('## 2.'))).toMatch(rule);
    expect(fs.readFileSync(path.join(__dirname, '..', 'docs', '15-app-store.md'), 'utf8')).toMatch(/pisemnej zgodzie administracji/);
    const act = doc.slice(doc.indexOf('## 4. Działania na start'), doc.indexOf('## 5.'));
    expect(act).not.toMatch(/Spokojne wpisy|wpisy bez linku/i);
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
  test('bez nazw aplikacji konkurencji w dokumencie (lista wspólna tests/forbidden-names.json)', () => { const apps = CFG.names.slice(0, 19); expect(namesIn(doc).filter((n) => apps.includes(n))).toEqual([]); });
});
