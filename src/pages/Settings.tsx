
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Settings as SettingsIcon } from 'lucide-react';
import { useGemini } from '@/context/GeminiContext';

const Settings: React.FC = () => {
  const { apiKey: savedApiKey, model: savedModel, setApiKey, setModel } = useGemini();
  const [apiKey, setApiKeyInput] = useState('');
  const [geminiModel, setGeminiModelInput] = useState('gemini-1.5-flash-latest');
  
  // Load settings from context on component mount
  useEffect(() => {
    setApiKeyInput(savedApiKey);
    setGeminiModelInput(savedModel);
  }, [savedApiKey, savedModel]);
  
  const handleSaveSettings = () => {
    // Save settings to context (which will save to localStorage)
    setApiKey(apiKey);
    setModel(geminiModel);
    
    toast("تنظیمات هوش مصنوعی ذخیره شد", {
      description: "تنظیمات شما با موفقیت ذخیره شدند",
    });
  };
  
  const modelOptions = [
    { value: 'gemini-1.5-flash-latest', label: 'Gemini 1.5 Flash (سریع)' },
    { value: 'gemini-1.5-pro-latest', label: 'Gemini 1.5 Pro (قوی)' },
    { value: 'gemini-1.0-pro', label: 'Gemini 1.0 Pro (نسخه قدیمی)' },
  ];
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="neon-text text-3xl mb-4">تنظیمات</h1>
          <p className="text-muted-foreground">
            تنظیمات هوش مصنوعی و دیگر تنظیمات برنامه
          </p>
        </div>
        
        <Card className="neon-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="ml-2" />
              <span>تنظیمات هوش مصنوعی جمنای</span>
            </CardTitle>
            <CardDescription>
              برای استفاده از قابلیت‌های هوش مصنوعی، کلید API جمنای و مدل مورد نظر خود را وارد کنید
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6" dir="rtl">
            <div className="space-y-2">
              <Label htmlFor="apiKey">کلید API جمنای</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="کلید API جمنای خود را وارد کنید"
                className="neon-input"
              />
              <p className="text-sm text-muted-foreground">
                کلید API را می‌توانید از 
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neon mx-1 underline"
                >
                  داشبورد گوگل AI Studio
                </a>
                دریافت کنید
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">انتخاب مدل جمنای</Label>
              <Select value={geminiModel} onValueChange={setGeminiModelInput}>
                <SelectTrigger id="model" className="neon-input">
                  <SelectValue placeholder="مدل را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                مدل Gemini 1.5 Flash سریع‌تر و Gemini 1.5 Pro قوی‌تر است
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="justify-center">
            <Button 
              onClick={handleSaveSettings} 
              className="neon-button"
            >
              ذخیره تنظیمات
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="neon-card">
          <CardHeader>
            <CardTitle>وضعیت اتصال به هوش مصنوعی</CardTitle>
          </CardHeader>
          <CardContent dir="rtl">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>وضعیت کلید API:</span>
                <span className={savedApiKey ? "text-green-500" : "text-red-500"}>
                  {savedApiKey ? "✓ وارد شده" : "✗ وارد نشده"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>مدل انتخاب شده:</span>
                <span className="text-neon">
                  {savedModel ? modelOptions.find(m => m.value === savedModel)?.label || savedModel : "انتخاب نشده"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Settings;
