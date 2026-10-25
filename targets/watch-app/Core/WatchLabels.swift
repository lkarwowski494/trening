import Foundation

// Stałe etykiety zegarka. Tabela języków (WatchLabelTable.json) jest GENEROWANA ze słownika telefonu (lib/watchLabels.ts → t())
// przez tests/watch-apple-i18n.test.ts (UPDATE_WATCH_APPLE=1) — nigdy ręcznie. Zegarek wybiera język z migawki (język aplikacji, nie systemu).

/// Wartości = klucze w lib/watchLabels.ts (WATCH_LABEL_KEYS: identyfikatory z protokołu + `workoutOn` tylko Apple); test porównuje obie listy.
enum WatchLabelKey: String, CaseIterable {
  case done, differ, skip, skipAsk, cancel, undo, rest, set, pause, connect, idle, finished, update, finishOnPhone, finish, workoutOn
}

enum WatchLabels {
  static let table: [String: [String: String]] = {
    guard let d = WatchLabelTable.json.data(using: .utf8),
          let t = try? JSONDecoder().decode([String: [String: String]].self, from: d) else { return [:] }
    return t
  }()

  static var languages: [String] { table.keys.sorted() }

  static func text(_ key: WatchLabelKey, lang: String) -> String {
    return table[lang]?[key.rawValue] ?? table["en"]?[key.rawValue] ?? key.rawValue
  }

  /// Regiony, w których hiszpański dziedziczy po es-419 (jak ES_419_REGIONS w lib/i18n.ts).
  static let es419Regions: Set<String> = ["419", "AR", "BO", "BR", "BZ", "CL", "CO", "CR", "CU", "DO", "EC", "GT", "HN", "JP", "MX", "NI", "PA", "PE", "PR", "PY", "SV", "US", "UY", "VE"]
  static let zhHantRegions: Set<String> = ["TW", "HK", "MO"]

  private static func isRegion(_ s: String) -> Bool {
    (s.count == 2 && s.allSatisfy { $0.isLetter && $0.isASCII }) || (s.count == 3 && s.allSatisfy { $0.isNumber && $0.isASCII })
  }

  /// Ta sama reguła co resolveLang w lib/i18n.ts (tag BCP 47 → język aplikacji; nieobsługiwany → en). Test: lang-cases.json.
  static func resolve(tag: String) -> String {
    let parts = tag.split(whereSeparator: { $0 == "-" || $0 == "_" }).map(String.init)
    var base = (parts.first ?? "").lowercased()
    if base == "in" { base = "id" } else if base == "zsm" { base = "ms" }
    let rest = Array(parts.dropFirst())
    let region = (rest.first(where: isRegion) ?? "").uppercased()
    if base == "pt" { return region.isEmpty || region == "BR" ? "pt-BR" : "pt" }
    if base == "es" { return es419Regions.contains(region) ? "es-419" : "es" }
    if base == "zh" {
      let script = (rest.first(where: { $0.count == 4 && $0.allSatisfy { $0.isLetter && $0.isASCII } }) ?? "").lowercased()
      return script == "hant" || (script.isEmpty && zhHantRegions.contains(region)) ? "zh-Hant" : "en"
    }
    return table[base] != nil ? base : "en"
  }

  static func resolve(preferred: [String]) -> String { resolve(tag: preferred.first ?? "") }
}
