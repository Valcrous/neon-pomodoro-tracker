
import React, { useState, useEffect } from 'react';
import { Code, Lock, Unlock } from 'lucide-react';
import { toast } from 'sonner';

interface CodeSystemProps {
  onCodeAccess: (code: string, isPrivate: boolean) => void;
  currentCode: string | null;
}

const CodeSystem: React.FC<CodeSystemProps> = ({ onCodeAccess, currentCode }) => {
  const [publicCode, setPublicCode] = useState('');
  const [privateCode, setPrivateCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  
  // Load codes from localStorage on mount
  useEffect(() => {
    const savedPublicCode = localStorage.getItem('publicAccessCode');
    const savedPrivateCode = localStorage.getItem('privateAccessCode');
    
    if (savedPublicCode) setPublicCode(savedPublicCode);
    if (savedPrivateCode) setPrivateCode(savedPrivateCode);
  }, []);
  
  // Generate a random code with the specified format (Y3-XXXXX)
  const generateRandomCode = (): string => {
    const randomPart = Math.floor(10000 + Math.random() * 90000); // 5-digit random number
    return `Y3-${randomPart}`;
  };
  
  const handleGeneratePublicCode = () => {
    const newCode = generateRandomCode();
    setPublicCode(newCode);
    localStorage.setItem('publicAccessCode', newCode);
    toast.success('کد عمومی جدید ایجاد شد');
  };
  
  const handleGeneratePrivateCode = () => {
    const newCode = generateRandomCode();
    setPrivateCode(newCode);
    localStorage.setItem('privateAccessCode', newCode);
    toast.success('کد خصوصی جدید ایجاد شد');
  };
  
  const handleAccessWithPublicCode = () => {
    if (publicCode) {
      onCodeAccess(publicCode, false);
    } else {
      toast.error('ابتدا یک کد عمومی ایجاد کنید');
    }
  };
  
  const handleAccessWithPrivateCode = () => {
    if (privateCode) {
      onCodeAccess(privateCode, true);
    } else {
      toast.error('ابتدا یک کد خصوصی ایجاد کنید');
    }
  };
  
  const handleAccessWithEnteredCode = () => {
    if (!enteredCode) {
      toast.error('لطفاً کد را وارد کنید');
      return;
    }
    
    // Check if the entered code matches public or private code
    if (enteredCode === privateCode) {
      onCodeAccess(enteredCode, true);
    } else if (enteredCode === publicCode) {
      onCodeAccess(enteredCode, false);
    } else {
      toast.error('کد وارد شده معتبر نیست');
    }
  };
  
  return (
    <div className="neon-card" dir="rtl">
      <h2 className="neon-text text-xl mb-6 text-center">سیستم کدگذاری</h2>
      
      {currentCode ? (
        <div className="text-center mb-6">
          <p className="mb-2">شما با کد <span className="font-mono text-neon">{currentCode}</span> وارد شده‌اید.</p>
          <p className="text-sm text-muted-foreground">
            {currentCode === privateCode ? 
              'شما دسترسی کامل برای ویرایش و حذف گزارش‌ها دارید' : 
              'شما دسترسی محدود (فقط مشاهده) دارید'}
          </p>
        </div>
      ) : null}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create/Manage Codes */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center">
            <Code className="w-5 h-5 mr-2" />
            مدیریت کدها
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center">
                  <Lock className="w-4 h-4 mr-1" />
                  کد خصوصی (دسترسی کامل)
                </label>
                <button 
                  onClick={handleGeneratePrivateCode}
                  className="text-xs text-neon hover:underline"
                >
                  ایجاد کد جدید
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={privateCode}
                  onChange={(e) => setPrivateCode(e.target.value)}
                  className="neon-input w-full font-mono"
                  placeholder="Y3-XXXXX"
                />
                <button 
                  onClick={handleAccessWithPrivateCode}
                  className="neon-button mr-2"
                >
                  استفاده
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                با این کد می‌توانید گزارش‌ها را مشاهده، ویرایش و حذف کنید
              </p>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center">
                  <Unlock className="w-4 h-4 mr-1" />
                  کد عمومی (فقط مشاهده)
                </label>
                <button 
                  onClick={handleGeneratePublicCode}
                  className="text-xs text-neon hover:underline"
                >
                  ایجاد کد جدید
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={publicCode}
                  onChange={(e) => setPublicCode(e.target.value)}
                  className="neon-input w-full font-mono"
                  placeholder="Y3-XXXXX"
                />
                <button 
                  onClick={handleAccessWithPublicCode}
                  className="neon-button mr-2"
                >
                  استفاده
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                این کد را می‌توانید به اشتراک بگذارید تا دیگران گزارش‌های شما را مشاهده کنند
              </p>
            </div>
          </div>
        </div>
        
        {/* Access with Code */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold">ورود با کد</h3>
          <div>
            <label className="block mb-2">
              کد دسترسی را وارد کنید:
            </label>
            <div className="flex">
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                className="neon-input w-full font-mono"
                placeholder="Y3-XXXXX"
              />
              <button 
                onClick={handleAccessWithEnteredCode}
                className="neon-button mr-2"
              >
                ورود
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              با وارد کردن کد، به گزارش‌های مربوط به آن دسترسی پیدا می‌کنید
            </p>
          </div>
          
          <p className="text-sm mt-4">
            <span className="font-bold text-neon">نکته امنیتی:</span> در صورتی که کد عمومی شما در اختیار افراد ناخواسته قرار گرفته، می‌توانید با ایجاد کد عمومی جدید، دسترسی آن‌ها را مسدود کنید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodeSystem;
