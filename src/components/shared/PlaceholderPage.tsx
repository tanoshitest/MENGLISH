import { Typography, Card } from 'antd';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-12 text-center">
      <Card className="max-w-md mx-auto shadow-sm border-0 bg-white/50">
        <Typography.Title level={3}>{title}</Typography.Title>
        <Typography.Paragraph type="secondary">
          Đây là trang demo cho mục <strong>{title}</strong>. Nội dung đang được cập nhật.
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
