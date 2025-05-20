
import React, { useState } from 'react';
import { compareProjectPerformance } from '@/utils/ai-client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useGemini } from '@/context/GeminiContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ProjectPerformanceComparator: React.FC = () => {
  const { apiKey, model, isConfigured } = useGemini();
  const [currentStudyData, setCurrentStudyData] = useState('');
  const [historicalData, setHistoricalData] = useState('');
  const [userGoals, setUserGoals] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    deviations: string;
    recommendations: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
      toast("لطفاً ابتدا کلید API جمنای را در بخش تنظیمات وارد کنید");
      return;
    }
    
    if (!currentStudyData.trim() || !historicalData.trim()) {
      toast("لطفاً اطلاعات درس فعلی و سابقه تحصیلی را وارد کنید.");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await compareProjectPerformance({
        currentStudyData,
        historicalData,
        userGoals: userGoals || undefined,
        userApiKey: apiKey,
        model
      });
      setResult(response);
    } catch (error) {
      console.error("Error comparing performance:", error);
      toast(error instanceof Error ? error.message : "خطا در مقایسه عملکرد. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neon-card" dir="rtl">
      <h2 className="neon-text text-xl mb-6">مقایسه عملکرد تحصیلی</h2>
      
      {!isConfigured && (
        <Alert className="mb-6 bg-yellow-500/10 border-yellow-500 text-foreground">
          <AlertDescription>
            برای استفاده از قابلیت‌های هوش مصنوعی، لطفاً ابتدا کلید API جمنای را در بخش{' '}
            <a href="/settings" className="text-neon underline">تنظیمات</a> وارد کنید.
          </AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="currentStudyData" className="block text-sm">
            اطلاعات درس فعلی:
          </label>
          <textarea
            id="currentStudyData"
            value={currentStudyData}
            onChange={(e) => setCurrentStudyData(e.target.value)}
            className="neon-input w-full min-h-[80px]"
            placeholder="نام درس، سطح یادگیری، چالش‌ها، زمان صرف شده و..."
            disabled={isLoading || !isConfigured}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="historicalData" className="block text-sm">
            اطلاعات درس مشابه قبلی:
          </label>
          <textarea
            id="historicalData"
            value={historicalData}
            onChange={(e) => setHistoricalData(e.target.value)}
            className="neon-input w-full min-h-[80px]"
            placeholder="نحوه پیشرفت در درس مشابه، درس‌های آموخته شده، زمان صرف شده و..."
            disabled={isLoading || !isConfigured}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="userGoals" className="block text-sm">
            اهداف یادگیری (اختیاری):
          </label>
          <textarea
            id="userGoals"
            value={userGoals}
            onChange={(e) => setUserGoals(e.target.value)}
            className="neon-input w-full min-h-[60px]"
            placeholder="اهداف شما برای این درس (اختیاری)"
            disabled={isLoading || !isConfigured}
          />
        </div>
        
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="neon-button flex items-center gap-2"
            disabled={isLoading || !isConfigured}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            مقایسه عملکرد
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-neon/10 rounded-md border border-neon">
            <h3 className="text-lg font-bold mb-2 neon-text">خلاصه مقایسه:</h3>
            <p>{result.summary}</p>
          </div>
          
          <div className="p-4 bg-neon/10 rounded-md border border-neon">
            <h3 className="text-lg font-bold mb-2 neon-text">تفاوت‌های کلیدی:</h3>
            <p>{result.deviations}</p>
          </div>
          
          <div className="p-4 bg-neon/10 rounded-md border border-neon">
            <h3 className="text-lg font-bold mb-2 neon-text">پیشنهادها:</h3>
            <p>{result.recommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectPerformanceComparator;
