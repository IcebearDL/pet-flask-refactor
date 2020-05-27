import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Button, Result, Spin } from 'antd'

import { getSampleId } from '@/utils/location'
import { post_prefix } from '@/utils/request'
import styles from '../../style.css'

// 项目总结签名
class SummarySign extends React.Component {
  static propTypes = {
    summary_sign: PropTypes.object.isRequired,
    research_center_info: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'global/fetchResearchCenterInfo'
    })
    dispatch({
      type: 'crfBase/fetchSummarySignature',
      payload: { sample_id }
    })
  }

  handleSign = () => {
    const { dispatch } = this.props
    const sample_id = getSampleId()

    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    const { user_id } = userInfo

    // 清除签名保证切换访视之后显示正确
    dispatch({
      type: 'crfBase/clearSignature'
    })
    dispatch({
      type: 'crfBase/postSummarySignature',
      payload: { sample_id, user_id }
    }).then(() =>
      dispatch({
        type: 'crfBase/fetchSummarySignature',
        payload: { sample_id }
      })
    )
  }

  render() {
    const { summary_sign, research_center_info } = this.props

    const user_signature = window.localStorage.getItem('user_signature')
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    const { user_name, research_center_name } = userInfo || {}

    const submitLoading = this.props.loading.effects['crfBase/postSummarySignature']

    const spinning = this.props.loading.effects['crfBase/fetchSummarySignature']

    let other_research_center_name = ''

    for (const item of research_center_info) {
      if (item.id === summary_sign.research_center_id) {
        other_research_center_name = item.name
        break
      }
    }

    return (
      <Spin spinning={spinning}>
        {summary_sign.file_path ? (
          <Result
            status="success"
            title="项目总结已签名！"
            subTitle={`签名账户名：${summary_sign.user_name}，所属中心：${other_research_center_name}。`}
            extra={
              <img
                className={styles.sign_img}
                src={`${post_prefix}/static/tempFiles${summary_sign.file_path.substring(1)}`}
                alt="用户签名"
              ></img>
            }
          />
        ) : (
          <Result
            status="info"
            title="使用当前账户对项目总结签名"
            subTitle={`当前账户：${user_name}，所属中心：${research_center_name}。查看签名请点击右上角用户按钮。`}
            extra={
              user_signature ? (
                <Button loading={submitLoading} type="primary" onClick={this.handleSign}>
                  确认签名
                </Button>
              ) : (
                <span style={{ color: '#faad14' }}>该账户未上传签名，请先点击右上角用户按钮上传签名</span>
              )
            }
          />
        )}
      </Spin>
    )
  }
}

function mapStateToProps(state) {
  return {
    summary_sign: state.crfBase.summary_sign,
    research_center_info: state.global.research_center_info,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(SummarySign)
