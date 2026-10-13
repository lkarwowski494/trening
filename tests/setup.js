/* Wspólne atrapy modułów natywnych dla testów (jest-expo). Stan atrap jest globalny, żeby testy mogły nim sterować. */
global.__kv = new Map();          // zawartość „SQLite”
global.__dbFail = false;          // wymuszenie błędu zapisu
global.__locales = [{ languageCode: 'pl', languageTag: 'pl-PL' }];
global.__alerts = [];             // wywołania Alert.alert / Alert.prompt
global.__notifications = [];      // zaplanowane powiadomienia
global.__cancelled = [];          // odwołane powiadomienia (identyfikatory)
global.__la = [];                 // wywołania Live Activity
/* TST2-07: ziarno fast-check z PROP_SEED (ustalone w global-setup.js; domyślnie stałe — tests/prop-seed.js) */
require('fast-check').configureGlobal({ seed: require('./prop-seed').resolvePropSeed(process.env.PROP_SEED).seed });

jest.mock('expo-sqlite', () => ({
  /* global.__dbOpenFail: baza nie otwiera się przy starcie (ekran błędu startu; T-051 — ekran powitalny nie może go zasłonić) */
  openDatabaseAsync: async () => { if (global.__dbOpenFail) throw new Error('baza nieczytelna'); return ({
    execAsync: async () => {},
    getFirstAsync: async (_q, k) => (global.__kv.has(k) ? { v: global.__kv.get(k) } : null),
    runAsync: async (_q, k, v) => { const f = global.__dbFail; if (typeof f === 'function' ? f(k, _q) : f) throw new Error('disk full'); if (/^\s*DELETE/i.test(_q)) global.__kv.delete(k); else global.__kv.set(k, v); }, /* runda 71: __dbFail może być funkcją (k, zapytanie) — awaria tylko wybranego klucza */
  }); },
}));
jest.mock('expo-localization', () => ({ getLocales: () => global.__locales }));
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  /* audyt 0.10 I1 / TST-06: stan zgody sterowany przez test (global.__notifPerm; domyślnie zgoda), prośby liczone w global.__notifPermAsked */
  getPermissionsAsync: async () => global.__notifPerm ?? { granted: true },
  requestPermissionsAsync: async () => { global.__notifPermAsked = (global.__notifPermAsked ?? 0) + 1; return global.__notifPermReq ?? global.__notifPerm ?? { granted: true }; },
  scheduleNotificationAsync: async (req) => { global.__notifications.push(req); return 'n' + global.__notifications.length; },
  cancelScheduledNotificationAsync: async (id) => { global.__cancelled.push(id); },
  getAllScheduledNotificationsAsync: async () => [],
  SchedulableTriggerInputTypes: { TIME_INTERVAL: 'timeInterval', DATE: 'date', WEEKLY: 'weekly' },
}));
jest.mock('expo-haptics', () => ({ notificationAsync: async () => {}, selectionAsync: async () => {}, impactAsync: async () => {}, NotificationFeedbackType: { Success: 'success' }, ImpactFeedbackStyle: { Light: 'light' } }));
jest.mock('expo-keep-awake', () => ({ activateKeepAwakeAsync: jest.fn(async () => {}), deactivateKeepAwake: jest.fn(async () => {}) }));
/* SDK 54: kod używa wyłącznie starego API z „expo-file-system/legacy” (główne wejście to nowe API File/Directory, a stare funkcje
 * rzucają tam w czasie działania). Import z głównego wejścia — w kodzie albo w teście — kończy się tu błędem, żeby pominięty import nie przeszedł niezauważony. */
jest.mock('expo-file-system', () => new Proxy({}, { get: (_t, k) => { throw new Error(`expo-file-system (główne wejście, „${String(k)}”): na SDK 54+ importuj z 'expo-file-system/legacy'`); } }));
jest.mock('expo-file-system/legacy', () => ({ cacheDirectory: 'file:///cache/', documentDirectory: 'file:///doc/', get bundleDirectory() { return global.__bundleDir ?? null; } /* runda 83: getter — `import * as` kopiuje wartości, test ustawia global.__bundleDir */, makeDirectoryAsync: jest.fn(async () => {}), readDirectoryAsync: jest.fn(async () => []), deleteAsync: jest.fn(async () => {}), writeAsStringAsync: jest.fn(async () => {}), readAsStringAsync: jest.fn(async () => ''), getInfoAsync: jest.fn(async () => ({ exists: false })), copyAsync: jest.fn(async () => {}), EncodingType: { UTF8: 'utf8', Base64: 'base64' } }));
jest.mock('expo-sharing', () => ({ isAvailableAsync: async () => true, shareAsync: jest.fn(async () => {}) }));
jest.mock('expo-document-picker', () => ({ getDocumentAsync: jest.fn(async () => ({ canceled: true })) }));
/* Kontrakt @kingstinct/react-native-healthkit 16.x (docs/28): isHealthDataAvailableAsync, requestAuthorization({ toRead, toShare }), authorizationStatusFor (synchroniczne),
 * saveWorkoutSample(rodzaj, próbki, start, koniec, sumy, metadane) → WorkoutProxy { uuid, dispose }; błąd zapisu = odrzucona obietnica (nie `false` jak w 8.x). */
global.__hkProxy = (uuid) => ({ uuid, dispose: jest.fn() });
jest.mock('@kingstinct/react-native-healthkit', () => ({ default: { isHealthDataAvailableAsync: async () => false, requestAuthorization: async () => false, authorizationStatusFor: () => 0, saveWorkoutSample: async () => { throw new Error('HealthKit niedostępny'); },
  /* 0.16.0 (odczyt, docs/29): domyślnie puste odpowiedzi; dane do testów — tests/health-world.ts (kontrakt 16.x przeczytany w paczce: queryStatisticsCollectionForQuantity, queryWorkoutSamples, deleteObjects, currentAppSource) */
  queryStatisticsCollectionForQuantity: async () => [], queryWorkoutSamples: async () => [], deleteObjects: async () => 0, currentAppSource: () => ({ name: 'Trening', bundleIdentifier: 'com.test.trening' }) } }), { virtual: true });
/* 0.17.0 (docs/30): expo-iap 5.8.1 i expo-store-review — makiety z kontraktem zgodnym z build/*.d.ts paczki; stan w global.__iap / global.__review sterowany z testów.
 * Domyślnie: sklep bez produktów i bez zakupów, prośba o ocenę dostępna. Aplikacja przez nie nie przechodzi, dopóki PAYWALL.ENABLED = false. */
global.__iap = { calls: [], products: [], purchases: [], status: [], eligible: true, fail: null, purchaseError: null, listeners: { updated: [], error: [] } };
jest.mock('expo-iap', () => {
  const g = () => global.__iap; const rec = (n, a) => { g().calls.push([n, ...a]); };
  const maybeFail = () => { if (g().fail) throw new Error(g().fail); };
  return {
    initConnection: async (...a) => { rec('initConnection', a); maybeFail(); return true; },
    endConnection: async () => true,
    fetchProducts: async (...a) => { rec('fetchProducts', a); maybeFail(); return g().products; },
    requestPurchase: async (...a) => { rec('requestPurchase', a); maybeFail(); if (g().purchaseError) { const e = new Error('purchase'); e.code = g().purchaseError; throw e; } return g().purchaseResult ?? []; },
    getAvailablePurchases: async (...a) => { rec('getAvailablePurchases', a); maybeFail(); return g().purchases; },
    restorePurchases: async (...a) => { rec('restorePurchases', a); maybeFail(); },
    finishTransaction: async (...a) => { rec('finishTransaction', a); },
    purchaseUpdatedListener: (l) => { g().listeners.updated.push(l); return { remove: () => { g().listeners.updated = g().listeners.updated.filter(x => x !== l); } }; },
    purchaseErrorListener: (l) => { g().listeners.error.push(l); return { remove: () => { g().listeners.error = g().listeners.error.filter(x => x !== l); } }; },
    isEligibleForIntroOfferIOS: async (...a) => { rec('isEligibleForIntroOfferIOS', a); return g().eligible; },
    subscriptionStatusIOS: async (...a) => { rec('subscriptionStatusIOS', a); maybeFail(); return g().status; },
    openRedeemOfferCode: async (...a) => { rec('openRedeemOfferCode', a); return null; },
    deepLinkToSubscriptions: async (...a) => { rec('deepLinkToSubscriptions', a); },
  };
}, { virtual: true });
global.__review = { available: true, requested: 0, fail: false };
jest.mock('expo-store-review', () => ({
  isAvailableAsync: async () => global.__review.available,
  requestReview: async () => { if (global.__review.fail) throw new Error('review'); global.__review.requested++; },
  hasAction: async () => global.__review.available,
}), { virtual: true });
jest.mock('@/modules/rest-activity', () => ({
  isSupported: () => false,
  start: jest.fn(async (...a) => { global.__la.push(['start', ...a]); return false; }),
  update: jest.fn(async (...a) => { global.__la.push(['update', ...a]); return false; }),
  end: jest.fn(async () => { global.__la.push(['end']); return false; }),
}));

/* 0.20 (docs/36): moduł głosu — atrapa sterowana z testów (global.__voice: wypowiedziane [tekst, język], liczba przerwań, słuchawki, dostępność głosu) */
global.__voice = { spoken: [], stops: 0, headphones: false, hasVoice: true };
jest.mock('@/modules/voice-cue', () => ({
  isSupported: () => true,
  hasVoice: () => global.__voice.hasVoice,
  headphonesConnected: () => global.__voice.headphones,
  speak: jest.fn(async (text, language) => { global.__voice.spoken.push([text, language]); return true; }),
  stop: jest.fn(() => { global.__voice.stops++; }),
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
/* Animacja przy starcie (components/Intro.tsx, decyzja 09.10.2026): w testach całej aplikacji wyłączona — kończy się od razu przy montowaniu,
 * żeby renderApp() dawał aplikację jak dotąd. W aplikacji jest włączona: tests/intro.test.tsx (jest.unmock) sprawdza prawdziwą nakładkę na starcie. */
jest.mock('@/components/Intro', () => { const React = require('react'); return { Intro: ({ onDone }) => { React.useEffect(() => { onDone(); }, []); return null; } }; });
