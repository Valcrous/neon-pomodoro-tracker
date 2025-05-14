
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
  // Convert jalali date string to gregorian date
  const jalaliDate = dayjs(dateStr).calendar('jalali');
  
  // Get day of week (0-6, where 0 is Sunday)
  const dayOfWeek = jalaliDate.day();
  
  // Persian day names (adjusted for correct ordering - 0 is Sunday in JavaScript)
  const persianDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  
  return persianDays[dayOfWeek];
}
