import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { IModalProp } from '@/types/modal'
import { message } from '@/utils/AntdGlobal'
import { Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'

const CreateOrder = (props: IModalProp) => {
  //1. 弹窗显示属性
  const [visable, setVisable] = useState(false)
  const [cityList, setCityList] = useState<Order.DictItem[]>([])
  const [vehicleList, setVehicleList] = useState<Order.DictItem[]>([])

  const [form] = Form.useForm()

  useEffect(() => {
    getInitData()
  }, [])
  // 初始化城市列表、车型列表
  const getInitData = async () => {
    const cityList = await api.getCityList()
    const vehicleList = await api.getVehicleList()
    setCityList(cityList)
    setVehicleList(vehicleList)
  }

  //2. 子组件[弹窗]的open方法暴露给父组件[页面]使用
  useImperativeHandle(props.mRef, () => {
    return { open }
  })

  //3. 子组件的open方法
  const open = () => {
    setVisable(true)
  }

  //hanldeOk 订单提交
  const handleOk = async () => {
    const valid = await form.validateFields()
    if (valid) {
      await api.createOrder(form.getFieldsValue())
      message.success('创建成功')
      handleCancel()
      props.update()
    }
  }

  //handleCnacel 弹窗关闭
  const handleCancel = () => {
    form.resetFields()
    setVisable(false)
  }

  return (
    <Modal
      title='创建订单'
      width={800}
      open={visable}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} layout='horizontal' labelAlign='right' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        {/* 第一行 */}
        <Row>
          <Col span={12}>
            <Form.Item name='cityName' label='城市名称' rules={[{ required: true, message: '请选择城市名称' }]}>
              <Select placeholder='请选择城市名称'>
                {cityList.map(item => {
                  return (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='vehicleName' label='车型' rules={[{ required: true, message: '请选择车型' }]}>
              <Select placeholder='请选择车型名称'>
                {vehicleList.map(item => {
                  return (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 第二行 */}
        <Row>
          <Col span={12}>
            <Form.Item name='userName' label='用户名称' rules={[{ required: true, message: '请输入用户名称' }]}>
              <Input placeholder='请输入用户名称' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='mobile' label='手机号'>
              <Input placeholder='请输入下单手机号' />
            </Form.Item>
          </Col>
        </Row>

        {/* 第三行 */}
        <Row>
          <Col span={12}>
            <Form.Item name='startAddress' label='起始地址'>
              <Input placeholder='请输入起始地址' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='endAddress' label='结束地址'>
              <Input placeholder='请输入结束地址' />
            </Form.Item>
          </Col>
        </Row>

        {/* 第四行 */}
        <Row>
          <Col span={12}>
            <Form.Item name='orderAmount' label='下单金额' rules={[{ required: true, message: '请输入下单金额' }]}>
              <Input type='number' placeholder='请输入下单金额' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='userPayAmount' label='支付金额' rules={[{ required: true, message: '请输入支付金额' }]}>
              <Input type='number' placeholder='请输入支付金额' />
            </Form.Item>
          </Col>
        </Row>

        {/* 第五行 */}
        <Row>
          <Col span={12}>
            <Form.Item name='driverName' label='司机名称' rules={[{ required: true, message: '请输入司机名称' }]}>
              <Input placeholder='请输入司机名称' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='driverAmount' label='司机金额' rules={[{ required: true, message: '请输入司机金额' }]}>
              <Input type='number' placeholder='请输入司机金额' />
            </Form.Item>
          </Col>
        </Row>

        {/* 第6行 */}
        <Row>
          <Col span={12}>
            <Form.Item name='payType' label='支付方式'>
              <Select placeholder='请选择支付方式'>
                <Select.Option value={1}>微信</Select.Option>
                <Select.Option value={2}>支付宝</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='state' label='订单状态'>
              <Select placeholder='请选择订单状态'>
                <Select.Option value={1}>进行中</Select.Option>
                <Select.Option value={1}>已完成</Select.Option>
                <Select.Option value={1}>超时</Select.Option>
                <Select.Option value={1}>取消</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* 第7行 */}
        <Row>
          <Col span={12}>
            <Form.Item name='useTime' label='用车时间'>
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='endTime' label='结束时间'>
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default CreateOrder
