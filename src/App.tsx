
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SimpleLoader } from "@/components/SimpleLoader";
import { Suspense, useState, useEffect } from "react";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Track from "./pages/Track";
import Admin from "./pages/Admin";
import Printing from "./pages/Printing";
import NotFound from "./pages/NotFound";

// Create a more resilient query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors, only on network/5xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) return false;
        }
        return failureCount < 2; // Reduced retry count for faster loading
      },
      staleTime: 2 * 60 * 1000, // 2 minutes - reduced for fresher data
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Ensure DOM is ready and minimize initial loading time
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SimpleLoader message="Starting PrintReady..." />;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<SimpleLoader message="Loading page..." />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/printing" element={<Printing />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/track" element={<Track />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
