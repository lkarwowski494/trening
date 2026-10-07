import ActivityKit
import AppIntents
import Foundation
import UserNotifications

// Przyciski przerwy na ekranie blokady i w Dynamic Island: −15 s / +15 s / Pomiń (decyzja właściciela 07.10.2026 wieczór, docs/18).
// LiveActivityIntent: system wykonuje perform() w procesie aplikacji, bez jej otwierania (Apple, „Adding interactivity to widgets and
// Live Activities”) — dlatego plik jest w _shared (cel aplikacji i widżetu, @bacons/apple-targets). Intencja zmienia Live Activity,
// przestawia powiadomienie końca przerwy i zapisuje nowy stan; aplikacja przejmuje go przy powrocie (lib/timer.ts, syncFromActivity).
@available(iOS 17.0, *)
struct RestAdjustIntent: LiveActivityIntent {
  static var title: LocalizedStringResource = "Rest timer"
  static var isDiscoverable: Bool = false
  @Parameter(title: "Seconds") var delta: Int

  init() { self.delta = 0 }
  init(delta: Int) { self.delta = delta }

  func perform() async throws -> some IntentResult {
    await RestAdjust.apply(delta: delta)
    return .result()
  }
}

enum RestAdjust {
  /// Identyfikator powiadomienia końca przerwy — ten sam co REST_ID w lib/timer.ts (test: tests/la-buttons.test.ts).
  static let notificationId = "rest-end"
  /// Klucz zapisu stanu po przycisku — odczytuje go moduł RestActivity (takeAdjust).
  static let adjustKey = "pl.lukasz.trening.restAdjust"

  /// delta = 0 — „Pomiń” (koniec przerwy); ±15 — przesunięcie końca jak „−15 / +15” w aplikacji (timer.adjust): koniec nie cofa się
  /// przed „teraz”, po końcu przerwy „+15” liczy od teraz, a „−15” nic nie robi.
  @available(iOS 16.2, *)
  static func apply(delta: Int) async {
    let now = Date()
    for activity in Activity<RestTimerAttributes>.activities where kindBaseOf(activity.attributes.kind) == "rest" {
      let state = activity.content.state
      if delta == 0 {
        await activity.end(nil, dismissalPolicy: .immediate)
        UNUserNotificationCenter.current().removePendingNotificationRequests(withIdentifiers: [notificationId])
        save(endAt: nil, totalSec: 0, ended: true)
        continue
      }
      let over = state.endAt <= now
      if over && delta < 0 { continue }
      let end = over ? now.addingTimeInterval(Double(delta)) : max(now, state.endAt.addingTimeInterval(Double(delta)))
      let total = max(0, state.totalSec + delta)
      let next = RestTimerAttributes.ContentState(endAt: end, totalSec: total, subtitle: state.subtitle)
      await activity.update(ActivityContent(state: next, staleDate: end))
      await reschedule(at: end)
      save(endAt: end, totalSec: total, ended: false)
    }
  }

  /// Powiadomienie końca przerwy zaplanowała aplikacja (expo-notifications, identyfikator „rest-end”) — przenosimy je na nowy koniec
  /// z tą samą treścią; bez zaplanowanego powiadomienia (np. wyłączone) nic nie dodajemy.
  static func reschedule(at end: Date) async {
    let center = UNUserNotificationCenter.current()
    let pending = await center.pendingNotificationRequests()
    guard let old = pending.first(where: { $0.identifier == notificationId }) else { return }
    center.removePendingNotificationRequests(withIdentifiers: [notificationId])
    let seconds = end.timeIntervalSinceNow
    guard seconds > 0.5 else { return }
    let request = UNNotificationRequest(identifier: notificationId, content: old.content, trigger: UNTimeIntervalNotificationTrigger(timeInterval: seconds, repeats: false))
    try? await center.add(request)
  }

  static func save(endAt: Date?, totalSec: Int, ended: Bool) {
    let payload: [String: Any] = ["endAtMs": (endAt?.timeIntervalSince1970 ?? 0) * 1000, "totalSec": totalSec, "ended": ended, "atMs": Date().timeIntervalSince1970 * 1000]
    if let data = try? JSONSerialization.data(withJSONObject: payload), let text = String(data: data, encoding: .utf8) {
      UserDefaults.standard.set(text, forKey: adjustKey)
    }
  }

  /// „rest|Przerwa|…” → „rest” (pole kind, lib/timer.ts).
  static func kindBaseOf(_ kind: String) -> String { kind.split(separator: "|", maxSplits: 1).first.map(String.init) ?? kind }
}
