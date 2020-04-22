import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import router from 'umi/router'
import {
  Table,
  Layout,
  Button,
  Menu,
  Dropdown,
  Icon,
  Modal,
  Tooltip,
  Row,
  Col,
  Divider,
  Input,
  Select,
  Spin,
  message,
  Pagination
} from 'antd'
import Link from 'umi/link'
import styles from './style.css'

import CheckTags from '../../components/CheckTags'
import { checkLogin } from '@/utils/util'
import { getProjectId } from '@/utils/location'

import SampleModal from './SampleModal'

const Content = Layout.Content
const Option = Select.Option

class SampleList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      status: {
        page: 1,
        limit: 20
      },
      search_type: 0,
      sample_record: {},
      sample_modal_visible: false
    }
    this.searchInput = React.createRef()
    this.research_center_id = JSON.parse(window.localStorage.getItem('userInfo')).research_center_id
  }

  static propTypes = {
    total: PropTypes.number.isRequired,
    sample_list: PropTypes.array.isRequired,
    sample_info: PropTypes.object.isRequired,
    research_center_info: PropTypes.array.isRequired,
    group_ids_info: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (!checkLogin()) return
    const { dispatch } = this.props
    const project_id = getProjectId()

    dispatch({
      type: 'sample/fetchSampleInfo',
      payload: { project_id }
    })
    dispatch({
      type: 'global/fetchResearchCenterInfo'
    })
    dispatch({
      type: 'global/fetchPatientGroup'
    })
    this.refreshList()
  }

  refreshList = state => {
    let { status } = this.state
    const { dispatch } = this.props

    if (state) {
      status = { ...status, ...state }
    }

    // tumor_pathological_type不传id传name
    if (status.tumor_pathological_type) {
      const tumor_pathological = [
        '腺癌',
        '鳞癌',
        '小细胞肺癌',
        '大细胞癌',
        '神经内分泌癌',
        '肉瘤',
        '分化差的癌',
        '混合型癌'
      ]

      status.tumor_pathological_type = tumor_pathological[status.tumor_pathological_type]
    }
    dispatch({
      type: 'sample/fetchExpsampleList',
      payload: { ...status }
    })
    this.setState({ status })
  }

  handleMenuClick = ({ key }, record) => {
    const { dispatch } = this.props

    if (key === 'edit') {
      // 编辑操作
      this.setState({
        sample_record: record,
        sample_modal_visible: true
      })
    } else if (key === 'submit') {
      // 如果不是总中心切不是本中心就不能提交
      if (record.research_center_id !== this.research_center_id && this.research_center_id !== 1) {
        message.warning('用户不属于该中心，无法提交')
      }

      // 提交操作
      Modal.confirm({
        title: '请问是否确认提交到总中心？',
        okText: '确定',
        cancelText: '取消',
        onOk: () =>
          new Promise(resolve => {
            dispatch({
              type: 'sample/submitSample',
              payload: {
                sample_id: record.sample_id
              }
            }).then(resolve)
          })
      })
    } else if (key === 'delete') {
      // 删除操作
      Modal.confirm({
        title: '请问是否确认删除？',
        okText: '确定',
        cancelText: '取消',
        onOk: () =>
          new Promise(resolve => {
            dispatch({
              type: 'sample/deleteSample',
              payload: {
                sample_id: record.sample_id
              }
            }).then(() => {
              resolve()
              this.refreshList()
            })
          })
      })
    }
  }

  handleCreateSample = () => {
    this.setState({
      sample_record: { sample_id: null },
      sample_modal_visible: true
    })
  }

  handleSaveSample = values => {
    const { dispatch } = this.props

    dispatch({
      type: 'sample/createSample',
      payload: values
    }).then(() =>
      this.setState(
        {
          sample_modal_visible: false
        },
        this.refreshList
      )
    )
  }

  handleHideModal = () => {
    this.setState({ sample_modal_visible: false })
  }

  handleChangeSearchType = value => {
    this.setState({ search_type: value })
  }

  handleSearch = value => {
    if (value && value.trim()) {
      const { search_type } = this.state

      this.refreshList(search_type === 0 ? { name: value, IDcard: null } : { name: null, IDcard: value })
    }
  }

  resetList = () => {
    // 清空输入框
    this.searchInput.current.input.state.value = ''
    this.refreshList({ name: null, IDcard: null })
  }

  handleExported = sample_id => {
    const { dispatch } = this.props

    dispatch({
      type: 'sample/downloadSample',
      payload: { sample_id }
    })
  }

  columns = [
    {
      title: '研究中心',
      dataIndex: 'research_center_ids',
      align: 'center',
      width: 120,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '编号',
      dataIndex: 'patient_ids',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '姓名',
      dataIndex: 'patient_name',
      align: 'center',
      width: 80,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '身份证号',
      dataIndex: 'id_num',
      align: 'center',
      width: 130,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '组别',
      dataIndex: 'group_name',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: 'center',
      width: 50
    },
    {
      title: '年龄',
      dataIndex: 'age',
      align: 'center',
      width: 50
    },
    {
      title: '随访进度',
      dataIndex: 'interview_status',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '上一次随访时间',
      dataIndex: 'last_interview_time',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '预计下一次随访时间',
      dataIndex: 'next_interview_time',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '状态',
      dataIndex: 'is_submit',
      align: 'center',
      width: 60,
      render: is_submit =>
        is_submit === 1 ? (
          <Tooltip title="已提交的访视不可编辑">
            <span style={{ color: '#52c41a' }}>已提交</span>
          </Tooltip>
        ) : (
          <span style={{ color: '#faad14' }}>未提交</span>
        )
    },
    {
      title: '操作',
      align: 'center',
      width: 60,
      render: (_, record) => (
        <>
          <Dropdown
            overlay={
              <Menu onClick={e => this.handleMenuClick(e, record)}>
                <Menu.Item key="edit" disabled={record.is_submit === 1}>
                  编辑
                </Menu.Item>
                <Menu.Item key="submit" disabled={record.is_submit === 1}>
                  提交
                </Menu.Item>
                <Menu.Item key="delete" disabled={record.is_submit === 1}>
                  删除
                </Menu.Item>
              </Menu>
            }
          >
            <Button type="primary" size="small">
              <Link to={`/project/${record.project_id}/sample/${record.sample_id}/crf`}>
                详情
                <Icon type="down" />
              </Link>
            </Button>
          </Dropdown>
        </>
        // <Button
        //   style={{ marginLeft: '10px' }}
        //   type="primary"
        //   size="small"
        //   onClick={() => this.handleExported(record.sample_id)}
        // >
        //   导出
        // </Button>
      )
    }
  ]

  selectBefore = (
    <Select defaultValue={0} style={{ width: '100px' }} onChange={this.handleChangeSearchType}>
      <Option value={0}>姓名</Option>
      <Option value={1}>身份证号</Option>
    </Select>
  )

  render() {
    const { total, sample_info, sample_list, research_center_info, group_ids_info, loading } = this.props
    const { page, limit } = this.state.status
    const tableLoading = loading.effects['sample/fetchExpsampleList']
    const infoLoading = loading.effects['sample/fetchSampleInfo']
    const filterLoading =
      loading.effects['global/fetchResearchCenterInfo'] && loading.effects['global/fetchPatientGroup']

    const filterList = [
      {
        text: '患者组别：',
        render: (
          <CheckTags
            itemList={[{ id: -1, name: '全部' }, ...group_ids_info]}
            handleChange={id => this.refreshList({ group_id: id, page: 1 })}
          />
        )
      },
      {
        text: '肿瘤病理类型：',
        render: (
          <CheckTags
            itemList={[
              { id: -1, name: '全部' },
              { id: 0, name: '腺癌' },
              { id: 1, name: '鳞癌' },
              { id: 2, name: '小细胞肺癌' },
              { id: 3, name: '大细胞癌' },
              { id: 4, name: '神经内分泌癌' },
              { id: 5, name: '肉瘤' },
              { id: 6, name: '分化差的癌' },
              { id: 7, name: '混合型癌' }
            ]}
            handleChange={id => this.refreshList({ tumor_pathological_type: id, page: 1 })}
          />
        )
      },
      {
        text: '患者性别：',
        render: (
          <CheckTags
            itemList={[{ id: -1, name: '全部' }, { id: 0, name: '男' }, { id: 1, name: '女' }]}
            handleChange={id => this.refreshList({ sex: id, page: 1 })}
          />
        )
      }
    ]

    if (this.research_center_id === 1) {
      filterList.unshift({
        text: '研究中心：',
        render: (
          <CheckTags
            itemList={[{ id: -1, name: '全部' }, ...research_center_info]}
            handleChange={id => this.refreshList({ research_center_id: id, page: 1 })}
          />
        )
      })
    }

    return (
      <>
        <Row type="flex" align="middle">
          <Col>
            <Button type="primary" onClick={router.goBack}>
              <Icon type="left" />
              返回
            </Button>
          </Col>
          <Col>
            <Spin spinning={infoLoading}>
              <div className={styles.sample_info}>
                {sample_info.description}&nbsp;&nbsp;&nbsp; 编号：
                {sample_info.project_ids}&nbsp;&nbsp;&nbsp; 负责单位：
                {sample_info.research_center_ids}
              </div>
            </Spin>
          </Col>
        </Row>
        <Divider />
        <Content>
          <Spin spinning={filterLoading}>
            {filterList.map(item => (
              <Row className={styles.filterLine} key={item.text}>
                <Col span={2} className={styles.filterLineLeft}>
                  {item.text}
                </Col>
                <Col span={22}>{item.render}</Col>
              </Row>
            ))}
          </Spin>
        </Content>
        <Divider />
        <div className="page_body">
          <Row type="flex" align="middle" justify="space-between">
            <Col span={10} className={styles.project_search}>
              <Row type="flex" align="middle">
                <Col span={16}>
                  <Input.Search
                    ref={this.searchInput}
                    addonBefore={this.selectBefore}
                    placeholder="请输入搜索内容"
                    size="large"
                    onSearch={this.handleSearch}
                  />
                </Col>
                <Col offset={1}>
                  <Tooltip title="清空输入框">
                    <Button onClick={this.resetList} shape="circle" loading={tableLoading} icon="sync"></Button>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button type="primary" onClick={this.handleCreateSample}>
                <Icon type="plus" />
                添加样本
              </Button>
            </Col>
          </Row>
        </div>
        <Table
          loading={tableLoading}
          className={`${styles.sample_table} page_body`}
          rowKey={'sample_id'}
          size="small"
          bordered={true}
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={sample_list}
        />
        <Pagination
          pageSize={limit}
          style={{ marginTop: '15px', marginBottom: '30px' }}
          current={page}
          total={total}
          onChange={page => this.refreshList({ page })}
        />
        <SampleModal
          record={this.state.sample_record}
          visible={this.state.sample_modal_visible}
          handleSaveSample={this.handleSaveSample}
          onCancel={this.handleHideModal}
        />
      </>
    )
  }
}

function mapStateToProps(state) {
  const research_center_info = state.global.research_center_info.map(item => {
    return {
      id: item.research_center_id,
      name: item.research_center_ids
    }
  })

  return {
    total: state.sample.total,
    sample_list: state.sample.sample_list,
    sample_info: state.sample.sample_info,
    research_center_info,
    group_ids_info: state.global.group_ids_info,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(SampleList)
