
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
import { RoleGuard } from "./components/auth/RoleGuard";
import { UserRole } from "./models/types";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="appointments" element={<Appointments />} />
              
              {/* Patient-only routes */}
              <Route element={<RoleGuard allowedRoles={[UserRole.PATIENT]} />}>
                {/* Patient specific routes will be added here */}
              </Route>
              
              {/* Doctor-only routes */}
              <Route element={<RoleGuard allowedRoles={[UserRole.DOCTOR]} />}>
                <Route path="medical-records" element={<MedicalRecords />} />
              </Route>
              
              {/* Staff/Admin-only routes */}
              <Route element={<RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.NURSE, UserRole.RECEPTIONIST]} />}>
                <Route path="leave-requests" element={<LeaveRequests />} />
                <Route path="insurance" element={<Insurance />} />
                <Route path="staff" element={<Dashboard />} />
              </Route>
              
              {/* Global routes that need to be protected but available to all roles */}
              <Route element={<RoleGuard allowedRoles={[
                UserRole.ADMIN, 
                UserRole.DOCTOR, 
                UserRole.NURSE, 
                UserRole.RECEPTIONIST,
                UserRole.PATIENT
              ]} />}>
                <Route path="patients" element={<Dashboard />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
