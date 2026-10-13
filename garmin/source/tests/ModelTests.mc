import Toybox.Lang;
import Toybox.Test;

// Testy Monkey C (Run No Evil) — uruchamiane w symulatorze Connect IQ (instrukcja: docs/35-zegarek-garmin.md).
// Kroki i oczekiwane wyniki pochodzą z Fixtures.mc (generowane z lib/watch/ciqModel.ts), więc zegarek ma robić dokładnie to, co model TypeScript.
(:test)
module ModelTests {
    // Odtwarza skrypt kroków i porównuje zdarzenie oraz widok po każdym kroku.
    function runScript(name as String, logger as Logger) as Boolean {
        var steps = Fixtures.script(name);
        var m = new Model("w1");
        for (var i = 0; i < steps.size(); i++) {
            var s = steps[i];
            var op = s["op"];
            var at = s["at"];
            var ev = null;
            if (op.equals("snap")) {
                m.applySnapshot(s["msg"], at);
            } else if (op.equals("hello")) {
                ev = m.hello(at);
            } else if (op.equals("press")) {
                ev = m.press(s["kind"], at);
            } else if (op.equals("undo")) {
                ev = m.undo(at);
            } else if (op.equals("tick")) {
                ev = m.tick(at);
            } else {
                logger.error("nieznany krok: " + op);
                return false;
            }
            if (!Util.same(ev, s["event"])) {
                logger.error(name + " krok " + i.toString() + " (" + op + "): zdarzenie inne niż oczekiwane");
                logger.error("jest:      " + ev);
                logger.error("oczekiwane: " + s["event"]);
                return false;
            }
            var view = m.view(at);
            if (!Util.same(view, s["view"])) {
                logger.error(name + " krok " + i.toString() + " (" + op + "): widok inny niż oczekiwany");
                logger.error("jest:      " + view);
                logger.error("oczekiwane: " + s["view"]);
                return false;
            }
        }
        return true;
    }

    (:test)
    function allScriptsAreListed(logger as Logger) as Boolean {
        var names = Fixtures.scriptNames();
        for (var i = 0; i < names.size(); i++) {
            if (Fixtures.script(names[i]).size() == 0) {
                logger.error("pusty skrypt: " + names[i]);
                return false;
            }
        }
        return names.size() > 0;
    }

    (:test)
    function utilNumAcceptsAllNumericTypes(logger as Logger) as Boolean {
        return Util.num(5) == 5 && Util.num(5l) == 5 && Util.num(5.0) == 5 && Util.num("5") == 0 && Util.num(null) == 0;
    }

    (:test)
    function utilSameComparesByContent(logger as Logger) as Boolean {
        var a = {"x" => "ab", "y" => [1]};
        var b = {"x" => "a" + "b", "y" => [1]};
        return Util.same("ab", "a" + "b") && Util.same(a, b) && !Util.same(a, {"x" => "ab"}) && !Util.same("a", "b") && Util.same(null, null) && !Util.same(null, 1);
    }

    (:test)
    function ignoresMessagesThatAreNotSnapshots(logger as Logger) as Boolean {
        var m = new Model("w1");
        return !m.applySnapshot(null, 0) && !m.applySnapshot("x", 0) && !m.applySnapshot({Wire.K_KIND => Wire.KIND_EVENT}, 0);
    }
}
