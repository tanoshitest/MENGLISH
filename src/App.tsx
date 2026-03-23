import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RoleProvider } from "@/contexts/RoleContext";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import CRMPage from "@/pages/CRMPage";
import CoursesPage from "@/pages/CoursesPage";
import ClassesPage from "@/pages/ClassesPage";
import StudentsPage from "@/pages/StudentsPage";
import StudentDetailPage from "@/pages/StudentDetailPage";
import TeachersPage from "@/pages/TeachersPage";
import TicketsPage from "@/pages/TicketsPage";
import FinancePage from "@/pages/FinancePage";
import TasksPage from "@/pages/TasksPage";
import SettingsPage from "@/pages/SettingsPage";
import DocumentsPage from "@/pages/DocumentsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RoleProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crm" element={<CRMPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/classes" element={<ClassesPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/students/:id" element={<StudentDetailPage />} />
              <Route path="/teachers" element={<TeachersPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/finance" element={<FinancePage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </RoleProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
