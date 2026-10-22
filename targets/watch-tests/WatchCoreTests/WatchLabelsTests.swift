import XCTest
@testable import WatchCore

final class WatchLabelsTests: XCTestCase {
  func testTableHasAllThirtyFiveLanguagesAndAllKeys() {
    XCTAssertEqual(WatchLabels.table.count, 35)
    for (lang, labels) in WatchLabels.table {
      for key in WatchLabelKey.allCases {
        let v = labels[key.rawValue] ?? ""
        XCTAssertFalse(v.trimmingCharacters(in: .whitespaces).isEmpty, "\(lang).\(key.rawValue)")
      }
      XCTAssertEqual(Set(labels.keys), Set(WatchLabelKey.allCases.map { $0.rawValue }), lang)
    }
  }

  func testTableEqualsTheGeneratedLabelsFixture() throws {
    let labels = try JSONSerialization.jsonObject(with: Fixtures.data("labels.json", in: Fixtures.appleDir)) as! [String: [String: String]]
    XCTAssertEqual(labels, WatchLabels.table)
  }

  /// Etykiety wspólne z protokołem (watch-fixtures/labels/<język>.json, 35 języków) są w tabeli zegarka co do znaku — to samo widzi drugi zegarek.
  func testSharedLabelsEqualTheProtocolLabelFixtures() throws {
    for lang in WatchLabels.languages {
      let proto = try JSONSerialization.jsonObject(with: Fixtures.data("labels/\(lang).json")) as! [String: String]
      XCTAssertEqual(proto.count, 15, lang) /* M3 p6: doszło `finish` („Zakończ serię”) */
      for (id, text) in proto { XCTAssertEqual(WatchLabels.table[lang]?[id], text, "\(lang).\(id)") }
    }
  }

  /// M3 ZM-05: etykieta pomiaru jest w każdym języku i różni się od „Seria zrobiona” (dwie nazwy dwóch różnych stanów); po polsku „Zakończ serię”.
  func testFinishLabelExistsInEveryLanguageAndDiffersFromDone() {
    for lang in WatchLabels.languages {
      XCTAssertFalse(WatchLabels.text(.finish, lang: lang).isEmpty, lang)
      XCTAssertNotEqual(WatchLabels.text(.finish, lang: lang), WatchLabels.text(.done, lang: lang), lang)
    }
    XCTAssertEqual(WatchLabels.text(.finish, lang: "pl"), "Zakończ serię")
  }

  func testTextFallsBackToEnglishThenKey() {
    XCTAssertEqual(WatchLabels.text(.done, lang: "pl"), "Seria zrobiona")
    XCTAssertEqual(WatchLabels.text(.done, lang: "xx"), WatchLabels.text(.done, lang: "en"))
    XCTAssertEqual(WatchLabels.text(.undo, lang: "de"), "Rückgängig")
  }

  func testNothingLeftStartsWithACapitalLetter() {
    XCTAssertEqual(WatchLabels.text(.nothingLeft, lang: "pl"), "Nic więcej do zrobienia")
    XCTAssertEqual(WatchLabels.text(.nothingLeft, lang: "de"), "Nichts mehr zu tun")
    XCTAssertFalse(WatchLabels.text(.nothingLeft, lang: "ja").isEmpty)                 // pismo bez wielkich liter — bez zmian
  }

  func testResolveMatchesTheAppForEveryRecordedTag() throws {
    let cases = try JSONSerialization.jsonObject(with: Fixtures.data("lang-cases.json", in: Fixtures.appleDir)) as! [[String: String]]
    XCTAssertGreaterThan(cases.count, 30)
    for c in cases { XCTAssertEqual(WatchLabels.resolve(tag: c["tag"]!), c["lang"]!, c["tag"]!) }
  }

  func testResolvePicksFirstPreferredLanguage() {
    XCTAssertEqual(WatchLabels.resolve(preferred: ["pt-BR", "en"]), "pt-BR")
    XCTAssertEqual(WatchLabels.resolve(preferred: []), "en")
  }

  func testEveryAppLanguageIsAResolveResultForItsOwnCode() {
    for lang in WatchLabels.languages where !["es-419", "pt", "pt-BR", "zh-Hant"].contains(lang) { // pt → pt-BR, es-419 i zh-Hant to pełne tagi regionalne
      XCTAssertEqual(WatchLabels.resolve(tag: lang), lang)
    }
  }
}
