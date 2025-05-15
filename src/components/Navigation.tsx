
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, ClipboardList, Clock } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-neon' : 'text-muted-foreground hover:text-neon';
  };
  
  return (
    <nav className="flex justify-center space-x-4 space-x-reverse mt-4 mb-8" dir="rtl">
      <Link 
        to="/"
        className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md ${isActive('/')}`}
      >
        <ClipboardList className="h-5 w-5" />
        <span>گزارشات</span>
      </Link>
      
      <Link 
        to="/pomodoro"
        className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md ${isActive('/pomodoro')}`}
      >
        <Clock className="h-5 w-5" />
        <span>پومودورو</span>
      </Link>
      
      <Link 
        to="/settings"
        className={`flex items-center space-x-2 space-x-reverse px-3 py-2 rounded-md ${isActive('/settings')}`}
      >
        <Settings className="h-5 w-5" />
        <span>تنظیمات</span>
      </Link>
    </nav>
  );
};

export default Navigation;
