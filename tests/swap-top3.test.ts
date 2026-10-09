/* E2 (docs/14 pkt 6.1) — tabela D7: top-3 propozycji zamiany i „ten sam ruch, inny przyrząd” liczone PRAWDZIWĄ funkcją rankingu
 * (lib/swap.ts swapCandidates / otherImpls) — zero ręcznie przepisanych liczb. Wynik w docs/14a-e2-top3.md:
 *   UPDATE_TOP3=1 npx jest tests/swap-top3.test.ts   — zapisuje tabelę,
 *   zwykły `npm test`                                — porównuje i pada przy różnicy (wzór: gen.mjs --check).
 * Zmiana wag (SWAP_WEIGHTS) = nowa tabela w tym samym commicie; właściciel przegląda diff (decyzja P7 a, 04.10.2026). */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fresh, ex } from './helpers';
import { userHome, loc } from './locations-fixtures';
import { presetEquipment, implsAt } from '@/lib/equipment';
import { swapCandidates, otherImpls, reasonText, implLabel, SWAP_TOP, SWAP_WEIGHTS } from '@/lib/swap';
import { getState, exById, save, implAtLoc } from '@/lib/store';
import { exName } from '@/lib/i18n';

const FILE = join(__dirname, '..', 'docs', '14a-e2-top3.md');
const TOP3_EXERCISES = ['Bench Press (sztanga)', 'Incline Bench Press (sztanga)', 'Overhead Press (sztanga)', 'Lat Pulldown', 'Seated Cable Row', 'Bent Over Row (sztanga)', 'Back Squat', 'Deadlift (sztanga)', 'Leg Press', 'Leg Extension', 'Leg Curl', 'Triceps Pushdown', 'Face Pull', 'RDL (hantle/linki)'];

function cell(exId: string, locationId: string): string {
  const c = swapCandidates(exId, { locationId, showAll: false, inWorkout: new Set() }).slice(0, SWAP_TOP);
  return c.length ? c.map((x, i) => `${i + 1}. ${exName(exById(x.exId))} — ${x.score} (${reasonText(x)})`).join('<br>') : '— (brak propozycji)';
}

function buildTable(): string {
  const W = SWAP_WEIGHTS;
  const head = [
    '# 14a Tabela D7 — top-3 propozycji zamiany (E2)',
    '',
    '<!-- PLIK GENEROWANY przez tests/swap-top3.test.ts (UPDATE_TOP3=1 npx jest tests/swap-top3.test.ts) z prawdziwej funkcji rankingu lib/swap.ts. Nie edytować ręcznie. -->',
    '',
    `Wagi (SWAP_WEIGHTS, lib/swap.ts): ten sam wzorzec ruchu +${W.pattern} · wspólny mięsień główny +${W.muscle}, ten sam pierwszy +${W.firstMuscle} · ta sama partia +${W.group} · wspólne mięśnie pomocnicze +${W.secondary} za każdy (maks. ${W.secondaryMax}) · wcześniej zamieniane +${W.swapped} · ćwiczenie z historią +${W.history}. Propozycji: ${SWAP_TOP}.`,
    'Wagi i liczba propozycji **nie mają źródła** w badaniach ani danych — to propozycja z docs/13 A4 (decyzja P7 a: start z nimi, ocena na tej tabeli przed wydaniem).',
    '',
    'Warunki: biblioteka startowa (`seedState(\'pl\')`), **pusta historia** (bonusy historii — osobny test w `tests/swap-logic.test.ts`), filtr „tylko dostępne w miejscu”.',
    'Miejsca: **Dom** = dom właściciela (`userHome()` w `tests/locations-fixtures.ts`: ławka regulowana, drążek, poręcze, hantle z regulacją, inteligentna stacja kablowa (pełna)); **Pełna siłownia** = preset `gym`.',
    'Kolumna „Dom: inny przyrząd” (D5): „A → B” = aplikacja sama wybiera A (implAt), arkusz proponuje B; „tylko A” = jeden przyrząd; „brak przyrządu” = w Domu nie ma przyrządu spełniającego wymagania ćwiczenia.',
    'Uwaga: w `userHome()` lista hantli z regulacją jest pusta (kroki pokrętła nieznane — docs/10), więc dla RDL domyślnym przyrządem w Domu jest stacja (pierwszy przyrząd z wpisanymi ciężarami); z wpisanymi ciężarami hantli byłoby „hantle → stacja”.',
    '',
    'Przegląd właściciela: **otwarte** (data i uwagi do wpisania w docs/14 po przeglądzie).',
    '',
    '| Ćwiczenie | Dom: top-3 (punkty, uzasadnienie) | Dom: inny przyrząd (D5) | Pełna siłownia: top-3 |',
    '|---|---|---|---|',
  ];
  const rows = TOP3_EXERCISES.map(n => {
    const e = ex(n); const home = getState().settings.locations.find(l => l.id === 'home')!;
    const def = implAtLoc(e, 'home'); const all = implsAt(e, home); const others = otherImpls(e, home, def);
    const d5 = !all.length ? '— (brak przyrządu)' : !others.length ? `tylko ${implLabel(all[0])}` : `${def && all.includes(def) ? implLabel(def) : '?'} → ${others.map(implLabel).join(', ')}`;
    return `| ${exName(e)} | ${cell(e.id, 'home')} | ${d5} | ${cell(e.id, 'gym')} |`;
  });
  return [...head, ...rows, ''].join('\n');
}

test('tabela D7 (docs/14a-e2-top3.md) jest aktualna względem lib/swap.ts', async () => {
  await fresh(undefined, 'pl');
  const st = getState(); st.settings.locations = [userHome(), loc('Pełna siłownia', presetEquipment('gym'), 'gym')]; st.settings.mainLocationId = 'home'; save();
  const table = buildTable();
  if (process.env.UPDATE_TOP3 === '1') writeFileSync(FILE, table);
  expect(readFileSync(FILE, 'utf8')).toBe(table);
});
