/**
 * 接口
 */

import request from '@/utils/request'
import { Dashboard, Dept, Login, Menu, ResultData, User } from '@/types/api'

// 可以写成：
// const login = () => {...}
// const getUserInfon = () => {...}
// export default {login, getUserInfo}
// 别的地方导入使用的时候：import {login, getUserInfo} from 'api'

// import:
// 有变量名的用{}: import { Login } from 'api'
// 没有的变量名的导入的时候名称随意  import api123 from './api'

export default {
  // 别的地方使用的时候，导入：import api from 'api'

  // 登陆
  login(params: Login.params) {
    return request.post<string>('/users/login', params, { showLoading: false })
  },

  // 获取用户信息
  getUserInfo() {
    return request.get<User.UserItem>('/users/getUserInfo')
  },
  //获取权限接口
  getPermissionList() {
    return request.get<{ buttonList: string[]; menuList: Menu.MenuItem[] }>('/users/getPermissionList')
  },

  // 获取工作台汇总数据
  getReportData() {
    return request.get<Dashboard.ReportData>('/order/dashboard/getReportData')
  },

  // 9.6 折线图接口数据
  getLineData() {
    return request.get<Dashboard.LineData>('/order/dashboard/getLineData')
  },

  // 饼图1接口
  getPieCityData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieCityData')
  },

  // 饼图2接口
  getPieAgeData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieAgeData')
  },

  // 雷达图接口
  getRadarData() {
    return request.get<Dashboard.RadarData>('/order/dashboard/getRadarData')
  },

  // 获取用户列表
  getUserList(params: User.Params) {
    // User.Params继承了PageParams
    return request.get<ResultData<User.UserItem>>('/users/list', params)
  },

  // 创建用户接口
  createUser(params: User.CreateParams) {
    return request.post('/users/create', params)
  },

  // 用户修改参数
  editUser(params: User.EditUser) {
    return request.post('/users/edit', params)
  },

  // 删除、批量删除用户
  delUser(params: { userIds: number[] }) {
    return request.post('/users/delete', params)
  },

  // =================== 11 部门管理 =================
  // 获取部门列表
  getDeptList(params?: Dept.Params) {
    // 查询的时候，是Params类型的参数；返回的时候是DeptItem的数组列表，DeptItem[]
    return request.get<Dept.DeptItem[]>('/dept/list', params)
  },
  getAllUserList() {
    // 获取当前帐号下的所有用户；多条数据，是数组形式
    return request.get<User.UserItem[]>('/users/all/list')
  },
  // 创建部门
  createDept(params: Dept.CreateParams) {
    return request.post('/dept/create', params)
  },
  //修改部门
  editDept(params: Dept.EditParams) {
    return request.post('/dept/edit', params)
  },
  //删除部门
  deleteDept(params: Dept.DelParams) {
    return request.post('/dept/delete', params)
  },

  // =================== 12. 菜单管理 ======================

  // 查询菜单   参数可有可无   返回类型是个数组
  getMenuList(params?: Menu.Params) {
    return request.get<Menu.MenuItem[]>('/menu/list', params)
  },
  //创建菜单
  createMenu(params: Menu.CreateParams) {
    return request.post('/menu/create', params)
  },
  //编辑菜单
  editMenu(params: Menu.EditParams) {
    return request.post('/menu/edit', params)
  },
  //删除菜单
  deleteMenu(params: Menu.DelParams) {
    return request.post('/menu/delete', params)
  }
}
