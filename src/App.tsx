
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Appointments } from "./pages/Appointments";
import { MedicalRecords } from "./pages/MedicalRecords";
import { LeaveRequests } from "./pages/LeaveRequests";
import { Insurance } from "./pages/Insurance";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              {/* These routes will be implemented later */}
              <Route path="patients" element={<Dashboard />} />
              <Route path="medical-records" element={<MedicalRecords />} />
              <Route path="leave-requests" element={<LeaveRequests />} />
              <Route path="insurance" element={<Insurance />} />
              <Route path="staff" element={<Dashboard />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
