// 侧边栏

import { Menu as IMenu } from '@/types/api'
import styles from './index.module.less'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import useBearStore from '@/store'

//导入menu组件
import type { MenuProps } from 'antd/es/menu'
import { useEffect, useState } from 'react'
import React from 'react'

import * as Icons from '@ant-design/icons'
import { Menu } from 'antd'

//组件
const SideMenu = () => {
  //页面跳转useNavigate
  const navigate = useNavigate()

  //12.7 菜单栏
  const [menuList, setMenuList] = useState<MenuItem[]>([])

  //引入zustand中的collapsed
  const collapsed = useBearStore(state => state.collapsed)

  //15.8 zustand获取主题色
  const isDark = useBearStore(state => state.isDark)

  // =================== 12-5 权限接口：使用router中loader的数据 ===================
  const data: any = useRouteLoaderData('layout')
  console.log('data:', data)

  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const { pathname } = useLocation()
  //==================== 12-7 菜单动态渲染 =======================
  type MenuItem = Required<MenuProps>['items'][number]

  // 生成每一个菜单项
  function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children
    } as MenuItem
  }

  function createIcon(name?: string) {
    if (!name) return <></>
    const customerIcons: { [key: string]: any } = Icons
    const icon = customerIcons[name]
    if (!icon) return <></>
    return React.createElement(icon)
  }
  // 递归生成菜单
  const getTreeMenu = (menuList: IMenu.MenuItem[], treeList: MenuItem[] = []) => {
    menuList.forEach((item, index) => {
      if (item.menuType === 1 && item.menuState === 1) {
        if (item.buttons) return treeList.push(getItem(item.menuName, item.path || index, createIcon(item.icon)))
        treeList.push(
          getItem(item.menuName, item.path || index, createIcon(item.icon), getTreeMenu(item.children || []))
        )
      }
    })
    return treeList
  }

  // 初始化，获取接口菜单列表数据
  useEffect(() => {
    const treeMenuList = getTreeMenu(data.menuList)
    setMenuList(treeMenuList)
    setSelectedKeys([pathname])
  }, [])

  // const items = [
  //   {
  //     label: '工作台',
  //     key: '1',
  //     icon: <DesktopOutlined rev={undefined} />
  //   },
  //   {
  //     label: '系统管理',
  //     key: '2',
  //     icon: <SettingOutlined rev={undefined} />,
  //     children: [
  //       {
  //         label: '用户管理',
  //         key: '3',
  //         icon: <TeamOutlined rev={undefined} />
  //       },
  //       {
  //         label: '部门管理',
  //         key: '4',
  //         icon: <TeamOutlined rev={undefined} />
  //       }
  //     ]
  //   }
  // ]

  // Logo点击
  const handleClickLogo = () => {
    navigate('/welcome')
  }

  // 菜单点击
  const handleClickMenu = ({ key }: { key: string }) => {
    setSelectedKeys([key])
    navigate(key)
  }

  return (
    <div className={styles.navSider}>
      <div className={styles.logo} onClick={handleClickLogo}>
        <img src='/imgs/logo.png' className={styles.img} />
        {collapsed ? '' : <span>货奔奔</span>}
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        mode='inline'
        theme={isDark ? 'light' : 'dark'}
        style={{
          width: collapsed ? 80 : 'auto',
          height: 'calc(100vh - 50px)'
        }}
        selectedKeys={selectedKeys}
        onClick={handleClickMenu}
        items={menuList}
      />
    </div>
  )
}

export default SideMenu
