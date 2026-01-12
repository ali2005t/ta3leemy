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
            const appId = data.oneSignalAppId;
            const apiKey = data.oneSignalApiKey;

            if (!appId || !apiKey) {
                console.warn(`Teacher ${teacherId} missing OneSignal keys`);
                return null;
            }
            return { appId, apiKey };
        } catch (e) {
            console.error("Key Fetch Error:", e);
            return null;
        }
    },

    /**
     * Send Notification to Specific Users (Student) of a specific Teacher
     * @param {string} teacherId - REQUIRED to find which App to send from
     * @param {string[]} userIds - Array of Firebase UIDs (Students)
     * @param {string} title 
     * @param {string} message 
     * @param {object} data 
     */
    async sendToUsers(teacherId, userIds, title, message, data = {}) {
        if (!userIds || userIds.length === 0) return;

        // 1. Get Keys
        const keys = await this.getTeacherKeys(teacherId);
        if (!keys) return; // Silent fail or throw

        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Basic ${keys.apiKey}`
        };

        const payload = {
            app_id: keys.appId,
            include_player_ids: [], // We use external_user_id (filters)

            // TARGETING: Match 'firebase_uid' tag specific to this App ID
            filters: userIds.map((uid, index) => {
                const f = { field: "tag", key: "firebase_uid", relation: "=", value: uid };
                return index === 0 ? f : [{ operator: "OR" }, f];
            }).flat(),

            headings: { en: title, ar: title },
            contents: { en: message, ar: message },
            data: data
        };

        try {
            const response = await fetch("https://onesignal.com/api/v1/notifications", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            console.log("Push Result:", result);
            return result;
        } catch (error) {
            console.error("Push Error:", error);
            return null;
        }
    },

    /**
     * Broadcast to ALL Students of a Teacher
     * @param {string} teacherId 
     * @param {string} title 
     * @param {string} message 
     */
    async sendToTeacherStudents(teacherId, title, message) {
        // 1. Get Keys
        const keys = await this.getTeacherKeys(teacherId);
        if (!keys) return;

        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Basic ${keys.apiKey}`
        };

        const payload = {
            app_id: keys.appId,
            // Tag filter: 'role' is 'student' (Simple broadcast for this App ID)
            // Since this App ID is EXCLUSIVE to this teacher, we just target all users with tag role=student
            filters: [
                { field: "tag", key: "role", relation: "=", value: "student" }
            ],
            headings: { en: title, ar: title },
            contents: { en: message, ar: message }
        };

        try {
            const response = await fetch("https://onesignal.com/api/v1/notifications", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            console.log("Broadcast Push Result:", result);
            return result;
        } catch (error) {
            console.error("Broadcast Push Error:", error);
        }
    }
};
