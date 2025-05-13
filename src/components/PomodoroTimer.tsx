
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Timer states
type TimerState = 'stopped' | 'running' | 'paused';
type TimerMode = 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
  // Timer settings
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreakDuration, setShortBreakDuration] = useState(5);
  const [longBreakDuration, setLongBreakDuration] = useState(15);
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState(4);
  
  // Timer state
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const [timerMode, setTimerMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(workDuration * 60);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Refs for timer
  const timerRef = useRef<number | null>(null);

  // Cancel timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update timeLeft when duration settings change and timer is stopped
  useEffect(() => {
    if (timerState === 'stopped') {
      setTimeLeft(
        timerMode === 'work'
          ? workDuration * 60
          : timerMode === 'shortBreak'
          ? shortBreakDuration * 60
          : longBreakDuration * 60
      );
    }
  }, [workDuration, shortBreakDuration, longBreakDuration, timerMode, timerState]);

  // Timer logic
  const startTimer = () => {
    if (timerState === 'running') return;
    
    setTimerState('running');
    
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer complete
          clearInterval(timerRef.current!);
          
          // Show notification
          const nextMode = getNextMode();
          toast.success(
            nextMode === 'work'
              ? 'زمان استراحت تمام شد! شروع به کار کنید'
              : 'زمان کار تمام شد! زمان استراحت است'
          );
          
          // Move to next cycle
          handleTimerComplete();
          
          return getInitialTimeForMode(nextMode);
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerState('paused');
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerState('stopped');
    setTimeLeft(
      timerMode === 'work'
        ? workDuration * 60
        : timerMode === 'shortBreak'
        ? shortBreakDuration * 60
        : longBreakDuration * 60
    );
  };

  const getNextMode = (): TimerMode => {
    // If we're in a work session, determine what break comes next
    if (timerMode === 'work') {
      // Check if we've completed enough cycles for a long break
      if ((completedCycles + 1) % cyclesBeforeLongBreak === 0) {
        return 'longBreak';
      } else {
        return 'shortBreak';
      }
    } 
    // If we're in any break, next is work
    else {
      return 'work';
    }
  };

  const handleTimerComplete = () => {
    const nextMode = getNextMode();
    
    // If we're finishing a work session, increment the completed cycles
    if (timerMode === 'work') {
      setCompletedCycles(prev => prev + 1);
    }
    
    // Change the timer mode
    setTimerMode(nextMode);
    
    // Reset the timer state
    setTimerState('stopped');
    
    // Set the new time based on the next mode
    setTimeLeft(getInitialTimeForMode(nextMode));
  };

  const getInitialTimeForMode = (mode: TimerMode): number => {
    switch (mode) {
      case 'work':
        return workDuration * 60;
      case 'shortBreak':
        return shortBreakDuration * 60;
      case 'longBreak':
        return longBreakDuration * 60;
    }
  };

  // Change mode manually
  const changeMode = (newMode: TimerMode) => {
    if (timerState !== 'stopped') {
      if (!window.confirm('تغییر حالت تایمر باعث ریست شدن زمان می‌شود. آیا مطمئن هستید؟')) {
        return;
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTimerMode(newMode);
    setTimerState('stopped');
    setTimeLeft(getInitialTimeForMode(newMode));
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalTime = timerMode === 'work'
      ? workDuration * 60
      : timerMode === 'shortBreak'
      ? shortBreakDuration * 60
      : longBreakDuration * 60;
    
    return (1 - timeLeft / totalTime) * 100;
  };

  const progress = calculateProgress();
  
  return (
    <div className="max-w-xl mx-auto" dir="rtl">
      <div className="neon-card">
        <h2 className="neon-text text-2xl mb-8 text-center">تایمر پومودورو</h2>
        
        {/* Timer Mode Switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => changeMode('work')}
              className={`py-2 px-4 text-sm rounded-r-md border ${
                timerMode === 'work'
                  ? 'bg-neon text-neon-foreground border-neon'
                  : 'bg-transparent border-neon/30 text-foreground hover:bg-neon/10'
              }`}
            >
              زمان کار
            </button>
            <button
              onClick={() => changeMode('shortBreak')}
              className={`py-2 px-4 text-sm border-y border-x-0 ${
                timerMode === 'shortBreak'
                  ? 'bg-neon text-neon-foreground border-neon'
                  : 'bg-transparent border-neon/30 text-foreground hover:bg-neon/10'
              }`}
            >
              استراحت کوتاه
            </button>
            <button
              onClick={() => changeMode('longBreak')}
              className={`py-2 px-4 text-sm rounded-l-md border ${
                timerMode === 'longBreak'
                  ? 'bg-neon text-neon-foreground border-neon'
                  : 'bg-transparent border-neon/30 text-foreground hover:bg-neon/10'
              }`}
            >
              استراحت بلند
            </button>
          </div>
        </div>
        
        {/* Timer Display */}
        <div className="flex flex-col items-center justify-center mb-8">
          {/* Progress Circle */}
          <div className="relative w-64 h-64 mb-4">
            {/* Background Circle */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted opacity-30"
              />
              
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${((100 - progress) / 100) * (2 * Math.PI * 45)}`}
                strokeLinecap="round"
                className="text-neon transform -rotate-90 origin-center transition-all duration-1000"
              />
            </svg>
            
            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="neon-text text-5xl font-mono">{formatTime(timeLeft)}</span>
              <span className="text-sm mt-2 capitalize">
                {timerMode === 'work' 
                  ? 'زمان کار' 
                  : timerMode === 'shortBreak' 
                  ? 'استراحت کوتاه' 
                  : 'استراحت بلند'}
              </span>
            </div>
          </div>
          
          {/* Cycle Counter */}
          <div className="text-sm text-muted-foreground">
            <span>سیکل {completedCycles} از {cyclesBeforeLongBreak}</span>
          </div>
        </div>
        
        {/* Timer Controls */}
        <div className="flex justify-center space-x-3 space-x-reverse">
          {timerState === 'running' ? (
            <button 
              onClick={pauseTimer}
              className="neon-button"
            >
              توقف
            </button>
          ) : timerState === 'paused' ? (
            <>
              <button 
                onClick={startTimer}
                className="neon-button"
              >
                ادامه
              </button>
              <button 
                onClick={resetTimer}
                className="neon-button"
              >
                ریست
              </button>
            </>
          ) : (
            <button 
              onClick={startTimer}
              className="neon-button"
            >
              شروع
            </button>
          )}
        </div>
        
        {/* Settings */}
        <div className="mt-10 border-t border-neon/30 pt-6">
          <h3 className="neon-text text-lg mb-4">تنظیمات</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="workDuration" className="block mb-1">
                زمان کار (دقیقه)
              </label>
              <input
                id="workDuration"
                type="number"
                min="1"
                max="60"
                value={workDuration}
                onChange={e => setWorkDuration(parseInt(e.target.value) || 25)}
                className="neon-input w-full"
                disabled={timerState !== 'stopped'}
              />
            </div>
            
            <div>
              <label htmlFor="shortBreakDuration" className="block mb-1">
                استراحت کوتاه (دقیقه)
              </label>
              <input
                id="shortBreakDuration"
                type="number"
                min="1"
                max="30"
                value={shortBreakDuration}
                onChange={e => setShortBreakDuration(parseInt(e.target.value) || 5)}
                className="neon-input w-full"
                disabled={timerState !== 'stopped'}
              />
            </div>
            
            <div>
              <label htmlFor="longBreakDuration" className="block mb-1">
                استراحت بلند (دقیقه)
              </label>
              <input
                id="longBreakDuration"
                type="number"
                min="5"
                max="60"
                value={longBreakDuration}
                onChange={e => setLongBreakDuration(parseInt(e.target.value) || 15)}
                className="neon-input w-full"
                disabled={timerState !== 'stopped'}
              />
            </div>
            
            <div>
              <label htmlFor="cyclesBeforeLongBreak" className="block mb-1">
                تعداد سیکل قبل از استراحت بلند
              </label>
              <input
                id="cyclesBeforeLongBreak"
                type="number"
                min="1"
                max="10"
                value={cyclesBeforeLongBreak}
                onChange={e => setCyclesBeforeLongBreak(parseInt(e.target.value) || 4)}
                className="neon-input w-full"
                disabled={timerState !== 'stopped'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
