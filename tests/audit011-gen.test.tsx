/* Audyt zmian 0.11, część 1:
 * A11-2 (ŚREDNIA) — MER2-02 nie był widoczny: lib/loadcap.ts nigdzie niepodpięty. Ostrzeżenie o najcięższym ciężarze w miejscu ma być w podglądzie
 *   generatora (previewWarnings → ekran generatora) przy celu „Siła” w miejscu z lekkimi hantlami.
 * A11-1 (ŚREDNIA, od 0.10.0) — „Zastąp” w generatorze usuwał wygenerowany szablon wskazany TYLKO przez zmianę dnia w zapisanym planie
 *   (savedPlans[].overrides); zmiana dnia ginęła po ponownej aktywacji planu. Szablony ze zmian dni zapisanych planów są chronione. */
import * as store from '@/lib/store';
import * as plan from '@/lib/plan';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, act, go } from './app';
import { generate, previewWarnings, replaceable, saveGenerated } from '@/lib/generator';
import { addLocation } from '@/lib/locations';

jest.setTimeout(60000);
const inp = (goal: 'strength' | 'hypertrophy' | 'cut', locationId: string | null) => ({ goal, locationId, sessions: 3, minutes: 60 });

describe('A11-2: ostrzeżenie o lekkich hantlach w podglądzie generatora', () => {
  test('hotel + Siła: previewWarnings zawiera „loadcap”; pełna siłownia — nie', async () => {
    await fresh(); const l = addLocation('hotel');
    const w = previewWarnings(generate(inp('strength', l.id)), inp('strength', l.id));
    expect(w.map(x => x.kind)).toContain('loadcap');
    expect(previewWarnings(generate(inp('strength', null)), inp('strength', null)).map(x => x.kind)).not.toContain('loadcap');
  });
  test('ekran generatora pokazuje ostrzeżenie (hotel jako jedyne miejsce, cel Siła)', async () => {
    await fresh(); const l = addLocation('hotel'); void l; await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); await go('/generator'); await flushAll(10);
    const { fireEvent } = require('./app'); const strength = screen.queryAllByText(/^Siła$/)[0]; if (strength) { await act(async () => { fireEvent.press(strength); }); await flushAll(10); }
    expect(screen.queryAllByText(/Najcięższy ciężar w miejscu dla boju głównego/).length).toBeGreaterThan(0);
  });
});

describe('A11-1: szablon wskazany tylko przez zmianę dnia w zapisanym planie nie jest „do zastąpienia”', () => {
  test('zmiana dnia w savedPlans[].overrides chroni wygenerowany szablon; po „Zastąp” zmiana dnia działa', async () => {
    await fresh();
    const i = inp('hypertrophy', null); const first = saveGenerated(generate(i), i, false);
    const keep = first.templateIds[0];
    /* inny zapisany plan (ręczny) z jednodniową zmianą wskazującą wygenerowany szablon */
    const S = store.getState(); const future = plan.addDays(plan.dayKeyOf(Date.now()), 3);
    S.savedPlans = [...(S.savedPlans ?? []), { id: 'manual', name: 'Ręczny', days: [null, null, null, null, null, null, null], overrides: { [future]: keep } }]; store.save();
    expect(replaceable().templateIds).not.toContain(keep);
    saveGenerated(generate(i), i, false, true);
    expect(store.getState().templates.some(x => x.id === keep)).toBe(true);
  });
});
