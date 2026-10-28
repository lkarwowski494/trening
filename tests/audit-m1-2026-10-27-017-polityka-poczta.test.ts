/*
 * M1-audytor-generalny-017 (audyt 1.0, 27.10.2026; 01-odkrywanie-008): polityka prywatności (site/privacy.html, PL i EN) wymienia faktycznych odbiorców
 * poczty — od 21.10.2026 poczta działa na Google Workspace, przekierowania u rejestratora domeny usunięte (docs/18, 21.10.2026). Bez rejestratora
 * na liście odbiorców i w „przekazaniu poza EOG”, bez „dziś Gmail”. Rodzaje (docs/20): dane (treść strony), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';

const page = () => fs.readFileSync(path.join(__dirname, '..', 'site/privacy.html'), 'utf8');

describe('M1-017: odbiorcy poczty w polityce prywatności', () => {
  test('bez rejestratora domeny i bez stanu przejściowego „dziś Gmail / po przeniesieniu”', () => {
    const s = page(); expect(s).not.toMatch(/Porkbun/); expect(s).not.toMatch(/dziś Gmail|Gmail today|po przeniesieniu|after the move/);
  });
  test('Google Workspace jako dostawca poczty w PL i EN; przekazanie poza EOG wymienia tylko Google', () => {
    const s = page(); expect((s.match(/Google Workspace/g) ?? []).length).toBeGreaterThanOrEqual(2);
    expect(s).toMatch(/Przekazanie poza EOG:<\/strong> Google może/); expect(s).toMatch(/Transfers outside the EEA:<\/strong> Google may/);
  });
});
