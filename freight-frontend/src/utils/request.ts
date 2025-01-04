/**
 * 请求响应axios的封装
 */

import { message } from './AntdGlobal'
import axios, { AxiosError } from 'axios'
import { hideLoading, showLoading } from './loading'
import storage from './storage'
import env from '../config'
import { Result } from '@/types/api'

console.log('config', env)

//创建实例
const instance = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API, 在后面的config中已经设置了
  timeout: 8000,
  timeoutErrorMessage: '请求超时',
  withCredentials: true, //跨域
  headers: {
    icode: '68A99FB9E4AEE03F'
  }
})

//请求拦截器 req
instance.interceptors.request.use(
  config => {
    if (config.showLoading) showLoading()

    const token = storage.get('token') //使用封装的localstorage

    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }

    // ==============================================================
    // //配置中，如果MOCK开关打开，使用MOCK地址   字符串true
    // if (import.meta.env.VITE_MOCK == 'true') {
    //   config.baseURL = import.meta.env.VITE_MOCK_API
    // } else {
    //   config.baseURL = import.meta.env.VITE_BASE_API //编译时环境 BASE_API ：http://api-driver-dev.marsview.cc
    // }
    // ===========================封装了config后，👇=============================

    //配置中，如果MOCK开关打开，使用MOCK地址   字符串true
    if (env.mock) {
      config.baseURL = env.mockApi
    } else {
      config.baseURL = env.baseApi //编译时环境 BASE_API ：http://api-driver-dev.marsview.cc
    }

    return { ...config }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

//响应拦截器 res
instance.interceptors.response.use(
  response => {
    const data: Result = response.data
    hideLoading()

    // ==============14.8 导出文件 =================
    //二进制文件流继续执行不报错：当拦截的是二进制blob对象的时候，直接返回
    if (response.config.responseType == 'blob') return response

    // ==========================

    // 1. 50001未登陆，重定向到login页面
    if (data.code === 500001) {
      message.error(data.msg)
      // localStorage.removeItem('token') 使用storage
      storage.remove('token')

      // 9-5：失败后跳转到登陆页
      location.href = '#/login?callback=' + encodeURIComponent(location.href)
    } else if (data.code != 0) {
      if (response.config.showError === false) {
        return Promise.resolve(data)
      } else {
        message.error(data.msg)
        return Promise.reject(data)
      }
    }
    return data.data
  },
  error => {
    hideLoading()
    message.error(error.message)
    return Promise.reject(error.message)
  }
)

// config新字段
interface IConfig {
  showLoading?: boolean
  showError?: boolean
}

//封装的get、post
export default {
  //option是自定义的loading显示参数

  get<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    //原始：axios.get(url,{params:{}})
    //封装后：eg:{a:1,b:2}  现在访问是params.a  封装之前是params.params.a
    return instance.get(url, { params, ...options })
  },
  post<T>(url: string, params?: object, options: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.post(url, params, options)
  },

  //14.8 封装文件下载功能
  downLoadFile(url: string, data: any, fileName = 'fileName.xlsx') {
    instance({
      url,
      data,
      method: 'post',
      responseType: 'blob' //二进制对象，下载文件
    }).then(response => {
      const blob = new Blob([response.data], {
        type: response.data.type
      })

      //开始导出
      const name = (response.headers['file-name'] as string) || fileName
      const link = document.createElement('a')
      link.download = decodeURIComponent(name) //防止乱码
      link.href = URL.createObjectURL(blob)
      document.body.append(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    })
  }
}
