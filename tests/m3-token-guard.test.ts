/*
 * Redesign M3, partia p1 — strażnik tokenów (znalezisko 04-011, wymóg design-spec §11): wygląd tylko z tokenów (lib/tokens.ts przez lib/theme.ts).
 *  1. Liczbowe `fontSize` i `borderRadius` poza lib/theme.ts i lib/tokens.ts: LISTA WYJĄTKÓW Z POWODEM = tests/token-baseline.json. Powód: ekrany i część
 *     komponentów przechodzą na font(rola) i RADIUS w partiach p2–p5 (design-spec §10, kolumna „Partia”); p1 przeniosła komponenty wspólne i system.
 *     Zapadka: liczba w pliku nie może wzrosnąć (nowy literał = błąd), a gdy spadnie, trzeba obniżyć wpis (plik znika z listy przy 0) — lista tylko maleje.
 *  2. Dawne role kroju F.regular / F.semibold są krojem 'System' bez wagi — w kodzie aplikacji zastępuje je FW.* (waga z „Pogrubiony tekst”) albo font(rola).
 *  3. Żadnych nazw krojów IBM Plex w kodzie aplikacji.
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const walk = (d: string): string[] => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap(e => e.isDirectory() ? (e.name === 'locales' ? [] : walk(`${d}/${e.name}`)) : /\.tsx?$/.test(e.name) ? [`${d}/${e.name}`] : []);
const FILES = ['app', 'components', 'lib'].flatMap(walk).filter(f => !/^lib\/(theme|tokens)\.ts$/.test(f) && !/\.generated\./.test(f));
/** Bez komentarzy blokowych i liniowych (opisy mogą cytować stare wartości). */
const code = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\'"`])\/\/.*$/gm, '$1');
const count = (s: string, key: 'fontSize' | 'borderRadius') => (s.match(new RegExp(`\\b${key}:\\s*\\d`, 'g')) ?? []).length;

type Base = { _powod: string; pliki: Record<string, { fontSize?: number; borderRadius?: number }> };
const base = JSON.parse(fs.readFileSync(path.join(__dirname, 'token-baseline.json'), 'utf8')) as Base;

describe('liczbowe fontSize / borderRadius poza tokenami (lista wyjątków tylko maleje)', () => {
  test('lista ma powód, a każdy wpis wskazuje istniejący plik', () => {
    expect(base._powod).toMatch(/p2.*p5/);
    for (const f of Object.keys(base.pliki)) expect([f, fs.existsSync(path.join(ROOT, f))]).toEqual([f, true]);
  });
  test('żaden plik nie ma więcej literałów niż w wykazie (nowy literał = użyj font(rola) / RADIUS / SPACE z lib/theme.ts)', () => {
    const over: string[] = [];
    for (const f of FILES) { const c = code(f); for (const key of ['fontSize', 'borderRadius'] as const) { const n = count(c, key); const allowed = base.pliki[f]?.[key] ?? 0; if (n > allowed) over.push(`${f}: ${key} ${n} > ${allowed}`); } }
    expect(over).toEqual([]);
  });
  test('zapadka: gdy literałów ubyło, wykaz jest obniżony (albo plik usunięty z wykazu przy zerze)', () => {
    const stale: string[] = [];
    for (const [f, v] of Object.entries(base.pliki)) { const c = code(f); for (const key of ['fontSize', 'borderRadius'] as const) { const n = count(c, key); if (n < (v[key] ?? 0)) stale.push(`${f}: ${key} ${n} < ${v[key]}`); } }
    expect(stale).toEqual([]);
  });
  test('komponenty wspólne z p1 (design-spec §10) nie mają żadnych literałów', () => {
    for (const f of ['components/ui.tsx', 'components/CloseButton.tsx', 'components/DraftHeader.tsx', 'components/AddButton.tsx', 'components/InfoTip.tsx', 'components/Motif.tsx', 'components/EmptyBarArt.tsx',
      'components/WeekStacks.tsx', 'components/TabIcon.tsx', 'components/Icon.tsx', 'components/DeleteButton.tsx', 'components/HeaderActions.tsx']) {
      const c = code(f); expect([f, count(c, 'fontSize'), count(c, 'borderRadius')]).toEqual([f, 0, 0]);
    }
  });
});

/* 101-21 (1.0.1, decyzja właściciela D6 = B z 29.10.2026, PLAN-1-0-1): literały fontSize 12/14 i borderRadius 10/12/2 w Dashboard i GuardSection → tokeny o DOKŁADNIE dzisiejszych wartościach
 * (render bez zmian: tests/tokeny-odcisk.test.tsx, odcisk niezmieniony). Ujednolicenie ról (jeden rozmiar „podpisu”, jeden promień kafelka) — 1.1. */
describe('Dashboard i GuardSection: rozmiary i promienie z tokenów o dzisiejszych wartościach (101-21)', () => {
  const tk = require('../lib/theme');
  test('wartości tokenów = dzisiejsze literały', () => {
    expect(tk.TEXT_SIZE).toEqual({ small: 12, medium: 14 });
    expect(tk.RADIUS).toMatchObject({ group: 12, tile: 10, badge: 12, swatch: 2 });
  });
  test.each(['components/Dashboard.tsx', 'components/GuardSection.tsx'])('%s: żadnego literału fontSize 12/14 ani borderRadius 10/12/2', (f) => {
    const c = code(f);
    expect([f, c.match(/\bfontSize:\s*1[24]\b/g) ?? []]).toEqual([f, []]);
    expect([f, c.match(/\bborderRadius:\s*(10|12|2)\b/g) ?? []]).toEqual([f, []]);
  });
  test('komponenty używają tokenów (TEXT_SIZE, RADIUS)', () => {
    expect(code('components/Dashboard.tsx')).toMatch(/TEXT_SIZE\.small/); expect(code('components/Dashboard.tsx')).toMatch(/RADIUS\.tile/);
    expect(code('components/GuardSection.tsx')).toMatch(/TEXT_SIZE\.medium/); expect(code('components/GuardSection.tsx')).toMatch(/RADIUS\.swatch/);
  });
});

describe('krój: bez F.regular / F.semibold i bez IBM Plex w kodzie aplikacji', () => {
  test('F.regular i F.semibold tylko w lib/theme.ts (waga jest częścią stylu: FW.regular / FW.semibold albo font(rola))', () => {
    const found = FILES.filter(f => /\bF\.(regular|semibold)\b/.test(code(f)));
    expect(found).toEqual([]);
  });
  test('brak IBM Plex / @expo-google-fonts w kodzie aplikacji', () => {
    const found = FILES.filter(f => /IBMPlex|ibm-plex|expo-google-fonts/.test(code(f)));
    expect(found).toEqual([]);
  });
});
