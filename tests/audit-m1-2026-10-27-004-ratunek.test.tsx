/*
 * M1-audytor-generalny-004 (audyt 1.0, 27.10.2026; 12-niezawodnosc-002): ekran błędu startu ostrzega, że usunięcie aplikacji skasuje dane i kopie,
 * a przy bazie, która się nie otwiera, „Wyślij dane” zapisuje komplet plików bazy (baza + dziennik) w Pliki → Backup → Rescue-… (decyzja właściciela
 * 27.10.2026, wariant „folder w Plikach”). Oryginał tylko czytany. Rodzaje (docs/20): ekran, języki (komplet słowników), dane (prawdziwy SQLite w trybie WAL:
 * kopia kompletna, integrity_check, liczności przed i po, oryginał bez zmian), regresja.
 */
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as crypto from 'crypto';
import { DatabaseSync } from 'node:sqlite';
import * as FS from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { t, appName, applyLang } from '@/lib/i18n';
import { rescueDbCopy, DB_FILES } from '@/lib/rescue';
import { exportStartDataDetailed } from '@/lib/backup';
import { renderApp, flushAll, screen, tap } from './app';

const WARN = 'Nie usuwaj aplikacji — razem z nią znikną dane i kopie. Najpierw stuknij „Wyślij dane” i zapisz plik poza telefonem.';
const LOCALES = path.join(__dirname, '..', 'lib', 'locales');
const sha = (f: string) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
afterEach(() => { (global as any).__dbOpenFail = false; applyLang('pl'); delete (global as any).__dbDir;
  for (const f of ['getInfoAsync', 'makeDirectoryAsync', 'copyAsync', 'readDirectoryAsync'] as const) (FS[f] as jest.Mock).mockReset();
  (FS.getInfoAsync as jest.Mock).mockImplementation(async () => ({ exists: false })); (FS.readDirectoryAsync as jest.Mock).mockImplementation(async () => []); });

describe('M1-004: ostrzeżenie na ekranie błędu startu', () => {
  test('PL: ostrzeżenie widoczne nad „Wyślij dane”', async () => {
    (global as any).__dbOpenFail = true; await renderApp(); await flushAll(10);
    expect(screen.getByTestId('start-error-warning').props.children).toBe(WARN);
  });
  test('wszystkie słowniki mają ostrzeżenie i oba teksty komunikatu o kopii (treść krytyczna: dane)', () => {
    const keys = [WARN, 'Kopia bazy w Plikach', 'Pliki → Na moim iPhonie → {app} → Backup → {folder}. Zapisz ten folder poza telefonem.'];
    for (const f of fs.readdirSync(LOCALES).filter(x => x.endsWith('.json') && !x.startsWith('_'))) {
      const d = JSON.parse(fs.readFileSync(path.join(LOCALES, f), 'utf8'));
      for (const k of keys) expect([f, k, typeof d[k] === 'string' && d[k].length > 0]).toEqual([f, k, true]);
      expect([f, d[keys[2]].includes('{app}') && d[keys[2]].includes('{folder}')]).toEqual([f, true]);
    }
  });
});

describe('M1-004: kopia ratunkowa plików bazy (prawdziwy SQLite, tryb WAL)', () => {
  test('komplet plików: kopia ma integrity_check = ok i tyle samo wierszy; sama baza bez dziennika gubi wiersze; oryginał bez zmian', async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ratunek-')); const src = path.join(tmp, 'Library', 'SQLite'); const doc = path.join(tmp, 'doc'); fs.mkdirSync(src, { recursive: true });
    const db = new DatabaseSync(path.join(src, 'trening.db')); db.exec('PRAGMA journal_mode=WAL; PRAGMA wal_autocheckpoint=0; CREATE TABLE kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
    const ins = db.prepare('INSERT INTO kv (k, v) VALUES (?, ?)'); for (let i = 0; i < 200; i++) ins.run(`k${i}`, 'x'.repeat(100));
    expect(fs.existsSync(path.join(src, 'trening.db-wal'))).toBe(true); /* zapisy w dzienniku, nie w pliku bazy (połączenie otwarte jak w aplikacji, która padła) */
    const before = new Map(fs.readdirSync(src).map(f => [f, sha(path.join(src, f))]));
    const real = (u: string) => u.replace('file:///doc/', doc + '/').replace(/^file:\/\//, '');
    (FS.getInfoAsync as jest.Mock).mockImplementation(async (u: string) => ({ exists: fs.existsSync(real(u)) }));
    (FS.makeDirectoryAsync as jest.Mock).mockImplementation(async (u: string) => { fs.mkdirSync(real(u), { recursive: true }); });
    const name = await rescueDbCopy(new Date(2026, 9, 27, 21, 5), src, async (a, b) => { fs.copyFileSync(real(a), real(b)); });
    expect(name).toBe('Rescue-2026-10-27-2105');
    const out = path.join(doc, 'Backup', name!); expect(fs.readdirSync(out).sort()).toEqual(fs.readdirSync(src).filter(f => (DB_FILES as readonly string[]).includes(f)).sort());
    const copy = new DatabaseSync(path.join(out, 'trening.db'));
    expect((copy.prepare('PRAGMA integrity_check').get() as any).integrity_check).toBe('ok'); expect((copy.prepare('SELECT COUNT(*) AS n FROM kv').get() as any).n).toBe(200); copy.close();
    const only = path.join(tmp, 'only'); fs.mkdirSync(only); fs.copyFileSync(path.join(src, 'trening.db'), path.join(only, 'trening.db'));
    const bare = new DatabaseSync(path.join(only, 'trening.db')); let n = -1; try { n = (bare.prepare('SELECT COUNT(*) AS n FROM kv').get() as any).n; } catch { n = -1; } bare.close();
    expect(n).not.toBe(200); /* dlatego kopiujemy też -wal i -shm */
    expect(new Map(fs.readdirSync(src).map(f => [f, sha(path.join(src, f))]))).toEqual(before); db.close();
  });
  test('brak pliku bazy, brak katalogu bazy (web) albo błąd kopiowania → null, bez wyjątku', async () => {
    expect(await rescueDbCopy(new Date(), undefined)).toBeNull();
    expect(await rescueDbCopy(new Date(), '/nie/ma')).toBeNull();
    (FS.getInfoAsync as jest.Mock).mockImplementation(async () => ({ exists: true }));
    expect(await rescueDbCopy(new Date(), '/c/Library/SQLite', async () => { throw new Error('EACCES'); })).toBeNull();
  });
  test('ekran: baza się nie otwiera, brak kopii w puli → „Wyślij dane” zapisuje folder Rescue-… i podaje miejsce w Plikach', async () => {
    (global as any).__dbDir = '/c/Documents/SQLite';
    (FS.getInfoAsync as jest.Mock).mockImplementation(async (u: string) => ({ exists: /Library\/SQLite\/trening\.db$/.test(u) }));
    (global as any).__dbOpenFail = true; await renderApp(); await flushAll(10); (Sharing.shareAsync as jest.Mock).mockClear();
    await tap(screen.getByText(t('Wyślij dane'))); await flushAll(20);
    expect((FS.copyAsync as jest.Mock).mock.calls.map(c => c[0])).toEqual([{ from: 'file:///c/Library/SQLite/trening.db', to: expect.stringMatching(/^file:\/\/\/doc\/Backup\/Rescue-\d{4}-\d{2}-\d{2}-\d{4}\/trening\.db$/) }]);
    const a = global.__alerts.at(-1)!; expect(a.title).toBe('Kopia bazy w Plikach'); expect(a.msg).toMatch(new RegExp(`^Pliki → Na moim iPhonie → ${appName()} → Backup → Rescue-`));
    expect(global.__alerts.some(x => x.title === t('Nie udało się wysłać danych'))).toBe(false);
  });
});

describe('M1-004: funkcje (logika, wymiar)', () => {
  test('DB_FILES: baza i wszystkie pliki dziennika SQLite (WAL i rollback)', () => {
    expect([...DB_FILES]).toEqual(['trening.db', 'trening.db-wal', 'trening.db-shm', 'trening.db-journal']);
  });
  test('exportStartDataDetailed: baza nie otwiera się, brak katalogu bazy i kopii w puli → { ok: false, rescue: null }', async () => {
    (global as any).__dbOpenFail = true; await renderApp(); await flushAll(10);
    expect(await exportStartDataDetailed()).toEqual({ ok: false, rescue: null });
  });
});

