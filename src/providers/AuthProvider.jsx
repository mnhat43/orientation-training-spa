import { createContext, useState, useEffect } from 'react'
import apiUser from '@api/user'
import apiAuth from '@api/auth'

const AuthContext = createContext(undefined)

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem('token'),
  )
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('token', authToken)
    } else {
      localStorage.removeItem('token')
    }
  }, [authToken])
  useEffect(() => {
    const fetchUser = async () => {
      if (!authToken) {
        setLoading(false)
        return
      }

      try {
        const userResponse = await apiUser.getUserInfo()
        if (userResponse.status === 1) {
          setCurrentUser(userResponse.data)
        }
        if (userResponse.status === 0) {
          setError(userResponse.message)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        setCurrentUser(null)
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [authToken])
  const handleLogin = async (email, password) => {
    setLoading(true)
    setError(null) // Reset error state at the beginning of login
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)

    try {
      const response = await apiAuth.login(formData)
      if (response.status === 1) {
        const token = response.data.token

        localStorage.setItem('token', token)

        setAuthToken(token)

        try {
          const userResponse = await apiUser.getUserInfo()
          if (userResponse.status === 1) {
            setCurrentUser(userResponse.data)
          } else {
            setError(
              userResponse.message || 'Failed to retrieve user information',
            )
            setAuthToken(null)
            localStorage.removeItem('token')
            setLoading(false)
            return false
          }
        } catch (userError) {
          console.error('Error fetching user info:', userError)
          setError('Failed to retrieve user information')
          setAuthToken(null)
          localStorage.removeItem('token')
          setLoading(false)
          return false
        }

        setLoading(false)
        return true
      }
      setError(response.message || 'Authentication failed')
      setLoading(false)
      return false
    } catch (error) {
      console.error('Login error:', error)
      if (error.response && error.response.status === 401) {
        setError('Your email or password is incorrect. Please try again.')
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      } else {
        setError('Authentication failed. Please try again.')
      }
      setAuthToken(null)
      setCurrentUser(null)
      setLoading(false)
      return false
    }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await apiAuth.logout()
      localStorage.removeItem('token')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAuthToken(null)
      setCurrentUser(null)
      setLoading(false)
    }
  }

  const updateCurrentUser = (updatedUserData) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updatedUserData,
    }))
  }

  const isAuthenticated = () => {
    return !!authToken && !!currentUser
  }
  return (
    <AuthContext.Provider
      value={{
        authToken,
        currentUser,
        handleLogin,
        handleLogout,
        updateCurrentUser,
        isAuthenticated,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export { AuthContext }
