-- =====================================================
-- MENGLISH - English School Management System
-- Database Schema
-- =====================================================

-- ENUM Types
CREATE TYPE user_role AS ENUM ('admin', 'staff');
CREATE TYPE lead_status AS ENUM ('new', 'contacting', 'waiting_test', 'closed_won', 'closed_lost');
CREATE TYPE course_level AS ENUM ('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced');
CREATE TYPE student_status AS ENUM ('active', 'inactive', 'graduated');
CREATE TYPE teacher_status AS ENUM ('active', 'inactive');
CREATE TYPE class_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE enrollment_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');
CREATE TYPE assessment_type AS ENUM ('test', 'homework', 'midterm', 'final');
CREATE TYPE payment_method AS ENUM ('cash', 'transfer', 'card');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'overdue');
CREATE TYPE employee_status AS ENUM ('active', 'inactive');
CREATE TYPE employee_attendance_status AS ENUM ('present', 'absent', 'late', 'leave');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE feedback_type AS ENUM ('feedback', 'complaint', 'suggestion');
CREATE TYPE feedback_status AS ENUM ('open', 'in_progress', 'resolved');
CREATE TYPE transaction_type AS ENUM ('income', 'expense');

-- =====================================================
-- 1. USERS (liên kết Supabase Auth)
-- =====================================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'staff',
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. LEADS (Tuyển sinh CRM)
-- =====================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  source TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES users(id),
  notes TEXT,
  test_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. COURSES (Khóa học)
-- =====================================================
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  level course_level NOT NULL DEFAULT 'beginner',
  total_sessions INTEGER NOT NULL DEFAULT 0,
  fee_per_session NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 4. STUDENTS (Học sinh)
-- =====================================================
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  phone TEXT,
  email TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  address TEXT,
  current_level course_level,
  enrollment_date DATE,
  status student_status NOT NULL DEFAULT 'active',
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 5. TEACHERS (Giáo viên)
-- =====================================================
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  phone TEXT,
  email TEXT,
  specialization TEXT,
  qualifications TEXT,
  contract_start DATE,
  contract_end DATE,
  hourly_rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  status teacher_status NOT NULL DEFAULT 'active',
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 6. CLASSES (Lớp học)
-- =====================================================
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  max_students INTEGER NOT NULL DEFAULT 20,
  schedule JSONB,
  room TEXT,
  start_date DATE,
  end_date DATE,
  status class_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 7. ENROLLMENTS (Ghi danh)
-- =====================================================
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status enrollment_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, class_id)
);

-- =====================================================
-- 8. ATTENDANCE (Điểm danh học sinh)
-- =====================================================
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL DEFAULT 'present',
  notes TEXT,
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(enrollment_id, date)
);

-- =====================================================
-- 9. ASSESSMENTS (Đánh giá học sinh)
-- =====================================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  type assessment_type NOT NULL DEFAULT 'test',
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  max_score NUMERIC(5,2) NOT NULL DEFAULT 100,
  teacher_comment TEXT,
  assessed_by UUID REFERENCES users(id),
  assessed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 10. PAYMENTS (Học phí)
-- =====================================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_date DATE,
  due_date DATE NOT NULL,
  method payment_method,
  status payment_status NOT NULL DEFAULT 'pending',
  receipt_number TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 11. EMPLOYEES (Nhân viên)
-- =====================================================
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  dob DATE,
  gender TEXT,
  phone TEXT,
  email TEXT,
  position TEXT,
  department TEXT,
  contract_start DATE,
  contract_end DATE,
  salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status employee_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 12. EMPLOYEE ATTENDANCE (Chấm công)
-- =====================================================
CREATE TABLE employee_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status employee_attendance_status NOT NULL DEFAULT 'present',
  leave_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- =====================================================
-- 13. TASKS (Công việc)
-- =====================================================
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  due_date DATE,
  priority task_priority NOT NULL DEFAULT 'medium',
  status task_status NOT NULL DEFAULT 'todo',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 14. FEEDBACKS (Phản hồi CSKH)
-- =====================================================
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type feedback_type NOT NULL DEFAULT 'feedback',
  content TEXT NOT NULL,
  status feedback_status NOT NULL DEFAULT 'open',
  handled_by UUID REFERENCES users(id),
  resolution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 15. TRANSACTIONS (Thu chi vận hành)
-- =====================================================
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type transaction_type NOT NULL,
  category TEXT,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 16. NOTIFICATIONS (Thông báo)
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  related_entity TEXT,
  related_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_classes_status ON classes(status);
CREATE INDEX idx_classes_course_id ON classes(course_id);
CREATE INDEX idx_classes_teacher_id ON classes(teacher_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_class_id ON enrollments(class_id);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_due_date ON payments(due_date);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Admin: full access
CREATE POLICY "Admin full access" ON users FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Users can read their own profile
CREATE POLICY "Users read own profile" ON users FOR SELECT USING (id = auth.uid());

-- General read policy for staff on allowed tables
CREATE POLICY "Staff read leads" ON leads FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff manage leads" ON leads FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update leads" ON leads FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin delete leads" ON leads FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Courses: everyone can read, admin can manage
CREATE POLICY "All read courses" ON courses FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin manage courses" ON courses FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Students: staff can read/create/update, admin can delete
CREATE POLICY "Staff read students" ON students FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff create students" ON students FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update students" ON students FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin delete students" ON students FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Teachers
CREATE POLICY "Staff read teachers" ON teachers FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin manage teachers" ON teachers FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Classes
CREATE POLICY "Staff read classes" ON classes FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff create classes" ON classes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update classes" ON classes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin delete classes" ON classes FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Enrollments
CREATE POLICY "Staff read enrollments" ON enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff create enrollments" ON enrollments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update enrollments" ON enrollments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin delete enrollments" ON enrollments FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Attendance
CREATE POLICY "Staff read attendance" ON attendance FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff create attendance" ON attendance FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update attendance" ON attendance FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin delete attendance" ON attendance FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Assessments
CREATE POLICY "Staff read assessments" ON assessments FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff create assessments" ON assessments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update assessments" ON assessments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin delete assessments" ON assessments FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Payments: admin only
CREATE POLICY "Admin manage payments" ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Employees: admin only
CREATE POLICY "Admin manage employees" ON employees FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Employee Attendance: admin only
CREATE POLICY "Admin manage employee_attendance" ON employee_attendance FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Tasks: all staff can see assigned, admin can see all
CREATE POLICY "Staff read own tasks" ON tasks FOR SELECT USING (
  assigned_to = auth.uid() OR
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
CREATE POLICY "Staff create tasks" ON tasks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update own tasks" ON tasks FOR UPDATE USING (
  assigned_to = auth.uid() OR assigned_by = auth.uid() OR
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
CREATE POLICY "Admin delete tasks" ON tasks FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Feedbacks
CREATE POLICY "Staff read feedbacks" ON feedbacks FOR SELECT USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff create feedbacks" ON feedbacks FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Staff update feedbacks" ON feedbacks FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.is_active = TRUE)
);
CREATE POLICY "Admin delete feedbacks" ON feedbacks FOR DELETE USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Transactions: admin only
CREATE POLICY "Admin manage transactions" ON transactions FOR ALL USING (
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Notifications: user reads own
CREATE POLICY "User read own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "User update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System create notifications" ON notifications FOR INSERT WITH CHECK (TRUE);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_feedbacks_updated_at BEFORE UPDATE ON feedbacks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
