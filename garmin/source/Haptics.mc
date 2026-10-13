import Toybox.Attention;
import Toybox.Lang;

// Wibracja zegarka. Krótkie impulsy; brak modułu Attention na urządzeniu => cisza (ekran nadal pokazuje przerwę).
module Haptics {
    function play(profiles as Array) as Void {
        if (Toybox has :Attention && Attention has :vibrate) {
            Attention.vibrate(profiles);
        }
    }

    // Potwierdzenie odhaczenia.
    function tap() as Void {
        play([new Attention.VibeProfile(60, 120)]);
    }

    // Koniec przerwy: dwa mocne impulsy.
    function restEnd() as Void {
        play([new Attention.VibeProfile(100, 400), new Attention.VibeProfile(0, 150), new Attention.VibeProfile(100, 400)]);
    }
}
