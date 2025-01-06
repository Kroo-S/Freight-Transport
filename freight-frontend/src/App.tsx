import { RouterProvider } from 'react-router-dom'
import './App.less'
import router from '@/router'

//主题色 antd
import { ConfigProvider, App as AntdApp, theme } from 'antd'

//AntdGlobal
import AntdGlobal from './utils/AntdGlobal'

//15.7 暗黑主题色
import './styles/theme.less'
import useBearStore from './store'

function App() {
  //获取主题色
  const isDark = useBearStore(state => state.isDark)

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: '#ed6c00' }, algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm }}
    >
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
