import api from '@/api'
import { PageParams, User } from '@/types/api'
import { formatDate } from '@/utils'
import { Button, Table, Form, Input, Select, Space, Modal, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useEffect, useRef, useState } from 'react'

//10.5 导入弹窗
import CreateUser from './CreateUser'
import { IAction } from '@/types/modal'
import AuthButton from '@/component/AuthButton'

const UserList = () => {
  //=========================== 10.4 1. 加载页面，初始化分页 ===========================

  //10-3 使用setData获取用户列表
  const [data, setData] = useState<User.UserItem[]>([])

  //10-4 初始化form对象
  const [form] = Form.useForm()
  //初始化分页的变量：total总数
  const [total, setTotal] = useState(0)
  //初始化antd的分页标签变量：pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 3
  })

  //10.9 批量删除用户，复选框
  const [userIds, setUserIds] = useState<number[]>([])

  useEffect(() => {
    getUserList({
      //手动传递分页参数
      pageNum: pagination.current, //显示第1页
      pageSize: pagination.pageSize //显示组件中的数值10
    })
  }, [pagination.current, pagination.pageSize]) //分页器依赖，当点击分页器的时候，修改参数

  // 获取用户列表+分页列表：（参数化）
  // 1. 用户列表使用form绑定后获取
  // 2. 分页数据，传递params：PageParams参数后，获取

  const getUserList = async (params: PageParams) => {
    const values = form.getFieldsValue()
    //getUserList(params:User.Params)
    const data = await api.getUserList({
      //5个字段：3个用户列表 + 2个分页
      ...values,
      pageNum: params.pageNum,
      pageSize: params.pageSize || pagination.pageSize //参数传递的，或是分页组件的
    })

    //人工造表格数据：
    // const list = Array.from({ length: 50 })
    //   .fill({})
    //   .map((item: any) => {
    //     item = { ...data.list[0] }
    //     item.userId = Math.random()
    //     return item
    //   })

    //10-4 获取数据列表和分页内容
    //10-3 数据列表部分
    //data是  getUserList() 获得的，是 <ResultData<User.UserItem>> 的类型
    //ResultData包含  list:[]、 page:{pageNum,pageSize,total}
    setData(data.list)
    //10-4 分页部分：page总数
    setTotal(data.page.total)
    //分页部分：pageNum、pageSize
    setPagination({
      current: data.page.pageNum,
      pageSize: data.page.pageSize
    })
  }

  // ============================== 10.4 2. 搜索触发分页 =============================
  // 搜索点击
  const handleSearch = () => {
    getUserList({
      pageNum: 1
      //pageSize: pagination.pageSize   搜索的时候，pageSize可以不用选择
    })
  }

  // ================== 10.4 3. 页面 antd中<Table/ pagination>的属性 ======================

  // 数据源从上面的data.list获取： User.UserItem
  // const dataSource = [
  //   {
  //     _id: '',
  //     userId: 0,
  //     userName: '',
  //     userEmail: '',
  //     deptId: '',
  //     state: 0,
  //     mobile: '',
  //     job: '',
  //     role: 0,
  //     roleList: '',
  //     createId: 0,
  //     deptName: '',
  //     userImg: ''
  //   }
  // ]

  //重置表单
  const handleReset = () => {
    form.resetFields()
  }

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
      getUserList({
        pageNum: 1
        //pageSize: pagination.pageSize    删除之后，显示第一页，只用传递pageNum
      })
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
      {/* 搜索栏 */}
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
            <Button type='primary' onClick={handleSearch}>
              搜索
            </Button>
            <Button type='default' onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用户列表</div>
          <div className='action'>
            <AuthButton auth='create' type='primary' onClick={handleCreate}>
              新增
            </AuthButton>
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
          dataSource={data}
          columns={columns}
          pagination={{
            position: ['bottomRight'], //分页位置：右下角
            current: pagination.current, //当前分页页码：1，useState初始化的时候
            pageSize: pagination.pageSize, //条数
            showQuickJumper: true, //跳转第几页
            showSizeChanger: true, //pageSize切换器
            total: total, //简写：total， 对象字面量
            showTotal: function (total) {
              return `总数：${total}条` //模版字符串 反引号
            }, // 数据总条数
            onChange: (page, pageSize) => {
              setPagination({
                current: page, //当前页等于current
                pageSize: pageSize //页尺寸修改，简写：pageSize
              })
            }
          }}
        />
      </div>

      <CreateUser
        mRef={userRef}
        update={() => {
          getUserList({
            pageNum: 1 //pageSize选填
          })
        }}
      />
    </div>
  )
}

export default UserList
