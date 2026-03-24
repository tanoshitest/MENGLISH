import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { teacherSchedule, classes, teachers } from "@/data/mockData";
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  MapPin, Clock, Users, School, Info, AlertCircle 
} from "lucide-react";
import { motion } from "framer-motion";

const DAYS_OF_WEEK = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", 
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"
];

const SchedulePage = () => {
  const { isAdmin } = useRole();
  const [viewDate, setViewDate] = useState(new Date("2025-03-24")); // Demo date

  const getEventColor = (type: string) => {
    switch (type) {
      case "class": return "bg-primary/10 text-primary border-primary/20";
      case "meeting": return "bg-amber-100 text-amber-700 border-amber-200";
      case "exam": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-secondary text-muted-foreground border-secondary";
    }
  };

  const getDayIndex = (dateStr: string) => {
    const d = new Date(dateStr);
    const day = d.getDay(); // 0: Sunday, 1: Monday...
    return day === 0 ? 6 : day - 1; // Map to 0-6 starting Monday
  };

  const getTimePosition = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const startHour = 8;
    return (hours - startHour) * 100 + (minutes / 60) * 100;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">{isAdmin ? "Quản lý Lịch dạy" : "Lịch dạy của tôi"}</h1>
          <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-widest">Tuần 13 • Tháng 3, 2025</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card border rounded-lg p-1 shadow-sm">
          <button className="p-2 hover:bg-secondary rounded-md" onClick={() => {}}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-4 text-sm font-bold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            24/03 - 30/03
          </div>
          <button className="p-2 hover:bg-secondary rounded-md" onClick={() => {}}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-xl overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-[80px_1fr] border-b bg-secondary/30">
          <div className="p-4 border-r"></div>
          <div className="grid grid-cols-7 divide-x">
            {DAYS_OF_WEEK.map((day, i) => {
              const date = 24 + i; // Demo range 24-30
              const isToday = i === 0; // Assume March 24 is today
              return (
                <div key={day} className={`p-3 text-center ${isToday ? "bg-primary/5" : ""}`}>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{day}</p>
                  <p className={`text-xl font-black mt-1 ${isToday ? "text-primary" : ""}`}>{date}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-[80px_1fr] h-[700px] overflow-y-auto relative">
          {/* Time Labels */}
          <div className="bg-secondary/10 border-r divide-y">
            {TIME_SLOTS.map(time => (
              <div key={time} className="h-[100px] p-2 text-[10px] font-bold text-muted-foreground text-center">
                {time}
              </div>
            ))}
          </div>

          {/* Slots & Events Container */}
          <div className="relative grid grid-cols-7 divide-x bg-[linear-gradient(to_bottom,transparent_99px,#e2e8f0_99px)] bg-[size:100%_100px]">
             {/* Today Highlight */}
             <div className="absolute inset-y-0 left-0 w-[14.28%] bg-primary/5 pointer-events-none" />

             {/* Events */}
             {teacherSchedule.map((event) => {
               const dayIdx = getDayIndex(event.date);
               const top = getTimePosition(event.startTime);
               const height = getTimePosition(event.endTime) - top;
               
               return (
                 <motion.div
                   key={event.id}
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className={`absolute mx-1 rounded-lg border-l-4 p-2 shadow-sm cursor-pointer z-10 overflow-hidden group hover:shadow-md transition-shadow`}
                   style={{
                     left: `${dayIdx * 14.28}%`,
                     width: "13%",
                     top: `${top}px`,
                     height: `${height}px`,
                   }}
                 >
                   <div className={`absolute inset-0 opacity-10 ${getEventColor(event.type).split(" ")[0]}`} />
                   <div className={`absolute inset-0 border-l-4 ${getEventColor(event.type).split(" ")[2]}`} />
                   
                   <div className="relative">
                     <p className={`text-[10px] font-black uppercase tracking-tighter ${getEventColor(event.type).split(" ")[1]}`}>
                       {event.startTime} - {event.endTime}
                     </p>
                     <h4 className="text-xs font-bold truncate mt-0.5">{event.title}</h4>
                     <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground font-medium">
                       <MapPin className="w-2.5 h-2.5" /> {event.room}
                     </div>
                     {event.classId && isAdmin && (
                        <div className="mt-2 text-[8px] bg-white/50 px-1 py-0.5 rounded inline-block font-bold border border-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                          ID: {event.classId}
                        </div>
                     )}
                   </div>
                 </motion.div>
               );
             })}

             {/* Grid Lines (Vertical) */}
             {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-full border-r last:border-0" />
             ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-focus p-6 rounded-xl text-primary-foreground shadow-lg flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">Thống kê dạy học (Tháng 3)</h3>
            <div className="flex gap-6 mt-4">
              <div>
                <p className="text-[10px] uppercase font-bold opacity-70">Tổng giờ dạy</p>
                <p className="text-2xl font-black">124h</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold opacity-70">Số lớp phụ trách</p>
                <p className="text-2xl font-black">5</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold opacity-70">Bù/Nghỉ</p>
                <p className="text-2xl font-black text-amber-200">2</p>
              </div>
            </div>
          </div>
          <CalendarIcon className="w-16 h-16 opacity-20" />
        </div>

        <div className="bg-card border rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Chú thích</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-xs font-medium">Lớp học chính khóa</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs font-medium">Họp chuyên môn / Review</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-xs font-medium">Kiểm tra / Mock Test</span>
            </div>
          </div>
          <div className="mt-6 p-3 bg-secondary/20 rounded-lg flex gap-3">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
              Lịch dạy được tự động đồng bộ từ hệ thống xếp lớp và có thể thay đổi tùy theo đề xuất dạy bù của giảng viên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
