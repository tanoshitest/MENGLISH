'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Progress, Typography, Space, message } from 'antd';
import { AudioOutlined, StopOutlined, SendOutlined, RetweetOutlined } from '@ant-design/icons';

interface MockPronunciationRecorderProps {
  textPrompt: string;
  onSuccess?: () => void;
}

export const MockPronunciationRecorder: React.FC<MockPronunciationRecorderProps> = ({ 
  textPrompt,
  onSuccess 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setHasRecorded(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
  };

  const resetRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    setHasRecorded(false);
  };

  const submitRecording = () => {
    setIsSubmitting(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsSubmitting(false);
      message.success('Đã nộp bài phát âm thành công!');
      if (onSuccess) onSuccess();
      resetRecording();
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-sm border-0 bg-white/80 backdrop-blur-md">
      <Space direction="vertical" size="large" className="w-full text-center">
        <div>
          <Typography.Text type="secondary" className="block mb-2">Đọc to câu sau:</Typography.Text>
          <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            "{textPrompt}"
          </Typography.Title>
        </div>

        <div className="py-8">
          <div 
            className={`relative inline-flex items-center justify-center p-8 rounded-full mb-4 ${
              isRecording ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-blue-500'
            }`}
            style={{ width: 120, height: 120 }}
          >
            {isRecording ? (
              <StopOutlined style={{ fontSize: 40 }} />
            ) : (
              <AudioOutlined style={{ fontSize: 40 }} />
            )}
            
            {isRecording && (
              <div 
                className="absolute inset-0 border-4 border-red-500 rounded-full animate-ping" 
                style={{ animationDuration: '2s' }} 
              />
            )}
          </div>
          
          <Typography.Title level={3} className="m-0 tabular-nums">
            {formatTime(recordingTime)}
          </Typography.Title>
          {isRecording && <Typography.Text type="danger" className="text-xs">Đang thu âm...</Typography.Text>}
        </div>

        <Space size="middle">
          {!isRecording && !hasRecorded && (
            <Button 
              type="primary" 
              size="large" 
              shape="round" 
              icon={<AudioOutlined />} 
              onClick={startRecording}
              className="bg-blue-600 hover:bg-blue-500 min-w-[160px]"
            >
              Bắt đầu thu âm
            </Button>
          )}

          {isRecording && (
            <Button 
              danger 
              type="primary" 
              size="large" 
              shape="round" 
              icon={<StopOutlined />} 
              onClick={stopRecording}
              className="min-w-[160px]"
            >
              Dừng lại
            </Button>
          )}

          {hasRecorded && !isRecording && (
            <>
              <Button 
                size="large" 
                shape="round" 
                icon={<RetweetOutlined />} 
                onClick={resetRecording}
              >
                Thu âm lại
              </Button>
              <Button 
                type="primary" 
                size="large" 
                shape="round" 
                icon={<SendOutlined />} 
                loading={isSubmitting}
                onClick={submitRecording}
                className="bg-green-600 hover:bg-green-500"
              >
                Nộp bài
              </Button>
            </>
          )}
        </Space>

        {isRecording && (
          <div className="w-full max-w-xs mx-auto mt-4">
            <Progress 
              percent={Math.min((recordingTime / 60) * 100, 100)} 
              status="active" 
              showInfo={false} 
              strokeColor="#ff4d4f"
            />
            <Typography.Text type="secondary" className="text-xs">Giới hạn 60 giây</Typography.Text>
          </div>
        )}
      </Space>
    </Card>
  );
};
