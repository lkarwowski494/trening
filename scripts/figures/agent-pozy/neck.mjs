// Generator póz rodziny neck (27.10.2026): wszystkie ćwiczenia rodziny to jawne wyjątki bez animacji (decyzja właściciela 27.10.2026: bez przeczytanego źródła techniki nie rysujemy pozy).
export const RODZINA = 'neck';
const POWOD = "ćwiczenie szyi bez przeczytanego źródła techniki (twierdzenie o zdrowiu — bez źródła nie rysujemy; aplikacja odsyła do specjalisty); wyjątek bez animacji (decyzja właściciela 27.10.2026)";
export const WYJATKI = Object.fromEntries(["Isometric Neck Exercise - Front And Back", "Isometric Neck Exercise - Sides", "Lying Neck Extension (talerz)", "Lying Neck Flexion (talerz)", "Neck Harness Extension"].map((k) => [k, POWOD]));
export const PRZYBLIZENIA = {};
export const WYJATKI_OPISU = {};
export function generuj() { return Object.fromEntries(Object.keys(WYJATKI).map((k) => [k, () => { throw new Error('wyjątek'); }])); }
