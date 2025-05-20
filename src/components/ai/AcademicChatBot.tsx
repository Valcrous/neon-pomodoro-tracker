
import React, { useState, useRef, useEffect } from 'react';
import { academicChat } from '@/utils/ai-client';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: number;
  role: 'user' | 'bot';
  content: string;
}

const AcademicChatBot: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 0, 
      role: 'bot', 
      content: 'سلام! من ربات رمپ‌آپ هستم و آماده‌ام تا به سؤالات درسی شما پاسخ دهم. چه کمکی می‌توانم بکنم؟' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      return;
    }
    
    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: question
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);
    
    try {
      const response = await academicChat({ question });
      
      const botMessage: Message = {
        id: Date.now() + 1,
        role: 'bot',
        content: response.answer
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in chat:", error);
      toast("خطا در دریافت پاسخ. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="neon-card flex flex-col h-[500px]" dir="rtl">
      <h2 className="neon-text text-xl mb-4">ربات چت درسی رمپ‌آپ</h2>
      
      <div className="flex-grow overflow-y-auto mb-4 bg-background/50 rounded-md border border-neon/30 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 ${
              msg.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-neon/20 text-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="سوال درسی خود را بپرسید..."
          className="neon-input flex-grow"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="neon-button px-3"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default AcademicChatBot;
