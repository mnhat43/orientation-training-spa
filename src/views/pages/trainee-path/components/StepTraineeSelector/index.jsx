import React, { useState, useEffect } from 'react'
import { Alert } from 'antd'
import './index.scss'

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
              gender: 'Male',
              birthday: '1995-01-01',
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
              birthday: '1995-01-01',
              joinDate: '2023-04-10',
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

  const handleSearch = (value) => {
    setSearchText(value)
  }

  const resetFilters = () => {
    setSearchText('')
    setDepartmentFilter(null)
  }

  return (
    <div className="simple-trainee-selector">
      <Alert
        message="Step 1: Select a Trainee"
        description="Choose a trainee to create their learning path."
        type="info"
        showIcon
      />

      {Object.keys(selectedTrainee).length > 0 ? (
        <ConfirmationCard
          trainee={selectedTrainee}
          setSelectedTrainee={setSelectedTrainee}
          onNext={onNext}
        />
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
            trainees={trainees}
            loading={traineeLoading}
            setSelectedTrainee={setSelectedTrainee}
          />
        </>
      )}
    </div>
  )
}

export default TraineeSelector
