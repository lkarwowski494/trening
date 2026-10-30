#!/usr/bin/env bash
# Podpisy i ramki na zrzutach do App Store (decyzja właściciela 14.10.2026, D-6 B — docs/41; store-screenshots.yml, zadanie „ramki”).
# Wejście: <katalog_zrzutów>/<rozmiar>/<język>/NN-<ekran>.png (wynik store-screenshots.sh). Wyjście: ten sam układ w <katalog_wyjściowy>,
# obraz o TYM SAMYM rozmiarze co zrzut (rozmiary wymagane przez Apple bez zmian), bez kanału alfa („Images can't include alpha channels”).
# Układ: tło (kolory.tlo), podpis u góry (kolory.tekst, czcionka marki), zrzut pomniejszony do 78% z zaokrągleniem i obwódką (kolory.obwodka).
# Ramka własna — bez obudów urządzeń Apple (wytyczne Apple Marketing: tylko obudowy dostarczone przez Apple, bez modyfikacji).
# Język bez podpisów (np. przed akceptacją i tłumaczeniem) jest pomijany z ostrzeżeniem. Narzędzia: ImageMagick 6 (`convert`, `identify`), node.
# Użycie: bash scripts/ci/store-frames.sh <katalog_zrzutów> <katalog_wyjściowy> [plik_podpisów]
set -euo pipefail
IN="$1"; OUT="$2"; CAP="${3:-store/screenshot-captions.json}"
FONT_LATIN="${FONT_LATIN:-node_modules/@expo-google-fonts/ibm-plex-sans/700Bold/IBMPlexSans_700Bold.ttf}"
FONT_CJK="${FONT_CJK:-/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc}"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
q() { node -e 'const c=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")); const v=process.argv.slice(2).reduce((o,k)=>o==null?o:o[k],c); process.stdout.write(v==null?"":String(v))' "$CAP" "$@"; }
BG=$(q kolory tlo); FG=$(q kolory tekst); LINE=$(q kolory obwodka)
n=0
for size_dir in "$IN"/*/; do
  size=$(basename "$size_dir")
  for lang_dir in "$size_dir"*/; do
    lang=$(basename "$lang_dir")
    if [ -z "$(q podpisy "$lang" trening)" ]; then echo "::warning::Brak podpisów dla języka $lang — bez ramek (surowe zrzuty w artefakcie)"; continue; fi
    case "$lang" in ja|ko|zh-Hant) FONT="$FONT_CJK" ;; *) FONT="$FONT_LATIN" ;; esac
    mkdir -p "$OUT/$size/$lang"
    # Jeden rozmiar czcionki i podział wierszy dla całego języka (store-caption-layout.mjs; pole podpisu jak niżej: 86% szerokości, 15% wysokości zrzutu).
    first=$(ls "$lang_dir"*.png | head -1); read -r W0 H0 < <(identify -format '%w %h\n' "$first")
    node scripts/ci/store-caption-layout.mjs "$CAP" "$lang" "$FONT" $(( W0 * 86 / 100 )) $(( H0 * 15 / 100 )) > "$TMP/plan.json"
    PT=$(node -e 'process.stdout.write(String(JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).pointsize))' "$TMP/plan.json")
    for shot in "$lang_dir"*.png; do
      file=$(basename "$shot"); screen=${file#[0-9][0-9]-}; screen=${screen%.png}
      text=$(node -e 'const p=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).podpisy[process.argv[2]]; process.stdout.write(p==null?"":p)' "$TMP/plan.json" "$screen")
      [ -n "$text" ] || { echo "::warning::Brak podpisu: $lang/$screen — pomijam"; continue; }
      read -r W H < <(identify -format '%w %h\n' "$shot")
      SW=$(( W * 78 / 100 )); SH=$(( H * 78 / 100 )); R=$(( SW * 7 / 100 )); B=$(( W / 120 + 2 ))
      CAPH=$(( H * 15 / 100 )); TOP=$(( H * 19 / 100 )); X=$(( (W - SW) / 2 ))
      convert "$shot" -resize "${SW}x${SH}!" "$TMP/s.png"
      convert -size "${SW}x${SH}" xc:black -fill white -draw "roundrectangle 0,0,$((SW - 1)),$((SH - 1)),$R,$R" "$TMP/m.png"
      convert "$TMP/s.png" "$TMP/m.png" -alpha off -compose CopyOpacity -composite "$TMP/r.png"
      convert -background none -fill "$FG" -font "$FONT" -size "$(( W * 86 / 100 ))x$CAPH" -gravity center -pointsize "$PT" label:"$text" "$TMP/c.png"
      convert -size "${W}x${H}" "xc:$BG" \
        -fill "$LINE" -draw "roundrectangle $((X - B)),$((TOP - B)),$((X + SW - 1 + B)),$((TOP + SH - 1 + B)),$((R + B)),$((R + B))" \
        "$TMP/r.png" -geometry "+$X+$TOP" -compose over -composite \
        "$TMP/c.png" -geometry "+$(( W * 7 / 100 ))+$(( H * 3 / 100 ))" -compose over -composite \
        -alpha remove -alpha off "$OUT/$size/$lang/$file"
      n=$((n + 1))
    done
  done
done
echo "Ramki: $n plików"
