/**
 * 菜单弹窗
 */

import { IAction, IModalProp } from '@/types/modal'
import { Form, Input, InputNumber, Modal, Radio, TreeSelect } from 'antd'
import { useImperativeHandle, useState } from 'react'
import { Menu } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import { message } from '@/utils/AntdGlobal'
import { InfoCircleOutlined } from '@ant-design/icons'

const CreateMenu = (props: IModalProp<Menu.EditParams>) => {
  //1. 定义table中action是创建还是修改
  const [action, setAction] = useState<IAction>('create')
  // 定义编辑的时候，回显的菜单内容
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])

  // open方法中，显示弹窗
  const [visible, setVisible] = useState(false)
  // 关联form表单
  const [form] = useForm()

  //===================== 11.4 弹窗：菜单新增、编辑、删除接口实现 ==================

  //回显菜单列表
  const getMenuList = async () => {
    const data = await api.getMenuList() //获取form表单绑定的数据
    setMenuList(data)
  }

  // ================= 11.3 子组件open方法暴露给父组件 ==================
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //打开弹窗，open; 编辑的时候要回显菜单信息，添加参数parentId
  const open = (type: IAction, data?: Menu.EditParams | { parentId: string }) => {
    //设置action的类型
    setAction(type)
    setVisible(true)
    getMenuList() //打开的时候重新刷新数据
    // 新增按钮 or 子菜单新增；只要有data都填充
    if (data) {
      // 编辑模式下，回显数据
      form.setFieldsValue(data) //此处保存了父组件的orderBy:data.length
    }
  }

  // 提交: 创建 && 修改的提交按钮
  const handleSubmit = async () => {
    const valid = await form.validateFields()
    if (valid) {
      if (action === 'create') {
        await api.createMenu(form.getFieldsValue())
      } else {
        await api.editMenu(form.getFieldsValue())
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
      title={action === 'create' ? '创建菜单' : '编辑菜单'}
      width={800}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 4 }} initialValues={{ menuType: 1, menuState: 1 }}>
        <Form.Item hidden name='_id'>
          <Input />
        </Form.Item>
        <Form.Item label='上级菜单' name='parentId'>
          <TreeSelect
            placeholder='请选择父级菜单'
            allowClear
            treeDefaultExpandAll
            fieldNames={{ label: 'menuName', value: '_id' }}
            treeData={menuList}
          />
        </Form.Item>
        <Form.Item label='菜单类型' name='menuType'>
          <Radio.Group>
            <Radio value={1}>菜单</Radio>
            <Radio value={2}>按钮</Radio>
            <Radio value={3}>页面</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='菜单名称' name='menuName' rules={[{ required: true, message: '请输入菜单名称' }]}>
          <Input placeholder='请输入菜单名称' />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() => {
            return form.getFieldValue('menuType') === 2 ? (
              <Form.Item label='权限标识' name='menuCode'>
                <Input placeholder='请输入权限标识' />
              </Form.Item>
            ) : (
              <>
                <Form.Item label='菜单图标' name='icon'>
                  <Input placeholder='请输入菜单图标' />
                </Form.Item>
                <Form.Item label='路由地址' name='path'>
                  <Input placeholder='请输入路由地址' />
                </Form.Item>
              </>
            )
          }}
        </Form.Item>
        <Form.Item label='组件名称' name='component'>
          <Input placeholder='请输入组件名称' />
        </Form.Item>
        <Form.Item
          label='排序'
          name='orderBy'
          tooltip={{ title: '排序值越大越靠后', icon: <InfoCircleOutlined rev={undefined} /> }}
        >
          <InputNumber placeholder='请输入排序值' />
        </Form.Item>
        <Form.Item label='菜单状态' name='menuState'>
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={2}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateMenu
