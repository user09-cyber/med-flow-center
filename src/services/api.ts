
// This file would contain the API service to communicate with the Java backend
// Mocked implementations are provided for frontend development

import { 
  User, 
  Appointment, 
  MedicalRecord, 
  Patient, 
  LeaveRequest, 
  InsuranceInfo,
  DashboardStats,
  UserRole
} from "../models/types";

// Mock data for development
const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@medcenter.com",
    role: UserRole.DOCTOR,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "2",
    name: "James Wilson",
    email: "james.wilson@medcenter.com",
    role: UserRole.ADMIN,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "3",
    name: "Emily Clark",
    email: "emily.clark@medcenter.com",
    role: UserRole.NURSE,
    avatar: "https://randomuser.me/api/portraits/women/42.jpg"
  }
];

// API service class - in a real app, this would make HTTP requests to your Java backend
export class ApiService {
  private baseUrl: string = "/api"; // Would be replaced with actual backend URL
  private token: string | null = null;

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: User, token: string }> {
    // Mock implementation - would be replaced with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find(u => u.email === email);
        if (user && password === "password") { // Simple mock check
          this.token = "mock-jwt-token";
          resolve({ user, token: this.token });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  }

  async logout(): Promise<void> {
    this.token = null;
    return Promise.resolve();
  }

  // Appointments methods
  async getAppointments(): Promise<Appointment[]> {
    // Mock data - would be replaced with API call
    return Promise.resolve([
      {
        id: "a1",
        patientId: "p1",
        patientName: "John Smith",
        doctorId: "1",
        doctorName: "Dr. Sarah Johnson",
        date: "2025-04-20",
        time: "10:00",
        status: "SCHEDULED",
        purpose: "Annual checkup"
      },
      {
        id: "a2",
        patientId: "p2",
        patientName: "Alice Brown",
        doctorId: "1",
        doctorName: "Dr. Sarah Johnson",
        date: "2025-04-20",
        time: "11:30",
        status: "CONFIRMED",
        purpose: "Follow-up appointment"
      },
      {
        id: "a3",
        patientId: "p3",
        patientName: "Michael Davis",
        doctorId: "1",
        doctorName: "Dr. Sarah Johnson",
        date: "2025-04-21",
        time: "09:15",
        status: "SCHEDULED",
        purpose: "Blood test results"
      }
    ] as Appointment[]);
  }

  async createAppointment(appointment: Omit<Appointment, "id">): Promise<Appointment> {
    // Mock implementation
    const newAppointment = {
      id: `a${Math.floor(Math.random() * 1000)}`,
      ...appointment
    };
    return Promise.resolve(newAppointment as Appointment);
  }

  // Medical records methods
  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    // Mock implementation
    return Promise.resolve([
      {
        id: "mr1",
        patientId,
        patientName: "John Smith",
        createdAt: "2025-03-15",
        updatedAt: "2025-03-15",
        diagnosis: "Common cold",
        symptoms: "Runny nose, sore throat, mild fever",
        prescriptions: [
          {
            id: "p1",
            medication: "Ibuprofen",
            dosage: "400mg",
            frequency: "Every 6 hours",
            duration: "3 days"
          }
        ]
      }
    ]);
  }

  async createMedicalRecord(record: Omit<MedicalRecord, "id" | "createdAt" | "updatedAt">): Promise<MedicalRecord> {
    // Mock implementation
    const now = new Date().toISOString().split('T')[0];
    const newRecord = {
      id: `mr${Math.floor(Math.random() * 1000)}`,
      createdAt: now,
      updatedAt: now,
      ...record
    };
    return Promise.resolve(newRecord as MedicalRecord);
  }

  // Patient methods
  async getPatients(): Promise<Patient[]> {
    // Mock implementation
    return Promise.resolve([
      {
        id: "p1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "555-123-4567",
        dateOfBirth: "1985-06-15",
        gender: "Male",
        address: "123 Main St, Anytown, USA",
        bloodType: "O+",
        allergies: ["Penicillin"]
      },
      {
        id: "p2",
        name: "Alice Brown",
        email: "alice.brown@example.com",
        phone: "555-987-6543",
        dateOfBirth: "1990-03-22",
        gender: "Female",
        address: "456 Oak Ave, Somewhere, USA",
        bloodType: "A-",
        allergies: ["Nuts", "Shellfish"]
      }
    ]);
  }

  async getPatient(patientId: string): Promise<Patient> {
    const patients = await this.getPatients();
    const patient = patients.find(p => p.id === patientId);
    if (!patient) {
      throw new Error("Patient not found");
    }
    return patient;
  }

  // Leave request methods
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    // Mock implementation
    return Promise.resolve([
      {
        id: "l1",
        employeeId: "1",
        employeeName: "Dr. Sarah Johnson",
        startDate: "2025-05-10",
        endDate: "2025-05-17",
        type: "VACATION",
        reason: "Annual vacation",
        status: "PENDING"
      },
      {
        id: "l2",
        employeeId: "3",
        employeeName: "Emily Clark",
        startDate: "2025-04-25",
        endDate: "2025-04-26",
        type: "SICK",
        reason: "Cold symptoms",
        status: "APPROVED",
        approvedBy: "James Wilson",
        approvedAt: "2025-04-18"
      }
    ] as LeaveRequest[]);
  }

  async createLeaveRequest(request: Omit<LeaveRequest, "id" | "status">): Promise<LeaveRequest> {
    // Mock implementation
    const newRequest = {
      id: `l${Math.floor(Math.random() * 1000)}`,
      status: "PENDING",
      ...request
    };
    return Promise.resolve(newRequest as LeaveRequest);
  }

  // Insurance methods
  async verifyInsurance(insuranceInfo: InsuranceInfo): Promise<{ verified: boolean; message?: string }> {
    // Mock implementation
    return Promise.resolve({
      verified: Math.random() > 0.3, // Randomly verify for demo purposes
      message: "Insurance verification completed"
    });
  }

  // Dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    // Mock implementation
    return Promise.resolve({
      appointmentsToday: 8,
      appointmentsUpcoming: 24,
      pendingLeaveRequests: 3,
      activePatients: 145,
      insuranceVerificationsNeeded: 12
    });
  }
}

// Create singleton instance
const apiService = new ApiService();
export default apiService;
