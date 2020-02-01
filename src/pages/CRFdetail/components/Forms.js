import React from 'react'
import { connect } from 'dva'
import {
  Modal, Row, Col, Form,
  DatePicker, Button,
  Radio, Input, Table
} from "antd"
import moment from "moment"
import styles from '../style.css'

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20, offset: 1 }
}

function mapStateToProps(state) {
  return {
    crf_first_diagnose: state.crf_first_diagnose,
    loading: state.loading
  }
}

class FirstDiagnoseForm_1 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, { cycle_time }) => {
      if (!err) {
        const { dispatch } = this.props
        const sample_id = window.location.pathname.split('/')[4]
        dispatch({
          type: 'crf_first_diagnose/modifyCycleTime',
          payload: {
            sample_id,
            cycle_number: 1,
            body: { cycle_time: cycle_time.format('YYYY-MM-DD') }
          }
        }).then(() => dispatch({
          type: 'crf_first_diagnose/fetchCycleTime',
          payload: { sample_id, cycle_number: 1 }
        }))
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { cycle_time } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyCycleTime']

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="访视时间">
          {getFieldDecorator('cycle_time', {
            rules: [{ required: true, message: '请选择访视时间!' }],
            initialValue: cycle_time ? moment(cycle_time, 'YYYY-MM-DD') : null
          })(
            <DatePicker format={'YYYY-MM-DD'} placeholder="请选择日期" />
          )}
        </Form.Item>
        <Col offset={4}>
          <Button
            htmlType="submit"
            type="primary"
            loading={submitLoading}
          >保存</Button>
        </Col>
      </Form>
    )
  }
}

export const FirstDiagnoseForm1 = connect(mapStateToProps)(Form.create()(FirstDiagnoseForm_1))

class FirstDiagnoseForm_2 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      marriage: '',
      vocation: '',
      race: ''
    }
    this.marriage_input = React.createRef()
    this.vocation_input = React.createRef()
    this.race_input = React.createRef()
  }

  handleRaceChange = ({ target: { value } }) => {
    this.props.form.setFieldsValue({ race: value })
    this.setState({ race: value })
  }

  handleMarriageChange = ({ target: { value } }) => {
    this.props.form.setFieldsValue({ marriage: value })
    this.setState({ marriage: value })
  }

  handleVocationChange = ({ target: { value } }) => {
    this.props.form.setFieldsValue({ vocation: value })
    this.setState({ vocation: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props
        for (let type of ['race', 'marriage', 'vocation']) {
          if (values[type] === '其他') {
            values[`${type}_other`] = this[`${type}_input`].current.input.value
          } else values[`${type}_other`] = null
        }
        if (values.date) values.date = values.date.format('YYYY-MM-DD')
        const sample_id = window.location.pathname.split('/')[4]
        dispatch({
          type: 'crf_first_diagnose/modifyPatient',
          payload: { sample_id, body: values }
        }).then(() => dispatch({
          type: 'crf_first_diagnose/fetchPatient',
          payload: { sample_id }
        }))
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { patient } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyPatient']
    const { marriage, vocation, race } = this.state
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="性别">
          {getFieldDecorator('sex', {
            initialValue: patient.sex
          })(
            <Radio.Group>
              <Radio value={0}>男</Radio>
              <Radio value={1}>女</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="出生日期">
          {getFieldDecorator('date', {
            initialValue: patient.date ? moment(patient.date, 'YYYY-MM-DD') : null
          })(
            <DatePicker format={'YYYY-MM-DD'} />
          )}
        </Form.Item>
        <Form.Item label="人种">
          {getFieldDecorator('race', {
            initialValue: patient.race
          })(
            <Radio.Group onChange={this.handleRaceChange}>
              <Radio value='东方人'>东方人</Radio>
              <Radio value='黑人'>黑人</Radio>
              <Radio value='白人'>白人</Radio>
              <Radio value='其他'>
                其他{race === '其他' || (race === '' && patient.race === '其他')
                  ?
                  <Input
                    ref={this.race_input}
                    style={{ width: 200, marginLeft: 15 }}
                    placeholder="其他人种"
                  />
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="婚姻情况">
          {getFieldDecorator('marriage', {
            initialValue: patient.marriage
          })(
            <Radio.Group onChange={this.handleMarriageChange}>
              <Radio value='已婚'>已婚</Radio>
              <Radio value='未婚'>未婚</Radio>
              <Radio value='其他'>
                其他{marriage === '其他' || (marriage === '' && patient.marriage === '其他')
                  ?
                  <Input
                    ref={this.marriage_input}
                    style={{ width: 200, marginLeft: 15 }}
                    placeholder="其他婚姻情况"
                  />
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="文化程度">
          {getFieldDecorator('degree', {
            initialValue: patient.degree
          })(
            <Radio.Group>
              <Radio value={0}>文盲</Radio>
              <Radio value={1}>小学</Radio>
              <Radio value={2}>初中</Radio>
              <Radio value={3}>中专或高中</Radio>
              <Radio value={4}>大专或本科</Radio>
              <Radio value={5}>本科以上</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="职业">
          {getFieldDecorator('vocation', {
            initialValue: patient.vocation
          })(
            <Radio.Group onChange={this.handleVocationChange}>
              <Radio value='脑力劳动者'>脑力劳动者</Radio>
              <Radio value='体力劳动者'>体力劳动者</Radio>
              <Radio value='学生'>学生</Radio>
              <Radio value='离退休'>离退休</Radio>
              <Radio value='无业或失业'>无业或失业</Radio>
              <Radio value='其他'>
                其他{vocation === '其他' || (vocation === '' && patient.vocation === '其他')
                  ?
                  <Input
                    ref={this.vocation_input}
                    style={{ width: 200, marginLeft: 15 }}
                    placeholder="其他职业情况"
                  />
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="常住地区">
          {getFieldDecorator('zone', {
            initialValue: patient.zone
          })(
            <Radio.Group>
              <Radio value={0}>城市</Radio>
              <Radio value={1}>农村</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="身份证号">
          {getFieldDecorator('id_num', {
            initialValue: patient.id_num
          })(
            <Input style={{ width: 300 }} placeholder="请输入身份证号" />
          )}
        </Form.Item>
        <Form.Item label="住院号">
          {getFieldDecorator('hospital_ids', {
            initialValue: patient.hospital_ids
          })(
            <Input style={{ width: 300 }} placeholder="请输入住院号" />
          )}
        </Form.Item>
        <Form.Item label="患者电话">
          {getFieldDecorator('phone', {
            initialValue: patient.phone
          })(
            <Input style={{ width: 300 }} placeholder="请输入患者电话" />
          )}
        </Form.Item>
        <Form.Item label="家属电话">
          {getFieldDecorator('family_phone', {
            initialValue: patient.family_phone
          })(
            <Input style={{ width: 300 }} placeholder="请输入家属电话" />
          )}
        </Form.Item>
        <Col offset={4}>
          <Button
            htmlType="submit"
            type="primary"
            loading={submitLoading}
          >保存</Button>
        </Col>
      </Form>
    )
  }
}

export const FirstDiagnoseForm2 = connect(mapStateToProps)(Form.create()(FirstDiagnoseForm_2))

class FirstDiagnoseTable_3 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false
    }
  }

  handleDelete = report_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => new Promise(resolve => {
        const { dispatch } = this.props
        const sample_id = window.location.pathname.split('/')[4]
        dispatch({
          type: 'crf_first_diagnose/deletePatientReportTable',
          payload: { sample_id, report_id }
        }).then(() => {
          resolve()
          dispatch({
            type: 'crf_first_diagnose/fetchPatientReportTable',
            payload: { sample_id }
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
        const { record } = this.state
        const sample_id = window.location.pathname.split('/')[4]
        values.time = values.time.format('YYYY-MM-DD')
        values.report_id = record.report_id
        dispatch({
          type: 'crf_first_diagnose/modifyPatientReportTable',
          payload: { sample_id, body: values }
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'crf_first_diagnose/fetchPatientReportTable',
            payload: { sample_id }
          })
        })
      }
    })
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  render() {
    const { patient_report_table } = this.props.crf_first_diagnose
    const tableLoading = this.props.loading.effects['crf_first_diagnose/fetchPatientReportTable']
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyPatientReportTable']
    const { getFieldDecorator } = this.props.form
    const { record, visible } = this.state

    const columns = [{
      title: '日期',
      dataIndex: 'time',
      align: 'center'
    }, {
      title: '体温（℃）',
      dataIndex: 'temperature',
      align: 'center'
    }, {
      title: '呼吸（次/分）',
      dataIndex: 'breath_frequency',
      align: 'center'
    }, {
      title: '舒张压（mmHg）',
      dataIndex: 'maxpressure',
      align: 'center'
    }, {
      title: '收缩压（mmHg）',
      dataIndex: 'minpressure',
      align: 'center'
    }, {
      title: '心率（次/分）',
      dataIndex: 'heart_rate',
      align: 'center'
    }, {
      title: '操作',
      align: 'center',
      render: (_, record) => (
        <>
          <Button type="primary" size="small"
            onClick={() => this.handleEditModel(record)}>
            编辑</Button>
          <Button style={{ marginLeft: '10px' }} type="danger" size="small"
            onClick={() => this.handleDelete(record.report_id)}>
            删除</Button>
        </>
      )
    }]

    return (
      <>
        <Button type="primary" onClick={() => this.handleEditModel({ report_id: null })}>添加</Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey={'project_id'}
          size="small"
          bordered={true}
          pagination={false}
          scroll={{ x: true }}
          columns={columns}
          dataSource={patient_report_table}
        />
        <Modal
          title="编辑体格报告"
          visible={visible}
          okText="保存"
          destroyOnClose
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onSubmit={this.handleSubmit}>
            <Form.Item label="入组日期">
              {getFieldDecorator('time', {
                initialValue: record.time ? moment(record.time, 'YYYY-MM-DD') : null
              })(
                <DatePicker format={'YYYY-MM-DD'} />
              )}
            </Form.Item>
            <Form.Item label="体温（℃）">
              {getFieldDecorator('temperature', {
                initialValue: record.temperature
              })(
                <Input type="number" />
              )}
            </Form.Item>
            <Form.Item label="呼吸（次/分）">
              {getFieldDecorator('breath_frequency', {
                initialValue: record.breath_frequency
              })(
                <Input type="number" />
              )}
            </Form.Item>
            <Form.Item label="血压（mmHg ）" style={{ marginBottom: 0 }}>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('minpressure', {
                  initialValue: record.minpressure
                })(
                  <Input type="number" />
                )}
              </Form.Item>
              <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>/</span>
              <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                {getFieldDecorator('maxpressure', {
                  initialValue: record.maxpressure
                })(
                  <Input type="number" />
                )}
              </Form.Item>
            </Form.Item>
            <Form.Item label="心率（次/分）">
              {getFieldDecorator('heart_rate', {
                initialValue: record.heart_rate
              })(
                <Input type="number" />
              )}
            </Form.Item>
            <Row type="flex" justify="center">
              <Button
                htmlType="submit"
                type="primary"
                loading={submitLoading}
              >保存</Button>
              <Button
                style={{ marginLeft: 20 }}
                onClick={this.handleCancel}
              >取消</Button>
            </Row>
          </Form>
        </Modal >
      </>
    )
  }
}

export const FirstDiagnoseTable3 = connect(mapStateToProps)(Form.create()(FirstDiagnoseTable_3))