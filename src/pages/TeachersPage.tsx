import { teachers } from "@/data/mockData";
import { Star, Clock, BookOpen } from "lucide-react";

const TeachersPage = () => (
  <div className="p-4 md:p-6 space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold">Giáo viên</h1>
      <button className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition">
        + Thêm giáo viên
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((t) => (
        <div key={t.id} className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
              {t.avatar}
            </div>
            <div>
              <h3 className="font-semibold">{t.name}</h3>
              <p className="text-xs text-muted-foreground">{t.specialty}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="smart-button flex-1">
              <span className="smart-button-value">{t.hoursThisMonth}h</span>
              <span className="smart-button-label"><Clock className="w-3 h-3 inline mr-1" />Giờ dạy</span>
            </div>
            <div className="smart-button flex-1">
              <span className="smart-button-value">{t.totalClasses}</span>
              <span className="smart-button-label"><BookOpen className="w-3 h-3 inline mr-1" />Lớp</span>
            </div>
            <div className="smart-button flex-1">
              <span className="smart-button-value">{t.avgRating}</span>
              <span className="smart-button-label"><Star className="w-3 h-3 inline mr-1" />Đánh giá</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TeachersPage;
