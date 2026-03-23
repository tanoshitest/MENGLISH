import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, UserCog,
  Headphones, DollarSign, ClipboardList, Settings, Menu, X,
  ChevronRight, School, FileText
} from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "CRM & Tuyển sinh", path: "/crm", icon: Users },
  { label: "Khóa học", path: "/courses", icon: BookOpen },
  { label: "Lớp học", path: "/classes", icon: School },
  { label: "Học sinh", path: "/students", icon: GraduationCap },
  { label: "Giáo viên", path: "/teachers", icon: UserCog },
  { label: "Tài chính", path: "/finance", icon: DollarSign, adminOnly: true },
  { label: "Tasks & HR", path: "/tasks", icon: ClipboardList },
  { label: "Tài liệu", path: "/documents", icon: FileText },
  { label: "Cấu hình", path: "/settings", icon: Settings, adminOnly: true },
];

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, toggleRole, isAdmin } = useRole();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNav = navItems.filter((item) => !item.adminOnly || isAdmin);
  const currentPage = navItems.find((n) => n.path === location.pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
            <School className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-primary text-sm">MENGLISH PROTOTYPE</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {filteredNav.map((item) => {
            const active = location.pathname === item.path;
            const label = item.path === "/classes" 
              ? (isAdmin ? "Quản lý lớp học" : "Lớp đc phân công")
              : item.label;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-muted mb-1 px-3">Vai trò hiện tại</div>
          <button
            onClick={toggleRole}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-sidebar-accent text-sidebar-accent-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <div className={`w-2 h-2 rounded-full ${isAdmin ? "bg-kpi-blue" : "bg-kpi-green"}`} />
            {isAdmin ? "Admin" : "Giảng viên"}
            <ChevronRight className="w-3 h-3 ml-auto" />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-64 bg-sidebar z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                    <School className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-sidebar-primary text-sm">MENGLISH PROTOTYPE</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
                {filteredNav.map((item) => {
                  const active = location.pathname === item.path;
                  const label = item.path === "/classes" 
                    ? (isAdmin ? "Quản lý lớp học" : "Lớp đc phân công")
                    : item.label;
                  return (
                    <button
                      key={item.path}
                      onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {label}
                    </button>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-sidebar-border">
                <button
                  onClick={toggleRole}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-sidebar-accent text-sidebar-accent-foreground"
                >
                  <div className={`w-2 h-2 rounded-full ${isAdmin ? "bg-kpi-blue" : "bg-kpi-green"}`} />
                  {isAdmin ? "Admin" : "Giảng viên"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 bg-card border-b flex items-center justify-between px-4 flex-shrink-0" style={{ boxShadow: "var(--topbar-shadow)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-muted-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div className="odoo-breadcrumb">
              {currentPage && (
                <>
                  <currentPage.icon className="w-4 h-4" />
                  <span className="font-medium text-foreground">
                    {currentPage.path === "/classes" 
                      ? (isAdmin ? "Quản lý lớp học" : "Lớp đc phân công")
                      : currentPage.label}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleRole}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors hover:bg-secondary"
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${isAdmin ? "bg-kpi-blue" : "bg-kpi-green"}`} />
              Switch: {isAdmin ? "Admin" : "Giảng viên"}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {isAdmin ? "AD" : "GV"}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
