import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ScreenCapture from 'expo-screen-capture';
import { useEffect, useState, useRef } from 'react';
import config from './config';

export default function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 🔒 1. إعدادات الحماية (Anti-Screenshot)
        const setupSecurity = async () => {
            if (config.preventScreenshots) {
                // Android: يمنع أخذ سكرين شوت (شاشة سوداء)
                // iOS: يمنع تسجيل الشاشة (Screen Recording)
                await ScreenCapture.preventScreenCaptureAsync();
            }
        };

        setupSecurity();

        // تنظيم (Cleanup) عند الخروج
        return () => {
            // يمكننا إعادة السماح بالتصوير لو أردنا
            // ScreenCapture.allowScreenCaptureAsync(); 
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" backgroundColor={config.primaryColor} />

            <WebView
                source={{ uri: config.startUrl }}
                style={styles.webview}

                // 🌐 إعدادات المتصفح
                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}

                // 🕵️‍♂️ معرف المتصفح
                userAgent="Ta3leemyApp/1.0 (Mobile/RN)"

                // مؤشر التحميل
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}

                // التعامل مع الروابط
                onShouldStartLoadWithRequest={(request) => {
                    // يمكن إضافة منطق لفتح روابط واتساب وغيرها
                    return true;
                }}
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={config.primaryColor} />
                    <Text style={{ marginTop: 10, color: '#555' }}>جار التحميل...</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? 30 : 0
    },
    webview: {
        flex: 1,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99
    }
});
