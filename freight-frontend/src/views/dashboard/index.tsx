import { Descriptions, Card, Button } from 'antd'
import styles from './index.module.less'

//导入echarts
//import * as echarts from 'echarts'

import { useEffect, useState } from 'react'
import useBearStore from '@/store'
import { formatMoney, formatNum, formatState } from '@/utils'
import api from '@/api'
import { Dashboard } from '@/types/api'
import useCharts from '@/hook/useCharts'

const DashBoard = () => {
  //9.4 添加zustand，加载个人信息
  const { userInfo } = useBearStore() //解构的方式

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
  }, [])

  // // ========================= 9-1 配置echarts =====================
  // useEffect(() => {
  //   //1. 折线图：初始化 & 定义配置
  //   const lineChartDom = document.getElementById('lineChart')
  //   const chartInstance = echarts.init(lineChartDom)
  //   chartInstance.setOption({
  //     // title: {                     //标题
  //     //   text: '订单和流水走势图'
  //     // },
  //     tooltip: {
  //       //鼠标弹层
  //       trigger: 'axis'
  //     },
  //     grid: {
  //       //表格尺寸
  //       left: 50,
  //       right: 50,
  //       bottom: 20
  //     },
  //     xAxis: {
  //       data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  //     },
  //     yAxis: {
  //       type: 'value'
  //     },
  //     series: [
  //       {
  //         name: '订单',
  //         type: 'line',
  //         data: [10, 20, 30, 50, 60, 70, 80, 90, 100, 110, 120, 120]
  //       },
  //       {
  //         name: '流水',
  //         type: 'line',
  //         data: [1000, 2000, 3000, 5000, 600, 800, 2000, 3200, 1100, 1200, 6000, 5000]
  //       }
  //     ]
  //   })

  //   //2. 饼图
  //   const pieChartCityDom = document.getElementById('pieChartCity')
  //   const pieChartCityInstance = echarts.init(pieChartCityDom as HTMLElement)
  //   pieChartCityInstance.setOption({
  //     title: {
  //       text: '司机城市分布',
  //       left: 'center'
  //     },
  //     tooltip: {
  //       trigger: 'item'
  //     },
  //     legend: {
  //       orient: 'vertical',
  //       left: 'left'
  //     },
  //     series: [
  //       {
  //         name: '城市分布',
  //         type: 'pie',
  //         radius: '50%',
  //         data: [
  //           { value: 335, name: '北京' },
  //           { value: 310, name: '上海' },
  //           { value: 274, name: '广州' },
  //           { value: 235, name: '杭州' },
  //           { value: 400, name: '武汉' }
  //         ]
  //       }
  //     ]
  //   })
  //   const pieChartAgeDom = document.getElementById('pieChartAge')
  //   const pieChartAgeInstance = echarts.init(pieChartAgeDom as HTMLElement)
  //   pieChartAgeInstance.setOption({
  //     title: {
  //       text: '司机年龄分布',
  //       left: 'center'
  //     },
  //     tooltip: {
  //       trigger: 'item'
  //     },
  //     legend: {
  //       orient: 'vertical',
  //       left: 'left'
  //     },
  //     series: [
  //       {
  //         name: '年龄分布',
  //         type: 'pie',
  //         radius: [50, 180],
  //         roseType: 'area',
  //         data: [
  //           { value: 30, name: '北京' },
  //           { value: 40, name: '上海' },
  //           { value: 60, name: '广州' },
  //           { value: 20, name: '杭州' },
  //           { value: 35, name: '武汉' }
  //         ]
  //       }
  //     ]
  //   })

  //   //3. 雷达图
  //   const radarChartDom = document.getElementById('radarChart')
  //   const radarChartDomInstance = echarts.init(radarChartDom as HTMLElement)
  //   radarChartDomInstance.setOption({
  //     // title: {
  //     //   text: '司机模型诊断',
  //     //   left: 'center'
  //     // },
  //     legend: {
  //       data: ['司机模型诊断']
  //     },
  //     radar: {
  //       indicator: [
  //         { name: '服务态度', max: 10 },
  //         { name: '在线时长', max: 600 },
  //         { name: '接单率', max: 100 },
  //         { name: '评分', max: 5 },
  //         { name: '关注度', max: 10000 }
  //       ]
  //     },
  //     series: [
  //       {
  //         name: '模型诊断',
  //         type: 'radar',
  //         data: [
  //           {
  //             value: [8, 300, 80, 4, 9000],
  //             name: '司机模型诊断'
  //           }
  //         ]
  //       }
  //     ]
  //   })
  // }, [])

  /*
  //===================== 9-5 自定义hook操作图表 ===================
  //1. useCharts初始化
  //折线图
  const [lineRef, lineChart] = useCharts()
  //饼图*2
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()
  //雷达图
  const [radarRef, radarChart] = useCharts()
  useEffect(() => {
    // 折线图
    lineChart?.setOption({
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

    //饼图1
    pieChart1?.setOption({
      title: {
        text: '司机城市分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '城市分布',
          type: 'pie',
          radius: '50%',
          data: [
            { value: 335, name: '北京' },
            { value: 310, name: '上海' },
            { value: 274, name: '广州' },
            { value: 235, name: '杭州' },
            { value: 400, name: '武汉' }
          ]
        }
      ]
    })

    //饼图2
    pieChart2?.setOption({
      title: {
        text: '司机年龄分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: [50, 180],
          roseType: 'area',
          data: [
            { value: 30, name: '北京' },
            { value: 40, name: '上海' },
            { value: 60, name: '广州' },
            { value: 20, name: '杭州' },
            { value: 35, name: '武汉' }
          ]
        }
      ]
    })

    //雷达图
    radarChart?.setOption({
      // title: {
      //   text: '司机模型诊断',
      //   left: 'center'
      // },
      legend: {
        data: ['司机模型诊断']
      },
      radar: {
        indicator: [
          { name: '服务态度', max: 10 },
          { name: '在线时长', max: 600 },
          { name: '接单率', max: 100 },
          { name: '评分', max: 5 },
          { name: '关注度', max: 10000 }
        ]
      },
      series: [
        {
          name: '模型诊断',
          type: 'radar',
          data: [
            {
              value: [8, 300, 80, 4, 9000],
              name: '司机模型诊断'
            }
          ]
        }
      ]
    })
  }, [lineChart, pieChart1, pieChart2, radarChart]) //首次加载useState为空，只有当内容变化setChartInstance才执行，所以要有依赖项

  */
  // ======================== 9-6 图表接口动态实现 =======================
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
    if (!lineChart) return //避免2次返回，当lineChart为空时返回
    const data = await api.getLineData()
    lineChart?.setOption({
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
        data: data.label
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单',
          type: 'line',
          data: data.order
        },
        {
          name: '流水',
          type: 'line',
          data: data.money
        }
      ]
    })
  }
  //2. 饼图1 city
  const renderPieChart1 = async () => {
    if (!pieChart1) return
    const data = await api.getPieCityData()
    pieChart1?.setOption({
      title: {
        text: '司机城市分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '城市分布',
          type: 'pie',
          radius: '50%',
          data: data
        }
      ]
    })
  }
  //3. 饼图2 age
  const renderPieChart2 = async () => {
    if (!pieChart2) return
    const data = await api.getPieAgeData()
    pieChart2?.setOption({
      title: {
        text: '司机年龄分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: [50, 180],
          roseType: 'area',
          data: data
        }
      ]
    })
  }
  //4. 雷达图
  const renderRadarChart = async () => {
    if (!radarChart) return
    const data = await api.getRadarData()
    radarChart?.setOption({
      // title: {
      //   text: '司机模型诊断',
      //   left: 'center'
      // },
      legend: {
        data: ['司机模型诊断']
      },
      radar: {
        indicator: data.indicator
      },
      series: [
        {
          name: '模型诊断',
          type: 'radar',
          data: data.data
        }
      ]
    })
  }

  // ==================== 9.7 图表刷新 ==================
  // 饼图1，2整体刷新，其他使用默认render方法
  const handleRefresh = () => {
    renderPieChart1(), renderPieChart2()
  }

  return (
    <div className={styles.dashboard}>
      {/* 个人信息 */}
      <div className={styles.userInfo}>
        <img src={userInfo.userImg} alt='' className={styles.userImg} />
        <Descriptions title='欢迎新同学，每天都要开心！'>
          <Descriptions.Item label='用户ID'>{userInfo.userId}</Descriptions.Item>
          <Descriptions.Item label='邮箱'>{userInfo.userEmail}</Descriptions.Item>
          <Descriptions.Item label='状态'>{formatState(userInfo.state)}</Descriptions.Item>
          <Descriptions.Item label='手机号'>{userInfo.mobile}</Descriptions.Item>
          <Descriptions.Item label='岗位'>{userInfo.job}</Descriptions.Item>
          <Descriptions.Item label='部门'>{userInfo.deptName}</Descriptions.Item>
        </Descriptions>
      </div>
      {/* 名牌介绍 */}
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>司机数量</div>
          <div className={styles.data}>{formatNum(report?.driverCount)}个</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总流水</div>
          <div className={styles.data}>{formatMoney(report?.totalMoney)}元</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总订单</div>
          <div className={styles.data}>{formatNum(report?.orderCount)}单</div>
        </div>
        <div className={styles.card}>
          <div className='title'>开通城市</div>
          <div className={styles.data}>{formatNum(report?.cityNum)}座</div>
        </div>
      </div>

      {/* 9-1 折线图、饼状图、雷达图 */}
      {/* <div className={styles.chart}>
        <Card title='订单和流水走势图' extra={<Button type='primary'>刷新</Button>}>
          <div id='lineChart' className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='司机分布' extra={<Button type='primary'>刷新</Button>}>
          <div className={styles.pieChart}>
            <div id='pieChartCity' className={styles.itemPie}></div>
            <div id='pieChartAge' className={styles.itemPie}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card title='模型诊断' extra={<Button type='primary'>刷新</Button>}>
          <div id='radarChart' className={styles.itemChart}></div>
        </Card>
      </div> */}

      {/* 9-5 自定义hook：折线图、饼状图、雷达图 */}
      <div className={styles.chart}>
        <Card
          title='订单和流水走势图'
          extra={
            <Button type='primary' onClick={renderLineChart}>
              刷新
            </Button>
          }
        >
          <div ref={lineRef} className={styles.itemChart}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='司机分布'
          extra={
            <Button type='primary' onClick={handleRefresh}>
              刷新
            </Button>
          }
        >
          <div className={styles.pieChart}>
            <div ref={pieRef1} className={styles.itemPie}></div>
            <div ref={pieRef2} className={styles.itemPie}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='模型诊断'
          extra={
            <Button type='primary' onClick={renderRadarChart}>
              刷新
            </Button>
          }
        >
          <div ref={radarRef} className={styles.itemChart}></div>
        </Card>
      </div>
    </div>
  )
}

export default DashBoard
