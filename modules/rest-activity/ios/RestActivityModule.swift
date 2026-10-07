import ExpoModulesCore
import ActivityKit

public class RestActivityModule: Module {
  public func definition() -> ModuleDefinition {
    Name("RestActivity")

    // staleDate = koniec odliczania: po czasie system oznacza aktywność jako nieaktualną zamiast trzymać 0:00 godzinami.
    Function("isSupported") { () -> Bool in
      if #available(iOS 16.2, *) { return ActivityAuthorizationInfo().areActivitiesEnabled }
      return false
    }

    AsyncFunction("start") { (title: String, subtitle: String, endAtMs: Double, totalSec: Int, kind: String) -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      // Jedna aktywność naraz: zakończ poprzednie zanim wystartujesz nową.
      for a in Activity<RestTimerAttributes>.activities { await a.end(nil, dismissalPolicy: .immediate) }
      let attrs = RestTimerAttributes(title: title, kind: kind)
      let state = RestTimerAttributes.ContentState(endAt: Date(timeIntervalSince1970: endAtMs / 1000), totalSec: totalSec, subtitle: subtitle)
      do {
        _ = try Activity.request(attributes: attrs, content: .init(state: state, staleDate: state.endAt), pushType: nil)
        return true
      } catch { return false }
    }

    AsyncFunction("update") { (subtitle: String, endAtMs: Double, totalSec: Int) -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      let state = RestTimerAttributes.ContentState(endAt: Date(timeIntervalSince1970: endAtMs / 1000), totalSec: totalSec, subtitle: subtitle)
      var any = false
      for a in Activity<RestTimerAttributes>.activities { await a.update(.init(state: state, staleDate: state.endAt)); any = true }
      return any
    }

    AsyncFunction("end") { () -> Bool in
      guard #available(iOS 16.2, *) else { return false }
      var any = false
      for a in Activity<RestTimerAttributes>.activities { await a.end(nil, dismissalPolicy: .immediate); any = true }
      return any
    }
  }
}
