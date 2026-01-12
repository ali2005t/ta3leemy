import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  
  // 🔒 متغير لتغطية الشاشة (Blur View)
  var secureView: UIVisualEffectView?

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    
    // 🔒 مراقب لحالة التطبيق (App Lifecycle Security)
    NotificationCenter.default.addObserver(self, selector: #selector(appWillResignActive), name: UIApplication.willResignActiveNotification, object: null)
    NotificationCenter.default.addObserver(self, selector: #selector(appDidBecomeActive), name: UIApplication.didBecomeActiveNotification, object: null)

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // 🙈 عند الخروج من التطبيق (App Switcher): تغطية الشاشة
  @objc func appWillResignActive() {
    if let window = self.window {
        let blurEffect = UIBlurEffect(style: .dark)
        secureView = UIVisualEffectView(effect: blurEffect)
        secureView?.frame = window.bounds
        window.addSubview(secureView!)
    }
  }

  // 👀 عند العودة للتطبيق: إزالة الغطاء
  @objc func appDidBecomeActive() {
    secureView?.removeFromSuperview()
  }
}
