
import React from 'react';
import Layout from '@/components/Layout';
import PomodoroTimer from '@/components/PomodoroTimer';

const Pomodoro: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative w-20 h-20 overflow-hidden rounded-full border-4 border-neon shadow-[0_0_15px_rgba(255,0,0,0.7)]">
              <img 
                src="https://cdn.imgurl.ir/uploads/n479793_photo_--_--.jpg" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <h1 className="neon-text text-3xl mb-2">پومودورو تایمر</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            روش پومودورو یک تکنیک مدیریت زمان است که به شما کمک می‌کند با تقسیم کار به بازه‌های زمانی کوتاه 
            با استراحت‌های مشخص، تمرکز و بهره‌وری خود را افزایش دهید.
          </p>
        </div>
        
        <PomodoroTimer />
      </div>
    </Layout>
  );
};

export default Pomodoro;
