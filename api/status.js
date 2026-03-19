const cfg = require("../setting");

module.exports = (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") return res.status(200).end();
    return res.status(200).json({
        ok:     true,
        deploy: global._deployCount || 0,
        clone:  global._cloneCount  || 0,
        rating: global._ratingCount || 0,
        uptime: Math.floor((Date.now() - cfg.startTime) / 1000),
    });
};
