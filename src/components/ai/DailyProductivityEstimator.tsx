
import React, { useState } from 'react';
import { estimateDailyProductivity } from '@/utils/ai-client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DailyProductivityEstimator: React.FC = () => {
  const [trackedData, setTrackedData] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackedData.trim()) {
      toast("لطفاً توضیحات فعالیت‌های خود را وارد کنید.");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await estimateDailyProductivity({ trackedData });
      setResult(response.productivityEstimate);
    } catch (error) {
      console.error("Error estimating productivity:", error);
      toast("خطا در تحلیل بهره‌وری. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neon-card" dir="rtl">
      <h2 className="neon-text text-xl mb-6">تخمین بهره‌وری روزانه</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="trackedData" className="block text-sm">
            لطفاً توضیحات فعالیت‌های روزانه خود را وارد کنید:
          </label>
          <textarea
            id="trackedData"
            value={trackedData}
            onChange={(e) => setTrackedData(e.target.value)}
            className="neon-input w-full min-h-[120px]"
            placeholder="مثال: امروز 2 ساعت ریاضی، 1.5 ساعت فیزیک و 1 ساعت ادبیات مطالعه کردم. در ریاضی مشکل داشتم اما در فیزیک خوب پیش رفتم..."
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-center">
          <button 
            type="submit" 
            className="neon-button flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            تحلیل بهره‌وری
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-6 p-4 bg-neon/10 rounded-md border border-neon">
          <h3 className="text-lg font-bold mb-2 neon-text">نتیجه تحلیل:</h3>
          <p className="whitespace-pre-line">{result}</p>
        </div>
      )}
    </div>
  );
};

export default DailyProductivityEstimator;
