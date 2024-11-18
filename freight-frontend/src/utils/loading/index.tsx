// import { createRoot } from 'react-dom/client'
// import Loading from './loading'
import './loading.less'

// =============================== 方案一 =============================
//多个响应也只执行一次loading
// let count = 0

// //显示loading
// export const showLoading = () => {
//   //当第一次请求时候，响应，然后count+1；之后请求则不显示loading
//   if (count === 0) {
//     //动态创建loading
//     const loading = document.createElement('div')
//     loading.setAttribute('id', 'loading')
//     document.body.append(loading)
//     //渲染loading
//     createRoot(loading).render(<Loading />)
//   }
//   count++
// }

// //隐藏loading
// export const hideLoading = () => {
//   //当请求小于0，跳出
//   if (count < 0) return
//   //否则count-1
//   count--
//   //当count=0时，去掉loading
//   if (count === 0) document.body.removeChild(document.getElementById('loading') as HTMLDivElement)
// }

// =============================== 方案二 =============================
// https://coding.imooc.com/learn/questiondetail/G8glLPlLGEqPxpDa.html

let count = 0

export const showLoading = () => {
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'flex')
  }
  count++
}

export const hideLoading = () => {
  count--
  if (count === 0) {
    const loading = document.getElementById('loading')
    loading?.style.setProperty('display', 'none')
  }
}
