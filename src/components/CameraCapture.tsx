import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  photosTaken: number;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, photosTaken }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please ensure you have given permission.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCaptureClick = () => {
    if (countdown !== null) return;
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      capturePhoto();
      setCountdown(null);
    }
  }, [countdown]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Flip horizontally to match mirror view
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageSrc = canvas.toDataURL('image/png');
        onCapture(imageSrc);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
        />
        
        {/* Countdown Overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-10">
            <span className="text-9xl font-bold text-white drop-shadow-lg animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Guides */}
        <div className="absolute inset-0 border-2 border-white/20 pointer-events-none grid grid-cols-2 grid-rows-2">
           {/* Simple grid guide */}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <p className="text-gray-600 mb-4 font-medium">
          Photo {photosTaken + 1} / 4
        </p>
        
        <button
          onClick={handleCaptureClick}
          disabled={countdown !== null}
          className={`
            w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95
            ${countdown !== null 
              ? 'bg-gray-400 border-gray-300 cursor-not-allowed' 
              : 'bg-red-500 border-red-200 hover:bg-red-600 hover:border-red-300 shadow-lg'}
          `}
        >
          <Camera className="w-8 h-8 text-white" />
        </button>
        <p className="mt-2 text-sm text-gray-500">Tap to capture</p>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
