
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

const Settings = () => {
  const [username, setUsername] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRecovering, setIsRecovering] = useState(false);
  
  // بررسی وجود کاربر در هنگام بارگذاری صفحه
  useEffect(() => {
    const storedUsername = localStorage.getItem('reportUsername');
    const storedUserRegistered = localStorage.getItem('userRegistered');
    
    if (storedUsername && storedUserRegistered === 'true') {
      setUsername(storedUsername);
      setIsRegistered(true);
      
      // نمایش کد بازیابی ذخیره شده
      const storedCode = localStorage.getItem('recoveryCode_' + storedUsername);
      if (storedCode) {
        setRecoveryCode(storedCode);
      }
    }
  }, []);
  
  // ایجاد کد بازیابی تصادفی
  const generateRecoveryCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    const length = 20;
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  };
  
  // ثبت نام کاربر جدید
  const handleRegister = () => {
    if (!username || username.trim() === '') {
      toast({
        title: "خطا",
        description: "لطفا یک نام کاربری معتبر وارد کنید",
        variant: "destructive"
      });
      return;
    }
    
    // بررسی وجود نام کاربری
    const existingUsernames = Object.keys(localStorage)
      .filter(key => key.startsWith('recoveryCode_'))
      .map(key => key.replace('recoveryCode_', ''));
    
    if (existingUsernames.includes(username)) {
      toast({
        title: "خطا",
        description: "این نام کاربری قبلا ثبت شده است",
        variant: "destructive"
      });
      return;
    }
    
    // ایجاد و ذخیره کد بازیابی
    const newCode = generateRecoveryCode();
    localStorage.setItem('reportUsername', username);
    localStorage.setItem('userRegistered', 'true');
    localStorage.setItem('recoveryCode_' + username, newCode);
    localStorage.setItem('currentAccessCode', username);  // نام کاربری به عنوان کد دسترسی فعلی
    
    setRecoveryCode(newCode);
    setIsRegistered(true);
    
    toast({
      title: "ثبت نام با موفقیت انجام شد",
      description: "لطفا کد بازیابی را در جای امنی نگهداری کنید"
    });
    
    // ایجاد فضای ذخیره‌سازی جداگانه برای گزارش‌های این کاربر
    localStorage.setItem(`reports_${username}`, JSON.stringify([]));
  };
  
  // بازیابی حساب کاربری
  const handleRecovery = () => {
    // بررسی همه کدهای بازیابی در localStorage
    const recoveryEntries = Object.entries(localStorage)
      .filter(([key]) => key.startsWith('recoveryCode_'));
    
    const matchingEntry = recoveryEntries.find(([_, value]) => value === inputCode);
    
    if (matchingEntry) {
      const recoveredUsername = matchingEntry[0].replace('recoveryCode_', '');
      
      // تنظیم اطلاعات کاربر بازیابی شده
      localStorage.setItem('reportUsername', recoveredUsername);
      localStorage.setItem('userRegistered', 'true');
      localStorage.setItem('currentAccessCode', recoveredUsername);
      
      setUsername(recoveredUsername);
      setRecoveryCode(inputCode);
      setIsRegistered(true);
      setIsRecovering(false);
      
      toast({
        title: "بازیابی موفقیت‌آمیز",
        description: `به حساب کاربری ${recoveredUsername} خوش آمدید`
      });
    } else {
      toast({
        title: "خطا",
        description: "کد بازیابی نامعتبر است",
        variant: "destructive"
      });
    }
  };
  
  // ایجاد کد بازیابی جدید
  const handleGenerateNewCode = () => {
    const newCode = generateRecoveryCode();
    localStorage.setItem('recoveryCode_' + username, newCode);
    setRecoveryCode(newCode);
    
    toast({
      title: "کد بازیابی جدید ایجاد شد",
      description: "لطفا کد جدید را در جای امنی نگهداری کنید"
    });
  };
  
  // کپی کد بازیابی
  const handleCopyCode = () => {
    navigator.clipboard.writeText(recoveryCode);
    toast({
      title: "کپی شد",
      description: "کد بازیابی در کلیپ‌بورد کپی شد"
    });
  };
  
  // خروج از حساب کاربری
  const handleLogout = () => {
    localStorage.removeItem('reportUsername');
    localStorage.removeItem('userRegistered');
    localStorage.removeItem('currentAccessCode');
    
    setUsername('');
    setRecoveryCode('');
    setIsRegistered(false);
    
    toast({
      title: "خروج موفقیت‌آمیز",
      description: "از حساب کاربری خود خارج شدید"
    });
  };

  return (
    <Layout>
      <div className="space-y-8" dir="rtl">
        <div className="text-center">
          <h1 className="neon-text text-2xl mb-4">تنظیمات حساب کاربری</h1>
          <p className="text-muted-foreground mb-6">
            با ایجاد حساب کاربری می‌توانید گزارش‌های خود را ذخیره کنید و از هر دستگاهی به آنها دسترسی داشته باشید
          </p>
        </div>
        
        {!isRegistered ? (
          <div className="neon-card max-w-md mx-auto">
            <h2 className="neon-text text-xl mb-4">ایجاد حساب کاربری جدید</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block mb-1">نام کاربری</label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="neon-input w-full"
                  placeholder="یک نام کاربری انتخاب کنید"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  توجه: نام کاربری پس از ثبت قابل تغییر نخواهد بود
                </p>
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={handleRegister}
                  className="neon-button w-full"
                >
                  ثبت نام و دریافت کد بازیابی
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm">
                حساب کاربری دارید؟{' '}
                <button 
                  onClick={() => setIsRecovering(true)} 
                  className="text-neon hover:underline"
                >
                  بازیابی حساب کاربری
                </button>
              </p>
            </div>
            
            {isRecovering && (
              <div className="mt-6 p-4 border border-neon/30 rounded-md">
                <h3 className="text-lg mb-3">بازیابی حساب کاربری</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="recoveryCode" className="block mb-1">کد بازیابی</label>
                    <Input
                      id="recoveryCode"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="neon-input w-full"
                      placeholder="کد بازیابی خود را وارد کنید"
                    />
                  </div>
                  
                  <div className="flex space-x-2 space-x-reverse justify-between">
                    <Button
                      onClick={handleRecovery}
                      className="neon-button"
                    >
                      بازیابی
                    </Button>
                    <Button
                      onClick={() => setIsRecovering(false)}
                      variant="outline"
                      className="border-neon/30"
                    >
                      انصراف
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="neon-card max-w-md mx-auto">
            <h2 className="neon-text text-xl mb-4">اطلاعات حساب کاربری</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">نام کاربری</label>
                <div className="neon-input w-full flex items-center justify-between">
                  <span>{username}</span>
                </div>
              </div>
              
              <div>
                <label className="block mb-1">کد بازیابی</label>
                <div className="neon-input w-full flex items-center justify-between">
                  <span className="font-mono text-sm">{recoveryCode}</span>
                  <Button
                    onClick={handleCopyCode}
                    size="sm"
                    variant="ghost"
                    className="p-1"
                  >
                    <Copy className="h-4 w-4 text-neon" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  این کد را در جای امنی نگهداری کنید تا بتوانید از دستگاه‌های دیگر به حساب خود دسترسی پیدا کنید
                </p>
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button
                  onClick={handleGenerateNewCode}
                  className="neon-button"
                >
                  ایجاد کد بازیابی جدید
                </Button>
                
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-neon/30"
                >
                  خروج از حساب کاربری
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Settings;
