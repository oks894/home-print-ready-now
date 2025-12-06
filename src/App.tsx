import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SimpleLoader } from "@/components/SimpleLoader";
import { AuthProvider } from "@/contexts/AuthContext";
import { Suspense } from "react";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Track from "./pages/Track";
import Admin from "./pages/Admin";
import Printing from "./pages/Printing";
import NotFound from "./pages/NotFound";
import EllioPrints from "./pages/EllioPrints";
import EllioNotes from "./pages/EllioNotes";
import UploadNotes from "./pages/UploadNotes";
import BrowseNotes from "./pages/BrowseNotes";
import RequestNotes from "./pages/RequestNotes";
import Leaderboard from "./pages/Leaderboard";
import AssignmentHelp from "./pages/AssignmentHelp";
import UploadAssignment from "./pages/UploadAssignment";
import TypeQuestion from "./pages/TypeQuestion";
import MyRequests from "./pages/MyRequests";
import SolverDashboard from "./pages/SolverDashboard";
import SolverRegistration from "./pages/SolverRegistration";
import BrowseAssignments from "./pages/BrowseAssignments";
import ResumeLab from "./pages/ResumeLab";
import ResumeEditor from "./pages/ResumeEditor";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Recharge from "./pages/Recharge";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<SimpleLoader message="Loading Ellio..." />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recharge" element={<Recharge />} />
                <Route path="/printing" element={<Printing />} />
                <Route path="/services" element={<Services />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/track" element={<Track />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/ellio-prints" element={<EllioPrints />} />
                <Route path="/ellio-notes" element={<EllioNotes />} />
                <Route path="/ellio-notes/upload" element={<UploadNotes />} />
                <Route path="/ellio-notes/browse" element={<BrowseNotes />} />
                <Route path="/ellio-notes/request" element={<RequestNotes />} />
                <Route path="/ellio-notes/leaderboard" element={<Leaderboard />} />
                <Route path="/ellio-notes/assignment-help" element={<AssignmentHelp />} />
                <Route path="/ellio-notes/assignment-help/upload" element={<UploadAssignment />} />
                <Route path="/ellio-notes/assignment-help/type" element={<TypeQuestion />} />
                <Route path="/ellio-notes/assignment-help/my-requests" element={<MyRequests />} />
                <Route path="/ellio-notes/assignment-help/browse" element={<BrowseAssignments />} />
                <Route path="/ellio-notes/assignment-help/solver" element={<SolverDashboard />} />
                <Route path="/ellio-notes/assignment-help/solver/register" element={<SolverRegistration />} />
                <Route path="/resume-lab" element={<ResumeLab />} />
                <Route path="/resume-lab/editor/:templateId" element={<ResumeEditor />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
