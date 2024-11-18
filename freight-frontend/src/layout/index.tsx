import React, { useEffect } from 'react'
import { Layout, Watermark } from 'antd'
import NavHeader from '@/component/NavHeader'
import Menu from '@/component/Menu'
import { Outlet } from 'react-router-dom'
import styles from './index.module.less'
import api from '@/api'

//引入zustand
import useBearStore from '@/store'

//引入layout
const { Content, Sider } = Layout

const App: React.FC = () => {
  //·引入zustand
  //const updateUserInfo = useBearStore(state => state.updateUserInfo)
  // 使用解构方式：
  const { collapsed, updateUserInfo } = useBearStore()

  //useEffect获取用户信息
  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const data = await api.getUserInfo()
    //更新用户信息
    updateUserInfo(data)
  }

  return (
    <Watermark content='123'>
      <Layout>
        <Sider collapsed={collapsed}>
          <Menu />
        </Sider>
        <Layout>
          <NavHeader />
          <Content className={styles.content}>
            <div className={styles.wrapper}>
              <Outlet></Outlet>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
