
import { useEffect, useState } from "react";
import { LeaveRequest, LeaveStatus, LeaveType } from "@/models/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarRange,
  Check,
  Clock,
  FileText,
  Plus,
  Search,
  User,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, differenceInDays } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, userRole } = useAuth();
  const [newRequest, setNewRequest] = useState<Partial<LeaveRequest>>({
    employeeId: user?.id || "",
    employeeName: user?.name || "",
    type: LeaveType.VACATION,
    status: LeaveStatus.PENDING
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchLeaveRequests();
  }, [user]);

  useEffect(() => {
    // Update the new request when user changes
    if (user) {
      setNewRequest(prev => ({
        ...prev,
        employeeId: user.id,
        employeeName: user.name
      }));
    }
  }, [user]);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('leave_requests')
        .select('*, profiles:user_id(full_name)');
      
      // If user is not an admin, only show their own requests
      if (userRole !== 'ADMIN' && userRole !== 'DOCTOR') {
        query = query.eq('user_id', user?.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          employeeId: item.user_id,
          employeeName: item.profiles?.full_name || 'Unknown',
          startDate: item.start_date,
          endDate: item.end_date,
          type: item.type as LeaveType || LeaveType.OTHER,
          reason: item.reason || '',
          status: item.status as LeaveStatus || LeaveStatus.PENDING
        }));
        
        setLeaveRequests(formattedData);
      }
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
      toast({
        title: "Error",
        description: "Failed to load leave requests",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leaveData = {
        user_id: user?.id,
        start_date: newRequest.startDate,
        end_date: newRequest.endDate,
        type: newRequest.type,
        reason: newRequest.reason,
        status: 'PENDING'
      };
      
      const { data, error } = await supabase
        .from('leave_requests')
        .insert(leaveData)
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Format the data to match our frontend model
        const newLeaveRequest: LeaveRequest = {
          id: data.id,
          employeeId: data.user_id,
          employeeName: user?.name || 'Unknown',
          startDate: data.start_date,
          endDate: data.end_date,
          type: data.type as LeaveType,
          reason: data.reason || '',
          status: data.status as LeaveStatus
        };
        
        setLeaveRequests((prev) => [newLeaveRequest, ...prev]);
        setDialogOpen(false);
        setNewRequest({
          employeeId: user?.id || "",
          employeeName: user?.name || "",
          type: LeaveType.VACATION,
          status: LeaveStatus.PENDING
        });
        
        toast({
          title: "Success",
          description: "Leave request submitted successfully",
        });
      }
    } catch (error) {
      console.error("Failed to create leave request:", error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive"
      });
    }
  };

  const handleApproveReject = async (requestId: string, newStatus: LeaveStatus) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status: newStatus })
        .eq('id', requestId);
      
      if (error) throw error;
      
      // Update the local state
      setLeaveRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: newStatus } 
            : request
        )
      );
      
      toast({
        title: "Success",
        description: `Request ${newStatus.toLowerCase()}`,
      });
    } catch (error) {
      console.error("Failed to update leave request:", error);
      toast({
        title: "Error",
        description: "Failed to update request status",
        variant: "destructive"
      });
    }
  };

  const filteredRequests = leaveRequests.filter((request) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      request.employeeName.toLowerCase().includes(searchTermLower) ||
      request.reason.toLowerCase().includes(searchTermLower) ||
      request.type.toLowerCase().includes(searchTermLower) ||
      request.status.toLowerCase().includes(searchTermLower)
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case "APPROVED":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case "REJECTED":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      case "CANCELLED":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return differenceInDays(end, start) + 1; // inclusive of start and end day
  };
  
  const canApproveRequests = userRole === 'ADMIN' || userRole === 'DOCTOR';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Leave Requests</h1>
          <p className="text-muted-foreground">Manage staff leave requests</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-medblue hover:bg-medblue/90">
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Leave Request</DialogTitle>
              <DialogDescription>
                Submit a new leave request for approval
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={newRequest.startDate || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={newRequest.endDate || ""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Leave Type</Label>
                  <Select
                    name="type"
                    value={newRequest.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VACATION">Vacation</SelectItem>
                      <SelectItem value="SICK">Sick Leave</SelectItem>
                      <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                      <SelectItem value="PATERNITY">Paternity Leave</SelectItem>
                      <SelectItem value="BEREAVEMENT">Bereavement</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    name="reason"
                    value={newRequest.reason || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-medblue hover:bg-medblue/90">
                  Submit Request
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center bg-white rounded-md border px-3 max-w-md">
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <Input
          placeholder="Search leave requests..."
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medblue"></div>
        </div>
      ) : (
        <div className="bg-white rounded-md border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                {canApproveRequests && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={canApproveRequests ? 7 : 6} className="text-center py-10 text-muted-foreground">
                    No leave requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        {request.employeeName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <CalendarRange className="h-4 w-4 text-muted-foreground" />
                          {request.startDate} - {request.endDate}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{request.type}</TableCell>
                    <TableCell>{calculateDays(request.startDate, request.endDate)} days</TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={request.reason}>
                        {request.reason}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    {canApproveRequests && (
                      <TableCell className="text-right">
                        {request.status === "PENDING" && (
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="text-medgreen hover:text-white hover:bg-medgreen"
                              onClick={() => handleApproveReject(request.id, LeaveStatus.APPROVED)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="text-medred hover:text-white hover:bg-medred"
                              onClick={() => handleApproveReject(request.id, LeaveStatus.REJECTED)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
