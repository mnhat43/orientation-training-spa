import React, { useState } from 'react';
import {
  Card, Typography, Row, Col, Progress, Badge, Tag, Statistic,
  Tabs, Button, Space, Rate, Modal, Form, Input, Empty, 
  Timeline, Tooltip, Collapse, Avatar
} from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined, 
  TrophyOutlined, FileTextOutlined, BookOutlined, CommentOutlined,
  StarOutlined, UserOutlined, RiseOutlined, EnvironmentOutlined,
  BarChartOutlined, TeamOutlined, SolutionOutlined, PlusOutlined
} from '@ant-design/icons';
import '../styles/training-progress-cards.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Panel } = Collapse;

const TrainingProgressCards = ({ employee, onReviewSubmit }) => {
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [courseToReview, setCourseToReview] = useState(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('all');

  const handleOpenReviewModal = (course) => {
    setCourseToReview(course);
    setReviewModalVisible(true);
  };

  const handleCloseModal = () => {
    setReviewModalVisible(false);
    setCourseToReview(null);
    form.resetFields();
  };

  const handleSubmitReview = () => {
    form.validateFields().then(values => {
      onReviewSubmit({
        courseId: courseToReview.id,
        rating: values.rating,
        comment: values.comment
      });
      handleCloseModal();
    });
  };

  const calculateOverallProgress = () => {
    const total = employee.coursesCompleted.length + 
                  employee.coursesInProgress.length + 
                  employee.upcomingCourses.length;
    
    const completed = employee.coursesCompleted.length;
    const inProgress = employee.coursesInProgress.reduce(
      (sum, course) => sum + (course.progress / 100), 0
    );
    
    return Math.round(((completed + inProgress) / total) * 100);
  };

  // Calculate average score for completed courses
  const averageScore = employee.coursesCompleted.length > 0 
    ? Math.round(
        employee.coursesCompleted.reduce((sum, course) => sum + course.score, 0) / 
        employee.coursesCompleted.length
      )
    : 0;

  const renderCourseStats = () => (
    <Row gutter={[16, 16]} className="course-stats">
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic 
            title="Courses Completed" 
            value={employee.coursesCompleted.length}
            prefix={<CheckCircleOutlined />}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic 
            title="In Progress" 
            value={employee.coursesInProgress.length}
            prefix={<ClockCircleOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card className="stat-card">
          <Statistic 
            title="Not Started" 
            value={employee.upcomingCourses.length}
            prefix={<CalendarOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
    </Row>
  );

  const renderProgressOverview = () => (
    <Card className="progress-overview-card">
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} md={12}>
          <div className="progress-chart">
            <Progress
              type="circle"
              percent={calculateOverallProgress()}
              format={percent => (
                <div className="progress-circle-content">
                  <div className="percent-value">{percent}%</div>
                  <div className="percent-label">Complete</div>
                </div>
              )}
              width={150}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="progress-metrics">
            <div className="metric-item">
              <Text strong>Average Score</Text>
              <div className="metric-value">
                <TrophyOutlined /> {averageScore}%
              </div>
            </div>
            <div className="metric-item">
              <Text strong>Next Due Course</Text>
              <div className="metric-value">
                <CalendarOutlined />
                {employee.coursesInProgress.length > 0 
                  ? ` ${employee.coursesInProgress[0].dueDate}` 
                  : ' None'}
              </div>
            </div>
            <div className="metric-item">
              <Text strong>Review Status</Text>
              <div className="metric-value">
                <Badge 
                  status={
                    employee.coursesCompleted.every(c => c.managerReview) 
                      ? "success" 
                      : "warning"
                  } 
                />
                {employee.coursesCompleted.every(c => c.managerReview) 
                  ? "All courses reviewed" 
                  : `${employee.coursesCompleted.filter(c => !c.managerReview).length} pending reviews`}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderCompletedCourseCard = (course) => (
    <Col xs={24} md={12} key={course.id}>
      <Card 
        className={`course-card completed ${course.managerReview ? 'reviewed' : 'not-reviewed'}`}
        actions={[
          <Tooltip title="View details">
            <Button type="text" icon={<FileTextOutlined />}>Details</Button>
          </Tooltip>,
          <Tooltip title="View certificate">
            <Button type="text" icon={<TrophyOutlined />}>Certificate</Button>
          </Tooltip>,
          !course.managerReview && (
            <Tooltip title="Add review">
              <Button 
                type="text" 
                icon={<CommentOutlined />} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenReviewModal(course);
                }}
              >
                Review
              </Button>
            </Tooltip>
          )
        ].filter(Boolean)}
      >
        <div className="course-header">
          <div className="course-title">
            <BookOutlined className="course-icon" />
            <Text strong>{course.title}</Text>
          </div>
          <Badge 
            count={`${course.score}%`} 
            style={{ backgroundColor: '#52c41a' }} 
          />
        </div>
        
        <div className="course-info">
          <div className="info-item">
            <CalendarOutlined /> Completed: {course.completedDate}
          </div>
          <div className="tag-container">
            <Tag color="success">COMPLETED</Tag>
          </div>
        </div>
        
        {course.managerReview ? (
          <div className="review-section">
            <div className="review-header">
              <Avatar size="small" icon={<UserOutlined />} />
              <Text type="secondary">
                Review by {course.managerReview.reviewer}
              </Text>
              <Rate 
                disabled 
                allowHalf 
                value={course.managerReview.rating} 
                style={{ fontSize: 12 }}
              />
            </div>
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
              "{course.managerReview.comment}"
            </Paragraph>
          </div>
        ) : (
          <div className="review-cta">
            <Button 
              type="dashed" 
              icon={<StarOutlined />}
              block
              onClick={(e) => {
                e.stopPropagation();
                handleOpenReviewModal(course);
              }}
            >
              Add Your Review
            </Button>
          </div>
        )}
      </Card>
    </Col>
  );

  const renderInProgressCourseCard = (course) => (
    <Col xs={24} md={12} key={course.id}>
      <Card 
        className="course-card in-progress"
        actions={[
          <Tooltip title="View details">
            <Button type="text" icon={<FileTextOutlined />}>Details</Button>
          </Tooltip>,
          <Tooltip title="Track progress">
            <Button type="text" icon={<BarChartOutlined />}>Track</Button>
          </Tooltip>
        ]}
      >
        <div className="course-header">
          <div className="course-title">
            <BookOutlined className="course-icon" />
            <Text strong>{course.title}</Text>
          </div>
        </div>
        
        <div className="course-info">
          <div className="info-item">
            <CalendarOutlined /> Due by: {course.dueDate}
          </div>
          <div className="tag-container">
            <Tag color="processing">IN PROGRESS</Tag>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-header">
            <Text>Progress: {course.progress}%</Text>
            <Text type="secondary">
              {100 - course.progress}% remaining
            </Text>
          </div>
          <Progress 
            percent={course.progress} 
            status="active" 
            strokeColor="#1890ff"
            showInfo={false}
          />
        </div>
      </Card>
    </Col>
  );

  const renderNotStartedCourseCard = (course) => (
    <Col xs={24} md={12} key={course.id}>
      <Card 
        className="course-card not-started"
        actions={[
          <Tooltip title="View details">
            <Button type="text" icon={<FileTextOutlined />}>Details</Button>
          </Tooltip>,
          <Tooltip title="View prerequisites">
            <Button type="text" icon={<SolutionOutlined />}>Prerequisites</Button>
          </Tooltip>
        ]}
      >
        <div className="course-header">
          <div className="course-title">
            <BookOutlined className="course-icon" />
            <Text strong>{course.title}</Text>
          </div>
        </div>
        
        <div className="course-info">
          <div className="info-item">
            <CalendarOutlined /> Starts: {course.startDate}
          </div>
          <div className="tag-container">
            <Tag color="default">NOT STARTED</Tag>
          </div>
        </div>
        
        <div className="upcoming-info">
          <Timeline>
            <Timeline.Item color="gray">
              <Text strong>Course Enrollment</Text>
              <div>Automatically enrolled</div>
            </Timeline.Item>
            <Timeline.Item color="blue">
              <Text strong>Start Date</Text>
              <div>{course.startDate}</div>
            </Timeline.Item>
          </Timeline>
        </div>
      </Card>
    </Col>
  );

  const renderCourseTimeline = () => (
    <Card className="course-timeline-card">
      <Collapse ghost>
        <Panel 
          header={
            <div>
              <RiseOutlined /> Learning Journey Timeline
            </div>
          } 
          key="1"
        >
          <Timeline mode="left">
            {[...employee.upcomingCourses].map(course => (
              <Timeline.Item 
                key={course.id}
                color="gray"
                label={course.startDate}
                dot={<CalendarOutlined />}
              >
                <Text strong>{course.title}</Text> will begin
              </Timeline.Item>
            ))}
            
            {[...employee.coursesInProgress].map(course => (
              <Timeline.Item 
                key={course.id}
                color="blue"
                label={course.dueDate}
                dot={<ClockCircleOutlined />}
              >
                <Text strong>{course.title}</Text> due 
                <Progress 
                  percent={course.progress} 
                  size="small" 
                  style={{ width: 100, marginLeft: 8 }}
                />
              </Timeline.Item>
            ))}
            
            {[...employee.coursesCompleted].reverse().map(course => (
              <Timeline.Item 
                key={course.id}
                color="green"
                label={course.completedDate}
                dot={<CheckCircleOutlined />}
              >
                <Text strong>{course.title}</Text> completed with <Tag color="green">{course.score}%</Tag>
              </Timeline.Item>
            ))}
          </Timeline>
        </Panel>
      </Collapse>
    </Card>
  );

  const renderReviewModal = () => (
    <Modal
      title="Review Course Performance"
      visible={reviewModalVisible}
      onCancel={handleCloseModal}
      footer={null}
      centered
      className="review-modal"
    >
      {courseToReview && (
        <>
          <div className="review-course-info">
            <Title level={4}>{courseToReview.title}</Title>
            <div className="course-meta">
              <div>
                <CheckCircleOutlined /> Completed on {courseToReview.completedDate}
              </div>
              <div>
                <TrophyOutlined /> Score: {courseToReview.score}%
              </div>
            </div>
          </div>
          
          <Form
            form={form}
            layout="vertical"
            initialValues={{ rating: 0, comment: '' }}
            onFinish={handleSubmitReview}
          >
            <Form.Item
              label="How would you rate this employee's performance in this course?"
              name="rating"
              rules={[{ required: true, message: 'Please provide a rating' }]}
            >
              <Rate allowHalf />
            </Form.Item>
            
            <Form.Item
              label="Provide detailed feedback about the employee's performance"
              name="comment"
              rules={[{ required: true, message: 'Please provide feedback comments' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="What did the employee do well? Where can they improve? How will this course help in their current role?"
              />
            </Form.Item>
            
            <Form.Item className="form-actions">
              <Button onClick={handleCloseModal} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit Review
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );

  const renderAllTab = () => (
    <>
      {renderProgressOverview()}
      {renderCourseStats()}
      {renderCourseTimeline()}
      
      <Title level={4} className="section-title">
        <CheckCircleOutlined /> Completed Courses
      </Title>
      <Row gutter={[16, 16]}>
        {employee.coursesCompleted.length > 0 ? (
          employee.coursesCompleted.map(renderCompletedCourseCard)
        ) : (
          <Col span={24}>
            <Empty description="No completed courses yet" />
          </Col>
        )}
      </Row>
      
      <Title level={4} className="section-title">
        <ClockCircleOutlined /> In Progress
      </Title>
      <Row gutter={[16, 16]}>
        {employee.coursesInProgress.length > 0 ? (
          employee.coursesInProgress.map(renderInProgressCourseCard)
        ) : (
          <Col span={24}>
            <Empty description="No courses in progress" />
          </Col>
        )}
      </Row>
      
      <Title level={4} className="section-title">
        <CalendarOutlined /> Not Started
      </Title>
      <Row gutter={[16, 16]}>
        {employee.upcomingCourses.length > 0 ? (
          employee.upcomingCourses.map(renderNotStartedCourseCard)
        ) : (
          <Col span={24}>
            <Empty description="No upcoming courses" />
          </Col>
        )}
      </Row>
    </>
  );

  return (
    <div className="training-progress-cards">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane 
          tab={<span><BookOutlined />All Courses</span>}
          key="all"
        >
          {renderAllTab()}
        </TabPane>
        <TabPane 
          tab={<span><CheckCircleOutlined />Completed</span>}
          key="completed"
        >
          <Row gutter={[16, 16]}>
            {employee.coursesCompleted.length > 0 ? (
              employee.coursesCompleted.map(renderCompletedCourseCard)
            ) : (
              <Col span={24}>
                <Empty description="No completed courses yet" />
              </Col>
            )}
          </Row>
        </TabPane>
        <TabPane 
          tab={<span><ClockCircleOutlined />In Progress</span>}
          key="inProgress"
        >
          <Row gutter={[16, 16]}>
            {employee.coursesInProgress.length > 0 ? (
              employee.coursesInProgress.map(renderInProgressCourseCard)
            ) : (
              <Col span={24}>
                <Empty description="No courses in progress" />
              </Col>
            )}
          </Row>
        </TabPane>
        <TabPane 
          tab={<span><CalendarOutlined />Not Started</span>}
          key="notStarted"
        >
          <Row gutter={[16, 16]}>
            {employee.upcomingCourses.length > 0 ? (
              employee.upcomingCourses.map(renderNotStartedCourseCard)
            ) : (
              <Col span={24}>
                <Empty description="No upcoming courses" />
              </Col>
            )}
          </Row>
        </TabPane>
      </Tabs>
      
      {renderReviewModal()}
    </div>
  );
};

export default TrainingProgressCards;
