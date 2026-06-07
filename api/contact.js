function readJsonBody(req) {
    if (typeof req.body === 'string') {
        try {
            return JSON.parse(req.body);
        } catch (error) {
            return null;
        }
    }
    if (req.body && typeof req.body === 'object') {
        return req.body;
    }
    return null;
}

function normalizeText(value, maxLength) {
    if (typeof value !== 'string') {
        return '';
    }
    return value.trim().slice(0, maxLength);
}

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, message: 'Method not allowed' });
    }

    const payload = readJsonBody(req);
    if (!payload) {
        return res.status(400).json({ ok: false, message: 'Invalid request body' });
    }

    const name = normalizeText(payload.name, 120);
    const email = normalizeText(payload.email, 160);
    const message = normalizeText(payload.message, 5000);
    const botcheck = normalizeText(payload.botcheck, 50);

    if (botcheck) {
        return res.status(400).json({ ok: false, message: 'Spam detected' });
    }

    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, message: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ ok: false, message: 'Invalid email' });
    }

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
        return res.status(500).json({ ok: false, message: 'Server is not configured' });
    }

    const formData = new URLSearchParams();
    formData.append('access_key', accessKey);
    formData.append('subject', 'New Request to Andrea Lombardo from Travel Website');
    formData.append('from_name', 'Travel Web Site - Andrea Lombardo');
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);
    formData.append('botcheck', '');

    try {
        const web3Response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Accept: 'application/json'
            },
            body: formData.toString()
        });

        const result = await web3Response.json().catch(function () {
            return { success: false, message: 'Invalid response from provider' };
        });

        if (!web3Response.ok || !result.success) {
            return res.status(502).json({
                ok: false,
                message: result.message || 'Unable to send message right now'
            });
        }

        return res.status(200).json({ ok: true, message: 'Message sent successfully' });
    } catch (error) {
        return res.status(500).json({ ok: false, message: 'Unexpected server error' });
    }
};
