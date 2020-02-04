import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import {
  Table, Layout, Button,
  Menu, Dropdown, Icon,
  Modal, Tooltip, Row, Col, Divider
} from "antd"
import Link from 'umi/link'
import styles from './style.css'
import { checkLogin } from '../../utils/util'

import SampleModal from './SampleModal'

const Content = Layout.Content

class SampleList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      status: {
        page: 1,
        limit: 10
      },
      sample_record: {},
      sample_modal_visible: false
    }
  }

  componentDidMount() {
    if (!checkLogin()) return
    const { dispatch } = this.props
    const { pathname } = this.props.location
    dispatch({
      type: 'global/fetchResearchCenterInfo'
    })
    dispatch({
      type: 'sample/fetchSampleInfo',
      payload: {
        project_id: pathname.split('/')[2]
      }
    })
    this.refreshList()
  }

  refreshList = (state) => {
    const { dispatch } = this.props
    let { status } = this.state
    if (state) {
      status = { ...status, ...state }
    }
    dispatch({
      type: "sample/fetchExpsampleList",
      payload: { ...status }
    })
    this.setState({ status })
  }


  handleMenuClick = ({ key }, record) => {
    const { dispatch } = this.props
    if (key === 'edit') {
      //编辑操作
      this.setState({
        sample_record: record,
        sample_modal_visible: true
      })
    } else if (key === 'submit') {
      //提交操作
      Modal.confirm({
        title: '请问是否确认提交到总中心？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => new Promise(resolve => {
          dispatch({
            type: 'sample/submitSample',
            payload: {
              sample_id: record.sample_id
            }
          }).then(resolve)
        })
      })
    } else if (key === 'delete') {
      //删除操作
      Modal.confirm({
        title: '请问是否确认删除？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => new Promise(resolve => {
          dispatch({
            type: 'sample/deleteSample',
            payload: {
              sample_id: record.sample_id
            }
          }).then(resolve)
        })
      })
    }
  }

  handleCreateSample = () => {
    this.setState({
      sample_record: {},
      sample_modal_visible: true
    })
  }

  handleSaveSample = values => {
    const { dispatch } = this.props
    dispatch({
      type: 'sample/createSample',
      payload: values
    }).then(() => this.setState({
      sample_modal_visible: false
    }, this.refreshList))
  }

  handleHideModal = () => {
    this.setState({ sample_modal_visible: false })
  }

  render() {
    const tableLoading = this.props.loading.effects['sample/fetchExpsampleList']

    const columns = [
      {
        title: '研究中心',
        dataIndex: 'research_center_ids',
        align: 'center',
        width: 120,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '编号',
        dataIndex: 'patient_ids',
        align: 'center',
        width: 100,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '姓名',
        dataIndex: 'patient_name',
        align: 'center',
        width: 80,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '身份证号',
        dataIndex: 'id_num',
        align: 'center',
        width: 130,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '组别',
        dataIndex: 'group_name',
        align: 'center',
        width: 100,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '性别',
        dataIndex: 'sex',
        align: 'center',
        width: 50
      }, {
        title: '年龄',
        dataIndex: 'age',
        align: 'center',
        width: 50
      }, {
        title: '随访进度',
        dataIndex: 'interview_status',
        align: 'center',
        width: 100,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '上一次随访时间',
        dataIndex: 'last_interview_time',
        align: 'center',
        width: 100,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '预计下一次随访时间',
        dataIndex: 'next_interview_time',
        align: 'center',
        width: 100,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '操作',
        align: 'center',
        width: 60,
        render: (_, record) => (
          <Dropdown
            overlay={<Menu onClick={e => this.handleMenuClick(e, record)}>
              <Menu.Item key="edit">编辑</Menu.Item>
              <Menu.Item key="submit">提交</Menu.Item>
              <Menu.Item key="delete">删除</Menu.Item>
            </Menu>}
          >
            <Button type="primary" size="small">
              <Link to={`/project/${record.project_id}/sample/${record.sample_id}/crf`}>详情<Icon type="down" /></Link>
            </Button>
          </Dropdown >
        )
      }
    ]

    return (
      <Content className="body_content" >
        <Row type="flex" align="middle">
          <Col>
            <Button type="primary" onClick={router.goBack}><Icon type="left" />返回</Button>
          </Col>
          <Col>
            <div className={styles.sample_info}>
              {this.props.sample_info.description}&nbsp;&nbsp;&nbsp;
              编号：{this.props.sample_info.project_ids}&nbsp;&nbsp;&nbsp;
              负责单位：{this.props.sample_info.research_center_ids}
            </div>
          </Col>
        </Row>
        <Divider />
        <div className="page_body">
          <Button type="primary" onClick={this.handleCreateSample}><Icon type="plus" />添加</Button>
        </div>
        <Table
          loading={tableLoading}
          className={styles.sample_table}
          rowKey={'sample_id'}
          size="small"
          bordered={true}
          pagination={false}
          scroll={{ x: true }}
          columns={columns}
          dataSource={this.props.sample_list}
        />
        <SampleModal
          record={this.state.sample_record}
          visible={this.state.sample_modal_visible}
          handleSaveSample={this.handleSaveSample}
          onCancel={this.handleHideModal}
        />
      </Content>
    )
  }
}

function mapStateToProps(state) {
  return {
    sample_list: state.sample.sample_list,
    sample_info: state.sample.sample_info,
    research_center_info: state.global.research_center_info,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(SampleList)