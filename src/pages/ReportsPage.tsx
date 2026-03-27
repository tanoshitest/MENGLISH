import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  ArrowLeft, Download, Filter, Calendar,
  PieChart as PieIcon, LineChart as LineIcon,
  Search, FileText, ChevronRight, AlertCircle,
  MessageSquareX, Repeat, Layers, ShieldAlert,
  School, CalendarClock, ClipboardCheck, GraduationCap,
  Fingerprint, CircleDollarSign, Building2, Users2,
  Clock, BellRing, HandCoins, UserMinus, History as HistoryIcon
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const reportMeta: Record<string, { label: string, icon: any, color: string }> = {
  "failed-sms": { label: "Tin chưa gửi được", icon: MessageSquareX, color: "text-destructive" },
  "student-charts": { label: "Biểu đồ học viên", icon: BarChart3, color: "text-primary" },
  "transfers": { label: "Báo cáo chuyển lớp", icon: Repeat, color: "text-blue-500" },
  "trials": { label: "Báo cáo học thử", icon: Layers, color: "text-amber-500" },
  "negative-tuition": { label: "Báo cáo âm học phí", icon: ShieldAlert, color: "text-rose-600" },
  "class-summary": { label: "Báo cáo tổng lớp", icon: School, color: "text-indigo-500" },
  "monthly-allocation": { label: "Phân bổ học phí tháng", icon: CalendarClock, color: "text-cyan-600" },
  "attendance-report": { label: "Báo cáo điểm danh", icon: ClipboardCheck, color: "text-emerald-500" },
  "academic-results": { label: "Kết quả học tập", icon: GraduationCap, color: "text-violet-500" },
  "timesheets": { label: "Bảng chấm công", icon: Fingerprint, color: "text-slate-600" },
  "payroll": { label: "Lương", icon: CircleDollarSign, color: "text-orange-500" },
  "room-usage": { label: "Báo cáo phòng", icon: Building2, color: "text-pink-500" },
  "class-students": { label: "Lớp, học viên", icon: Users2, color: "text-sky-500" },
  "daily-students": { label: "Học viên trong ngày", icon: Clock, color: "text-lime-600" },
  "tuition-reminder": { label: "Nhắc hạn học phí", icon: BellRing, color: "text-yellow-600" },
  "tuition-debt": { label: "Nợ học phí", icon: HandCoins, color: "text-red-500" },
  "deposit-debt": { label: "Nợ đặt cọc", icon: UserMinus, color: "text-orange-600" },
  "profit": { label: "Lợi nhuận", icon: TrendingUp, color: "text-emerald-600" },
};

const ReportsPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const currentReport = type ? reportMeta[type] : null;

  if (!currentReport) {
    return (
      <div className="p-6 space-y-6 bg-[#f8fafc] min-h-full">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black text-foreground">Hỗ trợ Báo cáo & Phân tích</h1>
          <p className="text-sm text-muted-foreground font-medium">Trung tâm dữ liệu MENGLISH - 18 Module nghiệp vụ.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.entries(reportMeta).map(([id, meta]) => (
            <motion.button
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={id}
              onClick={() => navigate(`/reports/${id}`)}
              className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all text-left group"
            >
              <div className={`p-3 rounded-2xl bg-secondary/30 w-fit mb-4 group-hover:bg-primary/10 transition-colors`}>
                <meta.icon className={`w-6 h-6 ${meta.color}`} />
              </div>
              <h3 className="font-black text-sm text-slate-700 mb-1 group-hover:text-primary transition-colors">{meta.label}</h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest italic">Nhấn để xem chi tiết</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const Icon = currentReport.icon;

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-secondary rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-secondary/50 rounded-xl">
              <Icon className={`w-5 h-5 ${currentReport.color}`} />
            </div>
            <div>
              <h1 className="text-lg font-black text-foreground">{currentReport.label}</h1>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                <span>DỮ LIỆU THÁNG 03/2026</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-emerald-500">Live Update</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter className="w-4 h-4 mr-2" /> Lọc dữ liệu
          </Button>
          <Button className="rounded-xl font-bold bg-primary shadow-lg shadow-primary/20">
            <Download className="w-4 h-4 mr-2" /> Xuất Excel
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
           {/* Demo View for Student Charts */}
           {type === "student-charts" ? (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "Tổng học sinh", value: "1,248", change: "+12%", icon: Users, color: "text-blue-500" },
                    { label: "Đang học", value: "956", change: "+5%", icon: GraduationCap, color: "text-emerald-500" },
                    { label: "Bảo lưu", value: "42", change: "-2%", icon: HistoryIcon, color: "text-amber-500" },
                    { label: "Tốt nghiệp", value: "250", change: "+18%", icon: TrendingUp, color: "text-violet-500" },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2 rounded-xl bg-secondary/50 ${kpi.color}`}>
                          {(kpi.icon as any) && <kpi.icon className="w-5 h-5" />}
                        </div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${kpi.change.startsWith("+") ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
                          {kpi.change}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">{kpi.label}</p>
                      <p className="text-2xl font-black">{kpi.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <h3 className="font-black text-sm mb-6 uppercase tracking-widest text-slate-500">Tăng trưởng học viên (6 tháng)</h3>
                    <div className="h-64 flex items-end justify-between gap-4 px-4">
                      {[65, 45, 78, 92, 110, 85].map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <motion.div 
                            initial={{ height: 0 }}
                            animate={{ height: `${val}%` }}
                            className="w-full bg-primary/20 group-hover:bg-primary transition-colors rounded-t-xl relative"
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                              {val + 200}
                            </div>
                          </motion.div>
                          <span className="text-[10px] font-bold text-slate-400">T{i+10 > 12 ? i-2 : i+10}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col">
                    <h3 className="font-black text-sm mb-6 uppercase tracking-widest text-slate-500">Phân bổ trình độ</h3>
                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="w-48 h-48 rounded-full border-[16px] border-slate-100 relative">
                         <div className="absolute inset-0 rounded-full border-[16px] border-primary border-t-transparent border-l-transparent rotate-45" />
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-black text-primary">68%</span>
                            <span className="text-[8px] font-black text-muted-foreground tracking-tighter uppercase">IELTS/Toeic</span>
                         </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary" />
                         <span className="text-[10px] font-bold text-slate-600">IELTS/Toeic (68%)</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-blue-400" />
                         <span className="text-[10px] font-bold text-slate-600">Starter/Mover (22%)</span>
                       </div>
                    </div>
                  </div>
                </div>
             </div>
           ) : type === "profit" ? (
             <div className="space-y-6">
                <div className="bg-emerald-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                   <TrendingUp className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white/5 rotate-12" />
                   <div className="relative z-10">
                     <p className="text-emerald-100 text-xs font-black uppercase tracking-[0.2em] mb-2">Lợi nhuận ròng dự kiến (Tháng 3)</p>
                     <h2 className="text-5xl font-black mb-4">425.800.000 <span className="text-2xl opacity-80">đ</span></h2>
                     <div className="flex items-center gap-4">
                       <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold transition-all hover:bg-white/30 cursor-pointer">
                         So với tháng trước: +12.4%
                       </div>
                       <div className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold transition-all hover:bg-white/30 cursor-pointer">
                         Điểm hòa vốn: 185.000.000 đ
                       </div>
                     </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <h3 className="font-black text-sm mb-6 uppercase tracking-widest text-slate-500">Cơ cấu Doanh thu</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Học phí khóa học", val: "750M", p: 75, color: "bg-primary" },
                        { label: "Bán giáo trình/VPP", val: "120M", p: 12, color: "bg-blue-400" },
                        { label: "Phí thi cử/Chứng chỉ", val: "85M", p: 8, color: "bg-amber-400" },
                        { label: "Khác", val: "45.8M", p: 5, color: "bg-slate-300" },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-black">
                            <span>{item.label}</span>
                            <span className="text-slate-400">{item.val}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.p}%` }}
                              className={`h-full ${item.color}`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <h3 className="font-black text-sm mb-6 uppercase tracking-widest text-slate-500">Cơ cấu Chi phí</h3>
                    <div className="space-y-4">
                      {[
                        { label: "Lương nhân sự", val: "320M", p: 60, color: "bg-rose-500" },
                        { label: "Mặt bằng/Điện nước", val: "85M", p: 15, color: "bg-rose-400" },
                        { label: "Marketing", val: "65M", p: 12, color: "bg-rose-300" },
                        { label: "Khác", val: "55.8M", p: 13, color: "bg-slate-200" },
                      ].map((item, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-[11px] font-black">
                            <span>{item.label}</span>
                            <span className="text-slate-400">{item.val}</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.p}%` }}
                              className={`h-full ${item.color}`} 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             </div>
           ) : (
              <div className="bg-white border rounded-[2.5rem] p-12 shadow-sm text-center space-y-6">
                <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {(Icon as any) && <Icon className={`w-10 h-10 ${currentReport.color} opacity-40`} />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-700">Dữ liệu đang được kết nối...</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Module <b>{currentReport.label}</b> đang trong quá trình đồng bộ SQL Server. Vui lòng quay lại sau ít phút hoặc liên hệ IT để được hỗ trợ.
                  </p>
                </div>
                <div className="flex justify-center gap-3">
                   <Button variant="outline" className="rounded-xl px-8" onClick={() => navigate("/reports")}>
                     Quay lại
                   </Button>
                   <Button className="rounded-xl px-8 bg-primary">
                     Yêu cầu đồng bộ
                   </Button>
                </div>
                <div className="pt-8 grid grid-cols-3 gap-8 max-w-xl mx-auto opacity-30 grayscale scale-90">
                   <div className="h-4 bg-slate-200 rounded-full w-full" />
                   <div className="h-4 bg-slate-200 rounded-full w-full" />
                   <div className="h-4 bg-slate-200 rounded-full w-full" />
                   <div className="h-24 bg-slate-100 rounded-2xl w-full" />
                   <div className="h-24 bg-slate-100 rounded-2xl w-full" />
                   <div className="h-24 bg-slate-100 rounded-2xl w-full" />
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
