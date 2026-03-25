import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { mockGrades, timekeepingRecords, students, mockHomeworks, mockTuitions } from "@/data/mockData";
import { 
  GraduationCap, BookOpen, Clock, MessageCircle, 
  UploadCloud, CheckCircle, AlertCircle, Send, CheckSquare, FileText, ChevronRight, Wallet, Bell, Calendar
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
    { id: "finance", label: "Học phí & Lịch sử", icon: Wallet },
    { id: "news", label: "Tin tức & Sự kiện", icon: Bell },
    { id: "contact", label: "Liên hệ Trung tâm", icon: MessageCircle }
  ];

  return (
    <div className="p-4 md:p-6 w-full mx-auto h-[calc(100vh-80px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
            <GraduationCap className="w-7 h-7" /> Cổng Thông Tin Phụ Huynh
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Chào mừng Phụ huynh của <strong className="text-foreground">{child.name}</strong> quay trở lại.</p>
        </div>
        <div className="flex items-center gap-3 bg-secondary/30 px-6 py-2 rounded-md border border-primary/20 bg-primary/5">
          <div className="w-12 h-12 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-sm">
            {child.avatar}
          </div>
          <div>
            <p className="font-bold text-base">{child.name}</p>
            <p className="text-xs text-muted-foreground">Mã số: {child.id} • Lớp: <span className="text-primary font-bold">{child.level}</span></p>
          </div>
        </div>
      </div>

      {/* Main Layout: Left Sidebar + Right Content */}
      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Vertical Menu */}
        <div className="w-full md:w-64 flex flex-col gap-1 shrink-0 overflow-y-auto pr-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-between px-4 py-3.5 rounded-md text-sm font-semibold transition-all ${
                activeTab === tab.id 
                  ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20"
                  : "bg-transparent hover:bg-secondary text-muted-foreground hover:text-foreground border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-primary-foreground" : "text-primary"}`} />
                {tab.label}
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-70" />}
            </button>
          ))}
          
          <div className="mt-auto p-4 bg-primary/10 rounded-md border border-primary/20 text-[10px] text-primary space-y-2">
            <p className="font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Hỗ trợ 24/7:</p>
            <p>Email: support@menglish.edu.vn</p>
            <p>Hotline: 1900 6789</p>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-card border rounded-md shadow-sm overflow-hidden flex flex-col min-h-0">
          <div className="p-8 overflow-y-auto flex-1 h-full">
            
            {/* CONTENT: INFO */}
            {activeTab === "info" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="font-bold text-xl flex items-center gap-2 mb-8 border-b pb-3">
                  <GraduationCap className="w-6 h-6 text-primary" /> Thông tin hồ sơ học viên
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-16">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Họ và tên học viên</p>
                    <p className="font-bold text-lg border-b border-dashed pb-1">{child.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Mã định danh (ID)</p>
                    <p className="font-bold text-lg border-b border-dashed pb-1">{child.id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Lớp đang theo học</p>
                    <p className="font-bold text-lg border-b border-dashed pb-1 text-primary">{child.level}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Giáo viên phụ trách</p>
                    <p className="font-bold text-lg border-b border-dashed pb-1">Cô Sarah Miller</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Ngày nhập học</p>
                    <p className="font-bold text-lg border-b border-dashed pb-1">15/01/2025</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Ngày sinh</p>
                    <p className="font-bold text-lg border-b border-dashed pb-1">{child.dob}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Người giám hộ</p>
                    <p className="font-bold text-lg border-b border-dashed pb-1">Nguyễn Văn Hùng</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Trạng thái tài chính</p>
                    <div className="pt-1">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/20 text-success-foreground text-xs font-black uppercase rounded-sm border border-success/40 shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5" /> Đã hoàn tất học phí
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-secondary/20 rounded-md border border-dashed border-primary/30">
                  <h3 className="font-bold text-sm mb-3 text-primary uppercase">Ghi chú từ trung tâm:</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    "Học viên có tinh thần học tập tốt, rất tích cực trong các hoạt động ngoại khóa. Phụ huynh vui lòng theo dõi tab Bài tập để nhắc nhở bé hoàn thành bài đúng hạn."
                  </p>
                </div>
              </div>
            )}

            {/* CONTENT: GRADES */}
            {activeTab === "grades" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-10 focus:outline-none">
                <div>
                  <h2 className="font-bold text-xl flex items-center gap-2 mb-6 border-b pb-3">
                    <BookOpen className="w-6 h-6 text-primary" /> Bảng điểm & Đánh giá
                  </h2>
                  <div className="overflow-x-auto rounded-md shadow-sm border">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-secondary/40 text-muted-foreground border-b">
                        <tr>
                          <th className="px-5 py-4 text-left font-bold uppercase text-[10px] tracking-widest border-r">Môn học / Kỹ năng</th>
                          <th className="px-5 py-4 text-center font-bold uppercase text-[10px] tracking-widest border-r w-28">Giữa kỳ</th>
                          <th className="px-5 py-4 text-center font-bold uppercase text-[10px] tracking-widest border-r w-28">Cuối kỳ</th>
                          <th className="px-5 py-4 text-left font-bold uppercase text-[10px] tracking-widest">Nhận xét chi tiết</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {mockGrades.map((grade, idx) => (
                          <tr key={idx} className="hover:bg-primary/5 transition-colors">
                            <td className="px-5 py-4 font-bold border-r text-base">{grade.subject}</td>
                            <td className="px-5 py-4 text-center border-r">
                                <span className="text-lg font-black text-primary">{grade.midterm}</span>
                            </td>
                            <td className="px-5 py-4 text-center border-r">
                                <span className="text-lg font-black text-primary">{grade.final}</span>
                            </td>
                            <td className="px-5 py-4 text-muted-foreground leading-relaxed italic">{grade.comments}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h2 className="font-bold text-xl flex items-center gap-2 mb-6 border-b pb-3">
                    <Clock className="w-6 h-6 text-primary" /> Lịch sử chuyên cần (Gần nhất)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { date: "24/03/2026", status: "ok", label: "Có mặt", time: "17:30 - 19:30" },
                      { date: "22/03/2026", status: "ok", label: "Có mặt", time: "17:30 - 19:30" },
                      { date: "20/03/2026", status: "late", label: "Đi muộn (15p)", time: "17:45 - 19:30" }
                    ].map((att, i) => (
                      <div key={i} className="bg-secondary/10 border p-5 rounded-md flex items-center gap-5 shadow-sm hover:border-primary/50 transition-colors group">
                        <div className={`p-3 rounded-full ${att.status === 'ok' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-600'}`}>
                          {att.status === "ok" ? (
                            <CheckCircle className="w-8 h-8" />
                          ) : (
                            <AlertCircle className="w-8 h-8" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-muted-foreground uppercase mb-1">{att.date}</p>
                          <p className={`font-black text-base ${att.status === 'ok' ? 'text-success' : 'text-amber-600'}`}>
                            {att.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground/80 mt-1 font-medium">{att.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CONTENT: HOMEWORK */}
            {activeTab === "homework" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col h-full focus:outline-none">
                <div className="mb-6">
                  <h2 className="font-bold text-xl flex items-center gap-2 border-b pb-3">
                    <CheckSquare className="w-6 h-6 text-primary" /> Danh sách bài tập từ đầu khóa
                  </h2>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Phụ huynh vui lòng nhắc nhở học viên hoàn thành bài tập trước ngày hết hạn để đảm bảo tiến độ học tập tốt nhất.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 pr-3 pb-8">
                  {mockHomeworks.map((hw) => {
                    const isSubmittingThis = uploadingId === hw.id;
                    
                    return (
                      <div key={hw.id} className={`p-6 rounded-md border flex flex-col lg:flex-row gap-6 lg:items-center justify-between transition-all ${hw.status === 'submitted' ? 'bg-success/5 border-success/30' : 'bg-background hover:shadow-lg hover:border-primary/40'}`}>
                        <div className="flex items-start gap-5 flex-1">
                          <div className={`p-3 rounded bg-secondary/50 ${hw.status === 'submitted' ? 'text-success' : 'text-muted-foreground'}`}>
                            <FileText className="w-7 h-7 shrink-0" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-lg mb-1">{hw.title}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                                <span className="flex items-center gap-1 font-medium"><Calendar className="w-3 h-3" /> Hạn nộp: <span className="text-foreground font-bold">{hw.dueDate}</span></span>
                                <span className="bg-secondary px-2 py-0.5 rounded-sm">ID: {hw.id}</span>
                            </div>
                            {hw.comments && (
                              <div className="mt-4 bg-background border border-primary/20 p-4 rounded-sm shadow-inner overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                <span className="font-bold text-xs block mb-1 text-primary uppercase">Nhận xét của Teacher Sarah:</span>
                                <span className="text-sm italic text-muted-foreground leading-relaxed">"{hw.comments}"</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-start lg:items-center gap-4 shrink-0 lg:w-48 lg:border-l lg:pl-6 pt-6 lg:pt-0">
                          {hw.status === 'submitted' ? (
                            <>
                              <div className="flex items-center gap-2 text-xs font-black text-success bg-white px-4 py-2 rounded-full border border-success/30 shadow-sm w-full lg:w-auto justify-center">
                                <CheckCircle className="w-4 h-4" /> ĐÃ NỘP BÀI
                              </div>
                              {hw.score !== undefined && (
                                <div className="text-center w-full mt-2">
                                  <span className="text-xs text-muted-foreground block mb-1 font-bold">KẾT QUẢ:</span>
                                  <div className="flex items-baseline justify-center gap-0.5">
                                    <span className="text-3xl font-black text-primary">{hw.score}</span>
                                    <span className="text-sm font-bold text-muted-foreground">/10</span>
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="w-full">
                              <button 
                                onClick={() => handleUpload(hw.id)}
                                disabled={isSubmittingThis}
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-black rounded-md shadow-md transition-all hover:bg-primary/95 active:scale-95 ${isSubmittingThis ? 'opacity-70 cursor-wait' : 'hover:-translate-y-0.5'}`}
                              >
                                {isSubmittingThis ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                    ĐANG TẢI LÊN...
                                  </>
                                ) : (
                                  <>
                                    <UploadCloud className="w-5 h-5" /> NỘP BÀI NGAY
                                  </>
                                )}
                              </button>
                              <p className="text-[10px] text-center text-muted-foreground mt-2 italic font-medium">Hỗ trợ PDF, Ảnh, Video (Max 50MB)</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CONTENT: FINANCE (Học phí) */}
            {activeTab === "finance" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 focus:outline-none">
                <h2 className="font-bold text-xl flex items-center gap-2 mb-8 border-b pb-3">
                  <Wallet className="w-6 h-6 text-primary" /> Lịch sử thanh toán học phí
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="p-6 bg-primary/5 border rounded-md shadow-sm">
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Gói học phí hiện tại</p>
                        <p className="text-lg font-black text-primary">IELTS Mastery (6 tháng)</p>
                    </div>
                    <div className="p-6 bg-success/5 border border-success/20 rounded-md shadow-sm">
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Đã thanh toán (Năm nay)</p>
                        <p className="text-lg font-black text-success">45.000.000 VNĐ</p>
                    </div>
                    <div className="p-6 bg-secondary/20 border rounded-md shadow-sm">
                        <p className="text-xs font-bold text-muted-foreground mb-1 uppercase">Trạng thái hiện tại</p>
                        <p className="text-lg font-black text-foreground">Không có nợ phí</p>
                    </div>
                </div>

                <h3 className="font-bold text-sm mb-4 uppercase text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Danh sách hóa đơn chi tiết
                </h3>
                <div className="overflow-x-auto rounded-md shadow-sm border">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-secondary/40 text-muted-foreground border-b">
                            <tr>
                                <th className="px-5 py-4 text-left font-bold uppercase text-[10px] tracking-widest border-r">Kỳ hạn đóng phí</th>
                                <th className="px-5 py-4 text-right font-bold uppercase text-[10px] tracking-widest border-r">Số tiền</th>
                                <th className="px-5 py-4 text-center font-bold uppercase text-[10px] tracking-widest border-r">Hạn chót</th>
                                <th className="px-5 py-4 text-center font-bold uppercase text-[10px] tracking-widest border-r">Trạng thái</th>
                                <th className="px-5 py-4 text-left font-bold uppercase text-[10px] tracking-widest">Ngày nộp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {mockTuitions.map((bill) => (
                                <tr key={bill.id} className="hover:bg-primary/5 transition-colors">
                                    <td className="px-5 py-4 font-bold border-r">{bill.month}</td>
                                    <td className="px-5 py-4 text-right font-black border-r text-foreground">{bill.amount.toLocaleString()} đ</td>
                                    <td className="px-5 py-4 text-center border-r font-medium text-muted-foreground">{bill.dueDate}</td>
                                    <td className="px-5 py-4 text-center border-r">
                                        <span className="inline-block px-2 py-0.5 bg-success/10 text-success text-[10px] font-black rounded border border-success/30 uppercase">
                                            Đã nộp
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-muted-foreground font-medium italic">{bill.paymentDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded text-xs text-orange-800 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="leading-relaxed">
                        <strong>Lưu ý:</strong> Hóa đơn chính thức sẽ được gửi trực tiếp qua Email đăng ký ngay khi hệ thống xác nhận thanh toán thành công. Nếu có sai sót về số tiền, vui lòng liên hệ bộ phận Kế toán của MENGLISH qua hotline 1900 6789.
                    </p>
                </div>
              </div>
            )}

            {/* CONTENT: NEWS (Tin tức) */}
            {activeTab === "news" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 focus:outline-none h-full">
                <h2 className="font-bold text-xl flex items-center gap-2 mb-8 border-b pb-3">
                  <Bell className="w-6 h-6 text-primary" /> Tin tức & Sự kiện nội bộ
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { title: "Chào mừng Ngày Giải phóng 30/04 & 01/05", date: "24/03/2026", desc: "Trung tâm thông báo lịch nghỉ lễ cho học sinh từ ngày 30/04 đến hết 03/05. Các lớp sẽ quay lại học bình thường vào 04/05.", type: "Thông báo" },
                        { title: "Workshop: Luyện kỹ năng Speaking cùng chuyên gia", date: "22/03/2026", desc: "Sự kiện đặc biệt dành riêng cho học viên IELTS Mastery vào sáng Chủ Nhật này. Đăng ký tham gia ngay tại quầy lễ tân.", type: "Sự kiện" },
                        { title: "Ra mắt tính năng Cổng thông tin Phụ huynh Pro", date: "20/03/2026", desc: "MENGLISH chính thức cập nhật giao diện dashboard mới giúp phụ huynh theo dõi con em dễ dàng hơn trên thiết bị di động.", type: "Cập nhật" },
                        { title: "Tin tuyển sinh: Khoá học hè Summer Fun 2026", date: "15/03/2026", desc: "Đăng ký sớm nhận ưu đãi 20% học phí trọn gói cùng bộ quà tặng độc quyền từ Menglish.", type: "Khuyến mãi" },
                    ].map((news, i) => (
                        <div key={i} className="group border rounded-md shadow-sm overflow-hidden flex flex-col hover:border-primary/50 transition-all cursor-pointer hover:shadow-md">
                            <div className="h-32 bg-secondary/30 relative flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                                <Bell className="w-12 h-12 text-primary/20 group-hover:scale-110 transition-transform" />
                                <span className="absolute top-4 left-4 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-black rounded uppercase shadow-sm">
                                    {news.type}
                                </span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="text-[10px] text-muted-foreground font-bold mb-2 uppercase tracking-widest">{news.date}</div>
                                <h3 className="font-bold text-lg mb-3 leading-snug group-hover:text-primary transition-colors">{news.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-6">{news.desc}</p>
                                <button className="mt-auto flex items-center gap-2 text-xs font-black text-primary hover:underline self-start">
                                    CHI TIẾT <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {/* CONTENT: CONTACT */}
            {activeTab === "contact" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col focus:outline-none">
                <h2 className="font-bold text-xl flex items-center gap-2 mb-6 border-b pb-3 shrink-0">
                  <MessageCircle className="w-6 h-6 text-primary" /> Hỗ trợ & Giải đáp thắc mắc
                </h2>
                
                <div className="flex-1 flex flex-col md:flex-row gap-8 min-h-0">
                  <div className="md:w-1/3 space-y-6 shrink-0">
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-md shadow-sm">
                      <h3 className="font-bold text-sm mb-4 text-primary uppercase tracking-widest border-b pb-2">Thông tin liên hệ</h3>
                      <div className="space-y-5">
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Địa điểm theo học</p>
                            <p className="text-sm font-bold">Cơ sở Menglish Ba Đình - 45 Liễu Giai</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Cán bộ giáo vụ (Sarah Miller)</p>
                            <p className="text-sm font-bold">Hotline: 090 123 4567</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Văn phòng tư vấn</p>
                            <p className="text-sm font-bold">Giờ làm việc: 08:30 - 21:00</p>
                          </div>
                      </div>
                    </div>
                    
                    <div className="p-5 text-center border-2 border-dashed border-muted rounded-md opacity-60">
                        <p className="text-xs font-medium text-muted-foreground">Bạn cần thay đổi thông tin liên lạc hoặc đăng ký xe đưa đón?</p>
                        <button className="mt-3 text-xs font-black text-primary hover:underline">LIÊN HỆ PHÒNG ĐÀO TẠO</button>
                    </div>
                  </div>

                  <form onSubmit={handleSendMessage} className="flex-1 flex flex-col gap-5 min-h-[400px]">
                    <div className="flex-1 border rounded-md p-6 bg-secondary/5 flex flex-col overflow-y-auto space-y-6 overflow-hidden shadow-inner relative">
                      <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-secondary/50 to-transparent pointer-events-none" />
                      
                      <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest relative py-4">
                        <span className="bg-secondary/5 px-4 relative z-10 font-black">Lịch sử hội thoại</span>
                        <span className="absolute left-0 right-0 top-1/2 h-px bg-border -z-0"></span>
                      </p>
                      
                      <div className="flex gap-4 max-w-[90%]">
                        <div className="w-9 h-9 rounded-md bg-primary flex shrink-0 items-center justify-center text-primary-foreground font-black text-sm shadow-md">
                          TT
                        </div>
                        <div className="bg-background border p-4 rounded-md rounded-tl-none text-sm shadow-sm leading-relaxed border-primary/20">
                          Xin chào Phụ huynh, tôi là Sarah Miller - cố vấn học tập của bé <strong>{child.name}</strong>. Rất vui được hỗ trợ gia đình mình qua kênh trò chuyện mới này. Anh/chị cần hỏi về tình hình hôm nay hay muốn trao đổi thêm về lộ trình sắp tới ạ?
                        </div>
                      </div>

                      <div className="flex gap-4 max-w-[90%] self-end flex-row-reverse">
                        <div className="w-9 h-9 rounded-md bg-secondary flex shrink-0 items-center justify-center text-secondary-foreground font-black text-sm shadow-md">
                          PH
                        </div>
                        <div className="bg-primary/5 border border-primary/20 p-4 rounded-md rounded-tr-none text-sm shadow-sm leading-relaxed">
                          Chào cô Sarah, cô cho mẹ hỏi bài thi thử hôm qua của Minh Anh kết quả như thế nào cô nhỉ?
                        </div>
                      </div>

                      <div className="flex gap-4 max-w-[90%]">
                        <div className="w-9 h-9 rounded-md bg-primary flex shrink-0 items-center justify-center text-primary-foreground font-black text-sm shadow-md">
                          TT
                        </div>
                        <div className="bg-background border p-4 rounded-md rounded-tl-none text-sm shadow-sm leading-relaxed border-primary/20">
                          Dạ bé được 7.5 IELTS Speaking rồi mẹ nhé, phần Listening cần cố gắng hơn chút ạ. Mẹ xem chi tiết ở Tab ĐIỂM SỐ nhé.
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 shrink-0 mt-2 p-1">
                      <input 
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Gửi yêu cầu hoặc thắc mắc cho giáo viên tại đây..."
                        className="flex-1 border-2 border-primary/10 rounded-md px-5 py-3.5 text-sm font-medium focus:outline-none focus:border-primary/50 shadow-sm transition-all focus:ring-1 focus:ring-primary/20"
                      />
                      <button 
                        type="submit"
                        disabled={!message.trim()}
                        className="px-8 bg-primary text-primary-foreground font-black text-sm rounded-md flex items-center justify-center gap-3 hover:bg-primary/95 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                      >
                        Gửi Ngay <Send className="w-4 h-4" />
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
