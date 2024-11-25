// 侧边栏

import { DesktopOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import styles from './index.module.less'
import { useNavigate } from 'react-router-dom'
import useBearStore from '@/store'

//组件
const SideMenu = () => {
  //页面跳转useNavigate
  const naigate = useNavigate()

  //引入zustand中的collapsed
  const collapsed = useBearStore(state => state.collapsed)

  const items = [
    {
      label: '工作台',
      key: '1',
      icon: <DesktopOutlined />
    },
    {
      label: '系统管理',
      key: '2',
      icon: <SettingOutlined />,
      children: [
        {
          label: '用户管理',
          key: '3',
          icon: <TeamOutlined />
        }
      ]
    }
  ]

  // 方法
  const handleClickLogo = () => {
    naigate('/welcome')
  }

  return (
    <div>
      <div className={styles.logo} onClick={handleClickLogo}>
        <img src='/imgs/logo.png' className={styles.img} />
        {collapsed ? '' : <span>货奔奔</span>}
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        mode='inline'
        theme='dark'
        style={{
          width: collapsed ? 80 : 'auto'
        }}
        items={items}
      />
    </div>
  )
}

export default SideMenu
