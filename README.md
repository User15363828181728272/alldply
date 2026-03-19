S-Deployment
==============
Tool deploy web otomatis ke 7 platform — Netlify, Vercel, Cloudflare Pages, Deno Deploy, Azure SWA, Stormkit, dan Koyeb.

Website: https://www.s-deployment.web.id
Channel: https://t.me/depstore11


INSTALASI
---------

  cd s-deployment
  npm install
  npm start

Server berjalan di http://localhost:3000


KONFIGURASI (setting.js)
------------------------
Isi token sesuai platform yang dipakai. Platform yang tokennya kosong tidak bisa digunakan.


CARA AMBIL TOKEN TIAP PLATFORM
-------------------------------

NETLIFY
  1. Buka https://app.netlify.com > Login
  2. Klik foto profil > User settings > Applications
  3. Scroll ke Personal access tokens > New access token
  4. Beri nama > Generate token > salin
  5. Tempel ke netlifyToken di setting.js

VERCEL
  1. Buka https://vercel.com/account/tokens
  2. Klik Create > isi nama > Scope: Full Account > Create Token
  3. Salin token (hanya muncul sekali!)
  4. Tempel ke vercelToken di setting.js

CLOUDFLARE PAGES
  Butuh 2 nilai: Token dan Account ID

  Ambil Account ID:
  1. Login ke https://dash.cloudflare.com
  2. Sidebar kanan > salin Account ID

  Buat API Token:
  1. https://dash.cloudflare.com/profile/api-tokens > Create Token
  2. Custom token > tambah permission: Account > Cloudflare Pages > Edit
  3. Create Token > salin
  4. Tempel ke cloudflareToken dan cloudflareAccountId di setting.js

DENO DEPLOY
  1. Buka https://dash.deno.com > Login dengan GitHub
  2. Foto profil > Account settings > Access Tokens
  3. New Access Token > beri nama > Create > salin
  4. Tempel ke denoToken di setting.js

AZURE STATIC WEB APPS
  Butuh 2 nilai: Token dan Endpoint URL

  1. Login ke https://portal.azure.com
  2. Buat resource: Static Web Apps > Create > isi form > Review + Create
  3. Buka resource yang dibuat > Overview > Manage deployment token
  4. Salin token > tempel ke azureToken
  5. Untuk azureEndpoint formatnya:
     https://<nama-app>.azurestaticapps.net/api/StaticSite
  6. Tempel ke azureEndpoint di setting.js

STORMKIT
  Butuh 3 nilai: Token, App ID, Environment ID

  1. Login ke https://app.stormkit.io
  2. Profile > API Tokens > Generate new token > salin ke stormkitToken
  3. Buka aplikasi kamu > lihat URL browser:
     https://app.stormkit.io/apps/[APP_ID]/environments/[ENV_ID]
  4. Salin APP_ID ke stormkitAppId dan ENV_ID ke stormkitEnvId

KOYEB
  1. Login ke https://app.koyeb.com
  2. Foto profil > User Settings > API > Create API access token
  3. Beri nama > pilih expiry > Create > salin
  4. Tempel ke koyebToken di setting.js

TELEGRAM BOT (untuk fitur Rating)
  Token dan Channel ID sudah terisi. Jika ingin ganti:

  Buat Bot:
  1. Chat @BotFather di Telegram > /newbot > ikuti instruksi > salin token

  Ambil Channel ID:
  1. Tambahkan bot ke channel sebagai admin
  2. Kirim pesan di channel
  3. Buka https://api.telegram.org/bot<TOKEN>/getUpdates
  4. Cari "chat":{"id":...} > salin angkanya (biasanya negatif)


API ENDPOINTS
-------------

  POST /api/deploy  — Deploy website
                      form-data: domain, platform, file (zip)
  POST /api/clone   — Clone website
                      JSON: { url }
  GET  /api/status  — Statistik server
  POST /api/rating  — Kirim rating
                      JSON: { name, rating, message }

Contoh curl:
  curl -X POST http://localhost:3000/api/deploy \
    -H "X-API-Key: SRNET727" \
    -F "domain=my-website" \
    -F "platform=vercel" \
    -F "file=@./dist.zip"

Platform tersedia: netlify, vercel, cloudflare, deno, azure, stormkit, koyeb


STRUKTUR PROJECT
----------------

  s-deployment/
  ├── api/
  │   ├── deploy.js
  │   ├── clone.js
  │   ├── status.js
  │   └── rating.js
  ├── public/
  │   ├── index.html
  │   ├── style.css
  │   └── app.js
  ├── index.js
  ├── setting.js
  ├── package.json
  └── README.md


CATATAN
-------
  - ZIP maksimal 50 MB
  - Node.js minimum v18
  - UI mendukung bahasa Inggris dan Indonesia (toggle di pojok kanan atas)
  - Preferensi bahasa tersimpan di localStorage


Made with love by @depstore11
https://www.s-deployment.web.id
