
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportForm, { Report } from '@/components/ReportForm';
import ReportSearch from '@/components/ReportSearch';
import ReportList from '@/components/ReportList';
import { toast } from '@/components/ui/use-toast';
import { getCurrentJalaliDate } from '@/utils/jalali';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [username, setUsername] = useState('');
  
  // بررسی ثبت نام کاربر و بارگذاری گزارش‌ها
  useEffect(() => {
    const storedUsername = localStorage.getItem('reportUsername');
    const storedUserRegistered = localStorage.getItem('userRegistered');
    
    if (storedUsername && storedUserRegistered === 'true') {
      setIsUserRegistered(true);
      setUsername(storedUsername);
      localStorage.setItem('currentAccessCode', storedUsername);
      loadData(storedUsername);
    } else {
      // اگر کاربر ثبت نام نکرده باشد، گزارش‌های محلی را بارگذاری می‌کند
      loadLocalData();
    }
  }, []);
  
  const loadData = (accessCode: string) => {
    const storageKey = `reports_${accessCode}`;
    const storedReports = localStorage.getItem(storageKey);
    
    if (storedReports) {
      try {
        setReports(JSON.parse(storedReports));
      } catch (error) {
        console.error('خطا در خواندن گزارش‌ها:', error);
        setReports([]);
      }
    } else {
      // ایجاد فضای ذخیره‌سازی برای کاربر جدید
      localStorage.setItem(storageKey, JSON.stringify([]));
      setReports([]);
    }
  };
  
  const loadLocalData = () => {
    const personalStorage = localStorage.getItem('personal_reports');
    if (personalStorage) {
      try {
        setReports(JSON.parse(personalStorage));
      } catch (error) {
        console.error('خطا در خواندن گزارش‌های شخصی:', error);
        setReports([]);
      }
    }
  };
  
  // ذخیره گزارش‌ها در localStorage
  const saveReports = (updatedReports: Report[]) => {
    const accessCode = localStorage.getItem('currentAccessCode');
    
    if (accessCode) {
      // ذخیره گزارش‌ها برای کاربر فعلی
      localStorage.setItem(`reports_${accessCode}`, JSON.stringify(updatedReports));
    } else {
      // ذخیره گزارش‌ها به صورت محلی اگر کاربر ثبت نام نکرده باشد
      localStorage.setItem('personal_reports', JSON.stringify(updatedReports));
    }
    
    setReports(updatedReports);
  };
  
  const handleAddReport = (newReport: Report) => {
    if (editingReport) {
      // به‌روزرسانی گزارش موجود
      const updatedReports = reports.map(report => 
        report.id === editingReport.id ? newReport : report
      );
      saveReports(updatedReports);
      setEditingReport(null);
      toast({
        title: "گزارش با موفقیت بروزرسانی شد",
        description: "گزارش شما با موفقیت ذخیره شد"
      });
    } else {
      // افزودن گزارش جدید
      const reportWithToday = {...newReport, date: getCurrentJalaliDate()};
      const updatedReports = [reportWithToday, ...reports];
      saveReports(updatedReports);
      toast({
        title: "گزارش با موفقیت ثبت شد",
        description: "گزارش شما با موفقیت ذخیره شد"
      });
    }
  };
  
  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('آیا از حذف این گزارش اطمینان دارید؟')) {
      const updatedReports = reports.filter(report => report.id !== reportId);
      saveReports(updatedReports);
      toast({
        title: "گزارش با موفقیت حذف شد"
      });
    }
  };
  
  const handleSearch = (date: string, course: string) => {
    setSearchDate(date);
    setSearchCourse(course);
  };

  return (
    <Layout>
      <div className="space-y-12">
        {isUserRegistered ? (
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              خوش آمدید، <span className="text-neon">{username}</span>
            </p>
            <Link to="/settings" className="flex items-center text-sm text-muted-foreground hover:text-neon">
              <Settings className="h-4 w-4 mr-1" />
              تنظیمات
            </Link>
          </div>
        ) : (
          <div className="bg-background/40 border border-neon/30 rounded-md p-4 mb-6">
            <p className="mb-2">برای ذخیره دائمی گزارش‌های خود و دسترسی از همه دستگاه‌ها، حساب کاربری ایجاد کنید.</p>
            <Link to="/settings">
              <Button className="neon-button">
                ایجاد حساب کاربری
              </Button>
            </Link>
          </div>
        )}
      
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
