import { useState } from "react";
import { financeRecords, type FinanceRecord } from "@/data/mockData";
import { ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + "đ";

const statusBadge = (s: FinanceRecord["status"]) => {
  const map = {
    paid: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    overdue: "bg-destructive/10 text-destructive",
  };
  const labels = { paid: "Đã TT", pending: "Chờ TT", overdue: "Quá hạn" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[s]}`}>{labels[s]}</span>;
};

const FinancePage = () => {
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">("all");
  const filtered = financeRecords.filter((r) => typeFilter === "all" || r.type === typeFilter);
  const totalIncome = financeRecords.filter((r) => r.type === "income").reduce((s, r) => s + r.amount, 0);
  const totalExpense = financeRecords.filter((r) => r.type === "expense").reduce((s, r) => s + r.amount, 0);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <h1 className="text-xl font-bold">Tài chính - Kế toán</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="kpi-card kpi-card-green">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-success" />
            <span className="text-sm text-muted-foreground">Tổng thu</span>
          </div>
          <p className="text-2xl font-bold mt-1">{formatVND(totalIncome)}</p>
        </div>
        <div className="kpi-card kpi-card-rose">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="w-4 h-4 text-destructive" />
            <span className="text-sm text-muted-foreground">Tổng chi</span>
          </div>
          <p className="text-2xl font-bold mt-1">{formatVND(totalExpense)}</p>
        </div>
        <div className="kpi-card kpi-card-blue">
          <span className="text-sm text-muted-foreground">Lợi nhuận ròng</span>
          <p className="text-2xl font-bold mt-1">{formatVND(totalIncome - totalExpense)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {(["all", "income", "expense"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
              typeFilter === t ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            {t === "all" ? "Tất cả" : t === "income" ? "Thu" : "Chi"}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Loại</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Mô tả</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Danh mục</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Ngày</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Trạng thái</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    {r.type === "income" ? (
                      <ArrowUpRight className="w-4 h-4 text-success" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-destructive" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.description}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.category}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{r.date}</td>
                  <td className="px-4 py-3">{statusBadge(r.status)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${r.type === "income" ? "text-success" : "text-destructive"}`}>
                    {r.type === "income" ? "+" : "-"}{formatVND(r.amount)}
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

export default FinancePage;
