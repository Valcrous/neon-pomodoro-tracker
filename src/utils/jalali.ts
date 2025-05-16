
import jalaliday from 'jalaliday';
import dayjs from 'dayjs';

// تنظیمات تاریخ شمسی با استفاده از افزونه jalaliday
jalaliday(dayjs);
dayjs.calendar('jalali');

// تبدیل تاریخ میلادی به شمسی
export const formatJalali = (date: Date | string): string => {
  return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD');
};

// دریافت تاریخ شمسی امروز
export const getCurrentJalaliDate = (): string => {
  return dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD');
};

// تبدیل تاریخ شمسی (رشته) به نام روز هفته
export const getPersianDayName = (jalaliDateStr: string): string => {
  // تبدیل رشته تاریخ شمسی به آبجکت dayjs
  const jalaliDate = dayjs(jalaliDateStr, { jalali: true });
  
  // اضافه کردن یک روز برای تنظیم روز هفته
  const adjustedDate = jalaliDate.add(1, 'day');
  
  // دریافت نام روز هفته
  const dayOfWeek = adjustedDate.day();
  
  // آرایه نام‌های روزهای هفته به فارسی
  const persianDays = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
  
  return persianDays[dayOfWeek];
};
