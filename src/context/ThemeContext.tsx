
import React, { createContext, useState, useContext, useEffect } from 'react';

type Theme = 'yellow' | 'red' | 'white' | 'purple';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is saved in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'yellow'; // Default is yellow
  });

  useEffect(() => {
    // Remove previous theme classes
    document.documentElement.classList.remove('theme-yellow', 'theme-red', 'theme-white', 'theme-purple');
    
    // Add current theme class unless it's yellow (default)
    if (theme !== 'yellow') {
      document.documentElement.classList.add(`theme-${theme}`);
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
