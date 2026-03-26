import React from "react";
import { classes, users } from "@/data/mockData";
import { 
  BookOpen, Users, Clock, ArrowRight, 
  Search, Filter, LayoutGrid, List,
  GraduationCap, Calendar, MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import { motion } from "framer-motion";

const MyClassesPage = () => {
  const navigate = useNavigate();
  const { role } = useRole();
  
  // In a real app we'd get the current user ID from auth. 
  // For demo, we'll assume the "Teacher" role corresponds to a specific teacher ID (e.g., "USR002")
  const myClasses = classes.filter(c => c.id === "CLS001");

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/30 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm border border-primary/20">
               <BookOpen className="w-6 h-6" />
            </div>
            Lớp học của tôi
          </h1>
          <p className="text-muted-foreground font-bold mt-2 ml-15">Danh sách các lớp học bạn đang trực tiếp giảng dạy và quản lý.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card p-1 rounded-2xl border shadow-sm self-start">
           <button className="p-2 bg-secondary rounded-xl text-primary transition-all"><LayoutGrid className="w-4 h-4" /></button>
           <button className="p-2 text-muted-foreground hover:bg-secondary rounded-xl transition-all"><List className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myClasses.map((cls, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={cls.id}
            onClick={() => navigate(`/classes/${cls.id}`)}
            className="group bg-card rounded-[2.5rem] border border-slate-200 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all p-1 cursor-pointer"
          >
            <div className="bg-white rounded-[2.2rem] p-6 h-full flex flex-col">
              <div className="flex items-start justify-between mb-6">
                 <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">{cls.id}</span>
                    <h3 className="text-xl font-black group-hover:text-primary transition-colors leading-tight">{cls.name}</h3>
                 </div>
                 <div className="w-10 h-10 rounded-2xl bg-[#5cba9b]/10 text-[#5cba9b] flex items-center justify-center font-black text-xs border border-[#5cba9b]/20">
                    <Users className="w-5 h-5" />
                 </div>
              </div>

              <div className="space-y-4 flex-1">
                 <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                       <Clock className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-[9px] uppercase font-black opacity-50 tracking-tighter">Lịch học</p>
                       <p className="text-xs font-black text-slate-700">{cls.schedule}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                       <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-[9px] uppercase font-black opacity-50 tracking-tighter">Phòng học</p>
                       <p className="text-xs font-black text-slate-700">{cls.room}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                       <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                       <p className="text-[9px] uppercase font-black opacity-50 tracking-tighter">Sĩ số</p>
                       <p className="text-xs font-black text-slate-700">{cls.studentCount} / {cls.maxStudents} Học viên</p>
                    </div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                       <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black">{i}</div>
                    ))}
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-[8px] font-black">+{cls.studentCount - 4}</div>
                 </div>
                 <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    Vào lớp <ArrowRight className="w-4 h-4" />
                 </div>
              </div>
            </div>
          </motion.div>
        ))}

        {myClasses.length === 0 && (
          <div className="col-span-full p-20 text-center bg-card rounded-3xl border border-dashed">
             <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
             <p className="text-lg font-bold text-muted-foreground italic">Bạn hiện chưa được phân công lớp học nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClassesPage;
