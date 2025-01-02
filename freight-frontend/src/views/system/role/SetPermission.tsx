// 13.4 用户权限

// 引入antd中的modal
import { Menu, Role } from '@/types/api'
import { IAction, IModalProp } from '@/types/modal'
import { Form, Input, Modal, Tree } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'

import { message } from '@/utils/AntdGlobal'
import api from '@/api'
import roleApi from '@/api/roleApi'

const SetPermission = (props: IModalProp<Role.RoleItem>) => {
  const [visable, setVisable] = useState(false)

  // ===================== 13.4 tree属性 =======================

  //列表
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])

  //存储角色信息
  const [roleInfo, setRoleInfo] = useState<Role.RoleItem>()

  //权限状态
  const [permission, setPermission] = useState<Role.Permission>()

  //checkedKeys是数组
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  //treeData是列表，页面加载的时候渲染【菜单列表】，使用useEffect
  useEffect(() => {
    getMenuList()
  }, [])
  //获取菜单列表，useEffect中不能使用async
  const getMenuList = async () => {
    const menuList = await api.getMenuList()
    setMenuList(menuList)
  }

  //暴露创建组件的open方法，给页面Role使用
  useImperativeHandle(props.mRef, () => {
    return { open }
  })

  //open是创建 还是 编辑
  const open = (type: IAction, data?: Role.RoleItem) => {
    setVisable(true)

    //打开权限弹窗，传入数据
    setRoleInfo(data)

    //回显选中的复选框
    setCheckedKeys(data?.permissionList.checkedKeys || [])
  }

  //13.4 tree属性:全选和半全选，状态显示
  const onCheck = (checkedKeysValue: any, item: any) => {
    //复选框选中
    setCheckedKeys(checkedKeysValue)

    //只有当menuType是2的时候，才能保存到checkedKeys中；1是菜单，3是页面，保存到halfCheckedKeys中
    const checkedKeys: string[] = []
    const parentKeys: string[] = []
    item.checkedNodes.map((node: Menu.MenuItem) => {
      //按钮
      if (node.menuType === 2) {
        checkedKeys.push(node._id)
      } else {
        parentKeys.push(node._id)
      }
    })

    setPermission({
      _id: roleInfo?._id || '',
      permissionList: {
        checkedKeys,
        halfCheckedKeys: parentKeys.concat(item.halfCheckedKeys)
      }
    })
  }

  //提交权限更新
  const handleOk = async () => {
    if (permission) {
      await roleApi.updatePermission(permission)
      message.success('设置成功')
      //关闭弹窗
      handleCancel()
      //更新数据
      props.update()
    }
  }

  //取消事件
  const handleCancel = () => {
    //关闭弹窗
    setVisable(false)
    setPermission(undefined)
  }

  return (
    <Modal
      title='设置权限'
      width={800}
      open={visable}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='角色名称'>{roleInfo?.roleName}</Form.Item>

        <Form.Item label='权限'>
          <Tree
            checkable
            defaultExpandAll
            fieldNames={{ title: 'menuName', key: '_id', children: 'children' }}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default SetPermission
