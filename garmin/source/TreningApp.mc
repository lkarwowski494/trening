import Toybox.Application;
import Toybox.Communications;
import Toybox.Lang;
import Toybox.Time;
import Toybox.Timer;
import Toybox.WatchUi;

// Aplikacja na zegarek: tylko WYŚWIETLA stan treningu z telefonu i odsyła zdarzenia (zrobione, zrobione inaczej, pomiń, cofnij, koniec przerwy).
// Bez edycji na zegarku. Cały tekst powstaje w telefonie (lib/watch/ciqWire.ts).
class TreningApp extends Application.AppBase {
    var model = null;
    var link = null;
    var timer = null;
    var view = null;
    var recorder = null;

    function initialize() {
        AppBase.initialize();
    }

    function onStart(state as Dictionary or Null) as Void {
        var now = Time.now().value();
        model = new Model("w" + now.toString());
        link = new Link();
        recorder = new Recorder();
        Communications.registerForPhoneAppMessages(method(:onPhoneMessage));
        link.send(model.hello(now));
        timer = new Timer.Timer();
        timer.start(method(:onTick), 1000, true);
    }

    function onStop(state as Dictionary or Null) as Void {
        if (timer != null) {
            timer.stop();
        }
        if (recorder != null) {
            recorder.close(Time.now().value());
        }
        if (link != null) {
            link.persist();
        }
    }

    function getInitialView() as Array<Views or InputDelegates> or Null {
        view = new MainView();
        return [view, new MainDelegate()] as Array<Views or InputDelegates>;
    }

    // Wiadomość z telefonu (migawka). Odświeża ekran tylko dla poprawnej migawki.
    function onPhoneMessage(msg as Communications.PhoneAppMessage) as Void {
        var now = Time.now().value();
        if (model.applySnapshot(msg.data, now)) {
            recorder.update(model.mode, model.needsUpdate, now);
            WatchUi.requestUpdate();
        }
    }

    // Raz na sekundę: koniec przerwy (wibracja + zdarzenie), ponowienie wysyłki, odświeżenie odliczania.
    function onTick() as Void {
        var now = Time.now().value();
        var ev = model.tick(now);
        if (ev != null) {
            Haptics.restEnd();
            link.send(ev);
        }
        link.flush();
        WatchUi.requestUpdate();
    }

    // Wspólna obsługa naciśnięć (przycisk, menu, dotyk): zdarzenie do telefonu + krótka wibracja potwierdzenia.
    function act(kind as Number) as Void {
        var ev = model.press(kind, Time.now().value());
        if (ev != null) {
            if (kind != Press.SKIP) {
                Haptics.tap();
                recorder.lap();
            }
            link.send(ev);
        }
        WatchUi.requestUpdate();
    }

    function undo() as Void {
        var ev = model.undo(Time.now().value());
        if (ev != null) {
            Haptics.tap();
            link.send(ev);
        }
        WatchUi.requestUpdate();
    }
}

function getApp() as TreningApp {
    return Application.getApp() as TreningApp;
}
