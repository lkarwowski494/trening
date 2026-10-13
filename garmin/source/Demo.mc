import Toybox.Lang;
import Toybox.Time;

// Tryb próbny BEZ TELEFONU — tylko w buildach debug (bez przełącznika -r kompilatora): na ekranie „brak treningu” przycisk DÓŁ wczytuje przykładowy trening,
// żeby sprawdzić przyciski, wibrację, odliczanie, menu, „Pomiń”, „Cofnij” i zapis aktywności zanim działa parowanie z telefonem. W buildzie wydaniowym
// (-r) kompilator usuwa wersję debug i zostaje pusta funkcja. Zdarzenia z takiego treningu trafiają do kolejki wysyłki jak zwykłe (telefon ich nie zna — wygasną po 15 min).
(:debug)
module Demo {
    function setOf(id as String, counter as String, load as String) as Dictionary {
        return {
            Wire.K_SET_ID => id, Wire.K_BLOCK_ID => "b-demo", Wire.K_TITLE => "Wyciskanie sztangi leżąc (próba)", Wire.K_COUNTER => counter, Wire.K_LOAD => load
        };
    }

    function start(app) as Void {
        var now = Time.now().value();
        var msg = setOf("demo-1", "seria 1 z 3", "80 kg × 8");
        msg[Wire.K_KIND] = Wire.KIND_SNAPSHOT;
        msg[Wire.K_VERSION] = Wire.VERSION;
        msg[Wire.K_REV] = 1;
        msg[Wire.K_MODE] = Wire.MODE_SET;
        msg[Wire.K_NEXT] = setOf("demo-2", "seria 2 z 3", "80 kg × 8");
        msg[Wire.K_NEXT_REST_SEC] = 12;
        msg[Wire.K_NEXT_CUE] = "Następne: Wyciskanie sztangi leżąc, seria 2 z 3, 80 kg × 8 (20 kg + 10 kg z każdej strony)";
        if (app.model.applySnapshot(msg, now)) {
            app.recorder.update(app.model.mode, app.model.needsUpdate, now);
        }
    }
}

(:release)
module Demo {
    function start(app) as Void {
    }
}
