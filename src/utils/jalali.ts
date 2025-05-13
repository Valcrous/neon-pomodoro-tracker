
// Simple Jalali date conversion utility
export function toJalali(date: Date): { year: number; month: number; day: number } {
  const gregorianYear = date.getFullYear();
  const gregorianMonth = date.getMonth() + 1;
  const gregorianDay = date.getDate();
  
  let jy, jm, jd;
  let gy = gregorianYear;
  let gm = gregorianMonth;
  let gd = gregorianDay;
  
  let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jalali = (gy <= 1600);
  
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  
  let jy2 = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy = jy2 + 4 * Math.floor(days / 1461);
  days %= 1461;
  
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  
  jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  
  return { year: jy, month: jm, day: jd };
}

export function fromJalali(jy: number, jm: number, jd: number): Date {
  let gy, gm, gd;
  let jy1 = jy + 1595;
  let days = -355668 + (365 * jy1) + Math.floor(jy1 / 33) * 8 + Math.floor(((jy1 % 33) + 3) / 4) + jd + ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186);
  
  gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    
    if (days >= 365) days++;
  }
  
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  
  gd = days + 1;
  
  let sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (gm = 0; gm < 13 && gd > sal_a[gm]; gm++) gd -= sal_a[gm];
  
  return new Date(gy, gm - 1, gd);
}

export function formatJalali(date: Date): string {
  const jalali = toJalali(date);
  return `${jalali.year}/${jalali.month.toString().padStart(2, '0')}/${jalali.day.toString().padStart(2, '0')}`;
}

export function parseJalaliString(jalaliStr: string): Date | null {
  // Expected format: YYYY/MM/DD
  const match = jalaliStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!match) return null;
  
  const jy = parseInt(match[1], 10);
  const jm = parseInt(match[2], 10);
  const jd = parseInt(match[3], 10);
  
  // Basic validation
  if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return null;
  
  return fromJalali(jy, jm, jd);
}

export function getCurrentJalaliDate(): string {
  return formatJalali(new Date());
}

export const jalaliMonthNames = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

export function getFullJalaliDate(date: Date): string {
  const jalali = toJalali(date);
  return `${jalali.day} ${jalaliMonthNames[jalali.month - 1]} ${jalali.year}`;
}
