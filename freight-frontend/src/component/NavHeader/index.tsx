import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Switch, Dropdown, MenuProps } from 'antd'
import styles from './index.module.less'

//引入zustand
import useBearStore from '@/store'
import storage from '@/utils/storage'
import BreadCrumb from './BreadCrumb'
import { useEffect } from 'react'

const NavHeader = () => {
  //zustand, 只获取用户信息的值
  // const userInfo = useBearStore(state => state.userInfo)

  //同上：从zustand中解构出userInfo、collapsed、updateCollapsed
  const { userInfo, collapsed, updateCollapsed } = useBearStore()

  //15.7 引入主题色
  const { isDark, updateTheme } = useBearStore()
  //刷新页面后，将保存的颜色再次渲染
  useEffect(() => {
    handleSwitch(isDark)
  }, [])

  // 静态的面包屑
  // const breadList = [{ title: '首页' }, { title: '工作台' }]

  //登陆信息
  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: '邮箱：' + userInfo.userEmail
    },
    {
      key: 'logout',
      label: '退出'
    }
  ]

  // 控制菜单图标，关闭和展开
  const toggleCollapsed = () => {
    updateCollapsed()
  }

  //用户退出按钮
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      storage.remove('token')
      location.href = '#/login?callback=' + encodeURIComponent(location.href)
    }
  }

  //15.7 主题切换   修改页面data属性
  const handleSwitch = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.dataset.theme = 'dark'
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.dataset.theme = 'light'
      document.documentElement.classList.remove('dark')
    }
    //缓存
    storage.set('isDark', isDark)

    //更换主题
    updateTheme(isDark)
  }

  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapsed}>{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
        <BreadCrumb />
      </div>
      <div className='right'>
        <Switch
          checked={isDark}
          checkedChildren='暗黑'
          unCheckedChildren='默认'
          style={{ marginRight: 10 }}
          onClick={handleSwitch}
        />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader
