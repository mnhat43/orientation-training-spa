import { Routes, Route } from 'react-router-dom'
import MainLayout from '@components/layouts/MainLayout'
import Dashboard from '@views/pages/dashboard';
import Courses from '@views/pages/courses';
import Modules from '@views/pages/modulesCourse';
import Lectures from '@views/pages/lectures';
import Assignments from '@views/pages/assignments';
import AssessmentCreation from '@views/pages/assessmentCreate/AssessmentCreation';
import Exams from '@views/pages/exams';
import Login from '@views/pages/login'

import ManageAccount from '@views/pages/admin/account';
import ManageEvaluation from '@views/pages/admin/evaluation';


function AllRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />



      <Route path="/dashboard" element={<MainLayout component={Dashboard} />} />
      <Route path="/manage-account" element={<MainLayout component={ManageAccount} />} />
      <Route path="/manage-evaluation" element={<MainLayout component={ManageEvaluation} />} />

      <Route path="/courses" element={<MainLayout component={Courses} />} />
      <Route path="/course/:courseId/modules" element={<MainLayout component={Modules} />} />

      <Route path="/course/:courseId/lectures" element={<MainLayout component={Lectures} />} />
      <Route path="/course/:courseId/lectures/:lectureId" element={<MainLayout component={Lectures} />} />

      <Route
        path="/course/:courseId/assignments/create"
        element={
          <MainLayout
            component={
              () => <AssessmentCreation assessmentType="Assignment" />
            } />
        }
      />
      <Route path="/course/:courseId/assignments" element={<MainLayout component={Assignments} />} />

      <Route
        path="/course/:courseId/exams/create"
        element={
          <MainLayout
            component={
              () => <AssessmentCreation assessmentType="Exam" />
            } />
        }
      />
      <Route path="/course/:courseId/exams" element={<MainLayout component={Exams} />} />

      <Route path="*" >404</Route>
    </Routes>
  )
}

export default AllRoutes
