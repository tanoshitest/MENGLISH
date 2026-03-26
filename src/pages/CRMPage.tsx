import { useState } from "react";
import { leads, type Lead } from "@/data/mockData";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Phone, Mail, Calendar, DollarSign, Plus, Loader2, CheckCircle2 } from "lucide-react";
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

type Stage = Lead["stage"];

const stageConfig: Record<Stage, { label: string; colorClass: string }> = {
  new: { label: "Mới", colorClass: "bg-kanban-new" },
  nurturing: { label: "Đang chăm", colorClass: "bg-kanban-progress" },
  test: { label: "Chờ test", colorClass: "bg-kanban-done" },
  closed: { label: "Đã chốt", colorClass: "bg-kanban-closed" },
};

const stages: Stage[] = ["new", "nurturing", "test", "closed"];

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + "đ";

const CRMPage = () => {
  const [items, setItems] = useState<Lead[]>([...leads]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const targetStage = result.destination.droppableId as Stage;
    setItems((prev) =>
      prev.map((l) => (l.id === result.draggableId ? { ...l, stage: targetStage } : l))
    );
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) {
       toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc!");
       return;
    }

    setIsSubmitting(true);
    
    // Simulate server delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newLead: Lead = {
      id: `L-${Date.now()}`,
      name: newName,
      phone: newPhone,
      email: `${newName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      source: "Manual",
      interest: newInterest || "Chương trình tiếng Anh",
      value: 6000000 + Math.floor(Math.random() * 5000000), 
      assignee: "Phạm Thị Hoa",
      stage: "new",
      createdDate: new Date().toISOString().split('T')[0],
      note: "Hồ sơ tạo mới từ bản demo"
    };

    setItems(prev => [newLead, ...prev]);
    setIsSubmitting(false);
    setIsOpen(false);
    
    // Reset form
    setNewName("");
    setNewPhone("");
    setNewInterest("");

    toast.success("Khởi tạo hồ sơ Lead thành công!", {
      description: `Học viên ${newName} đã được thêm vào phễu tư vấn.`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    });
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">CRM & Tuyển sinh</h1>
          <p className="text-sm text-muted-foreground">Phễu tư vấn - Kéo thả để đổi trạng thái</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Lead mới
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-none shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Khởi tạo Lead mới</DialogTitle>
              <p className="text-sm text-muted-foreground">Nhập thông tin khách hàng tiềm năng để bắt đầu quy trình tư vấn.</p>
            </DialogHeader>
            <form onSubmit={handleCreateLead} className="space-y-6 pt-4">
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
                  <Label htmlFor="interest" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Quan tâm</Label>
                  <Input 
                    id="interest" 
                    placeholder="IELTS, TOEIC, Giao tiếp..." 
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="rounded-xl border-slate-200 focus:ring-primary/20"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-widest"
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

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Desktop: horizontal kanban */}
        <div className="hidden md:grid grid-cols-4 gap-4 flex-1 min-h-0">
          {stages.map((stage) => {
            const stageItems = items.filter((l) => l.stage === stage);
            const cfg = stageConfig[stage];
            return (
              <Droppable droppableId={stage} key={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col rounded-lg border ${snapshot.isDraggingOver ? "ring-2 ring-primary/30" : ""}`}
                  >
                    <div className={`px-3 py-2 rounded-t-lg ${cfg.colorClass} flex items-center justify-between`}>
                      <span className="font-medium text-sm">{cfg.label}</span>
                      <span className="text-xs bg-card rounded-full px-2 py-0.5 font-medium">{stageItems.length}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-secondary/30">
                      <AnimatePresence mode="popLayout">
                        {stageItems.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                className={`${snap.isDragging ? "z-50" : ""}`}
                              >
                                <motion.div
                                  layout
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.95 }}
                                  className={`kanban-card group ${snap.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}`}
                                >
                                  <p className="font-medium text-sm">{lead.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{lead.interest}</p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                    <Phone className="w-3 h-3" />
                                    <span>{lead.phone}</span>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-muted-foreground">{lead.assignee}</span>
                                    <span className="text-xs font-medium text-primary flex items-center gap-1">
                                      <DollarSign className="w-3 h-3" />
                                      {formatVND(lead.value)}
                                    </span>
                                  </div>
                                  {lead.note && (
                                    <p className="text-xs text-muted-foreground mt-2 italic border-t pt-1">"{lead.note}"</p>
                                  )}
                                </motion.div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>

        {/* Mobile: vertical list grouped by stage */}
        <div className="md:hidden space-y-4 flex-1 overflow-y-auto">
          {stages.map((stage) => {
            const stageItems = items.filter((l) => l.stage === stage);
            const cfg = stageConfig[stage];
            return (
              <div key={stage} className="rounded-lg border overflow-hidden">
                <div className={`px-3 py-2 ${cfg.colorClass} flex items-center justify-between`}>
                  <span className="font-medium text-sm">{cfg.label}</span>
                  <span className="text-xs bg-card rounded-full px-2 py-0.5 font-medium">{stageItems.length}</span>
                </div>
                <div className="divide-y">
                  {stageItems.map((lead) => (
                    <div key={lead.id} className="p-3">
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">{lead.interest} • {formatVND(lead.value)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{lead.assignee}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default CRMPage;
