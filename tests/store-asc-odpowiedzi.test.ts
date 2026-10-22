/* Oczekiwane odpowiedzi App Store Connect (store/asc-odpowiedzi.json, M8 Formalności 21.10.2026): wartości, które wynikają z kodu, muszą się z nim zgadzać,
 * żeby formularz w sklepie nie rozjechał się z aplikacją; bez danych osobowych (repo publiczne — CLAUDE.md). */
import * as fs from 'fs';
import * as path from 'path';
import { PRODUCT_IDS } from '@/lib/products';

const read = (p: string) => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const asc = JSON.parse(read('store/asc-odpowiedzi.json'));
const appJson = JSON.parse(read('app.json')).expo;
const pkg = JSON.parse(read('package.json'));

describe('store/asc-odpowiedzi.json', () => {
  test('szyfrowanie = ITSAppUsesNonExemptEncryption z app.json', () => {
    expect(asc.encryption.usesNonExemptEncryption).toBe(appJson.ios.infoPlist.ITSAppUsesNonExemptEncryption);
  });
  test('„Data Not Collected” i brak śledzenia wymagają: brak SDK analityki/reklam/awarii w zależnościach i brak prośby o śledzenie', () => {
    expect(asc.appPrivacy).toMatchObject({ dataCollected: false, tracking: false });
    const deps = Object.keys(pkg.dependencies);
    expect(deps.filter(d => /analytics|sentry|crashlytics|firebase|amplitude|mixpanel|segment|bugsnag|admob|ads|tracking|facebook|appsflyer|adjust/i.test(d))).toEqual([]);
    expect(appJson.ios.infoPlist.NSUserTrackingUsageDescription).toBeUndefined();
  });
  test('brak ofert wprowadzających (M5 S1, R-M5-3); Family Sharing dla każdego produktu z PRODUCT_IDS', () => {
    expect(asc.introductoryOffers).toBe('none'); expect(asc.introductoryOfferDays).toBeUndefined();
    expect(Object.keys(asc.familySharing).sort()).toEqual(Object.keys(PRODUCT_IDS).sort());
  });
  test('pliki, do których odsyła, istnieją; bez konta → bez logowania dla recenzenta', () => {
    for (const f of [asc.appReview.notesFile, asc.urlsFile]) expect(fs.existsSync(path.join(__dirname, '..', f))).toBe(true);
    expect(asc.appReview.signInRequired).toBe(false);
  });
  test('ocena wieku 9+ tylko z tematów zdrowia i stylu życia; nic, co podnosi kategorię', () => {
    const a = asc.ageRating.odpowiedzi;
    expect(asc.ageRating.wynikOczekiwany).toBe('9+'); expect(a.healthOrWellnessTopics).toBe(true);
    const raising = Object.entries(a).filter(([k, v]) => k !== 'healthOrWellnessTopics' && v !== false && v !== 'NONE');
    expect(raising).toEqual([]);
  });
  test('bez danych osobowych: brak adresów e-mail i numerów telefonu', () => {
    const raw = read('store/asc-odpowiedzi.json');
    expect(raw).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/); expect(raw).not.toMatch(/\+?\d[\d ]{8,}\d/);
  });
});
