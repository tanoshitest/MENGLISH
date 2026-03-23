// ============================================================
// MOCK DATA - School Management System
// ============================================================

export type Role = "admin" | "teacher";

// ---- Students ----
export interface Student {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  level: string;
  enrollDate: string;
  status: "active" | "inactive" | "graduated";
  classIds: string[];
  totalFee: number;
  paidFee: number;
  attendanceCount: number;
  parentName: string;
  parentPhone: string;
  dob: string;
  notes: { author: string; date: string; content: string }[];
  examResults: { exam: string; score: number; date: string; skill: string }[];
}

export const students: Student[] = [
  {
    id: "STU001", name: "Nguyễn Minh Anh", avatar: "MA", email: "minhanh@email.com", phone: "0901234567",
    level: "B1 - Intermediate", enrollDate: "2024-09-15", status: "active", classIds: ["CLS001", "CLS003"],
    totalFee: 12000000, paidFee: 9000000, attendanceCount: 42, parentName: "Nguyễn Văn Hùng", parentPhone: "0912345678",
    dob: "2008-03-22",
    notes: [
      { author: "Trần Thị Lan (Sales)", date: "2024-09-10", content: "Phụ huynh quan tâm khóa IELTS, cần tư vấn thêm lộ trình." },
      { author: "Lê Hoàng Nam (GV)", date: "2024-11-05", content: "Học sinh tiến bộ tốt về Speaking, cần cải thiện Writing Task 2." },
    ],
    examResults: [
      { exam: "Placement Test", score: 5.5, date: "2024-09-14", skill: "Overall" },
      { exam: "Mid-term B1", score: 7.0, date: "2024-11-20", skill: "Reading" },
      { exam: "Mid-term B1", score: 6.0, date: "2024-11-20", skill: "Writing" },
    ],
  },
  {
    id: "STU002", name: "Trần Quốc Bảo", avatar: "QB", email: "quocbao@email.com", phone: "0907654321",
    level: "A2 - Elementary", enrollDate: "2024-10-01", status: "active", classIds: ["CLS002"],
    totalFee: 8000000, paidFee: 8000000, attendanceCount: 30, parentName: "Trần Thị Mai", parentPhone: "0923456789",
    dob: "2009-07-11",
    notes: [
      { author: "Phạm Thị Hoa (Sales)", date: "2024-09-28", content: "Đăng ký online, đã test đầu vào A2." },
    ],
    examResults: [
      { exam: "Placement Test", score: 3.5, date: "2024-09-30", skill: "Overall" },
    ],
  },
  {
    id: "STU003", name: "Lê Thị Hương", avatar: "TH", email: "huongle@email.com", phone: "0918765432",
    level: "B2 - Upper Intermediate", enrollDate: "2024-06-01", status: "active", classIds: ["CLS003"],
    totalFee: 15000000, paidFee: 15000000, attendanceCount: 65, parentName: "Lê Văn Tâm", parentPhone: "0934567890",
    dob: "2006-12-05",
    notes: [],
    examResults: [
      { exam: "IELTS Mock", score: 6.5, date: "2024-12-10", skill: "Overall" },
    ],
  },
  {
    id: "STU004", name: "Phạm Đức Khang", avatar: "DK", email: "duckhang@email.com", phone: "0945678901",
    level: "A1 - Beginner", enrollDate: "2025-01-10", status: "active", classIds: ["CLS004"],
    totalFee: 6000000, paidFee: 3000000, attendanceCount: 8, parentName: "Phạm Minh Tuấn", parentPhone: "0956789012",
    dob: "2010-05-18",
    notes: [
      { author: "Trần Thị Lan (Sales)", date: "2025-01-08", content: "Học sinh mới, cần theo dõi sát tháng đầu." },
    ],
    examResults: [],
  },
  {
    id: "STU005", name: "Võ Ngọc Trâm", avatar: "NT", email: "ngoctram@email.com", phone: "0967890123",
    level: "B1 - Intermediate", enrollDate: "2024-08-20", status: "inactive", classIds: [],
    totalFee: 12000000, paidFee: 6000000, attendanceCount: 25, parentName: "Võ Văn Sơn", parentPhone: "0978901234",
    dob: "2007-09-30",
    notes: [
      { author: "Admin", date: "2024-12-01", content: "Tạm nghỉ do lý do cá nhân. Dự kiến quay lại tháng 3/2025." },
    ],
    examResults: [
      { exam: "Mid-term B1", score: 5.5, date: "2024-11-20", skill: "Overall" },
    ],
  },
];

// ---- Teachers ----
export interface Teacher {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  specialty: string;
  hoursThisMonth: number;
  totalClasses: number;
  avgRating: number;
  status: "active" | "inactive";
}

export const teachers: Teacher[] = [
  { id: "TCH001", name: "Lê Hoàng Nam", avatar: "HN", email: "hoangnam@school.com", phone: "0911223344", specialty: "IELTS Writing & Speaking", hoursThisMonth: 48, totalClasses: 3, avgRating: 4.8, status: "active" },
  { id: "TCH002", name: "Sarah Johnson", avatar: "SJ", email: "sarah@school.com", phone: "0922334455", specialty: "General English & Pronunciation", hoursThisMonth: 36, totalClasses: 2, avgRating: 4.9, status: "active" },
  { id: "TCH003", name: "Nguyễn Thị Phượng", avatar: "TP", email: "phuong@school.com", phone: "0933445566", specialty: "TOEIC & Business English", hoursThisMonth: 40, totalClasses: 3, avgRating: 4.6, status: "active" },
];

// ---- Classes ----
export interface ClassItem {
  id: string;
  name: string;
  course: string;
  teacherId: string;
  schedule: string;
  room: string;
  studentCount: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  status: "active" | "upcoming" | "completed";
}

export const classes: ClassItem[] = [
  { id: "CLS001", name: "IELTS B1 - Sáng T2/T4/T6", course: "IELTS Foundation", teacherId: "TCH001", schedule: "T2, T4, T6 | 8:00-9:30", room: "Room A1", studentCount: 12, maxStudents: 15, startDate: "2024-09-16", endDate: "2025-03-16", status: "active" },
  { id: "CLS002", name: "English A2 - Chiều T3/T5", course: "General English A2", teacherId: "TCH002", schedule: "T3, T5 | 14:00-15:30", room: "Room B2", studentCount: 8, maxStudents: 12, startDate: "2024-10-01", endDate: "2025-04-01", status: "active" },
  { id: "CLS003", name: "IELTS B2 - Tối T2/T4/T6", course: "IELTS Advanced", teacherId: "TCH001", schedule: "T2, T4, T6 | 18:30-20:00", room: "Room A2", studentCount: 10, maxStudents: 12, startDate: "2024-06-01", endDate: "2025-06-01", status: "active" },
  { id: "CLS004", name: "Starter A1 - Sáng T7/CN", course: "English Starter", teacherId: "TCH003", schedule: "T7, CN | 9:00-11:00", room: "Room C1", studentCount: 6, maxStudents: 10, startDate: "2025-01-11", endDate: "2025-07-11", status: "active" },
];

// ---- CRM Leads ----
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  interest: string;
  assignee: string;
  stage: "new" | "nurturing" | "test" | "closed";
  value: number;
  createdDate: string;
  note: string;
}

export const leads: Lead[] = [
  { id: "L001", name: "Hoàng Thị Yến", phone: "0981112233", email: "yen@gmail.com", source: "Facebook Ads", interest: "IELTS 6.5", assignee: "Trần Thị Lan", stage: "new", value: 15000000, createdDate: "2025-03-20", note: "Liên hệ lại chiều nay" },
  { id: "L002", name: "Đặng Văn Kiên", phone: "0972223344", email: "kien@gmail.com", source: "Giới thiệu", interest: "Tiếng Anh giao tiếp", assignee: "Phạm Thị Hoa", stage: "nurturing", value: 8000000, createdDate: "2025-03-18", note: "Đã gọi 2 lần, quan tâm lớp tối" },
  { id: "L003", name: "Bùi Minh Tú", phone: "0963334455", email: "tu@gmail.com", source: "Website", interest: "TOEIC 700+", assignee: "Trần Thị Lan", stage: "nurturing", value: 10000000, createdDate: "2025-03-15", note: "Hẹn test đầu vào T7" },
  { id: "L004", name: "Lý Thanh Hà", phone: "0954445566", email: "ha@gmail.com", source: "Walk-in", interest: "English Starter cho con", assignee: "Phạm Thị Hoa", stage: "test", value: 6000000, createdDate: "2025-03-12", note: "Con 8 tuổi, đã test A1" },
  { id: "L005", name: "Ngô Quang Vinh", phone: "0945556677", email: "vinh@gmail.com", source: "Facebook Ads", interest: "IELTS 7.0", assignee: "Trần Thị Lan", stage: "closed", value: 18000000, createdDate: "2025-03-05", note: "Đã đóng học phí, xếp lớp CLS003" },
  { id: "L006", name: "Phan Thị Ngọc", phone: "0936667788", email: "ngoc@gmail.com", source: "Zalo", interest: "Giao tiếp cơ bản", assignee: "Phạm Thị Hoa", stage: "new", value: 7000000, createdDate: "2025-03-22", note: "Mới inbox hỏi thông tin" },
  { id: "L007", name: "Trịnh Đức Anh", phone: "0927778899", email: "ducanh@gmail.com", source: "Giới thiệu", interest: "IELTS 5.5", assignee: "Trần Thị Lan", stage: "test", value: 12000000, createdDate: "2025-03-10", note: "Test xong, chờ báo kết quả" },
];

// ---- Courses ----
export interface Course {
  id: string;
  name: string;
  level: string;
  duration: string;
  fee: number;
  description: string;
  classCount: number;
  studentCount: number;
}

export const courses: Course[] = [
  { id: "CRS001", name: "English Starter", level: "A1", duration: "6 tháng", fee: 6000000, description: "Khóa học nền tảng cho người mới bắt đầu", classCount: 1, studentCount: 6 },
  { id: "CRS002", name: "General English A2", level: "A2", duration: "6 tháng", fee: 8000000, description: "Tiếng Anh tổng quát trình độ sơ cấp", classCount: 1, studentCount: 8 },
  { id: "CRS003", name: "IELTS Foundation", level: "B1", duration: "6 tháng", fee: 12000000, description: "Nền tảng IELTS cho trình độ trung cấp", classCount: 1, studentCount: 12 },
  { id: "CRS004", name: "IELTS Advanced", level: "B2", duration: "12 tháng", fee: 15000000, description: "Luyện thi IELTS chuyên sâu band 6.5+", classCount: 1, studentCount: 10 },
  { id: "CRS005", name: "TOEIC Preparation", level: "B1-B2", duration: "4 tháng", fee: 10000000, description: "Luyện thi TOEIC 600-800+", classCount: 0, studentCount: 0 },
];

// ---- Tickets ----
export interface Ticket {
  id: string;
  title: string;
  from: string;
  category: string;
  priority: "low" | "medium" | "high";
  stage: "new" | "processing" | "closed";
  createdDate: string;
  assignee: string;
}

export const tickets: Ticket[] = [
  { id: "TK001", title: "Xin chuyển lớp sáng sang tối", from: "PH Nguyễn Văn Hùng", category: "Chuyển lớp", priority: "medium", stage: "new", createdDate: "2025-03-21", assignee: "Admin" },
  { id: "TK002", title: "Hỏi về lịch thi cuối kỳ", from: "Trần Quốc Bảo", category: "Thông tin", priority: "low", stage: "processing", createdDate: "2025-03-19", assignee: "Lê Hoàng Nam" },
  { id: "TK003", title: "Yêu cầu hoàn học phí", from: "PH Võ Văn Sơn", category: "Tài chính", priority: "high", stage: "new", createdDate: "2025-03-22", assignee: "Admin" },
  { id: "TK004", title: "Góp ý về chất lượng phòng học", from: "Lê Thị Hương", category: "Cơ sở vật chất", priority: "medium", stage: "closed", createdDate: "2025-03-10", assignee: "Admin" },
];

// ---- Finance ----
export interface FinanceRecord {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  relatedTo: string;
}

export const financeRecords: FinanceRecord[] = [
  { id: "FIN001", type: "income", category: "Học phí", description: "Học phí IELTS B1 - Nguyễn Minh Anh", amount: 4500000, date: "2025-03-01", status: "paid", relatedTo: "STU001" },
  { id: "FIN002", type: "income", category: "Học phí", description: "Học phí English A2 - Trần Quốc Bảo", amount: 8000000, date: "2025-01-15", status: "paid", relatedTo: "STU002" },
  { id: "FIN003", type: "expense", category: "Lương GV", description: "Lương T2/2025 - Lê Hoàng Nam", amount: 18000000, date: "2025-03-05", status: "paid", relatedTo: "TCH001" },
  { id: "FIN004", type: "expense", category: "Lương GV", description: "Lương T2/2025 - Sarah Johnson", amount: 22000000, date: "2025-03-05", status: "paid", relatedTo: "TCH002" },
  { id: "FIN005", type: "income", category: "Học phí", description: "Học phí IELTS B2 - Ngô Quang Vinh", amount: 18000000, date: "2025-03-06", status: "paid", relatedTo: "L005" },
  { id: "FIN006", type: "expense", category: "Thuê mặt bằng", description: "Tiền thuê T3/2025", amount: 25000000, date: "2025-03-01", status: "paid", relatedTo: "" },
  { id: "FIN007", type: "income", category: "Học phí", description: "Học phí còn lại - Nguyễn Minh Anh", amount: 3000000, date: "2025-03-25", status: "pending", relatedTo: "STU001" },
  { id: "FIN008", type: "income", category: "Học phí", description: "Học phí A1 - Phạm Đức Khang", amount: 3000000, date: "2025-02-15", status: "overdue", relatedTo: "STU004" },
  { id: "FIN009", type: "expense", category: "Lương GV", description: "Lương T2/2025 - Nguyễn Thị Phượng", amount: 16000000, date: "2025-03-05", status: "paid", relatedTo: "TCH003" },
  { id: "FIN010", type: "expense", category: "Marketing", description: "Facebook Ads T3/2025", amount: 5000000, date: "2025-03-01", status: "paid", relatedTo: "" },
];

// ---- HR Tasks ----
export interface Task {
  id: string;
  title: string;
  assignee: string;
  stage: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
}

export const tasks: Task[] = [
  { id: "TSK001", title: "Chuẩn bị đề thi cuối kỳ B1", assignee: "Lê Hoàng Nam", stage: "in_progress", priority: "high", dueDate: "2025-03-28" },
  { id: "TSK002", title: "Sắp xếp lại phòng học A2", assignee: "Admin", stage: "todo", priority: "medium", dueDate: "2025-03-25" },
  { id: "TSK003", title: "Gửi báo cáo tháng 2 cho BGĐ", assignee: "Admin", stage: "done", priority: "high", dueDate: "2025-03-10" },
  { id: "TSK004", title: "Họp review chương trình IELTS", assignee: "Nguyễn Thị Phượng", stage: "todo", priority: "medium", dueDate: "2025-03-30" },
  { id: "TSK005", title: "Cập nhật tài liệu Speaking Part 2", assignee: "Sarah Johnson", stage: "in_progress", priority: "low", dueDate: "2025-04-01" },
];

// ---- Teacher Schedule (for Calendar) ----
export interface ScheduleEvent {
  id: string;
  title: string;
  classId: string;
  room: string;
  date: string;
  startTime: string;
  endTime: string;
  type: "class" | "meeting" | "exam";
}

export const teacherSchedule: ScheduleEvent[] = [
  { id: "EVT001", title: "IELTS B1 - Sáng", classId: "CLS001", room: "Room A1", date: "2025-03-24", startTime: "08:00", endTime: "09:30", type: "class" },
  { id: "EVT002", title: "IELTS B2 - Tối", classId: "CLS003", room: "Room A2", date: "2025-03-24", startTime: "18:30", endTime: "20:00", type: "class" },
  { id: "EVT003", title: "IELTS B1 - Sáng", classId: "CLS001", room: "Room A1", date: "2025-03-26", startTime: "08:00", endTime: "09:30", type: "class" },
  { id: "EVT004", title: "Họp review giáo trình", classId: "", room: "Phòng họp", date: "2025-03-25", startTime: "14:00", endTime: "15:00", type: "meeting" },
  { id: "EVT005", title: "IELTS B2 - Tối", classId: "CLS003", room: "Room A2", date: "2025-03-26", startTime: "18:30", endTime: "20:00", type: "class" },
  { id: "EVT006", title: "IELTS B1 - Sáng", classId: "CLS001", room: "Room A1", date: "2025-03-28", startTime: "08:00", endTime: "09:30", type: "class" },
  { id: "EVT007", title: "Thi cuối kỳ B1", classId: "CLS001", room: "Room A1", date: "2025-03-28", startTime: "10:00", endTime: "12:00", type: "exam" },
];

// ---- Dashboard KPIs ----
export const adminKPIs = {
  newStudents: 14,
  newStudentsDelta: "+23%",
  totalRevenue: 76500000,
  revenueDelta: "+12%",
  activeClasses: 4,
  fillRate: 78,
  pendingPayments: 6000000,
  ticketsOpen: 3,
};

export const teacherKPIs = {
  classesToday: 2,
  homeworkToGrade: 8,
  upcomingExams: 1,
  notifications: 3,
};

// Revenue chart data
export const revenueChartData = [
  { month: "T10", revenue: 45000000, expense: 38000000 },
  { month: "T11", revenue: 52000000, expense: 40000000 },
  { month: "T12", revenue: 61000000, expense: 42000000 },
  { month: "T1", revenue: 48000000, expense: 39000000 },
  { month: "T2", revenue: 58000000, expense: 41000000 },
  { month: "T3", revenue: 76500000, expense: 46000000 },
];

export const fillRateData = [
  { name: "IELTS B1", fill: 80, max: 100 },
  { name: "English A2", fill: 67, max: 100 },
  { name: "IELTS B2", fill: 83, max: 100 },
  { name: "Starter A1", fill: 60, max: 100 },
];
