import { redirectCiqPath } from '@/lib/watch/ciqUrl';

/** Adres powrotu z parowania zegarka (schemat „trening-ciq”) nie jest trasą aplikacji — kierujemy na „Więcej” zamiast na ekran „nie znaleziono”. */
export function redirectSystemPath({ path }: { path: string; initial: boolean }): string {
  return redirectCiqPath(path);
}
