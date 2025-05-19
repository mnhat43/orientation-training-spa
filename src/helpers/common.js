export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.onerror = (error) => reject(error)
  })
}

export const formatTime = (seconds) => {
  if (!seconds) return 'No time set'

  const totalSeconds = parseInt(seconds, 10)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const remainingSeconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const timeStringToSeconds = (timeString) => {
  if (!timeString) return 0

  const parts = timeString.split(':')

  if (parts.length === 3) {
    return (
      parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
    )
  } else if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1])
  }

  return 0
}

export const calculateTotalHours = (courses) => {
  return courses.reduce((total, course) => {
    const hours = parseInt(course.duration) || 0
    return total + hours
  }, 0)
}
