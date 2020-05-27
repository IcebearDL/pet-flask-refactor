import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Modal, Form, Input, Row, Table } from 'antd'

import styles from '../style.css'

class System extends React.Component {
  state = {
    project_record: {},
    visible: false
  }

  static propTypes = {
    project_list: PropTypes.array.isRequired,
    system_id: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleEditProjectModel = project_record => {
    this.setState({ project_record, visible: true })
  }

  handleProjectDelete = project_id => {
    Modal.confirm({
      title: '请问是否确认删除项目？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch, system_id } = this.props

          dispatch({
            type: 'auth_project/deleteProject',
            payload: { project_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'auth_project/fetchProjects',
              payload: { system_id }
            })
          })
        })
    })
  }

  handleProjectSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, system_id } = this.props
        const { project_id } = this.state.project_record

        values.project_id = project_id
        values.system_id = system_id
        dispatch({
          type: 'auth_project/postProject',
          payload: values
        }).then(() => {
          this.handleCancel()
          dispatch({
            type: 'auth_project/fetchProjects',
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
      title: '项目编号',
      dataIndex: 'project_id',
      align: 'center',
      width: 100
    },
    {
      title: '项目名称',
      dataIndex: 'project_name',
      align: 'center',
      width: 150
    },
    {
      title: '项目描述',
      dataIndex: 'project_des',
      align: 'center',
      width: 200
    },
    {
      title: '操作',
      align: 'center',
      width: 100,
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => this.handleEditProjectModel(record)}>
            编辑
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            type="danger"
            size="small"
            onClick={() => this.handleProjectDelete(record.project_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { project_record, visible } = this.state
    const { project_list, form } = this.props
    const { getFieldDecorator } = form
    const tableLoading = this.props.loading.effects['auth_project/fetchProjects']
    const submitLoading = this.props.loading.effects['auth_project/postProject']

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditProjectModel({ project_id: null })}>
          添加项目
        </Button>
        <div className={styles.table_margin}>
          <Table
            loading={tableLoading}
            className="page_body"
            rowKey="project_id"
            bordered
            pagination={false}
            columns={this.columns}
            dataSource={project_list}
          />
        </div>
        <Modal title="编辑项目" visible={visible} destroyOnClose onCancel={this.handleCancel} centered footer={null}>
          <Form
            className="page_body"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17, offset: 1 }}
            onSubmit={this.handleProjectSubmit}
          >
            <Form.Item label="项目名称">
              {getFieldDecorator('project_name', {
                initialValue: project_record.project_name,
                rules: [{ required: true, message: '请填写项目名称' }]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="项目描述">
              {getFieldDecorator('project_des', {
                initialValue: project_record.project_des,
                rules: [{ required: true, message: '请填写项目描述' }]
              })(<Input />)}
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
    project_list: state.auth_project.project_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(System))
