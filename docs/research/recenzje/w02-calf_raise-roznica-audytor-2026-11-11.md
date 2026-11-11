# Recenzja różnicy W-02 B — calf_raise, dźwignia „barki”/„uda” (P1-CALF-1) — audytor, 11.11.2026

- Autor: programista (W-02 zadanie B). Recenzent: audytor (L-047: autor ≠ recenzent).
- Zakres: `git diff 5721a16e..910c677f` w worktree `/home/user/wt-b` (gałąź `w02/b-calf`, commit 910c677f).
- Skrót rodziny calf_raise po zmianie: `f4bca2a3f7ef` (`node scripts/zrodla-runtime.mjs --skroty`, potwierdzone).

## Werdykt

| Ćwiczenie | Werdykt |
|---|---|
| Standing Calf Raise | **wyswietlana** |
| Seated Calf Raise | **wyswietlana** (jedno znalezisko NISKIE, istniało już przed zmianą, nie blokuje) |

## Znaleziska

| # | Poziom | Pewność | Ćwiczenie | Opis | Dowód | Realność |
|---|---|---|---|---|---|---|
| N1 | NISKIE | 90% | Seated Calf Raise | Dłoń R jest nieruchoma (chwyt [30; 60,1; 15]), a udo unosi się razem z piętą, więc dłoń zanurza się w udo do −6,1 cm (koliderem dłoni GIRTH.hand względem promienia uda). Na rysunku przedramię „wchodzi” w udo przy kolanie, a dłoń jest schowana pod poduszką. Wygląda to jak dłonie oparte na kolanach, nie jak przenikanie. Usterka istniała już przed zmianą: ta sama wartość −6,1 cm na 5721a16e, dane rąk bez zmian. `checkFrame` jej nie zgłasza. | pomiar: odcinek biodro–kolano R kontra chwyt R, 21 klatek; arkusz Seated, kadry u ≥ 0,5 | realny (widoczny w animacji), kosmetyczny; backlog 1.1.x: dłonie na uchwytach poduszki albo na poduszce |

Brak znalezisk KRYTYCZNYCH, WYSOKICH i ŚREDNICH.

## Pomiary (własne, silnik z 910c677f, klatki co 0,05)

Standing Calf Raise (dźwignia prosta, kąt 90°, punkt „barki”, strona R):
- Styk poduszki z barkiem R: 0,00 cm we wszystkich klatkach (|poduszka − staw barku| − GIRTH.uarm[0] − 2 cm).
- Bez przenikania: odstęp od tułowia +8,65 cm (kolider tułowia), od szyi i głowy +12,4 cm. Prowadnica: x = 0, z = 19, pionowa (dir [0,1,0]). Odsunięcie poduszki od prowadnicy 0,0 cm, skok 0 → 14,2 cm z 20,2 cm.
- Tor poduszki pionowy, 14,2 cm w górę (149,8 → 164,0), monotoniczny. Kostka unosi się o 13,3 cm, pięta z 3,2 na 23,7 cm. Poduszka jedzie razem z całym ciałem, czyli ze wspięciem.
- Stopy: palce na wysokości 6,0–7,5 cm (wierzch podestu 6 cm, x0 = −0,5), przednia część stopy ok. 8 cm na podeście. Pięta w dolnym punkcie poniżej krawędzi (3,2 cm), co zgadza się z kartą („calf.edge”: przednia część stóp na krawędzi, pięty poza krawędzią). Dłonie są 30,6 cm od poduszki.
- „Odstęp −4,8 cm” w nagłówku arkusza to artefakt miary, potwierdzone. `odstepCiezaru` (scripts/figures/odstep-ciezaru.mjs:7) przy braku kolidera ciężaru modeluje ślad jako odcinek z ∈ [−h; h] (h = |z chwytu| = 24 cm). Odcinek przecina wtedy oś tułowia i szyję, choć prawdziwa poduszka leży tylko przy barku R (z = 19). Przenikania nie widać na arkuszu w pełnej rozdzielczości.

Seated Calf Raise (dźwignia prosta, kąt 90°, punkt „uda”, strona R):
- Styk poduszki z udem R: od 0,00 do −0,29 cm. To różnica między stałym promieniem (GIRTH.thigh[0]+[2])/2 a zwężającym się promieniem uda `legRadius` — pomijalna, na rysunku niewidoczna. Nagłówek arkusza: od 0,0 do −0,3 cm, a nie „ok. −2 cm”, jak pisał autor (wartość mniejsza, nie większa).
- Prowadnica pionowa przy x = 33, z = 10. Poduszka odchyla się od niej o 0,1–0,6 cm (x 33,6 → 32,5), skok 8,3 z 14,4 cm. Poduszka leży w 0,8 odcinka biodro–kolano, tuż nad kolanem.
- Tor poduszki pionowy, 8,3 cm (61,7 → 70,0), co odpowiada 0,8 × uniesieniu kolana (10,4 cm). Pięta unosi się z 3,2 na 20,0 cm. Zgodne ze wspięciem w siadzie (udo obraca się wokół biodra).
- Stopy: palce na wysokości 6,0–7,5 cm, x 61 przy x0 podestu 53,6, czyli przednia część stopy na podeście, a pięta poza nim, poniżej krawędzi. Zgodne z „calf.seatedEdge”. Kolano 90° spełnia regułę `kolana_zgiete_siad` (≥ 60°). Prowadnica jest ≥ 8 cm od stóp (test autora przechodzi). Dawny pręt przy kostkach (odstęp −7,0 cm na 5721a16e) zniknął.
- `checkFrame`: brak usterek w obu ćwiczeniach (keyframeFrame i frameAt, 21 klatek).

Widoki: oba ćwiczenia mają w specyfikacji tylko widok z boku (`spec.views`), więc nie ma czego generować z przodu. Arkusze własne zrobione z `scripts/figures/arkusz-slad.mjs` (poza repo, katalog tymczasowy sesji), porównane z arkuszami z 5721a16e i obejrzane w wycinkach w pełnej rozdzielczości.

## Brak wpływu na inne rodziny

Wyrenderowałem kształty (`shapesAt`, u = 0; 0,25; 0,5; 0,75; 1, wszystkie widoki) i ślad (`trailFor`) dla wszystkich 448 ćwiczeń z plikami póz na 5721a16e i 910c677f, a potem porównałem wyniki tekstowo. Różnią się tylko `calf_raise|Standing Calf Raise` i `calf_raise|Seated Calf Raise`. Pozostałe 446 ćwiczeń, w tym 32 z dźwignią i Calf-Machine Shoulder Shrug, rysują się identycznie. Twierdzenie autora potwierdzone niezależnie od bazy `tests/dane/dzwignia-punkty-bazowe.json`.

Testy: `figures-v2-dzwignia-barki-uda`, `figures-v2-calf-raise-p1`, `figury-generator-odtwarza`, `figures-v2-gear` — 242/242 zielone (`--runInBand`).

## Pole `slad` (do figury-recenzja.json)

Standing Calf Raise: ślad = poduszka na górze barku R, pionowo w górę o 14,2 cm, monotonicznie, razem z wysokością wspięcia (kostka +13,3 cm). Prowadnica pionowa z boku barku, poduszka cały czas w styku z barkiem (0,0 cm), bez przenikania tułowia i głowy. Seated Calf Raise: ślad = poduszka na udzie R tuż nad kolanem, pionowo w górę o 8,3 cm (0,8 × uniesienia kolana), prowadnica pionowa (odchylenie ≤ 0,6 cm), styk z udem od 0 do −0,3 cm, prowadnica ≥ 8 cm od stóp. Oba: przednia część stóp na podeście, pięty poza krawędzią.

## Uzupełnienie: nakładka techniki Standing Calf Raise (`calfKneeStraightRef`), 11.11.2026

Arkusz: `node scripts/figures/arkusz-nakladka.mjs --key "Standing Calf Raise"` w /home/user/trening (gałąź figury/w02-przed-1-1, niezacommitowane zdjęcie z `V2_WSTRZYMANE`, poza z punktem „barki”), rzut z boku plus poza błędu data:0, obejrzane w wycinku w pełnej rozdzielczości.
- Element to odcinek biodro → kolano (lib/figures/v2/overlay/calf_raise.ts:15). W każdym z 21 kadrów biegnie wzdłuż uda: zaczyna się przy biodrze na spodenkach i kończy przy kolanie. W pozie błędu też trzyma się uda.
- Kąt kolana na podpisach kadrów: 3–7°, czyli w granicy reguły `kolana_proste` (≤ 20°). Element jest zielony, co zgadza się z kartą „calf.knees” (kolana proste lub tylko lekko ugięte). W pozie błędu data:0 (niepełny zakres, znacznik przy stopach) element zostaje zielony, bo ten błąd nie dotyczy jego reguły — tak ma być.
- Element nie zasłania poduszki: kończy się ok. 50 cm poniżej poduszki na barku (biodro na wys. ok. 93–107 cm, poduszka 150–164 cm), więc ani ślad toru, ani poduszka nie nakładają się na niego.
- Werdykt bez zmian: **wyswietlana**, bez nowych znalezisk.
