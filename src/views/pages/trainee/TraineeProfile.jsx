import React, { useState, useRef, useEffect } from 'react'
// ...other imports...
import PerformanceReviewModal from './components/TraineeProfile/PerformanceReviewModal'
// ...other imports...

const TraineeProfile = () => {
  // ...existing code...

  const [form] = Form.useForm()
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Function to show the Performance Review modal
  const showPerformanceReviewForm = (courseId) => {
    const course = mockCourses.find((c) => c.id === courseId)
    if (course) {
      setSelectedCourseId(courseId)

      // Pre-populate form if there's existing review data
      if (course.managerComments && course.managerComments.length > 0) {
        const latestComment = course.managerComments[0]
        form.setFieldsValue({
          rating: latestComment.rating,
          strengths: latestComment.strengths,
          improvements: latestComment.improvements,
          comment: latestComment.comment,
        })
      } else {
        form.resetFields()
      }

      setReviewModalOpen(true)
    }
  }

  // Handle form submission for the performance review
  const handleReviewSubmit = () => {
    form.validateFields().then((values) => {
      setSubmitting(true)

      // Simulate API call
      setTimeout(() => {
        const updatedCourses = mockCourses.map((course) => {
          if (course.id === selectedCourseId) {
            const newComment = {
              id: Date.now(),
              date: new Date().toLocaleDateString(),
              user: 'Manager Name',
              userAvatar: '/avatars/manager.jpg',
              rating: values.rating,
              strengths: values.strengths,
              improvements: values.improvements || '',
              comment: values.comment,
            }

            return {
              ...course,
              managerComments: course.managerComments
                ? [newComment, ...course.managerComments]
                : [newComment],
            }
          }
          return course
        })

        setMockCourses(updatedCourses)
        setSubmitting(false)
        setReviewModalOpen(false)
        message.success('Performance review submitted successfully')
      }, 1000)
    })
  }

  // ...existing code...

  return (
    <div className="trainee-profile-container">
      {/* ...existing layout code... */}

      <CoursesTab
        mockCourses={mockCourses}
        coursesNeedingReview={coursesNeedingReview}
        showCommentForm={showPerformanceReviewForm}
        pendingReviewRef={pendingReviewRef}
      />

      {/* ...existing code... */}

      {/* Performance Review Modal */}
      <PerformanceReviewModal
        open={reviewModalOpen}
        onCancel={() => setReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        traineeName={traineeData.fullName}
        form={form}
      />
    </div>
  )
}

export default TraineeProfile
