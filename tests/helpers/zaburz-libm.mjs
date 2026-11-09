// Symulacja innej arytmetyki (macOS arm64, 06.11.2026): sin/cos/atan2/acos/asin/tan przesunięte o 1 ulp w co MOD-tym wywołaniu (wybór po bitach argumentu i ziarnie SEED).
// Użycie: node --import tests/helpers/zaburz-libm.mjs … (SEED, MOD ze środowiska); tests/figury-generator-odtwarza.test.ts sprawdza na tym, że porównanie bajtowe wykrywa zaburzenie, a z tolerancją przechodzi.
const buf = new DataView(new ArrayBuffer(8));
const nudge = (x, s) => { if (!Number.isFinite(x) || x === 0) return x; buf.setFloat64(0, x); let b = buf.getBigInt64(0); b += (x > 0 ? 1n : -1n) * BigInt(s); buf.setBigInt64(0, b); return buf.getFloat64(0); };
const SEED = BigInt(process.env.SEED || 1), MOD = BigInt(process.env.MOD || 10);
const h = (x) => { buf.setFloat64(0, x); let b = buf.getBigUint64(0) ^ (SEED * 0x9E3779B97F4A7C15n); b = (b ^ (b >> 29n)) * 0xBF58476D1CE4E5B9n & 0xFFFFFFFFFFFFFFFFn; return Number((b >> 20n) % MOD) === 0; };
for (const f of ['sin', 'cos', 'atan2', 'acos', 'asin', 'tan']) { const o = Math[f]; Math[f] = (...a) => { const r = o(...a); return h(a[0]) ? nudge(r, 1) : r; }; }
