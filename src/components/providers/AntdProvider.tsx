'use client';

import { ConfigProvider, App } from 'antd';
import viVN from 'antd/locale/vi_VN';

const theme = {
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 8,
    fontFamily: 'inherit',
  },
};

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={theme} locale={viVN}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
