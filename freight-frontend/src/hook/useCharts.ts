import { RefObject, useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

// 自定义hook
// 之前useEffect中的写法：
// const lineChartDom = document.getElementById('lineChart')
// const chartInstance = echarts.init(lineChartDom)
// chartInstance.setOption({...})

const useCharts = (): [
  //定义返回值的类型，避免div上获取dom节点不匹配
  RefObject<HTMLDivElement>,
  echarts.ECharts | undefined
] => {
  //1. 定义ref,可以使用ref.current获取dom，不用document.getElementById
  const chartRef = useRef<HTMLDivElement>(null)

  //2. 等页面渲染完成后，才能获取dom节点lineChartDom，所以要使用useEffect
  //   lineChartsDom是之前的div.lineChartsDom,现在使用ref={chartRef}绑定，获得dom
  //   console.log(divRef); // 输出: { current: <div>...</div> }
  //   console.log(divRef.current); // 输出: <div>...</div>

  //3. 定义实例对象chartInstance
  const [chartInstance, setChartInstance] = useState<echarts.ECharts>() //默认为空

  useEffect(() => {
    //4. 初始化echarts
    const charts = echarts.init(chartRef.current)
    //更改chartInstance的值：
    setChartInstance(charts)
  }, [])

  return [chartRef, chartInstance]
}

export default useCharts
