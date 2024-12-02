import api from '@/api'
import { Menu } from '@/types/api'
import { Button, Form, Input, message, Modal, Select, Space, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useRef, useState } from 'react'

import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'
import CreateMenu from './CreateMenu'

const MenuList = () => {
  // 1. antd中自定义hook
  const [form] = useForm()
  // 创建data
  const [data, setData] = useState<Menu.MenuItem[]>([])

  // 3. useEffect定义渲染时候的执行函数，非用户事件的渲染
  useEffect(() => {
    getMenuList() //调用getMenuList()，渲染列表
  }, [])

  // 搜索：获取菜单列表信息，使用async await;使用setData将data的值从form表单获取；最后在useEffect中运行getMenuList()渲染
  const getMenuList = async () => {
    const data = await api.getMenuList(form.getFieldsValue()) //获取form表单绑定的数据
    setData(data)
  }

  // 搜索：重置方法,调用form的resetFields()
  const handleReset = () => {
    form.resetFields()
  }

  // =================== 11.3 父组件点击新增按钮，打开弹窗子组件 ===================
  //绑定ref
  const menuRef = useRef<{
    open: (type: IAction, data?: Menu.EditParams | { parentId?: string; orderBy?: number }) => void
  }>()
  //新增、编辑、删除
  const handleCreate = () => {
    // 从绑定的ref中，获取子组件open方法，按钮新增
    menuRef.current?.open('create', {
      orderBy: data.length // 排序的数值，有多少组数据
    })
  }
  const handleEdit = (record: Menu.MenuItem) => {
    menuRef.current?.open('edit', record)
  }
  //表格新增
  const handleSubCreate = (record: Menu.MenuItem) => {
    menuRef.current?.open('create', { parentId: record._id, orderBy: record.children?.length })
  }
  //删除，回显删除类型：菜单、按钮、页面
  const handleDelete = (record: Menu.MenuItem) => {
    let text = ''
    if (record.menuType == 1) text = '菜单'
    if (record.menuType == 2) text = '按钮'
    if (record.menuType == 3) text = '页面'
    //弹窗确认
    Modal.confirm({
      title: '确认',
      content: `确认删除${text}？`,
      onOk() {
        handleDelSubmit(record._id)
      }
    })
  }
  //删除提交函数
  const handleDelSubmit = async (_id: string) => {
    await api.deleteMenu({
      _id
    })
    message.success('删除成功')
    getMenuList()
  }

  // 2. columns静态数据   弹窗字段
  const columns: ColumnsType<Menu.MenuItem> = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName'
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon'
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      render(menuType: number) {
        return {
          1: '菜单',
          2: '按钮',
          3: '页面'
        }[menuType]
      }
    },
    {
      title: '权限标识',
      dataIndex: 'menuCode',
      key: 'menuCode'
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: '组件名称',
      dataIndex: 'component',
      key: 'component'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record)}>
              新增
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <>
      <div>
        {/* 默认情况显示“正常”菜单：{menuState:1} */}
        <Form className='search-form' layout='inline' form={form} initialValues={{ menuState: 1 }}>
          <Form.Item label='菜单名称' name='menuName'>
            <Input placeholder='菜单名称' />
          </Form.Item>
          <Form.Item label='菜单状态' name='menuState'>
            <Select style={{ width: 100 }}>
              <Select.Option value={1}>正常</Select.Option>
              <Select.Option value={2}>停用</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <div>
              <Button type='primary' className='mr10' onClick={getMenuList}>
                搜索
              </Button>
              <Button type='default' onClick={handleReset}>
                重置
              </Button>
            </div>
          </Form.Item>
        </Form>
        <div className='base-table'>
          <div className='header-wrapper'>
            <div className='title'>菜单列表</div>
            <div className='action'>
              <Button onClick={handleCreate} type='primary'>
                新增
              </Button>
            </div>
          </div>
          <Table bordered rowKey='_id' columns={columns} dataSource={data} pagination={false} />
        </div>
        <CreateMenu mRef={menuRef} update={getMenuList} />
      </div>
    </>
  )
}

export default MenuList
