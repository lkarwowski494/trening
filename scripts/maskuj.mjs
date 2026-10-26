// Wspólne maskowanie wyjścia skryptów wołających zewnętrzne API (repozytorium i logi CI są publiczne; lekcja L-035, docs/40).
// Zastępuje klucz, wszystko w kształcie klucza Google oraz identyfikatory projektu Google Cloud (numer lub nazwa w `projects/<id>`, „project <id>”, długie ciągi cyfr).
// Odpowiedzi błędów API powtarzają ścieżkę zasobu z numerem projektu — tego nie wolno wpisać do logu ani artefaktu.
export const maskuj = (tekst, klucz = '') => {
  let s = String(tekst ?? '');
  if (klucz && klucz.length >= 4) s = s.split(klucz).join('***');
  return s
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, '***')
    .replace(/sk-ant-[0-9A-Za-z_-]{10,}/g, '***')
    .replace(/projects\/[^/\s"'`,;)\]]+/gi, 'projects/***')
    .replace(/\bprojects?([\s:=]+)['"]?\d{4,}/gi, (m, b) => `project${b}***`)
    .replace(/\d{9,}/g, '***');
};
