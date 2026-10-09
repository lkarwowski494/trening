/* Audyt kontrolny 1, UI2-09 (NISKA) — pozostałości spójności: limit domyślnej przerwy z REST_MAX (liczby w jednym miejscu), notka medyczna
 * w sekcji „Trening” (nie nad „Wyczyść wszystkie dane”), przycisk do gum w miejscu „Gumy…” (ekran gum to dodawanie, edycja i usuwanie). */
import * as fs from 'fs';
import * as store from '@/lib/store';
import { addLocation } from '@/lib/locations';
import { fresh, saved } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(60000);
const boot = async (fn: () => void = () => {}) => { await fresh(); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); };
const order = (labels: string[]) => { const all = screen.UNSAFE_root.findAll((n: { props: Record<string, unknown> }) => typeof n.props.children === 'string').map((n: { props: Record<string, unknown> }) => n.props.children as string); return labels.map(l => all.findIndex(x => x.includes(l))); };

describe('UI2-09', () => {
  test('Ustawienia: limit przerwy ze stałej REST_MAX, bez literału 1800', () => {
    const src = fs.readFileSync('app/more/settings.tsx', 'utf8'); expect(src).not.toMatch(/\b1800\b/); expect(src).toContain('REST_MAX');
  });
  test('Ustawienia: notka medyczna w sekcji „Trening”, przed „Dane i kopie” i daleko od „Wyczyść wszystkie dane”', async () => {
    await boot(); await go('/more/settings'); await flushAll(10);
    const [trening, med, dane, wipe] = order(['Trening', 'Aplikacja nie udziela porad medycznych', 'Dane i kopie', 'Wyczyść wszystkie dane']);
    expect(med).toBeGreaterThan(trening); expect(med).toBeLessThan(dane); expect(wipe).toBeGreaterThan(dane);
  });
  test('miejsce: przycisk do gum to „Gumy…”, nie „Usuń gumy…”', async () => {
    let id = ''; await boot(() => { id = addLocation('gym').id; }); await go(`/more/location/${id}`); await flushAll(10); const { expandEquip } = require('./app'); await expandEquip();
    expect(screen.queryByText('Usuń gumy…')).toBeNull(); expect(screen.getByText('Gumy…')).toBeTruthy();
  });
});
