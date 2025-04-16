
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  User,
  UserPlus,
  Users
} from "lucide-react";
import { UserRole } from "@/models/types";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, isActive, isCollapsed }: SidebarItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-2",
          isActive ? "bg-medblue/10 text-medblue" : "hover:bg-medblue/5 hover:text-medblue"
        )}
      >
        <Icon size={20} />
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { pathname } = useLocation();
  const { logout, userRole } = useAuth();

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
      { icon: CalendarDays, label: "Appointments", href: "/appointments" },
    ];
    
    // Role-specific items
    if (userRole === "PATIENT") {
      return [
        ...commonItems,
        { icon: FileText, label: "My Records", href: "/my-records" },
      ];
    } else if (userRole === "DOCTOR") {
      return [
        ...commonItems,
        { icon: Users, label: "Patients", href: "/patients" },
        { icon: FileText, label: "Medical Records", href: "/medical-records" },
        { icon: ClipboardList, label: "Leave Requests", href: "/leave-requests" },
      ];
    } else if (userRole === "ADMIN") {
      return [
        ...commonItems,
        { icon: Users, label: "Patients", href: "/patients" },
        { icon: FileText, label: "Medical Records", href: "/medical-records" },
        { icon: ClipboardList, label: "Leave Requests", href: "/leave-requests" },
        { icon: ShieldCheck, label: "Insurance", href: "/insurance" },
        { icon: UserPlus, label: "Staff", href: "/staff" },
      ];
    } else {
      // Default for other roles or no role
      return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <div
      className={cn(
        "flex flex-col border-r transition-all duration-300 h-screen sticky top-0 bg-white",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center border-b p-4 h-16">
        {!isCollapsed && (
          <div className="flex items-center gap-2 text-lg font-semibold text-medblue">
            <ShieldCheck size={24} />
            <span>MedFlow Center</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", isCollapsed && "mx-auto")}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <div className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={pathname === item.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div className="border-t p-2">
        {!isCollapsed && userRole && (
          <div className="px-2 py-1 mb-2 text-sm font-medium text-muted-foreground">
            Current mode: {userRole.toLowerCase()}
          </div>
        )}
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 text-medred hover:bg-medred/5 hover:text-medred"
          onClick={() => logout()}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}
