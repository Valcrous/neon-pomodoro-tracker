
// This file contains the actual implementations for connecting to Google's Gemini API

export interface AIConfig {
  model?: string;
  userApiKey?: string;
}

// دستیار تخمین بهره‌وری روزانه
export interface EstimateProductivityInput extends AIConfig {
  trackedData: string;
}

export interface EstimateProductivityOutput {
  productivityEstimate: string;
}

export async function estimateDailyProductivity(
  input: EstimateProductivityInput
): Promise<EstimateProductivityOutput> {
  try {
    // Validate API key
    if (!input.userApiKey) {
      throw new Error("کلید API جمنای در تنظیمات وارد نشده است. لطفاً ابتدا کلید API خود را در بخش تنظیمات وارد کنید.");
    }
    
    console.log("Estimating productivity with data:", input.trackedData);
    console.log("Using model:", input.model);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/' + input.model + ':generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': input.userApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ 
              text: `به عنوان یک دستیار هوش مصنوعی متخصص در بهره‌وری عمل کن. لطفاً این داده‌های فعالیت روزانه را تحلیل کن و یک تخمین از بهره‌وری ارائه بده. نکات کلیدی و پیشنهادهایی برای بهبود را نیز شامل کن. تمام پاسخ را به زبان فارسی بنویس.

داده‌های فعالیت:
${input.trackedData}` 
            }]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`درخواست شما توسط فیلترهای ایمنی جمنای مسدود شد: ${data.promptFeedback.blockReason}`);
      }
      throw new Error("پاسخی از هوش مصنوعی دریافت نشد. لطفاً مجدداً تلاش کنید.");
    }
    
    const productivityEstimate = data.candidates[0].content.parts[0].text;
    
    return { productivityEstimate };
  } catch (error) {
    console.error("Error estimating productivity:", error);
    throw new Error(error instanceof Error ? error.message : "مشکلی در تحلیل بهره‌وری به وجود آمد. لطفاً مجدداً تلاش کنید.");
  }
}

// دستیار گزارش بهره‌وری هفتگی
export interface GenerateProductivityReportInput extends AIConfig {
  weeklyData: string;
  historicalData?: string;
}

export interface GenerateProductivityReportOutput {
  summary: string;
  insights: string;
  optimizationSuggestions: string;
}

export async function generateProductivityReport(
  input: GenerateProductivityReportInput
): Promise<GenerateProductivityReportOutput> {
  try {
    // Validate API key
    if (!input.userApiKey) {
      throw new Error("کلید API جمنای در تنظیمات وارد نشده است. لطفاً ابتدا کلید API خود را در بخش تنظیمات وارد کنید.");
    }
    
    console.log("Generating productivity report with data:", input.weeklyData);
    console.log("Using model:", input.model);
    
    const historicalContext = input.historicalData 
      ? `\n\nداده‌های تاریخی برای مقایسه:\n${input.historicalData}` 
      : '';
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/' + input.model + ':generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': input.userApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ 
              text: `به عنوان یک دستیار هوش مصنوعی تحلیلگر داده‌های بهره‌وری عمل کن. لطفاً داده‌های هفتگی زیر را تحلیل کن و یک گزارش جامع ارائه بده که شامل: 1) خلاصه بهره‌وری هفته، 2) تحلیل الگوهای مدیریت زمان، و 3) پیشنهادهایی برای بهینه‌سازی تمرکز و برنامه‌ریزی باشد. تمام پاسخ را به زبان فارسی بنویس.

داده‌های هفتگی:
${input.weeklyData}${historicalContext}`
            }]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`درخواست شما توسط فیلترهای ایمنی جمنای مسدود شد: ${data.promptFeedback.blockReason}`);
      }
      throw new Error("پاسخی از هوش مصنوعی دریافت نشد. لطفاً مجدداً تلاش کنید.");
    }
    
    const fullText = data.candidates[0].content.parts[0].text;
    
    // تلاش برای استخراج بخش‌های مختلف گزارش
    let summary = "", insights = "", optimizationSuggestions = "";
    
    const sections = fullText.split(/\n\s*\n/);
    
    if (sections.length >= 3) {
      // فرض می‌کنیم اولین بخش خلاصه، دومی تحلیل الگوها و سومی پیشنهادها است
      summary = sections[0];
      insights = sections[1];
      optimizationSuggestions = sections[2];
    } else {
      // اگر نتوانستیم بخش‌ها را جدا کنیم، کل متن را در خلاصه قرار می‌دهیم
      summary = fullText;
    }
    
    return {
      summary,
      insights: insights || "اطلاعات کافی برای تحلیل الگوها وجود ندارد.",
      optimizationSuggestions: optimizationSuggestions || "اطلاعات کافی برای ارائه پیشنهادهای بهینه‌سازی وجود ندارد."
    };
  } catch (error) {
    console.error("Error generating productivity report:", error);
    throw new Error(error instanceof Error ? error.message : "مشکلی در تولید گزارش بهره‌وری به وجود آمد. لطفاً مجدداً تلاش کنید.");
  }
}

// دستیار مقایسه عملکرد تحصیلی
export interface CompareProjectPerformanceInput extends AIConfig {
  currentStudyData: string;
  historicalData: string;
  userGoals?: string;
}

export interface CompareProjectPerformanceOutput {
  summary: string;
  deviations: string;
  recommendations: string;
}

export async function compareProjectPerformance(
  input: CompareProjectPerformanceInput
): Promise<CompareProjectPerformanceOutput> {
  try {
    // Validate API key
    if (!input.userApiKey) {
      throw new Error("کلید API جمنای در تنظیمات وارد نشده است. لطفاً ابتدا کلید API خود را در بخش تنظیمات وارد کنید.");
    }
    
    console.log("Comparing project performance with data:", input);
    console.log("Using model:", input.model);
    
    const goalsContext = input.userGoals 
      ? `\n\nاهداف کاربر:\n${input.userGoals}` 
      : '';
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/' + input.model + ':generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': input.userApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ 
              text: `به عنوان یک مشاور تحصیلی هوش مصنوعی عمل کن. لطفاً داده‌های مطالعه فعلی را با داده‌های تاریخی مقایسه کن و یک تحلیل جامع ارائه بده که شامل: 1) خلاصه مقایسه، 2) تفاوت‌های کلیدی شناسایی شده و نقاط قوت یا ضعف، و 3) پیشنهادهایی برای بهینه‌سازی راهبردهای یادگیری باشد. تمام پاسخ را به زبان فارسی بنویس.

داده‌های مطالعه فعلی:
${input.currentStudyData}

داده‌های مطالعه قبلی:
${input.historicalData}${goalsContext}`
            }]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`درخواست شما توسط فیلترهای ایمنی جمنای مسدود شد: ${data.promptFeedback.blockReason}`);
      }
      throw new Error("پاسخی از هوش مصنوعی دریافت نشد. لطفاً مجدداً تلاش کنید.");
    }
    
    const fullText = data.candidates[0].content.parts[0].text;
    
    // تلاش برای استخراج بخش‌های مختلف گزارش
    let summary = "", deviations = "", recommendations = "";
    
    const sections = fullText.split(/\n\s*\n/);
    
    if (sections.length >= 3) {
      summary = sections[0];
      deviations = sections[1];
      recommendations = sections[2];
    } else {
      summary = fullText;
    }
    
    return {
      summary,
      deviations: deviations || "اطلاعات کافی برای شناسایی تفاوت‌ها وجود ندارد.",
      recommendations: recommendations || "اطلاعات کافی برای ارائه پیشنهادها وجود ندارد."
    };
  } catch (error) {
    console.error("Error comparing project performance:", error);
    throw new Error(error instanceof Error ? error.message : "مشکلی در مقایسه عملکرد به وجود آمد. لطفاً مجدداً تلاش کنید.");
  }
}

// ربات چت درسی "رمپ‌آپ"
export interface AcademicChatInput extends AIConfig {
  question: string;
}

export interface AcademicChatOutput {
  answer: string;
}

export async function academicChat(
  input: AcademicChatInput
): Promise<AcademicChatOutput> {
  try {
    // Validate API key
    if (!input.userApiKey) {
      throw new Error("کلید API جمنای در تنظیمات وارد نشده است. لطفاً ابتدا کلید API خود را در بخش تنظیمات وارد کنید.");
    }
    
    console.log("Academic chat with question:", input.question);
    console.log("Using model:", input.model);
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/' + input.model + ':generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': input.userApiKey
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'system',
            parts: [{ 
              text: `تو "ربات رمپ‌آپ"، یک دستیار هوش مصنوعی دوستانه برای دانش‌آموزان هستی. هدف اصلی تو کمک به سوالات درسی و مرتبط با مطالعه است.

اگر سوال درسی یا مرتبط با مطالعه است، پاسخی واضح، کوتاه و مفید به زبان فارسی ارائه بده.

اگر سوال غیردرسی است (مثلاً گپ‌وگفت، فیلم، بازی)، به طور مودبانه به سوال کاربر اشاره کن و سعی کن به آرامی مکالمه را به سمت زمینه درسی هدایت کنی یا یک ارتباط درسی با سوال غیردرسی پیدا کنی.

مودب و دلگرم‌کننده باش و پاسخ‌ها را کوتاه نگه دار. زبان پاسخ‌های خود را فارسی نگه دار.` 
            }]
          },
          {
            role: 'user',
            parts: [{ text: input.question }]
          }
        ]
      })
    });

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`درخواست شما توسط فیلترهای ایمنی جمنای مسدود شد: ${data.promptFeedback.blockReason}`);
      }
      throw new Error("پاسخی از هوش مصنوعی دریافت نشد. لطفاً مجدداً تلاش کنید.");
    }
    
    const answer = data.candidates[0].content.parts[0].text;
    
    return { answer };
  } catch (error) {
    console.error("Error in academic chat:", error);
    throw new Error(error instanceof Error ? error.message : "مشکلی در ارتباط با ربات چت به وجود آمد. لطفاً مجدداً تلاش کنید.");
  }
}
