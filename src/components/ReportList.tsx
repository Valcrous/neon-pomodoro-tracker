
import React from 'react';
import { Report } from './ReportForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FormattedReport from './FormattedReport';
import { getPersianDayName } from '@/utils/jalali';

interface ReportListProps {
  reports: Report[];
  searchDate: string;
  searchCourse: string;
  onEditReport?: (report: Report) => void;
  onDeleteReport?: (reportId: string) => void;
  isPrivateAccess: boolean;
  currentUsername?: string | null;
}

const ReportList: React.FC<ReportListProps> = ({ 
  reports, 
  searchDate, 
  searchCourse,
  onEditReport, 
  onDeleteReport,
  isPrivateAccess,
  currentUsername
}) => {
  // فیلتر گزارش‌ها بر اساس معیارهای جستجو
  const filteredReports = reports.filter(report => {
    // فقط گزارش‌های کاربر فعلی را نشان بده، مگر اینکه دسترسی خصوصی باشد
    if (!isPrivateAccess && report.username !== currentUsername) {
      return false;
    }
    
    const matchesDate = !searchDate || report.date.includes(searchDate);
    const matchesCourse = !searchCourse || 
      report.courseName.toLowerCase().includes(searchCourse.toLowerCase());
    return matchesDate && matchesCourse;
  });

  // مرتب‌سازی بر اساس تاریخ (جدیدترین اول) و سپس بر اساس زمان شروع
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);
    if (dateComparison !== 0) return dateComparison;
    return a.startTime.localeCompare(b.startTime);
  });

  // گروه‌بندی گزارش‌ها بر اساس تاریخ
  const groupedReports: { [key: string]: Report[] } = {};
  
  sortedReports.forEach(report => {
    if (!groupedReports[report.date]) {
      groupedReports[report.date] = [];
    }
    groupedReports[report.date].push(report);
  });

  if (sortedReports.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {searchDate || searchCourse
            ? 'هیچ گزارشی با این مشخصات یافت نشد' 
            : 'هیچ گزارشی ثبت نشده است'}
        </p>
      </div>
    );
  }

  // محاسبه مجموع زمان مطالعه برای هر تاریخ
  const calculateTotalTime = (dateReports: Report[]): string => {
    let totalMinutes = 0;
    
    dateReports.forEach(report => {
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

  return (
    <div className="space-y-4" dir="rtl">
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(groupedReports).map(([date, dateReports]) => {
          const totalTime = calculateTotalTime(dateReports);
          const dayName = getPersianDayName(date);
          
          // اضافه کردن یک روز به نام روز هفته (پنجشنبه به جای چهارشنبه)
          const adjustedDayName = (() => {
            const dayNames = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];
            const index = dayNames.indexOf(dayName);
            if (index >= 0) {
              const newIndex = (index + 1) % 7;
              return dayNames[newIndex];
            }
            return dayName;
          })();
          
          return (
            <AccordionItem key={date} value={date} className="neon-card mb-4 overflow-hidden border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h3 className="neon-text text-xl text-right">
                      {date}
                    </h3>
                    <span className="text-muted-foreground">({adjustedDayName})</span>
                  </div>
                  <span className="text-neon text-lg">
                    مجموع: {totalTime}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-0">
                <FormattedReport 
                  reports={dateReports} 
                  date={date} 
                  onEditReport={isPrivateAccess ? onEditReport : undefined}
                  onDeleteReport={isPrivateAccess ? onDeleteReport : undefined}
                  isAccordion={true}
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default ReportList;
