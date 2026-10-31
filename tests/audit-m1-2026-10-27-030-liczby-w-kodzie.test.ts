/*
 * M1-audytor-generalny-030 (audyt 1.0, 27.10.2026; 08-programista-004, 08-programista-006, 04-studio-projektowe-008, 09-lokalizacja-008): liczby w jednym
 * miejscu (CLAUDE.md) — udział partii pomocniczej to stała SECONDARY_SHARE (lib/setSplit.ts) także w objętości na partię (lib/stats.ts) i w Progresji
 * (lib/progress.ts); etykieta rekordu w szczegółach treningu przez t() („Rekord: {list}”, nie „PR:” na sztywno); migracja literałów fontSize na tokeny —
 * backlog z wersją 1.0.1 (zamrożenie zakresu 1.0). Rodzaje (docs/20): logika (strażnik literałów), języki, dane (backlog), regresja.
 */
import * as fs from 'fs';
import * as path from 'path';

const read = (f: string) => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const noComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');

describe('M1-030: liczby i etykiety w jednym miejscu', () => {
  test('udział partii pomocniczej: bez literału „* 0.5” przy secondaryMuscles; obie miejsca używają SECONDARY_SHARE', () => {
    for (const f of ['lib/stats.ts', 'lib/progress.ts']) {
      const s = noComments(read(f)); expect([f, /secondaryMuscles[^\n]*\*\s*0\.5\b/.test(s)]).toEqual([f, false]); expect([f, /secondaryMuscles[^\n]*SECONDARY_SHARE/.test(s)]).toEqual([f, true]);
    }
  });
  test('szczegóły treningu: etykieta rekordu przez t(„Rekord: {list}”), bez „PR:” wpisanego na sztywno', () => {
    const s = noComments(read('app/history/[id].tsx')); expect(s).not.toMatch(/>PR: \{/); expect(s).toMatch(/t\('Rekord: \{list\}'/);
  });
});
