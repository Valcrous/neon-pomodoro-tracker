
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DailyProductivityEstimator from '@/components/ai/DailyProductivityEstimator';
import ProductivityReportGenerator from '@/components/ai/ProductivityReportGenerator';
import ProjectPerformanceComparator from '@/components/ai/ProjectPerformanceComparator';
import AcademicChatBot from '@/components/ai/AcademicChatBot';

const AIAssistant: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="neon-text text-3xl mb-4">دستیار هوشمند رمپ‌آپ</h1>
          <p className="text-muted-foreground">
            از قابلیت‌های هوش مصنوعی برای بهبود تجربه یادگیری و مدیریت زمان خود استفاده کنید.
          </p>
        </div>

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
