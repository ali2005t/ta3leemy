
// student-common.js
import { auth, db } from './firebase-config.js';
import { collection, query, where, orderBy, onSnapshot, limit, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
// Shared logic for all student pages (OneSignal, Branding, Theme)

// 1. OneSignal Initialization with Localhost Protection
window.OneSignalDeferred = window.OneSignalDeferred || [];
window.OneSignalDeferred.push(async function (OneSignal) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.warn('OneSignal disabled on localhost to prevent errors.');
        return;
    }
    // Only init if not already initialized
    if (!OneSignal.initialized) {
        await OneSignal.init({
            appId: "3dd814ae-df51-4396-8aca-0877931b7b5f", // Replace with your App ID
            safari_web_id: "web.onesignal.auto.xxxxx",
            notifyButton: { enable: true }
        });
    }
});

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

document.addEventListener('DOMContentLoaded', () => {
    applyBranding();
    initDesktopMenu();

    onAuthStateChanged(auth, (user) => {
        if (user) {
            initStudentNotifications(user.uid);
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
