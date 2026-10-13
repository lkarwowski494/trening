import Toybox.Graphics;
import Toybox.Lang;
import Toybox.Time;
import Toybox.WatchUi;

// Ekran: bieżąca seria albo przerwa. Biały tekst na czarnym tle (AMOLED, duży kontrast); tryb uśpienia — przygaszone kolory, bez podpowiedzi.
class MainView extends WatchUi.View {
    var scroll = 0;       // przesunięcie zapowiedzi (GÓRA/DÓŁ), gdy tekst nie mieści się na ekranie
    var sleeping = false;

    function initialize() {
        View.initialize();
    }

    function onEnterSleep() as Void {
        sleeping = true;
        WatchUi.requestUpdate();
    }

    function onExitSleep() as Void {
        sleeping = false;
        WatchUi.requestUpdate();
    }

    function scrollBy(d as Number) as Void {
        scroll += d;
        if (scroll < 0) {
            scroll = 0;
        }
        WatchUi.requestUpdate();
    }

    // Jedna czcionka z listy, w której tekst mieści się w szerokości (od największej).
    function fitFont(dc as Dc, text as String, maxW as Number, fonts as Array) {
        for (var i = 0; i < fonts.size(); i++) {
            if (dc.getTextWidthInPixels(text, fonts[i]) <= maxW) {
                return fonts[i];
            }
        }
        return fonts[fonts.size() - 1];
    }

    // Rysuje zawinięty tekst od y; zwraca y pod ostatnią linią. first = indeks pierwszej widocznej linii, maxLines = limit.
    function drawBlock(dc as Dc, text as String, font, x as Number, y as Number, maxW as Number, first as Number, maxLines as Number) as Number {
        var all = Wrap.lines(dc, text, font, maxW);
        var h = dc.getFontHeight(font);
        var shown = 0;
        for (var i = first; i < all.size() && shown < maxLines; i++) {
            dc.drawText(x, y, font, all[i], Graphics.TEXT_JUSTIFY_CENTER);
            y += h;
            shown += 1;
        }
        return y;
    }

    function onUpdate(dc as Dc) as Void {
        var app = getApp();
        var m = app.model;
        var w = dc.getWidth();
        var h = dc.getHeight();
        var cx = w / 2;
        var textW = (w * 76) / 100;
        var now = Time.now().value();
        var main = sleeping ? Graphics.COLOR_LT_GRAY : Graphics.COLOR_WHITE;
        var dim = sleeping ? Graphics.COLOR_DK_GRAY : Graphics.COLOR_LT_GRAY;
        var accent = sleeping ? Graphics.COLOR_DK_GRAY : Graphics.COLOR_YELLOW;
        dc.setColor(main, Graphics.COLOR_BLACK);
        dc.clear();

        if (m.needsUpdate) {
            dc.setColor(Graphics.COLOR_ORANGE, Graphics.COLOR_BLACK);
            drawBlock(dc, Labels.get(m, "update"), Graphics.FONT_MEDIUM, cx, (h * 30) / 100, textW, 0, 5);
            return;
        }
        if (m.mode == Wire.MODE_IDLE || m.mode == Wire.MODE_END) {
            var key = (m.mode == Wire.MODE_END) ? "finished" : "idle";
            dc.setColor(main, Graphics.COLOR_BLACK);
            drawBlock(dc, Labels.get(m, key), Graphics.FONT_MEDIUM, cx, (h * 30) / 100, textW, 0, 5);
            return;
        }

        if (m.mode == Wire.MODE_REST) {
            // przerwa: podpis, odliczanie, zapowiedź następnego ćwiczenia (ten sam tekst co głos w słuchawkach)
            var left = m.restLeft(now);
            dc.setColor(dim, Graphics.COLOR_BLACK);
            dc.drawText(cx, (h * 9) / 100, Graphics.FONT_SMALL, Labels.get(m, "rest"), Graphics.TEXT_JUSTIFY_CENTER);
            dc.setColor(left <= 10 ? (sleeping ? Graphics.COLOR_DK_GRAY : Graphics.COLOR_ORANGE) : main, Graphics.COLOR_BLACK);
            var clock = (left / 60).toString() + ":" + (left % 60 < 10 ? "0" : "") + (left % 60).toString();
            dc.drawText(cx, (h * 17) / 100, Graphics.FONT_NUMBER_HOT, clock, Graphics.TEXT_JUSTIFY_CENTER);
            if (!sleeping) {
                dc.setColor(main, Graphics.COLOR_BLACK);
                drawBlock(dc, m.cue, Graphics.FONT_SMALL, cx, (h * 50) / 100, textW, scroll, 3);
            }
        } else {
            // seria: licznik, ćwiczenie, ciężar × powtórzenia
            dc.setColor(dim, Graphics.COLOR_BLACK);
            var caption = (m.group.length() > 0) ? (m.group + " · " + m.counter) : m.counter;
            dc.drawText(cx, (h * 10) / 100, Graphics.FONT_SMALL, caption, Graphics.TEXT_JUSTIFY_CENTER);
            dc.setColor(main, Graphics.COLOR_BLACK);
            drawBlock(dc, m.title, Graphics.FONT_MEDIUM, cx, (h * 20) / 100, textW, 0, 3);
            dc.setColor(accent, Graphics.COLOR_BLACK);
            var font = fitFont(dc, m.load, textW, [Graphics.FONT_LARGE, Graphics.FONT_MEDIUM, Graphics.FONT_SMALL]);
            dc.drawText(cx, (h * 55) / 100, font, m.load, Graphics.TEXT_JUSTIFY_CENTER);
        }

        if (!sleeping) {
            // podpowiedź: START odhacza; Cofnij tylko przez chwilę po odhaczeniu
            dc.setColor(dim, Graphics.COLOR_BLACK);
            dc.drawText(cx, (h * 76) / 100, Graphics.FONT_XTINY, Labels.get(m, "done"), Graphics.TEXT_JUSTIFY_CENTER);
            if (m.canUndo(now)) {
                dc.setColor(Graphics.COLOR_ORANGE, Graphics.COLOR_BLACK);
                dc.drawText(cx, (h * 84) / 100, Graphics.FONT_XTINY, Labels.get(m, "undo"), Graphics.TEXT_JUSTIFY_CENTER);
            } else if (m.isBlind()) {
                dc.setColor(Graphics.COLOR_ORANGE, Graphics.COLOR_BLACK);
                dc.drawText(cx, (h * 84) / 100, Graphics.FONT_XTINY, Labels.get(m, "offline"), Graphics.TEXT_JUSTIFY_CENTER);
            }
        }
    }
}
