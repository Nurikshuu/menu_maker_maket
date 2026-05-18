'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, X, Camera, CameraOff } from 'lucide-react';
import { ROUTES } from '@/constants/routes.constants';

interface TableModalProps {
  restaurantSlug: string;
  onClose: () => void;
}

export function TableModal({ restaurantSlug, onClose }: TableModalProps) {
  const router = useRouter();
  const [tableInput, setTableInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  function handleClose() {
    stopCamera();
    onClose();
  }

  async function startCamera() {
    setScanError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setScanning(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          detectLoop();
        }
      }, 100);
    } catch {
      setScanError('Нет доступа к камере. Разрешите доступ в настройках браузера.');
    }
  }

  function detectLoop() {
    if (!('BarcodeDetector' in window)) {
      setScanError('Сканирование не поддерживается в этом браузере. Введите номер вручную.');
      stopCamera();
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
    async function tick() {
      if (!videoRef.current || !streamRef.current) return;
      try {
        const barcodes = await detector.detect(videoRef.current);
        if (barcodes.length > 0) {
          const raw: string = barcodes[0].rawValue;
          const match = raw.match(/\/table\/[^/]+\/(\d+)/);
          const num = match ? match[1] : raw.replace(/\D/g, '');
          if (num) {
            setTableInput(num);
            stopCamera();
            return;
          }
        }
      } catch { /* ignore */ }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  function handleGoToTable(e: React.FormEvent) {
    e.preventDefault();
    const num = tableInput.trim();
    if (!num) return;
    router.push(ROUTES.TABLE(restaurantSlug, num));
    handleClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <QrCode className="size-5 text-blue-600" /> Заказать за столом
          </h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="size-5" />
          </button>
        </div>

        {scanning && (
          <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="size-40 border-2 border-white/70 rounded-xl" />
            </div>
            <button
              onClick={stopCamera}
              className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white"
            >
              <CameraOff className="size-4" />
            </button>
          </div>
        )}

        {scanError && (
          <p className="text-xs text-red-500 text-center">{scanError}</p>
        )}

        {!scanning && (
          <button
            onClick={startCamera}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 py-3 text-sm text-blue-600 font-medium hover:bg-blue-50 transition-colors"
          >
            <Camera className="size-4" />
            Сканировать QR-кодом
          </button>
        )}

        <div className="relative flex items-center gap-3">
          <hr className="flex-1 border-gray-200" />
          <span className="text-xs text-gray-400">или</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <form onSubmit={handleGoToTable} className="flex gap-2">
          <input
            autoFocus={!scanning}
            type="number"
            min={1}
            value={tableInput}
            onChange={(e) => setTableInput(e.target.value)}
            placeholder="Номер стола"
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          <button
            type="submit"
            disabled={!tableInput.trim()}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
