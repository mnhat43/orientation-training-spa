import React, { useState, useEffect } from 'react'
import { message, Row, Col, Button, Space } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import './index.scss'
import './TraineeTable.scss'

import FilterBar from './FilterBar'
import TraineeTable from './TraineeTable'
import ConfirmationCard from './ConfirmationCard'
import apiTrainee from '@api/trainee'

const TraineeSelector = ({ selectedTrainee, setSelectedTrainee, onNext }) => {
  const [trainees, setTrainees] = useState([])
  const [traineeLoading, setTraineeLoading] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState(null)

  // Fetch trainees
  useEffect(() => {
    const fetchTrainees = () => {
      setTraineeLoading(true)
      apiTrainee
        .getListTrainee()
        .then((response) => {
          if (response.status == 1) {
            setTrainees(response.data || [])
          } else {
            console.warn('Unexpected API response status:', response.status)
            message.warning('Unexpected response from server')
          }
        })
        .catch((error) => {
          console.error('Error fetching trainees:', error)
          message.error('Failed to load trainees')
        })
        .finally(() => {
          setTraineeLoading(false)
        })
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
