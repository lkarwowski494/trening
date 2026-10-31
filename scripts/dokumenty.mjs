// Jedno miejsce reguły „plik jest dokumentem” (H1, decyzja właściciela 31.10.2026 ~11:35, ZB-028): używają jej verify:docs (scripts/verify-docs.mjs)
// i znacznik verify dla haka pre-push (scripts/verify-znacznik.mjs). Dokument = plik .md (docs/**, CLAUDE.md, README.md, .claude/agents/*.md),
// poza makietami w tests/ i watch-fixtures/. Dane i kod w docs/ (json, csv, mjs) oraz wszystko inne wymagają pełnego `npm run verify`.
export const jestDokumentem = f => /\.md$/.test(f) && !/^(tests|watch-fixtures)\//.test(f);
