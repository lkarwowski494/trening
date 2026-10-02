// npm run screens: dane przykładowe → eksport web → zrzuty i kontrola układu (.expo/screens).
import { execSync } from 'child_process'; import fs from 'fs'; import path from 'path';
const W = path.resolve('.expo/screens'); fs.rmSync(W, { recursive: true, force: true }); fs.mkdirSync(W, { recursive: true });
const run = (c, env = {}) => execSync(c, { stdio: 'inherit', env: { ...process.env, ...env } });
run(`npx jest --testMatch "**/scripts/screens/seed.test.ts"`, { SEED_OUT: path.join(W, 'seed.json') });
run(`npx expo export --platform web --output-dir ${path.join(W, 'dist')}`);
run('node scripts/screens/shoot.mjs');
