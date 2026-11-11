// Generator póz rodziny pull_up po stronie agenta — TYLKO trzy ćwiczenia poprawione po recenzji ruchu 1.1 (27.10.2026, partia 1; reszta rodziny pochodzi z importu z przeglądem i nie ma generatora):
//  - Wide-Grip Rear Pull-Up: podciąganie ZA KARK — głowa przechodzi przed drążek (środek głowy ≥ 8 cm przed osią drążka na górze), drążek kończy za karkiem;
//  - Scapular Pull-Up: ruch ŁOPATEK na prostych rękach — barki z uniesienia (zwis bierny) do obniżenia, ciało unosi się o kilka cm, kolana nieruchome;
//  - Dead Hang: ćwiczenie izometryczne — poza statyczna (dwie identyczne klatki), jedynym ruchem w podglądzie jest błąd „bujanie”.
// Pozy WYLICZONE z modelu (długość ręki z silnika, miednica z bisekcji), błąd pu.noSwing (stopy w przód) jak w pozostałych ćwiczeniach rodziny.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { v2, r1, klatka, zbuduj } from './model.mjs';

/** Pozy zatwierdzone z importu z przeglądem ruchu (8 ćwiczeń, po poprawkach P1–P4 fali 25 wniesionych do pliku): odtwarzane 1:1 z `pull_up-zatwierdzone.json` (wniesione do generatora 11.11.2026, W-02 C; rysunek użytkownika bez zmian).
 * Zmiana pozy = zmiana tego pliku po przeglądzie arkusza, nie obejście testu odtwarzalności. */
const ZATWIERDZONE = JSON.parse(readFileSync(fileURLToPath(new URL('./pull_up-zatwierdzone.json', import.meta.url)), 'utf8'));
const zatwierdzona = (cw) => () => JSON.parse(JSON.stringify(ZATWIERDZONE[cw]));

export const RODZINA = 'pull_up';
export const WYJATKI = {};
export const PRZYBLIZENIA = {};
const Y_DRAZEK = 230; const ZG = 22; /* dłonie na drążku: z = ±22 */
/** Łokieć na dole (u = 0) nie większy niż tyle stopni (ręce proste; reguła sensu dol_rece_proste w data/zrodla/figury-sens.json ma ten sam próg; Dead Hang i Scapular Pull-Up: 8°). */
const LOKIEC_DOL_DEG = 7;
const sprzet = (y) => [{ rodzaj: 'sztanga', x: 0, y, dlugosc: 128, talerze: false, podazaZaChwytem: false }, { rodzaj: 'slupek', x: 0, h: y + 5 }, { rodzaj: 'podloga', x0: -120, x1: 120 }];
/** Błąd pu.noSwing: stopy wychodzą w przód i w górę (kolana się podkurczają); jak w pozostałych ćwiczeniach rodziny (delty kostek w klatkach u = 0, 0,5, 1). */
const bladBujanie = () => ({ cue: 'pu.noSwing', znacznik: 'knees', dotyczy: [], klatki: [{ u: 0 }, { u: 0.5, nogi: { R: { kostka: [16, 8, 0] }, L: { kostka: [16, 8, 0] } } }, { u: 1, nogi: { R: { kostka: [20, 10, 0] }, L: { kostka: [20, 10, 0] } } }] });

/** Klatka zwisu: miednica m, pochylenie p, głowa h, dłonie na drążku (y), stopy pod miednicą (dx, dy); uniesienie barków `up` (cm). */
function zwis({ u, m, p = 0, h = 0, y = Y_DRAZEK, up, kostka = [-4, -82], zg = ZG }) {
  const noga = (z) => ({ k: [m[0] + kostka[0], m[1] + kostka[1], z], pod: -10, rot: 10 });
  const reka = (z) => ({ g: [0, y, z], ...(up !== undefined ? { uniesienie: up } : {}) });
  return klatka({ u, miednica: m, pitch: p, glowa: h, nogi: { R: noga(15), L: noga(-15) }, rece: { R: reka(zg), L: reka(-zg) } });
}
/** Największe y miednicy, przy którym łokieć jest ≤ maxLokiec (ręka prosta, dłonie na drążku); skan co 0,1 cm w dół. */
function miednicaProstaReka(opis, maxLokiec) {
  const E = v2();
  for (let y = 160; y > 60; y -= 0.1) {
    const k0 = zwis({ ...opis, u: 0, m: [opis.m[0], y, 0] }); const k1 = { ...k0, u: 1 };
    try { const sk = E.keyframeFrame({ kontrakt: E.CONTRACT.id, rodzina: RODZINA, cwiczenie: 'x', sprzet: sprzet(opis.y ?? Y_DRAZEK), klatki: [k0, k1], bledy: [] }, 0).sk; if (E.jointAngles(sk, 'R').elbow <= maxLokiec) return r1(y); } catch { /* poza zasięgiem — niżej */ }
  }
  throw new Error('miednicaProstaReka: brak rozwiązania');
}

export function generuj() {
  return {
    ...Object.fromEntries(Object.keys(ZATWIERDZONE).map((cw) => [cw, zatwierdzona(cw)])),
    'Wide-Grip Rear Pull-Up': () => {
      /* drążek 245, chwyt ±35; miednica stale w x = 4,5 (bez bujania ≤ 3 cm), tułów do 3° (reguła tulow_pion), głowa wysunięta przed drążek od ok. u = 0,25 (przechodzi przed nim, nie przez niego) */
      /* P4 (fala 25, 01.11.2026): na dole ręce proste (łokieć ≤ LOKIEC_DOL_DEG; było 21,9°) — miednica z tego samego skanu co Dead Hang; dodatkowa klatka u = 0,05 (+1 cm) łagodzi start z prostych rąk (ciągłość) */
      const y = 245; const ZG_SZEROKI = 35; const y0 = miednicaProstaReka({ m: [4.5, 0, 0], y, zg: ZG_SZEROKI }, LOKIEC_DOL_DEG);
      const us = [0, 0.05, 0.25, 0.5, 0.75, 1]; const my = [y0, r1(y0 + 1), 154.2, 170, 180.5, 186.3]; const p = [0, 0, 1, 2, 3, 3]; const h = [0, 0, 20, 35, 35, 35];
      const kl = us.map((u, i) => { const k = zwis({ u, m: [4.5, my[i], 0], p: p[i], h: h[i], y, zg: ZG_SZEROKI }); return k; });
      return zbuduj({ rodzina: RODZINA, cwiczenie: 'Wide-Grip Rear Pull-Up', sprzet: sprzet(y), klatki: kl, bledy: [bladBujanie()] });
    },
    'Scapular Pull-Up': () => {
      /* ręce proste (łokieć ≤ 8°) w całym ruchu; barki +5 → −3 cm (zwis bierny → obniżenie łopatek); miednica unosi się o tyle, ile obniżenie barku odbiera ramieniu */
      const us = [0, 0.5, 1]; const up = [5, 1, -3];
      const kl = us.map((u, i) => { const m = [0, miednicaProstaReka({ m: [0, 0, 0], up: up[i] }, 8), 0]; return zwis({ u, m, up: up[i] }); });
      return zbuduj({ rodzina: RODZINA, cwiczenie: 'Scapular Pull-Up', sprzet: sprzet(Y_DRAZEK), klatki: kl, bledy: [bladBujanie()] });
    },
    'Dead Hang': () => {
      /* statyczny zwis na prostych rękach (barki uniesione biernie), nogi swobodnie w dół; dwie identyczne klatki (kontrakt wymaga ≥ 2) */
      const m = [0, miednicaProstaReka({ m: [0, 0, 0], up: 4 }, 8), 0];
      const kl = [0, 1].map((u) => zwis({ u, m, up: 4 }));
      return zbuduj({ rodzina: RODZINA, cwiczenie: 'Dead Hang', sprzet: sprzet(Y_DRAZEK), klatki: kl, bledy: [bladBujanie()] });
    },
  };
}
