
import dayjs from "dayjs";
import jalaliday from "jalaliday";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(jalaliday);

// Convert to Jalali date format
export function formatJalali(date: Date): string {
  return dayjs(date)
    .tz("Asia/Tehran")
    .calendar("jalali")
    .locale("fa")
    .format("YYYY/MM/DD");
}

// Get current jalali date
export function getCurrentJalaliDate(): string {
  return dayjs()
    .tz("Asia/Tehran")
    .calendar("jalali")
    .locale("fa")
    .format("YYYY/MM/DD");
}

// Get Persian day name for a date string (YYYY/MM/DD)
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
    
    // Persian day names in correct order based on dayjs day() return value
    // Sunday (0) to Saturday (6)
    const persianDays = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه", "شنبه"];
    
    return persianDays[dayOfWeek];
  } catch (error) {
    console.error("Error calculating day name:", error);
    return "";
  }
}
