import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Select, Form, Modal, Input, Row, Table, Col } from 'antd'

import styles from '../style.css'

const { Option } = Select

class AuthPermission extends React.Component {
  state = {
    record: {},
    visible: false,
    system_id: null
  }

  componentDidMount() {
    const { dispatch, system_list } = this.props

    this.setState({ system_id: system_list[0].system_id })
    dispatch({
      type: 'permission/fetchPermissionList',
      payload: {
        system_id: system_list[0].system_id
      }
    })
  }

  static propTypes = {
    permission_list: PropTypes.array.isRequired,
    system_list: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleSelectChange = value => {
    const { dispatch } = this.props

    this.setState({ system_id: value })
    dispatch({
      type: 'permission/fetchPermissionList',
      payload: {
        system_id: value
      }
    })
  }

  handleDelete = system_id => {
    Modal.confirm({
      title: '请问是否确认删除权限？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props

          dispatch({
            type: 'permission/deleteSystem',
            payload: { system_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'permission/fetchPermissionList'
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
        // const { permission_id } = this.state.record

        // values.id = permission_id
        dispatch({
          type: 'permission/postPermission',
          payload: values
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'permission/fetchPermissionList'
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
      title: '权限编号',
      dataIndex: 'permission_id',
      align: 'center',
      width: 100
    },
    {
      title: '权限名称',
      dataIndex: 'permission_name',
      align: 'center',
      width: 150
    },
    {
      title: '权限描述',
      dataIndex: 'permission_description',
      align: 'center',
      width: 200
    },
    {
      title: '对应子系统权限',
      dataIndex: 'auth',
      align: 'center',
      width: 150
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
            onClick={() => this.handleDelete(record.permission_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { permission_list, system_list, form } = this.props
    const { getFieldDecorator } = form
    const { record, visible, system_id } = this.state
    const tableLoading = this.props.loading.effects['permission/fetchPermissionList']
    const submitLoading = this.props.loading.effects['permission/postPermission']

    return (
      <>
        <Row type="flex">
          <Col>
            所属系统：
            <Select
              defaultValue={system_list[0].system_id}
              style={{ width: 120 }}
              loading={tableLoading}
              onChange={this.handleSelectChange}
            >
              {system_list.map((system, index) => (
                <Option key={index} value={system.system_id}>
                  {system.system_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col offset={1}>
            <Button type="primary" onClick={() => this.handleEditModel({ permission_id: null })}>
              添加权限
            </Button>
          </Col>
        </Row>
        <div className={styles.table_margin}>
          <Table
            loading={tableLoading}
            className="page_body"
            rowKey="permission_id"
            bordered
            pagination={false}
            scroll={{ x: true }}
            columns={this.columns}
            dataSource={permission_list}
          />
        </div>
        <Modal
          title="编辑权限"
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
            <Form.Item label="所属系统">
              {getFieldDecorator('id', {
                initialValue: system_id
              })(
                <Select>
                  {system_list.map(system => (
                    <Option key={system.system_id} value={system.system_id}>
                      {system.system_name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item label="权限名称">
              {getFieldDecorator('permission_name', {
                initialValue: record.permission_name
              })(<Input placeholder="请输入权限名称" />)}
            </Form.Item>
            <Form.Item label="权限描述">
              {getFieldDecorator('permission_description', {
                initialValue: record.permission_description
              })(<Input placeholder="请输入权限描述" />)}
            </Form.Item>
            <Form.Item label="对应子系统权限">
              {getFieldDecorator('auth', {
                initialValue: record.auth
              })(<Input placeholder="请输入对应子系统权限" />)}
            </Form.Item>
            <Row type="flex" justify="center">
              <Button htmlType="submit" type="primary" loading={submitLoading}>
                保存
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleCancel}>
                取消
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
    permission_list: state.permission.permission_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(AuthPermission))
