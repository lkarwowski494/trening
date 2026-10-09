/* Trasy aplikacji generowane z plików app/ (jak EKRAN w scripts/test-matrix.mjs) — wspólne dla przeglądu dostępności (matrix-a11y) i macierzy
 * języków na wszystkich ekranach (matrix-dim-langs-routes). Audyt 0.10 M3 (A11-10 / TST-03): nowa trasa bez przeglądu nie przejdzie. */
import { readdirSync, statSync } from 'fs';
import { join, relative, sep } from 'path';

export type AppRoute = { file: string; stem: string; re: RegExp };
/** Każdy plik ekranu w app/ (bez _layout, _sitemap, +not-found): trasa i wzorzec ([id] → dowolny segment, dopuszczalne zapytanie ?…). */
export function appRoutes(): AppRoute[] {
  const root = join(__dirname, '..', 'app'); const out: AppRoute[] = [];
  const walk = (d: string) => { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (/\.tsx$/.test(f)) {
    const r = relative(root, p).split(sep).join('/').replace(/\.tsx$/, ''); if (/(^|\/)(_layout|_sitemap|\+not-found)$/.test(r)) continue;
    const route = '/' + r.replace(/\(tabs\)\/?/, '').replace(/(^|\/)index$/, ''); const stem = route.replace(/\/+$/, '') || '/';
    out.push({ file: 'app/' + r + '.tsx', stem, re: new RegExp('^' + stem.replace(/[.*+?^${}()|\\]/g, '\\$&').replace(/\[\w+\]/g, '[^/?]+') + '(\\?.*)?$') }); } } };
  walk(root); return out.sort((a, b) => a.stem.localeCompare(b.stem));
}
/** Trasy z listy, które nie odpowiadają żadnemu ekranowi, i ekrany bez trasy na liście. */
export function routeGaps(routes: readonly string[]): { missing: string[]; unknown: string[] } {
  const app = appRoutes();
  return { missing: app.filter(a => !routes.some(r => a.re.test(r))).map(a => a.file), unknown: routes.filter(r => !app.some(a => a.re.test(r))) };
}
