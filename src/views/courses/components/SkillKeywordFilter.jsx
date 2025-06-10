import React, { useState, useEffect } from 'react'
import { Select, Tag } from 'antd'
import skillkeywordApi from '@api/skillkeyword'
import './SkillKeywordFilter.scss'

const { Option } = Select

const SkillKeywordFilter = ({
  value = [],
  onChange,
  placeholder = 'Filter by skills',
  style,
  allowClear = true,
  maxTagCount = 'responsive',
}) => {
  const [skillKeywords, setSkillKeywords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSkillKeywords()
  }, [])

  const fetchSkillKeywords = async () => {
    try {
      setLoading(true)
      const response = await skillkeywordApi.list()
      if (response && response.data) {
        setSkillKeywords(response.data)
      }
    } catch (error) {
      console.error('Error fetching skill keywords:', error)
    } finally {
      setLoading(false)
    }
  }

  const tagRender = (props) => {
    const { label, value: tagValue, closable, onClose } = props
    const onPreventMouseDown = (event) => {
      event.preventDefault()
      event.stopPropagation()
    }

    return (
      <Tag
        color="blue"
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
          fontSize: '12px',
          padding: '2px 6px',
          borderRadius: '3px',
        }}
      >
        {label}
      </Tag>
    )
  }

  return (
    <Select
      mode="multiple"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={style}
      maxTagCount={maxTagCount}
      allowClear={allowClear}
      showSearch
      loading={loading}
      tagRender={tagRender}
      filterOption={(input, option) =>
        option.children.toLowerCase().includes(input.toLowerCase())
      }
      dropdownStyle={{ zIndex: 1050 }}
      className="skill-keyword-filter"
    >
      {skillKeywords.map((keyword) => (
        <Option key={keyword.id} value={keyword.id}>
          {keyword.name}
        </Option>
      ))}
    </Select>
  )
}

export default SkillKeywordFilter
