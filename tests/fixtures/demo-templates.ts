/* Dane testowe: cztery szablony, które do 03.10.2026 tworzył seedState (Upper A, Upper B, Legs — siłownia, Legs — dom).
 * Decyzja właściciela 03.10.2026 (08:11): „Nie przenoś do aplikacji żadnych moich szablonów. Sam je ustawię.” — świeża instalacja ma
 * `templates: []`, a te szablony żyją TYLKO tutaj: testy, które ich potrzebują, dokładają je jawnie (`withDemoTemplates()` w tests/helpers.ts,
 * `seedWithDemo()` dla zapisanych stanów), tak samo dane zrzutów ekranu (scripts/screens/seed.test.ts) i pomiar wydajności (scripts/perf).
 * Wartości jak w ostatnim seedzie (P-004 b: hantle na hantel — Deadlift (hantle) i RDL (hantle/linki) 24 kg). */
import { base, uid, type Exercise, type Template, type TemplateItem } from '@/lib/seed';
import type { Lang } from '@/lib/i18n';

/** [nazwa ćwiczenia, serie, powt. od, powt. do, przerwa s, ciężar startowy] */
type Row = [string, number, number | null, number | null, number, number];
export const DEMO_TEMPLATES: { name: { pl: string; en: string }; items: Row[] }[] = [
  { name: { pl: 'Upper A', en: 'Upper A' }, items: [['Bench Press (hantle)', 4, 6, 8, 150, 24], ['Bent Over Row (hantle)', 4, 6, 8, 120, 20], ['Overhead Press (hantle)', 3, 10, 12, 90, 11], ['Chin Up', 3, null, null, 90, 0], ['Chest Dip', 3, null, null, 90, 0], ['Biceps Curl (hantle)', 3, 10, 12, 60, 8], ['Skullcrusher (hantle)', 3, 10, 12, 60, 6], ['Lateral Raise (hantle)', 3, 15, 15, 60, 4], ['Reverse Fly (hantle)' /* research biblioteki 09.10.2026: Rear Delt Raise (hantle) scalone z Reverse Fly (hantle) */, 3, 15, 15, 60, 6]] },
  { name: { pl: 'Upper B', en: 'Upper B' }, items: [['Incline Bench Press (hantle)', 4, 8, 10, 120, 21], ['One Arm Row (hantle)', 4, 8, 8, 90, 22], ['Chest Fly (hantle)', 3, 8, 10, 90, 12.5], ['Pull Up', 3, null, null, 90, 0], ['Triceps Dips (ławka)', 3, 12, 12, 60, 0], ['Incline Curl (hantle)', 3, 8, 10, 60, 8], ['Reverse Fly (hantle)', 3, 10, 12, 60, 5], ['Concentration Curl (hantle)', 3, 8, 12, 60, 9]] },
  { name: { pl: 'Legs — siłownia', en: 'Legs — gym' }, items: [['Leg Press', 5, 6, 12, 120, 130], ['Deadlift (hantle)', 5, 8, 8, 150, 24], ['Leg Extension', 5, 10, 15, 60, 41], ['Leg Curl', 4, 10, 12, 60, 41], ['Hip Thrust (sztanga)', 4, 6, 8, 90, 30], ['Seated Calf Raise', 4, 10, 12, 60, 30]] },
  { name: { pl: 'Legs — dom', en: 'Legs — home' }, items: [['Przysiad z pasem (linki)', 4, 6, 8, 150, 45], ['RDL (hantle/linki)', 4, 8, 10, 150, 24], ['Bulgarian Split Squat (hantle)', 3, 8, 8, 90, 7], ['Hip Thrust (hantel)', 3, 10, 12, 90, 24], ['Łydki na stopniu', 4, 15, 15, 60, 24]] },
];

/** Szablony demonstracyjne dla podanej biblioteki ćwiczeń (po nazwie kanonicznej). */
export function demoTemplates(exercises: Exercise[], lng: Lang = 'pl'): Template[] {
  const byName = new Map(exercises.map(e => [e.name, e]));
  const it = ([n, sets, min, max, rest, w]: Row): TemplateItem => {
    const e = byName.get(n); if (!e) throw new Error('demo template: no exercise ' + n);
    return { id: uid(), exerciseId: e.id, sets, repMin: min, repMax: max, restSec: rest, startWeight: w, targetSec: '', groupId: null };
  };
  return DEMO_TEMPLATES.map(t => ({ ...base(), name: t.name[lng === 'pl' ? 'pl' : 'en'], items: t.items.map(it) }));
}
