import React, { useState, useEffect } from 'react'
import { Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import './trainee.scss'

// Import components
import BannerComponent from '@components/Banner'
import StatsDashboard from './components/StatsDashboard'
import ToolbarActions from './components/ToolbarActions'
import SelectionBar from './components/SelectionBar'
import TraineeTable from './components/TraineeTable'
import AddTraineeModal from './components/AddTraineeModal'
import AssignCourseModal from './components/AssignCourseModal'
import ViewProfileModal from './components/ViewProfileModal'

const { confirm } = Modal

const TraineesPage = () => {
  const [trainees, setTrainees] = useState([])
  const [filteredTrainees, setFilteredTrainees] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0)

  const [addModalVisible, setAddModalVisible] = useState(false)
  const [assignCourseModalVisible, setAssignCourseModalVisible] =
    useState(false)
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [selectedTrainee, setSelectedTrainee] = useState(null)
  const [bulkAssignModalVisible, setBulkAssignModalVisible] = useState(false)

  useEffect(() => {
    fetchTrainees()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = trainees.filter(
        (trainee) =>
          trainee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trainee.department
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          trainee.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredTrainees(filtered)
    } else {
      if (activeTab === 'pending-review') {
        const filtered = trainees.filter(
          (trainee) => trainee.pendingReviewCourses > 0,
        )
        setFilteredTrainees(filtered)
      } else {
        setFilteredTrainees(trainees)
      }
    }
  }, [searchQuery, trainees, activeTab])

  useEffect(() => {
    const totalPendingReviews = trainees.reduce(
      (total, trainee) => total + (trainee.pendingReviewCourses || 0),
      0,
    )
    setPendingReviewsCount(totalPendingReviews)
  }, [trainees])

  const fetchTrainees = async () => {
    try {
      setLoading(true)
      const data = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          department: 'Engineering',
          avatar: null,
          completedCourses: 3,
          inProgressCourses: 1,
          pendingReviewCourses: 1,
          totalCourses: 5,
          status: 'In Progress',
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          department: 'Marketing',
          avatar: null,
          completedCourses: 5,
          inProgressCourses: 0,
          pendingReviewCourses: 0,
          totalCourses: 5,
          status: 'Completed',
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          department: 'Sales',
          avatar: null,
          completedCourses: 1,
          inProgressCourses: 2,
          pendingReviewCourses: 2,
          totalCourses: 5,
          status: 'In Progress',
        },
        {
          id: '4',
          name: 'Sarah Williams',
          email: 'sarah.williams@example.com',
          department: 'HR',
          avatar: null,
          completedCourses: 4,
          inProgressCourses: 0,
          pendingReviewCourses: 2,
          totalCourses: 6,
          status: 'In Progress',
        },
        {
          id: '5',
          name: 'Robert Brown',
          email: 'robert.brown@example.com',
          department: 'Engineering',
          avatar: null,
          completedCourses: 7,
          inProgressCourses: 1,
          pendingReviewCourses: 0,
          totalCourses: 8,
          status: 'In Progress',
        },
        {
          id: '6',
          name: 'Lisa Johnson',
          email: 'lisa.johnson@example.com',
          department: 'Finance',
          avatar: null,
          completedCourses: 0,
          inProgressCourses: 0,
          pendingReviewCourses: 0,
          totalCourses: 4,
          status: 'Not Started',
        },
        {
          id: '7',
          name: 'Alex Chen',
          email: 'alex.chen@example.com',
          department: 'Design',
          avatar: null,
          completedCourses: 2,
          inProgressCourses: 3,
          pendingReviewCourses: 1,
          totalCourses: 6,
          status: 'In Progress',
        },
        {
          id: '8',
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          department: 'Product',
          avatar: null,
          completedCourses: 5,
          inProgressCourses: 0,
          pendingReviewCourses: 0,
          totalCourses: 5,
          status: 'Completed',
        },
        {
          id: '9',
          name: 'David Wilson',
          email: 'david.wilson@example.com',
          department: 'Engineering',
          avatar: null,
          completedCourses: 0,
          inProgressCourses: 4,
          pendingReviewCourses: 0,
          totalCourses: 4,
          status: 'In Progress',
        },
        {
          id: '10',
          name: 'Sophia Martinez',
          email: 'sophia.martinez@example.com',
          department: 'Customer Support',
          avatar: null,
          completedCourses: 3,
          inProgressCourses: 0,
          pendingReviewCourses: 2,
          totalCourses: 5,
          status: 'In Progress',
        },
        {
          id: '11',
          name: 'James Anderson',
          email: 'james.anderson@example.com',
          department: 'Legal',
          avatar: null,
          completedCourses: 0,
          inProgressCourses: 0,
          pendingReviewCourses: 0,
          totalCourses: 3,
          status: 'Not Started',
        },
        {
          id: '12',
          name: 'Olivia Taylor',
          email: 'olivia.taylor@example.com',
          department: 'Marketing',
          avatar: null,
          completedCourses: 6,
          inProgressCourses: 0,
          pendingReviewCourses: 0,
          totalCourses: 6,
          status: 'Completed',
        },
        {
          id: '13',
          name: 'William Thomas',
          email: 'william.thomas@example.com',
          department: 'Sales',
          avatar: null,
          completedCourses: 2,
          inProgressCourses: 1,
          pendingReviewCourses: 1,
          totalCourses: 4,
          status: 'In Progress',
        },
        {
          id: '14',
          name: 'Ava Jackson',
          email: 'ava.jackson@example.com',
          department: 'HR',
          avatar: null,
          completedCourses: 2,
          inProgressCourses: 2,
          pendingReviewCourses: 0,
          totalCourses: 4,
          status: 'In Progress',
        },
        {
          id: '15',
          name: 'Daniel White',
          email: 'daniel.white@example.com',
          department: 'Engineering',
          avatar: null,
          completedCourses: 8,
          inProgressCourses: 0,
          pendingReviewCourses: 0,
          totalCourses: 8,
          status: 'Completed',
        },
      ]
      setTrainees(data)
      setFilteredTrainees(data)
    } catch (error) {
      message.error(error.message || 'Could not load trainees data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleViewPendingReviews = () => {
    setActiveTab(activeTab === 'pending-review' ? 'all' : 'pending-review')
  }

  const showAddModal = () => {
    setAddModalVisible(true)
  }

  const showProfileModal = (trainee) => {
    setSelectedTrainee(trainee)
    setProfileModalVisible(true)
  }

  const showAssignCourseModal = (trainee) => {
    setSelectedTrainee(trainee)
    setAssignCourseModalVisible(true)
  }

  const showBulkAssignModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one trainee first')
      return
    }
    setBulkAssignModalVisible(true)
  }

  const showConfirmDelete = (trainee) => {
    confirm({
      title: `Are you sure you want to delete ${trainee.name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        handleDeleteTrainee(trainee.id)
      },
    })
  }

  const handleDeleteTrainee = async (traineeId) => {
    try {
      setTrainees((prev) => prev.filter((trainee) => trainee.id !== traineeId))
      message.success('Trainee deleted successfully')
    } catch (error) {
      message.error(error.message || 'Failed to delete trainee')
    }
  }

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return

    confirm({
      title: `Are you sure you want to delete ${selectedRowKeys.length} trainees?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setTrainees((prev) =>
          prev.filter((trainee) => !selectedRowKeys.includes(trainee.id)),
        )
        setSelectedRowKeys([])
        message.success(
          `Successfully deleted ${selectedRowKeys.length} trainees`,
        )
      },
    })
  }

  const removeFromSelection = (traineeId) => {
    setSelectedRowKeys((prevKeys) =>
      prevKeys.filter((key) => key !== traineeId),
    )
  }

  const handleAddSuccess = () => {
    fetchTrainees()
    message.success('New trainee has been successfully added')
  }

  const handleAssignSuccess = () => {
    fetchTrainees()
    message.success('Courses have been successfully assigned to the trainee')
  }

  const handleBulkAssignSuccess = () => {
    fetchTrainees()
    setSelectedRowKeys([])
    message.success(
      `Courses assigned to ${selectedRowKeys.length} trainees successfully`,
    )
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys) => {
      setSelectedRowKeys(selectedKeys)
    },
  }

  const calculateStatistics = () => {
    const totalTrainees = trainees.length
    const totalCompleted = trainees.filter(
      (t) => t.status === 'Completed',
    ).length
    const totalInProgress = trainees.filter(
      (t) => t.status === 'In Progress',
    ).length
    const totalNotStarted = trainees.filter(
      (t) => t.status === 'Not Started',
    ).length

    return {
      totalTrainees,
      totalCompleted,
      totalInProgress,
      totalNotStarted,
      pendingReviewsCount,
    }
  }

  const stats = calculateStatistics()

  return (
    <div className="trainee-page-content">
      <div className="page-header-container">
        <BannerComponent
          title="Training Management"
          description="Manage trainee profiles, course assignments and track training progress"
        />
      </div>

      <StatsDashboard
        stats={stats}
        activeTab={activeTab}
        onViewPendingReviews={handleViewPendingReviews}
      />

      <div className="actions-toolbar">
        <ToolbarActions
          searchQuery={searchQuery}
          onSearch={handleSearch}
          onAddTrainee={showAddModal}
          onBulkAssign={showBulkAssignModal}
          hasSelection={selectedRowKeys.length > 0}
          activeTab={activeTab}
        />

        {selectedRowKeys.length > 0 && (
          <SelectionBar
            selectedRowKeys={selectedRowKeys}
            trainees={trainees}
            onBulkAssign={showBulkAssignModal}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedRowKeys([])}
            onRemoveFromSelection={removeFromSelection}
          />
        )}
      </div>

      <TraineeTable
        loading={loading}
        trainees={filteredTrainees}
        activeTab={activeTab}
        rowSelection={rowSelection}
        pendingReviewsCount={pendingReviewsCount}
        onViewPendingReviews={handleViewPendingReviews}
        onViewProfile={showProfileModal}
        onAssignCourse={showAssignCourseModal}
        onDeleteTrainee={showConfirmDelete}
      />

      <AddTraineeModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={handleAddSuccess}
      />

      {selectedTrainee && (
        <>
          <ViewProfileModal
            visible={profileModalVisible}
            onClose={() => setProfileModalVisible(false)}
            trainee={selectedTrainee}
            onAssignCourses={() => {
              setProfileModalVisible(false)
              setAssignCourseModalVisible(true)
            }}
          />

          <AssignCourseModal
            visible={assignCourseModalVisible}
            onClose={() => setAssignCourseModalVisible(false)}
            trainee={selectedTrainee}
            onSuccess={handleAssignSuccess}
          />
        </>
      )}

      <AssignCourseModal
        visible={bulkAssignModalVisible}
        onClose={() => setBulkAssignModalVisible(false)}
        traineeIds={selectedRowKeys}
        isBulkAssign={true}
        onSuccess={handleBulkAssignSuccess}
      />
    </div>
  )
}

export default TraineesPage
