
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportForm, { Report } from '@/components/ReportForm';
import ReportSearch from '@/components/ReportSearch';
import ReportList from '@/components/ReportList';
import { toast } from 'sonner';
import { getCurrentJalaliDate } from '@/utils/jalali';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  
  // Load reports from localStorage on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Save reports to localStorage when they change
  useEffect(() => {
    localStorage.setItem('personal_reports', JSON.stringify(reports));
  }, [reports]);
  
  const loadData = () => {
    // Load personal reports
    const personalStorage = localStorage.getItem('personal_reports');
    if (personalStorage) {
      try {
        setReports(JSON.parse(personalStorage));
      } catch (error) {
        console.error('Error parsing personal reports:', error);
      }
    }
  };
  
  const handleAddReport = (newReport: Report) => {
    if (editingReport) {
      // Update existing report
      setReports(prev => prev.map(report => 
        report.id === editingReport.id ? newReport : report
      ));
      setEditingReport(null);
      toast.success('گزارش با موفقیت بروزرسانی شد');
    } else {
      // Add new report
      // Use the corrected getCurrentJalaliDate function
      const today = getCurrentJalaliDate();
      const reportWithToday = {...newReport, date: today};
      
      setReports(prev => [reportWithToday, ...prev]);
      toast.success('گزارش با موفقیت ثبت شد');
    }
  };
  
  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('آیا از حذف این گزارش اطمینان دارید؟')) {
      setReports(prev => prev.filter(report => report.id !== reportId));
      toast.success('گزارش با موفقیت حذف شد');
    }
  };
  
  const handleSearch = (date: string, course: string) => {
    setSearchDate(date);
    setSearchCourse(course);
  };

  return (
    <Layout>
      <div className="space-y-12">
        <ReportForm 
          onAddReport={handleAddReport} 
          initialReport={editingReport} 
          currentDate={getCurrentJalaliDate()}
        />
        
        <div>
          <h2 className="neon-text text-2xl mb-6 text-center">گزارشات ثبت شده</h2>
          <ReportSearch onSearch={handleSearch} />
          <ReportList 
            reports={reports} 
            searchDate={searchDate}
            searchCourse={searchCourse}
            onEditReport={handleEditReport}
            onDeleteReport={handleDeleteReport} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
