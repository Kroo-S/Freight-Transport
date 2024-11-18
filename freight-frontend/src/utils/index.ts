/**
 * 工具函数封装
 */

//格式化金额
export const formatMoney = (num: number | string) => {
  const a = parseFloat(num.toString()) //有number和string两种，先转化成string，再转化成number，才能使用format格式化
  return a.toLocaleString('zh-CN', { style: 'currency', currency: 'CNY' })
}

//格式化日期
export const toLocalDate = (date?: Date, rule?: string) => {
  let curDate = new Date()
  if (date) {
    curDate = date
  }
  if (rule === 'yyyy-MM-dd') return curDate.toLocaleDateString().replaceAll('/', '-')
  if (rule === 'HH:mm:sss') return curDate.toLocaleTimeString().replaceAll('/', '-')
  return curDate.toLocaleDateString().replaceAll('/', '-')
}
