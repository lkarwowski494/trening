// Generator póz rodziny forearm po stronie agenta (26.10.2026): przedramiona i chwyt — uginanie nadgarstków (sztanga, hantle, wyciąg; przedramiona na udach), wyprost nadgarstków, pronacja i supinacja przedramienia, odwrotne uginanie z talerzem.
// Nadgarstek: zgiecieNadgarstka (poza@2) zmienia się w zakresie ≥ 50° przy przedramieniu nieruchomo na udzie (łokieć nie rusza się względem barku). Błąd wr.mis.lift: przedramię odrywa się od uda (ramię unosi się razem z łokciem).
// Obrót przedramienia (pronacja/supinacja): obrotPrzedramienia ±60° przy łokciu wspartym o udo.
import { v2, BODY, R, r1, lerp, Y_STOJ, SPRZET, poza, nogiStoj, noga3, bark, ramieFK, ramieU, buduj, naLawce, wyc, wolna, kier } from './gora.mjs';

export const RODZINA = 'forearm';
const POL = (s) => (s === 'R' ? 1 : -1);
const U5 = [0, 0.25, 0.5, 0.75, 1];
const LAW = { rodzaj: 'lawka', x: 0, top: 43, kat: 0, dlugosc: 75, siedzisko: 38 };

/** Siedzenie na ławce (miednica x = px), tułów pochylony tak, by łokieć leżał na udzie przy zgięciu łokcia flex (reguła forearm: ≤ 120°) i przedramię szło poziomo do przodu. Zwraca { m, p, nogi, E (łokieć 3D strony R), sh (bark) }. */
function siedz(px = 12, flex = 117, ey = 61.6, sz = 16) {
  const y = 43 + 9.5 + 0.3; const m = [px, y]; const kol = (s) => [px + 38, 7, POL(s) * 16];
  const d = Math.sqrt(31 * 31 - 9) ; /* ramię w płaszczyźnie strzałkowej (bark 19, łokieć 16: różnica z = 3) */
  const ys = ey + d * Math.sin(flex * R); const p = Math.acos((ys - y) / 50) / R; const sh = bark(m, p, 1); const E = [sh[0] + d * Math.cos(flex * R), ey, sz];
  return { m, p, nogi: { R: noga3(kol('R'), [1, 0.3, 0.1]), L: noga3(kol('L'), [1, 0.3, -0.1]) }, E, sh };
}
/** Uginanie nadgarstków: przedramię poziomo na udzie. o: { nadg: [początek, koniec], obrot, sprzet, jedna, zr (|z| chwytu), blad }. Łokieć = punkt na udzie; przedramię wzdłuż +x. */
function nadgarstek(cw, o) {
  const T = siedz(); const sh = T.sh; const E = (s) => [T.E[0], T.E[1], s * T.E[2]];
  const fr = (u, zle) => {
    const lift = zle ? lerp(0, o.zle ?? 22, u) : 0; /* błąd: przedramię (z łokciem) unosi się od uda o `lift` stopni w barku */
    const rece = {}; const nad = o.nadg ? lerp(o.nadg[0], o.nadg[1], u) : undefined;
    for (const sd of ['R', 'L']) {
      const sg = POL(sd); const pracuje = !o.jedna || o.jedna === sd; const Sd = [sh[0], sh[1], sg * sh[2]];
      const d1 = norm3([E(sg)[0] - Sd[0], E(sg)[1] - Sd[1], E(sg)[2] - Sd[2]]); const d1r = rotY(d1, lift, sg);
      const Eq = [Sd[0] + 31 * d1r[0], Sd[1] + 31 * d1r[1], Sd[2] + 31 * d1r[2]]; const d2 = rotY([1, 0, 0], lift, sg);
      const nn = (pracuje && nad !== undefined ? nad : 0) * R; const upv = rotY([0, 1, 0], lift, sg); const znak = (o.obrot ?? 0) >= 0 ? 1 : -1; /* dłoń zgina się ku stronie dłoni: nachwytem (obrót < 0) w dół, podchwytem w górę */
      const dh = [Math.cos(nn) * d2[0] + Math.sin(nn) * znak * upv[0], Math.cos(nn) * d2[1] + Math.sin(nn) * znak * upv[1], Math.cos(nn) * d2[2] + Math.sin(nn) * znak * upv[2]];
      const g = [Eq[0] + 26 * d2[0] + 7 * dh[0], Eq[1] + 26 * d2[1] + 7 * dh[1], Eq[2] + 26 * d2[2] + 7 * dh[2]];
      rece[sd] = { g, pole: [0, -1, sg * 0.2], obrot: o.obrot, nadg: pracuje ? nad : 0 }; /* biegun łokcia w dół: strona zamykania łokcia (dłoń) do góry, więc obrót +78° = dłoń w górę */
    }
    return poza({ u, tulow: { m: T.m, p: T.p, glowa: T.p * 0.6 }, nogi: T.nogi, rece });
  };
  const sprz = o.sprzet.map((g) => (o.jedna && g.rodzaj === 'hantel' ? { ...g, trzyma: o.jedna } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-80, 150), LAW, ...sprz], fr, us: U5, blad: o.blad ? { cue: 'wr.mis.lift', postawa: false, znacznik: 'bar' } : undefined });
}
const norm3 = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };
/** Obrót wektora wokół osi z (w płaszczyźnie strzałkowej) o `deg` stopni „w górę” (przód → góra). */
const rotY = (v, deg, sg) => { const d = deg * R; void sg; return [v[0] * Math.cos(d) - v[1] * Math.sin(d), v[0] * Math.sin(d) + v[1] * Math.cos(d), v[2]]; };

/** Pronacja / supinacja: łokieć wsparty o udo, przedramię pionowo w górę (zgięcie ≈ 90°), obrót przedramienia ±60°; hantel w dłoni (rączka). */
function obrot(cw, o) {
  /* łokieć na udzie (x = 40), ramię w dół i lekko do przodu, przedramię poziomo do przodu: zgięcie ≈ 72° */
  const ey = 61; const ex = 40; const d1 = [0.3, -0.95]; const sh2 = [ex - 31 * d1[0], ey - 31 * d1[1]]; const p = Math.acos((sh2[1] - 53.8) / 50) / R; const px = sh2[0] - 50 * Math.sin(p * R);
  const T = { m: [px, 53.8], p, nogi: { R: noga3([px + 38, 7, 16], [1, 0.3, 0.1]), L: noga3([px + 38, 7, -16], [1, 0.3, -0.1]) } };
  const fr = (u) => { const rece = {}; for (const sd of ['R', 'L']) { const sg = POL(sd); const pracuje = !o.jedna || o.jedna === sd; const E = [ex, ey, sg * 16]; const g = pracuje ? [E[0] + 32, E[1] + 0.5, sg * 15] : [E[0] + 22, E[1] - 6, sg * 12];
      rece[sd] = { g, pole: [-0.3, -1, sg * 0.5], obrot: pracuje ? lerp(o.obrot[0], o.obrot[1], u) : 0 }; } return poza({ u, tulow: { m: T.m, p: T.p, glowa: T.p * 0.6 }, nogi: T.nogi, rece }); };
  const sprz = o.sprzet.map((g) => (g.rodzaj === 'hantel' ? { ...g, trzyma: o.jedna ?? 'R' } : g));
  return buduj({ rodzina: RODZINA, cw, sprzet: [SPRZET.podloga(-80, 150), { ...LAW, siedzisko: 26 }, ...sprz], fr, us: U5 });
}

export const WYJATKI = {
  'Dumbbell Lying Pronation': 'czysty obrót przedramienia (pronacja) przy łokciu na udzie nie przemieszcza żadnego punktu szkieletu o ≥ 8 cm (hantel = punkt w dłoni, bez dźwigni), a kontrakt wymaga ruchu ≥ 8 cm; ćwiczenie izometryczne w sensie kontraktu wymaga wpisu w data/zrodla/figury-sens.json (decyzja koordynatora/badacza); „lying” w nazwie dodatkowo niezgodne z siedzeniem',
  'Dumbbell Lying Supination': 'jak Dumbbell Lying Pronation: czysty obrót przedramienia (supinacja) bez przemieszczenia punktu ≥ 8 cm — kontrakt wymaga ruchu albo wpisu izometrycznego (decyzja koordynatora/badacza)',
  'Plate Pinch': 'OTWARTE — brak źródła ruchu (zestaw „open”; ćwiczenie izometryczne, istota — chwyt szczypcowy — nie jest stopniem swobody poza@2; figury-sens.json → forearm.otwarte); wstrzymane do czasu źródła',
};
export const PRZYBLIZENIA = {
  'Behind-the-Back Barbell Wrist Curl': 'przybliżenie: stojąc, sztanga za plecami, przedramię nie jest podparte (uginanie samego nadgarstka)',
};

export function generuj() {
  const G = {};
  const NA = [-32, 52]; const NR = [40, -48]; /* zgięcie dłoniowe: z lekkiego wyprostu do zgięcia; odwrotnie: wyprost nadgarstka */
  G['Barbell Wrist Curl'] = () => nadgarstek('Barbell Wrist Curl', { nadg: NA, obrot: 78, sprzet: [SPRZET.sztanga()], blad: true });
  G['Barbell Reverse Wrist Curl'] = () => nadgarstek('Barbell Reverse Wrist Curl', { nadg: NR, obrot: -78, sprzet: [SPRZET.sztanga()], blad: true });
  G['Wrist Curl (hantle)'] = () => nadgarstek('Wrist Curl (hantle)', { nadg: NA, obrot: 78, sprzet: [SPRZET.hantle()], blad: true });
  G['Reverse Wrist Curl (hantle)'] = () => nadgarstek('Reverse Wrist Curl (hantle)', { nadg: NR, obrot: -78, sprzet: [SPRZET.hantle()], blad: true });
  G['One-Arm Dumbbell Wrist Curl'] = () => nadgarstek('One-Arm Dumbbell Wrist Curl', { nadg: NA, obrot: 78, jedna: 'R', sprzet: [SPRZET.hantle()], blad: true });
  G['One-Arm Dumbbell Reverse Wrist Curl'] = () => nadgarstek('One-Arm Dumbbell Reverse Wrist Curl', { nadg: NR, obrot: -78, jedna: 'R', sprzet: [SPRZET.hantle()], blad: true });
  G['Cable Wrist Curl'] = () => nadgarstek('Cable Wrist Curl', { nadg: NA, obrot: 78, sprzet: [wyc({ chwyt: 'drazek', x: 110, y: 20 })], blad: true });
  /* sztanga za plecami, stojąc: samo uginanie nadgarstków */
  G['Behind-the-Back Barbell Wrist Curl'] = () => { const S = bark([0, Y_STOJ], 0, 1); const fr = (u) => { const rece = {}; for (const sd of ['R', 'L']) { const sg = POL(sd); const t1 = -22 * R, t2 = -6 * R; const d1 = [Math.sin(t1), -Math.cos(t1), 0], d2 = [Math.sin(t2), -Math.cos(t2), 0];
      const E = [S[0] + 31 * d1[0], S[1] + 31 * d1[1], sg * 19]; const n = lerp(-30, 50, u) * R; const dh = [Math.cos(n) * d2[0] + Math.sin(n) * 0.978, Math.cos(n) * d2[1], Math.sin(n) * sg * 0.208]; /* dłoń zgina się do tyłu (strona dłoni: tył, z odchyleniem 12° od obrotu przedramienia 78°) */
      rece[sd] = { g: [E[0] + 26 * d2[0] + 7 * dh[0], E[1] + 26 * d2[1] + 7 * dh[1], sg * 19 + 7 * dh[2]], pole: [-1, 0.2, 0], obrot: 78, nadg: lerp(-30, 50, u) }; }
      return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece }); };
    return buduj({ rodzina: RODZINA, cw: 'Behind-the-Back Barbell Wrist Curl', sprzet: [SPRZET.podloga(-80, 120), SPRZET.sztanga()], fr, us: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1] }); };
  /* odwrotne uginanie z talerzem: jak uginanie ramion nachwytem, dłonie na obręczy talerza */
  G['Reverse Plate Curls'] = () => { const o = { f1: [2, 5], f2: [24, 128], a1: 6, zr: 21, obrot: [-70, -70], zle: [10, 36] };
    const fr = (u, zle) => { const a = ramieU(o, u, zle); return poza({ u, tulow: { m: [0, Y_STOJ], p: 0 }, nogi: nogiStoj(0, 14), rece: { R: a, L: a } }); };
    return buduj({ rodzina: RODZINA, cw: 'Reverse Plate Curls', sprzet: [SPRZET.podloga(-80, 120), { rodzaj: 'talerz' }], fr, us: U5, blad: { cue: 'curl.mis.elbows' } }); };
  return G;
}
