import React, { useState } from "react";
import { students as initialStudents, classes, type Student } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Loader2, CheckCircle2 } from "lucide-react";
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
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const StudentsPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Student[]>([...initialStudents]);
  const [search, setSearch] = useState("");
  
  // Interactive Demo State
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLevel, setNewLevel] = useState("");

  const filtered = items.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStudent: Student = {
      id: `STU${100 + items.length}`,
      name: newName,
      avatar: newName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      email: `${newName.toLowerCase().replace(/\s+/g, '')}@email.com`,
      phone: newPhone,
      level: newLevel || "Chưa xếp lớp",
      enrollDate: new Date().toISOString().split('T')[0],
      status: "active",
      classIds: [],
      totalFee: 12000000,
      paidFee: 0,
      attendanceCount: 0,
      parentName: "Họ tên phụ huynh",
      parentPhone: newPhone,
      dob: "2015-01-01",
      notes: [],
      examResults: []
    };

    setItems(prev => [newStudent, ...prev]);
    setIsSubmitting(false);
    setIsOpen(false);
    
    setNewName("");
    setNewPhone("");
    setNewLevel("");
    
    toast.success("Hồ sơ học sinh đã được khởi tạo!", {
      description: `Học viên ${newName} đã được thêm vào hệ thống quản lý học tập.`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    });
  };

  const statusBadge = (status: Student["status"]) => {
    const map = {
      active: "bg-success/10 text-success",
      inactive: "bg-muted text-muted-foreground",
      graduated: "bg-primary/10 text-primary",
    };
    const labels = { active: "Đang học", inactive: "Tạm nghỉ", graduated: "Tốt nghiệp" };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status]}`}>{labels[status]}</span>;
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Học sinh</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Học sinh
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Thêm Học sinh mới</DialogTitle>
              <p className="text-sm text-muted-foreground italic">Khởi tạo hồ sơ học viên để bắt đầu quản lý học tập.</p>
            </DialogHeader>
            <form onSubmit={handleCreateStudent} className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Họ và tên *</Label>
                  <Input 
                    id="name" 
                    placeholder="Nguyễn Văn A" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="rounded-xl border-slate-200 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Số điện thoại *</Label>
                  <Input 
                    id="phone" 
                    placeholder="09xx xxx xxx" 
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="rounded-xl border-slate-200 focus:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="level" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Trình độ dự kiến</Label>
                  <Input 
                    id="level" 
                    placeholder="IELTS, Starter, 4CLC..." 
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="rounded-xl border-slate-200 focus:ring-primary/20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : "Lưu hồ sơ"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc mã..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <button className="flex items-center gap-1 px-3 py-2 border rounded-md text-sm text-muted-foreground hover:bg-secondary transition">
          <Filter className="w-4 h-4" /> Lọc
        </button>
      </div>

      {/* List View */}
      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Học sinh</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Trình độ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Lớp</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Học phí</th>
              </tr>
            </thead>
            <tbody className="divide-y relative">
              <AnimatePresence mode="popLayout">
                {filtered.map((s) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  key={s.id}
                  className="hover:bg-secondary/30 cursor-pointer transition-colors"
                  onClick={() => navigate(`/students/${s.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {s.avatar}
                      </div>
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.id} • {s.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{s.level}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {s.classIds.map((cid) => classes.find((c) => c.id === cid)?.name).filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">{statusBadge(s.status)}</td>
                  <td className="px-4 py-3 text-right hidden md:table-cell">
                    <span className={s.paidFee < s.totalFee ? "text-destructive font-medium" : "text-foreground"}>
                      {new Intl.NumberFormat("vi-VN").format(s.paidFee)}/{new Intl.NumberFormat("vi-VN").format(s.totalFee)}
                    </span>
                  </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
