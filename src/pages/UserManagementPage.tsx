import { useState } from "react";
import { users, branches, AppUserRole } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Mail, Phone, MoreVertical, MapPin, Shield, CheckCircle2, XCircle } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const UserManagementPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<AppUserRole | "all">("all");
  const [branchFilter, setBranchFilter] = useState<string | "all">("all");
  const navigate = useNavigate();

  const getRoleLabel = (role: AppUserRole) => {
    switch (role) {
      case "teacher": return { label: "Giáo viên", color: "bg-blue-100 text-blue-700 border-blue-200" };
      case "ta": return { label: "Trợ giảng", color: "bg-purple-100 text-purple-700 border-purple-200" };
      case "ops": return { label: "Vận hành", color: "bg-orange-100 text-orange-700 border-orange-200" };
      case "accounting": return { label: "Kế toán", color: "bg-green-100 text-green-700 border-green-200" };
      case "admin": return { label: "Admin", color: "bg-red-100 text-red-700 border-red-200" };
      default: return { label: role, color: "bg-gray-100 text-gray-700 border-gray-200" };
    }
  };

  const getBranchName = (branchId: string) => {
    return branches.find(b => b.id === branchId)?.name || "N/A";
  };

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                         u.email.toLowerCase().includes(search.toLowerCase()) ||
                         u.id.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesBranch = branchFilter === "all" || u.branchId === branchFilter;
    
    return matchesSearch && matchesRole && matchesBranch;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý User</h1>
          <p className="text-sm text-muted-foreground mt-1">Danh sách nhân sự, giảng viên và cộng tác viên trên toàn hệ thống.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md font-bold hover:opacity-90 transition shadow-sm active:scale-95">
          + Thêm User mới
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[280px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã hoặc email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            className="px-3 py-2 border rounded-md text-sm bg-card outline-none focus:ring-2 focus:ring-primary/20"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
          >
            <option value="all">Tất cả Vai trò</option>
            <option value="teacher">Giáo viên</option>
            <option value="ta">Trợ giảng</option>
            <option value="ops">Vận hành</option>
            <option value="accounting">Kế toán</option>
            <option value="admin">Admin</option>
          </select>

          <select 
            className="px-3 py-2 border rounded-md text-sm bg-card outline-none focus:ring-2 focus:ring-primary/20"
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
          >
            <option value="all">Tất cả Chi nhánh</option>
            {branches.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/20">
                <th className="text-left px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Họ và tên</th>
                <th className="text-left px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Vai trò</th>
                <th className="text-left px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Chi nhánh</th>
                <th className="text-center px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Trạng thái</th>
                <th className="text-right px-4 py-4 font-bold text-muted-foreground uppercase text-[10px] tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((u) => {
                const roleInfo = getRoleLabel(u.role);
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-primary/5 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/users/${u.id}`)}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-black shadow-sm border border-border group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                          {u.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground/90">{u.name}</p>
                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</span>
                            <span className="flex items-center gap-1 border-l pl-3"><Phone className="w-3 h-3" /> {u.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold border ${roleInfo.color} uppercase tracking-tight`}>
                        <Shield className="w-2.5 h-2.5" />
                        {roleInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {getBranchName(u.branchId)}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {u.status === "active" ? (
                        <div className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[10px] uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Hoạt động
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-rose-500 font-bold text-[10px] uppercase">
                          <XCircle className="w-3 h-3" /> Tạm nghỉ
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors border border-transparent hover:border-border">
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/users/${u.id}`)}>Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Khóa tài khoản</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Search className="w-12 h-12 opacity-10 mb-4" />
                      <p className="font-medium">Không tìm thấy user nào phù hợp với bộ lọc.</p>
                      <button 
                        onClick={() => { setSearch(""); setRoleFilter("all"); setBranchFilter("all"); }}
                        className="text-primary text-xs font-bold mt-2 hover:underline"
                      >
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;
