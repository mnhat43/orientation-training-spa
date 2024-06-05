import CourseCard from "components/CourseCard"
import './index.scss'
import { useNavigate } from 'react-router-dom';

const Courses = () => {
    const navigate = useNavigate();

    const handleClickCard = () => {
        navigate('/course/1/modules');
    }

    return (
        <div className="courses">
            <div className="courses__item" onClick={() => handleClickCard()}>
                <CourseCard />
            </div>
        </div>
    )
}

export default Courses;