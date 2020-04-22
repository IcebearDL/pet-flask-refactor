import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Form, Select, Row, Modal, Input, Table, Col, Icon, Radio, message } from 'antd'

import styles from '../style.css'

const { Option } = Select

class AuthRole extends React.Component {
  state = {
    params: {
      page: 1,
      limit: 20
    },
    system_id: null,
    record: {},
    visible: false,
    assign_visible: false,
    confirmDirty: false,
    system_ids: [],
    is_super: 0
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch({
      type: 'user/fetchUsers',
      payload: {
        page: 1,
        limit: 20
      }
    })
  }

  static propTypes = {
    user_list: PropTypes.array.isRequired,
    system_list: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleAssignModel = record => {
    this.setState({ record, assign_visible: true })
  }

  handleSelectChange = value => {
    const { dispatch } = this.props

    this.setState({ system_id: value })
    dispatch({
      type: 'user/fetchUsers',
      payload: {
        page: 1,
        limit: 20,
        system_id: value
      }
    })
  }

  handleDelete = user_id => {
    Modal.confirm({
      title: '请问是否确认删除用户？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props

          dispatch({
            type: 'user/deleteUser',
            payload: { user_id }
          }).then(() => {
            const { system_id } = this.state

            resolve()
            dispatch({
              type: 'user/fetchUsers',
              payload: { page: 1, limit: 20, system_id }
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

        values.role_id = role_id
        dispatch({
          type: 'user/postUser',
          payload: values
        }).then(() => {
          const { system_id } = this.state

          this.setState({ visible: false })

          dispatch({
            type: 'user/fetchUsers',
            payload: { page: 1, limit: 20, system_id }
          })
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleAssignCancel = () => {
    this.setState({ assign_visible: false })
  }

  handleIdsChange = system_ids => {
    this.setState({ system_ids })
  }

  handleIsSuperChange = e => {
    this.setState({
      value: parseInt(e.target.value)
    })
  }

  handleAssign = () => {
    const { dispatch } = this.props
    const { system_ids, is_super } = this.state

    if (system_ids.length === 0) {
      message.error('请选择系统！')
      return
    }

    dispatch({
      type: 'user/assignUser',
      payload: { is_super, system_id: system_ids }
    })
  }

  handleConfirmBlur = e => {
    const { value } = e.target

    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致！')
    } else {
      callback()
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  render() {
    const { user_list, system_list, form } = this.props
    const { getFieldDecorator } = form
    const { record, visible, assign_visible, system_ids, is_super } = this.state
    const tableLoading = this.props.loading.effects['user/fetchUsers']
    const submitLoading = this.props.loading.effects['user/postUser']
    const assignLoading = this.props.loading.effects['user/assignUser']

    const filteredOptions = system_list.filter(o => !system_ids.includes(o.system_id))

    const columns = [
      {
        title: '用户编号',
        dataIndex: 'user_id',
        align: 'center',
        width: 100
      },
      {
        title: '用户账号',
        dataIndex: 'account',
        align: 'center',
        width: 150
      },
      {
        title: '用户昵称',
        dataIndex: 'name',
        align: 'center',
        width: 150
      },
      {
        title: '是否是管理员',
        dataIndex: 'is_super',
        align: 'center',
        width: 100
      },
      {
        title: '所在系统',
        dataIndex: 'system_ids',
        align: 'center',
        width: 150,
        render: ids =>
          system_list.map(system => {
            if (ids.indexOf(system.system_id) !== -1) {
              return <span key={system.system_id}>{system.system_name}</span>
            }
            return ''
          })
      },
      {
        title: '操作',
        align: 'center',
        width: 200,
        render: (_, record) => (
          <>
            <Button type="primary" size="small" onClick={() => this.handleEditModel(record)}>
              编辑
            </Button>
            <Button
              type="primary"
              style={{ marginLeft: '10px' }}
              size="small"
              onClick={() => this.handleAssignModel(record)}
            >
              关联系统
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="danger"
              size="small"
              onClick={() => this.handleDelete(record.user_id)}
            >
              删除
            </Button>
          </>
        )
      }
    ]

    return (
      <>
        <Row type="flex">
          <Col>
            选择所属系统：
            <Select style={{ width: 120 }} loading={tableLoading} onChange={this.handleSelectChange}>
              {[{ system_id: null, system_name: '全部' }].concat(system_list).map((system, index) => (
                <Option key={index} value={system.system_id}>
                  {system.system_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col offset={1}>
            <Button type="primary" onClick={() => this.handleEditModel({ role_id: null })}>
              添加用户
            </Button>
          </Col>
        </Row>
        <div className={styles.table_margin}>
          <Table
            loading={tableLoading}
            className="page_body"
            rowKey="user_id"
            bordered
            pagination={false}
            scroll={{ x: true }}
            columns={columns}
            dataSource={user_list}
          />
        </div>
        <Modal
          title="编辑用户"
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
            <Form.Item label="用户账号">
              {getFieldDecorator('account', {
                initialValue: record.account,
                rules: [{ required: true, message: '请填写用户名！' }]
              })(<Input placeholder="请输入用户账号" />)}
            </Form.Item>
            <Form.Item label="用户昵称">
              {getFieldDecorator('name', {
                initialValue: record.name,
                rules: [{ required: true, message: '请填写用户昵称！' }]
              })(<Input placeholder="请输入用户昵称" />)}
            </Form.Item>
            <Form.Item label="用户密码">
              {getFieldDecorator('password', {
                initialValue: record.password,
                rules: [{ required: true, message: '请填写用户密码！' }, { validator: this.validateToNextPassword }]
              })(
                <Input.Password
                  prefixk={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="请输入密码"
                />
              )}
            </Form.Item>
            <Form.Item label="再次确认">
              {getFieldDecorator('confirm', {
                initialValue: record.password,
                rules: [{ required: true, message: '请再次填写用户密码！' }, { validator: this.compareToFirstPassword }]
              })(
                <Input.Password
                  prefixk={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  onBlur={this.handleConfirmBlur}
                  placeholder="请再次输入密码"
                />
              )}
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
        <Modal
          title="关联用户"
          visible={assign_visible}
          destroyOnClose
          maskClosable={false}
          onCancel={this.handleAssignCancel}
          centered
          footer={null}
        >
          <div style={{ padding: '10px' }}>
            <Row type="flex" align="middle">
              <Col span={10}>是否分配管理员权限：</Col>
              <Col span={14}>
                <Radio.Group onChange={this.handleIsSuperChange} value={is_super}>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              </Col>
            </Row>
          </div>
          <div style={{ padding: '10px' }}>
            <Row type="flex" align="middle">
              <Col span={10}>关联的系统：</Col>
              <Col span={14}>
                <Select
                  mode="multiple"
                  placeholder="请选择需要关联的系统"
                  value={system_ids}
                  defaultValue={record.system_ids}
                  onChange={this.handleIdsChange}
                  style={{ width: '100%' }}
                >
                  {filteredOptions.map(item => (
                    <Select.Option key={item.system_id} value={item.system_name}>
                      {item.system_name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
          <div style={{ padding: '10px' }}>
            <Row type="flex" justify="middle">
              <Button type="primary" loading={assignLoading} onClick={this.handleAssign}>
                保存
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleAssignCancel}>
                取消
              </Button>
            </Row>
          </div>
        </Modal>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    user_list: state.user.user_list,
    total: state.user.total,
    system_list: state.system.system_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(AuthRole))
