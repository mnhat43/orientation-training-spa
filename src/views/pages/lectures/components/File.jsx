import React, { useState } from 'react'
import { Alert } from 'antd'
import './File.scss'

const File = ({ filePath }) => {
  const [loadError, setLoadError] = useState(false)

  // Get file extension to determine content type
  // const fileExtension = filePath.split('.').pop().toLowerCase()
  const isPdf = true

  return (
    <div className="viewer">
      {loadError && (
        <Alert
          message="Document failed to load"
          description="Please try again later or contact support if the issue persists."
          type="error"
          showIcon
          className="error"
        />
      )}

      <div className="container">
        {isPdf ? (
          <object
            data={filePath}
            type="application/pdf"
            className="object"
            onError={() => setLoadError(true)}
          >
            <p>
              Your browser doesn't support PDF viewing.{' '}
              <a href={filePath} target="_blank" rel="noopener noreferrer">
                Click here to view the PDF
              </a>
            </p>
          </object>
        ) : (
          <iframe
            src={filePath}
            className="iframe"
            onError={() => setLoadError(true)}
            title="Document viewer"
          />
        )}
      </div>
    </div>
  )
}

export default File
