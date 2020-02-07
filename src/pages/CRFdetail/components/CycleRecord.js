import React from 'react'
import { connect } from 'dva'
import { Menu } from "antd"
import styles from '../style.css'
import {
  FirstDiagnoseForm1, FirstDiagnoseForm7, FirstDiagnoseTable8,
  CycleRecordTable2
  // CycleRecordTable4, CycleRecordTable6,
  // AdverseEventTable
} from './Forms'

class CycleRecord extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      current: '5'
    }
  }

  componentDidMount() {
    const sample_id = window.location.pathname.split('/')[4]
    const { dispatch, cycle_number } = this.props
    dispatch({
      type: 'crf_cycle_record/fetchMainSymptom',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_cycle_record/fetchTreatmentRecord',
      payload: { sample_id, cycle_number }
    })
    dispatch({
      type: 'crf_cycle_record/fetchEvaluation',
      payload: { sample_id, cycle_number }
    })
  }

  handleMenuClick = e => {
    this.setState({
      current: e.key,
    })
  }

  render() {
    const { current } = this.state
    const { cycle_number } = this.props

    const menu_content = [
      <FirstDiagnoseForm1 key={2} cycle_number={cycle_number} />,
      <CycleRecordTable2 />,
      <FirstDiagnoseTable8 key={2} cycle_number={cycle_number} />,
      // <CycleRecordTable4 />,
      <FirstDiagnoseForm7 key={2} cycle_number={cycle_number} />,
      // <CycleRecordTable6 />,
      // <AdverseEventTable key={1} cycle_number={cycle_number} />
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
          <Menu.Item key='1'>主要症状体征</Menu.Item>
          <Menu.Item key='2'>影像学评估</Menu.Item>
          <Menu.Item key='3'>疗效评价</Menu.Item>
          <Menu.Item key='4'>实验室检查</Menu.Item>
          <Menu.Item key='5'>治疗记录单</Menu.Item>
          <Menu.Item key='6'>不良事件</Menu.Item>
          <Menu.Item key='7'>研究者签字</Menu.Item>
        </Menu>
        <div className={styles.menu_content}>
          {menu_content[parseInt(current)]}
        </div>
      </div>
    )
  }
}

export default connect()(CycleRecord)