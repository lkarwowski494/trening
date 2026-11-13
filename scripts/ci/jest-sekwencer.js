// Sekwencer Jest dla podziału na części (--shard=i/N w tests.yml): zamiast domyślnego podziału po skrócie sha1 ścieżki (losowego — pomiar 10.11.2026:
// części 903 s i 2929 s przy tej samej liczbie plików, część 3 ucinana limitem 20 min) rozdziela pliki zachłannie po zmierzonym czasie (najdłuższy plik
// do najmniej obciążonej części). Czasy: scripts/ci/czasy-plikow.json (jedno miejsce); wynik deterministyczny, każdy plik trafia do dokładnie jednej części.
const Sequencer = require('@jest/test-sequencer').default;
const fs = require('fs');
const path = require('path');

const PLIK = path.join(__dirname, 'czasy-plikow.json');
const wczytaj = () => JSON.parse(fs.readFileSync(PLIK, 'utf8'));

/** Przydział: { sciezka: numer części (1..N) }; koszty = czas z pomiaru albo domyslny_s. */
function przydziel(sciezki, liczbaCzesci, czasy = wczytaj()) {
  const koszt = s => czasy.pliki[s] ?? czasy.domyslny_s;
  const posortowane = [...sciezki].sort((a, b) => koszt(b) - koszt(a) || (a < b ? -1 : 1));
  const sumy = Array(liczbaCzesci).fill(0);
  const wynik = {};
  // Rodziny „jeden plik na część” (czasy-plikow.json → rodziny_pamieciozerne, 13.11.2026): plik rodziny trafia do części z najmniejszą liczbą plików tej rodziny
  // (przy równej — do najmniej obciążonej), więc dwa pamięciożerne pliki nie biegną razem w dwóch procesach roboczych Jest na maszynie 3-rdzeniowej.
  const rodziny = (czasy.rodziny_pamieciozerne ?? []).map(w => new RegExp(w));
  const wRodzinie = rodziny.map(() => Array(liczbaCzesci).fill(0));
  for (const s of posortowane) {
    const r = rodziny.findIndex(re => re.test(s));
    let kandydaci = sumy.map((_, i) => i);
    if (r >= 0) { const min = Math.min(...wRodzinie[r]); kandydaci = kandydaci.filter(i => wRodzinie[r][i] === min); }
    const i = kandydaci.reduce((a, b) => (sumy[b] < sumy[a] ? b : a));
    sumy[i] += koszt(s); wynik[s] = i + 1;
    if (r >= 0) wRodzinie[r][i] += 1;
  }
  return { wynik, sumy };
}

class SekwencerCzesci extends Sequencer {
  shard(tests, { shardIndex, shardCount }) {
    const rel = t => path.posix.relative(t.context.config.rootDir.split(path.sep).join('/'), t.path.split(path.sep).join('/'));
    const { wynik } = przydziel(tests.map(rel), shardCount);
    return tests.filter(t => wynik[rel(t)] === shardIndex);
  }
}

module.exports = SekwencerCzesci;
module.exports.przydziel = przydziel;
