// 地图轨迹打点

import orderApi from '@/api/orderApi'
import { Order } from '@/types/api'
import { IDetailProp } from '@/types/modal'
import { message } from '@/utils/AntdGlobal'
import { Modal } from 'antd' //弹窗 modal
import { useImperativeHandle, useState } from 'react'

const OrderMarker = (props: IDetailProp) => {
  //1. 弹窗显示属性
  const [visable, setVisable] = useState(false)
  //订单状态
  const [orderId, setOrderId] = useState('')

  //打点的marker标记，是一个数组
  const [markers, setMarkers] = useState<{ lng: string; lat: string; id: number }[]>([])

  //子组件暴露open方法给父组件
  useImperativeHandle(props.mRef, () => {
    return { open }
  })
  //弹窗open方法
  const open = async (orderId: string) => {
    setOrderId(orderId)
    setVisable(true) //显示弹窗
    const detail = await orderApi.getOrderDetail(orderId) //获取订单详情
    renderMap(detail)
  }

  //渲染地图
  const renderMap = (detail: Order.OrderItem) => {
    //1. 地图初始化
    const map = new window.BMapGL.Map('markerMap')
    map.centerAndZoom(detail.cityName, 12)

    //添加控件
    var scaleCtrl = new window.BMapGL.ScaleControl() // 添加比例尺控件
    map.addControl(scaleCtrl)
    var zoomCtrl = new window.BMapGL.ZoomControl() // 添加缩放控件
    map.enableScrollWheelZoom()
    map.addControl(zoomCtrl)

    //再次打开地图，回显地图上已标记的点
    detail.route?.map(item => {
      createMarker(map, item.lng, item.lat)
    })

    //绑定打点点击的事件
    map.addEventListener('click', function (e: any) {
      createMarker(map, e.latlng.lng, e.latlng.lat)
    })
  }

  // 创建覆盖物marker
  const createMarker = (map: any, lng: string, lat: string) => {
    const id = Math.random()
    const marker = new window.BMapGL.Marker(new window.BMapGL.Point(lng, lat))

    //添加打点
    markers.push({ lng, lat, id }) //经纬度
    marker.id = id
    const markerMenu = new window.BMapGL.ContextMenu()
    markerMenu.addItem(
      new window.BMapGL.MenuItem('删除', function () {
        //删除打点
        map.removeOverlay(marker)
        const index = markers.findIndex(item => item.id === marker.id)
        markers.splice(index, 1)
        setMarkers([...markers])
      })
    )

    setMarkers([...markers]) //重新保存状态
    marker.addContextMenu(markerMenu)
    map.addOverlay(marker)
  }

  //打点提交
  const handleOk = async () => {
    await orderApi.updateOrderInfo({
      orderId,
      route: markers
    })
    message.success('打点成功')
    handleCancel()
  }

  //打点取消
  const handleCancel = () => {
    setVisable(false) //将visable属性变成false

    //重置轨迹，避免多次存储地图标。清除之前的缓存
    setMarkers([])
  }

  return (
    <Modal
      title='地图打点'
      width={1100}
      open={visable}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/* 打点地图 */}
      <div id='markerMap' style={{ height: 500 }}></div>
    </Modal>
  )
}

export default OrderMarker
