// Reguły SENSU ruchu figur v2 (docs/53, bramka 3): geometria może być poprawna, a ruch zły (bujanie w pozie poprawnej, broda pod drążkiem, dwie ręce w ćwiczeniu jednorącz).
// Dane: data/zrodla/figury-sens.json (pełne dane: reguły z odnośnikiem do wskazówki techniki i jej źródeł w cues.json; liczby = uproszczenie, chyba że zapisano inaczej; do paczki aplikacji nic nie trafia).
// Zasady stosowania: (1) poza POPRAWNA nie łamie żadnej reguły ćwiczenia; (2) każdy błąd bledy[] łamie DOKŁADNIE grupę reguł swojej wskazówki (grupy_bledow) i żadnej innej.
// Rodzina bez wpisu w danych: brak reguł (sprawdzenie pomijane). Używa walidator (v2-validate.mjs → waliduj, kod „sens” / „blad-sens”) i generator poleceń (sekcja „Reguły sensu”).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PLIK_SENS = 'data/zrodla/figury-sens.json';
const f1 = (x) => x.toFixed(1);
const zakres = (v) => ({ min: Math.min(...v), max: Math.max(...v), span: Math.max(...v) - Math.min(...v) });

export function wczytajSens(root = ROOT) {
  const p = path.join(root, PLIK_SENS);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : { rodziny: {} };
}
/** Reguły ćwiczenia: [{ id, typ, grupa, cue, parametry, zrodlo, liczba }]; null = ćwiczenie do pominięcia (powód w `pomin`), [] = brak reguł. */
export function regulyDla(rodzina, cwiczenie, root = ROOT) {
  const r = wczytajSens(root).rodziny?.[rodzina]; if (!r) return [];
  const w = r.warianty?.[cwiczenie]; let ids;
  if (w) ids = typeof w === 'string' ? r.warianty[w] : w; /* wpis w „warianty” zastępuje wszystko; [] = brak reguł */
  else if (r.wskazowki_na_reguly || r.zawsze) ids = [...new Set([...(r.zawsze ?? []), ...wskazowkiCwiczenia(cwiczenie, root).flatMap((c) => r.wskazowki_na_reguly?.[c] ?? [])])]; /* reguły rodziny + wyprowadzone ze wskazówek ćwiczenia (setup/move/tips/mistakes albo ok + err zestawu ogólnego) */
  else return [];
  return ids.map((id) => ({ id, ...r.reguly[id] }));
}
/** Ćwiczenie OTWARTE (brak źródła ruchu — bez grafiki v2 do czasu źródła): powód albo null. Generator pomija je jak `pomin`, test pokrycia liczy jako jawny wyjątek. */
/** Ćwiczenie izometryczne (decyzja koordynatora 26.10.2026): lista `izometryczne` rodziny w danych (ćwiczenie → powód); wyjątek od wymogu ruchu ≥ 8 cm. */
/** Stopa automatyczna (decyzja koordynatora 26.10.2026): w rodzinach leżących/podporowych model nie podaje kąta stopy; silnik ustawia ją neutralnie (kąt kostki ≈ 5°, nie głębiej niż podłoga). `podbicie` z odpowiedzi jest odrzucane (normalizacja przy imporcie). Lista w danych: stopa_automatyczna { rodziny, wlasna }. */
export const stopaAutomatyczna = (rodzina, cwiczenie, root = ROOT) => { const d = wczytajSens(root).stopa_automatyczna; return !!(d?.rodziny?.includes(rodzina) && !d?.wlasna?.includes(cwiczenie)); };
export function normalizuj(poza, rodzina, cwiczenie, root = ROOT) {
  if (!poza || typeof poza !== 'object' || !Array.isArray(poza.klatki) || !stopaAutomatyczna(rodzina, cwiczenie, root)) return poza;
  const q = JSON.parse(JSON.stringify(poza));
  for (const k of q.klatki) for (const sd of ['R', 'L']) if (k?.nogi?.[sd] && typeof k.nogi[sd] === 'object') delete k.nogi[sd].podbicie;
  return q;
}
export const izometryczne = (rodzina, cwiczenie, root = ROOT) => { const d = wczytajSens(root); return !!(d.izometryczne?.[cwiczenie] || d.rodziny?.[rodzina]?.izometryczne?.[cwiczenie] || d.izometryczne_kandydaci?.lista?.includes(cwiczenie)); }; /* lista badacza + rozciągania statyczne (decyzja 26.10.2026: też statyczne, jeśli opis to utrzymanie pozycji) */
/** Ćwiczenia, w których ruch to czysty obrót przedramienia: bramka „ruch ≥ 8 cm” je pomija (poza nie jest statyczna). */
export const bezBramkiRuchu = (cwiczenie, root = ROOT) => cwiczenie !== '_opis' && !!wczytajSens(root).bez_bramki_ruchu?.[cwiczenie];
/** Wyjątki ZAKRESU stawów dla ćwiczenia (jeden mechanizm dla ćwiczeń i rodzin): `rodziny.<rodzina>.zakres_wyjatki` { ćwiczenie | „*” (cała rodzina): { powod, hipMin?, ankleMin?, elbow?, shSag?, shElev? } }; wpis ćwiczenia ma pierwszeństwo przed „*”. Bez wpisu: zakresy kontraktu. Zwraca same granice (bez powodu) albo undefined. */
export const zakresWyjatek = (rodzina, cwiczenie, root = ROOT) => { const d = wczytajSens(root).rodziny?.[rodzina]?.zakres_wyjatki; const w = d && (d[cwiczenie] || d['*']); if (!w) return undefined; const { powod, ...g } = w; return g; };
/** Ćwiczenie DYNAMICZNE (wersja 1.1: lot, przechwyt, wymach): `rodziny.<rodzina>.dynamiczne` { ćwiczenie | „*” (cała rodzina): powód } w danych; limit skoku punktu w ciągłości = CONTRACT.maxJumpDynamic zamiast maxJump. Bez wpisu: zachowanie bez zmian. */
export const dynamiczne = (rodzina, cwiczenie, root = ROOT) => { const d = wczytajSens(root).rodziny?.[rodzina]?.dynamiczne; return !!(d && (d[cwiczenie] || d['*'])); };
/** Deklaracje wyjątków walidatora dla ćwiczenia, jako zdania z powodem (zakres stawów, ruch dynamiczny, bez bramki ruchu) — trafiają do polecenia dla Gemini, żeby generator wiedział, co jest dozwolone i dlaczego. */
export function deklaracjeCwiczenia(rodzina, cwiczenie, root = ROOT) {
  const d = wczytajSens(root); const r = d.rodziny?.[rodzina] ?? {}; const o = [];
  const z = r.zakres_wyjatki && (r.zakres_wyjatki[cwiczenie] || r.zakres_wyjatki['*']);
  if (z) { const { powod, ...g } = z; const nazwy = { hipMin: (v) => `biodro ≥ ${v}°`, ankleMin: (v) => `kostka ≥ ${v}°`, ankleMax: (v) => `kostka ≤ ${v}°`, elbow: (v) => `łokieć ≤ ${v}°`, shSag: (v) => `bark (płaszczyzna strzałkowa) ≤ ${v}°`, shElev: (v) => `bark (elewacja) ≤ ${v}°` }; o.push(`DEKLARACJA zakresu stawów: ${Object.entries(g).map(([k, v]) => nazwy[k]?.(v) ?? `${k} ${v}`).join(', ')} (poza zakresem kontraktu) — ${powod}`); }
  const dy = r.dynamiczne && (r.dynamiczne[cwiczenie] || r.dynamiczne['*']); if (dy) o.push(`DEKLARACJA ruchu dynamicznego (większy limit skoku punktu między klatkami) — ${dy}`);
  const bb = d.bez_bramki_ruchu?.[cwiczenie]; if (bb && cwiczenie !== '_opis') o.push(`DEKLARACJA: bramka „ruch ≥ 8 cm” nie obowiązuje (ruch to obrót przedramienia) — ${bb}`);
  return o;
}
export const otwarteDla = (rodzina, cwiczenie, root = ROOT) => wczytajSens(root).rodziny?.[rodzina]?.otwarte?.[cwiczenie] ?? null;
/** Identyfikatory wskazówek ćwiczenia: własne (lib/cues/data.json: setup/move/tips/mistakes) albo zestaw ogólny (cue-sets.json: ok). */
export function wskazowkiCwiczenia(cwiczenie, root = ROOT) {
  const pc = path.join(root, 'lib/cues/data.json'); const own = fs.existsSync(pc) ? JSON.parse(fs.readFileSync(pc, 'utf8')).exercises?.[cwiczenie] : null;
  if (own) return Object.values(own).flat().map((x) => x.c);
  const ps = path.join(root, 'lib/figures/v2/cue-sets.json'); const set = fs.existsSync(ps) ? JSON.parse(fs.readFileSync(ps, 'utf8')).items?.[cwiczenie] : null;
  return [...(set?.ok ?? []), ...(set?.err ?? [])];
}
export const bledyBezAnimacji = (rodzina, root = ROOT) => wczytajSens(root).rodziny?.[rodzina]?.bledy_bez_animacji ?? {};
export const pominiecie = (rodzina, cwiczenie, root = ROOT) => wczytajSens(root).rodziny?.[rodzina]?.pomin?.[cwiczenie] ?? null;
export const grupaBledu = (rodzina, cue, root = ROOT) => wczytajSens(root).rodziny?.[rodzina]?.grupy_bledow?.[cue] ?? null;

/** Próbki ruchu: u klatek kluczowych + siatka 0,05; dla błędu (indeks) poza z nałożoną deltą. */
function probki(v2, d, blad) {
  const us = [...new Set([...d.klatki.map((k) => k.u), ...Array.from({ length: 21 }, (_, i) => i / 20), ...(blad === undefined ? [] : d.bledy[blad].klatki.map((k) => k.u))])].sort((a, b) => a - b);
  return us.map((u) => {
    let kf = v2.poseAt(d.klatki, u); if (blad !== undefined) kf = v2.applyDelta(kf, v2.deltaAt(d.bledy[blad].klatki, u));
    return { u, kf, f: v2.keyframeFrame(d, u, blad) };
  });
}
const drazek = (d) => d.sprzet.find((g) => g.rodzaj === 'sztanga');
/** Pola kontraktu poza@2 (nazwy jak w KeyFrame/ArmData; zakresy i znaki: skeleton.ts → EXT_ROM) i rodzaj: 'tulow' (jedna wartość na klatkę) albo 'reka' (osobno dla R i L). */
export const POLA_POZA2 = { skretTulowia: 'tulow', przechylTulowia: 'tulow', przechylMiednicy: 'tulow', przechylGlowy: 'tulow', przesuniecieBoczne: 'tulow', obrotTulowia: 'tulow', uniesienieBarkow: 'reka', wysuniecieBarkow: 'reka', zgiecieNadgarstka: 'reka', obrotPrzedramienia: 'reka' };
const POLA_POZA1 = ['pochylenieTulowia', 'zgiecieKregoslupa', 'pochylenieGlowy', 'zgiecieSzyi'];
/** Wersja kontraktu jako liczba z napisu „poza@N”. */
const nrKontraktu = (t) => Number(/@(\d+)$/.exec(t ?? '')?.[1] ?? 1);
/** Czy reguła wymaga czegoś, czego kontrakt (id bieżący, np. „figury-v2/poza@2”) nie ma: wersji nowszej niż bieżąca albo pola spoza listy. Zwraca powód albo null (ćwiczenie z taką regułą czeka na kontrakt i nie dostaje polecenia). */
export function czekaNaKontrakt(regula, idKontraktu) {
  if (!regula.wymaga) return null;
  if (nrKontraktu(regula.wymaga) > nrKontraktu(idKontraktu)) return `reguła „${regula.id}” wymaga ${regula.wymaga}, a kontrakt to ${idKontraktu}`;
  const pole = regula.parametry?.pole; if (pole && !(pole in POLA_POZA2) && !POLA_POZA1.includes(pole)) return `reguła „${regula.id}” czyta pole „${pole}”, którego kontrakt nie ma`;
  return null;
}
/** Strony, których dotyczą reguły rąk: obie albo tylko ręka trzymająca drążek (ćwiczenie jednorącz: sprzet.trzyma R/L — ręka wolna nie podlega regułom rąk). */
const stronyRak = (d) => { const t = (d.sprzet ?? []).map((g) => g.trzyma).find((x) => x === 'R' || x === 'L'); return t ? [t] : ['R', 'L']; }; /* r4: ręka pracująca wynika z KAŻDEGO sprzętu z trzyma R/L (sztanga, hantel, kettlebell, linka), nie tylko ze sztangi */

/** Ewaluatory typów reguł: (ctx{v2,d,p,parametry}) → lista opisów naruszeń (pusta = reguła spełniona). */
export const EWALUATORY = {
  broda_nad_drazkiem: ({ v2, d, p, parametry: q }) => {
    const b = drazek(d); if (!b || b.y === undefined) return []; const s = p[p.length - 1]; const h = s.f.sk.head, up = s.f.sk.headUp;
    const y = h[1] - up[1] * v2.BODY.headR, need = b.y + q.margines_cm;
    return y < need ? [`broda w u = 1 jest na y = ${f1(y)} cm, a ma być ≥ ${f1(need)} cm (drążek y = ${b.y} + ${q.margines_cm}; broda = środek głowy minus ${v2.BODY.headR} cm wzdłuż osi głowy) — unieś miednicę w ostatniej klatce o co najmniej ${f1(need - y)} cm, bez przenikania drążka`] : [];
  },
  lokiec_u0: ({ v2, d, p, parametry: q }) => {
    const s = p[0]; const o = [];
    for (const side of stronyRak(d)) { const a = v2.jointAngles(s.f.sk, side).elbow; if (a > q.max_lokiec_deg) o.push(`łokieć ${side} w u = 0 ma ${f1(a)}°, a ma być ≤ ${q.max_lokiec_deg}° (pełny wyprost rąk na dole) — obniż miednicę w pierwszej klatce`); }
    return o;
  },
  lokiec_caly_ruch: ({ v2, d, p, parametry: q }) => {
    const o = [];
    for (const side of stronyRak(d)) { const m = Math.max(...p.map((s) => v2.jointAngles(s.f.sk, side).elbow)); if (m > q.max_lokiec_deg) o.push(`łokieć ${side} dochodzi do ${f1(m)}° w ruchu, a ma być ≤ ${q.max_lokiec_deg}° w każdej klatce (ramiona proste)`); }
    return o;
  },
  miednica_poziomo: ({ p, parametry: q }) => {
    const o = [];
    for (const ax of q.osie) { const i = ax === 'x' ? 0 : 2; const r = zakres(p.map((s) => s.f.sk.pelvis[i])); if (r.span > q.max_cm) o.push(`miednica przesuwa się w ${ax} o ${f1(r.span)} cm w ruchu (limit ${q.max_cm} cm) — utrzymaj miednica[${i}] prawie stałe we wszystkich klatkach`); }
    return o;
  },
  kostka_wzgledem_miednicy: ({ p, parametry: q }) => {
    const o = [];
    for (const side of ['R', 'L']) { const rel = p.map((s) => s.f.sk.legs[side].ankle[0] - s.f.sk.pelvis[0]); const r = zakres(rel);
      if (r.min < q.min_cm || r.max > q.max_cm) o.push(`kostka ${side} względem miednicy w x: ${f1(r.min)}…${f1(r.max)} cm, dozwolone ${q.min_cm}…${q.max_cm} cm (stopy pod lub za biodrami, nie z przodu)`);
      else if (r.span > q.zmiana_max_cm) o.push(`kostka ${side} zmienia położenie względem miednicy o ${f1(r.span)} cm w x (limit ${q.zmiana_max_cm} cm) — nogi nieruchome względem tułowia`); }
    return o;
  },
  pochylenie_tulowia: ({ p, parametry: q }) => {
    const r = zakres(p.map((s) => s.kf.pochylenieTulowia));
    return r.min < q.min_deg || r.max > q.max_deg ? [`pochylenieTulowia w ruchu: ${f1(r.min)}°…${f1(r.max)}°, dozwolone ${q.min_deg}°…${q.max_deg}° (odchylenie tułowia to bujanie)`] : [];
  },
  /* styk dłoni z drążkiem (punkty styku liczone z geometrii: lib/figures/v2/contacts.ts) w każdej próbce ruchu */
  styk_dlonie: ({ v2, d, p }) => {
    const o = [];
    for (const s of p) { const maja = new Set(v2.contactsOf(s.f).map((c) => c.id)); for (const side of stronyRak(d)) if (!maja.has('hand' + side) && o.length < 3) o.push(`dłoń ${side} nie ma styku z drążkiem w u = ${s.u.toFixed(2)} (chwyt musi leżeć na osi drążka w każdej klatce)`); }
    return o;
  },
  jedna_reka: ({ d, p, parametry: q }) => {
    const b = drazek(d); if (!b) return []; if (b.trzyma !== 'R' && b.trzyma !== 'L') return ['ćwiczenie jednorącz, a sprzet[] ma drążek trzymany obiema rękami — ustaw na sztandze trzyma: "R" albo "L"'];
    const wolna = b.trzyma === 'R' ? 'L' : 'R'; const o = [];
    const min = Math.min(...p.map((s) => { const g = s.f.sk.arms[wolna].grip; return Math.hypot(g[0] - (b.x ?? 0), g[1] - (b.y ?? 0)); }));
    if (min < q.min_wolna_od_osi_cm) o.push(`wolna dłoń ${wolna} jest ${f1(min)} cm od osi drążka, a ma być ≥ ${q.min_wolna_od_osi_cm} cm (wolna ręka poza drążkiem, np. wzdłuż tułowia)`);
    return o;
  },
};

const kat = (a, b) => { const na = Math.hypot(...a), nb = Math.hypot(...b); if (!na || !nb) return 0; const c = Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (na * nb))); return (Math.acos(c) * 180) / Math.PI; };
Object.assign(EWALUATORY, {
  miednica_na_podlodze: ({ p, parametry: q }) => { const m = Math.max(...p.map((s) => s.f.sk.pelvis[1])); return m > q.max_y_cm ? [`środek miednicy dochodzi do y = ${f1(m)} cm, a ma być ≤ ${q.max_y_cm} cm (dolna część pleców zostaje na podłodze; leżąca osoba ma miednicę na y ≈ 8)`] : []; },
  szyja_neutralna: ({ p, parametry: q }) => { const m = Math.max(...p.map((s) => { const sk = s.f.sk; return kat(sk.headUp, [sk.shoulderC[0] - sk.pelvis[0], sk.shoulderC[1] - sk.pelvis[1], sk.shoulderC[2] - sk.pelvis[2]]); })); return m > q.max_deg ? [`kąt między osią głowy a osią tułowia dochodzi do ${f1(m)}°, a ma być ≤ ${q.max_deg}° (głowa podąża za tułowiem: pochylenieGlowy ≈ pochylenieTulowia ± ${q.max_deg}°)`] : []; },
  lopatki_od_podlogi: ({ p, parametry: q }) => { const o = []; const dy = p[p.length - 1].f.sk.shoulderC[1] - p[0].f.sk.shoulderC[1]; const dm = zakres(p.map((s) => s.f.sk.pelvis[1])).span;
    if (dy < q.min_cm) o.push(`barki w u = 1 są tylko ${f1(dy)} cm wyżej niż w u = 0, a mają być ≥ ${q.min_cm} cm (łopatki unoszą się od podłogi)`); if (dm > q.max_miednica_cm) o.push(`miednica zmienia wysokość o ${f1(dm)} cm, a ma ≤ ${q.max_miednica_cm} cm (miednica zostaje na podłodze)`); return o; },
  miednica_unosi_sie: ({ p, parametry: q }) => { const o = []; const dy = p[p.length - 1].f.sk.pelvis[1] - p[0].f.sk.pelvis[1]; const ds = zakres(p.map((s) => s.f.sk.shoulderC[1])).span;
    if (dy < q.min_cm) o.push(`miednica w u = 1 jest tylko ${f1(dy)} cm wyżej niż w u = 0, a ma być ≥ ${q.min_cm} cm (ruch prowadzi miednica)`); if (ds > q.max_barki_cm) o.push(`barki zmieniają wysokość o ${f1(ds)} cm, a mają ≤ ${q.max_barki_cm} cm (barki zostają na podłodze)`); return o; },
  bird_dog_linia: ({ p, parametry: q }) => { const s = p[p.length - 1].f.sk; const wynik = ['R', 'L'].map((side) => { const opp = side === 'R' ? 'L' : 'R'; return Math.max(Math.abs(s.arms[side].grip[1] - s.shoulderC[1]), Math.abs(s.legs[opp].ankle[1] - s.pelvis[1])); });
    return Math.min(...wynik) > q.tol_cm ? [`w u = 1 żadna para (ręka + przeciwna noga) nie leży w linii tułowia: najlepsza odchyłka ${f1(Math.min(...wynik))} cm, a ma być ≤ ${q.tol_cm} cm (dłoń na wysokości barku, kostka na wysokości miednicy)`] : []; },
});

/* ---------- 22 typy reguł od badacza (26.10.2026; definicje: data/zrodla/figury-sens.json → _typy). Układ: x przód, y góra, z prawo; kąty jak jointAngles (0° = prosty). ---------- */
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dl = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const sr = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
const jedn = (a) => { const n = Math.hypot(...a) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const pierwsza = (p) => p[0].f.sk, ostatnia = (p) => p[p.length - 1].f.sk;
const kneesMid = (sk) => sr(sk.legs.R.knee, sk.legs.L.knee), anklesMid = (sk) => sr(sk.legs.R.ankle, sk.legs.L.ankle);
const katNad = (v) => (Math.atan2(v[1], Math.hypot(v[0], v[2])) * 180) / Math.PI;
const punktySzkieletu = (sk) => [sk.pelvis, sk.head, sk.shoulderC, sk.spineMid, ...['R', 'L'].flatMap((s) => [sk.legs[s].knee, sk.legs[s].ankle, sk.legs[s].heel, sk.legs[s].toe, sk.arms[s].elbow, sk.arms[s].grip])];
Object.assign(EWALUATORY, {
  kolana_ku_barkom: ({ p, parametry: q }) => { const d0 = dl(kneesMid(pierwsza(p)), pierwsza(p).shoulderC), d1 = dl(kneesMid(ostatnia(p)), ostatnia(p).shoulderC); return d0 - d1 < q.min_zblizenie_cm ? [`odległość kolan od barków maleje tylko o ${f1(d0 - d1)} cm (z ${f1(d0)} do ${f1(d1)}), a ma zmaleć o ≥ ${q.min_zblizenie_cm} cm (kolana zbliżają się do klatki)`] : []; },
  miednica_nieruchoma: ({ p, parametry: q }) => { const r = zakres(p.map((s) => s.f.sk.pelvis[1])); return r.span > q.max_cm ? [`wysokość miednicy zmienia się o ${f1(r.span)} cm, a ma ≤ ${q.max_cm} cm (miednica zostaje na podporze)`] : []; },
  miednica_pion_span: ({ p, parametry: q }) => { const r = zakres(p.map((s) => s.f.sk.pelvis[1])); return r.span > q.max_cm ? [`wysokość miednicy zmienia się o ${f1(r.span)} cm, a ma ≤ ${q.max_cm} cm (miednica na stałej wysokości)`] : []; },
  zgiecie_tulowia_biodra_nieruchome: ({ p, parametry: q }) => { const o = []; const L = (s) => dl(s.f.sk.shoulderC, s.f.sk.pelvis); const sk = L(p[0]) - L(p[p.length - 1]); const dm = Math.max(...p.map((s) => dl(s.f.sk.pelvis, p[0].f.sk.pelvis)));
    if (sk < q.min_skrocenie_cm) o.push(`odległość barki–miednica maleje tylko o ${f1(sk)} cm, a ma ≥ ${q.min_skrocenie_cm} cm (tułów zwija się: zgięcie kręgosłupa)`); if (dm > q.max_miednica_cm) o.push(`miednica przesuwa się o ${f1(dm)} cm, a ma ≤ ${q.max_miednica_cm} cm (biodra stoją)`); return o; },
  konczyny_uniesione: ({ p, parametry: q }) => { const a = pierwsza(p), b = ostatnia(p); const o = []; for (const [n, y0, y1] of [['dłoń R', a.arms.R.grip[1], b.arms.R.grip[1]], ['dłoń L', a.arms.L.grip[1], b.arms.L.grip[1]], ['kostka R', a.legs.R.ankle[1], b.legs.R.ankle[1]], ['kostka L', a.legs.L.ankle[1], b.legs.L.ankle[1]]]) if (y1 - y0 < q.min_cm) o.push(`${n} w u = 1 jest tylko ${f1(y1 - y0)} cm wyżej niż w u = 0, a ma być ≥ ${q.min_cm} cm (kończyny uniesione)`); return o; },
  stawy_proste: ({ v2, d, p, parametry: q }) => { const o = []; const strony = q.stawy.includes('elbow') ? stronyRak(d) : ['R', 'L']; for (const st of q.stawy) for (const side of (st === 'elbow' ? strony : ['R', 'L'])) { const m = Math.max(...p.map((s) => v2.jointAngles(s.f.sk, side)[st])); if (m > q.max_deg) o.push(`staw ${st} ${side} dochodzi do ${f1(m)}°, a ma być ≤ ${q.max_deg}° w całym ruchu (proste)`); } return o; },
  barki_unoszenie_max: ({ p, parametry: q }) => { const y0 = pierwsza(p).shoulderC[1]; const m = Math.max(...p.map((s) => s.f.sk.shoulderC[1] - y0)); return m > q.max_cm ? [`barki unoszą się o ${f1(m)} cm, a mają ≤ ${q.max_cm} cm (bez przeprostu)`] : []; },
  start_lezenie: ({ p, parametry: q }) => { const a = pierwsza(p); const o = []; const ds = a.shoulderC[1] - a.pelvis[1], dk = anklesMid(a)[1] - a.pelvis[1]; if (ds > q.max_cm) o.push(`w u = 0 barki są ${f1(ds)} cm nad miednicą, a ma być ≤ ${q.max_cm} cm (start leżąc)`); if (dk > q.max_cm) o.push(`w u = 0 kostki są ${f1(dk)} cm nad miednicą, a ma być ≤ ${q.max_cm} cm (start leżąc)`); return o; },
  kat_tulowia_nad_poziomem_u1: ({ p, parametry: q }) => { const b = ostatnia(p); const k = katNad(sub3(b.shoulderC, b.pelvis)); return k < q.min_deg ? [`w u = 1 tułów jest ${f1(k)}° nad poziomem, a ma ≥ ${q.min_deg}°`] : []; },
  kat_nog_nad_poziomem_u1: ({ p, parametry: q }) => { const b = ostatnia(p); const k = katNad(sub3(anklesMid(b), b.pelvis)); return k < q.min_deg ? [`w u = 1 nogi są ${f1(k)}° nad poziomem, a mają ≥ ${q.min_deg}°`] : []; },
  szkielet_nieruchomy: ({ p, parametry: q }) => { const p0 = punktySzkieletu(pierwsza(p)); const m = Math.max(...p.flatMap((s) => punktySzkieletu(s.f.sk).map((pt, i) => dl(pt, p0[i])))); return m > q.max_cm ? [`któryś punkt szkieletu przesuwa się o ${f1(m)} cm, a ma ≤ ${q.max_cm} cm (poza nieruchoma)`] : []; },
  lokiec_nieruchomy_wzgledem_barku: ({ d, p, parametry: q }) => { const o = []; for (const side of stronyRak(d)) { const e = (s) => sub3(s.f.sk.arms[side].elbow, s.f.sk.shoulderC); const e0 = e(p[0]); const m = Math.max(...p.map((s) => dl(e(s), e0))); if (m > q.max_cm) o.push(`łokieć ${side} przesuwa się względem barku o ${f1(m)} cm, a ma ≤ ${q.max_cm} cm (łokieć nieruchomo przy tułowiu)`); } return o; },
  tulow_nieruchomy: ({ p, parametry: q }) => { const o = []; const rk = zakres(p.map((s) => s.kf.pochylenieTulowia)); const dm = Math.max(zakres(p.map((s) => s.f.sk.pelvis[0])).span, zakres(p.map((s) => s.f.sk.pelvis[2])).span);
    if (rk.span > q.max_pochylenie_deg) o.push(`pochylenieTulowia zmienia się o ${f1(rk.span)}°, a ma ≤ ${q.max_pochylenie_deg}° (tułów nieruchomo)`); if (dm > q.max_miednica_cm) o.push(`miednica przesuwa się poziomo o ${f1(dm)} cm, a ma ≤ ${q.max_miednica_cm} cm`); return o; },
  lokiec_zakres: ({ v2, d, p, parametry: q }) => { const o = []; for (const side of stronyRak(d)) { const a0 = v2.jointAngles(p[0].f.sk, side).elbow, a1 = v2.jointAngles(ostatnia_s(p).sk, side).elbow;
    if (q.u0_min_deg !== undefined && a0 < q.u0_min_deg) o.push(`łokieć ${side} w u = 0 ma ${f1(a0)}°, a ma być ≥ ${q.u0_min_deg}°`); if (q.u0_max_deg !== undefined && a0 > q.u0_max_deg) o.push(`łokieć ${side} w u = 0 ma ${f1(a0)}°, a ma być ≤ ${q.u0_max_deg}°`);
    if (q.u1_min_deg !== undefined && a1 < q.u1_min_deg) o.push(`łokieć ${side} w u = 1 ma ${f1(a1)}°, a ma być ≥ ${q.u1_min_deg}°`); if (q.u1_max_deg !== undefined && a1 > q.u1_max_deg) o.push(`łokieć ${side} w u = 1 ma ${f1(a1)}°, a ma być ≤ ${q.u1_max_deg}°`); } return o; },
  lokiec_zakres_ruch: ({ v2, d, p, parametry: q }) => { const o = []; for (const side of stronyRak(d)) { const a = p.map((s) => v2.jointAngles(s.f.sk, side).elbow); const r = zakres(a);
    if (r.max < q.min_max_deg) o.push(`łokieć ${side} w ruchu dochodzi tylko do ${f1(r.max)}°, a ma sięgać ≥ ${q.min_max_deg}° (pełny zakres ruchu)`); if (r.min > q.max_min_deg) o.push(`łokieć ${side} w ruchu nie prostuje się poniżej ${f1(r.min)}°, a ma schodzić do ≤ ${q.max_min_deg}°`); } return o; },
  lokiec_staly_kat: ({ v2, d, p, parametry: q }) => { const o = []; for (const side of stronyRak(d)) { const r = zakres(p.map((s) => v2.jointAngles(s.f.sk, side).elbow)); if (r.span > q.max_zmiana_deg) o.push(`łokieć ${side} zmienia kąt o ${f1(r.span)}°, a ma ≤ ${q.max_zmiana_deg}° (stały kąt)`); if (r.max > q.max_deg) o.push(`łokieć ${side} dochodzi do ${f1(r.max)}°, a ma ≤ ${q.max_deg}°`); } return o; },
  lokiec_wysokosc_u1: ({ d, p, parametry: q }) => { const b = ostatnia(p); const ok = stronyRak(d).some((side) => { const h = b.arms[side].elbow[1] - b.shoulderC[1]; return h >= q.min_cm && h <= q.max_cm; });
    return ok ? [] : [`w u = 1 żaden łokieć nie leży na wysokości ${q.min_cm}…${q.max_cm} cm względem barku (łokcie na wysokości barków)`]; },
  kat_ramie_tulow_wzrost: ({ d, p, parametry: q }) => { const kat_ = (s, side) => { const sk = s.f.sk; const a = jedn(sub3(sk.arms[side].elbow, sk.shoulderC)), t = jedn(sub3(sk.pelvis, sk.shoulderC)); return (Math.acos(Math.max(-1, Math.min(1, dot3(a, t)))) * 180) / Math.PI; };
    const best = Math.max(...stronyRak(d).map((side) => kat_(p[p.length - 1], side) - kat_(p[0], side))); return best < q.min_deg ? [`kąt ramię–tułów rośnie najwyżej o ${f1(best)}°, a ma wzrosnąć o ≥ ${q.min_deg}° (ramię unosi się od tułowia)`] : []; },
  dlon_w_plaszczyznie_barkow_u1: ({ d, p, parametry: q }) => { const b = ostatnia(p); const t = jedn(sub3(b.shoulderC, b.pelvis)); const o = []; for (const side of stronyRak(d)) { const x = Math.abs(dot3(sub3(b.arms[side].grip, b.shoulderC), t)); if (x > q.max_cm) o.push(`dłoń ${side} w u = 1 jest ${f1(x)} cm od płaszczyzny barków (prostopadłej do tułowia), a ma ≤ ${q.max_cm} cm`); } return o; },
  dlon_odchodzi_w_bok: ({ d, p, parametry: q }) => { const a = pierwsza(p), b = ostatnia(p); const ax = jedn(sub3(a.arms.R.shoulder, a.arms.L.shoulder)); const bx = jedn(sub3(b.arms.R.shoulder, b.arms.L.shoulder));
    const w = (sk, ax_, side) => Math.abs(dot3(sub3(sk.arms[side].grip, sk.shoulderC), ax_)); const best = Math.max(...stronyRak(d).map((side) => w(b, bx, side) - w(a, ax, side))); return best < q.min_cm ? [`dłoń odchodzi w bok (wzdłuż osi barków) najwyżej o ${f1(best)} cm, a ma o ≥ ${q.min_cm} cm`] : []; },
  lokiec_nad_dlonia_u1: ({ d, p, parametry: q }) => { const b = ostatnia(p); const o = []; for (const side of stronyRak(d)) { const x = b.arms[side].elbow[1] - b.arms[side].grip[1]; if (x < q.min_cm) o.push(`łokieć ${side} w u = 1 jest ${f1(x)} cm nad dłonią, a ma być ≥ ${q.min_cm} cm`); } return o; },
  ciezar_blisko_glowy: ({ p, parametry: q }) => { const m = Math.max(...p.map((s) => { const sk = s.f.sk; const c = s.f.info?.load ?? sr(sk.arms.R.grip, sk.arms.L.grip); return dl(c, sk.head); })); return m > q.max_cm ? [`ciężar oddala się od głowy do ${f1(m)} cm, a ma ≤ ${q.max_cm} cm`] : []; },
  miednica_na_linii: ({ p, parametry: q }) => {
    const koniec = (sk) => q.koniec === 'kolano' ? (sk.legs.R.knee[1] <= sk.legs.L.knee[1] ? sk.legs.R.knee : sk.legs.L.knee) : (dl(sk.legs.R.ankle, sk.pelvis) >= dl(sk.legs.L.ankle, sk.pelvis) ? sk.legs.R.ankle : sk.legs.L.ankle);
    const odl = (sk) => { const P = koniec(sk), A = sk.shoulderC, v = sub3(P, A), w = sub3(sk.pelvis, A); const t = Math.max(0, Math.min(1, dot3(w, v) / (dot3(v, v) || 1))); return dl(sk.pelvis, [A[0] + v[0] * t, A[1] + v[1] * t, A[2] + v[2] * t]); };
    const dlSk = (s) => dl(s.f.sk.shoulderC, koniec(s.f.sk)); const maxDl = Math.max(...p.map(dlSk)); const kandydaci = q.tylko_skrajna ? p.filter((s) => dlSk(s) >= maxDl - 0.5) : p; /* skrajna = najdalsza para bark–koniec; remis (sztywne ciało: odległość stała) → oceniamy WSZYSTKIE klatki w granicy 0,5 cm, nie tylko pierwszą (u = 0) */ const m = Math.max(...kandydaci.map((s) => odl(s.f.sk)));
    return m > q.max_cm ? [`miednica odchyla się od linii barki–${q.koniec === 'kolano' ? 'kolano' : 'kostka'} o ${f1(m)} cm, a ma ≤ ${q.max_cm} cm (ciało w jednej linii; bez zapadania i wypinania miednicy)`] : []; },
});
function ostatnia_s(p) { return p[p.length - 1].f; }

/* ---------- 35 typów reguł rundy 2 (badacz, 26.10.2026; definicje: data/zrodla/figury-sens.json → _typy). Pracujące strony = stronyRak(d); G = średnia chwytów stron pracujących. ---------- */
const sred = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const kfOf = (s) => ({ pochylenieTulowia: s.kf?.pochylenieTulowia ?? s.f.pose?.trunkPitch ?? 0, zgiecieKregoslupa: s.kf?.zgiecieKregoslupa ?? s.f.pose?.spineBend ?? 0 });
const Gx = (s, strony) => { const g = strony.map((side) => s.f.sk.arms[side].grip); return [sred(g.map((x) => x[0])), sred(g.map((x) => x[1])), sred(g.map((x) => x[2]))]; };
const maxLokiecSamp = (v2, p, strony) => p.reduce((best, s) => { const a = sred(strony.map((side) => v2.jointAngles(s.f.sk, side).elbow)); return a > best.a ? { s, a } : best; }, { s: p[0], a: -1 }).s;
const podporowa = (sk) => (solaMin(sk.legs.R) <= solaMin(sk.legs.L) ? 'R' : 'L'); /* noga podporowa: stopa najniżej */
const solaMin = (leg) => Math.min(leg.heel[1], leg.toe[1]);
const nogiWg = (v2, sk, strona, st) => { const k = { R: v2.jointAngles(sk, 'R'), L: v2.jointAngles(sk, 'L') }; if (strona === 'bardziej_zgieta') return [k.R.knee >= k.L.knee ? 'R' : 'L']; return ['R', 'L']; };
const najnizszaMiednica = (p) => p.reduce((b, s) => (s.f.sk.pelvis[1] < b.f.sk.pelvis[1] ? s : b), p[0]);
const solaY = (v2, leg) => Math.min(leg.heel[1], leg.toe[1]);
const wLocie = (v2, d, s, min) => ['R', 'L'].every((side) => { const l = s.f.sk.legs[side]; const x = l.ankle[0]; const sk = (d?.sprzet ?? []).find((g) => g.rodzaj === 'skrzynia' && x >= g.x0 && x <= g.x1); return solaY(v2, l) >= (sk ? sk.top : 0) + min; });
const wPlaszczyznie = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const odlOdLamanej = (pt, L) => Math.min(...L.slice(1).map((B, i) => { const A = L[i]; const v = [B[0] - A[0], B[1] - A[1]]; const w = [pt[0] - A[0], pt[1] - A[1]]; const t = Math.max(0, Math.min(1, (w[0] * v[0] + w[1] * v[1]) / ((v[0] * v[0] + v[1] * v[1]) || 1))); return wPlaszczyznie(pt, [A[0] + v[0] * t, A[1] + v[1] * t]); }));
const srK = (v2, sk, st) => sred(['R', 'L'].map((side) => v2.jointAngles(sk, side)[st]));
Object.assign(EWALUATORY, {
  kregoslup_neutralny: ({ p, parametry: q }) => { const r = zakres(p.map((s) => kfOf(s).zgiecieKregoslupa)); return r.min < q.min_deg || r.max > q.max_deg ? [`zgięcie kręgosłupa w ruchu ${f1(r.min)}°…${f1(r.max)}°, dozwolone ${q.min_deg}°…${q.max_deg}° (plecy neutralne; dodatnie = zaokrąglony grzbiet)`] : []; },
  kolano_w_linii_stopy: ({ v2, p, parametry: q }) => { /* r3: pozioma (x, z) odległość środka kolana od prostej przez piętę i palce, dodatnia na zewnątrz (R: +z, L: −z); wymagane ≥ −max_do_srodka_cm */
    const wg = q.strony ?? q.nogi; let worst = Infinity; for (const s of p) for (const side of nogiWg(v2, s.f.sk, wg)) { const sk = s.f.sk; if (v2.jointAngles(sk, side).knee < q.min_zgiecie_deg) continue; const l = sk.legs[side];
      const fx = l.toe[0] - l.heel[0], fz = l.toe[2] - l.heel[2]; const n = Math.hypot(fx, fz) || 1; const kx = l.knee[0] - l.heel[0], kz = l.knee[2] - l.heel[2];
      const nazewnatrz = (side === 'R' ? 1 : -1) * ((fx * kz - fz * kx) / n); worst = Math.min(worst, nazewnatrz); }
    const lim = q.max_do_srodka_cm; return worst < -lim ? [`środek kolana leży ${f1(-worst)} cm przyśrodkowo od osi stopy (pięta–palce), a ma ≤ ${lim} cm (kolana w linii palców; liczone przy zgięciu ≥ ${q.min_zgiecie_deg}°)`] : []; },
  piety_na_podlodze: ({ p, parametry: q }) => { const o = []; for (const side of ['R', 'L']) { const r = zakres(p.map((s) => s.f.sk.legs[side].heel[1])); if (r.span > q.max_cm) o.push(`pięta ${side} zmienia wysokość o ${f1(r.span)} cm, a ma ≤ ${q.max_cm} cm (pięty na podłodze)`); } return o; },
  /* p2-r5: stopa leży na platformie suwnicy (pomiar, nie ocena na oko). Płaszczyzna płyty = ta, którą rysuje silnik: przechodzi przez punkt mocowania prowadnicy (props[slide].to), normalna = kierunek prowadnicy.
     Odstęp = (płyta − punkt podeszwy) · kierunek prowadnicy: dodatni = podeszwa przed płytą (po stronie ćwiczącego), ujemny = podeszwa przechodzi przez płytę. Punkty podeszwy: pięta i palce (śródstopie = środek między nimi). */
  stopa_na_platformie: ({ d, p, parametry: q }) => {
    const g = (d.sprzet ?? []).find((x) => x.rodzaj === 'dzwignia' && x.tryb === 'prosta' && (x.punkt === 'kostki' || x.punkt === 'podeszwy')); if (!g) return ['brak platformy pod stopami: wymagana dźwignia „prosta” z punktem „podeszwy” (wałek przy kostce to inny sprzęt)'];
    const strony = g.trzyma === 'R' || g.trzyma === 'L' ? [g.trzyma] : ['R', 'L']; const o = []; const poza = []; let lo = Infinity, hi = -Infinity;
    for (const s of p) { const sl = (s.f.props ?? []).find((x) => x.k === 'slide'); if (!sl) continue;
      for (const side of strony) { const l = s.f.sk.legs[side]; const mid = [(l.heel[0] + l.toe[0]) / 2, (l.heel[1] + l.toe[1]) / 2, (l.heel[2] + l.toe[2]) / 2];
        for (const [nm, pt] of [['pięta', l.heel], ['śródstopie', mid], ['palce', l.toe]]) { const odl = (sl.to[0] - pt[0]) * sl.dir[0] + (sl.to[1] - pt[1]) * sl.dir[1] + (sl.to[2] - pt[2]) * sl.dir[2]; lo = Math.min(lo, odl); hi = Math.max(hi, odl); if ((odl < q.min_cm || odl > q.max_cm) && poza.length < 3) poza.push(`${nm} ${side} w u = ${s.u.toFixed(2)}: ${f1(odl)} cm od płyty`); } } }
    if (lo === Infinity) return ['brak rekwizytu prowadnicy w klatkach'];
    if (poza.length) o.push(`podeszwa nie leży na płycie platformy: odstęp ${f1(lo)}…${f1(hi)} cm, a ma być w ${q.min_cm}…${q.max_cm} cm (np. ${poza.join('; ')}) — stopa płasko NA platformie, nie przez nią`);
    return o; },
  kolano_biodro_zakres: ({ v2, p, parametry: q }) => { const o = []; const kn = p.map((s) => srK(v2, s.f.sk, 'knee')), bi = p.map((s) => srK(v2, s.f.sk, 'hip'));
    if (Math.max(...kn) < q.kolano_min_max_deg) o.push(`kolano w ruchu dochodzi tylko do ${f1(Math.max(...kn))}°, a ma sięgać ≥ ${q.kolano_min_max_deg}°`); if (Math.max(...bi) < q.biodro_min_max_deg) o.push(`biodro w ruchu dochodzi tylko do ${f1(Math.max(...bi))}°, a ma sięgać ≥ ${q.biodro_min_max_deg}°`);
    if (Math.min(...kn) > q.kolano_max_min_deg) o.push(`kolano w ruchu nie prostuje się poniżej ${f1(Math.min(...kn))}°, a ma schodzić do ≤ ${q.kolano_max_min_deg}°`); return o; },
  udo_rownolegle_na_dole: ({ p, parametry: q }) => { const s = najnizszaMiednica(p); const o = []; for (const side of ['R', 'L']) { const l = s.f.sk.legs[side]; const a = (Math.atan2(l.hip[1] - l.knee[1], Math.hypot(l.hip[0] - l.knee[0], l.hip[2] - l.knee[2])) * 180) / Math.PI; if (a > q.max_deg) o.push(`udo ${side} w najniższym punkcie jest ${f1(a)}° nad poziomem, a ma ≤ ${q.max_deg}° (udo równolegle do podłogi albo niżej)`); } return o; },
  stanie_wyprost: ({ v2, p, parametry: q }) => p.some((s) => (q.noga === 'podporowa' ? [podporowa(s.f.sk)] : ['R', 'L']).every((side) => { const a = v2.jointAngles(s.f.sk, side); return a.knee <= q.max_kolano_deg && a.hip <= q.max_biodro_deg; }) && Math.abs(kfOf(s).pochylenieTulowia) <= q.max_tulow_deg) ? [] : [`w żadnej klatce nie ma pełnego wyprostu (${q.noga === 'podporowa' ? 'noga podporowa: ' : ''}kolana ≤ ${q.max_kolano_deg}°, biodra ≤ ${q.max_biodro_deg}°, tułów ≤ ${q.max_tulow_deg}° od pionu)`],
  ciezar_blisko_nog: ({ d, p, parametry: q }) => { const st = stronyRak(d); let m = 0; for (const s of p) { const sk = s.f.sk; const G = Gx(s, st); if (q.tylko_ponizej_barkow && G[1] > sk.shoulderC[1]) continue; const nogi = q.noga === 'podporowa' ? [sk.legs[podporowa(sk)]] : [sk.legs.R, sk.legs.L]; /* r4: jednonóż — oś z nogi podporowej */ const L = [sred(nogi.map((l) => l.ankle[0])), sred(nogi.map((l) => l.ankle[1]))], K = [sred(nogi.map((l) => l.knee[0])), sred(nogi.map((l) => l.knee[1]))];
      m = Math.max(m, odlOdLamanej([G[0], G[1]], [L, K, [sk.pelvis[0], sk.pelvis[1]], [sk.shoulderC[0], sk.shoulderC[1]]])); }
    return m > q.max_cm ? [`ciężar oddala się od linii nóg i tułowia do ${f1(m)} cm, a ma ≤ ${q.max_cm} cm (prowadź blisko ciała)`] : []; },
  ciezar_ponizej_kolan: ({ d, p, parametry: q }) => { const st = stronyRak(d); return p.some((s) => Gx(s, st)[1] - sred([s.f.sk.legs.R.knee[1], s.f.sk.legs.L.knee[1]]) <= -q.min_cm) ? [] : [`ciężar nigdzie nie schodzi ≥ ${q.min_cm} cm poniżej kolan (start z podłogi / głęboki zawias)`]; },
  pochylenie_tulowia_ruch: ({ p, parametry: q }) => { const o = []; const r = zakres(p.map((s) => kfOf(s).pochylenieTulowia)); if (q.min_deg !== undefined && r.min < q.min_deg) o.push(`pochylenieTulowia schodzi do ${f1(r.min)}°, a ma ≥ ${q.min_deg}°`); if (q.max_deg !== undefined && r.max > q.max_deg) o.push(`pochylenieTulowia dochodzi do ${f1(r.max)}°, a ma ≤ ${q.max_deg}°`);
    if (q.min_osiagniete_deg !== undefined && r.max < q.min_osiagniete_deg) o.push(`pochylenieTulowia dochodzi tylko do ${f1(r.max)}°, a ma osiągnąć ≥ ${q.min_osiagniete_deg}° (pozycja dolna)`);
    if (q.min_zmiana_deg !== undefined && r.span < q.min_zmiana_deg) o.push(`pochylenieTulowia zmienia się tylko o ${f1(r.span)}°, a ma ≥ ${q.min_zmiana_deg}° (ruch w biodrach)`); if (q.max_zmiana_deg !== undefined && r.span > q.max_zmiana_deg) o.push(`pochylenieTulowia zmienia się o ${f1(r.span)}°, a ma ≤ ${q.max_zmiana_deg}°`); return o; },
  kolana_max: ({ v2, p, parametry: q }) => { const m = Math.max(...p.flatMap((s) => (q.noga === 'podporowa' ? [podporowa(s.f.sk)] : ['R', 'L']).map((side) => v2.jointAngles(s.f.sk, side).knee))); return m > q.max_deg ? [`kolano dochodzi do ${f1(m)}°, a ma ≤ ${q.max_deg}° (kolana tylko lekko ugięte)`] : []; },
  lawka_kontakt: ({ p, parametry: q }) => { const o = []; const r = zakres(p.map((s) => s.f.sk.pelvis[1])); const sp = Math.min(...p.map((s) => kfOf(s).zgiecieKregoslupa)); if (r.span > q.max_cm) o.push(`miednica zmienia wysokość o ${f1(r.span)} cm, a ma ≤ ${q.max_cm} cm (pośladki na ławce)`); if (sp < q.min_kregoslup_deg) o.push(`zgięcie kręgosłupa schodzi do ${f1(sp)}°, a ma ≥ ${q.min_kregoslup_deg}° (bez nadmiernego łuku lędźwi)`); return o; },
  chwyt_przy_klatce: ({ v2, d, p, parametry: q }) => { const st = stronyRak(d); const s = maxLokiecSamp(v2, p, st); const o = []; for (const side of st) { const sk = s.f.sk; const g = sub3(sk.arms[side].grip, sk.shoulderC); const x = dot3(g, sk.front); if (x > q.max_cm) o.push(`chwyt ${side} w najniższym punkcie jest ${f1(x)} cm przed klatką (oś normalna klatki), a ma ≤ ${q.max_cm} cm`); } return o; },
  lokiec_pod_chwytem: ({ d, p, parametry: q }) => { const o = []; for (const side of stronyRak(d)) { const m = Math.max(...p.map((s) => { const a = s.f.sk.arms[side]; const dx = a.grip[0] - a.elbow[0], dz = a.grip[2] - a.elbow[2]; return q.osie.includes('z') ? Math.hypot(dx, dz) : Math.abs(dx); })); if (m > q.max_cm) o.push(`chwyt ${side} odchodzi od łokcia o ${f1(m)} cm (${q.osie.join(', ')}), a ma ≤ ${q.max_cm} cm (przedramię pionowo pod chwytem)`); } return o; },
  odwiedzenie_ramienia_max: ({ v2, d, p, parametry: q }) => { const st = stronyRak(d); const s = maxLokiecSamp(v2, p, st); const o = []; for (const side of st) { const a = v2.jointAngles(s.f.sk, side).shAbd; if (a > q.max_deg) o.push(`odwiedzenie ramienia ${side} przy największym zgięciu łokcia to ${f1(a)}°, a ma ≤ ${q.max_deg}° (łokcie nie za szeroko)`); } return o; },
  ciezar_nad_glowa: ({ v2, d, p, parametry: q }) => { const st = stronyRak(d); const kand = q.tylko_u1 ? [p[p.length - 1]] : p; const ok = kand.some((s) => Gx(s, st)[1] - s.f.sk.head[1] >= q.min_cm && (q.lokiec_max_deg === undefined || st.every((side) => v2.jointAngles(s.f.sk, side).elbow <= q.lokiec_max_deg)));
    return ok ? [] : [`ciężar ${q.tylko_u1 ? 'w u = 1 ' : ''}nie jest ≥ ${q.min_cm} cm nad głową${q.lokiec_max_deg !== undefined ? ` z łokciami ≤ ${q.lokiec_max_deg}°` : ''}`]; },
  chwyt_przy_barkach: ({ d, p, parametry: q }) => { const st = stronyRak(d); const ok = (s) => { const h = Gx(s, st)[1] - s.f.sk.shoulderC[1]; return (q.min_cm === undefined || h >= q.min_cm) && h <= q.max_cm; }; const dobre = q.caly_ruch ? p.every(ok) : p.some(ok);
    return dobre ? [] : [`chwyt ${q.caly_ruch ? 'w całym ruchu' : 'w żadnej klatce'} nie leży ${q.min_cm !== undefined ? `${q.min_cm}…` : 'do '}${q.max_cm} cm względem wysokości barków`]; },
  ciezar_nad_barkami: ({ d, p, parametry: q }) => { const st = stronyRak(d); const s = p.reduce((b, x) => (Gx(x, st)[1] > Gx(b, st)[1] ? x : b), p[0]); const x = Math.abs(Gx(s, st)[0] - s.f.sk.shoulderC[0]); return x > q.max_cm ? [`w najwyższym punkcie ciężar jest ${f1(x)} cm przed/za barkami, a ma ≤ ${q.max_cm} cm (nad barkami)`] : []; },
  ugiecie_kolan_zakres: ({ v2, p, parametry: q }) => { const m = Math.max(...p.map((s) => srK(v2, s.f.sk, 'knee'))); const o = []; if (m < q.min_deg) o.push(`największe zgięcie kolan w ruchu to ${f1(m)}°, a ma ≥ ${q.min_deg}°`); if (q.max_deg !== undefined && m > q.max_deg) o.push(`największe zgięcie kolan w ruchu to ${f1(m)}°, a ma ≤ ${q.max_deg}°`); return o; },
  dlonie_zblizaja_sie: ({ p, parametry: q }) => { const r = zakres(p.map((s) => dl(s.f.sk.arms.R.grip, s.f.sk.arms.L.grip))); return r.span < q.min_cm ? [`odległość między dłońmi zmienia się tylko o ${f1(r.span)} cm, a ma ≥ ${q.min_cm} cm (dłonie zbliżają się)`] : []; },
  chwyt_nie_ponizej_barkow: ({ d, p, parametry: q }) => { const o = []; for (const side of stronyRak(d)) { const m = Math.min(...p.map((s) => s.f.sk.arms[side].grip[1] - s.f.sk.shoulderC[1])); if (m < q.min_cm) o.push(`chwyt ${side} schodzi do ${f1(m)} cm względem barku, a ma ≥ ${q.min_cm} cm (nie poniżej barków)`); } return o; },
  kat_ramie_tulow_zakres: ({ d, p, parametry: q }) => { const kat_ = (s, side) => { const sk = s.f.sk; const a = jedn(sub3(sk.arms[side].elbow, sk.shoulderC)), t = jedn(sub3(sk.pelvis, sk.shoulderC)); return (Math.acos(Math.max(-1, Math.min(1, dot3(a, t)))) * 180) / Math.PI; };
    const best = Math.max(...stronyRak(d).map((side) => zakres(p.map((s) => kat_(s, side))).span)); return best < q.min_deg ? [`kąt ramię–tułów zmienia się najwyżej o ${f1(best)}°, a ma ≥ ${q.min_deg}° (ruch ramienia względem tułowia)`] : []; },
  lokiec_za_tulowiem: ({ d, p, parametry: q }) => { const st = stronyRak(d); return p.some((s) => st.every((side) => dot3(sub3(s.f.sk.arms[side].elbow, s.f.sk.arms[side].shoulder), s.f.sk.front) <= -q.min_cm)) ? [] : [`łokieć nigdzie nie leży ≥ ${q.min_cm} cm za linią barku (po stronie pleców)`]; },
  lokcie_w_dol: ({ d, p, parametry: q }) => { const st = stronyRak(d); const s = p.reduce((b, x) => (Gx(x, st)[1] < Gx(b, st)[1] ? x : b), p[0]); const o = []; for (const side of st) { const h = s.f.sk.arms[side].elbow[1] - s.f.sk.shoulderC[1]; if (h > -q.min_cm) o.push(`łokieć ${side} przy najniższym chwycie jest ${f1(h)} cm względem barku, a ma ≤ ${-q.min_cm} cm (łokcie w dół)`); } return o; },
  lot: ({ v2, d, p, parametry: q }) => (p.some((s) => wLocie(v2, d, s, q.min_cm)) ? [] : [`w żadnej klatce nie ma lotu (obie stopy ≥ ${q.min_cm} cm nad podparciem)`]),
  amortyzacja_ladowania: ({ v2, d, p, parametry: q }) => { let ost = -1; p.forEach((s, i) => { if (wLocie(v2, d, s, q.min_cm)) ost = i; }); if (ost < 0) return []; const po = p.slice(ost + 1); if (!po.length) return ['ruch kończy się w locie — brak lądowania (poza musi kończyć się lądowaniem)'];
    const ok = ['R', 'L'].some((side) => Math.max(...po.map((s) => v2.jointAngles(s.f.sk, side).knee)) >= q.min_kolano_deg && Math.max(...po.map((s) => v2.jointAngles(s.f.sk, side).hip)) >= q.min_biodro_deg); return ok ? [] : [`po lądowaniu żadna noga nie amortyzuje (kolano ≥ ${q.min_kolano_deg}° i biodro ≥ ${q.min_biodro_deg}°)`]; },
  potrojny_wyprost: ({ v2, p, parametry: q }) => { const ok = (s) => { const a = ['R', 'L'].map((side) => v2.jointAngles(s.f.sk, side)); const jedna = (x) => x.knee <= q.max_kolano_deg && x.hip <= q.max_biodro_deg && (q.max_kostka_deg === undefined || x.ankle <= q.max_kostka_deg); return (q.nogi ?? q.strony) === 'obie' ? a.every(jedna) : a.some(jedna); };
    return p.some(ok) ? [] : [`w żadnej klatce nie ma potrójnego wyprostu (kolano ≤ ${q.max_kolano_deg}°, biodro ≤ ${q.max_biodro_deg}°${q.max_kostka_deg !== undefined ? `, kostka ≤ ${q.max_kostka_deg}°` : ''}; nogi: ${q.nogi ?? q.strony})`]; },
  dlonie_na_wysokosci_barkow: ({ p, parametry: q }) => (p.some((s) => ['R', 'L'].filter((side) => s.f.sk.arms[side].grip[1] >= s.f.sk.shoulderC[1] + q.min_cm).length >= q.min_rak) ? [] : [`w żadnej klatce ${q.min_rak} ręk(a/i) nie ma dłoni ≥ ${q.min_cm} cm nad barkiem`]),
  rece_przed_wyprostem_bioder: ({ v2, d, p, parametry: q }) => { const bi = p.map((s) => srK(v2, s.f.sk, 'hip')); const iMin = bi.indexOf(Math.min(...bi)); const iLow = bi.indexOf(Math.max(...bi.slice(0, iMin + 1))); /* najgłębsze zgięcie PRZED wyprostem (nie przechwyt po nim: zarzut z zawisu i rwanie kończą się głębiej niż zaczynają) */ let iExt = -1; for (let i = iLow; i < p.length; i++) if (['R', 'L'].every((side) => v2.jointAngles(p[i].f.sk, side).hip <= q.max_biodro_deg)) { iExt = i; break; }
    if (iExt < 0) return [`biodra nigdy nie prostują się (≤ ${q.max_biodro_deg}°) po najgłębszym zgięciu`]; const m = Math.max(...p.slice(iLow, iExt + 1).flatMap((s) => stronyRak(d).map((side) => v2.jointAngles(s.f.sk, side).elbow))); return m > q.max_lokiec_deg ? [`łokcie zginają się do ${f1(m)}° przed wyprostem bioder, a mają ≤ ${q.max_lokiec_deg}° (ręce proste do wyprostu bioder)`] : []; },
  odbior_na_barkach_u1: ({ d, p, parametry: q }) => { const st = stronyRak(d); const s = p[p.length - 1]; const o = []; const h = Gx(s, st)[1] - s.f.sk.shoulderC[1]; if (h < q.min_cm || h > q.max_cm) o.push(`w u = 1 chwyt jest ${f1(h)} cm względem barków, a ma ${q.min_cm}…${q.max_cm} cm (odbiór na barkach)`);
    for (const side of ['R', 'L']) { const e = s.f.sk.arms[side].elbow[1] - s.f.sk.shoulderC[1]; if (e < -q.max_lokiec_pod_barkiem_cm) o.push(`łokieć ${side} w u = 1 jest ${f1(-e)} cm pod barkiem, a ma ≤ ${q.max_lokiec_pod_barkiem_cm} cm (łokcie wysoko)`); } return o; },
  wolna_noga_przod: ({ v2, p, parametry: q }) => { const s = najnizszaMiednica(p); const a = { R: v2.jointAngles(s.f.sk, 'R').knee, L: v2.jointAngles(s.f.sk, 'L').knee }; const wolna = a.R <= a.L ? 'R' : 'L'; const o = []; const m = Math.min(...p.map((x) => x.f.sk.legs[wolna].ankle[1])); if (m < q.min_y_cm) o.push(`kostka wolnej nogi (${wolna}) schodzi do y = ${f1(m)} cm, a ma ≥ ${q.min_y_cm} cm`);
    const x = s.f.sk.legs[wolna].ankle[0] - s.f.sk.pelvis[0]; if (x < q.min_przod_cm) o.push(`wolna noga (${wolna}) jest ${f1(x)} cm przed miednicą w najniższym punkcie, a ma ≥ ${q.min_przod_cm} cm`); return o; },
  wejscie_na_podwyzszenie: ({ v2, p, parametry: q }) => { const o = []; const r = zakres(p.map((s) => s.f.sk.pelvis[1])); if (r.span < q.min_cm) o.push(`miednica unosi się tylko o ${f1(r.span)} cm, a ma ≥ ${q.min_cm} cm (wejście na podwyższenie)`); const s = p.reduce((b, x) => (x.f.sk.pelvis[1] > b.f.sk.pelvis[1] ? x : b), p[0]); const k = Math.min(v2.jointAngles(s.f.sk, 'R').knee, v2.jointAngles(s.f.sk, 'L').knee); if (k > q.max_kolano_deg) o.push(`na szczycie mniejszy kąt kolan to ${f1(k)}°, a ma ≤ ${q.max_kolano_deg}° (noga na podwyższeniu wyprostowana)`); return o; },
  kolano_tylne_nisko: ({ p, parametry: q }) => { const s = najnizszaMiednica(p); const k = Math.min(s.f.sk.legs.R.knee[1], s.f.sk.legs.L.knee[1]); return k > q.max_cm ? [`tylne kolano w najniższym punkcie jest na y = ${f1(k)} cm, a ma ≤ ${q.max_cm} cm (kolano nisko, przy podłodze)`] : []; },
  lokcie_wysoko: ({ p, parametry: q }) => { const m = Math.min(...p.flatMap((s) => ['R', 'L'].map((side) => s.f.sk.arms[side].elbow[1] - s.f.sk.shoulderC[1]))); return m < -q.max_cm ? [`łokieć schodzi do ${f1(-m)} cm pod barkiem, a ma ≤ ${q.max_cm} cm (łokcie wysoko)`] : []; },
  chwyt_blisko_tulowia: ({ d, p, parametry: q }) => { const st = stronyRak(d); const m = Math.max(...p.map((s) => { const sk = s.f.sk; const G = Gx(s, st); const A = sk.pelvis, B = sk.shoulderC; const v = sub3(B, A), w = sub3(G, A); const t = Math.max(0, Math.min(1, dot3(w, v) / (dot3(v, v) || 1))); return dl(G, [A[0] + v[0] * t, A[1] + v[1] * t, A[2] + v[2] * t]); })); return m > q.max_cm ? [`chwyt oddala się od tułowia do ${f1(m)} cm, a ma ≤ ${q.max_cm} cm (ciężar blisko tułowia)`] : []; },
  kolana_do_klatki: ({ v2, d, p, parametry: q }) => { const ok = p.some((s) => wLocie(v2, d, s, q.min_cm) && srK(v2, s.f.sk, 'hip') >= q.min_biodro_deg && srK(v2, s.f.sk, 'knee') >= q.min_kolano_deg); return ok ? [] : [`w locie kolana nie są podciągnięte do klatki (biodro ≥ ${q.min_biodro_deg}°, kolano ≥ ${q.min_kolano_deg}°)`]; },
});

Object.assign(EWALUATORY, { /* runda 3 */
  zawias_biodrowy: ({ v2, p, parametry: q }) => { const wybierz = (s, st) => (q.noga === 'podporowa' ? [podporowa(s.f.sk)] : ['R', 'L']).map((side) => v2.jointAngles(s.f.sk, side)[st]); const hip = p.map((s) => sred(wybierz(s, 'hip'))), kn = p.map((s) => sred(wybierz(s, 'knee'))); const H = zakres(hip), K = zakres(kn); const o = [];
    if (H.max < q.min_biodro_deg) o.push(`biodro w ruchu dochodzi tylko do ${f1(H.max)}°, a ma ≥ ${q.min_biodro_deg}° (zawias w biodrach)`); if (H.span < q.min_stosunek * K.span) o.push(`zakres biodra ${f1(H.span)}° jest mniejszy niż ${q.min_stosunek} × zakres kolana (${f1(K.span)}°) — ruch ma prowadzić biodro, nie kolano`); return o; },
  klatka_przy_dloniach: ({ v2, d, p, parametry: q }) => { const st = stronyRak(d); const s = maxLokiecSamp(v2, p, st); const x = s.f.sk.shoulderC[1] - Gx(s, st)[1]; return x > q.max_cm ? [`w najniższym punkcie klatka jest ${f1(x)} cm nad dłońmi, a ma ≤ ${q.max_cm} cm (klatka nisko, przy podłodze)`] : []; },
});


/* ---------- runda 4 i 5 (badacz, 26.10.2026): kolano_zakres_ruch, rozstaw_zakres, stopien_swobody, punkt_zakres ---------- */
const kfPole = (s, pole, side) => {
  const kf = s.kf; const pose = s.f?.pose;
  const tulow = kf?.pochylenieTulowia ?? pose?.trunkPitch ?? 0;
  if (pole === 'pochylenieTulowia') return tulow;
  if (pole === 'zgiecieKregoslupa') return kf?.zgiecieKregoslupa ?? pose?.spineBend ?? 0;
  const glowa = kf?.pochylenieGlowy ?? pose?.headPitch ?? Math.max(-20, Math.min(60, tulow * 0.4)); /* domyślna głowa: 40% pochylenia tułowia (jak w silniku) */
  if (pole === 'pochylenieGlowy') return glowa;
  if (pole === 'zgiecieSzyi') { /* głowa względem tułowia w płaszczyźnie strzałkowej CIAŁA (dodatnie = głowa ku przodowi klatki): z geometrii szkieletu, więc działa w każdym ułożeniu (leżąc, pochylony), nie tylko stojąc; bez szkieletu różnica kątów */
    const sk = s.f?.sk; if (sk) return (Math.atan2(dot3(sk.headUp, sk.front), dot3(sk.headUp, sk.up)) * 180) / Math.PI;
    return glowa - tulow; }
  if (POLA_POZA2[pole] === 'tulow') return kf?.[pole] ?? 0;
  if (POLA_POZA2[pole] === 'reka') return kf?.rece?.[side]?.[pole] ?? 0;
  throw new Error(`nieznane pole klatki: ${pole}`);
};
Object.assign(EWALUATORY, {
  kolano_zakres_ruch: ({ v2, p, parametry: q }) => {
    const ocena = (side) => { const r = zakres(p.map((s) => v2.jointAngles(s.f.sk, side).knee)); const o = [];
      if (q.min_max_deg !== undefined && r.max < q.min_max_deg) o.push(`kolano ${side} w ruchu dochodzi tylko do ${f1(r.max)}°, a ma sięgać ≥ ${q.min_max_deg}°`);
      if (q.max_min_deg !== undefined && r.min > q.max_min_deg) o.push(`kolano ${side} w ruchu nie prostuje się poniżej ${f1(r.min)}°, a ma schodzić do ≤ ${q.max_min_deg}°`);
      if (q.min_min_deg !== undefined && r.min < q.min_min_deg) o.push(`kolano ${side} schodzi do ${f1(r.min)}°, a ma być zawsze ≥ ${q.min_min_deg}° (lekko ugięte)`);
      return o; };
    const R = ocena('R'), L = ocena('L');
    if (q.nogi === 'co_najmniej_jedna') return R.length && L.length ? [...R, ...L].map((x) => `${x} (żadna noga nie spełnia: co najmniej jedna ma pracować)`) : [];
    return [...R, ...L];
  },
  rozstaw_zakres: ({ p, parametry: q }) => {
    const klucz = q.punkt === 'kolana' ? 'knee' : 'ankle'; const r = zakres(p.map((s) => dl(s.f.sk.legs.R[klucz], s.f.sk.legs.L[klucz])));
    return r.span < q.min_cm ? [`odległość ${q.punkt === 'kolana' ? 'kolan' : 'kostek'} zmienia się tylko o ${f1(r.span)} cm (${f1(r.min)}…${f1(r.max)}), a ma ≥ ${q.min_cm} cm (rozstaw rośnie albo maleje)`] : [];
  },
  stopien_swobody: ({ d, p, parametry: q }) => {
    const reka = POLA_POZA2[q.pole] === 'reka'; const strony = !reka ? [null] : q.strona === 'R' || q.strona === 'L' ? [q.strona] : q.strona === 'dowolna' ? ['R', 'L'] : stronyRak(d);
    const ocena = (side) => { const v = p.map((s) => kfPole(s, q.pole, side)); const r = zakres(v); const nm = `${q.pole}${side ? ` ${side}` : ''}`; const o = [];
      if (q.min !== undefined && r.min < q.min) o.push(`${nm} schodzi do ${f1(r.min)}, a ma być ≥ ${q.min} w całym ruchu`);
      if (q.max !== undefined && r.max > q.max) o.push(`${nm} dochodzi do ${f1(r.max)}, a ma być ≤ ${q.max} w całym ruchu`);
      if (q.min_zakres !== undefined && r.span < q.min_zakres) o.push(`${nm} zmienia się tylko o ${f1(r.span)} (${f1(r.min)}…${f1(r.max)}), a zakres ma być ≥ ${q.min_zakres}`);
      if (q.max_zakres !== undefined && r.span > q.max_zakres) o.push(`${nm} zmienia się o ${f1(r.span)}, a zakres ma być ≤ ${q.max_zakres}`);
      if (q.osiaga_co_najmniej !== undefined && r.max < q.osiaga_co_najmniej) o.push(`${nm} dochodzi tylko do ${f1(r.max)}, a ma osiągnąć ≥ ${q.osiaga_co_najmniej} w którejś klatce`);
      if (q.osiaga_co_najwyzej !== undefined && r.min > q.osiaga_co_najwyzej) o.push(`${nm} schodzi tylko do ${f1(r.min)}, a ma osiągnąć ≤ ${q.osiaga_co_najwyzej} w którejś klatce`);
      if (q.min_abs !== undefined && Math.max(Math.abs(r.min), Math.abs(r.max)) < q.min_abs) o.push(`${nm} nie osiąga |wartości| ≥ ${q.min_abs} w żadnej klatce (największa ${f1(Math.max(Math.abs(r.min), Math.abs(r.max)))})`);
      return o; };
    const wyniki = strony.map(ocena);
    if (q.strona === 'dowolna') return wyniki.some((o) => !o.length) ? [] : wyniki.flat().map((x) => `${x} (żadna strona nie spełnia)`);
    return wyniki.flat();
  },
  punkt_zakres: ({ p, parametry: q }) => {
    const wybierz = (sk, strona) => { switch (q.punkt) {
      case 'miednica': return sk.pelvis; case 'barki': return sk.shoulderC;
      case 'kolana': case 'kostki': case 'palce': { const k = { kolana: 'knee', kostki: 'ankle', palce: 'toe' }[q.punkt]; return strona ? sk.legs[strona][k] : sr(sk.legs.R[k], sk.legs.L[k]); }
      case 'dlonie': return strona ? sk.arms[strona].grip : sr(sk.arms.R.grip, sk.arms.L.grip);
      default: throw new Error(`nieznany punkt: ${q.punkt}`); } };
    const osie = { x: 0, y: 1, z: 2 }; const kandydaci = q.strona === 'dowolna' ? ['R', 'L'] : [null];
    const ocena = (side) => { const r = Object.fromEntries(q.osie.map((a) => [a, zakres(p.map((s) => wybierz(s.f.sk, side)[osie[a]])).span])); const ok = q.tryb === 'dowolna' ? q.osie.some((a) => r[a] >= q.min_cm) : q.osie.every((a) => r[a] >= q.min_cm);
      return ok ? [] : [`ruch punktu „${q.punkt}${side ? ` ${side}` : ''}” w osiach ${q.osie.map((a) => `${a}: ${f1(r[a])} cm`).join(', ')}, a ${q.tryb === 'dowolna' ? 'co najmniej jedna oś' : 'każda oś'} ma ≥ ${q.min_cm} cm`]; };
    const w = kandydaci.map(ocena); return w.some((o) => !o.length) ? [] : w.flat();
  },
});

/** Naruszenia reguł dla jednej pozy (poprawnej: blad undefined). Zwraca [{ regula, grupa, opisy }] tylko dla złamanych. */
export function naruszenia(v2, d, reguly, blad) {
  const p = probki(v2, d, blad); const out = [];
  for (const r of reguly) { const ev = EWALUATORY[r.typ]; if (!ev) throw new Error(`nieznany typ reguły sensu: ${r.typ}`); const opisy = ev({ v2, d, p, parametry: r.parametry }); if (opisy.length) out.push({ regula: r.id, grupa: r.grupa, opisy }); }
  return out;
}

/** Walidacja sensu: poza poprawna bez naruszeń; każdy błąd łamie dokładnie grupę swojej wskazówki. Zwraca [{ kod, szczegol }]. */
export function sprawdzSens({ v2, poza, rodzina, cwiczenie, root = ROOT }) {
  const bez = bledyBezAnimacji(rodzina, root); const nieAnim = (poza.bledy ?? []).map((b, j) => ({ b, j })).filter(({ b }) => b.cue in bez).map(({ b, j }) => ({ kod: 'blad-sens', szczegol: `bledy[${j}] „${b.cue}”: ${bez[b.cue]}` }));
  const reguly = regulyDla(rodzina, cwiczenie, root); if (!reguly.length) return nieAnim;
  const out = [...nieAnim]; const dane = wczytajSens(root).rodziny[rodzina];
  for (const n of naruszenia(v2, poza, reguly)) for (const o of n.opisy) out.push({ kod: 'sens', szczegol: `reguła „${n.regula}” (wskazówka ${reguly.find((r) => r.id === n.regula).cue ?? 'konwencja'}): ${o}` });
  if (out.length) return out; /* błędy oceniamy dopiero, gdy poza poprawna jest czysta */
  (poza.bledy ?? []).forEach((b, j) => {
    const grupa = dane.grupy_bledow?.[b.cue]; if (!grupa || !reguly.some((r) => r.grupa === grupa)) return;
    const n = naruszenia(v2, poza, reguly, j); const grupy = new Set(n.map((x) => x.grupa)); const lim = reguly.filter((r) => r.grupa === grupa).map((r) => r.id).join(', ');
    if (!grupy.has(grupa)) out.push({ kod: 'blad-sens', szczegol: `bledy[${j}] „${b.cue}”: nie łamie żadnej reguły grupy „${grupa}” (${lim}) — błąd ma wyraźnie przekraczać limity tych reguł (poza błędu musi się dać odróżnić od poprawnej)` });
    for (const g of grupy) if (g !== grupa) out.push({ kod: 'blad-sens', szczegol: `bledy[${j}] „${b.cue}”: łamie także regułę innej grupy „${g}” (${n.filter((x) => x.grupa === g).map((x) => x.regula).join(', ')}) — błąd ma pokazywać tylko „${grupa}”` });
  });
  return out;
}
