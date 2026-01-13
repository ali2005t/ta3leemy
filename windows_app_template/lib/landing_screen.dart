import 'package:flutter/material.dart';
import 'package:webview_windows/webview_windows.dart';
import 'config.dart';

class LandingScreen extends StatefulWidget {
  const LandingScreen({super.key});

  @override
  State<LandingScreen> createState() => _LandingScreenState();
}

class _LandingScreenState extends State<LandingScreen> {
  final _controller = WebviewController();
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    initWebview();
  }

  Future<void> initWebview() async {
    try {
      await _controller.initialize();
      
      // 🕵️‍♂️ User Agent مخصص عشان نعرف إنه برنامج كمبيوتر
      await _controller.setUserAgent("Ta3leemyApp/1.0 (Windows Desktop)");
      
      await _controller.loadUrl(AppConfig.startUrl);

      // الاستماع لتغيير الرابط (عشان لو حب يفتح لينك خارجي)
      _controller.url.listen((url) {
        // ممكن نضيف منطق هنا لفتح لينكات معينة في المتصفح الخارجي
      });

      if (mounted) {
        setState(() {
          _isInitialized = true;
        });
      }
    } catch (e) {
      print("Error initializing WebView: $e");
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(AppConfig.appName),
        backgroundColor: AppConfig.primaryColor,
        foregroundColor: Colors.white,
        elevation: 2,
        actions: [
            IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () => _controller.reload(),
            ),
            IconButton(
                icon: const Icon(Icons.home),
                onPressed: () => _controller.loadUrl(AppConfig.startUrl),
            ),
        ],
      ),
      body: Center(
        child: _isInitialized
            ? Webview(
                _controller,
                permissionRequested: _onPermissionRequested,
              )
            : CircularProgressIndicator(color: AppConfig.primaryColor),
      ),
    );
  }

  Future<WebviewPermissionDecision> _onPermissionRequested(
      String url, WebviewPermissionKind kind, bool isUserInitiated) async {
    final decision = await showDialog<WebviewPermissionDecision>(
      context: context,
      builder: (BuildContext context) => AlertDialog(
        title: const Text('طلب إذن'),
        content: Text('الموقع يطلب إذن: $kind\nهل توافق؟'),
        actions: <Widget>[
          TextButton(
            onPressed: () =>
                Navigator.pop(context, WebviewPermissionDecision.deny),
            child: const Text('رفض'),
          ),
          TextButton(
            onPressed: () =>
                Navigator.pop(context, WebviewPermissionDecision.allow),
            child: const Text('سماح'),
          ),
        ],
      ),
    );

    return decision ?? WebviewPermissionDecision.deny;
  }
}
