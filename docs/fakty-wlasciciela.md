# Fakty o właścicielu i jego środowisku

Plik czytany na starcie każdej sesji (hak `SessionStart` w `.claude/settings.json`). Zanim zapytasz właściciela o fakt (nie o decyzję), sprawdź ten plik, docs/18 i docs/48; w pytaniu podaj, gdzie szukałeś (CLAUDE.md, lekcja o pytaniu o Apple Watch w docs/40, decyzja właściciela 29.10.2026, wariant A).
Repo jest publiczne: bez danych osobowych (imię i nazwisko, e-mail, telefon, UDID, numery kont) — tylko fakty potrzebne do pracy, każdy ze źródłem.

| Fakt | Źródło |
|---|---|
| Ma iPhone'a i Apple Watch; testuje na obu (build 1030 na iPhonie i zegarku) | docs/18, 23.10.2026 |
| Ostatni test na telefonie i zegarku: build 1033 (`fced34b`), 29.10.2026 | docs/18, 29.10.2026 |
| Na telefonie i zegarku testuje tylko to, co zmieniło się od jego ostatniego testu; lista kroków zawężona z dowodem (diff kodu) | docs/18, 29.10.2026 |
| Strefa czasowa: Polska (od 25.10.2026 czas zimowy, UTC+1); godziny dla właściciela przeliczać poleceniem `TZ=Europe/Warsaw date`, nie z pamięci | lekcja w docs/40, 29.10.2026 |
| W App Store Connect ma rolę Account Holder (umowy, deklaracje, zatwierdzenia wykonuje sam) | docs/48 Z-11, Z-22 |
| Nie jest ekspertem dziedzinowym; rozstrzyga sprawy produktowe, nie merytoryczne | CLAUDE.md |
| Nie pisze do administracji forów i grup; bez wpisów w społecznościach na start | docs/18, 29.10.2026 |
| Gemini: ma subskrypcję (zadania pasujące do Gemini zgłaszać z gotowym promptem) | CLAUDE.md, 11.10.2026 |
| Na buildzie 1032 sprawdzał odliczanie przerwy na ekranie blokady w języku aplikacji (PR-17) | docs/18, 29.10.2026 |
| Konto testowe ma plan dożywotni i subskrypcję roczną (piaskownica) — „zakup bez planu” nie da się sprawdzić na jego koncie | docs/18, 29.10.2026 |
| Obserwacja właściciela: między ok. 15:00 a 24:00 czasu PL maszyn macOS w GitHub Actions zwykle brak (przebiegi czekają i są anulowane); długie przebiegi macOS planować rano | docs/18, 29.10.2026 |
