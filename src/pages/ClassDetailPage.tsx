import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { classes, students, teachers, attendanceRecords } from "@/data/mockData";
import { 
  ChevronLeft, Calendar, MapPin, CheckCircle, 
  XCircle, Clock, Save, UserPlus,
  Trash2, Search, UserCog, AlertCircle, FileSpreadsheet
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
  const [activeTab, setActiveTab] = useState<"info" | "students" | "attendance" | "grades">("info");
  const todayRaw = new Date().toISOString().split('T')[0];
  const [attendanceDate, setAttendanceDate] = useState(todayRaw);
  const [localAttendance, setLocalAttendance] = useState<Record<string, "present" | "absent" | "late">>({});

  try {
    const classData = classes.find((c) => c.id === id);
    
    if (!classData) {
      return (
        <div className="p-10 text-center bg-background h-full">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <p className="text-xl font-bold">Lớp học "{id}" không tồn tại</p>
          <button onClick={() => navigate("/classes")} className="mt-4 text-primary hover:underline text-sm font-medium">
            ← Quay lại danh sách lớp
          </button>
        </div>
      );
    }

    const classStudents = students.filter((s) => s.classIds && s.classIds.includes(classData.id));
    const teacher = teachers.find((t) => t.id === classData.teacherId);

    const getAttendanceStatus = (studentId: string): "present" | "absent" | "late" => {
      if (localAttendance[studentId]) return localAttendance[studentId];
      const record = attendanceRecords.find(r => r.studentId === studentId && r.date === attendanceDate && r.classId === id);
      return record?.status || "present";
    };

    const getGrade = (studentId: string) => {
      return MOCK_GRADES[studentId] || { listening: "7.0", reading: "7.0", writing: "7.0", speaking: "7.0" };
    };

    return (
      <div className="flex flex-col h-full bg-background">
        {/* Header */}
        <div className="bg-card border-b p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-secondary rounded-full transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-black">{classData.name}</h1>
                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold border border-primary/20 tracking-tighter">{classData.id}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium">
                 <span className="flex items-center gap-1"><UserCog className="w-3.5 h-3.5" /> GV: {teacher?.name || "Chưa phân công"}</span>
                 <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {classData.room}</span>
                 <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {classData.schedule}</span>
              </div>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 inline-flex items-center gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" /> Thêm học sinh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-card overflow-x-auto px-4 md:px-6 no-scrollbar">
          {[
            { id: "info", label: "Thông tin" },
            { id: "students", label: "Học sinh" },
            { id: "attendance", label: "Điểm danh" },
            { id: "grades", label: "Bảng điểm" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-sm font-bold border-b-4 transition-all whitespace-nowrap ${
                activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-slate-50/50">
           <div className="max-w-5xl mx-auto space-y-6">
              
              {!isAdmin && (
                <div className="space-y-2">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Sắp tới bài kiểm tra định kỳ</p>
                      <p className="text-xs text-amber-700 mt-1">Lớp {classData.name} sẽ có bài kiểm tra Reading & Writing vào buổi học kế tiếp. Vui lòng chuẩn bị tài liệu.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "info" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="md:col-span-2 space-y-6">
                      <div className="bg-card p-6 rounded-2xl border shadow-sm">
                         <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4">Chi tiết khóa học</h3>
                         <div className="grid grid-cols-2 gap-y-4 text-sm font-medium">
                            <span className="text-muted-foreground">Khóa học:</span><span>{classData.course}</span>
                            <span className="text-muted-foreground">Lịch học:</span><span>{classData.schedule}</span>
                            <span className="text-muted-foreground">Ngày bắt đầu:</span><span>{classData.startDate}</span>
                            <span className="text-muted-foreground">Dự kiến kết thúc:</span><span>{classData.endDate}</span>
                            <span className="text-muted-foreground">Trạng thái:</span>
                            <span>
                               <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-black rounded-full uppercase border border-success/20">
                                  {classData.status}
                               </span>
                            </span>
                         </div>
                      </div>
                      <div className="bg-card rounded-2xl border p-6 shadow-sm">
                        <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4">Ghi chú lớp học</h3>
                        <div className="bg-secondary/20 p-4 rounded-xl border border-dashed text-sm font-medium text-muted-foreground min-h-[80px]">
                          Lớp đang học đến bài 5 giáo trình Foundation. Cần chú trọng kỹ năng Writing cho học sinh kém.
                        </div>
                      </div>
                   </div>
                   <div className="bg-card p-6 rounded-2xl border shadow-sm h-fit space-y-6">
                      <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground">Thống kê lớp</h3>
                      <div className="bg-secondary/30 p-4 rounded-xl text-center">
                         <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Sĩ số hiện tại</p>
                         <p className="text-4xl font-black text-primary">{classStudents.length}<span className="text-xl text-muted-foreground font-medium">/{classData.maxStudents}</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-secondary/30 p-4 rounded-xl text-center">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Điểm danh</p>
                            <p className="text-2xl font-black text-blue-600">94%</p>
                         </div>
                         <div className="bg-secondary/30 p-4 rounded-xl text-center">
                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Điểm TB</p>
                            <p className="text-2xl font-black text-amber-500">7.2</p>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {activeTab === "students" && (
                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                   <div className="p-4 border-b flex justify-between items-center gap-4">
                      <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input type="text" placeholder="Tìm học sinh..." className="w-full pl-9 pr-4 py-2 bg-secondary/30 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">{classStudents.length} học viên</span>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                         <thead className="bg-secondary/10 text-muted-foreground font-black uppercase text-[10px]">
                            <tr>
                               <th className="px-6 py-3 text-left w-1/3">Học viên</th>
                               <th className="px-6 py-3 text-left w-1/3">Liên hệ</th>
                               <th className="px-6 py-3 text-left w-1/4">Ngày nhập học</th>
                               <th className="px-6 py-3 text-right">Thao tác</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y">
                            {classStudents.map(s => (
                              <tr key={s.id} className="hover:bg-primary/5 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-xs border border-primary/20">
                                         {s.avatar}
                                       </div>
                                       <span className="font-bold">{s.name}</span>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <p className="font-medium text-xs text-foreground/80">{s.email}</p>
                                    <p className="text-[10px] text-muted-foreground">{s.phone}</p>
                                 </td>
                                 <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                                    {s.enrollDate}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors text-muted-foreground opacity-0 group-hover:opacity-100">
                                       <Trash2 className="w-4 h-4" />
                                    </button>
                                 </td>
                              </tr>
                            ))}
                            {classStudents.length === 0 && (
                              <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-medium">Lớp chưa có học viên nào.</td></tr>
                            )}
                         </tbody>
                      </table>
                   </div>
                </div>
              )}

              {activeTab === "attendance" && (
                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-4 bg-secondary/10 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">Ngày điểm danh:</span>
                      <input 
                        type="date" 
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="border bg-card rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <button 
                      onClick={() => toast.success("Đã ghi nhận điểm danh ngày " + attendanceDate)}
                      className="flex items-center justify-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Save className="w-4 h-4" /> Lưu dữ liệu
                    </button>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm">
                      <tbody className="divide-y">
                        {classStudents.map(student => {
                          const status = getAttendanceStatus(student.id);
                          return (
                            <tr key={student.id} className="hover:bg-secondary/20 group">
                              <td className="py-3 px-2 font-bold w-1/3">{student.name}</td>
                              <td className="py-3 px-2 w-1/3">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => handleAttendanceChange(student.id, "present")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${status === "present" ? "bg-success text-white shadow-sm" : "bg-success/10 text-success hover:bg-success hover:text-white"}`}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" /> Có mặt
                                  </button>
                                  <button 
                                    onClick={() => handleAttendanceChange(student.id, "absent")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${status === "absent" ? "bg-destructive text-white shadow-sm" : "bg-destructive/10 text-destructive hover:bg-destructive hover:text-white"}`}
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Vắng
                                  </button>
                                  <button 
                                    onClick={() => handleAttendanceChange(student.id, "late")}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${status === "late" ? "bg-amber-500 text-white shadow-sm" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500 hover:text-white"}`}
                                  >
                                    <Clock className="w-3.5 h-3.5" /> Muộn
                                  </button>
                                </div>
                              </td>
                              <td className="py-3 px-2 w-1/3 text-right">
                                <input type="text" placeholder="Thêm ghi chú..." className="w-full bg-secondary/30 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "grades" && (
                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                  <div className="p-4 bg-secondary/10 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold">Kỳ thi:</span>
                      <select className="border bg-card rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                        <option>Placement Test (Đầu vào)</option>
                        <option>Mid-term B1 (Giữa kỳ)</option>
                        <option>Final Exam B1 (Cuối kỳ)</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground text-xs rounded-xl font-bold hover:bg-secondary/80 transition-all">
                        Xuất Excel
                      </button>
                      <button 
                        onClick={() => toast.success("Đã lưu bảng điểm!")}
                        className="flex items-center justify-center gap-2 px-5 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                      >
                        <Save className="w-4 h-4" /> Lưu bảng điểm
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/5 border-b font-black text-[10px] uppercase text-muted-foreground tracking-widest">
                        <tr>
                          <th className="text-left px-6 py-4">Học sinh</th>
                          <th className="text-center px-4 py-4 w-24">Listening</th>
                          <th className="text-center px-4 py-4 w-24">Reading</th>
                          <th className="text-center px-4 py-4 w-24">Writing</th>
                          <th className="text-center px-4 py-4 w-24">Speaking</th>
                          <th className="text-center px-6 py-4 bg-primary/5 text-primary w-28">Overall</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {classStudents.map(student => {
                          const g = getGrade(student.id);
                          const overall = ((parseFloat(g.listening) + parseFloat(g.reading) + parseFloat(g.writing) + parseFloat(g.speaking)) / 4).toFixed(1);
                          return (
                            <tr key={student.id} className="hover:bg-primary/5 transition-colors group">
                              <td className="px-6 py-4 font-bold">{student.name}</td>
                              {[g.listening, g.reading, g.writing, g.speaking].map((score, i) => (
                                <td key={i} className="px-4 py-4 text-center">
                                  <input type="number" defaultValue={score} step="0.5" min="0" max="9" className="w-14 mx-auto text-center bg-secondary/30 font-medium focus:bg-white border border-transparent focus:border-primary rounded-lg p-1.5 text-sm transition-all outline-none" />
                                </td>
                              ))}
                              <td className="px-6 py-4 text-center font-black bg-primary/5 text-primary text-base">
                                {overall}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-4 bg-secondary/5 text-[10px] text-muted-foreground font-medium uppercase tracking-widest text-center border-t">
                    Điểm Overall được tính trung bình tự động từ các kỹ năng
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="p-20 text-center bg-red-50 h-full">
        <h2 className="text-3xl font-black text-red-600 mb-4">CRASH DETECTED</h2>
        <p className="text-red-500 font-bold mb-8">{err.message}</p>
        <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg">RELOAD PAGE</button>
      </div>
    );
  }
};

export default ClassDetailPage;
