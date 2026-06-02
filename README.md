# NutriGuard 🥗

Aplikasi pemindai label informasi nilai gizi berbasis AI untuk membantu pengguna membuat keputusan konsumsi yang lebih sehat.

## Struktur Project

```
NutriGuard/
├── client/     ← Frontend (React + Vite)
└── server/     ← Backend (Node.js + Express) — dikerjakan tim DSBE & AI
```

---

## Client (Frontend)

Dibangun dengan **React** dan **Vite**.

### Cara Menjalankan

```bash
cd client
npm install
npm run dev
```

### Cara Build

```bash
cd client
npm run build
```

---

## Server (Backend)

Dibangun dengan **Node.js** dan **Express**. Endpoint `/api/scan` akan diimplementasikan oleh tim Data Science & AI.

### Cara Menjalankan

```bash
cd server
npm install
npm start        # production
npm run dev      # development (nodemon)
```

### Environment Variables

Salin `.env.example` ke `.env` dan isi sesuai kebutuhan:

```bash
cp server/.env.example server/.env
```

---

## API Contract

### `POST /api/scan`

**Request:**
```json
{ "image": "<base64 string>" }
```

**Response (valid):**
```json
{
  "isValid": true,
  "productName": "Nama Produk",
  "resultStatus": "AMAN | WASPADA | BATASI",
  "confidence": "91.3%",
  "statusIcon": "✅ | ⚠️ | 🚫",
  "statusClass": "status-safe-header | status-warning-header | status-danger-header",
  "probabilities": { "aman": "91%", "waspada": "5%", "batasi": "4%" },
  "nutrients": [{ "key": "energi_total_kkal", "val": "380 kkal" }],
  "aiSuggestion": "Teks saran dari AI...",
  "saveValues": { "sodium": 120, "sugar": 5, "calorie": 380 }
}
```

**Response (tidak valid):**
```json
{ "isValid": false }
```
