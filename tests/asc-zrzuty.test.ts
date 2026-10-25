/*
 * Wgranie zrzutów ekranu do App Store Connect (decyzja właściciela 25.10.2026, D2 w docs/48): scripts/asc/zrzuty.mjs i workflow asc-zrzuty.yml.
 * Bez sieci: skrypt (ESM) działa w procesie potomnym na atrapie serwera API (fetch podstawiony, także dla adresów wgrywania); zrzuty to wygenerowane pliki PNG
 * w katalogu tymczasowym. Interfejs: App Asset Library (docs Apple, odczyt 25.10.2026) — rezerwacja obrazu, PUT, `uploaded: true`, placement, kolejność.
 */
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execFileSync } from 'child_process';
import { LANGS } from '@/lib/i18n';

const root = join(__dirname, '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8');
const wf = read('.github/workflows/asc-zrzuty.yml');
const SCRIPT = read('scripts/asc/zrzuty.mjs');

/** Minimalny PNG: podpis + IHDR (wymiary, typ koloru); reszta nieistotna dla skryptu (czyta tylko nagłówek). */
function png(w: number, h: number, colorType = 2, pad = 40): Buffer {
  const b = Buffer.alloc(33 + pad); Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0);
  b.writeUInt32BE(13, 8); b.write('IHDR', 12); b.writeUInt32BE(w, 16); b.writeUInt32BE(h, 20); b[24] = 8; b[25] = colorType; return b;
}
const IPHONE = [1320, 2868] as const; const WATCH = [416, 496] as const;
const tmp: string[] = [];
function shots(spec: Record<string, Record<string, [number, number, number?]>>): string {
  const dir = mkdtempSync(join(tmpdir(), 'zrz-')); tmp.push(dir);
  for (const [lang, files] of Object.entries(spec)) { mkdirSync(join(dir, lang)); for (const [name, [w, h, ct]] of Object.entries(files)) writeFileSync(join(dir, lang, name), png(w, h, ct ?? 2)); }
  return dir;
}
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });

const DRIVER = `
import * as Z from ${JSON.stringify(join(root, 'scripts/asc/zrzuty.mjs'))};
import { makeClient } from ${JSON.stringify(join(root, 'scripts/asc/iap-localizations.mjs'))};
const sc = JSON.parse(process.argv[1]);
const refData = {
  imageSpecs: [
    { specId: 'S-IPHONE', alphaAllowed: false, compatiblePlacementTypes: ['APP_SCREENSHOT'], dimensions: { minWidth: 1320, maxWidth: 1320, minHeight: 2868, maxHeight: 2868 } },
    { specId: 'S-WATCH', alphaAllowed: false, compatiblePlacementTypes: ['APP_SCREENSHOT'], dimensions: { minWidth: 416, maxWidth: 416, minHeight: 496, maxHeight: 496 } },
    { specId: 'S-DUP', alphaAllowed: false, compatiblePlacementTypes: ['APP_SCREENSHOT'], dimensions: { minWidth: 100, maxWidth: 100, minHeight: 100, maxHeight: 100 } },
  ],
  placementTypes: [{ placementTypeId: 'APP_SCREENSHOT', specMappings: [
    { placementGroupId: 'G-IPHONE', specs: ['S-IPHONE'] }, { placementGroupId: 'G-WATCH', specs: ['S-WATCH'] },
    { placementGroupId: 'G-DUP-A', specs: ['S-DUP'] }, { placementGroupId: 'G-DUP-B', specs: ['S-DUP'] } ] }],
  features: sc.noLimits ? [] : [{ featureId: 'APP_STORE_VERSIONS', placementPolicies: [{ placementTypeId: 'APP_SCREENSHOT', groupLimits: [{ groupIds: ['G-IPHONE'], maxCount: sc.limit ?? 10 }] }] }],
};
const calls = []; const puts = []; let n = 0; const orders = []; const placements = [];
const resp = (status, body) => ({ ok: status < 400, status, json: async () => body });
const fakeFetch = async (url, init = {}) => {
  const m = init.method || 'GET'; const u = new URL(url);
  if (u.hostname === 'blob.test') { puts.push(u.pathname + ' ' + init.body.length); return resp(sc.putFails ? 500 : 200, {}); }
  const p = u.pathname; calls.push(m + ' ' + p);
  if (m === 'GET') {
    if (p === '/v1/apps') return resp(200, { data: [{ id: '777', attributes: {} }] });
    if (p === '/v1/apps/777/appStoreVersions') return resp(200, { data: (sc.versions ?? []).map((s, i) => ({ id: 'V' + i, attributes: { appStoreState: s } })) });
    if (p === '/v1/appStoreVersions/V0/appStoreVersionLocalizations') return resp(200, { data: (sc.locales ?? []).map(l => ({ id: 'L-' + l, attributes: { locale: l } })) });
    if (p === '/v1/apps/777/assetLibrary') return resp(200, { data: { id: 'LIB' } });
    if (p === '/v1/appAssetLibraryRefData') return resp(200, { data: [{ attributes: refData }] });
    let mm = /^\\/v1\\/appStoreVersionLocalizations\\/L-(.+)\\/placements$/.exec(p);
    if (mm) { const have = (sc.existing ?? {})[mm[1] + ':' + u.searchParams.get('filter[placementGroup]')] ?? 0; return resp(200, { data: Array.from({ length: have }, (_, i) => ({ id: 'P' + i })) }); }
    mm = /^\\/v1\\/appAssetLibraryImages\\/(IMG\\d+)$/.exec(p);
    if (mm) return resp(200, { data: { id: mm[1], attributes: { state: sc.processing === 'FAILED' ? 'FAILED' : 'PREPARE_FOR_SUBMISSION', stateDetails: 'SECRET-DETAIL' } } });
    return resp(404, { errors: [] });
  }
  const body = JSON.parse(init.body);
  if (m === 'POST' && p === '/v1/appAssetLibraryImages') {
    const id = 'IMG' + (++n); const size = body.data.attributes.fileSize;
    return resp(201, { data: { id, attributes: { uploadOperations: [{ method: 'PUT', url: 'https://blob.test/up/' + id, length: size, offset: 0, requestHeaders: [{ name: 'Content-Type', value: 'image/png' }] }] } } });
  }
  if (m === 'PATCH') return resp(200, { data: {} });
  if (m === 'POST' && p === '/v1/appAssetLibraryPlacements') { const id = 'PL' + (placements.length + 1); placements.push({ id, ...body.data }); return resp(201, { data: { id } }); }
  if (m === 'POST' && p === '/v1/appAssetLibraryPlacementOrderingRequests') { orders.push(body.data); return resp(201, { data: { id: 'O' } }); }
  return resp(405, {});
};
const out = {}; const logs = [];
if (sc.mode === 'unit') {
  out.shotLocales = Z.SHOT_LOCALES; out.localeMap = (await import(${JSON.stringify(join(root, 'scripts/asc/metadane.mjs'))})).LOCALE_MAP;
  out.groups = { iphone: Z.groupsFor({ refData, width: 1320, height: 2868 }), watch: Z.groupsFor({ refData, width: 416, height: 496 }), dup: Z.groupsFor({ refData, width: 100, height: 100 }), none: Z.groupsFor({ refData, width: 5, height: 5 }) };
  out.limits = { iphone: Z.maxPerGroup(refData, 'G-IPHONE'), other: Z.maxPerGroup(refData, 'G-WATCH'), none: Z.maxPerGroup({}, 'x') };
  out.png = Z.pngInfo(Buffer.from(sc.png, 'base64')); let bad = ''; try { Z.pngInfo(Buffer.from('GIF89a-------------------------------')); } catch (e) { bad = e.message; } out.bad = bad;
  let t = false; try { await makeClient({ fetchFn: fakeFetch, token: 't' }).call('DELETE', '/v1/appAssetLibraryImages/x'); } catch (e) { t = true; } out.deleteThrows = t;
} else {
  const sh = {}; const problems = [];
  const a = Z.readShots(sc.iphone); sh.iphone = a.shots; problems.push(...a.problems);
  if (sc.zegarek) { const b = Z.readShots(sc.zegarek); sh.zegarek = b.shots; problems.push(...b.problems); }
  const r = await Z.run({ client: makeClient({ fetchFn: fakeFetch, token: 't', sleep: async () => {} }), fetchFn: fakeFetch, shots: sh, problems, apply: sc.apply, log: l => logs.push(l), sleep: async () => {} });
  out.code = r.code; out.calls = calls; out.puts = puts; out.logs = logs.join('\\n'); out.placements = placements; out.orders = orders;
}
process.stdout.write(JSON.stringify(out));
`;
type Sc = { mode?: string; apply?: boolean; iphone?: string; zegarek?: string; versions?: string[]; locales?: string[]; existing?: Record<string, number>; limit?: number; noLimits?: boolean; putFails?: boolean; processing?: string; png?: string };
const drive = (sc: Sc) => JSON.parse(execFileSync('node', ['--input-type=module', '-e', DRIVER, JSON.stringify(sc)], { encoding: 'utf8', maxBuffer: 50e6 })) as Record<string, any>;
const writes = (calls: string[]) => calls.filter(c => !c.startsWith('GET'));
const EDIT = ['PREPARE_FOR_SUBMISSION'];

describe('mapowanie języków aplikacji na lokalizacje sklepu i narzędzia pomocnicze', () => {
  const u = () => drive({ mode: 'unit', png: png(1320, 2868, 6).toString('base64') });
  test('każdy z 35 języków aplikacji ma wpis; cele istnieją w LOCALE_MAP; każda obsługiwana lokalizacja sklepu dostaje zrzuty z jakiegoś języka', () => {
    const r = u(); const sl = r.shotLocales as Record<string, string[]>; const map = r.localeMap as Record<string, string | null>;
    expect(Object.keys(sl).sort()).toEqual([...LANGS].sort());
    const targets = Object.values(sl).flat();
    for (const t of targets) expect([t, map[t]]).toEqual([t, expect.any(String)]);
    expect(new Set(targets).size).toBe(targets.length);
    expect(Object.entries(map).filter(([, v]) => v).map(([k]) => k).sort()).toEqual([...targets].sort());
  });
  test('języki bez lokalizacji w sklepie (bg, et, lt, lv, sl, sr) nie mają celu; angielski obsługuje cztery lokalizacje; nb to no, es-419 to es-MX', () => {
    const sl = u().shotLocales as Record<string, string[]>;
    for (const l of ['bg', 'et', 'lt', 'lv', 'sl', 'sr']) expect([l, sl[l]]).toEqual([l, []]);
    expect(sl.en).toEqual(['en-US', 'en-GB', 'en-AU', 'en-CA']); expect(sl.nb).toEqual(['no']); expect(sl['es-419']).toEqual(['es-MX']);
  });
  test('nagłówek PNG: wymiary i alfa; inny format odrzucony; grupa urządzeń z wymiarów (jedna, brak, niejednoznaczna); limity z danych albo 10', () => {
    const r = u();
    expect(r.png).toEqual({ width: 1320, height: 2868, alpha: true });
    expect(r.bad).toBe('to nie jest plik PNG');
    expect(r.groups).toEqual({ iphone: ['G-IPHONE'], watch: ['G-WATCH'], dup: ['G-DUP-A', 'G-DUP-B'], none: [] });
    expect(r.limits).toEqual({ iphone: 10, other: 10, none: 10 });
  });
  test('klient nie wykonuje DELETE; w skrypcie nie ma wpisanych identyfikatorów grup urządzeń ani wywołania usuwania', () => {
    expect(u().deleteThrows).toBe(true);
    expect(SCRIPT).not.toMatch(/'DELETE'|"DELETE"|\.delete\(/); expect(SCRIPT).not.toMatch(/IPHONE_[A-Z_]+PROFILE|WATCH_[A-Z_]*PROFILE|MAC_PROFILE/);
    expect(SCRIPT).toContain('Don’t hard-code them');
  });
});

describe('dry-run na atrapie API', () => {
  test('tylko GET; tabela z lokalizacjami; angielski na 4 lokalizacje; sl/bg pominięte; kod 0; zero zapisów i zero PUT', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE], '02-b.png': [...IPHONE] }, en: { '01-a.png': [...IPHONE] }, bg: { '01-a.png': [...IPHONE] } });
    const r = drive({ iphone: dir, versions: EDIT, locales: ['pl', 'en-US', 'en-GB', 'en-AU', 'en-CA'] });
    expect(r.code).toBe(0); expect(writes(r.calls)).toEqual([]); expect(r.puts).toEqual([]);
    const L = r.logs as string;
    expect(L).toContain('DRY-RUN (tylko odczyt)'); expect(L).toContain('| Źródło | Język | Lokalizacja | Grupa urządzeń | Zrzuty | Działanie |');
    expect(L).toContain('| iphone | pl | pl | G-IPHONE | 2 | wgraj |');
    for (const l of ['en-US', 'en-GB', 'en-AU', 'en-CA']) expect(L).toContain(`| iphone | en | ${l} | G-IPHONE | 1 | wgraj |`);
    expect(L).toContain('| iphone | bg | — | — | 0 | pomiń — sklep nie ma tej lokalizacji'); expect(L).toContain('wgraj 5, pomiń 1');
    expect(L).toContain('Dry-run zakończony — nic nie zapisano');
  });
  test('zegarek: osobna grupa z wymiarów 416 × 496', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE] } }); const w = shots({ pl: { 'a.png': [...WATCH] } });
    const r = drive({ iphone: dir, zegarek: w, versions: EDIT, locales: ['pl'] });
    expect(r.logs).toContain('| zegarek | pl | pl | G-WATCH | 1 | wgraj |');
  });
  test('grupa, która ma już zrzuty, i lokalizacja bez wersji w ASC są pomijane z powodem; nic nie jest usuwane', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE] }, de: { '01-a.png': [...IPHONE] } });
    const r = drive({ iphone: dir, versions: EDIT, locales: ['pl'], existing: { 'pl:G-IPHONE': 3 } });
    expect(r.logs).toContain('pomiń — grupa ma już 3 zrzutów (nic nie usuwam)'); expect(r.logs).toContain('pomiń — brak lokalizacji wersji w ASC');
    expect(writes(r.calls)).toEqual([]);
  });
  test('błędy planu: kanał alfa, nieznane wymiary, nieznany język, za dużo zrzutów w grupie — kod 1 (dry-run też to pokazuje)', () => {
    const dir = shots({ pl: { '01-a.png': [1320, 2868, 6], '02-b.png': [10, 10] }, xx: { '01-a.png': [...IPHONE] } });
    const r = drive({ iphone: dir, versions: EDIT, locales: ['pl'] });
    expect(r.code).toBe(1); const L = r.logs as string;
    expect(L).toContain('pl/01-a.png: kanał alfa'); expect(L).toContain('pl/02-b.png: 10×10 — brak pasującej specyfikacji'); expect(L).toContain('xx: nieznany język aplikacji');
    const many = shots({ pl: { '01.png': [...IPHONE], '02.png': [...IPHONE], '03.png': [...IPHONE] } });
    const r2 = drive({ iphone: many, versions: EDIT, locales: ['pl'], limit: 2 });
    expect(r2.code).toBe(1); expect(r2.logs).toContain('3 zrzutów w grupie G-IPHONE > limit 2');
  });
  test('brak edytowalnej wersji: dry-run kod 0 z komunikatem, apply kod 1 bez zapisów', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE] } });
    const d = drive({ iphone: dir, versions: ['READY_FOR_SALE'], locales: ['pl'] });
    expect(d.code).toBe(0); expect(d.logs).toContain('Brak edytowalnej wersji');
    const a = drive({ iphone: dir, versions: ['READY_FOR_SALE'], locales: ['pl'], apply: true });
    expect(a.code).toBe(1); expect(writes(a.calls)).toEqual([]);
  });
  test('brak katalogu ze zrzutami to błąd pliku (kod 1)', () => {
    const r = drive({ iphone: join(tmpdir(), 'nie-ma-takiego-katalogu-zrz'), versions: EDIT, locales: ['pl'] });
    expect(r.code).toBe(1); expect(r.logs).toContain('BŁĄD pliku: brak katalogu');
  });
});

describe('apply na atrapie API', () => {
  test('obraz wgrywany raz na plik (angielski dla 4 lokalizacji), placementy w kolejności plików, jedno żądanie kolejności na lokalizację i grupę; bez DELETE', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE], '02-b.png': [...IPHONE] }, en: { '01-a.png': [...IPHONE], '02-b.png': [...IPHONE] } });
    const r = drive({ iphone: dir, versions: EDIT, locales: ['pl', 'en-US', 'en-GB', 'en-AU', 'en-CA'], apply: true });
    expect(r.code).toBe(0); const calls = r.calls as string[];
    expect(calls.filter(c => c === 'POST /v1/appAssetLibraryImages')).toHaveLength(4); /* 2 pliki pl + 2 pliki en, nie 2 + 8 */
    expect(r.puts).toHaveLength(4); expect(calls.filter(c => c.startsWith('PATCH /v1/appAssetLibraryImages/'))).toHaveLength(4);
    expect(calls.filter(c => c === 'POST /v1/appAssetLibraryPlacements')).toHaveLength(2 + 8);
    expect(calls.filter(c => c === 'POST /v1/appAssetLibraryPlacementOrderingRequests')).toHaveLength(5);
    expect(calls.some(c => c.startsWith('DELETE'))).toBe(false);
    const ord = (r.orders as any[]).find(o => o.relationships.appStoreVersionLocalization.data.id === 'L-pl');
    expect(ord.attributes.placementGroup).toBe('G-IPHONE'); const plIds = (r.placements as any[]).filter(x => x.relationships.appStoreVersionLocalization.data.id === 'L-pl').map(x => x.id); expect(plIds).toHaveLength(2);
    expect(ord.relationships.orderedPlacements.data.map((x: any) => x.id)).toEqual(plIds);
    const first = (r.placements as any[])[0];
    expect(first.attributes).toEqual({ placementType: 'APP_SCREENSHOT', placementGroup: 'G-IPHONE' }); expect(first.relationships.image.data.type).toBe('appAssetLibraryImages');
    expect(r.logs).toContain('zapisano 5');
  });
  test('rezerwacja zawiera nazwę pliku, rozmiar w bajtach, kategorię i nazwę referencyjną; commit tylko z uploaded', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE] } });
    const r = drive({ iphone: dir, versions: EDIT, locales: ['pl'], apply: true });
    expect(r.code).toBe(0); expect(r.puts).toEqual([expect.stringMatching(/^\/up\/IMG1 73$/)]); /* 33 + 40 bajtów */
  });
  test('porażka wgrywania części albo przetwarzania: kod 1, komunikat bez adresu wgrywania i bez treści odpowiedzi API, brak placementów', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE] } });
    for (const sc of [{ putFails: true }, { processing: 'FAILED' }]) {
      const r = drive({ iphone: dir, versions: EDIT, locales: ['pl'], apply: true, ...sc });
      expect(r.code).toBe(1); expect(r.logs).toContain('BŁĄD iphone/pl'); expect(r.logs).not.toContain('blob.test'); expect((r.calls as string[]).filter(c => c === 'POST /v1/appAssetLibraryPlacements')).toHaveLength(0);
    }
  });
  test('błąd planu blokuje cały zapis: zero zapisów', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE] }, de: { '01-a.png': [10, 10] } });
    const r = drive({ iphone: dir, versions: EDIT, locales: ['pl', 'de-DE'], apply: true });
    expect(r.code).toBe(1); expect(writes(r.calls)).toEqual([]); expect(r.logs).toContain('Zapis wstrzymany — nic nie zapisano.');
  });
  test('ponowny przebieg po zapisie pomija grupy, które mają już zrzuty (idempotencja bez usuwania)', () => {
    const dir = shots({ pl: { '01-a.png': [...IPHONE] } });
    const r = drive({ iphone: dir, versions: EDIT, locales: ['pl'], apply: true, existing: { 'pl:G-IPHONE': 1 } });
    expect(r.code).toBe(0); expect(writes(r.calls)).toEqual([]); expect(r.logs).toContain('wgraj 0, pomiń 1, zapisano 0');
  });
});

describe('workflow asc-zrzuty.yml', () => {
  test('tylko ręczny; dry-run domyślnie; wejścia: przebieg zrzutów (wymagany), rozmiar, przebieg zegarka (opcjonalny)', () => {
    expect(wf).toMatch(/\non:\n  workflow_dispatch:\n    inputs:\n      tryb:\n/); expect(wf).toMatch(/options: \[dry-run, apply\]\n\s+default: dry-run\n/);
    expect(wf).toMatch(/zrzuty_z_przebiegu:\n(?:.*\n)*?\s+required: true/); expect(wf).toMatch(/rozmiar:\n(?:.*\n)*?\s+options: \['6\.9', '6\.3'\]\n\s+default: '6\.9'/);
    expect(wf).toMatch(/zegarek_z_przebiegu:\n(?:.*\n)*?\s+required: false/);
    expect(wf).not.toMatch(/schedule:|^\s+push:|pull_request|contents: write|id-token|macos|EXPO_TOKEN/m);
    expect(wf).toMatch(/\npermissions:\n  contents: read\n  actions: read\n/);
  });
  test('dwa joby: plan bez środowiska, zapis tylko dla apply i za środowiskiem release; artefakty z przebiegów store-screenshots i watch-sim', () => {
    const [head, zapis] = wf.split(/\n  zapis:\n/); expect(zapis).toBeDefined();
    expect(head).not.toMatch(/environment:/); expect(head).toContain('--dry-run'); expect(head).not.toContain('--apply');
    expect(zapis).toMatch(/needs: plan\n\s+if: \$\{\{ inputs\.tryb == 'apply' \}\}\n\s+environment: release\n\s+runs-on: ubuntu-latest\n/); expect(zapis).toContain('--apply'); expect(zapis).not.toContain('--dry-run');
    expect(wf.match(/name: sklep-zrzuty-ramki/g)).toHaveLength(2); expect(wf.match(/name: zegarek-zrzuty/g)).toHaveLength(2);
    expect(wf.match(/run-id: \$\{\{ inputs\.zrzuty_z_przebiegu \}\}/g)).toHaveLength(2); expect(wf.match(/run-id: \$\{\{ inputs\.zegarek_z_przebiegu \}\}/g)).toHaveLength(2);
    expect(read('.github/workflows/store-screenshots.yml')).toContain('name: sklep-zrzuty-ramki'); expect(read('.github/workflows/watch-sim.yml')).toContain('name: zegarek-zrzuty');
  });
  test('sekrety: tylko istniejące ASC_KEY_ID / ASC_ISSUER_ID / ASC_KEY_P8 (+ GITHUB_TOKEN do pobrania artefaktów); maskowanie, umask i usunięcie klucza w obu jobach; wejścia nie trafiają do `run:`', () => {
    expect([...new Set(wf.match(/secrets\.[A-Z_0-9]+/g))].sort()).toEqual(['secrets.ASC_ISSUER_ID', 'secrets.ASC_KEY_ID', 'secrets.ASC_KEY_P8', 'secrets.GITHUB_TOKEN']);
    expect(wf.match(/::add-mask::\$ASC_KEY_ID/g)).toHaveLength(2); expect(wf.match(/umask 077/g)).toHaveLength(2);
    expect(wf).not.toMatch(/echo[^\n]*\$\{?ASC_KEY_P8(?!" \|)/); expect(wf).not.toMatch(/echo "\$ASC_KEY_(ID|P8)|echo "\$ASC_ISSUER_ID/);
    expect(wf.match(/- name: Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey\.p8"/g)).toHaveLength(2);
    expect(wf).not.toMatch(/run:[^\n]*\$\{\{ inputs/); expect(wf).not.toMatch(/\bDELETE\b/); expect(wf).toContain('$GITHUB_STEP_SUMMARY');
    expect(wf).toContain('ROZMIAR: ${{ inputs.rozmiar }}');
  });
  test('workflow jest w spisie workflowów repozytorium i w README (opis)', () => {
    expect(read('scripts/readme.mjs')).toContain("'asc-zrzuty.yml':"); expect(read('tests/public-repo.test.ts')).toContain("'asc-zrzuty.yml'");
  });
});
