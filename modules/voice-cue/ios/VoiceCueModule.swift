import ExpoModulesCore
import AVFoundation

/// Zapowiedzi głosowe na początku przerwy (0.20, docs/36). Mowa AVSpeechSynthesizer (offline), sesja dźwięku `.playback` + `.spokenAudio`:
/// gra także przy wyciszonym telefonie (tego `expo-speech` nie robi), a muzyka innych aplikacji jest ściszana tylko na czas zdania
/// (`duckOthers` + `interruptSpokenAudioAndMixWithOthers` — podcasty i audiobooki pauzują i wracają; Apple: „temporary basis only”).
/// Etap 1: bez trybu audio w tle — mówi tylko przy aplikacji na wierzchu (decyzję „kiedy i czy” podejmuje lib/voice.ts).
public class VoiceCueModule: Module {
  private let synth = AVSpeechSynthesizer()
  private var delegate: Delegate?
  private var pending: ((Bool) -> Void)?
  private var guardTimer: DispatchWorkItem?

  /// Najdłuższe ściszanie muzyki (s): zdanie zapowiedzi trwa kilka sekund; po tym czasie sesja jest zwalniana na pewno.
  private static let maxDuckSec = 20.0

  public func definition() -> ModuleDefinition {
    Name("VoiceCue")

    Function("isSupported") { () -> Bool in true }

    /// Czy telefon ma głos dla języka (tag BCP 47, np. „pl-PL”); dopuszcza inny region tego samego języka.
    Function("hasVoice") { (language: String) -> Bool in
      return VoiceCueModule.voice(for: language) != nil
    }

    /// Jakość najlepszego zainstalowanego głosu dla języka: 0 = brak głosu, 1 = podstawowy, 2 = rozszerzony, 3 = premium (Ustawienia pokazują wskazówkę, jak pobrać lepszy).
    Function("voiceQuality") { (language: String) -> Int in
      guard let v = VoiceCueModule.voice(for: language) else { return 0 }
      return VoiceCueModule.level(v.quality)
    }

    /// Czy dźwięk idzie teraz do słuchawek (przewodowych, Bluetooth, USB). Głośnik telefonu, AirPlay, HDMI i samochód to nie słuchawki.
    Function("headphonesConnected") { () -> Bool in
      let outs = AVAudioSession.sharedInstance().currentRoute.outputs
      let kinds: [AVAudioSession.Port] = [.headphones, .bluetoothA2DP, .bluetoothLE, .bluetoothHFP, .usbAudio]
      return outs.contains { kinds.contains($0.portType) }
    }

    /// Mówi `text`; poprzednia zapowiedź jest przerywana. Zwraca true, gdy zdanie wypowiedziano do końca (false: brak głosu, przerwano, błąd sesji).
    AsyncFunction("speak") { (text: String, language: String, promise: Promise) in
      DispatchQueue.main.async {
        self.finish(false)
        guard let voice = VoiceCueModule.voice(for: language), !text.isEmpty else { promise.resolve(false); return }
        let session = AVAudioSession.sharedInstance()
        do {
          try session.setCategory(.playback, mode: .spokenAudio, options: [.duckOthers, .interruptSpokenAudioAndMixWithOthers])
          try session.setActive(true)
        } catch { promise.resolve(false); return }
        self.pending = { ok in promise.resolve(ok) }
        let d = Delegate { [weak self] ok in self?.finish(ok) }
        self.delegate = d; self.synth.delegate = d
        let u = AVSpeechUtterance(string: text); u.voice = voice
        let work = DispatchWorkItem { [weak self] in self?.synth.stopSpeaking(at: .immediate); self?.finish(false) }
        self.guardTimer = work; DispatchQueue.main.asyncAfter(deadline: .now() + VoiceCueModule.maxDuckSec, execute: work)
        self.synth.speak(u)
      }
    }

    /// Przerywa mowę i przywraca głośność muzyki (np. cofnięcie odhaczenia serii).
    Function("stop") { () -> Void in
      DispatchQueue.main.async { self.synth.stopSpeaking(at: .immediate); self.finish(false) }
    }
  }

  /// Kończy zapowiedź: zwalnia sesję z powiadomieniem innych (muzyka wraca do pełnej głośności) i zamyka obietnicę. Bezpieczne do wielokrotnego wywołania.
  private func finish(_ ok: Bool) {
    guardTimer?.cancel(); guardTimer = nil
    if let p = pending { pending = nil; p(ok) }
    if synth.isSpeaking { synth.stopSpeaking(at: .immediate) }
    try? AVAudioSession.sharedInstance().setActive(false, options: [.notifyOthersOnDeactivation])
  }

  /// Poziom jakości głosu dla mostu TS: 1 = podstawowy (default), 2 = rozszerzony (enhanced), 3 = premium (iOS 16+; cel podspecu 16.4). Źródło: Apple, AVSpeechSynthesisVoiceQuality (odczyt 03.11.2026, docs/18).
  private static func level(_ q: AVSpeechSynthesisVoiceQuality) -> Int {
    switch q {
    case .premium: return 3
    case .enhanced: return 2
    default: return 1
    }
  }

  /// Najlepszy ZAINSTALOWANY głos dla języka (ZB-039, wariant A): najpierw pełny kod języka (np. „pl-PL”), gdy go brak — każdy głos języka podstawowego („pl”);
  /// wśród kandydatów wyższa jakość (premium > enhanced > default), przy remisie kolejność systemu (stabilnie: pierwszy z listy).
  private static func voice(for language: String) -> AVSpeechSynthesisVoice? {
    let all = AVSpeechSynthesisVoice.speechVoices()
    let primary = language.split(separator: "-").first.map(String.init) ?? language
    let exact = all.filter { $0.language == language }
    let pool = exact.isEmpty ? all.filter { $0.language == primary || $0.language.hasPrefix(primary + "-") } : exact
    var best: AVSpeechSynthesisVoice? = nil
    for v in pool where best == nil || level(v.quality) > level(best!.quality) { best = v }
    return best ?? AVSpeechSynthesisVoice(language: language)
  }

  private final class Delegate: NSObject, AVSpeechSynthesizerDelegate {
    let done: (Bool) -> Void
    init(_ done: @escaping (Bool) -> Void) { self.done = done }
    func speechSynthesizer(_ s: AVSpeechSynthesizer, didFinish u: AVSpeechUtterance) { done(true) }
    func speechSynthesizer(_ s: AVSpeechSynthesizer, didCancel u: AVSpeechUtterance) { done(false) }
  }
}
