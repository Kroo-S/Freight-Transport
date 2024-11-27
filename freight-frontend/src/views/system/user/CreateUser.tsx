// 10.5 新增用户弹窗页面

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import { Form, GetProp, Input, Modal, Select, Upload, UploadProps } from 'antd'
import { useImperativeHandle, useState } from 'react'
// 获取使用token
import storage from '@/utils/storage'
// antd中的message要搭配contextHolder使用；使用封装后的message
import { message } from '@/utils/AntdGlobal'
import { IAction, ImodalProp } from '@/types/modal'
import { User } from '@/types/api'
import api from '@/api'

// 这里用的自定义属性mRef绑定，参数重没有ref
const CreateUser = (props: ImodalProp) => {
  // ========================== 10-7 用户弹窗封装 =========================

  // 1. 弹窗显示
  const [visable, setVisable] = useState(false)
  // 2. 定义action：新增、编辑还是删除
  const [action, setAction] = useState<IAction>('create')
  // 3. 定义：弹窗显示方法
  const open = (type: IAction, data?: User.UserItem) => {
    setAction(type)
    setVisable(true)

    //======================= 10.8 编辑用户 ====================
    //1. 编辑模式下，用户数据回显
    if (type === 'edit' && data) {
      form.setFieldsValue(data) //此时传递的userId，要在form上隐式存储
      // 回显图片
      setImg(data.userImg)
    }
  }

  // useImperativeHandle让父组件可以调用子组件中的方法，即open(),进行用户新增
  // 4. 暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })

  // =============================================================

  // antd自定义hook，获取表单数据; <Form form={form}> 绑定表单
  const [form] = Form.useForm()

  // 提交弹窗数据
  const handleSubmit = async () => {
    // form.validateFields来验证表单,返回的是一个promise对象
    const valid = await form.validateFields()

    // 1. 如果表单验证通过，开始创建用户
    if (valid) {
      const params = {
        ...form.getFieldsValue(),
        userImg: img //获取头像
      }
      if (action === 'create') {
        await api.createUser(params)
        message.success('创建成功')
      } else {
        await api.editUser(params)
        message.success('修改成功')
      }
      handleCancel() //提交之后关闭弹窗
      props.update() //调用父组件中传递的update方法，更新表单内容
    }
  }
  // 取消，关闭弹窗
  const handleCancel = () => {
    setVisable(false)
    form.resetFields() //重置表格，antd自带
    //关闭头像的时候，上传的图片显示部分清空
    setImg('')
  }

  // 10-6 上传图片
  const [img, setImg] = useState('') //默认空字符串
  const [loading, setLoading] = useState(false) //默认没上传

  // Antd：文件类型定义
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

  // 上传之前，接口处理
  const beforeUpload = (file: FileType) => {
    // 判断格式是否符合要求(赋值 antd)
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 0.5 //小于500k
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  // 上传后，图片处理
  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      //上传成功
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      //上传失败，setLoading设置为完成
      setLoading(false)
      const { code, data, msg } = info.file.response
      if (code === 0) {
        setImg(data.file)
      } else {
        message.error(msg)
      }
    } else if (info.file.status === 'error') {
      message.error('服务器异常，请稍后重试！')
    }
  }
  return (
    <Modal
      title={action === 'create' ? '创建用户' : '编辑用户'}
      okText='确定'
      cancelText='取消'
      width={800}
      open={visable}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        <Form.Item name='userId' hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label='用户名称'
          name='userName'
          rules={[
            { required: true, message: '请输入用户名称' },
            {
              min: 5,
              max: 12,
              message: '用户名称最小5个字符，最大12个字符'
            }
          ]}
        >
          <Input placeholder='请输入用户名称'></Input>
        </Form.Item>
        <Form.Item
          label='用户邮箱'
          name='userEmail'
          rules={[
            { required: true, message: '请输入用户邮箱' },
            { type: 'email', message: '邮箱格式错误' },
            { pattern: /^\w+@mars.com$/, message: '邮箱必须以@mars.com结尾' }
          ]}
        >
          <Input placeholder='请输入用户邮箱' disabled={action === 'edit'}></Input>
        </Form.Item>
        <Form.Item
          label='手机号'
          name='mobile'
          rules={[
            { len: 11, message: '手机号必须为11位数字' },
            { pattern: /1[1-9]\d{9}/, message: '手机号必须为1开头的11位数字' }
          ]}
        >
          <Input type='number' placeholder='请输入手机号'></Input>
        </Form.Item>
        <Form.Item label='部门' name='deptId'>
          <Input placeholder='请输入部门'></Input>
        </Form.Item>
        <Form.Item label='岗位' name='job'>
          <Input placeholder='请输入岗位'></Input>
        </Form.Item>
        <Form.Item label='状态' name='state'>
          <Select>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='角色' name='roleList'>
          <Input placeholder='请输入角色'></Input>
        </Form.Item>

        {/* 10-6 图片上传 */}
        <Form.Item label='用户头像'>
          <Upload
            listType='picture-circle'
            showUploadList={false}
            headers={{
              Authorization: 'Bearer ' + storage.get('token'),
              icode: '9AE7106C51F36E36'
            }}
            action='/api/users/upload'
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {/* 上传图片后展示：img存在，显示；否则显示上传图片按钮 */}
            {img ? (
              <img src={img} style={{ width: '100%', borderRadius: '100%' }}></img>
            ) : (
              <div>
                {loading ? <LoadingOutlined rev={undefined} /> : <PlusOutlined rev={undefined} />}
                <div style={{ marginTop: 5 }}>上传头像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default CreateUser
