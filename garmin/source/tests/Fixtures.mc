import Toybox.Lang;
import Toybox.Test;

// Generowane: tests/ciq-gen.test.ts (UPDATE_CIQ=1) — nie edytuj ręcznie.
// Pliki „złote” z tests/ciq-scenarios.ts: kroki (migawka, naciśnięcie, cofnięcie, tyknięcie) i wynik policzony przez lib/watch/ciqModel.ts.
(:test)
module Fixtures {
    function scriptNames() as Array {
        return ["online_basic", "undo_window", "offline_blind", "different_and_skip", "rest_from_phone", "no_next_known", "idle_and_end", "newer_version"];
    }

    function script_online_basic() as Array {
        return [
            {"op" => "hello", "at" => 1799999995, "event" => {"k" => "e", "v" => 1, "t" => "h", "e" => "w1-1", "b" => 0, "id" => "", "a" => 1799999995, "c" => "g0.1.0"}, "view" => {"mode" => 0, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}},
            {"op" => "snap", "at" => 1799999996, "event" => null, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 5, "m" => 1, "id" => "s2", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 2 z 4", "ld" => "80 kg × 8", "af" => {"id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)"}},
            {"op" => "press", "at" => 1800000000, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-2", "b" => 5, "id" => "s2", "a" => 1800000000, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 120, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "undo", "at" => 1800000003, "event" => {"k" => "e", "v" => 1, "t" => "u", "e" => "w1-3", "b" => 5, "id" => "s2", "a" => 1800000003, "c" => "g0.1.0"}, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}},
            {"op" => "press", "at" => 1800000010, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-4", "b" => 5, "id" => "s2", "a" => 1800000010, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 120, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "tick", "at" => 1800000129, "event" => null, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 1, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}},
            {"op" => "tick", "at" => 1800000130, "event" => {"k" => "e", "v" => 1, "t" => "r", "e" => "w1-5", "b" => 5, "id" => "s3", "a" => 1800000130, "c" => "g0.1.0"}, "view" => {"mode" => 1, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}},
            {"op" => "tick", "at" => 1800000131, "event" => null, "view" => {"mode" => 1, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}}
        ];
    }

    function script_undo_window() as Array {
        return [
            {"op" => "snap", "at" => 1800000000, "event" => null, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 5, "m" => 1, "id" => "s2", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 2 z 4", "ld" => "80 kg × 8", "af" => {"id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)"}},
            {"op" => "press", "at" => 1800000000, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-1", "b" => 5, "id" => "s2", "a" => 1800000000, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 120, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "undo", "at" => 1800000005, "event" => null, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 115, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}},
            {"op" => "undo", "at" => 1800000004, "event" => {"k" => "e", "v" => 1, "t" => "u", "e" => "w1-2", "b" => 5, "id" => "s2", "a" => 1800000004, "c" => "g0.1.0"}, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}}
        ];
    }

    function script_offline_blind() as Array {
        return [
            {"op" => "snap", "at" => 1800000000, "event" => null, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 5, "m" => 1, "id" => "s2", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 2 z 4", "ld" => "80 kg × 8", "af" => {"id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)"}},
            {"op" => "press", "at" => 1800000001, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-1", "b" => 5, "id" => "s2", "a" => 1800000001, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 120, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "press", "at" => 1800000020, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-2", "b" => 5, "id" => "s3", "a" => 1800000020, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 101, "canUndo" => true, "blind" => true, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "press", "at" => 1800000040, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-3", "b" => 5, "id" => "", "a" => 1800000040, "c" => "g0.1.0"}, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 81, "canUndo" => false, "blind" => true, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "undo", "at" => 1800000041, "event" => null, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 80, "canUndo" => false, "blind" => true, "needsUpdate" => false, "hasNext" => false}},
            {"op" => "snap", "at" => 1800000050, "event" => null, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 90, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 5, "m" => 2, "id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8", "rs" => 90, "cu" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "af" => {"id" => "s4", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 4 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "lb" => {"idle" => "Zacznij trening w aplikacji na telefonie", "offline" => "Brak połączenia z telefonem", "update" => "Zaktualizuj aplikację na zegarku", "finished" => "Trening zakończony", "nothingMore" => "Nic więcej do zrobienia", "done" => "Seria zrobiona", "doneDiff" => "Zrobione inaczej niż w planie", "skip" => "Pomiń ćwiczenie", "skipQuestion" => "Pominąć ćwiczenie?", "undo" => "Cofnij", "rest" => "Przerwa"}}},
            {"op" => "press", "at" => 1800000055, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-4", "b" => 5, "id" => "s3", "a" => 1800000055, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s4", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 4 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 120, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0}
        ];
    }

    function script_different_and_skip() as Array {
        return [
            {"op" => "snap", "at" => 1800000000, "event" => null, "view" => {"mode" => 1, "setId" => "a1", "title" => "Uginanie ramion ze sztangą", "counter" => "seria 1 z 3", "load" => "30 kg × 10", "group" => "A1", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 7, "m" => 1, "id" => "a1", "bk" => "b4", "ti" => "Uginanie ramion ze sztangą", "ct" => "seria 1 z 3", "ld" => "30 kg × 10", "gr" => "A1", "af" => {"id" => "a2", "bk" => "b4", "ti" => "Prostowanie ramion na wyciągu", "ct" => "seria 1 z 3", "ld" => "25 kg × 12", "gr" => "A2"}, "rt" => 0, "nc" => ""}},
            {"op" => "press", "at" => 1800000001, "event" => {"k" => "e", "v" => 1, "t" => "x", "e" => "w1-1", "b" => 7, "id" => "a1", "a" => 1800000001, "c" => "g0.1.0", "bk" => "b4"}, "view" => {"mode" => 1, "setId" => "a2", "title" => "Prostowanie ramion na wyciągu", "counter" => "seria 1 z 3", "load" => "25 kg × 12", "group" => "A2", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 1},
            {"op" => "snap", "at" => 1800000002, "event" => null, "view" => {"mode" => 1, "setId" => "g1", "title" => "Wiosłowanie z gumą", "counter" => "seria 2 z 3", "load" => "guma czerwona × 15", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "msg" => {"k" => "s", "v" => 1, "r" => 7, "m" => 1, "id" => "g1", "bk" => "b5", "ti" => "Wiosłowanie z gumą", "ct" => "seria 2 z 3", "ld" => "guma czerwona × 15"}},
            {"op" => "press", "at" => 1800000003, "event" => {"k" => "e", "v" => 1, "t" => "s", "e" => "w1-2", "b" => 7, "id" => "g1", "a" => 1800000003, "c" => "g0.1.0", "bk" => "b5"}, "view" => {"mode" => 1, "setId" => "g1", "title" => "Wiosłowanie z gumą", "counter" => "seria 2 z 3", "load" => "guma czerwona × 15", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 2}
        ];
    }

    function script_rest_from_phone() as Array {
        return [
            {"op" => "snap", "at" => 1800000000, "event" => null, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 90, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 5, "m" => 2, "id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8", "rs" => 90, "cu" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "af" => {"id" => "s4", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 4 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "lb" => {"idle" => "Zacznij trening w aplikacji na telefonie", "offline" => "Brak połączenia z telefonem", "update" => "Zaktualizuj aplikację na zegarku", "finished" => "Trening zakończony", "nothingMore" => "Nic więcej do zrobienia", "done" => "Seria zrobiona", "doneDiff" => "Zrobione inaczej niż w planie", "skip" => "Pomiń ćwiczenie", "skipQuestion" => "Pominąć ćwiczenie?", "undo" => "Cofnij", "rest" => "Przerwa"}}},
            {"op" => "tick", "at" => 1800000030, "event" => null, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 60, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}},
            {"op" => "press", "at" => 1800000031, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-1", "b" => 5, "id" => "s3", "a" => 1800000031, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s4", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 4 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 120, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "tick", "at" => 1800000090, "event" => null, "view" => {"mode" => 2, "setId" => "s4", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 4 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 61, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}},
            {"op" => "tick", "at" => 1800000200, "event" => {"k" => "e", "v" => 1, "t" => "r", "e" => "w1-2", "b" => 5, "id" => "s4", "a" => 1800000200, "c" => "g0.1.0"}, "view" => {"mode" => 1, "setId" => "s4", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 4 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}}
        ];
    }

    function script_no_next_known() as Array {
        return [
            {"op" => "snap", "at" => 1800000000, "event" => null, "view" => {"mode" => 1, "setId" => "s4", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 4 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "msg" => {"k" => "s", "v" => 1, "r" => 8, "m" => 1, "id" => "s4", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 4 z 4", "ld" => "80 kg × 8"}},
            {"op" => "press", "at" => 1800000001, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-1", "b" => 8, "id" => "s4", "a" => 1800000001, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 1, "setId" => "s4", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 4 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "snap", "at" => 1800000002, "event" => null, "view" => {"mode" => 3, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "msg" => {"k" => "s", "v" => 1, "r" => 9, "m" => 3}},
            {"op" => "press", "at" => 1800000003, "event" => null, "view" => {"mode" => 3, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0}
        ];
    }

    function script_idle_and_end() as Array {
        return [
            {"op" => "snap", "at" => 1800000000, "event" => null, "view" => {"mode" => 0, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "msg" => {"k" => "s", "v" => 1, "r" => 1, "m" => 0}},
            {"op" => "press", "at" => 1800000001, "event" => null, "view" => {"mode" => 0, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0},
            {"op" => "press", "at" => 1800000002, "event" => null, "view" => {"mode" => 0, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 2},
            {"op" => "snap", "at" => 1800000003, "event" => null, "view" => {"mode" => 3, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "msg" => {"k" => "s", "v" => 1, "r" => 9, "m" => 3}},
            {"op" => "press", "at" => 1800000004, "event" => null, "view" => {"mode" => 3, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 1},
            {"op" => "tick", "at" => 1800000005, "event" => null, "view" => {"mode" => 3, "setId" => "", "title" => "", "counter" => "", "load" => "", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => false}}
        ];
    }

    function script_newer_version() as Array {
        return [
            {"op" => "snap", "at" => 1800000000, "event" => null, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 5, "m" => 1, "id" => "s2", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 2 z 4", "ld" => "80 kg × 8", "af" => {"id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)"}},
            {"op" => "snap", "at" => 1800000001, "event" => null, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => true, "hasNext" => true}, "msg" => {"k" => "s", "v" => 2, "r" => 5, "m" => 1, "id" => "s2", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 2 z 4", "ld" => "80 kg × 8", "af" => {"id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)"}},
            {"op" => "press", "at" => 1800000002, "event" => null, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => true, "hasNext" => true}, "kind" => 0},
            {"op" => "snap", "at" => 1800000003, "event" => null, "view" => {"mode" => 1, "setId" => "s2", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 2 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "", "restLeft" => 0, "canUndo" => false, "blind" => false, "needsUpdate" => false, "hasNext" => true}, "msg" => {"k" => "s", "v" => 1, "r" => 5, "m" => 1, "id" => "s2", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 2 z 4", "ld" => "80 kg × 8", "af" => {"id" => "s3", "bk" => "b1", "ti" => "Wyciskanie sztangi leżąc", "ct" => "seria 3 z 4", "ld" => "80 kg × 8"}, "rt" => 120, "nc" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)"}},
            {"op" => "press", "at" => 1800000004, "event" => {"k" => "e", "v" => 1, "t" => "d", "e" => "w1-1", "b" => 5, "id" => "s2", "a" => 1800000004, "c" => "g0.1.0", "bk" => "b1"}, "view" => {"mode" => 2, "setId" => "s3", "title" => "Wyciskanie sztangi leżąc", "counter" => "seria 3 z 4", "load" => "80 kg × 8", "group" => "", "timed" => false, "cue" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "restLeft" => 120, "canUndo" => true, "blind" => false, "needsUpdate" => false, "hasNext" => false}, "kind" => 0}
        ];
    }

    function script(name as String) as Array {
        if (name.equals("online_basic")) {
            return script_online_basic();
        }
        if (name.equals("undo_window")) {
            return script_undo_window();
        }
        if (name.equals("offline_blind")) {
            return script_offline_blind();
        }
        if (name.equals("different_and_skip")) {
            return script_different_and_skip();
        }
        if (name.equals("rest_from_phone")) {
            return script_rest_from_phone();
        }
        if (name.equals("no_next_known")) {
            return script_no_next_known();
        }
        if (name.equals("idle_and_end")) {
            return script_idle_and_end();
        }
        if (name.equals("newer_version")) {
            return script_newer_version();
        }
        return [];
    }

    // Szerokość atrapy: 10 px na znak.
    function wrapCases() as Array {
        return [{"text" => "", "maxW" => 100, "lines" => []}, {"text" => "abc", "maxW" => 100, "lines" => ["abc"]}, {"text" => "ab cd ef", "maxW" => 50, "lines" => ["ab cd", "ef"]}, {"text" => "ab cd ef", "maxW" => 40, "lines" => ["ab", "cd", "ef"]}, {"text" => "abcdefghij", "maxW" => 50, "lines" => ["abcde", "fghij"]}, {"text" => "  ab", "maxW" => 100, "lines" => ["ab"]}, {"text" => "ab\ncd", "maxW" => 100, "lines" => ["ab", "cd"]}, {"text" => "ab cdefgh", "maxW" => 50, "lines" => ["ab", "cdefg", "h"]}, {"text" => "日本語のテキスト", "maxW" => 30, "lines" => ["日本語", "のテキ", "スト"]}, {"text" => "Wyciskanie sztangi leżąc", "maxW" => 120, "lines" => ["Wyciskanie", "sztangi", "leżąc"]}, {"text" => "Następne: Wyciskanie sztangi leżąc, seria 3 z 4, 80 kg × 8 (20 kg + 10 kg z każdej strony)", "maxW" => 200, "lines" => ["Następne: Wyciskanie", "sztangi leżąc, seria", "3 z 4, 80 kg × 8 (20", "kg + 10 kg z każdej", "strony)"]}];
    }

    function recorderCases() as Array {
        return [{"recording" => false, "mode" => 1, "needsUpdate" => false, "elapsed" => 0, "action" => 1}, {"recording" => false, "mode" => 2, "needsUpdate" => false, "elapsed" => 0, "action" => 1}, {"recording" => true, "mode" => 1, "needsUpdate" => false, "elapsed" => 500, "action" => 0}, {"recording" => true, "mode" => 2, "needsUpdate" => false, "elapsed" => 500, "action" => 0}, {"recording" => false, "mode" => 0, "needsUpdate" => false, "elapsed" => 0, "action" => 0}, {"recording" => false, "mode" => 3, "needsUpdate" => false, "elapsed" => 0, "action" => 0}, {"recording" => true, "mode" => 3, "needsUpdate" => false, "elapsed" => 60, "action" => 2}, {"recording" => true, "mode" => 3, "needsUpdate" => false, "elapsed" => 59, "action" => 3}, {"recording" => true, "mode" => 0, "needsUpdate" => false, "elapsed" => 3600, "action" => 2}, {"recording" => true, "mode" => 0, "needsUpdate" => false, "elapsed" => 10, "action" => 3}, {"recording" => false, "mode" => 1, "needsUpdate" => true, "elapsed" => 0, "action" => 0}, {"recording" => true, "mode" => 3, "needsUpdate" => true, "elapsed" => 3600, "action" => 0}];
    }
}

(:test)
function test_script_online_basic(logger as Logger) as Boolean {
    return ModelTests.runScript("online_basic", logger);
}

(:test)
function test_script_undo_window(logger as Logger) as Boolean {
    return ModelTests.runScript("undo_window", logger);
}

(:test)
function test_script_offline_blind(logger as Logger) as Boolean {
    return ModelTests.runScript("offline_blind", logger);
}

(:test)
function test_script_different_and_skip(logger as Logger) as Boolean {
    return ModelTests.runScript("different_and_skip", logger);
}

(:test)
function test_script_rest_from_phone(logger as Logger) as Boolean {
    return ModelTests.runScript("rest_from_phone", logger);
}

(:test)
function test_script_no_next_known(logger as Logger) as Boolean {
    return ModelTests.runScript("no_next_known", logger);
}

(:test)
function test_script_idle_and_end(logger as Logger) as Boolean {
    return ModelTests.runScript("idle_and_end", logger);
}

(:test)
function test_script_newer_version(logger as Logger) as Boolean {
    return ModelTests.runScript("newer_version", logger);
}
