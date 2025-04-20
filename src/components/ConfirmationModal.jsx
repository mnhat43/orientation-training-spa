import React from 'react'
import { Modal, Typography } from 'antd'
import PropTypes from 'prop-types'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const ConfirmationModal = ({
  title,
  visible,
  onCancel,
  onConfirm,
  children,
  confirmLoading = false,
  okText = 'Yes',
  cancelText = 'No',
  okButtonProps = {},
  width = 420,
}) => {
  return (
    <Modal
      title={
        <Typography.Title level={4} style={{ margin: 0 }}>
          <ExclamationCircleOutlined
            style={{ color: '#faad14', marginRight: 8 }}
          />
          {title}
        </Typography.Title>
      }
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      confirmLoading={confirmLoading}
      okText={okText}
      cancelText={cancelText}
      okButtonProps={{ danger: true, ...okButtonProps }}
      width={width}
      centered
    >
      <Typography.Text>{children}</Typography.Text>
    </Modal>
  )
}

ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  children: PropTypes.node,
  confirmLoading: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  okButtonProps: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
}

export default ConfirmationModal
