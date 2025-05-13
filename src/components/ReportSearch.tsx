
import React, { useState } from 'react';

interface ReportSearchProps {
  onSearch: (date: string) => void;
}

const ReportSearch: React.FC<ReportSearchProps> = ({ onSearch }) => {
  const [searchDate, setSearchDate] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchDate);
  };

  return (
    <div className="mb-8" dir="rtl">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3 justify-center">
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="neon-input w-full"
            placeholder="جستجو بر اساس تاریخ (YYYY/MM/DD)"
          />
        </div>
        
        <button 
          type="submit" 
          className="neon-button w-full sm:w-auto"
          disabled={!searchDate}
        >
          جستجو
        </button>
      </form>
      <p className="text-center text-muted-foreground text-sm mt-2">
        فرمت تاریخ: ۱۴۰۲/۰۵/۱۵ (سال/ماه/روز)
      </p>
    </div>
  );
};

export default ReportSearch;
