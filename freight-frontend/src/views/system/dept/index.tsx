import api from '@/api'
import { Dept } from '@/types/api'
import { Button, Form, Input, message, Modal, Space, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useRef, useState } from 'react'
import CreateDept from './CreateDept'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { formatDate } from '@/utils'

const DeptList = () => {
  // 1. antd中自定义hook
  const [form] = useForm()
  // 创建data
  const [data, setData] = useState<Dept.DeptItem[]>([])

  // 3. useEffect定义渲染时候的执行函数，非用户事件的渲染
  useEffect(() => {
    getDeptList() //调用getDeptList()，渲染列表
  }, [])

  // 搜索：获取部门列表信息，使用async await;使用setData将data的值从form表单获取；最后在useEffect中运行getDeptList()渲染
  const getDeptList = async () => {
    const data = await api.getDeptList(form.getFieldsValue()) //获取form表单绑定的数据
    setData(data)
  }

  // 搜索：重置方法,调用form的resetFields()
  const handleReset = () => {
    form.resetFields()
  }

  // =================== 11.3 父组件点击新增按钮，打开弹窗子组件 ===================
  //绑定ref
  const deptRef = useRef<{ open: (type: IAction, data?: Dept.EditParams | { parentId: string }) => void }>()
  //新增、编辑、删除
  const handleCreate = () => {
    // 从绑定的ref中，获取子组件open方法，按钮新增
    deptRef.current?.open('create')
  }
  const handleEdit = (record: Dept.DeptItem) => {
    deptRef.current?.open('edit', record)
  }
  //表格新增
  const handleSubCreate = (id: string) => {
    deptRef.current?.open('create', { parentId: id })
  }
  //删除
  const handleDelete = (id: string) => {
    //弹窗确认
    Modal.confirm({
      title: '确认',
      content: '确认删除部门？',
      onOk() {
        handleDelSubmit(id)
      }
    })
  }
  //删除提交函数
  const handleDelSubmit = async (_id: string) => {
    await api.deleteDept({
      _id
    })
    message.success('删除成功')
    getDeptList()
  }

  // 2. columns静态数据
  const columns: ColumnsType<Dept.DeptItem> = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
      width: 200
    },
    {
      title: '负责人',
      dataIndex: 'userName',
      key: 'userName',
      width: 150
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime) {
        return formatDate(updateTime)
      }
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
            <Button type='text' onClick={() => handleSubCreate(record._id)}>
              新增
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' onClick={() => handleDelete(record._id)}>
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
        <Form className='search-form' layout='inline' form={form}>
          <Form.Item label='部门名称' name='deptName'>
            <Input placeholder='部门名称' />
          </Form.Item>
          <Form.Item label='部门名称' name='deptName'>
            <div>
              <Button type='primary' className='mr10' onClick={getDeptList}>
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
            <div className='title'>部门列表</div>
            <div className='action'>
              <Button onClick={handleCreate} type='primary'>
                新增
              </Button>
            </div>
          </div>
          <Table bordered rowKey='_id' columns={columns} dataSource={data} pagination={false} />
        </div>
        {/* m是绑定ref，update是加载完成后，重新渲染列表信息 */}
        <CreateDept mRef={deptRef} update={getDeptList} />
      </div>
    </>
  )
}

export default DeptList
