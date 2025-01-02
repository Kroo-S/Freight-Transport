// 13.2 创建用户列表

// 引入antd中的modal
import { Role } from '@/types/api'
import { IAction, IModalProp } from '@/types/modal'
import { Form, Input, Modal } from 'antd'
import { useImperativeHandle, useState } from 'react'
import api from '@/api/roleApi'
import { message } from '@/utils/AntdGlobal'

const CreateRole = (props: IModalProp<Role.RoleItem>) => {
  const [visable, setVisable] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [form] = Form.useForm()

  //暴露创建组件的open方法，给页面Role使用
  useImperativeHandle(props.mRef, () => {
    return { open }
  })

  //open是创建 还是 编辑
  const open = (type: IAction, data?: Role.RoleItem) => {
    setAction(type)
    setVisable(true)
    if (data) {
      //如果有数据，回显数据
      form.setFieldsValue(data)
    }
  }

  //提交事件
  const handleOk = async () => {
    //表单验证
    const valid = await form.validateFields()
    if (valid) {
      //验证成功，从表单获取数据
      const params = form.getFieldsValue()
      if (action === 'create') {
        await api.createRole(params)
      } else {
        await api.editRole(params)
      }
      message.success('操作成功')
      handleCancel()

      //父组件传递的更新列表的方法
      props.update
    }
  }

  //取消事件
  const handleCancel = () => {
    //重置表单值
    form.resetFields()
    //关闭弹窗
    setVisable(false)
  }

  return (
    <Modal
      title={action === 'create' ? '新增角色' : '编辑角色'}
      width={800}
      open={visable}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        {/* 隐藏的id */}
        <Form.Item name='_id' hidden>
          <Input />
        </Form.Item>

        <Form.Item name='roleName' label='角色名称' rules={[{ required: true, message: '请输入角色名称' }]}>
          <Input placeholder='请输入角色名称' />
        </Form.Item>

        <Form.Item name='roleName' label='备注'>
          <Input.TextArea placeholder='请输入备注' />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateRole
