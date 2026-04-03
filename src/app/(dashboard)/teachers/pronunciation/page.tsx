'use client';

import React, { useState } from 'react';
import { Card, Table, Tag, Button, Space, Typography, Modal, Input, Rate, Avatar, message, Badge } from 'antd';
import { PlayCircleOutlined, EditOutlined, CheckCircleOutlined, SoundOutlined, FilterOutlined } from '@ant-design/icons';
import { mockSubmissions, PronunciationSubmission } from '../../../lib/mockData';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function TeacherReviewPage() {
  const [submissions, setSubmissions] = useState<PronunciationSubmission[]>(mockSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<PronunciationSubmission | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [score, setScore] = useState(0);

  const handleReview = (record: PronunciationSubmission) => {
    setSelectedSubmission(record);
    setFeedbackText(record.feedback || '');
    setScore(record.score || 0);
    setIsModalVisible(true);
  };

  const handleSaveReview = () => {
    if (!selectedSubmission) return;

    setSubmissions(submissions.map(s => 
      s.id === selectedSubmission.id 
        ? { ...s, status: 'reviewed', feedback: feedbackText, score: score } 
        : s
    ));
    
    setIsModalVisible(false);
    message.success(`Đã lưu nhận xét cho ${selectedSubmission.studentName}!`);
  };

  const columns = [
    {
      title: 'Học viên',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text: string, record: PronunciationSubmission) => (
        <Space>
          <Avatar src={record.avatarUrl} size="small" />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'textPrompt',
      key: 'textPrompt',
      width: 300,
      render: (text: string) => <Text type="secondary" className="text-xs truncate block max-w-xs italic">"{text}"</Text>,
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (text: string) => <Text type="secondary" className="text-xs">{text}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          status={status === 'reviewed' ? 'success' : 'processing'} 
          text={status === 'reviewed' ? <Tag color="success">Đã duyệt</Tag> : <Tag color="processing">Chờ duyệt</Tag>} 
        />
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: PronunciationSubmission) => (
        <Space size="middle">
          <Button 
            icon={<PlayCircleOutlined />} 
            onClick={() => message.info('Đang phát file ghi âm (Demo)...')}
            className="text-blue-500 border-blue-500"
          >
            Nghe bài
          </Button>
          <Button 
            icon={<EditOutlined />} 
            type={record.status === 'pending' ? 'primary' : 'default'}
            onClick={() => handleReview(record)}
          >
            Nhận xét
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-transparent">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Title level={2} className="m-0">
            Duyệt bài phát âm
          </Title>
          <Text type="secondary">
            Tổng số: {submissions.length} bài | <Text type="warning">{submissions.filter(s => s.status === 'pending').length} bài chờ duyệt</Text>
          </Text>
        </div>
        <Button icon={<FilterOutlined />}>Lọc kết quả</Button>
      </div>

      <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={submissions} 
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="custom-table"
        />
      </Card>

      <Modal
        title={
          <Space>
            <SoundOutlined className="text-blue-500" />
            Nhận xét bài của {selectedSubmission?.studentName}
          </Space>
        }
        open={isModalVisible}
        onOk={handleSaveReview}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu nhận xét"
        cancelText="Hủy"
        width={600}
        maskClosable={false}
      >
        <div className="py-4 space-y-4">
          <div>
            <Text type="secondary" className="block mb-1">Đề bài:</Text>
            <div className="p-3 bg-zinc-50 rounded italic text-zinc-600 border border-zinc-100">
              "{selectedSubmission?.textPrompt}"
            </div>
          </div>
          
          <div className="flex justify-center p-4 bg-zinc-50 rounded mb-4">
            <Button 
              size="large" 
              type="primary" 
              shape="round" 
              icon={<PlayCircleOutlined />}
              onClick={() => message.info('Đang phát file ghi âm của học sinh...')}
              className="bg-blue-600 shadow-lg px-8"
            >
              Nghe bài làm học sinh
            </Button>
          </div>

          <div>
            <Text strong className="block mb-2">Đánh giá chung (Điểm số):</Text>
            <div className="flex items-center gap-4">
              <Rate 
                allowHalf 
                value={score / 2} 
                onChange={(v) => setScore(v * 2)} 
                character={({ index = 0 }) => (index + 1) * 2}
              />
              <Text strong className="text-xl text-blue-500">{score.toFixed(1)}/10</Text>
            </div>
          </div>

          <div>
            <Text strong className="block mb-2">Lời khuyên của giáo viên:</Text>
            <TextArea 
              rows={4} 
              placeholder="Nhập nhận xét chi tiết về phát âm, trọng âm, âm đuôi..." 
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>
      </Modal>

      <style jsx global>{`
        .custom-table .ant-table {
          background: transparent;
        }
        .custom-table .ant-table-thead > tr > th {
          background: #f8fafc;
          border-bottom: 2px solid #f1f5f9;
        }
      `}</style>
    </div>
  );
}
