import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Layout, Form, Icon, Input, Button, message } from 'antd'
import router from 'umi/router'
import CookieUtil from '@/utils/cookie'
import RayPlus from '@/assets/rayplus.png'
import styles from './style.css'

const Content = Layout.Content

class Login extends React.Component {
  state = {
    current: 'user'
  }

  formRef = React.createRef()

  componentDidMount() {
    if (CookieUtil.get('token')) {
      router.push('/project')
    }
    if (CookieUtil.get('auth_token')) {
      router.push('/auth')
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

        // 判断选择的系统进行登陆
        const { current } = this.state

        if (current === 'user') {
          dispatch({
            type: 'login/login',
            payload: { ...values }
          }).then(ret => {
            if (ret) {
              Promise.all([
                dispatch({
                  type: 'global/fetchUserInfo'
                }),
                dispatch({
                  type: 'global/fetchSignature'
                })
              ]).then(() => {
                message.success('登陆成功！')
                router.push('/project')
              })
            }
          })
        } else if (current === 'admin') {
          // 权限登陆表单name转化
          const _values = {}

          _values.account = values.user_account
          _values.password = values.user_password

          dispatch({
            type: 'login/authorityLogin',
            payload: { ..._values }
          }).then(ret => {
            if (ret) {
              dispatch({
                type: 'global/fetchAuthInfo'
              }).then(() => {
                message.success('权限系统登陆成功！')
                router.push('/auth')
              })
            }
          })
        }
      }
    })
  }

  handleChangeLogin = key => {
    const { setFieldsValue } = this.props.form

    setFieldsValue({
      user_account: '',
      user_password: ''
    })
    this.setState({ current: key })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { current } = this.state
    const { effects } = this.props.loading

    let submitLoading

    if (current === 'user') {
      submitLoading = effects['login/login'] || effects['global/fetchUserInfo'] || effects['global/fetchSignature']
    } else if (current === 'admin') {
      submitLoading = effects['login/authorityLogin'] || effects['global/fetchAuthInfo']
    }

    return (
      <div className={styles.login_bg}>
        <div className={styles.switchButton}>
          {current === 'user' ? (
            <Button type="link" onClick={() => this.handleChangeLogin('admin')}>
              管理员登陆
              <Icon type="caret-right" />
            </Button>
          ) : (
            <Button type="link" onClick={() => this.handleChangeLogin('user')}>
              普通用户登陆
              <Icon type="caret-right" />
            </Button>
          )}
        </div>
        <Content className={styles.bodyContent}>
          <div className={styles.form_title}>
            <img className={styles.login_img} src={RayPlus} alt="RayPlus" />
          </div>
          <Form onSubmit={this.handleSubmit} className={styles.login_form} ref={this.formRef}>
            <Form.Item>
              {getFieldDecorator('user_account', {
                rules: [{ required: true, message: current === 'user' ? '请输入用户名' : '请输入管理员账户' }]
              })(
                <Input
                  size="large"
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder={current === 'user' ? '用户名' : '管理员账户'}
                />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('user_password', {
                rules: [{ required: true, message: '请输入密码!' }]
              })(
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
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
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(Login))
