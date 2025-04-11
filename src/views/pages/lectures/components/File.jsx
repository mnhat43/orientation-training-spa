import React, { useState } from 'react'
import { Alert } from 'antd'

const File = ({ filePath }) => {
  const [loadError, setLoadError] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '600px' }}>
      {loadError && (
        <Alert
          message="Document failed to load"
          description="Please try again later or download the document to view it."
          type="error"
          showIcon
          style={{ marginBottom: '1rem' }}
        />
      )}
      <embed
        src={filePath}
        width="100%"
        height="600px"
        onError={() => setLoadError(true)}
        type="application/pdf"
        aria-label="Document viewer"
      />
    </div>
  )
}

export default File
