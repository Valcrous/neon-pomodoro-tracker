
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setTheme('yellow')}
        className={cn(
          "w-8 h-8 rounded-full border-2",
          theme === 'yellow' 
            ? "border-neon bg-yellow-400" 
            : "border-yellow-400 bg-transparent hover:bg-yellow-400/20"
        )}
        aria-label="Yellow theme"
      />
      <button
        onClick={() => setTheme('red')}
        className={cn(
          "w-8 h-8 rounded-full border-2",
          theme === 'red' 
            ? "border-neon bg-red-500" 
            : "border-red-500 bg-transparent hover:bg-red-500/20"
        )}
        aria-label="Red theme"
      />
      <button
        onClick={() => setTheme('white')}
        className={cn(
          "w-8 h-8 rounded-full border-2",
          theme === 'white' 
            ? "border-neon bg-white" 
            : "border-white bg-transparent hover:bg-white/20"
        )}
        aria-label="White theme"
      />
      <button
        onClick={() => setTheme('purple')}
        className={cn(
          "w-8 h-8 rounded-full border-2",
          theme === 'purple' 
            ? "border-neon bg-purple-500" 
            : "border-purple-500 bg-transparent hover:bg-purple-500/20"
        )}
        aria-label="Purple theme"
      />
    </div>
  );
};

export default ThemeSwitcher;
