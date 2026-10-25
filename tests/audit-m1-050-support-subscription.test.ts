/*
 * M1-050 (DEC-07 K4, 23.10.2026): strona wsparcia (PL/EN) odpowiada na pytania o subskrypcję zgodnie z modelem M5 S1 (docs/monetyzacja.md):
 * limit dni = PAYWALL.FREE_TRAINING_DAYS_PER_MONTH, brak okresu próbnego, plany miesięczny/roczny/dożywotni, anulowanie w ustawieniach Apple,
 * przywrócenie zakupów, dane zawsze dostępne, Chmura rodzinna. Etykiety w aplikacji = słownik (lib/i18n.en.ts). Bez kwot na stronie.
 */
import * as fs from 'fs';
import * as path from 'path';
import { PAYWALL } from '@/lib/access';

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'site/support.html'), 'utf8').replace(/<!--[\s\S]*?-->/g, '');
const pl = html.slice(html.indexOf('<section lang="pl"'), html.indexOf('<section lang="en"'));
const en = html.slice(html.indexOf('<section lang="en"'));
const dict = fs.readFileSync(path.join(root, 'lib/i18n.en.ts'), 'utf8');
const money = fs.readFileSync(path.join(root, 'docs/monetyzacja.md'), 'utf8');
const n = PAYWALL.FREE_TRAINING_DAYS_PER_MONTH;

describe('site/support.html: pytania o subskrypcję (M1-050)', () => {
  test('model w docs/monetyzacja.md = stała w kodzie i brak okresu próbnego', () => {
    expect(money).toContain(`**${n} dni treningowych** w miesiącu`);
    expect(money).toContain('Bez okresu próbnego');
  });
  test.each([
    ['PL', pl, ['Co jest za darmo, a co daje Pro?', 'Jak kupić albo sprawdzić swój plan?', 'Jak anulować subskrypcję?', 'Jak przywrócić zakup na nowym telefonie?', 'Co z moimi danymi, gdy subskrypcja wygaśnie?', 'Czy mogę dzielić zakup z rodziną?']],
    ['EN', en, ['What is free, and what does Pro add?', 'How do I buy or check my plan?', 'How do I cancel my subscription?', 'How do I restore my purchase on a new phone?', 'What happens to my data when the subscription ends?', 'Can I share the purchase with my family?']],
  ])('%s: wszystkie pytania są nagłówkami', (_l, sec, qs) => {
    for (const q of qs) expect(sec).toContain(`<h3>${q}</h3>`);
  });
  test('limit dni w obu językach = stała; brak okresu próbnego; plany', () => {
    expect(pl).toContain(`Za darmo do ${n} dni treningowych w miesiącu`);
    expect(pl).toContain('Nie ma okresu próbnego');
    expect(pl).toMatch(/miesięczna, roczna albo dostęp dożywotni/);
    expect(en).toContain(`Free for up to ${n} training days a month`);
    expect(en).toContain('There is no free trial');
    expect(en).toMatch(/monthly or yearly subscription, or lifetime access/);
    expect([...html.matchAll(/(\d+) (?:dni treningowych|training days)/g)].map((m) => Number(m[1])).filter((x) => x !== n)).toEqual([]);
  });
  test('etykiety przycisków z odpowiedzi istnieją w aplikacji (PL = klucz słownika, EN = przekład)', () => {
    for (const [plLabel, enLabel] of [['Pełna wersja', 'Full version'], ['Zarządzaj subskrypcją', 'Manage subscription'], ['Przywróć zakupy', 'Restore purchases']]) {
      expect(dict).toContain(`'${plLabel}': '${enLabel}'`);
      expect(pl).toContain(plLabel);
      expect(en).toContain(enLabel);
    }
  });
  test('ścieżka do ekranu zakupu = karta w Ustawieniach (components/SubscriptionCard.tsx, tytuł „Pełna wersja”)', () => {
    expect(fs.readFileSync(path.join(root, 'components/SubscriptionCard.tsx'), 'utf8')).toContain("t('Pełna wersja')");
    expect(pl).toContain('Więcej → Ustawienia → Pełna wersja');
    expect(en).toContain('More → Settings → Full version');
  });
  test('anulowanie w ustawieniach Apple, zwroty u Apple; dane zawsze dostępne; Chmura rodzinna', () => {
    expect(pl).toMatch(/anulujesz w ustawieniach konta Apple/);
    expect(en).toMatch(/cancel it in your Apple account settings/);
    expect(pl).toMatch(/historia, edycja, dopisywanie treningów wstecz, kopia zapasowa i eksport działają zawsze/);
    expect(en).toMatch(/history, editing, adding past workouts, backup and export always work/);
    expect(money).toMatch(/Chmura rodzinna \(Family Sharing\):\*\* TAK/);
    expect(pl).toContain('Chmurę rodzinną');
    expect(en).toContain('Family Sharing');
  });
  test('bez kwot na stronie wsparcia', () => {
    expect(html).not.toMatch(/\d+[,.]\d{2}\s*(?:USD|zł|€|£|\$)|[$€£]\s*\d/);
  });
});
