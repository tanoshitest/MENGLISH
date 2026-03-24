import React, { useState, useEffect } from "react";
import { useRole } from "@/contexts/RoleContext";
import { timekeepingRecords, teachers } from "@/data/mockData";
import { 
  Clock, Fingerprint, MapPin, CheckCircle, 
  XCircle, AlertCircle, Search, Filter,
  CalendarDays, Download, User
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const TimekeepingPage = () => {
  const { isAdmin } = useRole();
  const [records, setRecords] = useState(timekeepingRecords);
  
  // Teacher State
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Example current teacher ID for demo (in real app, this comes from auth context)
  const currentTeacherId = "TCH001";
  
  useEffect(() => {
    // Update live clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckInOut = (type: "in" | "out") => {
    setIsCheckingIn(true);
    toast.info("Đang lấy tọa độ GPS của bạn...");
    
    // Simulate GPS fetch delay
    setTimeout(() => {
      setIsCheckingIn(false);
      const newTime = currentTime.toTimeString().slice(0, 5); // HH:mm
      toast.success(`Đã ghi nhận giờ ${type === "in" ? "vào" : "ra"}: ${newTime}`);
      
      // Update local state for demo
      const todayDate = currentTime.toISOString().split('T')[0];
      const existingRecordIndex = records.findIndex(r => r.teacherId === currentTeacherId && r.date === todayDate);
      
      if (existingRecordIndex >= 0) {
         const updatedRecords = [...records];
         if (type === "out") updatedRecords[existingRecordIndex].checkOutTime = newTime;
         if (type === "in") updatedRecords[existingRecordIndex].checkInTime = newTime;
         setRecords(updatedRecords);
      } else {
         setRecords([{
           id: `TK_NEW_${Date.now()}`,
           teacherId: currentTeacherId,
           date: todayDate,
           checkInTime: type === "in" ? newTime : null,
           checkOutTime: type === "out" ? newTime : null,
           location: { lat: 21.0285, lng: 105.8048, name: "Menglish Ba Đình" },
           status: "on-time"
         }, ...records]);
      }
    }, 1500);
  };

  const renderAdminView = () => (
      <div className="space-y-6">
        {/* Admin KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card p-5 rounded-2xl border shadow-sm">
             <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Tổng lịch dạy hôm nay</p>
             <p className="text-3xl font-black text-foreground">15</p>
          </div>
          <div className="bg-card p-5 rounded-2xl border shadow-sm">
             <p className="text-[10px] uppercase font-black text-muted-foreground mb-1">Đã Check-in</p>
             <p className="text-3xl font-black text-primary">12</p>
          </div>
          <div className="bg-secondary/20 p-5 rounded-2xl border border-amber-200 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
             <p className="text-[10px] uppercase font-black text-amber-800 mb-1">Đi muộn</p>
             <p className="text-3xl font-black text-amber-600">2</p>
          </div>
          <div className="bg-destructive/5 p-5 rounded-2xl border shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
             <p className="text-[10px] uppercase font-black text-destructive mb-1">Thiếu mộc / Vắng</p>
             <p className="text-3xl font-black text-destructive">1</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary/10">
            <h2 className="font-bold">Lịch sử chấm công</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Tìm người..." className="pl-9 pr-4 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary w-full md:w-64" />
              </div>
              <button className="p-2 border bg-background rounded-lg hover:bg-secondary"><Filter className="w-4 h-4" /></button>
              <button className="p-2 border bg-background rounded-lg hover:bg-secondary"><Download className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 text-muted-foreground font-black uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-3 text-left">Giáo viên</th>
                  <th className="px-6 py-3 text-center">Ngày</th>
                  <th className="px-6 py-3 text-center">Giờ vào</th>
                  <th className="px-6 py-3 text-center">Giờ ra</th>
                  <th className="px-6 py-3 text-center">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Vị trí</th>
                  <th className="px-6 py-3 text-right">Tọa độ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map(record => {
                  const teacher = teachers.find(t => t.id === record.teacherId);
                  return (
                    <tr key={record.id} className="hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{teacher?.avatar || 'GV'}</div>
                          <div>
                            <p className="font-bold">{teacher?.name || record.teacherId}</p>
                            <p className="text-[10px] text-muted-foreground">{teacher?.phone || '...'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-medium">{record.date}</td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-primary">{record.checkInTime || "--:--"}</td>
                      <td className="px-6 py-4 text-center font-mono font-bold">{record.checkOutTime || "--:--"}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border
                          ${record.status === 'on-time' ? 'bg-success/10 text-success border-success/20' : 
                            record.status === 'late' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                            'bg-destructive/10 text-destructive border-destructive/20'}`}
                        >
                          {record.status === 'on-time' ? 'Đúng giờ' : 
                           record.status === 'late' ? 'Đi muộn' : 'Thiếu Checkout'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-left font-bold text-xs">{record.location?.name || 'Chưa rõ'}</td>
                      <td className="px-6 py-4 text-right">
                        {record.location ? (
                          <button onClick={() => toast.info(`Tọa độ: ${record.location?.lat}, ${record.location?.lng}`)} className="text-primary hover:underline group inline-flex items-center gap-1 text-[10px] font-medium">
                            <MapPin className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" /> Xem GPS
                          </button>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">Không có GPS</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );

  const renderTeacherView = () => {
    const todayDate = currentTime.toISOString().split('T')[0];
    const todayRecord = records.find(r => r.teacherId === currentTeacherId && r.date === todayDate);

    return (
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column: Clocking UI */}
        <div className="w-full md:w-1/3 xl:w-1/4 space-y-6">
           <div className="bg-card rounded-3xl border shadow-xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary/20 to-transparent" />
              <div className="relative">
                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                 <motion.h1 
                    key={currentTime.getSeconds()}
                    initial={{ opacity: 0.5, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-6xl font-black mt-4 font-mono tracking-tighter"
                 >
                    {currentTime.toTimeString().slice(0, 5)}
                 </motion.h1>
                 <p className="text-xs font-bold text-primary mt-2 flex justify-center items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> GPS Location: Acquiring...
                 </p>
              </div>

              <div className="mt-10 space-y-4">
                 <button 
                  onClick={() => handleCheckInOut("in")}
                  disabled={isCheckingIn || !!todayRecord?.checkInTime}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${
                    todayRecord?.checkInTime 
                      ? "bg-secondary text-muted-foreground shadow-none cursor-not-allowed border"
                      : "bg-primary text-white hover:bg-primary/90 hover:scale-[1.02] active:scale-95 shadow-primary/25"
                  }`}
                 >
                    <Fingerprint className="w-5 h-5" />
                    {isCheckingIn ? "ĐANG LẤY GPS..." : (todayRecord?.checkInTime ? `ĐÃ VÀO: ${todayRecord.checkInTime}` : "CHECK IN CA DẠY")}
                 </button>

                 <button 
                  onClick={() => handleCheckInOut("out")}
                  disabled={isCheckingIn || !todayRecord?.checkInTime || !!todayRecord?.checkOutTime}
                  className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg border-2 ${
                    !todayRecord?.checkInTime || todayRecord?.checkOutTime
                      ? "bg-transparent text-muted-foreground/30 border-secondary shadow-none cursor-not-allowed"
                      : "bg-white text-destructive border-destructive/20 hover:bg-destructive/5 hover:scale-[1.02] active:scale-95 shadow-destructive/10"
                  }`}
                 >
                    <XCircle className="w-5 h-5" />
                    {todayRecord?.checkOutTime ? `ĐÃ RA: ${todayRecord.checkOutTime}` : "CHECK OUT RA VỀ"}
                 </button>
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed font-medium">Bạn phải cấp quyền truy cập vị trí (Location) trong trình duyệt để tính năng Chấm công hoạt động hợp lệ.</p>
           </div>
        </div>

        {/* Right Column: Personal History */}
        <div className="flex-1">
           <div className="bg-card rounded-2xl border shadow-sm h-full">
              <div className="p-5 border-b flex justify-between items-center bg-secondary/10">
                 <h2 className="font-bold uppercase text-sm tracking-widest text-muted-foreground flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Lịch sử của bạn
                 </h2>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-sm">
                    <thead className="text-[10px] font-black uppercase text-muted-foreground bg-secondary/20">
                       <tr>
                          <th className="px-6 py-3 text-left">Ngày</th>
                          <th className="px-6 py-3 text-center">Vị trí</th>
                          <th className="px-6 py-3 text-center">Giờ Vào</th>
                          <th className="px-6 py-3 text-center">Giờ Ra</th>
                          <th className="px-6 py-3 text-center">Ghi chú</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y">
                       {records.filter(r => r.teacherId === currentTeacherId).map(record => (
                         <tr key={record.id} className="hover:bg-primary/5">
                            <td className="px-6 py-4 font-bold">{record.date}</td>
                            <td className="px-6 py-4 text-center text-xs font-bold">{record.location?.name || '--'}</td>
                            <td className="px-6 py-4 text-center font-mono text-primary font-bold">{record.checkInTime || "--:--"}</td>
                            <td className="px-6 py-4 text-center font-mono font-bold">{record.checkOutTime || "--:--"}</td>
                            <td className="px-6 py-4 text-center">
                               {record.status === 'late' ? (
                                  <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded">ĐI MUỘN</span>
                               ) : record.status === 'missing-checkout' ? (
                                  <span className="text-[10px] font-black text-destructive bg-destructive/10 px-2 py-1 rounded">CHƯA CHECKOUT</span>
                               ) : (
                                  <span className="text-[10px] font-bold text-muted-foreground"><CheckCircle className="w-3 h-3 inline-block text-success mr-1"/>OK</span>
                               )}
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col min-h-0 bg-background">
      <div className="mb-6">
        <h1 className="text-2xl font-black">{isAdmin ? "Quản lý Chấm công" : "Chấm công Điện tử"}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdmin ? "Báo cáo giờ vào/ra và thống kê chuyên cần của giảng viên." : "Ghi nhận giờ làm việc tự động với hệ thống nhận diện vị trí GPS."}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
         {isAdmin ? renderAdminView() : renderTeacherView()}
      </div>
    </div>
  );
};

export default TimekeepingPage;
