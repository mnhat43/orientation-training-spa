import React from 'react'
import { Modal, Alert } from 'antd'

const ConfirmModal = ({
  visible,
  onOk,
  onCancel,
  answeredQuestions,
  totalQuestions,
  confirmTitle = 'Submit Quiz',
  confirmMessage,
  okText = 'Submit',
  cancelText = 'Go Back',
}) => {
  const message = confirmMessage || (
    <>
      You have answered <strong>{answeredQuestions}</strong> out of{' '}
      <strong>{totalQuestions}</strong> questions.
      <br />
      Are you sure you want to submit the quiz?
    </>
  )

  const showWarning = !confirmMessage && answeredQuestions < totalQuestions

  return (
    <Modal
      title={confirmTitle}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
      centered
    >
      <p>{message}</p>

      {showWarning && (
        <Alert
          message="Warning"
          description="You haven't answered all questions. Unanswered questions will be marked as incorrect."
          type="warning"
          showIcon
          style={{ marginTop: 16 }}
        />
      )}
    </Modal>
  )
}
export default ConfirmModal
