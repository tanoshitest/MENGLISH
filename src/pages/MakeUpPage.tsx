import React, { useState } from "react";
import { 
  Search, Calendar, ChevronDown, ListFilter, 
  Trash2, RefreshCw, Plus, Clock, 
  CheckCircle2, AlertCircle, History,
  FileText, User, LayoutGrid, List, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { students, mockMakeUpRecords, classes } from "@/data/mockData";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type TabType = "pending" | "scheduled" | "completed";

const MakeUpPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [records, setRecords] = useState([...mockMakeUpRecords]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const filteredRecords = records.filter(r => {
    const student = students.find(s => s.id === r.studentId);
    const matchesSearch = student?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return r.status === activeTab && matchesSearch;
  });

  const handleUpdateStatus = (id: string, nextStatus: TabType) => {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: nextStatus } : r));
    toast.success("Đã cập nhật trạng thái học bù!");
  };

  const handleAddAbsent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) return;
    
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRecord = {
      id: `MUP${100 + records.length}`,
      studentId: selectedStudentId,
      absentDate: new Date().toISOString().split('T')[0],
      status: "pending" as const,
      note: "Yêu cầu từ Admin"
    };

    setRecords(prev => [newRecord, ...prev]);
    setIsAdding(false);
    setIsAddOpen(false);
    toast.success("Đã thêm học sinh vào danh sách học bù", {
      description: "Học sinh hiện đang ở tab 'Chưa xếp lịch'."
    });
  };

  const tabs = [
    { id: "pending", label: "Chưa xếp lịch", color: "text-amber-600", bg: "bg-amber-100" },
    { id: "scheduled", label: "Đã xếp lịch", color: "text-blue-600", bg: "bg-blue-100" },
    { id: "completed", label: "Đã học", color: "text-emerald-600", bg: "bg-emerald-100" },
  ];

  return (
    <div className="p-6 bg-[#f8fafc] min-h-full space-y-6">
      {/* Header Area */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-black text-foreground">Danh sách học bù</h1>
            </div>
            <p className="text-sm text-muted-foreground font-medium">Quản lý lộ trình học bù cho học viên vắng tiết.</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl font-bold bg-primary shadow-lg shadow-primary/20">
                <Plus className="mr-2 w-4 h-4" /> Thêm học viên vắng
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Thêm yêu cầu học bù</DialogTitle>
                <p className="text-sm text-muted-foreground italic">Chỉ hiển thị các học sinh có lịch vắng gần đây.</p>
              </DialogHeader>
              <form onSubmit={handleAddAbsent} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Chọn học sinh</Label>
                  <select 
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                  >
                    <option value="">Chọn học sinh...</option>
                    {students.slice(0, 10).map(s => (
                      <option key={s.id} value={s.id}>{s.name} - {s.level}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Lý do nghỉ</Label>
                  <Input placeholder="Vd: Ốm nặng, kẹt xe..." className="h-12 rounded-xl border-slate-200" />
                </div>
                <DialogFooter>
                  <Button disabled={isAdding} className="w-full h-12 rounded-xl font-black uppercase tracking-widest">
                    {isAdding ? "Đang xử lý..." : "Xác nhận thêm"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex p-1 bg-secondary/30 rounded-2xl overflow-hidden relative">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`relative px-6 py-2.5 text-xs font-black transition-all rounded-xl ${active ? "text-primary z-10" : "text-slate-500 hover:text-slate-900"}`}
                >
                  {active && (
                    <motion.div 
                      layoutId="makeup-tab"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm học sinh..." 
              className="pl-10 h-10 border-none bg-secondary/30 rounded-xl text-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white border rounded-2xl shadow-xl overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#f8fafc]">
                <th className="p-4 text-left text-[10px] font-black uppercase text-muted-foreground border-b border-r w-24">Mã</th>
                <th className="p-4 text-left text-[10px] font-black uppercase text-muted-foreground border-b border-r min-w-[200px]">Họ tên</th>
                <th className="p-4 text-left text-[10px] font-black uppercase text-muted-foreground border-b border-r w-32">Ngày nghỉ</th>
                <th className="p-4 text-left text-[10px] font-black uppercase text-muted-foreground border-b border-r min-w-[150px]">Ngày học bù</th>
                <th className="p-4 text-left text-[10px] font-black uppercase text-muted-foreground border-b border-r min-w-[150px]">Learn with</th>
                <th className="p-4 text-left text-[10px] font-black uppercase text-muted-foreground border-b border-r min-w-[150px]">Ghi chú</th>
                <th className="p-4 text-center text-[10px] font-black uppercase text-muted-foreground border-b min-w-[120px]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredRecords.map((record) => {
                  const student = students.find(s => s.id === record.studentId);
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={record.id} 
                      className="group hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 border-b border-r text-xs font-black text-slate-400">{student?.id.replace("STU", "HS")}</td>
                      <td className="p-4 border-b border-r">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-primary">{student?.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">{student?.phone}</span>
                          <span className="text-[10px] text-slate-400 italic">Lớp: {classes.find(c => c.id === student?.classIds[0])?.name}</span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-r">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold">{record.absentDate}</span>
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md w-max">Có phép</span>
                        </div>
                      </td>
                      <td className="p-4 border-b border-r">
                        {activeTab === "pending" ? (
                          <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                             <Calendar className="w-3 h-3 text-slate-400" />
                             <span className="text-[11px] text-slate-400">Chưa chọn</span>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-slate-700">{record.makeUpDate}</span>
                        )}
                      </td>
                      <td className="p-4 border-b border-r">
                        <input 
                          type="text" 
                          placeholder="Nhập lớp/GV" 
                          defaultValue={record.learnWith}
                          className="w-full text-xs font-bold bg-transparent outline-none focus:text-primary transition-colors" 
                        />
                      </td>
                      <td className="p-4 border-b border-r">
                        <input 
                          type="text" 
                          placeholder="Ghi chú thêm..." 
                          defaultValue={record.note}
                          className="w-full text-xs text-muted-foreground bg-transparent outline-none focus:text-slate-900 transition-colors" 
                        />
                      </td>
                      <td className="p-4 border-b text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-8 rounded-lg text-[10px] font-black px-3"
                            onClick={() => {
                              const next = activeTab === "pending" ? "scheduled" : activeTab === "scheduled" ? "completed" : "completed";
                              if (next !== activeTab) handleUpdateStatus(record.id, next as TabType);
                            }}
                          >
                            {activeTab === "pending" ? "XẾP LỊCH" : activeTab === "scheduled" ? "HOÀN THÀNH" : "CẬP NHẬT"}
                          </Button>
                          <button className="p-1.5 hover:bg-destructive/10 text-slate-400 hover:text-destructive rounded-lg transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filteredRecords.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
              <ClipboardCheck className="w-8 h-8 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-400">Trống trơn!</p>
              <p className="text-xs text-slate-300 font-medium italic">Không tìm thấy yêu cầu học bù nào ở trạng thái này.</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend & Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Quy trình xử lý học bù</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
              <span className="absolute top-2 right-2 text-[10px] font-black text-slate-300">01</span>
              <p className="text-xs font-black mb-1">Điểm danh nghỉ</p>
              <p className="text-[10px] text-muted-foreground italic">Ghi nhận vắng tại bảng điểm danh.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
               <span className="absolute top-2 right-2 text-[10px] font-black text-slate-300">02</span>
              <p className="text-xs font-black mb-1">Xếp lịch bù</p>
              <p className="text-[10px] text-muted-foreground italic">Chọn ngày và lớp học ghép cho HS.</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
               <span className="absolute top-2 right-2 text-[10px] font-black text-slate-300">03</span>
              <p className="text-xs font-black mb-1">Xác nhận học</p>
              <p className="text-[10px] text-muted-foreground italic">Đánh dấu hoàn thành khi HS đã bù.</p>
            </div>
          </div>
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-sm font-black text-primary mb-2">Thống kê buổi bù</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-bold">Chưa xử lý:</span>
                <span className="font-black text-amber-600">12 buổi</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-bold">Trung bình bù:</span>
                <span className="font-black text-primary">2.4 ngày/vắng</span>
              </div>
              <Button className="w-full mt-2 h-10 rounded-xl bg-primary shadow-lg shadow-primary/20 text-xs font-black uppercase">
                XUẤT BÁO CÁO CHI TIẾT
              </Button>
            </div>
          </div>
          <Clock className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/10 group-hover:rotate-12 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
};

export default MakeUpPage;
