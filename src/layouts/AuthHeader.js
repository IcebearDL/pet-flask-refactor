import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import router from 'umi/router'
import { Button, Modal, ConfigProvider, Popover } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

import CookieUtil from '@/utils/cookie'
import RayPlus from '@/assets/Rayplus_title.png'
import styles from './index.css'

class PageHeader extends React.Component {
  state = {
    visible: false
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  handleLogout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 清空cookie和localStorage
        CookieUtil.unset('auth_token')
        window.localStorage.removeItem('auth_userInfo')
        router.push('/login')
      }
    })
    this.setState({ visible: false })
  }

  user_content = (
    <div className={styles.user_button}>
      <Button type="danger" size="small" icon="poweroff" onClick={this.handleLogout}>
        退出登录
      </Button>
    </div>
  )

  handleOpenPopover = () => {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { visible } = this.state
    const { location, children } = this.props
    const { pathname } = location

    const auth_userInfo = JSON.parse(window.localStorage.getItem('auth_userInfo'))
    const { name } = auth_userInfo

    let title

    // 动态确定当前页面标题
    if (/auth\/system/.test(pathname)) {
      title = '权限管理系统'
      document.title = '临床试验项目'
    } else if (/auth\/system/.test(pathname)) {
      title = '临床试验样本'
      document.title = '临床试验样本'
    } else if (/auth\/system/.test(pathname)) {
      title = 'CRF详情'
      document.title = 'CRF详情'
    }

    return (
      <>
        <div className={styles.navigator_content}>
          <div className={styles.navigator_bar}>
            <div>
              <img className={styles.login_img} src={RayPlus} alt="RayPlus" />
              <span className={styles.title}>{title}</span>
            </div>
            <div>
              <span className={styles.user_title}>您好，{name}</span>
              <Popover placement="bottom" content={this.user_content} visible={visible}>
                <Button shape="circle" icon="user" onClick={this.handleOpenPopover} />
              </Popover>
            </div>
          </div>
        </div>
        <ConfigProvider locale={zhCN}>
          <div className="body_content">{children}</div>
        </ConfigProvider>
      </>
    )
  }
}

export default connect(state => ({ auth_userInfo: state.global.auth_userInfo }))(PageHeader)
