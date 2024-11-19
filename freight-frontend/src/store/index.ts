import { User } from '@/types/api'
import { create } from 'zustand'
import store from '@/store'

// =============== zustand基础模型 ================
// ts定义类型
// type Store = {
//   bears: number
//   increasePopulation: () => void
// }

// export const useBearStore = create<Store>(set => ({
//   bears: 0,
//   increasePopulation: () => set(state => ({ bears: state.bears + 1 })), //更新+1
//   removeAllBears: () => set({ bears: 0 })
// }))

// =================== token ==================
// ts定义类型
type Store = {
  token: string
  userInfo: User.UserItem
  updateUserInfo: (userInfo: User.UserItem) => void
  updateToken: (token: string) => void

  //列表塌陷
  collapsed: boolean
  updateCollapsed: () => void
}

const useBearStore = create<Store>(set => ({
  token: '',
  userInfo: {
    _id: '',
    userId: 0,
    userName: '',
    userEmail: '',
    deptId: '',
    state: 0,
    mobile: '',
    job: '',
    role: 0,
    roleList: '',
    createId: 0,
    deptName: '',
    userImg: ''
  },
  //保存用户数据的方法，使用形式：increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
  updateToken: token => set({ token }),

  // 列表塌陷
  collapsed: false,
  updateCollapsed: () =>
    set(state => {
      return { collapsed: !state.collapsed }
    })
  // 等价于：箭头函数隐式返回
  // updateCollapsed:()=>set( (state) => ({collapsed:!state.collapsed}) )
}))

export default useBearStore
