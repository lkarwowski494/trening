import Toybox.Activity;
import Toybox.ActivityRecording;
import Toybox.Lang;
import Toybox.WatchUi;

// Zapis aktywności „Siła” na zegarku (plik FIT -> Garmin Connect; spec P6-A). Zegarek sam dokłada tętno i czas. Gdy aplikacja nie ma uprawnienia Fit
// albo urządzenie nie ma modułu ActivityRecording, zapis jest po cichu pomijany — wyświetlanie i odhaczanie działają bez niego.
// Decyzję „co zrobić” podejmuje czysta funkcja RecorderLogic.decide (lustro ciqRecorderAction w lib/watch/ciqWire.ts, testy z plików złotych).
module RecorderLogic {
    function decide(recording as Boolean, mode as Number, needsUpdate as Boolean, elapsedSec as Number) as Number {
        if (needsUpdate) {
            return Wire.REC_NONE;
        }
        if (mode == Wire.MODE_SET || mode == Wire.MODE_REST) {
            return recording ? Wire.REC_NONE : Wire.REC_START;
        }
        if (!recording) {
            return Wire.REC_NONE;
        }
        return (elapsedSec >= Wire.RECORD_MIN_SEC) ? Wire.REC_SAVE : Wire.REC_DISCARD;
    }
}

class Recorder {
    var session = null;
    var startedAt = 0;

    function isRecording() as Boolean {
        return session != null;
    }

    // Po każdej zmianie stanu (migawka z telefonu). mode/needsUpdate z Model.
    function update(mode as Number, needsUpdate as Boolean, nowSec as Number) as Void {
        if (!(Toybox has :ActivityRecording)) {
            return;
        }
        var action = RecorderLogic.decide(session != null, mode, needsUpdate, nowSec - startedAt);
        try {
            if (action == Wire.REC_START) {
                session = ActivityRecording.createSession({
                    :name => WatchUi.loadResource(Rez.Strings.AppName) as String,
                    :sport => Activity.SPORT_TRAINING,
                    :subSport => Activity.SUB_SPORT_STRENGTH_TRAINING
                });
                session.start();
                startedAt = nowSec;
            } else if (action == Wire.REC_SAVE) {
                finish(true);
            } else if (action == Wire.REC_DISCARD) {
                finish(false);
            }
        } catch (ex) {
            session = null;
        }
    }

    // Znacznik serii: okrążenie na każde odhaczenie (w Garmin Connect widać serie).
    function lap() as Void {
        if (session != null) {
            try {
                session.addLap();
            } catch (ex) {
            }
        }
    }

    // Wyjście z aplikacji w trakcie zapisu: zapisujemy to, co jest (jeśli dość długie), żeby nie zgubić treningu.
    function close(nowSec as Number) as Void {
        if (session != null) {
            try {
                finish((nowSec - startedAt) >= Wire.RECORD_MIN_SEC);
            } catch (ex) {
                session = null;
            }
        }
    }

    function finish(save as Boolean) as Void {
        session.stop();
        if (save) {
            session.save();
        } else {
            session.discard();
        }
        session = null;
    }
}
