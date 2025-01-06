import api from '@/api/orderApi'

import { IModalProp } from '@/types/modal'
import { message } from '@/utils/AntdGlobal'
import { Modal } from 'antd'
import { useImperativeHandle, useState } from 'react'

//15.5 导入插件XRender
import FormRender, { useForm } from 'form-render'

const CreateOrder = (props: IModalProp) => {
  //1. 弹窗显示属性
  const [visable, setVisable] = useState(false)
  // const [cityList, setCityList] = useState<Order.DictItem[]>([])
  // const [vehicleList, setVehicleList] = useState<Order.DictItem[]>([])

  // const [form] = Form.useForm()
  const form = useForm()

  // 初始化城市列表、车型列表
  const getInitData = async () => {
    const cityList = await api.getCityList()
    const vehicleList = await api.getVehicleList()
    // setCityList(cityList)
    // setVehicleList(vehicleList)

    //Xrender初始化数据，用setSchema
    form.setSchema({
      cityName: {
        props: {
          options: cityList.map(item => ({ label: item.name, value: item.name }))
        }
      },
      vehicleName: {
        props: {
          options: vehicleList.map(item => ({ label: item.name, value: item.name }))
        }
      }
    })
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
      await api.createOrder(form.getValues()) //antd使用的是form.getFieldsValue()
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

  //XRender中的schema
  const schema = {
    type: 'object',
    displayType: 'row',
    column: 2,
    labelWidth: 120,
    properties: {
      cityName: {
        title: '城市名称',
        type: 'string',
        widget: 'select',
        rules: [{ required: true, message: '请选择城市名称' }]
      },
      vehicleName: {
        title: '车型',
        type: 'string',
        widget: 'select',
        required: true,
        rules: [{ required: true, message: '请选择车型' }]
      },
      userName: {
        title: '用户名称',
        type: 'string',
        widget: 'input',
        required: true,
        placeholder: '请输入用户名'
      },
      mobile: {
        title: '手机号',
        type: 'number',
        widget: 'input',
        required: true,
        placeholder: '请输入手机号'
      },
      startAddress: {
        title: '起始地址',
        type: 'string',
        widget: 'input',
        placeholder: '请输入起始地址'
      },
      endAddress: {
        title: '结束地址',
        type: 'string',
        widget: 'input',
        placeholder: '请输入结束地址'
      },
      orderAmount: {
        title: '下单金额',
        type: 'number',
        widget: 'inputNumber',
        placeholder: '请输入下单金额'
      },
      userPayAmount: {
        title: '支付金额',
        type: 'number',
        widget: 'inputNumber',
        placeholder: '请输入支付金额'
      },
      driverName: {
        title: '司机名称',
        type: 'string',
        widget: 'input',
        placeholder: '请输入司机名称',
        required: true
      },
      driverAmount: {
        title: '司机金额',
        type: 'number',
        widget: 'inputNumber',
        placeholder: '请输入司机金额',
        required: true
      },
      payType: {
        title: '支付方式',
        type: 'number',
        widget: 'select',
        placeholder: '请选择支付方式',
        props: {
          options: [
            { label: '微信', value: 1 },
            { label: '支付宝', value: 2 }
          ]
        }
      },
      state: {
        title: '订单状态',
        type: 'number',
        widget: 'select',
        placeholder: '请选择订单状态',
        props: {
          options: [
            { label: '进行中', value: 1 },
            { label: '已完成', value: 2 },
            { label: '超时', value: 3 },
            { label: '取消', value: 4 }
          ]
        }
      },
      useTime: {
        title: '用车时间',
        type: 'string',
        widget: 'datePicker'
      },
      endTime: {
        title: '结束时间',
        type: 'string',
        widget: 'datePicker'
      }
    }
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
      {/* 15.5 换成使用XRender制作表单*/}
      <FormRender form={form} schema={schema} onMount={getInitData} />
    </Modal>
  )
}

export default CreateOrder
