
import { useEffect, useState } from "react";
import { DashboardStats } from "@/models/types";
import apiService from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ClipboardCheck, FileText, ShieldCheck, UserRound } from "lucide-react";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the MedFlow Center management system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-medblue" />
              Today's Appointments
            </CardTitle>
            <CardDescription>Total appointments today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.appointmentsToday}</div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-medgreen" />
              Upcoming Appointments
            </CardTitle>
            <CardDescription>Next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.appointmentsUpcoming}</div>
          </CardContent>
        </Card>

        {/* Active Patients */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserRound className="h-5 w-5 text-medblue" />
              Active Patients
            </CardTitle>
            <CardDescription>Total registered patients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.activePatients}</div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-medred" />
              Pending Leave Requests
            </CardTitle>
            <CardDescription>Requests needing approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pendingLeaveRequests}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest activities in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 pb-4 border-b">
                <div className="p-2 bg-medblue/10 rounded-full">
                  <FileText className="h-4 w-4 text-medblue" />
                </div>
                <div>
                  <p className="font-medium">Medical record updated</p>
                  <p className="text-sm text-muted-foreground">Dr. Sarah Johnson updated John Smith's medical record</p>
                  <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                </div>
              </li>
              <li className="flex items-start gap-4 pb-4 border-b">
                <div className="p-2 bg-medgreen/10 rounded-full">
                  <CalendarDays className="h-4 w-4 text-medgreen" />
                </div>
                <div>
                  <p className="font-medium">Appointment confirmed</p>
                  <p className="text-sm text-muted-foreground">Alice Brown confirmed her appointment for tomorrow</p>
                  <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 bg-medred/10 rounded-full">
                  <ShieldCheck className="h-4 w-4 text-medred" />
                </div>
                <div>
                  <p className="font-medium">Insurance verification</p>
                  <p className="text-sm text-muted-foreground">Michael Davis's insurance verified successfully</p>
                  <p className="text-xs text-muted-foreground mt-1">1 hour ago</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Insurance Verifications Needed */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance Verifications Needed</CardTitle>
            <CardDescription>Patients requiring insurance verification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-medblue/10 rounded-full">
                    <UserRound className="h-4 w-4 text-medblue" />
                  </div>
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">Policy #: ABC12345678</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-sm">Verify</Button>
              </div>
              <div className="flex justify-between items-center pb-4 border-b">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-medblue/10 rounded-full">
                    <UserRound className="h-4 w-4 text-medblue" />
                  </div>
                  <div>
                    <p className="font-medium">Sarah Thompson</p>
                    <p className="text-sm text-muted-foreground">Policy #: XYZ98765432</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-sm">Verify</Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-medblue/10 rounded-full">
                    <UserRound className="h-4 w-4 text-medblue" />
                  </div>
                  <div>
                    <p className="font-medium">Michael Williams</p>
                    <p className="text-sm text-muted-foreground">Policy #: DEF56781234</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-sm">Verify</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Add missing Button import
import { Button } from "@/components/ui/button";
