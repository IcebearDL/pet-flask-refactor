import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Icon, Menu } from 'antd'

import AuthSystem from './components/System'
import AuthUser from './components/User'
import AuthRole from './components/Role'
import AuthPermission from './components/Permission'
import styles from './style.css'

class System extends React.Component {
  state = {
    selectedKeys: ['system']
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  handleMenuClick = ({ keyPath }) => {
    this.setState({ selectedKeys: keyPath })
  }

  render() {
    const { selectedKeys } = this.state

    let crf_body

    if (selectedKeys[0] === 'system') {
      crf_body = <AuthSystem />
    } else if (selectedKeys[0] === 'user') {
      crf_body = <AuthUser />
    } else if (selectedKeys[0] === 'role') {
      crf_body = <AuthRole />
    } else if (selectedKeys[0] === 'permission') {
      crf_body = <AuthPermission />
    }

    return (
      <div className={styles.auth_content}>
        <div className={styles.auth_aside}>
          <Menu
            mode="inline"
            className={styles.auth_menu}
            selectedKeys={selectedKeys}
            defaultSelectedKeys={['system']}
            onClick={this.handleMenuClick}
          >
            <Menu.Item key="system">
              <span>
                <Icon type="database" />
                系统管理
              </span>
            </Menu.Item>
            <Menu.Item key="permission">
              <span>
                <Icon type="audit" />
                权限管理
              </span>
            </Menu.Item>
            <Menu.Item key="role">
              <span>
                <Icon type="tags" />
                角色管理
              </span>
            </Menu.Item>
            <Menu.Item key="user">
              <span>
                <Icon type="team" />
                用户列表
              </span>
            </Menu.Item>
          </Menu>
        </div>
        <div className={styles.auth_body}>
          <div className="page_body">{crf_body}</div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    system_list: state.system.system_list,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(System)
