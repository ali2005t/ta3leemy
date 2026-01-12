export default async function handler(req, res) {
    // 1. Enable CORS (Allow requests from your website)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // 2. Handle Preflight Options Request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { target } = req.query; // e.g., ?target=https://onesignal.com/api/v1/notifications

        if (!target) {
            return res.status(400).json({ error: "Missing 'target' query parameter" });
        }

        // 3. Forward the request to the real server (OneSignal)
        const response = await fetch(target, {
            method: req.method,
            headers: req.headers, // Pass through Auth headers
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();

        // 4. Return the result back to the browser
        res.status(response.status).json(data);

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ error: "Proxy Failed", details: error.message });
    }
}
