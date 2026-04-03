'use client';

import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Space, Badge, Card, Divider } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  HistoryOutlined,
  BarChartOutlined,
  CustomerServiceOutlined,
  AudioOutlined,
  TeamOutlined,
  DashboardOutlined,
  BellOutlined,
  DownOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';



interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  // Define sidebar items based on role (mocked as Parent/Teacher)
  const isTeacherView = pathname?.includes('/teachers');

  const parentMenuItems = [
    { key: '/dashboard/info', icon: <UserOutlined />, label: <Link href="/dashboard/info">Thông tin học viên</Link> },
    { key: '/dashboard/classes', icon: <BookOutlined />, label: <Link href="/dashboard/classes">Lớp học & Kết quả</Link> },
    { key: '/dashboard/pronunciation', icon: <AudioOutlined />, label: <Link href="/dashboard/pronunciation">Nộp bài phát âm</Link> },
    { key: '/dashboard/fees', icon: <HistoryOutlined />, label: <Link href="/dashboard/fees">Học phí & Lịch sử</Link> },
    { key: '/dashboard/reports', icon: <BarChartOutlined />, label: <Link href="/dashboard/reports">Báo cáo học tập</Link> },
    { key: '/dashboard/contact', icon: <CustomerServiceOutlined />, label: <Link href="/dashboard/contact">Liên hệ Trung tâm</Link> },
  ];

  const teacherMenuItems = [
    { key: '/teachers/dashboard', icon: <DashboardOutlined />, label: <Link href="/teachers/dashboard">Tổng quan</Link> },
    { key: '/teachers/students', icon: <TeamOutlined />, label: <Link href="/teachers/students">Quản lý học sinh</Link> },
    { key: '/teachers/pronunciation', icon: <AudioOutlined />, label: <Link href="/teachers/pronunciation">Duyệt phát âm</Link> },
    { key: '/teachers/classes', icon: <BookOutlined />, label: <Link href="/teachers/classes">Lớp học dạy</Link> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={(value) => setCollapsed(value)}
        theme="dark"
        className="shadow-lg z-10"
        width={240}
        style={{ backgroundColor: '#001529' }}
      >
        <div className="p-6 text-center border-b border-white/10 mb-4">
          {!collapsed ? (
            <Typography.Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 800, letterSpacing: '1px' }}>
              ME<span className="text-blue-400">NGLISH</span>
            </Typography.Title>
          ) : (
            <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>ME</Typography.Title>
          )}
        </div>
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[pathname || '']} 
          items={isTeacherView ? teacherMenuItems : parentMenuItems}
          className="sidebar-menu border-0"
        />
        
        {!collapsed && (
          <div className="absolute bottom-8 left-0 right-0 px-6 mt-auto">
            <Card size="small" className="bg-blue-950/40 border-0 text-white/60 text-[10px]">
              Vai trò hiện tại
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Typography.Text strong style={{ color: '#fff' }}>{isTeacherView ? 'Giáo viên' : 'Phụ huynh'}</Typography.Text>
              </div>
            </Card>
          </div>
        )}
      </Layout.Sider>
      
      <Layout className="bg-[#f8fafc]">
        <Layout.Header className="bg-white px-8 flex items-center justify-end shadow-sm z-10" style={{ height: 64 }}>
          <Space size="large">
            <Badge dot>
              <BellOutlined style={{ fontSize: 20 }} />
            </Badge>
            <Divider type="vertical" />
            <Space className="cursor-pointer">
              <Avatar icon={<UserOutlined />} className="bg-blue-600 shadow-md" />
              <div className="hidden sm:block leading-none">
                <Typography.Text strong className="block text-xs">Thanh Nguyen</Typography.Text>
                <Typography.Text type="secondary" className="text-[10px]">{isTeacherView ? 'Teacher Account' : 'Parent Account'}</Typography.Text>
              </div>
              <DownOutlined style={{ fontSize: 10, color: '#888' }} />
            </Space>
          </Space>
        </Layout.Header>
        
        <Layout.Content className="m-0 overflow-y-auto" style={{ backgroundColor: '#fdfdfd' }}>
          {children}
        </Layout.Content>
      </Layout>

      <style jsx global>{`
        .sidebar-menu .ant-menu-item {
          height: 48px !important;
          line-height: 48px !important;
          margin-bottom: 4px !important;
          border-radius: 8px !important;
          width: calc(100% - 16px) !important;
          margin-left: 8px !important;
        }
        .sidebar-menu .ant-menu-item-selected {
          background-color: #1890ff !important;
        }
      `}</style>
    </Layout>
  );
};
