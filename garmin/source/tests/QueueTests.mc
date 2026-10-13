import Toybox.Lang;
import Toybox.Test;

// Kolejka zdarzeń (Link.mc): kolejność, limit, porzucanie starych.
(:test)
module QueueTests {
    function ev(id as String, at as Number) as Dictionary {
        return {Wire.K_EVENT_ID => id, Wire.K_AT => at};
    }

    (:test)
    function keepsOrderAndPopsFromFront(logger as Logger) as Boolean {
        var q = new EventQueue(5);
        q.push(ev("a", 1));
        q.push(ev("b", 2));
        var first = q.peek()[Wire.K_EVENT_ID];
        q.pop();
        return first.equals("a") && q.peek()[Wire.K_EVENT_ID].equals("b") && q.size() == 1;
    }

    (:test)
    function dropsOldestWhenFull(logger as Logger) as Boolean {
        var q = new EventQueue(3);
        for (var i = 0; i < 5; i++) {
            q.push(ev("e" + i.toString(), i));
        }
        return q.size() == 3 && q.peek()[Wire.K_EVENT_ID].equals("e2");
    }

    (:test)
    function emptyQueueIsSafe(logger as Logger) as Boolean {
        var q = new EventQueue(3);
        q.pop();
        return q.peek() == null && q.size() == 0 && q.dropOlderThan(100) == 0;
    }

    (:test)
    function dropsEventsOlderThanLimit(logger as Logger) as Boolean {
        var q = new EventQueue(10);
        q.push(ev("old1", 10));
        q.push(ev("old2", 20));
        q.push(ev("new", 100));
        var dropped = q.dropOlderThan(50);
        return dropped == 2 && q.size() == 1 && q.peek()[Wire.K_EVENT_ID].equals("new") && q.dropOlderThan(100) == 0;
    }
}
