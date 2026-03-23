import { useState } from "react";
import { students, classes, type Student } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";

const StudentsPage = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filtered = students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.id.toLowerCase().includes(search.toLowerCase())
  );

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
        <button className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition">
          + Thêm học sinh
        </button>
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
            <tbody className="divide-y">
              {filtered.map((s) => (
                <tr
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;
