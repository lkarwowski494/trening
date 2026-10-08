/*
 * Mapa mięśni w podsumowaniu okresu (decyzja właściciela 08.10.2026, docs/21 4b): lib/musclemap.ts + components/MuscleMap.tsx.
 * Rodzaje (docs/20): logika (stopnie odcienia — skala względna, ranking), dane (każda partia z MUSCLES na rysunku, kształty w polu
 * rysunku, symetria lewa/prawa), ekran (opis VoiceOver, kolory z motywu — jasny/ciemny), języki (EN), niezmiennik (serie per partia
 * okresu = „Serie per partia” tygodnia). E2E: .maestro/05 (zrzut „Summary” z mapą).
 */
import * as fs from 'fs';
import * as path from 'path';
import * as store from '@/lib/store';
import { applyLang } from '@/lib/i18n';
import { MUSCLES } from '@/lib/seed';
import { setsByMuscle, weeklySetsByMuscle, thisMonday } from '@/lib/stats';
import { PARTS, shadeLevel, rankedMuscles, SHADE_OPACITY, svgMarkup } from '@/lib/musclemap';
import { light, dark } from '@/lib/theme';
import { fresh, addWorkout, saved } from './helpers';
import { renderApp, flushAll, screen, go, act } from './app';

const NOW = new Date(2026, 9, 8, 18, 0);
const at = (m: number, d: number, h = 18) => new Date(2026, m, d, h).getTime();
beforeEach(async () => { jest.useFakeTimers({ now: NOW }); await fresh(); });
afterEach(() => { applyLang('pl'); });

describe('logika', () => {
  test('stopnie: 0 bez serii, potem ćwiartki największej partii (1–4); max 0 albo wartości niepoprawne → 0', () => {
    expect([0, 0.5, 1, 2.5, 2.6, 5, 7.5, 7.6, 10].map(v => shadeLevel(v, 10))).toEqual([0, 1, 1, 1, 2, 2, 3, 4, 4]);
    expect([shadeLevel(3, 0), shadeLevel(NaN, 10), shadeLevel(-1, 10), shadeLevel(20, 10)]).toEqual([0, 0, 0, 4]);
    expect(SHADE_OPACITY[0]).toBe(0); expect([...SHADE_OPACITY].slice(1)).toEqual([...SHADE_OPACITY].slice(1).sort());
  });
  test('ranking partii od największej liczby serii, bez zer', () => {
    expect(rankedMuscles({ klatka: 3, triceps: 1.5, barki: 1.5, plecy: 0 })).toEqual([['klatka', 3], ['barki', 1.5], ['triceps', 1.5]]) /* remis — kolejność z MUSCLES */;
  });
  test('niezmiennik: serie per partia okresu (tydzień) = „Serie per partia” w Postępach', () => {
    addWorkout(at(9, 6), [['Bench Press (sztanga)', [{ weight: 80, reps: 5 }, { weight: 80, reps: 5 }]], ['Pull Up', [{ reps: 8 }]]]);
    const ws = thisMonday(0, NOW); expect(setsByMuscle(ws, thisMonday(1, NOW))).toEqual(weeklySetsByMuscle(ws));
  });
});

describe('dane rysunku', () => {
  test('każda partia z listy MUSCLES jest na rysunku; „barki” z przodu i z tyłu; partie spoza listy — brak', () => {
    const drawn = new Set(PARTS.map(p => p.muscle).filter(Boolean)); expect([...drawn].sort()).toEqual([...MUSCLES].sort());
    expect(PARTS.filter(p => p.muscle === 'barki').map(p => p.view).sort()).toEqual(['back', 'front']);
  });
  test('kształty mieszczą się w polu sylwetki (120 × 260) i są symetryczne (lewa = odbicie prawej)', () => {
    for (const p of PARTS) for (const s of p.shapes) {
      if ('e' in s) { const [cx, cy, rx, ry] = s.e; expect(cx - rx).toBeGreaterThanOrEqual(0); expect(cx + rx).toBeLessThanOrEqual(120); expect(cy - ry).toBeGreaterThanOrEqual(0); expect(cy + ry).toBeLessThanOrEqual(260); }
      else for (const m of s.d.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)) { expect(+m[1]).toBeGreaterThanOrEqual(0); expect(+m[1]).toBeLessThanOrEqual(120); expect(+m[2]).toBeGreaterThanOrEqual(0); expect(+m[2]).toBeLessThanOrEqual(260); }
    }
    /* symetria: środki ramek kształtów każdej części ułożone lustrzanie względem osi x = 60 */
    const xs = (sh: (typeof PARTS)[number]['shapes'][number]) => 'e' in sh ? [sh.e[0] - sh.e[2], sh.e[0] + sh.e[2]] : [...sh.d.matchAll(/(-?\d+(?:\.\d+)?),/g)].map(m => +m[1]);
    for (const p of PARTS) { const c = p.shapes.map(sh => { const x = xs(sh); return Math.min(...x) + Math.max(...x) - 120; }).sort((a, b) => a - b); expect({ part: p.muscle, c }).toEqual({ part: p.muscle, c: c.map(v => -v).sort((a, b) => a - b).map(v => v + 0) }); }
  });
  test('podgląd SVG (ten sam rysunek): partia bez serii — kolor neutralny, partia z serią — akcent', () => {
    const svg = svgMarkup({ klatka: 4 }); expect(svg).toContain('fill="#1F5FD1" fill-opacity="1"'); expect(svg).toContain('fill="#C9CFDA"');
  });
});

describe('ekran', () => {
  const boot = async (fn: () => void, locale: 'pl' | 'en' = 'pl') => { await fresh(undefined, locale); fn(); await act(async () => { await store.flush(); }); await renderApp({ saved: JSON.parse(JSON.stringify(saved())), locale }); jest.setSystemTime(NOW.getTime()); await go('/more/progress'); await flushAll(10); };
  test('mapa w podsumowaniu okresu: opis VoiceOver z partiami od największej; okres bez serii — opis „brak serii”; legenda i opis skali', async () => {
    await boot(() => { addWorkout(at(9, 6), [['Bench Press (sztanga)', [{ weight: 80, reps: 5 }, { weight: 80, reps: 5 }]]]); });
    const map = screen.getByTestId('muscle-map'); expect(map.props.accessibilityRole).toBe('image');
    expect(map.props.accessibilityLabel).toBe('Mapa mięśni: klatka 2, barki 1, triceps 1');
    for (const s of ['Mapa mięśni', 'Przód', 'Tył', 'mniej', 'więcej', 'Kolor względem partii z największą liczbą serii w tym okresie (partia główna 1 seria, pomocnicza 0,5). Szare — bez serii.']) expect(screen.getByText(s)).toBeTruthy();
    await boot(() => { addWorkout(at(8, 1), [['Back Squat', [{ weight: 100, reps: 5 }]]]); });
    expect(screen.getByTestId('muscle-map').props.accessibilityLabel).toBe('Mapa mięśni: brak serii w tym okresie.');
  });
  test('kolory z motywu (jasny i ciemny), bez stałych kolorów w komponencie', async () => {
    const src = fs.readFileSync(path.join(__dirname, '../components/MuscleMap.tsx'), 'utf8'); expect(src).not.toMatch(/#[0-9a-fA-F]{3,6}\b/);
    await boot(() => { addWorkout(at(9, 6), [['Bench Press (sztanga)', [{ weight: 80, reps: 5 }]]]); });
    const fills = screen.UNSAFE_root.findAll((n: any) => n.props && typeof n.props.fill === 'string' && n.props.fillOpacity != null).map((n: any) => n.props.fill);
    expect(fills).toContain(light.accent); expect(fills).toContain(light.line); expect(fills).toContain(light.surface2); expect(dark.accent).not.toBe(light.accent);
  });
  test('English', async () => {
    await boot(() => { addWorkout(at(9, 6), [['Bench Press (sztanga)', [{ weight: 80, reps: 5 }]]]); }, 'en');
    expect(screen.getByTestId('muscle-map').props.accessibilityLabel).toMatch(/^Muscle map: chest 1, /);
    for (const s of ['Muscle map', 'Front', 'Back', 'less', 'more']) expect(screen.getByText(s)).toBeTruthy();
  });
});
