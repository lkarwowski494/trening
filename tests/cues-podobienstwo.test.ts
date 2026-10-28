/*
 * F3 (decyzja właściciela 12.10.2026, wariant A; docs/09 sekcja G): 34 wskazówki EN, które przekraczały próg podobieństwa do źródeł,
 * zostały przeredagowane. Test pilnuje, że w en.json są nowe teksty (nie stare) i że klucze nadal istnieją w pl.
 * Teksty źródeł nie są trzymane w repozytorium. Rodzaje (docs/20): regresja, dane.
 */
import en from '@/lib/cues/text/en.json';
import pl from '@/lib/cues/text/pl.json';
import { cueText } from '@/lib/cues';

const NOWE: Record<string, string> = {
  "erg.handle": "Pull and return the handle along one straight path, toward the flywheel and back.",
  "bike.foot": "Pedal with the front part of your foot, just behind the toes.",
  "pallof.setup": "Stand side-on to a cable at roughly chest level; grip the handle in both hands against your chest, with tension on the cable.",
  "bss.move": "Bend at the front hip and knee to descend until the back knee nearly touches the floor; drive through the front leg to rise.",
  "db.setup": "Lying face up, point both arms at the ceiling and bend your hips and knees to right angles.",
  "sq.down": "Descend by moving your hips back while your knees bend at the same time; rise by pushing the floor away with your whole feet.",
  "burpee.down": "From a squat, put both palms on the floor and hop your feet back so you end up in a push-up position.",
  "carry.noLean": "Keep your torso upright — don’t tip toward the load or away from it; walk tall.",
  "curl.elbows": "Hold your elbows still by your sides — only the forearm moves, the upper arm stays put.",
  "lcurl.move": "Bend your knees to pull your heels in toward your buttocks; slowly straighten your legs again.",
  "mc.setup": "Hold yourself up on straight arms with your hands below your shoulders or a little ahead of them; one leg bent under your chest, the other straight behind you.",
  "push.move": "Bend your elbows to bring your chest close to the floor; press back up to straight arms.",
  "splank.move": "Raise your hips until your head, hips and feet are in line; hold, then switch sides.",
  "splank.setup": "On your side, prop yourself on your forearm with the elbow directly below the shoulder; feet stacked.",
  "sumo.kneesOut": "When the bar breaks from the floor, push your knees outward so they point the same way as your toes.",
  "crunch.setup": "Lie face up, knees bent, hands lightly beside your head.",
  "calf.move": "Rise as high as you can onto your toes, then drop your heels until the calves are stretched.",
  "gb.setup": "Lie face up with knees bent and both soles on the floor, hip-width apart.",
  "lunge.stand": "Stand upright, feet roughly hip-width apart.",
  "plank.move": "Lift your body so head, hips and heels stay in one line; hold it and keep breathing normally.",
  "bp.blades": "Squeeze your shoulder blades together and down, and hold them there throughout.",
  "bss.setup": "With a bench behind you, place the top of your rear foot on it; front foot out in front.",
  "carry.two": "Take one weight in each hand and let your arms hang by your sides, the weights beside your hips.",
  "cgbp.move": "Bring the bar down to your chest, elbows tucked near your torso; press it up to straight arms.",
  "gm.move": "Keeping your back straight, hinge forward by moving your hips back; come up by driving your hips forward.",
  "ht.dbSetup": "Upper back on a bench, soles on the floor; hold the dumbbell across your hips with both hands.",
  "inv.pull": "Pull your chest up to the bar, elbows staying near your torso; lower to straight arms.",
  "ohp.seat": "Sit with your back pressed into the backrest, feet planted on the floor; dumbbells at shoulder level.",
  "pallof.move": "Push the handle forward from your chest until your arms are straight, pause briefly, then slowly bring it back to your chest.",
  "scr.pull": "Row the handle to your stomach, elbows staying near your torso; return to straight arms.",
  "tpd.setup": "Face the high pulley, grab the handle and pin your elbows to your sides.",
  "fsq.rack": "Let the bar sit across the fronts of your shoulders, elbows high, upper arms roughly parallel to the floor.",
  "ohp.bbSetup": "Take the bar from a rack at shoulder height; grip shoulder-width or a little wider, bar sitting across the fronts of your shoulders.",
  "pp.setup": "Bar sitting across the fronts of your shoulders, grip about shoulder-width or a little wider, feet hip-width apart."
};

describe('F3: parafrazy wskazówek EN (podobieństwo do źródeł)', () => {
  test('jest dokładnie 34 kluczy, w tym erg.handle, bike.foot, pallof.setup', () => {
    expect(Object.keys(NOWE)).toHaveLength(34);
    expect(Object.keys(NOWE)).toEqual(expect.arrayContaining(['erg.handle', 'bike.foot', 'pallof.setup']));
  });
  test.each(Object.entries(NOWE))('%s ma nowy tekst EN, ten sam w cueText', (k, v) => {
    expect((en as Record<string, string>)[k]).toBe(v);
    expect(cueText(k, 'en')).toBe(v);
  });
  test('każdy z 34 kluczy istnieje też w pl (parafraza nie usunęła ani nie dodała wskazówki)', () => {
    for (const k of Object.keys(NOWE)) expect((pl as Record<string, string>)[k]).toEqual(expect.any(String));
  });
  test('styl: jedno zdanie zakończone kropką, bez cyfr', () => {
    for (const v of Object.values(NOWE)) { expect(v).not.toMatch(/\d/); expect(v.trim().endsWith('.')).toBe(true); }
  });
});
