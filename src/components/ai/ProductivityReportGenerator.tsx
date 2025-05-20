
import React, { useState } from 'react';
import { generateProductivityReport } from '@/utils/ai-client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ProductivityReportGenerator: React.FC = () => {
  const [weeklyData, setWeeklyData] = useState('');
  const [historicalData, setHistoricalData] = useState('');
  const [result, setResult] = useState<{
    summary: string;
    insights: string;
    optimizationSuggestions: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weeklyData.trim()) {
      toast("لطفاً داده‌های هفتگی خود را وارد کنید.");
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const response = await generateProductivityReport({ 
        weeklyData,
        historicalData: historicalData || undefined
      });
      setResult(response);
    } catch (error) {
      console.error("Error generating report:", error);
      toast("خطا در تولید گزارش. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neon-card" dir="rtl">
      <h2 className="neon-text text-xl mb-6">گزارش بهره‌وری هفتگی</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="weeklyData" className="block text-sm">
            داده‌های بهره‌وری هفتگی:
          </label>
          <textarea
            id="weeklyData"
            value={weeklyData}
            onChange={(e) => setWeeklyData(e.target.value)}
            className="neon-input w-full min-h-[100px]"
            placeholder="توضیحات کارهای انجام شده در هفته، زمان صرف شده برای هر درس، زمان مطالعه در روزهای مختلف و..."
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="historicalData" className="block text-sm">
            داده‌های بهره‌وری قبلی (اختیاری):
          </label>
          <textarea
            id="historicalData"
            value={historicalData}
            onChange={(e) => setHistoricalData(e.target.value)}
            className="neon-input w-full min-h-[80px]"
            placeholder="توضیحات بهره‌وری در هفته‌های گذشته برای مقایسه (اختیاری)"
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
            تولید گزارش
          </button>
        </div>
      </form>
      
      {result && (
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-neon/10 rounded-md border border-neon">
            <h3 className="text-lg font-bold mb-2 neon-text">خلاصه:</h3>
            <p>{result.summary}</p>
          </div>
          
          <div className="p-4 bg-neon/10 rounded-md border border-neon">
            <h3 className="text-lg font-bold mb-2 neon-text">تحلیل الگوها:</h3>
            <p>{result.insights}</p>
          </div>
          
          <div className="p-4 bg-neon/10 rounded-md border border-neon">
            <h3 className="text-lg font-bold mb-2 neon-text">پیشنهادهای بهینه‌سازی:</h3>
            <p>{result.optimizationSuggestions}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductivityReportGenerator;
