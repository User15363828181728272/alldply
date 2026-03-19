const AdmZip   = require("adm-zip");
const busboy   = require("busboy");
const axios    = require("axios");
const FormData = require("form-data");
const cfg      = require("../setting");

global._deployCount = global._deployCount || 0;

function allowed(req) {
    const key = req.headers["x-api-key"] || (req.headers["authorization"] || "").replace("Bearer ", "");
    if (!key) return true;
    return key === cfg.apiKey;
}

async function deployNetlify(siteName, fileBuf) {
    const token = cfg.netlifyToken;
    if (!token) throw new Error("netlifyToken belum dikonfigurasi di setting.js");
    let siteId;
    try {
        const r = await axios.post(
            "https://api.netlify.com/api/v1/sites",
            { name: siteName },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        siteId = r.data.id;
    } catch {
        const list = await axios.get("https://api.netlify.com/api/v1/sites", {
            headers: { Authorization: `Bearer ${token}` },
            params: { name: siteName }
        });
        const ex = list.data.find(s => s.name === siteName);
        if (!ex) throw new Error("Gagal membuat atau menemukan site Netlify");
        siteId = ex.id;
    }
    const dep = await axios.post(
        `https://api.netlify.com/api/v1/sites/${siteId}/deploys`,
        fileBuf,
        {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/zip" },
            maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 120000
        }
    );
    return { url: `https://${siteName}.netlify.app`, extra: { siteId, deployId: dep.data.id } };
}

async function deployVercel(siteName, fileBuf, zip) {
    const token = cfg.vercelToken;
    if (!token) throw new Error("vercelToken belum dikonfigurasi di setting.js");
    const entries = zip.getEntries();
    const files = [];
    for (const entry of entries) {
        if (entry.isDirectory) continue;
        files.push({ file: entry.entryName, data: entry.getData().toString("base64"), encoding: "base64" });
    }
    const r = await axios.post(
        "https://api.vercel.com/v13/deployments",
        { name: siteName, files, projectSettings: { framework: null }, target: "production" },
        {
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 120000
        }
    );
    const url = r.data.alias?.[0] ? `https://${r.data.alias[0]}` : `https://${r.data.url}`;
    return { url, extra: { deployId: r.data.id } };
}

async function deployCloudflarePages(siteName, fileBuf) {
    const token   = cfg.cloudflareToken;
    const account = cfg.cloudflareAccountId;
    if (!token || !account) throw new Error("cloudflareToken / cloudflareAccountId belum dikonfigurasi");
    try {
        await axios.post(
            `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects`,
            { name: siteName, production_branch: "main" },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
    } catch {}
    const form = new FormData();
    form.append("file", fileBuf, { filename: "dist.zip", contentType: "application/zip" });
    const r = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/${siteName}/deployments`,
        form,
        {
            headers: { ...form.getHeaders(), Authorization: `Bearer ${token}` },
            maxContentLength: Infinity, maxBodyLength: Infinity, timeout: 120000
        }
    );
    return { url: r.data.result?.url || `https://${siteName}.pages.dev`, extra: { deployId: r.data.result?.id } };
}

async function deployDeno(siteName, fileBuf, zip) {
    const token = cfg.denoToken;
    if (!token) throw new Error("denoToken belum dikonfigurasi di setting.js");
    let projectId;
    try {
        const r = await axios.post(
            "https://api.deno.com/v1/projects",
            { name: siteName },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        projectId = r.data.id;
    } catch {
        const r = await axios.get("https://api.deno.com/v1/projects", { headers: { Authorization: `Bearer ${token}` } });
        const ex = r.data.find(p => p.name === siteName);
        if (!ex) throw new Error("Gagal membuat project Deno");
        projectId = ex.id;
    }
    const assets = {};
    for (const e of zip.getEntries().filter(e => !e.isDirectory)) {
        assets[`/${e.entryName}`] = { kind: "file", content: e.getData().toString("utf8"), encoding: "utf-8" };
    }
    const r = await axios.post(
        `https://api.deno.com/v1/projects/${projectId}/deployments`,
        { assets, entryPointUrl: "/index.html" },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );
    const url = r.data.domainMappings?.[0]?.domain ? `https://${r.data.domainMappings[0].domain}` : `https://${siteName}.deno.dev`;
    return { url, extra: { deployId: r.data.id } };
}

const PLATFORMS = {
    netlify:    deployNetlify,
    vercel:     deployVercel,
    cloudflare: deployCloudflarePages,
    deno:       deployDeno,
};

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key, Authorization");
    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")   return res.status(405).json({ ok: false, error: "Method not allowed" });
    if (!allowed(req))           return res.status(401).json({ ok: false, error: "API key tidak valid" });
    try {
        const bb     = busboy({ headers: req.headers, limits: { fileSize: 50 * 1024 * 1024 } });
        const fields = {};
        let fileBuf  = null;
        await new Promise((resolve, reject) => {
            bb.on("field", (k, v) => { fields[k] = v; });
            bb.on("file",  (_k, stream) => {
                const chunks = [];
                stream.on("data", d => chunks.push(d));
                stream.on("end",  () => { fileBuf = Buffer.concat(chunks); });
            });
            bb.on("close", resolve);
            bb.on("error", reject);
            req.pipe(bb);
        });
        if (!fields.domain) return res.status(400).json({ ok: false, error: "Field domain wajib diisi" });
        if (!fileBuf)       return res.status(400).json({ ok: false, error: "File ZIP tidak ditemukan" });
        const platform = (fields.platform || "netlify").toLowerCase();
        const handler  = PLATFORMS[platform];
        if (!handler) return res.status(400).json({ ok: false, error: `Platform '${platform}' tidak didukung` });
        const siteName = fields.domain.toLowerCase().replace(/[^a-z0-9\-]/g, "");
        const zip      = new AdmZip(fileBuf);
        const result   = await handler(siteName, fileBuf, zip);
        global._deployCount++;
        return res.status(200).json({ ok: true, platform, url: result.url, message: "Deploy sukses", ...result.extra });
    } catch (e) {
        const msg = e.response?.data?.message || e.response?.data || e.message;
        return res.status(500).json({ ok: false, error: String(msg).slice(0, 300) });
    }
};