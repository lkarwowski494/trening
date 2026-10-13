import Toybox.Lang;
import Toybox.Test;

// Atrapa kontekstu rysowania: szerokość tekstu = 10 px na znak (tak liczy lib/watch/ciqWrap.ts przy generowaniu przypadków).
(:test)
class FakeDc {
    function getTextWidthInPixels(text as String, font) as Number {
        return text.length() * 10;
    }
}

(:test)
module WrapTests {
    (:test)
    function wrapMatchesGoldenCases(logger as Logger) as Boolean {
        var cases = Fixtures.wrapCases();
        var dc = new FakeDc();
        for (var i = 0; i < cases.size(); i++) {
            var got = Wrap.lines(dc, cases[i]["text"], 0, cases[i]["maxW"]);
            if (!Util.same(got, cases[i]["lines"])) {
                logger.error("przypadek " + i.toString() + ": " + cases[i]["text"]);
                logger.error("jest: " + got);
                logger.error("oczekiwane: " + cases[i]["lines"]);
                return false;
            }
        }
        return cases.size() > 0;
    }
}
