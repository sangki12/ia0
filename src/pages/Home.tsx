import React, { useState } from 'react';
import { useSettings, Frame } from '../context/SettingsContext';
import { Settings, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import CameraCapture from '../components/CameraCapture';
import PhotoStrip from '../components/PhotoStrip';

type Step = 'START' | 'FRAME_SELECT' | 'CAPTURE' | 'RESULT';

const Home = () => {
  const { title, frames } = useSettings();
  const [step, setStep] = useState<Step>('START');
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const handleStart = () => {
    setStep('FRAME_SELECT');
  };

  const handleFrameSelect = (frame: Frame) => {
    setSelectedFrame(frame);
    setPhotos([]);
    setStep('CAPTURE');
  };

  const handlePhotoCapture = (imageSrc: string) => {
    const newPhotos = [...photos, imageSrc];
    setPhotos(newPhotos);
    
    if (newPhotos.length >= 4) {
      setStep('RESULT');
    }
  };

  const handleRetake = () => {
    setPhotos([]);
    setStep('CAPTURE');
  };

  const handleRestart = () => {
    setPhotos([]);
    setSelectedFrame(null);
    setStep('START');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center p-4">
      {/* Header / Nav */}
      <div className="w-full flex justify-between items-center p-4 absolute top-0 left-0 z-50">
        <div className="text-sm font-bold text-gray-400 opacity-50">Life4Cuts v1.0</div>
        <Link to="/admin" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Settings className="w-6 h-6" />
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-4xl flex flex-col justify-center items-center mt-12">
        
        {/* START SCREEN */}
        {step === 'START' && (
          <div className="text-center animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 tracking-tighter drop-shadow-sm">
              {title}
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-lg mx-auto">
              Capture your moments in 4 cuts. Select a frame, strike a pose, and print your memories instantly!
            </p>
            <button
              onClick={handleStart}
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Start Photobooth
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}

        {/* FRAME SELECTION */}
        {step === 'FRAME_SELECT' && (
          <div className="w-full animate-fade-in">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Select a Frame</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
              {frames.map((frame) => (
                <button
                  key={frame.id}
                  onClick={() => handleFrameSelect(frame)}
                  className="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:scale-105 focus:ring-4 focus:ring-purple-300"
                >
                  <div className="aspect-[2/3] w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                    {/* Preview of frame */}
                    <img 
                       src={frame.imageUrl} 
                       alt={frame.name} 
                       className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="p-3 text-center bg-white border-t">
                    <span className="font-semibold text-gray-700">{frame.name}</span>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button 
                onClick={handleRestart}
                className="text-gray-500 hover:text-gray-700 underline"
              >
                Back to Start
              </button>
            </div>
          </div>
        )}

        {/* CAPTURE SCREEN */}
        {step === 'CAPTURE' && (
          <div className="w-full animate-fade-in">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              Strike a Pose! ({photos.length + 1}/4)
            </h2>
            <CameraCapture 
              onCapture={handlePhotoCapture} 
              photosTaken={photos.length} 
            />
            {/* Preview of taken photos */}
            <div className="flex justify-center gap-2 mt-4 h-16">
               {photos.map((p, i) => (
                 <img key={i} src={p} className="h-full aspect-square object-cover rounded border border-white shadow-sm" />
               ))}
               {[...Array(4 - photos.length)].map((_, i) => (
                 <div key={`placeholder-${i}`} className="h-full aspect-square bg-white/50 rounded border border-white/30" />
               ))}
            </div>
            <div className="mt-4 text-center">
                 <button 
                    onClick={() => setStep('FRAME_SELECT')}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {step === 'RESULT' && selectedFrame && (
          <div className="w-full flex flex-col items-center animate-fade-in">
             <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Your Life4Cut!</h2>
             
             <PhotoStrip 
               photos={photos} 
               frame={selectedFrame} 
               onRetake={handleRetake}
             />
             
             <div className="mt-8">
               <button 
                 onClick={handleRestart}
                 className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
               >
                 <RotateCcw className="w-4 h-4 mr-2" />
                 Start New Session
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
