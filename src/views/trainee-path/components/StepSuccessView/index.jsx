import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Card, Typography, Button, Timeline, Space, Collapse } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import RenderIf from '@components/renderif/RenderIf'
const { Text, Paragraph, Title } = Typography
const { Panel } = Collapse

const SuccessView = ({
  selectedTrainee,
  selectedCourses,
  selectedTemplate,
  setCurrentStep,
  onResetState,
}) => {
  const handleCreateAnother = () => {
    onResetState()
    setCurrentStep(0)
  }

  const handleReturnToDashboard = () => {
    onResetState()
  }

  return (
    <Card className="step-card">
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: 72, color: '#52c41a', marginBottom: 24 }}>
          <CheckCircleOutlined />
        </div>
        <Title level={2}>Learning Path Assigned Successfully!</Title>
        <Paragraph style={{ fontSize: 18 }}>
          {selectedTrainee?.name} can now access their personalized learning
          path.
        </Paragraph>

        <Space size="large">
          <Button type="primary" onClick={handleCreateAnother}>
            Create Another Path
          </Button>
          <Button onClick={handleReturnToDashboard}>Return to Dashboard</Button>
        </Space>
      </div>
    </Card>
  )
}

export default memo(SuccessView)
