import React from 'react'
import { connect } from 'dva'
import { PageHeader, Layout } from "antd"
import styles from '../style.css'

class CycleRecord extends React.Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps)(CycleRecord)