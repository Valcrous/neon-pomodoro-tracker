
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportForm from '@/components/ReportForm';
import ReportSearch from '@/components/ReportSearch';
import ReportList from '@/components/ReportList';
import { toast } from '@/components/ui/use-toast';
import type { Report } from '@/types/database';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // بارگذاری گزارش‌های محلی
  useEffect(() => {
    loadLocalData();
  }, []);
  
  // بارگذاری گزارش‌های محلی
  const loadLocalData = () => {
    setIsLoading(true);
    const personalStorage = localStorage.getItem('personal_reports');
    if (personalStorage) {
      try {
        setReports(JSON.parse(personalStorage));
      } catch (error) {
        console.error('خطا در خواندن گزارش‌های شخصی:', error);
        setReports([]);
      }
    }
    setIsLoading(false);
  };
  
  // افزودن یا به‌روزرسانی گزارش
  const handleAddReport = async (newReport: Report) => {
    if (editingReport) {
      // به‌روزرسانی گزارش موجود
      const updatedReports = reports.map(report => 
        report.id === editingReport.id ? newReport : report
      );
      setReports(updatedReports);
      localStorage.setItem('personal_reports', JSON.stringify(updatedReports));
      setEditingReport(null);
      toast({
        title: "گزارش با موفقیت بروزرسانی شد"
      });
    } else {
      // افزودن گزارش جدید
      const updatedReports = [newReport, ...reports];
      setReports(updatedReports);
      localStorage.setItem('personal_reports', JSON.stringify(updatedReports));
      toast({
        title: "گزارش با موفقیت ثبت شد"
      });
    }
  };
  
  // ویرایش گزارش
  const handleEditReport = (report: Report) => {
    setEditingReport(report);
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // حذف گزارش
  const handleDeleteReport = (reportId: string) => {
    if (window.confirm('آیا از حذف این گزارش اطمینان دارید؟')) {
      const updatedReports = reports.filter(report => report.id !== reportId);
      setReports(updatedReports);
      localStorage.setItem('personal_reports', JSON.stringify(updatedReports));
      toast({
        title: "گزارش با موفقیت حذف شد"
      });
    }
  };
  
  // جستجوی گزارش‌ها
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
          username="کاربر"
        />
        
        <div>
          <h2 className="neon-text text-2xl mb-6 text-center">گزارشات ثبت شده</h2>
          <ReportSearch onSearch={handleSearch} />
          
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">در حال بارگذاری گزارش‌ها...</p>
            </div>
          ) : (
            <ReportList 
              reports={reports} 
              searchDate={searchDate}
              searchCourse={searchCourse}
              onEditReport={handleEditReport}
              onDeleteReport={handleDeleteReport}
              isPrivateAccess={true}
              currentUsername={null}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
