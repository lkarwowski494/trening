import SwiftUI

// Ekrany zegarka (widok = clientView z modelu referencyjnego). Wszystkie elementy mają stabilne identyfikatory (accessibilityIdentifier) dla XCUITest
// niezależne od języka; czcionki systemowe (Dynamic Type), przewijanie przy długich tekstach (fiński, niemiecki), etykiety VoiceOver = widoczne teksty.

struct RootView: View {
  @ObservedObject var store: WatchStore
  @Environment(\.isLuminanceReduced) private var dim

  var body: some View {
    TimelineView(.periodic(from: .now, by: 1)) { ctx in
      let nowMs = ctx.date.timeIntervalSince1970 * 1000
      let v = store.view(at: nowMs)
      content(v, nowMs: nowMs)
        // Pasek znaczników rezerwuje miejsce nad treścią (101-20): jako overlay „Trening wstrzymany” nachodził na nagłówek „Przerwa”.
        .safeAreaInset(edge: .top, alignment: .trailing, spacing: 0) { badges(v) }
        #if DEBUG
        .overlay(alignment: .bottomLeading) {
          Color.clear.frame(width: 1, height: 1)
            .accessibilityElement().accessibilityLabel("pending \(store.state.queue.count)").accessibilityIdentifier("watch.debug.pending")
        }
        #endif
    }
    .opacity(dim ? 0.7 : 1)
  }

  @ViewBuilder private func content(_ v: ClientView, nowMs: Double) -> some View {
    if v.confirmSkip {
      ConfirmSkipView(store: store, title: v.title)
    } else {
      switch v.screen {
      case .idle: MessageView(symbol: "iphone", text: store.label(.idle), id: "watch.idle")
      case .set: SetView(store: store, v: v)
      case .rest: RestView(store: store, v: v, nowMs: nowMs)
      case .done: MessageView(symbol: "iphone", text: store.label(.finishOnPhone), id: "watch.nothing") /* identyfikator zostaje (testy interfejsu) */
      case .connect: MessageView(symbol: "iphone.slash", text: store.label(.connect), id: "watch.connect")
      case .finished: MessageView(symbol: "flag.checkered", text: store.label(.finished), id: "watch.finished")
      case .update: MessageView(symbol: "arrow.down.circle", text: store.label(.update), id: "watch.update")
      }
    }
  }

  private func badges(_ v: ClientView) -> some View {
    HStack(spacing: 4) {
      if v.offline {
        Image(systemName: "iphone.slash").accessibilityLabel(store.label(.connect)).accessibilityIdentifier("watch.offline")
      }
      if v.paused {
        Text(store.label(.pause)).accessibilityIdentifier("watch.paused")
      }
      if store.sessionActive {
        Image(systemName: "figure.strengthtraining.traditional").foregroundStyle(.green)
          .accessibilityLabel(store.label(.workoutOn)).accessibilityIdentifier("watch.session")
      }
    }
    .font(.caption2)
  }
}

struct MessageView: View {
  let symbol: String
  let text: String
  let id: String
  var body: some View {
    VStack(spacing: 8) {
      Image(systemName: symbol).font(.title2).accessibilityHidden(true)
      Text(text).font(.headline).multilineTextAlignment(.center).minimumScaleFactor(0.8)
    }
    .accessibilityElement(children: .combine)
    .accessibilityIdentifier(id)
  }
}

/// Gest podwójnego stuknięcia istnieje od watchOS 11; minimum aplikacji to watchOS 10, więc modyfikator jest tylko w gałęzi `#available`
/// (tests/watch-availability.test.ts pilnuje, żeby żadne API z watchOS 11 nie wystąpiło poza taką osłoną). Na watchOS 10 przycisk działa bez gestu.
private struct DoubleTapShortcut: ViewModifier {
  func body(content: Content) -> some View {
    if #available(watchOS 11, *) { content.handGestureShortcut(.primaryAction) } else { content }
  }
}

/// Przycisk główny: „Seria zrobiona”; w trakcie pomiaru serii na czas (telefon mierzy) — „Zakończ serię”, ta sama nazwa co na telefonie (M3 ZM-05, docs/32 wz. 24).
/// Gest podwójnego stuknięcia (od watchOS 11) uruchamia dokładnie to samo.
struct PrimaryButton: View {
  @ObservedObject var store: WatchStore
  var measuring: Bool = false
  var body: some View {
    Button { store.press(.main) } label: {
      Text(store.label(measuring ? .finish : .done)).frame(maxWidth: .infinity).multilineTextAlignment(.center)
    }
    .buttonStyle(.borderedProminent)
    .modifier(DoubleTapShortcut())
    .accessibilityIdentifier("watch.primary")
  }
}

struct SetView: View {
  @ObservedObject var store: WatchStore
  let v: ClientView
  var body: some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 6) {
        if let g = v.group {
          Text(g).font(.caption2.weight(.bold)).padding(.horizontal, 6).background(.tint.opacity(0.3), in: Capsule())
            .accessibilityIdentifier("watch.group")
        }
        VStack(alignment: .leading, spacing: 2) {
          Text(v.title).font(.headline).lineLimit(3).minimumScaleFactor(0.8).accessibilityIdentifier("watch.title")
          Text(v.counter).font(.caption).foregroundStyle(.secondary).accessibilityIdentifier("watch.counter")
          Text(v.load).font(.title3.weight(.semibold)).minimumScaleFactor(0.6).lineLimit(2).accessibilityIdentifier("watch.load")
        }
        .accessibilityElement(children: .contain)
        if v.actions.contains(.done) {
          PrimaryButton(store: store, measuring: v.measuring)
          Button { store.press(.differ) } label: { Text(store.label(.differ)).frame(maxWidth: .infinity) }
            .accessibilityIdentifier("watch.differ")
        }
        if v.actions.contains(.skip) {
          Button { store.press(.skip) } label: { Text(store.label(.skip)).frame(maxWidth: .infinity) }
            .accessibilityIdentifier("watch.skip")
        }
        if v.actions.contains(.undo) {
          Button { store.press(.undo) } label: { Text(store.label(.undo)).frame(maxWidth: .infinity) }.accessibilityIdentifier("watch.undo")
        }
        if v.actions.isEmpty {
          Text(store.label(.connect)).font(.footnote.weight(.semibold)).accessibilityIdentifier("watch.connect")
        }
      }
    }
  }
}

struct RestView: View {
  @ObservedObject var store: WatchStore
  let v: ClientView
  let nowMs: Double

  var body: some View {
    ScrollView {
      VStack(spacing: 6) {
        if let end = v.restEndsAt {
          VStack(spacing: 0) {
            Text(store.label(.rest)).font(.caption2).foregroundStyle(.secondary)
            Text(timerInterval: Date(timeIntervalSince1970: nowMs / 1000)...Date(timeIntervalSince1970: end / 1000), countsDown: true, showsHours: false)
              .font(.system(.largeTitle, design: .rounded).weight(.bold)).monospacedDigit().minimumScaleFactor(0.6)
          }
          .accessibilityElement(children: .combine)
          .accessibilityIdentifier("watch.timer") // na elemencie połączonym: identyfikator dziecka ginie przy .combine
        }
        if let cue = v.cue, !cue.isEmpty {
          Text(cue).font(.footnote).multilineTextAlignment(.center).accessibilityIdentifier("watch.cue")
        }
        if v.actions.contains(.undo) {
          Button { store.press(.undo) } label: { Text(store.label(.undo)).frame(maxWidth: .infinity) }.accessibilityIdentifier("watch.undo")
        }
        if v.actions.contains(.done) {
          PrimaryButton(store: store, measuring: v.measuring)
        } else if v.busy {
          Text(store.label(.connect)).font(.footnote.weight(.semibold)).accessibilityIdentifier("watch.connect")
        } else {
          Text(store.label(.finishOnPhone)).font(.footnote.weight(.semibold)).multilineTextAlignment(.center).accessibilityIdentifier("watch.nothing")
        }
      }
    }
  }
}

struct ConfirmSkipView: View {
  @ObservedObject var store: WatchStore
  let title: String
  var body: some View {
    ScrollView {
      VStack(spacing: 8) {
        Text(store.label(.skipAsk)).font(.headline).multilineTextAlignment(.center).accessibilityIdentifier("watch.confirm.title")
        Text(title).font(.footnote).foregroundStyle(.secondary).multilineTextAlignment(.center)
        Button(role: .destructive) { store.press(.confirmSkip) } label: { Text(store.label(.skip)).frame(maxWidth: .infinity) }
          .accessibilityIdentifier("watch.confirm.skip")
        Button { store.press(.cancelSkip) } label: { Text(store.label(.cancel)).frame(maxWidth: .infinity) }
          .accessibilityIdentifier("watch.confirm.cancel")
      }
    }
  }
}
