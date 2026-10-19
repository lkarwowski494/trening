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

  private static func voice(for language: String) -> AVSpeechSynthesisVoice? {
    if let v = AVSpeechSynthesisVoice(language: language) { return v }
    let primary = language.split(separator: "-").first.map(String.init) ?? language
    return AVSpeechSynthesisVoice.speechVoices().first { $0.language.hasPrefix(primary) }
  }

  private final class Delegate: NSObject, AVSpeechSynthesizerDelegate {
    let done: (Bool) -> Void
    init(_ done: @escaping (Bool) -> Void) { self.done = done }
    func speechSynthesizer(_ s: AVSpeechSynthesizer, didFinish u: AVSpeechUtterance) { done(true) }
    func speechSynthesizer(_ s: AVSpeechSynthesizer, didCancel u: AVSpeechUtterance) { done(false) }
  }
}
