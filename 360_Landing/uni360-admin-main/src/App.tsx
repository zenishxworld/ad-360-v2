import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { MainLayout } from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Universities from "./pages/Universities";
import { Applications } from "./pages/Applications";
import { Documents } from "./pages/Documents";
import { Payments } from "./pages/Payments";
import Settings from "./pages/Settings";
import { Appointments } from "./pages/Appointments";
import { Students } from "./pages/Students";
import { StudentDetails } from "./pages/StudentDetails";
import ApplicationDetails from "./pages/ApplicationDetails";
import History from './pages/History';
import Resources from "./pages/Resources";
import AITools from "./pages/AITools";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";
import NewApplication from "./pages/NewApplication";
import Communications from "./pages/Communications";
import SerbiaLeads from "./pages/SerbiaLeads";
import SerbiaLeadDetails from "./pages/SerbiaLeadDetails";
import Interests from "./pages/Interests";

/*
  Code Splitting Preparation:
  To optimize initial load times, routes can be lazy-loaded in the future.
  Example Transition:
  
  1. Replace static imports with lazy imports:
     import React, { Suspense } from 'react';
     const Dashboard = React.lazy(() => import("./pages/Dashboard"));
     const Universities = React.lazy(() => import("./pages/Universities"));
     ...
     
  2. Wrap layout or routing element in Suspense:
     <Suspense fallback={<div className="flex items-center justify-center min-h-[50vh]">Loading page...</div>}>
       <Routes>
         ...
       </Routes>
     </Suspense>
*/

const queryClient = new QueryClient();

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/students" replace />} />
              <Route path="/login" element={<Navigate to="/students" replace />} />
              <Route path="/signup" element={<Navigate to="/students" replace />} />
              <Route path="/register-b2b" element={<Navigate to="/students" replace />} />
              <Route path="/admin/login" element={<Navigate to="/students" replace />} />

              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/universities" element={<Universities />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<NewApplication />} />
                <Route path="/applications/:id" element={<ApplicationDetails />} />
                <Route path="/history" element={<History />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/students" element={<Students />} />
                <Route path="/students/:id" element={<StudentDetails />} />
                <Route path="/ai-tools" element={<AITools />} />
                <Route path="/support" element={<Support />} />
                <Route path="/communications" element={<Communications />} />
                <Route path="/serbia-leads" element={<SerbiaLeads />} />
                <Route path="/serbia-leads/:id" element={<SerbiaLeadDetails />} />
                <Route path="/interests" element={<Interests />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
