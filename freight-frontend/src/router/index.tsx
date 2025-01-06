import { createHashRouter, Navigate } from 'react-router-dom'
import Login from '@/views/login/Login'
import Welcome from '@/views/welcome'
import NotFound from '../views/404'
import Layout from '@/layout'
//import Dashboard from '@/views/dashboard'
//import User from '@/views/system/user'
//import UserListAhooks from '@/views/system/userListAhooks'
//import Dept from '@/views/system/dept'
//import Menu from '@/views/system/menu'
import AuthLoader from './AuthLoader'
// import Role from '@/views/system/role'
// import OrderList from '@/views/order/OrderList'
// import OrderCluster from '@/views/order/OrderCluster'
// import DriverList from '@/views/order/DriverList'

// ================== 15.2 懒加载 ==================

import React from 'react'
import lazyLoad from './LazyLoad'
//const Dashboard = React.lazy(() => import('@/views/dashboard'))

// ================================================

export const router = [
  {
    path: '/',
    element: <Navigate to='/welcome' />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    id: 'layout',
    element: <Layout />,
    //  该 loader 与 Layout 路由绑定。
    //  当用户访问 /welcome、/dashboard、/userList 等 Layout 子路由时，AuthLoader 会在组件渲染之前执行。
    loader: AuthLoader,
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      {
        path: '/dashboard',
        //element: <Dashboard />
        element: lazyLoad(React.lazy(() => import('@/views/dashboard')))
      },
      {
        path: '/userList',
        //element: <User />
        element: lazyLoad(React.lazy(() => import('@/views/system/user')))
      },
      {
        path: '/userListAhooks',
        //element: <UserListAhooks />
        element: lazyLoad(React.lazy(() => import('@/views/system/userListAhooks')))
      },

      {
        path: '/deptlist',
        //element: <Dept />
        element: lazyLoad(React.lazy(() => import('@/views/system/dept')))
      },
      {
        path: '/menulist',
        element: lazyLoad(React.lazy(() => import('@/views/system/menu')))
        //element: <Menu />
        // meta: {
        //   auth: false //没有权限认证
        // }
      },
      {
        path: '/rolelist',
        element: lazyLoad(React.lazy(() => import('@/views/system/role')))
        //element: <Role />
      },
      {
        path: '/orderList',
        //element: <OrderList />
        element: lazyLoad(React.lazy(() => import('@/views/order/OrderList')))
      },
      {
        path: '/cluster',
        //element: <OrderCluster /> //订单聚合
        element: lazyLoad(React.lazy(() => import('@/views/order/OrderCluster')))
      },
      {
        path: '/driverList',
        //element: <DriverList /> //司机列表
        element: lazyLoad(React.lazy(() => import('@/views/order/DriverList')))
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  },
  {
    path: '/404',
    element: <NotFound />
  }
]

// eslint-disable-next-line react-refresh/only-export-components
export default createHashRouter(router)
