/*
 * M1-audytor-generalny-052 (11-wzrost-002): strona produktu (site/index.html, GitHub Pages) nie mówiła, że aplikacja jest płatna powyżej
 * darmowego limitu dni treningowych. Test: PL i EN wymieniają darmowy limit (liczba = PAYWALL.FREE_TRAINING_DAYS_PER_MONTH, ta sama co w
 * docs/monetyzacja.md) i Pro; bez kwot (ceny tylko w App Store i w docs/monetyzacja.md).
 */
import * as fs from 'fs';
import * as path from 'path';
import { PAYWALL } from '@/lib/access';

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'site/index.html'), 'utf8');
const body = html.replace(/<!--[\s\S]*?-->/g, '');
const pl = body.slice(body.indexOf('<section lang="pl"'), body.indexOf('<section lang="en"'));
const en = body.slice(body.indexOf('<section lang="en"'));
const n = PAYWALL.FREE_TRAINING_DAYS_PER_MONTH;

describe('site/index.html: darmowy limit i Pro jawne (M1-052)', () => {
  test('liczba dni w docs/monetyzacja.md = stała w kodzie', () => {
    expect(fs.readFileSync(path.join(root, 'docs/monetyzacja.md'), 'utf8')).toContain(`**${n} dni treningowych** w miesiącu`);
  });
  test('PL: „Za darmo do N dni treningowych w miesiącu” i Pro bez limitu (subskrypcja albo dostęp dożywotni)', () => {
    expect(pl).toContain(`Za darmo do ${n} dni treningowych w miesiącu`);
    expect(pl).toMatch(/Pro bez limitu \(subskrypcja albo dostęp dożywotni\)/);
  });
  test('EN: „Free for up to N training days a month” i Pro without the limit (subscription or lifetime access)', () => {
    expect(en).toContain(`Free for up to ${n} training days a month`);
    expect(en).toMatch(/Pro removes the limit \(subscription or lifetime access\)/);
  });
  test('żadna inna liczba dni treningowych i żadne kwoty na stronie', () => {
    expect([...body.matchAll(/(\d+) (?:dni treningowych|training days)/g)].map((m) => Number(m[1])).filter((x) => x !== n)).toEqual([]);
    expect(body).not.toMatch(/\d+[,.]\d{2}\s*(?:USD|zł|€|£|\$)|[$€£]\s*\d/);
  });
});
