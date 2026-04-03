export type UserRole = 'admin' | 'staff';
export type LeadStatus = 'new' | 'contacting' | 'waiting_test' | 'closed_won' | 'closed_lost';
export type CourseLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced';
export type StudentStatus = 'active' | 'inactive' | 'graduated';
export type TeacherStatus = 'active' | 'inactive';
export type ClassStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type EnrollmentStatus = 'active' | 'completed' | 'dropped';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';
export type AssessmentType = 'test' | 'homework' | 'midterm' | 'final';
export type PaymentMethod = 'cash' | 'transfer' | 'card';
export type PaymentStatus = 'paid' | 'pending' | 'overdue';
export type EmployeeStatus = 'active' | 'inactive';
export type EmployeeAttendanceStatus = 'present' | 'absent' | 'late' | 'leave';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type FeedbackType = 'feedback' | 'complaint' | 'suggestion';
export type FeedbackStatus = 'open' | 'in_progress' | 'resolved';
export type TransactionType = 'income' | 'expense';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  source?: string;
  status: LeadStatus;
  assigned_to?: string;
  notes?: string;
  test_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  level: CourseLevel;
  total_sessions: number;
  fee_per_session: number;
  total_fee: number;
  is_active: boolean;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  parent_name?: string;
  parent_phone?: string;
  address?: string;
  current_level?: CourseLevel;
  enrollment_date?: string;
  status: StudentStatus;
  lead_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  full_name: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  specialization?: string;
  qualifications?: string;
  contract_start?: string;
  contract_end?: string;
  hourly_rate: number;
  status: TeacherStatus;
  user_id?: string;
  created_at: string;
}

export interface Class {
  id: string;
  name: string;
  course_id: string;
  teacher_id?: string;
  max_students: number;
  schedule?: Record<string, string>;
  room?: string;
  start_date?: string;
  end_date?: string;
  status: ClassStatus;
  created_at: string;
  course?: Course;
  teacher?: Teacher;
}

export interface Enrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrolled_date: string;
  status: EnrollmentStatus;
  created_at: string;
  student?: Student;
  class?: Class;
}

export interface Attendance {
  id: string;
  enrollment_id: string;
  class_id: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  marked_by?: string;
  created_at: string;
}

export interface Assessment {
  id: string;
  student_id: string;
  class_id: string;
  type: AssessmentType;
  score: number;
  max_score: number;
  teacher_comment?: string;
  assessed_by?: string;
  assessed_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  student_id: string;
  class_id?: string;
  amount: number;
  payment_date?: string;
  due_date: string;
  method?: PaymentMethod;
  status: PaymentStatus;
  receipt_number?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
}

export interface Employee {
  id: string;
  full_name: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  position?: string;
  department?: string;
  contract_start?: string;
  contract_end?: string;
  salary: number;
  user_id?: string;
  status: EmployeeStatus;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  employee_id: string;
  date: string;
  check_in?: string;
  check_out?: string;
  status: EmployeeAttendanceStatus;
  leave_type?: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  assigned_by?: string;
  due_date?: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  student_id: string;
  type: FeedbackType;
  content: string;
  status: FeedbackStatus;
  handled_by?: string;
  resolution?: string;
  created_at: string;
  updated_at: string;
  student?: Student;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category?: string;
  amount: number;
  description?: string;
  transaction_date: string;
  created_by?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  related_entity?: string;
  related_id?: string;
  created_at: string;
}
