
// student-common.js
import { auth, db } from './firebase-config.js';
import { collection, query, where, orderBy, onSnapshot, limit, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Shared logic for all student pages (OneSignal, Branding, Theme)

// 1. OneSignal Initialization with Localhost Protection
window.OneSignalDeferred = window.OneSignalDeferred || [];
window.OneSignalDeferred.push(async function (OneSignal) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('OneSignal: Running on Localhost. Ensure you allow notifications.');
        // We do NOT return here anymore; we allow it to try init.
    }
    // Only init if not already initialized
    if (!OneSignal.initialized) {
        await OneSignal.init({
            appId: "3dd814ae-df51-4396-8aca-0877931b7b5f", // Replace with your App ID
            safari_web_id: "web.onesignal.auto.xxxxx",
            // notifyButton: { enable: true } // We will make our own custom UI
        });
    }

    // EXPLICIT PERMISSION REQUEST
    console.log("Requesting Permission...");

    // DEBUG: Force Button to check Median Status
    const debugBtn = document.createElement('button');
    debugBtn.innerText = "🔧 إعدادات الإشعارات (اضغط هنا)";
    debugBtn.style.cssText = "position:fixed; bottom:80px; left:20px; z-index:99999; background:red; color:white; padding:10px; border-radius:5px;";
    debugBtn.onclick = function () {
        alert("UA: " + navigator.userAgent);
        if (window.gonative) {
            alert("GoNative JS Found! Registering...");
            if (window.gonative.onesignal) window.gonative.onesignal.register();
            else window.location.href = 'gonative://onesignal/register';
        } else {
            alert("Not Native App? Trying Protocol...");
            window.location.href = 'gonative://onesignal/register';
        }
    };
    document.body.appendChild(debugBtn);

    // 1. Median/GoNative Usage
    // 1. Median/GoNative Usage
    if (navigator.userAgent.indexOf('gonative') > -1 || window.gonative) {
        console.log("Median App Detected: Triggering Native Registration");
        if (window.gonative && window.gonative.onesignal) {
            window.gonative.onesignal.register();
        } else {
            window.location.href = 'gonative://onesignal/register';
        }
    }
    // 2. Standard Browser Usage
    // Modern SDK
    OneSignal.Notifications.requestPermission();

    // Show Banner if not granted
    if (OneSignal.Notifications.permission !== "granted") {
        showNotificationBanner(OneSignal);
    }
} else {
    // Legacy
    OneSignal.showNativePrompt();
}
});

function showNotificationBanner(OneSignal) {
    const banner = document.createElement('div');
    banner.style.cssText = "position:fixed; bottom:0; left:0; width:100%; background:#6366f1; color:white; padding:15px; text-align:center; z-index:99999; box-shadow:0 -2px 10px rgba(0,0,0,0.2); display:flex; justify-content:center; align-items:center; gap:10px;";
    banner.innerHTML = `
        <span>🔔 لكي تصلك محاضراتك، يجب تفعيل الإشعارات.</span>
        <button id="enable-notif-btn" style="background:white; color:#6366f1; border:none; padding:5px 15px; border-radius:5px; font-weight:bold; cursor:pointer;">تفعيل الآن</button>
    `;
    document.body.appendChild(banner);

    document.getElementById('enable-notif-btn').addEventListener('click', async () => {
        await OneSignal.Notifications.requestPermission();
        if (OneSignal.Notifications.permission === "granted") {
            banner.remove();
            alert("تم التفعيل بنجاح! شكراً لك.");
        }
    });
}

// 2. Apply Branding from Session Storage
// This ensures sub-pages (Profile, Courses) still look like the Teacher's App
// 2. Apply Visual Branding (Colors/Title)
function applyBranding() {
    try {
        // Color Branding
        const cachedColor = sessionStorage.getItem('platformColor');
        if (cachedColor) {
            document.documentElement.style.setProperty('--app-primary', cachedColor);
        }

        const platformName = sessionStorage.getItem('platformName');
        if (platformName) {
            // Update Title if not already set
            if (!document.title.includes(platformName)) {
                document.title = platformName + ' - ' + document.title;
            }

            // If page has a generic header title, update it
            const headerTitle = document.getElementById('header-platform-title');
            if (headerTitle) {
                headerTitle.innerText = platformName;
            }
        }

    } catch (e) {
        console.error("Branding Error", e);
    }
}

// 3. Desktop Menu Toggle Logic
function initDesktopMenu() {
    // Check if we are on desktop (simple check, or just run it and let CSS hide it)
    if (!document.getElementById('desktop-menu-btn')) {

        // Create Toggle Button
        const btn = document.createElement('button');
        btn.id = 'desktop-menu-btn';
        btn.innerHTML = '<i class="fas fa-bars"></i>';
        btn.style.display = 'none'; // CSS will show it on desktop
        // Note: Styles are in student-desktop.css

        // Create Overlay
        const overlay = document.createElement('div');
        overlay.id = 'sidebar-overlay';
        // Ensure z-index is correct via JS or rely on CSS
        // The CSS handles z-index: 1900.


        document.body.appendChild(btn);
        document.body.appendChild(overlay);

        // Event Listeners
        const nav = document.querySelector('.bottom-nav');

        function toggleMenu() {
            if (!nav) return;
            nav.classList.toggle('sidebar-open');
            overlay.classList.toggle('active');

            // Icon Toggle
            const isOpen = nav.classList.contains('sidebar-open');
            btn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        }

        btn.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    applyBranding();
    initDesktopMenu();

    // --- AUTO-RESTORE SESSION (Median Fix) ---
    // If Auth state is taking too long or null, check local storage for credentials
    // This fixes the "Logged out on App Restart" issue.
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            console.log("Auth State: Logged In", user.uid);
            initStudentNotifications(user.uid);
        } else {
            console.log("Auth State: Null. checking backup...");
            const storedAuth = localStorage.getItem('median_auth_data');
            if (storedAuth) {
                try {
                    const creds = JSON.parse(storedAuth);
                    if (creds.email && creds.secret) {
                        console.log("Attempting Silent Re-Login...");
                        // Import SignIn dynamically or use global if available.
                        // Since 'auth' is imported, we need signInWithEmailAndPassword
                        const { signInWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");

                        await signInWithEmailAndPassword(auth, creds.email, atob(creds.secret));
                        console.log("Silent Re-Login Successful!");
                        // onAuthStateChanged will trigger again with 'user'
                    }
                } catch (e) {
                    console.error("Silent Re-Login Failed", e);
                }
            } else {
                console.log("No backup credentials found.");
                // Optionally redirect to login?
                // window.location.href = '../auth/login.html'; 
                // But this file is common, might be used on public pages? 
                // If it's the student app index, it has its own redirect checks?
                // Actually student-home.js doesn't check auth.
                // So we SHOULD probably redirect if this is a protected page.
                // But let's be safe and let the page logic handle it specifically if it wants data.
            }
        }
    });
});

let unsubNotif = null;
function initStudentNotifications(uid) {
    if (unsubNotif) unsubNotif();

    // Listen for: Specific User OR All Students OR All Users
    const q = query(
        collection(db, "notifications"),
        where("target", "in", [uid, "all_students", "all"]),
        orderBy("createdAt", "desc"),
        limit(10)
    );

    unsubNotif = onSnapshot(q, (snapshot) => {
        // Just log for now, or show a toast?
        // Ideally we should have a bell icon in student app too.
        // For now, let's just make sure we capture them.
        // We can show a simple "Toast" for new ones.

        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                // Check if recent (< 10s) to avoid showing old on load
                const notifTime = data.createdAt ? data.createdAt.toDate() : new Date();
                if (Date.now() - notifTime.getTime() < 10000) {
                    showToast(data.title, data.body);
                }
            }
        });
    });
}

function showToast(title, body) {
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: #1e293b; color: white; padding: 12px 20px; borderRadius: 8px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2); z-index: 1000; display: flex; flex-direction: column;
        min-width: 300px; animation: slideUpToast 0.3s ease;
    `;
    div.innerHTML = `<strong style="font-size:0.9rem; margin-bottom:4px; color:#60a5fa;">${title}</strong><span style="font-size:0.8rem;">${body}</span>`;

    document.body.appendChild(div);

    // Slide Up Animation
    const style = document.createElement('style');
    style.textContent = `@keyframes slideUpToast { from { transform: translate(-50%, 20px); opacity:0; } to { transform: translate(-50%, 0); opacity:1; } }`;
    document.head.appendChild(style);

    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transition = 'opacity 0.5s';
        setTimeout(() => div.remove(), 500);
    }, 4000);
}
