import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { mockGrades, timekeepingRecords, students, mockHomeworks } from "@/data/mockData";
import { 
  GraduationCap, BookOpen, Clock, MessageCircle, 
  UploadCloud, CheckCircle, AlertCircle, Send, CheckSquare, FileText, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const ParentDashboard = () => {
  const { isParent } = useRole();
  const [activeTab, setActiveTab] = useState("info");
  const [message, setMessage] = useState("");
  const [uploadingId, setUploadingId] = useState<string | null>(null);

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

  const handleUpload = (hwId: string) => {
    setUploadingId(hwId);
    setTimeout(() => {
      setUploadingId(null);
      toast.success("Tải bài tập lên thành công!");
    }, 1500);
  };

  const tabs = [
    { id: "info", label: "Thông tin học viên", icon: GraduationCap },
    { id: "grades", label: "Điểm & Chuyên cần", icon: BookOpen },
    { id: "homework", label: "Bài tập", icon: CheckSquare },
    { id: "contact", label: "Liên hệ Trung tâm", icon: MessageCircle }
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-6 shrink-0">
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

      {/* Main Layout: Left Sidebar + Right Content */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Vertical Menu */}
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-card border rounded-md shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="p-6 overflow-y-auto flex-1 h-full">
            
            {/* CONTENT: INFO */}
            {activeTab === "info" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
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
            )}

            {/* CONTENT: GRADES */}
            {activeTab === "grades" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
                <div>
                  <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 border-b pb-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Kết quả học tập
                  </h2>
                  <div className="overflow-x-auto rounded-md border">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-secondary/50 text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3 text-left border-b font-semibold">Môn học / Kỹ năng</th>
                          <th className="px-4 py-3 text-center border-b font-semibold w-24">Giữa kỳ</th>
                          <th className="px-4 py-3 text-center border-b font-semibold w-24">Cuối kỳ</th>
                          <th className="px-4 py-3 text-left border-b font-semibold">Nhận xét của Giáo viên</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {mockGrades.map((grade, idx) => (
                          <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-4 py-3 font-medium">{grade.subject}</td>
                            <td className="px-4 py-3 text-center font-bold text-primary">{grade.midterm}</td>
                            <td className="px-4 py-3 text-center font-bold text-primary">{grade.final}</td>
                            <td className="px-4 py-3 text-muted-foreground">{grade.comments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 border-b pb-2">
                    <Clock className="w-5 h-5 text-primary" /> Điểm danh 3 buổi gần nhất
                  </h2>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { date: "24/03/2026", status: "ok", label: "Có mặt" },
                      { date: "22/03/2026", status: "ok", label: "Có mặt" },
                      { date: "20/03/2026", status: "late", label: "Đi muộn" }
                    ].map((att, i) => (
                      <div key={i} className="flex-1 min-w-[150px] bg-secondary/10 border p-4 rounded-md flex items-center gap-4 shadow-sm">
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
              </div>
            )}

            {/* CONTENT: HOMEWORK */}
            {activeTab === "homework" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col h-full">
                <div className="mb-4">
                  <h2 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
                    <CheckSquare className="w-5 h-5 text-primary" /> Danh sách bài tập từ đầu khóa
                  </h2>
                  <p className="text-xs text-muted-foreground mt-2">Theo dõi các bài tập về nhà và tiến độ hoàn thành của học viên.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                  {mockHomeworks.map((hw) => {
                    const isSubmittingThis = uploadingId === hw.id;
                    
                    return (
                      <div key={hw.id} className={`p-4 rounded-md border flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-all ${hw.status === 'submitted' ? 'bg-success/5 border-success/20' : 'bg-background hover:shadow-md hover:border-primary/30'}`}>
                        <div className="flex items-start gap-3 flex-1 px-1">
                          <FileText className={`w-5 h-5 mt-0.5 shrink-0 ${hw.status === 'submitted' ? 'text-success' : 'text-muted-foreground'}`} />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{hw.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">Hạn nộp: <span className="font-medium text-foreground">{hw.dueDate}</span></p>
                            {hw.comments && (
                              <div className="mt-3 bg-secondary/50 p-3 rounded text-xs border-l-2 border-primary">
                                <span className="font-semibold block mb-1">Giáo viên nhận xét:</span>
                                <span className="italic text-muted-foreground">{hw.comments}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-3 shrink-0 sm:w-40 border-t sm:border-t-0 sm:border-l pt-3 sm:pt-0 sm:pl-4">
                          {hw.status === 'submitted' ? (
                            <>
                              <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2.5 py-1.5 rounded-sm w-full sm:w-auto justify-center">
                                <CheckCircle className="w-4 h-4" /> Đã nộp bài
                              </div>
                              {hw.score !== undefined && (
                                <div className="text-sm font-black text-center w-full">
                                  Điểm: <span className="text-primary text-lg">{hw.score}</span>/10
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full flex justify-end">
                              <button 
                                onClick={() => handleUpload(hw.id)}
                                disabled={isSubmittingThis}
                                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-md shadow-sm transition-all hover:bg-primary/90 active:scale-95 ${isSubmittingThis ? 'opacity-70 cursor-wait' : ''}`}
                              >
                                {isSubmittingThis ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                    Đang tải...
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud className="w-4 h-4" /> Nộp bài
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CONTENT: CONTACT */}
            {activeTab === "contact" && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                <h2 className="font-semibold text-lg flex items-center gap-2 mb-4 border-b pb-2 shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" /> Trao đổi với Trung tâm
                </h2>
                
                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                  <div className="md:w-1/3 bg-secondary/10 p-5 border rounded-md shrink-0 flex flex-col gap-4">
                    <div>
                      <h3 className="font-bold text-sm mb-1">Hotline Hỗ Trợ</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                            1900 1234
                      </p>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm mb-1">Giáo viên Cố vấn</h3>
                      <p className="text-sm text-muted-foreground">Cô Sarah (090 123 4567)</p>
                    </div>
                    <div className="mt-auto pt-4 border-t text-xs text-muted-foreground">
                      * Trung tâm cam kết phản hồi tin nhắn trong vòng 4 giờ làm việc.
                    </div>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex-1 flex flex-col gap-4 min-h-[300px]">
                    <div className="flex-1 border rounded-md p-4 bg-secondary/5 flex flex-col overflow-y-auto">
                      <p className="text-xs text-center text-muted-foreground mb-6 uppercase tracking-widest relative">
                        <span className="bg-background px-2 relative z-10 text-[10px] font-bold">Bắt đầu trò chuyện</span>
                        <span className="absolute left-0 right-0 top-1/2 h-px bg-border -z-0"></span>
                      </p>
                      
                      {/* Buble from Center */}
                      <div className="flex gap-3 mb-4 max-w-[85%]">
                        <div className="w-8 h-8 rounded-md bg-primary flex shrink-0 items-center justify-center text-primary-foreground font-bold text-xs shadow-sm">
                          TT
                        </div>
                        <div className="bg-background border p-3 rounded-md rounded-tl-none text-sm shadow-sm">
                          Chào anh/chị, Trung tâm Anh ngữ MENGLISH xin nghe ạ. Bộ phận học vụ có thể hỗ trợ thông tin gì cho học viên {child.name}?
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0 mt-2">
                      <input 
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập nội dung cần trao đổi..."
                        className="flex-1 border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                      />
                      <button 
                        type="submit"
                        disabled={!message.trim()}
                        className="px-6 bg-primary text-primary-foreground font-medium text-sm rounded-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <Send className="w-4 h-4" /> Gửi
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ParentDashboard;
