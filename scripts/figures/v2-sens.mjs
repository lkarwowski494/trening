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
  const w = r.warianty?.[cwiczenie]; if (!w) return [];
  const ids = typeof w === 'string' ? r.warianty[w] : w;
  return ids.map((id) => ({ id, ...r.reguly[id] }));
}
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
/** Strony, których dotyczą reguły rąk: obie albo tylko ręka trzymająca drążek (ćwiczenie jednorącz: sprzet.trzyma R/L — ręka wolna nie podlega regułom rąk). */
const stronyRak = (d) => { const t = drazek(d)?.trzyma; return t === 'R' || t === 'L' ? [t] : ['R', 'L']; };

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
  jedna_reka: ({ d, p, parametry: q }) => {
    const b = drazek(d); if (!b) return []; if (b.trzyma !== 'R' && b.trzyma !== 'L') return ['ćwiczenie jednorącz, a sprzet[] ma drążek trzymany obiema rękami — ustaw na sztandze trzyma: "R" albo "L"'];
    const wolna = b.trzyma === 'R' ? 'L' : 'R'; const o = [];
    const min = Math.min(...p.map((s) => { const g = s.f.sk.arms[wolna].grip; return Math.hypot(g[0] - (b.x ?? 0), g[1] - (b.y ?? 0)); }));
    if (min < q.min_wolna_od_osi_cm) o.push(`wolna dłoń ${wolna} jest ${f1(min)} cm od osi drążka, a ma być ≥ ${q.min_wolna_od_osi_cm} cm (wolna ręka poza drążkiem, np. wzdłuż tułowia)`);
    return o;
  },
};

/** Naruszenia reguł dla jednej pozy (poprawnej: blad undefined). Zwraca [{ regula, grupa, opisy }] tylko dla złamanych. */
export function naruszenia(v2, d, reguly, blad) {
  const p = probki(v2, d, blad); const out = [];
  for (const r of reguly) { const ev = EWALUATORY[r.typ]; if (!ev) throw new Error(`nieznany typ reguły sensu: ${r.typ}`); const opisy = ev({ v2, d, p, parametry: r.parametry }); if (opisy.length) out.push({ regula: r.id, grupa: r.grupa, opisy }); }
  return out;
}

/** Walidacja sensu: poza poprawna bez naruszeń; każdy błąd łamie dokładnie grupę swojej wskazówki. Zwraca [{ kod, szczegol }]. */
export function sprawdzSens({ v2, poza, rodzina, cwiczenie, root = ROOT }) {
  const reguly = regulyDla(rodzina, cwiczenie, root); if (!reguly.length) return [];
  const out = []; const dane = wczytajSens(root).rodziny[rodzina];
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
