import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './index.scss'
import CourseItem from './CourseItem'
import EmptyCourseState from './EmptyCourseState'
import RenderIf from '@components/renderif/RenderIf'

const reorder = (list, startIndex, endIndex) => {
  const result = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

const parseDuration = (() => {
  const cache = new Map()

  return (durationString) => {
    if (!durationString) return 0

    if (cache.has(durationString)) {
      return cache.get(durationString)
    }

    const match = durationString.match(/(\d+)/)
    const result = match ? parseInt(match[1], 10) : 0

    cache.set(durationString, result)
    return result
  }
})()

const StrictModeDroppable = React.memo(({ children, ...props }) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setEnabled(true), 0)
    return () => clearTimeout(timeout)
  }, [])

  if (!enabled) {
    return (
      <div
        ref={(el) =>
          el && el.setAttribute('data-droppable-placeholder', 'true')
        }
      ></div>
    )
  }

  return <Droppable {...props}>{children}</Droppable>
})

const DraggableCourseItem = React.memo(
  ({ course, index, expandedItems, toggleExpand, handleRemoveCourse }) => {
    const itemId = String(course.id || `temp-id-${index}`)

    return (
      <Draggable key={itemId} draggableId={itemId} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`draggable-wrapper ${snapshot.isDragging ? 'is-dragging' : ''}`}
          >
            <CourseItem
              course={course}
              index={index}
              isDragging={snapshot.isDragging}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              onRemove={handleRemoveCourse}
              dragHandleProps={provided.dragHandleProps}
              courseCount={1}
            />
          </div>
        )}
      </Draggable>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.course.id === nextProps.course.id &&
      prevProps.index === nextProps.index &&
      prevProps.isDragging === nextProps.isDragging &&
      prevProps.expandedItems.includes(prevProps.course.id) ===
        nextProps.expandedItems.includes(nextProps.course.id)
    )
  },
)

const DragComponent = ({ selectedCourses = [], setSelectedCourses }) => {
  const isMounted = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [expandedItems, setExpandedItems] = useState([])

  const droppableId = useRef('droppable').current

  const prevCoursesRef = useRef([])

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      document.body.classList.remove('dragging-active')
    }
  }, [])

  const toggleExpand = useCallback((id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }, [])

  const handleRemoveCourse = useCallback(
    (id) => {
      setSelectedCourses((prev) => prev.filter((c) => c.id !== id))
    },
    [setSelectedCourses],
  )

  const onDragStart = useCallback(() => {
    if (!isMounted.current) return
    setIsDragging(true)
    document.body.classList.add('dragging-active')
  }, [])

  const onDragEnd = useCallback(
    (result) => {
      if (!isMounted.current) return
      setIsDragging(false)
      document.body.classList.remove('dragging-active')

      if (
        !result?.destination ||
        result.source.index === result.destination.index
      ) {
        return
      }

      try {
        const reordered = reorder(
          selectedCourses,
          result.source.index,
          result.destination.index,
        )

        requestAnimationFrame(() => {
          setSelectedCourses(
            reordered.map((item, idx) => ({ ...item, order: idx })),
          )
        })
      } catch (err) {
        console.error('Error handling drag end:', err)
      }
    },
    [selectedCourses, setSelectedCourses],
  )

  const hasCourses = useMemo(
    () => Array.isArray(selectedCourses) && selectedCourses.length > 0,
    [selectedCourses],
  )

  const courseCount = useMemo(
    () => selectedCourses.length,
    [selectedCourses.length],
  )

  return (
    <div
      className={`course-draggable-container ${isDragging ? 'dragging-active-container' : ''}`}
      aria-label="Course list"
    >
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId={droppableId}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`courses-list ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
              data-testid="droppable-container"
            >
              {!hasCourses ? (
                <EmptyCourseState />
              ) : (
                selectedCourses.map((course, index) => {
                  return (
                    <DraggableCourseItem
                      key={String(course.id || `temp-id-${index}`)}
                      course={{ ...course, courseCount }}
                      index={index}
                      expandedItems={expandedItems}
                      toggleExpand={toggleExpand}
                      handleRemoveCourse={handleRemoveCourse}
                    />
                  )
                })
              )}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>
    </div>
  )
}

export default React.memo(DragComponent)
