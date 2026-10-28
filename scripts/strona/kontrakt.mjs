// Walidator kontraktu pól eksportu (kontrakt.json) — mały podzbiór JSON Schema, bez zależności; ten sam plik czyta aplikacja (test) i strona (sync-dane kopiuje go do .cache/dane).
// Obsługiwane słowa: type (string | lista; „integer”, „null”), properties, required, additionalProperties (false), items, enum, minLength, minimum oraz własne
// `kluczW`: wartość musi być kluczem obiektu pod ścieżką od korzenia pliku (np. „labels.regions” — id regionu ma etykietę, więc strona nie wypisze „undefined”).
// Zwraca listę błędów (tekst ze ścieżką); pusta lista = zgodne.
const typOf = v => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v;
const zgodnyTyp = (v, t) => t === 'number' ? typeof v === 'number' : typOf(v) === t;
const wSciezce = (root, p) => p.split('.').reduce((o, k) => (o !== null && typeof o === 'object' ? o[k] : undefined), root);

export function waliduj(schema, value, root = value, path = '$', errors = []) {
  const typy = [].concat(schema.type ?? []);
  if (typy.length && !typy.some(t => zgodnyTyp(value, t))) { errors.push(`${path}: oczekiwano ${typy.join('|')}, jest ${typOf(value)}`); return errors; }
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${path}: wartość spoza ${JSON.stringify(schema.enum)}`);
  if (typeof value === 'string' && schema.minLength !== undefined && value.length < schema.minLength) errors.push(`${path}: tekst krótszy niż ${schema.minLength}`);
  if (typeof value === 'number' && schema.minimum !== undefined && value < schema.minimum) errors.push(`${path}: mniej niż ${schema.minimum}`);
  if (schema.kluczW !== undefined) {
    const mapa = wSciezce(root, schema.kluczW);
    if (!mapa || typeof mapa !== 'object' || !Object.prototype.hasOwnProperty.call(mapa, value)) errors.push(`${path}: „${value}” nie jest kluczem ${schema.kluczW}`);
  }
  if (Array.isArray(value) && schema.items) value.forEach((x, i) => waliduj(schema.items, x, root, `${path}[${i}]`, errors));
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const k of schema.required ?? []) if (!Object.prototype.hasOwnProperty.call(value, k)) errors.push(`${path}.${k}: brak pola`);
    for (const [k, sub] of Object.entries(schema.properties ?? {})) if (Object.prototype.hasOwnProperty.call(value, k)) waliduj(sub, value[k], root, `${path}.${k}`, errors);
    if (schema.additionalProperties === false) for (const k of Object.keys(value)) if (!(k in (schema.properties ?? {}))) errors.push(`${path}.${k}: pole spoza kontraktu`);
  }
  return errors;
}
