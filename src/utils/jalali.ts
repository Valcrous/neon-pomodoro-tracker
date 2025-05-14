
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
    // Create a proper jalali date with the correct year, month, day
    const jalaliDate = dayjs().calendar('jalali').year(parts[0]).month(parts[1] - 1).date(parts[2]);
    
    // Get day of week (0-6, where 0 is Sunday)
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
