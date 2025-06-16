
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
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
      <Toaster />
      <BrowserRouter basename="/mia-consent-offline-form-50">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/consent-form" element={<ConsentForm />} />
          <Route path="/consent-page" element={<ConsentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
