import Toybox.Lang;

module Util {
    // Wartość z wiadomości jako tekst (cokolwiek innego niż tekst => "").
    function str(v) as String {
        return (v instanceof String) ? v : "";
    }

    // Wartość z wiadomości jako liczba całkowita (iOS może dostarczyć Number, Long, Float albo Double).
    function num(v) as Number {
        if (v instanceof Number) {
            return v;
        }
        if (v instanceof Long || v instanceof Float || v instanceof Double) {
            return v.toNumber();
        }
        return 0;
    }

    // Dwie wartości z wiadomości/testów jako równe (teksty po zawartości, słowniki i tablice rekurencyjnie, reszta ==).
    function same(a, b) as Boolean {
        if (a == null || b == null) {
            return a == null && b == null;
        }
        if (a instanceof String) {
            return (b instanceof String) && a.equals(b);
        }
        if (a instanceof Dictionary) {
            if (!(b instanceof Dictionary) || a.size() != b.size()) {
                return false;
            }
            var keys = a.keys();
            for (var i = 0; i < keys.size(); i++) {
                if (!b.hasKey(keys[i]) || !Util.same(a[keys[i]], b[keys[i]])) {
                    return false;
                }
            }
            return true;
        }
        if (a instanceof Array) {
            if (!(b instanceof Array) || a.size() != b.size()) {
                return false;
            }
            for (var j = 0; j < a.size(); j++) {
                if (!Util.same(a[j], b[j])) {
                    return false;
                }
            }
            return true;
        }
        return a == b;
    }
}
