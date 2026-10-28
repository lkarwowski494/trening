// Decyzja właściciela 28.10.2026 „1a” (M1-audytor-generalny-038, commit f67c438): zdania usunięte z kart, bo przeczyły figurze
// albo nie miały podstawy. Strażnik braku — sama zmiana skrótu recenzji (karty-recenzja) nie mówi, że wracające zdanie łamie decyzję
// (lekcja w docs/40: przywrócenie skull.upperArm w 1.0.1 złapała dopiero recenzja niezależna).
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.join(__dirname, '..');
const read = (f: string) => JSON.parse(fs.readFileSync(path.join(ROOT, f), 'utf8'));

const USUNIETE: Record<string, string[]> = {
  'Pistol Squat': ['sq.mis.kneesIn'],
  'Deadlift (hantle)': ['dl.lower'],
  'Lunges (hantle)': ['lunge.knee', 'lunge.mis.kneeIn'],
  'Walking Lunges': ['lunge.knee', 'lunge.mis.kneeIn'],
  'Reverse Lunge': ['lunge.knee', 'lunge.mis.kneeIn'],
};

describe('decyzja 28.10.2026 „1a” — usunięte zdania kart nie wracają', () => {
  const cues = read('lib/cues/data.json').exercises as Record<string, Record<string, { c: string }[]>>;
  for (const [cw, ids] of Object.entries(USUNIETE)) {
    test(`${cw}: bez ${ids.join(', ')}`, () => {
      const karta = cues[cw];
      expect(karta).toBeDefined();
      const uzyte = Object.values(karta).flat().map((x) => x.c);
      for (const id of ids) expect(uzyte).not.toContain(id);
    });
  }
});
