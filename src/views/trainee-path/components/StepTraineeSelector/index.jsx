import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import './index.scss'
import './TraineeTable.scss'

import FilterBar from './FilterBar'
import TraineeTable from './TraineeTable'
import apiTrainee from '@api/trainee'

const TraineeSelector = ({ selectedTrainee, setSelectedTrainee, onNext }) => {
  const [trainees, setTrainees] = useState([])
  const [traineeLoading, setTraineeLoading] = useState(false)

  const [searchText, setSearchText] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState(null)

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

  return (
    <>
      <FilterBar
        searchText={searchText}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        onSearch={handleSearch}
      />
      <TraineeTable
        trainees={filteredTrainees}
        loading={traineeLoading}
        setSelectedTrainee={setSelectedTrainee}
        selectedTrainee={selectedTrainee}
      />
    </>
  )
}

export default TraineeSelector
