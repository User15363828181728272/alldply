const axios  = require("axios");
const AdmZip = require("adm-zip");
const cfg    = require("../setting");

global._cloneCount = global._cloneCount || 0;

function allowed(req) {
    const key = req.headers["x-api-key"] || (req.headers["authorization"] || "").replace("Bearer ", "");
    if (!key) return true;
    return key === cfg.apiKey;
}

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key, Authorization");
    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")   return res.status(405).json({ ok: false, error: "Method not allowed" });
    if (!allowed(req))           return res.status(401).json({ ok: false, error: "API key tidak valid" });
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ ok: false, error: "Field url wajib diisi" });
        let target = url.startsWith("http") ? url : "https://" + url;
        new URL(target);
        const response = await axios.get(target, {
            timeout: 15000,
            headers: { "User-Agent": "Mozilla/5.0 (compatible; SBot/1.0)" },
            responseType: "text"
        });
        const html = response.data;
        const zip  = new AdmZip();
        zip.addFile("index.html", Buffer.from(html, "utf8"));
        const assetRegex = /(?:href|src)=["']([^"']+\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf))["']/gi;
        let match;
        const fetched = new Set();
        const base    = new URL(target);
        while ((match = assetRegex.exec(html)) !== null) {
            try {
                const rawHref = match[1];
                if (rawHref.startsWith("//")) continue;
                const assetUrl = rawHref.startsWith("http") ? rawHref : `${base.origin}/${rawHref.replace(/^\//, "")}`;
                if (fetched.has(assetUrl)) continue;
                fetched.add(assetUrl);
                const assetRes = await axios.get(assetUrl, {
                    timeout: 8000,
                    responseType: "arraybuffer",
                    headers: { "User-Agent": "Mozilla/5.0" }
                });
                const filename = rawHref.replace(/^\//, "").replace(/[?#].*$/, "") || "asset";
                zip.addFile(filename, Buffer.from(assetRes.data));
            } catch {}
        }
        global._cloneCount++;
        const buffer = zip.toBuffer();
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${base.hostname}.zip"`);
        res.setHeader("Content-Length", buffer.length);
        return res.status(200).send(buffer);
    } catch (e) {
        if (e.code === "ERR_INVALID_URL") return res.status(400).json({ ok: false, error: "URL tidak valid" });
        return res.status(500).json({ ok: false, error: e.message?.slice(0, 200) || "Clone gagal" });
    }
};
