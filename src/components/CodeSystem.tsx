import React, { useState, useEffect } from 'react';
import { Code, Lock, Unlock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { AppUser } from '@/types/database';

interface CodeSystemProps {
  onCodeAccess: (code: string, isPrivate: boolean) => void;
  currentCode: string | null;
}

const CodeSystem: React.FC<CodeSystemProps> = ({ onCodeAccess, currentCode }) => {
  const [publicCode, setPublicCode] = useState('');
  const [privateCode, setPrivateCode] = useState('');
  const [enteredCode, setEnteredCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  
  // بارگذاری کدها از دیتابیس
  useEffect(() => {
    const storedUsername = localStorage.getItem('reportUsername');
    if (storedUsername) {
      setUsername(storedUsername);
      loadCodesFromDatabase(storedUsername);
    } else {
      // اگر کاربر ثبت نشده است، کدها را از localStorage بخوان
      const savedPublicCode = localStorage.getItem('publicAccessCode');
      const savedPrivateCode = localStorage.getItem('privateAccessCode');
      
      if (savedPublicCode) setPublicCode(savedPublicCode);
      if (savedPrivateCode) setPrivateCode(savedPrivateCode);
    }
  }, []);
  
  // بارگذاری کدها از دیتابیس
  const loadCodesFromDatabase = async (username: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('app_users')
        .select('username, public_code, private_code')
        .eq('username', username)
        .single();
      
      if (error) {
        console.error('خطا در بازیابی کدها از دیتابیس:', error);
        return;
      }
      
      if (data) {
        if (data.public_code) setPublicCode(data.public_code);
        if (data.private_code) setPrivateCode(data.private_code);
      }
    } catch (error) {
      console.error('خطا در دسترسی به دیتابیس:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ذخیره کدها در دیتابیس
  const saveCodeToDatabase = async (isPublic: boolean, code: string) => {
    if (!username) return;
    
    try {
      const updateData = isPublic 
        ? { public_code: code } 
        : { private_code: code };
      
      const { error } = await supabase
        .from('app_users')
        .update(updateData)
        .eq('username', username);
      
      if (error) {
        console.error('خطا در ذخیره کد در دیتابیس:', error);
        toast({
          title: "خطا",
          description: "مشکلی در ذخیره کد دسترسی رخ داد",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('خطا در ارتباط با سرور:', error);
    }
  };
  
  // ایجاد کد تصادفی به فرمت (Y3-XXXXX)
  const generateRandomCode = (): string => {
    const randomPart = Math.floor(10000 + Math.random() * 90000); // عدد تصادفی 5 رقمی
    return `Y3-${randomPart}`;
  };
  
  const handleGeneratePublicCode = async () => {
    const newCode = generateRandomCode();
    setPublicCode(newCode);
    
    if (username) {
      // ذخیره در دیتابیس
      await saveCodeToDatabase(true, newCode);
    } else {
      // ذخیره محلی
      localStorage.setItem('publicAccessCode', newCode);
    }
    
    toast({
      title: "کد عمومی جدید ایجاد شد"
    });
  };
  
  const handleGeneratePrivateCode = async () => {
    const newCode = generateRandomCode();
    setPrivateCode(newCode);
    
    if (username) {
      // ذخیره در دیتابیس
      await saveCodeToDatabase(false, newCode);
    } else {
      // ذخیره محلی
      localStorage.setItem('privateAccessCode', newCode);
    }
    
    toast({
      title: "کد خصوصی جدید ایجاد شد"
    });
  };
  
  const handleAccessWithPublicCode = () => {
    if (publicCode) {
      onCodeAccess(publicCode, false);
    } else {
      toast({
        title: "خطا",
        description: "ابتدا یک کد عمومی ایجاد کنید",
        variant: "destructive"
      });
    }
  };
  
  const handleAccessWithPrivateCode = () => {
    if (privateCode) {
      onCodeAccess(privateCode, true);
    } else {
      toast({
        title: "خطا",
        description: "ابتدا یک کد خصوصی ایجاد کنید",
        variant: "destructive"
      });
    }
  };
  
  const handleAccessWithEnteredCode = async () => {
    if (!enteredCode) {
      toast({
        title: "خطا",
        description: "لطفاً کد را وارد کنید",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // جستجوی کد در دیتابیس
      const { data: publicData } = await supabase
        .from('app_users')
        .select('username')
        .eq('public_code', enteredCode)
        .single();
      
      const { data: privateData } = await supabase
        .from('app_users')
        .select('username')
        .eq('private_code', enteredCode)
        .single();
      
      if (privateData) {
        onCodeAccess(enteredCode, true);
      } else if (publicData) {
        onCodeAccess(enteredCode, false);
      } else {
        // اگر در دیتابیس نبود، بررسی محلی
        if (enteredCode === privateCode) {
          onCodeAccess(enteredCode, true);
        } else if (enteredCode === publicCode) {
          onCodeAccess(enteredCode, false);
        } else {
          toast({
            title: "خطا",
            description: "کد وارد شده معتبر نیست",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('خطا در بررسی کد:', error);
    } finally {
      setIsLoading(false);
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
        {/* ایجاد/مدیریت کدها */}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <button 
                  onClick={handleAccessWithPrivateCode}
                  className="neon-button mr-2"
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <button 
                  onClick={handleAccessWithPublicCode}
                  className="neon-button mr-2"
                  disabled={isLoading}
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
        
        {/* ورود با کد */}
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
                disabled={isLoading}
              />
              <button 
                onClick={handleAccessWithEnteredCode}
                className="neon-button mr-2"
                disabled={isLoading}
              >
                {isLoading ? "در حال بررسی..." : "ورود"}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              با وارد کردن کد، به گزارش���های مربوط به آن دسترسی پیدا می‌کنید
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
