/**
 * 接口
 */

import request from '@/utils/request'
import { Login, User } from '@/types/api'

export default {
  //别的地方使用的时候，导入：import api from 'api'

  //登陆
  login(params: Login.params) {
    return request.post<string>('/users/login', params, { showLoading: false })
  },

  //获取用户信息
  getUserInfo() {
    return request.get<User.UserItem>('/users/getUserInfo')
  }
}

// 可以写成：
// const login = () => {...}
// const getUserInfon = () => {...}
// export default {login, getUserInfo}
// 别的地方导入使用的时候：import {login, getUserInfo} from 'api'

// import:
// 有变量名的用{}: import { Login } from 'api'
// 没有的变量名的导入的时候名称随意  import api123 from './api'
