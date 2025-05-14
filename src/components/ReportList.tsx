
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
}

const ReportList: React.FC<ReportListProps> = ({ 
  reports, 
  searchDate, 
  searchCourse,
  onEditReport, 
  onDeleteReport 
}) => {
  // Filter reports based on search criteria
  const filteredReports = reports.filter(report => {
    const matchesDate = !searchDate || report.date.includes(searchDate);
    const matchesCourse = !searchCourse || 
      report.courseName.toLowerCase().includes(searchCourse.toLowerCase());
    return matchesDate && matchesCourse;
  });

  // Sort by date (newest first) and then by start time
  const sortedReports = [...filteredReports].sort((a, b) => {
    const dateComparison = b.date.localeCompare(a.date);
    if (dateComparison !== 0) return dateComparison;
    return a.startTime.localeCompare(b.startTime);
  });

  // Group reports by date
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

  // Calculate total study time for each date
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
          
          return (
            <AccordionItem key={date} value={date} className="neon-card mb-4 overflow-hidden border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <h3 className="neon-text text-xl text-right">
                      {date}
                    </h3>
                    <span className="text-muted-foreground">({dayName})</span>
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
                  onEditReport={onEditReport}
                  onDeleteReport={onDeleteReport}
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
