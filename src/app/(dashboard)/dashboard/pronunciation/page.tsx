'use client';

import React from 'react';
import { Card, Breadcrumb, Typography, Divider, Row, Col, List, Tag } from 'antd';
import { HomeOutlined, AudioOutlined, HistoryOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { MockPronunciationRecorder } from '../../../components/pronunciation/MockPronunciationRecorder';
import { mockSubmissions } from '../../../lib/mockData';

const { Title, Text, Paragraph } = Typography;

export default function PronunciationPage() {
  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen bg-transparent">
      {/* Breadcrumb */}
      <Breadcrumb 
        className="mb-6"
        items={[
          { title: <HomeOutlined />, href: '/' },
          { title: 'Lớp học & Kết quả', href: '/dashboard' },
          { title: 'Nộp bài phát âm' }
        ]}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {/* Main Title */}
          <div className="mb-6">
            <Title level={2} className="flex items-center gap-2">
              <AudioOutlined className="text-blue-500" />
              Nộp bài phát âm mới
            </Title>
            <Paragraph type="secondary">
              Ghi âm giọng đọc của bạn để giáo viên nhận xét và đánh giá kỹ năng phát âm.
            </Paragraph>
          </div>

          {/* Recorder Section */}
          <MockPronunciationRecorder 
            textPrompt="Practice makes perfect. The more you speak, the more natural you will sound."
          />

          <Divider />

          {/* Guidelines */}
          <Card title="Hướng dẫn thực hiện" bordered={false} className="shadow-none bg-blue-50/50">
            <ul className="pl-4 list-disc space-y-2 text-zinc-600">
              <li>Tìm nơi yên tĩnh để ghi âm.</li>
              <li>Đọc to, rõ ràng từng từ trong câu gợi ý.</li>
              <li>Nghe lại trước khi nhấn nút "Nộp bài".</li>
              <li>Bạn có thể thực hiện lại nhiều lần cho đến khi ưng ý.</li>
            </ul>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          {/* History / Recent Submissions */}
          <Card 
            title={
              <span className="flex items-center gap-2">
                <HistoryOutlined />
                Lịch sử nộp bài gần đây
              </span>
            } 
            className="shadow-sm border-0 sticky top-6"
          >
            <List
              dataSource={mockSubmissions.slice(0, 5)}
              renderItem={(item) => (
                <List.Item className="px-0 py-4 border-b last:border-0 border-zinc-100 block">
                  <div className="flex justify-between items-start mb-2">
                    <Text strong className="text-xs truncate max-w-[150px]">
                      {item.textPrompt}
                    </Text>
                    {item.status === 'reviewed' ? (
                      <Tag color="success" icon={<CheckCircleOutlined />}>8.5</Tag>
                    ) : (
                      <Tag color="processing" icon={<ClockCircleOutlined />}>Đang chờ</Tag>
                    )}
                  </div>
                  <Text type="secondary" className="text-[10px] block">
                    Đã nộp: {item.submittedAt}
                  </Text>
                  {item.feedback && (
                    <div className="mt-2 p-2 bg-zinc-50 rounded text-xs italic text-zinc-500">
                      "{item.feedback}"
                    </div>
                  )}
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
