/**
 * 接口
 */

import request from '@/utils/request'
import { Dashboard, Login, User } from '@/types/api'

// 可以写成：
// const login = () => {...}
// const getUserInfon = () => {...}
// export default {login, getUserInfo}
// 别的地方导入使用的时候：import {login, getUserInfo} from 'api'

// import:
// 有变量名的用{}: import { Login } from 'api'
// 没有的变量名的导入的时候名称随意  import api123 from './api'

export default {
  //别的地方使用的时候，导入：import api from 'api'

  //登陆
  login(params: Login.params) {
    return request.post<string>('/users/login', params, { showLoading: false })
  },

  //获取用户信息
  getUserInfo() {
    return request.get<User.UserItem>('/users/getUserInfo')
  },

  //获取工作台汇总数据
  getReportData() {
    return request.get<Dashboard.ReportData>('/order/dashboard/getReportData')
  },

  //9.6 折线图接口数据
  getLineData() {
    return request.get<Dashboard.LineData>('/order/dashboard/getLineData')
  },

  // 饼图1接口
  getPieCityData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieCityData')
  },

  //饼图2接口
  getPieAgeData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieAgeData')
  },

  //雷达图接口
  getRadarData() {
    return request.get<Dashboard.RadarData>('/order/dashboard/getRadarData')
  }
}
