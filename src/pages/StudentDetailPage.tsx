import { useParams, useNavigate } from "react-router-dom";
import { students, classes } from "@/data/mockData";
import { ArrowLeft, BookOpen, CalendarCheck, DollarSign, MessageSquare, User } from "lucide-react";
import { useState } from "react";

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
    { key: "exams", label: "Kết quả thi" },
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
