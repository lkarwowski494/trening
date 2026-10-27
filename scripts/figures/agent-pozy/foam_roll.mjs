// Generator póz rodziny foam_roll (27.10.2026): wszystkie ćwiczenia rodziny to jawne wyjątki bez animacji (decyzja właściciela 27.10.2026: bez przeczytanego źródła techniki nie rysujemy pozy).
export const RODZINA = 'foam_roll';
const POWOD = "brak przeczytanego źródła techniki rolowania (położenie wałka i ciała na nim); w figury-sens.json jest tylko definicja „wolne toczenie” (konwencja ruchu), bez pozycji części ciała na wałku; wyjątek bez animacji (decyzja właściciela 27.10.2026)";
export const WYJATKI = Object.fromEntries(["Adductor-SMR", "Calves-SMR", "Foam Roll: Hamstrings", "Foam Roll: Quadriceps", "Foot-SMR", "Iliotibial Tract-SMR", "Latissimus Dorsi-SMR", "Peroneals-SMR", "Piriformis-SMR", "Rhomboids-SMR"].map((k) => [k, POWOD]));
export const PRZYBLIZENIA = {};
export const WYJATKI_OPISU = {};
export function generuj() { return Object.fromEntries(Object.keys(WYJATKI).map((k) => [k, () => { throw new Error('wyjątek'); }])); }
