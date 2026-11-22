/*
 * App Analytics i metadane na żywo z App Store Connect (KO-100, KO-106, 22.11.2026): scripts/asc/analityka.mjs, scripts/asc/na-zywo.mjs
 * i szablon workflowu prywatnego repo scripts/asc/prywatne-repo/asc-dane.yml.
 * Wzór: tests/asc-status-wersji.test.ts — skrypt (ESM) działa w procesie potomnym na atrapie API (fetch podstawiony).
 * Zakres strażnika: pliki scripts/asc/analityka.mjs, scripts/asc/na-zywo.mjs, scripts/asc/prywatne-repo/asc-dane.yml (czytane niżej przez read()).
 */
import { readFileSync, mkdtempSync, readdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { execFileSync } from 'child_process';
import { gzipSync } from 'zlib';
import { createHash } from 'crypto';

const root = join(__dirname, '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8');
const ANALITYKA = read('scripts/asc/analityka.mjs');
const NAZYWO = read('scripts/asc/na-zywo.mjs');
const RECENZJE = read('scripts/asc/recenzje.mjs');
const CENY = read('scripts/asc/ceny.mjs');
const WF = read('scripts/asc/prywatne-repo/asc-dane.yml');

type Wynik = { code: number; calls: { m: string; p: string; auth: boolean; body: unknown }[]; out: string; files: Record<string, string>; stan?: unknown };

const DRIVER = (skrypt: string) => `
import { run } from ${JSON.stringify(join(root, 'scripts/asc', skrypt))};
import { makeClient } from ${JSON.stringify(join(root, 'scripts/asc/iap-localizations.mjs'))};
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
const sc = JSON.parse(process.argv[1]); const outDir = process.argv[2];
for (const [f, t] of Object.entries(sc.preFiles ?? {})) { mkdirSync(join(outDir, ...f.split('/').slice(0, -1)), { recursive: true }); writeFileSync(join(outDir, f), t); }
const calls = []; const out = [];
const resp = (status, body, raw) => ({ ok: status < 400, status, json: async () => body, arrayBuffer: async () => raw });
const route = async (url, init = {}) => {
  const m = init.method || 'GET'; const u = new URL(url); const p = u.pathname;
  calls.push({ m, p: p + (u.search || ''), auth: !!(init.headers && init.headers.Authorization), body: init.body ? JSON.parse(init.body) : null });
  if (u.host === 'seg.example') { const b = sc.segments[p]; return b === undefined ? resp(404, null) : resp(200, null, Buffer.from(b, 'base64')); }
  const r = sc.routes[m + ' ' + p]; if (!r) return resp(404, { errors: [] });
  const k = (sc.seq ?? (sc.seq = {})); const list = Array.isArray(r) ? r : [r]; const i = k[m + p] = (k[m + p] ?? -1) + 1; const x = list[Math.min(i, list.length - 1)];
  return resp(x.status ?? 200, x.body);
};
const client = makeClient({ fetchFn: route, token: 't', sleep: async () => {} });
const { code, stan } = await run({ client, fetchFn: route, out: outDir, zapiszZadanie: !!sc.zapisz, log: s => out.push(s), dzis: '2026-11-22' });
const files = {}; const walk = d => { try { for (const e of readdirSync(d, { withFileTypes: true })) e.isDirectory() ? walk(join(d, e.name)) : (files[join(d, e.name).slice(outDir.length + 1)] = readFileSync(join(d, e.name), 'utf8')); } catch {} };
walk(outDir);
console.log(JSON.stringify({ code, calls, out: out.join('\\n'), files, stan }));
`;
const drive = (skrypt: string, sc: object): Wynik => JSON.parse(execFileSync('node', ['--input-type=module', '-e', DRIVER(skrypt), JSON.stringify(sc), mkdtempSync(join(tmpdir(), 'asc-an-'))], { encoding: 'utf8' }));

const b64 = (s: string | Buffer) => Buffer.from(s).toString('base64');
const md5 = (b: Buffer) => createHash('md5').update(b).digest('hex');
const APP = { 'GET /v1/apps': { body: { data: [{ id: 'APPID-SECRET', attributes: {} }] } } };
const REQS = (list: object[]) => ({ 'GET /v1/apps/APPID-SECRET/analyticsReportRequests': { body: { data: list } } });
const REQ_ON = { id: 'REQID-SECRET', attributes: { accessType: 'ONGOING', stoppedDueToInactivity: false } };
const REQ_STOP = { id: 'REQID-SECRET', attributes: { accessType: 'ONGOING', stoppedDueToInactivity: true } };

// Szeregi: TSV z nagłówkiem po nazwach Apple (kolejność kolumn celowo inna niż w dokumentacji)
const DISC_HEAD = 'Date\tApp Name\tEvent\tPage Type\tSource Type\tEngagement Type\tDevice\tPlatform Version\tTerritory\tCounts\tUnique Counts';
const disc = (rows: string[][]) => [DISC_HEAD, ...rows.map(r => r.join('\t'))].join('\n');
const D_ROW = (date: string, ter: string, ev: string, src: string, c: number, u: number, dev = 'iPhone') => [date, 'RepsGoat', ev, 'Product page', src, 'Get', dev, '18.0', ter, String(c), String(u)];
const DL_HEAD = 'Date\tApp Name\tDownload Type\tApp Version\tDevice\tPlatform Version\tSource Type\tPage Type\tPre-Order\tTerritory\tCounts';
const dl = (rows: string[][]) => [DL_HEAD, ...rows.map(r => r.join('\t'))].join('\n');

function pipeline(extra: object = {}) {
  const seg1 = gzipSync(Buffer.from(disc([D_ROW('2026-11-20', 'POL', 'Page view', 'App Store search', 10, 8), D_ROW('2026-11-20', 'POL', 'Page view', 'App Store search', 5, 4, 'iPad'), D_ROW('2026-11-21', 'CZE', 'Impression', 'App Store browse', 100, 90)])));
  const seg2 = gzipSync(Buffer.from(disc([D_ROW('2026-11-21', 'CZE', 'Impression', 'App Store browse', 120, 99)]))); // późniejsza instancja poprawia 21.11
  const seg3 = Buffer.from(dl([['2026-11-20', 'RepsGoat', 'First-time Download', '1.0', 'iPhone', '18.0', 'App Store search', 'Product page', 'No', 'POL', '3']]));
  return {
    routes: {
      ...APP, ...REQS([REQ_ON]),
      'GET /v1/analyticsReportRequests/REQID-SECRET/reports': { body: { data: [
        { id: 'REPD', attributes: { name: 'App Store Discovery and Engagement Detailed', category: 'APP_STORE_ENGAGEMENT' } },
        { id: 'REPS', attributes: { name: 'App Store Discovery and Engagement Standard', category: 'APP_STORE_ENGAGEMENT' } },
        { id: 'REPL', attributes: { name: 'App Downloads Standard', category: 'COMMERCE' } },
        { id: 'REPX', attributes: { name: 'App Crashes', category: 'APP_USAGE' } }] } },
      'GET /v1/analyticsReports/REPS/instances': { body: { data: [{ id: 'I1', attributes: { granularity: 'DAILY', processingDate: '2026-11-21' } }, { id: 'I2', attributes: { granularity: 'DAILY', processingDate: '2026-11-22' } }] } },
      'GET /v1/analyticsReports/REPL/instances': { body: { data: [{ id: 'I3', attributes: { granularity: 'DAILY', processingDate: '2026-11-22' } }] } },
      'GET /v1/analyticsReportInstances/I1/segments': { body: { data: [{ id: 'S1', attributes: { url: 'https://seg.example/s1', checksum: md5(seg1), sizeInBytes: seg1.length } }] } },
      'GET /v1/analyticsReportInstances/I2/segments': { body: { data: [{ id: 'S2', attributes: { url: 'https://seg.example/s2', checksum: md5(seg2), sizeInBytes: seg2.length } }] } },
      'GET /v1/analyticsReportInstances/I3/segments': { body: { data: [{ id: 'S3', attributes: { url: 'https://seg.example/s3', checksum: md5(seg3), sizeInBytes: seg3.length } }] } },
    },
    segments: { '/s1': b64(seg1), '/s2': b64(seg2), '/s3': b64(seg3) },
    ...extra,
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// Jest nie obsługuje dynamicznego import() bez flagi — czyste funkcje modułów ESM wołamy w procesie potomnym (argumenty JSON; {b64} → Buffer; '@RAPORTYn' → RAPORTY[n]).
const wola = (skrypt: string) => new Proxy({}, { get: (_t, nazwa: string) => nazwa === 'then' ? undefined : (...args: unknown[]) => {
  const kod = `import * as m from ${JSON.stringify(join(root, 'scripts/asc', skrypt))};
const a = JSON.parse(process.argv[1]).map(x => x && x.b64 !== undefined ? Buffer.from(x.b64, 'base64') : (typeof x === 'string' && x.startsWith('@RAPORTY') ? m.RAPORTY[Number(x.slice(8))] : x));
console.log(JSON.stringify(m[${JSON.stringify(nazwa)}](...a) ?? null));`;
  return JSON.parse(execFileSync('node', ['--input-type=module', '-e', kod, JSON.stringify(args)], { encoding: 'utf8' }));
} });
async function lib(): Promise<any> { return wola('analityka.mjs'); }
async function zywo(): Promise<any> { return wola('na-zywo.mjs'); }

describe('scripts/asc/analityka.mjs: czyste funkcje', () => {
  test('planZadania: brak / aktywne / zatrzymane — zatrzymane nie jest „brak” (nie tworzymy drugiego żądania)', async () => {
    const { planZadania, aktywneZadanie } = await lib();
    expect(planZadania([])).toBe('brak');
    expect(planZadania([{ attributes: { accessType: 'ONE_TIME_SNAPSHOT' } }])).toBe('brak');
    expect(planZadania([REQ_ON])).toBe('jest');
    expect(planZadania([REQ_STOP])).toBe('zatrzymane');
    expect(planZadania([REQ_STOP, REQ_ON])).toBe('jest');
    expect(aktywneZadanie([REQ_STOP, REQ_ON])).toEqual(REQ_ON);
  });
  test('tresciZadania: dokładnie ONGOING + relacja app (jedyny zapis)', async () => {
    const { tresciZadania } = await lib();
    expect(tresciZadania('A1')).toEqual({ data: { type: 'analyticsReportRequests', attributes: { accessType: 'ONGOING' }, relationships: { app: { data: { type: 'apps', id: 'A1' } } } } });
  });
  test('wybierzRaport: Standard przed Detailed, kategoria i nazwa muszą pasować', async () => {
    const { wybierzRaport } = await lib();
    const rs = [{ id: 'd', attributes: { name: 'App Store Discovery and Engagement Detailed', category: 'APP_STORE_ENGAGEMENT' } }, { id: 's', attributes: { name: 'App Store Discovery and Engagement Standard', category: 'APP_STORE_ENGAGEMENT' } }, { id: 'x', attributes: { name: 'App Downloads Standard', category: 'APP_USAGE' } }];
    expect(wybierzRaport(rs, '@RAPORTY0').id).toBe('s');
    expect(wybierzRaport(rs.slice(0, 1), '@RAPORTY0')).toBeNull();
    expect(wybierzRaport(rs, '@RAPORTY1')).toBeNull();
  });
  test('parsujSegment: TSV, przecinki, gzip, BOM; kolumny po nazwach (zmiana kolejności nie psuje)', async () => {
    const { parsujSegment } = await lib();
    expect(parsujSegment('Date\tTerritory\tCounts\n2026-11-20\tPOL\t3')).toEqual([{ date: '2026-11-20', territory: 'POL', counts: '3' }]);
    expect(parsujSegment('Counts,Territory,Date\n3,POL,2026-11-20')).toEqual([{ counts: '3', territory: 'POL', date: '2026-11-20' }]);
    expect(parsujSegment(gzipSync(Buffer.from('﻿Date\tCounts\n2026-11-20\t4')))).toEqual([{ date: '2026-11-20', counts: '4' }]);
    expect(parsujSegment('')).toEqual([]);
  });
  test('agreguj: sumuje po wymiarach (urządzenia), nienumeryczne = 0, wiersz bez daty pomijany', async () => {
    const { agreguj, parsujSegment } = await lib();
    const w = parsujSegment(disc([D_ROW('2026-11-20', 'POL', 'Page view', 'App Store search', 10, 8), D_ROW('2026-11-20', 'POL', 'Page view', 'App Store search', 5, 4, 'iPad'), ['', 'x', 'Page view', 'Product page', 'App Store search', 'Get', 'iPhone', '18', 'POL', '1', '1'], D_ROW('2026-11-20', 'CZE', 'Page view', 'Web referrer', 0, 0)]));
    w[3].counts = 'abc';
    const a = agreguj(w, '@RAPORTY0');
    expect(a).toHaveLength(2);
    expect(a.find((r: any) => r.territory === 'POL')).toMatchObject({ counts: 15, unique_counts_suma_urzadzen: 12 });
    expect(a.find((r: any) => r.territory === 'CZE')).toMatchObject({ counts: 0 });
  });
  test('najnowszePoDacie: późniejszy processingDate zastępuje wcześniejszy, rekordów nie łączy (docs Apple: „Use the latest instance”)', async () => {
    const { najnowszePoDacie } = await lib();
    const a = { processingDate: '2026-11-21', wiersze: [{ date: '2026-11-20', counts: '1' }, { date: '2026-11-21', counts: '5' }] };
    const b = { processingDate: '2026-11-22', wiersze: [{ date: '2026-11-21', counts: '7' }] };
    const w = najnowszePoDacie([b, a]);
    expect(w).toEqual(expect.arrayContaining([{ date: '2026-11-21', counts: '7' }, { date: '2026-11-20', counts: '1' }]));
    expect(w).toHaveLength(2);
  });
  test('scal: daty z nowych wierszy zastępują stare, starsze daty zostają', async () => {
    const { scal } = await lib();
    const w = scal([{ date: '2026-11-01', counts: 1 }, { date: '2026-11-21', counts: 2 }], [{ date: '2026-11-21', counts: 9 }]);
    expect(w).toEqual(expect.arrayContaining([{ date: '2026-11-01', counts: 1 }, { date: '2026-11-21', counts: 9 }]));
    expect(w).toHaveLength(2);
  });
  test('doCsv / zCsv: round-trip z cudzysłowami i przecinkami', async () => {
    const { doCsv, zCsv } = await lib();
    const def = { wartosci: ['counts'] };
    const w = [{ date: '2026-11-20', source_type: 'App, "Store"', counts: 3 }];
    expect(zCsv(doCsv(w, ['date', 'source_type', 'counts']), def)).toEqual(w);
    expect(zCsv('', def)).toEqual([]);
  });
});

describe('scripts/asc/analityka.mjs: przebieg na atrapie API', () => {
  test('tryb odczytu bez żądania: kod 3, wyłącznie GET, nic nie zapisano (L-001: bez zgody brak zapisu)', () => {
    const r = drive('analityka.mjs', { routes: { ...APP, ...REQS([]) } });
    expect(r.code).toBe(3);
    expect(r.calls.every(c => c.m === 'GET')).toBe(true);
    expect(r.out).toContain('Brak żądania ONGOING');
    expect(Object.keys(r.files)).toEqual([]);
  });
  test('--zapisz-zadanie bez żądania: jeden POST (ONGOING + relacja app), potem sprawdzenie GET w tym samym przebiegu', () => {
    const r = drive('analityka.mjs', { zapisz: true, routes: { ...APP, 'GET /v1/apps/APPID-SECRET/analyticsReportRequests': [{ body: { data: [] } }, { body: { data: [REQ_ON] } }], 'POST /v1/analyticsReportRequests': { status: 201, body: { data: { id: 'REQID-SECRET', attributes: { accessType: 'ONGOING' } } } } } });
    expect(r.code).toBe(0);
    const posty = r.calls.filter(c => c.m === 'POST');
    expect(posty).toHaveLength(1);
    expect(posty[0].body).toMatchObject({ data: { type: 'analyticsReportRequests', attributes: { accessType: 'ONGOING' }, relationships: { app: { data: { type: 'apps', id: 'APPID-SECRET' } } } } });
    const iPost = r.calls.findIndex(c => c.m === 'POST');
    expect(r.calls.slice(iPost + 1).some(c => c.m === 'GET' && c.p.includes('analyticsReportRequests'))).toBe(true);
    expect(r.out).toContain('sprawdzenie w usłudze: aktywne');
    expect(r.calls.some(c => c.m === 'DELETE' || c.m === 'PATCH')).toBe(false);
  });
  test('--zapisz-zadanie, gdy ONGOING już jest: zero POST (idempotencja)', () => {
    const r = drive('analityka.mjs', { zapisz: true, routes: { ...APP, ...REQS([REQ_ON]), 'GET /v1/analyticsReportRequests/REQID-SECRET/reports': { body: { data: [] } } } });
    expect(r.calls.filter(c => c.m === 'POST')).toHaveLength(0);
    expect(r.out).toContain('ONGOING: aktywne');
  });
  test('żądanie zatrzymane (stoppedDueToInactivity): kod 1, nawet z --zapisz-zadanie nie tworzy drugiego (drugi zapis wymaga zgody)', () => {
    const r = drive('analityka.mjs', { zapisz: true, routes: { ...APP, ...REQS([REQ_STOP]) } });
    expect(r.code).toBe(1);
    expect(r.calls.filter(c => c.m !== 'GET')).toHaveLength(0);
    expect(r.out).toContain('ZATRZYMANE');
  });
  test('POST odrzucony przez Apple: kod 1, bez treści odpowiedzi w logu', () => {
    const r = drive('analityka.mjs', { zapisz: true, routes: { ...APP, ...REQS([]), 'POST /v1/analyticsReportRequests': { status: 403, body: { errors: [{ code: 'FORBIDDEN', title: 'rola' }] } } } });
    expect(r.code).toBe(1);
    expect(r.out).toContain('403');
  });
  test('pełny przebieg: wiersze z późniejszej instancji, Standard zamiast Detailed, segment bez nagłówka Authorization, CSV zapisane', () => {
    const r = drive('analityka.mjs', pipeline());
    expect(r.code).toBe(0);
    const d = r.files['discovery.csv'].trim().split('\n');
    expect(d[0]).toBe('date,territory,source_type,page_type,event,engagement_type,counts,unique_counts_suma_urzadzen');
    expect(d).toContain('2026-11-20,POL,App Store search,Product page,Page view,Get,15,12');
    expect(d).toContain('2026-11-21,CZE,App Store browse,Product page,Impression,Get,120,99'); // 120, nie 100 — instancja z 22.11 zastępuje
    expect(d).not.toContain('2026-11-21,CZE,App Store browse,Product page,Impression,Get,100,90');
    expect(r.files['pobrania.csv']).toContain('2026-11-20,POL,App Store search,Product page,First-time Download,3');
    expect(r.calls.filter(c => c.p.startsWith('/s')).every(c => c.auth === false)).toBe(true);
    expect(r.calls.filter(c => c.p.startsWith('/v1/analyticsReports/')).map(c => c.p)).toEqual(expect.arrayContaining([expect.stringContaining('filter[granularity]=DAILY')]));
    expect(r.calls.some(c => c.p.includes('REPD'))).toBe(false); // Detailed nie jest pobierany
    expect(r.calls.filter(c => c.m !== 'GET')).toHaveLength(0);
    expect(JSON.parse(r.files['stan.json'])).toMatchObject({ zadanie: 'jest', raporty: { discovery: 'App Store Discovery and Engagement Standard' } });
  });
  test('kolejny przebieg scala z poprzednim plikiem: starsze daty zostają, powtórzone daty są zastąpione', () => {
    const r = drive('analityka.mjs', pipeline({ preFiles: { 'discovery.csv': 'date,territory,source_type,page_type,event,engagement_type,counts,unique_counts_suma_urzadzen\n2026-10-30,POL,App Store search,Product page,Page view,Get,4,3\n2026-11-21,CZE,App Store browse,Product page,Impression,Get,1,1\n' } }));
    const d = r.files['discovery.csv'];
    expect(d).toContain('2026-10-30,POL');
    expect(d).toContain('2026-11-21,CZE,App Store browse,Product page,Impression,Get,120,99');
    expect(d).not.toContain(',Get,1,1');
  });
  test('Prywatność (repo publiczne): w logu ani jednej liczby biznesowej, terytorium, identyfikatora ani nazwy aplikacji', () => {
    const r = drive('analityka.mjs', pipeline());
    for (const zakazane of ['POL', 'CZE', 'APPID', 'REQID', 'RepsGoat', '120', '99', 'seg.example', 'Bearer']) expect(r.out).not.toContain(zakazane);
    expect(r.out).toContain('Zapisano discovery.csv:');
  });
  test('suma kontrolna segmentu niezgodna: kod 1, nic nie zapisano', () => {
    const p: any = pipeline();
    p.routes['GET /v1/analyticsReportInstances/I1/segments'].body.data[0].attributes.checksum = '0'.repeat(32);
    const r = drive('analityka.mjs', p);
    expect(r.code).toBe(1);
    expect(r.out).toContain('suma kontrolna');
    expect(r.files['discovery.csv']).toBeUndefined();
  });
  test('brak raportów (Apple generuje po 1–2 dniach): kod 3 z komunikatem, bez błędu', () => {
    const r = drive('analityka.mjs', { routes: { ...APP, ...REQS([REQ_ON]), 'GET /v1/analyticsReportRequests/REQID-SECRET/reports': { body: { data: [] } } } });
    expect(r.code).toBe(3);
    expect(r.out).toContain('jeszcze niedostępny');
  });
  test('aplikacja nie znaleziona: kod 1', () => {
    const r = drive('analityka.mjs', { routes: { 'GET /v1/apps': { body: { data: [] } } } });
    expect(r.code).toBe(1);
  });
});

describe('scripts/asc/na-zywo.mjs: metadane wersji w sprzedaży (tylko odczyt)', () => {
  const VERS = { 'GET /v1/apps/APPID-SECRET/appStoreVersions': { body: { data: [
    { id: 'V-EDIT', attributes: { versionString: '1.1', appStoreState: 'PREPARE_FOR_SUBMISSION' } },
    { id: 'V-LIVE', attributes: { versionString: '1.0', appStoreState: 'READY_FOR_SALE' } }] } } };
  const sc = (extra: object = {}) => ({ routes: { ...APP, ...VERS,
    'GET /v1/appStoreVersions/V-LIVE/appStoreVersionLocalizations': { body: { data: [
      { id: 'L1', attributes: { locale: 'pl', keywords: 'trening,siłownia', description: 'Opis PL', promotionalText: '', whatsNew: 'Nowość' } },
      { id: 'L2', attributes: { locale: 'en-US', keywords: 'workout,gym', description: 'Desc' } }] } },
    'GET /v1/apps/APPID-SECRET/appInfos': { body: { data: [{ id: 'INFO-OLD', attributes: { appStoreState: 'PREPARE_FOR_SUBMISSION' } }, { id: 'INFO-LIVE', attributes: { appStoreState: 'READY_FOR_DISTRIBUTION' } }] } },
    'GET /v1/appInfos/INFO-LIVE/appInfoLocalizations': { body: { data: [{ id: 'N1', attributes: { locale: 'pl', name: 'RepsGoat', subtitle: 'Plan i dziennik' } }] } },
    'GET /v1/apps/APPID-SECRET/appAvailabilityV2': { body: { data: { id: 'AV1', attributes: { availableInNewTerritories: true } } } },
    'GET /v2/appAvailabilities/AV1/territoryAvailabilities': { body: { data: [{ id: 'T1', attributes: { available: true }, relationships: { territory: { data: { type: 'territories', id: 'POL' } } } }, { id: 'T2', attributes: { available: false }, relationships: { territory: { data: { type: 'territories', id: 'CZE' } } } }] } },
    'GET /v1/apps/APPID-SECRET/reviewSubmissions': { body: { data: [{ id: 'SUB1', attributes: { platform: 'IOS', state: 'COMPLETE', submittedDate: '2026-10-30T09:00:00Z' } }, { id: 'SUB2', attributes: { platform: 'IOS', state: 'WAITING_FOR_REVIEW', submittedDate: '2026-11-20T09:00:00Z' } }] } },
    ...extra } });

  test('czyta wersję READY_FOR_SALE (nie edytowalną) i appInfo opublikowany; zapisuje JSON; w logu same liczby', () => {
    const r = drive('na-zywo.mjs', sc());
    expect(r.code).toBe(0);
    const j = JSON.parse(r.files['metadane-na-zywo.json']);
    expect(j.wersja).toBe('1.0');
    expect(j.wersja_lokalizacje).toEqual([
      expect.objectContaining({ locale: 'en-US', keywords: 'workout,gym', keywords_bytes: 11 }),
      expect.objectContaining({ locale: 'pl', keywords: 'trening,siłownia', keywords_bytes: Buffer.byteLength('trening,siłownia') })]);
    expect(j.info_lokalizacje).toEqual([{ locale: 'pl', name: 'RepsGoat', subtitle: 'Plan i dziennik' }]);
    expect(j.info_zakladany).toBe(false);
    expect(j.dostepnosc).toEqual({ dostepna_w_nowych_terytoriach: true, terytoria: [{ id: 'CZE', dostepna: false }, { id: 'POL', dostepna: true }] });
    expect(j.zgloszenia_do_recenzji).toEqual([{ platforma: 'IOS', stan: 'WAITING_FOR_REVIEW', wyslano: '2026-11-20T09:00:00Z' }, { platforma: 'IOS', stan: 'COMPLETE', wyslano: '2026-10-30T09:00:00Z' }]);
    expect(r.out).toContain('zgłoszeń do recenzji: 2');
    expect(r.out).not.toContain('WAITING_FOR_REVIEW');
    expect(r.calls.every(c => c.m === 'GET')).toBe(true);
    expect(r.calls.some(c => c.p.includes('V-EDIT'))).toBe(false);
    expect(r.calls.find(c => c.p.includes('territoryAvailabilities'))?.p).toContain('include=territory');
    for (const zakazane of ['trening', 'RepsGoat', 'Plan i dziennik', 'POL', 'APPID', 'V-LIVE']) expect(r.out).not.toContain(zakazane);
    expect(r.out).toContain('lokalizacji wersji: 2');
  });
  test('brak wersji w sprzedaży: kod 1 z listą stanów (to dziś błąd podglądu „Brak edytowalnej wersji”, tu odwrotnie)', () => {
    const r = drive('na-zywo.mjs', { routes: { ...APP, 'GET /v1/apps/APPID-SECRET/appStoreVersions': { body: { data: [{ id: 'V', attributes: { versionString: '1.1', appStoreState: 'PREPARE_FOR_SUBMISSION' } }] } } } });
    expect(r.code).toBe(1);
    expect(r.out).toContain('PREPARE_FOR_SUBMISSION');
    expect(r.files['metadane-na-zywo.json']).toBeUndefined();
  });
  test('jeden appInfo o nieznanym stanie: bierzemy go i oznaczamy jako założony; dostępność niedostępna nie przerywa przebiegu', () => {
    const r = drive('na-zywo.mjs', sc({ 'GET /v1/apps/APPID-SECRET/appInfos': { body: { data: [{ id: 'INFO-LIVE', attributes: { appStoreState: 'INNY_STAN' } }] } }, 'GET /v1/apps/APPID-SECRET/appAvailabilityV2': { status: 404, body: { errors: [] } } }));
    expect(r.code).toBe(0);
    const j = JSON.parse(r.files['metadane-na-zywo.json']);
    expect(j.info_zakladany).toBe(true);
    expect(j.dostepnosc).toBeNull();
    expect(r.out).toContain('Dostępność terytoriów: niedostępna');
  });
  test('wersjaNaZywo / infoNaZywo: czyste funkcje; nigdy nie wybiera wersji edytowalnej', async () => {
    const { wersjaNaZywo, infoNaZywo } = await zywo();
    expect(wersjaNaZywo([{ attributes: { appStoreState: 'PREPARE_FOR_SUBMISSION' } }])).toBeNull();
    expect(infoNaZywo([{ id: 1, attributes: {} }, { id: 2, attributes: {} }])).toEqual({ info: null, zakladany: false });
  });
});

describe('szablon workflowu prywatnego repo (scripts/asc/prywatne-repo/asc-dane.yml)', () => {
  test('leży poza .github/workflows (w publicznym repo nie działa) i nie ma go wśród workflowów', () => {
    expect(readdirSync(join(root, '.github/workflows'))).not.toContain('asc-dane.yml');
  });
  test('harmonogram raz w tygodniu + ręczne uruchomienie; jedyny zapis tylko przy polu zapisz_zadanie (domyślnie false)', () => {
    expect(WF).toMatch(/cron: '\d+ \d+ \* \* 1'/);
    expect(WF).toContain('workflow_dispatch:');
    expect(WF).toMatch(/zapisz_zadanie:[\s\S]*?default: false/);
    expect(WF).toContain('--zapisz-zadanie');
  });
  test('tylko trzy sekrety ASC; klucz do RUNNER_TEMP i usuwany zawsze; maski', () => {
    const sekrety = [...WF.matchAll(/secrets\.([A-Z0-9_]+)/g)].map(m => m[1]);
    expect(new Set(sekrety)).toEqual(new Set(['ASC_KEY_ID', 'ASC_ISSUER_ID', 'ASC_KEY_P8']));
    expect(WF).toMatch(/AuthKey\.p8"/);
    expect(WF).toMatch(/Usunięcie klucza z maszyny\n\s+if: always\(\)\n\s+run: rm -f "\$RUNNER_TEMP\/AuthKey.p8"/);
    expect(WF).toContain('::add-mask::');
  });
  test('uprawnienie zapisu tylko contents (do commitu danych w tym samym repo); skrypty z publicznego repo bez poświadczeń', () => {
    expect(WF).toMatch(/permissions:\n\s+contents: write\n/);
    expect(WF).not.toMatch(/(issues|actions|packages|pull-requests): write/);
    expect(WF).toMatch(/repository: lkarwowski494\/trening\n\s+ref: .*\n\s+path: _trening\n\s+persist-credentials: false/);
    expect(WF).toContain('SKRYPTY_REF:');
  });
  test('log przebiegu nie wypisuje danych: żadnego cat/tee/echo plików z danych ani step summary', () => {
    expect(WF).not.toMatch(/\b(cat|tee|head|tail)\b[^\n]*dane/);
    expect(WF).not.toContain('GITHUB_STEP_SUMMARY');
    expect(WF).not.toMatch(/upload-artifact/);
  });
});

describe('KO-121: szablon workflowu uruchamia też recenzje i ceny (tylko odczyt) i uwzględnia je w wyniku', () => {
  test('kroki recenzje.mjs i ceny.mjs bez flag zapisu; „Wynik” sprawdza wszystkie cztery', () => {
    expect(WF).toMatch(/node _trening\/scripts\/asc\/recenzje\.mjs --out dane\n/);
    expect(WF).toMatch(/node _trening\/scripts\/asc\/ceny\.mjs --out dane\n/);
    for (const id of ['zywo', 'analityka', 'recenzje', 'ceny']) expect(WF).toContain('steps.' + id + '.outcome');
    expect((WF.match(/--zapisz-zadanie/g) ?? []).length).toBe(1);
  });
});

describe('Zakres strażnika (L-089) i ochrona skryptów', () => {
  test('skrypty: klient bez DELETE/PATCH (analityka tylko GET + jedyny POST), segment pobierany bez Authorization', () => {
    expect(ANALITYKA).not.toMatch(/'DELETE'|'PATCH'/);
    expect([...ANALITYKA.matchAll(/'POST'/g)]).toHaveLength(1);
    expect(NAZYWO).not.toMatch(/'POST'|'DELETE'|'PATCH'/);
    expect(NAZYWO).toContain('readOnlyClient');
    expect(ANALITYKA).toMatch(/fetchFn\(seg\.attributes\.url\)/);
  });
  test('w skryptach nie ma sekretów ani identyfikatorów aplikacji poza BUNDLE_ID z wspólnego modułu', () => {
    for (const s of [ANALITYKA, NAZYWO, RECENZJE, CENY, WF]) expect(s).not.toMatch(/-----BEGIN|AuthKey_[A-Z0-9]{6,}|\bid\d{6,}\b/);
  });
});

describe('Poprawki po recenzji niezależnej AN (08-programista-001…004, 22.11.2026)', () => {
  const ZAKAZANE = ['APPID', 'REQID', 'SEKRET', 'POL', 'CZE', 'App Store search', 'r142', '0a1b2c3d', 'seg.example', 'Bearer'];
  const bezWycieku = (out: string) => { for (const z of ZAKAZANE) expect(out).not.toContain(z); };
  const BLAD500 = { status: 500, body: { errors: [{ code: 'UNEXPECTED_ERROR', title: 'Blad', detail: 'SEKRET-DANE POL 120' }], meta: { dane: 'SEKRET-DANE' } } };

  test('001: SKRYPTY_REF w szablonie to pełny SHA (40 hex), nie gałąź — kod z sekretami nie jest ruchomy', () => {
    expect(WF).toMatch(/SKRYPTY_REF: '?[0-9a-f]{40}'?\s*(#.*)?\n/);
    expect(WF).not.toMatch(/SKRYPTY_REF: '?ci\//);
  });
  test('001: workflow odrzuca ref, który nie jest pełnym SHA (także z pola ręcznego), przed pobraniem skryptów', () => {
    expect(WF).toMatch(/\^\[0-9a-f\]\{40\}\$/);
    expect(WF.indexOf('{40}')).toBeGreaterThan(-1);
    expect(WF.indexOf('{40}')).toBeLessThan(WF.indexOf('repository: lkarwowski494/trening'));
  });
  test('002: ID raportu w formacie Apple r142-<UUID> nie trafia do logu błędu HTTP', () => {
    const p: any = pipeline();
    p.routes['GET /v1/analyticsReportRequests/REQID-SECRET/reports'].body.data[1].id = 'r142-0a1b2c3d-1111-2222-3333-444455556666';
    p.routes['GET /v1/analyticsReports/r142-0a1b2c3d-1111-2222-3333-444455556666/instances'] = BLAD500;
    const r = drive('analityka.mjs', p);
    expect(r.code).toBe(1);
    expect(r.out).toContain('500');
    bezWycieku(r.out);
  });
  test('003/M1: treść odpowiedzi błędu HTTP (detail, meta) nie trafia do logu', () => {
    const p: any = pipeline(); p.routes['GET /v1/analyticsReports/REPS/instances'] = BLAD500;
    const r = drive('analityka.mjs', p);
    expect(r.code).toBe(1);
    bezWycieku(r.out);
  });
  test('003/M5: zła suma kontrolna — w logu nie ma treści segmentu', () => {
    const p: any = pipeline();
    p.segments['/s1'] = b64(disc([D_ROW('2026-11-20', 'POL', 'Page view', 'App Store search', 10, 8)])); // jawny TSV (nie gzip), żeby wyciek był widoczny w tekście
    p.routes['GET /v1/analyticsReportInstances/I1/segments'].body.data[0].attributes.checksum = '0'.repeat(32);
    const r = drive('analityka.mjs', p);
    expect(r.code).toBe(1);
    bezWycieku(r.out);
    expect(r.out).not.toContain('Counts');
  });
  test('003/M7: w logu błędu ogólnego nie ma identyfikatora aplikacji (błąd po znalezieniu aplikacji)', () => {
    const r = drive('analityka.mjs', { routes: { ...APP, 'GET /v1/apps/APPID-SECRET/analyticsReportRequests': BLAD500 } });
    expect(r.code).toBe(1);
    bezWycieku(r.out);
  });
  test('003/M4: po błędzie POST (500) dokładnie jeden POST — brak ponowienia zapisu', () => {
    const r = drive('analityka.mjs', { zapisz: true, routes: { ...APP, ...REQS([]), 'POST /v1/analyticsReportRequests': BLAD500 } });
    expect(r.code).toBe(1);
    expect(r.calls.filter(c => c.m === 'POST')).toHaveLength(1);
    bezWycieku(r.out);
  });
  test('003: po błędzie 403 POST też dokładnie jeden', () => {
    const r = drive('analityka.mjs', { zapisz: true, routes: { ...APP, ...REQS([]), 'POST /v1/analyticsReportRequests': { status: 403, body: { errors: [{ code: 'FORBIDDEN', title: 'rola' }] } } } });
    expect(r.calls.filter(c => c.m === 'POST')).toHaveLength(1);
  });
  test('003/M6: na-zywo używa wyłącznie klienta tylko-do-odczytu (c = readOnlyClient(client), brak innych odwołań do client w run)', () => {
    const poczatek = NAZYWO.indexOf('const c = readOnlyClient(client);');
    expect(poczatek).toBeGreaterThan(-1);
    const cialo = NAZYWO.slice(poczatek, NAZYWO.indexOf('async function main'));
    expect(cialo.replace('readOnlyClient(client)', '')).not.toMatch(/\bclient\b/);
  });
  test('003/M6: na-zywo — błędy API nie ujawniają danych w logu', () => {
    const r = drive('na-zywo.mjs', { routes: { ...APP, 'GET /v1/apps/APPID-SECRET/appStoreVersions': BLAD500 } });
    expect(r.code).toBe(1);
    bezWycieku(r.out);
  });
  test('004: kolumna sumowana po urządzeniach nazywa się unique_counts_suma_urzadzen (nie twierdzi „unikalne” bez zastrzeżenia)', () => {
    const r = drive('analityka.mjs', pipeline());
    expect(r.files['discovery.csv'].split('\n')[0]).toContain('unique_counts_suma_urzadzen');
    expect(r.files['discovery.csv'].split('\n')[0]).not.toMatch(/(^|,)unique_counts(,|$)/);
  });
});

describe('KO-121 (c) scripts/asc/recenzje.mjs: recenzje klientów (tylko GET, bez pseudonimów)', () => {
  const REV = (id: string, rating: number, date: string, ter = 'POL') => ({ id, attributes: { rating, title: 'Tytul-SEKRET ' + id, body: 'Tresc-SEKRET\nw dwoch liniach, z "cudzyslowem"', reviewerNickname: 'NICK-SEKRET', territory: ter, createdDate: date } });
  const sc = (extra: object = {}) => ({ routes: { ...APP,
    'GET /v1/apps/APPID-SECRET/customerReviews': { body: { data: [REV('REV1', 5, '2026-11-20T10:00:00Z'), REV('REV2', 2, '2026-11-21T08:00:00Z', 'CZE')] } },
    'GET /v1/apps/APPID-SECRET/customerReviewSummarizations': { body: { data: [{ id: 'SUM1', attributes: { createdDate: '2026-11-21T00:00:00Z', locale: 'pl', platform: 'IOS', text: 'Streszczenie-SEKRET' } }] } },
    ...extra } });

  test('zapisuje recenzje bez pseudonimu (najnowsze pierwsze) i streszczenia; w logu same liczby', () => {
    const r = drive('recenzje.mjs', sc());
    expect(r.code).toBe(0);
    const j = JSON.parse(r.files['recenzje.json']);
    expect(j.map((x: any) => x.id)).toEqual(['REV2', 'REV1']);
    expect(j[1]).toEqual({ id: 'REV1', data: '2026-11-20', terytorium: 'POL', ocena: 5, tytul: 'Tytul-SEKRET REV1', tresc: 'Tresc-SEKRET\nw dwoch liniach, z "cudzyslowem"' });
    expect(JSON.stringify(r.files)).not.toContain('NICK-SEKRET');
    expect(JSON.parse(r.files['streszczenia-recenzji.json'])).toEqual([{ locale: 'pl', platforma: 'IOS', data: '2026-11-21', tekst: 'Streszczenie-SEKRET' }]);
    expect(r.calls.every(c => c.m === 'GET')).toBe(true);
    for (const z of ['SEKRET', 'NICK', 'POL', 'CZE', 'APPID', 'Tytul']) expect(r.out).not.toContain(z);
    expect(r.out).toContain('recenzji: 2 (nowych: 2)');
  });
  test('kolejny przebieg scala po id: stare zostają, powtórzone aktualizowane, „nowych” liczy tylko nieznane', () => {
    const stare = JSON.stringify([{ id: 'REV0', data: '2026-10-01', terytorium: 'DEU', ocena: 4, tytul: 't', tresc: 'b' }, { id: 'REV1', data: '2026-11-20', terytorium: 'POL', ocena: 1, tytul: 'stary', tresc: 'stary' }]);
    const r = drive('recenzje.mjs', { ...sc(), preFiles: { 'recenzje.json': stare } });
    const j = JSON.parse(r.files['recenzje.json']);
    expect(j.map((x: any) => x.id)).toEqual(['REV2', 'REV1', 'REV0']);
    expect(j.find((x: any) => x.id === 'REV1').ocena).toBe(5);
    expect(r.out).toContain('recenzji: 3 (nowych: 1)');
  });
  test('stronicowanie: links.next jest śledzone; streszczenia niedostępne nie przerywają przebiegu', () => {
    const r = drive('recenzje.mjs', sc({
      'GET /v1/apps/APPID-SECRET/customerReviews': [{ body: { data: [REV('REV1', 5, '2026-11-20T10:00:00Z')], links: { next: 'https://api.appstoreconnect.apple.com/v1/apps/APPID-SECRET/customerReviews?cursor=2' } } }, { body: { data: [REV('REV2', 2, '2026-11-21T08:00:00Z')] } }],
      'GET /v1/apps/APPID-SECRET/customerReviewSummarizations': { status: 404, body: { errors: [] } } }));
    expect(r.code).toBe(0);
    expect(JSON.parse(r.files['recenzje.json'])).toHaveLength(2);
    expect(r.out).toContain('Streszczenia recenzji: niedostępne');
    expect(r.files['streszczenia-recenzji.json']).toBeUndefined();
  });
  test('błąd API (500 ze szczegółami): kod 1, w logu bez danych i identyfikatorów', () => {
    const r = drive('recenzje.mjs', sc({ 'GET /v1/apps/APPID-SECRET/customerReviews': { status: 500, body: { errors: [{ code: 'X', title: 'T', detail: 'Tresc-SEKRET POL' }] } } }));
    expect(r.code).toBe(1);
    for (const z of ['SEKRET', 'POL', 'APPID']) expect(r.out).not.toContain(z);
  });
  test('skrypt: tylko readOnlyClient, żadnych POST/PATCH/DELETE, pseudonim nie jest odczytywany', () => {
    expect(RECENZJE).toContain('readOnlyClient');
    expect(RECENZJE).not.toMatch(/'POST'|'PATCH'|'DELETE'|reviewerNickname/);
  });
});

describe('KO-121 (d) scripts/asc/ceny.mjs: ceny subskrypcji i planu dożywotniego (tylko GET)', () => {
  const POINT = (id: string, price: string, proceeds: string, type = 'subscriptionPricePoints') => ({ type, id, attributes: { customerPrice: price, proceeds, proceedsYear2: proceeds } });
  const PRICE = (id: string, pp: string, ter: string, rel = 'subscriptionPricePoint') => ({ id, attributes: rel === 'subscriptionPricePoint' ? { startDate: '2026-10-01', preserved: false } : { manual: true, startDate: null, endDate: null }, relationships: { [rel]: { data: { id: pp } }, territory: { data: { id: ter } } } });
  const sc = (extra: object = {}) => ({ routes: { ...APP,
    'GET /v1/subscriptionGroups/22474799/subscriptions': { body: { data: [
      { id: 'SUB-M', attributes: { productId: 'pl.lukasz.trening.full.monthly', name: 'Miesieczna', state: 'APPROVED', subscriptionPeriod: 'ONE_MONTH' } },
      { id: 'SUB-Y', attributes: { productId: 'pl.lukasz.trening.full.yearly', name: 'Roczna', state: 'APPROVED', subscriptionPeriod: 'ONE_YEAR' } }] } },
    'GET /v1/subscriptions/SUB-M/prices': { body: { data: [PRICE('P1', 'PP1', 'POL')], included: [POINT('PP1', '4.99', '3.50')] } },
    'GET /v1/subscriptions/SUB-Y/prices': { body: { data: [PRICE('P2', 'PP2', 'POL'), PRICE('P3', 'PP3', 'CZE')], included: [POINT('PP2', '19.99', '14.00'), POINT('PP3', '99.00', '70.00')] } },
    'GET /v1/apps/APPID-SECRET/inAppPurchasesV2': { body: { data: [{ id: 'IAP1', attributes: { productId: 'pl.lukasz.trening.full.lifetime', name: 'Dozywotni', state: 'APPROVED', inAppPurchaseType: 'NON_CONSUMABLE' } }] } },
    'GET /v2/inAppPurchases/IAP1/iapPriceSchedule': { body: { data: { id: 'SCH1' } } },
    'GET /v1/inAppPurchasePriceSchedules/SCH1/manualPrices': { body: { data: [PRICE('IP1', 'IPP1', 'POL', 'inAppPurchasePricePoint')], included: [POINT('IPP1', '59.99', '42.00', 'inAppPurchasePricePoints')] } },
    'GET /v1/inAppPurchasePriceSchedules/SCH1/automaticPrices': { body: { data: [] } },
    ...extra } });

  test('zapisuje ceny subskrypcji i planu dożywotniego (kwota z punktu cenowego), w logu tylko liczności', () => {
    const r = drive('ceny.mjs', sc());
    expect(r.code).toBe(0);
    const j = JSON.parse(r.files['ceny.json']);
    const miesieczna = j.produkty.find((x: any) => x.productId === 'pl.lukasz.trening.full.monthly');
    expect(miesieczna).toMatchObject({ rodzaj: 'subskrypcja', okres: 'ONE_MONTH', stan: 'APPROVED' });
    expect(miesieczna.ceny).toEqual([{ terytorium: 'POL', cena_klienta: '4.99', dochod: '3.50', start: '2026-10-01', reczna: null }]);
    expect(j.produkty.find((x: any) => x.productId === 'pl.lukasz.trening.full.yearly').ceny.map((c: any) => `${c.terytorium}:${c.cena_klienta}`)).toEqual(['CZE:99.00', 'POL:19.99']);
    const dozywotni = j.produkty.find((x: any) => x.productId === 'pl.lukasz.trening.full.lifetime');
    expect(dozywotni).toMatchObject({ rodzaj: 'iap' });
    expect(dozywotni.ceny).toEqual([{ terytorium: 'POL', cena_klienta: '59.99', dochod: '42.00', start: null, reczna: true }]);
    expect(r.calls.every(c => c.m === 'GET')).toBe(true);
    expect(r.calls.find(c => c.p.startsWith('/v1/subscriptions/SUB-M/prices'))?.p).toContain('include=subscriptionPricePoint');
    for (const z of ['4.99', '59.99', 'POL', 'APPID', 'Miesieczna']) expect(r.out).not.toContain(z);
    expect(r.out).toContain('produktów: 3');
    expect(r.out).toContain('cen: 4');
  });
  test('stronicowanie cen (links.next) i brak planu dożywotniego w ASC (log, nie błąd)', () => {
    const r = drive('ceny.mjs', sc({
      'GET /v1/subscriptions/SUB-M/prices': [{ body: { data: [PRICE('P1', 'PP1', 'POL')], included: [POINT('PP1', '4.99', '3.50')], links: { next: 'https://api.appstoreconnect.apple.com/v1/subscriptions/SUB-M/prices?cursor=2' } } }, { body: { data: [PRICE('P9', 'PP9', 'DEU')], included: [POINT('PP9', '5.49', '3.80')] } }],
      'GET /v1/apps/APPID-SECRET/inAppPurchasesV2': { body: { data: [] } } }));
    expect(r.code).toBe(0);
    const j = JSON.parse(r.files['ceny.json']);
    expect(j.produkty.find((x: any) => x.productId === 'pl.lukasz.trening.full.monthly').ceny).toHaveLength(2);
    expect(j.produkty.find((x: any) => x.productId === 'pl.lukasz.trening.full.lifetime')).toBeUndefined();
    expect(r.out).toContain('Plan dożywotni: brak w App Store Connect');
  });
  test('błąd API: kod 1 bez danych w logu', () => {
    const r = drive('ceny.mjs', sc({ 'GET /v1/subscriptions/SUB-M/prices': { status: 500, body: { errors: [{ code: 'X', title: 'T', detail: '4.99 POL SEKRET' }] } } }));
    expect(r.code).toBe(1);
    for (const z of ['SEKRET', '4.99', 'POL', 'APPID', 'SUB-M']) expect(r.out).not.toContain(z);
  });
  test('skrypt: tylko readOnlyClient, żadnych POST/PATCH/DELETE', () => {
    expect(CENY).toContain('readOnlyClient');
    expect(CENY).not.toMatch(/'POST'|'PATCH'|'DELETE'/);
  });
});

describe('KO-121 (d) analityka.mjs: raporty Commerce (zakupy, stan i zdarzenia subskrypcji) w istniejącym żądaniu ONGOING', () => {
  const ZAK = ['Date\tApp Name\tPurchase Type\tContent Name\tPayment Method\tDevice\tSource Type\tPage Type\tTerritory\tPurchases\tProceeds in USD\tSales in USD\tPaying Users',
    '2026-11-20\tRepsGoat\tSubscription\tMiesieczna\tCard\tiPhone\tApp Store search\tProduct page\tPOL\t2\t0.1\t0.2\t2', '2026-11-20\tRepsGoat\tSubscription\tMiesieczna\tCard\tiPad\tApp Store search\tProduct page\tPOL\t1\t0.2\t0.1\t1'].join('\n');
  const STAN = ['Date\tApp Name\tState Metric\tSubscription Name\tSubscription Duration\tBilling Frequency\tOffer Type\tAuto-Renew Status\tCancellation Reason\tTerritory\tCounts', '2026-11-20\tRepsGoat\tActive\tMiesieczna\t1 Month\tMonthly\tNone\tOn\tNone\tPOL\t7'].join('\n');
  const ZDR = ['Event Date\tApp Name\tEvent Sub Type\tEvent Grouping\tSubscription Name\tSubscription Duration\tOffer Type\tCancellation Reason\tApp Download Source Type\tTerritory\tCounts', '2026-11-19\tRepsGoat\tRenew\tRenewals\tMiesieczna\t1 Month\tNone\tNone\tApp Store search\tPOL\t3'].join('\n');
  const sc = () => {
    const raporty = [['RZ', 'App Store Purchases Standard'], ['RS', 'App Store Subscription State Standard'], ['RE', 'App Store Subscription Event Standard']];
    const routes: any = { ...APP, ...REQS([REQ_ON]), 'GET /v1/analyticsReportRequests/REQID-SECRET/reports': { body: { data: raporty.map(([id, name]) => ({ id, attributes: { name, category: 'COMMERCE' } })) } } };
    const segments: any = {};
    [['RZ', ZAK], ['RS', STAN], ['RE', ZDR]].forEach(([id, txt]) => {
      routes[`GET /v1/analyticsReports/${id}/instances`] = { body: { data: [{ id: 'I' + id, attributes: { granularity: 'DAILY', processingDate: '2026-11-22' } }] } };
      const buf = Buffer.from(txt);
      routes[`GET /v1/analyticsReportInstances/I${id}/segments`] = { body: { data: [{ id: 'S' + id, attributes: { url: 'https://seg.example/' + id, checksum: md5(buf) } }] } };
      segments['/' + id] = b64(buf);
    });
    return { routes, segments };
  };
  test('zakupy: sumowanie po urządzeniach bez Paying Users (nie sumowalne), kwoty zaokrąglone; stan i zdarzenia z Event Date jako date', () => {
    const r = drive('analityka.mjs', sc());
    expect(r.code).toBe(0);
    const z = r.files['zakupy.csv'].trim().split('\n');
    expect(z[0]).toBe('date,territory,purchase_type,content_name,payment_method,source_type,page_type,purchases,proceeds_in_usd,sales_in_usd');
    expect(z[1]).toBe('2026-11-20,POL,Subscription,Miesieczna,Card,App Store search,Product page,3,0.3,0.3');
    expect(r.files['zakupy.csv']).not.toContain('paying');
    expect(r.files['subskrypcje-stan.csv'].trim().split('\n')[1]).toBe('2026-11-20,POL,Active,Miesieczna,1 Month,Monthly,None,On,None,7');
    const e = r.files['subskrypcje-zdarzenia.csv'].trim().split('\n');
    expect(e[0]).toBe('date,territory,event_sub_type,event_grouping,subscription_name,subscription_duration,offer_type,cancellation_reason,app_download_source_type,counts');
    expect(e[1]).toBe('2026-11-19,POL,Renew,Renewals,Miesieczna,1 Month,None,None,App Store search,3');
    for (const z2 of ['POL', 'Miesieczna', 'RepsGoat', 'seg.example']) expect(r.out).not.toContain(z2);
    expect(r.calls.filter(c => c.m !== 'GET')).toHaveLength(0);
  });
});
