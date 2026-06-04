import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, Camera, X, Check, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from './haptics';

export default function DocumentScanner({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    triggerHaptic('heavy');
    setIsScanning(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/jpeg');
      
      // Simulate scan process
      setTimeout(() => {
         setPhotoUrl(url);
         setHasPhoto(true);
         setIsScanning(false);
         stopCamera();
      }, 1500);
    }
  };

  const retake = () => {
    setHasPhoto(false);
    setPhotoUrl(null);
    startCamera();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
       <div className="absolute top-6 right-6">
          <button 
             onClick={() => { stopCamera(); onClose(); }}
             className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white"
          >
             <X className="w-5 h-5" />
          </button>
       </div>

       <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-white mb-2">Scan Document</h2>
          <p className="text-aether-steel text-sm">Align your passport or visa within the frame.</p>
       </div>

       <div className="relative w-full max-w-md aspect-[3/4] bg-aether-black rounded-2xl overflow-hidden border-2 border-aether-gold/30">
          {!hasPhoto && (
             <video 
               ref={videoRef} 
               autoPlay 
               playsInline 
               className="w-full h-full object-cover"
             />
          )}

          {hasPhoto && photoUrl && (
             <img src={photoUrl} alt="Captured Document" className="w-full h-full object-cover" />
          )}

          {/* Scanner frame overlay */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-2/3 border-2 border-dashed border-aether-gold/50 rounded-xl" />
          </div>

          <AnimatePresence>
             {isScanning && (
                <motion.div 
                   initial={{ top: '0%' }}
                   animate={{ top: '100%' }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                   className="absolute left-0 right-0 h-1 bg-aether-gold shadow-[0_0_20px_rgba(212,197,185,0.8)]"
                />
             )}
          </AnimatePresence>
          <canvas ref={canvasRef} className="hidden" />
       </div>

       <div className="mt-8">
          {!hasPhoto ? (
             <button 
                onClick={takePhoto}
                disabled={isScanning || !stream}
                className="w-16 h-16 rounded-full border-4 border-aether-gold flex items-center justify-center p-1"
             >
                <div className="w-full h-full bg-white rounded-full transition-transform active:scale-90" />
             </button>
          ) : (
             <div className="flex gap-4">
                <button 
                   onClick={retake}
                   className="px-6 py-3 rounded-xl bg-white/10 text-white font-medium"
                >
                   Retake
                </button>
                <button 
                   onClick={() => {
                      triggerHaptic('success');
                      onClose();
                   }}
                   className="px-6 py-3 rounded-xl bg-aether-gold text-aether-black font-medium flex items-center gap-2"
                >
                   <ShieldCheck className="w-5 h-5" /> Verify & Verify
                </button>
             </div>
          )}
       </div>
    </div>
  );
}
