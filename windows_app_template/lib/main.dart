import 'package:flutter/material.dart';
import 'package:window_manager/window_manager.dart';
import 'config.dart';
import 'landing_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // 🪟 إعدادات النافذة (Desktop Window Setup)
  await windowManager.ensureInitialized();

  WindowOptions windowOptions = const WindowOptions(
    size: Size(1280, 800),
    minimumSize: Size(800, 600),
    center: true,
    backgroundColor: Colors.transparent,
    skipTaskbar: false,
    titleBarStyle: TitleBarStyle.normal,
  );
  
  windowManager.waitUntilReadyToShow(windowOptions, () async {
    await windowManager.show();
    await windowManager.focus();
  });

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: AppConfig.appName,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: AppConfig.primaryColor),
        useMaterial3: true,
      ),
      home: const LandingScreen(),
    );
  }
}
