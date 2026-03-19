const I18N = {
    en: {
        "hero.badge":        "Web Automation Tool",
        "hero.title1":       "Deploy your website",
        "hero.title2":       "to 7 platforms",
        "hero.sub":          "Upload a ZIP file and go live in seconds. No config needed.",
        "stat.deploys":      "Deploys",
        "stat.clones":       "Clones",
        "stat.uptime":       "Uptime",
        "tab.deploy":        "Deploy",
        "tab.clone":         "Clone",
        "tab.rating":        "Rating",
        "deploy.platform":   "Platform",
        "deploy.sitename":   "Site Name",
        "deploy.sitename.ph":"my-website",
        "deploy.file":       "ZIP File",
        "deploy.file.hint":  "Click to select or drag & drop",
        "deploy.file.sub":   "ZIP only · max 50 MB",
        "deploy.btn":        "Deploy to Netlify",
        "deploy.result.label":"Live URL",
        "deploy.result.open":"Open ↗",
        "clone.url":         "Website URL",
        "clone.url.ph":      "https://example.com",
        "clone.btn":         "Get Source Code",
        "clone.result.label":"Download Ready",
        "clone.result.dl":   "Save ↓",
        "rating.name":       "Your Name",
        "rating.name.ph":    "Name or username",
        "rating.stars":      "Rating",
        "rating.msg":        "Message",
        "rating.msg.ph":     "Share your experience...",
        "rating.btn":        "Send Rating",
        "rating.result":     "Sent to Telegram!",
        "err.domain":        "Site name is required",
        "err.file":          "Please select a ZIP file",
        "err.filetype":      "File must be a .zip",
        "err.url":           "Please enter a website URL",
        "err.urlbad":        "Invalid URL",
        "err.rating":        "Please select a rating",
        "err.name":          "Name is required",
        "err.msg":           "Please write a message",
        "err.conn":          "Connection failed",
        "err.deploy":        "Deploy failed",
        "err.clone":         "Clone failed",
        "toast.deploy":      "Deployed!",
        "toast.clone":       "Clone complete!",
        "toast.rating":      "Rating sent!",
        "platform.badge":    "Platform:",
        "file.selected":     "file selected",
    },
    id: {
        "hero.badge":        "Alat Otomasi Web",
        "hero.title1":       "Deploy website kamu",
        "hero.title2":       "ke 7 platform",
        "hero.sub":          "Upload file ZIP dan langsung live dalam hitungan detik. Tanpa konfigurasi.",
        "stat.deploys":      "Deploy",
        "stat.clones":       "Clone",
        "stat.uptime":       "Uptime",
        "tab.deploy":        "Deploy",
        "tab.clone":         "Clone",
        "tab.rating":        "Rating",
        "deploy.platform":   "Platform",
        "deploy.sitename":   "Nama Site",
        "deploy.sitename.ph":"nama-website",
        "deploy.file":       "File ZIP",
        "deploy.file.hint":  "Klik untuk pilih atau drag & drop",
        "deploy.file.sub":   "Hanya ZIP · maks 50 MB",
        "deploy.btn":        "Deploy ke Netlify",
        "deploy.result.label":"URL Live",
        "deploy.result.open":"Buka ↗",
        "clone.url":         "URL Website",
        "clone.url.ph":      "https://contoh.com",
        "clone.btn":         "Ambil Source Code",
        "clone.result.label":"Siap Diunduh",
        "clone.result.dl":   "Simpan ↓",
        "rating.name":       "Nama Kamu",
        "rating.name.ph":    "Nama atau username",
        "rating.stars":      "Rating",
        "rating.msg":        "Pesan",
        "rating.msg.ph":     "Ceritakan pengalamanmu...",
        "rating.btn":        "Kirim Rating",
        "rating.result":     "Terkirim ke Telegram!",
        "err.domain":        "Nama site wajib diisi",
        "err.file":          "Pilih file ZIP terlebih dahulu",
        "err.filetype":      "File harus berformat .zip",
        "err.url":           "Masukkan URL website",
        "err.urlbad":        "URL tidak valid",
        "err.rating":        "Pilih rating terlebih dahulu",
        "err.name":          "Nama wajib diisi",
        "err.msg":           "Tulis pesan terlebih dahulu",
        "err.conn":          "Koneksi gagal",
        "err.deploy":        "Deploy gagal",
        "err.clone":         "Clone gagal",
        "toast.deploy":      "Deploy sukses!",
        "toast.clone":       "Clone selesai!",
        "toast.rating":      "Rating terkirim!",
        "platform.badge":    "Platform:",
        "file.selected":     "file dipilih",
    }
};

const PLATFORM_META = {
    netlify:    { label: "Netlify",          steps_en: ["Validating input","Uploading file","Extracting ZIP","Deploying to Netlify"],     steps_id: ["Validasi input","Upload file","Ekstrak ZIP","Deploy ke Netlify"]      },
    vercel:     { label: "Vercel",           steps_en: ["Validating input","Parsing files","Building project","Deploying to Vercel"],     steps_id: ["Validasi input","Parse file","Build project","Deploy ke Vercel"]       },
    cloudflare: { label: "Cloudflare Pages", steps_en: ["Validating input","Uploading ZIP","Init project","Deploying to CF Pages"],       steps_id: ["Validasi input","Upload ZIP","Init project","Deploy ke CF Pages"]      },
    deno:       { label: "Deno Deploy",      steps_en: ["Validating input","Parsing assets","Creating project","Deploying to Deno"],      steps_id: ["Validasi input","Parse aset","Buat project","Deploy ke Deno"]          },
    azure:      { label: "Azure SWA",        steps_en: ["Validating input","Compressing file","Pushing to Azure","Verifying deploy"],     steps_id: ["Validasi input","Kompresi file","Push ke Azure","Verifikasi deploy"]   },
    stormkit:   { label: "Stormkit",         steps_en: ["Validating input","Uploading archive","Init environment","Deploying to Stormkit"],steps_id: ["Validasi input","Upload arsip","Init environment","Deploy ke Stormkit"]},
    koyeb:      { label: "Koyeb",            steps_en: ["Validating input","Creating service","Pushing image","Deploying to Koyeb"],      steps_id: ["Validasi input","Buat service","Push image","Deploy ke Koyeb"]         },
};

let lang             = localStorage.getItem("sdeploy_lang") || "en";
let selectedPlatform = "netlify";
let selectedRating   = 0;
let activeTab        = "deploy";
const startTime      = Date.now();

function t(key) {
    return I18N[lang][key] || I18N.en[key] || key;
}

function applyLang() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (el.tagName === "BUTTON" || el.tagName === "SPAN" || el.tagName === "DIV" || el.tagName === "LABEL" || el.tagName === "A" || el.tagName === "P" || el.tagName === "H1") {
            el.textContent = t(key);
        }
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
    });
    document.getElementById("langLabel").textContent = lang.toUpperCase();
    updateDeployBtn();
    updateProgressSteps();
}

function toggleLang() {
    lang = lang === "en" ? "id" : "en";
    localStorage.setItem("sdeploy_lang", lang);
    applyLang();
}

function el(id) { return document.getElementById(id); }

function showErr(id, msg) {
    const e = el(id);
    e.textContent = msg;
    e.classList.add("show");
}
function clearErr(id) {
    const e = el(id);
    e.textContent = "";
    e.classList.remove("show");
}

function toast(msg, type) {
    const t = el("toast");
    t.textContent = msg;
    t.className   = "toast " + (type || "");
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
}

function switchTab(name) {
    activeTab = name;
    ["deploy","clone","rating"].forEach(n => {
        el("tab-" + n).classList.toggle("active", n === name);
        el("panel-" + n).classList.toggle("hidden", n !== name);
    });
}

function selectPlatform(p) {
    selectedPlatform = p;
    document.querySelectorAll(".plat").forEach(b => b.classList.toggle("active", b.dataset.platform === p));
    updateDeployBtn();
    updateProgressSteps();
}

function updateDeployBtn() {
    const meta = PLATFORM_META[selectedPlatform];
    const key  = lang === "id" ? "deploy.btn" : "deploy.btn";
    const label = lang === "id" ? `Deploy ke ${meta.label}` : `Deploy to ${meta.label}`;
    const btn  = el("btn-deploy-text");
    if (btn) btn.textContent = label;
}

function updateProgressSteps() {
    const meta  = PLATFORM_META[selectedPlatform];
    const steps = lang === "id" ? meta.steps_id : meta.steps_en;
    renderSteps("progress-steps", steps, -1);
}

function renderSteps(containerId, steps, activeIdx) {
    const c = el(containerId);
    if (!c) return;
    c.innerHTML = steps.map((s, i) => {
        let cls = "pstep";
        if (i === activeIdx) cls += " active";
        if (i < activeIdx)   cls += " done";
        return `<div class="${cls}"><div class="pstep-dot"></div><span>${s}</span></div>`;
    }).join("");
}

function animateProgress(stepsId, fillId, steps, ms) {
    return new Promise(resolve => {
        let i = 0;
        const fills = [10, 35, 65, 90, 100];
        const fill = el(fillId);
        if (fill) fill.style.width = fills[0] + "%";
        renderSteps(stepsId, steps, 0);
        const iv = setInterval(() => {
            i++;
            if (fill) fill.style.width = (fills[i] || 100) + "%";
            if (i < steps.length) {
                renderSteps(stepsId, steps, i);
            } else {
                renderSteps(stepsId, steps, steps.length);
                clearInterval(iv);
                resolve();
            }
        }, ms || 1000);
    });
}

function onFileChange(input) {
    const file = input.files[0];
    const drop = el("fileDrop");
    const text = el("fileDropText");
    if (file) {
        drop.classList.add("has-file");
        text.textContent = `${file.name} (${(file.size/1024).toFixed(0)} KB)`;
    } else {
        drop.classList.remove("has-file");
        text.textContent = t("deploy.file.hint");
    }
}

setInterval(() => {
    const ms = Date.now() - startTime;
    const h  = Math.floor(ms / 3600000);
    const m  = Math.floor((ms % 3600000) / 60000);
    const s  = Math.floor((ms % 60000) / 1000);
    const v  = el("hs-runtime");
    if (v) v.textContent = h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`;
}, 1000);

async function fetchStats() {
    try {
        const r = await fetch("/api/status");
        const d = await r.json();
        el("hs-deploy").textContent = d.deploy;
        el("hs-clone").textContent  = d.clone;
    } catch {}
}

async function startDeploy() {
    const domain = el("deploy-domain").value.trim();
    const file   = el("deploy-file").files[0];
    clearErr("error-deploy");
    el("result-deploy").style.display = "none";

    if (!domain) { showErr("error-deploy", t("err.domain")); return; }
    if (!file)   { showErr("error-deploy", t("err.file"));   return; }
    if (!file.name.endsWith(".zip")) { showErr("error-deploy", t("err.filetype")); return; }

    el("btn-deploy").disabled = true;
    const pw = el("progress-deploy");
    pw.style.display = "block";
    const meta  = PLATFORM_META[selectedPlatform];
    const steps = lang === "id" ? meta.steps_id : meta.steps_en;
    const stepProm = animateProgress("progress-steps", "progress-fill", steps, 1100);

    const form = new FormData();
    form.append("domain",   domain.toLowerCase().replace(/[^a-z0-9\-]/g, ""));
    form.append("platform", selectedPlatform);
    form.append("file",     file);

    try {
        const res  = await fetch("/api/deploy", { method: "POST", body: form });
        const data = await res.json();
        await stepProm;
        pw.style.display = "none";
        el("btn-deploy").disabled = false;

        if (!res.ok || !data.ok) {
            showErr("error-deploy", data.error || t("err.deploy"));
            toast(t("err.deploy"), "error");
            return;
        }

        el("res-deploy-url").textContent = data.url;
        el("res-deploy-url").href        = data.url;
        el("res-deploy-open").href       = data.url;
        el("res-deploy-platform").textContent = `${t("platform.badge")} ${meta.label}`;
        el("result-deploy").style.display = "flex";
        toast(t("toast.deploy"), "success");
        fetchStats();
    } catch {
        await stepProm;
        pw.style.display = "none";
        el("btn-deploy").disabled = false;
        showErr("error-deploy", t("err.conn"));
        toast(t("err.conn"), "error");
    }
}

async function startClone() {
    const url = el("clone-url").value.trim();
    clearErr("error-clone");
    el("result-clone").style.display = "none";

    if (!url) { showErr("error-clone", t("err.url")); return; }
    let target = url.startsWith("http") ? url : "https://" + url;
    try { new URL(target); } catch { showErr("error-clone", t("err.urlbad")); return; }

    el("btn-clone").disabled = true;
    const pw = el("progress-clone");
    pw.style.display = "block";

    const steps = lang === "id"
        ? ["Koneksi ke server","Crawling halaman","Download aset","Packing ZIP"]
        : ["Connecting to server","Crawling pages","Downloading assets","Packing ZIP"];
    const stepProm = animateProgress("progress-steps-clone", "progress-fill-clone", steps, 1200);

    try {
        const res = await fetch("/api/clone", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: target })
        });
        await stepProm;
        pw.style.display = "none";
        el("btn-clone").disabled = false;

        if (!res.ok) {
            const d = await res.json().catch(() => ({}));
            showErr("error-clone", d.error || t("err.clone"));
            toast(t("err.clone"), "error");
            return;
        }

        const blob   = await res.blob();
        const domain = new URL(target).hostname;
        const objUrl = URL.createObjectURL(blob);
        el("res-clone-url").href        = objUrl;
        el("res-clone-url").download    = `${domain}.zip`;
        el("res-clone-url").textContent = `${domain}.zip`;
        el("res-clone-dl").href         = objUrl;
        el("res-clone-dl").download     = `${domain}.zip`;
        el("res-clone-info").textContent = `${Math.round(blob.size / 1024)} KB`;
        el("result-clone").style.display = "flex";
        toast(t("toast.clone"), "success");
        fetchStats();
    } catch {
        await stepProm;
        pw.style.display = "none";
        el("btn-clone").disabled = false;
        showErr("error-clone", t("err.conn"));
        toast(t("err.conn"), "error");
    }
}

function selectRating(n) {
    selectedRating = n;
    document.querySelectorAll(".star-btn").forEach((b, i) => b.classList.toggle("active", i === n - 1));
}

async function submitRating() {
    const name = el("rating-name").value.trim();
    const msg  = el("feedback").value.trim();
    clearErr("error-rating");
    el("result-rating").style.display = "none";

    if (!selectedRating) { showErr("error-rating", t("err.rating")); return; }
    if (!name)           { showErr("error-rating", t("err.name"));   return; }
    if (!msg)            { showErr("error-rating", t("err.msg"));    return; }

    el("btn-rating").disabled    = true;
    el("btn-rating").textContent = lang === "id" ? "Mengirim..." : "Sending...";

    try {
        const res  = await fetch("/api/rating", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, rating: selectedRating, message: msg })
        });
        const data = await res.json();
        el("btn-rating").disabled    = false;
        el("btn-rating").textContent = t("rating.btn");

        if (!res.ok || !data.ok) { showErr("error-rating", data.error || t("err.conn")); return; }

        el("result-rating").style.display = "flex";
        el("feedback").value    = "";
        el("rating-name").value = "";
        selectedRating = 0;
        document.querySelectorAll(".star-btn").forEach(b => b.classList.remove("active"));
        toast(t("toast.rating"), "success");
    } catch {
        el("btn-rating").disabled    = false;
        el("btn-rating").textContent = t("rating.btn");
        showErr("error-rating", t("err.conn"));
    }
}

const fileDrop = el("fileDrop");
if (fileDrop) {
    fileDrop.addEventListener("dragover", e => { e.preventDefault(); fileDrop.classList.add("drag-over"); });
    fileDrop.addEventListener("dragleave", () => fileDrop.classList.remove("drag-over"));
    fileDrop.addEventListener("drop", e => {
        e.preventDefault();
        fileDrop.classList.remove("drag-over");
        const file = e.dataTransfer.files[0];
        if (file) {
            const input = el("deploy-file");
            const dt    = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            onFileChange(input);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyLang();
    fetchStats();
    setInterval(fetchStats, 30000);
});
