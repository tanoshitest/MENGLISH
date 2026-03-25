import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { mockGrades, timekeepingRecords, students, mockHomeworks } from "@/data/mockData";
import { 
  GraduationCap, BookOpen, Clock, MessageCircle, 
  UploadCloud, CheckCircle, AlertCircle, Send, CheckSquare, FileText
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ParentDashboard = () => {
  const { isParent } = useRole();
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Pick the first student as the child
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <GraduationCap className="w-7 h-7" /> Cổng Thông Tin Phụ Huynh
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Theo dõi quá trình học tập của học viên: <strong className="text-foreground">{child.name}</strong></p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/30 px-4 py-2 rounded-md border">
          <div className="w-10 h-10 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
            {child.avatar}
          </div>
          <div>
            <p className="font-semibold text-sm">{child.name}</p>
            <p className="text-xs text-muted-foreground">{child.id} • Lớp: {child.level}</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full lg:w-[600px] grid-cols-4 rounded-md">
          <TabsTrigger value="info" className="rounded-sm">Thông tin</TabsTrigger>
          <TabsTrigger value="grades" className="rounded-sm">Điểm & Chuyên cần</TabsTrigger>
          <TabsTrigger value="homework" className="rounded-sm">Bài tập</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-sm">Liên hệ</TabsTrigger>
        </TabsList>

        {/* Tab 1: Thông tin học viên */}
        <TabsContent value="info" className="mt-6">
          <div className="bg-card border rounded-md shadow-sm p-6">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-6 border-b pb-2">
              <GraduationCap className="w-5 h-5 text-primary" /> Thông tin tổng quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Họ và tên học viên</p>
                <p className="font-medium text-base">{child.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Mã học viên (ID)</p>
                <p className="font-medium text-base">{child.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Lớp / Cấp độ hiện tại</p>
                <p className="font-medium text-base">{child.level}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Giáo viên chủ nhiệm</p>
                <p className="font-medium text-base">Cô Sarah</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Ngày sinh</p>
                <p className="font-medium text-base">{child.dob}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Trạng thái học phí</p>
                <span className="inline-block px-2 py-1 bg-success/20 text-success-foreground text-xs font-bold uppercase rounded-sm border border-success/30">
                  Đã hoàn thành
                </span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Điểm số & Chuyên cần */}
        <TabsContent value="grades" className="mt-6 space-y-6">
          <div className="bg-card border rounded-md shadow-sm p-6">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 border-b pb-2">
              <BookOpen className="w-5 h-5 text-primary" /> Kết quả học tập
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-secondary/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left border">Môn học / Kỹ năng</th>
                    <th className="px-4 py-3 text-center border w-24">Giữa kỳ</th>
                    <th className="px-4 py-3 text-center border w-24">Cuối kỳ</th>
                    <th className="px-4 py-3 text-left border">Nhận xét của Giáo viên</th>
                  </tr>
                </thead>
                <tbody>
                  {mockGrades.map((grade, idx) => (
                    <tr key={idx} className="hover:bg-secondary/20">
                      <td className="px-4 py-3 border font-medium">{grade.subject}</td>
                      <td className="px-4 py-3 border text-center font-bold text-primary">{grade.midterm}</td>
                      <td className="px-4 py-3 border text-center font-bold text-primary">{grade.final}</td>
                      <td className="px-4 py-3 border text-muted-foreground">{grade.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card border rounded-md shadow-sm p-6">
            <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 border-b pb-2">
              <Clock className="w-5 h-5 text-primary" /> Điểm danh 3 buổi gần nhất
            </h2>
            <div className="flex flex-wrap gap-4">
              {[
                { date: "24/03/2026", status: "ok", label: "Có mặt" },
                { date: "22/03/2026", status: "ok", label: "Có mặt" },
                { date: "20/03/2026", status: "late", label: "Đi muộn" }
              ].map((att, i) => (
                <div key={i} className="flex-1 min-w-[150px] bg-background border p-4 rounded-md flex items-center gap-4 shadow-sm">
                  {att.status === "ok" ? (
                    <CheckCircle className="w-8 h-8 text-success" />
                  ) : (
                    <AlertCircle className="w-8 h-8 text-amber-500" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">{att.date}</p>
                    <p className={`font-semibold text-sm ${att.status === 'ok' ? 'text-success' : 'text-amber-600'}`}>
                      {att.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Bài tập (Homework) */}
        <TabsContent value="homework" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Danh sách bài tập */}
            <div className="lg:col-span-2 bg-card border rounded-md shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-secondary/10 flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-primary" /> Danh sách bài tập từ đầu khóa
                </h2>
              </div>
              <div className="divide-y divide-border flex-1 overflow-auto max-h-[500px]">
                {mockHomeworks.map((hw) => (
                  <div key={hw.id} className="p-4 hover:bg-secondary/10 transition-colors flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{hw.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">Hạn nộp: {hw.dueDate}</p>
                        {hw.comments && (
                          <p className="text-xs text-primary mt-2 bg-primary/5 p-2 rounded-sm border inline-block">
                            <strong className="font-semibold">GV Nhận xét:</strong> {hw.comments}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {hw.status === 'submitted' ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-success bg-success/10 px-2 py-1 flex-row-reverse border border-success/30">
                          Đã nộp bài <CheckCircle className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-destructive bg-destructive/10 px-2 py-1 flex-row-reverse border border-destructive/30">
                          Chưa nộp bài <AlertCircle className="w-3.5 h-3.5" />
                        </div>
                      )}
                      
                      {hw.score !== undefined && (
                        <span className="text-sm font-bold border-b-2 border-primary">
                          Điểm: {hw.score}/10
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Khung Nộp bài tập mới */}
            <div className="bg-card border rounded-md shadow-sm p-6 h-fit">
              <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
                <UploadCloud className="w-5 h-5 text-primary" /> Nộp bài tập mới
              </h2>
              <p className="text-sm text-muted-foreground mb-4">Tải lên hình ảnh hoặc video bài làm của học viên.</p>
              
              <div 
                onClick={handleUpload}
                className="border-2 border-dashed border-primary/40 rounded-md p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-primary/5 hover:border-primary transition-all bg-secondary/5 min-h-[200px]"
              >
                {isUploading ? (
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Nhấn để chọn tệp</p>
                      <p className="text-xs text-muted-foreground mt-1">Hỗ trợ .jpg, .png, .mp4, .pdf</p>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </TabsContent>

        {/* Tab 4: Trao đổi / Mbox */}
        <TabsContent value="contact" className="mt-6">
          <div className="bg-card border rounded-md shadow-sm p-0 overflow-hidden flex flex-col md:flex-row min-h-[400px]">
            <div className="md:w-1/3 bg-secondary/30 p-6 border-r flex flex-col justify-center">
              <MessageCircle className="w-12 h-12 text-primary mb-4" />
              <h2 className="font-semibold text-lg mb-2">Trao đổi trực tiếp</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Phụ huynh có thể gửi tin nhắn để trao đổi về tình hình học tập của con, xin phép nghỉ học, hoặc các thắc mắc khác. Giáo viên sẽ phản hồi sớm nhất có thể.
              </p>
              <div className="space-y-4 text-sm mt-auto">
                <p><strong>Hotline HT:</strong> 1900 1234</p>
                <p><strong>Giáo viên CN:</strong> Cô Sarah (0901234567)</p>
              </div>
            </div>
            <div className="md:w-2/3 p-6 flex flex-col">
              <form onSubmit={handleSendMessage} className="flex-1 flex flex-col gap-4 h-full">
                <div className="flex-1 border rounded-md p-4 bg-background min-h-[200px]">
                  <p className="text-xs text-center text-muted-foreground mb-4">-- Bắt đầu cuộc trò chuyện --</p>
                  <div className="flex gap-3 mb-4 max-w-[80%]">
                    <div className="w-8 h-8 rounded bg-primary/20 flex shrink-0 items-center justify-center text-primary font-bold text-xs uppercase">
                      TT
                    </div>
                    <div className="bg-secondary p-3 rounded-md rounded-tl-none text-sm">
                      Chào anh/chị, Trung tâm Anh ngữ MENGLISH xin nghe ạ. Anh/chị cần hỗ trợ vấn đề gì về bé {child.name}?
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 relative">
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary min-h-[44px] max-h-[120px]"
                    rows={1}
                  />
                  <button 
                    type="submit"
                    disabled={!message.trim()}
                    className="h-[44px] px-4 bg-primary text-primary-foreground font-medium text-sm rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" /> Gửi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ParentDashboard;
