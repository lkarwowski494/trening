import ExpoModulesCore

/// Aktywuje WCSession już przy starcie procesu — także wtedy, gdy zegarek wybudził aplikację w tle (sendMessage), zanim ruszy JavaScript.
public class WatchLinkAppDelegate: ExpoAppDelegateSubscriber {
  public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
    WatchLinkHub.shared.activate()
    return true
  }
}
