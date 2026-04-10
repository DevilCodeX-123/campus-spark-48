import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import RoleGuard from "@/components/RoleGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import StudentSignup from "./pages/StudentSignup";
import CollegeAdminSignup from "./pages/CollegeAdminSignup";
import EventsPage from "./pages/EventsPage";
import OwnerPanel from "./pages/OwnerPanel";
import PlatformAdminDashboard from "./pages/PlatformAdminDashboard";
import CollegeAdminDashboard from "./pages/CollegeAdminDashboard";
import EventHeadDashboard from "./pages/EventHeadDashboard";
import OrganizerHelperPanel from "./pages/OrganizerHelperPanel";
import StudentPortal from "./pages/StudentPortal";
import EventRegistrationPage from "./pages/EventRegistrationPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <Toaster />
        <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<StudentSignup />} />
            <Route path="/register-college" element={<CollegeAdminSignup />} />
            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
            <Route path="/owner-access-9x72k" element={<OwnerPanel />} />
            <Route path="/admin" element={<RoleGuard allowedRoles={['website_admin']}><PlatformAdminDashboard /></RoleGuard>} />
            <Route path="/college-admin" element={<RoleGuard allowedRoles={['college_admin']}><CollegeAdminDashboard /></RoleGuard>} />
            <Route path="/event-head" element={<RoleGuard allowedRoles={['event_head']}><EventHeadDashboard /></RoleGuard>} />
            <Route path="/helper" element={<RoleGuard allowedRoles={['helper']}><OrganizerHelperPanel /></RoleGuard>} />
            <Route path="/student" element={<RoleGuard allowedRoles={['student']}><StudentPortal /></RoleGuard>} />
            <Route path="/register-event/:eventId" element={<RoleGuard allowedRoles={['student']}><EventRegistrationPage /></RoleGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
