
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
  model: 'gemini-pro',
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
  const [model, setModel] = useState('gemini-pro');
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    // Load settings from localStorage on component mount
    const storedApiKey = localStorage.getItem('geminiApiKey') || '';
    const storedModel = localStorage.getItem('geminiModel') || 'gemini-pro';
    
    setApiKey(storedApiKey);
    setModel(storedModel);
    setIsConfigured(!!storedApiKey);
  }, []);

  const handleSetApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('geminiApiKey', key);
    setIsConfigured(!!key);
  };

  const handleSetModel = (newModel: string) => {
    setModel(newModel);
    localStorage.setItem('geminiModel', newModel);
  };

  return (
    <GeminiContext.Provider value={{ 
      apiKey, 
      model, 
      setApiKey: handleSetApiKey, 
      setModel: handleSetModel, 
      isConfigured 
    }}>
      {children}
    </GeminiContext.Provider>
  );
};
