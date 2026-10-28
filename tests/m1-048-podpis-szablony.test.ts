/*
 * M1-audytor-generalny-048 (reaudyt 28.10.2026; 03-zakres-604): podpis zrzutu „szablony” obiecywał gotowe szablony („Gotowe szablony albo własne”, 29 języków),
 * a stan startowy nie ma żadnego (lib/seed.ts `templates: []`, decyzja właściciela 03.10.2026: aplikacja nie tworzy szablonów sama). Decyzja właściciela
 * 28.10.2026 (048, wariant a): PL „Twoje szablony w folderach”, EN „Your templates in folders” — zgodnie z opisem sklepu; pozostałe języki przełożone ponownie.
 */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..');
type Cap = { status: Record<string, string>; podpisy: Record<string, Record<string, string>> };
const cap = (): Cap => JSON.parse(fs.readFileSync(path.join(root, 'store/screenshot-captions.json'), 'utf8'));
/** Podpisy sprzed decyzji (28.10.2026) — żaden język nie może ich zostawić. */
const STARE: Record<string, string> = {"pl": "Gotowe szablony albo własne", "en": "Ready-made templates or your own", "cs": "Hotové šablony, nebo vlastní", "sk": "Hotové šablóny alebo vlastné", "hu": "Kész sablonok vagy saját", "ro": "Șabloane gata făcute sau proprii", "hr": "Gotovi predlošci ili vlastiti", "uk": "Готові шаблони або власні", "es": "Plantillas listas o las tuyas", "es-419": "Plantillas listas o las tuyas", "pt": "Modelos prontos ou os seus", "pt-BR": "Modelos prontos ou os seus", "de": "Fertige Vorlagen oder eigene", "fr": "Modèles prêts à l’emploi ou les vôtres", "it": "Schede pronte o create da te", "nl": "Kant-en-klare sjablonen of je eigen", "sv": "Färdiga mallar eller dina egna", "da": "Færdige skabeloner eller dine egne", "nb": "Ferdige maler eller dine egne", "fi": "Valmiit pohjat tai omasi", "tr": "Hazır ya da kendi şablonlarınız", "el": "Έτοιμα πρότυπα ή δικά σας", "id": "Templat siap pakai atau buatan sendiri", "ms": "Templat sedia ada atau milik anda", "vi": "Mẫu có sẵn hoặc của riêng bạn", "ru": "Готовые шаблоны или свои", "ja": "既製のテンプレートか自分で作成", "ko": "준비된 루틴 또는 나만의 루틴", "zh-Hant": "現成範本或自訂範本"};

describe('M1-048: podpis zrzutu „szablony” bez obietnicy gotowych szablonów', () => {
  test('stan startowy aplikacji nie ma szablonów (założenie podpisu)', () => {
    expect(fs.readFileSync(path.join(root, 'lib/seed.ts'), 'utf8')).toMatch(/templates: \[\]/);
  });
  test('PL i EN — brzmienie zatwierdzone przez właściciela 28.10.2026', () => {
    expect(cap().podpisy.pl.szablony).toBe('Twoje szablony w folderach'); expect(cap().podpisy.en.szablony).toBe('Your templates in folders');
  });
  test.each(Object.keys(STARE))('%s: podpis zmieniony (nie stary sens „gotowe albo własne”), status z datą 28.10.2026', (l) => {
    const c = cap(); expect(c.podpisy[l].szablony).not.toBe(STARE[l]); expect(c.podpisy[l].szablony).not.toMatch(/gotow|ready-made/i);
    if (l !== 'pl' && l !== 'en') expect(c.status[l]).toMatch(/szablony[^,;]*28\.10\.2026|28\.10\.2026[^;]*szablony/);
  });
});
