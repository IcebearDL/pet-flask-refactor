import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Modal, Form, Input, Row, Table } from 'antd'

import styles from '../style.css'

class System extends React.Component {
  state = {
    selectedKeys: ['system'],
    record: {},
    visible: false
  }

  componentDidMount() {
    const { dispatch } = this.props

    dispatch({
      type: 'system/fetchSystems'
    })
  }

  static propTypes = {
    system_list: PropTypes.array.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleMenuClick = ({ keyPath }) => {
    this.setState({ selectedKeys: keyPath })
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleDelete = system_id => {
    Modal.confirm({
      title: '请问是否确认删除系统？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch } = this.props

          dispatch({
            type: 'system/deleteSystem',
            payload: { system_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'system/fetchSystems'
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
        const { system_id } = this.state.record

        values.id = system_id
        dispatch({
          type: 'system/postSystem',
          payload: values
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'system/fetchSystems'
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
      title: '系统编号',
      dataIndex: 'system_id',
      align: 'center',
      width: 100
    },
    {
      title: '系统名称',
      dataIndex: 'system_name',
      align: 'center',
      width: 150
    },
    {
      title: '系统描述',
      dataIndex: 'system_description',
      align: 'center',
      width: 200
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
            onClick={() => this.handleDelete(record.system_id)}
          >
            删除
          </Button>
        </>
      )
    }
  ]

  render() {
    const { record, visible } = this.state
    const { system_list, form } = this.props
    const { getFieldDecorator } = form
    const tableLoading = this.props.loading.effects['system/fetchSystems']
    const submitLoading = this.props.loading.effects['system/postSystem']

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ system_id: null })}>
          添加系统
        </Button>
        <div className={styles.table_margin}>
          <Table
            loading={tableLoading}
            className="page_body"
            rowKey="system_id"
            bordered
            pagination={false}
            columns={this.columns}
            dataSource={system_list}
          />
        </div>
        <Modal
          title="编辑角色"
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
            <Form.Item label="系统名称">
              {getFieldDecorator('system_name', {
                initialValue: record.system_name
              })(<Input />)}
            </Form.Item>
            <Form.Item label="系统描述">
              {getFieldDecorator('system_description', {
                initialValue: record.system_description
              })(<Input />)}
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
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(System))
