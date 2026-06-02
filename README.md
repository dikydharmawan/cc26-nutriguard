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
# seperti biasa
cd server
npm install
cp .env.example .env # isi yang perlu

# migration
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed # opsional

# finally akhirnya
npm run dev
```

---

## API Docs

Swagger: `/api/docs`
