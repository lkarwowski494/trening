/*
 * M1-057 (DEC-07 K7) i M1-900 (DEC-07 K10): plan wydania zapisuje budżet czasu właściciela po premierze (2 h tygodniowo przez 8 tygodni,
 * odpowiedzi na recenzje w 48 h) oraz krok listy kontrolnej wydania o becie iOS/watchOS (lipiec–sierpień).
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
const plan = fs.readFileSync(path.join(root, 'docs/42-plan-wydania-1.0.md'), 'utf8');
const growth = fs.readFileSync(path.join(root, 'docs/wzrost.md'), 'utf8');

describe('budżet czasu właściciela po premierze (M1-057)', () => {
  test('docs/42: 2 h tygodniowo przez 8 tygodni i odpowiedzi na recenzje w 48 h', () => {
    expect(plan).toMatch(/## 6\. Po premierze: budżet czasu właściciela/);
    expect(plan).toMatch(/\*\*2 h tygodniowo\*\* przez \*\*8 tygodni\*\*/);
    expect(plan).toMatch(/recenzje.*\*\*48 h\*\*/);
  });
  test('osiem tygodni = okno punktu kontrolnego (docs/monetyzacja.md) i decyzji o Androidzie (docs/wzrost.md)', () => {
    expect(fs.readFileSync(path.join(root, 'docs/monetyzacja.md'), 'utf8')).toContain('po 8 tygodniach od premiery');
    expect(growth).toContain('po 8 tygodniach od premiery');
  });
});

describe('beta iOS/watchOS w liście kontrolnej wydania (M1-900)', () => {
  test('docs/42 pkt 5: krok W1-10 — lipiec–sierpień, symulator w CI, 5 min na telefonie', () => {
    const step = plan.split('\n').find((l) => l.includes('**W1-10**')) ?? '';
    expect(step).toMatch(/^- \[ \] /);
    expect(step).toMatch(/[Bb]eta iOS\/watchOS/);
    expect(step).toMatch(/lipiec–sierpień/);
    expect(step).toMatch(/symulator/);
    expect(step).toMatch(/5 min/);
  });
});
