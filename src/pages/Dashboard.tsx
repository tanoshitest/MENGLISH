import { useRole } from "@/contexts/RoleContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";

const Dashboard = () => {
  const { isAdmin } = useRole();
  return isAdmin ? <AdminDashboard /> : <TeacherDashboard />;
};

export default Dashboard;
