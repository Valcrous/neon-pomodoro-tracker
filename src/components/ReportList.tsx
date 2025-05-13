
import React from 'react';
import { Report } from './ReportForm';
import { getFullJalaliDate, parseJalaliString } from '@/utils/jalali';
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

  return (
    <div className="space-y-8" dir="rtl">
      {Object.entries(groupedReports).map(([date, dateReports]) => (
        <FormattedReport 
          key={date} 
          reports={dateReports} 
          date={date} 
          onEditReport={onEditReport}
        />
      ))}
    </div>
  );
};

export default ReportList;
