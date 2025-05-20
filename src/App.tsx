
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { GeminiProvider } from "@/context/GeminiContext";
import Reports from "./pages/Reports";
import AIAssistant from "./pages/AIAssistant";
import Pomodoro from "./pages/Pomodoro";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <GeminiProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Reports />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/pomodoro" element={<Pomodoro />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GeminiProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
