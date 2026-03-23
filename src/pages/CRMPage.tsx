import { useState } from "react";
import { leads, type Lead } from "@/data/mockData";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { Phone, Mail, Calendar, DollarSign } from "lucide-react";

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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const targetStage = result.destination.droppableId as Stage;
    setItems((prev) =>
      prev.map((l) => (l.id === result.draggableId ? { ...l, stage: targetStage } : l))
    );
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">CRM & Tuyển sinh</h1>
          <p className="text-sm text-muted-foreground">Phễu tư vấn - Kéo thả để đổi trạng thái</p>
        </div>
        <button className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition">
          + Lead mới
        </button>
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
                      {stageItems.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              className={`kanban-card ${snap.isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}`}
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
                            </div>
                          )}
                        </Draggable>
                      ))}
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
