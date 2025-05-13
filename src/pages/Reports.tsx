
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
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  
  // Load reports from localStorage on mount
  useEffect(() => {
    const savedReports = localStorage.getItem('reports');
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
      } catch (error) {
        console.error('Error parsing saved reports:', error);
      }
    }
  }, []);
  
  // Save reports to localStorage when they change
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);
  
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
      // Ensure today's date is used
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
  
  const handleSearch = (date: string) => {
    setSearchDate(date);
  };
  
  return (
    <Layout>
      <div className="space-y-12">
        <ReportForm onAddReport={handleAddReport} initialReport={editingReport} />
        
        <div>
          <h2 className="neon-text text-2xl mb-6 text-center">گزارشات ثبت شده</h2>
          <ReportSearch onSearch={handleSearch} />
          <ReportList reports={reports} searchDate={searchDate} onEditReport={handleEditReport} />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
