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

// 12. 菜单列表
export namespace Menu {
  //1. 查询参数   Params
  export interface Params {}

  //2. 菜单创建   弹窗
  export interface CreateParams {
    menuName: string // 菜单名称
    icon?: string // 菜单图标
    menuType: number // 1: 菜单 2：按钮 3：页面
    menuState: number // 1：正常 2：停用
    menuCode?: string // 按钮权限标识
    parentId?: string // 父级菜单ID
    path?: string // 菜单路径
    component?: string // 组件名称
    orderBy: number // 组件排序
  }

  //3. 菜单列表   显示
  export interface MenuItem extends CreateParams {
    _id: string
    createTime: string
    buttons?: MenuItem[]
    children?: MenuItem[]
  }
  //4. 编辑参数类型
  export interface EditParams extends CreateParams {
    _id?: string
  }
  //5. 删除菜单
  export interface DelParams {
    _id: string
  }
}

// 13 角色管理
export namespace Role {
  export interface Params extends PageParams {
    roleName?: string
  }
  export interface CreateParams {
    roleName: string
    remark?: string
  }
  export interface RoleItem extends CreateParams {
    _id: string
    permissionList: {
      checkedKeys: string[] //全选  antd
      halfCheckedKeys: string[] //半全选  antd的tree的属性
    }
    updateTime: string
    createTime: string
  }

  //编辑用户
  export interface EditParams extends CreateParams {
    _id: string
  }

  //权限类型
  export interface Permission {
    _id: string
    permissionList: {
      checkedKeys: string[] //全选  antd
      halfCheckedKeys: string[] //半全选  antd的tree的属性
    }
  }
}

// 14 订单管理
export namespace Order {
  export enum IState {
    doing = 1,
    done = 2,
    timeout = 3,
    cance = 4
  }

  export interface CreateParams {
    cityName: string
    userName: string
    mobile: number
    startAddress: string //下单开始地址
    endAddress: string //下单结束地址
    orderAmount: number //订单金额
    userPayAmount: number //支付金额
    driverAmount: number //支付金额
    // 1: 微信 2：支付宝
    payType: number //支付方式
    driverName: string //司机名称
    vehicleName: string //订单车型
    // 1: 进行中 2：已完成 3：超时 4：取消
    state: IState // 订单状态
    // 用车时间
    useTime: string
    // 订单结束时间
    endTime: string
  }

  export interface OrderItem extends CreateParams {
    _id: string
    orderId: string //订单ID
    route: Array<{ lng: string; lat: string }> //行驶轨迹
    createTime: string //创建时间
    remark: string //备注
  }

  //搜索类型
  export interface SearchParams {
    orderId?: string
    userName?: string
    state?: IState
  }

  //分页类型接口
  export interface Params extends PageParams {
    orderId?: string
    userName?: string
    state?: IState
  }

  //定义通用类型的字典
  export interface DictItem {
    id: string
    name: string
  }

  //地图打点路径类型
  export interface OrderRoute {
    orderId: string
    route: Array<{ lng: string; lat: string }>
  }

  //14.10 司机列表
  export interface DriverParams {
    driverName?: string
    accountStatus?: number
  }
  export enum DriverStatus {
    auth = 0, // 待认证
    normal = 1, //正常
    temp = 2, // 暂时拉黑
    always = 3, // 永久拉黑
    stop = 4 //停止推送
  }
  export interface DriverItem {
    driverName: string // 司机名称
    driverId: number // 司机ID
    driverPhone: string // 司机手机号
    cityName: string // 城市名称
    grade: boolean // 会员等级
    driverLevel: number // 司机等级
    accountStatus: DriverStatus // 司机状态
    carNo: string // 车牌号
    vehicleBrand: string // 车辆品牌
    vehicleName: string // 车辆名称
    onlineTime: number // 昨日在线时长
    driverAmount: number // 昨日司机流水
    rating: number // 司机评分
    driverScore: number // 司机行为分
    pushOrderCount: number // 昨日推单数
    orderCompleteCount: number // 昨日完单数
    createTime: string // 创建时间
  }
}
