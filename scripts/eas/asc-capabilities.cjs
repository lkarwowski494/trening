#!/usr/bin/env node
/*
 * Włącza uprawnienia (capabilities) identyfikatorów aplikacji bezpośrednio przez App Store Connect API.
 *
 * Po co: eas-cli 24.8.0 synchronizuje je żądaniem PATCH, którego kształt Apple dziś odrzuca
 * („Unexpected or invalid value at 'data.relationships.bundleIdCapabilities.data.[0].attributes'”,
 * expo/eas-cli#3986, otwarte). Obejście z tego zgłoszenia: POST /v1/bundleIdCapabilities, a w EAS
 * EXPO_NO_CAPABILITY_SYNC=1. Skrypt jest idempotentny — dodaje tylko brakujące, niczego nie wyłącza.
 *
 * Jedno źródło prawdy: uprawnienia (entitlements) z wyliczonej konfiguracji Expo (`expo config --type introspect`),
 * tej samej, z której korzysta EAS. Nieznane uprawnienie = błąd (lepiej przerwać niż podpisać aplikację bez niego).
 *
 * Wymaga: EXPO_ASC_API_KEY_PATH, EXPO_ASC_KEY_ID, EXPO_ASC_ISSUER_ID. Klucz nie opuszcza procesu.
 */
const crypto = require('crypto');
const fs = require('fs');
const { execFileSync } = require('child_process');

// Uprawnienie w pliku .entitlements → typ capability w App Store Connect API (BundleIdCapability.capabilityType).
// Bez wpisu = nie wymaga włączania w portalu (np. Live Activities) — takie klucze trzeba dopisać świadomie do NO_CAPABILITY.
const CAPABILITY_OF = {
  'com.apple.developer.healthkit': 'HEALTHKIT',
  'com.apple.developer.healthkit.access': null, // część HealthKit
  'com.apple.developer.healthkit.background-delivery': null, // część HealthKit
  'aps-environment': 'PUSH_NOTIFICATIONS',
  'com.apple.security.application-groups': 'APP_GROUPS',
  'com.apple.developer.associated-domains': 'ASSOCIATED_DOMAINS',
  'com.apple.developer.applesignin': 'APPLE_ID_AUTH',
};

function capabilitiesFor(entitlements = {}) {
  const out = new Set();
  for (const k of Object.keys(entitlements)) {
    if (!(k in CAPABILITY_OF)) throw new Error(`Nieznane uprawnienie „${k}” — dopisz je do CAPABILITY_OF w scripts/eas/asc-capabilities.cjs`);
    if (CAPABILITY_OF[k]) out.add(CAPABILITY_OF[k]);
  }
  return [...out].sort();
}

function wantedFromConfig(cfg) {
  const want = { [cfg.ios.bundleIdentifier]: capabilitiesFor(cfg.ios.entitlements) };
  for (const ext of cfg.extra?.eas?.build?.experimental?.ios?.appExtensions ?? []) want[ext.bundleIdentifier] = capabilitiesFor(ext.entitlements);
  return want;
}

function jwt({ keyPem, keyId, issuer, now = Math.floor(Date.now() / 1000) }) {
  const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
  const head = b64({ alg: 'ES256', kid: keyId, typ: 'JWT' });
  const body = b64({ iss: issuer, iat: now, exp: now + 15 * 60, aud: 'appstoreconnect-v1' });
  const sig = crypto.sign('sha256', Buffer.from(`${head}.${body}`), { key: keyPem, dsaEncoding: 'ieee-p1363' });
  return `${head}.${body}.${sig.toString('base64url')}`;
}

async function api(token, method, path, body) {
  const r = await fetch(`https://api.appstoreconnect.apple.com${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  if (!r.ok) throw new Error(`${method} ${path.split('?')[0]} → HTTP ${r.status}: ${text.slice(0, 600)}`);
  return text ? JSON.parse(text) : {};
}

async function main() {
  const cfg = JSON.parse(execFileSync('npx', ['expo', 'config', '--type', 'introspect', '--json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }));
  const wanted = wantedFromConfig(cfg);
  const keyPem = fs.readFileSync(process.env.EXPO_ASC_API_KEY_PATH, 'utf8');
  const token = jwt({ keyPem, keyId: process.env.EXPO_ASC_KEY_ID, issuer: process.env.EXPO_ASC_ISSUER_ID });
  for (const [identifier, caps] of Object.entries(wanted)) {
    const res = await api(token, 'GET', `/v1/bundleIds?filter[identifier]=${encodeURIComponent(identifier)}&include=bundleIdCapabilities&limit=10`);
    const bundle = (res.data || []).find(b => b.attributes.identifier === identifier);
    if (!bundle) { console.log(`• ${identifier}: jeszcze nie zarejestrowany (EAS go utworzy; uruchom ponownie po nim) — pomijam`); continue; }
    const ids = new Set((bundle.relationships?.bundleIdCapabilities?.data || []).map(x => x.id));
    const have = new Set((res.included || []).filter(x => x.type === 'bundleIdCapabilities' && ids.has(x.id)).map(x => x.attributes.capabilityType));
    const missing = caps.filter(c => !have.has(c));
    for (const c of missing) {
      await api(token, 'POST', '/v1/bundleIdCapabilities', {
        data: { type: 'bundleIdCapabilities', attributes: { capabilityType: c }, relationships: { bundleId: { data: { type: 'bundleIds', id: bundle.id } } } },
      });
    }
    console.log(`✔ ${identifier}: potrzebne ${caps.join(', ') || '—'}${missing.length ? `; dodano ${missing.join(', ')}` : '; nic do dodania'}; w portalu: ${[...new Set([...have, ...missing])].join(', ') || '—'}`);
  }
}

if (require.main === module) main().catch(e => { console.error(`::error::${e.message}`); process.exit(1); });
module.exports = { CAPABILITY_OF, capabilitiesFor, wantedFromConfig, jwt };
