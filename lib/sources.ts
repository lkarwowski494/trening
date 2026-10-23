import { t } from '@/lib/i18n';

/*
 * Źródła wiedzy (decyzja właściciela 23.10.2026, docs/18): jedyne miejsce w aplikacji, w którym podajemy, na czym opierają się liczby i zalecenia
 * (Ustawienia → „Źródła wiedzy”, app/more/sources.tsx). Teksty przy funkcjach (generator, plan, Postępy, ⓘ) są napisane zwykłym językiem, bez nazw źródeł,
 * autorów, organizacji i lat — strażnik tests/zrodla-wiedzy.test.ts pilnuje, że żaden tekst interfejsu poza tym ekranem ich nie zawiera.
 * Ta lista jest jedynym miejscem nazw źródeł: strażnik czyta z niej `names`; rejestr twierdzeń (docs/research/rejestr-twierdzen.json) mapuje teksty na źródła,
 * a każde jego źródło musi mieć tu wpis. Źródła podajemy tekstem (nazwa, autorzy, czasopismo, rok) — bez adresów i bez połączeń z siecią;
 * adresy i cytaty są w docs/research (przeglad-badacza-2026-10-21b.md, legenda Z1–Z20) i docs/brd/zrodla.md.
 * Nazwy i skróty zostają w oryginale (nie tłumaczy się ich); tłumaczy się tylko zdanie „do czego służy”.
 */
export type KnowledgeSource = {
  id: string;
  /** Nazwa i rok — tytuł wiersza (oryginał, bez tłumaczenia). */
  cite: string;
  /** Autorzy i czasopismo albo wydawca (oryginał). */
  detail: string;
  /** Jedno zdanie: do czego w aplikacji służy to źródło. */
  use: () => string;
  /** Ciągi, po których strażnik rozpoznaje to źródło w innych tekstach interfejsu (wyrażenia regularne; wielkość liter ma znaczenie). */
  names: readonly string[];
};
export type SourceGroup = { id: string; title: () => string; items: readonly KnowledgeSource[] };

export const SOURCE_GROUPS: readonly SourceGroup[] = [
  { id: 'plan', title: () => t('Plan: serie, powtórzenia, przerwy'), items: [
    { id: 'acsm-2026', cite: 'ACSM 2026', detail: 'American College of Sports Medicine — Currier et al., Med Sci Sports Exerc 2026;58(4)', use: () => t('Ile serii i powtórzeń oraz jak blisko upadku trenować, żeby budować siłę i mięśnie.'), names: ['ACSM'] },
    { id: 'acsm-2011', cite: 'ACSM 2011', detail: 'American College of Sports Medicine — Garber et al., Med Sci Sports Exerc 2011;43(7)', use: () => t('Zakresy powtórzeń, liczba serii i przerwa między sesjami.'), names: [] },
    { id: 'acsm-2009', cite: 'ACSM 2009', detail: 'American College of Sports Medicine — Progression models in resistance training for healthy adults, Med Sci Sports Exerc 2009;41(3)', use: () => t('Jak stopniowo zwiększać obciążenie.'), names: [] },
    { id: 'pelland-2026', cite: 'Pelland et al. 2026', detail: 'Sports Med 2026;56(2)', use: () => t('Jak liczyć serie w tygodniu, gdy partia pracuje tylko pomocniczo.'), names: ['Pelland'] },
    { id: 'ramos-campo-2024', cite: 'Ramos-Campo et al. 2024', detail: 'J Strength Cond Res 2024', use: () => t('Czy podział treningu na sesje (całe ciało, góra/dół) zmienia efekty.'), names: ['Ramos-Campo'] },
    { id: 'robinson-2024', cite: 'Robinson et al. 2024', detail: 'Sports Med 2024;54(9)', use: () => t('Jak blisko upadku kończyć serie.'), names: ['Robinson (?:i in\\.|et al\\.|\\d{4})'] },
    { id: 'lopez-2021', cite: 'Lopez et al. 2021', detail: 'Med Sci Sports Exerc 2021;53(6)', use: () => t('Jaki ciężar i ile powtórzeń w serii daje przyrost mięśni.'), names: ['Lopez (?:i in\\.|et al\\.|\\d{4})'] },
    { id: 'singer-2024', cite: 'Singer et al. 2024', detail: 'Front Sports Act Living 2024;6', use: () => t('Jak długie powinny być przerwy między seriami.'), names: ['Singer (?:i in\\.|et al\\.|\\d{4})'] },
  ] },
  { id: 'health', title: () => t('Ruch dla zdrowia'), items: [
    { id: 'who-2020', cite: 'WHO 2020', detail: 'World Health Organization — Bull et al., Br J Sports Med 2020;54(24)', use: () => t('Ile ruchu w tygodniu: cardio i ćwiczenia wzmacniające.'), names: ['WHO'] },
    { id: 'pag-2018', cite: 'Physical Activity Guidelines for Americans, 2nd edition (2018)', detail: 'U.S. Department of Health and Human Services', use: () => t('Jak zacząć od jednego dnia siłowego w tygodniu i ile serii wystarczy.'), names: ['wytyczne USA', 'US guidelines', 'Physical Activity Guidelines'] },
  ] },
  { id: 'effort', title: () => t('Wysiłek: RPE i RIR'), items: [
    { id: 'zourdos-2016', cite: 'Zourdos et al. 2016', detail: 'J Strength Cond Res 2016;30(1)', use: () => t('Skala RPE oparta na powtórzeniach w zapasie (RIR).'), names: ['Zourdos'] },
    { id: 'helms-2016', cite: 'Helms et al. 2016', detail: 'Strength Cond J 2016;38(4)', use: () => t('Jak stosować skalę RPE i RIR w treningu oraz jak opisać niski wysiłek słowami.'), names: ['Helms'] },
    { id: 'bastos-2024', cite: 'Bastos et al. 2024', detail: 'Percept Mot Skills 2024;131(3)', use: () => t('Przegląd tego, jak używa się skali powtórzeń w zapasie.'), names: ['Bastos'] },
  ] },
  { id: 'e1rm', title: () => t('Szacowany maksymalny ciężar (e1RM)'), items: [
    { id: 'epley', cite: 'Epley', detail: 'Poundage Chart, 1985', use: () => t('Wzór, który z ciężaru i liczby powtórzeń szacuje maksymalny ciężar na jedno powtórzenie.'), names: ['Epley'] },
    { id: 'sanchez-moreno-2017', cite: 'Sánchez-Moreno et al. 2017', detail: 'Int J Sports Physiol Perform 2017;12(10)', use: () => t('Maksymalny ciężar w podciąganiu to masa ciała plus dociążenie.'), names: ['Sánchez-Moreno'] },
    { id: 'talaber-2022', cite: 'Talaber et al. 2022', detail: 'BMC Sports Sci Med Rehabil 2022', use: () => t('Jak mierzy się maksymalny ciężar w podciąganiu.'), names: ['Talaber'] },
    { id: 'van-den-tillaar-2020', cite: 'van den Tillaar and Ball 2020', detail: 'J Hum Kinet 2020;73', use: () => t('Jaką część masy ciała podnosisz w pompkach.'), names: ['van den Tillaar'] },
    { id: 'gouvali-2005', cite: 'Gouvali and Boudolos 2005', detail: 'J Strength Cond Res 2005;19(1)', use: () => t('Jaką część masy ciała podnosisz w pompkach.'), names: ['Gouvali'] },
  ] },
  { id: 'deload', title: () => t('Lżejszy tydzień (deload)'), items: [
    { id: 'bell-2023', cite: 'Bell et al. 2023', detail: 'Sports Med Open 2023;9', use: () => t('Jak często trenerzy planują lżejszy tydzień.'), names: ['Bell (?:i in\\.|et al\\.|\\d{4})'] },
    { id: 'rogerson-2024', cite: 'Rogerson et al. 2024', detail: 'Sports Med Open 2024;10', use: () => t('Jak często lżejszy tydzień planują zawodnicy.'), names: ['Rogerson'] },
  ] },
  { id: 'safety', title: () => t('Asekuracja'), items: [
    { id: 'nsca-2017', cite: 'NSCA 2017', detail: 'National Strength and Conditioning Association — Strength and Conditioning Professional Standards and Guidelines, Strength Cond J 2017;39(6)', use: () => t('Kiedy przy sztandze nad ciałem potrzebna jest asekuracja.'), names: ['NSCA'] },
  ] },
];

/** Rodzaje źródeł wskazówek techniki (opisy ogólne, bez nazw organizacji i marek — decyzja 09.10.2026; kolejność jak lib/cues CUE_BASIS_KINDS). */
export const CUE_SOURCE_LINES: readonly (() => string)[] = [
  () => t('biblioteki ćwiczeń organizacji szkoleniowych'), () => t('specjalistyczne serwisy treningowe'), () => t('materiały producenta sprzętu'), () => t('badania naukowe'),
];

/** Wszystkie rozpoznawane nazwy źródeł (wyrażenia regularne) — jedno miejsce dla strażnika; do tekstów spoza ekranu „Źródła wiedzy”. */
export const SOURCE_NAME_PATTERNS: readonly string[] = [
  ...SOURCE_GROUPS.flatMap(g => g.items.flatMap(i => i.names)),
  'Brzycki', 'Mayhew', 'Schoenfeld', 'Israetel', 'Zatsiorsky', 'Stronger by Science', 'ExRx', 'Nuckols',
  '[A-Z]\\p{L}+(?:-\\p{L}+)* (?:i in\\.|et al\\.) ?\\d{4}', /* cytat „Nazwisko i in. 2016” w dowolnym języku łacińskim */
];
