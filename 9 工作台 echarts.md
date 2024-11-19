# 9 工作台echats



## 9.1. 工作台个人信息静态布局

​	antd中的 <Description/>

```shell
import { Descriptions } from 'antd'
import styles from './index.module.less'
const DashBoard = () => {
  return (
    <div className={styles.dashboard}>
      <div className={styles.userInfo}>
        <img
          src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
          alt=''
          className={styles.userImg}
        />
        <Descriptions title='欢迎新同学，每天都要开心！'>
          <Descriptions.Item label='用户ID'>100001</Descriptions.Item>
          <Descriptions.Item label='邮箱'>test@mars.com</Descriptions.Item>
          <Descriptions.Item label='状态'>在职</Descriptions.Item>
          <Descriptions.Item label='手机号'>17600001111</Descriptions.Item>
          <Descriptions.Item label='岗位'>前端工程师</Descriptions.Item>
          <Descriptions.Item label='部门'>大前端</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>司机数量</div>
          <div className={styles.data}>100个</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总流水</div>
          <div className={styles.data}>10000元</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总订单</div>
          <div className={styles.data}>2000单</div>
        </div>
        <div className={styles.card}>
          <div className='title'>开通城市</div>
          <div className={styles.data}>50座</div>
        </div>
      </div>
    </div>
  )
}

export default DashBoard

```



Index.module.less

```shell
.dashboard {
  background-color: #fff;
  padding: 20px;
}
.userInfo {
  display: flex;
  align-items: center;
}
.userImg {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 25px;
}
.report {
  display: flex;
}
.card {
  flex: 1;
  height: 100px;
  padding: 10px;
  margin-right: 20px;
  border-radius: 5px;
  color: #fff;
  font-size: 14px;
  &:nth-child(1) {
    background-color: #f4864f;
  }
  &:nth-child(2) {
    background-color: #887edc;
  }
  &:nth-child(3) {
    background-color: #4f95e5;
  }
  &:nth-child(4) {
    background-color: #6dc3d7;
  }
  &:last-child {
    margin-right: 0;
  }
}
.data {
  text-align: center;
  font-size: 24px;
}

```





## 9.2. Echart图表：折线图

​	view->dashboard中useEffect初始化配置：

```shell
  //配置echarts
  useEffect(() => {
    //1. 初始化 & 定义配置
    const lineChartDom = document.getElementById('lineChart')
    const chartInstance = echarts.init(lineChartDom)
    chartInstance.setOption({
      // title: {                     //标题
      //   text: '订单和流水走势图'
      // },
      tooltip: {
        //鼠标弹层
        trigger: 'axis'
      },
      grid: {
        //表格尺寸
        left: 50,
        right: 50,
        bottom: 20
      },
      xAxis: {
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单',
          type: 'line',
          data: [10, 20, 30, 50, 60, 70, 80, 90, 100, 110, 120, 120]
        },
        {
          name: '流水',
          type: 'line',
          data: [1000, 2000, 3000, 5000, 600, 800, 2000, 3200, 1100, 1200, 6000, 5000]
        }
      ]
    })
  }, [])

```



​	return中添加：

```shell
 {/* 折线图、饼状图、雷达图 */}
      <div className={styles.chart}>
        <Card title='订单和流水走势图' extra={<Button type='primary'>刷新</Button>}>
          <div id='lineChart' className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='司机分布' extra={<Button type='primary'>刷新</Button>}>
          <div id='pieChartCity' className={styles.itemChart}></div>
          <div id='pieChartAge' className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='模型诊断' extra={<Button type='primary'>刷新</Button>}>
          <div id='radarChart' className={styles.itemChart}></div>
        </Card>
      </div>
```





## 9.3. Echart图表：饼状图、雷达图

​	饼图：

```shell
		const pieChartCityDom = document.getElementById('pieChartCity')
    const pieChartCityInstance = echarts.init(pieChartCityDom as HTMLElement)
    pieChartCityInstance.setOption({...})
    
    const pieChartAgeDom = document.getElementById('pieChartAge')
    const pieChartAgeInstance = echarts.init(pieChartAgeDom as HTMLElement)
    pieChartAgeInstance.setOption({...})
```



​	雷达图：

```shell
		const radarChartDom = document.getElementById('radarChart')
    const radarChartDomInstance = echarts.init(radarChartDom as HTMLElement)
    radarChartDomInstance.setOption({...})
```





## 9.4. 个人信息 & 图表内容动态加载

​	

#### ·用户信息

store->indexes: 修改zustand中userInfo类型为User.UserItem

```shell
userInfo: User.UserItem

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
```



​	utils->index.tsx中添加用户在职状态函数，

```shell
 //用户在职状态
export const formatState = (state: number) => {
  if (state === 1) return '在职'
  if (state === 2) return '试用期'
  if (state === 3) return '离职'
}
    
```



​	dashboard->index.tsx:   添加zustand，加载用户信息

```shell
 //9.4 添加zustand，加载个人信息
  const { userInfo } = useBearStore() //解构的方式
  
  	<Descriptions title='欢迎新同学，每天都要开心！'>
    	<Descriptions.Item label='用户ID'>{userInfo.userId}</Descriptions.Item>
      <Descriptions.Item label='邮箱'>{userInfo.userEmail}</Descriptions.Item>
      <Descriptions.Item label='状态'>{ formatState(userInfo.state) }</Descriptions.Item>
      <Descriptions.Item label='手机号'>{userInfo.mobile}</Descriptions.Item>
      <Descriptions.Item label='岗位'>{userInfo.job}</Descriptions.Item>
      <Descriptions.Item label='部门'>{userInfo.deptName}</Descriptions.Item>
    </Descriptions>
    
```



#### ·工作台统计数据

types->api.ts中定义Dashboard的命名空间

```shell
export namespace Dashboard {
  export interface ReportData {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
  }
}
```



api的index.ts中调用接口

```shell
//获取工作台汇总数据
  getReportData() {
    return request.get<Dashboard.ReportData>('/order/dashboard/getReportData')
  }
```

dashboard中渲染工作台数据

```shell
 //9-4 获取工作台数据
  const [report, setReport] = useState<Dashboard.ReportData>()

  //setReport(data) 报错的原因是因为
  //api.getReportData() 返回的是一个 Promise 对象
  //而 setReport 需要的是一个直接的值，而不是一个 Promise。
  const getReportData = async () => {
    const data = await api.getReportData()
    setReport(data)
  }

  //useEffect渲染数据: useEffect()中不能写async
  useEffect(() => {
    getReportData()
  })
  
  return(
  {/* 名牌介绍 */}
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>司机数量</div>
          <div className={styles.data}>{report?.driverCount}个</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总流水</div>
          <div className={styles.data}>{report?.totalMoney}元</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总订单</div>
          <div className={styles.data}>{report?.orderCount}单</div>
        </div>
        <div className={styles.card}>
          <div className='title'>开通城市</div>
          <div className={styles.data}>{report?.cityNum}座</div>
        </div>
      </div>
  )
```





## 9.5. 自定义Echarts Hook，简化开发



#### ·跳转登陆页面

Utils->request.ts中：失败后跳转登陆页面

```shell
// 9-5：失败后跳转到登陆页
location.href = '#/login?callback=' + encodeURIComponent(location.href)
```



#### Hook->useCharts.ts 自定义hook

​	useRef：绑定了useRef的dom节点，可以使用uesRef获取

​	document.getElementById()：原生方式获取dom节点

```shell
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
  const [chartInstance, setChartInstance] = useState<echarts.ECharts>()		//默认为空

  useEffect(() => {
    //4. 初始化echarts
    const charts = echarts.init(chartRef.current)
    //更改chartInstance的值：
    setChartInstance(charts)
  }, [])

  return [chartRef, chartInstance]
}

export default useCharts

```



#### dashboard->index.tsx:

 使用ref获取dom，之前是用id获取

```shell
<Card title='订单和流水走势图' extra={<Button type='primary'>刷新</Button>}>
	<div ref={lineRef} className={styles.itemChart}></div>
</Card>
```

useCharts初始化

```shell
	//折线图
  const [lineRef, lineChart] = useCharts()
  //饼图*2
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()
  //雷达图
  const [radarRef, radarChart] = useCharts()
  
  useEffect(()=>{
  	lineChart?.setOption({...})			//折线图
  	pieChart1?.setOption({...})			//饼图1
  	pieChart2?.setOption({...})			//饼图2
  	radarChart?.setOption({...})		//雷达图
  },[lineChart,pieChart1,pieChart2,radarChart])		
  
  //首次加载useState为空，只有当内容变化setChartInstance才执行，所以要有依赖项
  
```





## 9.6. 图表数据接口动态实现



#### ·类型定义 type->api.ts

​	折线图、饼图1、饼图2、雷达图

```shell
export namespace Dashboard {
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
  export interface ReportData {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
  }
}
```



#### ·接口定义 api->index.ts

​	折线图、饼图1、饼图2、雷达图

```shell
//9.6 折线图接口数据
  getLineData() {
    return request.get<Dashboard.LineData>('/order/dashboard/getLineData')
  },

  // 饼图1接口
  getPieCityData() {
    return request.get<Dashboard.PieData>('/order/dashboard/getPieCityData')
  },

  //饼图2接口
  getPieAgeData() {
    return request.get<Dashboard.PieData>('/order/dashboard/getPieAgeData')
  },

  //雷达图接口
  getRadarData() {
    return request.get<Dashboard.RadarData>('/order/dashboard/getRadarData')
  }
```



#### ·接口动态实现 api->index.ts

​	折线图、饼图1、饼图2、雷达图

```shell
//useCharts初始化
  //折线图
  const [lineRef, lineChart] = useCharts()
  //饼图*2
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()
  //雷达图
  const [radarRef, radarChart] = useCharts()

  useEffect(() => {
    //useEffect中不支持async，所以在外面定义async函数
    //图表函数：
    renderLineChart(), renderPieChart1(), renderPieChart2(), renderRadarChart()
  }, [lineChart, pieChart1, pieChart2, radarChart])

  //1. 加载折线图数据
  const renderLineChart = async () => {
    if (!lineChart) return 									//避免2次返回，当lineChart为空时返回
    const data = await api.getLineData()
    lineChart?.setOption({...  data  ...})
  }
  //2. 饼图1 city
  const renderPieChart1 = async () => {
    if (!pieChart1) return
    const data = await api.getPieCityData()
    pieChart1?.setOption({...  data  ...})
  }
  //3. 饼图2 age
  const renderPieChart2 = async () => {
    if (!pieChart2) return
    const data = await api.getPieAgeData()
    pieChart2?.setOption({...  data  ...})
  }
  //4. 雷达图
  const renderRadarChart = async () => {
    if (!radarChart) return
    const data = await api.getRadarData()
    radarChart?.setOption({ ...  data  ...})
  }
```





## 9.7. 图表刷新功能实现



```shell
// 饼图1，2整体刷新，其他使用默认render方法
  const handleRefresh = () => {
    renderPieChart1(), renderPieChart2()
  }
  
//其他类似：直接添加onclick
<Card
  title='订单和流水走势图'
  extra={
    <Button type='primary' onClick={renderLineChart} > 刷新 </Button>
  }
>
  <div ref={lineRef} className={styles.itemChart}></div>
</Card>
  
```

