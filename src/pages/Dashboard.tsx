import { useRole } from "@/contexts/RoleContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { isAdmin, isParent } = useRole();
  
  if (isParent) {
    return <Navigate to="/parent-portal" replace />;
  }
  
  return isAdmin ? <AdminDashboard /> : <TeacherDashboard />;
};

export default Dashboard;
