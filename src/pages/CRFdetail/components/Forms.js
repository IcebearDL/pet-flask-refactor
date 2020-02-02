import React from 'react'
import { connect } from 'dva'
import {
  Modal, Row, Col, Form,
  DatePicker, Button,
  Radio, Input, Table,
  Checkbox, Switch, Select
} from "antd"
import moment from "moment"
import styles from '../style.css'

const { Option } = Select

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
            <DatePicker format={'YYYY-MM-DD'} />
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
        if (values.time) values.time = values.time.format('YYYY-MM-DD')
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
          rowKey={'report_id'}
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

class FirstDiagnoseForm_4 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      surgery: '',
      tumor_ill: '',
      drug_allergy: '',
      drug_use: '',
      smoke: null,
      smoke_isquit: null,
      drinking: null,
      drinking_is_quit: null
    }
  }

  handleStateChange = (type, e) => {
    if (type === 'drug_use' || type === 'drug_allergy' || type === 'tumor_ill' || type === 'surgery') {
      this.setState({ [type]: e.target.value })
    } else {
      this.setState({ [type]: e })
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props
        //过滤checkbox的值
        //过滤base_ill
        const boolean_cloumn = ['smoke', 'smoke_isquit', 'smoke_chemotherapy', 'drinking_chemotherapy', 'drinking', 'drinking_is_quit']
        const base_ill = {}
        for (let type in values.base_ill) {
          if (values.base_ill[type]) {
            values.base_ill[type] = 'on'
            base_ill[`base_ill[${type}]`] = 'on'
          }
          delete values.base_ill[type]
        }
        if (values.base_ill_other) {
          base_ill.base_ill_other = values.base_ill_other
          delete values.base_ill_other
        }
        values.base_ill = base_ill
        for (let type of boolean_cloumn) {
          values[type] ? values[type] = 'on' : delete values[type]
        }
        //过滤日期传值
        if (values.drinking_quit_time) values.drinking_quit_time = values.drinking_quit_time.format('YYYY-MM-DD')
        if (values.smoke_quit_time) values.smoke_quit_time = values.smoke_quit_time.format('YYYY-MM-DD')
        //重构烟酒史传值
        const smoke = {}, drinking = {}
        for (let type of ['smoke', 'smoke_isquit', 'smoke_quit_time', 'smoke_size', 'smoke_year']) {
          smoke[type] = values[type]
          delete values[type]
        }
        for (let type of ['drinking', 'drinking_frequence', 'drinking_is_quit', 'drinking_quit_time', 'drinking_size']) {
          drinking[type] = values[type]
          delete values[type]
        }
        values.smoke = smoke
        values.drinking = drinking
        for (let type of ['drug_allergy_other', 'drug_use_other', 'surgery_other', 'tumor_ill_other']) {
          if (values[type] === undefined) values[type] = null
        }

        const sample_id = window.location.pathname.split('/')[4]
        dispatch({
          type: 'crf_first_diagnose/modifyPatientHistory',
          payload: { sample_id, body: values }
        }).then(() => dispatch({
          type: 'crf_first_diagnose/fetchPatientHistory',
          payload: { sample_id }
        }))
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { patient_history } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyPatientHistory']
    const { surgery, tumor_ill, drug_allergy, drug_use, smoke, smoke_isquit, drinking, drinking_is_quit } = this.state
    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="外伤及手术史：">
          {getFieldDecorator('surgery', {
            initialValue: patient_history.surgery
          })(
            <Radio.Group onChange={e => this.handleStateChange('surgery', e)}>
              <Radio value='无'>无</Radio>
              <Radio value='不详'>不详</Radio>
              <Radio value='其他'>
                其他{surgery === '其他' || (surgery === '' && patient_history.surgery === '其他')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('surgery_other', {
                      initialValue: patient_history.surgery_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他外伤及手术史" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基础疾病史：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('base_ill[无]', {
              initialValue: patient_history['base_ill[无]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>无</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[不详]', {
              initialValue: patient_history['base_ill[不详]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>不详</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[高血压]', {
              initialValue: patient_history['base_ill[高血压]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>高血压</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[冠心病]', {
              initialValue: patient_history['base_ill[冠心病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>冠心病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[糖尿病]', {
              initialValue: patient_history['base_ill[糖尿病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>糖尿病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[慢性阻塞性肺疾病]', {
              initialValue: patient_history['base_ill[慢性阻塞性肺疾病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>慢性阻塞性肺疾病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[支气管哮喘]', {
              initialValue: patient_history['base_ill[支气管哮喘]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>支气管哮喘</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[肺结核]', {
              initialValue: patient_history['base_ill[肺结核]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肺结核</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[间质性肺疾病]', {
              initialValue: patient_history['base_ill[间质性肺疾病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>间质性肺疾病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[高脂血症]', {
              initialValue: patient_history['base_ill[高脂血症]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>高脂血症</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[病毒性肝炎]', {
              initialValue: patient_history['base_ill[病毒性肝炎]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>病毒性肝炎</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[风湿免疫性疾病]', {
              initialValue: patient_history['base_ill[风湿免疫性疾病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>风湿免疫性疾病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[肾脏病]', {
              initialValue: patient_history['base_ill[肾脏病]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肾脏病</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('base_ill[其他]', {
              initialValue: patient_history['base_ill[其他]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>其他</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('base_ill_other', {
                initialValue: patient_history['base_ill_other']
              })(<Input style={{ width: 200 }} placeholder="其他基础疾病" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="肿瘤病史：">
          {getFieldDecorator('tumor_ill', {
            initialValue: patient_history.tumor_ill
          })(
            <Radio.Group onChange={e => this.handleStateChange('tumor_ill', e)}>
              <Radio value='无'>无</Radio>
              <Radio value='不详'>不详</Radio>
              <Radio value='其他'>
                其他{tumor_ill === '其他' || (tumor_ill === '' && patient_history.tumor_ill === '其他')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('tumor_ill_other', {
                      initialValue: patient_history.tumor_ill_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他肿瘤病史" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="药物过敏史：">
          {getFieldDecorator('drug_allergy', {
            initialValue: patient_history.drug_allergy
          })(
            <Radio.Group onChange={e => this.handleStateChange('drug_allergy', e)}>
              <Radio value='无'>无</Radio>
              <Radio value='不详'>不详</Radio>
              <Radio value='其他'>
                其他{drug_allergy === '其他' || (drug_allergy === '' && patient_history.drug_allergy === '其他')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('drug_allergy_other', {
                      initialValue: patient_history.drug_allergy_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他药物过敏史" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="药物使用史：">
          {getFieldDecorator('drug_use', {
            initialValue: patient_history.drug_use
          })(
            <Radio.Group onChange={e => this.handleStateChange('drug_use', e)}>
              <Radio value='无'>无</Radio>
              <Radio value='不详'>不详</Radio>
              <Radio value='其他'>
                其他{drug_use === '其他' || (drug_use === '' && patient_history.drug_use === '其他')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('drug_use_other', {
                      initialValue: patient_history.drug_use_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他药物使用史" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="吸烟史：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('smoke', {
              initialValue: patient_history.smoke === 'on',
              valuePropName: 'checked'
            })(
              <Switch
                onChange={e => this.handleStateChange('smoke', e)}
                checkedChildren="有"
                unCheckedChildren="无"
              />
            )}
          </Form.Item>
          {smoke || (smoke === null && patient_history.smoke === 'on')
            ?
            <>
              <Form.Item className={styles.smock_item}>
                平均吸烟（支/天）: {getFieldDecorator('smoke_size', {
                  initialValue: patient_history.smoke_size
                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="" />)}
              </Form.Item>
              <Form.Item className={styles.smock_item}>
                吸烟年数：{getFieldDecorator('smoke_year', {
                  initialValue: patient_history.smoke_year
                })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="" />)}
              </Form.Item>
              <br />
              <Form.Item className={styles.smock_item}>
                是否戒烟：{getFieldDecorator('smoke_isquit', {
                  initialValue: patient_history.smoke_isquit === 'on',
                  valuePropName: 'checked'
                })(
                  <Switch
                    onChange={e => this.handleStateChange('smoke_isquit', e)}
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                )}
              </Form.Item>
              {smoke_isquit || (smoke_isquit === null && patient_history.smoke_isquit === 'on')
                ?
                <>
                  <Form.Item className={styles.smock_item}>
                    戒烟时间：{getFieldDecorator('smoke_quit_time', {
                      initialValue: patient_history.smoke_quit_time ? moment(patient_history.smoke_quit_time, 'YYYY-MM-DD') : null
                    })(<DatePicker format={'YYYY-MM-DD'} />)}
                  </Form.Item>
                  <Form.Item className={styles.smock_item}>
                    化疗期间是否吸烟：{getFieldDecorator('smoke_chemotherapy', {
                      initialValue: patient_history.smoke_chemotherapy === 'on',
                      valuePropName: 'checked'
                    })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
                  </Form.Item>
                </>
                : null}
            </>
            : null}
        </Form.Item>
        <Form.Item label="饮酒史：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('drinking', {
              initialValue: patient_history.drinking === 'on',
              valuePropName: 'checked'
            })(
              <Switch
                onChange={e => this.handleStateChange('drinking', e)}
                checkedChildren="有"
                unCheckedChildren="无"
              />
            )}
          </Form.Item>
          {drinking || (drinking === null && patient_history.drinking === 'on')
            ?
            <>
              <Form.Item className={styles.drinking_item}>
                <span>饮酒频率：</span>
                {getFieldDecorator('drinking_frequence', {
                  initialValue: patient_history.drinking_frequence
                })(<Select style={{ width: '150px' }}>
                  <Option value='0'>几乎不</Option>
                  <Option value='1'>每周1-2次</Option>
                  <Option value='2'>每周3-4次</Option>
                  <Option value='3'>每周5-7次</Option>
                </Select>)}
              </Form.Item>
              <Form.Item className={styles.drinking_item}>
                <span>每次饮酒量：</span>
                {getFieldDecorator('drinking_size', {
                  initialValue: patient_history.drinking_size
                })(<Select style={{ width: '150px' }}>
                  <Option value='0'>每次少量</Option>
                  <Option value='1'>每次微醺</Option>
                  <Option value='2'>偶尔大醉</Option>
                  <Option value='3'>每次大醉</Option>
                </Select>)}
              </Form.Item>
              <br />
              <Form.Item className={styles.drinking_item}>
                是否戒酒：{getFieldDecorator('drinking_is_quit', {
                  initialValue: patient_history.drinking_is_quit === 'on',
                  valuePropName: 'checked'
                })(
                  <Switch
                    onChange={e => this.handleStateChange('drinking_is_quit', e)}
                    checkedChildren="是"
                    unCheckedChildren="否"
                  />
                )}
              </Form.Item>
              {drinking_is_quit || (drinking_is_quit === null && patient_history.drinking_is_quit === 'on')
                ?
                <>
                  <Form.Item className={styles.drinking_item}>
                    戒酒时间：{getFieldDecorator('drinking_quit_time', {
                      initialValue: patient_history.drinking_quit_time ? moment(patient_history.drinking_quit_time, 'YYYY-MM-DD') : null
                    })(<DatePicker format={'YYYY-MM-DD'} />)}
                  </Form.Item>
                  <Form.Item className={styles.drinking_item}>
                    化疗期间是否饮酒：{getFieldDecorator('drinking_chemotherapy', {
                      initialValue: patient_history.drinking_chemotherapy === 'on',
                      valuePropName: 'checked'
                    })(<Switch checkedChildren="是" unCheckedChildren="否" />)}
                  </Form.Item>
                </>
                : null}
            </>
            : null}
        </Form.Item>
        <Form.Item label="身高（cm）：">
          {getFieldDecorator('height', {
            initialValue: patient_history.height
          })(
            <Input style={{ width: 300 }} placeholder="请输入身高（cm）" />
          )}
        </Form.Item>
        <Form.Item label="体重（kg）：">
          {getFieldDecorator('weight', {
            initialValue: patient_history.weight
          })(
            <Input style={{ width: 300 }} placeholder="请输入体重（kg）" />
          )}
        </Form.Item>
        <Form.Item label="体表面积（m²）：">
          {getFieldDecorator('surface_area', {
            initialValue: patient_history.surface_area
          })(
            <Input style={{ width: 300 }} placeholder="请输入体表面积（m²）" />
          )}
        </Form.Item>
        <Form.Item label="ECOG评分：">
          {getFieldDecorator('ECOG', {
            initialValue: patient_history.ECOG
          })(
            <Input style={{ width: 300 }} placeholder="请输入ECOG评分" />
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

export const FirstDiagnoseForm4 = connect(mapStateToProps)(Form.create()(FirstDiagnoseForm_4))


class FirstDiagnoseForm_5 extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      biopsy_method: '',
      tumor_pathological_type: '',
      genetic_testing_specimen: '',
      tmb: '',
    }
  }

  handleStateChange = (type, { target: { value } }) => {
    this.setState({ [type]: value })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (!err) {
        //重构clinical_symptoms
        const clinical_symptoms = {}
        if (values.clinical_symptoms['其他']._other) {
          clinical_symptoms['clinical_symptoms[其他]_other'] = values.clinical_symptoms['其他']._other
        }
        if (values.clinical_symptoms['其他']._else) {
          clinical_symptoms['clinical_symptoms[其他]'] = 'on'
        }
        for (let type in values.clinical_symptoms) {
          if (values.clinical_symptoms[type] === true) {
            clinical_symptoms[`clinical_symptoms[${type}]`] = 'on'
          }
        }
        values.clinical_symptoms = clinical_symptoms
        //重构gene_mutation_type
        const gene_mutation_type = {}
        if (values.gene_mutation_type.ALK._other) {
          gene_mutation_type['gene_mutation_type[ALK]_other'] = values.gene_mutation_type.ALK._other
        }
        if (values.gene_mutation_type.EGFR._other) {
          gene_mutation_type['gene_mutation_type[EGFR]_other'] = values.gene_mutation_type.EGFR._other
        }
        if (values.gene_mutation_type.ALK._ALK) {
          gene_mutation_type['gene_mutation_type[ALK]'] = 'on'
        }
        if (values.gene_mutation_type.EGFR._EGFR) {
          gene_mutation_type['gene_mutation_type[EGFR]'] = 'on'
        }
        for (let type in values.gene_mutation_type) {
          if (values.gene_mutation_type[type] === true) {
            gene_mutation_type[`gene_mutation_type[${type}]`] = 'on'
          }
        }
        values.gene_mutation_type = gene_mutation_type
        //重构transfer_site
        const transfer_site = {}
        if (values.transfer_site['其他']._other) {
          transfer_site['transfer_site[其他]_other'] = values.transfer_site['其他']._other
        }
        if (values.transfer_site['其他']._else) {
          transfer_site['transfer_site[其他]'] = 'on'
        }
        for (let type in values.transfer_site) {
          if (values.transfer_site[type] === true) {
            transfer_site[`transfer_site[${type}]`] = 'on'
          }
        }
        values.transfer_site = transfer_site
        //补全other选项
        for (let type of ['biopsy_method_other', 'genetic_testing_specimen_other', 'tmb_other', 'tumor_pathological_type_other']) {
          if (values[type] === undefined) values[type] = null
        }

        const { dispatch } = this.props
        const sample_id = window.location.pathname.split('/')[4]
        dispatch({
          type: 'crf_first_diagnose/modifyFirstDiagnose',
          payload: { sample_id, body: values }
        }).then(() => dispatch({
          type: 'crf_first_diagnose/fetchFirstDiagnose',
          payload: { sample_id }
        }))
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { first_diagnose } = this.props.crf_first_diagnose
    const submitLoading = this.props.loading.effects['crf_first_diagnose/modifyFirstDiagnose']
    const { biopsy_method, tumor_pathological_type, genetic_testing_specimen, tmb } = this.state

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit}>
        <Form.Item label="初诊临床症状：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('clinical_symptoms[咳嗽]', {
              initialValue: first_diagnose['clinical_symptoms[咳嗽]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>咳嗽</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[咳痰]', {
              initialValue: first_diagnose['clinical_symptoms[咳痰]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>咳痰</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[咳血]', {
              initialValue: first_diagnose['clinical_symptoms[咳血]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>咳血</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[发热]', {
              initialValue: first_diagnose['clinical_symptoms[发热]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>发热</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[胸闷]', {
              initialValue: first_diagnose['clinical_symptoms[胸闷]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>胸闷</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[胸痛]', {
              initialValue: first_diagnose['clinical_symptoms[胸痛]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>胸痛</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[喘气]', {
              initialValue: first_diagnose['clinical_symptoms[喘气]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>喘气</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[消瘦]', {
              initialValue: first_diagnose['clinical_symptoms[消瘦]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>消瘦</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[体重下降]', {
              initialValue: first_diagnose['clinical_symptoms[体重下降]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>体重下降</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[不详]', {
              initialValue: first_diagnose['clinical_symptoms[不详]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>不详</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('clinical_symptoms[其他]_else', {
              initialValue: first_diagnose['clinical_symptoms[其他]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>其他</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('clinical_symptoms[其他]_other', {
                initialValue: first_diagnose['clinical_symptoms[其他]_other']
              })(<Input style={{ width: 200 }} placeholder="其他症状" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="病灶部位：">
          {getFieldDecorator('tumor_part', {
            initialValue: first_diagnose.tumor_part
          })(
            <Radio.Group>
              <Radio value={0}>左上肺</Radio>
              <Radio value={1}>左下肺</Radio>
              <Radio value={2}>右上肺</Radio>
              <Radio value={3}>右中肺</Radio>
              <Radio value={4}>右下肺</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="转移部位：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('transfer_site[无]', {
              initialValue: first_diagnose['transfer_site[无]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>无</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[对侧肺门淋巴结]', {
              initialValue: first_diagnose['transfer_site[对侧肺门淋巴结]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>对侧肺门淋巴结</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[锁骨上淋巴结肺内]', {
              initialValue: first_diagnose['transfer_site[锁骨上淋巴结肺内]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>锁骨上淋巴结肺内</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[肺内]', {
              initialValue: first_diagnose['transfer_site[肺内]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肺内</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[脑]', {
              initialValue: first_diagnose['transfer_site[脑]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>脑</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[脊柱骨]', {
              initialValue: first_diagnose['transfer_site[脊柱骨]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>脊柱骨</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[四肢骨]', {
              initialValue: first_diagnose['transfer_site[四肢骨]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>四肢骨</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[肝]', {
              initialValue: first_diagnose['transfer_site[肝]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肝</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[肾上腺]', {
              initialValue: first_diagnose['transfer_site[肾上腺]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>肾上腺</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('transfer_site[其他]_else', {
              initialValue: first_diagnose['transfer_site[其他]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>其他</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('transfer_site[其他]_other', {
                initialValue: first_diagnose['transfer_site[其他]_other']
              })(<Input style={{ width: 200 }} placeholder="其他部位" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="活检方式：">
          {getFieldDecorator('biopsy_method', {
            initialValue: first_diagnose.biopsy_method
          })(
            <Radio.Group onChange={e => this.handleStateChange('biopsy_method', e)}>
              <Radio value='无'>无</Radio>
              <Radio value='手术'>手术</Radio>
              <Radio value='胸腔镜'>胸腔镜</Radio>
              <Radio value='纵隔镜'>纵隔镜</Radio>
              <Radio value='经皮肺穿刺'>经皮肺穿刺</Radio>
              <Radio value='纤支镜'>纤支镜</Radio>
              <Radio value='E-BUS'>E-BUS</Radio>
              <Radio value='EUS-FNA'>EUS-FNA</Radio>
              <Radio value='淋巴结活检'>淋巴结活检</Radio>
              <Radio value='其他'>
                其他{biopsy_method === '其他' || (biopsy_method === '' && first_diagnose.biopsy_method === '其他')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('biopsy_method_other', {
                      initialValue: first_diagnose.biopsy_method_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他方式" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="肿瘤病理类型：">
          {getFieldDecorator('tumor_pathological_type', {
            initialValue: first_diagnose.tumor_pathological_type
          })(
            <Radio.Group onChange={e => this.handleStateChange('tumor_pathological_type', e)}>
              <Radio value='腺癌'>腺癌</Radio>
              <Radio value='鳞癌'>鳞癌</Radio>
              <Radio value='小细胞肺癌'>小细胞肺癌</Radio>
              <Radio value='大细胞癌'>大细胞癌</Radio>
              <Radio value='神经内分泌癌'>神经内分泌癌</Radio>
              <Radio value='肉瘤'>肉瘤</Radio>
              <Radio value='分化差的癌'>分化差的癌</Radio>
              <Radio value='混合型癌'>
                混合型癌{tumor_pathological_type === '混合型癌' || (tumor_pathological_type === '' && first_diagnose.tumor_pathological_type === '混合型癌')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('tumor_pathological_type_other', {
                      initialValue: first_diagnose.tumor_pathological_type_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他类型" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基因检测标本：">
          {getFieldDecorator('genetic_testing_specimen', {
            initialValue: first_diagnose.genetic_testing_specimen
          })(
            <Radio.Group onChange={e => this.handleStateChange('genetic_testing_specimen', e)}>
              <Radio value='无'>无</Radio>
              <Radio value='外周血'>外周血</Radio>
              <Radio value='原发灶组织'>原发灶组织</Radio>
              <Radio value='转移灶组织'>
                转移灶组织{genetic_testing_specimen === '转移灶组织' || (genetic_testing_specimen === '' && first_diagnose.genetic_testing_specimen === '转移灶组织')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('genetic_testing_specimen_other', {
                      initialValue: first_diagnose.genetic_testing_specimen_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="其他标本" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基因检测方法：">
          {getFieldDecorator('genetic_testing_method', {
            initialValue: first_diagnose.genetic_testing_method
          })(
            <Radio.Group>
              <Radio value={0}>无</Radio>
              <Radio value={1}>ARMS</Radio>
              <Radio value={2}>FISH</Radio>
              <Radio value={3}>NGS</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="基因突变类型：">
          <Form.Item style={{ display: 'inline-block' }}>
            {getFieldDecorator('gene_mutation_type[未测]', {
              initialValue: first_diagnose['gene_mutation_type[未测]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>未测</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[不详]', {
              initialValue: first_diagnose['gene_mutation_type[不详]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>不详</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[无突变]', {
              initialValue: first_diagnose['gene_mutation_type[无突变]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>无突变</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[ROS-1]', {
              initialValue: first_diagnose['gene_mutation_type[ROS-1]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>ROS-1</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[cMET]', {
              initialValue: first_diagnose['gene_mutation_type[cMET]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>cMET</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[BRAF]', {
              initialValue: first_diagnose['gene_mutation_type[BRAF]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>BRAF</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[KRAS]', {
              initialValue: first_diagnose['gene_mutation_type[KRAS]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>KRAS</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[Her-2]', {
              initialValue: first_diagnose['gene_mutation_type[Her-2]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>Her-2</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[RET]', {
              initialValue: first_diagnose['gene_mutation_type[RET]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>RET</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[ERBB2]', {
              initialValue: first_diagnose['gene_mutation_type[ERBB2]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>ERBB2</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[TP53]', {
              initialValue: first_diagnose['gene_mutation_type[TP53]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>TP53</Checkbox>)}
          </Form.Item>
          <Form.Item className={styles.from_item}>
            {getFieldDecorator('gene_mutation_type[EGFR]_EGFR', {
              initialValue: first_diagnose['gene_mutation_type[EGFR]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>EGFR</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('gene_mutation_type[EGFR]_other', {
                initialValue: first_diagnose['gene_mutation_type[EGFR]_other']
              })(<Input style={{ width: 200 }} placeholder="EGFR描述" />)}
            </div>
          </Form.Item>
          <Form.Item style={{ display: 'inline-block', marginLeft: '20px' }}>
            {getFieldDecorator('gene_mutation_type[ALK]_ALK', {
              initialValue: first_diagnose['gene_mutation_type[ALK]'] === 'on',
              valuePropName: 'checked'
            })(<Checkbox>ALK</Checkbox>)}
            <div style={{ display: 'inline-block' }}>
              {getFieldDecorator('gene_mutation_type[ALK]_other', {
                initialValue: first_diagnose['gene_mutation_type[ALK]_other']
              })(<Input style={{ width: 200 }} placeholder="ALK描述" />)}
            </div>
          </Form.Item>
        </Form.Item>
        <Form.Item label="PD-L1表达：">
          {getFieldDecorator('pdl1', {
            initialValue: first_diagnose.pdl1
          })(
            <Radio.Group>
              <Radio value={0}>未测</Radio>
              <Radio value={1}>不详</Radio>
              <Radio value={2}>&gt;50%</Radio>
              <Radio value={3}>1%-50%</Radio>
              <Radio value={4}>&lt;1%</Radio>
              <Radio value={5}>阴性</Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="肿瘤突变负荷（TMB）：">
          {getFieldDecorator('tmb', {
            initialValue: first_diagnose.tmb
          })(
            <Radio.Group onChange={e => this.handleStateChange('tmb', e)}>
              <Radio value='未测'>未测</Radio>
              <Radio value='不详'>不详</Radio>
              <Radio value='其他'>
                数量（个突变/Mb）{tmb === '其他' || (tmb === '' && first_diagnose.tmb === '其他')
                  ?
                  <div style={{ display: 'inline-block' }}>
                    {getFieldDecorator('tmb_other', {
                      initialValue: first_diagnose.tmb_other
                    })(<Input style={{ width: 200, marginLeft: 15 }} placeholder="tmb数量" />)}
                  </div>
                  : null}
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
        <Form.Item label="微卫星不稳定性（MSI）：">
          {getFieldDecorator('msi', {
            initialValue: first_diagnose.msi
          })(
            <Radio.Group>
              <Radio value={0}>未测</Radio>
              <Radio value={1}>不详</Radio>
              <Radio value={2}>微卫星稳定型</Radio>
              <Radio value={3}>微卫星不稳定型</Radio>
            </Radio.Group>
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

export const FirstDiagnoseForm5 = connect(mapStateToProps)(Form.create()(FirstDiagnoseForm_5))