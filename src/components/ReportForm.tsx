
import React, { useState } from 'react';
import { formatJalali, getCurrentJalaliDate } from '@/utils/jalali';
import { toast } from 'sonner';

interface ReportFormProps {
  onAddReport: (report: Report) => void;
}

export interface Report {
  id: string;
  date: string;
  courseName: string;
  startTime: string;
  endTime: string;
  description: string;
}

const ReportForm: React.FC<ReportFormProps> = ({ onAddReport }) => {
  const [courseName, setCourseName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(true);

  const today = getCurrentJalaliDate();

  const resetForm = () => {
    setCourseName('');
    setStartTime('');
    setEndTime('');
    setDescription('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!courseName || !startTime || !endTime) {
      toast.error('لطفا تمامی فیلدهای اجباری را پر کنید');
      return;
    }
    
    // Create report object
    const newReport: Report = {
      id: crypto.randomUUID(),
      date: today,
      courseName,
      startTime,
      endTime,
      description
    };
    
    // Add to reports
    onAddReport(newReport);
    
    // Reset form or ask for another entry
    toast.success('گزارش با موفقیت ثبت شد');
    
    // Ask if user wants to add another report
    const addAnother = window.confirm('آیا می‌خواهید گزارش دیگری برای امروز ثبت کنید؟');
    if (addAnother) {
      resetForm();
    } else {
      resetForm();
      setShowForm(false);
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
      <h2 className="neon-text text-xl mb-6 text-center">ثبت گزارش جدید</h2>
      <p className="text-center mb-4">تاریخ: {today}</p>
      
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
            ثبت گزارش
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
