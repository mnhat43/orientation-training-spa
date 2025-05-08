import { useEffect, useState } from 'react'
import { Droppable } from 'react-beautiful-dnd'

/**
 * Wrapper component for react-beautiful-dnd's Droppable to make it compatible with React StrictMode
 */
const StrictModeDroppable = ({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // This workaround is needed to fix issues with react-beautiful-dnd in React 18's StrictMode
    const animation = requestAnimationFrame(() => setEnabled(true))

    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) {
    return null
  }

  return <Droppable {...props}>{children}</Droppable>
}

export default StrictModeDroppable
