import React from 'react'
import { connect } from 'dva'
import { Form, Modal, Icon, Button, Select, Row, Col } from 'antd'
import PropTypes from 'prop-types'

import styles from '../style.css'

class DynamicAssignProject extends React.Component {
  state = {
    keys: []
  }

  static propTypes = {
    record: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    system_list: PropTypes.array.isRequired,
    handleCancel: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidUpdate(prevProps) {
    const { system_admin = [] } = this.props.record
    const _system_admin = prevProps.record.system_admin || []

    // 进行判断 从而在切换record的时候赋初值
    if (system_admin.length !== _system_admin.length) {
      const length = system_admin.length
      const keys = []

      for (let i = 0; i < length; i++) {
        keys.push(keys.length)
      }

      this.setState({ keys })
    }
  }

  remove = k => {
    const { keys } = this.state

    if (keys.length === 1) {
      return
    }
    this.setState({ keys: keys.filter(key => key !== k) })
  }

  add = () => {
    const { keys } = this.state

    this.setState({ keys: keys.concat([keys.length]) })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (!values.systems) {
          return
        }
        const { dispatch, record, handleCancel } = this.props
        const { systems, is_admin } = values
        const system_admin = []

        for (let i = 0; i < systems.length; i++) {
          if (systems[i] !== undefined) {
            system_admin.push({ system_id: systems[i], is_admin: is_admin[i] })
          }
        }

        dispatch({
          type: 'user/assignUserToSystem',
          payload: { user_id: record.user_id, system_admin }
        }).then(() => handleCancel(true))
      }
    })
  }

  render() {
    const { keys } = this.state
    const { record } = this.props
    const { getFieldDecorator } = this.props.form
    const { system_list, visible, handleCancel } = this.props
    const submitLoading = this.props.loading.effects['user/assignUserToSystem']
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19, offset: 1 }
    }
    const formItemLayoutWithOutLabel = {
      wrapperCol: { span: 19, offset: 5 }
    }

    const formItems = record.system_admin
      ? keys.map((k, index) => (
          <div key={k}>
            <Form.Item
              {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
              label={index === 0 ? '关联系统' : ''}
              required={false}
            >
              <Form.Item style={{ display: 'inline-block', width: '200px', marginBottom: '14px' }}>
                {getFieldDecorator(`systems[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: '请选择系统' }],
                  initialValue: record.system_admin[k] && record.system_admin[k].system_id
                })(
                  <Select placeholder="请选择系统">
                    {system_list.map(item => (
                      <Select.Option key={item.system_id} value={item.system_id}>
                        {item.system_name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', width: '150px', marginLeft: '20px', marginBottom: '14px' }}>
                {getFieldDecorator(`is_admin[${k}]`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{ required: true, message: '请选择权限' }],
                  initialValue: record.system_admin[k] && record.system_admin[k].is_admin
                })(
                  <Select placeholder="请选择权限">
                    <Select.Option value={0}>无</Select.Option>
                    <Select.Option value={1}>系统管理员</Select.Option>
                  </Select>
                )}
              </Form.Item>
              {keys.length > 1 ? (
                <Icon className={styles.dynamic_delete_button} type="minus-circle-o" onClick={() => this.remove(k)} />
              ) : null}
            </Form.Item>
          </div>
        ))
      : null

    return (
      <Modal
        width={600}
        title={`关联账号“${record.account}”到子系统`}
        visible={visible}
        destroyOnClose
        onCancel={() => handleCancel(false)}
        centered
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          {formItems}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button type="dashed" onClick={this.add} style={{ width: '85%' }}>
              <Icon type="plus" /> 添加系统
            </Button>
          </Form.Item>
          <Row type="flex" justify="center">
            <Col>
              <Button loading={submitLoading} type="primary" htmlType="submit">
                保存
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    system_list: state.system.system_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(DynamicAssignProject))
