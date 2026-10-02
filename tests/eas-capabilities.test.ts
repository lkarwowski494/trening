/* Uprawnienia Apple włączane przez scripts/eas/asc-capabilities.cjs (obejście expo/eas-cli#3986, 02.10.2026). */
import crypto from 'crypto';
import { execFileSync } from 'child_process';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cap = require('../scripts/eas/asc-capabilities.cjs');

jest.setTimeout(60000);

test('JWT dla App Store Connect: ES256 w formacie JOSE (r‖s, 64 B), weryfikowalny kluczem publicznym, ważny 15 min', () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString();
  const tok: string = cap.jwt({ keyPem: pem, keyId: 'KID', issuer: 'ISS', now: 1000 });
  const [h, b, s] = tok.split('.');
  expect(JSON.parse(Buffer.from(h, 'base64url').toString())).toEqual({ alg: 'ES256', kid: 'KID', typ: 'JWT' });
  expect(JSON.parse(Buffer.from(b, 'base64url').toString())).toEqual({ iss: 'ISS', iat: 1000, exp: 1900, aud: 'appstoreconnect-v1' });
  const sig = Buffer.from(s, 'base64url'); expect(sig).toHaveLength(64);
  expect(crypto.verify('sha256', Buffer.from(`${h}.${b}`), { key: publicKey, dsaEncoding: 'ieee-p1363' }, sig)).toBe(true);
});

test('mapowanie uprawnień: HealthKit → HEALTHKIT, części HealthKit bez osobnej pozycji, nieznane = błąd', () => {
  expect(cap.capabilitiesFor({ 'com.apple.developer.healthkit': true, 'com.apple.developer.healthkit.access': [] })).toEqual(['HEALTHKIT']);
  expect(cap.capabilitiesFor(undefined)).toEqual([]);
  expect(() => cap.capabilitiesFor({ 'com.apple.developer.nfc.readersession.formats': ['TAG'] })).toThrow(/Nieznane uprawnienie/);
});

test('dzisiejsza konfiguracja aplikacji: aplikacja potrzebuje tylko HealthKit, widżet niczego (push usunięty pluginem)', () => {
  const cfg = JSON.parse(execFileSync('npx', ['expo', 'config', '--type', 'introspect', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  expect(cap.wantedFromConfig(cfg)).toEqual({ 'pl.lukasz.trening': ['HEALTHKIT'], 'pl.lukasz.trening.restwidget': [] });
});
