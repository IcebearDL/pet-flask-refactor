import React from 'react'
import { connect } from 'dva'
import { PageHeader, Layout } from "antd"
import styles from './style.css'

const Content = Layout.Content

class ProjectList extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        //导航设置
        const routes = [
            {
                path: "template",
                breadcrumbName: "页面模板"
            }
        ]
        //render
        return (
            <div>
                <PageHeader title="项目列表页" breadcrumb={{ routes }}></PageHeader>
                <Content>
                    这是页面模板
                </Content>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps)(ProjectList)