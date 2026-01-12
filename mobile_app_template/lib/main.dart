import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';
import 'config.dart';
import 'webview_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // طلب الأذونات الأساسية عند فتح التطبيق لأول مرة
  // Request permissions at startup
  await [
    Permission.camera,
    Permission.microphone,
    Permission.storage,
  ].request();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false, // إخفاء شريط Debug
      title: AppConfig.appName,
      theme: ThemeData(
        primaryColor: AppConfig.primaryColor,
        colorScheme: ColorScheme.fromSeed(seedColor: AppConfig.primaryColor),
        useMaterial3: true,
      ),
      home: const WebViewScreen(), // الشاشة الرئيسية هي الـ WebView
    );
  }
}
