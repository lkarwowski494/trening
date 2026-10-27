// Generator póz rodziny thruster po stronie agenta (wersja 1.1, 26.10.2026): przysiad z wyciskaniem nad głowę (thruster hantle i kettlebell) oraz rwanie do rack i wyciskanie (clean and press).
// Pozy WYLICZONE z modelu: przysiad z FK (goleń pochylona do przodu o alfa, udo z kąta tau = zgięcie kolana − alfa), pięty na podłodze, tułów pochylony proporcjonalnie do głębokości; ciężar z rack nad głowę w drugiej połowie ruchu.
// Błąd katalogu sq.mis.heels (pięty odrywają się na dole) łamie tylko regułę „piety” (grupa piety); oly.mis (zaokrąglenie pleców przy rwaniu) — grupa plecy_tor.
import { v2, BODY, R, r1, lerp, ease, HIP, K, poza, PODLOGA, S, klatkaPiersiowa, bladZTrajektorii, bledyZOpisem, kostkaStopyY, kluczeRownoDroznie } from './dol.mjs';

export const RODZINA = 'thruster';
const US = Array.from({ length: 12 }, (_, k) => Math.round(k / 11 * 1000) / 1000); /* 12 klatek (maks. kontraktu): ruch ręki i wstawanie nakładają się, więc potrzeba gęstego próbkowania */
const US_BLAD = [0, 2, 3, 4, 5, 7, 9, 11].map((k) => US[k]); /* kontrakt: błąd ma najwyżej 8 klatek */
export const WYJATKI = {};
export const PRZYBLIZENIA = {};
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const ZS = 12;

/** Profil przysiadu s(u): 0 stoję → 1 na dole (u ≈ 0,35) → 0 stoję (u ≈ 0,8). Profil wyciskania g(u): 0 do u = 0,35 (dół przysiadu), potem rośnie do 1 w u = 1 (wyciskanie zaczyna się w fazie wstawania). */
const e2 = (x) => 0.7 * clamp01(x) + 0.3 * ease(x); /* łagodniejsze wygładzenie: szczytowa prędkość ≈ 1,15 średniej (limit prędkości punktu w kontrakcie) */
const sProf = (u) => (u <= 0.35 ? e2(u / 0.35) : u < 0.8 ? 1 - e2((u - 0.35) / 0.45) : 0);
const gProf = (u) => clamp01((u - 0.35) / 0.65);

/** Przysiad z FK: kostki w (0, ay, ±ZS), s = głębokość 0..1; ay > 7 gdy pięty uniesione (błąd). Zwraca { m, p, ax } . */
function przysiad(s, ay = 7) {
  const b = BODY(); const k = lerp(6, 102, s), al = lerp(3, 30, s), tau = k - al; const ar = al * R, tr = tau * R;
  const hip = [b.shank * Math.sin(ar) - b.thigh * Math.sin(tr), ay + b.shank * Math.cos(ar) + b.thigh * Math.cos(tr)];
  return { m: hip, p: lerp(2, 24, s), ay };
}

function thrusterRamka(u, { kb, heels = false }) {
  const s = sProf(u), g = gProf(u); const pod = heels ? lerp(0, -20, s) : 0; const ay = heels ? lerp(7, kostkaStopyY(0, -20), s) : 7; const q = przysiad(s, ay);
  const c = klatkaPiersiowa(q.m, q.p); const sR = c.sh(1), sL = c.sh(-1);
  const rack = (sg) => c.pt(0, kb ? 30 : 22, sg * 16); const gora = (sg, sh) => [sh[0] + 18, sh[1] + Math.sqrt(63.7 ** 2 - 324), sg * 19];
  const mix = (sg, sh) => { const a = rack(sg), z = gora(sg, sh); return a.map((x, i) => lerp(x, z[i], g)); };
  const el = (sg) => ({ pole: [-0.2, -0.6, sg * 0.9] });
  const nog = (sg) => ({ a: [0, ay, sg * ZS], pod, rot: 12, pole: [1, 0.1, sg * 0.25] });
  return K({ u, m: q.m, p: q.p, head: q.p * 0.4, R: nog(1), L: nog(-1), hr: { g: mix(1, sR), ...el(1) }, hl: { g: mix(-1, sL), ...el(-1) } });
}
function thruster(cw, { kb }) {
  const ok = (u) => thrusterRamka(u, { kb }), zle = (u) => thrusterRamka(u, { kb, heels: true });
  const bl = bladZTrajektorii({ cue: 'sq.mis.heels', znacznik: 'heels', us: US_BLAD, ok, zle });
  const sprzet = kb ? [{ rodzaj: 'kettlebell', trzyma: 'R', dzwon: 'tyl' }, { rodzaj: 'kettlebell', trzyma: 'L', dzwon: 'tyl' }] : [{ rodzaj: 'hantel' }];
  return poza(RODZINA, cw, [PODLOGA(-110, 110), ...sprzet], US.map(ok), bledyZOpisem(cw, [bl], PRZYBLIZENIA));
}

/* ---------- clean and press: z podłogi do rack i nad głowę ---------- */
/** Klucze przebiegu (u, zgięcie kolana k, kąt goleni alfa, pochylenie tułowia p): start z zawisu przy kolanach (rwanie z zawisu) → wyprost → rack (ćwierć przysiadu) → stoję. */
const KLUCZE = [[0, 50, 8, 40], [0.2, 14, 3, 12], [0.32, 10, 3, 4], [0.46, 40, 12, 8], [0.62, 8, 2, 2], [1, 8, 2, 2]];
const klucz = (u) => { for (let i = 1; i < KLUCZE.length; i++) if (u <= KLUCZE[i][0]) { const a = KLUCZE[i - 1], b = KLUCZE[i]; const t = (u - a[0]) / (b[0] - a[0]); return [1, 2, 3].map((j) => lerp(a[j], b[j], e2(t))); } return KLUCZE[KLUCZE.length - 1].slice(1); };
function cleanRamka(u, { bend = 0 }) {
  const b = BODY(); const [k, al, p] = klucz(u); const tau = k - al; const ar = al * R, tr = tau * R; const hip = [b.shank * Math.sin(ar) - b.thigh * Math.sin(tr), 7 + b.shank * Math.cos(ar) + b.thigh * Math.cos(tr)];
  const c = klatkaPiersiowa(hip, p, { bend }); const sR = c.sh(1), sL = c.sh(-1);
  const w1 = clamp01((u - 0.2) / 0.26), w2 = clamp01((u - 0.4) / 0.6);
  const reka = (sg, sh) => { const z0 = sg * 22; const dzz = 22 - 19; const vis = [sh[0] + 7, sh[1] - Math.sqrt(60 ** 2 - 49 - dzz * dzz), z0]; const rack = c.pt(-4, 18, sg * 16); const gora = [sh[0] + 18, sh[1] + Math.sqrt(62.9 ** 2 - 324), sg * 19];
    const g1 = vis.map((x, i) => lerp(x, rack[i], w1)); return g1.map((x, i) => lerp(x, gora[i], w2)); };
  const poleL = (sg) => [0, -0.3, sg]; /* łokcie na zewnątrz i lekko w dół w całym ruchu (stały biegun: łokieć nie przeskakuje) */
  const nog = (sg) => ({ a: [0, 7, sg * ZS], pod: 0, rot: 12, pole: [1, 0.1, sg * 0.25] });
  return K({ u, m: hip, p, bend, head: p * 0.4, R: nog(1), L: nog(-1), hr: { g: reka(1, sR), pole: poleL(1) }, hl: { g: reka(-1, sL), pole: poleL(-1) } });
}
function cleanPress(cw) {
  const ok = (u) => cleanRamka(u, {}), zle = (u) => cleanRamka(u, { bend: 30 * Math.sin(Math.PI * clamp01(u / 0.55)) });
  const sprzet = [PODLOGA(-110, 110), { rodzaj: 'sztanga', talerze: true, podazaZaChwytem: true, dlugosc: 220 }];
  const us = kluczeRownoDroznie(RODZINA, cw, sprzet, ok, 12); const usBlad = [0, 2, 3, 4, 5, 7, 9, 11].map((k) => us[k]);
  const bl = bladZTrajektorii({ cue: 'oly.mis', znacznik: 'back', us: usBlad, ok, zle });
  return poza(RODZINA, cw, sprzet, us.map(ok), bledyZOpisem(cw, [bl], PRZYBLIZENIA));
}

export function generuj() {
  return {
    'Thruster (hantle)': () => thruster('Thruster (hantle)', { kb: false }),
    'Kettlebell Thruster': () => thruster('Kettlebell Thruster', { kb: true }),
    'Clean and Press': () => cleanPress('Clean and Press'),
  };
}
