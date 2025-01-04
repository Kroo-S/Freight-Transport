// 弹窗的类型定义

// useRef()的类型为MutableRefObject<undefined>，导入后使用在自定义mRef上
import { MutableRefObject } from 'react'
import { User } from './api'

export type IAction = 'create' | 'edit' | 'delete'

// type和interface的类型定义是一样的
// type newProps = {className:string}
// interface newProps{className:string}

// 接口类型,自定义mRef,用useRef绑定

// 默认参数为User.UserItem类型
export interface IModalProp<T = User.UserItem> {
  mRef: MutableRefObject<{ open: (type: IAction, data: T) => void } | undefined>
  update: () => void
}

//订单详情页显示
export interface IDetailProp {
  mRef: MutableRefObject<{ open: (orderId: string) => void } | undefined>
}
