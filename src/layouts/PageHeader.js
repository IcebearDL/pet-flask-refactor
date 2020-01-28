import { connect } from 'dva'
import router from 'umi/router'
import { Button, Modal } from 'antd'

import styles from './index.css'
import RayPlus from '../assets/Rayplus_title.png'

function PageHeader(props) {
  let title
  const projectReg = /^\/project\/?$/
  const sampleReg = /^\/project\/\d+\/sample\/?$/
  const detailReg = /^\/project\/\d+\/sample\/\d+\/crf\/?$/
  const { pathname } = props.location
  if (projectReg.test(pathname)) {
    title = '临床试验项目'
  } else if (sampleReg.test(pathname)) {
    title = '临床试验样本'
  } else if (detailReg.test(pathname)) {
    title = 'CRF详情'
  }

  const logout = () => {
    Modal.confirm({
      title: '确认退出登录？',
      okText: '确认',
      cancelText: '取消',
      icon: 'warning',
      onOk: () => {
        window.localStorage.clear()
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
            <Button type="default" size="small" onClick={logout}>退出登录</Button>
          </div>
        </div>
      </div>
      {props.children}
    </>
  )
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(PageHeader)
