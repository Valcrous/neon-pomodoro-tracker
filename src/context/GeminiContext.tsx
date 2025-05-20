
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GeminiContextType {
  apiKey: string;
  model: string;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  isConfigured: boolean;
}

const GeminiContext = createContext<GeminiContextType>({
  apiKey: '',
  model: 'gemini-1.5-flash-latest',
  setApiKey: () => {},
  setModel: () => {},
  isConfigured: false,
});

export const useGemini = () => useContext(GeminiContext);

interface GeminiProviderProps {
  children: ReactNode;
}

export const GeminiProvider: React.FC<GeminiProviderProps> = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-1.5-flash-latest');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on component mount
    const storedApiKey = localStorage.getItem('geminiApiKey') || '';
    const storedModel = localStorage.getItem('geminiModel') || 'gemini-1.5-flash-latest';
    
    setApiKey(storedApiKey);
    setModel(storedModel);
    setIsConfigured(!!storedApiKey);
  }, []);

  // Update isConfigured whenever apiKey changes
  useEffect(() => {
    setIsConfigured(!!apiKey);
  }, [apiKey]);

  return (
    <GeminiContext.Provider value={{ apiKey, model, setApiKey, setModel, isConfigured }}>
      {children}
    </GeminiContext.Provider>
  );
};
