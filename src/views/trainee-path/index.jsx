import React, { useState } from 'react'
import { Steps, message, Modal, Row, Col } from 'antd'
import {
  UserOutlined,
  FileSearchOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import './index.scss'
import TraineeSelector from './components/StepTraineeSelector'
import DesignPath from './components/StepDesignPath'
import ReviewPath from './components/StepReviewPath'
import SuccessView from './components/StepSuccessView'
import userprogress from '@api/userprogress'

const { Step } = Steps

const TraineePathCreator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTrainee, setSelectedTrainee] = useState({})
  const [selectedCourses, setSelectedCourses] = useState([])

  const [submitting, setSubmitting] = useState(false)

  const handleSubmitPath = () => {
    if (!selectedTrainee || !selectedTrainee.userID) {
      message.error('Please select a trainee')
      return
    }

    if (selectedCourses.length === 0) {
      message.error('Please add at least one course to the learning path')
      return
    }

    Modal.confirm({
      title: 'Confirm Learning Path Assignment',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            Are you sure you want to assign this learning path to{' '}
            {selectedTrainee.fullname || selectedTrainee.name}?
          </p>
          <p>
            This will create a training schedule with {selectedCourses.length}{' '}
            courses.
          </p>
        </div>
      ),
      onOk() {
        setSubmitting(true)

        const payload = {
          user_id: selectedTrainee.userID,
          course_ids: selectedCourses.map((course) => course.course_id),
        }

        userprogress
          .addUserProgress(payload)
          .then((response) => {
            setSubmitting(false)
            if (response && response.status == 1) {
              message.success('Learning path assigned successfully!')
              setCurrentStep(3)
            } else {
              message.error('Failed to assign learning path. Please try again.')
            }
          })
          .catch((error) => {
            setSubmitting(false)
            console.error('Error assigning learning path:', error)
            message.error(
              'An error occurred while assigning the learning path: ' +
                (error.message || 'Please try again.'),
            )
          })
      },
    })
  }

  const handleResetState = () => {
    setSelectedTrainee({})
    setSelectedCourses([])
    setCurrentStep(0)
    setSubmitting(false)
  }

  const handleNext = () => {
    if (currentStep === 0 && !selectedTrainee) {
      message.warning('Please select a trainee first')
      return
    }

    if (currentStep === 1 && selectedCourses.length === 0) {
      message.warning('Please add at least one course to the learning path')
      return
    }

    setCurrentStep(currentStep + 1)
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleStepClick = (step) => {
    if (step < currentStep || step === currentStep + 1) {
      if (step === 1 && !selectedTrainee.id) {
        message.warning('Please select a trainee first')
        return
      }

      if (step === 2 && selectedCourses.length === 0) {
        message.warning('Please add at least one course to the learning path')
        return
      }

      if (step === 3 && currentStep !== 3) {
        return
      }

      setCurrentStep(step)
    }
  }

  const renderTraineeSelector = () => {
    return (
      <TraineeSelector
        selectedTrainee={selectedTrainee}
        setSelectedTrainee={setSelectedTrainee}
        onNext={handleNext}
      />
    )
  }

  const renderDesignPath = () => {
    return (
      <DesignPath
        selectedCourses={selectedCourses}
        setSelectedCourses={setSelectedCourses}
      />
    )
  }

  const renderReviewPath = () => {
    return (
      <ReviewPath
        selectedTrainee={selectedTrainee}
        selectedCourses={selectedCourses}
        submitting={submitting}
        onSubmitPath={handleSubmitPath}
        onPrev={handlePrev}
      />
    )
  }

  const renderSuccessView = () => {
    return (
      <SuccessView
        selectedTrainee={selectedTrainee}
        selectedCourses={selectedCourses}
        setCurrentStep={setCurrentStep}
        onResetState={handleResetState}
      />
    )
  }

  const steps = [
    {
      title: 'Select Employee',
      content: renderTraineeSelector,
      icon: <UserOutlined />,
    },
    {
      title: 'Design Path',
      content: renderDesignPath,
      icon: <EditOutlined />,
    },
    {
      title: 'Review',
      content: renderReviewPath,
      icon: <FileSearchOutlined />,
    },
    {
      title: 'Complete',
      content: renderSuccessView,
      icon: <CheckCircleOutlined />,
    },
  ]

  return (
    <div className="trainee-path-creator">
      <Row gutter={[24, 0]} style={{ minHeight: '80vh' }}>
        <Col xs={24} sm={24} md={6} lg={5} xl={5}>
          <div className="steps-container">
            <Steps
              current={currentStep}
              onChange={handleStepClick}
              className="custom-steps"
              direction="vertical"
            >
              {steps.map((item, index) => (
                <Step
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  className={`step-item ${index < currentStep ? 'step-completed' : ''} ${index === currentStep ? 'step-active' : ''}`}
                  description={
                    index === 0 && selectedTrainee.name ? (
                      <span className="step-description">
                        {selectedTrainee.name}
                      </span>
                    ) : index === 1 && selectedCourses.length > 0 ? (
                      <span className="step-description">
                        {selectedCourses.length} courses
                      </span>
                    ) : null
                  }
                  disabled={index > currentStep + 1 || index === 3}
                />
              ))}
            </Steps>

            <div className="steps-navigation">
              {currentStep > 0 && currentStep < 3 && (
                <button
                  className="step-nav-button back-button"
                  onClick={handlePrev}
                >
                  <span className="nav-arrow">←</span>
                  <span>Back</span>
                </button>
              )}

              {currentStep < 2 && (
                <button
                  className="step-nav-button next-button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 0 && !selectedTrainee.userID) ||
                    (currentStep === 1 && selectedCourses.length === 0)
                  }
                >
                  <span>Next</span>
                  <span className="nav-arrow">→</span>
                </button>
              )}

              {currentStep === 2 && (
                <button
                  className="step-nav-button submit-button"
                  onClick={handleSubmitPath}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              )}

              {currentStep === 3 && (
                <button
                  className="step-nav-button reset-button"
                  onClick={handleResetState}
                >
                  Start New Path
                </button>
              )}
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={18} lg={19} xl={19}>
          <div className="steps-content">{steps[currentStep].content()}</div>
        </Col>
      </Row>
    </div>
  )
}

export default TraineePathCreator
