import { IAuthLoader } from '@/router/AuthLoader'
import { Button } from 'antd'
import { useRouteLoaderData } from 'react-router-dom'
import useBearStore from '@/store'

// 重写带有权限的button组件
const AuthButton = (props: any) => {
  //获取layout的loader数据
  const data = useRouteLoaderData('layout') as IAuthLoader

  //zustand获取数据
  const role = useBearStore(state => state.userInfo.role)

  //如果没有 `auth` 属性，直接渲染按钮
  if (!props.auth) {
    return <Button {...props}>{props.children}</Button>
  }
  // 如果是管理员默认显示权限
  if (data.buttonList.includes(props.auth) || role === 1) {
    return <Button {...props}>{props.children}</Button>
  }
  return <></> //否则不显示按钮
}

export default AuthButton
