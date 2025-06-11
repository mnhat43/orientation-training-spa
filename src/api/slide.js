const slide = {
  getSlideFile: async (filePath) => {
    try {
      let encodedPath = filePath.replace(/\/files\//, '/files%2F')

      let response = await fetch(encodedPath, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/zip, application/octet-stream, */*',
        },
      })

      if (!response.ok) {
        encodedPath = filePath.replace(/\/([^\/]+)$/, (match, filename) => {
          return '/' + encodeURIComponent(filename)
        })

        response = await fetch(encodedPath, {
          method: 'GET',
          mode: 'cors',
          headers: {
            Accept: 'application/zip, application/octet-stream, */*',
          },
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error('Failed to fetch slide file:', error)
      throw error
    }
  },
}

export default slide
