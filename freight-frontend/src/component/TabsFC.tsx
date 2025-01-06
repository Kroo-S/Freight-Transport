import { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
import { Tabs } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'

//接口类型定义
interface TabsItem {
  key: string
  label: string
  closable: boolean
}

const TabsFC = () => {
  //标签空数组
  const [tabsList, setTabList] = useState<TabsItem[]>([{ key: '/welcome', label: '首页', closable: false }])

  //标签文字激活显示
  const [activeKey, setActiveKey] = useState('')

  //路由切换
  const navigate = useNavigate()

  // 获取页面数据
  const { pathname } = useLocation()
  //获取layout中的loader数据
  const data = useRouteLoaderData('layout') as IAuthLoader

  useEffect(() => {
    addTabs()
  }, [pathname]) //当pathname变化时候，重新创建一次

  //创建页签
  const addTabs = () => {
    const route = searchRoute(pathname, data.menuList)

    //删除之后，如果没有标签，直接return
    if (!route) return

    //避免重复标签：如果数组中没有选项，添加。
    if (!tabsList.find(item => item.key === route.path)) {
      console.log('route', route)
      tabsList.push({
        key: route.path,
        label: route.menuName,
        closable: pathname !== '/welcome'
      })
    }

    setTabList([...tabsList])
    //激活标签文字
    setActiveKey(pathname)
  }

  // const items = [
  //   {
  //     key: '1',
  //     label: 'Tab1'
  //   }
  // ]

  //路由切换：点击标签切换页面
  const handleChange = (path: string) => {
    navigate(path)
  }

  //关闭标签
  //pathname是url
  //path是标签按钮

  const handleDelete = (path: string) => {
    //1. 当选中标签，去关闭的当前页的时候
    if (pathname === path) {
      //如果关闭的标签和页面路径一致，遍历标签数组
      tabsList.forEach((item, index: number) => {
        //当数值不等于路径,退出循环，不navigate切换页面
        if (item.key != pathname) return
        //设置下一个标签是左右标签
        const nextTab = tabsList[index + 1] || tabsList[index - 1]
        //到没有取到左右标签，退出循环，不navigate切换页面
        if (!nextTab) return
        //否则切换到对应标签页
        navigate(nextTab.key)
      })
    }

    //2. 关闭的标签 和 url地址不一样的时候，
    //设置新的标签数组,过滤形成不包括当前路径的标签数组
    setTabList(tabsList.filter(item => item.key != path))
  }

  return (
    <Tabs
      activeKey={activeKey}
      items={tabsList}
      tabBarStyle={{ height: 40, marginBottom: 0, backgroundColor: 'var(--dark-bg-color)' }}
      type='editable-card'
      hideAdd
      onChange={handleChange}
      onEdit={path => {
        handleDelete(path as string)
      }}
    />
  )
}

export default TabsFC
