import React from 'react'
import { connect } from 'dva'
import {
  Menu, Icon, Form,
  DatePicker, Button
} from "antd"
import moment from "moment"
import styles from '../style.css'

const { SubMenu } = Menu

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

class FirstDiagnose extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      current: '0'
    }
  }

  componentDidMount() {
    const cycle_number = 1
    const sample_id = window.localStorage.getItem('sample_id')
    const { dispatch } = this.props
    dispatch({
      type: 'crf_first_diagnose/fetchPatient',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchPatientHistory',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchLabInspection',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchFirstDiagnose',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchCycleTime',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchPhotoEvaluateTable',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchDiagnoseHistory',
      payload: { sample_id }
    })
    dispatch({
      type: 'crf_first_diagnose/fetchPatientReportTable',
      payload: { sample_id }
    })
  }

  handleMenuClick = e => {
    console.log(e)
    this.setState({
      current: e.key,
    })
  }

  handleSubmit_1 = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { patient, patient_report_table, cycle_time,
      first_diagnose, diagnose_history, photo_evaluate_table,
      patient_history, lab_inspection } = this.props.crf_first_diagnose
    const submitLoading_1 = this.props.loading.effects['crf_first_diagnose/modifyCycleTime']
    const { current } = this.state

    const menu_content = [(
      <Form layout="inline" onSubmit={this.handleSubmit_1}>
        <Form.Item label="访视时间">
          {getFieldDecorator('cycle_time', {
            rules: [{ required: true, message: '请选择访视时间!' }],
            initialValue: cycle_time ? moment(cycle_time, 'YYYY-MM-DD') : null
          })(
            <DatePicker format={'YYYY-MM-DD'} placeholder="请选择日期" />
          )}
        </Form.Item>
        <br />
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            className={styles.submit_button_1}
            loading={submitLoading_1}
          >保存</Button>
        </Form.Item>
      </Form>
    ), (
      <div></div>
    )]

    return (
      <div className={styles.menu_div}>
        <Menu
          className={styles.menu_title}
          onClick={this.handleMenuClick}
          selectedKeys={[current]}
          mode="horizontal"
        >
          <Menu.Item key='0'>访视时间</Menu.Item>
          <Menu.Item key='1'>人口统计学</Menu.Item>
          <Menu.Item key='2'>体格检查</Menu.Item>
          <Menu.Item key='3'>既往史</Menu.Item>
          <Menu.Item key='4'>初诊过程</Menu.Item>
          <Menu.Item key='5'>治疗史</Menu.Item>
          <Menu.Item key='6'>实验室检查 </Menu.Item>
          <Menu.Item key='7'>影像学评估</Menu.Item>
          <Menu.Item key='8'>研究者签字</Menu.Item>
        </Menu>
        <div className={styles.menu_content}>
          {menu_content[parseInt(current)]}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    crf_first_diagnose: state.crf_first_diagnose,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(FirstDiagnose))