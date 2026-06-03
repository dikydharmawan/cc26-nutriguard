# NutriGuard 🥗

Aplikasi pemindai label informasi nilai gizi berbasis AI untuk membantu pengguna membuat keputusan konsumsi yang lebih sehat.

## Struktur Project

```
NutriGuard/
├── client/     ← Frontend (React + Vite)
└── server/     ← Backend (Node.js + Express) — dikerjakan tim DSBE & AI
```

---

## 🚀 Cara Cepat (Quick Start)

Untuk memudahkan instalasi awal, Anda dapat menggunakan skrip otomatis `setup.sh`. Skrip ini akan melakukan setup file `.env`, menginstal dependensi (`npm install`) untuk *client* & *server*, serta melakukan inisialisasi schema *database* Prisma.

Jalankan perintah ini di terminal (pada folder root project):

```bash
# Beri hak akses eksekusi pada skrip
chmod +x setup.sh

# Jalankan skrip setup
./setup.sh
```

Setelah proses setup selesai, Anda tinggal menjalankan frontend dan backend di **dua terminal yang berbeda**:

**Terminal 1 (Frontend):**
```bash
cd client
npm run dev
```

**Terminal 2 (Backend):**
```bash
cd server
npm run dev
```

---

## 🛠 Cara Manual (Opsional)

Jika terjadi masalah dengan skrip otomatis, Anda dapat melakukan setup secara manual:

### Client (Frontend)

Dibangun dengan **React** dan **Vite**.

**Cara Menjalankan:**
```bash
cd client
npm install
npm run dev
```

**Cara Build:**
```bash
cd client
npm run build
```

### Server (Backend)

Dibangun dengan **Node.js** dan **Express**. Endpoint `/api/scan` akan diimplementasikan oleh tim Data Science & AI.

**Cara Menjalankan:**
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
