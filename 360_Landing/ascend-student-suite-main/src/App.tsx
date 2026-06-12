import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Applications from "./pages/Applications";
import Universities from "./pages/Universities";
import Visa from "./pages/Visa";
import Finances from "./pages/Finances";
import Documents from "./pages/Documents";
import Resources from "./pages/Resources";
import AITools from "./pages/AITools";
import AskAI from "./pages/AskAI";
import Profile from "./pages/Profile";
import ProfileBuilder from "./pages/ProfileBuilder";
import Settings from "./pages/Settings";
import SerbiaInterest from "./pages/SerbiaInterest";
import NotFound from "./pages/NotFound";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import Pricing from "./pages/Pricing";
import UniversityFinder from "./pages/UniversityFinder";
import AIProfileEvaluation from "./pages/AIProfileEvaluation";
import AIProfileEvaluationResults from "./pages/AIProfileEvaluationResults";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
};

const queryClient = new QueryClient();


/*
  Code Splitting Preparation:
  To optimize initial load times, routes can be lazy-loaded in the future.
  Example Transition:
  
  1. Replace static imports with lazy imports:
     import React, { Suspense } from 'react';
     const Dashboard = React.lazy(() => import("./pages/Dashboard"));
     const UniversityFinder = React.lazy(() => import("./pages/UniversityFinder"));
     ...
     
  2. Wrap layout or routing element in Suspense:
     <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading page...</div>}>
       <Routes>
         ...
       </Routes>
     </Suspense>
*/

const App = () => {

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="/cancellation" element={<CancellationPolicy />} />
            <Route path="/pricing" element={<Pricing />} />
            
            <Route path="/ai-profile-evaluation" element={<AIProfileEvaluation />} />
            <Route path="/ai-profile-evaluation/results" element={<AIProfileEvaluationResults />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/university-finder" element={<UniversityFinder />} />
              <Route path="applications" element={<Applications />} />
              <Route path="universities" element={<Navigate to="/university-finder?tab=discover" replace />} />
              <Route path="visa" element={<Visa />} />
              <Route path="finances" element={<Finances />} />
              <Route path="documents" element={<Documents />} />
              <Route path="resources" element={<Resources />} />
              <Route path="ai-tools" element={<AITools />} />
              <Route path="ask-ai" element={<AskAI />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profilebuilder" element={<ProfileBuilder />} />
              <Route path="settings" element={<Settings />} />
              <Route path="serbia-interest" element={<SerbiaInterest />} />
            </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
