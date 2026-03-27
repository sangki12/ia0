import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Download, Printer, RefreshCw } from 'lucide-react';
import { Frame } from '../context/SettingsContext';

interface PhotoStripProps {
  photos: string[];
  frame: Frame;
  onRetake: () => void;
}

const PhotoStrip: React.FC<PhotoStripProps> = ({ photos, frame, onRetake }) => {
  const stripRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!stripRef.current) return;
    try {
      const canvas = await html2canvas(stripRef.current, {
        useCORS: true,
        scale: 2, // Higher resolution
        backgroundColor: null, // Transparent background if needed
      });
      const link = document.createElement('a');
      link.download = `life4cuts-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to generate image:", err);
      alert("Failed to save image.");
    }
  };

  const handlePrint = async () => {
    if (!stripRef.current) return;
    try {
       // Create a hidden print window/iframe or just print current window
       // Better to open a new window with just the image for printing
       const canvas = await html2canvas(stripRef.current, { scale: 2 });
       const imgData = canvas.toDataURL('image/png');
       
       const printWindow = window.open('', '_blank');
       if (printWindow) {
         printWindow.document.write(`
            <html>
              <head>
                <title>Print Photo</title>
                <style>
                  body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                  img { max-width: 100%; max-height: 100%; }
                  @media print { body { -webkit-print-color-adjust: exact; } }
                </style>
              </head>
              <body>
                <img src="${imgData}" onload="window.print();window.close()" />
              </body>
            </html>
         `);
         printWindow.document.close();
       }
    } catch (err) {
      console.error("Failed to print:", err);
      alert("Failed to print.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* The Photo Strip Area */}
      <div 
        ref={stripRef}
        className="relative bg-white shadow-2xl overflow-hidden"
        style={{ 
          width: '320px', // Fixed width for consistency
          aspectRatio: '2/3', // Standard photo ratio 4x6
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Background Layer (Frame Image) - if it's a solid background frame */}
        {/* Actually, standard is photos, then frame overlay. Let's do that. */}
        
        {/* Photos Grid Layer */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 p-4 z-0">
          {photos.map((photo, index) => (
             <div key={index} className="w-full h-full relative overflow-hidden bg-gray-200">
                <img 
                  src={photo} 
                  alt={`Capture ${index + 1}`} 
                  className="w-full h-full object-cover transform scale-x-[-1]" // Mirror back for final print? Or keep as seen? Usually photos are mirrored during capture but saved normal? 
                  // Selfies are usually mirrored in preview, but saved as seen by others (unmirrored) or mirrored. 
                  // Let's keep it consistent with preview.
                />
             </div>
          ))}
          {/* Fill empty slots if less than 4 (shouldn't happen in flow) */}
          {[...Array(Math.max(0, 4 - photos.length))].map((_, i) => (
            <div key={`empty-${i}`} className="w-full h-full bg-gray-100" />
          ))}
        </div>

        {/* Frame Overlay Layer */}
        {frame.imageUrl && (
          <div className="absolute inset-0 z-10 pointer-events-none">
             <img 
               src={frame.imageUrl} 
               alt="Frame Overlay" 
               className="w-full h-full object-fill"
             />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={onRetake}
          className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 shadow-lg transition-transform hover:scale-105"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Retake
        </button>
        
        <button
          onClick={handleDownload}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg transition-transform hover:scale-105"
        >
          <Download className="w-5 h-5 mr-2" />
          Save
        </button>
        
        <button
          onClick={handlePrint}
          className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg transition-transform hover:scale-105"
        >
          <Printer className="w-5 h-5 mr-2" />
          Print
        </button>
      </div>
    </div>
  );
};

export default PhotoStrip;
