  import React, { useEffect, useState } from 'react'
  import FileDisplay from './FileDisplay'

const FileView = ({ files }) => {
    const [selectedFileURL, setselectedFileURL] = useState('')
  
    const selectFile = (url) => {
      setselectedFileURL(url)
    }
  
    const getPdfUrl = (files) => {
      for (const file of files) {
        const index = file.url.lastIndexOf('.')
        if (file.url.slice(index + 1) === 'pdf') return file.url
      }
      return ''
    }
  
    useEffect(() => {
      setselectedFileURL(getPdfUrl(files))
    }, [files])
  
    return (
      <>
        <FileDisplay files={files} handleClick={selectFile} />
        <embed
          title="test"
          src={`${selectedFileURL}`}
          style={{ width: '100%', height: '680px', marginTop: '16px' }}
          frameBorder="0"
        ></embed>
      </>
    )
  }

  export default FileView;