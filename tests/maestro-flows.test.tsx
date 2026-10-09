/*
 * Scenariusze Maestro (.maestro/*.yaml) wykonywane w Jest na całej aplikacji (EN, region symulatora en-US) — przebieg E2E 89 (09.10.2026):
 * 12 z 16 scenariuszy padło na tekstach i etykietach zmienionych w fali 2 audytu 0.10, a każdy przebieg na symulatorze trwa ~40 min i pokazuje
 * tylko PIERWSZY nieaktualny krok. Ten interpreter przechodzi KAŻDY krok każdego scenariusza na drzewie dostępności z Jest, więc nieaktualny
 * selektor (tekst, etykieta VoiceOver, okno, jednostka z regionu) wychodzi lokalnie, zanim scenariusz trafi na symulator.
 *
 * Uproszczenia (nazwane): „widoczny” = jest w drzewie (bez sprawdzania, czy mieści się na ekranie — przewijanie jest no-op; dlatego element poza
 * krawędzią, jak piąty chip w 16 albo seria nad widokiem w 07, nie wychodzi tu — te przypadki: tests/maestro-selectors.test.ts); dopasowanie jak
 * w Maestro (Filters.textMatches, bez wielkości liter): wyrażenie regularne do CAŁEJ etykiety (accessibilityLabel), a bez niej do tekstu (Text bez
 * dostępnego przodka), wartości i placeholdera pola; ekrany pod spodem stosu (aria-hidden) niewidoczne; pasek nawigacji (w Jest się nie renderuje)
 * odtworzony z opcji ekranu: tytuł i „Back” na górze; `below`/`above` — kolejność w drzewie (pomijane przy otwartym oknie); czas: zegar Jest
 * przesuwany krokami. Okna (Alert, Alert.prompt, ActionSheetIOS) z mocków tests/setup.js. Gest przesunięcia w lewo = akcja dostępności „delete”.
 * Na scenariuszach z dfa7ab8 interpreter odtwarza 11 z 12 porażek przebiegu 89 w tym samym kroku (wyjątek: 16 — chip poza ekranem).
 */
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import * as store from '@/lib/store';
import { renderApp, flushAll, screen, act, fireEvent } from './app';
import { saved } from './helpers';

jest.setTimeout(240000);
const yaml = require('js-yaml');
const DIR = join(__dirname, '..', '.maestro');
/** Region symulatora w e2e-ios.yml (domyślny obraz iOS: en-US → lb, H4 audytu 0.10). */
export const SIM_TAG = 'en-US';

type Node = { type: unknown; props: Record<string, any>; parent: Node | null; children: (Node | string)[] };
type Sel = string | { text?: string; id?: string; index?: number; below?: Sel; above?: Sel; optional?: boolean; enabled?: boolean };
type Cand = { node?: Node; texts: string[]; id?: string; alertBtn?: () => void; sheetIdx?: number; header?: true };

/** Maestro (Filters.textMatches): wyrażenie regularne do całego tekstu albo dosłowna równość (np. „Finish workout?” bez \\?). */
const full = (re: string) => { let r: RegExp; try { r = new RegExp(`^(?:${re})$`, 'ism'); } catch { r = new RegExp(`^${re.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'ism'); } /* toRegexSafe: zły wzorzec — dosłownie */ return { test: (t: string) => [t, t.replace(/\n/g, ' ')].some(v => v === re || r.test(v)) }; }; /* Maestro (Orchestra REGEX_OPTIONS): IGNORE_CASE, DOT_MATCHES_ALL, MULTILINE; tekst także z \n → spacja */
const isHost = (n: Node) => typeof n.type === 'string';
const textOf = (n: Node | string): string => typeof n === 'string' ? n : (n.children ?? []).map(textOf).join('');
const accessibleAncestor = (n: Node) => { for (let p = n.parent; p; p = p.parent) if (isHost(p) && (p.props.accessible === true || (typeof p.props.accessibilityLabel === 'string' && p.props.accessible !== false))) return true; return false; };

class Runner {
  focused: Node | null = null; selectAll = false; alertSeen = 0; alertOpen: number | null = null; sheetSeen = 0; sheetOpen: number | null = null; log: string[] = [];
  constructor(public name: string) {}
  syncModals() {
    if (global.__alerts.length > this.alertSeen) { this.alertOpen = global.__alerts.length - 1; this.alertSeen = global.__alerts.length; }
    const sh = (global as any).__sheets as unknown[]; if (sh.length > this.sheetSeen) { this.sheetOpen = sh.length - 1; this.sheetSeen = sh.length; }
  }
  candidates(): Cand[] {
    this.syncModals(); const out: Cand[] = [];
    if (this.alertOpen != null) {
      const a = global.__alerts[this.alertOpen]; out.push({ texts: [a.title] }); if (a.msg) out.push({ texts: [a.msg] });
      const btns = a.buttons?.length ? a.buttons : [{ text: 'OK' }];
      for (const b of btns) out.push({ texts: [b.text], alertBtn: () => { this.alertOpen = null; b.onPress?.(a.prompt ? (this as any).promptVal ?? a.def ?? '' : undefined); } });
      return out; /* okno systemowe zasłania ekran — Maestro widzi tylko okno */
    }
    if (this.sheetOpen != null) {
      const s = (global as any).__sheets[this.sheetOpen]; if (s.opts.title) out.push({ texts: [s.opts.title] });
      s.opts.options.forEach((o: string, i: number) => out.push({ texts: [o], sheetIdx: i }));
      return out;
    }
    /* pasek nawigacji (w Jest się nie renderuje): tytuł ekranu i przycisk wstecz „Back” — na górze ekranu, więc przed treścią */
    const nav = require('expo-router/build/global-state/router-store').store.navigationRef; const o = nav?.getCurrentOptions?.() ?? {};
    if (typeof o.title === 'string' && o.title && o.headerShown !== false) out.push({ texts: [o.title], header: true });
    if (nav?.canGoBack?.() && o.headerBackVisible !== false && !o.headerLeft && o.headerShown !== false) out.push({ texts: [typeof o.headerBackTitle === 'string' ? o.headerBackTitle : 'Back'], header: true, alertBtn: () => { nav.goBack(); } });
    const all = (screen.UNSAFE_root as unknown as Node & { findAll: (f: (n: Node) => boolean) => Node[] }).findAll((n: Node) => isHost(n) && !hidden(n)); /* ekrany pod spodem stosu (aria-hidden) — Maestro ich nie widzi */
    for (const n of all) {
      const p = n.props; const texts: string[] = [];
      if (n.type === 'TextInput') { if (p.value != null && p.value !== '') texts.push(String(p.value)); else if (p.placeholder) texts.push(String(p.placeholder)); if (typeof p.accessibilityLabel === 'string') texts.push(p.accessibilityLabel); }
      else if (typeof p.accessibilityLabel === 'string' && p.accessibilityLabel !== '') texts.push(p.accessibilityLabel);
      else if (n.type === 'Text' && !accessibleAncestor(n)) { const t = textOf(n); if (t) texts.push(t); }
      else if (p.accessible === true) { const t = textOf(n); if (t) texts.push(t); }
      if (texts.length || p.testID) out.push({ node: n, texts, id: p.testID });
    }
    return out;
  }
  find(sel: Sel): Cand[] {
    const s = typeof sel === 'string' ? { text: sel } : sel; const cs = this.candidates();
    let hit = cs.filter(c => (s.text == null || c.texts.some(t => full(s.text!).test(t))) && (s.id == null || (c.id != null && full(s.id).test(c.id))));
    /* ten sam element natywny bywa w drzewie dwa razy (host i jego dziecko z tą samą etykietą) — zostaje pierwszy */
    hit = hit.filter(c => !c.node || !hit.some(d => d !== c && d.node && d.texts.join() === c.texts.join() && isDesc(c.node!, d.node)));
    const order = (c: Cand) => cs.indexOf(c);
    /* okno systemowe: Maestro widzi też ekran pod oknem, a kotwice `below`/`above` służą wtedy odróżnieniu przycisku okna od przycisku w tle
     * (07: „Discard workout”) — tu widać tylko okno, więc kotwice pomijamy */
    const modal = this.alertOpen != null || this.sheetOpen != null;
    if (s.below && !modal) { const a = this.find(s.below)[0]; hit = a ? hit.filter(c => order(c) > order(cs.find(x => x.node === a.node && x.texts.join() === a.texts.join()) ?? a)) : []; }
    if (s.above && !modal) { const a = this.find(s.above)[0]; hit = a ? hit.filter(c => order(c) < order(cs.find(x => x.node === a.node && x.texts.join() === a.texts.join()) ?? a)) : []; }
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
    if (n.type === 'TextInput') { if (this.focused && this.focused !== n) await this.blur(); this.focused = n; this.selectAll = !!n.props.selectTextOnFocus; await act(async () => { n.props.onFocus?.({ nativeEvent: {} }); }); await this.tick(); return; }
    if (this.focused) await this.blur();
    if (n.type === 'RCTSwitch' || n.props.onValueChange) { await act(async () => { fireEvent(n as any, 'valueChange', !n.props.value); }); await this.tick(); return; }
    await act(async () => { fireEvent.press(n as any); }); await this.tick(100);
  }
  async blur() { const f = this.focused; this.focused = null; if (!f) return; await act(async () => { f.props.onEndEditing?.({ nativeEvent: { text: f.props.value } }); f.props.onBlur?.({ nativeEvent: {} }); }); await this.tick(); }
  async run(cmds: any[], file: string) {
    for (const raw of cmds) { await this.step(raw, file); const d = process.env.MAESTRO_DUMP; if (d && this.log[this.log.length - 1].includes(d)) console.log(`${this.log[this.log.length - 1]}\n  ${this.candidates().map(c => c.texts.join(' | ')).join('\n  ')}`); }
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
          await renderApp({ locale: 'en', tag: SIM_TAG, saved: st }); await this.tick(100);
          this.focused = null; this.alertSeen = global.__alerts.length; this.alertOpen = null; this.sheetSeen = (global as any).__sheets.length; this.sheetOpen = null; break;
        }
        case 'stopApp': await act(async () => { await store.flush(); }); break;
        case 'tapOn': {
          const s = sel(arg); const opt = typeof arg === 'object' && arg.optional;
          if (!(await this.waitFor(s, true, opt ? 300 : 3000))) {
            if (opt) break; this.fail(step, 'Nie znaleziono elementu.');
          }
          await this.tap(this.find(s)[0]); break;
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
        case 'scrollUntilVisible': if (!(await this.waitFor(sel(arg), true, 3000))) this.fail(step, 'Nie znaleziono elementu (przewijanie).'); break;
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
function hidden(n: Node) { for (let p: Node | null = n; p; p = p.parent) if (isHost(p) && (p.props['aria-hidden'] === true || p.props.accessibilityElementsHidden === true)) return true; return false; }
function isDesc(n: Node, anc: Node) { for (let p = n.parent; p; p = p.parent) if (p === anc) return true; return false; }
function load(path: string): any[] { const docs = yaml.loadAll(readFileSync(path, 'utf8')); return docs[docs.length - 1] as any[]; }

const flows = readdirSync(DIR).filter(f => /^\d\d-.*\.yaml$/.test(f)).sort();
describe('scenariusze Maestro na drzewie dostępności (EN, en-US)', () => {
  test.each(flows)('%s', async f => { const r = new Runner(f); await r.run(load(join(DIR, f)), f); });
});
