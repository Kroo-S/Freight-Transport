import style from './index.module.less'
import { App, Button, Form, Input } from 'antd'
import api from '@/api/index'
import { Login } from '@/types/api'
import storage from '@/utils/storage'
import { useState } from 'react'
import useBearStore from '@/store'

export default function LoginFC() {
  const [loading, setLoading] = useState(false)

  //导入message
  const { message, notification, modal } = App.useApp()

  //引入zustand
  const state = useBearStore()

  const onFinish = async (values: Login.params) => {
    try {
      //请求前设置loading
      setLoading(true)

      const data: any = await api.login(values)

      //请求后设置loading为false
      setLoading(false)

      storage.set('token', data) //拦截器中返回的是data.data，就是token值

      //zustand更新token
      state.updateToken(data)
      message.success('登陆成功')

      //登出之后再进入，页面回到登出之前的地方。使用location.search获取地址、URLSearchParams得到callback
      const params = new URLSearchParams(location.search)

      setTimeout(() => {
        //如果有callback，跳到之前的页面；，没有则跳转到welcome
        location.href = params.get('callback') || '#/welcome'
      })
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <>
      <div className={style.login}>
        <div className={style.loginWrapper}>
          <div className={style.title}>系统登陆</div>
          <h2>376284281</h2>
          <h3>879416</h3>
          <Form name='basic' initialValues={{ remember: true }} onFinish={onFinish} autoComplete='off'>
            <Form.Item label='Username' name='userName' rules={[{ required: true, message: '请输入用户名' }]}>
              <Input />
            </Form.Item>

            <Form.Item label='Password' name='userPwd' rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' block loading={loading}>
                提交
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  )
}
