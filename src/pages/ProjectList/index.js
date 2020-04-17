import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Layout, Table, Button, Tooltip } from 'antd'
import Link from 'umi/link'
import styles from './style.css'
import { checkLogin } from '@/utils/util'

const { Content } = Layout

class ProjectList extends React.Component {
  static propTypes = {
    project_list: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    if (!checkLogin()) return
    const { dispatch } = this.props

    dispatch({
      type: 'project/fetchProjectList',
      payload: {}
    })
  }

  columns = [
    {
      title: '编号',
      dataIndex: 'project_ids',
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
      title: '研究名称',
      dataIndex: 'description',
      align: 'center',
      width: 150,
      render: text => (
        <Tooltip title={text}>
          <span>{text.length > 26 ? `${text.slice(0, 26)}...` : text}</span>
        </Tooltip>
      )
    },
    {
      title: '负责单位',
      dataIndex: 'research_center_ids',
      align: 'center',
      width: 110,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      align: 'center',
      width: 60,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '电话',
      dataIndex: 'phone',
      align: 'center',
      width: 110
    },
    {
      title: '研究方案',
      dataIndex: 'link',
      align: 'center',
      width: 80,
      render: () => <a href="/research_scheme">点击下载</a>
    },
    {
      title: '当前进度',
      dataIndex: 'now',
      align: 'center',
      width: 50
    },
    {
      title: '项目容量',
      dataIndex: 'total',
      align: 'center',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
      title: '备注',
      dataIndex: 'ps',
      align: 'center',
      width: 100,
      render: text => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      )
    },
    {
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

  render() {
    const { project_list } = this.props
    const tableLoading = this.props.loading.effects['project/fetchProjectList']

    return (
      <Content className="body_content">
        <Table
          loading={tableLoading}
          className={`${styles.project_table} page_body`}
          rowKey="project_id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={this.columns}
          dataSource={project_list}
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
