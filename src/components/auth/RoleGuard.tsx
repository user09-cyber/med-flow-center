
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/models/types";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  redirectTo?: string;
  children?: React.ReactNode;
}

export function RoleGuard({ 
  allowedRoles, 
  redirectTo = "/dashboard", 
  children 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue"></div>
      </div>
    );
  }
  
  // If user is not authenticated or doesn't have the required role
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children || <Outlet />}</>;
}
