import React, { useEffect, useState, memo } from 'react'
import { Droppable } from 'react-beautiful-dnd'

const StrictModeDroppable = ({
  children,
  droppableId,
  type = 'DEFAULT',
  direction = 'vertical',
  isDropDisabled = false,
  isCombineEnabled = false,
  ignoreContainerClipping = false,
  ...otherProps
}) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true))
    return () => {
      cancelAnimationFrame(animation)
      setEnabled(false)
    }
  }, [])

  if (!enabled) return null

  return (
    <Droppable
      droppableId={droppableId}
      type={type}
      direction={direction}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      ignoreContainerClipping={ignoreContainerClipping}
      {...otherProps}
    >
      {children}
    </Droppable>
  )
}

export default StrictModeDroppable
