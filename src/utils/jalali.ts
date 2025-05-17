
import jalaliday from 'jalaliday';
import dayjs from 'dayjs';

// تنظیمات تاریخ شمسی با استفاده از افزونه jalaliday
dayjs.extend(jalaliday);

// تبدیل تاریخ میلادی به شمسی
export const formatJalali = (date: Date | string): string => {
  // @ts-ignore - The calendar method is added by jalaliday plugin but TypeScript doesn't know it
  return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD');
};

// دریافت تاریخ شمسی امروز
export const getCurrentJalaliDate = (): string => {
  // @ts-ignore - The calendar method is added by jalaliday plugin but TypeScript doesn't know it
  return dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD');
};

// تبدیل تاریخ شمسی (رشته) به نام روز هفته (یک روز جلوتر)
export const getPersianDayName = (jalaliDateStr: string): string => {
  try {
    // تبدیل رشته تاریخ شمسی به آبجکت dayjs
    const [year, month, day] = jalaliDateStr.split('/').map(Number);
    // @ts-ignore - The calendar method is added by jalaliday plugin but TypeScript doesn't know it
    const jalaliDate = dayjs().calendar('jalali').year(year).month(month - 1).date(day);
    
    // اضافه کردن یک روز به تاریخ
    const nextDay = jalaliDate.add(1, 'day');
    
    // دریافت نام روز هفته
    const dayOfWeek = nextDay.day();
    
    // آرایه نام‌های روزهای هفته به فارسی
    const persianDays = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
    
    return persianDays[dayOfWeek];
  } catch (error) {
    console.error('خطا در تبدیل تاریخ به نام روز هفته:', error);
    return ''; // در صورت بروز خطا، رشته خالی برگردان
  }
};

// محاسبه تاریخ دیروز در تقویم جلالی
export const getYesterdayJalaliDate = (jalaliDateStr: string): string => {
  try {
    // تبدیل رشته تاریخ شمسی به آبجکت dayjs
    const [year, month, day] = jalaliDateStr.split('/').map(Number);
    // @ts-ignore - The calendar method is added by jalaliday plugin but TypeScript doesn't know it
    const jalaliDate = dayjs().calendar('jalali').year(year).month(month - 1).date(day);
    
    // کم کردن یک روز از تاریخ
    const yesterdayDate = jalaliDate.subtract(1, 'day');
    
    // بازگرداندن تاریخ به صورت رشته با فرمت "YYYY/MM/DD"
    // @ts-ignore - The format method is used with calendar plugin
    return yesterdayDate.format('YYYY/MM/DD');
  } catch (error) {
    console.error('خطا در محاسبه تاریخ دیروز:', error);
    return jalaliDateStr; // در صورت بروز خطا، همان تاریخ ورودی را برگردان
  }
};
