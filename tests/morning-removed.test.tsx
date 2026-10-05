/* Decyzja właściciela 05.10.2026: „Chciałbym wyrzucić poranny wpis. Nie wszyscy mają czym to mierzyć.” — wariant „usunąć z aplikacji”:
 * znika ekran, pozycje na ekranie głównym i w Więcej, dopisek w nagłówku treningu i przypomnienie o wadze; ZAPISANE wpisy zostają w danych
 * (migracja i kopia zapasowa bez zmian — możliwy powrót w przyszłej wersji). */
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import { fresh, ex } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';
import * as fs from 'fs';
import * as path from 'path';

jest.setTimeout(60000);
const morning = { id: 'm1', ownerId: 'local', createdAt: 1, updatedAt: 1, date: new Date().toISOString().slice(0, 10), bb: 70, sleepScore: 80, sleepH: 7.5, weight: 82 };
describe('poranny wpis — usunięty z aplikacji (05.10.2026)', () => {
  test('ekran główny i „Więcej” bez porannego wpisu, także gdy dziś jest zapisany wpis; brak ekranu more/morning', async () => {
    await fresh(); store.getState().mornings.push({ ...morning }); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    expect(screen.queryByText('Poranny wpis')).toBeNull(); expect(screen.queryByText('Dziś rano')).toBeNull();
    await go('/more'); await flushAll(5); expect(screen.queryByText('Poranne wpisy')).toBeNull();
    expect(fs.existsSync(path.join(__dirname, '..', 'app', 'more', 'morning.tsx'))).toBe(false);
  });
  test('trening w toku: nagłówek bez dopisku BB / sen', async () => {
    await fresh(); store.getState().mornings.push({ ...morning }); store.startEmpty(); store.addExerciseToActive(ex('Push Up')); await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await flushAll(10);
    expect(JSON.stringify(screen.toJSON())).not.toMatch(/BB 70|sen 80/);
  });
  test('ustawienia bez „Przypomnienie o wadze”; zaplanowane wcześniej przypomnienie jest odwoływane, nowe nie powstaje', async () => {
    await fresh(); store.getState().settings.weighReminder = true; await store.flush();
    await renderApp({ saved: JSON.parse(JSON.stringify(store.getState())) }); await go('/more/settings'); await flushAll(10);
    expect(screen.queryByText('Przypomnienie o wadze')).toBeNull();
    (global as any).__notifications.length = 0; (global as any).__cancelled.length = 0;
    await act(async () => { await timer.scheduleWeighReminder(); });
    expect((global as any).__cancelled).toContain('weigh-reminder');
    expect((global as any).__notifications.some((r: any) => r.identifier === 'weigh-reminder')).toBe(false);
  });
  test('zapisane wpisy zostają w danych (migracja, eksport kopii)', async () => {
    await fresh(); const s: any = JSON.parse(JSON.stringify(store.getState())); s.mornings = [{ ...morning }];
    expect(store.migrate(s).mornings).toHaveLength(1);
  });
});
