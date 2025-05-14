
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
      // When user adds or edits a report, save it to their personal storage first
      const personalStorage = localStorage.getItem('personal_reports') || '[]';
      let personalReports = JSON.parse(personalStorage);
      
      // Update personal reports
      personalReports = [...reports];
      localStorage.setItem('personal_reports', JSON.stringify(personalReports));
      
      // Also update the shared code storage
      localStorage.setItem(`reports_${accessCode}`, JSON.stringify(reports));
    }
  }, [reports, accessCode]);
  
  const loadData = () => {
    // Always load personal reports first if they exist
    const personalStorage = localStorage.getItem('personal_reports');
    if (personalStorage) {
      try {
        setReports(JSON.parse(personalStorage));
      } catch (error) {
        console.error('Error parsing personal reports:', error);
      }
    }
    
    // Check for access code in localStorage
    const savedAccessCode = localStorage.getItem('currentAccessCode');
    if (savedAccessCode) {
      setAccessCode(savedAccessCode);
      
      // If accessing with a shared code, load those reports instead
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
    
    // Check if this is a shared code or personal code
    const personalStorage = localStorage.getItem('personal_reports');
    const sharedStorage = localStorage.getItem(`reports_${code}`);
    
    if (sharedStorage) {
      // If shared code exists, load those reports
      try {
        setReports(JSON.parse(sharedStorage));
        toast.success(isPrivate ? 'دسترسی خصوصی برقرار شد' : 'دسترسی عمومی برقرار شد');
      } catch (error) {
        console.error('Error parsing shared reports:', error);
        setReports([]);
      }
    } else {
      // If this is a new code, create it with current reports or empty array
      if (personalStorage && code === localStorage.getItem('privateAccessCode')) {
        // If personal reports exist and this is the private code, use those
        try {
          const personalReports = JSON.parse(personalStorage);
          setReports(personalReports);
          localStorage.setItem(`reports_${code}`, JSON.stringify(personalReports));
        } catch (error) {
          console.error('Error parsing personal reports:', error);
          setReports([]);
          localStorage.setItem(`reports_${code}`, '[]');
        }
      } else {
        // For new codes or public codes, start with empty array
        setReports([]);
        localStorage.setItem(`reports_${code}`, '[]');
      }
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
