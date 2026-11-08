/*
 * (wdrożenie 08.11.2026) Figury v2 — strażnik „bez zaworu: żadna rodzina nie wychodzi bez nakładki” (decyzja właściciela 04.11.2026 ~11:35 PL, docs/18: „rysunek pokazuje technikę” wchodzi do 1.1).
 * Każda rodzina o statusie `ready` ma wpis w TECHNIQUE z co najmniej jednym elementem, który faktycznie się rysuje dla co najmniej jednego ćwiczenia rodziny (element wybrany przez
 * wskazówki karty i reguły „ustalone” wariantu, niepuste kształty w co najmniej jednym rzucie i klatce). Bez listy wyjątków: nowa rodzina ze statusem `ready` bez nakładki czerwieni verify.
 */
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: ten test sprawdza rysowanie, nie recenzję rodziny */
import { CATALOG } from '@/lib/catalog.generated';
import { FAMILIES } from '@/lib/figures/v2/families';
import { figureSpec, overlayShapes, type FigureSpec } from '@/lib/figures/v2';
import { TECHNIQUE } from '@/lib/figures/v2/overlay';
import { techniquesOf } from '@/lib/figures/v2/ui';

const READY = FAMILIES.filter(f => f.status === 'ready').map(f => f.id);
const keysOf = (family: string) => Object.keys(CATALOG).filter(k => { try { return figureSpec(k)?.family === family; } catch { return false; } });
const US = [0, 0.25, 0.5, 0.75, 1];

describe('04.11.2026 bez zaworu: każda rodzina ready ma nakładkę, która się rysuje', () => {
  test('lista rodzin ready nie jest pusta (strażnik czyta FAMILIES)', () => { expect(READY.length).toBeGreaterThanOrEqual(7); });
  test.each(READY)('%s: wpis w TECHNIQUE z ≥ 1 elementem i ≥ 1 ćwiczenie, dla którego element daje kształty w którymś rzucie', family => {
    expect(Object.prototype.hasOwnProperty.call(TECHNIQUE, family)).toBe(true);
    expect(TECHNIQUE[family].length).toBeGreaterThan(0);
    const drawn: string[] = [];
    for (const k of keysOf(family)) {
      const ids = techniquesOf(k); if (!ids.length) continue; const s = figureSpec(k) as FigureSpec;
      if (s.views.some(v => US.some(u => overlayShapes(s, u, v, ids).length > 0))) drawn.push(k);
    }
    expect([family, drawn.length > 0]).toEqual([family, true]);
  });
});
