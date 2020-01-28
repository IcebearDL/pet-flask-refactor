import React from 'react'
import { connect } from 'dva'
import router from 'umi/router'
import {
  Button, Divider, Icon,
  Row, Col, Menu, message
} from 'antd'
import styles from './style.css'

const { SubMenu } = Menu

class CRFDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedKeys: ['first_diagnose'],
      cycle_navs: {
        children: []
      }
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    const { pathname } = this.props.location
    const sample_id = pathname.split('/')[4]
    dispatch({
      type: 'crfBase/fetchCrfInfo',
      payload: { sample_id }
    })
    this.refreshList()
  }

  refreshList = () => {
    const { dispatch } = this.props
    const { pathname } = this.props.location
    const sample_id = pathname.split('/')[4]
    dispatch({
      type: 'crfBase/fetchNavInfo',
      payload: { sample_id }
    }).then(() => this.setState({
      cycle_navs: this.props.nav_info[1]
    }))
  }

  handleMenuClick = ({ keyPath }) => {
    console.log(keyPath)
    if (keyPath[0] === 'add') {
      const { cycle_navs } = this.state

      //如果已存在新增访视
      if (cycle_navs.children[cycle_navs.children.length - 1].cycle_number === -1) {
        message.warning('请先保存增加的访视记录！')
        return
      }

      //不存在则新增访视记录
      const newKey = cycle_navs.children.length !== 0
        ?
        parseInt(cycle_navs.children[cycle_navs.children.length - 1].title.split('访视')[1]) + 1
        : 2
      cycle_navs.children.push({
        cycle_number: -1,
        title: `访视${newKey}`
      })
      console.log(cycle_navs)
      this.setState({ cycle_navs }, () => {
        this.setState({ selectedKeys: ['-1', 'cycle_record'] })
      })
      return
    }
    this.setState({ selectedKeys: keyPath })
  }

  render() {
    const { description, patient_name, project_ids, research_center_ids,
      group_name, patient_ids } = this.props.crf_info
    const { selectedKeys, cycle_navs } = this.state

    return (
      <div className="body_content">
        <Row type="flex" align="middle">
          <Col>
            <Button type="primary" onClick={router.goBack}><Icon type="left" />返回</Button>
          </Col>
          <Col>
            <div className={styles.crf_info}>
              <div>
                {description}&nbsp;&nbsp;&nbsp;
              编号：{project_ids}&nbsp;&nbsp;&nbsp;
              负责单位：{research_center_ids}
              </div>
              <div>
                受试者姓名：{patient_name}&nbsp;&nbsp;&nbsp;
                受试者编号：{patient_ids}&nbsp;&nbsp;&nbsp;
                组别：{group_name}&nbsp;&nbsp;&nbsp;
                研究中心：{research_center_ids}
              </div>
            </div>
          </Col>
        </Row>
        <Divider />
        <div className={styles.crf_content}>
          <div className={styles.crf_aside}>
            <Menu
              mode="inline"
              defaultOpenKeys={['cycle_record']}
              selectedKeys={selectedKeys}
              onClick={this.handleMenuClick}
            >
              <Menu.Item key='first_diagnose'>
                <span><Icon type="align-right" />基线资料（访视1）</span>
              </Menu.Item>
              <SubMenu
                key='cycle_record'
                title={<span><Icon type="dashboard" />治疗期随访</span>}
              >
                {cycle_navs.children.map(child =>
                  <Menu.Item key={child.cycle_number}>
                    <span className={child.cycle_number === -1 ? styles.edit_title : ''}>{child.title}</span>
                  </Menu.Item>
                )}
                <Menu.Item key='add'>
                  <span style={{ color: '#1DA57A' }}>新增&nbsp;&nbsp;<Icon type="file-add" /></span>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key='interview_table'>
                <span><Icon type="hourglass" />生存期随访</span>
              </Menu.Item>
              <Menu.Item key='adverse_table'>
                <span><Icon type="file-text" />项目总结</span>
              </Menu.Item>
            </Menu>
          </div>
          <div className={styles.crf_body}>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    crf_info: state.crfBase.crf_info,
    nav_info: state.crfBase.nav_info
  }
}

export default connect(mapStateToProps)(CRFDetail)
