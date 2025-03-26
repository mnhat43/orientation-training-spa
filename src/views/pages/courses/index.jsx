import { useState, useEffect } from 'react';
import { Button, Row, Col, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import course from '@api/course';
import CourseCard from '@components/CourseCard';
import AddCourseForm from './components/AddCourseForm.jsx';
import './index.scss';
import { toast } from 'react-toastify';
import { convertFileToBase64 } from '@helpers/common.js';

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await course.getListCourse();
      if (response.status === 200) {
        setCourseList(response.data.data.courses);
      }
    } catch (error) {
      toast.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseID) => {
    try {
      const response = await course.deleteCourse({ course_id: courseID });
      if (response.status === 200) {
        fetchCourses();
        toast.success("Course deleted successfully");
      }
    } catch (error) {
      toast.error("Error deleting course:", error);
    }
  };

  const handleClickCard = (courseId) => {
    navigate(`/course/${courseId}/modules`);
  };

  const handleAddCourse = async (values) => {
    try {
      let base64String = "";
      const { title, description,thumbnail  } = values;
  
      if (thumbnail && thumbnail[0]?.originFileObj) {
        const file = thumbnail[0].originFileObj;
        base64String = await convertFileToBase64(file);
      }

      const payload = {
        title,
        description,
        thumbnail: base64String,
        created_by: 1,
      };
  
      const response = await course.addCourse(payload);
  
      if (response.status === 200) {
        toast.success("Course added successfully!");
        fetchCourses();
        setIsModalOpen(false);
      } else {
        toast.error("Error: " + response.data.message);
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };
  

  const handleEditCourse = async (courseID) => {
    console.log('Edit course:', courseID);
  };

  return (
    <div className="courses">
      <div className='courses__btn'>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ marginTop: '20px' }}
        >
          Add Course
        </Button>
      </div>
      <div className="courses__list">
        {loading ? (
          <Spin tip="Loading courses..." size="large" />
        ) : courseList.length > 0 ? (
          <Row gutter={[16, 16]}>
            {courseList.map(courseItem => (
              <Col key={courseItem.course_id}>
                <CourseCard
                  CourseID={courseItem.course_id}
                  Title={courseItem.course_title}
                  Thumbnail={courseItem.course_thumbnail}
                  Description={courseItem.course_description}
                  onDelete={handleDeleteCourse}
                  onEdit={handleEditCourse}
                  onClick={() => handleClickCard(courseItem.course_id)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No courses...</p>
        )}
      </div>
      {
        isModalOpen
        &&
        <AddCourseForm
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleAddCourse={handleAddCourse}
        />}
    </div>
  );
};

export default Courses;
