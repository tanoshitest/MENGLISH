import React, { useState } from "react";
import { 
  courseCategories, 
  courseLevels, 
  classes, 
  CourseCategory, 
  CourseLevel, 
  ClassItem 
} from "@/data/mockData";
import { 
  BookOpen, ChevronDown, ChevronRight, 
  Users, Layers, GraduationCap, ArrowRight, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + "đ";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    "CAT_S": true // Expand first one by default
  });
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLevel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedLevels(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getLevelsForCategory = (categoryId: string) => {
    return courseLevels.filter(l => l.categoryId === categoryId);
  };

  const getClassesForLevel = (levelId: string) => {
    return classes.filter(c => c.levelId === levelId);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> Quản lý Khóa học
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Quản lý sơ đồ đào tạo theo các cấp bậc hiển thị lồng nhau.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg font-bold hover:shadow-lg transition-all active:scale-95 shadow-md">
          + Thêm Hệ Khóa học
        </button>
      </div>

      <div className="space-y-4">
        {courseCategories.map((category) => {
          const catLevels = getLevelsForCategory(category.id);
          const isCatExpanded = expandedCategories[category.id];
          
          // Calculate stats for category
          const totalClassesInCat = catLevels.reduce((sum, lvl) => sum + getClassesForLevel(lvl.id).length, 0);
          const totalStudentsInCat = catLevels.reduce((sum, lvl) => {
            return sum + getClassesForLevel(lvl.id).reduce((s, c) => s + c.studentCount, 0);
          }, 0);

          return (
            <div key={category.id} className="bg-card rounded-2xl border shadow-sm overflow-hidden">
              {/* Category Header (Level 1) */}
              <div 
                onClick={() => toggleCategory(category.id)}
                className={`p-5 flex items-center justify-between cursor-pointer transition-colors ${
                  isCatExpanded ? 'bg-secondary/10 border-b' : 'hover:bg-secondary/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${category.color} shadow-inner`}>
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">{category.name}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex gap-6 text-sm font-bold text-muted-foreground">
                    <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {totalClassesInCat} Lớp</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {totalStudentsInCat} HS</span>
                  </div>
                  <div className={`p-2 rounded-full transition-transform duration-300 ${isCatExpanded ? 'bg-primary text-white rotate-180' : 'bg-secondary text-muted-foreground'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Levels Container (Level 2) */}
              <AnimatePresence>
                {isCatExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 bg-muted/30 space-y-3">
                      {catLevels.map(level => {
                        const levelClasses = getClassesForLevel(level.id);
                        const isLevelExpanded = expandedLevels[level.id];
                        const totalStudentsInLevel = levelClasses.reduce((s, c) => s + c.studentCount, 0);

                        return (
                          <div key={level.id} className="bg-background rounded-xl border shadow-sm overflow-hidden">
                            {/* Level Header */}
                            <div 
                              onClick={(e) => toggleLevel(level.id, e)}
                              className={`p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/20 transition-colors ${
                                isLevelExpanded ? 'border-b bg-secondary/10' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-md transition-transform duration-200 ${isLevelExpanded ? 'rotate-90 text-primary' : 'text-muted-foreground'}`}>
                                  <ChevronRight className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-foreground text-base tracking-tight">{level.name}</h3>
                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full tracking-widest ml-2">
                                  {level.durationInMonths} Tháng
                                </span>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center gap-4 text-right">
                                <div className="text-xs font-bold text-muted-foreground border-r pr-4 hidden md:block">
                                  Học phí: <span className="text-foreground">{formatVND(level.fee)}</span>/Khóa
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                  <span>{levelClasses.length} Lớp học</span>
                                  <span>{totalStudentsInLevel} HS</span>
                                </div>
                              </div>
                            </div>

                            {/* Classes Container (Level 3) */}
                            <AnimatePresence>
                              {isLevelExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                >
                                  <div className="p-3 bg-secondary/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {levelClasses.map(cls => (
                                      <div 
                                        key={cls.id} 
                                        onClick={() => navigate(`/classes/${cls.id}`)}
                                        className="bg-card p-4 rounded-lg border shadow-sm hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden"
                                      >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                        <div className="pl-2">
                                          <div className="flex items-start justify-between">
                                            <h4 className="font-black text-sm text-foreground group-hover:text-primary transition-colors">{cls.name}</h4>
                                            <span className="text-[10px] font-black text-white bg-success px-1.5 py-0.5 rounded shadow-sm">
                                              Hoạt động
                                            </span>
                                          </div>
                                          <div className="mt-3 space-y-2 text-xs font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                              <Clock className="w-3.5 h-3.5 opacity-70" /> {cls.schedule}
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <GraduationCap className="w-3.5 h-3.5 opacity-70" /> {cls.studentCount} / {cls.maxStudents} Học viên
                                            </div>
                                          </div>
                                          <div className="mt-4 pt-3 border-t flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Vào lớp học</span>
                                            <ArrowRight className="w-4 h-4 text-primary" />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {levelClasses.length === 0 && (
                                      <div className="col-span-full py-6 text-center text-sm text-muted-foreground italic h-full bg-card rounded-lg border border-dashed">
                                        Chưa có lớp học nào thuộc cấp độ này.
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                      {catLevels.length === 0 && (
                        <div className="text-center py-6 text-sm text-muted-foreground italic bg-background rounded-xl border border-dashed">
                          Chưa có cấp độ nào được thiết lập.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CoursesPage;
