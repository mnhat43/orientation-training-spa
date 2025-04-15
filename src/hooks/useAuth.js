import { useContext } from 'react'
import UserContext from '@context/UserContext'

/**
 * Hook to access authentication context
 * @returns {Object} Authentication context with user data and auth methods
 */
const useAuth = () => {
  const context = useContext(UserContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within a UserProvider')
  }
  
  return context
}

export default useAuth
