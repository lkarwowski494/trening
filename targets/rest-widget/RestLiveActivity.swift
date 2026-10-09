import ActivityKit
import SwiftUI
import WidgetKit

// Widok timera przerwy / serii na ekranie blokady i w Dynamic Island (0.7).
// Odliczanie robi system (Text(timerInterval:)), więc aktualizacje z aplikacji są potrzebne tylko przy ±15 s i końcu.
@available(iOS 16.2, *)
struct RestLiveActivity: Widget {
  var body: some WidgetConfiguration {
    ActivityConfiguration(for: RestTimerAttributes.self) { context in
      // Runda 38: tło zawsze ciemne, więc tekst też w trybie ciemnym (.secondary w jasnym trybie był nieczytelny).
      LockScreenView(context: context)
        .environment(\.colorScheme, .dark)
        .activityBackgroundTint(Color(red: 0.071, green: 0.075, blue: 0.086))
        .activitySystemActionForegroundColor(.white)
    } dynamicIsland: { context in
      DynamicIsland {
        DynamicIslandExpandedRegion(.leading) { Text(kindLabel(context.attributes.kind)).font(.caption).foregroundColor(.secondary) }
        DynamicIslandExpandedRegion(.trailing) { Text(context.state.subtitle).font(.caption).foregroundColor(.secondary).lineLimit(1) }
        DynamicIslandExpandedRegion(.center) {
          Text(timerInterval: timerRange(context.state.endAt), countsDown: true).font(.system(size: 34, weight: .bold, design: .rounded)).monospacedDigit().foregroundColor(Color(red: 0.435, green: 0.608, blue: 0.949))
        }
        DynamicIslandExpandedRegion(.bottom) { Text(context.attributes.title).font(.caption2).foregroundColor(.secondary) }
      } compactLeading: {
        Image(systemName: kindBase(context.attributes.kind) == "set" ? "stopwatch" : "timer").foregroundColor(Color(red: 0.435, green: 0.608, blue: 0.949))
      } compactTrailing: {
        Text(timerInterval: timerRange(context.state.endAt), countsDown: true).monospacedDigit().frame(width: 44)
      } minimal: {
        Image(systemName: kindBase(context.attributes.kind) == "set" ? "stopwatch" : "timer")
      }
    }
  }
}

@available(iOS 16.2, *)
struct LockScreenView: View {
  let context: ActivityViewContext<RestTimerAttributes>
  var body: some View {
    HStack(alignment: .center, spacing: 14) {
      VStack(alignment: .leading, spacing: 2) {
        Text(kindLabel(context.attributes.kind)).font(.caption).foregroundColor(.secondary)
        Text(context.attributes.title).font(.headline).foregroundColor(.white).lineLimit(1)
        Text(context.state.subtitle).font(.caption2).foregroundColor(.secondary).lineLimit(1)
      }
      Spacer()
      Text(timerInterval: timerRange(context.state.endAt), countsDown: true)
        .font(.system(size: 40, weight: .bold, design: .rounded)).monospacedDigit()
        .foregroundColor(Color(red: 0.435, green: 0.608, blue: 0.949))
        .frame(minWidth: 110, alignment: .trailing)
    }
    .padding(14)
  }
}

/// Rodzaj bez etykiety: „rest|Przerwa” → „rest” (runda 37).
func kindBase(_ kind: String) -> String {
  if let i = kind.firstIndex(of: "|") { return String(kind[..<i]) }
  return kind
}
/// Etykieta rodzaju odliczania. Runda 37: aplikacja przekazuje ją w języku z ustawień aplikacji („rest|Przerwa”);
/// bez niej — w języku systemu z 16 języków aplikacji (06.10.2026, RestLabels.swift generowany z tłumaczeń), inny język → angielski.
func kindLabel(_ kind: String) -> String {
  if let i = kind.firstIndex(of: "|") { return String(kind[kind.index(after: i)...]) }
  let pref = Locale.preferredLanguages.first ?? "en"
  var code = String(pref.prefix(2))
  // Fala 4 (09.10.2026): chiński tradycyjny — „zh-Hant-TW”, „zh-Hant-HK”, „zh-HK”, „zh-TW”, „zh-MO” → zh-Hant; uproszczony → angielski (jak lib/i18n.ts resolveLang)
  if code == "zh" { code = (pref.contains("Hant") || pref.hasSuffix("-TW") || pref.hasSuffix("-HK") || pref.hasSuffix("-MO")) ? "zh-Hant" : "en" }
  let l = restLabels[code] ?? restLabels["en"]!
  return kind == "set" ? l.set : l.rest
}

/// Zakres odliczania odporny na koniec w przeszłości: operator ... wywraca rozszerzenie, gdy start > koniec (audyt 0.8.1).
func timerRange(_ end: Date) -> ClosedRange<Date> {
  let now = Date()
  return now...max(end, now)
}
