import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Switch, Dropdown, MenuProps } from 'antd'
import styles from './index.module.less'

//引入zustand
import useBearStore from '@/store'
import storage from '@/utils/storage'

const NavHeader = () => {
  //zustand, 只获取用户信息的值
  // const userInfo = useBearStore(state => state.userInfo)

  //同上：从zustand中解构出userInfo、collapsed、updateCollapsed
  const { userInfo, collapsed, updateCollapsed } = useBearStore()

  const breadList = [{ title: '首页' }, { title: '工作台' }]
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

  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapsed}>{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
        <Breadcrumb items={breadList} style={{ marginLeft: 10 }} />
      </div>
      <div className='right'>
        <Switch checkedChildren='暗黑' unCheckedChildren='默认' style={{ marginRight: 10 }} />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader
