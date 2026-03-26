import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useNavigate } from "react-router-dom";
import { teacherSchedule, classes, users } from "@/data/mockData";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  MapPin, Clock, Users, School, Info, Plus,
  Filter, Search, LayoutGrid, List, ChevronDown, Monitor,
  Loader2, CheckCircle2, X, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAYS_OF_WEEK = [
  { label: "Thứ 2", date: "16/03" },
  { label: "Thứ 3", date: "17/03" },
  { label: "Thứ 4", date: "18/03" },
  { label: "Thứ 5", date: "19/03" },
  { label: "Thứ 6", date: "20/03" },
  { label: "Thứ 7", date: "21/03" },
];

const PERIODS = {
  morning: [
    { id: "M1", name: "Tiết 1", time: "08:00 - 09:00" },
    { id: "M2", name: "Tiết 2", time: "09:00 - 10:00" },
    { id: "M3", name: "Tiết 3", time: "10:30 - 11:30" },
    { id: "M1A", name: "Tiết 1A", time: "09:30 - 10:30" },
    { id: "M2A", name: "Tiết 2A", time: "10:30 - 11:30" },
  ],
  afternoon: [
    { id: "A4", name: "Tiết 4", time: "13:00 - 14:00" },
    { id: "A5", name: "Tiết 5", time: "14:00 - 15:00" },
    { id: "A6", name: "Tiết 6", time: "15:00 - 16:00" },
    { id: "A7", name: "Tiết 7", time: "16:30 - 17:30" },
  ],
  evening: [
    { id: "E8", name: "Tiết 8", time: "18:30 - 20:00" },
    { id: "E9", name: "Tiết 9", time: "20:00 - 21:30" },
  ]
};

const SchedulePage = () => {
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [viewType, setViewType] = useState<"detail" | "overview">("detail");
  const [events, setEvents] = useState([...teacherSchedule]);

  // Interactive Demo State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [pendingCell, setPendingCell] = useState<{clsId: string, day: string, periodId: string} | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState("TCH001");
  const [selectedRoom, setSelectedRoom] = useState("Room A1");

  const teachers = users.filter(u => u.role === "teacher");

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingCell) return;
    
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const cls = classes.find(c => c.id === pendingCell.clsId);
    const day = DAYS_OF_WEEK.find(d => d.label === pendingCell.day);
    const periodGroup = Object.values(PERIODS).flat().find(p => p.id === pendingCell.periodId);

    const newEvent = {
      id: `EVT${100 + events.length}`,
      title: `${cls?.course || "Lớp hóc"} - ${pendingCell.day}`,
      classId: pendingCell.clsId,
      room: selectedRoom,
      date: `2025-03-${day?.date.split('/')[0]}`,
      startTime: periodGroup?.time.split(' - ')[0] || "08:00",
      endTime: periodGroup?.time.split(' - ')[1] || "09:30",
      type: "class" as const
    };

    setEvents(prev => [...prev, newEvent]);
    setIsAdding(false);
    setIsAddOpen(false);
    
    toast.success("Đã xếp lịch dạy mới!", {
      description: `Lớp ${cls?.name} đã được xếp vào ${pendingCell.day}, ${periodGroup?.name} tại ${selectedRoom}.`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    });
  };

  const getCellEvent = (classId: string, dayLabel: string, periodId: string) => {
    return events.find(s => {
      const cls = classes.find(c => c.id === s.classId);
      const day = DAYS_OF_WEEK.find(d => `2025-03-${d.date.split('/')[0]}` === s.date);
      
      // Simplify logic for demo purposes: match classId and day label
      // In real app, we would match YYYY-MM-DD and time blocks
      const isCorrectClass = s.classId === classId;
      const isCorrectDay = day?.label === dayLabel;
      
      // More deterministic for the demo: 
      // check if the event matches the class and day
      return isCorrectClass && isCorrectDay && (
        filterTeacher === "all" || cls?.teacherId === filterTeacher
      );
    });
  };

  return (
    <div className="p-6 bg-background min-h-full space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-foreground">Xếp lịch dạy</h1>
          <p className="text-sm text-muted-foreground">Quản lý lịch dạy và điều phối phòng học toàn hệ thống.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewType("detail")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewType === "detail" ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}
          >
            <List className="w-4 h-4" /> Chi tiết
          </button>
          <button 
            onClick={() => setViewType("overview")}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${viewType === "overview" ? "bg-primary text-white shadow-md shadow-primary/20" : "hover:bg-secondary text-muted-foreground"}`}
          >
            <LayoutGrid className="w-4 h-4" /> Tổng quan
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-4 flex-wrap bg-card border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-xl border border-transparent">
          <button className="p-1 hover:bg-card rounded-md"><ChevronLeft className="w-4 h-4" /></button>
          <span className="text-xs font-black min-w-[140px] text-center">Tuần 4 - Tháng 3/2026</span>
          <button className="p-1 hover:bg-card rounded-md"><ChevronRight className="w-4 h-4" /></button>
        </div>

        <div className="h-8 w-[1px] bg-border mx-2" />

        <div className="flex items-center gap-3">
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={filterTeacher}
              onChange={(e) => setFilterTeacher(e.target.value)}
              className="pl-9 pr-8 py-2 bg-secondary/10 border-none rounded-xl text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tất cả GV</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="pl-9 pr-8 py-2 bg-secondary/10 border-none rounded-xl text-xs font-bold appearance-none outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Tất cả lớp</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          <select className="px-4 py-2 bg-secondary/10 border-none rounded-xl text-xs font-bold outline-none">
            <option>Tháng 3</option>
            <option>Tháng 4</option>
          </select>

          <select className="px-4 py-2 bg-secondary/10 border-none rounded-xl text-xs font-bold outline-none">
            <option>2026</option>
            <option>2025</option>
          </select>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-card rounded-2xl border shadow-xl overflow-x-auto relative min-h-[600px]">
        <table className="w-full border-collapse table-fixed min-w-[1200px]">
          <thead>
            <tr className="bg-secondary/20">
              <th className="w-24 p-4 text-[10px] font-black uppercase text-muted-foreground border-b border-r sticky left-0 z-20 bg-secondary/20">Lớp</th>
              <th className="w-20 p-4 text-[10px] font-black uppercase text-muted-foreground border-b border-r sticky left-24 z-20 bg-secondary/20">Buổi</th>
              <th className="w-32 p-4 text-[10px] font-black uppercase text-muted-foreground border-b border-r sticky left-[11rem] z-20 bg-secondary/20">Tiết</th>
              {DAYS_OF_WEEK.map((day) => (
                <th key={day.label} className="p-4 border-b border-r last:border-r-0">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{day.label}</span>
                    <span className="text-sm font-black">{day.date}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {classes.filter(c => filterClass === "all" || c.id === filterClass).map((cls, clsIdx) => (
              <React.Fragment key={cls.id}>
                {/* Morning Session */}
                {Object.entries(PERIODS).map(([sessionKey, sessionPeriods], sessIdx) => (
                  <React.Fragment key={sessionKey}>
                    {sessionPeriods.map((period, pIdx) => (
                      <tr key={period.id} className="group hover:bg-primary/5 transition-colors">
                        {/* Class Column - spans all periods for this class */}
                        {sessIdx === 0 && pIdx === 0 && (
                          <td 
                            rowSpan={PERIODS.morning.length + PERIODS.afternoon.length + PERIODS.evening.length} 
                            className="p-4 border-r border-b text-center sticky left-0 z-10 bg-card group-hover:bg-primary/5 transition-colors border-l-4 border-l-primary cursor-pointer"
                            onClick={() => navigate(`/classes/${cls.id}`)}
                          >
                            <span className="text-lg font-black text-primary">{cls.name.split(" ")[0]}</span>
                          </td>
                        )}
                        
                        {/* Session Column - spans morning/afternoon periods */}
                        {pIdx === 0 && (
                          <td 
                            rowSpan={sessionPeriods.length} 
                            className="p-4 border-r border-b text-center text-[10px] font-black uppercase text-muted-foreground sticky left-24 z-10 bg-card group-hover:bg-primary/5 transition-colors"
                          >
                            {sessionKey === 'morning' ? 'Sáng' : sessionKey === 'afternoon' ? 'Chiều' : 'Tối'}
                          </td>
                        )}

                        {/* Period Column */}
                        <td className="p-3 border-r border-b sticky left-[11rem] z-10 bg-card group-hover:bg-primary/5 transition-colors">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black whitespace-nowrap">{period.name}</span>
                            <span className="text-[9px] text-muted-foreground font-medium opacity-60">({period.time})</span>
                          </div>
                        </td>

                        {/* Day Columns */}
                        {DAYS_OF_WEEK.map((day) => {
                          const event = getCellEvent(cls.id, day.label, period.id);

                          return (
                            <td key={day.label} className="p-2 border-r border-b last:border-r-0 relative group/cell min-h-[80px]">
                              {event ? (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  onClick={() => navigate(`/classes/${cls.id}`)}
                                  className={`p-3 rounded-xl border shadow-sm relative overflow-hidden h-full flex flex-col justify-center min-h-[60px] cursor-pointer hover:shadow-md transition-all ${
                                    event.id.includes("EVT001") ? "bg-blue-50 border-blue-200 text-blue-700" :
                                    event.id.includes("EVT002") ? "bg-purple-50 border-purple-200 text-purple-700" :
                                    "bg-amber-50 border-amber-200 text-amber-700"
                                  }`}
                                >
                                  {/* Label "OFF" in image */}
                                  <span className="absolute top-1 left-1 bg-muted-foreground/20 text-[6px] px-1 rounded uppercase font-bold text-muted-foreground">OFF</span>
                                  
                                  <p className="text-[11px] font-black leading-tight mb-1">
                                    {(() => {
                                      const cls = classes.find(c => c.id === event.classId);
                                      return users.find(u => u.id === cls?.teacherId)?.name || "Giảng viên";
                                    })()}
                                  </p>
                                  <div className="flex items-center gap-1 opacity-60">
                                    <MapPin className="w-2.5 h-2.5" />
                                    <span className="text-[9px] font-bold uppercase">{event.room}</span>
                                  </div>
                                </motion.div>
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                                  {isAdmin ? (
                                    <button 
                                      onClick={() => {
                                        setPendingCell({ clsId: cls.id, day: day.label, periodId: period.id });
                                        setIsAddOpen(true);
                                      }}
                                      className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-all transform hover:scale-110 active:scale-90 shadow-lg shadow-primary/20"
                                    >
                                      <Plus className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground/30 font-bold uppercase">Trống</span>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend & Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase text-muted-foreground mb-4 tracking-widest">Hướng dẫn thao tác</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 p-4 bg-secondary/10 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-bold">Thêm lịch mới</p>
                <p className="text-[11px] text-muted-foreground">Di chuột vào ô trống bất kỳ và nhấn biểu tượng dấu (+) để xếp lịch.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-secondary/10 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <Monitor className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold">Xung đột lịch</p>
                <p className="text-[11px] text-muted-foreground">Các tiết học bị trùng phòng hoặc trùng giảng viên sẽ được đánh dấu cảnh báo đỏ.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-black uppercase text-muted-foreground mb-4 tracking-widest">Trạng thái phòng</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Phòng A1 (Ba Đình)</span>
              <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded-full">Trống: 4/12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Phòng B2 (Quận 1)</span>
              <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-bold rounded-full">Kín lịch</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Bản thảo chưa lưu</span>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded-full">3 lịch</span>
            </div>
          </div>
          <button className="w-full mt-6 py-2.5 bg-primary text-white text-xs font-black rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            XÁC NHẬN LƯU LỊCH
          </button>
        </div>
      </div>

      {/* Add Schedule Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Xếp lịch dạy mới</DialogTitle>
            <p className="text-sm text-muted-foreground italic tracking-tight">Cấu hình thời gian và phòng học cho tiết học.</p>
          </DialogHeader>
          
          {pendingCell && (
            <div className="bg-secondary/20 p-4 rounded-2xl border border-dashed text-sm space-y-2 mb-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-bold">Lớp học:</span>
                <span className="font-black text-primary">{classes.find(c => c.id === pendingCell.clsId)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground font-bold">Thời gian:</span>
                <span className="font-black">{pendingCell.day}, {Object.values(PERIODS).flat().find(p => p.id === pendingCell.periodId)?.name}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleCreateSchedule} className="space-y-6 pt-2">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Giảng viên đảm nhận</Label>
                <select 
                  className="w-full h-11 px-3 py-2 border rounded-xl text-sm bg-card outline-none focus:ring-2 focus:ring-primary/20"
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Phòng học</Label>
                <select 
                  className="w-full h-11 px-3 py-2 border rounded-xl text-sm bg-card outline-none focus:ring-2 focus:ring-primary/20"
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                >
                  <option value="Room A1">Phòng A1 (Ba Đình)</option>
                  <option value="Room B2">Phòng B2 (Quận 1)</option>
                  <option value="Room C1">Phòng C1 (Online)</option>
                  <option value="Phòng họp 1">Phòng họp 1</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isAdding}
                className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu lịch...
                  </>
                ) : "Xác nhận xếp lịch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchedulePage;
