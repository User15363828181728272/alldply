const express = require("express");
const app     = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/api/deploy", require("./api/deploy"));
app.post("/api/clone",  require("./api/clone"));
app.get ("/api/status", require("./api/status"));
app.post("/api/rating", require("./api/rating"));

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`S-Deployment running on port ${PORT}`));
}

module.exports = app;