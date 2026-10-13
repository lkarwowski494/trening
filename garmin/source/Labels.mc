import Toybox.Lang;
import Toybox.WatchUi;

// Generowane: tests/ciq-gen.test.ts (UPDATE_CIQ=1) — nie edytuj ręcznie.
// Stałe etykiety: tekst z telefonu (w języku aplikacji, migawka z polem lb) albo zasób zegarka w jego języku.
module Labels {
    function fallback(id as String) as String {
        if (id.equals("idle")) {
            return WatchUi.loadResource(Rez.Strings.LblIdle) as String;
        }
        if (id.equals("offline")) {
            return WatchUi.loadResource(Rez.Strings.LblOffline) as String;
        }
        if (id.equals("update")) {
            return WatchUi.loadResource(Rez.Strings.LblUpdate) as String;
        }
        if (id.equals("finished")) {
            return WatchUi.loadResource(Rez.Strings.LblFinished) as String;
        }
        if (id.equals("nothingMore")) {
            return WatchUi.loadResource(Rez.Strings.LblNothingMore) as String;
        }
        if (id.equals("done")) {
            return WatchUi.loadResource(Rez.Strings.LblDone) as String;
        }
        if (id.equals("doneDiff")) {
            return WatchUi.loadResource(Rez.Strings.LblDoneDiff) as String;
        }
        if (id.equals("skip")) {
            return WatchUi.loadResource(Rez.Strings.LblSkip) as String;
        }
        if (id.equals("skipQuestion")) {
            return WatchUi.loadResource(Rez.Strings.LblSkipQuestion) as String;
        }
        if (id.equals("undo")) {
            return WatchUi.loadResource(Rez.Strings.LblUndo) as String;
        }
        if (id.equals("rest")) {
            return WatchUi.loadResource(Rez.Strings.LblRest) as String;
        }
        return "";
    }

    function get(model, id as String) as String {
        var v = model.labels[id];
        if (v instanceof String && v.length() > 0) {
            return v;
        }
        return fallback(id);
    }
}
