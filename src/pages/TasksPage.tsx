import { useState } from "react";
import { tasks, type Task } from "@/data/mockData";
import { useRole } from "@/contexts/RoleContext";
import { 
  ClipboardList, CheckCircle2, Clock, AlertCircle, 
  Search, Filter, Plus, MoreVertical, Calendar,
  LayoutGrid, List as ListIcon, User
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Stage = Task["stage"];

const stageConfig: Record<Stage, { label: string; color: string; icon: any }> = {
  todo: { label: "Cần làm", color: "bg-kanban-new", icon: ClipboardList },
  in_progress: { label: "Đang làm", color: "bg-kanban-progress", icon: Clock },
  done: { label: "Hoàn thành", color: "bg-kanban-done", icon: CheckCircle2 },
};

const priorityConfig = {
  low: { label: "Thấp", color: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  medium: { label: "Trung bình", color: "bg-amber-50 text-amber-600", dot: "bg-amber-400" },
  high: { label: "Cao", color: "bg-rose-50 text-rose-600", dot: "bg-rose-500" },
};

const stages: Stage[] = ["todo", "in_progress", "done"];

const TasksPage = () => {
  const { isTeacher } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [taskList, setTaskList] = useState(tasks);

  const handleUpdateStage = (taskId: string, newStage: Stage) => {
    setTaskList(prev => prev.map(t => 
      t.id === taskId ? { ...t, stage: newStage } : t
    ));
    const label = stageConfig[newStage].label;
    toast.success(`Nhiệm vụ đã chuyển sang "${label}"`, {
      description: "Hệ thống đã cập nhật tiến độ công việc của bạn.",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    });
  };
  
  // For demo, if teacher, show only Sarah Johnson's tasks
  const filteredTasks = taskList.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (isTeacher) {
      return t.assignee === "Sarah Johnson" && matchesSearch;
    }
    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 bg-slate-50/30 min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border ${isTeacher ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary/10 text-primary border-primary/20'}`}>
               <ClipboardList className="w-6 h-6" />
            </div>
            {isTeacher ? "Công việc của tôi" : "Phân công công việc"}
          </h1>
          <p className="text-muted-foreground font-bold mt-2 ml-15">
            {isTeacher 
              ? "Quản lý và theo dõi các nhiệm vụ giảng dạy được phân công." 
              : "Quản lý hệ thống nhiệm vụ và tiến độ công việc của toàn bộ nhân viên."}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Tìm kiếm công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
              />
           </div>
        </div>
      </div>

      {isTeacher && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                 {filteredTasks.filter(t => t.stage === 'todo').length}
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase opacity-50">Cần làm</p>
                 <p className="text-sm font-black">Nhiệm vụ mới</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                 {filteredTasks.filter(t => t.stage === 'in_progress').length}
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase opacity-50">Đang làm</p>
                 <p className="text-sm font-black">Tiến độ</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                 {filteredTasks.filter(t => t.stage === 'done').length}
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase opacity-50">Hoàn thành</p>
                 <p className="text-sm font-black">Đã xong</p>
              </div>
           </div>
           <div className="bg-primary p-4 rounded-3xl shadow-lg shadow-primary/20 flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                 <Calendar className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase opacity-70">Hôm nay</p>
                 <p className="text-sm font-black">Thứ 5, 26/03</p>
              </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stages.map((stage) => {
          const items = filteredTasks.filter((t) => t.stage === stage);
          const cfg = stageConfig[stage];
          return (
            <div key={stage} className={`flex flex-col h-full rounded-lg border overflow-hidden`}>
              <div className={`px-3 py-2 ${cfg.color} flex items-center justify-between`}>
                 <div className="flex items-center gap-2">
                    <span className="font-bold text-sm">{cfg.label}</span>
                 </div>
                 <span className="text-xs bg-card rounded-full px-2 py-0.5 font-bold">
                    {items.length}
                 </span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-secondary/30 min-h-[300px]">
                <AnimatePresence mode="popLayout">
                  {items.map((t) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      key={t.id} 
                      className="kanban-card group"
                    >
                      <div className="flex items-start justify-between mb-2">
                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${priorityConfig[t.priority].color}`}>
                            {priorityConfig[t.priority].label}
                         </span>
                         
                         <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {stage !== 'in_progress' && stage !== 'done' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStage(t.id, 'in_progress'); }}
                                className="p-1 hover:bg-amber-100 text-amber-600 rounded-md transition-all active:scale-90"
                                title="Đang làm"
                              >
                                 <Clock className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {stage !== 'done' && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleUpdateStage(t.id, 'done'); }}
                                className="p-1 hover:bg-emerald-100 text-emerald-600 rounded-md transition-all active:scale-90"
                                title="Đã xong"
                              >
                                 <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                         </div>
                      </div>
                      
                      <h3 className="font-bold text-sm leading-snug mb-3">
                         {t.title}
                      </h3>
                      
                      <div className="flex items-center justify-between pt-2 border-t text-muted-foreground">
                         <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span className="text-[10px] font-medium">{t.assignee}</span>
                         </div>
                         <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px] font-medium">{t.dueDate}</span>
                         </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {items.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-10 opacity-20 filter grayscale">
                      <cfg.icon className="w-10 h-10 mb-2" />
                      <span className="text-xs font-bold">Trống</span>
                   </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TasksPage;
