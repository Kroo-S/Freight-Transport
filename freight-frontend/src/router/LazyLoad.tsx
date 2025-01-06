import { Spin } from 'antd'
import { Suspense } from 'react'

/**
 * 组件懒加载，使用suspense实现
 * @param Component  组件对象
 * @returns  返回新组件
 */

const lazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>): React.ReactNode => {
  return (
    <Suspense
      fallback={
        <Spin
          size='large'
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
        />
      }
    >
      <Component />
    </Suspense>
  )
}

export default lazyLoad
