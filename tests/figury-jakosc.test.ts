/*
 * Reguły JAKOŚCI póz figur v2 (scripts/figures/v2-jakosc.mjs; docs/53; L-040): 12 luk z recenzji ruchu pilotażu agent-pozy (26.10.2026) zamienionych w sprawdzenia automatyczne.
 * Dla KAŻDEJ reguły: poza spełniająca (brak komunikatu) i łamiąca (komunikat z liczbami). Pozy bierzemy z danych (lib/figures/v2/poses) i modyfikujemy; reguły oparte na kształtach rysunku
 * (styk z podłogą z przodu, zasłanianie) dostają kształty syntetyczne. Plus: remis „skrajnej” w regule miednica_na_linii i zdjęcie wymogu zerowej delty w u = 0 dla błędów postawy.
 */
import * as fs from 'fs';
import * as path from 'path';
import { execFileSync } from 'child_process';

jest.setTimeout(180000);
const ROOT = path.join(__dirname, '..');
const run = (code: string) => JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT, env: { PATH: process.env.PATH ?? '' } as unknown as NodeJS.ProcessEnv, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }));

const KOD = `
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { loadV2 } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-build.mjs'))};
import * as J from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-jakosc.mjs'))};
import { waliduj } from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))};
import * as SENS from ${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-sens.mjs'))};
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jakosc-test-')); const { v2 } = loadV2(dir);
const poza = (f, cw) => JSON.parse(JSON.stringify(JSON.parse(fs.readFileSync(path.join(${JSON.stringify(ROOT)}, 'lib/figures/v2/poses', f + '.json'), 'utf8')).cwiczenia[cw]));
const PU = poza('pushup_plank', 'Push Up'), PL = poza('pushup_plank', 'Plank'), CL = poza('pushup_plank', 'Close-Grip Push-Up'), SA = poza('pushup_plank', 'Single-Arm Push-Up'), RC = poza('core_floor', 'Reverse Crunch'),  BD = poza('core_floor', 'Bird Dog'), CO = poza('core_floor', 'Cocoons');
const klon = (x) => JSON.parse(JSON.stringify(x));
const G = await import(${JSON.stringify(path.join(ROOT, 'scripts/figures/agent-pozy/pushup_plank.mjs'))});
const IR = G.inverted('Inverted Row', { by: 100, axOverride: 94, thetaEnd: 144, pole: [0, -1, 0.15] }); /* koniec ruchu: łokieć za linią pleców (n3), start skośny */
const CH = poza('core_floor', 'Crunch - Hands Overhead'), RO = poza('pushup_plank', 'Rollout (sztanga)'), WD = poza('pushup_plank', 'Push-Up Wide');
const W = {};
/* 1 błąd postawy w każdej klatce */
const bad1 = JSON.parse(JSON.stringify(PL)); bad1.bledy[0].klatki[0] = { u: 0 };
W.blad_widoczny_stale = { dobre: J.bladWidocznyStale(v2, PL, new Set(['plank.mis.sag'])), zle: J.bladWidocznyStale(v2, bad1, new Set(['plank.mis.sag'])) };
/* 2 nic pod podłogą */
const bad2 = JSON.parse(JSON.stringify(PU)); for (const k of bad2.klatki) { k.rece.R.chwyt[1] = -12; k.rece.L.chwyt[1] = -12; }
W.pod_podloga = { dobre: J.podPodloga(v2, PU), zle: J.podPodloga(v2, bad2) };
/* 3 styk z podłogą z przodu (kształty) */
const stopa = (id, y0) => ({ id, pts: [[-5, y0], [5, y0], [3, y0 + 11]] });
W.styk_z_podloga_przod = { dobre: J.stykZPodlogaPrzod([stopa('footR', 0), stopa('footL', 0.5)], { R: 0, L: 0.5 }), zle: J.stykZPodlogaPrzod([stopa('footR', 13), stopa('footL', 0)], { R: 0, L: 0 }) };
/* 4 kolejność zasłaniania (kształty: z = głębokość, skrzynia ma być PO dalszych częściach ciała) */
const kszt = (id, z, x0) => ({ id, z, pts: [[x0, 0], [x0 + 20, 0], [x0 + 20, 30], [x0, 30]] });
W.zaslanianie_sprzetu = { dobre: J.zaslanianieSprzetu([kszt('footR', 5, 0), kszt('box', 14.5, 0)], 14), zle: J.zaslanianieSprzetu([kszt('footR', 5, 0), kszt('box', -1040, 0)], 14) };
/* 5 ręce wzdłuż ciała */
const bad5 = JSON.parse(JSON.stringify(RC)); for (const k of bad5.klatki) { k.rece.R.chwyt[1] = 60; k.rece.L.chwyt[1] = 60; k.rece.R.biegunLokcia = [0, 1, 0]; k.rece.L.biegunLokcia = [0, 1, 0]; }
W.rece_wzdluz_ciala = { dobre: J.receWzdluzCiala(v2, RC), zle: J.receWzdluzCiala(v2, bad5) };
/* 6 kolejne klatki różne / statyczne */
const bad6 = JSON.parse(JSON.stringify(PU)); bad6.klatki.splice(2, 0, { ...JSON.parse(JSON.stringify(bad6.klatki[1])), u: 0.4 });
const bad6b = JSON.parse(JSON.stringify(PL)); bad6b.klatki = [bad6b.klatki[0], { ...bad6b.klatki[0], u: 0.5 }, { ...bad6b.klatki[0], u: 1 }];
W.klatki_rozne = { dobre: [...J.klatkiRozne(v2, PU, false), ...J.klatkiRozne(v2, PL, true)], zle: [...J.klatkiRozne(v2, bad6, false), ...J.klatkiRozne(v2, bad6b, true)] };
/* 7 sprzęt rozpoznawczy */
const z1 = { cwiczenie: 'Suspended Push-Up', sprzet: [{ rodzaj: 'podloga' }, { rodzaj: 'zawieszenie' }] }, z2 = { cwiczenie: 'Suspended Push-Up', sprzet: [{ rodzaj: 'podloga' }, { rodzaj: 'sztanga' }] };
W.sprzet_rozpoznawczy = { dobre: [...J.sprzetRozpoznawczy(z1), ...J.sprzetRozpoznawczy({ cwiczenie: 'Push Up', sprzet: [] })], zle: J.sprzetRozpoznawczy(z2) };
/* 8 podstawa szeroka */
const bad8 = JSON.parse(JSON.stringify(SA)); for (const k of bad8.klatki) { k.nogi.R.kostka[2] = 8; k.nogi.L.kostka[2] = -8; }
W.podstawa_szeroka = { dobre: J.podstawaSzeroka(SA), zle: J.podstawaSzeroka(bad8) };
/* 9 szyja */
const bad9 = JSON.parse(JSON.stringify(PU)); for (const k of bad9.klatki) k.pochylenieGlowy = 0;
W.szyja_neutralna = { dobre: J.szyjaNeutralna(v2, PU), zle: J.szyjaNeutralna(v2, bad9) };
/* 10 etykieta błędu */
W.etykieta_bledu = { dobre: J.etykietaBledu(PU, { 'push.mis.partial': 'Skracanie ruchu.' }), zle: J.etykietaBledu(PU, {}) };
/* 11 odwiedzenie łokcia */
const bad11 = JSON.parse(JSON.stringify(PU)); for (const k of bad11.klatki) { k.rece.R.biegunLokcia = [0, 0, 1]; k.rece.L.biegunLokcia = [0, 0, -1]; }
W.odwiedzenie_lokcia = { dobre: J.odwiedzenieLokcia(v2, PU), zle: J.odwiedzenieLokcia(v2, bad11) };
/* 12 łokieć za barkiem (wariant wąski) */
const bad12 = JSON.parse(JSON.stringify(CL)); for (const k of bad12.klatki) { k.rece.R.biegunLokcia = [1, 0, 0.1]; k.rece.L.biegunLokcia = [1, 0, -0.1]; }
W.lokiec_za_barkiem = { dobre: J.lokiecZaBarkiem(v2, CL), zle: J.lokiecZaBarkiem(v2, bad12) };
/* 13 odwiedzenie łokcia z przodu w każdej klatce: biegun łokcia ku tyłowi (ciasno) vs w bok (litera T); ten sam średni łokieć: dopuszczalny w szerokiej, za szeroki w wąskiej i domyślnej */
const ciasna = klon(PU); for (const k of ciasna.klatki) { k.rece.R.biegunLokcia = [-1, 0, 0.1]; k.rece.L.biegunLokcia = [-1, 0, -0.1]; }
const wBok = klon(PU); for (const k of wBok.klatki) { k.rece.R.biegunLokcia = [0, 0, 1]; k.rece.L.biegunLokcia = [0, 0, -1]; }
const srednia = klon(PU); for (const k of srednia.klatki) { k.rece.R.biegunLokcia = [-1, 0, 1.5]; k.rece.L.biegunLokcia = [-1, 0, -1.5]; } /* ≈ 56°: nad progiem 45°, pod 70° */
const jako = (p, cw) => ({ ...p, cwiczenie: cw });
W.odwiedzenie_lokcia_przod = { dobre: J.odwiedzenieLokciaPrzod(v2, ciasna), zle: J.odwiedzenieLokciaPrzod(v2, wBok) };
W.odwiedzenie_przod_wariant = { dobre: [...J.odwiedzenieLokciaPrzod(v2, jako(srednia, 'Push-Up Wide'))], zle: [...J.odwiedzenieLokciaPrzod(v2, srednia), ...J.odwiedzenieLokciaPrzod(v2, jako(srednia, 'Close-Grip Push-Up')), ...J.odwiedzenieLokciaPrzod(v2, jako(srednia, 'Diamond Push Up'))] };
/* litera T (≈ 90°) odrzucana w każdym wariancie; wariant szeroki ma dolną granicę (ciasne łokcie to nie pompka szeroka) */
W.litera_T = { dobre: [], zle: ['Push Up', 'Push-Up Wide', 'Close-Grip Push-Up', 'Diamond Push Up', 'Inverted Row'].map((c) => J.odwiedzenieLokciaPrzod(v2, jako(wBok, c)).length) };
W.wide_dolna_granica = { dobre: J.odwiedzenieLokciaPrzod(v2, jako(srednia, 'Push-Up Wide')), zle: J.odwiedzenieLokciaPrzod(v2, jako(ciasna, 'Push-Up Wide')) };
/* geometria przed kątem: łokieć nad nadgarstkiem w dolnej fazie, rozstaw dłoni 50/100/150% rozstawu barków */
W.lokiec_nad_nadgarstkiem = { dobre: J.lokiecNadNadgarstkiem(v2, ciasna), zle: J.lokiecNadNadgarstkiem(v2, srednia) };
const waska = klon(PU); for (const k of waska.klatki) { k.rece.R.chwyt[2] = 10; k.rece.L.chwyt[2] = -10; }
W.rozstaw_dloni = { dobre: [...J.rozstawDloni(v2, PU), ...J.rozstawDloni(v2, jako(waska, 'Close-Grip Push-Up')), ...J.rozstawDloni(v2, jako(waska, 'Diamond Push Up'))], zle: [...J.rozstawDloni(v2, waska), ...J.rozstawDloni(v2, jako(PU, 'Close-Grip Push-Up')), ...J.rozstawDloni(v2, jako(PU, 'Push-Up Wide'))] };
W.odwiedzenie_przod_integracja = { dobre: J.sprawdzJakosc(ciasna, { v2, rodzina: 'pushup_plank', cwiczenie: 'Push Up', postural: new Set(), izometryczne: false, teksty: { 'push.mis.partial': 'x' } }).filter((x) => x.regula === 'odwiedzenie_lokcia_przod'), zle: J.sprawdzJakosc(wBok, { v2, rodzina: 'pushup_plank', cwiczenie: 'Push Up', postural: new Set(), izometryczne: false, teksty: { 'push.mis.partial': 'x' } }).filter((x) => x.regula === 'odwiedzenie_lokcia_przod') };
/* 14 nic nie wisi: leżące ćwiczenie z miednicą i barkami o 12 cm nad podłogą; czworaki (Bird Dog) poza regułą */
const wisi = klon(RC); for (const k of wisi.klatki) k.miednica[1] += 12;
const ctxCF = (cw) => ({ v2, rodzina: 'core_floor', cwiczenie: cw, postural: new Set(), izometryczne: false, teksty: new Proxy({}, { get: () => 'x' }) });
W.nic_nie_wisi = { dobre: [...J.nicNieWisi(v2, RC), ...J.nicNieWisi(v2, CO)], zle: J.nicNieWisi(v2, wisi) };
W.nic_nie_wisi_zakres = { dobre: [J.nicNieWisi(v2, BD).length > 0 ? 0 : 1, J.sprawdzJakosc(BD, ctxCF('Bird Dog')).filter((x) => x.regula === 'nic_nie_wisi').length, J.sprawdzJakosc(RC, ctxCF('Reverse Crunch')).filter((x) => x.regula === 'nic_nie_wisi').length], zle: [J.sprawdzJakosc(wisi, ctxCF('Reverse Crunch')).filter((x) => x.regula === 'nic_nie_wisi').length] };
/* 15 rząd błędu nie zmienia stawów spoza błędu: „sag” z uniesionymi kostkami zgina kolana */
const kolana = klon(PL); for (const k of kolana.bledy[0].klatki) k.nogi = { R: { kostka: [0, 12, 0] }, L: { kostka: [0, 12, 0] } };
W.rzad_bledu_dotyczy = { dobre: J.rzadBleduDotyczy(v2, PL), zle: J.rzadBleduDotyczy(v2, kolana) };
/* 16 tor łokcia w przyciąganiu: biegun łokcia ku drążkowi (przed klatkę) vs ku podłodze (za plecami) */
const przed = klon(IR); for (const k of przed.klatki) { k.rece.R.biegunLokcia = [1, 0, 0.15]; k.rece.L.biegunLokcia = [1, 0, -0.15]; }
W.tor_lokcia_przyciaganie = { dobre: J.torLokciaPrzyciagania(v2, IR), zle: J.torLokciaPrzyciagania(v2, przed) };
/* 17 środek ciężkości nad podparciem: tułów przesunięty o 18 cm w stronę niepodpartą */
const poza_ = klon(SA); for (const k of poza_.klatki) k.miednica[2] -= 18;
W.srodek_ciezkosci_podparcie = { dobre: J.srodekCiezkosciNadPodparciem(v2, SA), zle: J.srodekCiezkosciNadPodparciem(v2, poza_) };
W.otoczka_i_masy = { dobre: [J.otoczka([[0, 0], [4, 0], [4, 4], [0, 4], [2, 2]]).length === 4 ? 0 : 1, Math.abs(J.MASY.glowa.masa + J.MASY.tulow.masa + 2 * ['ramie', 'przedramie', 'dlon', 'udo', 'golen', 'stopa'].reduce((t, k) => t + J.MASY[k].masa, 0) - 1) < 1e-9 ? 0 : 1, J.otoczka([[0, 0], [1, 1]]).length === 2 ? 0 : 1], zle: [] };
/* 18 zgodność manifestu z obrazem */
const zm = (...a) => J.zgodnoscManifestu(...a).map((x) => x.szczegol);
const mf = (c, przybl = {}, wyj = {}) => ({ wyjatki: wyj, przyblizenia: przybl, cwiczenia: [c] });
const cw0 = { cwiczenie: 'Plank', klatki_u: [0, 1], klatki_na_obrazie: [0, 1], bledy_w_pozie: ['plank.mis.sag'], bledy_wskazowki_id: ['plank.mis.sag'] };
const tk = { 'plank.mis.sag': 'Opadające biodra.' };
W.manifest_klatki = { dobre: zm(mf(cw0), tk), zle: [...zm(mf({ ...cw0, klatki_na_obrazie: [0, 0.5, 1] }), tk), ...zm(mf({ ...cw0, klatki_na_obrazie: undefined }), tk)] };
W.manifest_przyblizenia = { dobre: [...zm(mf(cw0, { Plank: 'x' }), tk), ...zm(mf(cw0, { 'Suspended Push-Up': 'x' }, { 'Suspended Push-Up': 'przenikanie taśmy 0,33 cm > 0,3' }), tk)], zle: [...zm(mf(cw0, { 'Suspended Push-Up': 'x' }), tk), ...zm(mf(cw0, { 'Suspended Push-Up': 'x' }, { 'Suspended Push-Up': ' ' }), tk)] };
W.manifest_opis_bledu = { dobre: [...zm(mf(cw0), tk), ...zm(mf({ ...cw0, bledy_wskazowki_id: ['cobra.mis'] }), tk, { 'cobra.mis': 'tekst do napisania przez badacza' })], zle: [...zm(mf({ ...cw0, bledy_wskazowki_id: ['cobra.mis'] }), tk), ...zm(mf(cw0), tk, { 'cobra.mis': '' })] };
/* 19 układ podglądu: jeden wiersz na rząd; HTML ma po jednej komórce na klatkę kluczową w obu widokach i nie zawija wiersza */
W.podglad_jeden_wiersz = { dobre: J.wierszeWJednejLinii([{ etykieta: 'poza poprawna', dolne: [110, 110, 111.5, 110] }]), zle: J.wierszeWJednejLinii([{ etykieta: 'poza poprawna', dolne: [110, 110, 110, 310] }]) };
const V = await import(${JSON.stringify(path.join(ROOT, 'scripts/figures/v2-validate.mjs'))});
const hp = (p) => V.htmlPodgladu(p, 'light'); const hRC = hp(RC), hPL = hp(PL), hRoll = hp(poza('pushup_plank', 'Rollout (sztanga)'));
const komorek = (h) => (h.html.match(/class="k"/g) || []).length;
W.podglad_html = { dobre: [JSON.stringify(hPL.klatki) === JSON.stringify(PL.klatki.map((k) => k.u)) ? 0 : 1, komorek(hPL) === 2 * PL.klatki.length * (1 + PL.bledy.length) ? 0 : 1, komorek(hRoll) === 2 * 9 * (1 + 1) ? 0 : 1, /flex-wrap:nowrap/.test(hRC.html) && !/flex-wrap:wrap/.test(hRC.html) ? 0 : 1, hRoll.px < 1.5 ? 0 : 1], zle: [] };
/* 14b lędźwie przy podłodze: spięcie z bend (lędźwie nisko) vs siad (tułów sztywno od miednicy); wskazówka z tekstów włącza regułę, V-Up/Cocoons/Tuck wyłączone jawnie */
const siad = klon(CH); for (const k of siad.klatki) k.zgiecieKregoslupa = 0;
W.ledzwie_przy_podlodze = { dobre: J.ledzwiePrzyPodlodze(v2, CH), zle: J.ledzwiePrzyPodlodze(v2, siad) };
const tkst = J.wczytajTeksty();
W.ledzwie_zakres = { dobre: [J.maWskazowkeLedzwie('Crunch - Hands Overhead', tkst) ? 0 : 1, J.maWskazowkeLedzwie('Hollow Hold', tkst) ? 0 : 1, J.maWskazowkeLedzwie('Alternate Heel Touchers', tkst) ? 0 : 1, J.maWskazowkeLedzwie('Bird Dog', tkst) ? 1 : 0, ['V-Up', 'Cocoons', 'Tuck Crunch'].every((c) => c in J.LEDZWIE_WYJATKI) ? 0 : 1, J.sprawdzJakosc(siad, { v2, rodzina: 'core_floor', cwiczenie: 'V-Up', postural: new Set(), izometryczne: false, teksty: new Proxy({}, { get: () => 'x' }) }).filter((x) => x.regula === 'ledzwie_przy_podlodze').length], zle: [J.sprawdzJakosc(siad, { v2, rodzina: 'core_floor', cwiczenie: 'Crunch - Hands Overhead', postural: new Set(), izometryczne: false, teksty: tkst }).filter((x) => x.regula === 'ledzwie_przy_podlodze').length] };
/* 16c/d zwis startowy i tor łokcia w środku przyciągania (generator inverted: zwis od podłogi vs drążek 100 cm, start skośny) */
const zwisOk = G.inverted('Inverted Row'), zwisZle = G.inverted('Inverted Row', { by: 100, axOverride: 94, pole: [0, -1, 0.15] });
W.zwis_startowy = { dobre: J.zwisStartowy(v2, zwisOk), zle: J.zwisStartowy(v2, zwisZle) };
W.tor_lokcia_srodek = { dobre: J.torLokciaSrodek(v2, poza('core_floor', 'Lying Leg Raise')), zle: J.torLokciaSrodek(v2, zwisOk) };
/* 16b proste ręce w rolloutach */
W.proste_rece_rollout = { dobre: J.prosteReceRollout(v2, RO), zle: J.prosteReceRollout(v2, G.rolloutKolana('Rollout (sztanga)', { theta: 40 })) };
/* 15b minimalna widoczność błędu: delty błędu zmniejszone dziesięciokrotnie */
const slaby = klon(WD); for (const b of slaby.bledy) for (const k of b.klatki) { if (k.miednica) k.miednica = k.miednica.map((x) => x / 10); if (k.pochylenieTulowia !== undefined) k.pochylenieTulowia /= 10; if (k.pochylenieGlowy !== undefined) k.pochylenieGlowy /= 10; }
W.widocznosc_bledu_kat = { dobre: J.widocznoscBleduKat(v2, WD), zle: J.widocznoscBleduKat(v2, slaby) };
/* 15 rozszerzone na wszystkie stawy (tolerancja 8°): błąd „partial” z uniesionymi kostkami zgina kolana */
const koloPartial = klon(PU); const pj = koloPartial.bledy.findIndex((b) => b.cue === 'push.mis.partial'); for (const k of koloPartial.bledy[pj].klatki) k.nogi = { R: { kostka: [0, 12, 0] }, L: { kostka: [0, 12, 0] } };
W.rzad_bledu_wszystkie = { dobre: J.rzadBleduDotyczy(v2, PU), zle: J.rzadBleduDotyczy(v2, koloPartial) };
/* R1–R10 z recenzji n4 (progi = konwencja rysunku). Pozy poprawne z danych (generatory agent-pozy), łamiące: zmodyfikowane kopie albo stare parametry generatora. */
const MC = poza('pushup_plank', 'Mountain Climbers'), FO = poza('pushup_plank', 'Suspended Fallout'), DE = poza('pushup_plank', 'Decline Push Up'), TU = poza('core_floor', 'Tuck Crunch'), HT = poza('core_floor', 'Alternate Heel Touchers');
const stopyBlizej = klon(PL); for (const k of stopyBlizej.klatki) { k.nogi.R.kostka[0] += 18; k.nogi.L.kostka[0] += 18; }
W.cialo_w_linii_pelne = { dobre: J.cialoWLiniiPelne(v2, PL), zle: J.cialoWLiniiPelne(v2, stopyBlizej) };
W.kolana_proste_podpor = { dobre: J.kolanaProstePodpor(v2, PL), zle: J.kolanaProstePodpor(v2, stopyBlizej) };
const foZle = klon(FO); for (const k of foZle.klatki) for (const sd of ['R', 'L']) k.rece[sd].chwyt = [k.miednica[0] + 10, k.miednica[1] - 10, sd === 'R' ? 20 : -20];
W.fallout_start_rece_przod = { dobre: J.falloutStartRecePrzod(v2, FO), zle: J.falloutStartRecePrzod(v2, foZle) };
W.kolano_pod_tulowiem = { dobre: J.kolanoPodTulowiem(v2, MC), zle: J.kolanoPodTulowiem(v2, G.mountain('Mountain Climbers', { poleZ: 0.6 })) };
const mcKlek = klon(MC); for (const k of mcKlek.klatki) k.miednica[1] -= 8;
W.podpor_bez_kleku = { dobre: J.podporBezKleku(v2, MC), zle: J.podporBezKleku(v2, mcKlek) };
W.lokiec_nad_nadgarstkiem_bok = { dobre: J.lokiecNadNadgarstkiemBok(v2, DE), zle: J.lokiecNadNadgarstkiemBok(v2, G.pompka('Decline Push Up', { hz: 22, boxStopy: 27, thetaDol: 146, blady: ['partial'] })) };
const tuckProste = klon(TU); for (const k of tuckProste.klatki) for (const sd of ['R', 'L']) k.nogi[sd].kostka = [k.nogi[sd].kostka[0] + 25, k.nogi[sd].kostka[1] + 10, k.nogi[sd].kostka[2]];
W.kolana_ugiete_min = { dobre: J.kolanaUgieteMin(v2, TU), zle: J.kolanaUgieteMin(v2, tuckProste) };
const heelZgiete = klon(HT); for (const k of heelZgiete.klatki) for (const sd of ['R', 'L']) { const g = k.rece[sd].chwyt; k.rece[sd].chwyt = [g[0] * 0.5, g[1], g[2]]; }
W.rece_proste = { dobre: J.receProste(v2, HT), zle: J.receProste(v2, heelZgiete) };
/* R10: rząd błędu opadania nie może być „lepszy” — błąd bez delty miednicy (tylko słabe pochylenie) */
const sagLepszy = klon(PL); for (const b of sagLepszy.bledy) for (const k of b.klatki) { if (k.miednica) k.miednica = k.miednica.map((x) => x / 10); }
W.rzad_bledu_nie_lepszy = { dobre: J.rzadBleduNieLepszy(v2, PL), zle: J.rzadBleduNieLepszy(v2, sagLepszy) };
/* R9: widoczność liczona ze stawów obszaru błędu (łokieć nie liczy się dla „sag”): zmiana tylko łokcia w rzędzie błędu */
const sagTylkoLokiec = klon(WD); for (const b of sagTylkoLokiec.bledy) if (b.cue === 'plank.mis.sag') b.klatki = b.klatki.map((k) => ({ u: k.u, rece: { R: { chwyt: [0, 12, 0] }, L: { chwyt: [0, 12, 0] } } }));
W.widocznosc_w_obszarze = { dobre: J.widocznoscBleduKat(v2, WD), zle: J.widocznoscBleduKat(v2, sagTylkoLokiec) };
/* P1 i tabela kątów */
const kat = J.tabelaKatow(v2, PL);
W.tabela_katow = { dobre: [Object.keys(J.STAWY_TABELA).every((k) => kat[k].min <= kat[k].max && Number.isFinite(kat[k].min)) ? 0 : 1, J.tabelaKatowMd([{ cwiczenie: 'Plank', katy: kat }]).includes('| Plank |') ? 0 : 1], zle: [] };
const mw = (o) => ({ cwiczenia: [{ cwiczenie: 'Plank', obraz: 'Plank-light.png', katy_stawow: kat, klatki_u: [0, 1], klatki_na_obrazie: [0, 1], ...o }], zgodnosc_manifestu: [] });
W.podglad_wazny = { dobre: J.podgladWazny(mw({})), zle: [...J.podgladWazny({ ...mw({}), zgodnosc_manifestu: undefined }), ...J.podgladWazny({ ...mw({}), zgodnosc_manifestu: [{ regula: 'manifest_klatki', szczegol: 'x' }] }), ...J.podgladWazny(mw({ katy_stawow: undefined })), ...J.podgladWazny(mw({ obraz: null })), ...J.podgladWazny(mw({ klatki_na_obrazie: [0, 0.5, 1] })), ...J.podgladWazny(mw({ klatki_u: [0, 0.25, 0.5, 0.75, 1], klatki_na_obrazie: [0, 0.5, 1] })), ...J.podgladWazny(mw({ klatki_na_obrazie: undefined }))] };
/* L-podglad-klatki: klatki na obrazie czytane z wyrenderowanego HTML (data-u), nie z założenia; podgladPartia rysuje WSZYSTKIE klatki (nie 0 / 0,5 / 1) */
const K = (h) => J.klatkiZHtml(h);
const hPL5 = hp(PL); const kPL = K(hPL5.html);
const uPL = PL.klatki.map((k) => k.u);
const ost = hPL5.html.lastIndexOf('<span class="k" data-u="'); const bezKomorki = hPL5.html.slice(0, ost) + hPL5.html.slice(hPL5.html.indexOf('</span>', ost) + 7);
const dwaWiersze = hPL5.html.replace('data-u="0"', 'data-u="0.123"');
W.klatki_z_obrazu = { dobre: [...kPL.uwagi, ...(JSON.stringify(kPL.klatki) === JSON.stringify(uPL) ? [] : ['rozne 1']), ...K('<div class="w"><span class="k" data-u="0" data-widok="side"></span><span class="k" data-u="0.5" data-widok="side"></span><span class="k" data-u="1" data-widok="side"></span></div>').klatki.length === 3 ? [] : ['trzy']], zle: [...K(bezKomorki).uwagi, ...K(dwaWiersze).uwagi, ...K('<html></html>').uwagi] };
const ROLL = poza('pushup_plank', 'Rollout (sztanga)'); const PM = await V.podgladPartia({ PL, RC, ROLL }, fs.mkdtempSync(path.join(os.tmpdir(), 'podglad-')), 'light', { bezPrzegladarki: true });
const trzyKlatki = klon(ROLL); trzyKlatki.klatki = trzyKlatki.klatki.slice(0, 3);
const PM3 = await V.podgladPartia({ T: trzyKlatki }, fs.mkdtempSync(path.join(os.tmpdir(), 'podglad-')), 'light', { bezPrzegladarki: true });
W.podglad_partia_wszystkie_klatki = { dobre: [JSON.stringify(PM.PL.klatki) === JSON.stringify(uPL) ? 0 : 1, JSON.stringify(PM.RC.klatki) === JSON.stringify(RC.klatki.map((k) => k.u)) ? 0 : 1, PM.ROLL.klatki.length > 3 && JSON.stringify(PM.ROLL.klatki) === JSON.stringify(ROLL.klatki.map((k) => k.u)) ? 0 : 1, PM3.T.klatki.length === 3 ? 0 : 1, PM.PL.uwagi.length + PM.RC.uwagi.length + PM.ROLL.uwagi.length, fs.readFileSync(PM.PL.plik, 'utf8').match(/class="k"/g).length === 2 * uPL.length * (1 + PL.bledy.length) ? 0 : 1], zle: [] };
/* remis „skrajnej”: sztywne ciało (odległość bark–kostka stała), miednica poza linią dopiero w drugiej klatce */
const sk = (pel) => ({ pelvis: pel, shoulderC: [100, 40, 0], legs: { R: { knee: [60, 25, 8], ankle: [0, 20, 8], heel: [0, 20, 8], toe: [0, 20, 8] }, L: { knee: [60, 25, -8], ankle: [0, 20, -8], heel: [0, 20, -8], toe: [0, 20, -8] } } });
const probki = (a, b) => [{ u: 0, f: { sk: sk(a) }, kf: {} }, { u: 1, f: { sk: sk(b) }, kf: {} }];
const q = { max_cm: 6, koniec: 'kostka_dalsza', tylko_skrajna: true };
W.skrajna_remis = { dobre: SENS.EWALUATORY.miednica_na_linii({ p: probki([50, 31, 0], [50, 31, 0]), parametry: q }), zle: SENS.EWALUATORY.miednica_na_linii({ p: probki([50, 31, 0], [50, 18, 0]), parametry: q }) };
/* kontrakt: błąd postawy może mieć deltę w u = 0, błąd zakresu nie */
const kontrakt = (p, cue) => waliduj(p, { rodzina: 'pushup_plank', cwiczenie: p.cwiczenie }).bledy.filter((b) => b.kod === 'blad-start').length;
const sagNaStarcie = JSON.parse(JSON.stringify(PL)); sagNaStarcie.bledy[0].klatki[0] = { u: 0, miednica: [0, -5, 0] };
const partialNaStarcie = JSON.parse(JSON.stringify(PU)); partialNaStarcie.bledy[0].klatki[0] = { u: 0, miednica: [0, -5, 0] };
W.kontrakt_start = { dobre: [kontrakt(sagNaStarcie)], zle: [kontrakt(partialNaStarcie)] };
console.log(JSON.stringify(W));
`;
const W = run(KOD) as Record<string, { dobre: unknown[]; zle: unknown[] }>;
const REGULY = ['blad_widoczny_stale', 'pod_podloga', 'styk_z_podloga_przod', 'zaslanianie_sprzetu', 'rece_wzdluz_ciala', 'klatki_rozne', 'sprzet_rozpoznawczy', 'podstawa_szeroka', 'szyja_neutralna', 'etykieta_bledu', 'odwiedzenie_lokcia', 'lokiec_za_barkiem', 'odwiedzenie_lokcia_przod', 'lokiec_nad_nadgarstkiem', 'rozstaw_dloni', 'nic_nie_wisi', 'rzad_bledu_dotyczy', 'rzad_bledu_wszystkie', 'cialo_w_linii_pelne', 'kolana_proste_podpor', 'fallout_start_rece_przod', 'kolano_pod_tulowiem', 'podpor_bez_kleku', 'lokiec_nad_nadgarstkiem_bok', 'kolana_ugiete_min', 'rece_proste', 'rzad_bledu_nie_lepszy', 'widocznosc_w_obszarze', 'podglad_wazny', 'widocznosc_bledu_kat', 'ledzwie_przy_podlodze', 'zwis_startowy', 'tor_lokcia_srodek', 'proste_rece_rollout', 'tor_lokcia_przyciaganie', 'srodek_ciezkosci_podparcie', 'manifest_klatki', 'klatki_z_obrazu', 'manifest_przyblizenia', 'manifest_opis_bledu', 'podglad_jeden_wiersz'];

describe('reguły jakości póz (luki z recenzji ruchu): poza spełniająca bez komunikatu, łamiąca z komunikatem', () => {
  test.each(REGULY)('%s', (r) => {
    expect(W[r].dobre).toEqual([]); expect(W[r].zle.length).toBeGreaterThan(0); if (!['sprzet_rozpoznawczy', 'etykieta_bledu', 'manifest_przyblizenia', 'manifest_opis_bledu', 'podglad_wazny'].includes(r)) expect(String(W[r].zle[0])).toMatch(/\d/); /* komunikat z liczbą (poza regułami nazwowymi) */
  });
  test('odwiedzenie z przodu: progi per wariant (ten sam łokieć: szeroka tak, wąska/diamentowa/domyślna nie); reguła podpięta do rodziny w sprawdzJakosc', () => { expect(W.odwiedzenie_przod_wariant.dobre).toEqual([]); expect(W.odwiedzenie_przod_wariant.zle).toHaveLength(3); expect(W.odwiedzenie_przod_integracja.dobre).toEqual([]); expect(W.odwiedzenie_przod_integracja.zle.length).toBeGreaterThan(0); });
  test('litera T (≈ 90°) odrzucana w pompce standardowej, szerokiej, wąskiej, diamentowej i wiosłowaniu; łokcie ciaśniejsze niż dolna granica to nie pompka szeroka', () => { expect((W.litera_T.zle as number[]).every((n) => n > 0)).toBe(true); expect(W.wide_dolna_granica.dobre).toEqual([]); expect(W.wide_dolna_granica.zle).toHaveLength(1); });
  test('rozstaw dłoni: 100% standardowa, 50% wąska; diamentowa bez sprawdzenia', () => { expect(W.rozstaw_dloni.dobre).toEqual([]); expect(W.rozstaw_dloni.zle).toHaveLength(3); });
  test('lędźwie przy podłodze: reguła włączana wskazówką z tekstów; V-Up, Cocoons i Tuck wyłączone jawnie', () => { expect(W.ledzwie_zakres.dobre).toEqual([0, 0, 0, 0, 0, 0]); expect(W.ledzwie_zakres.zle).toEqual([1]); });
  test('podgląd partii rysuje WSZYSTKIE klatki kluczowe (nie 0 / 0,5 / 1); klatki_na_obrazie pochodzą z HTML (data-u)', () => { expect(W.podglad_partia_wszystkie_klatki.dobre).toEqual([0, 0, 0, 0, 0, 0]); });
  test('oba runnery używają wspólnego podgladPartia z v2-validate (brak własnej kopii z u = 0 / 0,5 / 1) i czytają klatki z obrazu', () => { for (const f of ['run.mjs', 'run-dyn.mjs']) { const z = fs.readFileSync(path.join(ROOT, 'scripts/figures/agent-pozy', f), 'utf8'); expect(z).not.toMatch(/async function podgladPartia/); expect(z).not.toMatch(/const us = \[0, 0\.5, 1\]/); expect(z).toMatch(/podgladPartia/); expect(z).toMatch(/\.klatki\b/); expect(z).not.toMatch(/klatki_na_obrazie: htmlPodgladu/); } });
  test('tabela kątów stawów: min ≤ max dla każdego stawu, wiersz Markdown', () => { expect(W.tabela_katow.dobre).toEqual([0, 0]); });
  test('nic nie wisi: czworaki (Bird Dog) i ćwiczenia leżące bez lotu: zakres reguły w sprawdzJakosc', () => { expect(W.nic_nie_wisi_zakres.dobre).toEqual([0, 0, 0]); expect(W.nic_nie_wisi_zakres.zle).toEqual([1]); });
  test('środek ciężkości: otoczka punktów i udziały mas sumują się do 1', () => { expect(W.otoczka_i_masy.dobre).toEqual([0, 0, 0]); });
  test('podgląd: HTML ma po jednej komórce na klatkę kluczową w obu widokach (= klatki_u), wiersz bez zawijania, skala maleje przy wielu klatkach', () => { expect(W.podglad_html.dobre).toEqual([0, 0, 0, 0, 0]); });
  test('naprawa luki „skrajna”: przy remisie odległości bark–kostka oceniana jest także późniejsza klatka', () => { expect(W.skrajna_remis.dobre).toEqual([]); expect(W.skrajna_remis.zle.length).toBeGreaterThan(0); });
  test('kontrakt: błąd postawy może mieć niezerową deltę w u = 0, błąd zakresu (partial) nadal nie', () => { expect(W.kontrakt_start.dobre).toEqual([0]); expect(W.kontrakt_start.zle[0]).toBeGreaterThan(0); });
});
