import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teachers, classes, teacherSchedule, timekeepingRecords } from "@/data/mockData";
import { 
  ChevronLeft, ChevronRight, Mail, Phone, BookOpen, Star, Clock, 
  Calendar as CalendarIcon, MapPin, Info, ArrowRight, Fingerprint, CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

const TeacherDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");

  const teacher = teachers.find((t) => t.id === id);
  const teacherClasses = classes.filter((c) => c.teacherId === id);
  const teacherTimekeeping = timekeepingRecords.filter((r) => r.teacherId === id);
  const schedule = teacherSchedule.filter((s) => {
    // For demo, if it's a class, check classId teacher
    if (s.classId) {
      const cls = classes.find(c => c.id === s.classId);
      return cls?.teacherId === id;
    }
    // For meetings, check title if it contains teacher name (mock logic)
    return s.title.includes(teacher?.name || "none");
  });

  if (!teacher) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy giáo viên</h2>
        <button onClick={() => navigate("/teachers")} className="mt-4 text-primary hover:underline">Quay lại danh sách</button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button 
        onClick={() => navigate("/teachers")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Quay lại danh sách giáo viên
      </button>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Profile Card */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-card rounded-2xl border p-6 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-primary/20 to-primary/5" />
            <div className="relative pt-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-black mx-auto border-4 border-card shadow-lg ring-4 ring-primary/5">
                {teacher.avatar}
              </div>
              <h1 className="text-xl font-black mt-4">{teacher.name}</h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{teacher.specialty}</p>
              
              <div className="flex items-center justify-center gap-1 mt-3">
                <Star className="w-4 h-4 fill-kpi-orange text-kpi-orange" />
                <span className="font-bold text-sm">{teacher.avgRating} / 5.0</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <div className="bg-secondary/40 p-3 rounded-xl border border-black/5">
                <p className="text-[10px] uppercase font-black text-muted-foreground">Giờ dạy</p>
                <p className="text-lg font-black text-primary">{teacher.hoursThisMonth}h</p>
              </div>
              <div className="bg-secondary/40 p-3 rounded-xl border border-black/5">
                <p className="text-[10px] uppercase font-black text-muted-foreground">Lớp học</p>
                <p className="text-lg font-black text-primary">{teacher.totalClasses}</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3 pt-6 border-t font-medium text-sm text-left">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <span>{teacher.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Content */}
        <div className="flex-1 space-y-6">
          <div className="flex border-b gap-6 overflow-x-auto no-scrollbar">
            {[
              { id: "info", label: "Thông tin chung", icon: Info },
              { id: "schedule", label: "Lịch dạy", icon: CalendarIcon },
              { id: "classes", label: "Lớp học phụ trách", icon: BookOpen },
              { id: "timekeeping", label: "Chấm công", icon: Fingerprint },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {activeTab === "info" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground">Về giảng viên</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Thâm niên</p>
                      <p className="text-sm font-medium mt-1">5 năm kinh nghiệm giảng dạy IELTS</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Bằng cấp</p>
                      <p className="text-sm font-medium mt-1">IELTS 8.5, Thạc sỹ Ngôn ngữ Anh</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Trạng thái</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded-full uppercase border border-success/20">
                        Đang hoạt động
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4">
                   <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground mb-4">Thông tin Hợp đồng</h3>
                   <div className="space-y-4">
                     <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Loại hợp đồng</p>
                       <p className="text-sm font-black text-primary mt-1">{teacher.contractInfo?.type || "Chưa cập nhật"}</p>
                     </div>
                     <div>
                       <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Lương cơ bản</p>
                       <p className="text-sm font-medium mt-1">
                         {teacher.contractInfo?.baseSalary 
                           ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(teacher.contractInfo.baseSalary)
                           : "Thoả thuận"} / tháng
                       </p>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Bắt đầu</p>
                         <p className="text-sm font-medium mt-1">{teacher.contractInfo?.startDate || "N/A"}</p>
                       </div>
                       <div>
                         <p className="text-xs font-bold text-muted-foreground uppercase opacity-70">Kết thúc</p>
                         <p className="text-sm font-medium mt-1">{teacher.contractInfo?.endDate || "Không xác định"}</p>
                       </div>
                     </div>
                   </div>
                </div>

                <div className="bg-card rounded-xl border p-6 shadow-sm space-y-4 md:col-span-2">
                   <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground">Ghi chú từ Admin</h3>
                   <p className="text-sm text-foreground leading-relaxed italic bg-secondary/20 p-4 rounded-lg border">
                     "Lê Hoàng Nam là giảng viên nòng cốt của khối IELTS. Có kỹ năng sư phạm rất tốt, đặc biệt ở kỹ năng Writing. Phản hồi từ học sinh luôn đạt trên 4.5/5.0."
                   </p>
                   <div className="pt-4 border-t mt-4">
                      <p className="text-[10px] font-bold uppercase text-muted-foreground">Cập nhật lần cuối</p>
                      <p className="text-xs font-medium">10/03/2025 bởi Admin</p>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "classes" && (
              <div className="grid grid-cols-1 gap-4">
                {teacherClasses.map(cls => (
                  <div key={cls.id} className="bg-card rounded-xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow group cursor-pointer" onClick={() => navigate(`/classes/${cls.id}`)}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-base">{cls.name}</h4>
                        <p className="text-xs text-muted-foreground">{cls.schedule} • {cls.room}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Sĩ số</p>
                        <p className="text-sm font-black">{cls.studentCount} / {cls.maxStudents}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Trạng thái</p>
                        <span className="text-[10px] font-bold text-success uppercase">Đang dạy</span>
                      </div>
                      <button className="p-2 hover:bg-primary/5 rounded-full text-muted-foreground group-hover:text-primary transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
                {teacherClasses.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground italic">Giáo viên chưa được phân công lớp học nào.</div>
                )}
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 bg-secondary/20 border-b flex items-center justify-between">
                  <h3 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Lịch tuần hiện tại</h3>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-background rounded border"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="p-1 hover:bg-background rounded border"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="divide-y">
                  {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"].map((day, i) => {
                    const date = `2025-03-${24 + i}`;
                    const dayEvents = schedule.filter(ev => ev.date === date);
                    return (
                      <div key={day} className="p-4 flex gap-6 items-start hover:bg-secondary/10 transition-colors">
                        <div className="w-16 text-center">
                          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">{day}</p>
                          <p className="text-lg font-black text-primary leading-tight">{24 + i}</p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {dayEvents.length > 0 ? dayEvents.map(ev => (
                            <div key={ev.id} className="bg-card border rounded-lg p-3 shadow-sm flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-1 h-8 rounded-full ${
                                  ev.type === 'class' ? 'bg-primary' : 
                                  ev.type === 'meeting' ? 'bg-amber-500' : 'bg-rose-500'
                                }`} />
                                <div>
                                  <p className="text-xs font-black">{ev.title}</p>
                                  <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                                    <span className="flex items-center gap-1 font-mono"><Clock className="w-3 h-3" /> {ev.startTime} - {ev.endTime}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {ev.room}</span>
                                  </div>
                                </div>
                              </div>
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                                ev.type === 'class' ? 'bg-primary/5 text-primary' : 
                                ev.type === 'meeting' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                              }`}>
                                {ev.type}
                              </span>
                            </div>
                          )) : (
                            <p className="text-xs text-muted-foreground italic mt-3">Không có lịch trình</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {activeTab === "timekeeping" && (
              <div className="bg-card rounded-xl border shadow-sm h-full overflow-hidden">
                 <div className="p-5 border-b flex justify-between items-center bg-secondary/10">
                    <h2 className="font-bold uppercase text-sm tracking-widest text-muted-foreground flex items-center gap-2">
                       <Fingerprint className="w-4 h-4" /> Báo cáo Chấm công & Kỷ luật
                    </h2>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                       <thead className="text-[10px] font-black uppercase text-muted-foreground bg-secondary/20">
                          <tr>
                             <th className="px-6 py-3 text-left">Ngày</th>
                             <th className="px-6 py-3 text-center">Vị trí</th>
                             <th className="px-6 py-3 text-center">Giờ Vào</th>
                             <th className="px-6 py-3 text-center">Giờ Ra</th>
                             <th className="px-6 py-3 text-right">Trạng thái</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y">
                          {teacherTimekeeping.map(record => (
                            <tr key={record.id} className="hover:bg-primary/5">
                               <td className="px-6 py-4 font-bold">{record.date}</td>
                               <td className="px-6 py-4 text-center font-bold text-xs">{record.location?.name || '--'}</td>
                               <td className="px-6 py-4 text-center font-mono text-primary font-bold">{record.checkInTime || "--:--"}</td>
                               <td className="px-6 py-4 text-center font-mono font-bold">{record.checkOutTime || "--:--"}</td>
                               <td className="px-6 py-4 text-right">
                                  {record.status === 'late' ? (
                                     <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 uppercase">Đi muộn</span>
                                  ) : record.status === 'missing-checkout' ? (
                                     <span className="text-[10px] font-black text-destructive bg-destructive/10 px-2.5 py-1 rounded border border-destructive/20 uppercase">Thiếu mộc ra</span>
                                  ) : (
                                     <span className="text-[10px] font-bold text-success bg-success/10 px-2.5 py-1 rounded border border-success/20 flex items-center justify-end gap-1 w-max ml-auto uppercase"><CheckCircle className="w-3 h-3"/> Đúng giờ</span>
                                  )}
                               </td>
                            </tr>
                          ))}
                          {teacherTimekeeping.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-muted-foreground italic">Giáo viên chưa có dữ liệu chấm công.</td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailPage;
