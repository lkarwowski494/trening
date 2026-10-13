/*
 * Powrót z aplikacji pomocniczej zegarka po wyborze urządzeń otwiera naszą aplikację adresem o schemacie CIQ_URL_SCHEME (np. „trening-ciq://…”).
 * Router aplikacji nie ma takiej trasy, więc adres jest przekierowywany na ekran „Więcej” (parowanie zaczyna się tam); samo przetworzenie listy urządzeń
 * robi moduł natywny (AppDelegate), nie JS. Używa app/+native-intent.ts.
 */
import { CIQ_URL_SCHEME } from './ciqWire';

/** Trasa, na którą trafia użytkownik po powrocie z parowania. */
export const CIQ_RETURN_ROUTE = '/(tabs)/more';

/** Host odpowiedzi aplikacji pomocniczej w SDK to „device-selection…” (nazwa z binarki SDK nie jest jawna w dokumentacji) — router może dostać pełny adres albo już samą ścieżkę. */
const SELECTION_PATH = /(^|\/)device-?select/i;
export const isCiqReturnUrl = (url: unknown): boolean => typeof url === 'string' && (url.toLowerCase().startsWith(`${CIQ_URL_SCHEME}:`) || SELECTION_PATH.test(url));

/** Przekierowanie dla expo-router (redirectSystemPath): adres parowania -> ekran „Więcej”, każdy inny bez zmian. */
export function redirectCiqPath(path: string): string { return isCiqReturnUrl(path) ? CIQ_RETURN_ROUTE : path; }
