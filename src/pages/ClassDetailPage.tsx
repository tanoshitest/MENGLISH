import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { classes, students, teachers, attendanceRecords } from "@/data/mockData";
import { 
  ChevronLeft, Calendar, MapPin, CheckCircle, 
  XCircle, Clock, Save, FileSpreadsheet, UserPlus,
  Trash2, Search, Edit3, UserCog, AlertCircle
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";

// Fixed mock grade data to avoid re-renders
const MOCK_GRADES: Record<string, { listening: string; reading: string; writing: string; speaking: string }> = {
  STU001: { listening: "7.0", reading: "6.5", writing: "6.5", speaking: "7.5" },
  STU002: { listening: "6.0", reading: "6.5", writing: "7.0", speaking: "6.5" },
  STU003: { listening: "7.5", reading: "7.0", writing: "6.5", speaking: "7.0" },
  STU004: { listening: "5.5", reading: "6.0", writing: "6.0", speaking: "6.5" },
  STU005: { listening: "8.0", reading: "7.5", writing: "7.0", speaking: "7.5" },
};

const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useRole();

  // All state hooks must be declared before any conditional return
  const [activeTab, setActiveTab] = useState<"info" | "students" | "attendance" | "grades">("info");
  const todayRaw = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayRaw);
  const [localAttendance, setLocalAttendance] = useState<Record<string, "present" | "absent" | "late">>({});

  // Derived data — safe because hooks are already declared above
  const classData = classes.find((c) => c.id === id);
  const classStudents = classData ? students.filter((s) => s.classIds.includes(classData.id)) : [];
  const teacher = classData ? teachers.find((t) => t.id === classData.teacherId) : null;

  // Now we can safely have the conditional return
  if (!classData) {
    return (
      <div className="p-10 text-center">
        <p className="text-xl font-bold">Lớp học không tồn tại</p>
        <button onClick={() => navigate("/classes")} className="mt-4 text-primary hover:underline text-sm">
          ← Quay lại danh sách lớp
        </button>
      </div>
    );
  }

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "late") => {
    setLocalAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const getAttendanceStatus = (studentId: string): "present" | "absent" | "late" => {
    if (localAttendance[studentId]) return localAttendance[studentId];
    const record = attendanceRecords.find(r => r.studentId === studentId && r.date === attendanceDate && r.classId === id);
    return record?.status || "present";
  };

  const saveAttendance = () => {
    toast.success("Đã lưu điểm danh ngày " + attendanceDate);
  };

  const getGrade = (studentId: string) => {
    return MOCK_GRADES[studentId] || { listening: "7.0", reading: "7.0", writing: "7.0", speaking: "7.0" };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-card border-b p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">{classData.name}</h1>
              <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold border border-primary/20">
                {classData.id}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><UserCog className="w-3 h-3" /> GV: {teacher?.name || "Chưa phân công"}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {classData.room}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {classData.schedule}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button className="px-3 py-1.5 border rounded-md text-sm font-medium hover:bg-secondary transition-colors inline-flex items-center gap-2">
              <Edit3 className="w-4 h-4" /> Sửa lớp
            </button>
          )}
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-colors inline-flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Thêm học sinh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-card overflow-x-auto px-4 md:px-6">
        {[
          { id: "info", label: "Thông tin chung" },
          { id: "students", label: "Danh sách học sinh" },
          { id: "attendance", label: "Điểm danh" },
          { id: "grades", label: "Bảng điểm" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-secondary/10">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Teacher alerts */}
          {!isAdmin && (
            <div className="space-y-2">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-800">Sắp tới bài kiểm tra định kỳ</p>
                  <p className="text-xs text-amber-700">Lớp {classData.name} sẽ có bài kiểm tra Reading & Writing vào buổi học kế tiếp (24/03).</p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-blue-800">Sắp kết thúc khóa học</p>
                  <p className="text-xs text-blue-700">Khóa học còn 4 buổi nữa là kết thúc ({classData.endDate}). Vui lòng hoàn tất bảng điểm.</p>
                </div>
              </div>
            </div>
          )}

          {/* INFO TAB */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-card rounded-lg border p-6 space-y-4 shadow-sm">
                  <h3 className="font-bold">Thông tin khóa học</h3>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div className="text-muted-foreground">Khóa học:</div>
                    <div className="font-medium">{classData.course}</div>
                    <div className="text-muted-foreground">Trạng thái:</div>
                    <div>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">
                        {classData.status}
                      </span>
                    </div>
                    <div className="text-muted-foreground">Ngày bắt đầu:</div>
                    <div className="font-medium">{classData.startDate}</div>
                    <div className="text-muted-foreground">Ngày kết thúc:</div>
                    <div className="font-medium">{classData.endDate}</div>
                  </div>
                </div>
                <div className="bg-card rounded-lg border p-6 space-y-4 shadow-sm">
                  <h3 className="font-bold">Ghi chú lớp học</h3>
                  <div className="bg-secondary/20 p-4 rounded-md border border-dashed text-sm text-muted-foreground min-h-[80px]">
                    Lớp đang học đến bài 5 giáo trình Foundation. Cần chú trọng kỹ năng Writing cho học sinh yếu.
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-card rounded-lg border p-6 shadow-sm">
                  <h3 className="font-bold text-sm mb-4">Thống kê nhanh</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-md">
                      <div className="text-xs text-muted-foreground uppercase font-bold">Sĩ số</div>
                      <div className="text-xl font-black text-primary">{classData.studentCount}/{classData.maxStudents}</div>
                    </div>
                    <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-md">
                      <div className="text-xs text-muted-foreground uppercase font-bold">Điểm danh TB</div>
                      <div className="text-xl font-black text-blue-600">92%</div>
                    </div>
                    <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-md">
                      <div className="text-xs text-muted-foreground uppercase font-bold">Điểm TB lớp</div>
                      <div className="text-xl font-black text-amber-600">7.2</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === "students" && (
            <div className="bg-card rounded-lg border shadow-sm">
              <div className="p-4 border-b flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" placeholder="Tìm học sinh..." className="w-full pl-9 pr-4 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">Tổng cộng: {classStudents.length} học sinh</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b">
                      <th className="text-left px-4 py-3 font-medium">Học sinh</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email / SĐT</th>
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Ngày nhập học</th>
                      <th className="text-right px-4 py-3 font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classStudents.map(student => (
                      <tr key={student.id} className="hover:bg-secondary/20">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                              {student.avatar}
                            </div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <p className="text-xs">{student.email}</p>
                          <p className="text-[10px] text-muted-foreground">{student.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{student.enrollDate}</td>
                        <td className="px-4 py-3 text-right">
                          <button className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded transition-colors text-muted-foreground">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {classStudents.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Chưa có học sinh trong lớp này.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {activeTab === "attendance" && (
            <div className="bg-card rounded-lg border shadow-sm space-y-4 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Chọn ngày:</span>
                  <input 
                    type="date" 
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button 
                  onClick={saveAttendance}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90"
                >
                  <Save className="w-4 h-4" /> Lưu điểm danh
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b">
                      <th className="text-left px-4 py-3">Học sinh</th>
                      <th className="text-center px-4 py-3">Trạng thái</th>
                      <th className="text-left px-4 py-3">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classStudents.map(student => (
                      <tr key={student.id} className="hover:bg-secondary/20">
                        <td className="px-4 py-3 font-medium">{student.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            <button 
                              onClick={() => handleAttendanceChange(student.id, "present")}
                              className={`p-1.5 rounded transition-all ${getAttendanceStatus(student.id) === "present" ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground hover:bg-green-100 hover:text-green-600"}`}
                              title="Có mặt"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAttendanceChange(student.id, "absent")}
                              className={`p-1.5 rounded transition-all ${getAttendanceStatus(student.id) === "absent" ? "bg-red-500 text-white" : "bg-secondary text-muted-foreground hover:bg-red-100 hover:text-red-600"}`}
                              title="Vắng mặt"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleAttendanceChange(student.id, "late")}
                              className={`p-1.5 rounded transition-all ${getAttendanceStatus(student.id) === "late" ? "bg-orange-400 text-white" : "bg-secondary text-muted-foreground hover:bg-orange-100 hover:text-orange-600"}`}
                              title="Muộn"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <input type="text" placeholder="..." className="w-full bg-transparent border-b border-transparent focus:border-primary text-xs focus:outline-none" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GRADES TAB */}
          {activeTab === "grades" && (
            <div className="bg-card rounded-lg border shadow-sm space-y-4 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">Kỳ thi:</span>
                  <select className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                    <option>Placement Test</option>
                    <option>Mid-term B1</option>
                    <option>Final Exam B1</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center justify-center gap-2 px-3 py-1.5 border rounded-md text-sm font-medium hover:bg-secondary">
                    <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
                  </button>
                  <button 
                    onClick={() => toast.success("Đã lưu bảng điểm!")}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90"
                  >
                    <Save className="w-4 h-4" /> Lưu bảng điểm
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-secondary/50 border-b">
                      <th className="text-left px-4 py-3">Học sinh</th>
                      <th className="text-center px-4 py-3">Listening</th>
                      <th className="text-center px-4 py-3">Reading</th>
                      <th className="text-center px-4 py-3">Writing</th>
                      <th className="text-center px-4 py-3">Speaking</th>
                      <th className="text-center px-4 py-3 bg-primary/5 font-bold">Overall</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {classStudents.map(student => {
                      const g = getGrade(student.id);
                      const overall = ((parseFloat(g.listening) + parseFloat(g.reading) + parseFloat(g.writing) + parseFloat(g.speaking)) / 4).toFixed(1);
                      return (
                        <tr key={student.id} className="hover:bg-secondary/20">
                          <td className="px-4 py-3 font-medium whitespace-nowrap">{student.name}</td>
                          {[g.listening, g.reading, g.writing, g.speaking].map((score, i) => (
                            <td key={i} className="px-4 py-3 text-center">
                              <input type="number" defaultValue={score} step="0.5" min="0" max="9" className="w-12 text-center bg-transparent focus:bg-white border focus:border-primary rounded p-1 text-sm" />
                            </td>
                          ))}
                          <td className="px-4 py-3 text-center font-bold bg-primary/5 text-primary">{overall}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-[10px] text-muted-foreground italic">* Điểm Overall được tính dựa trên trung bình các kỹ năng thành phần.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassDetailPage;
