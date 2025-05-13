
import React from 'react';
import { Report } from './ReportForm';
import { getFullJalaliDate, parseJalaliString } from '@/utils/jalali';

interface ReportListProps {
  reports: Report[];
  searchDate: string;
}

const ReportList: React.FC<ReportListProps> = ({ reports, searchDate }) => {
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

  return (
    <div className="space-y-8" dir="rtl">
      {Object.entries(groupedReports).map(([date, dateReports]) => {
        // Convert string date to proper date object for formatting
        const dateObj = parseJalaliString(date);
        const formattedDate = dateObj ? getFullJalaliDate(dateObj) : date;
        
        return (
          <div key={date} className="neon-card">
            <h3 className="neon-text text-lg mb-4">{formattedDate}</h3>
            
            <div className="space-y-4">
              {dateReports.map(report => (
                <div 
                  key={report.id} 
                  className="p-4 border border-neon/30 rounded-md bg-background/40 hover:bg-background/60 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-neon">{report.courseName}</h4>
                    <div className="text-sm">
                      <span>{report.startTime}</span>
                      <span className="mx-1">-</span>
                      <span>{report.endTime}</span>
                    </div>
                  </div>
                  
                  {report.description && (
                    <p className="text-muted-foreground mt-2">{report.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReportList;
