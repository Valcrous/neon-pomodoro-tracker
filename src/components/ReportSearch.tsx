
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface ReportSearchProps {
  onSearch: (date: string, course: string) => void;
}

const ReportSearch: React.FC<ReportSearchProps> = ({ onSearch }) => {
  const [searchDate, setSearchDate] = useState('');
  const [searchCourse, setSearchCourse] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchDate, searchCourse);
  };

  const handleReset = () => {
    setSearchDate('');
    setSearchCourse('');
    onSearch('', '');
  };

  return (
    <div className="mb-8" dir="rtl">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="searchDate" className="block mb-1 text-sm">جستجو بر اساس تاریخ:</label>
            <input
              id="searchDate"
              type="text"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="neon-input w-full"
              placeholder="جستجو بر اساس تاریخ (YYYY/MM/DD)"
            />
          </div>
          
          <div>
            <label htmlFor="searchCourse" className="block mb-1 text-sm">جستجو بر اساس نام درس:</label>
            <input
              id="searchCourse"
              type="text"
              value={searchCourse}
              onChange={(e) => setSearchCourse(e.target.value)}
              className="neon-input w-full"
              placeholder="نام درس را وارد کنید"
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-3">
          <button 
            type="submit" 
            className="neon-button flex items-center space-x-2 space-x-reverse"
          >
            <Search className="h-4 w-4" />
            <span>جستجو</span>
          </button>
          
          {(searchDate || searchCourse) && (
            <button 
              type="button" 
              onClick={handleReset}
              className="neon-button"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>
      </form>
      <p className="text-center text-muted-foreground text-sm mt-2">
        فرمت تاریخ: ۱۴۰۲/۰۵/۱۵ (سال/ماه/روز)
      </p>
    </div>
  );
};

export default ReportSearch;
