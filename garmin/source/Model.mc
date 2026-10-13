import Toybox.Lang;

// Model stanu zegarka (bez interfejsu i łączności). Lustro lib/watch/ciqModel.ts — każda zmiana zachowania najpierw tam i w
// tests/ciq-scenarios.ts, potem tutaj; testy w source/tests/ModelTests.mc odtwarzają te same kroki (pliki „złote” Fixtures.mc).

module Press {
    const DONE = 0;       // seria zrobiona według planu
    const DONE_DIFF = 1;  // seria zrobiona inaczej niż w planie
    const SKIP = 2;       // pomiń ćwiczenie (po potwierdzeniu)
}

class Model {
    var runId = "";
    var mode = 0;
    var rev = -1;
    var setId = "";
    var blockId = "";
    var title = "";
    var counter = "";
    var load = "";
    var group = "";
    var timed = false;
    var restEndsAt = 0;
    var cue = "";
    var next = null;          // {"set" => Dictionary, "restSec" => Number, "cue" => String} albo null
    var labels = {};
    var offlineCount = 0;
    var needsUpdate = false;
    var seq = 0;
    var lastDoneAt = 0;
    var undoSetId = "";
    var restEndSent = false;
    var prediction = null;    // stan sprzed lokalnego odhaczenia (do „Cofnij”)

    function initialize(runId as String) {
        self.runId = runId;
    }

    function adoptSet(d) as Void {
        setId = Util.str(d[Wire.K_SET_ID]);
        blockId = Util.str(d[Wire.K_BLOCK_ID]);
        title = Util.str(d[Wire.K_TITLE]);
        counter = Util.str(d[Wire.K_COUNTER]);
        load = Util.str(d[Wire.K_LOAD]);
        group = Util.str(d[Wire.K_GROUP]);
        timed = Util.num(d[Wire.K_TIMED]) == 1;
    }

    function clearSet() as Void {
        setId = "";
        blockId = "";
        title = "";
        counter = "";
        load = "";
        group = "";
        timed = false;
    }

    function save() as Dictionary {
        return {
            "mode" => mode, "setId" => setId, "blockId" => blockId, "title" => title, "counter" => counter, "load" => load,
            "group" => group, "timed" => timed, "restEndsAt" => restEndsAt, "cue" => cue, "next" => next, "restEndSent" => restEndSent
        };
    }

    function restore(p as Dictionary) as Void {
        mode = p["mode"];
        setId = p["setId"];
        blockId = p["blockId"];
        title = p["title"];
        counter = p["counter"];
        load = p["load"];
        group = p["group"];
        timed = p["timed"];
        restEndsAt = p["restEndsAt"];
        cue = p["cue"];
        next = p["next"];
        restEndSent = p["restEndSent"];
    }

    // Migawka z telefonu. true = to była migawka (ekran do odświeżenia). Starszej rev nie odrzucamy (restart telefonu zeruje licznik).
    function applySnapshot(msg, nowSec as Number) as Boolean {
        if (!(msg instanceof Dictionary)) {
            return false;
        }
        if (!Util.str(msg[Wire.K_KIND]).equals(Wire.KIND_SNAPSHOT)) {
            return false;
        }
        if (Util.num(msg[Wire.K_VERSION]) > Wire.VERSION) {
            needsUpdate = true;
            return true;
        }
        needsUpdate = false;
        rev = Util.num(msg[Wire.K_REV]);
        mode = Util.num(msg[Wire.K_MODE]);
        if (mode == Wire.MODE_SET || mode == Wire.MODE_REST) {
            adoptSet(msg);
        } else {
            clearSet();
        }
        if (mode == Wire.MODE_REST) {
            restEndsAt = nowSec + Util.num(msg[Wire.K_REST_LEFT]);
            cue = Util.str(msg[Wire.K_CUE]);
        } else {
            restEndsAt = 0;
            cue = "";
        }
        var af = msg[Wire.K_NEXT];
        if (af instanceof Dictionary) {
            next = {"set" => af, "restSec" => Util.num(msg[Wire.K_NEXT_REST_SEC]), "cue" => Util.str(msg[Wire.K_NEXT_CUE])};
        } else {
            next = null;
        }
        var lb = msg[Wire.K_LABELS];
        if (lb instanceof Dictionary) {
            labels = lb;
        }
        offlineCount = 0;
        prediction = null;
        restEndSent = (mode != Wire.MODE_REST);
        return true;
    }

    function make(kindCode as String, sid as String, nowSec as Number, bk as String) as Dictionary {
        seq += 1;
        var e = {
            Wire.K_KIND => Wire.KIND_EVENT,
            Wire.K_VERSION => Wire.VERSION,
            Wire.K_EVENT_TYPE => kindCode,
            Wire.K_EVENT_ID => runId + "-" + seq.toString(),
            Wire.K_BASE_REV => (rev > 0 ? rev : 0),
            Wire.K_SET_ID => sid,
            Wire.K_AT => nowSec,
            Wire.K_CLIENT => "g" + Wire.APP_VERSION
        };
        if (bk.length() > 0) {
            e[Wire.K_BLOCK_ID] = bk;
        }
        return e;
    }

    // Zdarzenie powitalne po uruchomieniu — telefon odpowiada migawką.
    function hello(nowSec as Number) as Dictionary {
        return make(Wire.EV_HELLO, "", nowSec, "");
    }

    function isBlind() as Boolean {
        return offlineCount >= Wire.OFFLINE_AFTER;
    }

    // Naciśnięcie: odhaczenie, odhaczenie inaczej niż w planie albo pominięcie. null = nic do zrobienia w tym trybie.
    function press(kind as Number, nowSec as Number) {
        if (needsUpdate || (mode != Wire.MODE_SET && mode != Wire.MODE_REST)) {
            return null;
        }
        if (kind == Press.SKIP) {
            return make(Wire.EV_SKIP, setId, nowSec, blockId);
        }
        var blind = isBlind();
        var sid = blind ? "" : setId;
        var ev = make(kind == Press.DONE ? Wire.EV_DONE : Wire.EV_DONE_DIFF, sid, nowSec, blind ? "" : blockId);
        prediction = save();
        undoSetId = sid;
        lastDoneAt = nowSec;
        offlineCount += 1;
        if (next != null) {
            adoptSet(next["set"]);
            cue = next["cue"];
            if (next["restSec"] > 0) {
                mode = Wire.MODE_REST;
                restEndsAt = nowSec + next["restSec"];
                restEndSent = false;
            } else {
                mode = Wire.MODE_SET;
                restEndsAt = 0;
                restEndSent = true;
            }
            next = null;
        }
        return ev;
    }

    function canUndo(nowSec as Number) as Boolean {
        return lastDoneAt > 0 && undoSetId.length() > 0 && (nowSec - lastDoneAt) < Wire.UNDO_WINDOW_SEC;
    }

    // „Cofnij” po przypadkowym odhaczeniu: zdarzenie; stan lokalny wraca, o ile telefon jeszcze nie odpowiedział migawką.
    function undo(nowSec as Number) {
        if (!canUndo(nowSec)) {
            return null;
        }
        var ev = make(Wire.EV_UNDO, undoSetId, nowSec, "");
        if (prediction != null) {
            restore(prediction);
            prediction = null;
        }
        offlineCount = (offlineCount > 0) ? offlineCount - 1 : 0;
        lastDoneAt = 0;
        undoSetId = "";
        return ev;
    }

    function restLeft(nowSec as Number) as Number {
        if (mode != Wire.MODE_REST) {
            return 0;
        }
        var left = restEndsAt - nowSec;
        return (left > 0) ? left : 0;
    }

    // Raz na sekundę. Koniec przerwy: zdarzenie (telefon mówi „koniec przerwy”) i przejście do serii — dokładnie raz.
    function tick(nowSec as Number) {
        if (mode != Wire.MODE_REST || restEndSent || restLeft(nowSec) > 0) {
            return null;
        }
        restEndSent = true;
        mode = Wire.MODE_SET;
        restEndsAt = 0;
        return make(Wire.EV_REST_END, setId, nowSec, "");
    }

    // Widok do porównań w testach (te same pola co view() w ciqModel.ts).
    function view(nowSec as Number) as Dictionary {
        return {
            "mode" => mode, "setId" => setId, "title" => title, "counter" => counter, "load" => load, "group" => group, "timed" => timed,
            "cue" => cue, "restLeft" => restLeft(nowSec), "canUndo" => canUndo(nowSec), "blind" => isBlind(), "needsUpdate" => needsUpdate,
            "hasNext" => (next != null)
        };
    }
}
