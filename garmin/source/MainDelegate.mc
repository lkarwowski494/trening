import Toybox.Lang;
import Toybox.Time;
import Toybox.WatchUi;

// Obsługa przycisków (dotyk jest opcjonalny — fēnix pozwala go wyłączyć):
//   START (górny prawy)  = seria zrobiona według planu (w przerwie: odhacza następną serię)
//   BACK  (dolny prawy)  = cofnij, gdy trwa okno cofnięcia; w innym razie wyjście z aplikacji (zachowanie systemowe)
//   GÓRA / DÓŁ           = przewijanie zapowiedzi (build debug: DÓŁ na ekranie „brak treningu” wczytuje trening próbny, Demo.mc)
//   GÓRA przytrzymany    = menu: zrobione inaczej niż w planie, pomiń ćwiczenie (z potwierdzeniem), cofnij
class MainDelegate extends WatchUi.BehaviorDelegate {
    function initialize() {
        BehaviorDelegate.initialize();
    }

    function onSelect() as Boolean {
        getApp().act(Press.DONE);
        return true;
    }

    function onBack() as Boolean {
        var app = getApp();
        if (app.model.canUndo(Time.now().value())) {
            app.undo();
            return true;
        }
        return false;
    }

    function onNextPage() as Boolean {
        var m = getApp().model;
        if (m.mode == Wire.MODE_IDLE && !m.needsUpdate) {
            Demo.start(getApp());   // tylko build debug: trening próbny bez telefonu (Demo.mc); w wydaniu pusta funkcja
            WatchUi.requestUpdate();
            return true;
        }
        scrollView(1);
        return true;
    }

    function onPreviousPage() as Boolean {
        scrollView(-1);
        return true;
    }

    function scrollView(d as Number) as Void {
        var v = getApp().view;
        if (v != null) {
            v.scrollBy(d);
        }
    }

    // Dotyk: przesunięcie w pionie przewija zapowiedź, poziome nie robią nic (bez przypadkowego wyjścia/cofnięcia).
    function onSwipe(evt as WatchUi.SwipeEvent) as Boolean {
        var dir = evt.getDirection();
        if (dir == WatchUi.SWIPE_UP) {
            scrollView(1);
        } else if (dir == WatchUi.SWIPE_DOWN) {
            scrollView(-1);
        }
        return true;
    }

    function onMenu() as Boolean {
        var app = getApp();
        var m = app.model;
        if (m.needsUpdate || (m.mode != Wire.MODE_SET && m.mode != Wire.MODE_REST)) {
            return true;
        }
        var menu = new WatchUi.Menu2({:title => WatchUi.loadResource(Rez.Strings.AppName) as String});
        menu.addItem(new WatchUi.MenuItem(Labels.get(m, "doneDiff"), null, "diff", {}));
        menu.addItem(new WatchUi.MenuItem(Labels.get(m, "skip"), null, "skip", {}));
        if (m.canUndo(Time.now().value())) {
            menu.addItem(new WatchUi.MenuItem(Labels.get(m, "undo"), null, "undo", {}));
        }
        WatchUi.pushView(menu, new ActionMenuDelegate(), WatchUi.SLIDE_IMMEDIATE);
        return true;
    }
}

class ActionMenuDelegate extends WatchUi.Menu2InputDelegate {
    function initialize() {
        Menu2InputDelegate.initialize();
    }

    function onSelect(item as WatchUi.MenuItem) as Void {
        var id = item.getId();
        var app = getApp();
        if (id.equals("skip")) {
            // „Pomiń” pyta o potwierdzenie (docs/32, decyzja 8); menu zostaje pod spodem, potwierdzenie zamyka oba widoki
            WatchUi.pushView(new WatchUi.Confirmation(Labels.get(app.model, "skipQuestion")), new SkipConfirmDelegate(), WatchUi.SLIDE_IMMEDIATE);
            return;
        }
        WatchUi.popView(WatchUi.SLIDE_IMMEDIATE);
        if (id.equals("diff")) {
            app.act(Press.DONE_DIFF);
        } else if (id.equals("undo")) {
            app.undo();
        }
    }
}

class SkipConfirmDelegate extends WatchUi.ConfirmationDelegate {
    function initialize() {
        ConfirmationDelegate.initialize();
    }

    function onResponse(response as WatchUi.Confirm) as Boolean {
        // Confirmation zamyka się sam; zostaje menu — zamykamy je również (po odpowiedzi tak, po „nie” też, żeby wrócić do ekranu serii)
        WatchUi.popView(WatchUi.SLIDE_IMMEDIATE);
        if (response == WatchUi.CONFIRM_YES) {
            getApp().act(Press.SKIP);
        }
        return true;
    }
}
