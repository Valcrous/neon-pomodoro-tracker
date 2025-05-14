
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);

// Convert to Jalali date format
export function formatJalali(date: Date): string {
  return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD');
}

// Get current jalali date
export function getCurrentJalaliDate(): string {
  return dayjs().calendar('jalali').locale('fa').format('YYYY/MM/DD');
}

// Get Persian day name for a date string (YYYY/MM/DD)
export function getPersianDayName(dateStr: string): string {
  try {
    // Convert jalali date string to dayjs object with jalali calendar
    const parts = dateStr.split('/').map(Number);
    // These indices are used for year, month, day according to jalali calendar format
    const jalaliDate = dayjs().calendar('jalali').day(parts[2]).month(parts[1] - 1).year(parts[0]);
    
    // In jalali calendar, the week starts from Saturday (6) and ends on Friday (5)
    // dayjs day() returns 0-6 where 0 is Sunday, 1 is Monday, etc.
    const dayOfWeek = jalaliDate.day();
    
    // Persian day names in correct order based on dayjs day() return value
    // Sunday (0) to Saturday (6)
    const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    
    return persianDays[dayOfWeek];
  } catch (error) {
    console.error('Error calculating day name:', error);
    return '';
  }
}
