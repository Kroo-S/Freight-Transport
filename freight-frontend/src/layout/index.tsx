import React, { useEffect } from 'react'
import { Layout, Watermark } from 'antd'
import NavHeader from '@/component/NavHeader'
import Menu from '@/component/Menu'
import { Navigate, Outlet, useLocation, useRouteLoaderData } from 'react-router-dom'
import styles from './index.module.less'
import api from '@/api'

//引入zustand
import useBearStore from '@/store'
import { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
import { router } from '@/router'
import TabsFC from '@/component/TabsFC'

//导入routers

//引入layout
const { Content, Sider } = Layout

const App: React.FC = () => {
  //·引入zustand
  //const updateUserInfo = useBearStore(state => state.updateUserInfo)
  // 使用解构方式：
  const { collapsed, updateUserInfo, userInfo } = useBearStore()

  //获取当前页面路径
  const { pathname } = useLocation()

  //useEffect获取用户信息
  useEffect(() => {
    getUserInfo()
  }, [])

  const getUserInfo = async () => {
    const data = await api.getUserInfo()
    //更新用户信息
    updateUserInfo(data)
  }

  // ======================= 13.7 页面权限控制 =======================

  //获取layout中的loader数据
  const data = useRouteLoaderData('layout') as IAuthLoader
  //查找页面路径
  const route = searchRoute(pathname, router)
  if (route?.meta?.auth !== false) {
    //权限验证meta=false不用验证；如果递归查找后没有{meta=false}，则继续以下验证

    //静态页面，没有权限，可以随时访问。避免进入403后不能返回首页
    const staticPath = ['/welcome', '/403', '/404', '/userListAhooks']

    //当前页面不在权限页面中，也不再静态页面中，跳转403
    if (!data.menuPathList.includes(pathname) && !staticPath.includes(pathname)) {
      return <Navigate to='/403' />
    }
  }

  return (
    <Watermark content='123'>
      {/* 避免重复渲染，当userInfo存在的时候渲染 */}
      {userInfo._id ? (
        <Layout>
          <Sider collapsed={collapsed}>
            <Menu />
          </Sider>
          <Layout>
            <NavHeader />
            <TabsFC />
            <Content className={styles.content}>
              <div className={styles.wrapper}>
                <Outlet></Outlet>
              </div>
            </Content>
          </Layout>
        </Layout>
      ) : null}
    </Watermark>
  )
}

export default App
