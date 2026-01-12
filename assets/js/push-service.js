// assets/js/push-service.js
import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export const PushService = {

    /**
     * Helper: Fetch Teacher Credentials
     * @param {string} teacherId 
     */
    async getTeacherKeys(teacherId) {
        try {
            if (!teacherId) throw new Error("Teacher ID missing");
            const snap = await getDoc(doc(db, "teachers", teacherId));
            if (!snap.exists()) throw new Error("Teacher not found");

            const data = snap.data();
            const appId = data.oneSignalAppId ? data.oneSignalAppId.trim() : null;
            let apiKey = data.oneSignalApiKey ? data.oneSignalApiKey.trim() : null;

            if (!appId || !apiKey) {
                console.warn(`Teacher ${teacherId} missing OneSignal keys. Returning null.`);
                return null;
            }

            // Clean API Key
            if (apiKey.startsWith("Basic ")) {
                apiKey = apiKey.replace("Basic ", "").trim();
            }

            return { appId, apiKey };
        } catch (e) {
            console.error("Key Fetch Error:", e);
            return null;
        }
    },

    async sendToUsers(teacherId, userIds, title, message, data = {}) {
        if (!userIds || userIds.length === 0) return { success: false, error: "No users targeted" };

        // 1. Get Keys
        const keys = await this.getTeacherKeys(teacherId);
        if (!keys) return { success: false, error: "Missing OneSignal Keys in Teacher Profile" };

        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Basic ${keys.apiKey}`
        };

        const payload = {
            app_id: keys.appId,
            include_player_ids: [], // We use external_user_id (filters)
            filters: userIds.map((uid, index) => {
                const f = { field: "tag", key: "firebase_uid", relation: "=", value: uid };
                return index === 0 ? f : [{ operator: "OR" }, f];
            }).flat(),
            headings: { en: title, ar: title },
            contents: { en: message, ar: message },
            data: data
        };

        try {
            try {
                // PROXY WORKAROUND
                const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
                const targetUrl = "https://onesignal.com/api/v1/notifications";
                const finalUrl = proxyUrl + targetUrl;

                const response = await fetch(finalUrl, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(payload)
                });
                const result = await response.json();

                if (result.errors) {
                    console.error("Push API Error:", result.errors);
                    return { success: false, error: JSON.stringify(result.errors) };
                }

                console.log("Push Result:", result);
                return { success: true, result };

            } catch (error) {
                console.error("Push Network Error:", error);
                return { success: false, error: error.message };
            }
        },

    async sendToTeacherStudents(teacherId, title, message) {
            // 1. Get Keys
            const keys = await this.getTeacherKeys(teacherId);
            if (!keys) return { success: false, error: "Missing OneSignal Keys" };

            const headers = {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": `Basic ${keys.apiKey}`
            };

            const payload = {
                app_id: keys.appId,
                filters: [
                    { field: "tag", key: "role", relation: "=", value: "student" } // Broadcast to all students of this APP
                ],
                headings: { en: title, ar: title },
                contents: { en: message, ar: message }
            };

            try {
                // PROXY WORKAROUND: Force Proxy for ALL Browser Environments (Localhost & GitHub Pages)
                // OneSignal REST API does not support client-side CORS directly.
                const proxyUrl = "https://corsproxy.io/?";
                const targetUrl = "https://onesignal.com/api/v1/notifications";

                const response = await fetch(proxyUrl + encodeURIComponent(targetUrl), {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(payload)
                });

                // Note: response.ok check might be needed if proxy fails, but .json() usually handles it
                const result = await response.json();

                if (result.errors) {
                    console.error("Broadcast API Error:", result.errors);
                    return { success: false, error: JSON.stringify(result.errors) }; // Return fail details
                }

                console.log("Broadcast Push Result:", result);
                return { success: true, result };

            } catch (error) {
                console.error("Broadcast Push Network Error:", error);
                return { success: false, error: error.message };
            }
        }
    };
