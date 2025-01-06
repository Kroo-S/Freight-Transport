import { Button, Form, Space } from 'antd'

/**
 * 搜索表单容器组件封装   搜索按钮 & 重置按钮
 * @param props
 * @returns
 */
const SearchForm = (props: any) => {
  return (
    <Form className='search-form' form={props.form} layout='inline' initialValues={props.initialValues}>
      {props.children}
      <Form.Item>
        <Space>
          <Button type='primary' onClick={props.submit}>
            搜索
          </Button>
          <Button type='default' onClick={props.reset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default SearchForm
