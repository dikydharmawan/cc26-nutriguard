# Gunakan image resmi Python (versi 3.10 cocok untuk TensorFlow dan FastAPI)
FROM python:3.10-slim

# Set environment variables agar log python langsung muncul dan tidak tertahan
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Mengatur cache direktori Numba (dibutuhkan oleh EasyOCR) ke /tmp agar tidak ada masalah permission
ENV NUMBA_CACHE_DIR=/tmp

# Menginstal dependensi sistem (OS) yang dibutuhkan oleh OpenCV (libgl1) dan EasyOCR
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Hugging Face Spaces mewajibkan container berjalan dengan user non-root (uid 1000)
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Atur direktori kerja ke dalam /home/user/app
WORKDIR $HOME/app

# Salin requirements.txt terlebih dahulu (memanfaatkan cache layer Docker)
COPY --chown=user requirements.txt .

# Instal dependensi Python
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Pre-download EasyOCR models (runs at build time to cache the model files)
RUN python -c "import easyocr; reader = easyocr.Reader(['id', 'en'], gpu=False)"

# Salin seluruh file project (main.py, nutriguard.keras, nutriguard_meta.pkl)
COPY --chown=user . .

# Ekspos port 7860 (Hugging Face Spaces mewajibkan aplikasi berjalan di port ini)
EXPOSE 7860

# Jalankan server menggunakan uvicorn di port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
