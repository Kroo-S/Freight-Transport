import { createHashRouter, Navigate } from 'react-router-dom'
import Login from '@/views/login/Login'
import Welcome from '@/views/welcome'
import NotFound from '../views/404'
import Layout from '@/layout'
import Dashboard from '@/views/dashboard'
import User from '@/views/system/user'
import UserListAhooks from '@/views/system/userListAhooks'
import Dept from '@/views/system/dept'
import Menu from '@/views/system/menu'
import AuthLoader from './AuthLoader'

const router = [
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
    loader: AuthLoader,
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/userList',
        element: <User />
      },
      {
        path: '/userListAhooks',
        element: <UserListAhooks />
      },
      {
        path: '/deptlist',
        element: <Dept />
      },
      {
        path: '/menulist',
        element: <Menu />
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
