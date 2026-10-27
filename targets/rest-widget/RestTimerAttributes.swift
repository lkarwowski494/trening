import ActivityKit
import Foundation

// Definicja atrybutów Live Activity. Ta sama struktura (nazwa i pola) musi istnieć w rozszerzeniu widgetu
// (targets/rest-widget/RestTimerAttributes.swift) — ActivityKit dopasowuje aktywność po typie.
@available(iOS 16.2, *)
public struct RestTimerAttributes: ActivityAttributes {
  public struct ContentState: Codable, Hashable {
    public var endAt: Date
    public var totalSec: Int
    public var subtitle: String
    /// Język aplikacji (kod Lang, np. „pt-BR”, „zh-Hant”). Opcjonalne: stan zapisany bez pola (starsza wersja) dekoduje się jako nil → widżet używa
    /// języka systemu jak dawniej (bez podbicia wersji stanu — zgodność wsteczna).
    public var lang: String?
    public init(endAt: Date, totalSec: Int, subtitle: String, lang: String? = nil) { self.endAt = endAt; self.totalSec = totalSec; self.subtitle = subtitle; self.lang = lang }
  }
  public var title: String
  public var kind: String // "rest" | "set"
  public init(title: String, kind: String) { self.title = title; self.kind = kind }
}
