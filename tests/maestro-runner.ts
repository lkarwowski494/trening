/*
 * Interpreter scenariuszy Maestro na drzewie dostępności z Jest (opis i uproszczenia: tests/maestro-flows.test.tsx; układ ekranu:
 * tests/maestro-layout.ts). Moduł wspólny dla przebiegu wszystkich scenariuszy (maestro-flows) i testów regresji przebiegów E2E (maestro-e2e91).
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as store from '@/lib/store';
import { renderApp, flushAll, screen, act, fireEvent } from './app';
import { saved } from './helpers';
import { layout, flat, SCREEN, type LNode, type Box } from './maestro-layout';

const yaml = require('js-yaml');
/** MAESTRO_DIR — inny katalog scenariuszy (np. stara wersja z gita, żeby sprawdzić, że interpreter odtwarza porażki przebiegu). */
export const DIR = process.env.MAESTRO_DIR ?? join(__dirname, '..', '.maestro');
/** Region symulatora w e2e-ios.yml (domyślny obraz iOS: en-US → lb, H4 audytu 0.10). */
export const SIM_TAG = 'en-US';
/** Zgoda na powiadomienia na świeżym symulatorze (E2E 91: okno „Reminder for planned workouts” po pierwszym dniu planu w 13). */
export const SIM_NOTIF_PERM = { granted: false, canAskAgain: true, status: 'undetermined' } as const;

type Node = { type: unknown; props: Record<string, any>; parent: Node | null; children: (Node | string)[] };
type Sel = string | { text?: string; id?: string; index?: number; below?: Sel; above?: Sel; leftOf?: Sel; rightOf?: Sel; optional?: boolean; enabled?: boolean };
/** Klucze selektora obsługiwane przez interpreter — inny klucz to błąd (E2E 91: nieobsłużony `leftOf` przechodził tu po cichu). */
const SEL_KEYS = new Set(['text', 'id', 'index', 'below', 'above', 'leftOf', 'rightOf', 'optional', 'enabled', 'centerElement', 'direction', 'timeout', 'element', 'visible', 'notVisible', 'speed', 'visibilityPercentage', 'retryTapIfNoChange', 'waitToSettleTimeoutMs']);
type Cand = { node?: Node; texts: string[]; id?: string; alertBtn?: () => void; sheetIdx?: number; header?: true };

/** Maestro (Filters.textMatches): wyrażenie regularne do całego tekstu albo dosłowna równość (np. „Finish workout?” bez \\?). */
/* Maestro (Orchestra REGEX_OPTIONS): IGNORE_CASE, DOT_MATCHES_ALL, MULTILINE; tekst także z \n → spacja. Kotliński Regex.matches() wymaga dopasowania
 * CAŁEGO tekstu niezależnie od MULTILINE — kotwice (?<![\s\S]) i (?![\s\S]) to początek i koniec całego tekstu, bo `^`/`$` z flagą m pasują też
 * na granicach linii (run 37900617167, 15: „Permission is hereby granted.*” przechodził tu na treści „MIT License\n\nPermission…”, a na symulatorze nie). */
export const full = (re: string) => { let r: RegExp; try { r = new RegExp(`(?<![\\s\\S])(?:${re})(?![\\s\\S])`, 'ism'); } catch { r = new RegExp(`(?<![\\s\\S])${re.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\s\\S])`, 'ism'); } /* toRegexSafe: zły wzorzec — dosłownie */ return { test: (t: string) => [t, t.replace(/\n/g, ' ')].some(v => v === re || r.test(v)) }; };
const isHost = (n: Node) => typeof n.type === 'string';
const textOf = (n: Node | string): string => typeof n === 'string' ? n : (n.children ?? []).map(textOf).join('');
const accessibleAncestor = (n: Node) => { for (let p = n.parent; p; p = p.parent) if (isHost(p) && (p.props.accessible === true || (typeof p.props.accessibilityLabel === 'string' && p.props.accessible !== false))) return true; return false; };

export class Runner {
  /** E2E 91: przewinięcie list (klucz: natywny element listy — nowy po ponownym zamontowaniu, jak w aplikacji) — przybliżony układ z tests/maestro-layout.ts */
  scrollY = new WeakMap<object, number>(); boxes: Map<LNode, Box> = new Map();
  hasTabs = false;
  relayout() { this.boxes = layout(screen.UNSAFE_root as unknown as LNode); this.hasTabs = this.candidates(true).some(c => c.texts.some(t => /, tab, \d+ of \d+$/.test(t))); return this.boxes; }
  nav() { return require('expo-router/build/global-state/router-store').store.navigationRef; }
  headerTop() { const o = this.nav()?.getCurrentOptions?.() ?? {}; return SCREEN.top + (o.headerShown === false ? 0 : SCREEN.header) + (/modal|sheet/i.test(String(o.presentation ?? '')) ? SCREEN.modal : 0); }
  tabs() { return this.hasTabs; } /* pasek zakładek na ekranie (liczony przy relayout) */
  scrollKey(sc: LNode): object { return (sc as any)._fiber?.stateNode ?? sc; } /* host instance z react-test-renderer: stały przez życie komponentu */
  /** Pozycja na ekranie (pt) — y treści listy minus przewinięcie plus górna krawędź listy. */
  screenBox(n: LNode, fresh = true): { x: number; y: number; w: number; h: number; sc: LNode | null } | null {
    const B = fresh ? this.relayout() : this.boxes; const b = B.get(n); if (!b) return null;
    let x = b.x; if (b.horiz) { const hb = this.screenBox(b.horiz, false); if (hb) x += hb.x; }
    if (!b.scroll) return { x, y: b.y + this.headerTop(), w: b.w, h: b.h, sc: null };
    const top = this.vpTop(b.scroll); return { x, y: top + b.y - this.curScroll(b.scroll, top), w: b.w, h: b.h, sc: b.scroll };
  }
  /** Przewinięcie listy przycięte do treści (treść skróciła się — lista wraca, jak w UIScrollView). */
  maxScroll(sc: LNode, top: number) { return Math.max(0, (this.boxes.get(sc)?.h ?? 0) - (this.vpBottom() - top)); }
  curScroll(sc: LNode, top: number) { return Math.min(this.scrollY.get(this.scrollKey(sc)) ?? 0, this.maxScroll(sc, top)); }
  /** Dolna krawędź obszaru listy (pasek zakładek albo wskaźnik home). */
  /** Fokus pola w liście z automaticallyAdjustKeyboardInsets: lista przesuwa pole nad klawiaturę. */
  kbScroll(n: Node) {
    const b = this.screenBox(n as unknown as LNode); if (!b?.sc || !b.sc.props.automaticallyAdjustKeyboardInsets || b.y + b.h <= SCREEN.kbTop) return;
    const top = this.vpTop(b.sc); this.scrollY.set(this.scrollKey(b.sc), this.curScroll(b.sc, top) + b.y + b.h - SCREEN.kbTop); /* inset klawiatury pozwala przewinąć poza koniec treści */
  }
  vpBottom() { return this.tabs() ? SCREEN.tabTop : SCREEN.bottom; }
  onScreen(c: Cand): boolean {
    if (!c.node) return true; const b = this.screenBox(c.node as unknown as LNode, false); if (!b || !b.sc) return true;
    /* widoczny pas elementu (pionowo: od górnej krawędzi listy do dołu ekranu) co najmniej połowa wysokości, najwyżej SCREEN.minVis pt —
     * z luzem SCREEN.peek na błąd szacunku; poziomo — środek w ekranie z luzem SCREEN.slack (chipy w poziomym pasku, E2E 89: 16) */
    const top = this.vpTop(b.sc); const vis = Math.min(b.y + b.h, SCREEN.h) - Math.max(b.y, top);
    return vis >= Math.min(b.h / 2, SCREEN.minVis) - SCREEN.peek && b.x + b.w / 2 < SCREEN.w + SCREEN.slack && b.x + b.w / 2 > -SCREEN.slack;
  }
  /** Stuknięcie: środek elementu w obszarze listy (nie pod paskiem zakładek ani pod klawiaturą, nie poza krawędzią w poziomie). */
  tapProblem(c: Cand): string | null {
    if (!c.node) return null; const b = this.screenBox(c.node as unknown as LNode); if (!b || !b.sc) return null;
    const top = this.vpTop(b.sc), cy = b.y + b.h / 2, cx = b.x + b.w / 2;
    if (cy < top - SCREEN.slack) return `nad widokiem listy (y≈${Math.round(cy)}, lista od ${Math.round(top)})`;
    /* pasek zakładek: luz SCREEN.tabSlack zamiast SCREEN.slack — run 37900617167 (13): „Close” szacowany 20 pt w pasku (środek 811, pasek od 791)
     * na symulatorze trafił w zakładkę „Exercises”; luz 24 pt go przepuszczał */
    if (cy > this.vpBottom() + (this.tabs() ? SCREEN.tabSlack : SCREEN.slack)) return `pod widokiem listy (y≈${Math.round(cy)}, lista do ${this.vpBottom()})`;
    if (cx > SCREEN.w || cx < 0) return `poza ekranem w poziomie (środek x≈${Math.round(cx)}, ekran ${SCREEN.w}) — Maestro stuka w środek elementu`; /* E2E 89 (16) */
    /* klawiatura: po fokusie lista przewija pole nad klawiaturę (automaticallyAdjustKeyboardInsets — kbScroll); element niżej jest pod klawiaturą
     * (run 37611882320: tap w pole powtórzeń trafił w klawisz „3”). Sąsiednie pole w tym samym wierszu jest nad klawiaturą — 08 („reps to”)
     * przechodzi na symulatorze, a 11 (E2E 91) nie, więc tamtego przypadku interpreter nie rozstrzyga (test w maestro-selectors). */
    if (this.focused && c.node !== this.focused && cy > SCREEN.kbTop) return `pod klawiaturą (y≈${Math.round(cy)}, klawiatura od ${SCREEN.kbTop}) — najpierw schowaj klawiaturę`;
    return null;
  }
  /** Przewija listę elementu tak, by był widoczny (Maestro: przesuwa, aż element jest cały na ekranie; centerElement — na środek). */
  scrollTo(c: Cand, dir: string, center: boolean): string | null {
    if (!c.node) return null; const b = this.screenBox(c.node as unknown as LNode); if (!b || !b.sc) return null;
    const key = this.scrollKey(b.sc); const top = this.vpTop(b.sc); const cur = this.curScroll(b.sc, top); const H = this.vpBottom() - top;
    const yIn = b.y - top + cur; const max = this.maxScroll(b.sc, top);
    const want = center ? yIn + b.h / 2 - H / 2 : b.y < top ? yIn : b.y + b.h > top + H ? yIn + b.h - H : cur;
    const next = Math.min(max, Math.max(0, want));
    if (/down/i.test(dir) && next < cur - SCREEN.slack && !this.onScreen(c)) return `element nad widokiem — przewijanie w dół go nie pokaże (direction: UP)`;
    if (/up/i.test(dir) && next > cur + SCREEN.slack && !this.onScreen(c)) return `element pod widokiem — przewijanie w górę go nie pokaże (direction: DOWN)`;
    /* Maestro najpierw sprawdza widoczność (visibilityPercentage 100) — cały widoczny element nie przewija listy, także z centerElement */
    if (b.y + b.h > top + H || b.y < top) this.scrollY.set(key, next);
    return null;
  }
  vpTop(sc: LNode): number { const sb = this.screenBox(sc, false); return sb ? sb.y : this.headerTop(); }
  focused: Node | null = null; selectAll = false; alertSeen = 0; alertOpen: number | null = null; /** X-11: okna systemowe jak na iOS — nowsze nad starszym, po zamknięciu wierzchniego widać poprzednie */ alertStack: number[] = []; sheetSeen = 0; sheetOpen: number | null = null; log: string[] = [];
  constructor(public name: string) {}
  syncModals() {
    if (global.__alerts.length > this.alertSeen) { for (let i = this.alertSeen; i < global.__alerts.length; i++) this.alertStack.push(i); this.alertOpen = global.__alerts.length - 1; this.alertSeen = global.__alerts.length; }
    const sh = (global as any).__sheets as unknown[]; if (sh.length > this.sheetSeen) { this.sheetOpen = sh.length - 1; this.sheetSeen = sh.length; }
  }
  candidates(_noLayout = false): Cand[] {
    this.syncModals(); const out: Cand[] = [];
    if (this.alertOpen != null) return this.alertCands().map(x => x.c); /* okno systemowe zasłania ekran — stuknięcie trafia tylko w okno */
    if (this.sheetOpen != null) {
      const s = (global as any).__sheets[this.sheetOpen]; if (s.opts.title) out.push({ texts: [s.opts.title] });
      s.opts.options.forEach((o: string, i: number) => out.push({ texts: [o], sheetIdx: i }));
      return out;
    }
    return this.screenCands();
  }
  /**
   * Okno Alert w układzie iOS 26 (iPhone 17): wyśrodkowane w pionie, tytuł, opis, przyciski jeden pod drugim — przycisk ze stylem 'cancel' na DOLE,
   * niezależnie od kolejności w tablicy (run 37900617167, 07: „Back” z 'cancel' od fali 2 jest pod „Discard workout”; zrzut: tytuł y≈378,
   * „Discard workout” ≈460, „Back” ≈517). Uproszczenie: zawsze w pionie (dwa krótkie przyciski iOS bywa stawia obok siebie — w scenariuszach nie występuje).
   */
  alertCands(): { c: Cand; y: number }[] {
    const a = global.__alerts[this.alertOpen!]; const W = 270 - 32; const lines = (s: string, fs: number) => Math.max(1, Math.ceil(s.length * fs * SCREEN.charEm / W));
    const btns0: any[] = a.buttons?.length ? a.buttons : [{ text: 'OK' }]; const btns = [...btns0.filter(b => b.style !== 'cancel'), ...btns0.filter(b => b.style === 'cancel')];
    const tH = 22 * lines(String(a.title ?? ''), 17), mH = a.msg ? 4 + 18 * lines(String(a.msg), 13) : 0;
    const H = 20 + tH + mH + 16 + btns.length * 56 - 8 + 16; let y = (SCREEN.h - H) / 2 + 20;
    const out: { c: Cand; y: number }[] = [{ c: { texts: [a.title] }, y: y + tH / 2 }]; y += tH;
    if (a.msg) { out.push({ c: { texts: [a.msg] }, y: y + mH / 2 }); y += mH; } y += 16;
    for (const b of btns) { out.push({ c: { texts: [b.text], alertBtn: () => { this.alertStack.pop(); this.alertOpen = this.alertStack.length ? this.alertStack[this.alertStack.length - 1] : null; b.onPress?.(a.prompt ? (this as any).promptVal ?? a.def ?? '' : undefined); } }, y: y + 24 }); y += 56; }
    return out;
  }
  /** Kotwica `below`/`above` przy otwartym oknie: Maestro widzi okno i ekran pod nim; warunek spełnia KTÓRYKOLWIEK pasujący element (Filters.below/above). */
  alertAnchorY(sel: Sel): number[] {
    const s = typeof sel === 'string' ? { text: sel } : sel; const m = (c: Cand) => (s.text == null || c.texts.some(t => full(s.text!).test(t))) && (s.id == null || (c.id != null && full(s.id).test(c.id)));
    const ys = this.alertCands().filter(x => m(x.c)).map(x => x.y);
    this.relayout(); for (const c of this.screenCands()) if (m(c) && this.onScreen(c)) { const b = c.node ? this.screenBox(c.node as unknown as LNode, false) : null; ys.push(b ? b.y + b.h / 2 : SCREEN.top + 22); }
    return ys;
  }
  screenCands(): Cand[] {
    const out: Cand[] = [];
    /* pasek nawigacji (w Jest się nie renderuje): tytuł ekranu i przycisk wstecz „Back” — na górze ekranu, więc przed treścią */
    const nav = require('expo-router/build/global-state/router-store').store.navigationRef; const o = nav?.getCurrentOptions?.() ?? {};
    if (typeof o.title === 'string' && o.title && o.headerShown !== false) out.push({ texts: [o.title], header: true });
    if (nav?.canGoBack?.() && o.headerBackVisible !== false && !o.headerLeft && o.headerShown !== false) out.push({ texts: [typeof o.headerBackTitle === 'string' ? o.headerBackTitle : 'Back'], header: true, alertBtn: () => { nav.goBack(); } });
    const all = (screen.UNSAFE_root as unknown as Node & { findAll: (f: (n: Node) => boolean) => Node[] }).findAll((n: Node) => isHost(n) && !hidden(n)); /* ekrany pod spodem stosu (aria-hidden) — Maestro ich nie widzi */
    for (const n of all) {
      const p = n.props; const texts: string[] = [];
      if (n.type === 'TextInput') { if (p.value != null && p.value !== '') texts.push(String(p.value)); else if (p.placeholder) texts.push(String(p.placeholder)); if (typeof p.accessibilityLabel === 'string') texts.push(p.accessibilityLabel); }
      else if (typeof p.accessibilityLabel === 'string' && p.accessibilityLabel !== '') { if (!inA11yElement(n)) texts.push(p.accessibilityLabel); } /* E2E 91: element z etykietą wewnątrz elementu dostępności (np. kafelek „Workouts: …” w przycisku „Postępy”) nie jest osobnym elementem — iOS czyta etykietę rodzica */
      else if (n.type === 'Text' && !accessibleAncestor(n)) { const t = textOf(n); if (t) texts.push(t); }
      else if (p.accessible === true) { const t = textOf(n); if (t) texts.push(t); }
      if (texts.length || p.testID) out.push({ node: n, texts, id: p.testID });
    }
    return out;
  }
  find(sel: Sel, offscreen = false): Cand[] {
    const s = typeof sel === 'string' ? { text: sel } : sel; const cs0 = this.candidates();
    /* E2E 91: Maestro widzi tylko elementy na ekranie (choćby częściowo) — przybliżony układ, z marginesem SCREEN.slack na błąd szacunku */
    if (!offscreen) this.relayout(); const cs = offscreen ? cs0 : cs0.filter(c => this.onScreen(c));
    for (const k of Object.keys(s)) if (!SEL_KEYS.has(k)) throw new Error(`[${this.name}] nieobsługiwany klucz selektora „${k}” — dopisz go do interpretera`);
    let hit = cs.filter(c => (s.text == null || c.texts.some(t => full(s.text!).test(t))) && (s.id == null || (c.id != null && full(s.id).test(c.id))));
    /* ten sam element natywny bywa w drzewie dwa razy (host i jego dziecko z tą samą etykietą) — zostaje pierwszy */
    hit = hit.filter(c => !c.node || !hit.some(d => d !== c && d.node && d.texts.join() === c.texts.join() && isDesc(c.node!, d.node)));
    const order = (c: Cand) => cs.indexOf(c);
    /* okno systemowe: Maestro widzi też ekran pod oknem, a kotwice `below`/`above` służą wtedy odróżnieniu przycisku okna od przycisku w tle
     * (07: „Discard workout”) — porównanie pozycji w pionie z układem okna (alertCands) i ekranu pod nim; arkusz akcji — kotwice pomijane */
    if (this.alertOpen != null && (s.below || s.above)) {
      const pos = new Map(this.alertCands().map(x => [x.c.texts.join(), x.y] as const)); const yOf = (c: Cand) => pos.get(c.texts.join()) ?? 0;
      if (s.below) { const ys = this.alertAnchorY(s.below); hit = hit.filter(c => ys.some(y => yOf(c) > y)); }
      if (s.above) { const ys = this.alertAnchorY(s.above); hit = hit.filter(c => ys.some(y => yOf(c) < y)); }
    }
    const modal = this.alertOpen != null || this.sheetOpen != null;
    if (s.below && !modal) { const a = this.find(s.below)[0]; hit = a ? hit.filter(c => order(c) > order(cs.find(x => x.node === a.node && x.texts.join() === a.texts.join()) ?? a)) : []; }
    if (s.above && !modal) { const a = this.find(s.above)[0]; hit = a ? hit.filter(c => order(c) < order(cs.find(x => x.node === a.node && x.texts.join() === a.texts.join()) ?? a)) : []; }
    /* leftOf/rightOf (E2E 91, 10): ten sam wiersz — najbliższy wspólny przodek układa dzieci w poziomie (flexDirection row), kolejność w drzewie */
    for (const [key, before] of [['leftOf', true], ['rightOf', false]] as const) {
      const anc = s[key]; if (anc == null || modal) continue; const a = this.find(anc)[0];
      hit = a?.node ? hit.filter(c => c.node && c.node !== a.node && sameRow(c.node, a.node!) && (order(c) < order(cs.find(x => x.node === a.node) ?? a)) === before) : [];
    }
    if (s.index != null) hit = hit[s.index] ? [hit[s.index]] : [];
    return hit;
  }
  async tick(ms = 50) { await flushAll(ms); }
  async waitFor(sel: Sel, visible: boolean, ms = 3000): Promise<boolean> {
    for (let t = 0; t <= ms; t += 100) { if ((this.find(sel).length > 0) === visible) return true; await this.tick(100); }
    return false;
  }
  fail(step: string, why: string): never {
    const vis = this.candidates().flatMap(c => c.texts).filter(Boolean).slice(0, 400);
    throw new Error(`[${this.name}] krok: ${step}\n${why}\nNa ekranie:\n  ${vis.join('\n  ')}`);
  }
  async tap(c: Cand) {
    if (c.alertBtn) { await act(async () => { c.alertBtn!(); }); await this.tick(); return; }
    if (c.header) { await this.tick(); return; } /* tytuł paska nawigacji — stuknięcie nic nie robi */
    if (c.sheetIdx != null) { const s = (global as any).__sheets[this.sheetOpen!]; this.sheetOpen = null; await act(async () => { s.cb(c.sheetIdx); }); await this.tick(); return; }
    const n = c.node!;
    if (n.type === 'TextInput') { if (this.focused && this.focused !== n) await this.blur(); this.focused = n; this.kbScroll(n); this.selectAll = !!n.props.selectTextOnFocus; await act(async () => { n.props.onFocus?.({ nativeEvent: {} }); }); await this.tick(); return; }
    if (this.focused) await this.blur();
    if (n.type === 'RCTSwitch' || n.props.onValueChange) { await act(async () => { fireEvent(n as any, 'valueChange', !n.props.value); }); await this.tick(); return; }
    await act(async () => { fireEvent.press(n as any); }); await this.tick(100);
  }
  async blur() { const f = this.focused; this.focused = null; if (!f) return; await act(async () => { f.props.onEndEditing?.({ nativeEvent: { text: f.props.value } }); f.props.onBlur?.({ nativeEvent: {} }); }); await this.tick(); }
  async run(cmds: any[], file: string) {
    for (const raw of cmds) { await this.step(raw, file); const d = process.env.MAESTRO_DUMP; if (d && this.log[this.log.length - 1].includes(d)) console.log(`${this.log[this.log.length - 1]}\n  ${this.candidates().map(c => { const b = c.node ? this.screenBox(c.node) : null; return (b ? `[${Math.round(b.x)},${Math.round(b.y)}][${Math.round(b.x + b.w)},${Math.round(b.y + b.h)}] ` : '') + c.texts.join(' | ') + (c.id ? ` #${c.id}` : ''); }).join('\n  ')}`); }
  }
  async step(raw: any, file: string) {
    {
      const [cmd, arg] = typeof raw === 'string' ? [raw, undefined] : Object.entries(raw)[0] as [string, any];
      const step = `${file}: ${cmd} ${JSON.stringify(arg) ?? ''}`; this.log.push(step);
      const sel = (a: any): Sel => typeof a === 'string' ? a : (a.element ?? a.visible ?? a.notVisible ?? a);
      switch (cmd) {
        case 'launchApp': {
          const clear = arg?.clearState !== false; let st: unknown;
          if (!clear) { await act(async () => { await store.flush(); }); st = JSON.parse(JSON.stringify(saved())); }
          /* E2E 91: na symulatorze zgoda na powiadomienia jest nieustalona (`permissions: all: allow` jej nie obejmuje) — okno I1 przy pierwszym dniu planu */
          if (clear) (global as any).__notifPerm = { ...SIM_NOTIF_PERM };
          await renderApp({ locale: 'en', tag: SIM_TAG, saved: st }); await this.tick(100);
          this.focused = null; this.scrollY = new WeakMap(); this.alertSeen = global.__alerts.length; this.alertOpen = null; this.alertStack = []; this.sheetSeen = (global as any).__sheets.length; this.sheetOpen = null; break;
        }
        case 'stopApp': await act(async () => { await store.flush(); }); break;
        case 'tapOn': {
          const s = sel(arg); const opt = typeof arg === 'object' && arg.optional;
          if (!(await this.waitFor(s, true, opt ? 300 : 3000))) {
            if (opt) break; this.fail(step, 'Nie znaleziono elementu.');
          }
          const target = this.find(s)[0]; const why = this.tapProblem(target); if (why) this.fail(step, `Element ${why}.`);
          await this.tap(target); break;
        }
        case 'inputText': {
          this.syncModals();
          if (this.alertOpen != null && global.__alerts[this.alertOpen].prompt) { (this as any).promptVal = String(arg); break; }
          const f = this.focused; if (!f) this.fail(step, 'Brak pola z fokusem.');
          const cur = this.selectAll ? '' : String(f!.props.value ?? ''); this.selectAll = false;
          await act(async () => { fireEvent.changeText(f as any, cur + String(arg)); }); await this.tick(); break;
        }
        case 'eraseText': {
          const f = this.focused; if (!f) this.fail(step, 'Brak pola z fokusem.'); const n = typeof arg === 'number' ? arg : 50;
          const cur = String(f!.props.value ?? ''); this.selectAll = false; await act(async () => { fireEvent.changeText(f as any, cur.slice(0, Math.max(0, cur.length - n))); }); await this.tick(); break;
        }
        case 'pressKey': { const f = this.focused; if (f && /enter/i.test(String(arg))) { await act(async () => { f.props.onSubmitEditing?.({ nativeEvent: { text: f.props.value } }); }); await this.blur(); } break; }
        case 'hideKeyboard': await this.blur(); break;
        case 'extendedWaitUntil': {
          const vis = arg.visible != null; const s = sel(arg);
          if (!(await this.waitFor(s, vis, Math.min(Number(arg.timeout ?? 3000), 3000)))) this.fail(step, vis ? 'Element nie pojawił się.' : 'Element nie zniknął.');
          break;
        }
        case 'assertVisible': if (!(await this.waitFor(sel(arg), true, 1500))) this.fail(step, 'Element niewidoczny.'); break;
        case 'assertNotVisible': if (!(await this.waitFor(sel(arg), false, 1500))) this.fail(step, 'Element widoczny.'); break;
        case 'scrollUntilVisible': {
          const s = sel(arg); let c: Cand | undefined;
          for (let t = 0; t <= 3000 && !(c = this.find(s, true)[0]); t += 100) await this.tick(100);
          if (!c) this.fail(step, 'Nie znaleziono elementu (przewijanie).');
          const why = this.scrollTo(c!, String(arg.direction ?? 'DOWN'), !!arg.centerElement); if (why) this.fail(step, why); break;
        }
        case 'swipe': {
          const id = arg.from?.id; if (!id || !/LEFT/i.test(arg.direction)) break;
          const c = this.find({ id })[0]; if (!c?.node) this.fail(step, 'Brak wiersza do przesunięcia.');
          let n: Node | null = c!.node!; const hasDel = (x: Node) => Array.isArray(x.props.accessibilityActions) && x.props.accessibilityActions.some((a: any) => a.name === 'delete') && typeof x.props.onAccessibilityAction === 'function';
          let target: Node | null = null; for (let p: Node | null = n; p && !target; p = p.parent) if (hasDel(p)) target = p;
          if (!target) { const sub = (c!.node as any).findAll((x: Node) => hasDel(x)); target = sub[0] ?? null; }
          if (!target) this.fail(step, 'Wiersz bez akcji usuwania.');
          await act(async () => { target!.props.onAccessibilityAction({ nativeEvent: { actionName: 'delete' } }); }); await this.tick(); n = null; break;
        }
        case 'runFlow': {
          if (typeof arg === 'string') { await this.run(load(join(DIR, arg)), arg); break; }
          if (arg.when) { const w = arg.when; const ok = w.visible != null ? this.find(sel(w.visible)).length > 0 : w.notVisible != null ? this.find(sel(w.notVisible)).length === 0 : true; if (!ok) break; }
          if (arg.file) await this.run(load(join(DIR, arg.file)), arg.file); else await this.run(arg.commands, file); break;
        }
        case 'copyTextFrom': if (!(await this.waitFor(sel(arg), true))) this.fail(step, 'Brak elementu do skopiowania.'); break;
        case 'takeScreenshot': case 'evalScript': case 'assertTrue': break; /* MAESTRO_DUMP=<fragment kroku> — wypisuje drzewo po tym kroku */
        default: this.fail(step, `Nieobsługiwane polecenie ${cmd}.`);
      }
    }
  }
}
/** Przodek będący elementem dostępności (accessible: true — np. Pressable): iOS nie pokazuje jego potomków osobno (E2E 91, kafelki tygodnia w 01). */
function inA11yElement(n: Node) { for (let p = n.parent; p; p = p.parent) if (isHost(p) && p.props.accessible === true) return true; return false; }
/** Dwa elementy w jednym wierszu: najbliższy wspólny przodek-host ma flexDirection: 'row' (np. wiersz serii: pola, guma, ✓). */
function sameRow(a: Node, b: Node) {
  const up = new Set<Node>(); for (let p: Node | null = a.parent; p; p = p.parent) up.add(p);
  for (let p: Node | null = b.parent; p; p = p.parent) if (up.has(p) && isHost(p)) return flat(p.props.style).flexDirection === 'row';
  return false;
}
function hidden(n: Node) { for (let p: Node | null = n; p; p = p.parent) if (isHost(p) && (p.props['aria-hidden'] === true || p.props.accessibilityElementsHidden === true)) return true; return false; }
function isDesc(n: Node, anc: Node) { for (let p = n.parent; p; p = p.parent) if (p === anc) return true; return false; }
export function load(path: string): any[] { const docs = yaml.loadAll(readFileSync(path, 'utf8')); return docs[docs.length - 1] as any[]; }

