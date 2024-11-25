import { RouterProvider } from 'react-router-dom'
import './App.less'
import router from '@/router'

//主题色 antd
import { ConfigProvider, App as AntdApp } from 'antd'

//AntdGlobal
import AntdGlobal from './utils/AntdGlobal'

function App() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#ed6c00' } }}>
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
