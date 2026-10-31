/* Notatki dla recenzenta App Store (store/review-notes.md, docs/41-droga-do-app-store.md A5 i B5; odświeżone przez M8 21.10.2026): limit pola,
 * teksty przycisków zgodne z aplikacją, liczby z kodu (okres próbny, limit), stan domyślny głosu i Zdrowia, bez danych osobowych (repo publiczne — CLAUDE.md). */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { PAYWALL, MIN_LIVE_MINUTES_FOR_DAY } from '@/lib/access';
import { VOICE_NEW_INSTALL } from '@/lib/voice';
import { defaultSettings } from '@/lib/seed';
import { shownFigureSpec, V2_WSTRZYMANE, FAMILY } from '@/lib/figures/v2';
import { WATCH } from '@/lib/watch/protocol';
import { WATCH_LABEL_IDS } from '@/lib/watch/labels';
jest.mock('@/lib/figures/data.json', () => require('./figure-gate-open').openFigureGate(jest.requireActual('@/lib/figures/data.json'))); /* bramka 4 otwarta: test sprawdza zgodność tekstów sklepu z kodem rysunków; w linii 1.1 rodziny v2 są ukryte do recenzji — ryzyko wydania R-11-01 (docs/40) pilnuje, by opis nie obiecał ukrytych rysunków */

const md = fs.readFileSync(path.join(__dirname, '../store/review-notes.md'), 'utf8');
const blocks = md.split('```text').slice(1).map(b => b.split('```')[0]);
const [en, pl, subEn] = blocks;
const enValues = new Set(Object.values(EN as Record<string, string>));
const section = (text: string, head: string) => text.split(/\n(?=[A-ZĄĆĘŁŃÓŚŹŻ ]{5,}(?:\(|\n))/).find(s => s.startsWith(head)) ?? '';

describe('store/review-notes.md', () => {
  test('trzy bloki (EN do wklejenia, PL dla właściciela, notatka subskrypcji); EN mieści się w polu Notes (4000 bajtów wg App Store Connect Help)', () => {
    expect(blocks).toHaveLength(3); expect(Buffer.byteLength(en, 'utf8')).toBeLessThanOrEqual(4000);
  });
  test('przyciski i ekrany cytowane w EN istnieją w tekstach aplikacji (lib/i18n.en.ts), a w PL — jako klucze', () => {
    const quoted = [...en.matchAll(/"([^"]+)"/g)].map(m => m[1]);
    expect(quoted.length).toBeGreaterThan(5);
    for (const q of quoted) expect([q, enValues.has(q)]).toEqual([q, true]);
    for (const q of [...pl.matchAll(/„([^”]+)”/g)].map(m => m[1])) expect([q, q in (EN as Record<string, string>)]).toEqual([q, true]);
  });
  test('liczby zgodne z kodem: limit darmowych dni treningowych w miesiącu; bez okresu próbnego i bez ofert wprowadzających (M5 S1)', () => {
    expect(en).toContain(`${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} training days per calendar month`); expect(pl).toContain(`${PAYWALL.FREE_TRAINING_DAYS_PER_MONTH} dni treningowych`);
    for (const b of [en, subEn, pl]) expect(b).not.toMatch(/[0-9]+-day (free|trial)|[0-9]+ dni (za darmo|okresu próbnego)|free for [0-9]+ days|after the first finished workout|po pierwszym zakończonym treningu/i);
    expect(md).not.toMatch(/one-month|free month|darmow\w* (pierwsz\w* )?miesiąc/i);
  });
  test('stan domyślny zgodny z kodem: głos po instalacji wyłączony, zapis do Zdrowia wyłączony', () => {
    expect(VOICE_NEW_INSTALL).toBe('off'); expect(defaultSettings().healthSync).toBe(false);
    expect(section(en, 'VOICE')).toContain('off by default'); expect(section(pl, 'ZAPOWIEDZI')).toContain('domyślnie wyłączone');
    expect(section(en, 'APPLE HEALTH')).toContain('off by default'); expect(section(pl, 'APPLE HEALTH')).toContain('domyślnie wyłączone');
  });
  /* M1-audytor-generalny-045 (audyt 21.10.2026; 10-wydanie-001): wytyczna 3.1.2(a) — subskrypcja odnawiana musi dawać stałą wartość; aplikacja bez serwera
   * uzasadnia ją regularnymi aktualizacjami (przykład z wytycznej: „consistent, substantive updates”) i alternatywą jednorazową. Wersje z dziennika wydań (docs/09). */
  test('M1-045: akapit o stałej wartości subskrypcji w EN, PL i notatce subskrypcji; opis sklepu PL/EN to samo', () => {
    const par = (t: string, head: string) => t.split('\n\n').find(p => p.startsWith(head)) ?? ''; const buy = par(en, 'IN-APP PURCHASES'); const kup = par(pl, 'ZAKUPY');
    expect(buy).toMatch(/Ongoing value \(Guideline 3\.1\.2\(a\)\)/); expect(buy).toMatch(/updated regularly/); expect(buy).toMatch(/lifetime/);
    expect(kup).toMatch(/Stała wartość subskrypcji \(wytyczna 3\.1\.2\(a\)\)/); expect(kup).toMatch(/regularnie aktualizowana/); expect(kup).toMatch(/dożywotni/);
    expect(subEn).toMatch(/Ongoing value/); expect(subEn).toMatch(/regular updates/); expect(subEn).toMatch(/lifetime/);
    expect(buy).not.toMatch(/version 0\.\d+ to/); /* 1.0: bez historii wersji testowych (docs/48 pkt 2) */
    expect(en).toContain(`longer than ${MIN_LIVE_MINUTES_FOR_DAY} minutes`); expect(pl).toContain(`dłuższym niż ${MIN_LIVE_MINUTES_FOR_DAY} minut`);
    expect(en).not.toMatch(/Apple Watch app and voice announcements|0\.11|0\.20|20 minutes/);
    expect(Buffer.byteLength(en, 'utf8')).toBeLessThanOrEqual(4000);
    const L = JSON.parse(fs.readFileSync(path.join(__dirname, '../store/app-store-metadata.json'), 'utf8')).lokalizacje as Record<string, { description: string }>;
    expect(L.pl.description).toContain('Subskrypcja finansuje dalszy rozwój: aplikacja jest regularnie aktualizowana, a nowe funkcje nie wymagają dodatkowych opłat.');
    for (const k of ['en-US', 'en-GB', 'en-AU', 'en-CA']) expect([k, L[k].description.includes('The subscription funds continued development: the app is updated regularly, and new features come at no extra cost.')]).toEqual([k, true]);
  });
  test('M1-045: zdanie o finansowaniu rozwoju subskrypcją jest w opisie każdej z 28 pozostałych lokalizacji (początek zdania, tłumaczenie 23.10.2026) i opis mieści się w 4000 znaków', () => {
    const L = JSON.parse(fs.readFileSync(path.join(__dirname, '../store/app-store-metadata.json'), 'utf8')).lokalizacje as Record<string, { description: string }>;
    const START: Record<string, string> = {
      'cs': 'Předplatné financuje další vývoj:',
      'sk': 'Predplatné financuje ďalší vývoj:',
      'hu': 'Az előfizetés a további fejlesztést finanszírozza:',
      'ro': 'Abonamentul finanțează dezvoltarea continuă:',
      'hr': 'Pretplata financira daljnji razvoj:',
      'sl': 'Naročnina financira nadaljnji razvoj:',
      'uk': 'Підписка фінансує подальшу розробку:',
      'es-ES': 'La suscripción financia el desarrollo continuo:',
      'es-MX': 'La suscripción financia el desarrollo continuo:',
      'pt-PT': 'A subscrição financia o desenvolvimento contínuo:',
      'pt-BR': 'A assinatura financia o desenvolvimento contínuo:',
      'de-DE': 'Das Abo finanziert die Weiterentwicklung:',
      'fr-FR': 'L’abonnement finance le développement :',
      'it': 'L’abbonamento finanzia lo sviluppo continuo:',
      'nl-NL': 'Het abonnement financiert de verdere ontwikkeling:',
      'sv': 'Prenumerationen finansierar den fortsatta utvecklingen:',
      'da': 'Abonnementet finansierer den videre udvikling:',
      'no': 'Abonnementet finansierer videre utvikling:',
      'fi': 'Tilaus rahoittaa jatkokehitystä:',
      'tr': 'Abonelik geliştirmenin sürmesini finanse eder:',
      'el': 'Η συνδρομή χρηματοδοτεί τη συνεχιζόμενη ανάπτυξη:',
      'id': 'Langganan membiayai pengembangan berkelanjutan:',
      'ms': 'Langganan membiayai pembangunan berterusan:',
      'vi': 'Gói đăng ký tài trợ cho việc tiếp tục phát triển:',
      'ru': 'Подписка финансирует дальнейшую разработку:',
      'ja': 'サブスクリプションは今後の開発に充てられます。',
      'ko': '구독은 앱의 지속적인 개발에 쓰입니다.',
      'zh-Hant': '訂閱費用用於持續開發：',
    };
    expect(Object.keys(START)).toHaveLength(28);
    for (const [k, s] of Object.entries(START)) expect([k, L[k].description.includes(s), [...L[k].description].length <= 4000]).toEqual([k, true, true]);
  });
  /* ZB-016 (decyzja właściciela 29.10.2026 „5a”): sekcja rysunków i opis zegarka z kodu gałęzi; zdanie o rysunkach nie obiecuje wstrzymanych (V2_WSTRZYMANE, #89) */
  test('ZB-016: sekcja „Ćwiczenia i rysunki” — ścieżka, przykład z rysunkiem, rodziny gotowe, bez obietnicy wstrzymanych martwych ciągów', () => {
    const ex = section(en, 'EXERCISES AND DRAWINGS'); const ćw = section(pl, 'ĆWICZENIA I RYSUNKI');
    expect(ex).toContain('More > Exercises'); expect(ex).toContain('"Technique"'); expect(ćw).toContain('Więcej → Ćwiczenia'); expect(ćw).toContain('„Technika”');
    expect(EN['Technika' as keyof typeof EN]).toBe('Technique'); expect(EN['Ćwiczenia' as keyof typeof EN]).toBe('Exercises');
    expect(ex).toContain('Back Squat'); expect(ćw).toContain('Back Squat');
    expect(shownFigureSpec('Back Squat')).not.toBeNull(); /* przykład musi mieć rysunek w kandydacie */
    for (const f of ['squat', 'bench_press', 'hinge'] as const) expect([f, FAMILY[f].status]).toEqual([f, 'ready']);
    expect(shownFigureSpec('Sumo Deadlift')).not.toBeNull(); expect(ex).toContain('Sumo Deadlift');
    expect(shownFigureSpec('Deadlift (sztanga)')).not.toBeNull(); expect(Object.keys(V2_WSTRZYMANE)).not.toContain('Deadlift (sztanga)'); /* 29.10.2026: martwy ciąg ze sztangą zdjęty z V2_WSTRZYMANE po recenzji niezależnej; zdanie sekcji pozostaje bez zmian (store/ poza pakietem J0) */
    /* 101-25 (29.10.2026, linia 1.0.1): martwe ciągi z podłogi wróciły (V2_WSTRZYMANE puste) — zdanie wymienia martwy ciąg, nie „zawias biodrowy” (stan 1.0 odwrócony w tym samym commicie) */
    expect(Object.keys(V2_WSTRZYMANE)).toEqual([]);
    expect(ex).toMatch(/squat, bench press and deadlift variations/); expect(ćw).toMatch(/przysiadu, wyciskania leżąc i martwego ciągu/);
    expect(ex).not.toMatch(/hip hinge/); expect(ćw).not.toMatch(/zawiasu biodrowego/);
    expect(ex).toMatch(/does not give medical advice/); expect(ćw).toMatch(/nie udziela porad medycznych/);
    expect(EN['Aplikacja nie udziela porad medycznych. Przy bólu, urazie lub chorobie skonsultuj się z lekarzem lub fizjoterapeutą.' as keyof typeof EN]).toMatch(/does not give medical advice/i);
    expect(EN['Mięśnie główne: {lista}' as keyof typeof EN]).toMatch(/Main muscles/); expect(ex).toMatch(/main muscles/);
  });
  test('ZB-016: zegarek — „Set done”, „Undo”, sesja treningu i zapis do Zdrowia raz; etykiety z kodu zegarka', () => {
    const w = section(en, 'APPLE WATCH'); const z = section(pl, 'APPLE WATCH');
    expect(WATCH_LABEL_IDS).toEqual(expect.arrayContaining(['done', 'undo', 'idle']));
    expect(EN['Seria zrobiona' as keyof typeof EN]).toBe('Set done'); expect(EN['Cofnij' as keyof typeof EN]).toBe('Undo');
    expect(w).toContain('"Set done"'); expect(w).toContain('"Undo"'); expect(z).toContain('„Seria zrobiona”'); expect(z).toContain('„Cofnij”');
    expect(w).toContain(`(${WATCH.UNDO_SEC} seconds)`); expect(z).toContain(`(${WATCH.UNDO_SEC} s)`);
    expect(w).toContain('workout session'); expect(w).toContain('heart rate'); expect(w).toContain('saved to Health once'); expect(z).toContain('sesję treningu'); expect(z).toContain('trafia do Zdrowia raz');
    expect(w).not.toMatch(/To test: an iPhone paired/); expect(w).toContain('fully usable without a watch'); expect(w).toContain('"Start a workout on your phone"');
    const swift = fs.readFileSync(path.join(__dirname, '../targets/watch-app/WorkoutController.swift'), 'utf8');
    for (const k of ['HKWorkoutSession', 'activeEnergyBurned', 'heartRate', 'HKMetadataKeySyncIdentifier']) expect([k, swift.includes(k)]).toEqual([k, true]);
  });
  test('bez danych osobowych: jedyny adres e-mail to adres wsparcia, bez numerów telefonu i haseł', () => {
    expect([...md.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map(m => m[0]).filter(a => a !== 'support@apps4brew.com')).toEqual([]);
    expect(md).not.toMatch(/\+?\d[\d ]{8,}\d/); expect(md).not.toMatch(/password:|hasło:/i);
  });
});
