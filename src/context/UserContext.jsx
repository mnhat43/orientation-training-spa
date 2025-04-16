import { createContext, useEffect, useState, useCallback, useMemo } from 'react'
import user from '@api/user'

const UserContext = createContext()
const TOKEN_STORAGE_KEY = 'token'
const COLLAPSED_STORAGE_KEY = 'collapsed'

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState(null)
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem(COLLAPSED_STORAGE_KEY) === 'true',
  )
  const [authData, setAuthData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Format user profile data consistently
  const formatUserData = useCallback((profileData) => {
    if (!profileData) return null

    return {
      id: profileData.id,
      email: profileData.email,
      firstName: profileData.first_name,
      lastName: profileData.last_name,
      name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
      phone: profileData.phone_number,
      avatar: profileData.avatar,
      birthday: profileData.birthday,
      roleId: profileData.role_id,
      role: profileData.role_name,
    }
  }, [])

  // Fetch user profile function
  const fetchUserProfile = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await user.getProfile()

      // Handle the response regardless of its structure
      let profileData = null
      if (response?.status === 1 && response?.data) {
        profileData = response.data
        const formattedData = formatUserData(profileData)
        setUserData(formattedData)
        return formattedData
      }
      return null
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [formatUserData])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
    setAuthData(null)
    setUserData(null)
    user.logout()
  }, [])

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY)

    if (!token) {
      return
    }

    try {
      const parsedToken = JSON.parse(token)
      setAuthData(parsedToken)
      setIsLoggedIn(true)

      // Fetch user profile
      fetchUserProfile().catch((error) => {
        logout() // Invalid token or API error
      })
    } catch (error) {
      console.error('Invalid token format in localStorage:', error)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }, [fetchUserProfile, logout])

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem(COLLAPSED_STORAGE_KEY, collapsed)
  }, [collapsed])

  // Handle login and token storage
  const setUserInfo = useCallback(
    async (token) => {
      if (!token) {
        console.error('No token provided to setUserInfo')
        return
      }

      try {
        const cleanedToken =
          typeof token === 'string' ? token.replace(/^"|"$/g, '') : token

        console.log('Setting authentication data')
        setAuthData(cleanedToken)
        setIsLoggedIn(true)
        localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(cleanedToken))

        // Fetch user profile data
        console.log('Fetching user profile after login')
        const userData = await fetchUserProfile()

        if (!userData) {
          console.warn('Login succeeded but profile fetch failed')
        }
      } catch (error) {
        console.error('Error during login process:', error)
        logout() // Clean up on failure
      }
    },
    [fetchUserProfile, logout],
  )

  // Memoize context value to prevent unnecessary renders
  const contextValue = useMemo(
    () => ({
      userData,
      setUserData,
      setUserInfo,
      logout,
      isLoggedIn,
      setIsLoggedIn,
      authData,
      setAuthData,
      collapsed,
      setCollapsed,
      isLoading,
      refreshUserData: fetchUserProfile,
    }),
    [
      userData,
      setUserData,
      setUserInfo,
      logout,
      isLoggedIn,
      authData,
      collapsed,
      setCollapsed,
      isLoading,
      fetchUserProfile,
    ],
  )

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  )
}

export default UserContext
