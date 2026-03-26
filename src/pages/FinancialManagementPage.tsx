import React, { useState } from "react";
import { useRole } from "@/contexts/RoleContext";
import { 
  financeRecords, 
  transactions as mockTransactions, 
  FinanceRecord, 
  Transaction 
} from "@/data/mockData";
import { 
  DollarSign, Wallet, Search, Filter, CreditCard, 
  Calendar, AlertCircle, CheckCircle2, Clock, 
  TrendingUp, TrendingDown, Plus, Download, 
  ArrowUpRight, ArrowDownRight, FileText, X,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + "đ";

const FinancialManagementPage = () => {
  const { isAdmin } = useRole();
  const [activeTab, setActiveTab] = useState<"tuition" | "accounting">("tuition");
  
  // States for Tuition
  const [tuitionSearch, setTuitionSearch] = useState("");
  const [tuitionStatusFilter, setTuitionStatusFilter] = useState<"all" | FinanceRecord["status"]>("all");
  
  // States for Accounting
  const [accountingTransactions, setAccountingTransactions] = useState<Transaction[]>(mockTransactions);
  const [accountingFilterType, setAccountingFilterType] = useState<"all" | "income" | "expense">("all");
  const [showAccountingModal, setShowAccountingModal] = useState<"none" | "income" | "expense">("none");

  if (!isAdmin) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-destructive">Không có quyền truy cập</h2>
        <p className="text-muted-foreground mt-2">Tính năng Tài chính chỉ dành cho Quản trị viên.</p>
      </div>
    );
  }

  // ---- TUITION LOGIC ----
  const tuitionRecords = financeRecords.filter(
    (r) => r.type === "income" && r.category === "Học phí"
  );
  const filteredTuition = tuitionRecords.filter((r) => {
    const matchSearch = r.description.toLowerCase().includes(tuitionSearch.toLowerCase());
    const matchStatus = tuitionStatusFilter === "all" || r.status === tuitionStatusFilter;
    return matchSearch && matchStatus;
  });
  const totalTuitionCollected = tuitionRecords.filter((r) => r.status === "paid").reduce((s, r) => s + r.amount, 0);
  const totalTuitionPending = tuitionRecords.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
  const totalTuitionOverdue = tuitionRecords.filter((r) => r.status === "overdue").reduce((s, r) => s + r.amount, 0);

  // ---- ACCOUNTING LOGIC ----
  const totalAccIncome = accountingTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalAccExpense = accountingTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalAccIncome - totalAccExpense;
  const filteredAccTransactions = accountingTransactions.filter(t => accountingFilterType === "all" || t.type === accountingFilterType);

  const handleCreateAccountingTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const category = form.category.value;
    const amount = Number(form.amount.value);
    const description = form.description.value;
    
    const newTrx: Transaction = {
      id: `TRX_NEW_${Date.now()}`,
      type: showAccountingModal as "income" | "expense",
      category: category as any,
      amount,
      date: new Date().toISOString().split('T')[0],
      description,
      createdBy: "Admin"
    };

    setAccountingTransactions([newTrx, ...accountingTransactions]);
    setShowAccountingModal("none");
    toast.success(`Đã tạo Phiếu ${newTrx.type === 'income' ? 'Thu' : 'Chi'} thành công!`);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden font-sans">
      {/* Internal Sidebar */}
      <div className="w-60 border-r bg-secondary/5 flex flex-col shrink-0">
        <div className="p-5 border-b">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phân loại tài chính</h2>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => setActiveTab("tuition")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors border text-left ${
              activeTab === "tuition" 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                : "bg-transparent text-muted-foreground hover:bg-secondary border-transparent"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-semibold">Quản lý Học phí</span>
          </button>
          <button
            onClick={() => setActiveTab("accounting")}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors border text-left ${
              activeTab === "accounting" 
                ? "bg-primary text-primary-foreground border-primary shadow-sm" 
                : "bg-transparent text-muted-foreground hover:bg-secondary border-transparent"
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-sm font-semibold">Kế toán & Thu chi</span>
          </button>
        </nav>
        <div className="p-4 border-t">
          <div className="p-4 bg-secondary/20 rounded-lg space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Lợi nhuận ròng</p>
            <p className={`text-sm font-bold ${netProfit >= 0 ? 'text-success' : 'text-destructive'}`}>{formatVND(netProfit)}</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-card/10">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            {activeTab === "tuition" ? (
              <>
                {/* Tuition Header */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Quản lý Học phí</h1>
                    <p className="text-sm text-muted-foreground">Theo dõi tình trạng đóng học phí của học sinh toàn bộ hệ thống.</p>
                  </div>
                </div>

                {/* Tuition KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase opacity-70 mb-1">Đã thu</p>
                    <p className="text-2xl font-bold text-success tracking-tight">{formatVND(totalTuitionCollected)}</p>
                  </div>
                  <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase opacity-70 mb-1">Chờ nộp</p>
                    <p className="text-2xl font-bold text-amber-600 tracking-tight">{formatVND(totalTuitionPending)}</p>
                  </div>
                  <div className="bg-card border rounded-lg p-6 shadow-sm">
                    <p className="text-xs font-semibold text-muted-foreground uppercase opacity-70 mb-1">Quá hạn</p>
                    <p className="text-2xl font-bold text-destructive tracking-tight">{formatVND(totalTuitionOverdue)}</p>
                  </div>
                </div>

                {/* Tuition Table Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" placeholder="Tìm theo tên học sinh..." 
                        value={tuitionSearch} onChange={(e) => setTuitionSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-card border rounded-md text-sm focus:ring-1 focus:ring-primary outline-none"
                      />
                    </div>
                    <div className="flex border rounded-md overflow-hidden bg-card">
                      {(["all", "paid", "pending", "overdue"] as const).map(s => (
                        <button 
                          key={s} onClick={() => setTuitionStatusFilter(s)}
                          className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors border-r last:border-0 ${
                            tuitionStatusFilter === s ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
                          }`}
                        >
                          {s === "all" ? "Tất cả" : s === "paid" ? "Đã nộp" : s === "pending" ? "Chờ nộp" : "Quá hạn"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/5 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold">Mã phiếu / Nội dung</th>
                          <th className="px-6 py-4 text-center font-bold">Ngày lập</th>
                          <th className="px-6 py-4 text-center font-bold">Trạng thái</th>
                          <th className="px-6 py-4 text-right font-bold">Học phí</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredTuition.map(r => (
                          <tr key={r.id} className="hover:bg-secondary/10 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-semibold text-foreground">{r.description}</p>
                              <p className="text-[10px] font-mono text-muted-foreground">{r.id}</p>
                            </td>
                            <td className="px-6 py-4 text-center text-xs text-muted-foreground">{r.date}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                r.status === "paid" ? "bg-success/5 text-success border-success/20" :
                                r.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                "bg-destructive/5 text-destructive border-destructive/20"
                              }`}>
                                {r.status === "paid" ? "Đã nộp" : r.status === "pending" ? "Chờ nộp" : "Quá hạn"}
                              </span>
                            </td>
                            <td className={`px-6 py-4 text-right font-bold ${
                              r.status === "paid" ? "text-success" : "text-destructive"
                            }`}>{formatVND(r.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Accounting Content */}
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h1 className="text-xl font-bold text-foreground">Kế toán & Thu chi</h1>
                    <p className="text-sm text-muted-foreground">Quản lý dòng tiền, quyết toán chi phí và theo dõi hạng mục thu chi.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowAccountingModal("income")}
                      className="px-4 py-2 bg-success text-white rounded-md font-bold text-xs hover:opacity-90 shadow-sm flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tạo phiếu thu
                    </button>
                    <button 
                      onClick={() => setShowAccountingModal("expense")}
                      className="px-4 py-2 bg-destructive text-white rounded-md font-bold text-xs hover:opacity-90 shadow-sm flex items-center gap-2"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tạo phiếu chi
                    </button>
                  </div>
                </div>

                {/* Accounting KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border rounded-lg p-6 shadow-sm border-l-4 border-l-success">
                    <p className="text-xs font-semibold text-muted-foreground uppercase opacity-70 mb-1">Tổng Thu (Tháng này)</p>
                    <p className="text-2xl font-bold text-success tracking-tight">{formatVND(totalAccIncome)}</p>
                  </div>
                  <div className="bg-card border rounded-lg p-6 shadow-sm border-l-4 border-l-destructive">
                    <p className="text-xs font-semibold text-muted-foreground uppercase opacity-70 mb-1">Tổng Chi (Tháng này)</p>
                    <p className="text-2xl font-bold text-destructive tracking-tight">{formatVND(totalAccExpense)}</p>
                  </div>
                  <div className={`p-6 rounded-lg shadow-sm border border-transparent ${netProfit >= 0 ? "bg-primary text-primary-foreground" : "bg-destructive text-white"}`}>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">Lợi Nhuận Ròng</p>
                    <p className="text-2xl font-bold tracking-tight">{formatVND(netProfit)}</p>
                  </div>
                </div>

                {/* Accounting Table Area */}
                <div className="space-y-4">
                  <div className="flex border rounded-md overflow-hidden bg-card w-fit">
                    {(["all", "income", "expense"] as const).map(type => (
                      <button 
                        key={type} onClick={() => setAccountingFilterType(type)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase transition-colors border-r last:border-0 ${
                          accountingFilterType === type ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {type === "all" ? "Tất cả" : type === "income" ? "Khoản Thu" : "Khoản Chi"}
                      </button>
                    ))}
                  </div>

                  <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/5 border-b text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 text-left font-bold">Nội dung chứng từ</th>
                          <th className="px-6 py-4 text-left font-bold">Phân loại</th>
                          <th className="px-6 py-4 text-center font-bold">Ngày</th>
                          <th className="px-6 py-4 text-right font-bold">Số tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredAccTransactions.map(trx => (
                          <tr key={trx.id} className="hover:bg-secondary/10 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-sm flex items-center justify-center shrink-0 border ${
                                  trx.type === 'income' ? 'bg-success/5 text-success border-success/10' : 'bg-destructive/5 text-destructive border-destructive/10'
                                }`}>
                                  {trx.type === 'income' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">{trx.description}</p>
                                  <p className="text-[10px] font-mono text-muted-foreground">{trx.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 border rounded-md text-[10px] font-bold uppercase bg-secondary/20">
                                <FileText className="w-3 h-3" /> {trx.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-xs text-muted-foreground">{trx.date}</td>
                            <td className={`px-6 py-4 text-right font-bold ${
                              trx.type === 'income' ? 'text-success' : 'text-destructive'
                            }`}>
                              {trx.type === 'income' ? '+' : '-'}{formatVND(trx.amount).replace('đ', '')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Accounting Modal */}
      {showAccountingModal !== "none" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div className="bg-card w-full max-w-md rounded-lg shadow-2xl border overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center bg-secondary/10">
              <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${
                showAccountingModal === 'income' ? 'text-success' : 'text-destructive'
              }`}>
                {showAccountingModal === 'income' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {showAccountingModal === 'income' ? 'Tạo Phiếu Thu' : 'Tạo Phiếu Chi'}
              </h2>
              <button onClick={() => setShowAccountingModal("none")} className="p-1 hover:bg-secondary rounded-md">
                <X className="w-4 h-4 opacity-50" />
              </button>
            </div>

            <form onSubmit={handleCreateAccountingTransaction} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Danh mục giao dịch</label>
                <select name="category" required className="w-full h-10 px-3 bg-card border rounded-md font-semibold text-sm focus:ring-1 focus:ring-primary outline-none">
                  {showAccountingModal === 'income' ? (
                    <>
                      <option value="Học phí">Học phí</option>
                      <option value="Khác">Phụ thu / Khác</option>
                    </>
                  ) : (
                    <>
                      <option value="Lương">Lương nhân sự</option>
                      <option value="Mặt bằng">Chi phí Mặt bằng</option>
                      <option value="Marketing">Chi phí Marketing</option>
                      <option value="Khác">Khác</option>
                    </>
                  )}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Số tiền (VND)</label>
                <input type="number" name="amount" required min="1000" step="1000" placeholder="0" className="w-full h-10 px-3 bg-card border rounded-md font-bold text-base focus:ring-1 focus:ring-primary outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Diễn giải</label>
                <textarea name="description" required rows={3} placeholder="Ghi chú nội dung..." className="w-full p-3 bg-card border rounded-md text-sm font-medium focus:ring-1 focus:ring-primary outline-none resize-none" />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowAccountingModal("none")} className="flex-1 h-10 font-bold text-xs text-muted-foreground hover:bg-secondary border rounded-md transition-colors">Hủy bỏ</button>
                <button type="submit" className={`flex-1 h-10 font-bold text-white text-xs rounded-md shadow-sm transition-opacity hover:opacity-90 ${
                  showAccountingModal === 'income' ? 'bg-success' : 'bg-destructive'
                }`}>
                  Lưu dữ liệu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagementPage;
