// swift-tools-version:5.9
import PackageDescription

// Logika zegarka (czysty Swift, bez SwiftUI/WatchKit) jako pakiet do `swift test` na macOS — bez symulatora, w minutach (docs/35-zegarek-apple).
// Te same pliki (watch-app/Core) kompiluje cel watchOS (apple-targets, TreningWatch). Pakiet leży w targets/, bo SwiftPM nie pozwala
// wskazać źródeł poza katalogiem pakietu, a katalog celu (watch-app) jest w całości kompilowany przez Xcode — testy muszą być obok.
// Uruchomienie: cd targets && swift test
let package = Package(
  name: "TreningWatchCore",
  platforms: [.macOS(.v14)], // testy na macOS; cel watchOS 10 ustawia projekt Xcode (SwiftPM 5.9 nie zna .watchOS(.v10))
  products: [.library(name: "WatchCore", targets: ["WatchCore"])],
  targets: [
    .target(name: "WatchCore", path: "watch-app/Core"),
    .testTarget(name: "WatchCoreTests", dependencies: ["WatchCore"], path: "watch-tests/WatchCoreTests"),
  ]
)
