import React from 'react'
import { connect } from 'dva'
import PropTypes from 'prop-types'
import { Modal, Row, Form, DatePicker, Button, Radio, Input, Table } from 'antd'
import moment from 'moment'
import { getSampleId } from '@/utils/location'
import styles from '../../style.css'

class PhotoEvaluate extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      record: {},
      visible: false,
      method: ''
    }
  }

  static propTypes = {
    crf_first_diagnose: PropTypes.object.isRequired,
    cycle_number: PropTypes.number.isRequired,
    form: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    loading: PropTypes.object.isRequired
  }

  componentDidMount() {
    const { dispatch, cycle_number } = this.props
    const sample_id = getSampleId()

    dispatch({
      type: 'crf_first_diagnose/fetchPhotoEvaluateTable',
      payload: { sample_id, cycle_number }
    })
  }

  handleDelete = evaluate_id => {
    Modal.confirm({
      title: '请问是否确认删除？',
      okText: '确定',
      cancelText: '取消',
      onOk: () =>
        new Promise(resolve => {
          const { dispatch, cycle_number } = this.props
          const sample_id = getSampleId()

          dispatch({
            type: 'crf_first_diagnose/deletePhotoEvaluateTable',
            payload: { sample_id, cycle_number, evaluate_id }
          }).then(() => {
            resolve()
            dispatch({
              type: 'crf_first_diagnose/fetchPhotoEvaluateTable',
              payload: { sample_id, cycle_number }
            })
          })
        })
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dispatch, cycle_number } = this.props
        const { record } = this.state
        const sample_id = getSampleId()

        // 重构时间和其他空项
        if (values.time) values.time = values.time.format('YYYY-MM-DD')
        for (const type of ['method', 'method_other', 'time']) {
          if (!values[type]) values[type] = ''
        }
        if (!values.tumor_long) values.tumor_long = null
        if (!values.tumor_short) values.tumor_short = null

        values.evaluate_id = record.evaluate_id
        dispatch({
          type: 'crf_first_diagnose/modifyPhotoEvaluateTable',
          payload: { sample_id, cycle_number, body: values }
        }).then(() => {
          this.setState({ visible: false })
          dispatch({
            type: 'crf_first_diagnose/fetchPhotoEvaluateTable',
            payload: { sample_id, cycle_number }
          })
        })
      }
    })
  }

  handleEditModel = record => {
    this.setState({ record, visible: true })
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  handleStateChange = (type, { target: { value } }) => {
    this.setState({ [type]: value })
  }

  render() {
    const { photo_evaluate_table } = this.props.crf_first_diagnose
    const tableLoading = this.props.loading.effects[
      'crf_first_diagnose/fetchPhotoEvaluateTable'
    ]
    const submitLoading = this.props.loading.effects[
      'crf_first_diagnose/modifyPhotoEvaluateTable'
    ]
    const { getFieldDecorator } = this.props.form
    const { record, visible, method } = this.state

    const columns = [
      {
        title: '部位',
        dataIndex: 'part',
        align: 'center'
      },
      {
        title: '方法',
        dataIndex: 'method',
        align: 'center'
      },
      {
        title: '肿瘤长径(cm)',
        dataIndex: 'tumor_long',
        align: 'center'
      },
      {
        title: '肿瘤短径(cm)',
        dataIndex: 'tumor_short',
        align: 'center'
      },
      {
        title: '时间',
        dataIndex: 'time',
        align: 'center'
      },
      {
        title: '操作',
        align: 'center',
        render: (_, record) => (
          <>
            <Button type="primary" size="small">
              上传
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="primary"
              size="small"
              onClick={() => this.handleEditModel(record)}
            >
              编辑
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="danger"
              size="small"
              onClick={() => this.handleDelete(record.evaluate_id)}
            >
              删除
            </Button>
          </>
        )
      }
    ]

    return (
      <>
        <Button
          type="primary"
          onClick={() => this.handleEditModel({ evaluate_id: '' })}
        >
          添加
        </Button>
        <Table
          loading={tableLoading}
          className={styles.patient_report_table}
          rowKey="evaluate_id"
          size="small"
          bordered
          pagination={false}
          scroll={{ x: true }}
          columns={columns}
          dataSource={photo_evaluate_table}
        />
        <Modal
          title="编辑影像学评估"
          visible={visible}
          okText="保存"
          destroyOnClose
          onCancel={this.handleCancel}
          centered
          footer={null}
        >
          <Form
            className="page_body"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 17, offset: 1 }}
            onSubmit={this.handleSubmit}
          >
            <Form.Item label="部位">
              {getFieldDecorator('part', {
                initialValue: record.part
              })(<Input style={{ width: '250px' }} placeholder="请输入部位" />)}
            </Form.Item>
            <Form.Item label="方法">
              {getFieldDecorator('method', {
                initialValue: record.method
              })(
                <Radio.Group
                  onChange={e => this.handleStateChange('method', e)}
                >
                  <Radio value="CT">CT</Radio>
                  <Radio value="MRI">MRI</Radio>
                  <Radio value="超声">超声</Radio>
                  <Radio value="X线平片">X线平片</Radio>
                  <Radio value="PET-CT">PET-CT</Radio>
                  <Radio value="其他">
                    数量(个突变/Mb)
                    {method === '其他' ||
                    (method === '' && record.method === '其他') ? (
                      <div style={{ display: 'inline-block' }}>
                        {getFieldDecorator('method_other', {
                          initialValue: record.method_other
                        })(
                          <Input
                            style={{ width: 200, marginLeft: 15 }}
                            placeholder="请输入其他方法"
                          />
                        )}
                      </div>
                    ) : null}
                  </Radio>
                </Radio.Group>
              )}
            </Form.Item>
            <Form.Item label="肿瘤长径(cm)">
              {getFieldDecorator('tumor_long', {
                initialValue: record.tumor_long
              })(
                <Input
                  style={{ width: '250px' }}
                  type="number"
                  placeholder="请输入肿瘤长径(cm)"
                />
              )}
            </Form.Item>
            <Form.Item label="肿瘤短径(cm)">
              {getFieldDecorator('tumor_short', {
                initialValue: record.tumor_short
              })(
                <Input
                  style={{ width: '250px' }}
                  type="number"
                  placeholder="请输入肿瘤短径(cm)"
                />
              )}
            </Form.Item>
            <Form.Item label="时间">
              {getFieldDecorator('time', {
                initialValue: record.time
                  ? moment(record.time, 'YYYY-MM-DD')
                  : null
              })(<DatePicker format="YYYY-MM-DD" />)}
            </Form.Item>
            <Row type="flex" justify="center">
              <Button htmlType="submit" type="primary" loading={submitLoading}>
                保存
              </Button>
              <Button style={{ marginLeft: 20 }} onClick={this.handleCancel}>
                取消
              </Button>
            </Row>
          </Form>
        </Modal>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    crf_first_diagnose: state.crf_first_diagnose,
    loading: state.loading
  }
}

export default connect(mapStateToProps)(Form.create()(PhotoEvaluate))
