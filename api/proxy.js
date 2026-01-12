export default async function handler(req, res) {
    // 1. Enable CORS
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
        const { target } = req.query;

        if (!target) {
            return res.status(400).json({ error: "Missing 'target' query parameter" });
        }

        // 3. Construct Headers for the Outgoing Request
        // Node.js http request headers are lower-case.
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        const contentType = req.headers['content-type'] || 'application/json';

        const outputHeaders = {
            'Content-Type': contentType,
            'Authorization': authHeader // Forward the key securely
        };

        // 4. Forward to OneSignal
        const response = await fetch(target, {
            method: req.method,
            headers: outputHeaders,
            body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
        });

        const data = await response.json();

        // 5. Return the result
        res.status(response.status).json(data);

    } catch (error) {
        console.error("Proxy Error:", error);
        res.status(500).json({ error: "Proxy Failed", details: error.message });
    }
}
