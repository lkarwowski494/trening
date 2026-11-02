/* Przejścia czasu (zmiana czasu letniego/zimowego) liczone z bazy stref systemu (Intl), nie wpisane na sztywno (07-jakosc-006, 01.11.2026).
 * Jedno miejsce dla testów (tests/matrix-time.test.ts, tests/nocne-workflowy.test.ts) i dla workflowu (.github/workflows/tests-tz.yml, zadanie „chwile”):
 *   node scripts/ci/przejscia-czasu.js macierz [rok]   → JSON: ["strefa|chwila ISO UTC", …] (domyślnie rok UTC + 1, zawsze PRZYSZŁY)
 * Moduł jest w CommonJS, bo używa go też Jest (bez transformacji .mjs). */
const MIN = 60e3, H = 3600e3, DAY = 86400e3;
/** Strefy i rodzaje chwil w macierzy „zmiana-czasu” (kolejność = kolejność zadań): Europa jesienią i wiosną, USA jesienią oraz
 *  „poniedzialek” = pierwszy poniedziałek roku, 00:30 czasu lokalnego (L-084, wariant A, 02.11.2026: start „Date.now() − 1 h” wypada wtedy w poprzednim tygodniu). */
const CHWILE_MACIERZY = [['Europe/Warsaw', 'jesien'], ['Europe/Warsaw', 'wiosna'], ['America/Los_Angeles', 'jesien'], ['Europe/Warsaw', 'poniedzialek']];
const PONIEDZIALEK_MIN_PO_PRZEDZIE = 30;
/** Ile po przejściu przypinamy „teraz” (0,5–3 h: w strefie jest już nowe przesunięcie, a start sprzed kilku godzin wypada w starym). */
const PO_PRZEJSCIU_MIN = 90;
const fmtCache = new Map();
function fmt(strefa) {
  if (!fmtCache.has(strefa)) fmtCache.set(strefa, new Intl.DateTimeFormat('en-US', { timeZone: strefa, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }));
  return fmtCache.get(strefa);
}
function sciana(ts, strefa) { const p = {}; for (const x of fmt(strefa).formatToParts(new Date(ts))) p[x.type] = x.value; return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second }; }
/** Przesunięcie strefy w minutach (czas lokalny − UTC) w chwili ts. */
function przesuniecieMin(ts, strefa) { const w = sciana(ts, strefa); return (Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s) - Math.floor(ts / 1000) * 1000) / MIN; }
/**
 * Przejścia przesunięcia strefy w roku lokalnym `rok`: [{ at (ms UTC pierwszej chwili po przejściu), before, after (minuty), data ('RRRR-MM-DD' lokalna) }].
 * Skanuje co godzinę, potem dzieli do minuty. Strefa bez zmiany czasu → [].
 */
function przejsciaCzasu(rok, strefa) {
  const out = []; const od = Date.UTC(rok, 0, 1) - DAY, doo = Date.UTC(rok + 1, 0, 1) + DAY;
  let prev = przesuniecieMin(od, strefa);
  for (let t = od + H; t < doo; t += H) {
    const o = przesuniecieMin(t, strefa); if (o === prev) continue;
    let lo = t - H, hi = t; while (hi - lo > MIN) { const mid = lo + Math.floor((hi - lo) / (2 * MIN)) * MIN; if (przesuniecieMin(mid, strefa) === prev) lo = mid; else hi = mid; }
    const w = sciana(hi, strefa);
    if (w.y === rok) out.push({ at: hi, before: prev, after: o, data: `${w.y}-${String(w.mo).padStart(2, '0')}-${String(w.d).padStart(2, '0')}` });
    prev = o;
  }
  return out;
}
/** Pierwszy poniedziałek roku lokalnego `rok` o 00:30 czasu strefy (ms UTC). Styczeń: bez zmiany czasu, więc przesunięcie z południa tego dnia jest stałe. */
function poniedzialekPoPolnocy(rok, strefa) {
  for (let d = 1; d <= 7; d++) {
    if (new Date(Date.UTC(rok, 0, d)).getUTCDay() !== 1) continue;
    return Date.UTC(rok, 0, d, 0, PONIEDZIALEK_MIN_PO_PRZEDZIE) - przesuniecieMin(Date.UTC(rok, 0, d, 12), strefa) * MIN;
  }
  throw new Error(`brak poniedziałku w styczniu ${rok}`);
}
const iso = ms => new Date(ms).toISOString().replace('.000Z', 'Z');
/** Pozycje macierzy „strefa|chwila UTC” dla roku `rok`: PO_PRZEJSCIU_MIN po przejściu (jesień = przesunięcie maleje, wiosna = rośnie); „poniedzialek” = 00:30 lokalnie. */
function macierzChwil(rok) {
  return CHWILE_MACIERZY.map(([strefa, rodzaj]) => {
    if (rodzaj === 'poniedzialek') return `${strefa}|${iso(poniedzialekPoPolnocy(rok, strefa))}`;
    const p = przejsciaCzasu(rok, strefa).find(x => (rodzaj === 'jesien') === (x.after < x.before));
    if (!p) throw new Error(`brak przejścia (${rodzaj}) w ${strefa} w roku ${rok}`);
    return `${strefa}|${iso(p.at + PO_PRZEJSCIU_MIN * MIN)}`;
  });
}
module.exports = { przejsciaCzasu, macierzChwil, poniedzialekPoPolnocy, CHWILE_MACIERZY, PO_PRZEJSCIU_MIN };
if (require.main === module) {
  if (process.argv[2] !== 'macierz') { console.error('użycie: node scripts/ci/przejscia-czasu.js macierz [rok]'); process.exit(2); }
  const rok = process.argv[3] ? +process.argv[3] : new Date().getUTCFullYear() + 1;
  console.log(JSON.stringify(macierzChwil(rok)));
}
