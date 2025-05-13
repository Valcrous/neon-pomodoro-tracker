
import React from 'react';
import { Report } from './ReportForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FormattedReport from './FormattedReport';

interface ReportListProps {
  reports: Report[];
  searchDate: string;
  onEditReport?: (report: Report) => void;
}

const ReportList: React.FC<ReportListProps> = ({ reports, searchDate, onEditReport }) => {
  // Filter reports if search date is provided
  const filteredReports = searchDate
    ? reports.filter(report => report.date.includes(searchDate))
    : reports;

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
          {searchDate 
            ? 'هیچ گزارشی با این تاریخ یافت نشد' 
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
          
          return (
            <AccordionItem key={date} value={date} className="neon-card mb-4 overflow-hidden border-0">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex justify-between items-center w-full">
                  <h3 className="neon-text text-xl text-right">
                    تاریخ: {date}
                  </h3>
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
