import ActivityKit
import AppIntents
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
        DynamicIslandExpandedRegion(.bottom) {
          VStack(spacing: 6) {
            Text(context.attributes.title).font(.caption2).foregroundColor(.secondary)
            RestButtons(kind: context.attributes.kind)
          }
        }
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
    VStack(spacing: 0) {
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
    .padding(.horizontal, 14).padding(.top, 14).padding(.bottom, kindBase(context.attributes.kind) == "rest" ? 6 : 14)
    RestButtons(kind: context.attributes.kind).padding(.horizontal, 14).padding(.bottom, 12)
    }
  }
}

/// Przyciski przerwy (07.10.2026 wieczór): −15 s / +15 s / Pomiń — tylko przerwa (nie stoper serii) i tylko iOS 17+ (przyciski
/// w Live Activity). Akcja: RestAdjustIntent (_shared/RestIntents.swift) w procesie aplikacji. Etykiety VoiceOver w języku aplikacji (kindParts).
struct RestButtons: View {
  let kind: String
  var body: some View {
    if kindBase(kind) == "rest" {
      if #available(iOS 17.0, *) {
        HStack(spacing: 8) {
          Button(intent: RestAdjustIntent(delta: -15)) { Text("−15").frame(maxWidth: .infinity) }.accessibilityLabel(buttonLabels(kind).shorter)
          Button(intent: RestAdjustIntent(delta: 15)) { Text("+15").frame(maxWidth: .infinity) }.accessibilityLabel(buttonLabels(kind).longer)
          Button(intent: RestAdjustIntent(delta: 0)) { Text(buttonLabels(kind).skip).frame(maxWidth: .infinity) }
        }
        .buttonStyle(.bordered).tint(Color(red: 0.435, green: 0.608, blue: 0.949)).font(.subheadline.weight(.semibold))
      }
    }
  }
}

/// Części pola kind: „rest|Przerwa|Pomiń|Skróć…|Wydłuż…” (lib/timer.ts, 07.10.2026 wieczór); stare „rest|Przerwa” i samo „rest” też działają.
func kindParts(_ kind: String) -> [String] { kind.components(separatedBy: "|") }
/// Rodzaj bez etykiety: „rest|Przerwa” → „rest” (runda 37).
func kindBase(_ kind: String) -> String { kindParts(kind)[0] }
/// Etykiety przycisków: z pola kind (język aplikacji), inaczej w języku systemu (RestLabels.swift), inny język → angielski.
func buttonLabels(_ kind: String) -> (skip: String, shorter: String, longer: String) {
  let p = kindParts(kind)
  if p.count >= 5 { return (p[2], p[3], p[4]) }
  let l = restLabels[String((Locale.preferredLanguages.first ?? "en").prefix(2))] ?? restLabels["en"]!
  return (l.skip, l.shorter, l.longer)
}
/// Etykieta rodzaju odliczania. Runda 37: aplikacja przekazuje ją w języku z ustawień aplikacji („rest|Przerwa”);
/// bez niej — w języku systemu z 16 języków aplikacji (06.10.2026, RestLabels.swift generowany z tłumaczeń), inny język → angielski.
func kindLabel(_ kind: String) -> String {
  let p = kindParts(kind)
  if p.count >= 2 { return p[1] }
  let code = String((Locale.preferredLanguages.first ?? "en").prefix(2))
  let l = restLabels[code] ?? restLabels["en"]!
  return kind == "set" ? l.set : l.rest
}

/// Zakres odliczania odporny na koniec w przeszłości: operator ... wywraca rozszerzenie, gdy start > koniec (audyt 0.8.1).
func timerRange(_ end: Date) -> ClosedRange<Date> {
  let now = Date()
  return now...max(end, now)
}
