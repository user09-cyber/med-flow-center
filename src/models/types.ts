
// Core data types for the health center management system
// These will be used across the application and would interface with a Java backend

// User-related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export enum UserRole {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  RECEPTIONIST = "RECEPTIONIST",
  PATIENT = "PATIENT"
}

// Authentication types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Appointment-related types
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  purpose: string;
  notes?: string;
}

export enum AppointmentStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW"
}

// Medical record types
export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  createdAt: string;
  updatedAt: string;
  diagnosis: string;
  symptoms: string;
  prescriptions: Prescription[];
  attachments?: Attachment[];
  notes?: string;
}

export interface Prescription {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

// Patient types
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceInfo?: InsuranceInfo;
}

// Insurance types
export interface InsuranceInfo {
  id: string;
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  holderName: string;
  relationship: string;
  expiryDate: string;
  coverageDetails?: string;
  verified: boolean;
}

// Leave request types
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export enum LeaveType {
  VACATION = "VACATION",
  SICK = "SICK",
  MATERNITY = "MATERNITY",
  PATERNITY = "PATERNITY",
  BEREAVEMENT = "BEREAVEMENT",
  OTHER = "OTHER"
}

export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED"
}

// Dashboard analytics types
export interface DashboardStats {
  appointmentsToday: number;
  appointmentsUpcoming: number;
  pendingLeaveRequests: number;
  activePatients: number;
  insuranceVerificationsNeeded: number;
}
