import { Divider, message, Typography, Upload } from 'antd'
import React from 'react'
// import { useDispatch } from 'react-redux'
// import {
//   addQuestion,
//   markForEdit,
//   removeQuestion,
//   replaceQuestion
// } from '../../../reducers/assessmentCreationReducer'
import QuestionList from './QuestionList'

// import s3Sevice from '../../../services/s3Service'

import { InboxOutlined } from '@ant-design/icons'
import { useParams } from 'react-router'

const { Dragger } = Upload
const { Title } = Typography

const AssessmentQuestionsSection = (props) => {
  const { courseId } = useParams()

  const {
    title,
    setTitle,
    questions,
    setQuestions,
    controlledQuestionType,
    files,
    setFiles
  } = props

  const newQuestion = {
    question_number: questions.length + 1,
    status: 'DRAFT',
    type: 'Esay',
  }

  const createQuestion = () => {
    setQuestions([...questions, newQuestion])
  }
  const updateQuestion = (question) => {
    setQuestions((questions) =>
      questions.map((item) =>
        item.question_number === question.question_number ? { ...question } : item
      ))
  }
  const deleteQuestion = (question) => {
    setQuestions((questions) =>
      questions.filter((item) => item.question_number !== question.question_number))
  }
  const draftQuestion = (question) => {
    setQuestions((questions) =>
      questions.map((item) =>
        item.question_number === question ? { ...item, status: 'DRAFT', } : item
      ))
  }

  const handleFileRemove = async (removedFile) => {
    // let s3URL = ''
    // if (!removedFile.error) {
    //   setFiles(
    //     files.filter((file) => {
    //       if (file.uid === removedFile.uid) s3URL = file.url

    //       return file.uid !== removedFile.uid
    //     })
    //   )
    //   await s3Sevice.deleteFile(s3URL)
    // }
  }

  const handleFileSubmit = ({ file, onSuccess, onError }) => {
    // s3Sevice
    //   .uploadFile(courseId, 'assessments', file.name, file)
    //   .then((url) => {
    //     setFiles(files.concat([{ name: file.name, url: url, uid: file.uid }]))
    //     onSuccess()
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     onError(error)
    //   })
  }

  return (
    <div
      style={{
        backgroundColor: '#fafafa',
        width: '95%',
        margin: '0 auto',
        borderRadius: '10px',
        padding: '20px 20px'
      }}
    >
      <Title editable={{ onChange: setTitle }} level={3}>
        {title}
      </Title>

      <Divider />

      {controlledQuestionType === 'online' && (
        <QuestionList
          questions={questions}
          updateQuestion={updateQuestion}
          deleteQuestion={deleteQuestion}
          draftQuestion={draftQuestion}
          createQuestion={createQuestion}
        />
      )}

      {controlledQuestionType === 'file' && (
        <Dragger
          onChange={(info) => {
            const { status } = info.file
            if (status === 'done')
              message.success(`${info.file.name} file uploaded successfully.`)
            else if (status === 'error')
              message.error(`${info.file.name} file upload failed.`)
          }}
          customRequest={handleFileSubmit}
          onRemove={handleFileRemove}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      )}
    </div>
  )
}

export default AssessmentQuestionsSection
