/*
 * Ekran ćwiczenia — sekcja „Co robią mięśnie” (decyzja właściciela 26.10.2026): mapa mięśni (sylwetka przód/tył) i przy każdym podświetlonym mięśniu zdanie o jego roli.
 * Rodzaje (docs/20): ekran PL i EN, jasny/ciemny motyw, ćwiczenie bez roli (szyja), ćwiczenie własne, uproszczenie niewyświetlane, VoiceOver (etykiety), wszystkie języki.
 */
import * as RN from 'react-native';
import * as store from '@/lib/store';
import { LANGS, tIn } from '@/lib/i18n';
import { REGION_LABEL } from '@/lib/seed';
import { ROLE_DATA } from '@/lib/muscleRoles';
import { fresh, saved, ex } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

jest.setTimeout(60000);
beforeEach(() => { jest.useFakeTimers({ now: new Date(2026, 9, 26, 12).getTime() }); });
afterEach(() => { jest.useRealTimers(); jest.restoreAllMocks(); });

async function open(name: string, locale: 'pl' | 'en' = 'pl', scheme: 'light' | 'dark' = 'light') {
  jest.spyOn(RN, 'useColorScheme').mockImplementation((() => scheme) as never);
  await fresh(undefined, locale); const id = ex(name).id; store.save(); await act(async () => { await store.flush(); });
  await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); await flushAll(10); await go(`/exercise/${id}`); await flushAll(10);
}
const texts = (root: { findAll: (f: (n: never) => boolean) => { props: { children?: unknown } }[] }) => root.findAll((n: { type?: unknown }) => n.type === 'Text' as never).map(n => [n.props.children].flat().join(''));
const rolesBlock = () => screen.getByTestId('muscle-roles');
const blockTexts = () => texts(rolesBlock() as never);

describe('sekcja „Co robią mięśnie” na ekranie ćwiczenia', () => {
  test.each([['light'], ['dark']] as const)('PL / %s: Bench Press (sztanga) — mapa i trzy zdania w kolejności obciążenia', async sc => {
    await open('Bench Press (sztanga)', 'pl', sc);
    expect(screen.getByText('Co robią mięśnie')).toBeTruthy(); expect(screen.getByTestId('muscle-map')).toBeTruthy();
    expect(blockTexts()).toEqual(['klatka', 'Przyciąga ramię do przodu i do środka, gdy pchasz.', 'triceps', 'Pomaga prostować łokieć, gdy pchasz.', 'barki — przód', 'Pomaga unosić ramię do przodu, gdy pchasz.']);
    expect(screen.getByText('Mocniejszy kolor: partia główna, słabszy: pomocnicza.')).toBeTruthy();
  });
  test('EN: te same wiersze po angielsku; nazwy regionów i zdania przetłumaczone', async () => {
    await open('Bench Press (sztanga)', 'en');
    expect(screen.getByText('What the muscles do')).toBeTruthy();
    expect(blockTexts()).toEqual(['chest', 'Brings your upper arm forward and inward as you push.', 'triceps', 'Helps straighten your elbow as you push.', 'front delts', 'Helps raise your arm forward as you push.']);
  });
  test('VoiceOver: mapa ma jeden opis z rolami partii, wiersz = region, rola i zdanie w jednym elemencie z językiem odczytu', async () => {
    await open('Bench Press (sztanga)');
    expect(screen.getByTestId('muscle-map').props.accessibilityLabel).toBe('Mapa mięśni ćwiczenia: klatka główna, triceps pomocnicza, barki — przód pomocnicza');
    const row = screen.getByLabelText('klatka, główna: Przyciąga ramię do przodu i do środka, gdy pchasz.');
    expect(row.props.accessible).toBe(true); expect(row.props.accessibilityLanguage).toBe('pl');
  });
  test('ćwiczenie w rodzinie z fazą: Back Squat — „gdy wstajesz”; izolacja bez fazy: Biceps Curl (hantle)', async () => {
    await open('Back Squat'); expect(blockTexts()).toContain('Prostuje kolano, gdy wstajesz.');
    await open('Biceps Curl (hantle)'); expect(blockTexts()).toContain('Zgina łokieć.');
  });
  test('uproszczenie nie jest wyświetlane: Pull Up — jest zdanie najszerszych, nie ma wiersza „góra pleców”; mapa zostaje', async () => {
    await open('Pull Up'); const b = blockTexts();
    expect(b).toContain(REGION_LABEL.lats); expect(b).toContain('Pomaga zginać łokieć, gdy przyciągasz.'); expect(b).not.toContain(REGION_LABEL.upper_back); expect(b.join(' ')).not.toMatch(/Ściąga łopatki w dół/);
    expect(screen.getByTestId('muscle-map')).toBeTruthy();
  });
  test('szyja: ćwiczenie tylko z szyją nie ma sekcji z wierszami (bez dopisku o braku opisu)', async () => {
    await open('Lying Neck Flexion (talerz)'); expect(screen.queryByTestId('muscle-roles')).toBeNull(); expect(screen.queryByTestId('muscle-map')).toBeNull();
    expect(screen.queryByText('Co robią mięśnie')).toBeNull();
    expect(screen.queryByText(/bez opisu|brak opisu/i)).toBeNull();
  });
  test('lista po nazwie: Shrugs (hantle) → „Unosi barki.”; Wrist Curl (hantle) → „Zgina nadgarstek.”', async () => {
    await open('Shrugs (hantle)'); expect(blockTexts()).toContain('Unosi barki.');
    await open('Wrist Curl (hantle)'); expect(blockTexts()).toContain('Zgina nadgarstek.');
  });
  test('ćwiczenie własne (bez wpisu w katalogu): brak sekcji', async () => {
    await fresh(); const own = store.newExercise('Moje'); own.muscles = ['klatka']; store.save(); await act(async () => { await store.flush(); });
    await renderApp({ saved: JSON.parse(JSON.stringify(saved())) }); await flushAll(10); await go(`/exercise/${own.id}`); await flushAll(10);
    expect(screen.getByText('Moje')).toBeTruthy(); expect(screen.queryByTestId('muscle-roles')).toBeNull(); expect(screen.queryByText('Co robią mięśnie')).toBeNull();
  });
  test('ćwiczenie z uproszczeniem w każdej roli (Plank): mapa jest, wierszy ze zdaniami nie ma', async () => {
    await open('Plank'); expect(screen.getByTestId('muscle-map')).toBeTruthy(); expect(screen.queryByTestId('muscle-roles')).toBeNull();
  });
});

describe('wszystkie języki', () => {
  test.each(LANGS.filter(l => l !== 'pl'))('%s: każde zdanie roli daje niepusty tekst bez polskich znaków poza językiem polskim (przekład albo angielski zapas)', l => {
    for (const f of Object.values(ROLE_DATA.functions)) for (const vs of Object.values(f.t)) for (const pl of Object.values(vs ?? {})) {
      const s = tIn(l, pl); expect([l, pl, s.length > 0]).toEqual([l, pl, true]);
      if (l === 'en') expect(/[ąęłńśźżĄĘŁŃŚŹŻ]/.test(s)).toBe(false);
    }
    expect(tIn(l, 'Co robią mięśnie').length).toBeGreaterThan(0);
  });
});
