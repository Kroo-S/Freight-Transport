/**
 * 角色管理
 */

import { Button, Table, Form, Input, Select, Space, Modal } from 'antd'
import { useAntdTable } from 'ahooks'
import { useForm } from 'antd/es/form/Form'
import api from '@/api/roleApi'
import { Role } from '@/types/api'
import { formatDate } from '@/utils'
import CreateRole from './CreateRole'
import { useRef } from 'react'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { message } from '@/utils/AntdGlobal'
import SetPermission from './SetPermission'

const RoleList = () => {
  //antd自定义form
  const [form] = useForm()

  // 使用ref
  //13.2 角色
  const roleRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()

  //13.4 权限ref
  const permissionRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()

  // 1. 使用ahooks定义接口getTableData，获取table数据，是一个Promise类型的函数
  // {current,pageSize} ：分页参数
  // formateDate:User.Params ： 表单业务参数
  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Role.Params) => {
    return api
      .getRoleList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        return {
          total: data.page.total,
          list: data.list
        }
      })
  }

  // 2. 自定义hook

  // 参数一：getTableDate
  // 参数二：form获取内部表单参数
  // getTableData：获取数据的核心方法，自动传入分页和表单参数。
  // form：绑定表单实例，用于自动提取搜索条件。 defaultPageSize: 3：每页3条数据

  // search：
  // search.submit：提交表单并刷新数据。
  // search.reset：重置表单内容并刷新列表。

  const { tableProps, search } = useAntdTable(getTableData, {
    form,
    defaultPageSize: 10
  })
  const columns: ColumnsType<Role.RoleItem> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime: string) {
        return formatDate(updateTime)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' onClick={() => handleSetPermission(record)}>
              设置权限
            </Button>
            <Button type='text' onClick={() => handleDelete(record._id)} danger>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  //创建
  const handleCreate = () => {
    roleRef.current?.open('create')
  }

  //编辑
  const handleEdit = (data: Role.RoleItem) => {
    roleRef.current?.open('edit', data)
  }

  //删除确认
  const handleDelete = (_id: string) => {
    Modal.confirm({
      title: '确认',
      content: <span>确认删除该角色吗？</span>,
      async onOk() {
        await api.deleteRole({ _id })
        message.success('删除成功')
        search.submit() //ahooks
      }
    })
  }

  //设置权限
  const handleSetPermission = (record: Role.RoleItem) => {
    //打开弹窗
    permissionRef.current?.open('edit', record)
  }

  //html：
  return (
    <div className='role-wrap'>
      <Form form={form} className='search-form' layout='inline'>
        <Form.Item name='roleName' label='角色名称'>
          <Input placeholder='请输入角色名称' />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={search.submit}>
              搜索
            </Button>
            <Button type='default' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>角色列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table bordered rowKey='_id' columns={columns} {...tableProps} />
      </div>

      {/* 13.2 创建角色弹窗 */}
      <CreateRole mRef={roleRef} update={search.submit} />

      {/* 13.4 设置权限 */}
      <SetPermission mRef={permissionRef} update={search.submit} />
    </div>
  )
}

export default RoleList
