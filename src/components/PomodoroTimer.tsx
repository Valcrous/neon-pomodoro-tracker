
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

// Timer states
type TimerState = 'stopped' | 'running' | 'paused';
type TimerMode = 'work' | 'shortBreak' | 'longBreak';

// Sound URLs
const SOUND_WORK_COMPLETE = 'https://preview--neon-pomodoro-tracker.lovable.app/';
const SOUND_SHORT_BREAK_COMPLETE = 'https://cdn.imgurl.ir/uploads/l104072_Flute_Ringtone_Download_Tum_Hi_Aana_Ringtone.mp3';
const SOUND_LONG_BREAK_COMPLETE = 'https://cdn.imgurl.ir/uploads/z481513_Mobile_Ringtone_-_Number_2_320.mp3';

// Get Persian day of week
const getPersianDayOfWeek = (): string => {
  const days = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  return days[new Date().getDay()];
};

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

  // Sound state
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  
  // Day of week
  const [currentDay, setCurrentDay] = useState(getPersianDayOfWeek());

  // Refs for timer and audio
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setWorkDuration(settings.workDuration);
        setShortBreakDuration(settings.shortBreakDuration);
        setLongBreakDuration(settings.longBreakDuration);
        setCyclesBeforeLongBreak(settings.cyclesBeforeLongBreak);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }

    const savedState = localStorage.getItem('pomodoroState');
    if (savedState) {
      try {
        const state = JSON.parse(savedState);
        setTimerMode(state.timerMode);
        setTimeLeft(state.timeLeft);
        setCompletedCycles(state.completedCycles);
        
        // Only restore running state if the page was recently closed (within the last minute)
        const lastUpdateTime = new Date(state.lastUpdateTime);
        const now = new Date();
        const diffInSeconds = (now.getTime() - lastUpdateTime.getTime()) / 1000;
        
        if (diffInSeconds < 60 && state.timerState === 'running') {
          setTimerState('running');
        }
      } catch (error) {
        console.error('Error parsing saved state:', error);
      }
    }

    // Set up audio element
    audioRef.current = new Audio();
    
    // Update current day
    setCurrentDay(getPersianDayOfWeek());
    
    // Clean up
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    const settings = {
      workDuration,
      shortBreakDuration,
      longBreakDuration,
      cyclesBeforeLongBreak
    };
    
    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [workDuration, shortBreakDuration, longBreakDuration, cyclesBeforeLongBreak]);

  // Save state to localStorage when it changes
  useEffect(() => {
    const state = {
      timerState,
      timerMode,
      timeLeft,
      completedCycles,
      lastUpdateTime: new Date().toISOString()
    };
    
    localStorage.setItem('pomodoroState', JSON.stringify(state));
  }, [timerState, timerMode, timeLeft, completedCycles]);

  // Start timer after mounting if it was running
  useEffect(() => {
    if (timerState === 'running' && !timerRef.current) {
      startTimerInterval();
    }
  }, [timerState]);

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

  // Play sound when timer completes
  const playSound = () => {
    if (isMuted || !audioRef.current) return;
    
    let soundUrl;
    if (timerMode === 'work') {
      soundUrl = SOUND_WORK_COMPLETE;
    } else if (timerMode === 'shortBreak') {
      soundUrl = SOUND_SHORT_BREAK_COMPLETE;
    } else {
      soundUrl = SOUND_LONG_BREAK_COMPLETE;
    }
    
    try {
      audioRef.current.src = soundUrl;
      audioRef.current.play()
        .then(() => {
          setIsPlayingSound(true);
        })
        .catch((error) => {
          console.error("Error playing sound:", error);
        });
      
      // Stop the sound after 5 seconds
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
          setIsPlayingSound(false);
        }
      }, 5000);
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  };

  const stopSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingSound(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isPlayingSound) {
      stopSound();
    }
  };

  // Timer interval setup
  const startTimerInterval = () => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer complete
          clearInterval(timerRef.current!);
          
          // Play notification sound
          playSound();
          
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

  // Timer logic
  const startTimer = () => {
    if (timerState === 'running') return;
    
    setTimerState('running');
    startTimerInterval();
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimerState('paused');
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
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

  // Reset cycles manually
  const resetCycles = () => {
    setCompletedCycles(0);
    toast.info('سیکل‌های پومودورو ریست شدند');
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
      timerRef.current = null;
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="neon-text text-2xl text-center">تایمر پومودورو</h2>
          <span className="text-neon text-lg">{currentDay}</span>
        </div>
        
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
            
            {/* Progress Percentage */}
            <div className="absolute top-3 right-3 bg-background/60 rounded-md px-2 py-1">
              <span className="text-sm font-mono text-neon">{Math.round(progress)}%</span>
            </div>
            
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
          <div className="flex items-center space-x-2 space-x-reverse">
            <span className="text-sm text-muted-foreground">
              سیکل {completedCycles} از {cyclesBeforeLongBreak}
            </span>
            <button 
              onClick={resetCycles}
              className="p-1 rounded-full hover:bg-background/40 transition-colors"
              title="ریست سیکل‌ها"
            >
              <RotateCcw className="h-4 w-4 text-neon" />
            </button>
          </div>
        </div>
        
        {/* Timer Controls */}
        <div className="flex justify-center items-center space-x-3 space-x-reverse">
          {timerState === 'running' ? (
            <button 
              onClick={pauseTimer}
              className="neon-button flex items-center space-x-2 space-x-reverse"
            >
              <Pause className="h-5 w-5" />
              <span>توقف</span>
            </button>
          ) : timerState === 'paused' ? (
            <>
              <button 
                onClick={startTimer}
                className="neon-button flex items-center space-x-2 space-x-reverse"
              >
                <Play className="h-5 w-5" />
                <span>ادامه</span>
              </button>
              <button 
                onClick={resetTimer}
                className="neon-button flex items-center space-x-2 space-x-reverse"
              >
                <RotateCcw className="h-5 w-5" />
                <span>ریست</span>
              </button>
            </>
          ) : (
            <button 
              onClick={startTimer}
              className="neon-button flex items-center space-x-2 space-x-reverse"
            >
              <Play className="h-5 w-5" />
              <span>شروع</span>
            </button>
          )}
          
          {/* Sound toggle button */}
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-background/40 transition-colors"
            title={isMuted ? "فعال کردن صدا" : "قطع صدا"}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-neon" />
            ) : (
              <Volume2 className="h-5 w-5 text-neon" />
            )}
          </button>
          
          {/* Stop sound button - only show when sound is playing */}
          {isPlayingSound && !isMuted && (
            <button
              onClick={stopSound}
              className="neon-button"
              title="قطع صدای هشدار"
            >
              قطع صدا
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
