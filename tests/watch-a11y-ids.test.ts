/* Apple Watch: identyfikatory dostępności, po których testy XCUITest znajdują elementy (przebieg watch-sim 38524267103: brak watch.timer).
 * Powód: .accessibilityElement(children: .combine) scala dzieci w jeden element i identyfikator dziecka ginie — musi stać na elemencie scalonym.
 * Na Linuksie bez kompilatora Swift pilnujemy tego statycznie. */
import * as fs from 'fs';
import * as path from 'path';

const root = path.join(__dirname, '..', 'targets');
const view = fs.readFileSync(path.join(root, 'watch-app', 'RootView.swift'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'watch-ui-tests', 'WatchUITests.swift'), 'utf8');

describe('identyfikatory dostępności zegarka', () => {
  test('watch.timer stoi na elemencie scalonym (po .accessibilityElement(children: .combine)), nie na dziecku', () => {
    expect(view).toMatch(/\.accessibilityElement\(children: \.combine\)\s*\n\s*\.accessibilityIdentifier\("watch\.timer"\)/);
    expect(view.match(/accessibilityIdentifier\("watch\.timer"\)/g)).toHaveLength(1);
  });
  test('każdy identyfikator używany w XCUITest istnieje w widokach zegarka (poza licznikami Debug)', () => {
    const used = new Set([...ui.matchAll(/"(watch\.[a-zA-Z.]+)"/g)].map(m => m[1]));
    const all = fs.readdirSync(path.join(root, 'watch-app')).filter(f => f.endsWith('.swift')).map(f => fs.readFileSync(path.join(root, 'watch-app', f), 'utf8')).join('\n');
    const missing = [...used].filter(id => !all.includes(`"${id}"`));
    expect(missing).toEqual([]);
  });
});
