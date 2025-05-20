
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyProductivityEstimator from '@/components/ai/DailyProductivityEstimator';
import ProductivityReportGenerator from '@/components/ai/ProductivityReportGenerator';
import ProjectPerformanceComparator from '@/components/ai/ProjectPerformanceComparator';
import AcademicChatBot from '@/components/ai/AcademicChatBot';
import { useGemini } from '@/context/GeminiContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const { isConfigured, model } = useGemini();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="neon-text text-3xl mb-4">دستیار هوشمند رمپ‌آپ</h1>
          <p className="text-muted-foreground">
            از قابلیت‌های هوش مصنوعی برای بهبود تجربه یادگیری و مدیریت زمان خود استفاده کنید.
          </p>
        </div>

        {isConfigured && (
          <Alert className="bg-green-500/10 border-green-500">
            <Info className="h-4 w-4" />
            <AlertTitle>اتصال به جمنای فعال است</AlertTitle>
            <AlertDescription>
              شما به هوش مصنوعی جمنای متصل هستید و از مدل <span className="text-neon font-medium">{model}</span> استفاده می‌کنید.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="chat" dir="rtl">
          <TabsList className="w-full justify-center">
            <TabsTrigger value="chat">چت درسی</TabsTrigger>
            <TabsTrigger value="daily">بهره‌وری روزانه</TabsTrigger>
            <TabsTrigger value="weekly">گزارش هفتگی</TabsTrigger>
            <TabsTrigger value="compare">مقایسه عملکرد</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-6">
            <AcademicChatBot />
          </TabsContent>
          
          <TabsContent value="daily" className="mt-6">
            <DailyProductivityEstimator />
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-6">
            <ProductivityReportGenerator />
          </TabsContent>
          
          <TabsContent value="compare" className="mt-6">
            <ProjectPerformanceComparator />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AIAssistant;
