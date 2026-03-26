import { useParams, useNavigate } from "react-router-dom";
import { students, classes, attendanceRecords, mockTuitions } from "@/data/mockData";
import { ArrowLeft, BookOpen, CalendarCheck, DollarSign, MessageSquare, User, BellRing, Receipt, CheckCircle2, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + "đ";

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === id);
  const [activeTab, setActiveTab] = useState("info");

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Không tìm thấy học sinh.</p>
        <button onClick={() => navigate("/students")} className="mt-2 text-primary text-sm hover:underline">← Quay lại</button>
      </div>
    );
  }

  const studentClasses = student.classIds.map((cid) => classes.find((c) => c.id === cid)).filter(Boolean);

  const tabs = [
    { key: "info", label: "Thông tin chung" },
    { key: "history", label: "Lịch sử học" },
    { key: "attendance", label: "Điểm danh" },
    { key: "exams", label: "Kết quả thi" },
    { key: "tuition", label: "Học phí" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Breadcrumb */}
      <div className="odoo-breadcrumb">
        <button onClick={() => navigate("/students")} className="flex items-center gap-1 text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" /> Học sinh
        </button>
        <span>/</span>
        <span className="text-foreground font-medium">{student.name}</span>
      </div>

      {/* Header: Avatar + Name + Smart Buttons */}
      <div className="bg-card rounded-lg border">
        <div className="p-5 flex flex-col md:flex-row md:items-start gap-5">
          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xl font-bold flex-shrink-0">
              {student.avatar}
            </div>
            <div>
              <h1 className="text-xl font-bold">{student.name}</h1>
              <p className="text-sm text-muted-foreground">{student.id} • {student.level}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                student.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
              }`}>
                {student.status === "active" ? "Đang học" : student.status === "inactive" ? "Tạm nghỉ" : "Tốt nghiệp"}
              </span>
            </div>
          </div>

          {/* Smart Buttons */}
          <div className="flex flex-wrap gap-2">
            <div className="smart-button">
              <span className="smart-button-value">{student.classIds.length}</span>
              <span className="smart-button-label flex items-center gap-1"><BookOpen className="w-3 h-3" /> Lớp học</span>
            </div>
            <div className="smart-button">
              <span className="smart-button-value">{student.attendanceCount}</span>
              <span className="smart-button-label flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> Điểm danh</span>
            </div>
            <div className="smart-button">
              <span className="smart-button-value">{formatVND(student.paidFee)}</span>
              <span className="smart-button-label flex items-center gap-1"><DollarSign className="w-3 h-3" /> Đã thanh toán</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t px-5">
          <div className="flex gap-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === "info" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                ["Họ tên", student.name],
                ["Email", student.email],
                ["Điện thoại", student.phone],
                ["Ngày sinh", student.dob],
                ["Trình độ", student.level],
                ["Ngày ghi danh", student.enrollDate],
                ["Phụ huynh", student.parentName],
                ["SĐT phụ huynh", student.parentPhone],
                ["Tổng học phí", formatVND(student.totalFee)],
                ["Đã thanh toán", formatVND(student.paidFee)],
                ["Còn nợ", formatVND(student.totalFee - student.paidFee)],
              ].map(([label, value]) => (
                <div key={label} className="flex">
                  <span className="w-36 text-muted-foreground flex-shrink-0">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              <div className="md:col-span-2 mt-2">
                <p className="text-muted-foreground mb-1">Lớp đang học:</p>
                <div className="flex flex-wrap gap-2">
                  {studentClasses.map((cls) => cls && (
                    <span key={cls.id} className="text-xs px-2 py-1 bg-secondary rounded-md">{cls.name} ({cls.schedule})</span>
                  ))}
                  {studentClasses.length === 0 && <span className="text-muted-foreground text-xs">Chưa có lớp</span>}
                </div>
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-3">
              {studentClasses.map((cls) => cls && (
                <div key={cls.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-md">
                  <div>
                    <p className="font-medium text-sm">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">{cls.course} • {cls.startDate} → {cls.endDate}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-success/10 text-success rounded-full">{cls.status}</span>
                </div>
              ))}
              {studentClasses.length === 0 && <p className="text-sm text-muted-foreground">Chưa có lịch sử học.</p>}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Lớp học</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Ngày</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Trạng thái</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {attendanceRecords
                    .filter((r) => r.studentId === student.id)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((r) => {
                      const cls = classes.find((c) => c.id === r.classId);
                      return (
                        <tr key={r.id}>
                          <td className="py-2">{cls?.name || r.classId}</td>
                          <td className="py-2 text-muted-foreground">{r.date}</td>
                          <td className="py-2 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              r.status === "present" ? "bg-success/10 text-success" : 
                              r.status === "absent" ? "bg-destructive/10 text-destructive" : 
                              "bg-kpi-orange/10 text-kpi-orange"
                            }`}>
                              {r.status === "present" ? "Có mặt" : r.status === "absent" ? "Vắng" : "Muộn"}
                            </span>
                          </td>
                          <td className="py-2 text-xs text-muted-foreground italic">{r.note || "-"}</td>
                        </tr>
                      );
                    })}
                  {attendanceRecords.filter((r) => r.studentId === student.id).length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">Chưa có dữ liệu điểm danh.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "exams" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium text-muted-foreground">Bài thi</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Kỹ năng</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Ngày</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Điểm</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {student.examResults.map((ex, i) => (
                    <tr key={i}>
                      <td className="py-2">{ex.exam}</td>
                      <td className="py-2 text-muted-foreground">{ex.skill}</td>
                      <td className="py-2 text-muted-foreground">{ex.date}</td>
                      <td className="py-2 text-right font-bold">{ex.score}</td>
                    </tr>
                  ))}
                  {student.examResults.length === 0 && (
                    <tr><td colSpan={4} className="py-4 text-center text-muted-foreground">Chưa có kết quả thi.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "tuition" && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-secondary/30 rounded-xl border border-dashed flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Tổng học phí</p>
                    <p className="text-sm font-bold">{formatVND(student.totalFee)}</p>
                  </div>
                </div>
                <div className="p-4 bg-success/5 rounded-xl border border-success/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Đã thanh toán</p>
                    <p className="text-sm font-bold text-success">{formatVND(student.paidFee)}</p>
                  </div>
                </div>
                <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase">Còn nợ (Công nợ)</p>
                    <p className="text-sm font-bold text-destructive">{formatVND(student.totalFee - student.paidFee)}</p>
                  </div>
                </div>
              </div>

              {/* History Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-muted-foreground text-[10px] uppercase font-black">
                      <th className="text-left py-3 px-2">Khoản thu (Tháng)</th>
                      <th className="text-center py-3">Hạn thanh toán</th>
                      <th className="text-right py-3">Số tiền</th>
                      <th className="text-center py-3">Trạng thái</th>
                      <th className="text-right py-3 px-2">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockTuitions.filter(t => t.studentId === student.id).map(t => (
                      <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="py-4 px-2 font-bold">{t.month}</td>
                        <td className="py-4 text-center text-muted-foreground">{t.dueDate}</td>
                        <td className="py-4 text-right font-mono font-bold">{formatVND(t.amount)}</td>
                        <td className="py-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            t.status === "paid" ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"
                          }`}>
                            {t.status === "paid" ? "Đã đóng" : "Chưa đóng"}
                          </span>
                        </td>
                        <td className="py-4 text-right px-2">
                          {t.status === "unpaid" && (
                            <button 
                              onClick={() => toast.success(`Đã gửi yêu cầu nhắc thanh toán đến phụ huynh ${student.parentName}`)}
                              className="flex items-center gap-1.5 ml-auto px-3 py-1.5 bg-primary text-white text-[10px] font-black uppercase rounded-lg hover:opacity-90 shadow-sm shadow-primary/20 active:scale-95 transition-all"
                            >
                              <BellRing className="w-3.5 h-3.5" /> Nhắc thanh toán
                            </button>
                          )}
                          {t.status === "paid" && (
                            <span className="text-[10px] text-muted-foreground font-medium italic">Ngày đóng: {t.paymentDate}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chatter / Log Notes */}
      <div className="chatter-block">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Ghi chú nội bộ</h3>
        </div>
        <div className="space-y-3">
          {student.notes.map((note, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{note.author}</span>
                  <span className="text-xs text-muted-foreground">{note.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{note.content}</p>
              </div>
            </div>
          ))}
          {student.notes.length === 0 && <p className="text-sm text-muted-foreground">Chưa có ghi chú.</p>}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            placeholder="Thêm ghi chú..."
            className="flex-1 px-3 py-2 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
