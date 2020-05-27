import React from 'react'
import { connect } from 'dva'
import { Form, Modal, Button, Select, Row } from 'antd'
import PropTypes from 'prop-types'

const { Option } = Select

class DynamicAssignUser extends React.Component {
  static propTypes = {
    system_id: PropTypes.number,
    record: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    project_list: PropTypes.array.isRequired,
    handleCancel: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleAssignProject = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, system_id, record, handleCancel } = this.props

        values.system_id = system_id
        values.user_id = record.user_id
        dispatch({
          type: 'user/assignUserToProject',
          payload: values
        }).then(() => handleCancel(true))
      }
    })
  }

  render() {
    const { record } = this.props
    const { getFieldDecorator } = this.props.form
    const { project_list, visible, handleCancel } = this.props
    const assignToProjectLoading = this.props.loading.effects['user/assignUserToProject']

    return (
      <Modal
        title={`关联账号“${record.account}”到项目`}
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
          onSubmit={this.handleAssignProject}
        >
          <Form.Item label="关联项目">
            {getFieldDecorator('project_ids', {
              initialValue: record.project_ids,
              rules: [{ required: true, message: '请选择关联项目！' }]
            })(
              <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择关联项目">
                {project_list.map(project => (
                  <Option key={project.project_id} value={project.project_id}>
                    {project.project_name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Row type="flex" justify="center">
            <Button htmlType="submit" type="primary" loading={assignToProjectLoading}>
              保存
            </Button>
          </Row>
        </Form>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    project_list: state.auth_project.project_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(DynamicAssignUser))
