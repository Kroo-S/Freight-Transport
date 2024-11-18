/**
 * localStorage模块封装
 */

export default {
  /**
   * storage存储
   * @param key
   * @param value
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value)) //value可能为对象，转化成string类型 {a:1}=>"{a:1}"
  },

  /**
   * storage 读取
   * @param key
   * @returns
   */
  get(key: string) {
    const value = localStorage.getItem(key)
    if (!value) return ''
    try {
      return JSON.parse(value) //JSONParse将字符串转为对象
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return value
    }
  },

  /**
   * 删除
   * @param key
   */
  remove(key: string) {
    localStorage.removeItem(key)
  },

  /**
   * 清空
   */
  clear() {
    localStorage.clear()
  }
}
