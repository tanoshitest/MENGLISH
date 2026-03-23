import { useState } from "react";
import { tasks, type Task } from "@/data/mockData";

type Stage = Task["stage"];

const stageConfig: Record<Stage, { label: string; color: string }> = {
  todo: { label: "To Do", color: "bg-kanban-new" },
  in_progress: { label: "In Progress", color: "bg-kanban-progress" },
  done: { label: "Done", color: "bg-kanban-done" },
};

const priorityDot = (p: Task["priority"]) => {
  const map = { low: "bg-muted-foreground", medium: "bg-warning", high: "bg-destructive" };
  return <div className={`w-2 h-2 rounded-full ${map[p]}`} />;
};

const stages: Stage[] = ["todo", "in_progress", "done"];

const TasksPage = () => (
  <div className="p-4 md:p-6 space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold">Tasks & HR</h1>
      <button className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition">
        + Tạo task
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stages.map((stage) => {
        const items = tasks.filter((t) => t.stage === stage);
        const cfg = stageConfig[stage];
        return (
          <div key={stage} className="rounded-lg border">
            <div className={`px-3 py-2 rounded-t-lg ${cfg.color} flex items-center justify-between`}>
              <span className="font-medium text-sm">{cfg.label}</span>
              <span className="text-xs bg-card rounded-full px-2 py-0.5 font-medium">{items.length}</span>
            </div>
            <div className="p-2 space-y-2">
              {items.map((t) => (
                <div key={t.id} className="kanban-card">
                  <div className="flex items-start gap-2">
                    {priorityDot(t.priority)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{t.title}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        <span>{t.assignee}</span>
                        <span>{t.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default TasksPage;
