import { Button, Card, Typography, Space } from 'antd';
import Link from 'next/link';
import { UserOutlined, TeamOutlined, AudioOutlined } from '@ant-design/icons';



export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <Card className="max-w-4xl w-full shadow-2xl border-0 overflow-hidden rounded-2xl">
        <div className="p-12 text-center bg-white">
          <div className="mb-8 flex justify-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-12">
              <AudioOutlined style={{ fontSize: 32, color: '#fff' }} />
            </div>
          </div>
          
          <Typography.Title level={1} className="mb-4" style={{ fontWeight: 800 }}>
            MENGLISH <span className="text-blue-600">Pronunciation Demo</span>
          </Typography.Title>
          <Typography.Paragraph type="secondary" className="text-lg max-w-2xl mx-auto mb-12">
            Chào mừng bạn đến với bản demo tính năng Nộp bài phát âm. 
            Vui lòng chọn vai trò để trải nghiệm quy trình nộp bài và duyệt bài.
          </Typography.Paragraph>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Parent Entry */}
            <Link href="/dashboard/pronunciation">
              <Card 
                hoverable 
                className="h-full border-2 border-zinc-100 hover:border-blue-500 transition-all duration-300"
                cover={
                  <div className="pt-8 flex justify-center">
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                      <UserOutlined style={{ fontSize: 40 }} />
                    </div>
                  </div>
                }
              >
                <Typography.Title level={3}>Dành cho Phụ huynh</Typography.Title>
                <Typography.Text type="secondary">Nộp bài ghi âm, xem nhận xét từ giáo viên và theo dõi kết quả học tập.</Typography.Text>
                <div className="mt-6">
                  <Button type="primary" size="large" shape="round" block className="bg-blue-600">
                    Vào giao diện Phụ huynh
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Teacher Entry */}
            <Link href="/teachers/pronunciation">
              <Card 
                hoverable 
                className="h-full border-2 border-zinc-100 hover:border-green-500 transition-all duration-300"
                cover={
                  <div className="pt-8 flex justify-center">
                    <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                      <TeamOutlined style={{ fontSize: 40 }} />
                    </div>
                  </div>
                }
              >
                <Typography.Title level={3}>Dành cho Giáo viên</Typography.Title>
                <Typography.Text type="secondary">Duyệt các bài phát âm của học sinh, nghe lại và để lại lời bình giảng.</Typography.Text>
                <div className="mt-6">
                  <Button type="primary" size="large" shape="round" block color="green" className="bg-green-600 hover:bg-green-500">
                    Vào giao diện Giáo viên
                  </Button>
                </div>
              </Card>
            </Link>
          </div>

          <div className="mt-16 pt-8 border-t border-zinc-100 italic text-zinc-400">
            Dự án: MENGLISH LMS v2.4.0 (Mock Demo)
          </div>
        </div>
      </Card>
    </div>
  );
}
