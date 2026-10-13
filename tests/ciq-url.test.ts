/* Powrót z parowania zegarka (lib/watch/ciqUrl.ts + app/+native-intent.ts): adres z naszego schematu trafia na „Więcej”, inne bez zmian. */
import { isCiqReturnUrl, redirectCiqPath, CIQ_RETURN_ROUTE } from '@/lib/watch/ciqUrl';
import { CIQ_URL_SCHEME } from '@/lib/watch/ciqWire';
import { redirectSystemPath } from '@/app/+native-intent';

describe('isCiqReturnUrl', () => {
  test.each([
    [`${CIQ_URL_SCHEME}://device-selection-response?devices=abc`, true], [`${CIQ_URL_SCHEME.toUpperCase()}://x`, true], [`${CIQ_URL_SCHEME}:/x`, true],
    ['/device-select-resp?x=1', true], ['device-selection', true], ['/more/device-select', true],
    ['trening://plan', false], ['/plan', false], ['/more/settings', false], ['/exercise/abc', false], ['https://example.com/device', false], ['', false],
    [null, false], [undefined, false], [5, false],
  ])('%j -> %s', (u, want) => { expect(isCiqReturnUrl(u)).toBe(want); });
});

test('redirectCiqPath i redirectSystemPath: parowanie -> Więcej, reszta bez zmian', () => {
  expect(CIQ_RETURN_ROUTE).toBe('/(tabs)/more');
  expect(redirectCiqPath(`${CIQ_URL_SCHEME}://device-selection-response?d=1`)).toBe(CIQ_RETURN_ROUTE); expect(redirectCiqPath('/plan')).toBe('/plan');
  expect(redirectSystemPath({ path: `${CIQ_URL_SCHEME}://x`, initial: true })).toBe(CIQ_RETURN_ROUTE); expect(redirectSystemPath({ path: '/history', initial: false })).toBe('/history');
});
