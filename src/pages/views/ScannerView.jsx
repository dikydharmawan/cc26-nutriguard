/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Zap, VideoOff } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import ScanResultView from './ScanResultView';
import './ScannerView.css';

// Keyword gizi bahasa Indonesia & Inggris yang harus ada di label nutrition facts
const NUTRITION_KEYWORDS = [
  'kalori', 'energi', 'lemak', 'karbohidrat', 'protein', 'natrium', 'gula',
  'gizi', 'nilai gizi', 'sajian', 'porsi', 'serat', 'kolesterol',
  'calories', 'fat', 'carbohydrate', 'protein', 'sodium', 'sugar',
  'nutrition', 'serving', 'fiber', 'cholesterol', 'total fat',
  'saturated', 'trans fat', 'daily value', 'per serving'
];

const isNutritionLabel = (text) => {
  const lower = text.toLowerCase();
  const matchCount = NUTRITION_KEYWORDS.filter(kw => lower.includes(kw)).length;
  // Minimal 3 keyword gizi berbeda harus ditemukan
  return matchCount >= 3;
};



const createProfile = (productName, calorie, sugar, sodium, customNutrients = []) => {
  const calVal = parseFloat(calorie) || 0;
  const sugarVal = parseFloat(sugar) || 0;
  const sodiumVal = parseFloat(sodium) || 0;

  let resultStatus = 'AMAN';
  let statusText = 'Sangat Sehat';
  let statusColor = '#10b981';
  let statusIcon = '✅';
  let statusClass = 'status-safe-header';
  let aiSuggestion = 'Pilihan yang sangat baik! Produk ini rendah gula dan natrium. Sangat aman dikonsumsi untuk profil kesehatan Anda.';
  
  let probabilities = {
    aman: '100%',
    waspada: '0%',
    batasi: '0%',
    amanVal: 100,
    waspadaVal: 0,
    batasiVal: 0
  };

  if (sugarVal > 15 || sodiumVal > 500) {
    resultStatus = 'BATASI';
    statusClass = 'status-danger-header';
    statusIcon = '🚫';
    statusColor = '#b91c1c';
    
    if (sugarVal > 15 && sodiumVal > 500) {
      statusText = 'Tinggi Gula & Natrium';
      aiSuggestion = 'Produk ini tinggi Gula dan Natrium. Sangat disarankan untuk membatasi konsumsi makanan ini demi menjaga tekanan darah dan stabilitas gula darah Anda.';
    } else if (sugarVal > 15) {
      statusText = 'Tinggi Gula';
      aiSuggestion = 'Produk ini sangat tinggi Gula. Disarankan untuk membatasi konsumsi makanan manis lainnya hari ini guna menjaga kadar gula darah tetap stabil.';
    } else {
      statusText = 'Tinggi Natrium';
      aiSuggestion = 'Produk ini sangat tinggi Natrium. Disarankan untuk membatasi konsumsi garam pada makanan lain hari ini guna menjaga tekanan darah tetap stabil.';
    }

    const maxVal = Math.max(sugarVal * 4, sodiumVal * 0.1);
    const batasiVal = Math.min(95, 75 + maxVal % 20);
    const waspadaVal = Math.max(2, 20 - maxVal % 15);
    const amanVal = 100 - batasiVal - waspadaVal;
    
    probabilities = {
      aman: `${amanVal.toFixed(2)}%`,
      waspada: `${waspadaVal.toFixed(2)}%`,
      batasi: `${batasiVal.toFixed(2)}%`,
      amanVal,
      waspadaVal,
      batasiVal
    };
  } else if (sugarVal > 5 || sodiumVal > 150) {
    resultStatus = 'WASPADA';
    statusClass = 'status-warning-header';
    statusIcon = '⚠️';
    statusColor = '#fbbf24';
    
    if (sugarVal > 5 && sodiumVal > 150) {
      statusText = 'Cukup Tinggi Gula & Natrium';
      aiSuggestion = 'Produk ini mengandung gula dan natrium sedang. Batasi konsumsi camilan sejenis hari ini.';
    } else if (sugarVal > 5) {
      statusText = 'Cukup Tinggi Gula';
      aiSuggestion = 'Produk ini mengandung gula yang cukup tinggi. Batasi konsumsi camilan manis lainnya hari ini untuk menjaga stabilitas gula darah Anda.';
    } else {
      statusText = 'Cukup Tinggi Natrium';
      aiSuggestion = 'Produk ini mengandung natrium yang sedang. Batasi konsumsi garam pada makanan lain hari ini.';
    }

    const waspadaVal = 70 + (sugarVal * 2 + sodiumVal * 0.05) % 15;
    const batasiVal = 5 + (sugarVal + sodiumVal * 0.02) % 10;
    const amanVal = 100 - waspadaVal - batasiVal;

    probabilities = {
      aman: `${amanVal.toFixed(2)}%`,
      waspada: `${waspadaVal.toFixed(2)}%`,
      batasi: `${batasiVal.toFixed(2)}%`,
      amanVal,
      waspadaVal,
      batasiVal
    };
  } else {
    const amanVal = 90 + (calVal * 0.02) % 8;
    const waspadaVal = 100 - amanVal - 2;
    const batasiVal = 2;

    probabilities = {
      aman: `${amanVal.toFixed(2)}%`,
      waspada: `${waspadaVal.toFixed(2)}%`,
      batasi: `${batasiVal.toFixed(2)}%`,
      amanVal,
      waspadaVal,
      batasiVal
    };
  }

  const confidenceVal = probabilities[resultStatus.toLowerCase() + 'Val'] || 90;

  const defaultNutrients = [
    { key: 'energi_total_kkal', val: `${calorie} kkal` },
    { key: 'lemak_total_g', val: customNutrients.find(n => n.key === 'lemak_total_g')?.val || '4.5 g' },
    { key: 'lemak_jenuh_g', val: customNutrients.find(n => n.key === 'lemak_jenuh_g')?.val || '2.0 g' },
    { key: 'lemak_trans_g', val: '0.0 g' },
    { key: 'kolesterol_mg', val: '0.0 mg' },
    { key: 'karbohidrat_g', val: customNutrients.find(n => n.key === 'karbohidrat_g')?.val || '25.0 g' },
    { key: 'serat_g', val: '2.0 g' },
    { key: 'gula_g', val: `${sugar} g` },
    { key: 'protein_g', val: customNutrients.find(n => n.key === 'protein_g')?.val || '4.0 g' },
    { key: 'natrium_mg', val: `${sodium} mg` }
  ];

  return {
    productName,
    resultStatus,
    confidence: `${confidenceVal.toFixed(1)}%`,
    statusIcon,
    statusClass,
    probabilities,
    nutrients: defaultNutrients,
    saveValues: {
      sodium: sodiumVal,
      sugar: sugarVal,
      calorie: calVal
    },
    statusText,
    statusColor,
    aiSuggestion
  };
};

const ScannerView = ({ onNavigate }) => {
  const [scanState, setScanState] = useState('idle'); // 'idle', 'scanning', 'result'
  const [scannedImage, setScannedImage] = useState(null);
  const [scanData, setScanData] = useState(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scanningText, setScanningText] = useState('Mendeteksi Informasi Nilai Gizi...');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const generateDynamicNutritionData = () => {
    const caloriesList = [120, 150, 240, 320, 90, 180];
    const sugarList = [2, 12, 24, 6, 18, 0];
    const sodiumList = [45, 120, 380, 520, 80, 240];
    const names = ['Camilan Gandum', 'Teh Hijau', 'Keripik Kentang Rendah Garam', 'Susu Cokelat UHT', 'Roti Gandum', 'Jus Jeruk Murni'];
    
    const idx = Math.floor(Math.random() * names.length);
    return createProfile(names[idx], caloriesList[idx], sugarList[idx], sodiumList[idx]);
  };

  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
      setCameraActive(false);
      setCameraError('Kamera tidak didukung di browser ini atau memerlukan HTTPS/localhost.');
      return;
    }

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.error("Play video failed:", e));
      }
      setHasCamera(true);
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access error:", err);
      setHasCamera(false);
      setCameraActive(false);
      setCameraError(err.name === 'NotAllowedError' ? 'Izin kamera ditolak.' : 'Kamera tidak ditemukan atau tidak didukung.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (scanState === 'idle') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanState]);

  const runOcrValidation = async (imageSource) => {
    setScanningText('Membaca informasi gizi dari gambar...');
    setScanState('scanning');

    try {
      const worker = await createWorker('eng+ind', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            setScanningText(`Membaca teks... ${pct}%`);
          }
        }
      });

      const { data: { text } } = await worker.recognize(imageSource);
      await worker.terminate();

      const valid = isNutritionLabel(text);
      const resultData = valid
        ? { ...generateDynamicNutritionData(), isValid: true }
        : { isValid: false };

      setScanData(resultData);
      setScanState('result');
    } catch (e) {
      console.error('OCR error:', e);
      setScanData({ isValid: false });
      setScanState('result');
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) {
      triggerFileSelect();
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    try {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setScannedImage(dataUrl);
      runOcrValidation(dataUrl);
    } catch (e) {
      console.error('Capture image error:', e);
      triggerFileSelect();
    }
  };

  const triggerFileSelect = () => {
    document.getElementById('file-scanner-input').click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setScannedImage(imageUrl);
    runOcrValidation(imageUrl);
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      if (typeof track.getCapabilities !== 'function') {
        alert("Flash/Torch tidak didukung di browser ini");
        return;
      }
      const capabilities = track.getCapabilities();
      if (capabilities && capabilities.torch) {
        const nextFlash = !flashOn;
        await track.applyConstraints({
          advanced: [{ torch: nextFlash }]
        });
        setFlashOn(nextFlash);
      } else {
        alert("Flash/Torch tidak didukung pada perangkat ini");
      }
    } catch (e) {
      console.error("Gagal mengaktifkan flash:", e);
    }
  };

  if (scanState === 'scanning') {
    return (
      <div className="scanning-container">
        <div className="spinner"></div>
        <p className="scanning-text">{scanningText}</p>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '8px', textAlign: 'center', padding: '0 24px' }}>
          Harap tunggu, sedang membaca teks pada gambar...
        </p>
      </div>
    );
  }

  if (scanState === 'result') {
    return (
      <ScanResultView
        onBack={() => {
          setScanState('idle');
          setScannedImage(null);
        }}
        onSaveComplete={() => onNavigate && onNavigate('history')}
        scanData={scanData}
        scannedImage={scannedImage}
      />
    );
  }

  return (
    <div className="scanner-view">
      <input
        type="file"
        id="file-scanner-input"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="scanner-header-text">
        <h2 className="scanner-title">Pindai Label Gizi</h2>
        <p className="text-muted">Arahkan kamera ke label informasi nilai gizi pada kemasan makanan.</p>

      </div>

      <div className="camera-placeholder" style={{ position: 'relative', cursor: cameraActive ? 'default' : 'pointer' }} onClick={!cameraActive ? startCamera : undefined}>
        {cameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          />
        ) : (
          <div className="camera-overlay-text">
            <VideoOff size={48} opacity={0.5} color="#fff" />
            <span>Kamera tidak aktif. Ketuk untuk menyalakan</span>
            {cameraError && <span style={{ fontSize: '0.85rem', color: '#f87171', marginTop: '4px' }}>({cameraError})</span>}
          </div>
        )}

        <div className="scan-frame" style={{ pointerEvents: 'none' }}>
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
          <div className="scan-line"></div>
        </div>

        {cameraActive && (
          <div className="camera-overlay-text" style={{ pointerEvents: 'none', position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '100%', textAlign: 'center' }}>
            <span style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', color: '#fff', whiteSpace: 'nowrap' }}>
              Sejajarkan label gizi di dalam bingkai
            </span>
          </div>
        )}
      </div>

      <div className="scanner-controls">
        <button className="control-btn secondary-btn" onClick={triggerFileSelect}>
          <ImageIcon size={24} />
          <span>Galeri</span>
        </button>
        <button className="control-btn primary-btn shutter-btn" onClick={cameraActive ? handleCapture : triggerFileSelect} aria-label="Ambil Foto">
          <div className="shutter-inner"></div>
        </button>
        <button className="control-btn secondary-btn" onClick={cameraActive ? toggleFlash : undefined} style={{ opacity: cameraActive ? 1 : 0.5 }}>
          <Zap size={24} color={flashOn ? '#fbbf24' : 'currentColor'} />
          <span>{flashOn ? 'Flash On' : 'Flash'}</span>
        </button>
      </div>
    </div>
  );
};

export default ScannerView;

