import Toybox.Lang;
import Toybox.Test;

// Decyzje rejestratora aktywności (Recorder.mc, RecorderLogic.decide) — przypadki z lib/watch/ciqWire.ts (ciqRecorderAction) przez Fixtures.mc.
(:test)
module RecorderTests {
    (:test)
    function decisionsMatchGoldenCases(logger as Logger) as Boolean {
        var cases = Fixtures.recorderCases();
        for (var i = 0; i < cases.size(); i++) {
            var c = cases[i];
            var got = RecorderLogic.decide(c["recording"], c["mode"], c["needsUpdate"], c["elapsed"]);
            if (got != c["action"]) {
                logger.error("przypadek " + i.toString() + ": jest " + got.toString() + ", oczekiwane " + c["action"].toString());
                return false;
            }
        }
        return cases.size() > 0;
    }
}
