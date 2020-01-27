import { connect } from 'dva'
import router from 'umi/router'
import { Button, Divider, Icon } from 'antd'

import styles from './index.css'
import RayPlus from '../assets/Rayplus_title.png'

function BasicLayout(props) {
  let title, ifBack = true
  const sampleReg = /^\/project\/\d+\/sample$/
  const detailReg = /^\/project\/\d+\/sample\/detail$/
  if (props.location.pathname === '/project') {
    title = '临床试验项目'
    ifBack = false
  } else if (sampleReg.test(props.location.pathname)) {
    title = '临床试验样本'
  } else if (detailReg.test(props.location.pathname)) {
    title = 'CRF详情'
  }

  const logout = () => {
    window.localStorage.clear()
    router.push('/login')
  }

  const goBack = () => {
    router.goBack()
  }

  return (
    <>
      <div>
        <div className={styles.navigator_bar}>
          <div>
            <img className={styles.login_img} src={RayPlus} alt="RayPlus" />
            <span className={styles.title}>{title}</span>
          </div>
          <div>
            <span className={styles.user_title}>
              您好，{window.localStorage.getItem('user_name')}医生
            </span>
            <Button type="primary" onClick={logout}>退出登录</Button>
          </div>
        </div>
      </div>
      <Divider style={{ marginTop: '15px', marginBottom: '15px' }} />
      <div style={{ display: ifBack ? 'block' : 'none' }} className={styles.goBack_button}>
        <Button type="primary" onClick={goBack}><Icon type="left" />返回</Button>
      </div>
      {props.children}
    </>
  )
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(BasicLayout)
