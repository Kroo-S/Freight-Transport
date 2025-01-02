import api from '@/api'
import { Menu } from '@/types/api'
import { getMenuPath } from '@/utils'

//定义类型
export interface IAuthLoader {
  buttonList: string[]
  menuList: Menu.MenuItem[]
  menuPathList: string[]
}

export default async function AuthLoader() {
  const data = await api.getPermissionList()

  //获得路径数组
  const menuPathList = getMenuPath(data.menuList)

  return {
    buttonList: data.buttonList,
    menuList: data.menuList,
    menuPathList
  }
}
