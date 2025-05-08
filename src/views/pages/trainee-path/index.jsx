import React, { useState } from 'react'
import { Steps, message, Modal, Row, Col, Tooltip } from 'antd'
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

const { Step } = Steps

const TraineePathCreator = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTrainee, setSelectedTrainee] = useState({})
  const [selectedCourses, setSelectedCourses] = useState([])

  const [submitting, setSubmitting] = useState(false)

  const handleSubmitPath = () => {
    if (!selectedTrainee) {
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
            {selectedTrainee.name}?
          </p>
          <p>
            This will create a training schedule with {selectedCourses.length}{' '}
            courses.
          </p>
        </div>
      ),
      onOk() {
        setSubmitting(true)

        setTimeout(() => {
          setSubmitting(false)
          setCurrentStep(3)

          // In a real app, reset would happen on component unmount or when starting a new path
          // setTimeout(() => {
          //   resetState()
          // }, 5000)
        }, 2000)
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
        onNext={handleNext}
        onPrev={handlePrev}
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
        onNext={handleNext}
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
      title: 'Select Trainee',
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
      <div className="steps-header-container">
        <div className="steps-header">
          <Row align="middle" justify="center">
            <Col span={24}>
              <Steps
                current={currentStep}
                onChange={handleStepClick}
                className="custom-steps"
                responsive={true}
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
            </Col>
          </Row>
        </div>
      </div>

      <div className="steps-content">{steps[currentStep].content()}</div>
    </div>
  )
}

export default TraineePathCreator
