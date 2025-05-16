import React, { useState, useEffect } from 'react';
import { formatJalali, getCurrentJalaliDate } from '@/utils/jalali';
import { toast } from '@/components/ui/use-toast';
import type { Report } from '@/types/database';

interface ReportFormProps {
  onAddReport: (report: Report) => void;
  initialReport?: Report | null;
  currentDate?: string;
  username: string | null;
}

const ReportForm: React.FC<ReportFormProps> = ({ onAddReport, initialReport, currentDate, username }) => {
  const [courseName, setCourseName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // استفاده از تاریخ ارائه شده یا بازگشت به getCurrentJalaliDate
  const today = currentDate || getCurrentJalaliDate();

  // تنظیم مقادیر فرم هنگام ویرایش یک گزارش موجود
  useEffect(() => {
    if (initialReport) {
      setCourseName(initialReport.courseName);
      setStartTime(initialReport.startTime);
      setEndTime(initialReport.endTime);
      setDescription(initialReport.description);
      setIsEditing(true);
      setShowForm(true);
    } else {
      setIsEditing(false);
    }
  }, [initialReport]);

  const resetForm = () => {
    setCourseName('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setIsEditing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username) {
      toast({
        title: "خطا",
        description: "ابتدا باید یک حساب کاربری ایجاد کنید",
        variant: "destructive"
      });
      return;
    }
    
    // اعتبارسنجی
    if (!courseName || !startTime || !endTime) {
      toast({
        title: "خطا",
        description: "لطفا تمامی فیلدهای اجباری را پر کنید",
        variant: "destructive"
      });
      return;
    }
    
    // ایجاد شیء گزارش
    const newReport: Report = {
      id: isEditing && initialReport ? initialReport.id : crypto.randomUUID(),
      date: isEditing && initialReport ? initialReport.date : today,
      courseName,
      startTime,
      endTime,
      description,
      username: username
    };
    
    // افزودن یا به‌روزرسانی گزارش
    onAddReport(newReport);
    
    // بازنشانی فرم یا درخواست ورودی دیگر
    if (!isEditing) {
      // سؤال اینکه آیا کاربر می‌خواهد گزارش دیگری ثبت کند
      const addAnother = window.confirm('آیا می‌خواهید گزارش دیگری برای امروز ثبت کنید؟');
      if (addAnother) {
        resetForm();
      } else {
        resetForm();
        setShowForm(false);
      }
    } else {
      resetForm();
    }
  };
  
  if (!showForm) {
    return (
      <div className="flex justify-center mt-4">
        <button 
          onClick={() => setShowForm(true)}
          className="neon-button"
        >
          ثبت گزارش جدید
        </button>
      </div>
    );
  }

  return (
    <div className="neon-card max-w-2xl mx-auto" dir="rtl">
      <h2 className="neon-text text-xl mb-6 text-center">
        {isEditing ? 'ویرایش گزارش' : 'ثبت گزارش جدید'}
      </h2>
      {!isEditing && <p className="text-center mb-4">تاریخ: {today}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="courseName" className="block mb-1">نام درس *</label>
          <input
            id="courseName"
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="neon-input w-full"
            placeholder="نام درس را وارد کنید"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block mb-1">ساعت شروع *</label>
            <input
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="neon-input w-full"
              required
            />
          </div>
          
          <div>
            <label htmlFor="endTime" className="block mb-1">ساعت پایان *</label>
            <input
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="neon-input w-full"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-1">توضیحات درس</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="neon-input w-full min-h-[100px]"
            placeholder="توضیحات درس را وارد کنید"
          />
        </div>
        
        <div className="flex justify-center pt-4">
          <button type="submit" className="neon-button">
            {isEditing ? 'بروزرسانی گزارش' : 'ثبت گزارش'}
          </button>
          {isEditing && (
            <button 
              type="button"
              onClick={resetForm}
              className="neon-button mr-2"
            >
              انصراف
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
