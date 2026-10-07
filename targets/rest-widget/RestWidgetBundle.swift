import SwiftUI
import WidgetKit

@main
struct RestWidgetBundle: WidgetBundle {
  var body: some Widget {
    RestLiveActivity()
    SummaryWidget() // 07.10.2026 wieczór: widżet na ekran główny (SummaryWidget.swift)
  }
}
