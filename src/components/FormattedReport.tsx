
import React from 'react';
import { Report } from '@/types/database';
import { ClipboardCopy, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getPersianDayName, getYesterdayJalaliDate } from '@/utils/jalali';

interface FormattedReportProps {
  reports: Report[];
  date: string;
  onEditReport?: (report: Report) => void;
  onDeleteReport?: (reportId: string) => void;
  isAccordion?: boolean;
}

const FormattedReport: React.FC<FormattedReportProps> = ({ 
  reports, 
  date, 
  onEditReport, 
  onDeleteReport,
  isAccordion = false 
}) => {
  // تبدیل فرمت 24 ساعته به نماد زمانی فارسی (صبح/بعدازظهر)
  const toPersianTimeFormat = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);
    let persianHours = hours;
    let suffix = 'صبح';
    
    if (hours >= 12) {
      suffix = 'بعدازظهر';
      if (hours > 12) {
        persianHours = hours - 12;
      }
    }
    
    // تبدیل ساعت 0 به 12 برای نیمه‌شب
    if (persianHours === 0) {
      persianHours = 12;
    }
    
    return `${persianHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  };

  // محاسبه کل زمان مطالعه
  const calculateTotalTime = (reports: Report[]): string => {
    let totalMinutes = 0;
    
    reports.forEach(report => {
      const startParts = report.startTime.split(':');
      const endParts = report.endTime.split(':');
      
      const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
      const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
      
      totalMinutes += endMinutes - startMinutes;
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  // محاسبه اختلاف زمان بین زمان شروع و پایان
  const calculateTimeDifference = (startTime: string, endTime: string): string => {
    const startParts = startTime.split(':');
    const endParts = endTime.split(':');
    
    const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
    const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
    
    const diffMinutes = endMinutes - startMinutes;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const totalTime = calculateTotalTime(reports);
  const dayName = getPersianDayName(date);
  
  // بدست آوردن تاریخ دیروز با استفاده از تابع کمکی
  const getYesterdayDate = (dateStr: string): string | null => {
    try {
      return getYesterdayJalaliDate(dateStr);
    } catch (error) {
      console.error('خطا در محاسبه تاریخ دیروز:', error);
      return null;
    }
  };
  
  // بدست آوردن کل زمان مطالعه دیروز (از localStorage)
  const getYesterdayTotalTime = (): string => {
    try {
      const yesterdayDate = getYesterdayDate(date);
      if (!yesterdayDate) return "00:00";
      
      // بدست آوردن کد دسترسی فعلی
      const currentCode = localStorage.getItem('currentAccessCode');
      if (!currentCode) return "00:00";
      
      // تلاش برای بدست آوردن گزارش‌ها برای کد فعلی
      const storageKey = `reports_${currentCode}`;
      const savedReports = localStorage.getItem(storageKey);
      if (!savedReports) return "00:00";
      
      // تجزیه گزارش‌ها و فیلتر کردن بر اساس تاریخ دیروز
      const allReports: Report[] = JSON.parse(savedReports);
      const yesterdayReports = allReports.filter(r => r.date === yesterdayDate);
      
      if (yesterdayReports.length === 0) return "00:00";
      
      // محاسبه کل زمان برای گزارش‌های دیروز
      return calculateTotalTime(yesterdayReports);
    } catch (error) {
      console.error('خطا در محاسبه کل زمان دیروز:', error);
      return "00:00";
    }
  };
  
  // مقایسه با زمان مطالعه دیروز
  const yesterdayTime = getYesterdayTotalTime();
  const yesterdayMinutes = 
    parseInt(yesterdayTime.split(':')[0]) * 60 + 
    parseInt(yesterdayTime.split(':')[1]);
  
  const totalMinutes = 
    parseInt(totalTime.split(':')[0]) * 60 + 
    parseInt(totalTime.split(':')[1]);
  
  const timeDifference = totalMinutes - yesterdayMinutes;
  const percentageDiff = yesterdayMinutes > 0 
    ? Math.round((timeDifference / yesterdayMinutes) * 100 * 10) / 10
    : 100; // اگر دیروز 0 بود، پس افزایش 100% است
  
  // تابع برای کپی کردن گزارش قالب‌بندی شده به کلیپ‌بورد
  const copyToClipboard = () => {
    let formattedText = `📊 جمع ساعات مطالعه شما در تاریخ ${date} (${dayName})\n\n`;
    formattedText += `🕒 مجموع ساعات: ${totalTime}\n\n`;
    formattedText += `📋 گزارش مطالعات:\n\n`;
    
    reports.forEach((report, index) => {
      const timeDiff = calculateTimeDifference(report.startTime, report.endTime);
      const persianStartTime = toPersianTimeFormat(report.startTime);
      const persianEndTime = toPersianTimeFormat(report.endTime);
      
      formattedText += `${index + 1}. ${report.courseName}\n`;
      formattedText += `   ⏱ زمان: ${persianStartTime} تا ${persianEndTime} (${timeDiff})\n`;
      if (report.description) {
        formattedText += `   📝 توضیحات: ${report.description}\n`;
      }
      formattedText += '\n';
    });
    
    formattedText += `📈 مقایسه با روز قبل:\n`;
    if (timeDifference > 0) {
      const hoursDiff = Math.floor(timeDifference / 60);
      const minutesDiff = timeDifference % 60;
      const timeDiffFormatted = `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}`;
      formattedText += `✅ امروز ${timeDiffFormatted} (${percentageDiff}%) بیشتر از دیروز مطالعه داشتی!\n`;
      formattedText += `💯 به خودت ببال، این پیشرفت نتیجه تلاش مستمر توست.`;
    } else if (timeDifference < 0) {
      const absDiff = Math.abs(timeDifference);
      const hoursDiff = Math.floor(absDiff / 60);
      const minutesDiff = absDiff % 60;
      const timeDiffFormatted = `${hoursDiff.toString().padStart(2, '0')}:${minutesDiff.toString().padStart(2, '0')}`;
      formattedText += `⚠️ امروز ${timeDiffFormatted} (${Math.abs(percentageDiff)}%) کمتر از دیروز مطالعه داشتی.\n`;
      formattedText += `🔄 سعی کن فردا جبران کنی!`;
    } else {
      formattedText += `📊 مطالعه امروز مساوی با دیروز بود.\n`;
      formattedText += `🔄 سعی کن فردا بیشتر مطالعه کنی!`;
    }
    
    navigator.clipboard.writeText(formattedText)
      .then(() => toast({
        title: "گزارش کپی شد"
      }))
      .catch(() => toast({
        title: "خطا در کپی گزارش",
        variant: "destructive"
      }));
  };

  // اگر در آکاردئون استفاده شود، یک نسخه فشرده‌تر را نمایش دهید
  if (isAccordion) {
    // ... کد موجود نسخه آکاردئون حفظ می‌شود
    return (
      <div className="pb-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="neon-text text-xl">📊 جمع ساعات مطالعه شما در تاریخ {date} ({dayName})</h3>
          <div className="flex gap-2">
            <button 
              onClick={copyToClipboard}
              className="p-2 rounded-full bg-background/40 hover:bg-background/60 transition-colors"
              title="کپی گزارش"
            >
              <ClipboardCopy className="h-5 w-5 text-neon" />
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {reports.map((report, index) => {
            const timeDiff = calculateTimeDifference(report.startTime, report.endTime);
            const persianStartTime = toPersianTimeFormat(report.startTime);
            const persianEndTime = toPersianTimeFormat(report.endTime);
            
            return (
              <div key={report.id} className="border border-neon/30 rounded-md p-4 bg-background/40">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-neon">
                    {index + 1}. {report.courseName}
                  </h5>
                  <div className="flex space-x-1 space-x-reverse">
                    {onEditReport && (
                      <button 
                        onClick={() => onEditReport(report)}
                        className="p-1 rounded-full bg-background/40 hover:bg-background/60 transition-colors"
                        title="ویرایش گزارش"
                      >
                        <Edit className="h-4 w-4 text-neon" />
                      </button>
                    )}
                    {onDeleteReport && (
                      <button 
                        onClick={() => onDeleteReport(report.id)}
                        className="p-1 rounded-full bg-background/40 hover:bg-background/60 transition-colors"
                        title="حذف گزارش"
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mr-5">⏱ زمان: {persianStartTime} تا {persianEndTime} ({timeDiff})</p>
                {report.description && (
                  <p className="mr-5">📝 توضیحات: {report.description}</p>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 border-t border-neon/30 pt-4">
          <h4 className="font-bold mb-2">📈 مقایسه با روز قبل:</h4>
          {timeDifference > 0 ? (
            <>
              <p className="text-green-400">
                ✅ امروز {Math.floor(timeDifference / 60).toString().padStart(2, '0')}:{(timeDifference % 60).toString().padStart(2, '0')} ({percentageDiff}%) بیشتر از دیروز مطالعه داشتی!
              </p>
              <p className="text-green-400">💯 به خودت ببال، این پیشرفت نتیجه تلاش مستمر توست.</p>
            </>
          ) : timeDifference < 0 ? (
            <>
              <p className="text-yellow-400">
                ⚠️ امروز {Math.floor(Math.abs(timeDifference) / 60).toString().padStart(2, '0')}:{(Math.abs(timeDifference) % 60).toString().padStart(2, '0')} ({Math.abs(percentageDiff)}%) کمتر از دیروز مطالعه داشتی.
              </p>
              <p className="text-yellow-400">🔄 سعی کن فردا جبران کنی!</p>
            </>
          ) : (
            <>
              <p className="text-blue-400">📊 مطالعه امروز مساوی با دیروز بود.</p>
              <p className="text-blue-400">🔄 سعی کن فردا بیشتر مطالعه کنی!</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // نمای استاندارد (غیرآکاردئون)
  // ... کد موجود نسخه استاندارد حفظ می‌شود
  return (
    <div className="neon-card p-6 text-right" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="neon-text text-xl">📊 جمع ساعات مطالعه شما در تاریخ {date} ({dayName})</h3>
        <div className="flex gap-2">
          <button 
            onClick={copyToClipboard}
            className="p-2 rounded-full bg-background/40 hover:bg-background/60 transition-colors"
            title="کپی گزارش"
          >
            <ClipboardCopy className="h-5 w-5 text-neon" />
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-xl font-bold">🕒 مجموع ساعات: {totalTime}</p>
      </div>
      
      <div className="mb-6">
        <h4 className="font-bold text-lg mb-3">📋 گزارش مطالعات:</h4>
        <div className="space-y-4">
          {reports.map((report, index) => {
            const timeDiff = calculateTimeDifference(report.startTime, report.endTime);
            const persianStartTime = toPersianTimeFormat(report.startTime);
            const persianEndTime = toPersianTimeFormat(report.endTime);
            
            return (
              <div key={report.id} className="border border-neon/30 rounded-md p-4 bg-background/40">
                <div className="flex justify-between items-start">
                  <h5 className="font-bold text-neon">
                    {index + 1}. {report.courseName}
                  </h5>
                  <div className="flex space-x-1 space-x-reverse">
                    {onEditReport && (
                      <button 
                        onClick={() => onEditReport(report)}
                        className="p-1 rounded-full bg-background/40 hover:bg-background/60 transition-colors"
                        title="ویرایش گزارش"
                      >
                        <Edit className="h-4 w-4 text-neon" />
                      </button>
                    )}
                    {onDeleteReport && (
                      <button 
                        onClick={() => onDeleteReport(report.id)}
                        className="p-1 rounded-full bg-background/40 hover:bg-background/60 transition-colors"
                        title="حذف گزارش"
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="mr-5">⏱ زمان: {persianStartTime} تا {persianEndTime} ({timeDiff})</p>
                {report.description && (
                  <p className="mr-5">📝 توضیحات: {report.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 border-t border-neon/30 pt-4">
        <h4 className="font-bold mb-2">📈 مقایسه با روز قبل:</h4>
        {timeDifference > 0 ? (
          <>
            <p className="text-green-400">
              ✅ امروز {Math.floor(timeDifference / 60).toString().padStart(2, '0')}:{(timeDifference % 60).toString().padStart(2, '0')} ({percentageDiff}%) بیشتر از دیروز مطالعه داشتی!
            </p>
            <p className="text-green-400">💯 به خودت ببال، این پیشرفت نتیجه تلاش مستمر توست.</p>
          </>
        ) : timeDifference < 0 ? (
          <>
            <p className="text-yellow-400">
              ⚠️ امروز {Math.floor(Math.abs(timeDifference) / 60).toString().padStart(2, '0')}:{(Math.abs(timeDifference) % 60).toString().padStart(2, '0')} ({Math.abs(percentageDiff)}%) کمتر از دیروز مطالعه داشتی.
            </p>
            <p className="text-yellow-400">🔄 سعی کن فردا جبران کنی!</p>
          </>
        ) : (
          <>
            <p className="text-blue-400">📊 مطالعه امروز مساوی با دیروز بود.</p>
            <p className="text-blue-400">🔄 سعی کن فردا بیشتر مطالعه کنی!</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FormattedReport;
