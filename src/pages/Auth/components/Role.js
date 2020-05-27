import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Form, Select, Row, Modal, Input, Table, Col, Tooltip } from 'antd'

import styles from '../style.css'

const { Option } = Select

class AuthRole extends React.Component {
  state = {
    record: {},
    visible: false,
    system_id: null
  }

  componentDidMount() {
    const { dispatch, system_list } = this.props

    dispatch({
      type: 'role/fetchRoleList',
      payload: {
        system_id: system_list[0].system_id
      }
    })

    dispatch({
      type: 'permission/fetchPermissionList',
      payload: {
        system_id: system_list[0].system_id
      }
    })
    this.setState({ system_id: system_list[0].system_id })
  }

  static propTypes = {
    role_list: PropTypes.array.isRequired,
    system_list: PropTypes.array.isRequired,
    permission_list: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleSystemSelectChange = value => {
    const { dispatch } = this.props

    dispatch({
      type: 'role/fetchRoleList',
      payload: {
        system_id: value
      }
    })
    dispatch({
      type: 'permission/fetchPermissionList',
      payload: {
        system_id: value
      }
    })
    this.setState({ system_id: value })
  }

  handleDelete = role_id => {
    Modal.confirm({
      title: '请问是否确认删除角色？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props
          const { system_id } = this.state

          dispatch({
            type: 'role/deleteRole',
            payload: { role_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'role/fetchRoleList',
              payload: { system_id }
            })
          })
        })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props
        const { role_id } = this.state.record
        const { system_id } = this.state

        values.role_id = role_id
        values.system_id = system_id
        dispatch({
          type: 'role/postRole',
          payload: values
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'role/fetchRoleList',
            payload: { system_id }
          })
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  columns = [
    {
      title: '角色编号',
      dataIndex: 'role_id',
      align: 'center',
      width: 100
    },
    {
      title: '角色名称',
      dataIndex: 'role_name',
      align: 'center',
      width: 150
    },
    {
      title: '角色描述',
      dataIndex: 'role_description',
      align: 'center',
      width: 200
    },
    {
      title: '角色权限',
      dataIndex: 'role_auths',
      align: 'center',
      width: 150,
      render: role_auths =>
        role_auths.map((item, index) => (
          <Tooltip key={index} title={item.permission_description}>
            <span>{item.permission_name}</span>
            <span>{role_auths.length - 1 !== index ? '，' : ''}</span>
          </Tooltip>
        ))
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => this.handleEditModel(record)}>
            编辑
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleDelete(record.role_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { role_list, system_list, permission_list, form } = this.props
    const { getFieldDecorator } = form
    const { record, visible } = this.state
    const tableLoading = this.props.loading.effects['role/fetchPermissionList']
    const submitLoading = this.props.loading.effects['role/postRole']

    return (
      <>
        <Row type="flex" justify="space-between">
          <Col>
            所属系统：
            <Select
              defaultValue={system_list[0].system_id}
              style={{ width: 150 }}
              loading={tableLoading}
              onChange={this.handleSystemSelectChange}
            >
              {system_list.map((system, index) => (
                <Option key={index} value={system.system_id}>
                  {system.system_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col offset={1}>
            <Button type="primary" onClick={() => this.handleEditModel({ role_id: null })}>
              添加角色
            </Button>
          </Col>
        </Row>
        <div className={styles.table_margin}>
          <Table
            loading={tableLoading}
            className="page_body"
            rowKey="role_id"
            bordered
            pagination={false}
            scroll={{ x: true }}
            columns={this.columns}
            dataSource={role_list}
          />
        </div>
        <Modal
          title={record.role_id !== null ? '编辑角色' : '添加角色'}
          visible={visible}
          destroyOnClose
          maskClosable={false}
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <Form
            className="page_body"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17, offset: 1 }}
            onSubmit={this.handleSubmit}
          >
            <Form.Item label="角色名称">
              {getFieldDecorator('role_name', {
                initialValue: record.role_name
              })(<Input placeholder="请输入角色名称" />)}
            </Form.Item>
            <Form.Item label="角色描述">
              {getFieldDecorator('role_description', {
                initialValue: record.role_description
              })(<Input placeholder="请输入角色描述" />)}
            </Form.Item>
            <Form.Item label="角色权限">
              {getFieldDecorator('role_auths', {
                initialValue: record.role_auths && record.role_auths.map(item => item.permission_id)
              })(
                <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择角色权限">
                  {permission_list.map(item => (
                    <Select.Option key={item.permission_id} value={item.permission_id}>
                      {item.permission_name}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Row type="flex" justify="center">
              <Button htmlType="submit" type="primary" loading={submitLoading}>
                保存
              </Button>
            </Row>
          </Form>
        </Modal>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    system_list: state.system.system_list,
    role_list: state.role.role_list,
    permission_list: state.permission.permission_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(AuthRole))
