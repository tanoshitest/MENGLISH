import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { classes, students, users, documents } from "@/data/mockData";
import { 
  CheckCircle, XCircle, Clock, AlertCircle, 
  BookOpen, Star, MessageSquare, ClipboardList, LayoutDashboard,
  ArrowRight, Share2, Layout, Users, CalendarCheck, Award,
  Search, FileSpreadsheet, Calendar, FolderOpen, FileText, Download,
  MoreVertical, FileCode, FileImage, File, MousePointerClick, ChevronDown,
  ChevronLeft, ChevronRight, Check, Pencil, Paperclip, UploadCloud
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import { toast } from "sonner";

interface ClassDetailContentProps {
  id?: string;
  backButton?: boolean;
}

const mockSessions = [
  { id: 1, title: "MOVERS: Unit 01", hw: "1. Movie Vids. 2. Toefl P.32", date: "24/03/2026" },
  { id: 2, title: "GRAMMAR: Unit 18", hw: "1. 10 Sentences. 2. Quiz Online", date: "28/03/2026" },
  { id: 3, title: "SPEAKING: Pets", hw: "1. Record Pet Story. 2. Vocab", date: "31/03/2026" },
  { id: 4, title: "READING: Fun Fair", hw: "1. Read P.12. 2. Answer Qs", date: "04/04/2026" },
  { id: 5, title: "WRITING: My Day", hw: "1. Write daily routine. 2. Review", date: "07/04/2026" },
  { id: 6, title: "LISTENING: Numbers", hw: "1. Dictation 1. 2. Listen P.5", date: "11/04/2026" },
  { id: 7, title: "REVIEW: Midterm", hw: "1. Review Unit 1-5. 2. Prep", date: "14/04/2026" },
  { id: 8, title: "TEST: Progress 1", hw: "1. Self-reflection. 2. Exam Correction", date: "18/04/2026" },
  { id: 9, title: "STORY: Red Riding", hw: "1. Retell story. 2. Character Drawing", date: "21/04/2026" },
  { id: 10, title: "PROJECT: World Map", hw: "1. Group poster. 2. Presentation", date: "25/04/2026" },
];

export const ClassDetailContent: React.FC<ClassDetailContentProps> = ({ id: propId }) => {
  const navigate = useNavigate();
  const { id: urlId } = useParams();
  const id = propId || urlId;
  const { role, isParent } = useRole();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<"overview" | "report" | "documents">("report");
  const [selectedSessionId, setSelectedSessionId] = useState(1);
  const [showSessionMenu, setShowSessionMenu] = useState(false);
  
  // High-fidelity Parent Demo: Interactive Homework Submission
  const [submittingIds, setSubmittingIds] = useState<Record<number, boolean>>({});
  const [demoSubmittedIds, setDemoSubmittedIds] = useState<Record<number, boolean>>({});
  
  // High-fidelity Teacher Demo: Interactive Attendance
  const [attendanceOverrides, setAttendanceOverrides] = useState<Record<string, string>>({});

  const handleToggleStatus = (idKey: string, studentName: string) => {
    if (isParent) return;
    
    const statuses = ["Đúng giờ", "Đi muộn", "Vắng mặt"];
    const current = attendanceOverrides[idKey] || "Đúng giờ";
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    
    setAttendanceOverrides(prev => ({ ...prev, [idKey]: next }));
    toast.success(`Cập nhật trạng thái cho ${studentName}: ${next}`, {
      description: "Dữ liệu đã được đồng bộ với sổ cái học điểm.",
      icon: <CalendarCheck className="w-5 h-5 text-emerald-500" />
    });
  };

  const handleParentUpload = (sId: number) => {
    setSubmittingIds(prev => ({ ...prev, [sId]: true }));
    const loadingToast = toast.loading(`Đang tải bài tập buổi ${sId} lên hệ thống...`);
    
    setTimeout(() => {
      setSubmittingIds(prev => ({ ...prev, [sId]: false }));
      setDemoSubmittedIds(prev => ({ ...prev, [sId]: true }));
      toast.dismiss(loadingToast);
      toast.success(`Nộp bài tập buổi ${sId} thành công!`, {
        description: "Giáo viên sẽ nhận được thông báo và chấm điểm cho bé.",
        icon: <CheckCircle className="w-5 h-5 text-emerald-500 shadow-sm" />,
      });
    }, 1500);
  };

  const selectedSession = useMemo(() => 
    mockSessions.find(s => s.id === selectedSessionId) || mockSessions[0], 
  [selectedSessionId]);

  // Robust class lookup
  const classData = useMemo(() => {
    if (!id) return null;
    return classes.find((c) => c.id.toUpperCase() === id.toUpperCase());
  }, [id]);
  
  // Robust nested student lookup
  const classStudents = useMemo(() => {
    if (!classData) return [];
    const allInClass = students.filter((s) => 
      s.classIds && s.classIds.some(cid => cid.toUpperCase() === classData.id.toUpperCase())
    );
    if (isParent) {
      return allInClass.filter(s => s.id === "STU011");
    }
    return allInClass;
  }, [classData, isParent]);

  // Robust document lookup for the class
  const classDocuments = useMemo(() => {
    if (!classData) return [];
    return documents.filter((doc) => 
      doc.classId === "all" || doc.classId.toUpperCase() === classData.id.toUpperCase()
    );
  }, [classData]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSessionMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!classData) {
    return (
      <div className="p-10 text-center bg-background h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-16 h-16 text-amber-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800">Lớp học không tìm thấy</h2>
        <p className="text-slate-400 font-bold mb-6">ID: {id || "Unknown"}</p>
        <button onClick={() => navigate("/schedule")} className="px-8 py-3 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-lg transition-all active:scale-95 text-xs">
          ← Quay lại danh sách lớp
        </button>
      </div>
    );
  }

  const displayStudents = classStudents; 

  const stats = [
    { label: "Sĩ số học sinh", value: `${displayStudents.length}/12`, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Tỉ lệ chuyên cần", value: "94%", icon: CalendarCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Điểm trung bình", value: "8.2", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "BTVN hoàn thành", value: "88%", icon: ClipboardList, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  const recentActivity = [
    { time: "2 giờ trước", msg: `GV. Ms. Thu Trang đã cập nhật báo cáo học tập buổi ${selectedSessionId}.`, type: "report" },
    { time: "Hôm qua", msg: "Hệ thống đã tự động gửi báo cáo học tập tuần cho Phụ huynh.", type: "system" },
    { time: "2 ngày trước", msg: "Đã thiết lập lịch thi Mini Test 4 vào ngày 30/03.", type: "exam" },
  ];

  const allTabs = [
    { id: "overview", label: "Tổng quan", icon: LayoutDashboard, teacherOnly: true },
    { id: "report", label: "Báo cáo buổi học", icon: CalendarCheck },
    { id: "documents", label: "Tài liệu", icon: FolderOpen, teacherOnly: true },
  ];

  const filteredTabs = allTabs.filter(tab => !isParent || !tab.teacherOnly);

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf": return <FileText className="w-5 h-5 text-rose-500" />;
      case "docx": return <FileText className="w-5 h-5 text-blue-500" />;
      case "xlsx": return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case "pptx": return <FileText className="w-5 h-5 text-orange-500" />;
      default: return <File className="w-5 h-5 text-slate-400" />;
    }
  };

  const selectSession = (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setShowSessionMenu(false);
    toast.success(`Đã chuyển sang xem dữ liệu Buổi ${sessionId}`);
  };

  const handleEditComment = (name: string) => {
    if (role === 'parent') return;
    toast.info(`Mở giao diện sửa nhận xét cho: ${name}`);
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden relative font-sans">
      {/* PERFECTLY FIXED HEADER CONTAINER */}
      <div className="bg-white border-b shadow-sm z-[100] shrink-0">
        <div className="grid grid-cols-3 text-[11px] font-black uppercase tracking-tighter">
          <div className="bg-[#f59e0b] text-white px-6 py-2 border-r border-[#d97706] flex items-center justify-between">
            <span>Thứ 3: Thứ 7</span>
          </div>
          <div className="bg-[#f59e0b] text-white px-6 py-2 border-r border-[#d97706] text-center">
            GV: Ms. Thu Trang
          </div>
          <div className="bg-[#f59e0b] text-white px-6 py-2 text-right font-bold">
            NGÀY: {selectedSession.date}
          </div>
        </div>

        <div className="grid grid-cols-4 text-[10px] bg-slate-100 border-b border-slate-200 h-[80px]">
          <div className="border-r border-slate-200 flex flex-col items-stretch">
            <div className="bg-[#d1fae5] px-4 py-1 border-b border-slate-200 text-center font-black uppercase tracking-tighter text-[9px]">LỚP:</div>
            <div className="flex-1 flex items-center justify-center bg-white/30 p-2">
               <span className="font-black text-slate-700 uppercase text-sm tracking-tight text-center">{classData.course}</span>
            </div>
          </div>
          <div className="col-span-2 border-r border-slate-200 flex flex-col items-stretch relative" ref={dropdownRef}>
            <div className="bg-[#d1fae5] px-4 py-1 border-b border-slate-200 text-center font-black tracking-tighter uppercase text-[9px]">Nội dung buổi học</div>
            <div className="flex-1 bg-white relative">
              <button 
                onClick={() => setShowSessionMenu(!showSessionMenu)}
                className={`w-full h-full flex flex-col items-center justify-center transition-all hover:bg-slate-50 relative group ${showSessionMenu ? 'bg-primary/5' : ''}`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                   <ChevronLeft className="w-3 h-3 text-slate-300" />
                   <span className="text-[9px] font-black uppercase leading-none text-slate-400 tracking-widest opacity-60">Buổi học {selectedSession.id} / 10</span>
                   <ChevronRight className="w-3 h-3 text-slate-300" />
                </div>
                <div className="flex items-center gap-2">
                   <span className="font-black uppercase tracking-tight text-[12px] text-slate-800">
                     {selectedSession.title}
                   </span>
                   <ChevronDown className={`w-3.5 h-3.5 text-primary transition-transform duration-300 ${showSessionMenu ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showSessionMenu && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[260px] bg-white border rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl bg-white/95">
                  <div className="max-h-[300px] overflow-y-auto no-scrollbar py-2">
                    {mockSessions.map((s) => (
                      <button 
                        key={s.id}
                        onClick={() => selectSession(s.id)}
                        className={`w-full px-5 py-3 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group ${selectedSessionId === s.id ? 'bg-primary/5' : ''}`}
                      >
                        <div className="flex flex-col">
                           <span className={`text-[8px] font-black uppercase mb-0.5 ${selectedSessionId === s.id ? 'text-primary' : 'text-slate-400'}`}>Buổi {s.id}</span>
                           <span className={`text-[11px] font-black uppercase tracking-tighter ${selectedSessionId === s.id ? 'text-slate-900' : 'text-slate-600'}`}>{s.title}</span>
                        </div>
                        {selectedSessionId === s.id && <Check className="w-3.5 h-3.5 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-stretch relative group">
            <div className="bg-[#d1fae5] px-4 py-1 border-b border-slate-200 text-center font-black uppercase tracking-tighter text-[9px]">Bài tập về nhà {selectedSession.id}</div>
            <div className="flex-1 flex items-center justify-center p-2 bg-white/30 relative">
               <p className="text-[9px] leading-tight text-slate-500 font-bold text-center italic tracking-tight uppercase">
                 {selectedSession.hw}
               </p>
               {!isParent && (
                 <button className="absolute bottom-1 right-1 p-1 bg-white/80 rounded-lg border shadow-sm text-slate-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-all">
                   <Pencil className="w-3 h-3" />
                 </button>
               )}
            </div>
          </div>
        </div>

        <div className="flex overflow-x-auto px-4 no-scrollbar bg-white">
          {filteredTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-[11px] font-black uppercase tracking-tighter whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-[#5cba9b] text-[#5cba9b] bg-[#5cba9b]/5"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SCROLLABLE BODY CONTAINER (Locked Viewport) */}
      <div className="flex-1 bg-slate-50/50 overflow-hidden relative flex flex-col">
        {/* TAB CONTENT Area */}
        <div className={`flex-1 flex flex-col w-full max-w-screen-2xl mx-auto ${activeTab === 'report' ? 'px-4 md:px-6 pt-0' : 'p-4 md:p-6'} space-y-6 pb-20`}>
          
          {/* Final All-in-One Dashboard Tab (ULTRA FIXED) */}
          {activeTab === "report" && (
             <div className="flex-1 bg-white rounded-t-3xl border border-b-0 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="flex-1 overflow-auto no-scrollbar relative">
                 <table className="w-full text-[11px] border-collapse relative">
                   <thead className="z-40 sticky top-0">
                     <tr className="text-[#4a977d] font-black uppercase tracking-tighter shadow-sm border-b">
                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-6 py-4 text-center w-12 first:rounded-tl-3xl">STT</th>
                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-6 py-4 text-left min-w-[150px]">
                         {isParent ? 'Buổi học' : 'Học viên'}
                       </th>
                       
                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-6 py-4 text-center w-32 font-black">Trạng thái</th>

                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-3 py-4 text-center w-16">TFL</th>
                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-3 py-4 text-center w-16">B2</th>
                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-3 py-4 text-center w-16">BGD</th>
                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-4 py-4 text-center w-32">BÀI TẬP NỘP</th>
                       
                       <th className="sticky top-0 z-40 bg-[#f0f9e0] px-3 py-4 text-center w-16">HW/43</th>
                       <th className="sticky top-0 z-40 bg-[#f0f9e0] px-3 py-4 text-center w-16">L/28</th>
                       <th className="sticky top-0 z-40 bg-[#f0f9e0] px-3 py-4 text-center w-16 font-black text-primary border-r">MINI</th>
                       
                       <th className="sticky top-0 z-40 bg-[#f0f9f6] px-6 py-4 text-left text-xs font-black min-w-[350px] last:rounded-tr-3xl">
                         {isParent ? 'Nhận xét của GV' : `Nhận xét (Buổi ${selectedSessionId})`}
                       </th>
                     </tr>
                   </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(isParent ? [5, 4, 3, 2, 1] : displayStudents).map((item, idx) => {
                        // Item is sessionId (number) if parent, or student object if teacher
                        const sId = isParent ? (item as number) : selectedSessionId;
                        const studentId = isParent ? "STU011" : (item as any).id;
                        const student = students.find(s => s.id === studentId);
                        
                        // Seed calculation for dynamic mock data mapping
                        const sIdx = students.findIndex(s => s.id === studentId);
                        const seed = (sId + sIdx) % 10;
                        
                        // Derive Status
                        const initialStatus = seed === 0 ? "Vắng mặt" : seed === 5 ? "Đi muộn" : "Đúng giờ";
                        const idKey = isParent ? `session-${sId}` : `student-${studentId}-b${sId}`;
                        const status = attendanceOverrides[idKey] || initialStatus;
                        
                        // Derive Homework
                        const hw_tfl = seed % 2 === 0;
                        const hw_b2 = seed % 3 !== 0;
                        const hw_bgd = seed % 4 === 0;
                        const hasSubmittedFile = seed % 2 === 0 && seed % 3 !== 0;
                        
                        // Derive Scores
                        const score_hw = 43 - (seed % 3);
                        const score_reading = 28 - (seed % 2);
                        const score_mini = seed > 5 ? 'A+' : 'B';
                        
                        // Derive Feedback
                        const feedbackText = seed > 5 
                          ? "Con hăng hái xây dựng bài, nắm bắt kiến thức nhanh. Rèn luyện thêm kỹ năng viết." 
                          : "Học tập tốt, hoàn thành đầy đủ bài tập và chuẩn bị bài kỹ.";

                        if (!student) return null;
                        
                        return (
                          <tr key={isParent ? `session-${sId}` : `student-${studentId}`} className="hover:bg-slate-50 transition-colors text-[10px]">
                            <td className="px-6 py-4 border-r text-center font-bold text-slate-400">{idx + 1}</td>
                            <td className="px-6 py-4 border-r">
                              <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs uppercase">{student.avatar[0]}</div>
                                 <div>
                                   <div className="font-black text-slate-700 uppercase tracking-tight leading-none mb-1">{student.name}</div>
                                   <div className="text-[8px] text-slate-400 font-black italic">
                                     {isParent ? `BUỔI HỌC ${sId}` : (student.name.split(' ').pop() || 'N/A')}
                                   </div>
                                 </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 border-r text-center">
                               <button 
                                 onClick={() => handleToggleStatus(idKey, student.name)}
                                 disabled={isParent}
                                 className={`px-2.5 py-1 rounded-full font-black uppercase text-[8px] border italic tracking-tighter transition-all hover:scale-110 active:scale-95 ${
                                   status === 'Vắng mặt' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                   status === 'Đi muộn' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                                   'bg-emerald-50 text-emerald-600 border-emerald-100'
                                 } ${!isParent ? 'cursor-pointer' : 'cursor-default'}`}
                               >
                                 {status}
                               </button>
                            </td>

                            <td className="px-3 py-4 border-r text-center bg-emerald-50/5">
                               {hw_tfl ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-200 mx-auto" />}
                            </td>
                            <td className="px-3 py-4 border-r text-center bg-emerald-50/5">
                               {hw_b2 ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-200 mx-auto" />}
                            </td>
                            <td className="px-3 py-4 border-r text-center bg-emerald-50/5">
                               {hw_bgd ? <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-200 mx-auto" />}
                            </td>
                            
                            <td className="px-4 py-4 border-r text-center bg-slate-50/30">
                               {(hasSubmittedFile || demoSubmittedIds[sId]) ? (
                                 <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border rounded-lg shadow-sm hover:border-emerald-400 transition-all cursor-pointer group/file">
                                    <Paperclip className={`w-2.5 h-2.5 ${demoSubmittedIds[sId] ? 'text-emerald-500' : 'text-slate-400'}`} />
                                    <span className={`text-[8px] font-black uppercase truncate max-w-[60px] ${demoSubmittedIds[sId] ? 'text-emerald-600' : 'text-slate-600'}`}>
                                      {demoSubmittedIds[sId] ? `FINAL_B${sId}` : `FILE_B${sId}`}
                                    </span>
                                 </div>
                               ) : isParent ? (
                                 <button 
                                   onClick={() => handleParentUpload(sId)}
                                   disabled={submittingIds[sId]}
                                   className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-lg shadow-sm hover:bg-primary hover:text-white transition-all group/upload disabled:opacity-50"
                                 >
                                    {submittingIds[sId] ? (
                                      <div className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin group-hover/upload:border-white group-hover/upload:border-t-transparent" />
                                    ) : (
                                      <UploadCloud className="w-2.5 h-2.5 text-primary group-hover/upload:text-white" />
                                    )}
                                    <span className="text-[8px] font-black uppercase tracking-tighter">Nộp bài</span>
                                 </button>
                               ) : (
                                 <span className="text-[8px] font-black text-slate-300 italic uppercase">N/A</span>
                               )}
                            </td>
                            
                            <td className="px-3 py-4 border-r text-center font-black text-slate-600 bg-slate-100/30 text-[10px]">{score_hw}</td>
                            <td className="px-3 py-4 border-r text-center font-black text-slate-600 bg-slate-100/30 text-[10px]">{score_reading}</td>
                            <td className="px-3 py-4 border-r text-center font-black text-primary bg-primary/5 text-[10px] italic uppercase">{score_mini}</td>
                            
                            <td className="px-8 py-4 text-slate-500 leading-tight font-bold relative group-cell">
                              <div className="flex items-start justify-between gap-4">
                                 <span className="italic uppercase text-[9px] tracking-tighter opacity-80">
                                   {feedbackText}
                                 </span>
                                 {!isParent && (
                                   <button 
                                     onClick={() => handleEditComment(student.name)}
                                     className="p-1 bg-white border rounded-md shadow-sm text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                   >
                                     <Pencil className="w-2.5 h-2.5" />
                                   </button>
                                 )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* Overview Tab */}
          {!isParent && activeTab === "overview" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 flex-1 overflow-auto no-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 {stats.map((stat, i) => (
                   <div key={i} className="bg-white p-5 rounded-3xl border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                     <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6" />
                     </div>
                     <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1 text-center">{stat.label}</p>
                        <p className="text-xl font-black text-slate-800 text-center">{stat.value}</p>
                     </div>
                   </div>
                 ))}
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="md:col-span-2 bg-white p-6 rounded-3xl border shadow-sm relative overflow-hidden">
                    <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-6 relative z-10 text-center">Thông tin khoá học</h3>
                    <div className="grid grid-cols-2 gap-8 relative z-10">
                       <div className="space-y-4 text-center">
                          {[
                            { label: "Khoá học", val: classData.course },
                            { label: "Lịch học", val: classData.schedule },
                            { label: "Trạng thái", val: "Đang diễn ra", isTag: true, tagColor: "bg-emerald-50 text-emerald-600" }
                          ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                               <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">{item.label}</p>
                               {item.isTag ? (
                                 <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.tagColor}`}>{item.val}</span>
                               ) : (
                                 <p className="text-sm font-bold text-slate-700">{item.val}</p>
                               )}
                            </div>
                          ))}
                       </div>
                       <div className="space-y-4 text-center">
                          {[
                            { label: "Ngày khai giảng", val: classData.startDate },
                            { label: "Ngày dự kiến kết thúc", val: "20/06/2026" },
                            { label: "Phòng học", val: "Room 302", isTag: true, tagColor: "bg-blue-50 text-blue-600" }
                          ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center">
                               <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">{item.label}</p>
                               {item.isTag ? (
                                 <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.tagColor}`}>{item.val}</span>
                               ) : (
                                 <p className="text-sm font-bold text-slate-700">{item.val}</p>
                               )}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>

                 <div className="bg-white p-6 rounded-3xl border shadow-sm">
                    <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-6 text-center">Hoạt động gần đây</h3>
                    <div className="space-y-6">
                       {recentActivity.map((act, i) => (
                         <div key={i} className="flex gap-4 group cursor-default">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${i === 0 ? 'bg-amber-400 ring-4 ring-amber-50' : 'bg-slate-200'}`} />
                            <div className="flex-1">
                               <p className="text-xs font-bold text-slate-700 group-hover:text-primary transition-colors uppercase tracking-tighter leading-none mb-1">{act.msg}</p>
                               <span className="text-[10px] font-black uppercase text-slate-400 leading-none">{act.time}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
            </div>
          )}

          {/* Documents Tab */}
          {!isParent && activeTab === "documents" && (
            <div className="bg-white rounded-3xl border shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="p-4 border-b bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <FolderOpen className="w-5 h-5 text-primary" />
                     <h3 className="text-sm font-black uppercase text-slate-700 tracking-tighter">Kho tài liệu lớp học</h3>
                  </div>
                  <button className="px-4 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/20 transition-all flex items-center gap-2">
                     <Download className="w-3.5 h-3.5" />
                     Tải tất cả
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                 {classDocuments.map((doc) => (
                   <div key={doc.id} className="bg-white border rounded-2xl p-4 hover:shadow-md transition-all group flex items-start gap-4 cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                         {getFileIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="font-bold text-slate-700 text-sm truncate uppercase tracking-tight">{doc.title}</p>
                         <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 mt-1 uppercase border-t pt-2 mt-2">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const ClassDetailPage = () => {
  return <ClassDetailContent />;
};

export default ClassDetailPage;
