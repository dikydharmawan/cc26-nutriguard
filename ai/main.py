import os
import re
import cv2
import pickle
import base64
import numpy as np
import easyocr
import tensorflow as tf
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Inisialisasi FastAPI
app = FastAPI(
    title="NutriGuard Inference API",
    description="API untuk klasifikasi asupan gizi berdasarkan scan tabel nutrisi",
    version="1.0.0"
)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Perbaikan Custom Layer NutriAttention (Sesuai dengan file training asli)
@tf.keras.utils.register_keras_serializable(package="CustomLayers")
class NutriAttention(tf.keras.layers.Layer):
    def __init__(self, units: int = 16, **kwargs):
        super().__init__(**kwargs)
        self.units = units

    def build(self, input_shape):
        n_feat = input_shape[-1]
        self.W_attn = self.add_weight(
            name='W_attn', shape=(n_feat, self.units),
            initializer='glorot_uniform', trainable=True)
        self.b_attn = self.add_weight(
            name='b_attn', shape=(self.units,),
            initializer='zeros', trainable=True)
        self.W_out  = self.add_weight(
            name='W_out', shape=(self.units, n_feat),
            initializer='glorot_uniform', trainable=True)
        super().build(input_shape)

    def call(self, x, training=False):
        score = tf.nn.sigmoid(tf.matmul(tf.nn.tanh(tf.matmul(x, self.W_attn) + self.b_attn), self.W_out))
        return x * score

    def get_config(self):
        cfg = super().get_config()
        cfg.update({'units': self.units})
        return cfg

# Model skema input untuk menerima data Base64 sesuai kontrak API
class ScanRequest(BaseModel):
    image: str

# Global variables
model = None
scaler_mean = None
scaler_scale = None
median_imputation = None
reader = None

NUTRITION_KEYS = [
    'energi_total_kkal', 'lemak_total_g', 'lemak_jenuh_g', 'lemak_trans_g',
    'kolesterol_mg', 'karbohidrat_g', 'serat_g', 'gula_g', 'protein_g', 'natrium_mg'
]

CATEGORIES = ['Aman', 'Waspada', 'Batasi']

@app.on_event("startup")
async def startup_event():
    global model, scaler_mean, scaler_scale, median_imputation, reader
    try:
        # Load EasyOCR
        reader = easyocr.Reader(['id', 'en'], gpu=False)
        
        base_dir = os.path.dirname(os.path.abspath(__file__))
        
        # Load Metadata .pkl
        meta_path = os.path.join(base_dir, 'nutriguard_meta.pkl')
        with open(meta_path, 'rb') as f:
            metadata = pickle.load(f)
            # Metadata di-load sebagai dictionary mentah dari tim modelling
            median_imputation = metadata.get('medians', {})
            scaler_mean = metadata.get('scaler_mean', [])
            scaler_scale = metadata.get('scaler_scale', [])
        
        # Load Model .keras dengan custom_objects yang benar
        model_path = os.path.join(base_dir, 'nutriguard.keras')
        model = tf.keras.models.load_model(
            model_path, 
            custom_objects={'NutriAttention': NutriAttention}
        )
        print("✅ Berhasil! Model, Metadata, dan EasyOCR dimuat dengan sukses tanpa error.")
    except Exception as e:
        print(f"❌ Error kritis saat startup: {str(e)}")

def extract_nutrition_values(text: str) -> dict:
    text = text.lower()
    extracted = {}
    patterns = {
        'energi_total_kkal': r'energi\s*total.*?(\d+(?:[.,]\d+)?)',
        'lemak_total_g': r'lemak\s*total.*?(\d+(?:[.,]\d+)?)',
        'lemak_jenuh_g': r'lemak\s*jenuh.*?(\d+(?:[.,]\d+)?)',
        'lemak_trans_g': r'lemak\s*trans.*?(\d+(?:[.,]\d+)?)',
        'kolesterol_mg': r'kolesterol.*?(\d+(?:[.,]\d+)?)',
        'karbohidrat_g': r'karbohidrat.*?(\d+(?:[.,]\d+)?)',
        'serat_g': r'serat.*?(\d+(?:[.,]\d+)?)',
        'gula_g': r'gula.*?(\d+(?:[.,]\d+)?)',
        'protein_g': r'protein.*?(\d+(?:[.,]\d+)?)',
        'natrium_mg': r'natrium.*?(\d+(?:[.,]\d+)?)'
    }
    for key, pattern in patterns.items():
        match = re.search(pattern, text)
        if match:
            val_str = match.group(1).replace(',', '.')
            extracted[key] = float(val_str)
        else:
            extracted[key] = None
    return extracted

@app.post("/api/v1/predict")
async def predict(request: ScanRequest):
    try:
        # Decode string Base64 dari BE menjadi bytes gambar murni
        try:
            encoded_data = request.image.split(",")[-1]
            image_bytes = base64.b64decode(encoded_data)
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if img is None:
                raise ValueError()
        except Exception:
            raise ValueError("Format Base64 gambar tidak valid atau rusak.")

        # 1. Run EasyOCR
        try:
            ocr_results = reader.readtext(img, detail=0)
            raw_text = " ".join(ocr_results)
            if not raw_text.strip():
                return {"isValid": False}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OCR Failure: {str(e)}")

        # 2. Parsing dengan Regex
        extracted_data = extract_nutrition_values(raw_text)
        
        # 3. Imputasi nilai Kosong pakai nilai Median
        feature_array = []
        for i, key in enumerate(NUTRITION_KEYS):
            val = extracted_data[key]
            if val is None:
                if isinstance(median_imputation, dict):
                    val = median_imputation.get(key, 0.0)
                elif isinstance(median_imputation, (list, np.ndarray)):
                    val = median_imputation[i] if i < len(median_imputation) else 0.0
                else:
                    val = 0.0
            feature_array.append(val)
            
        feature_array = np.array(feature_array).reshape(1, -1)
        
        # 4. Normalisasi data dengan Scaler (Manual dari Mean dan Scale)
        mean_arr = np.array(scaler_mean)
        scale_arr = np.array(scaler_scale)
        normalized_features = (feature_array - mean_arr) / scale_arr
        
        # 5. Prediksi Kategori Kesehatan
        predictions = model.predict(normalized_features)
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        predicted_label = CATEGORIES[predicted_class_index].upper()
        
        # Hitung persentase probabilitas untuk pelaporan data
        prob_vals = predictions[0]
        
        # Mengembalikan JSON terstruktur lengkap yang mempermudah BE merespons FE
        return {
            "isValid": True,
            "resultStatus": predicted_label,
            "probabilities": {
                "aman": f"{int(prob_vals[0]*100)}%",
                "waspada": f"{int(prob_vals[1]*100)}%",
                "batasi": f"{int(prob_vals[2]*100)}%"
            },
            "nutrients": [{"key": k, "val": f"{v}"} for k, v in zip(NUTRITION_KEYS, feature_array[0].tolist())],
            "saveValues": {
                "calorie": extracted_data.get('energi_total_kkal', 0.0),
                "sugar": extracted_data.get('gula_g', 0.0),
                "sodium": extracted_data.get('natrium_mg', 0.0)
            }
        }
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        import traceback
        tb_str = traceback.format_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}\n{tb_str}")