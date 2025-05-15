
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(jalaliday);

// تبدیل به فرمت تاریخ جلالی
export function formatJalali(date: Date): string {
  return dayjs(date)
    .tz("Asia/Tehran")
    .calendar("jalali")
    .locale("fa")
    .format("YYYY/MM/DD");
}

// محاسبه تاریخ جلالی بدون هرگونه مشکل اختلاف ساعت
export function getCurrentJalaliDate(): string {
  // ایجاد یک تاریخ امروز با منطقه زمانی تهران و کم کردن یک روز برای نمایش تاریخ صحیح
  const tehranTime = dayjs().tz("Asia/Tehran").subtract(1, 'day');
  return tehranTime
    .calendar("jalali")
    .locale("fa")
    .format("YYYY/MM/DD");
}

// محاسبه نام روز فارسی برای یک تاریخ رشته‌ای (YYYY/MM/DD)
export function getPersianDayName(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("/").map(Number);
    const jalaliDate = dayjs()
      .tz("Asia/Tehran")
      .calendar("jalali")
      .year(year)
      .month(month - 1)
      .date(day);
    
    const dayOfWeek = jalaliDate.day(); // 0 = Sunday, 6 = Saturday
    
    // نام‌های روز فارسی در ترتیب صحیح بر اساس مقدار بازگشتی dayjs day()
    // Sunday (0) to Saturday (6)
    const persianDays = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
    
    return persianDays[dayOfWeek];
  } catch (error) {
    console.error("خطا در محاسبه نام روز:", error);
    return "";
  }
}

// محاسبه تاریخ جلالی دیروز از تاریخ داده شده
export function getYesterdayJalaliDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("/").map(Number);
    
    // تبدیل تاریخ داده شده به شیء jalali dayjs
    const jalaliDate = dayjs()
      .tz("Asia/Tehran")
      .calendar("jalali")
      .year(year)
      .month(month - 1)
      .date(day);
    
    // کم کردن یک روز برای بدست آوردن دیروز
    const yesterday = jalaliDate.subtract(1, "day");
    
    // قالب‌بندی و بازگشت
    return yesterday.format("YYYY/MM/DD");
  } catch (error) {
    console.error("خطا در محاسبه تاریخ دیروز:", error);
    return "";
  }
}
