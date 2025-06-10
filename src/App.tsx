
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ConsentForm from "./components/ConsentForm";
import ConsentPage from "./pages/ConsentPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

console.log("App component is rendering");

const App = () => {
  console.log("App render function called");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/consent-form" element={<ConsentForm />} />
            <Route path="/consent-page" element={<ConsentPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
