import Toybox.Application;
import Toybox.Communications;
import Toybox.Lang;
import Toybox.Time;

// Kolejka niewysłanych zdarzeń (czysta logika — testy w tests/QueueTests.mc).
class EventQueue {
    var items = [];
    var max = 30;

    function initialize(max as Number) {
        self.max = max;
    }

    function push(e) as Void {
        items.add(e);
        while (items.size() > max) {
            items = items.slice(1, null);
        }
    }

    function peek() {
        return (items.size() > 0) ? items[0] : null;
    }

    function pop() as Void {
        if (items.size() > 0) {
            items = items.slice(1, null);
        }
    }

    function size() as Number {
        return items.size();
    }

    // Porzuca z początku zdarzenia starsze niż minAt (pole „at”). Zwraca liczbę porzuconych.
    function dropOlderThan(minAt as Number) as Number {
        var dropped = 0;
        while (items.size() > 0 && Util.num(items[0][Wire.K_AT]) < minAt) {
            items = items.slice(1, null);
            dropped += 1;
        }
        return dropped;
    }
}

// Wysyłanie zdarzeń do telefonu przez Bluetooth, po jednym naraz, z ponawianiem. Kolejka przetrwa wyjście z aplikacji (Storage).
// Telefon pomija powtórzone eventId, więc ponowna wysyłka jest bezpieczna.
class Link extends Communications.ConnectionListener {
    var queue;
    var sending = false;
    var sentAt = 0;

    function initialize() {
        Communications.ConnectionListener.initialize();
        queue = new EventQueue(Wire.QUEUE_MAX);
        var saved = Application.Storage.getValue("q");
        if (saved instanceof Array) {
            for (var i = 0; i < saved.size(); i++) {
                queue.push(saved[i]);
            }
        }
    }

    function persist() as Void {
        Application.Storage.setValue("q", queue.items);
    }

    function send(ev) as Void {
        queue.push(ev);
        persist();
        flush();
    }

    function flush() as Void {
        var now = Time.now().value();
        if (sending && (now - sentAt) > 15) {
            sending = false;   // odpowiedź nie nadeszła (utrata łączności) — spróbuj jeszcze raz
        }
        if (sending) {
            return;
        }
        if (queue.dropOlderThan(now - Wire.QUEUE_TTL_SEC) > 0) {
            persist();
        }
        var head = queue.peek();
        if (head == null) {
            return;
        }
        sending = true;
        sentAt = now;
        try {
            Communications.transmit(head, null, self);
        } catch (ex) {
            sending = false;
        }
    }

    function onComplete() as Void {
        sending = false;
        queue.pop();
        persist();
        flush();
    }

    function onError() as Void {
        sending = false;   // zdarzenie zostaje w kolejce; ponowienie z licznika (App.onTick)
    }
}
