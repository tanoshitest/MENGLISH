import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { documents, classes, teachers } from "@/data/mockData";
import { 
  FileText, Download, Eye, Trash2, Search, Filter, Plus, 
  ShieldCheck, X, Check, Users, School, Globe 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { isAdmin, isTeacher } = useRole();
  const activeTeacherId = "TCH001"; 
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  // Mock permission state for the demo
  const [docPermissions, setDocPermissions] = useState<Record<string, { classId: string, allowedTeachers: string[] }>>(() => {
    const initial: Record<string, any> = {};
    documents.forEach(doc => {
      initial[doc.id] = { 
        classId: doc.classId, 
        allowedTeachers: doc.addedBy.includes("Admin") ? ["all"] : [teachers.find(t => doc.addedBy.includes(t.name))?.id || "TCH001"]
      };
    });
    return initial;
  });

  const teacherClassIds = classes
    .filter((cls) => cls.teacherId === activeTeacherId)
    .map((cls) => cls.id);

  const filteredDocuments = documents.filter((doc) => {
    if (isAdmin) return true;
    if (isTeacher) {
      const perms = docPermissions[doc.id];
      return perms.classId === "all" || teacherClassIds.includes(perms.classId) || perms.allowedTeachers.includes(activeTeacherId) || perms.allowedTeachers.includes("all");
    }
    return false;
  });

  const getClassName = (classId: string) => {
    if (classId === "all") return "Tất cả lớp";
    return classes.find((c) => c.id === classId)?.name || classId;
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "pdf": return "text-red-500";
      case "docx": return "text-blue-500";
      case "xlsx": return "text-green-500";
      case "pptx": return "text-orange-500";
      default: return "text-gray-500";
    }
  };

  const handleOpenPermissions = (doc: any) => {
    setSelectedDoc(doc);
    setShowPermissionModal(true);
  };

  const handleSavePermissions = () => {
    toast.success("Đã cập nhật phân quyền cho tài liệu: " + selectedDoc.title);
    setShowPermissionModal(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold italic underline decoration-primary/20 underline-offset-8">
            {isAdmin ? "Quản lý tài liệu" : "Tài liệu của tôi"}
          </h1>
          <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold tracking-wider">
            {isAdmin 
              ? "Hệ thống quản lý tài liệu tập trung" 
              : `Tài liệu lớp: ${teacherClassIds.join(", ")}`}
          </p>
        </div>
        {isAdmin && (
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition-all shadow-md active:scale-95">
            <Plus className="w-4 h-4" />
            Tải tài liệu lên
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
            <div className="p-4 border-b flex items-center gap-3 bg-secondary/10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tài liệu..." 
                  className="w-full pl-9 pr-4 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button className="p-2 border rounded-md hover:bg-secondary transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/5 font-bold uppercase text-[10px] tracking-tight">
                    <th className="text-left px-4 py-4 text-muted-foreground">Tài liệu</th>
                    <th className="text-left px-4 py-4 text-muted-foreground hidden md:table-cell">Lớp học</th>
                    <th className="text-left px-4 py-4 text-muted-foreground hidden lg:table-cell text-center">Ngày tải</th>
                    <th className="text-left px-4 py-4 text-muted-foreground hidden sm:table-cell text-center">Dung lượng</th>
                    <th className="text-right px-4 py-4 text-muted-foreground">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-primary/5 transition-colors group">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-lg bg-secondary/30 ${getIconColor(doc.type)} shadow-sm`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm leading-tight text-foreground/90">{doc.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-1.5 rounded">{doc.type}</span>
                              <span className="text-[10px] text-muted-foreground">Bởi: {doc.addedBy}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-[10px] px-2.5 py-1 bg-primary/10 text-primary rounded-full font-bold border border-primary/20 uppercase">
                          {getClassName(docPermissions[doc.id].classId)}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell text-muted-foreground text-xs text-center font-mono">
                        {doc.uploadDate}
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell text-muted-foreground text-xs text-center font-mono">
                        {doc.size}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-foreground" title="Xem">
                            <Eye className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button 
                              onClick={() => handleOpenPermissions(doc)}
                              className="p-2 hover:bg-amber-100 hover:text-amber-600 rounded-md transition-all text-muted-foreground hover:shadow-inner" 
                              title="Phân quyền"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button className="p-2 hover:bg-success/10 hover:text-success rounded-md transition-colors text-muted-foreground" title="Tải về">
                            <Download className="w-4 h-4" />
                          </button>
                          {isAdmin && (
                            <button className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors text-muted-foreground" title="Xóa">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-lg border p-5 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-muted-foreground mb-4">Thống kê lưu trữ</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end text-sm">
                <span className="text-muted-foreground">Tổng số tài liệu:</span>
                <span className="text-2xl font-black text-primary leading-none">{filteredDocuments.length}</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '24%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-secondary/40 p-2 rounded text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">PDFs</p>
                  <p className="text-lg font-black">{filteredDocuments.filter(d => d.type === 'pdf').length}</p>
                </div>
                <div className="bg-secondary/40 p-2 rounded text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Khác</p>
                  <p className="text-lg font-black">{filteredDocuments.filter(d => d.type !== 'pdf').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
            <h3 className="font-bold text-sm text-indigo-900 mb-2 flex items-center gap-2">
              <Globe className="w-4 h-4" /> Ghi chú phân quyền
            </h3>
            <p className="text-xs text-indigo-800 leading-relaxed font-medium">
              {isAdmin 
                ? "Tài liệu được phân quyền 'Tất cả lớp' sẽ hiển thị cho mọi giáo viên. Bạn có thể giới hạn tài liệu cho từng giáo viên cụ thể."
                : "Bạn chỉ thấy tài liệu được chỉ định cho các lớp của bạn hoặc tài liệu chung của trung tâm."}
            </p>
          </div>
        </div>
      </div>

      {/* Permission Modal */}
      <AnimatePresence>
        {showPermissionModal && selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPermissionModal(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-card border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b bg-secondary/10 flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  Phân quyền tài liệu
                </span>
                <button 
                  onClick={() => setShowPermissionModal(false)}
                  className="p-1 hover:bg-secondary rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 bg-secondary/20 p-3 rounded-lg border border-dashed">
                  <div className={`p-2 rounded bg-card ${getIconColor(selectedDoc.type)}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold truncate max-w-[250px]">{selectedDoc.title}</h4>
                    <p className="text-[10px] text-muted-foreground">ID: {selectedDoc.id} • {selectedDoc.size}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <School className="w-3 h-3" /> Chỉ định lớp học
                    </label>
                    <select 
                      className="w-full bg-background border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      defaultValue={docPermissions[selectedDoc.id].classId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        setDocPermissions(prev => ({
                          ...prev,
                          [selectedDoc.id]: { ...prev[selectedDoc.id], classId: newId }
                        }));
                      }}
                    >
                      <option value="all">Tất cả lớp học (Công khai)</option>
                      {classes.map(cls => (
                        <option key={cls.id} value={cls.id}>{cls.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                      <Users className="w-3 h-3" /> Giới hạn giáo viên
                    </label>
                    <div className="border rounded-md divide-y max-h-[160px] overflow-y-auto">
                      <div className="flex items-center gap-3 p-3 hover:bg-secondary/20 transition-colors">
                        <input 
                          type="checkbox" 
                          id="tch-all"
                          checked={docPermissions[selectedDoc.id].allowedTeachers.includes("all")}
                          onChange={(e) => {
                             const checked = e.target.checked;
                             setDocPermissions(prev => ({
                               ...prev,
                               [selectedDoc.id]: { 
                                 ...prev[selectedDoc.id], 
                                 allowedTeachers: checked ? ["all"] : [] 
                               }
                             }));
                          }}
                        />
                        <label htmlFor="tch-all" className="flex-1 text-sm font-medium cursor-pointer">Tất cả giáo viên</label>
                      </div>
                      {teachers.map(t => (
                        <div key={t.id} className="flex items-center gap-3 p-3 hover:bg-secondary/20 transition-colors">
                          <input 
                            type="checkbox" 
                            id={`tch-${t.id}`}
                            checked={docPermissions[selectedDoc.id].allowedTeachers.includes(t.id) || docPermissions[selectedDoc.id].allowedTeachers.includes("all")}
                            disabled={docPermissions[selectedDoc.id].allowedTeachers.includes("all")}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const current = docPermissions[selectedDoc.id].allowedTeachers;
                              setDocPermissions(prev => {
                                let newList = [...current];
                                if (checked) newList.push(t.id);
                                else newList = newList.filter(id => id !== t.id);
                                return {
                                  ...prev,
                                  [selectedDoc.id]: { ...prev[selectedDoc.id], allowedTeachers: newList }
                                };
                              });
                            }}
                          />
                          <div className="flex-1 flex items-center gap-2 cursor-pointer">
                            <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                              {t.avatar}
                            </div>
                            <label htmlFor={`tch-${t.id}`} className="text-sm cursor-pointer">{t.name}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-secondary/10 flex items-center justify-end gap-3">
                <button 
                  onClick={() => setShowPermissionModal(false)}
                  className="px-4 py-2 text-xs font-medium hover:bg-secondary rounded-md transition-colors"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={handleSavePermissions}
                  className="px-6 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-md hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" /> Lưu cập nhật
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentsPage;
