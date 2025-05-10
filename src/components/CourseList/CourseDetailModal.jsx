import React from 'react'
import {
  Modal,
  Button,
  Typography,
  Tag,
  Collapse,
  List,
  Space,
  Divider,
  Progress,
  Tooltip,
} from 'antd'
import {
  ClockCircleOutlined,
  FileOutlined,
  VideoCameraOutlined,
  UnorderedListOutlined,
  NumberOutlined,
  CheckCircleOutlined,
  PlayCircleOutlined,
  FilePdfOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { formatTime } from '@helpers/common'
import { CATEGORIES, CATEGORY_COLORS } from '@constants/categories'
import './CourseDetailModal.scss'

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

const CourseDetailModal = ({ visible, course, onClose }) => {
  if (!course) return null

  const getItemTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideoCameraOutlined style={{ color: '#1890ff' }} />
      case 'pdf':
        return <FilePdfOutlined style={{ color: '#f5222d' }} />
      case 'document':
        return <FileTextOutlined style={{ color: '#52c41a' }} />
      case 'file':
      default:
        return <FileOutlined style={{ color: '#52c41a' }} />
    }
  }

  const totalModules = course.modules?.length || 0
  const totalItems =
    course.modules?.reduce(
      (count, module) => count + (module.module_items?.length || 0),
      0,
    ) || 0

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      className="course-detail-modal"
      maskStyle={{ backdropFilter: 'blur(2px)' }}
      destroyOnClose
    >
      <div className="course-detail-content">
        <div className="course-header">
          <Title level={4} className="course-title">
            {' '}
            {course.title}
          </Title>

          <Space size="small" className="course-meta-info">
            {' '}
            <Tag
              color={CATEGORY_COLORS[course.category]}
              className="category-tag"
            >
              {CATEGORIES[course.category]}
            </Tag>
            <span className="duration-info">
              <ClockCircleOutlined className="meta-icon" />{' '}
              {formatTime(course.duration)}
            </span>
            {totalModules > 0 && (
              <span className="modules-info">
                <UnorderedListOutlined className="meta-icon" /> {totalModules}{' '}
                {totalModules === 1 ? 'Module' : 'Modules'}
              </span>
            )}
            {totalItems > 0 && (
              <span className="items-info">
                <NumberOutlined className="meta-icon" /> {totalItems}{' '}
                {totalItems === 1 ? 'Item' : 'Items'}
              </span>
            )}
          </Space>
        </div>

        {course.description && (
          <div className="course-description">
            <Divider orientation="left" orientationMargin="0" plain>
              {' '}
              <span className="divider-title">Description</span>
            </Divider>
            <Paragraph className="description-text">
              {course.description}
            </Paragraph>
          </div>
        )}

        <div className="course-modules-container">
          <Divider orientation="left" orientationMargin="0" plain>
            {' '}
            <span className="divider-title">Course Content</span>
          </Divider>
          <div className="course-modules">
            <Collapse
              defaultActiveKey={['0']}
              className="modules-collapse"
              expandIconPosition="end"
              bordered={false}
            >
              {course.modules?.map((module, moduleIndex) => (
                <Panel
                  key={moduleIndex.toString()}
                  header={
                    <Space className="module-header">
                      <Text strong className="module-title">
                        {module.title}
                      </Text>
                      <Text type="secondary" className="module-meta">
                        ({module.module_items?.length || 0} items ·{' '}
                        {formatTime(module.duration)})
                      </Text>
                    </Space>
                  }
                  className="module-panel"
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={module.module_items || []}
                    renderItem={(item, itemIndex) => (
                      <List.Item className="module-item">
                        <List.Item.Meta
                          avatar={getItemTypeIcon(item.item_type)}
                          title={
                            <div className="item-title">
                              <span className="item-name">
                                {item.position}. {item.title}
                              </span>
                              <Tooltip title="Duration">
                                <span className="item-duration">
                                  <ClockCircleOutlined
                                    style={{ marginRight: 4 }}
                                  />
                                  {formatTime(item.duration)}
                                </span>
                              </Tooltip>
                            </div>
                          }
                          description={
                            <div>
                              <div className="item-meta">
                                <Tag
                                  size="small"
                                  color={
                                    item.item_type === 'video'
                                      ? 'blue'
                                      : item.item_type === 'pdf'
                                        ? 'red'
                                        : 'green'
                                  }
                                  className="item-type-tag"
                                  icon={
                                    item.item_type === 'video' ? (
                                      <PlayCircleOutlined className="item-type-icon" />
                                    ) : null
                                  }
                                >
                                  {item.item_type}
                                </Tag>

                                {item.completed && (
                                  <span className="item-status">
                                    <CheckCircleOutlined
                                      style={{ color: '#52c41a' }}
                                    />{' '}
                                    Completed
                                  </span>
                                )}
                              </div>

                              {item.item_type === 'video' &&
                                item.progress > 0 && (
                                  <Progress
                                    percent={item.progress}
                                    size="small"
                                    showInfo={false}
                                    className="item-progress"
                                  />
                                )}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Panel>
              ))}
            </Collapse>
          </div>
        </div>

        <div className="modal-footer">
          <Button type="primary" onClick={onClose} size="middle">
            {' '}
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CourseDetailModal
