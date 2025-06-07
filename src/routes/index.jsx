import { Routes, Route } from 'react-router-dom'
import MainLayout from '@components/layouts/MainLayout'
import Dashboard from '@views/dashboard'
import Courses from '@views/courses'
import Modules from '@views/modulesCourse'
import Lectures from '@views/lectures'
import LoginPage from '@views/login'
import LandingPage from '@views/landing'
import ManageEmployees from '@views/manage-employee'
import TemplatePage from '@views/template'
import TraineePathCreator from '@views/trainee-path'
import TemplateFormPage from '@views/template-form'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import { ROLES } from '@constants'
// import MyLearningPath from '@views/learning-path'

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
        {/* <Route
          path="/my-learning-path"
          element={<MainLayout component={MyLearningPath} />}
        /> */}
      </Route>

      <Route path="*" element={<div>404</div>} />
    </Routes>
  )
}

export default AllRoutes
