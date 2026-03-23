import React from "react";
import { useRole } from "@/contexts/RoleContext";
import { documents, classes, teachers } from "@/data/mockData";
import { FileText, Download, Eye, Trash2, Search, Filter, Plus } from "lucide-react";

const DocumentsPage = () => {
  const { isAdmin, isTeacher } = useRole();
  const activeTeacherId = "TCH001"; // Mocked active teacher for prototype

  // If teacher, filter classes taught by this teacher
  const teacherClassIds = classes
    .filter((cls) => cls.teacherId === activeTeacherId)
    .map((cls) => cls.id);

  // Filter documents based on role
  const filteredDocuments = documents.filter((doc) => {
    if (isAdmin) return true;
    if (isTeacher) {
      return doc.classId === "all" || teacherClassIds.includes(doc.classId);
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

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Quản lý tài liệu</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isAdmin 
              ? "Hệ thống quản lý tất cả tài liệu giáo trình và bài tập." 
              : `Tài liệu các lớp đang giảng dạy: ${teacherClassIds.join(", ")}`}
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition">
          <Plus className="w-4 h-4" />
          Tải tài liệu lên
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-4">
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="p-4 border-b flex items-center gap-3 bg-secondary/20">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tài liệu..." 
                  className="w-full pl-9 pr-4 py-2 bg-background border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button className="p-2 border rounded-md hover:bg-secondary transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary/10">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tài liệu</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Lớp học</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Ngày tải lên</th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Dung lượng</th>
                    <th className="text-right px-4 py-3 font-medium text-muted-foreground">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-secondary/30 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-secondary/50 ${getIconColor(doc.type)}`}>
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{doc.title}</p>
                            <p className="text-[10px] text-muted-foreground uppercase">{doc.type} • Tải lên bởi {doc.addedBy}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs px-2 py-1 bg-primary/5 text-primary rounded-full font-medium border border-primary/10">
                          {getClassName(doc.classId)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs">
                        {doc.uploadDate}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground text-xs">
                        {doc.size}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-primary/10 hover:text-primary rounded-md transition-colors text-muted-foreground" title="Xem">
                            <Eye className="w-4 h-4" />
                          </button>
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
                  {filteredDocuments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        Không tìm thấy tài liệu nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold text-sm mb-3">Thống kê tài liệu</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tổng số:</span>
                <span className="font-bold">{filteredDocuments.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">PDFs:</span>
                <span className="font-medium">{filteredDocuments.filter(d => d.type === 'pdf').length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Khác:</span>
                <span className="font-medium">{filteredDocuments.filter(d => d.type !== 'pdf').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-lg border border-primary/10 p-4">
            <h3 className="font-semibold text-sm text-primary mb-2">Ghi chú</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isAdmin 
                ? "Dung lượng lưu trữ hiện tại: 1.2 GB / 5.0 GB. Bạn có quyền xóa tài liệu của giáo viên khác."
                : "Giảng viên chỉ có thể xem tài liệu của các lớp mình phụ trách."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;
