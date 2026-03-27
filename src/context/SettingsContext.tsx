import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Frame {
  id: string;
  name: string;
  imageUrl: string; // Base64 or URL
}

interface SettingsContextType {
  title: string;
  setTitle: (title: string) => void;
  frames: Frame[];
  addFrame: (frame: Frame) => void;
  removeFrame: (id: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_TITLE = '인생네컷';
// Simple colored frames as defaults if nothing is uploaded
const DEFAULT_FRAMES: Frame[] = [
  { id: 'default-1', name: 'Basic Black', imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }, // Placeholder
];

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitleState] = useState<string>(() => {
    return localStorage.getItem('site_title') || DEFAULT_TITLE;
  });

  const [frames, setFramesState] = useState<Frame[]>(() => {
    const saved = localStorage.getItem('site_frames');
    return saved ? JSON.parse(saved) : DEFAULT_FRAMES;
  });

  useEffect(() => {
    localStorage.setItem('site_title', title);
  }, [title]);

  useEffect(() => {
    localStorage.setItem('site_frames', JSON.stringify(frames));
  }, [frames]);

  const setTitle = (newTitle: string) => {
    setTitleState(newTitle);
  };

  const addFrame = (frame: Frame) => {
    setFramesState(prev => [...prev, frame]);
  };

  const removeFrame = (id: string) => {
    setFramesState(prev => prev.filter(f => f.id !== id));
  };

  return (
    <SettingsContext.Provider value={{ title, setTitle, frames, addFrame, removeFrame }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
