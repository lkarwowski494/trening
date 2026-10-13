import Toybox.Lang;

// Zawijanie tekstu do szerokości w pikselach. `dc` może być dowolnym obiektem z getTextWidthInPixels(tekst, czcionka) — testy używają atrapy.
// Lustro lib/watch/ciqWrap.ts (przypadki testowe są generowane stamtąd). Zawija po spacjach; słowo szersze niż linia jest łamane w dowolnym miejscu
// (chiński i japoński nie mają spacji); znak nowej linii wymusza łamanie.
module Wrap {
    function lastSpace(s as String) as Number {
        var chars = s.toCharArray();
        for (var i = chars.size() - 1; i >= 0; i--) {
            if (chars[i].toString().equals(" ")) {
                return i;
            }
        }
        return -1;
    }

    function lines(dc, text as String, font, maxW as Number) as Array {
        var out = [];
        var cur = "";
        var chars = text.toCharArray();
        var n = chars.size();
        for (var i = 0; i < n; i++) {
            var ch = chars[i].toString();
            if (ch.equals("\n")) {
                out.add(cur);
                cur = "";
                continue;
            }
            if (cur.length() == 0 && ch.equals(" ")) {
                continue;
            }
            var cand = cur + ch;
            if (cur.length() > 0 && dc.getTextWidthInPixels(cand, font) > maxW) {
                if (ch.equals(" ")) {
                    out.add(cur);
                    cur = "";
                } else {
                    var sp = lastSpace(cur);
                    if (sp > 0) {
                        out.add(cur.substring(0, sp));
                        cur = cur.substring(sp + 1, cur.length()) + ch;
                    } else {
                        out.add(cur);
                        cur = ch;
                    }
                }
            } else {
                cur = cand;
            }
        }
        if (cur.length() > 0) {
            out.add(cur);
        }
        return out;
    }
}
