
import React from 'react';
import Layout from '@/components/Layout';
import PomodoroTimer from '@/components/PomodoroTimer';

const Pomodoro: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center">
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
