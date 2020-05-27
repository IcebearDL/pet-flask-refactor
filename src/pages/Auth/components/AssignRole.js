import React from 'react'
import { connect } from 'dva'
import { Form, Modal, Button, Select, Row } from 'antd'
import PropTypes from 'prop-types'

const { Option } = Select

class AssignRole extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    project_id: PropTypes.number,
    role_list: PropTypes.array.isRequired,
    handleCancel: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleSetRole = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, handleCancel, record, project_id } = this.props

        values.user_id = record.user_id
        values.project_id = project_id
        dispatch({
          type: 'user/setRole',
          payload: values
        }).then(() => handleCancel(true))
      }
    })
  }

  render() {
    const { record } = this.props
    const { getFieldDecorator } = this.props.form
    const { role_list, visible, handleCancel } = this.props
    const setRoleLoading = this.props.loading.effects['user/setRole']

    return (
      <Modal
        title={`设置账号“${record.account}”的角色`}
        visible={visible}
        destroyOnClose
        onCancel={() => handleCancel(false)}
        centered
        footer={null}
      >
        <Form
          className="page_body"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 17, offset: 1 }}
          onSubmit={this.handleSetRole}
        >
          <Form.Item label="设置角色">
            {getFieldDecorator('role_id', {
              initialValue: record.role_id,
              rules: [{ required: true, message: '请选择角色！' }]
            })(
              <Select>
                {role_list.map(role => (
                  <Option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Row type="flex" justify="center">
            <Button htmlType="submit" type="primary" loading={setRoleLoading}>
              保存
            </Button>
          </Row>
        </Form>
      </Modal>
    )
  }
}

export default connect(state => ({ loading: state.loading }))(Form.create()(AssignRole))
