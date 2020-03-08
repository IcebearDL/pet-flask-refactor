import React from 'react'
import PropTypes from 'prop-types'
import router from 'umi/router'
import { Button, Modal, ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import CookieUtil from '../utils/cookie'

import styles from './index.css'
import RayPlus from '../assets/Rayplus_white.png'

function PageHeader(props) {
  let title
  const projectReg = /^\/project\/?$/
  const sampleReg = /^\/project\/\d+\/sample\/?$/
  const detailReg = /^\/project\/\d+\/sample\/\d+\/crf\/?$/
  const { pathname } = props.location

  if (projectReg.test(pathname)) {
    title = '临床试验项目'
    document.title = '临床试验项目'
  } else if (sampleReg.test(pathname)) {
    title = '临床试验样本'
    document.title = '临床试验样本'
  } else if (detailReg.test(pathname)) {
    title = 'CRF详情'
    document.title = 'CRF详情'
  }

  const logout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        CookieUtil.unset('token')
        router.push('/login')
      }
    })
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
            <span className={styles.user_title}>
              您好，{window.localStorage.getItem('user_name')}医生
            </span>
            <Button type="default" size="small" onClick={logout}>
              退出登录
            </Button>
          </div>
        </div>
      </div>
      <ConfigProvider locale={zhCN}>{props.children}</ConfigProvider>
    </>
  )
}

PageHeader.propTypes = {
  location: PropTypes.object,
  children: PropTypes.element
}

export default PageHeader
