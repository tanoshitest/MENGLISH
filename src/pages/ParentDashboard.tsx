import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { mockGrades, timekeepingRecords, students } from "@/data/mockData";
import { 
  GraduationCap, BookOpen, Clock, MessageCircle, 
  UploadCloud, CheckCircle, AlertCircle, Calendar, Send
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ParentDashboard = () => {
  const { isParent } = useRole();
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // For demo, pick the first student as the child
  const child = students[0]; 

  if (!isParent) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-destructive">Không có quyền truy cập</h2>
        <p className="text-muted-foreground mt-2">Tính năng này dành riêng cho Phụ huynh.</p>
      </div>
    );
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    toast.success("Đã gửi tin nhắn thành công tới Trung tâm!");
    setMessage("");
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success("Tải bài tập lên thành công!");
    }, 1500);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-primary flex items-center gap-2">
          <GraduationCap className="w-8 h-8" /> Góc Phụ Huynh
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Theo dõi quá trình học tập của con bạn một cách dễ dàng nhất.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Widget 1: Thông tin học sinh */}
        <div className="md:col-span-1 bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
          <h2 className="font-black text-sm uppercase tracking-widest opacity-80 mb-4">Thông tin Học viên</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black shadow-inner border border-white/30 text-white">
              {child.avatar}
            </div>
            <div>
              <p className="text-xl font-black">{child.name}</p>
              <p className="text-sm opacity-90">{child.id}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm font-medium">
            <div className="flex justify-between items-center bg-black/10 px-3 py-2 rounded-lg">
              <span className="opacity-80">Lớp hiện tại</span>
              <span className="font-bold">{child.level}</span>
            </div>
            <div className="flex justify-between items-center bg-black/10 px-3 py-2 rounded-lg">
              <span className="opacity-80">Giáo viên CN</span>
              <span className="font-bold">Cô Sarah</span>
            </div>
            <div className="flex justify-between items-center bg-black/10 px-3 py-2 rounded-lg">
              <span className="opacity-80">Tình trạng học phí</span>
              <span className="font-bold text-success-foreground bg-success/20 px-2 py-0.5 rounded text-[10px] uppercase">Đã nộp đủ</span>
            </div>
          </div>
        </div>

        {/* Cột giữa & Phải */}
        <div className="md:col-span-2 space-y-6">
          {/* Widget 2: Điểm số & Điểm danh */}
          <div className="bg-card rounded-3xl p-6 border shadow-sm">
            <h2 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4" /> Kết quả Học tập
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/30 text-[10px] font-black uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 text-left rounded-l-lg">Môn học / Kỹ năng</th>
                    <th className="px-4 py-2 text-center">Giữa kỳ</th>
                    <th className="px-4 py-2 text-center">Cuối kỳ</th>
                    <th className="px-4 py-2 text-left rounded-r-lg">Nhận xét của GV</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {mockGrades.map((grade, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-bold">{grade.subject}</td>
                      <td className="px-4 py-3 text-center font-black text-primary">{grade.midterm}</td>
                      <td className="px-4 py-3 text-center font-black text-primary">{grade.final}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground italic">{grade.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Điểm danh 3 buổi gần nhất
              </h3>
              <div className="flex gap-3">
                {[
                  { date: "24/03", status: "ok" },
                  { date: "22/03", status: "ok" },
                  { date: "20/03", status: "late" }
                ].map((att, i) => (
                  <div key={i} className="flex-1 bg-secondary/20 p-3 rounded-xl border flex flex-col items-center justify-center gap-1">
                    <span className="text-xs font-bold text-muted-foreground">{att.date}</span>
                    {att.status === "ok" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Widget 3: Nộp bài tập */}
            <div className="bg-card rounded-3xl p-6 border shadow-sm">
              <h2 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
                <UploadCloud className="w-4 h-4" /> Nộp bài tập
              </h2>
              <div 
                onClick={handleUpload}
                className="border-2 border-dashed border-primary/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all group min-h-[160px]"
              >
                {isUploading ? (
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Bấm để tải Ảnh/Video bài làm</p>
                      <p className="text-xs text-muted-foreground mt-1">Hoặc kéo thả file vào đây</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Widget 4: Gửi tin nhắn */}
            <div className="bg-card rounded-3xl p-6 border shadow-sm flex flex-col">
              <h2 className="font-black text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2 mb-4">
                <MessageCircle className="w-4 h-4" /> Trao đổi với Trung tâm
              </h2>
              <form onSubmit={handleSendMessage} className="flex-1 flex flex-col gap-3">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Thầy cô cho mẹ cháu hỏi..."
                  className="flex-1 w-full bg-secondary/30 border border-border/50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-full py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" /> Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
