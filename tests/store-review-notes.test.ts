/* Notatki dla recenzenta App Store (store/review-notes.md, docs/41-droga-do-app-store.md A5 i B5; odświeżone przez M8 21.10.2026): limit pola,
 * teksty przycisków zgodne z aplikacją, liczby z kodu (okres próbny, limit), stan domyślny głosu i Zdrowia, bez danych osobowych (repo publiczne — CLAUDE.md). */
import * as fs from 'fs';
import * as path from 'path';
import { EN } from '@/lib/i18n.en';
import { PAYWALL, MIN_LIVE_MINUTES_FOR_DAY } from '@/lib/access';
import { VOICE_NEW_INSTALL } from '@/lib/voice';
import { defaultSettings } from '@/lib/seed';

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
  test('bez danych osobowych: jedyny adres e-mail to adres wsparcia, bez numerów telefonu i haseł', () => {
    expect([...md.matchAll(/[\w.+-]+@[\w-]+\.[\w.]+/g)].map(m => m[0]).filter(a => a !== 'support@apps4brew.com')).toEqual([]);
    expect(md).not.toMatch(/\+?\d[\d ]{8,}\d/); expect(md).not.toMatch(/password:|hasło:/i);
  });
});
