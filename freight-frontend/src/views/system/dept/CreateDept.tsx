/**
 * 部门弹窗
 */

import { IAction, IModalProp } from '@/types/modal'
import { Form, Input, Modal, Select, TreeSelect } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import { Dept, User } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import { message } from '@/utils/AntdGlobal'

const CreateDept = (props: IModalProp<User.UserItem>) => {
  //1. 定义table中action是创建还是修改
  const [action, setAction] = useState<IAction>('create')
  // 定义编辑的时候，回显的表单内容
  const [deptList, setDeptList] = useState<Dept.DeptItem[]>([])
  // 回显的所有用户列表
  const [userList, setUserList] = useState<User.UserItem[]>([])
  // open方法中，显示弹窗
  const [visible, setVisible] = useState(false)
  // 关联form表单
  const [form] = useForm()
  useEffect(() => {
    getAllUserList()
  }, [])

  //===================== 11.4 弹窗：部门新增、编辑、删除接口实现 ==================

  //回显部门列表
  const getDeptList = async () => {
    const data = await api.getDeptList()
    setDeptList(data)
  }
  //回显用户列表
  const getAllUserList = async () => {
    const data = await api.getAllUserList()
    setUserList(data)
  }

  // ================= 11.3 子组件open方法暴露给父组件 ==================
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //打开弹窗，open; 编辑的时候要回显部门信息，添加参数parentId
  const open = (type: IAction, data?: Dept.EditParams | { parentId: string }) => {
    //设置action的类型
    setAction(type)
    setVisible(true)
    getDeptList() //打开的时候重新刷新数据
    // 新增按钮 or 子部门新增；只要有data都填充
    if (data) {
      // 编辑模式下，回显数据
      form.setFieldsValue(data)
    }
  }

  // 提交: 创建 && 修改的提交按钮
  const handleSubmit = async () => {
    const valid = await form.validateFields()
    if (valid) {
      if (action === 'create') {
        await api.createDept(form.getFieldsValue())
      } else {
        await api.editDept(form.getFieldsValue())
      }
      //操作完成：提示框、handleCancel取消弹窗、props.update更新列表信息
      message.success('操作成功！')
      handleCancel()
      props.update()
    }
  }

  // 关闭、重置、取消
  const handleCancel = () => {
    setVisible(false)
    form.resetFields() //清空表单
  }

  return (
    <Modal
      title={action === 'create' ? '创建部门' : '编辑部门'}
      width={800}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item hidden name='_id'>
          <Input />
        </Form.Item>
        <Form.Item label='上级部门' name='parentId'>
          <TreeSelect
            placeholder='请选择上级部门'
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={deptList}
          />
        </Form.Item>
        <Form.Item label='部门名称' name='deptName' rules={[{ required: true, message: '请输入部门名称' }]}>
          <Input placeholder='请输入部门名称' />
        </Form.Item>
        <Form.Item label='负责人' name='userName' rules={[{ required: true, message: '请选择负责人' }]}>
          <Select>
            {userList.map(item => {
              return (
                <Select.Option value={item.userName} key={item._id}>
                  {item.userName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateDept
