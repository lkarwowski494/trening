/*
 * Scenariusz pełny (prośba właściciela 06.10.2026): „napisz najszerszy test scenariusz jaki możesz sobie wyobrazić testujący dosłownie wszystko.
 * Czyli w każdym kroku każdą możliwą akcję do samego końca workflow jaki można wykonać.”
 *
 * Jedna ścieżka użytkownika od świeżej instalacji do wyczyszczenia danych, na prawdziwych ekranach (expo-router). Kroki to osobne test(),
 * ale stan przechodzi między nimi: po każdym kroku zapisany stan („SQLite” + klucz „live”) trafia do `carry`, a następny krok uruchamia
 * aplikację od nowa z tym stanem (jak ponowne otwarcie aplikacji). Zegar (fałszywe timery) biegnie dalej między krokami.
 * W każdym kroku sprawdzamy to, co widać na ekranie, ORAZ spójność danych w store.
 * Kroki, które ujawniają błąd lub niespójność, są oznaczone `test.failing` albo komentarzem „UWAGA:” — kodu aplikacji nie zmieniamy.
 */
import { Appearance } from 'react-native';
import { router } from 'expo-router';
import * as store from '@/lib/store';
import * as timer from '@/lib/timer';
import * as FS from 'expo-file-system/legacy';
import * as DP from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { renderApp, tap, type, flushAll, screen, go, act, fireEvent, expandEquip, swipeDelete, deleteActions } from './app';
import { ex, pressAlert, saved } from './helpers';
import type { State } from '@/lib/seed';
import { loadSummary } from '@/components/LoadEditor';
import { equipById } from '@/lib/equipment';

jest.setTimeout(180000);

const S = () => store.getState();
let carry: State | undefined;
/** Start aplikacji z zapisanym stanem poprzedniego kroku (pierwszy krok — świeża instalacja). */
const boot = async (url?: string) => { await renderApp({ saved: carry === undefined ? undefined : JSON.parse(JSON.stringify(carry)), url }); await flushAll(10); };
const back = async () => { await act(async () => { router.back(); }); await flushAll(10); };
const toggle = async (label: string, v: boolean) => { await act(async () => { fireEvent(screen.getByLabelText(label), 'valueChange', v); }); await flushAll(5); };
const endEdit = async (el: Parameters<typeof fireEvent>[0]) => { await act(async () => { fireEvent(el, 'endEditing'); }); };
const sheet = async (i: number) => { await act(async () => { (global as any).__pickSheet(i); }); await flushAll(5); };
const lastAlert = () => global.__alerts[global.__alerts.length - 1];
const loc = (name: string) => { const l = S().settings.locations.find(x => x.name === name); if (!l) throw new Error('no location ' + name); return l; };
const equip = (place: string, item: string) => loc(place).equipment.find(e => e.item === item);
/** Pole w wierszu serii po podpowiedzi VoiceOver (np. „Seria 1 — Bench Press (hantle)”). */
const field = (label: string, hint: string) => { const f = screen.getAllByLabelText(label).find(x => x.props.accessibilityHint === hint); if (!f) throw new Error(`no field ${label} / ${hint}`); return f; };
/** Podsumowanie edytora ciężarów — tekst z tej samej funkcji co ekran, liczony z danych miejsca (spójność ekran ↔ dane). */
const summary = (place: string, item: string) => screen.getAllByText(loadSummary(equipById(item)!, equip(place, item)!.load!))[0];
const byHint = (title: string, hint: string) => { const b = screen.getAllByText(title).map(x => { let p: any = x; while (p && p.props?.accessibilityRole !== 'button') p = p.parent; return p; }).find(p => p?.props.accessibilityHint === hint); if (!b) throw new Error(`no button ${title} / ${hint}`); return b; };

afterEach(async () => {
  /* stan przechodzi do następnego kroku także wtedy, gdy krok się wywrócił (kolejne kroki widzą to, co zostało) */
  try { await act(async () => { await store.flush(); }); carry = saved(); } catch { /* store niezainicjowany */ }
  await timer.stop(); await timer.stopSet();
});

describe('Scenariusz pełny: świeża instalacja → ustawienia → miejsca → biblioteka → szablon → trening → historia → postępy → backup → czyszczenie', () => {
  test('01 pierwsze uruchomienie: pusty stan, zakładki, podpowiedź i dane startowe', async () => {
    await boot();
    const st = S();
    expect(st.templates).toEqual([]); expect(st.workouts).toEqual([]); expect(st.active).toBeNull();
    expect(st.settings.locations).toEqual([]); expect(st.settings.mainLocationId).toBeNull();
    expect(st.settings.unit).toBe('kg'); expect(st.settings.theme).toBe('light'); expect(st.settings.language).toBe('auto');
    expect(st.bands.map(b => [b.color, b.level])).toEqual([['czerwona', 2], ['czarna', 4], ['fioletowa', 6]]);
    expect(st.exercises.length).toBeGreaterThan(500);
    expect(screen.getByText(/^Pierwszy raz\? Utwórz swój szablon/)).toBeTruthy();
    expect(screen.getByText('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')).toBeTruthy();
    expect(screen.getByText('+ Nowy szablon')).toBeTruthy(); expect(screen.getByText('Pusty trening')).toBeTruthy();
    expect(screen.queryByText(/^Powtórz ostatni/)).toBeNull(); expect(screen.queryByLabelText(/^Start: /)).toBeNull();
    for (const tab of ['Trening', 'Szablony', 'Ćwiczenia', 'Kalendarz', 'Więcej']) expect(screen.getAllByText(tab).length).toBeGreaterThan(0);
    /* pusty trening bez serii → „Brak odhaczonych serii” → odrzucenie; nic nie zostaje w historii */
    await tap(screen.getByText('Pusty trening')); await flushAll(10);
    expect(S().active).not.toBeNull(); expect(S().active!.templateId).toBeNull(); expect(screen.getAllByText('Zakończ trening i zapisz').length).toBe(1);
    expect(screen.queryByText(/^📍/)).toBeNull(); /* bez miejsc — bez wyboru miejsca */
    await tap(screen.getByText('Zakończ trening i zapisz'));
    expect(lastAlert().title).toBe('Brak odhaczonych serii');
    pressAlert('Brak odhaczonych serii', 'Wróć'); expect(S().active).not.toBeNull();
    await tap(screen.getByText('Zakończ trening i zapisz')); pressAlert('Brak odhaczonych serii', 'Odrzuć trening'); await flushAll(10);
    expect(S().active).toBeNull(); expect(S().workouts).toHaveLength(0);
    /* drugi pusty trening — „Anuluj trening” z potwierdzeniem */
    await tap(screen.getByText('Pusty trening')); await flushAll(10);
    await tap(screen.getByText('Anuluj trening')); expect(lastAlert().title).toBe('Anulować trening?');
    pressAlert('Anulować trening?', 'Wróć'); expect(S().active).not.toBeNull();
    await tap(screen.getByText('Anuluj trening')); pressAlert('Anulować trening?', 'Anuluj trening'); await flushAll(10);
    expect(S().active).toBeNull(); expect(screen.getByText('Pusty trening')).toBeTruthy();
    /* zakładki: puste listy */
    await go('/templates'); await flushAll(10); expect(screen.getByText('Brak szablonów — dodaj pierwszy.')).toBeTruthy();
    await go('/history'); await flushAll(10); expect(screen.getByText('Jeszcze pusto — pierwszy trening czeka.')).toBeTruthy(); expect(screen.getByText(/^0 sesji$/)).toBeTruthy();
    await go('/more'); await flushAll(10); for (const x of ['Postępy', 'Miejsca i sprzęt', 'Backup (eksport / import)', 'Ustawienia']) expect(screen.getByText(x)).toBeTruthy();
    expect(screen.queryByText('Gumy')).toBeNull();
    await go('/more/progress'); await flushAll(10); expect(screen.getByText('Wykresy pojawią się po pierwszym zakończonym treningu.')).toBeTruthy();
  });

  test('02 ustawienia: język EN i z powrotem, wygląd, jednostki kg→lb→kg, przerwa, przełączniki, powiadomienia', async () => {
    const setScheme = jest.spyOn(Appearance, 'setColorScheme');
    await boot('/more'); await tap(screen.getByText('Ustawienia')); await flushAll(10);
    expect(screen.getByLabelText('Język, Jak w telefonie')).toBeTruthy();
    /* język: lista wszystkich języków, wybrany „Jak w telefonie” */
    await tap(screen.getByText('Język')); await flushAll(10);
    expect(screen.getByLabelText('Jak w telefonie, wybrany')).toBeTruthy(); expect(screen.getByText('Polski')).toBeTruthy(); expect(screen.getByText('Українська')).toBeTruthy();
    await tap(screen.getByText('English')); await flushAll(10);
    expect(S().settings.language).toBe('en');
    expect(screen.getByLabelText('Language, English')).toBeTruthy(); expect(screen.getByText('Appearance')).toBeTruthy(); expect(screen.getByText('Weight unit')).toBeTruthy();
    expect(screen.queryByText('Wygląd')).toBeNull();
    /* EN: nazwy z biblioteki po angielsku, interfejs po angielsku */
    await go('/exercises'); await flushAll(10); expect(screen.getAllByText('Exercises').length).toBeGreaterThan(0);
    await go('/'); await flushAll(10); expect(screen.getByText('+ New template')).toBeTruthy(); expect(screen.getByText('Empty workout')).toBeTruthy();
    /* z powrotem na polski */
    await go('/more/settings'); await flushAll(10);
    await tap(screen.getByText('Language')); await flushAll(10); expect(screen.getByLabelText('English, selected')).toBeTruthy();
    await tap(screen.getByText('Polski')); await flushAll(10);
    expect(S().settings.language).toBe('pl'); expect(screen.getByLabelText('Język, Polski')).toBeTruthy(); expect(screen.getByText('Wygląd')).toBeTruthy();
    /* wygląd */
    expect(screen.getByLabelText('Jasny').props.accessibilityState.selected).toBe(true);
    await tap(screen.getByLabelText('Ciemny')); expect(S().settings.theme).toBe('dark'); expect(setScheme).toHaveBeenLastCalledWith('dark');
    await tap(screen.getByLabelText('Jak w telefonie')); expect(S().settings.theme).toBe('auto'); expect(setScheme).toHaveBeenLastCalledWith('unspecified');
    await tap(screen.getByLabelText('Jasny')); expect(S().settings.theme).toBe('light'); expect(setScheme).toHaveBeenLastCalledWith('light');
    setScheme.mockRestore();
    /* jednostki kg → lb → kg */
    await tap(screen.getByLabelText('lb')); expect(S().settings.unit).toBe('lb'); expect(screen.getByLabelText('lb').props.accessibilityState.selected).toBe(true);
    await tap(screen.getByLabelText('kg')); expect(S().settings.unit).toBe('kg');
    /* domyślna przerwa: limit 0–1800, puste pole nie zmienia, zapis liczby całkowitej */
    const rest = screen.getByLabelText('Domyślna przerwa (sekundy)'); expect(rest.props.value).toBe('90');
    await type(rest, '5000'); expect(S().settings.defaultRest).toBe(1800);
    await type(rest, ''); expect(S().settings.defaultRest).toBe(1800);
    await type(rest, '120,4'); expect(S().settings.defaultRest).toBe(120);
    await endEdit(rest); await flushAll(5); expect(screen.getByLabelText('Domyślna przerwa (sekundy)').props.value).toBe('120');
    /* przełączniki */
    const sws: [string, keyof State['settings'], boolean][] = [['Dźwięk i wibracja na koniec przerwy', 'sound', true], ['Ekran włączony podczas treningu', 'wakeLock', true], ['RPE / RIR przy serii', 'showRpe', false], ['Podpowiedź progresji', 'progressHint', true], ['Automatyczna kopia po każdym treningu', 'autoBackup', true]];
    for (const [label, key, def] of sws) {
      expect(screen.getByLabelText(label).props.accessibilityState.checked).toBe(def); expect(S().settings[key]).toBe(def);
      await toggle(label, !def); expect(S().settings[key]).toBe(!def); expect(screen.getByLabelText(label).props.accessibilityState.checked).toBe(!def);
    }
    /* zostawiamy: RPE włączone (pole RPE w treningu), reszta jak domyślnie */
    for (const [label, key, def] of sws) if (key !== 'showRpe') { await toggle(label, def); expect(S().settings[key]).toBe(def); }
    /* Apple Health: bez HealthKit (atrapa) — komunikat i przełącznik zostaje wyłączony */
    await toggle('Zapisuj zakończone treningi do Apple Health', true); await flushAll(10);
    expect(lastAlert().title).toBe('Apple Health niedostępne'); expect(S().settings.healthSync).toBe(false);
    /* zgoda na powiadomienia */
    await tap(screen.getByText('Sprawdź zgodę na powiadomienia')); await flushAll(10); expect(lastAlert().title).toBe('Powiadomienia działają');
    /* miejsca: jeszcze brak */
    expect(screen.getByLabelText('Miejsca treningu, sprzęt w domu, na siłowni, w hotelu…')).toBeTruthy();
    expect(S().settings).toMatchObject({ language: 'pl', theme: 'light', unit: 'kg', defaultRest: 120, showRpe: true, sound: true, wakeLock: true, progressHint: true, autoBackup: true, healthSync: false });
  });

  test('02b restart po ustawieniach: wszystko zapisane', async () => {
    await boot('/more/settings');
    expect(S().settings).toMatchObject({ language: 'pl', theme: 'light', unit: 'kg', defaultRest: 120, showRpe: true });
    expect(screen.getByLabelText('RPE / RIR przy serii').props.accessibilityState.checked).toBe(true);
    expect(screen.getByLabelText('Domyślna przerwa (sekundy)').props.value).toBe('120');
  });

  test('03 miejsca: każdy preset, sprzęt (grupy, pozycje, opcje), edytor ciężarów z presetami, gumy z poziomami i kolorami, bieżnia, główne, duplikat, usuwanie', async () => {
    await boot('/more'); await tap(screen.getByText('Miejsca i sprzęt')); await flushAll(10);
    expect(screen.getByText('Brak miejsc — wszystkie ćwiczenia są dostępne, a podpowiedzi działają jak dotąd.')).toBeTruthy();
    /* „+ Dodaj miejsce” → presety; „Anuluj” chowa listę */
    await tap(screen.getByText('+ Dodaj miejsce'));
    /* audyt 0.10 LOG-08: opisy z danych presetu (jednostka, mata w hotelu) */
    for (const [n, h] of [['Pełna siłownia', 'cały sprzęt; sztanga 20 kg + talerze 25…1,25 kg; hantle 2,5–50 kg co 2,5'], ['Dom', 'pusto — zaznaczysz, co masz'], ['Tylko masa ciała', 'tylko mata'], ['Hotel', 'hantle 2,5–25 kg, ławka regulowana, mata, bieżnia, rower']]) expect(screen.getByLabelText(`${n}, ${h}`)).toBeTruthy();
    await tap(screen.getByText('Anuluj')); expect(screen.queryByText('Nowe miejsce')).toBeNull(); expect(S().settings.locations).toHaveLength(0);

    /* 1) Pełna siłownia — pierwsze miejsce staje się główne */
    await tap(screen.getByText('+ Dodaj miejsce')); await tap(screen.getByLabelText(/^Pełna siłownia, /)); await flushAll(10);
    const gym = loc('Pełna siłownia'); expect(S().settings.mainLocationId).toBe(gym.id);
    expect(screen.getByLabelText('Nazwa').props.value).toBe('Pełna siłownia');
    expect(screen.getByText('★ Miejsce główne — domyślne dla nowych treningów i szablonów bez własnego miejsca.')).toBeTruthy(); expect(screen.queryByText('Ustaw jako główne')).toBeNull();
    expect(gym.equipment.some(e => e.item === 'electric' || e.item === 'db_plate' || e.item === 'tire')).toBe(false); /* stacja, hantle na talerze i strongman poza presetem */
    expect(gym.equipment.find(e => e.item === 'barbell')!.load).toMatchObject({ kind: 'plates', unit: 'kg', base: 20 });
    { const [, n, m] = /Dostępne ćwiczenia: (\d+) z (\d+)/.exec(screen.getByText(/^Dostępne ćwiczenia:/).props.children)!; expect(Number(n)).toBeGreaterThan(Number(m) * 0.8); }
    expect(screen.getByLabelText('Wolne ciężary').props.accessibilityState.expanded).toBe(false);
    expect(screen.getByLabelText('Strongman').props.accessibilityValue.text).toMatch(/^zaznaczone: 0 z /);
    await tap(screen.getByLabelText('Wolne ciężary')); expect(screen.getByLabelText('Sztanga (gryf olimpijski / prosty) + talerze').props.accessibilityState.checked).toBe(true);
    expect(summary('Pełna siłownia', 'barbell')).toBeTruthy(); expect(loadSummary(equipById('barbell')!, equip('Pełna siłownia', 'barbell')!.load!)).toMatch(/20–/); /* sztanga 20 kg + talerze */
    await tap(screen.getByLabelText('Wolne ciężary')); expect(screen.queryByLabelText('Sztanga (gryf olimpijski / prosty) + talerze')).toBeNull();
    await back(); expect(screen.getByLabelText(/^★ Pełna siłownia, główne · \d+ pozycj\S+ sprzętu$/)).toBeTruthy();

    /* 2) Dom — puste; nazwa, sprzęt pozycja po pozycji */
    await tap(screen.getByText('+ Dodaj miejsce')); await tap(screen.getByLabelText('Dom, pusto — zaznaczysz, co masz')); await flushAll(10);
    let home = loc('Dom'); expect(home.equipment).toEqual([]); expect(S().settings.mainLocationId).toBe(gym.id); expect(screen.getByText('Ustaw jako główne')).toBeTruthy();
    const avail = () => Number(/Dostępne ćwiczenia: (\d+)/.exec(screen.getByText(/^Dostępne ćwiczenia:/).props.children)![1]);
    const a0 = avail();
    const name = screen.getByLabelText('Nazwa');
    await type(name, 'Dom testowy  '); await endEdit(name); await flushAll(5); expect(home.name).toBe('Dom testowy');
    await type(screen.getByLabelText('Nazwa'), '   '); await endEdit(screen.getByLabelText('Nazwa')); await flushAll(5); expect(home.name).toBe('Dom testowy'); /* pusta nazwa wraca do poprzedniej */
    expect(screen.getByLabelText('Nazwa').props.value).toBe('Dom testowy');
    /* hantle stałe: preset Gymtek, odznaczanie, „Usuń odznaczone”, dodawanie, zły ciężar, zakres, zły zakres, preset z potwierdzeniem, jednostka sprzętu */
    await tap(screen.getByLabelText('Wolne ciężary'));
    const DB = 'Hantle (stała waga albo z szybką regulacją)';
    await toggle(DB, true); home = loc('Dom testowy');
    expect(equip('Dom testowy', 'db_fixed')!.load).toEqual({ kind: 'list', unit: 'kg', items: [] });
    expect(summary('Dom testowy', 'db_fixed')).toBeTruthy(); /* brak ciężarów */
    expect(screen.getByLabelText('Wolne ciężary').props.accessibilityValue.text).toBe('zaznaczone: 1 z 12');
    await tap(screen.getByText('Gymtek 2,5–24 kg')); await flushAll(5); /* pusta lista — bez pytania */
    const dbl = () => equip('Dom testowy', 'db_fixed')!.load as { kind: 'list'; unit: string; items: { w: number; on: boolean }[] };
    expect(dbl().items).toHaveLength(15); expect(summary('Dom testowy', 'db_fixed').props.children).toMatch(/15.*2,5–24 kg/);
    await tap(screen.getByLabelText('24 kg')); expect(dbl().items.find(x => x.w === 24)!.on).toBe(false); expect(screen.getByLabelText('24 kg').props.accessibilityState.checked).toBe(false);
    expect(summary('Dom testowy', 'db_fixed').props.children).toMatch(/14.*2,5–22,5 kg/);
    await tap(screen.getByLabelText(`Usuń odznaczone — ${DB}`)); expect(dbl().items.map(x => x.w)).not.toContain(24); expect(dbl().items).toHaveLength(14);
    await type(field('dodaj ciężar', DB), '0'); await tap(screen.getByLabelText(`Dodaj ciężar — ${DB}`)); expect(screen.getByText(/^Ciężar od 0,001 do 1000\.$/)).toBeTruthy(); expect(dbl().items).toHaveLength(14);
    await type(field('dodaj ciężar', DB), '26'); await tap(screen.getByLabelText(`Dodaj ciężar — ${DB}`)); expect(dbl().items.map(x => x.w)).toContain(26); expect(summary('Dom testowy', 'db_fixed').props.children).toMatch(/15.*2,5–26 kg/);
    await type(field('od', DB), '40'); await type(field('do', DB), '30'); await type(field('co', DB), '2'); await tap(screen.getByLabelText(`Wypełnij zakresem — ${DB}`));
    expect(screen.getByText(/^Zakres jest niepoprawny/)).toBeTruthy(); expect(dbl().items).toHaveLength(15);
    await type(field('od', DB), '2'); await type(field('do', DB), '30'); await tap(screen.getByLabelText(`Wypełnij zakresem — ${DB}`));
    expect(dbl().items.map(x => x.w)).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]); expect(screen.queryByText(/^Zakres jest niepoprawny/)).toBeNull();
    await tap(screen.getByText('Gymtek 2,5–24 kg')); expect(lastAlert().title).toBe('Zastąpić wpisane ciężary?');
    pressAlert('Zastąpić wpisane ciężary?', 'Nie'); await flushAll(5); expect(dbl().items).toHaveLength(15); expect(dbl().items[0].w).toBe(2);
    await tap(screen.getByText('Gymtek 2,5–24 kg')); pressAlert('Zastąpić wpisane ciężary?', 'Zastąp'); await flushAll(5); expect(dbl().items[0].w).toBe(2.5); expect(dbl().items).toHaveLength(15);
    await tap(screen.getByLabelText('24 kg')); expect(dbl().items.find(x => x.w === 24)!.on).toBe(false); /* 24 kg zostaje odznaczone (nie mam) */
    const unitSeg = () => screen.getAllByLabelText('lb').find(x => x.props.accessibilityHint === `Jednostka sprzętu — ${DB}`)!;
    await tap(unitSeg()); expect(dbl().unit).toBe('lb'); expect(dbl().items[0].w).toBe(5.5);
    await tap(screen.getAllByLabelText('kg').find(x => x.props.accessibilityHint === `Jednostka sprzętu — ${DB}`)!); expect(dbl().unit).toBe("kg"); expect(dbl().items.map(x => x.w)).toEqual([2.5, 3.5, 4.5, 5.5, 6.5, 8, 9, 10, 11.5, 13.5, 16, 18, 20.5, 22.5, 24]); /* kg → lb → kg bez strat */ expect(dbl().items.find(x => x.w === 24)!.on).toBe(false);
    /* odznaczenie pozycji zachowuje ciężary (audyt M5) */
    await toggle(DB, false); expect(equip('Dom testowy', 'db_fixed')!.off).toBe(true); expect(screen.queryByText('Gymtek 2,5–24 kg')).toBeNull();
    await toggle(DB, true); expect(equip('Dom testowy', 'db_fixed')!.off).toBeUndefined(); expect(dbl().items).toHaveLength(15);
    /* hantle na talerze: preset Hop-Sport, uchwyt, „+ talerz”, pola talerza, usunięcie talerza */
    const DBP = 'Hantle na talerze (uchwyty + talerze)';
    await toggle(DBP, true); expect(summary('Dom testowy', 'db_plate')).toBeTruthy();
    await tap(screen.getByText('Hop-Sport 2×10 kg')); await flushAll(5);
    const pl = () => equip('Dom testowy', 'db_plate')!.load as { kind: 'plates'; base: number; plates: { w: number; n: number }[] };
    expect(pl().base).toBe(1.5); expect(pl().plates).toHaveLength(3); expect(summary('Dom testowy', 'db_plate')).toBeTruthy();
    await type(field('Uchwyt (jeden, kg)', DBP), '2'); expect(pl().base).toBe(2);
    await tap(screen.getByLabelText(`+ talerz — ${DBP}`)); expect(pl().plates).toHaveLength(4); expect(pl().plates[3]).toEqual({ w: 0, n: 2 });
    await type(screen.getAllByLabelText('talerz (kg)').filter(x => x.props.accessibilityHint === DBP)[3], '5'); await type(screen.getAllByLabelText('sztuk').filter(x => x.props.accessibilityHint === DBP)[3], '4');
    expect(pl().plates[3]).toEqual({ w: 5, n: 4 });
    /* 07.10.2026 wieczór: usuwanie przesunięciem w lewo, zawsze z potwierdzeniem */
    await swipeDelete(`Usuń talerz — ${DBP}`, 3); expect(lastAlert()).toMatchObject({ title: 'Usunąć talerz?', msg: '5 kg × 4' }); pressAlert('Usunąć talerz?', 'Usuń'); await flushAll(5); expect(pl().plates).toHaveLength(3);
    await type(field('Uchwyt (jeden, kg)', DBP), '1,5'); expect(pl().base).toBe(1.5);
    expect(screen.getByLabelText('Wolne ciężary').props.accessibilityValue.text).toBe('zaznaczone: 2 z 12');
    /* ławki: ławka regulowana z opcją skosu w dół */
    await tap(screen.getByLabelText('Ławki i stojaki')); await toggle('Ławka regulowana', true);
    expect(equip('Dom testowy', 'bench_adj')!.opts).toEqual([]);
    await toggle('Ławka regulowana: ze skosem w dół', true); expect(equip('Dom testowy', 'bench_adj')!.opts).toEqual(['decline']);
    await toggle('Ławka regulowana: ze skosem w dół', false); expect(equip('Dom testowy', 'bench_adj')!.opts).toEqual([]);
    await toggle('Ławka regulowana: ze skosem w dół', true);
    /* drążek */
    await tap(screen.getByLabelText('Drążki i poręcze')); await toggle('Drążek do podciągania (rozporowy, ścienny)', true);
    /* wyciąg i stacja elektryczna (dwa przyrządy dla ćwiczeń na linkach) */
    await tap(screen.getByLabelText('Wyciągi'));
    const CAB = 'Wyciąg z regulacją wysokości (jeden)';
    await toggle(CAB, true); expect(equip('Dom testowy', 'cable_single')!.opts).toEqual(['rope']);
    await toggle(`${CAB}: opaski na kostki`, true); expect(equip('Dom testowy', 'cable_single')!.opts).toEqual(['rope', 'ankle']);
    await type(field('od', CAB), '5'); await type(field('do', CAB), '50'); await type(field('co', CAB), '5'); await tap(screen.getByLabelText(`Wypełnij zakresem — ${CAB}`));
    expect((equip('Dom testowy', 'cable_single')!.load as any).items).toHaveLength(10);
    const EL = 'Stacja z oporem elektrycznym / magnetycznym (np. ViShape, Speediance, Tonal…)';
    await toggle(EL, true); expect(equip('Dom testowy', 'electric')!.opts).toEqual(['dual', 'belt', 'ankle']);
    expect(summary('Dom testowy', 'electric')).toBeTruthy();
    await tap(screen.getByText('ViShape SmartGym Pro (1,5–65 kg/str.)')); await flushAll(5);
    expect(equip('Dom testowy', 'electric')!.load).toEqual({ kind: 'electric', unit: 'kg', min: 1.5, max: 65, step: 0.5 });
    expect(summary('Dom testowy', 'electric').props.children).toMatch(/128.*1,5–65 kg/);
    await type(field('max na stronę', EL), '35'); expect((equip('Dom testowy', 'electric')!.load as any).max).toBe(35);
    await tap(screen.getByText('ViShape SmartGym Pro (1,5–65 kg/str.)')); pressAlert('Zastąpić wpisane ciężary?', 'Zastąp'); await flushAll(5); expect((equip('Dom testowy', 'electric')!.load as any).max).toBe(65);
    await toggle(`${EL}: ramiona regulowane / wysoki wyciąg`, true); expect(equip('Dom testowy', 'electric')!.opts).toContain('arms');
    /* akcesoria: gumy — poziomy jak posiadane gumy, nowy poziom tworzy gumę, kolor; mata */
    await tap(screen.getByLabelText('Akcesoria')); await toggle('Gumy oporowe', true);
    expect(equip('Dom testowy', 'bands')!.levels).toEqual([2, 4, 6]);
    for (const n of [1, 2, 3, 4, 5, 6, 7]) expect(screen.getByLabelText(`Gumy oporowe: poziom ${n}`).props.accessibilityState.checked).toBe([2, 4, 6].includes(n));
    expect(screen.getByLabelText('Kolor gumy: poziom 2').props.value).toBe('czerwona');
    await tap(screen.getByLabelText('Gumy oporowe: poziom 1')); expect(equip('Dom testowy', 'bands')!.levels).toEqual([1, 2, 4, 6]);
    const b1 = S().bands.find(b => b.level === 1)!; expect(b1.color).toBe('nowa'); expect(S().bands).toHaveLength(4);
    await type(screen.getByLabelText('Kolor gumy: poziom 1'), 'zielona'); expect(b1.color).toBe('zielona');
    await tap(screen.getByLabelText('Gumy oporowe: poziom 6')); expect(equip('Dom testowy', 'bands')!.levels).toEqual([1, 2, 4]); expect(screen.queryByLabelText('Kolor gumy: poziom 6')).toBeNull();
    expect(S().bands).toHaveLength(4); /* odznaczenie poziomu nie usuwa gumy */
    await toggle('Mata', true);
    /* cardio: bieżnia z nachyleniem (domyślnie) i bez */
    await tap(screen.getByLabelText('Cardio')); const before = avail(); await toggle('Bieżnia', true);
    expect(equip('Dom testowy', 'treadmill')!.opts).toEqual(['incline']); const withIncline = avail(); expect(withIncline).toBeGreaterThan(before);
    await toggle('Bieżnia: z regulacją nachylenia (marsz pod górę)', false); expect(equip('Dom testowy', 'treadmill')!.opts).toEqual([]); expect(avail()).toBeLessThan(withIncline);
    await toggle('Bieżnia: z regulacją nachylenia (marsz pod górę)', true); expect(avail()).toBe(withIncline);
    expect(avail()).toBeGreaterThan(a0);
    /* zwinięcie wszystkiego i rozwinięcie wszystkich grup naraz */
    await expandEquip(); expect(screen.getByLabelText('Strongman').props.accessibilityState.expanded).toBe(true);
    /* główne */
    await tap(screen.getByText('Ustaw jako główne')); expect(S().settings.mainLocationId).toBe(home.id); expect(screen.getByText(/^★ Miejsce główne/)).toBeTruthy();
    await back();
    expect(screen.getByLabelText(/^★ Dom testowy, główne · 9 pozycji sprzętu$/)).toBeTruthy(); expect(screen.getByLabelText(/^Pełna siłownia, \d+ pozycj\S+ sprzętu$/)).toBeTruthy();

    /* 3) Tylko masa ciała, 4) Hotel → duplikat → usunięcie duplikatu */
    await tap(screen.getByText('+ Dodaj miejsce')); await tap(screen.getByLabelText('Tylko masa ciała, tylko mata')); await flushAll(10);
    expect(loc('Tylko masa ciała').equipment.map(e => e.item)).toEqual(['floor_mat']); await back();
    expect(screen.getByLabelText('Tylko masa ciała, 1 pozycja sprzętu')).toBeTruthy();
    await flushAll(1000); await tap(screen.getByText('+ Dodaj miejsce')); await tap(screen.getByLabelText(/^Hotel, /)); await flushAll(10);
    expect(loc('Hotel').equipment.map(e => e.item)).toEqual(['db_fixed', 'bench_adj', 'floor_mat', 'treadmill', 'bike']);
    await flushAll(1000); await tap(screen.getByText('Duplikuj')); await flushAll(10);
    const copy = loc('Hotel (kopia)'); expect(screen.getByLabelText('Nazwa').props.value).toBe('Hotel (kopia)'); expect(copy.equipment).toEqual(loc('Hotel').equipment); expect(copy.id).not.toBe(loc('Hotel').id);
    expect(screen.queryByText('Usuń')).toBeNull(); await back(); /* 07.10.2026 wieczór: usuwanie przesunięciem na liście miejsc */
    await swipeDelete('Usuń miejsce: Hotel (kopia)'); expect(lastAlert()).toMatchObject({ title: 'Usunąć miejsce?', msg: undefined });
    pressAlert('Usunąć miejsce?', 'Nie'); await flushAll(5); expect(S().settings.locations).toHaveLength(5);
    await swipeDelete('Usuń miejsce: Hotel (kopia)'); pressAlert('Usunąć miejsce?', 'Usuń'); await flushAll(10);
    expect(S().settings.locations.map(l => l.name)).toEqual(['Pełna siłownia', 'Dom testowy', 'Tylko masa ciała', 'Hotel']);
    /* miejsca głównego nie da się usunąć — na liście nie ma dla niego gestu */
    expect(deleteActions().filter(l => l.startsWith('Usuń miejsce: '))).not.toContain('Usuń miejsce: Dom testowy'); await flushAll(1000); await tap(screen.getByLabelText(/^★ Dom testowy/)); await flushAll(10);
    expect(screen.queryByText('Usuń')).toBeNull(); expect(S().settings.locations).toHaveLength(4);
    /* „Usuń gumy…” → ekran gum: dodanie, kolor, poziom, usunięcie */
    await tap(screen.getByLabelText('Akcesoria')); await tap(screen.getByText('Usuń gumy…')); await flushAll(10);
    expect(screen.getAllByLabelText('Kolor gumy').map(x => x.props.value)).toEqual(['zielona', 'czerwona', 'czarna', 'fioletowa']);
    await tap(screen.getByText('+ Guma')); await flushAll(5); expect(S().bands).toHaveLength(5); const nb = S().bands[4]; expect(nb).toMatchObject({ color: 'nowa', level: 3 });
    const colors = () => screen.getAllByLabelText('Kolor gumy');
    await type(colors()[4], ' niebieska  '); await endEdit(colors()[4]); await flushAll(5); expect(nb.color).toBe('niebieska');
    await type(colors()[4], ''); await endEdit(colors()[4]); await flushAll(5); expect(nb.color).toBe('niebieska'); /* pusty kolor wraca do poprzedniego */
    const lvl = screen.getAllByLabelText('Poziom (1–7)').find(x => x.props.accessibilityHint === 'niebieska')!; await type(lvl, '9'); expect(nb.level).toBe(7);
    await swipeDelete('Usuń gumę: niebieska'); expect(lastAlert().title).toBe('Usunąć gumę?');
    pressAlert('Usunąć gumę?', 'Usuń'); await flushAll(5); expect(S().bands.map(b => b.color)).toEqual(['czerwona', 'czarna', 'fioletowa', 'zielona']);
    /* Ustawienia pokazują liczbę miejsc i główne */
    await go('/more/settings'); await flushAll(10); expect(screen.getByLabelText('Miejsca treningu, 4, główne: Dom testowy')).toBeTruthy();
  });

  test('04 biblioteka ćwiczeń: lista z partiami, szukanie, otwarcie, partie główne/pomocnicze, przerwy, tempo, notatki, nowe ćwiczenia, usuwanie bez historii', async () => {
    await boot('/exercises');
    const n0 = store.visibleExercises().length; expect(screen.getByText(String(n0))).toBeTruthy();
    /* N3 / PERF-01 (audyt 0.10): lista wirtualizowana — na ekranie pierwsze wiersze, reszta w danych listy (pojawia się przy przewijaniu) */
    const listed = () => screen.getByTestId('exercises-list').props.data as { kind: string; group?: string; e?: { name: string } }[];
    expect(screen.getAllByText('klatka').length).toBeGreaterThan(0); for (const g of ['klatka', 'plecy', 'nogi', 'core', 'cardio']) expect(listed().some(r => r.kind === 'group' && r.group === g)).toBe(true); /* nagłówki partii */
    /* UWAGA: zakładka Ćwiczenia nie ma filtra partii (tylko pole szukania) — filtr partii jest w oknie wyboru ćwiczenia (krok 05). */
    const q = () => screen.getByPlaceholderText('Szukaj…');
    await type(q(), 'bench press (h'); expect(screen.getByText('Bench Press (hantle)')).toBeTruthy(); expect(screen.queryByText('Back Squat')).toBeNull();
    await type(q(), 'WIOSLOWANIE'); expect(screen.getByText('Wiosłowanie na linkach (siedząc)')).toBeTruthy(); /* bez polskich znaków i wielkości liter */
    await type(q(), 'zzqq nic'); expect(screen.getByText('Nic nie pasuje.')).toBeTruthy(); expect(screen.getByText('Utwórz „zzqq nic”')).toBeTruthy();
    await type(q(), ''); expect(listed().some(r => r.e?.name === 'Back Squat')).toBe(true);
    /* otwarcie ćwiczenia z biblioteki i edycja */
    await type(q(), 'Bench Press (hantle)'); await tap(screen.getByText('Bench Press (hantle)')); await flushAll(10);
    const bench = ex('Bench Press (hantle)');
    expect(screen.getByLabelText('Nazwa').props.value).toBe('Bench Press (hantle)');
    const chip = (label: string, i: number) => screen.getAllByLabelText(label).filter(x => x.props.accessibilityRole === 'button')[i];
    /* „barki”: [Partia, Partie główne, Partie pomocnicze] */
    expect(chip('barki', 2).props.accessibilityState.selected).toBe(true); expect(chip('barki', 1).props.accessibilityState.selected).toBe(false);
    await tap(chip('barki', 1)); expect(bench.muscles).toEqual(['klatka', 'barki']); expect(bench.secondaryMuscles).toEqual(['triceps']); /* główna znika z pomocniczych */
    await tap(chip('barki', 2)); expect(bench.muscles).toEqual(['klatka']); expect(bench.secondaryMuscles).toEqual(['triceps', 'barki']); /* i odwrotnie */
    await tap(chip('przedramiona', 1)); expect(bench.secondaryMuscles).toContain('przedramiona'); await tap(chip('przedramiona', 1)); expect(bench.secondaryMuscles).not.toContain('przedramiona');
    expect(screen.getByText(/klatka ●●●/)).toBeTruthy(); /* obciążenie partii z katalogu */
    expect(chip('per hantel (×2)', 0).props.accessibilityState.selected).toBe(true);
    await type(screen.getByLabelText('Przerwa robocza (s)'), '100'); expect(bench.restSec).toBe(100);
    await type(screen.getByLabelText('Przerwa po rozgrzewce (s)'), '9999'); expect(bench.restWarmupSec).toBe(1800);
    await type(screen.getByLabelText('Przerwa po rozgrzewce (s)'), '45'); expect(bench.restWarmupSec).toBe(45);
    await type(screen.getByLabelText('Tempo (opcjonalnie, np. 3-1-1)'), '3-1-1'); expect(bench.tempo).toBe('3-1-1');
    await type(screen.getByLabelText('Notatki techniczne'), 'łokcie 45°'); expect(bench.notes).toBe('łokcie 45°');
    const assist = screen.getByLabelText('Asysta gumą'); expect(assist.props.accessibilityState.checked).toBe(false);
    await tap(assist); expect(bench.bandAssistable).toBe(true); expect(screen.getByLabelText('Asysta gumą').props.accessibilityValue.text).toBe('tak — przy serii wybierasz gumę');
    await tap(screen.getByLabelText('Asysta gumą')); expect(bench.bandAssistable).toBe(false);
    expect(screen.queryByText(/^Uwaga: zmiana sprzętu/)).toBeNull(); /* bez historii — bez ostrzeżenia o przeliczeniu */
    await tap(screen.getByText('Postępy')); await flushAll(10); expect(screen.getByText('Brak zapisanych sesji z tym ćwiczeniem.')).toBeTruthy(); expect(screen.getByLabelText('Bench Press (hantle)')).toBeTruthy();
    await back(); await back();
    /* lista pokazuje tempo przy ćwiczeniu */
    expect(screen.getByLabelText('Bench Press (hantle), hantle · tempo 3-1-1')).toBeTruthy();
    /* „+ Nowe” nietknięte znika po wyjściu */
    await type(q(), '');
    await tap(screen.getByText('+ Nowe')); await flushAll(10); expect(screen.getByLabelText('Nazwa').props.value).toBe('Nowe ćwiczenie'); expect(store.visibleExercises()).toHaveLength(n0 + 1);
    await back(); expect(store.visibleExercises()).toHaveLength(n0); expect(S().exercises.some(e => e.name === 'Nowe ćwiczenie')).toBe(false);
    /* „Utwórz „…”” z wyszukiwania — własne ćwiczenie z partią, sprzętem, miarą, mięśniami, asystą gumą */
    await flushAll(1100); await type(q(), 'Wiosłowanie z ręcznikiem'); await tap(screen.getByText('Utwórz „Wiosłowanie z ręcznikiem”')); await flushAll(10);
    const own = S().exercises.find(e => e.name === 'Wiosłowanie z ręcznikiem')!; expect(own).toMatchObject({ group: 'inne', equipment: 'inne', metric: 'weight_reps', muscles: [] }); expect(own.lib).toBeFalsy();
    await tap(chip('plecy', 0)); expect(own.group).toBe('plecy'); expect(own.muscles).toEqual(['plecy']);
    await tap(chip('masa ciała', 0)); expect(own.equipment).toBe('masa ciała');
    expect(screen.queryByText('Jak liczyć ciężar w objętości')).toBeNull(); /* masa ciała — bez trybu liczenia */
    await tap(chip('biceps', 1)); expect(own.muscles).toEqual(['plecy', 'biceps']);
    await tap(chip('przedramiona', 1)); expect(own.secondaryMuscles).toEqual(['przedramiona']);
    await tap(chip('powtórzenia', 0)); expect(own.metric).toBe('reps'); await tap(chip('ciężar + powtórzenia', 0)); expect(own.metric).toBe('weight_reps');
    await tap(screen.getByLabelText('Asysta gumą')); expect(own.bandAssistable).toBe(true);
    const nm = screen.getByLabelText('Nazwa'); await type(nm, '  Wiosło   z ręcznikiem '); await endEdit(nm); await flushAll(5); expect(own.name).toBe('Wiosło z ręcznikiem');
    await back(); await type(q(), 'wioslo z'); expect(screen.getByLabelText('Wiosło z ręcznikiem, masa ciała · guma')).toBeTruthy();
    /* własne ćwiczenie bez historii — „Usuń ćwiczenie” usuwa je na stałe */
    await type(q(), ''); await flushAll(1100); await tap(screen.getByText('+ Nowe')); await flushAll(10);
    await type(screen.getByLabelText('Nazwa'), 'Do usunięcia'); const tmp = S().exercises.find(e => e.name === 'Do usunięcia')!;
    expect(screen.queryByText('Usuń ćwiczenie')).toBeNull(); await back(); /* 07.10.2026 wieczór: usuwanie przesunięciem na liście ćwiczeń */ await type(q(), 'Do usunięcia'); /* N3: lista wirtualizowana — wiersz z „inne” przez szukanie */
    await swipeDelete('Usuń z biblioteki: Do usunięcia'); expect(lastAlert()).toMatchObject({ title: 'Usunąć ćwiczenie?', msg: 'Zniknie z list i szablonów.' });
    pressAlert('Usunąć ćwiczenie?', 'Nie'); expect(S().exercises).toContain(tmp);
    await swipeDelete('Usuń z biblioteki: Do usunięcia'); pressAlert('Usunąć ćwiczenie?', 'Usuń'); await flushAll(10);
    expect(S().exercises.some(e => e.id === tmp.id)).toBe(false); expect(store.visibleExercises()).toHaveLength(n0 + 1);
    expect(screen.getByText(String(n0 + 1))).toBeTruthy();
  });

  test('05 szablon: nowy (porzucony znika), nazwa, miejsce domyślne, wybór ćwiczeń z filtrami, wiersze serii, typy, wartości, zakres, przerwa, guma, superset, karty, usuwanie, kolejność, duplikat', async () => {
    await boot('/templates');
    /* nietknięty nowy szablon znika po wyjściu */
    await tap(screen.getByText('+ Nowy')); await flushAll(10);
    expect(S().templates).toHaveLength(1); expect(screen.getByLabelText('Nazwa').props.value).toBe('Nowy szablon');
    expect(screen.queryByText('Start')).toBeNull(); expect(screen.queryByText('Duplikuj')).toBeNull(); expect(screen.queryByLabelText('Zmień kolejność ćwiczeń')).toBeNull(); expect(screen.queryByText('Usuń')).toBeNull(); /* 07.10.2026 wieczór: szablon usuwa się przesunięciem na liście */
    await back(); expect(S().templates).toHaveLength(0); expect(screen.getByText('Brak szablonów — dodaj pierwszy.')).toBeTruthy();
    await flushAll(1100); await tap(screen.getByText('+ Nowy')); await flushAll(10);
    const tpl = S().templates[0]; const nameF = screen.getByLabelText('Nazwa');
    await type(nameF, '  Push   A '); await endEdit(nameF); await flushAll(5); expect(tpl.name).toBe('Push A');
    /* miejsce domyślne szablonu: „główne” albo konkretne */
    const place = (n: string) => screen.getAllByLabelText(n).find(x => x.props.accessibilityHint === 'Miejsce domyślne')!;
    expect(place('główne').props.accessibilityState.selected).toBe(true); expect(tpl.locationId).toBeUndefined();
    await tap(place('Pełna siłownia')); expect(tpl.locationId).toBe(loc('Pełna siłownia').id);
    await tap(place('główne')); expect(tpl.locationId).toBeUndefined();
    await tap(place('Dom testowy')); expect(tpl.locationId).toBe(loc('Dom testowy').id); expect(place('Dom testowy').props.accessibilityState.selected).toBe(true);
    /* okno wyboru: filtr miejsca (domyślnie tylko dostępne), filtr partii, dokładne trafienie mimo filtra, „Anuluj” */
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10);
    const search = () => screen.getByPlaceholderText('Szukaj ćwiczenia…');
    expect(screen.getByLabelText('Filtr miejsca: Dom testowy. Tapnij, by zdjąć.')).toBeTruthy(); expect(screen.getByText(/^tylko dostępne w: Dom testowy · ukryte: \d+$/)).toBeTruthy();
    await type(search(), 'Back Sq'); expect(screen.queryByText('Back Squat')).toBeNull(); /* brak sztangi i stojaków w domu */
    await type(search(), 'Back Squat'); expect(screen.getByText('Back Squat')).toBeTruthy(); /* dokładna nazwa — mimo filtra */
    expect(screen.getByLabelText(/^Back Squat, sztanga · brak: /)).toBeTruthy();
    await tap(screen.getByLabelText('Filtr miejsca: Dom testowy. Tapnij, by zdjąć.')); expect(S().settings.pickerShowAll).toBe(true);
    await type(search(), 'Back Sq'); expect(screen.getByText('Back Squat')).toBeTruthy(); expect(screen.getByText(/^niedostępne w: Dom testowy są wyszarzone$/)).toBeTruthy();
    await tap(screen.getByLabelText('Filtr miejsca wyłączony: Dom testowy. Tapnij, by pokazać tylko dostępne.')); expect(S().settings.pickerShowAll).toBe(false);
    await type(search(), ''); await tap(screen.getAllByLabelText('barki').find(x => x.props.accessibilityRole === 'button')!);
    expect(screen.getByText('Band Pull Apart')).toBeTruthy(); expect(screen.queryByText('Bench Press (hantle)')).toBeNull();
    await tap(screen.getByLabelText('Wszystkie'));
    await tap(screen.getByText('Anuluj')); await flushAll(10); expect(tpl.items).toHaveLength(0); expect(screen.getByLabelText('Nazwa')).toBeTruthy();
    const add = async (n: string) => { await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10); await type(search(), n); await tap(screen.getAllByText(n)[0]); await flushAll(10); };
    for (const n of ['Bench Press (hantle)', 'Cable Curl', 'Pull Up', 'Plank', 'Band Pull Apart', 'Back Squat']) await add(n);
    expect(tpl.items.map(i => store.exById(i.exerciseId)!.name)).toEqual(['Bench Press (hantle)', 'Cable Curl', 'Pull Up', 'Plank', 'Band Pull Apart', 'Back Squat']);
    expect(tpl.items.every(i => i.sets === 3 && i.repMin === null && i.restSec === null && i.groupId === null)).toBe(true);
    /* ostatnio dodane ćwiczenie otwiera się samo, reszta zwinięta */
    const card = (n: string) => screen.getByLabelText(n, { exact: true }); const isOpen = (n: string) => card(n).props.accessibilityState.expanded;
    expect(isOpen('Back Squat')).toBe(true); expect(isOpen('Bench Press (hantle)')).toBe(false);
    expect(card('Bench Press (hantle)').props.accessibilityValue.text).toBe('3 serie · 100 s'); /* przerwa z ćwiczenia (krok 04) */
    /* usunięcie ćwiczenia z potwierdzeniem */
    await swipeDelete('Usuń ćwiczenie: Back Squat'); expect(lastAlert()).toMatchObject({ title: 'Usunąć z szablonu?', msg: 'Back Squat' });
    pressAlert('Usunąć z szablonu?', 'Nie'); await flushAll(5); expect(tpl.items).toHaveLength(6);
    await swipeDelete('Usuń ćwiczenie: Back Squat'); pressAlert('Usunąć z szablonu?', 'Usuń'); await flushAll(5); expect(tpl.items).toHaveLength(5); expect(screen.queryByLabelText('Back Squat')).toBeNull();

    /* Bench Press (hantle): wiersze serii */
    const B = 'Bench Press (hantle)'; await tap(card(B)); expect(isOpen(B)).toBe(true); expect(isOpen('Band Pull Apart')).toBe(false); /* jedna karta otwarta */
    const it0 = () => tpl.items[0]; const kinds = () => store.tplRows(it0()).map(r => r.kind);
    const kindBtn = (n: string, k: string) => screen.getByLabelText(`Seria ${n}, typ: ${k}. Tapnij, by zmienić typ.`);
    expect(screen.getAllByLabelText(/^Seria [123], typ: normalna/)).toHaveLength(3);
    await tap(byHint('+ seria', B)); expect(kinds()).toEqual(['normal', 'normal', 'normal', 'normal']); expect(it0().sets).toBe(4);
    await tap(byHint('+ rozgrzewka', B)); expect(kinds()).toEqual(['warmup', 'normal', 'normal', 'normal', 'normal']); expect(kindBtn('W', 'rozgrzewkowa')).toBeTruthy();
    await tap(byHint('+ drop set', B)); expect(kinds()).toEqual(['warmup', 'normal', 'normal', 'normal', 'normal', 'drop']); expect(kindBtn('4D', 'drop set')).toBeTruthy(); /* audyt 0.10 (LIVE-14): drop set z numerem swojej serii (wcześniej „5D”) */
    await swipeDelete(`Usuń serię 4D — ${B}`); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(5); expect(kinds()).toEqual(['warmup', 'normal', 'normal', 'normal', 'normal']);
    await tap(kindBtn('4', 'normalna')); expect((global as any).__sheets.at(-1).opts.options).toEqual(['Seria normalna', 'Rozgrzewka (W)', 'Drop set (D)', 'Do upadku (F)', 'Anuluj']);
    await sheet(3); expect(kinds()[4]).toBe('failure'); expect(kindBtn('4F', 'do upadku')).toBeTruthy();
    await tap(kindBtn('4F', 'do upadku')); await sheet(4); expect(kinds()[4]).toBe('failure'); /* Anuluj */
    await swipeDelete(`Usuń serię 4F — ${B}`); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(5); expect(kinds()).toEqual(['warmup', 'normal', 'normal', 'normal']); /* usunięcie przesunięciem */
    await tap(byHint('+ drop set', B)); expect(kinds()).toEqual(['warmup', 'normal', 'normal', 'normal', 'drop']);
    const wl = store.loadLabel(ex(B), store.implAtLoc(ex(B), store.startLocationId(tpl.locationId))); expect(wl).toBe('kg/hantel');
    const wF = () => screen.getAllByLabelText(wl).filter(x => x.props.accessibilityHint === B); const rF = () => screen.getAllByLabelText('Powtórzenia').filter(x => x.props.accessibilityHint === B);
    expect(wF()).toHaveLength(5); expect(rF()).toHaveLength(5);
    await type(wF()[0], '10'); await type(rF()[0], '12');
    for (const k of [1, 2, 3]) { await type(wF()[k], '22,5'); await type(rF()[k], '10'); }
    await type(wF()[4], '16'); await type(rF()[4], '8');
    expect(store.tplRows(it0()).map(r => [r.kind, r.weight, r.reps])).toEqual([['warmup', 10, 12], ['normal', 22.5, 10], ['normal', 22.5, 10], ['normal', 22.5, 10], ['drop', 16, 8]]);
    expect(it0().startWeight).toBe(22.5); expect(it0().sets).toBe(5); expect(wF()[1].props.value).toBe('22,5');
    /* zakres powtórzeń: dodanie, odwrócony zakres, usunięcie, ponowne dodanie */
    await tap(byHint('+ zakres powtórzeń', B));
    await type(screen.getByLabelText(`powtórzenia od — ${B}`), '8'); await type(screen.getByLabelText(`powtórzenia do — ${B}`), '6');
    expect(screen.getByText('„do” jest mniejsze niż „od” — zakres pokaże się jako 8+')).toBeTruthy();
    await type(screen.getByLabelText(`powtórzenia do — ${B}`), '12'); expect([it0().repMin, it0().repMax]).toEqual([8, 12]); expect(screen.getByText(/^Zakres powtórzeń: 8–12/)).toBeTruthy();
    await tap(screen.getAllByLabelText('Usuń zakres powtórzeń').find(x => x.props.accessibilityHint === B)!); expect([it0().repMin, it0().repMax]).toEqual([null, null]); expect(screen.queryByText(/^Zakres powtórzeń:/)).toBeNull();
    await tap(byHint('+ zakres powtórzeń', B)); await type(screen.getByLabelText(`powtórzenia od — ${B}`), '8'); await type(screen.getByLabelText(`powtórzenia do — ${B}`), '12');
    expect(rF()[1].props.placeholder).toBe('8–12');
    /* przerwa pozycji: pusta = z ćwiczenia (100 s), wpisana wygrywa */
    const rest = screen.getByLabelText('przerwa s'); expect(rest.props.placeholder).toBe('100');
    await type(rest, '2000'); expect(it0().restSec).toBe(1800); await type(rest, ''); expect(it0().restSec).toBeNull(); await type(rest, '90'); expect(it0().restSec).toBe(90);
    /* superset Bench + Cable Curl: połącz, rozłącz, połącz */
    await tap(screen.getByLabelText('Połącz z następnym w superset')); expect(tpl.items[0].groupId).toBeTruthy(); expect(tpl.items[1].groupId).toBe(tpl.items[0].groupId);
    expect(screen.getAllByText('SS A · ')).toHaveLength(2);
    await tap(screen.getByLabelText('Wyjmij z supersetu')); expect(tpl.items[0].groupId).toBeNull(); expect(tpl.items[1].groupId).toBeNull(); expect(screen.queryByText('SS A · ')).toBeNull();
    await tap(screen.getByLabelText('Połącz z następnym w superset')); expect(tpl.items[1].groupId).toBe(tpl.items[0].groupId);
    /* zwinięcie karty: linijka podsumowania */
    await tap(card(B)); expect(isOpen(B)).toBe(false); expect(screen.getByText('3 serie · 1 rozgrz. · 8–12 · 90 s')).toBeTruthy(); /* D3 (audyt 0.10): drop set liczy się razem z serią przed nim */

    /* Cable Curl: ciężar w kolumnie przyrządu z domu (wyciąg albo stacja) */
    const C = 'Cable Curl'; await tap(card(C)); const cl = store.loadLabel(ex(C), store.implAtLoc(ex(C), store.startLocationId(tpl.locationId)));
    for (const k of [0, 1, 2]) { await type(screen.getAllByLabelText(cl).filter(x => x.props.accessibilityHint === C)[k], '15'); await type(screen.getAllByLabelText('Powtórzenia').filter(x => x.props.accessibilityHint === C)[k], '12'); }
    expect(store.tplRows(tpl.items[1]).map(r => [r.weight, r.reps])).toEqual([[15, 12], [15, 12], [15, 12]]);
    /* Pull Up (masa ciała + asysta gumą): ± kg i przycisk gumy z poziomami domu */
    const P = 'Pull Up'; await tap(card(P));
    const pw = () => screen.getAllByLabelText('±kg').filter(x => x.props.accessibilityHint === P); const pr = () => screen.getAllByLabelText('Powtórzenia').filter(x => x.props.accessibilityHint === P);
    const bandBtn = (i: number) => screen.getAllByLabelText(/^Guma: /).filter(x => x.props.accessibilityHint === P)[i];
    expect(bandBtn(0).props.accessibilityLabel).toBe('Guma: brak. Tapnij, by zmienić.');
    await tap(bandBtn(0)); expect(bandBtn(0).props.accessibilityLabel).toBe('Guma: zielona, poziom 1. Tapnij, by zmienić.');
    await tap(bandBtn(0)); expect(bandBtn(0).props.accessibilityLabel).toBe('Guma: czerwona, poziom 2. Tapnij, by zmienić.');
    await tap(bandBtn(0)); await tap(bandBtn(0)); expect(bandBtn(0).props.accessibilityLabel).toBe('Guma: brak. Tapnij, by zmienić.'); /* 1 → 2 → 4 → brak (poziom 6 odznaczony w domu) */
    await tap(bandBtn(0)); await tap(bandBtn(0)); /* czerwona 2 */
    await type(pw()[2], '-5'); expect(pw()[2].props.value).toBe('-5');
    for (const k of [0, 1, 2]) await type(pr()[k], '6');
    const prow = store.tplRows(tpl.items[2]); expect(prow.map(r => [r.reps, r.bandId ? store.bandById(r.bandId)!.level : null])).toEqual([[6, 2], [6, null], [6, null]]); expect(prow[2].weight).toBe(-5);
    /* Plank: tylko „cel s”, bez ciężaru i powtórzeń */
    const PL = 'Plank'; await tap(card(PL)); expect(screen.queryAllByLabelText('Powtórzenia').filter(x => x.props.accessibilityHint === PL)).toHaveLength(0);
    for (const f of screen.getAllByLabelText('cel s').filter(x => x.props.accessibilityHint === PL)) await type(f, '45');
    await swipeDelete(`Usuń serię 3 — ${PL}`); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(5); expect(store.tplRows(tpl.items[3]).map(r => r.durationSec)).toEqual([45, 45]); expect(tpl.items[3].targetSec).toBe(45);
    /* Band Pull Apart: guma oporowa i powtórzenia */
    const BP = 'Band Pull Apart'; await tap(card(BP));
    await tap(screen.getAllByLabelText(/^Guma: /).filter(x => x.props.accessibilityHint === BP)[0]);
    for (const f of screen.getAllByLabelText('Powtórzenia').filter(x => x.props.accessibilityHint === BP)) await type(f, '15');
    expect(store.tplRows(tpl.items[4]).map(r => r.reps)).toEqual([15, 15, 15]); expect(store.tplRows(tpl.items[4])[0].bandId).toBeTruthy();

    /* kolejność: Plank niżej (pod Band Pull Apart), w supersecie Cable Curl wyżej i z powrotem; „Gotowe” */
    await tap(screen.getByLabelText('Zmień kolejność ćwiczeń')); await flushAll(10);
    expect(screen.getByLabelText(`Zmień kolejność: superset A: ${B}, ${C}`)).toBeTruthy();
    const plankId = tpl.items[3].id; const cableId = tpl.items[1].id;
    await act(async () => { fireEvent(screen.getByTestId('drag-i:' + plankId), 'accessibilityAction', { nativeEvent: { actionName: 'down' } }); }); await flushAll(5);
    expect(tpl.items.map(i => store.exById(i.exerciseId)!.name)).toEqual([B, C, P, BP, PL]);
    await act(async () => { fireEvent(screen.getByTestId('drag-i:' + cableId), 'accessibilityAction', { nativeEvent: { actionName: 'up' } }); }); await flushAll(5);
    expect(tpl.items.slice(0, 2).map(i => store.exById(i.exerciseId)!.name)).toEqual([C, B]); expect(tpl.items[0].groupId).toBe(tpl.items[1].groupId);
    await act(async () => { fireEvent(screen.getByTestId('drag-i:' + cableId), 'accessibilityAction', { nativeEvent: { actionName: 'down' } }); }); await flushAll(5);
    expect(tpl.items.map(i => store.exById(i.exerciseId)!.name)).toEqual([B, C, P, BP, PL]);
    await tap(screen.getByText('Gotowe')); await flushAll(10); expect(screen.getByLabelText('Nazwa').props.value).toBe('Push A');
    /* duplikat: kopia z nowymi id i nową grupą supersetu; usunięcie kopii */
    await tap(screen.getByText('Duplikuj')); await flushAll(10);
    expect(S().templates).toHaveLength(2); const cp = S().templates[1]; expect(cp.name).toBe('Push A (kopia)'); expect(screen.getByLabelText('Nazwa').props.value).toBe('Push A (kopia)');
    expect(cp.items.map(i => i.exerciseId)).toEqual(tpl.items.map(i => i.exerciseId)); expect(cp.items[0].id).not.toBe(tpl.items[0].id);
    expect(cp.items[0].groupId).toBeTruthy(); expect(cp.items[0].groupId).not.toBe(tpl.items[0].groupId); expect(cp.locationId).toBe(tpl.locationId);
    expect(store.tplRows(cp.items[0]).map(r => [r.kind, r.weight, r.reps])).toEqual(store.tplRows(tpl.items[0]).map(r => [r.kind, r.weight, r.reps]));
    await go('/templates'); await flushAll(10); /* 07.10.2026 wieczór: szablon usuwa się przesunięciem na liście */
    await swipeDelete('Usuń szablon: Push A (kopia)'); expect(lastAlert().title).toBe('Usunąć szablon?'); pressAlert('Usunąć szablon?', 'Nie'); expect(S().templates).toHaveLength(2);
    await swipeDelete('Usuń szablon: Push A (kopia)'); pressAlert('Usunąć szablon?', 'Usuń'); await flushAll(10); expect(S().templates.map(x => x.name)).toEqual(['Push A']);
    /* lista szablonów i ekran główny */
    await go('/templates'); await flushAll(10); expect(screen.getByLabelText('Push A, Bench Press (hantle), Cable Curl, Pull Up, Band Pull Apart…')).toBeTruthy();
    await go('/'); await flushAll(10);
    expect(screen.getByLabelText('Push A, 5 ćw. · 14 serii')).toBeTruthy(); expect(screen.getByLabelText('Start: Push A')).toBeTruthy();
    expect(screen.getByText(/^Pierwszy raz\? Wybierz szablon niżej/)).toBeTruthy();
  });


  /* Znalezisko scenariusza 06.10 (naprawione tego samego dnia): ekran główny i „Trening wstecz” liczyły serie szablonu razem z rozgrzewkami,
   * karta szablonu („4 serie · 1 rozgrz.”) i lista Historii — bez. Teraz wszędzie store.tplWorkSets. Push A: 15 serii roboczych + 1 rozgrzewka → „15 serii”; od audytu 0.10 (D3) drop set liczy się razem z serią przed nim → „14 serii”. */
  test('05b liczba serii szablonu na ekranie głównym = serie robocze (bez rozgrzewek), jak w edytorze szablonu', async () => {
    await boot('/');
    const tpl = S().templates[0]; const work = tpl.items.reduce((a, i) => a + store.workCount(store.tplRows(i).map(r => r.kind)), 0); expect(work).toBe(14); /* D3 (audyt 0.10): 15 wierszy roboczych, z nich 1 drop set — liczy się razem z serią przed nim */
    expect(screen.getByLabelText(`Push A, 5 ćw. · ${work} serii`)).toBeTruthy();
  });
  test('06 trening z szablonu: miejsce, wartości z szablonu, wpisy, ✓ i przerwa, superset, guma, rozgrzewka/drop, notatka serii, typ serii, zamiana i cofnięcie, zamiennik per miejsce, przyrząd, dodanie/usunięcie ćwiczenia, przerwa ⏱, kolejność, stoper', async () => {
    await boot('/');
    const B = 'Bench Press (hantle)', C = 'Cable Curl', P = 'Pull Up', BP = 'Band Pull Apart', PL = 'Plank';
    await tap(screen.getByLabelText('Start: Push A')); await flushAll(10);
    const a = S().active!; const tpl = S().templates[0];
    expect(a.templateId).toBe(tpl.id); expect(a.templateName).toBe('Push A'); expect(a.locationId).toBe(loc('Dom testowy').id);
    const names = () => S().active!.exercises.map(e => store.exById(e.exerciseId)!.name);
    expect(names()).toEqual([B, C, P, BP, PL]);
    const blk = (n: string, k = 0) => S().active!.exercises.filter(e => store.exById(e.exerciseId)!.name === n)[k];
    expect(blk(B).sets.map(x => [x.kind, x.weight, x.reps])).toEqual([['warmup', 10, 12], ['normal', 22.5, 10], ['normal', 22.5, 10], ['normal', 22.5, 10], ['drop', 16, 8]]);
    expect([blk(B).restSec, blk(B).repMin, blk(B).repMax, blk(C).restSec, blk(P).restSec]).toEqual([90, 8, 12, 120, 120]);
    expect(blk(B).groupId).toBeTruthy(); expect(blk(C).groupId).toBe(blk(B).groupId);
    expect(blk(P).sets.map(x => [x.addKg, x.reps, x.bandId ? store.bandById(x.bandId)!.level : null])).toEqual([['', 6, 2], ['', 6, null], [-5, 6, null]]);
    expect(blk(PL).sets.map(x => x.durationSec)).toEqual([45, 45]);
    /* nagłówek: nazwa, miejsce, zegar, postęp */
    expect(screen.getByText('Push A')).toBeTruthy(); expect(screen.getByText('📍 Dom testowy ▾')).toBeTruthy();
    expect(screen.getByLabelText('Postęp treningu: 0 z 16 serii')).toBeTruthy(); expect(screen.getAllByText('SS A · ')).toHaveLength(2);
    expect(screen.getByText(/8–12 pow\. · superset · przerwa po rundzie 2:00 · 3-1-1/)).toBeTruthy(); /* zakres, superset, przerwa rundy, tempo z ćwiczenia */
    expect(screen.getByText('Notatka do treningu')).toBeTruthy(); expect(screen.getAllByText('RPE').length).toBeGreaterThan(0); /* RPE włączone w Ustawieniach */
    /* zmiana miejsca tylko dla tej sesji: masa ciała → plakietka braku sprzętu; Anuluj; powrót do domu */
    const chipLoc = () => screen.getByLabelText(/^Miejsce treningu: .*\. Tapnij, by zmienić\.$/);
    await tap(chipLoc()); expect((global as any).__sheets.at(-1).opts.options).toEqual(['Pełna siłownia', 'Dom testowy', 'Tylko masa ciała', 'Hotel', 'Anuluj']);
    await sheet(2); expect(S().active!.locationId).toBe(loc('Tylko masa ciała').id); expect(screen.getByText('📍 Tylko masa ciała ▾')).toBeTruthy();
    expect(screen.getAllByLabelText(/^Brak sprzętu w: Tylko masa ciała\. Brakuje: /).length).toBe(4); /* wszystko poza Plankiem */ expect(screen.getByLabelText(`Zamień ćwiczenie (brak sprzętu): ${B}`)).toBeTruthy();
    await tap(chipLoc()); await sheet(4); expect(S().active!.locationId).toBe(loc('Tylko masa ciała').id); /* Anuluj */
    await tap(chipLoc()); await sheet(1); expect(S().active!.locationId).toBe(loc('Dom testowy').id); expect(screen.queryByLabelText(/^Brak sprzętu w:/)).toBeNull();
    expect(tpl.locationId).toBe(loc('Dom testowy').id); /* szablon bez zmian */

    /* wpisy w serii Bench 1: ciężar, powtórzenia, RPE */
    const h = (n: string | number, e: string) => `Seria ${n} — ${e}`;
    const wB = (n: number | string) => field('kg/hantel', h(n, B));
    expect(wB(1).props.value).toBe('22,5'); await type(wB(1), '24'); expect(blk(B).sets[1].weight).toBe(24); expect(blk(B).sets[1].edited).toBe(true);
    await type(field('Powtórzenia', h(1, B)), '11'); expect(blk(B).sets[1].reps).toBe(11);
    await type(field('RPE', h(1, B)), '8,5'); expect(blk(B).sets[1].rpe).toBe(8.5); await type(field('RPE', h(1, B)), '12'); expect(blk(B).sets[1].rpe).toBe(10); await type(field('RPE', h(1, B)), '8');
    /* ✓ rozgrzewka: przerwa po rozgrzewce z ćwiczenia (45 s), bo w rundzie nic jeszcze nie zrobiono */
    const done = (n: string | number, e: string) => tap(screen.getByLabelText(`Seria ${n} zrobiona — ${e}`));
    await done('W', B); expect(blk(B).sets[0].done).toBe(true); expect(screen.getByLabelText('Postęp treningu: 1 z 16 serii')).toBeTruthy();
    expect(timer.T.on).toBe(false); /* rozgrzewka w trwającej rundzie supersetu — bez przerwy (Q-006) */
    /* ✓ Bench 1 (superset): bez przerwy w środku rundy; ✓ Cable 1 zamyka rundę → przerwa rundy 2:00 */
    await done(1, B); expect(timer.T.on).toBe(false); await flushAll(30000);
    await done(1, C); expect(timer.T.on).toBe(true); expect(timer.T.total).toBe(120); expect(screen.getByText('przerwa z 2:00')).toBeTruthy();
    expect(blk(C).sets[0].completedAt).toBeTruthy(); expect(blk(C).sets[0].actualRest).toBe(30); /* od poprzedniej odhaczonej serii */
    /* przerwa: −15, +15, Pomiń */
    const end0 = timer.T.endAt; await tap(screen.getByLabelText('Skróć przerwę o 15 sekund')); expect(timer.T.endAt).toBe(end0 - 15000);
    await tap(screen.getByLabelText('Wydłuż przerwę o 15 sekund')); await tap(screen.getByLabelText('Wydłuż przerwę o 15 sekund')); expect(timer.T.endAt).toBe(end0 + 15000);
    await tap(screen.getByText('Pomiń')); expect(timer.T.on).toBe(false); expect(screen.queryByText(/^przerwa z/)).toBeNull();
    /* ✓ i cofnięcie ✓ (seria 2 Bench) — cofnięcie zdejmuje znacznik i godzinę */
    await done(2, B); expect(blk(B).sets[2].done).toBe(true); await done(2, B); expect(blk(B).sets[2].done).toBe(false); expect(blk(B).sets[2].completedAt).toBeNull();
    /* Pull Up: guma (cykl poziomów domu), ±kg, + rozgrzewka, + drop set, − seria, notatka i typ serii z menu */
    const bandP = (n: string | number) => screen.getAllByLabelText(/^Guma: /).find(x => x.props.accessibilityHint === h(n, P))!;
    expect(bandP(1).props.accessibilityLabel).toBe('Guma: czerwona, poziom 2. Tapnij, by zmienić.'); expect(bandP(2).props.accessibilityLabel).toBe('Guma: brak. Tapnij, by zmienić.');
    await tap(bandP(2)); expect(bandP(2).props.accessibilityLabel).toBe('Guma: zielona, poziom 1. Tapnij, by zmienić.');
    await tap(bandP(2)); expect(store.bandById(blk(P).sets[1].bandId)!.level).toBe(2);
    expect(field('±kg', h(3, P)).props.value).toBe('-5'); await type(field('±kg', h(2, P)), '2,5'); expect(blk(P).sets[1].addKg).toBe(2.5);
    await tap(byHint('+ rozgrzewka', P)); expect(blk(P).sets.map(x => x.kind)).toEqual(['warmup', 'normal', 'normal', 'normal']); expect(field('±kg', h('W', P))).toBeTruthy();
    await tap(byHint('+ drop set', P)); expect(blk(P).sets.map(x => x.kind)).toEqual(['warmup', 'normal', 'normal', 'normal', 'drop']); expect(screen.getByLabelText(`Seria 3D zrobiona — ${P}`)).toBeTruthy(); /* audyt 0.10 (LIVE-14): „3D” (wcześniej „4D”) */
    await swipeDelete(`Usuń serię 3D — ${P}`); expect(lastAlert()).toMatchObject({ title: 'Usunąć serię?', msg: undefined }); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(5); expect(blk(P).sets.map(x => x.kind)).toEqual(['warmup', 'normal', 'normal', 'normal']); /* 07.10.2026 wieczór: potwierdzenie zawsze */
    const kindP = (n: string, k: string) => screen.getAllByLabelText(`Seria ${n}, typ: ${k}. Tapnij, by zmienić typ lub dodać notatkę.`).find(x => x.props.accessibilityHint === h(n, P))!;
    await tap(kindP('1', 'normalna')); expect((global as any).__sheets.at(-1).opts.options).toEqual(['Seria normalna', 'Rozgrzewka (W)', 'Drop set (D)', 'Do upadku (F)', 'Dodaj notatkę', 'Anuluj']);
    await sheet(4); expect(lastAlert()).toMatchObject({ title: 'Notatka do serii', prompt: true, def: '' });
    await act(async () => { pressAlert('Notatka do serii', 'Zapisz', '  chwyt nachwytem  '); }); await flushAll(5);
    expect(blk(P).sets[1].note).toBe('chwyt nachwytem'); expect(screen.getByText('chwyt nachwytem')).toBeTruthy();
    await tap(kindP('1', 'normalna')); expect((global as any).__sheets.at(-1).opts.options[4]).toBe('Edytuj notatkę'); await sheet(3);
    expect(blk(P).sets[1].kind).toBe('failure'); expect(kindP('1F', 'do upadku')).toBeTruthy();
    await tap(kindP('W', 'rozgrzewkowa')); await sheet(0); expect(blk(P).sets[0].kind).toBe('normal'); expect(blk(P).sets[0].warmup).toBe(false);
    await tap(kindP('1', 'normalna')); await sheet(1); expect(blk(P).sets[0].kind).toBe('warmup'); /* z powrotem rozgrzewka */
    await done('1F', P); expect(timer.T.on).toBe(true); expect(timer.T.total).toBe(120); await tap(screen.getByText('Pomiń'));

    /* zamiana Band Pull Apart → propozycja; „Zawsze w: Dom testowy” (zamiennik w szablonie); cofnięcie; podpowiedź zamiennika i „✕” */
    await tap(screen.getByLabelText(`Zamień ćwiczenie: ${BP}`)); await flushAll(10);
    expect(screen.getByText(`Zamiana tylko w tym treningu: ${BP}`)).toBeTruthy(); expect(screen.getByText('Propozycje')).toBeTruthy(); expect(screen.getByText('Inne')).toBeTruthy();
    const propLabel: string = screen.getAllByLabelText(/^Propozycja 1: /)[0].props.accessibilityLabel; await tap(screen.getAllByLabelText(/^Propozycja 1: /)[0]); await flushAll(10);
    const swapped = S().active!.exercises.find(e => e.swappedFrom === ex(BP).id)!; expect(swapped).toBeTruthy(); const XN = store.exById(swapped.exerciseId)!.name;
    expect(propLabel.startsWith(`Propozycja 1: ${XN}`)).toBe(true);
    expect(screen.getByText(new RegExp(`^zamiast: ${BP.replace(/[()]/g, '\\$&')}`))).toBeTruthy();
    await tap(screen.getByLabelText(`Zawsze w: Dom testowy — ${XN}`)); expect(tpl.items.find(i => i.exerciseId === ex(BP).id)!.alternates).toEqual([{ locationId: loc('Dom testowy').id, exerciseId: swapped.exerciseId, restSec: null }]);
    expect(screen.queryByLabelText(`Zawsze w: Dom testowy — ${XN}`)).toBeNull();
    await tap(screen.getByLabelText(`Cofnij zamianę: ${XN}`)); await flushAll(5);
    expect(names()[3]).toBe(BP); expect(S().active!.exercises[3].swappedFrom).toBeUndefined(); expect(S().active!.exercises[3].sets).toHaveLength(3);
    expect(screen.getByText(`Zwykle w: Dom testowy — ${XN}. Zamienić?`)).toBeTruthy();
    await tap(screen.getByLabelText(`Nie zamieniaj: ${XN}`)); expect(S().active!.exercises[3].altSkip).toBe(true); expect(screen.queryByText(/^Zwykle w:/)).toBeNull();
    /* „Inne”: lista z filtrami partii i miejsca (bez wyboru — „Anuluj”) */
    await tap(screen.getByLabelText(`Zamień ćwiczenie: ${BP}`)); await flushAll(10);
    await tap(screen.getByLabelText('Pokaż inne ćwiczenia')); expect(screen.getByLabelText('Filtr partii: barki. Tapnij, by zdjąć.')).toBeTruthy(); expect(screen.getByLabelText('Filtr miejsca: Dom testowy. Tapnij, by zdjąć.')).toBeTruthy();
    await tap(screen.getByLabelText('Filtr partii: barki. Tapnij, by zdjąć.')); expect(screen.getByLabelText('Filtr partii wyłączony: barki. Tapnij, by włączyć.')).toBeTruthy();
    await tap(screen.getByText('Anuluj')); await flushAll(10); expect(names()[3]).toBe(BP);

    /* Cable Curl: ten sam ruch, inny przyrząd — seria 1 odhaczona, więc podział bloku */
    const impl0 = blk(C).impl; expect(['cable', 'electric']).toContain(impl0); const other = impl0 === 'cable' ? 'stacja' : 'wyciąg';
    await tap(screen.getByLabelText(`Zamień ćwiczenie: ${C}`)); await flushAll(10);
    expect(screen.getByText('Ten sam ruch, inny przyrząd')).toBeTruthy();
    await tap(screen.getByLabelText(`Inny przyrząd: ${other}`)); await flushAll(10);
    expect(names()).toEqual([B, C, C, P, BP, PL]); expect(blk(C, 0).sets).toHaveLength(1); expect(blk(C, 0).sets[0].done).toBe(true);
    expect(blk(C, 1).sets).toHaveLength(2); expect(blk(C, 1).implPinned).toBe(true); expect(blk(C, 1).impl).not.toBe(impl0); expect(blk(C, 1).groupId).toBe(blk(B).groupId); expect(blk(C, 1).splitFrom).toBe(blk(C, 0).id);
    expect(screen.getAllByText('SS A · ')).toHaveLength(3); expect(screen.getByText(new RegExp(`^${other} · `))).toBeTruthy();
    expect(screen.queryByLabelText(`Zamień ćwiczenie: ${C} (1)`)).toBeNull(); /* blok z samymi odhaczonymi seriami — bez „⇄ zamień” */

    /* dodanie ćwiczeń w trakcie: filtr partii w oknie wyboru; usunięcie jednego z potwierdzeniem */
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10);
    expect(screen.getByLabelText('Filtr miejsca: Dom testowy. Tapnij, by zdjąć.')).toBeTruthy();
    await tap(screen.getAllByLabelText('barki').find(x => x.props.accessibilityRole === 'button')!); expect(screen.queryByText('Bench Press (hantle)')).toBeNull();
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'lateral raise (h'); await tap(screen.getByText('Lateral Raise (hantle)')); await flushAll(10);
    const LR = 'Lateral Raise (hantle)'; expect(names().at(-1)).toBe(LR); expect(blk(LR).sets).toHaveLength(1); expect(blk(LR).restSec).toBe(120); expect(blk(LR).tplItemId).toBeUndefined();
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Push Up'); await tap(screen.getByText('Push Up')); await flushAll(10);
    expect(names().at(-1)).toBe('Push Up');
    await swipeDelete('Usuń ćwiczenie: Push Up'); expect(lastAlert()).toMatchObject({ title: 'Usunąć z treningu?', msg: 'Push Up' });
    pressAlert('Usunąć z treningu?', 'Nie'); await flushAll(5); expect(names().at(-1)).toBe('Push Up');
    await swipeDelete('Usuń ćwiczenie: Push Up'); pressAlert('Usunąć z treningu?', 'Usuń'); await flushAll(5); expect(names().at(-1)).toBe(LR); expect(S().exercises.some(e => e.name === 'Push Up')).toBe(true);
    /* Lateral Raise: + seria ×2, − seria, wpis, ✓ przenosi wpisane wartości na następną serię */
    await tap(byHint('+ seria', LR)); await tap(byHint('+ seria', LR)); expect(blk(LR).sets).toHaveLength(3); await swipeDelete(`Usuń serię 3 — ${LR}`); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(5); expect(blk(LR).sets).toHaveLength(2);
    await type(field('kg/hantel', h(1, LR)), '8'); await type(field('Powtórzenia', h(1, LR)), '15');
    await done(1, LR); expect(blk(LR).sets[1]).toMatchObject({ weight: 8, reps: 15, done: false }); expect(timer.T.total).toBe(120); await tap(screen.getByText('Pomiń'));
    /* ⏱ przerwa: „Tylko teraz”, „Zapamiętaj” (ćwiczenie spoza szablonu → ćwiczenie), „Anuluj”; Pull Up z szablonu → pozycja szablonu */
    const restBtn = (e: string) => screen.getAllByLabelText(/^Przerwa: .*\. Tapnij, by zmienić\.$/).find(x => x.props.accessibilityHint === e)!;
    await tap(restBtn(LR)); expect(lastAlert()).toMatchObject({ title: 'Przerwa (sekundy)', msg: 'Zapamiętać dla tego ćwiczenia?', prompt: true, def: '120' });
    await act(async () => { pressAlert('Przerwa (sekundy)', 'Tylko teraz', '75'); }); await flushAll(5); expect(blk(LR).restSec).toBe(75); expect(ex(LR).restSec).toBeNull();
    expect(restBtn(LR).props.accessibilityLabel).toBe('Przerwa: 1:15. Tapnij, by zmienić.');
    await tap(restBtn(LR)); await act(async () => { pressAlert('Przerwa (sekundy)', 'Zapamiętaj', '80'); }); await flushAll(5); expect(blk(LR).restSec).toBe(80); expect(ex(LR).restSec).toBe(80);
    await tap(restBtn(LR)); await act(async () => { pressAlert('Przerwa (sekundy)', 'Anuluj', '5'); }); await flushAll(5); expect(blk(LR).restSec).toBe(80);
    await tap(restBtn(LR)); await act(async () => { pressAlert('Przerwa (sekundy)', 'Tylko teraz', 'abc'); }); await flushAll(5); expect(blk(LR).restSec).toBe(80); /* nieliczba — bez zmian */
    await tap(restBtn(P)); await act(async () => { pressAlert('Przerwa (sekundy)', 'Zapamiętaj', '100'); }); await flushAll(5);
    expect(blk(P).restSec).toBe(100); expect(tpl.items.find(i => i.exerciseId === ex(P).id)!.restSec).toBe(100); expect(ex(P).restSec).toBe(100);
    /* kolejność w trakcie treningu: Lateral Raise nad Plank */
    await tap(screen.getByLabelText('Zmień kolejność ćwiczeń')); await flushAll(10);
    await act(async () => { fireEvent(screen.getByTestId('drag-i:' + blk(LR).id), 'accessibilityAction', { nativeEvent: { actionName: 'up' } }); }); await flushAll(5);
    await tap(screen.getByText('Gotowe')); await flushAll(10); expect(names()).toEqual([B, C, C, P, BP, LR, PL]);
    /* Plank: stoper do celu 45 s kończy serię sam; druga seria — „Zakończ serię” ręcznie; ponowny pomiar z pytaniem */
    await tap(field('Start stopera serii', h(1, PL))); expect(timer.S.on).toBe(true); expect(screen.getByText('seria · cel 45s')).toBeTruthy(); expect(screen.getByText('Zakończ serię')).toBeTruthy();
    await flushAll(46000); expect(timer.S.on).toBe(false); expect(blk(PL).sets[0]).toMatchObject({ done: true, durationSec: 45 }); expect(timer.T.on).toBe(true);
    await tap(screen.getByText('Pomiń'));
    await tap(field('Start stopera serii', h(2, PL))); await flushAll(20000); await tap(screen.getByText('Zakończ serię')); await flushAll(10);
    expect(blk(PL).sets[1].done).toBe(true); expect(blk(PL).sets[1].durationSec).toBeGreaterThanOrEqual(20); expect(blk(PL).sets[1].durationSec).toBeLessThan(25);
    await tap(screen.getByText('Pomiń'));
    await tap(field('Start stopera serii', h(1, PL))); expect(lastAlert().title).toBe('Zmierzyć serię od nowa?'); pressAlert('Zmierzyć serię od nowa?', 'Nie'); expect(timer.S.on).toBe(false);
    /* notatka do treningu */
    await type(screen.getByLabelText('Notatka do treningu'), 'dobry dzień'); expect(S().active!.note).toBe('dobry dzień');
    /* reszta serii: Bench 2, 3 i drop (24 kg przeszło z serii 1), Cable (stacja/wyciąg), Pull Up 2–3, Band Pull Apart, Lateral Raise 2 */
    await flushAll(60000); await done(2, B); await done(1, `${C} (2)`); expect(timer.T.on).toBe(true); /* runda 2 zamknięta zamiennikiem przyrządu */
    await done(3, B); await done('3D' /* audyt 0.10 (LIVE-14) */, B); await done(2, `${C} (2)`); await tap(screen.getByText('Pomiń'));
    expect(blk(B).sets.map(x => [x.kind, x.weight, x.reps, x.done])).toEqual([['warmup', 10, 12, true], ['normal', 24, 11, true], ['normal', 24, 11, true], ['normal', 24, 11, true], ['drop', 16, 8, true]]); /* wpis w serii 1 zastępuje wartości wstawione z szablonu w kolejnych seriach */
    await done(2, P); await done(3, P); await tap(screen.getByText('Pomiń'));
    for (const n of [1, 2]) await done(n, BP);
    await type(field('Powtórzenia', h(3, BP)), '12'); /* wpisana, nieodhaczona — ostrzeżenie przy zakończeniu */
    expect(screen.getByLabelText(/^Postęp treningu: \d+ z \d+ serii$/).props.accessibilityLabel).toBe('Postęp treningu: 16 z 19 serii');
    /* ostatnia seria: przerwa 1:20 trwa przy „restarcie” (krok 06b) */
    await done(2, LR); expect(timer.T.on).toBe(true); expect(timer.T.total).toBe(80);
  });

  test('06b restart aplikacji w trakcie treningu: trening, przerwa i wartości wracają', async () => {
    const endAt = carry!.timer?.restEndAt; expect(endAt).toBeTruthy();
    await boot('/');
    const a = S().active!; expect(a).toBeTruthy(); expect(a.templateName).toBe('Push A'); expect(a.note).toBe('dobry dzień');
    expect(timer.T.on).toBe(true); expect(timer.T.endAt).toBe(endAt); expect(screen.getByText('przerwa z 1:20')).toBeTruthy();
    expect(screen.getByLabelText('Postęp treningu: 17 z 19 serii')).toBeTruthy(); expect(screen.getByText('chwyt nachwytem')).toBeTruthy();
    expect(screen.getByText('📍 Dom testowy ▾')).toBeTruthy();
    /* zakładka Trening z plakietką pozostałej przerwy, także z innej zakładki */
    await go('/history'); await flushAll(10); expect(screen.getByLabelText(/^Trening, przerwa \+?\d+:\d\d$/)).toBeTruthy(); /* każde przejście ekranu w testach przesuwa zegar — przerwa mogła już minąć (+) */
    await go('/'); await flushAll(10);
    /* koniec przerwy: „przerwa minęła” */
    await flushAll(120000); expect(screen.queryByText('przerwa minęła') ?? screen.queryByText(/^przerwa z/)).toBeTruthy();
  });

  test('06c zakończenie treningu: potwierdzenie z ostrzeżeniami, zapis, szczegóły sesji, kopia automatyczna', async () => {
    await boot('/');
    const write = FS.writeAsStringAsync as jest.Mock; write.mockClear();
    await tap(screen.getAllByText('Zakończ trening i zapisz')[0]);
    const al = lastAlert(); expect(al.title).toBe('Zakończyć trening?');
    expect(al.msg).toContain('Zapisane zostaną serie robocze: 16.'); expect(al.msg).toContain('Nieodhaczone serie z wpisanymi wynikami: 1 — nie zostaną zapisane.');
    pressAlert('Zakończyć trening?', 'Wróć'); await flushAll(10); expect(S().active).not.toBeNull();
    await tap(screen.getByText('Zakończ')); pressAlert('Zakończyć trening?', 'Zakończ'); await flushAll(600);
    expect(S().active).toBeNull(); expect(S().workouts).toHaveLength(1); const w = S().workouts[0];
    expect(w.finishedAt).toBeGreaterThan(w.startedAt); expect(w.templateName).toBe('Push A'); expect(w.note).toBe('dobry dzień'); expect(w.locationId).toBe(loc('Dom testowy').id);
    expect(w.exercises.map(e => [store.exById(e.exerciseId)!.name, e.sets.length])).toEqual([['Bench Press (hantle)', 5], ['Cable Curl', 1], ['Cable Curl', 2], ['Pull Up', 3], ['Band Pull Apart', 2], ['Lateral Raise (hantle)', 2], ['Plank', 2]]);
    expect(w.exercises.every(e => e.sets.every(x => x.done))).toBe(true); /* nieodhaczone serie nie trafiają do historii */
    expect(global.__alerts.some(x => /rekord/i.test(x.title))).toBe(false); /* pierwszy trening nie jest rekordem */
    /* szczegóły sesji otwarte od razu */
    expect(screen.getByText('dobry dzień')).toBeTruthy(); expect(screen.getByText('Edytuj')).toBeTruthy(); expect(screen.queryByText('Usuń sesję')).toBeNull(); /* 07.10.2026 wieczór: usuwanie przesunięciem na liście Historii */
    expect(screen.getAllByText('SS A · ').length).toBe(3); expect(screen.getByText('chwyt nachwytem')).toBeTruthy();
    /* kopia automatyczna po treningu */
    expect(write.mock.calls.some(([p]) => /\/Backup\/trening-\d{4}-\d{2}-\d{2}-\d{6}\.json$/.test(p))).toBe(true);
    /* ekran główny: „Powtórz ostatni”, szablon z datą ostatniego treningu, bez podpowiedzi pierwszego razu */
    await go('/'); await flushAll(10);
    expect(screen.getByText('Powtórz ostatni (Push A)')).toBeTruthy(); expect(screen.queryByText(/^Pierwszy raz\?/)).toBeNull();
    expect(screen.getByLabelText(/^Push A, 5 ćw\. · 14 serii · ostatnio /)).toBeTruthy();
    expect(timer.T.on).toBe(false); expect(timer.S.on).toBe(false);
  });

  test('07 historia: lista, szczegóły, edycja sesji (anuluj, wartości, typ, notatka, guma, data, seria, zamiana i przywrócenie, ćwiczenie), trening wstecz (pusty i z szablonu), usuwanie, „Powtórz ostatni”', async () => {
    await boot('/history');
    const w0 = S().workouts[0]; const B = 'Bench Press (hantle)', LR = 'Lateral Raise (hantle)', PL = 'Plank', P = 'Pull Up';
    expect(screen.getByText('1 sesja')).toBeTruthy();
    const vol = store.volume(w0); expect(vol).toBeGreaterThan(0);
    expect(store.workingSets(w0)).toBe(w0.exercises.reduce((a, e) => a + store.workCount(e.sets.map(x => x.kind)), 0)); /* X-15 / D3 (audyt 0.10) */
    expect(screen.getByLabelText(new RegExp(`^Push A, .* · ${store.workingSets(w0)} serii · ${require('@/lib/units').fmtVol(vol).replace(/[.()]/g, '\\$&')}$`))).toBeTruthy();
    await tap(screen.getByText('Push A')); await flushAll(10);
    expect(screen.getByText(new RegExp(`· objętość ${require('@/lib/units').fmtVol(vol)}$`))).toBeTruthy();
    for (const hd of ['kg/hant.', 'pow.', 'RPE', 'guma', 'przerwa', 'czas']) expect(screen.getAllByText(hd, { includeHiddenElements: true }).length).toBeGreaterThan(0); /* nagłówki ukryte przed VoiceOver (wiersz czytany w całości) */
    expect(screen.getAllByText(/^(SS A · )?Cable Curl$/)).toHaveLength(2);
    /* edycja: zmiana i „Anuluj” z pytaniem — historia bez zmian */
    await tap(screen.getByLabelText('Edytuj sesję')); await flushAll(10);
    expect(screen.getByText('📍 Dom testowy')).toBeTruthy(); expect(screen.getByLabelText('Nazwa').props.value).toBe('Push A');
    await type(screen.getByLabelText('Nazwa'), 'zmiana'); await tap(screen.getByLabelText('Anuluj'));
    expect(lastAlert()).toMatchObject({ title: 'Odrzucić zmiany?', msg: 'Sesja w historii zostanie bez zmian.' });
    pressAlert('Odrzucić zmiany?', 'Wróć'); await flushAll(5); expect(screen.getByLabelText('Nazwa').props.value).toBe('zmiana');
    await tap(screen.getByLabelText('Anuluj')); pressAlert('Odrzucić zmiany?', 'Odrzuć zmiany'); await flushAll(10);
    expect(S().workouts[0].templateName).toBe('Push A'); expect(screen.getByText('Push A')).toBeTruthy();
    /* edycja i zapis */
    await flushAll(1100); await tap(screen.getByLabelText('Edytuj sesję')); await flushAll(10);
    await type(screen.getByLabelText('Nazwa'), 'Push A — poprawione');
    const h = (n: string | number, e: string) => `Seria ${n} — ${e}`;
    await type(field('Powtórzenia', h(1, B)), '12');
    await type(field('kg/hantel', h(2, B)), '25');
    await tap(screen.getAllByLabelText(/^Seria 1, typ: /).find(x => x.props.accessibilityHint === h(1, LR))!); await sheet(3);
    await tap(screen.getAllByLabelText(/^Seria 1F?, typ: /).find(x => x.props.accessibilityHint === h('1F', LR))!); await sheet(4);
    await act(async () => { pressAlert('Notatka do serii', 'Zapisz', 'barki zmęczone'); }); await flushAll(5); expect(screen.getByText('barki zmęczone')).toBeTruthy();
    const bandP = screen.getAllByLabelText(/^Guma: /).find(x => x.props.accessibilityHint === h(2, P))!; const before = bandP.props.accessibilityLabel; await tap(bandP);
    expect(screen.getAllByLabelText(/^Guma: /).find(x => x.props.accessibilityHint === h(2, P))!.props.accessibilityLabel).not.toBe(before);
    await swipeDelete(`Usuń serię 2 — ${PL}`); pressAlert('Usunąć serię?', 'Usuń'); await flushAll(5); expect(screen.getAllByText('1 seria').length).toBeGreaterThan(0);
    await tap(byHint('+ seria', LR)); expect(field('Powtórzenia', h(3, LR)).props.value).toBe('15'); /* nowa seria z wartościami ostatniej */
    await type(field('kg/hantel', h(3, LR)), ''); await type(field('Powtórzenia', h(3, LR)), ''); /* pusta seria — zostanie pominięta przy zapisie */
    const dateF = () => screen.getByLabelText('Data (RRRR-MM-DD)'); const d0 = dateF().props.value;
    await tap(screen.getByLabelText('Dzień wcześniej')); expect(dateF().props.value).not.toBe(d0); await tap(screen.getByLabelText('Dzień później')); expect(dateF().props.value).toBe(d0);
    /* zamiana ćwiczenia w zapisie (poprawka) i „↺ przywróć” */
    await tap(screen.getByLabelText(`Zamień ćwiczenie: ${LR}`)); await flushAll(10);
    expect(screen.getByText(`Poprawka zapisu: wszystkie serie bloku „${LR}” przejdą pod wybrane ćwiczenie (wartości bez zmian).`)).toBeTruthy();
    const pl1: string = screen.getAllByLabelText(/^Propozycja 1: /)[0].props.accessibilityLabel; const swappedName = pl1.slice('Propozycja 1: '.length).split(', ')[0];
    await tap(screen.getAllByLabelText(/^Propozycja 1: /)[0]); await flushAll(10); expect(screen.queryByLabelText(`Zamień ćwiczenie: ${LR}`)).toBeNull();
    await tap(screen.getByLabelText(`Zamień ćwiczenie: ${swappedName}`)); await flushAll(10);
    await tap(screen.getByText(`↺ przywróć: ${LR}`)); await flushAll(10); expect(screen.getAllByText(LR).length).toBeGreaterThan(0);
    /* dodanie i usunięcie ćwiczenia w zapisie */
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Push Up'); await tap(screen.getByText('Push Up')); await flushAll(10);
    await type(field('Powtórzenia', h(1, 'Push Up')), '20');
    await tap(screen.getByText('+ Dodaj ćwiczenie')); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'Chin Up'); await tap(screen.getByText('Chin Up')); await flushAll(10);
    await swipeDelete('Usuń ćwiczenie: Chin Up'); pressAlert('Usunąć z treningu?', 'Usuń'); await flushAll(5); expect(screen.queryByText('Chin Up')).toBeNull();
    await type(screen.getByLabelText('Notatka do treningu'), 'dobry dzień, poprawione');
    await tap(screen.getByText('Zapisz zmiany')); expect(lastAlert().title).toBe('Zapisać zmiany?'); expect(lastAlert().msg).toContain('Serie bez wyniku zostaną pominięte: 1.');
    pressAlert('Zapisać zmiany?', 'Zapisz'); await flushAll(10);
    const w1 = S().workouts.find(x => x.id === w0.id)!; expect(w1.templateName).toBe('Push A — poprawione'); expect(w1.note).toBe('dobry dzień, poprawione');
    const bx = w1.exercises.find(e => store.exById(e.exerciseId)!.name === B)!; expect(bx.sets[1].reps).toBe(12); expect(bx.sets[2].weight).toBe(25);
    const lx = w1.exercises.find(e => store.exById(e.exerciseId)!.name === LR)!; expect(lx.sets).toHaveLength(2); expect(lx.sets[0]).toMatchObject({ kind: 'failure', note: 'barki zmęczone' });
    expect(w1.exercises.find(e => store.exById(e.exerciseId)!.name === PL)!.sets).toHaveLength(1);
    expect(w1.exercises.find(e => store.exById(e.exerciseId)!.name === 'Push Up')!.sets[0].reps).toBe(20);
    expect(w1.exercises.some(e => store.exById(e.exerciseId)!.name === 'Chin Up')).toBe(false);
    expect(screen.getByText('Push A — poprawione')).toBeTruthy(); expect(screen.getByText('barki zmęczone')).toBeTruthy();
    await back();

    /* trening wstecz: zła data → komunikat; pusty → „Pusty trening” i odrzucenie; z szablonu → zapis */
    await tap(screen.getByText('+ Dodaj trening wstecz')); await flushAll(10);
    expect(screen.getByLabelText('Push A, 5 ćw. · 14 serii')).toBeTruthy(); expect(screen.getByLabelText('Godzina startu').props.value).toBe('18:00'); expect(screen.getByLabelText('Czas trwania (min)').props.value).toBe('60');
    const date0 = screen.getByLabelText('Data (RRRR-MM-DD)').props.value;
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), '2026-13-45'); await tap(screen.getByLabelText('Push A, 5 ćw. · 14 serii'));
    expect(lastAlert().title).toBe('Sprawdź datę i godzinę'); expect(S().workouts).toHaveLength(1);
    await type(screen.getByLabelText('Data (RRRR-MM-DD)'), date0);
    await tap(screen.getByLabelText('Pusty trening, ćwiczenia dodasz w następnym kroku')); await flushAll(10);
    expect(screen.getByText('Brak ćwiczeń — dodaj pierwsze.')).toBeTruthy();
    await tap(screen.getByText('Zapisz zmiany')); expect(lastAlert()).toMatchObject({ title: 'Pusty trening', msg: 'Nie ma żadnej serii z wynikiem — nic do zapisania.' });
    pressAlert('Pusty trening', 'Odrzuć trening'); await flushAll(10); expect(S().workouts).toHaveLength(1);
    await tap(screen.getByText('+ Dodaj trening wstecz')); await flushAll(10);
    for (let i = 0; i < 3; i++) await tap(screen.getByLabelText('Dzień wcześniej')); /* 4 dni temu */
    await tap(screen.getByLabelText('Push A, 5 ćw. · 14 serii')); await flushAll(10);
    expect(screen.getByLabelText('Nazwa').props.value).toBe('Push A');
    await type(field('kg/hantel', h(1, B)), '20'); /* reszta z szablonu (wartości planu) */
    await tap(screen.getByText('Zapisz zmiany')); if (global.__alerts.at(-1)?.title === 'Zapisać zmiany?') pressAlert('Zapisać zmiany?', 'Zapisz'); await flushAll(10);
    expect(S().workouts).toHaveLength(2); const past = S().workouts.find(x => x.id !== w0.id)!;
    expect(past.startedAt).toBeLessThan(w0.startedAt - 3 * 86400e3); expect(past.finishedAt! - past.startedAt).toBe(3600e3); expect(past.templateId).toBe(S().templates[0].id);
    expect(past.exercises.find(e => store.exById(e.exerciseId)!.name === B)!.sets.find(x => x.kind === 'normal')!.weight).toBe(20);
    expect(screen.getByText('Push A')).toBeTruthy(); /* szczegóły nowej sesji */
    /* drugi trening wstecz i jego usunięcie z potwierdzeniem */
    await go('/history/add'); await flushAll(10); await tap(screen.getByLabelText('Dzień wcześniej'));
    await tap(screen.getByLabelText('Push A, 5 ćw. · 14 serii')); await flushAll(10);
    await tap(screen.getByText('Zapisz zmiany')); if (global.__alerts.at(-1)?.title === 'Zapisać zmiany?') pressAlert('Zapisać zmiany?', 'Zapisz'); await flushAll(10);
    expect(S().workouts).toHaveLength(3); const extra = S().workouts.find(x => x.id !== w0.id && x.id !== past.id)!;
    await go('/history'); await flushAll(10); const extraLbl = `Usuń sesję: ${extra.templateName}, ${store.fmtDate(extra.startedAt)} ${store.fmtTime(extra.startedAt)}`; /* 07.10.2026 wieczór: przesunięcie na liście */
    await swipeDelete(extraLbl); expect(lastAlert().title).toBe('Usunąć tę sesję z historii?');
    pressAlert('Usunąć tę sesję z historii?', 'Nie'); await flushAll(5); expect(S().workouts).toHaveLength(3);
    await swipeDelete(extraLbl); pressAlert('Usunąć tę sesję z historii?', 'Usuń'); await flushAll(10);
    expect(S().workouts.map(x => x.id).sort()).toEqual([w0.id, past.id].sort()); expect(S().workouts.some(x => x.id === extra.id)).toBe(false);
    await go('/history'); await flushAll(10); expect(screen.getByText('2 sesje')).toBeTruthy();
    /* „Powtórz ostatni”: to, co faktycznie zrobiono (także Push Up dodane w edycji), potem anulowanie */
    await go('/'); await flushAll(10); await tap(screen.getByText('Powtórz ostatni (Push A — poprawione)')); await flushAll(10);
    const r = S().active!; expect(r.templateName).toBe('Push A — poprawione'); expect(r.exercises.map(e => store.exById(e.exerciseId)!.name)).toContain('Push Up');
    expect(r.exercises.every(e => e.sets.every(x => !x.done))).toBe(true);
    await tap(screen.getByText('Anuluj trening')); pressAlert('Anulować trening?', 'Anuluj trening'); await flushAll(10); expect(S().active).toBeNull(); expect(S().workouts).toHaveLength(2);
  });

  test('08 postępy: wykresy tygodniowe, serie i objętość per partia (zgodne z danymi), wybór ćwiczenia, metryki wykresu, rekordy, sesje', async () => {
    const stats = require('@/lib/stats'); const { fmtNum, fmtW, fmtVol } = require('@/lib/units');
    await boot('/more'); await tap(screen.getByText('Postępy')); await flushAll(10);
    for (const t of ['Objętość tygodniowo (kg)', 'Serie robocze tygodniowo', 'Serie per partia — ten tydzień vs poprzedni', 'Objętość per partia (kg) — ten tydzień vs poprzedni']) expect(screen.getByText(t)).toBeTruthy();
    const weeks = stats.weeklyTotals(8); expect(weeks.reduce((a: number, w: any) => a + w.workouts, 0)).toBe(2);
    /* serie per partia: każdy wiersz na ekranie = liczby ze store (ten tydzień i poprzedni) */
    const cur = stats.weeklySetsByMuscle(stats.thisMonday()), prev = stats.weeklySetsByMuscle(stats.thisMonday(-1));
    const mus = Object.keys({ ...cur, ...prev }).filter(m => (cur[m] ?? 0) > 0 || (prev[m] ?? 0) > 0); expect(mus).toEqual(expect.arrayContaining(['klatka', 'barki', 'plecy', 'biceps', 'core']));
    for (const m of mus) expect(screen.getAllByText(`${fmtNum(cur[m] ?? 0, 1)} (poprz. ${fmtNum(prev[m] ?? 0, 1)})`).length).toBeGreaterThan(0);
    expect((cur.klatka ?? 0) + (prev.klatka ?? 0)).toBeGreaterThan(0);
    /* wybór ćwiczenia: najpierw te z historią */
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'bench press (h'); await tap(screen.getByLabelText('Bench Press (hantle)')); await flushAll(10);
    const bench = ex('Bench Press (hantle)'); const rec = stats.recordsFor(bench); const keys = stats.chartKeysFor(bench);
    expect(screen.getByText('REKORDY')).toBeTruthy();
    expect(screen.getByText('Max ciężar (per hantel)')).toBeTruthy(); expect(screen.getByText(fmtW(rec.maxLoad))).toBeTruthy(); expect(rec.maxLoad).toBe(25); /* poprawka z historii (25 kg) */
    expect(screen.getByText('Max powtórzeń w serii')).toBeTruthy(); expect(rec.maxReps).toBe(12);
    expect(screen.getByText('e1RM (Epley, per hantel)')).toBeTruthy(); expect(screen.getByText(fmtW(rec.bestE1rm))).toBeTruthy();
    expect(screen.getByText('Najlepsza seria (objętość)')).toBeTruthy(); expect(screen.getByText(fmtVol(rec.bestSetVolume))).toBeTruthy();
    expect(screen.getByText('Sesje')).toBeTruthy(); expect(stats.sessionsFor(bench)).toHaveLength(2);
    for (const k of keys) { await tap(screen.getByLabelText(k.label)); expect(screen.getByLabelText(k.label).props.accessibilityState.selected).toBe(true); }
    await tap(screen.getByLabelText('Bench Press (hantle)')); expect(screen.getByText('Serie robocze tygodniowo')).toBeTruthy(); /* „✕” — z powrotem przegląd */
    /* ćwiczenie na czas: wykres czasu, rekord najdłuższej serii */
    await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'plank'); await tap(screen.getByLabelText('Plank')); await flushAll(10);
    expect(screen.getByText('Najdłuższa seria')).toBeTruthy(); expect(stats.recordsFor(ex('Plank')).maxDuration).toBe(45); expect(screen.getAllByText(store.fmtSec(45)).length).toBeGreaterThan(0);
  });

  test('09 ćwiczenie z historią: ostrzeżenie o przeliczeniu, „Ostatnio”, usunięcie = archiwum (historia i wykresy zostają), przywrócenie', async () => {
    await boot('/exercises'); const LR = 'Lateral Raise (hantle)';
    await type(screen.getByPlaceholderText('Szukaj…'), 'lateral raise (h'); await tap(screen.getByText(LR)); await flushAll(10);
    expect(screen.getByText(/^Uwaga: zmiana sprzętu, trybu liczenia lub metryki przelicza też dawne treningi/)).toBeTruthy();
    expect(screen.getByText(/^Ostatnio /)).toBeTruthy(); expect(screen.getByLabelText('Przerwa robocza (s)').props.value).toBe('80'); /* „Zapamiętaj” z treningu */
    await back(); await swipeDelete(`Usuń z biblioteki: ${LR}`); expect(lastAlert()).toMatchObject({ title: 'Usunąć ćwiczenie?', msg: 'Zniknie z list i szablonów; historia, wykresy i eksport zostaną.' }); /* 07.10.2026 wieczór: z listy, przesunięciem */
    pressAlert('Usunąć ćwiczenie?', 'Usuń'); await flushAll(10);
    const lr = S().exercises.find(e => e.name === LR)!; expect(lr.archived).toBe(true); expect(store.visibleExercises().some(e => e.id === lr.id)).toBe(false);
    expect(S().workouts.some(w => w.exercises.some(e => e.exerciseId === lr.id))).toBe(true);
    /* historia i postępy dalej je znają */
    await go(`/history/${S().workouts.find(w => w.exercises.some(e => e.exerciseId === lr.id))!.id}`); await flushAll(10); expect(screen.getAllByText(LR).length).toBeGreaterThan(0);
    await go('/more/progress'); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj ćwiczenia…'), 'lateral raise (h'); expect(screen.getByText(`${LR} (usunięte)`)).toBeTruthy();
    /* w oknie wyboru i na liście: „Przywróć „…”” */
    await go('/exercises'); await flushAll(10); await type(screen.getByPlaceholderText('Szukaj…'), 'lateral raise (h');
    expect(screen.getByLabelText(`Przywróć „${LR}”, usunięte ćwiczenie z historią`)).toBeTruthy();
    await tap(screen.getByLabelText(`Przywróć „${LR}”, usunięte ćwiczenie z historią`)); await flushAll(10);
    expect(lr.archived).toBeUndefined(); /* restoreExercise (06.10) */ expect(screen.getByLabelText('Nazwa').props.value).toBe(LR); expect(store.visibleExercises().some(e => e.id === lr.id)).toBe(true);
  });

  test('10 backup: eksport JSON, CSV, import (anulowany, zły plik, nowszy schemat, poprawny) przywraca dane; kopia bezpieczeństwa przed importem', async () => {
    const write = FS.writeAsStringAsync as jest.Mock; const share = Sharing.shareAsync as jest.Mock; write.mockClear(); share.mockClear();
    await boot('/more'); await tap(screen.getByText('Backup (eksport / import)')); await flushAll(10);
    expect(screen.getByText(/^Kopia automatyczna: po każdym treningu plik JSON zapisuje się sam/)).toBeTruthy();
    await tap(screen.getByText('Eksportuj backup (plik JSON)')); await flushAll(10);
    const [jp, json] = write.mock.calls.at(-1)!; expect(jp).toMatch(/^file:\/\/\/cache\/trening-backup-\d{4}-\d{2}-\d{2}\.json$/); expect(share).toHaveBeenLastCalledWith(jp, expect.objectContaining({ mimeType: 'application/json' }));
    const env = JSON.parse(json); expect(env.format).toBe('trening-backup'); expect(env.schemaVersion).toBe(require('@/lib/seed').SCHEMA_VERSION);
    expect(env.state.workouts).toHaveLength(2); expect(env.state.templates.map((x: any) => x.name)).toEqual(['Push A']); expect(env.state.settings.locations).toHaveLength(4); expect(env.state.bands).toHaveLength(4);
    await tap(screen.getByText('Eksportuj historię do CSV')); await flushAll(10);
    const [cp, csv] = write.mock.calls.at(-1)!; expect(cp).toMatch(/\.csv$/); expect(csv.startsWith('﻿Date,Workout Name,Duration,Exercise Name,Set Order,Weight,Reps,Distance,Seconds,Notes,Workout Notes,RPE\n')).toBe(true);
    const rows = csv.trim().split('\n').slice(1); const nSets = S().workouts.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.length, 0), 0); expect(rows).toHaveLength(nSets);
    expect(rows.some((r: string) => r.includes('Bench Press (hantle),2,25,'))).toBe(true); expect(rows.some((r: string) => r.includes(',W,10,12,'))).toBe(true);
    expect(rows.some((r: string) => r.includes('chwyt nachwytem') && r.split(',')[4] === 'F')).toBe(true); /* LOG-14 (audyt 0.10): seria do upadku — „F” w Set Order, jak w Strongu */ expect(rows.some((r: string) => /guma (czerwona|zielona) \d/.test(r))).toBe(true);
    /* zmiana po eksporcie: usunięcie szablonu */
    await go('/templates'); await flushAll(10); await swipeDelete(`Usuń szablon: ${S().templates[0].name}`); pressAlert('Usunąć szablon?', 'Usuń'); await flushAll(10); expect(S().templates).toHaveLength(0);
    await go('/more/backup'); await flushAll(10);
    const doImport = async () => { await tap(screen.getByText('Importuj backup')); expect(lastAlert().title).toBe('Nadpisać dane?'); pressAlert('Nadpisać dane?', 'Importuj'); await flushAll(50); await act(async () => { await store.flush(); }); await flushAll(50); };
    /* „Nie” */
    await tap(screen.getByText('Importuj backup')); pressAlert('Nadpisać dane?', 'Nie'); expect(S().templates).toHaveLength(0);
    /* anulowany wybór pliku */
    await doImport(); expect(S().templates).toHaveLength(0); expect(global.__alerts.at(-1)!.title).toBe('Nadpisać dane?');
    /* zły plik */
    (DP.getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///x.json' }] })); (FS.readAsStringAsync as jest.Mock).mockImplementationOnce(async () => 'to nie jest json');
    await doImport(); expect(lastAlert().title).toBe('To nie wygląda na backup z tej apki'); expect(S().templates).toHaveLength(0);
    /* nowszy schemat */
    (DP.getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///x.json' }] })); (FS.readAsStringAsync as jest.Mock).mockImplementationOnce(async () => JSON.stringify({ ...env, schemaVersion: 999 }));
    await doImport(); expect(lastAlert().title).toBe('Backup z nowszej wersji aplikacji'); expect(S().templates).toHaveLength(0);
    /* poprawny plik: kopia bezpieczeństwa, potem dane z pliku */
    write.mockClear();
    (DP.getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///x.json' }] })); (FS.readAsStringAsync as jest.Mock).mockImplementationOnce(async () => json);
    await doImport(); expect(lastAlert().title).toBe('Zaimportowano');
    expect(write.mock.calls.some(([p]) => /\/Backup\/trening-przed-importem-\d{4}-\d{2}-\d{2}-\d{6}\.json$/.test(p))).toBe(true);
    const safety = JSON.parse(write.mock.calls.find(([p]) => /przed-importem/.test(p))![1]); expect(safety.state.templates).toHaveLength(0); /* kopia stanu sprzed importu */
    expect(S().templates.map(x => x.name)).toEqual(['Push A']); expect(S().workouts).toHaveLength(2); expect(S().settings.locations).toHaveLength(4);
    expect(S().settings).toMatchObject({ language: 'pl', unit: 'kg', defaultRest: 120, showRpe: true, mainLocationId: loc('Dom testowy').id });
    const strip = (x: any) => JSON.parse(JSON.stringify(x, (k, v) => (k === 'updatedAt' || k === 'metaUpdatedAt' || k === 'saveSeq' || k === 'userTouched' ? undefined : v)));
    expect(strip(S().workouts)).toEqual(strip(env.state.workouts)); expect(strip(S().templates)).toEqual(strip(env.state.templates)); expect(strip(S().exercises.filter(e => !e.lib))).toEqual(strip(env.state.exercises.filter((e: any) => !e.lib)));
  });

  test('10b restart po imporcie: dane z pliku zostały', async () => {
    await boot('/');
    expect(S().templates.map(x => x.name)).toEqual(['Push A']); expect(S().workouts).toHaveLength(2); expect(screen.getByLabelText('Start: Push A')).toBeTruthy();
    expect(screen.getByText('Powtórz ostatni (Push A — poprawione)')).toBeTruthy();
  });

  test('11 „Wyczyść wszystkie dane”: pytanie, kopia bezpieczeństwa, stan jak po instalacji; kopię da się zaimportować z powrotem', async () => {
    const write = FS.writeAsStringAsync as jest.Mock; write.mockClear();
    await boot('/more/settings');
    await tap(screen.getByText('Wyczyść wszystkie dane')); expect(lastAlert().title).toBe('Na pewno?');
    pressAlert('Na pewno?', 'Nie'); await flushAll(10); expect(S().workouts).toHaveLength(2);
    await tap(screen.getByText('Wyczyść wszystkie dane')); pressAlert('Na pewno?', 'Wyczyść'); await flushAll(50); await act(async () => { await store.flush(); }); await flushAll(10);
    const sp = write.mock.calls.find(([p]) => /\/Backup\/trening-przed-czyszczeniem-\d{4}-\d{2}-\d{2}-\d{6}\.json$/.test(p)); expect(sp).toBeTruthy();
    const safety = sp![1]; expect(JSON.parse(safety).state.workouts).toHaveLength(2);
    expect(S().workouts).toEqual([]); expect(S().templates).toEqual([]); expect(S().settings.locations).toEqual([]); expect(S().settings.mainLocationId).toBeNull();
    expect(S().settings).toMatchObject({ language: 'auto', unit: 'kg', defaultRest: 90, showRpe: false, theme: 'light' });
    expect(S().bands.map(b => b.level)).toEqual([2, 4, 6]); expect(S().exercises.some(e => e.name === 'Wiosło z ręcznikiem')).toBe(false);
    await go('/'); await flushAll(10); expect(screen.getByText(/^Pierwszy raz\? Utwórz swój szablon/)).toBeTruthy(); expect(screen.getByText('+ Nowy szablon')).toBeTruthy();
    /* restart po wyczyszczeniu — nadal pusto */
    await act(async () => { await store.flush(); }); carry = saved(); await boot('/');
    expect(S().workouts).toEqual([]); expect(S().templates).toEqual([]); expect(screen.getByText('Nie masz jeszcze szablonów — utwórz pierwszy albo zacznij pusty trening.')).toBeTruthy();
    /* kopia sprzed czyszczenia wraca importem */
    await go('/more/backup'); await flushAll(10);
    (DP.getDocumentAsync as jest.Mock).mockImplementationOnce(async () => ({ canceled: false, assets: [{ uri: 'file:///doc/Backup/x.json' }] })); (FS.readAsStringAsync as jest.Mock).mockImplementationOnce(async () => safety);
    await tap(screen.getByText('Importuj backup')); pressAlert('Nadpisać dane?', 'Importuj'); await flushAll(50); await act(async () => { await store.flush(); }); await flushAll(10);
    expect(lastAlert().title).toBe('Zaimportowano'); expect(S().workouts).toHaveLength(2); expect(S().templates.map(x => x.name)).toEqual(['Push A']); expect(S().settings.locations).toHaveLength(4);
    expect(S().exercises.some(e => e.name === 'Wiosło z ręcznikiem')).toBe(true);
  });
});
