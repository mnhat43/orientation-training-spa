import React, { useState, useEffect } from 'react'
import { message, Row, Col, Button, Space } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import './index.scss'
import './TraineeTable.scss'

import FilterBar from './FilterBar'
import TraineeTable from './TraineeTable'
import ConfirmationCard from './ConfirmationCard'

const TraineeSelector = ({ selectedTrainee, setSelectedTrainee, onNext }) => {
  const [trainees, setTrainees] = useState([])
  const [traineeLoading, setTraineeLoading] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState(null)

  // Fetch trainees
  useEffect(() => {
    const fetchTrainees = async () => {
      setTraineeLoading(true)
      try {
        // Mock data - replace with actual API call
        setTimeout(() => {
          const mockTrainees = [
            {
              id: '1',
              fullname: 'Nguyen Van A',
              department: 'Engineering',
              email: 'trainee1@gmail.com',
              avatar: null,
              phone: '0123456789',
              gender: 'Male',
              birthday: '1995-01-01',
              joinDate: '2023-05-15',
            },
            {
              id: '2',
              fullname: 'Tran Thi B',
              department: 'Marketing',
              email: 'trainee2@gmail.com',
              avatar: null,
              phone: '0123456789',
              gender: 'Female',
              birthday: '1996-05-10',
              joinDate: '2023-06-20',
            },
            {
              id: '3',
              fullname: 'Le Van C',
              department: 'Sales',
              email: 'trainee3@gmail.com',
              avatar: null,
              phone: '0123456789',
              gender: 'Male',
              birthday: '1994-12-15',
              joinDate: '2023-04-10',
            },
            {
              id: '4',
              fullname: 'Pham Thi D',
              department: 'Human Resources',
              email: 'trainee4@gmail.com',
              avatar: null,
              phone: '0987654321',
              gender: 'Female',
              birthday: '1997-08-20',
              joinDate: '2023-03-15',
            },
            {
              id: '5',
              fullname: 'Hoang Van E',
              department: 'Finance',
              email: 'trainee5@gmail.com',
              avatar: null,
              phone: '0123498765',
              gender: 'Male',
              birthday: '1993-11-05',
              joinDate: '2023-02-28',
            },
          ]
          setTrainees(mockTrainees)
          setTraineeLoading(false)
        }, 1000)
      } catch (error) {
        message.error('Failed to load trainees')
        setTraineeLoading(false)
      }
    }

    fetchTrainees()
  }, [])

  const filteredTrainees = trainees.filter((trainee) => {
    const matchesSearch =
      searchText === '' ||
      trainee.fullname.toLowerCase().includes(searchText.toLowerCase()) ||
      trainee.email.toLowerCase().includes(searchText.toLowerCase())

    const matchesDepartment =
      !departmentFilter || trainee.department === departmentFilter

    return matchesSearch && matchesDepartment
  })

  const handleSearch = (value) => {
    setSearchText(value)
  }

  const resetFilters = () => {
    setSearchText('')
    setDepartmentFilter(null)
  }

  const handleBack = () => {
    setSelectedTrainee({})
  }

  return (
    <div className="simple-trainee-selector">
      {Object.keys(selectedTrainee).length > 0 ? (
        <Row>
          <Col span={22} className="content-section">
            <ConfirmationCard selectedTrainee={selectedTrainee} />
          </Col>
          <Col span={2} className="navigation-buttons">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={handleBack}
                size="middle"
              >
                Back
              </Button>
              <Button
                type="primary"
                onClick={onNext}
                icon={<ArrowRightOutlined />}
                size="middle"
              >
                Next
              </Button>
            </Space>
          </Col>
        </Row>
      ) : (
        <>
          <FilterBar
            searchText={searchText}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            onSearch={handleSearch}
            onResetFilters={resetFilters}
            hasActiveFilters={!!searchText || !!departmentFilter}
          />
          <TraineeTable
            trainees={filteredTrainees}
            loading={traineeLoading}
            setSelectedTrainee={setSelectedTrainee}
          />
        </>
      )}
    </div>
  )
}

export default TraineeSelector
