import React, { useState } from 'react';
import {
  Typography, List, Badge, Tag, Progress, Divider,
  Empty, Rate, Alert, Button, Input, Space
} from 'antd';
import {
  CheckCircleOutlined, ClockCircleOutlined, ScheduleOutlined
} from '@ant-design/icons';
import '../styles/training-progress.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const TrainingProgress = ({ employee, onReviewSubmit }) => {
  const [reviewForm, setReviewForm] = useState({
    courseId: null,
    rating: 0,
    comment: ''
  });

  const handleStartReview = (courseId) => {
    setReviewForm({
      courseId,
      rating: 0,
      comment: ''
    });
  };

  const handleReviewChange = (field, value) => {
    setReviewForm({
      ...reviewForm,
      [field]: value
    });
  };

  const handleSubmitReview = () => {
    onReviewSubmit(reviewForm);
    setReviewForm({
      courseId: null,
      rating: 0,
      comment: ''
    });
  };

  return (
    <div className="training-progress-container">
      <div className="training-progress-stats">
        <Space size="large" className="stat-row">
          <div className="stat-item">
            <Badge 
              count={employee.coursesCompleted.length} 
              showZero 
              color="#52c41a"
            />
            <span className="stat-label">
              <CheckCircleOutlined /> Completed
            </span>
          </div>
          <div className="stat-item">
            <Badge 
              count={employee.coursesInProgress.length} 
              showZero 
              color="#1890ff"
            />
            <span className="stat-label">
              <ClockCircleOutlined /> In Progress
            </span>
          </div>
          <div className="stat-item">
            <Badge 
              count={employee.upcomingCourses.length} 
              showZero 
              color="#faad14"
            />
            <span className="stat-label">
              <ScheduleOutlined /> Not Started
            </span>
          </div>
        </Space>
      </div>

      <Divider />

      <Title level={4}>Completed Courses</Title>
      <List
        itemLayout="vertical"
        dataSource={employee.coursesCompleted}
        renderItem={(course) => (
          <List.Item
            key={course.id}
            className="course-item"
            extra={
              <div className="course-score">
                <Badge
                  count={`${course.score}%`}
                  style={{ backgroundColor: '#52c41a' }}
                />
              </div>
            }
          >
            <List.Item.Meta
              title={<span>{course.title}</span>}
              description={
                <Space direction="vertical" size={0}>
                  <Text>Completed on {course.completedDate}</Text>
                  <Tag color="green">COMPLETED</Tag>
                </Space>
              }
            />
            <div className="course-review-section">
              {course.managerReview ? (
                <div className="review-content">
                  <div className="review-header">
                    <div>
                      <Rate
                        disabled
                        allowHalf
                        value={course.managerReview.rating}
                      />
                      <Text type="secondary">
                        {' '}
                        Reviewed by {course.managerReview.reviewer} on{' '}
                        {course.managerReview.date}
                      </Text>
                    </div>
                  </div>
                  <Paragraph>{course.managerReview.comment}</Paragraph>
                </div>
              ) : (
                <div className="no-review">
                  <Alert
                    message="No manager review yet"
                    description="Provide feedback to confirm this employee's training results"
                    type="info"
                    showIcon
                    action={
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => handleStartReview(course.id)}
                      >
                        Add Review
                      </Button>
                    }
                  />
                  {reviewForm.courseId === course.id && (
                    <div className="review-form">
                      <Divider orientation="left">Your Review</Divider>
                      <div className="rating-container">
                        <Text>Rating: </Text>
                        <Rate
                          allowHalf
                          value={reviewForm.rating}
                          onChange={(value) =>
                            handleReviewChange('rating', value)
                          }
                        />
                      </div>
                      <TextArea
                        rows={4}
                        placeholder="Write your feedback about the employee's performance in this course..."
                        value={reviewForm.comment}
                        onChange={(e) =>
                          handleReviewChange('comment', e.target.value)
                        }
                        className="review-textarea"
                      />
                      <div className="review-actions">
                        <Button
                          onClick={() =>
                            setReviewForm({
                              courseId: null,
                              rating: 0,
                              comment: ''
                            })
                          }
                        >
                          Cancel
                        </Button>
                        <Button
                          type="primary"
                          onClick={handleSubmitReview}
                          disabled={
                            !reviewForm.rating || !reviewForm.comment.trim()
                          }
                        >
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </List.Item>
        )}
        locale={{
          emptyText: <Empty description="No completed courses yet" />
        }}
      />

      <Divider />

      <Title level={4}>In Progress</Title>
      <List
        itemLayout="horizontal"
        dataSource={employee.coursesInProgress}
        renderItem={(course) => (
          <List.Item className="in-progress-item">
            <List.Item.Meta
              title={course.title}
              description={
                <div>
                  <Progress percent={course.progress} size="small" />
                  <Space>
                    <Text type="secondary">Due: {course.dueDate}</Text>
                    <Tag color="blue">IN PROGRESS</Tag>
                  </Space>
                </div>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: <Empty description="No courses in progress" />
        }}
      />

      <Divider />

      <Title level={4}>Not Started</Title>
      <List
        itemLayout="horizontal"
        dataSource={employee.upcomingCourses}
        renderItem={(course) => (
          <List.Item className="upcoming-item">
            <List.Item.Meta
              title={course.title}
              description={
                <Space>
                  <Text type="secondary">Starting: {course.startDate}</Text>
                  <Tag color="default">NOT STARTED</Tag>
                </Space>
              }
            />
          </List.Item>
        )}
        locale={{
          emptyText: <Empty description="No upcoming courses" />
        }}
      />
    </div>
  );
};

export default TrainingProgress;
