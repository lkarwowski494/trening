/*
 * M1-audytor-generalny-045 (regresja od M1-037, reaudyt 28.10.2026; 10-wydanie-601): wiersz w Ustawieniach → „Subskrypcja” ma od 27.10.2026 tytuł zależny
 * od stanu („Zobacz plany Pro” bez planu, „Masz plan: …” z planem — components/SubscriptionCard.tsx), a notatki dla App Review (store/review-notes.md, kopia
 * w docs/48) i lista z telefonu (docs/49 T-11) dalej prowadziły do „Full version” / „Pełna wersja” i oczekiwały „Masz pełną wersję”.
 * Test: ścieżka zakupu w notatkach EN, PL i notatce subskrypcji kończy się bieżącą etykietą wiersza w stanie darmowym (z kodu i słownika EN);
 * kopia EN w docs/48 zgodna; docs/49 T-11 oczekuje tytułów z `ownedPlanTitle`. Nazwa grupy subskrypcji w App Store Connect („Full version”) zostaje (K1 a, 28.10.2026).
 */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const card = read('components/SubscriptionCard.tsx');
const FREE_PL = /: t\('([^']+)'\);\n/.exec(card.slice(card.indexOf('const title =')))![1];
const FREE_EN = (EN as Record<string, string>)[FREE_PL];
const OWNED_PL = [...card.matchAll(/t\('(Masz plan: [^']+)'\)/g)].map((m) => m[1]);
const notes = read('store/review-notes.md');

describe('M1-045: ścieżka zakupu w notatkach = bieżąca etykieta wiersza „Subskrypcja”', () => {
  test('etykieta stanu darmowego czytana z kodu', () => { expect(FREE_PL).toBe('Zobacz plany Pro'); expect(FREE_EN).toBe('See Pro plans'); expect(OWNED_PL).toHaveLength(3); });
  test('EN: „More > Settings, section "Subscription" > "<etykieta>"” i notatka subskrypcji „… > Subscription > <etykieta>”', () => {
    expect(notes).toContain(`More > Settings, section "Subscription" > "${FREE_EN}"`);
    expect(notes).toContain(`More > Settings > Subscription > ${FREE_EN}`);
    expect(notes).not.toMatch(/Subscription"? > "?Full version/);
  });
  test('PL: „Więcej → Ustawienia, sekcja „Subskrypcja” → „<etykieta>”', () => {
    expect(notes).toContain(`Więcej → Ustawienia, sekcja „Subskrypcja” → „${FREE_PL}”`);
    expect(notes).not.toMatch(/„Subskrypcja” → „Pełna wersja”/);
  });
  test('kopia EN w docs/48 ma tę samą ścieżkę', () => {
    const d48 = read('docs/48-zgloszenie-1-0.md');
    expect(d48).toContain(`More > Settings, section "Subscription" > "${FREE_EN}"`);
    expect(d48).not.toMatch(/Subscription"? > "?Full version/);
  });
  test('docs/49 T-11: po zakupie tytuły z ownedPlanTitle, bez zakupu „Zobacz plany Pro”, bez „Masz pełną wersję”', () => {
    const t11 = read('docs/49-testflight-1-0.md').split('\n').find((l) => l.includes('**T-11')) ?? '';
    for (const o of OWNED_PL) expect(t11).toContain(o);
    expect(t11).toContain(`→ „${FREE_PL}”`);
    expect(t11).not.toMatch(/Masz pełną wersję|→ „Pełna wersja”/);
  });
});
