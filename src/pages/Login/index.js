import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Layout, Form, Icon, Input, Button } from 'antd'
import router from 'umi/router'
import CookieUtil from '@/utils/cookie'
import RayPlus from '@/assets/Rayplus_title.png'
import styles from './style.css'

const Content = Layout.Content

class Login extends React.Component {
  componentDidMount() {
    if (CookieUtil.get('token')) {
      router.push('/project')
    }
  }

  static propTypes = {
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch } = this.props

        dispatch({
          type: 'login/login',
          payload: { ...values }
        }).then(() =>
          dispatch({
            type: 'global/fetchUserInfo'
          })
        )
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const submitLoading = this.props.loading.effects['login/login']

    return (
      <>
        <img className={styles.login_img} src={RayPlus} alt="RayPlus" />
        <Content className={styles.bodyContent}>
          <div className={styles.form_title}>
            <span>临床试验管理系统</span>
          </div>
          <Form onSubmit={this.handleSubmit} className={styles.login_form}>
            <Form.Item>
              {getFieldDecorator('user_account', {
                rules: [{ required: true, message: '请输入用户名!' }]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder="用户名"
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('user_password', {
                rules: [{ required: true, message: '请输入密码!' }]
              })(
                <Input
                  size="large"
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  type="password"
                  placeholder="密码"
                />
              )}
            </Form.Item>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              loading={submitLoading}
              className={styles.login_form_button}
            >
              登录
            </Button>
          </Form>
        </Content>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(Login))
