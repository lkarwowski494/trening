import type { WSet } from '@/lib/seed';

/*
 * Deload B (decyzja właściciela 08.10.2026): w tygodniu deload start z szablonu może zostawić około połowy serii roboczych — ciężary bez zmian,
 * rozgrzewki zostają, szablon bez zmian. ceil(n/2) daje cięcie 33–50% (n ≥ 2) — uproszczenie we wspólnym przedziale źródeł: krótkie zmniejszenie
 * objętości o ~30–70% przy utrzymanym ciężarze nie odbiera efektów (Travis 2020, Pritchard 2016, Bickel 2011, Spiering 2021); praktyka trenerów
 * 25–>50% (Bell 2022, De Marco 2024). docs/research/22 sekcja 2. Bez importów ze store — używa go startFromTemplate.
 */
export const deloadKeep = (n: number) => (n <= 1 ? n : Math.ceil(n / 2));

/** Serie po cięciu: rozgrzewki zostają; drop sety należą do serii, po której są; odpadają ostatnie serie robocze. */
export function deloadSets(sets: WSet[]): WSet[] {
  const main = sets.filter(s => s.kind !== 'warmup' && s.kind !== 'drop').length; const keep = deloadKeep(main);
  let seen = 0;
  return sets.filter(s => { if (s.kind === 'warmup') return true; if (s.kind !== 'drop') seen++; return seen <= keep; });
}
