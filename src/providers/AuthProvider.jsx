import { useContext, createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiUser from '@api/user'
import apiAuth from '@api/auth'

const AuthContext = createContext(undefined)

const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem('token'),
  )
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('token', authToken)
    } else {
      localStorage.removeItem('token')
    }
  }, [authToken])

  useEffect(() => {
    const fetchUser = async () => {
      if (!authToken) return

      try {
        const userResponse = await apiUser.getUserInfo()
        if (userResponse.status === 1) {
          setCurrentUser(userResponse.data)
        }
      } catch (error) {
        console.error('Error fetching user info:', error)
        setCurrentUser(null)
        setAuthToken(null)
      }
    }
    fetchUser()
  }, [authToken])

  const handleLogin = async (email, password) => {
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
          }
        } catch (userError) {
          console.error('Error fetching user info:', userError)
          return false
        }

        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      setAuthToken(null)
      setCurrentUser(null)
      return false
    }
  }
  const handleLogout = async () => {
    try {
      await apiAuth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAuthToken(null)
      setCurrentUser(null)
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
export { AuthContext }
