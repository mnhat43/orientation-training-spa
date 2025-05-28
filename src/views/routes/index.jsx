import { Routes, Route } from 'react-router-dom'
import MainLayout from '@components/layouts/MainLayout'
import Dashboard from '@views/pages/dashboard'
import Courses from '@views/pages/courses'
import Modules from '@views/pages/modulesCourse'
import Lectures from '@views/pages/lectures'
import Assignments from '@views/pages/assignments'
import AssessmentCreation from '@views/pages/assessmentCreate/AssessmentCreation'
import Exams from '@views/pages/exams'
import LoginPage from '@views/pages/login'
import LandingPage from '@views/pages/landing'
import ManageEmployees from '@views/pages/manage-employee'
import TemplatePage from '@views/pages/template'
import TraineePathCreator from '@views/pages/trainee-path'
import TemplateFormPage from '@views/pages/template-form'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import { ROLES } from '@constants/roles'
import MyLearningPath from '@views/pages/learning-path'

function AllRoutes() {
  return (
    <Routes>
      {/* Public routes - accessible only when not logged in */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Routes accessible by all authenticated users */}
      <Route
        element={
          <ProtectedRoute
            allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]}
          />
        }
      >
        <Route
          path="/dashboard"
          element={<MainLayout component={Dashboard} />}
        />
        <Route path="/courses" element={<MainLayout component={Courses} />} />
        <Route
          path="/course/:courseId/modules"
          element={<MainLayout component={Modules} />}
        />
        <Route
          path="/course/:courseId/lectures"
          element={<MainLayout component={Lectures} />}
        />
        <Route
          path="/course/:courseId/lectures/:moduleId/:moduleItemId"
          element={<MainLayout component={Lectures} />}
        />
      </Route>

      {/* Routes accessible only by Admin and Manager */}
      <Route
        element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]} />}
      ></Route>

      {/* Routes accessible only by MANAGER */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
        <Route
          path="/manage-employee/*"
          element={<MainLayout component={ManageEmployees} />}
        />
        <Route
          path="/templates"
          element={<MainLayout component={TemplatePage} />}
        />
        <Route
          path="/templates/new"
          element={<MainLayout component={TemplateFormPage} />}
        />
        <Route
          path="/templates/:id/edit"
          element={<MainLayout component={TemplateFormPage} />}
        />
        <Route
          path="/learning-paths/create"
          element={<MainLayout component={TraineePathCreator} />}
        />
      </Route>

      {/* Routes accessible only by EMPLOYEE */}
      <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
        <Route
          path="/my-learning-path"
          element={<MainLayout component={MyLearningPath} />}
        />
      </Route>

      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}

export default AllRoutes
