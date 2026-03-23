import { courses } from "@/data/mockData";
import { BookOpen, Users, Clock } from "lucide-react";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + "đ";

const CoursesPage = () => (
  <div className="p-4 md:p-6 space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Khóa học</h1>
        <p className="text-sm text-muted-foreground">Danh sách các khóa học hiện có</p>
      </div>
      <button className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded-md font-medium hover:opacity-90 transition">
        + Thêm khóa học
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((c) => (
        <div key={c.id} className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{c.name}</h3>
              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">{c.level}</span>
            </div>
            <BookOpen className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mt-2">{c.description}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{c.duration}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.studentCount} HS</span>
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-sm font-bold text-primary">{formatVND(c.fee)}</span>
            <span className="text-xs text-muted-foreground">{c.classCount} lớp</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CoursesPage;
