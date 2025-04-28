import React, { useState, useRef } from 'react'
import { Modal, Button, Typography, Tabs, Form, message } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import ProfileHeader from './ProfileHeader'
import OverviewTab from './OverviewTab'
import CoursesTab from './CoursesTab'
import CourseReviewModal from './CourseReviewModal'

const { Title } = Typography
const { TabPane } = Tabs

const ViewProfileModal = ({ visible, onClose, trainee, onAssignCourses }) => {
  const [courseCommentForm] = Form.useForm()
  const [currentCourseId, setCurrentCourseId] = useState(null)
  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false)
  const [activeTabKey, setActiveTabKey] = useState('overview')
  const pendingReviewRef = useRef(null)

  // Get mock courses data
  const mockCourses = getMockCourses()

  // Find the courses that need review
  const coursesWithPendingReviews = mockCourses.filter(
    (course) =>
      course.status === 'completed' &&
      (!course.managerComments || course.managerComments.length === 0),
  )

  // Calculate course statistics
  const completedCourses = mockCourses.filter((c) => c.status === 'completed')
  const averageGrade =
    completedCourses.length > 0
      ? completedCourses.reduce((sum, course) => sum + course.grade, 0) /
        completedCourses.length
      : 0
  const coursesNeedingReview = coursesWithPendingReviews.length

  const handleTabChange = (key) => {
    setActiveTabKey(key)
  }

  // Handle clicking "Courses Awaiting Review" from Overview tab
  const handleViewPendingReviews = () => {
    if (coursesWithPendingReviews.length > 0) {
      // Directly open the review form for the first course needing review
      const firstPendingCourse = coursesWithPendingReviews[0]
      showCommentForm(firstPendingCourse.id)
      message.info(`Opening review form for: ${firstPendingCourse.title}`)
    } else {
      message.info('No courses need review at this time.')
    }
  }

  const handleCourseCommentSubmit = async (values) => {
    try {
      // In a real app, we would submit the course comment to an API
      // await submitCourseComment(trainee.id, currentCourseId, values);

      message.success('Course review has been successfully submitted')
      setIsCommentFormVisible(false)
      courseCommentForm.resetFields()
      setCurrentCourseId(null)

      // In a real app, this would refresh the data
      // For now, we'll just hide the modal
    } catch (error) {
      message.error(error.message || 'Failed to submit course review')
    }
  }

  const showCommentForm = (courseId) => {
    // Make sure we have a valid courseId
    if (!courseId) {
      message.error('Invalid course selected')
      return
    }

    // Find the course to get its title
    const selectedCourse = mockCourses.find((c) => c.id === courseId)
    if (!selectedCourse) {
      message.error('Course not found')
      return
    }

    setCurrentCourseId(courseId)
    setIsCommentFormVisible(true)

    // Reset the form when opening
    courseCommentForm.resetFields()
  }

  if (!trainee) return null

  return (
    <Modal
      title={<Title level={4}>Trainee Profile</Title>}
      visible={visible}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button
          key="assign"
          icon={<BookOutlined />}
          onClick={onAssignCourses}
          style={{ marginRight: 8 }}
        >
          Assign Courses
        </Button>,
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <ProfileHeader trainee={trainee} />

      <Tabs activeKey={activeTabKey} onChange={handleTabChange}>
        <TabPane tab="Overview" key="overview">
          <OverviewTab
            trainee={trainee}
            averageGrade={averageGrade}
            coursesNeedingReview={coursesNeedingReview}
            onViewPendingReviews={handleViewPendingReviews}
          />
        </TabPane>

        <TabPane tab="Courses" key="courses">
          <CoursesTab
            mockCourses={mockCourses}
            coursesNeedingReview={coursesNeedingReview}
            showCommentForm={showCommentForm}
            pendingReviewRef={pendingReviewRef}
          />
        </TabPane>
      </Tabs>

      {/* Course review modal - shows when a course is selected for review */}
      {isCommentFormVisible && currentCourseId && (
        <CourseReviewModal
          visible={isCommentFormVisible}
          onCancel={() => {
            setIsCommentFormVisible(false)
            setCurrentCourseId(null)
          }}
          onSubmit={handleCourseCommentSubmit}
          courseTitle={
            mockCourses.find((c) => c.id === currentCourseId)?.title || ''
          }
          form={courseCommentForm}
        />
      )}
    </Modal>
  )
}

// Helper function to get mock courses data
const getMockCourses = () => [
  {
    id: '1',
    title: 'Introduction to Company',
    description: 'Overview of company history, mission, vision, and values',
    category: 'Onboarding',
    status: 'completed',
    progress: 100,
    completedDate: '2023-05-15',
    grade: 95,
    managerComments: [
      {
        author: 'David Wilson',
        position: 'HR Manager',
        comment:
          'Excellent understanding of company values and culture. Showed great enthusiasm during the orientation sessions.',
        date: '2023-05-16',
        rating: 5,
      },
    ],
  },
  {
    id: '2',
    title: 'Company Policies and Procedures',
    description:
      'Detailed overview of company policies, code of conduct, and operational procedures',
    category: 'Compliance',
    status: 'completed',
    progress: 100,
    completedDate: '2023-05-20',
    grade: 88,
    managerComments: [
      {
        author: 'Jennifer Lee',
        position: 'Compliance Officer',
        comment:
          'Good grasp of company policies. Demonstrated understanding of compliance requirements through thoughtful questions.',
        date: '2023-05-21',
        rating: 4,
      },
      {
        author: 'Michael Brown',
        position: 'Department Head',
        comment:
          'Completed all assessments with high scores. Shows excellent potential.',
        date: '2023-05-22',
        rating: 4.5,
      },
    ],
  },
  {
    id: '3',
    title: 'Security Training',
    description:
      'IT security best practices, data protection, and privacy guidelines',
    category: 'Technical',
    status: 'in-progress',
    progress: 60,
    completedDate: null,
    grade: null,
    managerComments: [],
  },
  {
    id: '4',
    title: 'Department Specific Training',
    description: 'Role-specific training modules tailored to department needs',
    category: 'Technical',
    status: 'in-progress',
    progress: 30,
    completedDate: null,
    grade: null,
    managerComments: [],
  },
  {
    id: '5',
    title: 'Professional Skills Development',
    description: 'Communication, teamwork, and professional growth skills',
    category: 'Soft Skills',
    status: 'not-started',
    progress: 0,
    completedDate: null,
    grade: null,
    managerComments: [],
  },
  {
    id: '6',
    title: 'Health and Safety',
    description: 'Workplace safety procedures and emergency protocols',
    category: 'Compliance',
    status: 'completed',
    progress: 100,
    completedDate: '2023-05-25',
    grade: 90,
    managerComments: [], // This course needs a review
  },
]

export default ViewProfileModal
