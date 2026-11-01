/* Audyt jakości 07-jakosc-002 (P1, utrata danych): readRecovery pomijał klucz „<kopia>_cfg” odłożony przy nieczytelnym „state” —
 * plik ratunkowy i pole `recovery` kopii bezpieczeństwa gubiły szablony i ustawienia. Czerwone przed poprawką. */
import * as store from '@/lib/store';
import { fresh, seedState } from './helpers';

jest.setTimeout(30000);

const cfgOf = (seq: number, templates: unknown[], defaultRest: number) => ({ seq, at: 7, data: { templates, settings: { defaultRest } } });

describe('07-jakosc-002: koperta ratunkowa niesie konfigurację (cfg)', () => {
  test('nieczytelny „state” + „cfg” w bazie: plik ratunkowy zawiera szablony i ustawienia z cfg (live też)', async () => {
    const s: any = seedState('pl'); const tpl = s.templates;
    const cfg = cfgOf(9, tpl, 88); const live = { seq: 4, at: 5, active: null, timer: null };
    await fresh(); global.__kv.clear();
    global.__kv.set('state', '{zle'); global.__kv.set('cfg', JSON.stringify(cfg)); global.__kv.set('live', JSON.stringify(live));
    store.__resetForTests(); await store.init();
    const key = store.getRecovery()!.key;
    expect(global.__kv.get(key + '_cfg')).toBe(JSON.stringify(cfg)); /* boot odłożył cfg obok kopii */
    const env = JSON.parse((await store.readRecovery())!);
    expect(env.format).toBe('trening-recovery'); expect(env.state).toBe('{zle'); expect(env.live).toEqual(live);
    expect(env.cfg).toEqual(cfg); expect(env.cfg.data.settings.defaultRest).toBe(88); expect(env.cfg.data.templates.length).toBe(tpl.length);
  });
  test('sam „cfg” bez „live” też trafia do koperty (wcześniej zwracany był goły tekst stanu)', async () => {
    const cfg = cfgOf(9, [], 61);
    await fresh(); global.__kv.clear(); global.__kv.set('state', '{zle'); global.__kv.set('cfg', JSON.stringify(cfg));
    store.__resetForTests(); await store.init();
    const env = JSON.parse((await store.readRecovery())!);
    expect(env.format).toBe('trening-recovery'); expect(env.cfg).toEqual(cfg); expect(env.live).toBeUndefined();
  });
  test('zgodność wstecz: bez „cfg” i bez „live” — goły tekst stanu; bez „cfg” z „live” — koperta bez pola cfg', async () => {
    await fresh(); global.__kv.clear(); global.__kv.set('state', '{zle1');
    store.__resetForTests(); await store.init();
    expect(await store.readRecovery()).toBe('{zle1');
    const k = store.getRecovery()!.key; global.__kv.set(k + '_live', JSON.stringify({ seq: 1, at: 1, active: null }));
    const env = JSON.parse((await store.readRecovery())!);
    expect(env.live).toBeDefined(); expect('cfg' in env).toBe(false);
  });
});
