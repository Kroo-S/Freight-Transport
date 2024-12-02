import api from '@/api'
import { getMenuPath } from '@/utils'

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
