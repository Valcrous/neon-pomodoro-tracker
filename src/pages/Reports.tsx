
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportForm, { Report } from '@/components/ReportForm';
import ReportSearch from '@/components/ReportSearch';
import ReportList from '@/components/ReportList';
import { toast } from 'sonner';
import { getCurrentJalaliDate } from '@/utils/jalali';
import CodeSystem from '@/components/CodeSystem';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  
  // Load reports from localStorage on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Save reports to localStorage when they change
  useEffect(() => {
    if (accessCode) {
      localStorage.setItem(`reports_${accessCode}`, JSON.stringify(reports));
    }
  }, [reports, accessCode]);
  
  const loadData = () => {
    // Check for access code in localStorage
    const savedAccessCode = localStorage.getItem('currentAccessCode');
    if (savedAccessCode) {
      setAccessCode(savedAccessCode);
      
      const savedReports = localStorage.getItem(`reports_${savedAccessCode}`);
      if (savedReports) {
        try {
          setReports(JSON.parse(savedReports));
        } catch (error) {
          console.error('Error parsing saved reports:', error);
        }
      }
    }
  };
  
  const handleAddReport = (newReport: Report) => {
    if (!accessCode) {
      toast.error('ابتدا یک کد دسترسی ایجاد کنید');
      return;
    }
    
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

  const handleCodeAccess = (code: string, isPrivate: boolean) => {
    setAccessCode(code);
    
    // Save current code to localStorage
    localStorage.setItem('currentAccessCode', code);
    
    // Load reports for this code
    const savedReports = localStorage.getItem(`reports_${code}`);
    if (savedReports) {
      try {
        setReports(JSON.parse(savedReports));
        toast.success(isPrivate ? 'دسترسی خصوصی برقرار شد' : 'دسترسی عمومی برقرار شد');
      } catch (error) {
        console.error('Error parsing saved reports:', error);
        setReports([]);
      }
    } else {
      setReports([]);
      toast.info('کد جدید ایجاد شد، می‌توانید گزارش‌های خود را ثبت کنید');
    }
  };
  
  return (
    <Layout>
      <div className="space-y-12">
        {/* Code System */}
        <CodeSystem onCodeAccess={handleCodeAccess} currentCode={accessCode} />
        
        {accessCode ? (
          <>
            <ReportForm onAddReport={handleAddReport} initialReport={editingReport} />
            
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
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              برای مشاهده و ثبت گزارش‌ها، ابتدا یک کد دسترسی ایجاد کنید یا کد موجود را وارد کنید.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;
