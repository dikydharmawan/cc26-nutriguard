/* eslint-disable */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Image as ImageIcon, Zap, VideoOff } from 'lucide-react';
import ScanResultView from './ScanResultView';
import api from '../../services/api';
import './ScannerView.css';

const dataURLtoBlob = (dataurl) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
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

  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Callback ref — fires when <video> mounts/unmounts.
  // Attaches the stream immediately if it already exists,
  // so there's no race between getUserMedia and React rendering.
  const videoRef = useRef(null);
  const setVideoRef = useCallback((element) => {
    videoRef.current = element;
    if (element && streamRef.current) {
      element.srcObject = streamRef.current;
      element.play().catch((e) => console.error('Play failed:', e));
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setFlashOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
      setCameraActive(false);
      setCameraError(
        'Kamera tidak didukung di browser ini atau memerlukan HTTPS/localhost.'
      );
      return;
    }

    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;

      // If <video> is already mounted, attach immediately.
      // If not yet mounted, setVideoRef callback will handle it.
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current
          .play()
          .catch((e) => console.error('Play video failed:', e));
      }

      setHasCamera(true);
      setCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      setHasCamera(false);
      setCameraActive(false);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Izin kamera ditolak.'
          : 'Kamera tidak ditemukan atau tidak didukung.'
      );
    }
  }, []);

  // Start camera once on mount; stop on unmount.
  // NOT dependent on scanState — avoids killing the stream mid-session.
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // When returning to idle from result, restart camera
  useEffect(() => {
    if (scanState === 'idle' && !cameraActive && !cameraError) {
      startCamera();
    }
  }, [scanState]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitImageToBackend = async (imageBlob) => {
    setScanningText('Menganalisis gambar di server...');
    setScanState('scanning');

    try {
      const formData = new FormData();
      formData.append('image', imageBlob, 'scan.jpg');

      const response = await api.post('/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setScanData({ ...response.data, isValid: true });
      setScanState('result');
    } catch (e) {
      console.error('Scan error:', e);
      setScanData({
        isValid: false,
        message:
          e.response?.data?.message || 'Gagal memproses gambar dari server.',
      });
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
      const blob = dataURLtoBlob(dataUrl);
      submitImageToBackend(blob);
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
    submitImageToBackend(file);
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      if (typeof track.getCapabilities !== 'function') {
        alert('Flash/Torch tidak didukung di browser ini');
        return;
      }
      const capabilities = track.getCapabilities();
      if (capabilities && capabilities.torch) {
        const nextFlash = !flashOn;
        await track.applyConstraints({ advanced: [{ torch: nextFlash }] });
        setFlashOn(nextFlash);
      } else {
        alert('Flash/Torch tidak didukung pada perangkat ini');
      }
    } catch (e) {
      console.error('Gagal mengaktifkan flash:', e);
    }
  };

  if (scanState === 'scanning') {
    return (
      <div className="scanning-container">
        <div className="spinner"></div>
        <p className="scanning-text">{scanningText}</p>
        <p
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            marginTop: '8px',
            textAlign: 'center',
            padding: '0 24px',
          }}
        >
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
        <p className="text-muted">
          Arahkan kamera ke label informasi nilai gizi pada kemasan makanan.
        </p>
      </div>

      <div
        className="camera-placeholder"
        style={{
          position: 'relative',
          cursor: cameraActive ? 'default' : 'pointer',
        }}
        onClick={!cameraActive ? startCamera : undefined}
      >
        {/* Video is always rendered so setVideoRef fires on mount.
            Visibility is controlled by opacity so the DOM node exists
            immediately and avoids the srcObject timing issue. */}
        <video
          ref={setVideoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={(e) =>
            e.target.play().catch((err) =>
              console.error('onLoadedMetadata play failed:', err)
            )
          }
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            // Hide visually but keep in DOM so ref is always attached
            opacity: cameraActive ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Overlay shown only when camera is inactive */}
        {!cameraActive && (
          <div className="camera-overlay-text">
            <VideoOff size={48} opacity={0.5} color="#fff" />
            <span>Kamera tidak aktif. Ketuk untuk menyalakan</span>
            {cameraError && (
              <span
                style={{
                  fontSize: '0.85rem',
                  color: '#f87171',
                  marginTop: '4px',
                }}
              >
                ({cameraError})
              </span>
            )}
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
          <div
            className="camera-overlay-text"
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              width: '100%',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                color: '#fff',
                whiteSpace: 'nowrap',
              }}
            >
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
        <button
          className="control-btn primary-btn shutter-btn"
          onClick={cameraActive ? handleCapture : triggerFileSelect}
          aria-label="Ambil Foto"
        >
          <div className="shutter-inner"></div>
        </button>
        <button
          className="control-btn secondary-btn"
          onClick={cameraActive ? toggleFlash : undefined}
          style={{ opacity: cameraActive ? 1 : 0.5 }}
        >
          <Zap size={24} color={flashOn ? '#fbbf24' : 'currentColor'} />
          <span>{flashOn ? 'Flash On' : 'Flash'}</span>
        </button>
      </div>
    </div>
  );
};

export default ScannerView;