/*
 * Źródła nowych wskazówek zestawów ogólnych (recenzja treści 1.1, 27.10.2026, S1): każde wdrożone id z cue-sets.json (dawne newIds + skull.depthFree) ma wpis z ≥ 2 przeczytanymi
 * źródłami w data/zrodla/cues-zestawy.json (poza paczką aplikacji; wewnętrzny rejestr), a tekst PL we wpisie zgadza się z lib/cues/text/pl.json. Wstrzymanych brak (st.tension wdrożone 27.10.2026).
 */
import * as fs from 'fs';
import * as path from 'path';
import { CUE_SETS } from '@/lib/figures/v2/cueSets';

const root = path.join(__dirname, '..');
const FILE = JSON.parse(fs.readFileSync(path.join(root, 'data/zrodla/cues-zestawy.json'), 'utf8')) as { wskazowki: Record<string, { pl: string; status: string; src: [string, string][]; powod?: string }> };
const PL: Record<string, string> = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/text/pl.json'), 'utf8'));
const EN: Record<string, string> = JSON.parse(fs.readFileSync(path.join(root, 'lib/cues/text/en.json'), 'utf8'));

describe('źródła wskazówek zestawów ogólnych (data/zrodla/cues-zestawy.json)', () => {
  test('wdrożone id: tekst w pl i en zgodny z wpisem, ≥ 2 źródła (adres albo miejsce + cytat), bez liczb w treści', () => {
    const ids = Object.entries(FILE.wskazowki).filter(([, v]) => v.status === 'wdrozony').map(([k]) => k);
    expect(ids.length).toBe(54);
    for (const id of ids) {
      const v = FILE.wskazowki[id];
      expect([id, PL[id]]).toEqual([id, v.pl]); expect([id, !!EN[id]?.trim()]).toEqual([id, true]);
      expect([id, Array.isArray(v.src) && v.src.length >= 2 && v.src.every(x => x[0].length > 5 && x[1].length > 5)]).toEqual([id, true]);
      expect([id, /\d/.test(v.pl)]).toEqual([id, false]);
    }
  });
  test('wstrzymane id (newIds) nie mają tekstu w aplikacji i mają powód', () => {
    const held = Object.entries(FILE.wskazowki).filter(([, v]) => v.status === 'wstrzymany').map(([k, v]) => { expect([k, (v.powod ?? '').length > 20]).toEqual([k, true]); return k; });
    expect(held.sort()).toEqual([...CUE_SETS.meta.newIds].sort());
    for (const id of held) { expect([id, PL[id]]).toEqual([id, undefined]); expect([id, EN[id]]).toEqual([id, undefined]); }
  });
});
