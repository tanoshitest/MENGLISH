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
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">
      {/* Internal Sidebar */}
      <div className="w-64 border-r bg-secondary/10 flex flex-col shrink-0">
        <div className="p-6 border-b bg-card/50">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Tài chính</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("tuition")}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              activeTab === "tuition" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                : "hover:bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-bold">Quản lý Học phí</span>
            </div>
            {activeTab === "tuition" && <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setActiveTab("accounting")}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
              activeTab === "accounting" 
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]" 
                : "hover:bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-4 h-4" />
              <span className="text-sm font-bold">Kế toán & Thu chi</span>
            </div>
            {activeTab === "accounting" && <ChevronRight className="w-4 h-4" />}
          </button>
        </nav>
        <div className="p-4 border-t bg-secondary/5">
          <div className="flex items-center gap-3 p-3 bg-card rounded-xl border border-dashed text-xs text-muted-foreground">
            <TrendingUp className="w-4 h-4 text-success" />
            <span>Lợi nhuận ròng: <b className="text-foreground">{formatVND(netProfit)}</b></span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto">
          <div className="p-6 space-y-8 animate-in fade-in duration-500">
            {activeTab === "tuition" ? (
              <>
                {/* Tuition Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black">Quản lý Học phí</h1>
                    <p className="text-sm text-muted-foreground">Theo dõi phí đào tạo và tình trạng thanh toán của học sinh.</p>
                  </div>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-success text-white text-sm rounded-xl font-bold hover:bg-success/90 transition shadow-lg active:scale-95">
                    <Plus className="w-4 h-4" /> Tạo phiếu thu học phí
                  </button>
                </div>

                {/* Tuition KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-success/5 rounded-tl-full transition-transform group-hover:scale-110" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Đã thu</p>
                    <p className="text-3xl font-black text-success tracking-tight">{formatVND(totalTuitionCollected)}</p>
                  </div>
                  <div className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-500/5 rounded-tl-full transition-transform group-hover:scale-110" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Chờ nộp</p>
                    <p className="text-3xl font-black text-amber-600 tracking-tight">{formatVND(totalTuitionPending)}</p>
                  </div>
                  <div className="bg-card border-none shadow-[0_8px_30_rgb(0,0,0,0.04)] rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-destructive/5 rounded-tl-full transition-transform group-hover:scale-110" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Quá hạn</p>
                    <p className="text-3xl font-black text-destructive tracking-tight">{formatVND(totalTuitionOverdue)}</p>
                  </div>
                </div>

                {/* Tuition Table Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="relative flex-1 min-w-[240px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" placeholder="Tìm theo tên học sinh..." 
                        value={tuitionSearch} onChange={(e) => setTuitionSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-card border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-shadow"
                      />
                    </div>
                    <div className="flex p-1 bg-secondary/20 rounded-xl">
                      {(["all", "paid", "pending", "overdue"] as const).map(s => (
                        <button 
                          key={s} onClick={() => setTuitionStatusFilter(s)}
                          className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                            tuitionStatusFilter === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {s === "all" ? "Tất cả" : s === "paid" ? "Đã nộp" : s === "pending" ? "Chờ nộp" : "Quá hạn"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/10 border-b text-[10px] font-black text-muted-foreground uppercase">
                        <tr>
                          <th className="px-6 py-4 text-left">Học sinh / Mô tả</th>
                          <th className="px-6 py-4 text-center">Ngày lập</th>
                          <th className="px-6 py-4 text-center">Trạng thái</th>
                          <th className="px-6 py-4 text-right">Học phí</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredTuition.map(r => (
                          <tr key={r.id} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                            <td className="px-6 py-4">
                              <p className="font-bold text-foreground group-hover:text-primary transition-colors">{r.description}</p>
                              <p className="text-[10px] font-mono text-muted-foreground opacity-60">{r.id}</p>
                            </td>
                            <td className="px-6 py-4 text-center font-medium text-muted-foreground text-xs">{r.date}</td>
                            <td className="px-6 py-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                                r.status === "paid" ? "bg-success/10 text-success border-success/20" :
                                r.status === "pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                                "bg-destructive/10 text-destructive border-destructive/20"
                              }`}>
                                {r.status === "paid" ? "Đã nộp" : r.status === "pending" ? "Chờ nộp" : "Quá hạn"}
                              </span>
                            </td>
                            <td className={`px-6 py-4 text-right font-black text-base ${
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
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black">Kế toán & Thu chi</h1>
                    <p className="text-sm text-muted-foreground">Theo dõi dòng tiền, chi phí vận hành và lợi nhuận.</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowAccountingModal("income")}
                      className="px-4 py-2 bg-success text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-md flex items-center gap-2"
                    >
                      <TrendingUp className="w-4 h-4" /> Báo Thu
                    </button>
                    <button 
                      onClick={() => setShowAccountingModal("expense")}
                      className="px-4 py-2 bg-destructive text-white rounded-xl font-bold text-sm hover:opacity-90 shadow-md flex items-center gap-2"
                    >
                      <TrendingDown className="w-4 h-4" /> Báo Chi
                    </button>
                  </div>
                </div>

                {/* Accounting KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 border-l-4 border-l-success">
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Tổng Thu</p>
                    <p className="text-3xl font-black text-success tracking-tight">{formatVND(totalAccIncome)}</p>
                  </div>
                  <div className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl p-6 border-l-4 border-l-destructive">
                    <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60 mb-2">Tổng Chi</p>
                    <p className="text-3xl font-black text-destructive tracking-tight">{formatVND(totalAccExpense)}</p>
                  </div>
                  <div className={`p-6 rounded-2xl shadow-lg relative overflow-hidden group ${netProfit >= 0 ? "bg-primary text-primary-foreground shadow-primary/20" : "bg-destructive text-white"}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-8 -mt-8" />
                    <p className="relative text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Lợi Nhuận Ròng</p>
                    <p className="relative text-3xl font-black tracking-tight">{formatVND(netProfit)}</p>
                  </div>
                </div>

                {/* Accounting Table Area */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex p-1 bg-secondary/20 rounded-xl">
                      {(["all", "income", "expense"] as const).map(type => (
                        <button 
                          key={type} onClick={() => setAccountingFilterType(type)}
                          className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                            accountingFilterType === type ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {type === "all" ? "Tất cả" : type === "income" ? "Khoản Thu" : "Khoản Chi"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/10 border-b text-[10px] font-black text-muted-foreground uppercase">
                        <tr>
                          <th className="px-6 py-4 text-left">Chứng từ / Diễn giải</th>
                          <th className="px-6 py-4 text-left">Phân loại</th>
                          <th className="px-6 py-4 text-center">Ngày</th>
                          <th className="px-6 py-4 text-right">Số tiền</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filteredAccTransactions.map(trx => (
                          <tr key={trx.id} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                                  trx.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                                }`}>
                                  {trx.type === 'income' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                </div>
                                <div>
                                  <p className="font-bold text-foreground group-hover:text-primary transition-colors">{trx.description}</p>
                                  <p className="text-[10px] font-mono text-muted-foreground opacity-60">{trx.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-md text-[10px] font-black uppercase bg-secondary/30">
                                <FileText className="w-3 h-3" /> {trx.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-xs font-medium text-muted-foreground">{trx.date}</td>
                            <td className={`px-6 py-4 text-right font-black text-base ${
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

      {/* Accounting Modal (keep logic from AccountingPage) */}
      <AnimatePresence>
        {showAccountingModal !== "none" && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, rotateX: -10 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.9, opacity: 0, rotateX: -10 }}
              className="bg-card w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden p-8 space-y-6"
            >
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-black uppercase tracking-tight flex items-center gap-3 ${
                  showAccountingModal === 'income' ? 'text-success' : 'text-destructive'
                }`}>
                  {showAccountingModal === 'income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                  {showAccountingModal === 'income' ? 'Lập Phiếu Thu' : 'Lập Phiếu Chi'}
                </h2>
                <button onClick={() => setShowAccountingModal("none")} className="p-2 hover:bg-secondary rounded-full transition-transform hover:rotate-90">
                  <X className="w-6 h-6 opacity-40" />
                </button>
              </div>

              <form onSubmit={handleCreateAccountingTransaction} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Danh mục giao dịch</label>
                  <select name="category" required className="w-full h-12 px-4 bg-secondary/20 border-none rounded-2xl font-bold focus:ring-2 focus:ring-primary outline-none">
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

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Số tiền (VND)</label>
                  <input type="number" name="amount" required min="1000" step="1000" placeholder="0" className="w-full h-12 px-4 bg-secondary/20 border-none rounded-2xl font-black text-xl focus:ring-2 focus:ring-primary outline-none" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-muted-foreground uppercase ml-1">Diễn giải</label>
                  <textarea name="description" required rows={3} placeholder="Ghi chú nội dung..." className="w-full p-4 bg-secondary/20 border-none rounded-2xl font-medium focus:ring-2 focus:ring-primary outline-none resize-none" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setShowAccountingModal("none")} className="flex-1 h-12 font-bold text-muted-foreground hover:bg-secondary rounded-2xl transition-colors">Hủy</button>
                  <button type="submit" className={`flex-1 h-12 font-black text-white rounded-2xl shadow-xl transition-all active:scale-95 ${
                    showAccountingModal === 'income' ? 'bg-success hover:bg-success/90' : 'bg-destructive hover:bg-destructive/90'
                  }`}>
                    Xác nhận
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinancialManagementPage;
