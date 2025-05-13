
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportForm, { Report } from '@/components/ReportForm';
import ReportSearch from '@/components/ReportSearch';
import ReportList from '@/components/ReportList';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchDate, setSearchDate] = useState('');
  
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
    setReports(prev => [newReport, ...prev]);
  };
  
  const handleSearch = (date: string) => {
    setSearchDate(date);
  };
  
  return (
    <Layout>
      <div className="space-y-12">
        <ReportForm onAddReport={handleAddReport} />
        
        <div>
          <h2 className="neon-text text-2xl mb-6 text-center">گزارشات ثبت شده</h2>
          <ReportSearch onSearch={handleSearch} />
          <ReportList reports={reports} searchDate={searchDate} />
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
