//ahook操作的分页页面

import api from '@/api'
import { PageParams, User } from '@/types/api'
import { formatDate } from '@/utils'
import { Button, Table, Form, Input, Select, Space, Modal, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'

//10.5 导入弹窗
import CreateUser from '../user/CreateUser'
import { IAction } from '@/types/modal'

//10.11 导入ahooks
import { useAntdTable } from 'ahooks'

const UserListAhooks = () => {
  //10-4 初始化form对象
  const [form] = Form.useForm()
  //10.9 批量删除用户，复选框
  const [userIds, setUserIds] = useState<number[]>([])

  //表格信息
  const columns: ColumnsType<User.UserItem> = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '用户邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      render(role: number) {
        return {
          0: '超级管理员',
          1: '管理员',
          2: '体验管理员',
          3: '普通用户'
        }[role]
      }
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      key: 'state',
      render(state: number) {
        return {
          1: '在职',
          2: '离职',
          3: '试用期'
        }[state]
      }
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'operator',
      //record是单元行的值，UserItem的字段
      render(record: User.UserItem) {
        console.log(record)
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button
              type='text'
              danger
              onClick={() => {
                handleDelete(record.userId)
              }}
            >
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  // ========================= 10-7 弹窗封装 ========================
  const userRef = useRef<{
    open: (type: IAction, data?: User.UserItem) => void //子组件有open方法，不用设置undefined
  }>()

  //=================== 10.11 ahooks =================

  //1. 使用ihooks定义接口getTableData，获取table数据，是一个Promise类型的函数
  //{current,pageSize} ：分页参数
  //formateDate:User.Params ： 表单业务参数
  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formatDate: User.Params) => {
    return api
      .getUserList({
        //5个字段：3个用户列表 + 2个分页

        ...formatDate,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        return { total: data.page.total, list: data.list }
      })
  }

  //2. 自定义hook
  // 参数一：getTableDate
  // 参数二：form获取内部表单参数

  const { tableProps, search } = useAntdTable(getTableData, { form, defaultPageSize: 3 })

  //1. 创建用户
  const handleCreate = () => {
    userRef.current?.open('create')
  }

  // ======================= 10.8 编辑用户列表 ========================
  // 编辑用户
  const handleEdit = (record: User.UserItem) => {
    userRef.current?.open('edit', record) //从父组件打开子组件的编辑弹窗页面
  }

  // ======================== 10.9 删除用户 ======================
  const handleDelete = (userId: number) => {
    //alert确认弹窗
    Modal.confirm({
      title: '删除确认',
      content: <span>是否删除？</span>,
      onOk: () => {
        handleUserDelSubmit([userId])
      }
    })
  }
  //公用删除用户提交接口
  const handleUserDelSubmit = async (ids: number[]) => {
    //async await只能通过try catch捕获异常
    try {
      await api.delUser({ userIds: ids })
      message.success('删除成功')
      setUserIds([]) //删除选择状态的用户，使得受控组件Table中的复选框取消选择

      //ihooks插件重置搜索结果页
      search.reset()
    } catch (error) {}
  }

  //批量删除用户
  const handleBatchDelete = () => {
    if (userIds.length === 0) {
      message.error('请选择用户')
      return
    }
    //选择状态下，弹窗确认弹窗
    Modal.confirm({
      title: '删除确认',
      content: <span>是否删除？</span>,
      onOk: () => {
        handleUserDelSubmit(userIds)
      }
    })
  }

  return (
    <div className='user-list'>
      <Form className='search-form' form={form} layout='inline' initialValues={{ state: 0 }}>
        <Form.Item name='userId' label='用户ID'>
          <Input placeholder='ID' />
        </Form.Item>

        <Form.Item name='userName' label='用户名称'>
          <Input placeholder='Name' />
        </Form.Item>

        <Form.Item name='state' label='状态'>
          <Select style={{ width: 120 }}>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>试用期</Select.Option>
            <Select.Option value={3}>离职</Select.Option>
          </Select>
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
          <div className='title'>用户列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
            <Button type='primary' danger onClick={handleBatchDelete}>
              批量删除
            </Button>
          </div>
        </div>

        <Table
          bordered
          rowKey='userId'
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: userIds, //受控组件：setUserIds([])删除后userIds=0，没有选中状态
            onChange: (selectedRowKeys: React.Key[]) => {
              //onChange:受控
              setUserIds(selectedRowKeys as number[])
            }
          }}
          //dataSource={data}
          columns={columns}
          // pagination={{
          //   position: ['bottomRight'], //分页位置：右下角
          //   current: pagination.current, //当前分页页码：1，useState初始化的时候
          //   pageSize: pagination.pageSize, //条数
          //   showQuickJumper: true, //跳转第几页
          //   showSizeChanger: true, //pageSize切换器
          //   total: total, //简写：total， 对象字面量
          //   showTotal: function (total) {
          //     return `总数：${total}条` //模版字符串 反引号
          //   }, // 数据总条数
          //   onChange: (page, pageSize) => {
          //     setPagination({
          //       current: page, //当前页等于current
          //       pageSize: pageSize //页尺寸修改，简写：pageSize
          //     })
          //   }
          // }}
          {...tableProps}
        />
      </div>

      <CreateUser
        mRef={userRef}
        update={() => {
          search.reset()
        }}
      />
    </div>
  )
}

export default UserListAhooks
