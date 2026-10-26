// Diagnostyka ciągłości: dla pozy z generatora wypisuje drogę najszybszego punktu na odcinek i sumę (limit kontraktu: maxJump · step cm na cały ruch).
import { join, dirname } from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
import { v2 } from './model.mjs';
const [rodzina, cw] = process.argv.slice(2);
const mod = await import(pathToFileURL(join(dirname(fileURLToPath(import.meta.url)), `${rodzina}.mjs`)).href);
const poza = mod.generuj()[cw](); const E = v2(); const C = E.CONTRACT;
const pts = (f) => [['miednica', f.sk.pelvis], ['glowa', f.sk.head], ['bark', f.sk.shoulderC], ...['R', 'L'].flatMap((s) => [['kolano' + s, f.sk.legs[s].knee], ['kostka' + s, f.sk.legs[s].ankle], ['pieta' + s, f.sk.legs[s].heel], ['palce' + s, f.sk.legs[s].toe], ['lokiec' + s, f.sk.arms[s].elbow], ['chwyt' + s, f.sk.arms[s].grip]]), ...(f.info?.load ? [['ciezar', f.info.load]] : [])];
const d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
let tot = 0; const us = poza.klatki.map((k) => k.u); const rows = [];
for (let i = 1; i < us.length; i++) { const a = pts(E.keyframeFrame(poza, us[i - 1])), b = pts(E.keyframeFrame(poza, us[i])); let m = 0, who = ''; a.forEach((p, j) => { const d = d3(p[1], b[j][1]); if (d > m) { m = d; who = p[0]; } }); const du = us[i] - us[i - 1]; tot += m; rows.push(`  ${us[i - 1].toFixed(3)}→${us[i].toFixed(3)}  ${m.toFixed(1)} cm (${who}) tempo ${(m / du / C.step).toFixed(1)} cm/${C.step}`); }
console.log(rows.join('\n')); console.log(`suma dróg ${tot.toFixed(0)} cm, limit ${C.maxJump * C.step} cm`);
