import ExpoModulesCore

public class CiqLinkAppDelegateSubscriber: ExpoAppDelegateSubscriber {
  // Start SDK tylko dla sparowanego zegarka (CiqBridge.startIfPaired); dzięki temu iOS może obudzić aplikację w tle, gdy zegarek wyśle zdarzenie.
  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    CiqBridge.shared.startIfPaired()
    return true
  }

  // Powrót z aplikacji dostawcy zegarka po wyborze urządzeń (schemat URL zarejestrowany przez plugins/withConnectIq.js).
  public func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    return CiqBridge.shared.handleURL(url)
  }
}
