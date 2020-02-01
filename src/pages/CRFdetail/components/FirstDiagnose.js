import React from 'react'
import { connect } from 'dva'
import {
  Menu, Icon, Form,
  DatePicker, Button,
  Radio, Input
} from "antd"
import { FirstDiagnoseForm1, FirstDiagnoseForm2, FirstDiagnoseTable3 } from './Forms'
import styles from '../style.css'

class FirstDiagnose extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      current: '2'
    }
  }

  componentDidMount() {
    const cycle_number = 1
    const sample_id = window.location.pathname.split('/')[4]
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
    this.setState({
      current: e.key,
    })
  }

  render() {
    const { current } = this.state

    const menu_content = [
      <FirstDiagnoseForm1 />,
      <FirstDiagnoseForm2 />,
      <FirstDiagnoseTable3 />
    ]

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

export default connect(mapStateToProps)(FirstDiagnose)