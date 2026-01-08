
// assets/js/push-service.js

// CONFIGURATION
const ONESIGNAL_APP_ID = "3dd814ae-df51-4396-8aca-0877931b7b5f";
const ONESIGNAL_API_KEY = "os_v2_app_hxmbjlw7kfbzncwkbb3zgg33l44df4iw34se7xfnpoq3brk2p73te76zl5knyxz4keswlk5kw6cqae54ne5ivxtdhw3gvk7trt63zra";

export const PushService = {

    /**
     * Send Notification to Specific Users by External ID (Firebase UID)
     * @param {string[]} userIds - Array of Firebase UIDs
     * @param {string} title - Notification Title
     * @param {string} message - Notification Body
     * @param {object} data - Custom data (e.g., { url: '...' })
     */
    async sendToUsers(userIds, title, message, data = {}) {
        if (!userIds || userIds.length === 0) return;

        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Basic ${ONESIGNAL_API_KEY}`
        };

        const payload = {
            app_id: ONESIGNAL_APP_ID,
            include_external_user_ids: userIds, // Legacy OneSignal
            // For new OneSignal, might use filters on tags: 
            // filters: [{ field: "tag", key: "firebase_uid", relation: "=", value: "UID" }] 
            // BUT strict targeting by tag is safer given our setup.
            filters: userIds.map(uid => ({ field: "tag", key: "firebase_uid", relation: "=", value: uid, operator: "OR" })),

            headings: { en: title, ar: title },
            contents: { en: message, ar: message },
            data: data
        };

        // If simple array includes didn't work, we use the Tag Filter logic above.
        // Let's refine the filter construction:
        /*
        filters: [
            { field: "tag", key: "firebase_uid", relation: "=", value: "UID1" },
            { operator: "OR" },
            { field: "tag", key: "firebase_uid", relation: "=", value: "UID2" }
        ]
        */

        // Single user optimization
        if (userIds.length === 1) {
            payload.filters = [{ field: "tag", key: "firebase_uid", relation: "=", value: userIds[0] }];
        } else {
            // Construct OR chain
            let filters = [];
            userIds.forEach((uid, index) => {
                if (index > 0) filters.push({ operator: "OR" });
                filters.push({ field: "tag", key: "firebase_uid", relation: "=", value: uid });
            });
            payload.filters = filters;
        }


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
     * Send Notification to All Students of a Teacher
     * @param {string} teacherId - The Teacher's ID
     * @param {string} title 
     * @param {string} message 
     */
    async sendToTeacherStudents(teacherId, title, message) {
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Basic ${ONESIGNAL_API_KEY}`
        };

        const payload = {
            app_id: ONESIGNAL_APP_ID,
            filters: [
                { field: "tag", key: "teacher_context", relation: "=", value: teacherId },
                { operator: "AND" },
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
