import { createHashRouter, Navigate } from 'react-router-dom'
import Login from '@/views/login/Login'
import Welcome from '@/views/welcome'
import NotFound from '../views/404'
import Layout from '@/layout'
import Dashboard from '@/views/dashboard'

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
    element: <Layout />,
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
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
