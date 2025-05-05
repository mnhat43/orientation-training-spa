import React, { useState, useEffect } from 'react'
import { Steps, Button, message, Alert, Modal } from 'antd'
import {
  UserOutlined,
  FileSearchOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons'
import BannerComponent from '@components/Banner'
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

  // Handle path submission
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

        // In a real application, this would be an API call
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

  // Step navigation
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

  // Render steps
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
        selectedTrainee={selectedTrainee}
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
      <div className="page-header-container">
        <BannerComponent
          title="Create Trainee Learning Path"
          description="Design a personalized learning path for a trainee by applying a template and customizing the courses."
        />
      </div>

      <div className="steps-header">
        <Steps current={currentStep}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} icon={item.icon} />
          ))}
        </Steps>
      </div>

      <div className="steps-content">{steps[currentStep].content()}</div>
    </div>
  )
}

export default TraineePathCreator
