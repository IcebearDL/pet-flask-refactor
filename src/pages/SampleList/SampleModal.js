import React from 'react'
import { connect } from 'dva'
import moment from "moment"
import {
  Modal, Form, Input,
  Select, Button, Radio,
  DatePicker, Divider
} from "antd"
import styles from './style.css'

const { Option } = Select

const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 }
}


class SampleModal extends React.Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { record, handleSaveSample } = this.props
        for (let col of ['date', 'in_group_time', 'sign_time']) {
          values[col] = values[col].format('YYYY-MM-DD')
        }
        values.sex === '女' ? values.sex = 1 : values.sex = 0
        record.sample_id ? values.sample_id = record.sample_id : values.sample_id = null
        handleSaveSample(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const submitLoading = this.props.loading.effects['sample/createSample']
    const { record, visible, onOk, onCancel, research_center_info } = this.props

    return (
      <Modal
        className={styles.modal}
        title="编辑样本"
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        okText="保存"
        cancelText="取消"
        destroyOnClose
        centered
        footer={null}
      >
        <Form className="sample_form" {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="研究中心">
            {getFieldDecorator('research_center_id', {
              rules: [{ required: true, message: '请选择研究中心!' }],
              initialValue: record.research_center_id
            })(
              <Select>
                {research_center_info.map(item =>
                  <Option key={item.research_center_id} value={item.research_center_id}>{item.research_center_ids}</Option>
                )}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="患者姓名">
            {getFieldDecorator('patient_name', {
              rules: [{ required: true, message: '请填写患者姓名!' }],
              initialValue: record.patient_name
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="患者编号">
            {getFieldDecorator('patient_ids', {
              rules: [{ required: true, message: '请填写患者编号!' }],
              initialValue: record.patient_ids
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="患者身份证号">
            {getFieldDecorator('id_num', {
              rules: [{ required: true, message: '请填写患者身份证号!' }],
              initialValue: record.id_num
            })(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="患者组别">
            {getFieldDecorator('group_id', {
              rules: [{ required: true, message: '请选择患者组别!' }],
              initialValue: record.group_id
            })(
              <Select>
                <Option value={1}>安罗替尼</Option>
                <Option value={2}>安罗替尼 + TKI</Option>
                <Option value={3}>安罗替尼 + 化疗</Option>
                <Option value={4}>安罗替尼 + 免疫</Option>
                <Option value={5}>其他</Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="性别">
            {getFieldDecorator('sex', {
              rules: [{ required: true, message: '请选择患者性别!' }],
              initialValue: record.sex
            })(
              <Radio.Group
                options={[{ label: '男性', value: '男' }, { label: '女性', value: '女' }]}
              />
            )}
          </Form.Item>
          <Form.Item label="出生日期">
            {getFieldDecorator('date', {
              rules: [{ required: true, message: '请选择出生日期!' }],
              initialValue: record.date ? moment(record.date, 'YYYY-MM-DD') : null
            })(
              <DatePicker format={'YYYY-MM-DD'} placeholder="请选择日期" />
            )}
          </Form.Item>
          <Form.Item label="签署同意书日期">
            {getFieldDecorator('sign_time', {
              rules: [{ required: true, message: '请选择签署同意书日期!' }],
              initialValue: record.sign_time ? moment(record.sign_time, 'YYYY-MM-DD') : null
            })(
              <DatePicker format={'YYYY-MM-DD'} placeholder="请选择日期" />
            )}
          </Form.Item>
          <Form.Item label="入组日期">
            {getFieldDecorator('in_group_time', {
              rules: [{ required: true, message: '请选择入组日期!' }],
              initialValue: record.in_group_time ? moment(record.in_group_time, 'YYYY-MM-DD') : null
            })(
              <DatePicker format={'YYYY-MM-DD'} placeholder="请选择日期" />
            )}
          </Form.Item>
          <Divider className={styles.modal_divider} />
          <div className={styles.modal_bottom}>
            <Button
              className={styles.modal_submit}
              htmlType="submit"
              type="primary"
              loading={submitLoading}
            >保存</Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </Form>
      </Modal >
    )
  }
}

function mapStateToProps(state) {
  return {
    research_center_info: state.global.research_center_info,
    loading: state.loading
  }
}

const WrappedSampleModal = Form.create()(SampleModal);

export default connect(mapStateToProps)(WrappedSampleModal)