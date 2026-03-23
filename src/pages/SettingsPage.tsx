import { Settings, Shield, Building, Bell } from "lucide-react";

const SettingsPage = () => (
  <div className="p-4 md:p-6 space-y-6">
    <h1 className="text-xl font-bold">Cấu hình Hệ thống</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { icon: Building, title: "Thông tin trung tâm", desc: "Tên, địa chỉ, logo, thông tin liên hệ" },
        { icon: Shield, title: "Phân quyền", desc: "Quản lý vai trò và quyền hạn người dùng" },
        { icon: Settings, title: "Cấu hình chung", desc: "Múi giờ, ngôn ngữ, đơn vị tiền tệ" },
        { icon: Bell, title: "Thông báo", desc: "Cấu hình email, SMS, thông báo hệ thống" },
      ].map((item) => (
        <div key={item.title} className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-4">
          <div className="p-2 rounded-md bg-secondary">
            <item.icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SettingsPage;
