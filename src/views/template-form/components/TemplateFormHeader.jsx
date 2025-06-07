import React from 'react'
import { Button, Typography, Tooltip, Space } from 'antd'
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import './TemplateFormHeader.scss'

const { Title } = Typography

const TemplateFormHeader = ({ isEditing, loading, navigate, handleSubmit }) => {
  return (
    <header className="form-header">
      <div className="form-header-container">
        <div className="form-header-left">
          <Tooltip title="Back to Templates">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/templates')}
              className="back-btn"
            />
          </Tooltip>

          <Title className="page-title">
            {isEditing ? 'Edit Template' : 'Create Template'}
          </Title>
        </div>

        <div className="form-header-right">
          <Space>
            <Button
              onClick={() => navigate('/templates')}
              className="cancel-btn"
            >
              Cancel
            </Button>

            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={loading}
              onClick={handleSubmit}
              className="save-btn"
            >
              {isEditing ? 'Save' : 'Create'}
            </Button>
          </Space>
        </div>
      </div>
    </header>
  )
}

export default TemplateFormHeader
