import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Form, Select, Row, Modal, Input, Table, Col, Icon, Radio } from 'antd'

import DynamicAssignSystem from './DynamicAssignSystem'
import DynamicAssignProject from './DynamicAssignProject'
import AssignRole from './AssignRole'
import styles from '../style.css'

const { Option } = Select

class AuthUser extends React.Component {
  state = {
    status: {
      page: 1,
      limit: 20
    },
    system_id: null,
    project_id: null,
    record: {},
    visible: false,
    assign_visible: false,
    project_visible: false,
    role_visible: false,
    confirmDirty: false,
    system_ids: []
  }

  refreshList = state => {
    let { status } = this.state
    const { system_id, project_id } = this.state
    const { dispatch } = this.props

    if (state) {
      status = { ...status, ...state }
    }
    // 如果选择了系统和项目
    if (system_id !== null && project_id !== null) {
      dispatch({
        type: 'user/fetchProjectUsers',
        payload: { ...status, project_id }
      })
    } else if (system_id !== null) {
      // 如果只选择了系统
      dispatch({
        type: 'user/fetchSystemUsers',
        payload: { ...status, system_id }
      })
    } else {
      // 没有选择系统
      dispatch({
        type: 'user/fetchUsers',
        payload: status
      })
    }
    this.setState({ status })
  }

  componentDidMount() {
    this.refreshList()
  }

  static propTypes = {
    user_list: PropTypes.array.isRequired,
    system_user_list: PropTypes.array.isRequired,
    project_user_list: PropTypes.array.isRequired,
    project_list: PropTypes.array.isRequired,
    system_list: PropTypes.array.isRequired,
    role_list: PropTypes.array.isRequired,
    total: PropTypes.number,
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

  handleProjectModel = record => {
    this.setState({ record, project_visible: true })
  }

  handleRoleModel = record => {
    this.setState({ record, role_visible: true })
  }

  handleSelectSystemChange = value => {
    // 切换系统的时候获取对应系统的项目list 和角色列表
    if (value !== null) {
      const { dispatch } = this.props

      dispatch({
        type: 'auth_project/fetchProjects',
        payload: { system_id: value }
      })
      dispatch({
        type: 'role/fetchRoleList',
        payload: { system_id: value }
      })
    }

    this.setState({ system_id: value, project_id: null }, () => this.refreshList({ page: 1 }))
  }

  handleSelectProjectChange = value => {
    this.setState({ project_id: value }, () => this.refreshList({ page: 1 }))
  }

  handleDelete = (user_id, account, type) => {
    const content =
      type === 'all'
        ? '所有用户视角下删除用户将会级联删除用户在系统和项目下的关联。'
        : type === 'system'
        ? '系统视角下删除该用户将会删除级联删除用户在项目下的关联。'
        : '项目视角下删除该用户将会删除用户在该项目下的记录。'

    Modal.confirm({
      title: `请问是否确认删除账户“${account}”？`,
      okText: '确定',
      content,
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props
          const { system_id, project_id } = this.state

          let deleteAction

          if (type === 'all') {
            deleteAction = () =>
              dispatch({
                type: 'user/deleteUser',
                payload: { user_id }
              })
          } else if (type === 'system') {
            deleteAction = () =>
              dispatch({
                type: 'user/deleteSystemUser',
                payload: { system_id, user_id }
              })
          } else {
            deleteAction = () =>
              dispatch({
                type: 'user/deleteProjectUser',
                payload: { system_id, project_id, user_id }
              })
          }
          deleteAction().then(() => {
            resolve()
            this.refreshList()
          })
        })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props
        const { system_id, project_id } = this.state

        values.system_id = system_id
        values.project_id = project_id
        delete values.confirm
        dispatch({
          type: 'user/postUser',
          payload: values
        }).then(() => {
          this.setState({ visible: false })
          this.refreshList()
        })
      }
    })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleAssignToProjectCancel = (need_refresh = false) => {
    if (need_refresh) {
      this.refreshList()
    }
    this.setState({ project_visible: false })
  }

  handleAssignToSystemCancel = (need_refresh = false) => {
    if (need_refresh) {
      this.refreshList()
    }
    this.setState({ assign_visible: false })
  }

  handleSetRoleCancel = (need_refresh = false) => {
    if (need_refresh) {
      this.refreshList()
    }
    this.setState({ role_visible: false })
  }

  handleConfirmBlur = e => {
    const { value } = e.target

    this.setState({ confirmDirty: this.state.confirmDirty || !!value })
  }

  compareToFirstPassword = (_, value, callback) => {
    const { form } = this.props

    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入密码不一致！')
    } else {
      callback()
    }
  }

  validateToNextPassword = (_, value, callback) => {
    const { form } = this.props

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true })
    }
    callback()
  }

  get_all_user_columns = system_list => [
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
      title: '超级管理员',
      dataIndex: 'is_super',
      align: 'center',
      width: 100,
      render: is_super => (is_super === 1 ? '是' : '否')
    },
    {
      title: '所在系统',
      dataIndex: 'system_admin',
      align: 'center',
      width: 150,
      render: system_admin => {
        if (system_admin.length === 0) {
          return <span style={{ color: '#bfbfbf' }}>无</span>
        }
        return system_admin.map((id, index) => {
          for (const system of system_list) {
            if (system.system_id === id.system_id) {
              return (
                <span key={system.system_id}>
                  {system.system_name}
                  {id.is_admin === 1 ? '：系统管理员' : ''}
                  {index !== system_admin.length - 1 ? '，' : ''}
                  <br />
                </span>
              )
            }
          }
        })
      }
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
            onClick={() => this.handleDelete(record.user_id, record.account, 'all')}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  get_system_user_columns = project_list => [
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
      title: '超级管理员',
      dataIndex: 'is_super',
      align: 'center',
      width: 100,
      render: is_super => (is_super === 1 ? '是' : '否')
    },
    {
      title: '系统管理员',
      dataIndex: 'is_admin',
      align: 'center',
      width: 100,
      render: is_admin => (is_admin === 1 ? '是' : '否')
    },
    {
      title: '所在项目',
      dataIndex: 'project_ids',
      align: 'center',
      width: 150,
      render: project_ids => {
        if (project_ids.length === 0) {
          return '暂无项目'
        }
        return project_ids.map((id, index) => {
          for (const project of project_list) {
            if (project.project_id === id) {
              return (
                <span key={project.project_id}>
                  {project.project_name}
                  {index !== project_ids.length - 1 ? '，' : ''}
                </span>
              )
            }
          }
        })
      }
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
            onClick={() => this.handleProjectModel(record)}
          >
            关联项目
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleDelete(record.user_id, record.account, 'system')}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  get_project_user_columns = role_list => [
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
      title: '超级管理员',
      dataIndex: 'is_super',
      align: 'center',
      width: 100,
      render: is_super => (is_super === 1 ? '是' : '否')
    },
    {
      title: '项目角色',
      dataIndex: 'role_id',
      align: 'center',
      width: 150,
      render: role_id => {
        if (role_id === null) {
          return '暂无角色'
        }
        for (const role of role_list) {
          if (role.role_id === role_id) {
            return role.role_name
          }
        }
        return ''
      }
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
            onClick={() => this.handleRoleModel(record)}
          >
            设置角色
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleDelete(record.user_id, record.account, 'project')}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { user_list, system_user_list, project_user_list, role_list, system_list, project_list, loading } = this.props
    const { getFieldDecorator } = this.props.form
    const { record, visible, assign_visible, system_id, project_id, project_visible, role_visible } = this.state
    const tableLoading =
      loading.effects['user/fetchUsers'] ||
      loading.effects['user/fetchSystemUsers'] ||
      loading.effects['user/fetchProjectUsers']
    const submitLoading = loading.effects['user/postUser']

    let columns, dataSource

    if (system_id === null) {
      columns = this.get_all_user_columns(system_list)
      dataSource = user_list
    } else if (system_id !== null && project_id === null) {
      columns = this.get_system_user_columns(project_list)
      dataSource = system_user_list
    } else {
      columns = this.get_project_user_columns(role_list)
      dataSource = project_user_list
    }

    return (
      <>
        <Row type="flex" justify="space-between">
          <Col>
            选择所属系统：
            <Select style={{ width: 150 }} loading={tableLoading} onChange={this.handleSelectSystemChange}>
              {[{ system_id: null, system_name: '全部' }].concat(system_list).map(system => (
                <Option key={system.system_id} value={system.system_id}>
                  {system.system_name}
                </Option>
              ))}
            </Select>
            <span style={{ marginLeft: 20 }}>选择系统下项目：</span>
            <Select
              style={{ width: 150 }}
              value={project_id}
              disabled={system_id === null}
              loading={tableLoading}
              onChange={this.handleSelectProjectChange}
            >
              {[{ project_id: null, project_name: '全部' }].concat(project_list).map(project => (
                <Option key={project.project_id} value={project.project_id}>
                  {project.project_name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
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
            dataSource={dataSource}
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
            <Form.Item label="超级管理员">
              {getFieldDecorator('is_super', {
                initialValue: record.is_super,
                rules: [{ required: true, message: '请选择是否是超级管理员！' }]
              })(
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="用户密码">
              {getFieldDecorator('password', {
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
            </Row>
          </Form>
        </Modal>
        <DynamicAssignSystem record={record} visible={assign_visible} handleCancel={this.handleAssignToSystemCancel} />
        <DynamicAssignProject
          record={record}
          system_id={system_id}
          visible={project_visible}
          handleCancel={this.handleAssignToProjectCancel}
        />
        <AssignRole
          record={record}
          project_id={project_id}
          role_list={role_list}
          visible={role_visible}
          handleCancel={this.handleSetRoleCancel}
        />
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    user_list: state.user.user_list,
    system_user_list: state.user.system_user_list,
    project_user_list: state.user.project_user_list,
    project_list: state.auth_project.project_list,
    role_list: state.role.role_list,
    total: state.user.total,
    system_list: state.system.system_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(AuthUser))
