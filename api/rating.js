const axios = require("axios");
const cfg   = require("../setting");

global._ratingCount = global._ratingCount || 0;

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST")   return res.status(405).json({ ok: false, error: "Method not allowed" });
    try {
        const { name, rating, message } = req.body;
        if (!name || !rating || !message) return res.status(400).json({ ok: false, error: "Semua field wajib diisi" });
        if (rating < 1 || rating > 5)     return res.status(400).json({ ok: false, error: "Rating harus 1-5" });
        const stars = "⭐".repeat(rating);
        const text  = `🌟 *Rating Baru - S-Deployment*\n\n👤 *Nama:* ${name}\n${stars} *Rating:* ${rating}/5\n💬 *Pesan:* ${message}\n\n🕐 ${new Date().toLocaleString("id-ID")}`;
        await axios.post(`https://api.telegram.org/bot${cfg.botToken}/sendMessage`, {
            chat_id: cfg.channelId, text, parse_mode: "Markdown"
        });
        global._ratingCount++;
        return res.status(200).json({ ok: true, message: "Rating terkirim" });
    } catch (e) {
        return res.status(500).json({ ok: false, error: e.message?.slice(0, 200) || "Gagal kirim rating" });
    }
};
