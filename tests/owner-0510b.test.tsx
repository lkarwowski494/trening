/* Uwagi właściciela 05.10.2026 (po instalacji): „Na razie schowaj moduły”; „Nie powinno być »format <nazwa innej aplikacji>« — nie chcemy nazw innych aplikacji
 * w naszej”; „Nie widzę oddzielnego ekranu do ustawiania miejsc i sprzętu”. */
import * as fs from 'fs';
import * as path from 'path';
import { renderApp, flushAll, screen, go, tap } from './app';
import { EN } from '@/lib/i18n.en';
import { forbiddenIn } from './forbidden-names';

jest.setTimeout(60000);
describe('uwagi właściciela 05.10 (b)', () => {
  test('Ustawienia: bez sekcji „Moduły”', async () => {
    await renderApp(); await go('/more/settings'); await flushAll(10);
    expect(screen.queryByText('Moduły')).toBeNull(); expect(screen.queryByText('Ukryj to, czego nie używasz')).toBeNull();
  });
  test('bez nazw innych aplikacji w tekstach interfejsu (PL i EN) — lista z tests/forbidden-names.json (TST2-08), wyjątki z powodem', () => {
    const ui: string[] = []; const walk = (d: string) => { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (/\.tsx?$/.test(f)) ui.push(p); } };
    walk(path.join(__dirname, '..', 'app')); walk(path.join(__dirname, '..', 'components'));
    const bad: string[] = [];
    for (const f of ui) { const src = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, ''); const rel = path.relative(path.join(__dirname, '..'), f); for (const m of src.matchAll(/t[r]?\('([^']*)'/g)) if (forbiddenIn(rel, m[1]).length) bad.push(`${path.basename(f)}: ${m[1]}`); }
    for (const [k, v] of Object.entries(EN)) if (forbiddenIn('lib/i18n.en.ts', k).length || forbiddenIn('lib/i18n.en.ts', v).length) bad.push(`EN: ${k}`);
    expect(bad).toEqual([]);
  });
  test('„Więcej” ma osobną pozycję „Miejsca i sprzęt” prowadzącą do listy miejsc', async () => {
    await renderApp(); await go('/more'); await flushAll(10);
    await tap(screen.getByText('Miejsca i sprzęt')); await flushAll(10);
    expect(screen.getByText('+ Dodaj miejsce')).toBeTruthy();
  });
});
