import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import lecture from '@api/lecture';
import userprogress from '@api/userprogress';

const useLectureData = (courseId, moduleId, moduleItemId) => {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState({});
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(false);

  const allLectures = useMemo(() => Object.values(lectures).flat(), [lectures]);

  // Find the latest unlocked lecture
  const latestUnlockedLecture = useMemo(() => {
    const unlockedLectures = allLectures.filter(
      (lecture) => lecture.unlocked === true,
    );
    if (!unlockedLectures.length) return null;

    return unlockedLectures.reduce((highest, current) => {
      // Compare module_id first
      const currentModuleId = parseInt(current.module_id);
      const highestModuleId = highest ? parseInt(highest.module_id) : -1;

      if (currentModuleId > highestModuleId) return current;
      if (currentModuleId < highestModuleId) return highest;

      // If module_id is the same, compare module_item_id
      return parseInt(current.module_item_id) > parseInt(highest.module_item_id)
        ? current
        : highest;
    }, null);
  }, [allLectures]);

  // Find the last lecture in the course
  const lastLecture = useMemo(() => {
    if (!Array.isArray(allLectures) || !allLectures.length) return null;

    // Find the lecture with highest module_id and highest module_item_id within that module
    return allLectures.reduce((highest, current) => {
      if (!highest) return current;

      // Compare module_id first
      const currentModuleId = parseInt(current.module_id);
      const highestModuleId = parseInt(highest.module_id);

      if (currentModuleId > highestModuleId) return current;
      if (currentModuleId < highestModuleId) return highest;

      // If module_id is the same, compare module_item_id
      return parseInt(current.module_item_id) > parseInt(highest.module_item_id)
        ? current
        : highest;
    }, null);
  }, [allLectures]);

  // Check if the selected lecture is the latest unlocked one
  const isLatestUnlocked = useMemo(() => {
    if (!selectedLecture || !latestUnlockedLecture) return false;

    return (
      parseInt(selectedLecture.module_id) ===
        parseInt(latestUnlockedLecture.module_id) &&
      parseInt(selectedLecture.module_item_id) ===
        parseInt(latestUnlockedLecture.module_item_id)
    );
  }, [selectedLecture, latestUnlockedLecture]);

  // Check if selected lecture is the last one
  const isLastLecture = useMemo(() => {
    if (!selectedLecture || !lastLecture) return false;

    return (
      parseInt(selectedLecture.module_id) === parseInt(lastLecture.module_id) &&
      parseInt(selectedLecture.module_item_id) === parseInt(lastLecture.module_item_id)
    );
  }, [selectedLecture, lastLecture]);

  // Find a lecture by moduleId and moduleItemId
  const findLectureById = useCallback(
    (moduleId, moduleItemId) => {
      if (!Array.isArray(allLectures) || !allLectures.length) return null;
      if (!moduleId || !moduleItemId) return allLectures[0];

      return (
        allLectures.find(
          (lecture) =>
            lecture.module_id === parseInt(moduleId) &&
            lecture.module_item_id === parseInt(moduleItemId),
        ) || null
      );
    },
    [allLectures],
  );

  // Navigate to a lecture and update selected lecture
  const chooseLecture = useCallback(
    (moduleId, moduleItemId) => {
      navigate(`/course/${courseId}/lectures/${moduleId}/${moduleItemId}`);

      const lecture = findLectureById(moduleId, moduleItemId);
      if (lecture) {
        setSelectedLecture(lecture);
      }
    },
    [navigate, courseId, findLectureById],
  );

  // Complete course function
  const completeCourse = useCallback(async () => {
    if (!courseId) return;

    try {
      const response = await userprogress.completeCourse({ course_id: parseInt(courseId) });
      if (response.status === 1) {
        setCourseCompleted(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to complete course:', error);
      return false;
    }
  }, [courseId]);

  // Fetch lectures data
  const fetchLectures = async () => {
    if (!courseId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await lecture.getListLecture({
        course_id: parseInt(courseId),
      });
      setLectures(response.data);
    } catch (error) {
      console.error('Failed to fetch lectures:', error.message);
      setError(error.message || 'Failed to fetch lectures');
    } finally {
      setLoading(false);
    }
  };

  // Handle progress updates
  const handleProgressUpdate = useCallback((updatedData) => {
    if (!updatedData || !updatedData.module_position || !updatedData.module_item_position) return;

    // Update lectures structure without refetching
    setLectures(prevLectures => {
      const newLectures = { ...prevLectures };

      // Find the lecture that needs to be unlocked
      Object.keys(newLectures).forEach(week => {
        const weekLectures = [...newLectures[week]];
        let updated = false;

        for (let i = 0; i < weekLectures.length; i++) {
          const lecture = weekLectures[i];

          // If this is the lecture we need to unlock (based on positions from updatedData)
          if (parseInt(lecture.module_position) === parseInt(updatedData.module_position) &&
              parseInt(lecture.module_item_position) === parseInt(updatedData.module_item_position)) {

            // Update the lecture's unlocked status
            weekLectures[i] = { ...lecture, unlocked: true };
            updated = true;
            break;
          }
        }

        if (updated) {
          newLectures[week] = weekLectures;
        }
      });

      return newLectures;
    });
  }, []);

  // Fetch lectures on component mount
  useEffect(() => {
    fetchLectures();
  }, []);

  // Set selected lecture based on URL params
  useEffect(() => {
    if (loading || !allLectures.length) return;

    // Try to select lecture based on URL params
    const lecture = findLectureById(moduleId, moduleItemId);

    if (lecture) {
      setSelectedLecture(lecture);
    }
    // If lecture not found but lectures are available, redirect to first lecture
    else if (allLectures.length > 0) {
      const firstLecture = allLectures[0];
      setSelectedLecture(firstLecture);

      // Replace current URL with the first lecture URL to maintain history
      navigate(
        `/course/${courseId}/lectures/${firstLecture.module_id}/${firstLecture.module_item_id}`,
        { replace: true },
      );
    }
  }, [moduleId, moduleItemId, findLectureById, allLectures, courseId, navigate, loading]);

  // Check if course is already completed when loading
  useEffect(() => {
    if (!loading && allLectures.length > 0) {
      // Here you would check from API if the course is already completed
      // For now, we'll assume it's not completed yet
    }
  }, [loading, allLectures]);

  return {
    lectures,
    selectedLecture,
    loading,
    error,
    allLectures,
    isLatestUnlocked,
    isLastLecture,
    courseCompleted,
    setCourseCompleted,
    chooseLecture,
    handleProgressUpdate,
    completeCourse
  };
};

export default useLectureData;
