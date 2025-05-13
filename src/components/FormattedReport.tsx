
import React, { useState } from 'react';
import { Report } from './ReportForm';
import { getFullJalaliDate } from '@/utils/jalali';
import { ClipboardCopy, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface FormattedReportProps {
  reports: Report[];
  date: string;
  onEditReport?: (report: Report) => void;
}

const FormattedReport: React.FC<FormattedReportProps> = ({ reports, date, onEditReport }) => {
  // Convert 24-hour format to Persian time notation (صبح/بعدازظهر)
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
    
    // Convert 0 hour to 12 for midnight
    if (persianHours === 0) {
      persianHours = 12;
    }
    
    return `${persianHours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
  };

  // Calculate total study time
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
  
  // Calculate time difference between start and end time
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
  
  // Mock previous day comparison (in a real app, this would use actual previous day data)
  const previousDayTime = "01:30"; // Mock data
  const previousDayMinutes = 
    parseInt(previousDayTime.split(':')[0]) * 60 + 
    parseInt(previousDayTime.split(':')[1]);
  
  const totalMinutes = 
    parseInt(totalTime.split(':')[0]) * 60 + 
    parseInt(totalTime.split(':')[1]);
  
  const timeDifference = totalMinutes - previousDayMinutes;
  const percentageDiff = Math.round((timeDifference / previousDayMinutes) * 100 * 10) / 10;
  
  const formattedDate = getFullJalaliDate(new Date(date));
  
  // Function to copy formatted report to clipboard
  const copyToClipboard = () => {
    let formattedText = `📊 جمع ساعات مطالعه شما در تاریخ ${formattedDate}\n\n`;
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
      .then(() => toast.success('گزارش کپی شد'))
      .catch(() => toast.error('خطا در کپی گزارش'));
  };

  return (
    <div className="neon-card p-6 text-right" dir="rtl">
      <div className="flex justify-between items-start mb-4">
        <h3 className="neon-text text-xl">📊 جمع ساعات مطالعه شما در تاریخ {formattedDate}</h3>
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
                  {onEditReport && (
                    <button 
                      onClick={() => onEditReport(report)}
                      className="p-1 rounded-full bg-background/40 hover:bg-background/60 transition-colors"
                      title="ویرایش گزارش"
                    >
                      <Edit className="h-4 w-4 text-neon" />
                    </button>
                  )}
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
