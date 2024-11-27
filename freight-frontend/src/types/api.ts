/**
 * 接口类型定义
 */

// 返回结果的Result类型
export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

//10-4 用户列表分页参数
export interface PageParams {
  pageNum: number
  pageSize?: number
}

// Login请求参数中params的类型
export namespace Login {
  export interface params {
    userName: string
    userPwd: string
  }
}

// request.js封装的axios中，添加新增的自定义类型options,控制自定义Loading
declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean
    showError?: boolean
  }
}

// 9-4 工作台的命名空间
export namespace Dashboard {
  // 卡片部分
  export interface ReportData {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
  }

  // 9-6 图表接口类型定义：折线图、饼图1、饼图2、雷达图
  export interface LineData {
    label: string[]
    order: number[]
    money: number[]
  }
  export interface PieData {
    value: number
    name: string
  }
  export interface RadarData {
    indicator: Array<{ name: string; max: number }>
    data: {
      name: string
      value: number[]
    }
  }
}

// 10-3 列表分页结果
export interface ResultData<T = any> {
  list: T[]
  page: {
    pageNum: number
    pageSize: number
    total: number | 0
  }
}

// =========================================================

// 10. 用户的命名空间:用户管理
export namespace User {
  // 10-3 用户列表接口

  //10-4 继承分页参数
  export interface Params extends PageParams {
    userId?: number
    userName?: string
    state?: number
  }

  export interface UserItem {
    _id: string
    userId: number
    userName: string
    userEmail: string
    deptId: string
    state: number
    mobile: string
    job: string
    role: number
    roleList: string
    createId: number
    deptName: string
    userImg: string
  }

  // createUser界面中的输入项，即createUser(params)中的params
  export interface CreateParams {
    userName: string
    userEmail: string
    mobile?: number
    deptId: string
    job?: string
    state?: number
    roleList: string[]
    userImg: string
  }

  // 修改用户信息参数类型，只有新增了userId，所以继承CreateParams即可
  export interface EditUser extends CreateParams {
    userId: number
  }
}

// 11.1 部门列表数据类型
export namespace Dept {
  export interface Params {
    //1. 查询部门参数
    deptName?: string
  }
  export interface DeptItem {
    //2. 部门列表字段
    _id: string
    createTime: string
    updateTime: string
    deptName: string
    parentId: string //上级部门
    userName: string //管理人员
    childrend: [] //子部门，也是一个DeptItem
  }

  //3. 弹窗：新建部门参数
  export interface CreateParams {
    deptName: string
    parentId?: string
    userName: string
  }
  //4. 弹窗：编辑用户参数，多一个id
  export interface EditParams extends CreateParams {
    _id: string
  }
  //5. 删除部门
  export interface DelParams {
    _id: string
  }
}
