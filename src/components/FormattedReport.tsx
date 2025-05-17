
import React from 'react';
import { Report } from '@/types/database';
import { ClipboardCopy, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { getPersianDayName } from '@/utils/jalali';

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
      </div>
    );
  }

  // نمای استاندارد (غیرآکاردئون)
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
    </div>
  );
};

export default FormattedReport;
