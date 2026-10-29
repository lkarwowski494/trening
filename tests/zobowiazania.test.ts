// Rejestr zobowiązań na przyszłość (decyzja właściciela 28.10.2026): format wierszy i podpięcie pod hak startu sesji.
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..');
const doc = readFileSync(join(root, 'docs/zobowiazania.md'), 'utf8');

function wiersze(sekcja: string): string[][] {
  const start = doc.indexOf(`## ${sekcja}`);
  expect(start).toBeGreaterThanOrEqual(0);
  const rest = doc.slice(start).split('\n').slice(1);
  const koniec = rest.findIndex(l => l.startsWith('## '));
  return (koniec < 0 ? rest : rest.slice(0, koniec))
    .filter(l => /^\| ZB-\d{3} \|/.test(l))
    .map(l => l.split('|').slice(1, -1).map(c => c.trim()));
}

describe('docs/zobowiazania.md (28.10.2026)', () => {
  const aktywne = wiersze('Aktywne');
  const archiwum = wiersze('Archiwum');

  it('każdy aktywny wiersz ma 6 wypełnionych pól i dozwolony stan', () => {
    expect(aktywne.length).toBeGreaterThan(0);
    for (const w of aktywne) {
      expect(w).toHaveLength(6);
      w.forEach(c => expect(c.length).toBeGreaterThan(0));
      expect(w[5]).toMatch(/^(czeka|w toku)/);
    }
  });

  it('zrobione wiersze są w archiwum, nie w aktywnych', () => {
    for (const w of aktywne) expect(w[5]).not.toMatch(/^zrobione/);
    for (const w of archiwum) expect(w[w.length - 1]).toMatch(/^(zrobione|anulowane) \d{4}-\d{2}-\d{2}/);
  });

  it('identyfikatory są unikalne', () => {
    const ids = [...aktywne, ...archiwum].map(w => w[0]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('daty w polu „Kiedy” mają format RRRR-MM-DD i są prawdziwymi datami', () => {
    for (const w of aktywne) {
      for (const d of w[1].match(/\d{4}-\d{2}-\d{2}/g) ?? []) expect(Number.isNaN(Date.parse(d))).toBe(false);
    }
  });

  it('hak SessionStart wypisuje sekcję Aktywne, a CLAUDE.md wskazuje rejestr', () => {
    const settings = readFileSync(join(root, '.claude/settings.json'), 'utf8');
    expect(settings).toContain('docs/zobowiazania.md');
    expect(settings).toMatch(/startup/);
    expect(readFileSync(join(root, 'CLAUDE.md'), 'utf8')).toContain('docs/zobowiazania.md');
  });
});
