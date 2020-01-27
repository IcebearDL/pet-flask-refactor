import React from 'react'
import { connect } from 'dva'
import {
  Layout, Input, Select,
  Table, Button, Tooltip
} from "antd"
import Link from 'umi/link'
import styles from './style.css'
import { checkLogin } from '../../utils/util'

const { Content } = Layout
const { Option } = Select

class ProjectList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      select_type: ''
    }
  }

  componentDidMount() {
    if (!checkLogin()) return
    const { dispatch } = this.props
    dispatch({
      type: 'project/fetchProjectList',
      payload: {
        page: 1,
        limit: 10
      }
    })
  }

  handleSelectChange = value => {
    this.setState({ select_type: value })
  }

  handleSearch = value => {

  }

  render() {
    const tableLoading = this.props.loading.effects['project/fetchProjectList']
    const selectBefore = (
      <Select
        defaultValue="全部"
        style={{ width: '80px' }}
        onChange={this.handleSelectChange}
      >
        <Option value="全部">全部</Option>
        <Option value="编号">编号</Option>
        <Option value="组别">组别</Option>
        <Option value="单位">单位</Option>
        <Option value="描述">描述</Option>
      </Select>
    )

    const columns = [
      {
        title: '编号',
        dataIndex: 'project_ids',
        align: 'center',
        width: 100,
        ellipsis: true,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '研究名称',
        dataIndex: 'description',
        align: 'center',
        width: 150,
        render: text => (
          <Tooltip title={text}>
            <span>{text.length > 26 ? text.slice(0, 26) + '...' : text}</span>
          </Tooltip>
        )
      }, {
        title: '负责单位',
        dataIndex: 'research_center_ids',
        align: 'center',
        width: 110,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '负责人',
        dataIndex: 'principal',
        align: 'center',
        width: 60,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '电话',
        dataIndex: 'phone',
        align: 'center',
        width: 110
      }, {
        title: '研究方案',
        dataIndex: 'link',
        align: 'center',
        width: 80,
        render: text => <a href="/research_scheme">点击下载</a>
      }, {
        title: '当前进度',
        dataIndex: 'now',
        align: 'center',
        width: 50
      }, {
        title: '项目容量',
        dataIndex: 'total',
        align: 'center',
        width: 100
      }, {
        title: '状态',
        dataIndex: 'status',
        align: 'center',
        width: 100,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '备注',
        dataIndex: 'ps',
        align: 'center',
        width: 100,
        render: text => <Tooltip title={text}><span>{text}</span></Tooltip>
      }, {
        title: '操作',
        align: 'center',
        width: 60,
        render: (_, record) => (
          <Button type="primary" size="small">
            <Link to={`/project/${record.project_id}/sample`}>详情</Link>
          </Button>
        )
      }
    ]

    return (
      <Content className="body_content">
        <Input.Search
          className={styles.project_search}
          addonBefore={selectBefore}
          placeholder="请输入搜索内容"
          enterButton="搜索"
          size="large"
          onSearch={this.handleSearch}
        />
        <Table
          loading={tableLoading}
          className={styles.project_table}
          rowKey={'project_id'}
          size="small"
          bordered={true}
          pagination={false}
          scroll={{ x: true }}
          columns={columns}
          dataSource={this.props.project_list}
        />
      </Content>
    )
  }
}

function mapStateToProps(state) {
  return {
    project_list: state.project.project_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(ProjectList)