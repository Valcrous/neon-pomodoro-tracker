
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeSwitcher from './ThemeSwitcher';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neon/30 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="flex items-center">
              <img src="https://cdn.imgurl.ir/uploads/n479793_photo_--_--.jpg" alt="Logo" className="h-8 w-8 mr-2" />
              <h1 className="neon-text text-2xl mr-4">سایت مدیریت زمان</h1>
            </div>
            <p className="text-sm text-muted-foreground">by <a href="https://Ya3in.ir" target="_blank" rel="noopener noreferrer" className="neon-text text-xs">Ya3in.ir</a></p>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex space-x-4">
              <Link 
                to="/" 
                className={`px-3 py-1 rounded-md transition-all duration-300 ${
                  location.pathname === '/' 
                    ? 'neon-text bg-neon/10 neon-border' 
                    : 'text-foreground hover:text-neon'
                }`}
              >
                گزارشات
              </Link>
              <Link 
                to="/pomodoro" 
                className={`px-3 py-1 rounded-md transition-all duration-300 ${
                  location.pathname === '/pomodoro' 
                    ? 'neon-text bg-neon/10 neon-border' 
                    : 'text-foreground hover:text-neon'
                }`}
              >
                پومودورو
              </Link>
            </nav>
            
            <ThemeSwitcher />
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="border-t border-neon/30 py-6 backdrop-blur-md bg-background/80">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            ساخته شده توسط <a href="https://Ya3in.ir" target="_blank" rel="noopener noreferrer" className="neon-text">Ya3in.ir</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
