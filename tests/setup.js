/* Wspólne atrapy modułów natywnych dla testów (jest-expo). Stan atrap jest globalny, żeby testy mogły nim sterować. */
global.__kv = new Map();          // zawartość „SQLite”
global.__dbFail = false;          // wymuszenie błędu zapisu
global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }];
global.__alerts = [];             // wywołania Alert.alert / Alert.prompt
global.__notifications = [];      // zaplanowane powiadomienia
global.__la = [];                 // wywołania Live Activity

jest.mock('expo-sqlite', () => ({
  openDatabaseAsync: async () => ({
    execAsync: async () => {},
    getFirstAsync: async (_q, k) => (global.__kv.has(k) ? { v: global.__kv.get(k) } : null),
    runAsync: async (_q, k, v) => { const f = global.__dbFail; if (typeof f === 'function' ? f(k, _q) : f) throw new Error('disk full'); if (/^\s*DELETE/i.test(_q)) global.__kv.delete(k); else global.__kv.set(k, v); }, /* runda 71: __dbFail może być funkcją (k, zapytanie) — awaria tylko wybranego klucza */
  }),
}));
jest.mock('expo-localization', () => ({ getLocales: () => global.__locales }));
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: async () => ({ granted: true }),
  requestPermissionsAsync: async () => ({ granted: true }),
  scheduleNotificationAsync: async (req) => { global.__notifications.push(req); return 'n' + global.__notifications.length; },
  cancelScheduledNotificationAsync: async () => {},
  getAllScheduledNotificationsAsync: async () => [],
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval', DATE: 'date', WEEKLY: 'weekly' },
}));
jest.mock('expo-haptics', () => ({ notificationAsync: async () => {}, selectionAsync: async () => {}, impactAsync: async () => {}, NotificationFeedbackType: { Success: 'success' }, ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('expo-keep-awake', () => ({ activateKeepAwakeAsync: jest.fn(async () => {}), deactivateKeepAwake: jest.fn(async () => {}) }));
jest.mock('expo-file-system', () => ({ cacheDirectory: 'file:///cache/', documentDirectory: 'file:///doc/', get bundleDirectory() { return global.__bundleDir ?? null; } /* runda 83: getter — `import * as` kopiuje wartości, test ustawia global.__bundleDir */, makeDirectoryAsync: jest.fn(async () => {}), readDirectoryAsync: jest.fn(async () => []), deleteAsync: jest.fn(async () => {}), writeAsStringAsync: jest.fn(async () => {}), readAsStringAsync: jest.fn(async () => ''), getInfoAsync: jest.fn(async () => ({ exists: false })), copyAsync: jest.fn(async () => {}), EncodingType: { UTF8: 'utf8', Base64: 'base64' } }));
jest.mock('expo-sharing', () => ({ isAvailableAsync: async () => true, shareAsync: jest.fn(async () => {}) }));
jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn(async () => ({ canceled: true })) }));
jest.mock('@kingstinct/react-native-healthkit', () => ({ default: { isHealthDataAvailable: async () => false, requestAuthorization: async () => false, saveWorkoutSample: async () => false } }), { virtual: true });
jest.mock('@/modules/rest-activity', () => ({
  isSupported: () => false,
  start: jest.fn(async (...a) => { global.__la.push(['start', ...a]); return false; }),
  update: jest.fn(async (...a) => { global.__la.push(['update', ...a]); return false; }),
  end: jest.fn(async () => { global.__la.push(['end']); return false; }),
}));

const { Alert } = require('react-native');
Alert.alert = jest.fn((title, msg, buttons) => { global.__alerts.push({ title, msg, buttons }); });
Alert.prompt = jest.fn((title, msg, buttons, type, def) => { global.__alerts.push({ title, msg, buttons, prompt: true, def }); });

// Ostrzeżenia „not wrapped in act” pochodzą z testów wołających store bezpośrednio (nie z aplikacji) — wyciszone,
// żeby log był czytelny. Pozostałe console.error przechodzą (C9 sprawdza je jawnie).
const origError = console.error;
console.error = (...a) => { if (/not wrapped in act/.test(String(a[0]))) return; origError(...a); };

// ActionSheetIOS (menu serii): zapamiętujemy wywołania, test wybiera opcję przez global.__pickSheet(i).
global.__sheets = [];
const RN = require('react-native');
RN.ActionSheetIOS.showActionSheetWithOptions = jest.fn((opts, cb) => { global.__sheets.push({ opts, cb }); });
global.__pickSheet = (i) => { const s = global.__sheets[global.__sheets.length - 1]; if (!s) throw new Error('no action sheet'); s.cb(i); };
