import React, { useState } from 'react';
import { useSettings, Frame } from '../context/SettingsContext';
import { Trash2, Upload, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const { title, setTitle, frames, addFrame, removeFrame } = useSettings();
  const [newTitle, setNewTitle] = useState(title);

  const handleTitleSave = () => {
    setTitle(newTitle);
    alert('Title updated!');
  };

  const handleFrameUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newFrame: Frame = {
          id: Date.now().toString(),
          name: file.name,
          imageUrl: base64String,
        };
        addFrame(newFrame);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Settings</h1>
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Title Settings */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Main Title</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter site title"
            />
            <button
              onClick={handleTitleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
          </div>
        </div>

        {/* Frame Settings */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Frame Management</h2>
          
          {/* Upload Area */}
          <div className="mb-6 p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors bg-gray-50">
            <label className="flex flex-col items-center cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload a new frame image (PNG/JPG)</span>
              <span className="text-xs text-gray-400 mt-1">Recommended: PNG with transparency, Aspect Ratio 2:3 (e.g. 600x900px)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFrameUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Frame List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frames.map((frame) => (
              <div key={frame.id} className="relative group border rounded-lg p-2 bg-gray-50">
                <div className="aspect-[4/6] bg-white rounded overflow-hidden flex items-center justify-center">
                   {/* We display the frame image as a background or overlay preview */}
                   <img 
                      src={frame.imageUrl} 
                      alt={frame.name} 
                      className="max-h-full max-w-full object-contain"
                    />
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-sm text-gray-600 truncate">{frame.name}</span>
                  <button
                    onClick={() => removeFrame(frame.id)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                    title="Delete frame"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
