
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ReportForm from '@/components/ReportForm';
import ReportSearch from '@/components/ReportSearch';
import ReportList from '@/components/ReportList';
import { toast } from '@/components/ui/use-toast';
import { getCurrentJalaliDate } from '@/utils/jalali';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Report } from '@/types/database';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [searchCourse, setSearchCourse] = useState('');
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isPrivateAccess, setIsPrivateAccess] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  // بررسی ثبت نام کاربر و بارگذاری گزارش‌ها
  useEffect(() => {
    const storedUsername = localStorage.getItem('reportUsername');
    const storedUserRegistered = localStorage.getItem('userRegistered');
    const currentAccessCode = localStorage.getItem('currentAccessCode');
    
    if (storedUsername && storedUserRegistered === 'true') {
      setIsUserRegistered(true);
      setUsername(storedUsername);
      
      // بررسی کد دسترسی
      if (currentAccessCode && currentAccessCode !== storedUsername) {
        checkAccessType(currentAccessCode);
      } else {
        // اگر با نام کاربری خود وارد شده است، دسترسی خصوصی دارد
        setIsPrivateAccess(true);
        localStorage.setItem('currentAccessCode', storedUsername);
      }
      
      loadReportsFromDatabase(currentAccessCode || storedUsername);
    } else {
      // اگر کاربر ثبت نام نکرده باشد، گزارش‌های محلی را بارگذاری می‌کند
      loadLocalData();
    }
  }, []);
  
  // بررسی نوع دسترسی
  const checkAccessType = async (accessCode: string) => {
    try {
      // بررسی آیا کد، کد خصوصی است
      const { data: privateData } = await supabase
        .from('app_users')
        .select('username')
        .eq('private_code', accessCode)
        .single();
      
      if (privateData) {
        setIsPrivateAccess(true);
        setUsername(privateData.username);
        return;
      }
      
      // بررسی آیا کد، کد عمومی است
      const { data: publicData } = await supabase
        .from('app_users')
        .select('username')
        .eq('public_code', accessCode)
        .single();
      
      if (publicData) {
        setIsPrivateAccess(false);
        setUsername(publicData.username);
        return;
      }
      
      // اگر هیچ کدام نبود، به حساب خودش برمی‌گردد
      const storedUsername = localStorage.getItem('reportUsername');
      setUsername(storedUsername);
      setIsPrivateAccess(true);
      localStorage.setItem('currentAccessCode', storedUsername || '');
      
    } catch (error) {
      console.error('خطا در بررسی نوع دسترسی:', error);
    }
  };
  
  // بارگذاری گزارش‌ها از دیتابیس
  const loadReportsFromDatabase = async (usernameToLoad: string) => {
    setIsLoading(true);
    try {
      console.log('در حال بارگیری گزارش‌های کاربر:', usernameToLoad);
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('username', usernameToLoad);
      
      if (error) {
        console.error('خطا در بارگذاری گزارش‌ها:', error);
        toast({
          title: "خطا",
          description: "مشکلی در بارگذاری گزارش‌ها رخ داد",
          variant: "destructive"
        });
        setReports([]);
      } else {
        console.log('گزارش‌های بارگیری شده:', data);
        setReports(data || []);
      }
    } catch (error) {
      console.error('خطا در دسترسی به دیتابیس:', error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };
  
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
  
  // افزودن یا به‌روزرسانی گزارش در دیتابیس
  const saveReportToDatabase = async (report: Report) => {
    try {
      if (!report.username) {
        console.error('نام کاربری در گزارش وجود ندارد');
        return;
      }
      
      console.log('در حال ذخیره گزارش در دیتابیس:', report);
      
      const { data, error } = await supabase
        .from('reports')
        .upsert([report])
        .select();
      
      if (error) {
        console.error('خطا در ذخیره گزارش:', error);
        throw error;
      }
      
      console.log('گزارش با موفقیت ذخیره شد:', data);
      return data?.[0];
    } catch (error) {
      console.error('خطا در ارتباط با دیتابیس:', error);
      throw error;
    }
  };
  
  // حذف گزارش از دیتابیس
  const deleteReportFromDatabase = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId);
      
      if (error) {
        console.error('خطا در حذف گزارش:', error);
        throw error;
      }
    } catch (error) {
      console.error('خطا در ارتباط با دیتابیس:', error);
      throw error;
    }
  };
  
  // افزودن یا به‌روزرسانی گزارش
  const handleAddReport = async (newReport: Report) => {
    if (isUserRegistered) {
      try {
        const savedReport = await saveReportToDatabase(newReport);
        
        if (editingReport) {
          // به‌روزرسانی گزارش موجود در state
          setReports(prev => prev.map(report => 
            report.id === editingReport.id ? (savedReport || newReport) : report
          ));
          setEditingReport(null);
          toast({
            title: "گزارش با موفقیت بروزرسانی شد"
          });
        } else {
          // افزودن گزارش جدید به state
          setReports(prev => [savedReport || newReport, ...prev]);
          toast({
            title: "گزارش با موفقیت ثبت شد"
          });
        }
      } catch (error) {
        console.error('خطا در ذخیره گزارش:', error);
        toast({
          title: "خطا",
          description: "مشکلی در ذخیره گزارش رخ داد",
          variant: "destructive"
        });
      }
    } else {
      // ذخیره محلی برای کاربرانی که ثبت نام نکرده‌اند
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
    }
  };
  
  // ویرایش گزارش
  const handleEditReport = (report: Report) => {
    if (!isPrivateAccess) {
      toast({
        title: "خطا",
        description: "شما اجازه ویرایش گزارش را ندارید",
        variant: "destructive"
      });
      return;
    }
    
    setEditingReport(report);
    // اسکرول به بالای صفحه
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // حذف گزارش
  const handleDeleteReport = async (reportId: string) => {
    if (!isPrivateAccess) {
      toast({
        title: "خطا",
        description: "شما اجازه حذف گزارش را ندارید",
        variant: "destructive"
      });
      return;
    }
    
    if (window.confirm('آیا از حذف این گزارش اطمینان دارید؟')) {
      if (isUserRegistered) {
        try {
          await deleteReportFromDatabase(reportId);
          setReports(prev => prev.filter(report => report.id !== reportId));
          toast({
            title: "گزارش با موفقیت حذف شد"
          });
        } catch (error) {
          console.error('خطا در حذف گزارش:', error);
          toast({
            title: "خطا",
            description: "مشکلی در حذف گزارش رخ داد",
            variant: "destructive"
          });
        }
      } else {
        // حذف محلی
        const updatedReports = reports.filter(report => report.id !== reportId);
        setReports(updatedReports);
        localStorage.setItem('personal_reports', JSON.stringify(updatedReports));
        toast({
          title: "گزارش با موفقیت حذف شد"
        });
      }
    }
  };
  
  // جستجوی گزارش‌ها
  const handleSearch = (date: string, course: string) => {
    setSearchDate(date);
    setSearchCourse(course);
  };

  // تغییر کاربر فعال
  const handleUserChange = async (accessCode: string, isPrivate: boolean) => {
    localStorage.setItem('currentAccessCode', accessCode);
    setIsPrivateAccess(isPrivate);
    
    const storedUsername = localStorage.getItem('reportUsername');
    
    try {
      // جستجوی کاربر مرتبط با کد
      if (isPrivate) {
        const { data } = await supabase
          .from('app_users')
          .select('username')
          .eq('private_code', accessCode)
          .single();
        
        if (data) {
          setUsername(data.username);
          loadReportsFromDatabase(data.username);
          toast({
            title: "دسترسی کامل",
            description: `در حال مشاهده گزارش‌های کاربر ${data.username} با دسترسی کامل`
          });
        } else {
          // بررسی اینکه آیا کد، نام کاربری خود فرد است
          if (accessCode === storedUsername) {
            setUsername(storedUsername);
            setIsPrivateAccess(true);
            loadReportsFromDatabase(storedUsername || '');
            toast({
              title: "دسترسی کامل",
              description: "در حال مشاهده گزارش‌های خود با دسترسی کامل"
            });
          }
        }
      } else {
        const { data } = await supabase
          .from('app_users')
          .select('username')
          .eq('public_code', accessCode)
          .single();
        
        if (data) {
          setUsername(data.username);
          loadReportsFromDatabase(data.username);
          toast({
            title: "دسترسی محدود",
            description: `در حال مشاهده گزارش‌های کاربر ${data.username} با دسترسی فقط خواندنی`
          });
        }
      }
    } catch (error) {
      console.error('خطا در بارگذاری اطلاعات کاربر:', error);
    }
  };

  // بازگشت به حساب کاربری خود
  const handleReturnToOwnAccount = () => {
    const storedUsername = localStorage.getItem('reportUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsPrivateAccess(true);
      localStorage.setItem('currentAccessCode', storedUsername);
      loadReportsFromDatabase(storedUsername);
      toast({
        title: "بازگشت به حساب خود",
        description: "در حال مشاهده گزارش‌های خود"
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-12">
        {isUserRegistered ? (
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                خوش آمدید، <span className="text-neon">{localStorage.getItem('reportUsername')}</span>
              </p>
              
              {username !== localStorage.getItem('reportUsername') && (
                <div className="mt-2">
                  <p className="text-sm">
                    در حال مشاهده گزارش‌های <span className="text-neon">{username}</span> با دسترسی {isPrivateAccess ? 'کامل' : 'فقط خواندنی'}
                  </p>
                  <button 
                    onClick={handleReturnToOwnAccount}
                    className="text-xs text-neon hover:underline mt-1"
                  >
                    بازگشت به حساب خود
                  </button>
                </div>
              )}
            </div>
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
      
        {isPrivateAccess && username && ( // فقط کاربر با دسترسی خصوصی می‌تواند گزارش اضافه کند
          <ReportForm 
            onAddReport={handleAddReport} 
            initialReport={editingReport} 
            currentDate={getCurrentJalaliDate()}
            username={username}
          />
        )}
        
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
              onEditReport={isPrivateAccess ? handleEditReport : undefined}
              onDeleteReport={isPrivateAccess ? handleDeleteReport : undefined}
              isPrivateAccess={isPrivateAccess}
              currentUsername={username}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
