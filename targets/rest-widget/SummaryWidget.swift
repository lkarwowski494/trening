import SwiftUI
import WidgetKit

// Widżet na ekran główny (docs/21 pkt 4a; decyzja właściciela 07.10.2026 wieczór): „W tym tygodniu” (treningi, serie robocze) i „Ostatni
// trening”. Dane i teksty liczy aplikacja (lib/widget.ts) i zapisuje JSON we wspólnej grupie aplikacji — tu tylko odczyt i widok.
// Po końcu tygodnia (weekEnd) bez nowego zapisu pokazujemy zera (zeroWorkouts/zeroSets), nie stare liczby.

private let groupId = "group.pl.lukasz.trening"
private let summaryKey = "summary"

struct SummaryText: Codable {
  let week: String
  let workouts: String
  let sets: String
  let zeroWorkouts: String
  let zeroSets: String
  let last: String
  let lastDate: String
  let none: String
}

struct Summary: Codable {
  let v: Int
  let weekStart: Double
  let weekEnd: Double
  let workouts: Int
  let sets: Int
  let lastName: String
  let lastAt: Double
  let text: SummaryText
}

struct SummaryEntry: TimelineEntry {
  let date: Date
  let summary: Summary?
}

struct SummaryProvider: TimelineProvider {
  func load() -> Summary? {
    guard let raw = UserDefaults(suiteName: groupId)?.string(forKey: summaryKey), let data = raw.data(using: .utf8) else { return nil }
    return try? JSONDecoder().decode(Summary.self, from: data)
  }
  func placeholder(in context: Context) -> SummaryEntry { SummaryEntry(date: Date(), summary: nil) }
  func getSnapshot(in context: Context, completion: @escaping (SummaryEntry) -> Void) { completion(SummaryEntry(date: Date(), summary: load())) }
  func getTimeline(in context: Context, completion: @escaping (Timeline<SummaryEntry>) -> Void) {
    let s = load(); let now = Date()
    var entries = [SummaryEntry(date: now, summary: s)]
    // Nowy wpis na początku następnego tygodnia — widok sam przełączy się na zera.
    if let s, s.weekEnd / 1000 > now.timeIntervalSince1970 { entries.append(SummaryEntry(date: Date(timeIntervalSince1970: s.weekEnd / 1000), summary: s)) }
    completion(Timeline(entries: entries, policy: .never))
  }
}

struct SummaryView: View {
  let entry: SummaryEntry
  @Environment(\.widgetFamily) var family
  var body: some View {
    let accent = Color(red: 0.122, green: 0.373, blue: 0.820)
    if let s = entry.summary {
      let stale = entry.date.timeIntervalSince1970 * 1000 >= s.weekEnd
      VStack(alignment: .leading, spacing: 4) {
        Text(s.text.week).font(.caption).foregroundColor(.secondary)
        Text(stale ? s.text.zeroWorkouts : s.text.workouts).font(.title3.weight(.bold)).foregroundColor(accent).minimumScaleFactor(0.7).lineLimit(1)
        Text(stale ? s.text.zeroSets : s.text.sets).font(.subheadline.weight(.semibold)).lineLimit(1)
        Spacer(minLength: 2)
        Text(s.text.last).font(.caption2).foregroundColor(.secondary)
        if s.lastAt > 0 {
          Text(s.lastName).font(.caption.weight(.semibold)).lineLimit(1)
          if family != .systemSmall || s.lastName.count < 14 { Text(s.text.lastDate).font(.caption2).foregroundColor(.secondary).lineLimit(1) }
        } else {
          Text(s.text.none).font(.caption).lineLimit(2)
        }
      }
      .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
    } else {
      Text(summaryLabels().none).font(.caption).foregroundColor(.secondary)
    }
  }
}

struct SummaryWidget: Widget {
  var body: some WidgetConfiguration {
    StaticConfiguration(kind: "TreningSummary", provider: SummaryProvider()) { entry in
      if #available(iOS 17.0, *) {
        SummaryView(entry: entry).containerBackground(.fill.tertiary, for: .widget)
      } else {
        SummaryView(entry: entry).padding()
      }
    }
    .configurationDisplayName(summaryLabels().title)
    .description(summaryLabels().description)
    .supportedFamilies([.systemSmall, .systemMedium])
  }
}

/// Nazwa i opis w galerii widżetów — w języku systemu (RestLabels.swift, generowane z tłumaczeń aplikacji), inny język → angielski.
func summaryLabels() -> (title: String, description: String, none: String) {
  let code = String((Locale.preferredLanguages.first ?? "en").prefix(2))
  let l = summaryWidgetLabels[code] ?? summaryWidgetLabels["en"]!
  return (l.title, l.description, l.none)
}
